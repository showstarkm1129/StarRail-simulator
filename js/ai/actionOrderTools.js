// actionOrderTools.js — 行動順シミュ専用の AI ツール群
//
// 扱う範囲:
//   速度・行動値・行動回数のみ。ダメージ計算は一切行わない (限界効用タブ側の責務)。
//   保存ビルドからは「速度」だけを読み取り、火力系の値には触れない。
//
// 状態変更は「変更案を作る → 利用者が画面で承認 → 適用」の三段階。
// AI が勝手にパネルを書き換えることはない。

import { Registry } from '../build/registry.js';
import { STAT } from '../build/statKeys.js';
import { StatComputer } from '../build/statComputer.js';
import { estimateUltimateCycle } from '../build/ultimateCycle.js';
import {
    EVENT_TYPES,
    EVENT_TYPE_KEYS,
    EVENT_TIMINGS,
    PANEL_DEFAULTS,
    normalizePanel,
    computeTimeline,
    computeAllTimelines,
    summarizeTimeline,
    evLabel,
} from '../build/actionOrder.js';
import {
    ACTION_EFFECT_KINDS,
    ACTION_EFFECT_ORIGINS,
    searchActionEffects,
    toPanelEvent,
} from '../build/actionEffects.js';
import {
    MAX_PANELS,
    validateActionOrderChanges,
    serializeActionOrderState,
} from '../build/actionOrderSession.js';
import { validateToolSchema } from './toolSchema.js';

// ---- スキーマ部品 -------------------------------------------------------

// AI へ提示する発動タイミングは、計算エンジンが実際に解釈できるものだけに絞る。
// (EVENT_TIMINGS に未実装の値が混ざったまま出すと、AI の指定が黙って turn へ丸められてしまう)
const SUPPORTED_TIMINGS = Object.freeze(EVENT_TIMINGS.filter(timing => ['turn', 'cum', 'panel'].includes(timing)));

const EVENT_SCHEMA = Object.freeze({
    type: 'object',
    properties: {
        type: { type: 'string', enum: EVENT_TYPE_KEYS, description: 'advance=行動値短縮(%) / speedFlat=速度実数加算 / speedPct=基礎速度に対する%加算' },
        value: { type: 'number', description: 'advance と speedPct は % (25 なら 25%)。speedFlat は実数。行動順遅延は advance の負値で表す。' },
        name: { type: 'string', description: '表示名。効果名を入れると画面で追いやすい。' },
        timing: {
            type: 'string',
            enum: SUPPORTED_TIMINGS,
            description: 'turn=そのターン開始からの経過AVで発動 / cum=戦闘開始からの累計AVで発動 / panel=他パネルが指定ターンを終えた時点で発動（味方のバフを受ける側に入れる）',
        },
        offset: { type: 'number', minimum: 0, description: 'timing=turn のとき、ターン開始から何AV後に発動するか。0 ならターン開始時。' },
        atAV: { type: 'number', minimum: 0, description: 'timing=cum のとき、累計何AV時点で発動するか。' },
        refPanel: { type: 'integer', minimum: 0, description: 'timing=panel のとき、発動の基準にする相手パネル番号 (0始まり)。' },
        refTurn: { type: 'integer', minimum: 1, description: 'timing=panel のとき、相手パネルの何ターン目の終了時点を基準にするか。' },
    },
    required: ['type', 'value'],
    additionalProperties: false,
});

const TURN_SCHEMA = Object.freeze({
    type: 'object',
    properties: {
        events: { type: 'array', items: EVENT_SCHEMA },
    },
    additionalProperties: false,
});

const PANEL_SCHEMA = Object.freeze({
    type: 'object',
    properties: {
        name: { type: 'string', description: 'パネル名。キャラ名を入れる。' },
        baseSpeed: { type: 'number', minimum: 1, description: '基礎速度。速度%バフの参照元になる値 (装備・軌跡込みの素の速度)。' },
        preSpeed: { type: 'number', minimum: 1, description: '行動開始前の実速度。常時かかっているバフを足した値。' },
        threshold: { type: 'number', minimum: 1, description: '目標累計AV。ここまでに何回行動できるかを見る。' },
        turns: { type: 'array', items: TURN_SCHEMA, description: 'ターンごとの効果。配列の index がターン番号-1。' },
    },
    additionalProperties: false,
});

const PANEL_PATCH_SCHEMA = Object.freeze({
    type: 'object',
    properties: {
        index: { type: 'integer', minimum: 0, description: '更新するパネル番号 (0始まり)。' },
        name: { type: 'string' },
        baseSpeed: { type: 'number', minimum: 1 },
        preSpeed: { type: 'number', minimum: 1 },
        threshold: { type: 'number', minimum: 1 },
        turns: { type: 'array', items: TURN_SCHEMA },
    },
    required: ['index'],
    additionalProperties: false,
});

const CHANGE_SCHEMA = Object.freeze({
    type: 'object',
    properties: {
        panels: { type: 'array', items: PANEL_SCHEMA, description: '全パネルを置き換える場合。' },
        patches: { type: 'array', items: PANEL_PATCH_SCHEMA, description: '既存パネルの一部だけ変える場合。' },
    },
    additionalProperties: false,
});

const ULTIMATE_MEMBER_SCHEMA = Object.freeze({
    type: 'object',
    properties: {
        id: { type: 'string', description: 'この計算内でのメンバーID。省略時はキャラIDを使う。' },
        character: { type: 'string', description: 'キャラIDまたは名前。build 指定時は省略できる。' },
        build: { type: 'string', description: '保存ビルドIDまたは名前。速度・EP回復効率・凸数を使う。' },
        speed: { type: 'number', minimum: 1, description: '保存ビルドを使わない場合の実速度。省略時は基礎速度。' },
        energyRegen: { type: 'number', minimum: 0.01, description: '保存ビルドを使わない場合のEP回復効率。1=100%。' },
        eidolon: { type: 'integer', minimum: 0, maximum: 6 },
        rotation: {
            type: 'array', items: { type: 'string', enum: ['basic', 'skill', 'enhancedBasic'] },
            description: '各ターンの行動順。省略時はEP獲得量が最大の行動を毎ターン選び、最短値を出す。',
        },
        energyTargetIds: {
            type: 'array', items: { type: 'string' },
            description: '単体EP供給を渡す相手のメンバーID。停雲などに指定する。',
        },
    },
    additionalProperties: false,
});

export const ACTION_ORDER_TOOL_DEFINITIONS = Object.freeze([
    {
        name: 'get_action_order_context',
        description: '行動順タブの現在のパネル構成と、各パネルのタイムライン要約 (ターンごとの実行動値・累計AV・閾値までの行動回数) を取得する。まずこれを呼んで現状を把握する。',
        inputSchema: {
            type: 'object',
            properties: {
                detail: { type: 'string', enum: ['summary', 'full'], description: 'summary=パネル設定と行動回数のみ。full=各ターンの明細も含む。' },
            },
            additionalProperties: false,
        },
    },
    {
        name: 'search_speed_data',
        description: 'キャラ・光円錐・遺物セット・オーナメントを名前またはIDで検索し、速度に関する情報 (基礎速度、軌跡の速度加算) と運命を返す。光円錐を提案する前は、キャラと光円錐の path が同じか必ず確認する。火力の情報は返さない。複数の名前は queries にまとめて一度で検索する。',
        inputSchema: {
            type: 'object',
            properties: {
                queries: { type: 'array', items: { type: 'string' }, description: '検索する名前またはIDの一覧。' },
                category: { type: 'string', enum: ['all', 'character', 'lightcone', 'relic', 'ornament'] },
                limit: { type: 'integer', minimum: 1, maximum: 50 },
            },
            required: ['queries'],
            additionalProperties: false,
        },
    },
    {
        name: 'list_equippable_lightcones',
        description: '指定キャラと同じ運命で、装備できる光円錐を返す。scope=configured は保存ビルドの装備中または候補に登録済みの光円錐だけ、scope=all はデータ登録済みの全候補。装備提案には必ずこのツールを使い、結果外の光円錐は提案しない。',
        inputSchema: {
            type: 'object',
            properties: {
                character: { type: 'string', description: 'キャラIDまたは名前。' },
                build: { type: 'string', description: '保存ビルドIDまたは名前。指定時はそのビルドの装備中・候補を所持候補として使う。' },
                scope: { type: 'string', enum: ['configured', 'all'], description: 'configured=登録済み候補のみ（既定） / all=全登録候補。' },
            },
            required: ['character'],
            additionalProperties: false,
        },
    },
    {
        name: 'list_action_order_quick_presets',
        description: '利用者が行動順シミュのクイック追加に登録した効果とメモを返す。メモは利用者が明示した前提として扱い、計算へ反映する場合は該当する効果を panels の turns[].events に入れて run_action_order_simulation で検算する。',
        inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    },
    {
        name: 'validate_lightcone_assignment',
        description: 'キャラへ光円錐を装備できるかを厳密に検証する。運命が不一致ならエラーを返す。光円錐の効果を行動順計算へ入れる、または装備可能と回答する前に必ず呼ぶこと。',
        inputSchema: {
            type: 'object',
            properties: {
                character: { type: 'string', description: 'キャラIDまたは名前。' },
                lightcone: { type: 'string', description: '光円錐IDまたは名前。' },
            },
            required: ['character', 'lightcone'],
            additionalProperties: false,
        },
    },
    {
        name: 'estimate_ultimate_cycle',
        description: 'キャラ性能、実速度、EP回復効率、編成メンバーの登録済みEP供給を使い、焦点キャラが最短で何自身ターンごとに必殺技を使えるかを時系列で計算する。敵被弾・撃破・秘技・確率効果・未登録の固有EP回復は含めない。単体EP供給は供給者の energyTargetIds に焦点IDを必ず指定する。',
        inputSchema: {
            type: 'object',
            properties: {
                focus: ULTIMATE_MEMBER_SCHEMA,
                party: { type: 'array', maxItems: 3, items: ULTIMATE_MEMBER_SCHEMA },
            },
            required: ['focus'],
            additionalProperties: false,
        },
    },
    {
        name: 'search_action_effects',
        description: '行動順に影響する効果 (行動値短縮・行動順遅延・速度バフ) をデータから検索する。返り値の origin が数値の信頼度を示す: stats=ステータス定義から取得で正確、skillLevels=軌跡Lv別の正確な表、hook=戦闘処理の定数、description=説明文からの抽出。description のものは対象 (自分/味方/敵) と発動条件を sentence で必ず確認し、回答でも出典を明示すること。値が null のものは軌跡レベルまたは重畳を指定しないと確定しない。',
        inputSchema: {
            type: 'object',
            properties: {
                queries: { type: 'array', items: { type: 'string' }, description: 'キャラ名・光円錐名・セット名など。空なら全件から絞り込む。' },
                kinds: { type: 'array', items: { type: 'string', enum: Object.values(ACTION_EFFECT_KINDS) } },
                origins: { type: 'array', items: { type: 'string', enum: ACTION_EFFECT_ORIGINS } },
                superimpose: { type: 'integer', minimum: 1, maximum: 5, description: '光円錐の重畳段階 (既定 1)。' },
                limit: { type: 'integer', minimum: 1, maximum: 80 },
            },
            additionalProperties: false,
        },
    },
    {
        name: 'list_saved_builds',
        description: '利用者が保存しているビルドの一覧 (ID・名前・キャラ) を返す。速度を読み込む前にこれで対象を特定する。',
        inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    },
    {
        name: 'read_build_speed',
        description: '保存ビルドから速度だけを読み取る。装備・軌跡込みの最終速度と、その内訳 (基礎速度・速度%・速度実数) を返す。火力の値は返さない。ここで得た速度をパネルの baseSpeed に使う。',
        inputSchema: {
            type: 'object',
            properties: {
                build: { type: 'string', description: '保存ビルドのIDまたは名前。' },
            },
            required: ['build'],
            additionalProperties: false,
        },
    },
    {
        name: 'run_action_order_simulation',
        description: 'パネル定義を渡して行動順を計算する。返り値は各ターンの実消費AV・累計AV・適用速度・効果の発動有無と、目標累計AVまでの行動回数。画面の状態は変更しない。複数案の比較はパネルを複数渡して一度で行う。',
        inputSchema: {
            type: 'object',
            properties: {
                panels: { type: 'array', items: PANEL_SCHEMA, description: '計算するパネル。省略すると現在の画面状態を計算する。' },
                detail: { type: 'string', enum: ['summary', 'full'], description: 'summary=行動回数と各ターンの要点。full=効果の発動有無まで含む。' },
            },
            additionalProperties: false,
        },
    },
    {
        name: 'propose_action_order_changes',
        description: '画面へ反映する未承認の変更案を作る。状態はまだ変わらない。利用者が画面で承認して初めて適用される。変更内容は必ず run_action_order_simulation で検算してから提案すること。',
        inputSchema: {
            type: 'object',
            properties: {
                changes: CHANGE_SCHEMA,
                summary: { type: 'string', description: '何をどう変えるかの一行説明。' },
            },
            required: ['changes'],
            additionalProperties: false,
        },
    },
    {
        name: 'apply_action_order_changes',
        description: '利用者が画面で承認した変更案だけを適用する。approved=true と既存の proposalId が必要。適用前の状態は自動保存され、取り消せる。',
        inputSchema: {
            type: 'object',
            properties: {
                proposalId: { type: 'string' },
                approved: { type: 'boolean' },
            },
            required: ['proposalId', 'approved'],
            additionalProperties: false,
        },
    },
]);

const TOOL_DEFINITIONS_BY_NAME = new Map(
    ACTION_ORDER_TOOL_DEFINITIONS.map(definition => [definition.name, definition]),
);

export function asOpenAiTools(definitions = ACTION_ORDER_TOOL_DEFINITIONS) {
    return definitions.map(definition => ({
        type: 'function',
        name: definition.name,
        description: definition.description,
        parameters: definition.inputSchema,
        strict: false,
    }));
}

// ---- 補助 ---------------------------------------------------------------

function normalizeText(value) {
    return String(value || '').normalize('NFKC').toLocaleLowerCase('ja');
}

function round(value, digits = 2) {
    return Number.isFinite(value) ? Number(value.toFixed(digits)) : null;
}

function visibleCharacters() {
    return Registry.character.list().filter(character => !character.isTestAllEquipment && character.id !== 'template');
}

/** 検索対象カテゴリごとの Registry 一覧 */
function registryList(category) {
    switch (category) {
        case 'character': return [['character', visibleCharacters()]];
        case 'lightcone': return [['lightcone', Registry.lightcone.list()]];
        case 'relic': return [['relic', Registry.relicSet.list()]];
        case 'ornament': return [['ornament', Registry.ornament.list()]];
        default: return [
            ['character', visibleCharacters()],
            ['lightcone', Registry.lightcone.list()],
            ['relic', Registry.relicSet.list()],
            ['ornament', Registry.ornament.list()],
        ];
    }
}

/** 検索結果1件分。速度に関わる値だけを添える。 */
function speedFacts(category, item) {
    const facts = item.path ? { path: item.path } : {};
    if (category === 'character') {
        if (Number.isFinite(item.base?.spd)) facts.baseSpeed = item.base.spd;
        const traceSpd = item.traces?.stats?.[STAT.SPD_FLAT];
        if (Number.isFinite(traceSpd)) facts.traceSpeedFlat = traceSpd;
        const tracePct = item.traces?.stats?.[STAT.SPD_PERCENT];
        if (Number.isFinite(tracePct)) facts.traceSpeedPercent = tracePct * 100;
    }
    return facts;
}

function resolveCharacter(reference) {
    const needle = normalizeText(reference);
    const matches = visibleCharacters().filter(character => (
        [character.id, character.name, ...(character.aliases || [])].some(value => normalizeText(value) === needle)
    ));
    if (matches.length === 1) return { value: matches[0] };
    return {
        error: {
            code: matches.length ? 'AMBIGUOUS_CHARACTER' : 'UNKNOWN_CHARACTER',
            message: matches.length ? 'キャラ候補が複数あります。IDで指定してください。' : 'キャラが見つかりません。',
            candidates: matches.map(character => ({ id: character.id, name: character.name, path: character.path })),
        },
    };
}

function configuredLightcones(character, builds, selectedBuild = null) {
    // build 未指定時は、全保存ビルドの装備中・候補を「登録済み所持候補」として集約する。
    // 特定ビルドを指定した場合だけ、そのビルドに絞って比較条件を再現する。
    const scopedBuilds = selectedBuild ? [selectedBuild] : builds;
    const rows = new Map();
    for (const build of scopedBuilds) {
        const candidates = [build.lightcone, ...(build.candidates?.lightcone || [])];
        for (const candidate of candidates) {
            if (!candidate?.id) continue;
            const lightcone = Registry.lightcone.get(candidate.id);
            if (!lightcone || lightcone.path !== character.path) continue;
            const superimpose = Math.max(1, Math.min(5, Number(candidate.superimpose) || 1));
            const key = `${lightcone.id}:${superimpose}`;
            const existing = rows.get(key);
            rows.set(key, {
                id: lightcone.id,
                name: lightcone.name,
                path: lightcone.path,
                rarity: lightcone.rarity,
                superimpose,
                sources: [...new Set([...(existing?.sources || []), build.name || build.id])],
            });
        }
    }
    return [...rows.values()];
}

function equippableLightcones({ character: reference, build: buildReference, scope = 'configured' }, builds) {
    const resolvedCharacter = resolveCharacter(reference);
    if (resolvedCharacter.error) return { ok: false, error: resolvedCharacter.error };
    let selectedBuild = null;
    if (buildReference) {
        const resolvedBuild = resolveBuild(builds, buildReference);
        if (resolvedBuild.error) return { ok: false, error: resolvedBuild.error };
        selectedBuild = resolvedBuild.value;
        if (selectedBuild.characterId !== resolvedCharacter.value.id) {
            return { ok: false, error: { code: 'BUILD_CHARACTER_MISMATCH', message: '指定ビルドのキャラが一致しません。' } };
        }
    }
    const character = resolvedCharacter.value;
    const lightcones = scope === 'all'
        ? Registry.lightcone.list()
            .filter(lightcone => lightcone.path === character.path)
            .map(lightcone => ({ id: lightcone.id, name: lightcone.name, path: lightcone.path, rarity: lightcone.rarity }))
        : configuredLightcones(character, builds, selectedBuild);
    return {
        ok: true,
        character: { id: character.id, name: character.name, path: character.path },
        scope,
        total: lightcones.length,
        lightcones,
        ...(scope === 'configured' && !lightcones.length ? {
            note: 'このキャラ用に保存ビルドへ登録された装備中・候補光円錐はありません。全候補を確認する場合は scope=all を指定してください。',
        } : {}),
    };
}

function resolveLightcone(reference) {
    const needle = normalizeText(reference);
    const matches = Registry.lightcone.list().filter(lightcone => (
        [lightcone.id, lightcone.name, ...(lightcone.aliases || [])].some(value => normalizeText(value) === needle)
    ));
    if (matches.length === 1) return { value: matches[0] };
    return {
        error: {
            code: matches.length ? 'AMBIGUOUS_LIGHTCONE' : 'UNKNOWN_LIGHTCONE',
            message: matches.length ? '光円錐候補が複数あります。IDで指定してください。' : '光円錐が見つかりません。',
            candidates: matches.map(lightcone => ({ id: lightcone.id, name: lightcone.name, path: lightcone.path })),
        },
    };
}

function validateLightconeAssignment({ character: characterReference, lightcone: lightconeReference }) {
    const character = resolveCharacter(characterReference);
    if (character.error) return { ok: false, error: character.error };
    const lightcone = resolveLightcone(lightconeReference);
    if (lightcone.error) return { ok: false, error: lightcone.error };
    if (character.value.path !== lightcone.value.path) {
        return {
            ok: false,
            error: {
                code: 'LIGHTCONE_PATH_MISMATCH',
                message: `${character.value.name}は${character.value.path}、${lightcone.value.name}は${lightcone.value.path}のため装備できません。`,
                character: { id: character.value.id, name: character.value.name, path: character.value.path },
                lightcone: { id: lightcone.value.id, name: lightcone.value.name, path: lightcone.value.path },
            },
        };
    }
    return {
        ok: true,
        character: { id: character.value.id, name: character.value.name, path: character.value.path },
        lightcone: { id: lightcone.value.id, name: lightcone.value.name, path: lightcone.value.path },
    };
}

function sourcePathForActionEffect(row) {
    if (row.sourceType === 'lightcone') return Registry.lightcone.get(row.sourceId)?.path || null;
    if (row.sourceType === 'character') return Registry.character.get(row.sourceId)?.path || null;
    return null;
}

function ultimateMember(raw, index, builds) {
    let build = null;
    if (raw.build) {
        const resolved = resolveBuild(builds, raw.build);
        if (resolved.error) return { error: resolved.error };
        build = resolved.value;
    }
    const characterReference = raw.character || build?.characterId;
    if (!characterReference) return { error: { code: 'MISSING_CHARACTER', message: 'character または build が必要です。' } };
    const resolvedCharacter = resolveCharacter(characterReference);
    if (resolvedCharacter.error) return { error: resolvedCharacter.error };
    const character = resolvedCharacter.value;
    if (build && build.characterId !== character.id) {
        return { error: { code: 'BUILD_CHARACTER_MISMATCH', message: '保存ビルドとcharacterが一致しません。' } };
    }
    let stats = null;
    try { if (build) stats = StatComputer.compute(build); }
    catch (error) { return { error: { code: 'BUILD_COMPUTE_FAILED', message: error.message } }; }
    return {
        value: {
            id: raw.id || character.id || `member_${index}`,
            character,
            speed: raw.speed ?? stats?.derived?.spd ?? character.base?.spd,
            energyRegen: raw.energyRegen ?? stats?.derived?.energyRegenPct ?? 1,
            eidolon: raw.eidolon ?? build?.eidolon ?? 0,
            rotation: raw.rotation,
            energyTargetIds: raw.energyTargetIds,
        },
    };
}

function ultimateCycle(args, builds) {
    const rawMembers = [args.focus, ...(args.party || [])];
    if (rawMembers.length > 4) return { ok: false, error: { code: 'TOO_MANY_PARTY_MEMBERS', message: '焦点を含めた編成は4人までです。' } };
    const members = [];
    for (const [index, raw] of rawMembers.entries()) {
        const resolved = ultimateMember(raw, index, builds);
        if (resolved.error) return { ok: false, error: resolved.error };
        members.push(resolved.value);
    }
    try {
        return { ok: true, ...estimateUltimateCycle({ focusId: members[0].id, members }) };
    } catch (error) {
        return { ok: false, error: { code: 'ULTIMATE_CYCLE_FAILED', message: error.message } };
    }
}

function searchSpeedData({ queries = [], category = 'all', limit = 20 }) {
    const needles = [...new Set(queries.map(value => String(value || '').trim()).filter(Boolean))]
        .map(normalizeText);
    if (!needles.length) {
        return { ok: false, error: { code: 'EMPTY_QUERY', message: '検索する名前を1つ以上指定してください。' } };
    }
    const results = [];
    for (const [name, list] of registryList(category)) {
        for (const item of list) {
            const haystack = normalizeText([item.id, item.name, ...(item.aliases || [])].join(' '));
            if (!needles.some(needle => haystack.includes(needle))) continue;
            results.push({
                category: name,
                id: item.id,
                name: item.name,
                aliases: item.aliases || [],
                ...speedFacts(name, item),
            });
            if (results.length >= limit) break;
        }
        if (results.length >= limit) break;
    }
    return { ok: true, total: results.length, results };
}

/** 保存ビルドを ID または名前で特定する */
function resolveBuild(savedBuilds, reference) {
    const needle = normalizeText(reference);
    const exact = savedBuilds.filter(build => normalizeText(build.id) === needle || normalizeText(build.name) === needle);
    if (exact.length === 1) return { value: exact[0] };
    const partial = savedBuilds.filter(build => normalizeText(build.name).includes(needle));
    if (partial.length === 1) return { value: partial[0] };
    const candidates = (exact.length ? exact : partial).map(build => ({ id: build.id, name: build.name }));
    return {
        error: {
            ok: false,
            error: {
                code: candidates.length ? 'AMBIGUOUS_BUILD' : 'UNKNOWN_BUILD',
                message: candidates.length ? '候補が複数あります。IDで指定してください。' : '保存ビルドが見つかりません。',
                candidates,
                available: savedBuilds.map(build => ({ id: build.id, name: build.name, characterId: build.characterId })),
            },
        },
    };
}

/** ビルドから速度だけを取り出す */
function buildSpeed(build) {
    const stats = StatComputer.compute(build);
    const raw = stats.raw;
    const character = Registry.character.get(build.characterId);
    return {
        buildId: build.id,
        buildName: build.name,
        characterId: build.characterId,
        characterName: character?.name || build.characterId,
        speed: round(stats.derived.spd, 3),
        speedAV: round(stats.derived.speedAV, 3),
        breakdown: {
            base: round(raw[STAT.SPD_BASE], 3),
            percent: round((raw[STAT.SPD_PERCENT] || 0) * 100, 3),
            flat: round(raw[STAT.SPD_FLAT], 3),
        },
        note: '装備・軌跡込みの速度。パーティのバフは含まない。パネルの baseSpeed にこの値を使い、'
            + '常時かかるバフを足したものを preSpeed にする。',
    };
}

/**
 * パネル群を一括で計算し、AI へ返す軽量な形へ落とす。
 * timing='panel' のイベントは他パネルの到達AVを参照するため、
 * 1枚ずつではなく computeAllTimelines でまとめて解決する必要がある。
 */
function compactTimelines(panels, detail) {
    const normalized = panels.map((panel, index) => normalizePanel(panel, index));
    const timelines = computeAllTimelines(normalized);
    return normalized.map((panel, index) => ({
        index,
        ...compactTimeline(panel, detail, timelines[index]),
    }));
}

function compactTimeline(panel, detail, timeline) {
    const resolved = timeline || computeTimeline(panel);
    const summary = summarizeTimeline(panel, resolved);
    // 参照先が見つからず発動できなかったパネル間参照は、必ず利用者へ伝える。
    const unresolvedRefs = (resolved.unresolvedRefs || []).map(ev => ({
        label: evLabel(ev),
        refPanel: ev.refPanel,
        refTurn: ev.refTurn,
        reason: '参照先パネル/ターンが解決できないため発動しません（循環参照や未到達ターンの可能性）。',
    }));

    if (detail !== 'full') {
        return {
            name: summary.name,
            baseSpeed: summary.baseSpeed,
            preSpeed: summary.preSpeed,
            threshold: summary.threshold,
            turnsWithinThreshold: summary.turnsWithinThreshold,
            finalCumulativeAV: round(summary.finalCumulativeAV),
            turns: summary.turns
                .filter(turn => !turn.pastThreshold)
                .map(turn => ({
                    turn: turn.turn,
                    actualAV: round(turn.actualAV),
                    cumulativeAV: round(turn.cumulativeAV),
                    speed: round(turn.speedEnd, 1),
                })),
            ...(unresolvedRefs.length ? { unresolvedRefs } : {}),
        };
    }
    return {
        ...summary,
        finalCumulativeAV: round(summary.finalCumulativeAV),
        turns: summary.turns.map((turn, index) => ({
            ...turn,
            actualAV: round(turn.actualAV),
            cumulativeAV: round(turn.cumulativeAV),
            speedStart: round(turn.speedStart, 1),
            speedEnd: round(turn.speedEnd, 1),
            speedChanged: resolved.rows[index]?.speedChanged ?? false,
        })),
        unfiredEffects: summary.turns.flatMap(turn => turn.effects
            .filter(effect => !effect.fired)
            .map(effect => ({ turn: turn.turn, label: effect.label, at: effect.at }))),
        ...(unresolvedRefs.length ? { unresolvedRefs } : {}),
    };
}

function proposalId() {
    return `aop_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

// ---- ツール本体 ---------------------------------------------------------

/**
 * @param {{ session: any, allowApply?: boolean, savedBuilds?: any[] | (() => any[]) }} options
 */
export function createActionOrderTools({ session, allowApply = false, savedBuilds = [] }) {
    if (!session?.serialize || !session?.getState) throw new Error('行動順 session が必要です。');

    const getSavedBuilds = () => {
        const value = typeof savedBuilds === 'function' ? savedBuilds() : savedBuilds;
        return Array.isArray(value)
            ? value.filter(build => build && typeof build === 'object' && build.id && build.characterId)
            : [];
    };
    const proposals = new Map();
    const executionHistory = [];

    const handlers = {
        get_action_order_context({ detail = 'summary' } = {}) {
            const state = session.serialize();
            return {
                ok: true,
                detail,
                panelCount: state.panels.length,
                maxPanels: MAX_PANELS,
                panels: compactTimelines(state.panels, detail),
                supported: {
                    eventTypes: Object.entries(EVENT_TYPES).map(([key, value]) => ({
                        type: key, label: value.label, defaultValue: value.def,
                    })),
                    timings: SUPPORTED_TIMINGS,
                    panelDefaults: PANEL_DEFAULTS,
                },
                note: 'baseSpeed は速度%バフの参照元、preSpeed は行動開始時点の実速度。'
                    + 'この計算は速度と行動値のみを扱い、ダメージは求めない。',
            };
        },

        search_speed_data(args) {
            if (args.queries.length > 20) {
                return { ok: false, error: { code: 'TOO_MANY_QUERIES', message: '一度に検索できるのは20件までです。' } };
            }
            return searchSpeedData(args);
        },

        list_action_order_quick_presets() {
            const quickPresets = session.serialize().quickPresets || [];
            return {
                ok: true,
                total: quickPresets.length,
                presets: quickPresets.map(({ id, label, type, value, name, memo }) => ({
                    id, label, type, value, name: name || undefined, memo: memo || undefined,
                })),
                note: 'クイック追加は登録情報です。効果をシミュレーションへ入れるときは、必要な発動ターン・タイミングを確認して panels の events に明示してください。',
            };
        },

        list_equippable_lightcones(args) {
            return equippableLightcones(args, getSavedBuilds());
        },

        validate_lightcone_assignment(args) {
            return validateLightconeAssignment(args);
        },

        estimate_ultimate_cycle(args) {
            return ultimateCycle(args, getSavedBuilds());
        },

        search_action_effects(args = {}) {
            const found = searchActionEffects(args);
            return {
                ok: true,
                total: found.total,
                truncated: found.truncated,
                effects: found.effects.map(row => ({
                    sourceType: row.sourceType,
                    sourceId: row.sourceId,
                    sourceName: row.sourceName,
                    sourcePath: sourcePathForActionEffect(row),
                    path: row.path,
                    kind: row.kind,
                    value: row.value,
                    levels: row.levels || undefined,
                    placeholder: row.placeholder || undefined,
                    origin: row.origin,
                    effectName: row.effectName || undefined,
                    target: row.target || undefined,
                    defaultActive: row.defaultActive ?? undefined,
                    alwaysOn: row.alwaysOn || undefined,
                    minEidolon: row.minEidolon ?? undefined,
                    sentence: row.sentence || row.description || undefined,
                    note: row.note || undefined,
                })),
                guidance: 'origin=description の値は説明文から機械的に取り出したもの。'
                    + '対象と発動条件は sentence を読んで判断し、利用者への回答でも根拠を示すこと。'
                    + 'value=null は軌跡レベルまたは重畳の指定が必要なことを意味する。',
            };
        },

        list_saved_builds() {
            const builds = getSavedBuilds();
            return {
                ok: true,
                total: builds.length,
                builds: builds.map(build => ({
                    id: build.id,
                    name: build.name,
                    characterId: build.characterId,
                    characterName: Registry.character.get(build.characterId)?.name || build.characterId,
                })),
            };
        },

        read_build_speed({ build: reference }) {
            const builds = getSavedBuilds();
            if (!builds.length) {
                return { ok: false, error: { code: 'NO_SAVED_BUILDS', message: '保存ビルドがありません。' } };
            }
            const resolved = resolveBuild(builds, reference);
            if (resolved.error) return resolved.error;
            try {
                return { ok: true, ...buildSpeed(resolved.value) };
            } catch (error) {
                return { ok: false, error: { code: 'BUILD_COMPUTE_FAILED', message: error.message } };
            }
        },

        /** @param {{ panels?: any[], detail?: string }} [args] */
        run_action_order_simulation({ panels, detail = 'summary' } = {}) {
            const targets = Array.isArray(panels) && panels.length
                ? panels
                : session.serialize().panels;
            if (!targets.length) {
                return { ok: false, error: { code: 'NO_PANELS', message: '計算するパネルがありません。' } };
            }
            if (targets.length > MAX_PANELS) {
                return { ok: false, error: { code: 'TOO_MANY_PANELS', message: `パネルは ${MAX_PANELS} 個までです。` } };
            }
            return {
                ok: true,
                source: Array.isArray(panels) && panels.length ? 'request' : 'currentState',
                panels: compactTimelines(targets, detail),
            };
        },

        propose_action_order_changes({ changes, summary }) {
            const validation = validateActionOrderChanges(session.getState(), changes);
            if (!validation.valid) return { ok: false, validation };

            // 提案内容を先に計算し、承認前に結果を見せられるようにする。
            let preview;
            try {
                const previewState = session.clone
                    ? serializeActionOrderState(session.clone())
                    : session.serialize();
                const applied = applyForPreview(previewState, changes);
                preview = compactTimelines(applied, 'summary');
            } catch (error) {
                return { ok: false, error: { code: 'PREVIEW_FAILED', message: error.message } };
            }

            const id = proposalId();
            const proposal = {
                id,
                status: 'pending',
                summary: summary || 'パネル設定を変更します。',
                changes,
                preview,
                createdAt: new Date().toISOString(),
            };
            proposals.set(id, proposal);
            return { ok: true, approvalRequired: true, proposal };
        },

        apply_action_order_changes({ proposalId: id, approved }) {
            if (!allowApply) {
                return {
                    ok: false,
                    error: {
                        code: 'APPROVAL_REQUIRED_IN_UI',
                        message: '変更は画面上で利用者が内容を確認してから適用してください。',
                    },
                };
            }
            const proposal = proposals.get(id);
            if (!proposal) return { ok: false, error: { code: 'UNKNOWN_PROPOSAL', message: '変更案が見つかりません。' } };
            if (proposal.status !== 'pending') {
                return { ok: false, error: { code: 'PROPOSAL_ALREADY_HANDLED', message: 'この変更案はすでに処理済みです。' } };
            }
            if (!approved) {
                proposal.status = 'discarded';
                return { ok: true, applied: false, proposal: { ...proposal } };
            }
            const before = session.serialize();
            session.applyChanges(proposal.changes);
            proposal.status = 'applied';
            proposal.appliedAt = new Date().toISOString();
            return {
                ok: true,
                applied: true,
                proposal: { ...proposal },
                before,
                after: session.serialize(),
                undoAvailable: session.canUndo(),
            };
        },
    };

    return Object.freeze({
        definitions: ACTION_ORDER_TOOL_DEFINITIONS,
        execute(name, args = {}) {
            const handler = handlers[name];
            if (!handler) return { ok: false, error: { code: 'UNKNOWN_TOOL', message: `未登録のツールです: ${name}` } };
            const normalizedArgs = args === undefined ? {} : args;
            const argumentErrors = validateToolSchema(normalizedArgs, TOOL_DEFINITIONS_BY_NAME.get(name)?.inputSchema);
            if (argumentErrors.length) {
                const output = {
                    ok: false,
                    error: { code: 'INVALID_TOOL_ARGUMENTS', message: 'ツール引数が不正です。', details: argumentErrors },
                };
                executionHistory.push({ name, args: normalizedArgs, output, at: new Date().toISOString() });
                return output;
            }
            let output;
            try {
                output = handler(normalizedArgs);
            } catch (error) {
                output = { ok: false, error: { code: 'TOOL_EXECUTION_FAILED', message: error.message } };
            }
            executionHistory.push({ name, args: normalizedArgs, output, at: new Date().toISOString() });
            return output;
        },
        getHistory: () => executionHistory.map(item => ({ ...item })),
        getProposal: id => proposals.get(id) || null,
        listProposals: () => Array.from(proposals.values(), item => ({ ...item })),
    });
}

/** 承認前プレビュー用: 状態を書き換えずに適用後のパネル配列を得る */
function applyForPreview(serializedState, changes) {
    const panels = serializedState.panels.map((panel, index) => normalizePanel(panel, index));
    if (Array.isArray(changes.panels)) {
        return changes.panels.slice(0, MAX_PANELS).map((panel, index) => normalizePanel(panel, index));
    }
    if (Array.isArray(changes.patches)) {
        for (const patch of changes.patches) {
            const index = Number.isInteger(patch.index) ? patch.index : 0;
            if (!panels[index]) continue;
            panels[index] = normalizePanel({ ...panels[index], ...patch, index: undefined }, index);
        }
    }
    return panels;
}

// 効果カタログの行を、そのままパネルイベントへ変換するための再公開。
export { toPanelEvent };
