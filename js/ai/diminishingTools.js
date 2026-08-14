// diminishingTools.js — LLM と UI が共有する限界効用ツール群

import { Registry } from '../build/registry.js';
import { RELIC_MAIN_OPTIONS } from '../build/relicMainTable.js';
import { STAT } from '../build/statKeys.js';
import {
    commitDiminishingChanges,
    runDiminishingJob,
} from '../build/diminishingEngine.js';
import {
    DIMINISHING_FIXED_CONDITIONS,
    DIMINISHING_METRICS,
    validateDiminishingJob,
} from '../build/diminishingValidator.js';
import { validateToolSchema } from './toolSchema.js';
import {
    signatureCharacterIdsForLightcone,
    signatureLightconeIdForCharacter,
} from '../data/lightcones/signatureRelations.js';

const CONTEXT_SCHEMA = Object.freeze({
    type: 'object',
    properties: {
        detail: {
            type: 'string',
            enum: ['summary', 'comparison', 'full'],
            description: 'summaryは概要、comparisonは比較条件に必要な正確な値、fullはデバッグ用の完全状態。',
        },
    },
    additionalProperties: false,
});

const STAT_VALUES_SCHEMA = Object.freeze({
    type: 'object',
    description: 'ステータスキーを数値へ対応させる。キーはget_diminishing_context(detail=comparison)のsupported.statKeysを使う。割合は40%=0.4。',
    additionalProperties: { type: 'number' },
});

const RELIC_CHANGE_SCHEMA = Object.freeze({
    type: 'object',
    properties: {
        setId: { type: 'string', description: 'search_game_dataで確認したセットID。' },
        mainStat: { type: 'string', description: 'supported.mainStatsで部位ごとに確認したメインステID。攻撃力%はatk_percent。' },
        subs: STAT_VALUES_SCHEMA,
    },
    additionalProperties: false,
});

const PARTY_CHANGE_SCHEMA = Object.freeze({
    type: 'object',
    description: 'サポーター1人分。simpleならcharacterIdとlevelPresetだけで仮想ビルドを作り、登録済みの本人モチーフ光円錐S1も自動装備する。次元界はornamentIdだけで2部位装備になる。',
    properties: {
        mode: { type: 'string', enum: ['simple', 'build'], description: 'キャラ名と装備条件から作る場合はsimple。buildは保存済みbuildIdまたは完全なbuildがある場合だけ。' },
        characterId: { type: 'string', description: 'search_game_dataで確認したキャラID。characterという項目名は使わない。simpleで光円錐を省略すると本人モチーフS1が自動装備される。' },
        levelPreset: { type: 'string', enum: ['default', 'eidolon'], description: 'default=無凸MAX、eidolon=凸後MAX。' },
        lightcone: {
            type: 'object',
            description: 'サポーターへ明示装備する光円錐。省略時は登録済みの本人モチーフS1。別の光円錐名が依頼にある場合はsearch_game_dataでIDを確認して指定する。',
            properties: {
                id: { type: 'string' },
                superimpose: { type: 'integer', minimum: 1, maximum: 5 },
            },
            additionalProperties: false,
        },
        ornamentId: { type: 'string', description: 'search_game_dataで確認した次元界オーナメントID。simpleモードでも指定できる。' },
        effectSelection: {
            type: 'string',
            enum: ['allApplicable', 'defaults', 'none'],
            description: '省略時はキャラ・光円錐・装備を指定するとallApplicable。通常の火力比較はallApplicable、明示的に無効化する場合だけnone。',
        },
        buildId: { type: 'string' },
        build: { type: 'object', additionalProperties: true },
        activeEffectIds: {
            type: 'array',
            items: { type: 'string' },
            description: 'search_game_dataの効果結果にあるactivationKeyを指定する。生のeffect idではない。',
        },
        stacksByEffectId: { type: 'object', additionalProperties: { type: 'integer' } },
    },
    additionalProperties: false,
});

const SUBSTAT_CHANGE_SCHEMA = Object.freeze({
    type: 'object',
    description: 'サブステ合計を直接指定する場合はmode=manualとmanualを使う。例: 攻撃力%合計40%はmanual.atkPercent=0.4。',
    properties: {
        mode: { type: 'string', enum: ['manual', 'total', 'perSlot'] },
        manual: STAT_VALUES_SCHEMA,
        total: { type: 'object', additionalProperties: true },
        perSlot: { type: 'object', additionalProperties: true },
    },
    additionalProperties: false,
});

const CHANGE_SCHEMA = Object.freeze({
    type: 'object',
    description: '現在状態へ重ねる変更。キャラはcharacterId、凸はeidolon、光円錐はlightconeを使う。現在がdirectでもキャラ・装備を計算するケースはinputMode=buildを必ず指定する。',
    properties: {
        inputMode: { type: 'string', enum: ['build', 'direct'] },
        build: { type: 'object', additionalProperties: true },
        characterId: { type: 'string', description: '対象キャラのID。characterは無効。光円錐を同時指定しない場合、登録済みの本人モチーフS1を自動装備する。' },
        eidolon: { type: 'integer', minimum: 0, maximum: 6 },
        traceLevel: { type: 'object', additionalProperties: { type: 'integer' } },
        lightcone: {
            type: 'object',
            description: '光円錐。superimposeは重畳ランク1〜5。光円錐についてE1/S1と表現された場合はいずれも1。',
            properties: {
                id: { type: 'string' },
                superimpose: { type: 'integer', minimum: 1, maximum: 5 },
            },
            additionalProperties: false,
        },
        relics: {
            type: 'object',
            properties: Object.fromEntries(['head', 'hands', 'body', 'feet', 'sphere', 'rope'].map(slot => [slot, RELIC_CHANGE_SCHEMA])),
            additionalProperties: false,
        },
        directStats: STAT_VALUES_SCHEMA,
        stats: { ...STAT_VALUES_SCHEMA, description: '最終ステータスの目標値。会心率100%はcritRate=1。サブステ量の指定には使わない。' },
        envStats: STAT_VALUES_SCHEMA,
        substats: SUBSTAT_CHANGE_SCHEMA,
        subs: SUBSTAT_CHANGE_SCHEMA,
        party: {
            type: 'array',
            items: PARTY_CHANGE_SCHEMA,
            description: 'サポーター枠0〜2を順番に指定する配列。',
        },
        options: { type: 'object', additionalProperties: true },
        effectSelection: {
            type: 'string',
            enum: ['allApplicable', 'defaults', 'none'],
            description: '対象キャラ・光円錐・遺物の効果選択。省略時は装備変更ケースでallApplicable。通常の火力比較はallApplicable。',
        },
        activeSelfEffectIds: {
            type: 'array',
            items: { type: 'string' },
            description: '対象キャラ・光円錐・装備の効果を有効化するactivationKey。search_game_dataで確認する。',
        },
        selfStacksByEffectId: { type: 'object', additionalProperties: { type: 'integer' } },
        visibleRows: { type: 'array', items: { type: 'string' } },
        visibleStats: { type: 'array', items: { type: 'string' } },
    },
    additionalProperties: false,
});

const VARIATION_SCHEMA = Object.freeze({
    type: 'object',
    properties: {
        label: { type: 'string' },
        changes: CHANGE_SCHEMA,
    },
    required: ['label', 'changes'],
    additionalProperties: false,
});

const JOB_SCHEMA = Object.freeze({
    type: 'object',
    description: 'DOM非依存で実行する限界効用比較ジョブ。基準状態はサーバーが保持する現在状態を必ず使用する。',
    properties: {
        objective: { type: 'string' },
        variations: {
            type: 'array',
            items: VARIATION_SCHEMA,
        },
        matrix: {
            type: 'object',
            properties: {
                rows: { type: 'array', items: VARIATION_SCHEMA },
                columns: { type: 'array', items: VARIATION_SCHEMA },
            },
            additionalProperties: false,
        },
        fixedConditions: {
            type: 'array',
            items: { type: 'string', enum: DIMINISHING_FIXED_CONDITIONS },
            description: '現在の画面状態から変更禁止にする項目だけを指定する。全ケースで同じでも現在状態から変更する項目は指定しない。',
        },
        metrics: { type: 'array', items: { type: 'string', enum: DIMINISHING_METRICS } },
    },
    required: ['objective', 'variations', 'fixedConditions', 'metrics'],
    additionalProperties: false,
});

// AI には計算エンジンの状態形式ではなく、ゲーム上の意味だけを渡させる。
// 詳細な changes / fixedConditions への変換はこのファイルで完結させる。
const THIN_VALUES_SCHEMA = Object.freeze({
    type: 'object',
    description: '数値はゲーム画面と同じ単位で指定する。会心率100%は100、攻撃力%40%は40。',
    additionalProperties: { type: 'number' },
});

const THIN_CASE_SCHEMA = Object.freeze({
    type: 'object',
    properties: {
        label: { type: 'string', description: '比較表に表示する名前。省略時は光円錐名を使う。' },
        lightcone: { type: 'string', description: '光円錐の表示名またはID。' },
        superimpose: { type: 'integer', minimum: 1, maximum: 5, description: '光円錐の重畳ランク。省略時は1。' },
        stats: THIN_VALUES_SCHEMA,
        substats: THIN_VALUES_SCHEMA,
        effects: { type: 'string', enum: ['all', 'defaults', 'none'] },
    },
    additionalProperties: false,
});

const THIN_SHARED_SCHEMA = Object.freeze({
    type: 'object',
    properties: {
        stats: THIN_VALUES_SCHEMA,
        substats: THIN_VALUES_SCHEMA,
        party: {
            type: 'array',
            items: { type: 'string' },
            description: '支援キャラの表示名またはID。本人モチーフS1と適用可能な効果は自動で使う。',
        },
        partyBuilds: {
            type: 'array',
            items: { type: 'string' },
            description: '保存済み支援ビルドの名前またはID。最大3人。partyとは同時に指定しない。保存ビルドは本人の装備だけで、パーティー効果は別条件として扱う。',
        },
        partyEffects: {
            type: 'string',
            enum: ['current', 'all', 'defaults', 'none'],
            description: 'partyBuilds使用時の支援効果。currentは現在の限界効用パーティー欄のON/OFF・層数を同じキャラの枠だけ引き継ぐ。',
        },
        effects: { type: 'string', enum: ['all', 'defaults', 'none'] },
        enemy: {
            type: 'object',
            properties: {
                level: { type: 'integer', minimum: 1, maximum: 100 },
                resistance: { type: 'number', minimum: -100, maximum: 100, description: '属性耐性（%）。' },
                broken: { type: 'boolean' },
            },
            additionalProperties: false,
        },
    },
    additionalProperties: false,
});

const THIN_COMPARISON_SCHEMA = Object.freeze({
    type: 'object',
    description: 'ゲーム上の条件だけで比較する簡易形式。ID、入力モード、効果キー、固定条件は指定しない。',
    properties: {
        objective: { type: 'string' },
        focus: {
            type: 'object',
            properties: {
                character: { type: 'string', description: '対象キャラの表示名またはID。' },
                savedBuild: { type: 'string', description: '保存済みビルドの名前またはID。キャラ・光円錐・遺物・サブステをそのまま基準に使う。characterとは同時に指定しない。' },
                eidolon: { type: 'integer', minimum: 0, maximum: 6 },
            },
            additionalProperties: false,
        },
        shared: THIN_SHARED_SCHEMA,
        cases: { type: 'array', items: THIN_CASE_SCHEMA },
    },
    required: ['objective', 'cases'],
    additionalProperties: false,
});

export const DIMINISHING_TOOL_DEFINITIONS = Object.freeze([
    {
        name: 'get_diminishing_context',
        description: '現在の限界効用状態を取得する。通常はsummary、正確な比較値が不足するときだけcomparison、完全状態はデバッグ時だけfullを指定する。返されたIDは確定済みなので再検索しない。',
        inputSchema: CONTEXT_SCHEMA,
    },
    {
        name: 'search_game_data',
        description: '登録済みのキャラ、光円錐、トンネル遺物、次元界、効果を名前またはIDで検索する。モチーフ武器・餅・専用光円錐とキャラ名の組み合わせでも検索でき、キャラ結果のsignatureLightconeと光円錐結果のsignatureForが関係を示す。複数候補はqueriesにまとめ、このツールを個別に繰り返し呼ばない。不明なIDを推測せず、この結果を使う。',
        inputSchema: {
            type: 'object',
            properties: {
                query: { type: 'string' },
                queries: {
                    type: 'array',
                    items: { type: 'string' },
                    description: '複数の名前またはIDを一度に検索する場合に指定する。個別に繰り返し呼び出さないこと。',
                },
                category: { type: 'string', enum: ['all', 'character', 'lightcone', 'relic', 'ornament', 'effect'] },
                limit: { type: 'integer', minimum: 1, maximum: 50 },
            },
            required: ['query'],
            additionalProperties: false,
        },
    },
    {
        name: 'validate_diminishing_job',
        description: '比較ジョブのID、装備条件、数値、ステータス、効果、固定条件、復元可能性を検証する。失敗時は構造化した理由を返す。',
        inputSchema: {
            type: 'object',
            properties: { job: JOB_SCHEMA },
            required: ['job'],
            additionalProperties: false,
        },
    },
    {
        name: 'run_diminishing_comparison',
        description: 'ゲーム上の条件だけを使って、複数ケースを内部検証してから比較計算する。通常は request の簡易形式だけを使う。ID検索、inputMode、changes、fixedConditions、効果キーは不要。例: {focus:{character:"アーチャー",eidolon:0},cases:[{lightcone:"理想を焼く奈落で"},{lightcone:"或る嘘の終幕"}],shared:{stats:{critRate:100,critDmg:100},substats:{atkPercent:40},party:["遠坂凛","花火","フォフォ"],effects:"all"}}。job は旧形式との互換用で、通常は使用しない。',
        inputSchema: {
            type: 'object',
            properties: { request: THIN_COMPARISON_SCHEMA, job: JOB_SCHEMA },
            additionalProperties: false,
        },
    },
    {
        name: 'propose_diminishing_changes',
        description: '比較結果または明示したchangesから、画面へ反映する未承認の変更案を作る。状態はまだ変更しない。',
        inputSchema: {
            type: 'object',
            properties: {
                caseLabel: { type: 'string' },
                changes: CHANGE_SCHEMA,
                summary: { type: 'string' },
            },
            additionalProperties: false,
        },
    },
    {
        name: 'apply_diminishing_changes',
        description: '利用者が画面で承認した変更案だけを適用する。approved=true と既存proposalIdが必要。適用前状態を自動保存する。',
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
    DIMINISHING_TOOL_DEFINITIONS.map(definition => [definition.name, definition]),
);

export function asOpenAiTools(definitions = DIMINISHING_TOOL_DEFINITIONS) {
    return definitions.map(definition => ({
        type: 'function',
        name: definition.name,
        description: definition.description,
        parameters: definition.inputSchema,
        strict: false,
    }));
}

function normalizeText(value) {
    return String(value || '').normalize('NFKC').toLocaleLowerCase('ja');
}

const THIN_TARGET_STAT_MAP = Object.freeze({
    atk: { key: 'atk', scale: 1 },
    hp: { key: 'hp', scale: 1 },
    def: { key: 'def', scale: 1 },
    speed: { key: 'spd', scale: 1 },
    spd: { key: 'spd', scale: 1 },
    critRate: { key: STAT.CRIT_RATE, scale: 0.01 },
    critDmg: { key: STAT.CRIT_DMG, scale: 0.01 },
    damageBonus: { key: STAT.DMG_ALL, scale: 0.01 },
    dmgAll: { key: STAT.DMG_ALL, scale: 0.01 },
    dmgBasic: { key: STAT.DMG_BASIC, scale: 0.01 },
    dmgSkill: { key: STAT.DMG_SKILL, scale: 0.01 },
    dmgUlt: { key: STAT.DMG_ULT, scale: 0.01 },
    dmgFollowup: { key: STAT.DMG_FOLLOWUP, scale: 0.01 },
    defDown: { key: STAT.DEF_DOWN, scale: 0.01 },
    defIgnore: { key: STAT.DEF_IGNORE, scale: 0.01 },
    resPen: { key: STAT.RES_PEN, scale: 0.01 },
    dmgTaken: { key: STAT.DMG_TAKEN, scale: 0.01 },
    breakEffect: { key: STAT.BREAK_EFFECT, scale: 0.01 },
    energyRegen: { key: STAT.ENERGY_REGEN, scale: 0.01 },
});

const THIN_SUBSTAT_MAP = Object.freeze({
    atkPercent: { key: STAT.ATK_PERCENT, scale: 0.01 },
    hpPercent: { key: STAT.HP_PERCENT, scale: 0.01 },
    defPercent: { key: STAT.DEF_PERCENT, scale: 0.01 },
    atkFlat: { key: STAT.ATK_FLAT, scale: 1 },
    hpFlat: { key: STAT.HP_FLAT, scale: 1 },
    defFlat: { key: STAT.DEF_FLAT, scale: 1 },
    speed: { key: STAT.SPD_FLAT, scale: 1 },
    spd: { key: STAT.SPD_FLAT, scale: 1 },
    critRate: { key: STAT.CRIT_RATE, scale: 0.01 },
    critDmg: { key: STAT.CRIT_DMG, scale: 0.01 },
    breakEffect: { key: STAT.BREAK_EFFECT, scale: 0.01 },
    effectHitRate: { key: STAT.EFFECT_HIT_RATE, scale: 0.01 },
    effectRes: { key: STAT.EFFECT_RES, scale: 0.01 },
});

function thinInputError(code, message, details = undefined) {
    return { ok: false, error: { code, message, ...(details === undefined ? {} : { details }) } };
}

function resolveNamedRecord(store, kind, reference) {
    const needle = normalizeText(reference);
    if (!needle) return { error: thinInputError('MISSING_REFERENCE', `${kind}を指定してください。`) };
    const records = store.list().filter(item => item.id !== 'template');
    const exact = records.filter(item => [item.id, item.name, ...(item.aliases || [])].some(value => normalizeText(value) === needle));
    if (exact.length === 1) return { record: exact[0] };
    if (exact.length > 1) return {
        error: thinInputError('AMBIGUOUS_REFERENCE', `${kind}「${reference}」が複数見つかりました。`, {
            candidates: exact.map(item => ({ id: item.id, name: item.name })),
        }),
    };
    return { error: thinInputError('UNKNOWN_REFERENCE', `登録済みの${kind}に「${reference}」はありません。`) };
}

function resolveSavedBuild(savedBuilds, reference) {
    const needle = normalizeText(reference);
    if (!needle) return { error: thinInputError('MISSING_SAVED_BUILD', '保存済みビルドを指定してください。') };
    const exact = savedBuilds.filter(build => (
        normalizeText(build.id) === needle || (build.name && normalizeText(build.name) === needle)
    ));
    if (exact.length === 1) return { build: exact[0] };
    if (exact.length > 1) return {
        error: thinInputError('AMBIGUOUS_SAVED_BUILD', `保存済みビルド「${reference}」が複数見つかりました。`, {
            candidates: exact.map(build => ({ id: build.id, name: build.name, characterId: build.characterId })),
        }),
    };
    return {
        error: thinInputError('UNKNOWN_SAVED_BUILD', `保存済みビルド「${reference}」はありません。`, {
            available: savedBuilds.map(build => ({ id: build.id, name: build.name, characterId: build.characterId })),
        }),
    };
}

function convertThinValues(values, mapping, label) {
    if (values === undefined) return { value: undefined };
    if (!values || typeof values !== 'object' || Array.isArray(values)) {
        return { error: thinInputError('INVALID_NUMERIC_VALUES', `${label}は数値の組み合わせで指定してください。`) };
    }
    const converted = {};
    for (const [name, rawValue] of Object.entries(values)) {
        const rule = mapping[name];
        if (!rule) {
            return { error: thinInputError('UNSUPPORTED_NUMERIC_VALUE', `${label}「${name}」には対応していません。`, {
                supported: Object.keys(mapping),
            }) };
        }
        if (typeof rawValue !== 'number' || !Number.isFinite(rawValue)) {
            return { error: thinInputError('INVALID_NUMERIC_VALUE', `${label}「${name}」は有限の数値で指定してください。`) };
        }
        converted[rule.key] = rawValue * rule.scale;
    }
    return { value: converted };
}

function thinEffectSelection(value) {
    if (value === undefined || value === 'all') return 'allApplicable';
    if (value === 'defaults') return 'defaults';
    if (value === 'none') return 'none';
    return null;
}

function mergeThinValues(shared, specific) {
    if (shared === undefined && specific === undefined) return undefined;
    return { ...(shared || {}), ...(specific || {}) };
}

function createThinComparisonJob(request, state, savedBuilds = []) {
    if (!request || typeof request !== 'object' || Array.isArray(request)) {
        return { error: thinInputError('INVALID_REQUEST', 'request は比較条件のオブジェクトで指定してください。') };
    }
    if (!Array.isArray(request.cases) || request.cases.length === 0) {
        return { error: thinInputError('MISSING_CASES', '比較するcasesを1件以上指定してください。') };
    }
    const shared = request.shared || {};
    const focus = request.focus || {};
    if (focus.character !== undefined && focus.savedBuild !== undefined) {
        return { error: thinInputError('CONFLICTING_FOCUS', 'focus.character と focus.savedBuild は同時に指定できません。') };
    }
    if (shared.party !== undefined && shared.partyBuilds !== undefined) {
        return { error: thinInputError('CONFLICTING_PARTY_SOURCE', 'shared.party と shared.partyBuilds は同時に指定できません。') };
    }
    let savedBuild = null;
    if (focus.savedBuild !== undefined) {
        const resolved = resolveSavedBuild(savedBuilds, focus.savedBuild);
        if (resolved.error) return resolved;
        savedBuild = resolved.build;
    }
    let characterId = null;
    if (focus.character !== undefined) {
        const resolved = resolveNamedRecord(Registry.character, 'キャラ', focus.character);
        if (resolved.error) return resolved;
        characterId = resolved.record.id;
    }
    if (savedBuild) characterId = savedBuild.characterId;
    let party = null;
    if (shared.party !== undefined) {
        if (!Array.isArray(shared.party) || shared.party.length > 3) {
            return { error: thinInputError('INVALID_PARTY', 'partyは0〜3人のキャラ名配列で指定してください。') };
        }
        party = [];
        for (const reference of shared.party) {
            const resolved = resolveNamedRecord(Registry.character, '支援キャラ', reference);
            if (resolved.error) return resolved;
            party.push({
                mode: 'simple',
                characterId: resolved.record.id,
                levelPreset: 'default',
                effectSelection: thinEffectSelection(shared.effects) || 'allApplicable',
            });
        }
    }
    if (shared.partyBuilds !== undefined) {
        if (!Array.isArray(shared.partyBuilds) || shared.partyBuilds.length > 3) {
            return { error: thinInputError('INVALID_PARTY_BUILDS', 'partyBuildsは0〜3件の保存ビルド名またはIDで指定してください。') };
        }
        const partyEffects = shared.partyEffects || 'all';
        party = [];
        for (let index = 0; index < 3; index++) {
            const reference = shared.partyBuilds[index];
            if (reference === undefined) {
                party.push({
                    mode: 'simple', characterId: null, levelPreset: 'default',
                    activeEffectIds: [], stacksByEffectId: {},
                });
                continue;
            }
            const resolved = resolveSavedBuild(savedBuilds, reference);
            if (resolved.error) return resolved;
            const supportBuild = resolved.build;
            const currentSlot = state.party?.[index];
            const canReuseCurrentEffects = partyEffects === 'current'
                && currentSlot?.characterId === supportBuild.characterId;
            if (canReuseCurrentEffects) {
                party.push({
                    mode: 'build', characterId: supportBuild.characterId,
                    buildId: supportBuild.id, build: supportBuild,
                    activeEffectIds: currentSlot.activeEffectIds || [],
                    stacksByEffectId: currentSlot.stacksByEffectId || {},
                });
                continue;
            }
            // 選択した支援が現在の枠と異なるときは、古い効果キーを持ち越さず
            // そのビルドで適用可能な効果を初期条件として選ぶ。
            const selection = partyEffects === 'current'
                ? 'allApplicable'
                : thinEffectSelection(partyEffects);
            if (!selection) {
                return { error: thinInputError('INVALID_PARTY_EFFECTS', 'partyEffectsはcurrent / all / defaults / noneで指定してください。') };
            }
            party.push({
                mode: 'build', characterId: supportBuild.characterId,
                buildId: supportBuild.id, build: supportBuild,
                effectSelection: selection,
            });
        }
    }
    const baseUsesBuild = Boolean(savedBuild || characterId || shared.stats || shared.substats || party !== null);
    const variations = [];
    for (const [index, item] of request.cases.entries()) {
        if (!item || typeof item !== 'object' || Array.isArray(item)) {
            return { error: thinInputError('INVALID_CASE', `cases[${index}]はオブジェクトで指定してください。`) };
        }
        const changes = {};
        const stats = convertThinValues(mergeThinValues(shared.stats, item.stats), THIN_TARGET_STAT_MAP, 'stats');
        if (stats.error) return stats;
        const substats = convertThinValues(mergeThinValues(shared.substats, item.substats), THIN_SUBSTAT_MAP, 'substats');
        if (substats.error) return substats;
        const caseUsesBuild = baseUsesBuild || item.lightcone !== undefined || item.stats !== undefined || item.substats !== undefined;
        if (caseUsesBuild) {
            changes.inputMode = 'build';
            changes.characterId = characterId || state.build?.characterId;
            if (savedBuild) {
                changes.build = savedBuild;
                // 保存ビルドの遺物サブステだけを使い、現在画面のサブステ指定は持ち込まない。
                changes.substats = { mode: 'manual', manual: {} };
            }
            if (focus.eidolon !== undefined) changes.eidolon = focus.eidolon;
        }
        if (item.lightcone !== undefined) {
            const resolved = resolveNamedRecord(Registry.lightcone, '光円錐', item.lightcone);
            if (resolved.error) return resolved;
            changes.lightcone = { id: resolved.record.id, superimpose: item.superimpose ?? 1 };
        }
        if (stats.value && Object.keys(stats.value).length) changes.stats = stats.value;
        if (substats.value && Object.keys(substats.value).length) changes.substats = { mode: 'manual', manual: substats.value };
        if (party !== null) changes.party = party;
        const sourceWasSelected = Boolean(savedBuild || characterId || item.lightcone !== undefined || party !== null);
        const requestedEffects = item.effects ?? shared.effects;
        const effects = requestedEffects === undefined
            ? sourceWasSelected ? 'allApplicable' : 'defaults'
            : thinEffectSelection(requestedEffects);
        if (!effects) return { error: thinInputError('INVALID_EFFECTS', 'effectsはall / defaults / noneで指定してください。') };
        if (caseUsesBuild || sourceWasSelected || requestedEffects !== undefined) changes.effectSelection = effects;
        if (shared.enemy) {
            changes.options = {
                ...(shared.enemy.level === undefined ? {} : { enemyLevel: shared.enemy.level }),
                ...(shared.enemy.resistance === undefined ? {} : { enemyBaseRes: shared.enemy.resistance / 100 }),
                ...(shared.enemy.broken === undefined ? {} : { breakState: shared.enemy.broken ? 'broken' : 'normal' }),
            };
        }
        const label = item.label || item.lightcone || `ケース${index + 1}`;
        variations.push({ label, changes });
    }
    return {
        value: {
            objective: request.objective,
            baseState: state,
            variations,
            fixedConditions: [],
            metrics: ['finalStats', 'damage', 'differencePercent'],
        },
    };
}

function searchableText(item) {
    return normalizeText([item.id, item.name, ...(item.aliases || [])].join(' '));
}

function characterReference(characterId) {
    const character = Registry.character.get(characterId);
    return character ? { id: character.id, name: character.name } : { id: characterId, name: characterId };
}

function lightconeReference(lightconeId) {
    const lightcone = Registry.lightcone.get(lightconeId);
    return lightcone ? { id: lightcone.id, name: lightcone.name } : { id: lightconeId, name: lightconeId };
}

function signatureForLightcone(lightconeId) {
    return signatureCharacterIdsForLightcone(lightconeId).map(characterReference);
}

function signatureLightconeForSearch(characterId) {
    const lightconeId = signatureLightconeIdForCharacter(characterId);
    return lightconeId ? lightconeReference(lightconeId) : null;
}

function lightconeRelationshipAliases(lightconeId) {
    return signatureForLightcone(lightconeId).flatMap(character => [
        `${character.name}のモチーフ武器`, `${character.name}モチーフ`, `${character.name}餅`, `${character.name}の専用光円錐`,
        `${character.id} signature light cone`,
    ]);
}

function characterRelationshipAliases(characterId) {
    const lightcone = signatureLightconeForSearch(characterId);
    return lightcone ? [
        lightcone.id, lightcone.name, 'モチーフ武器', 'モチーフ光円錐', '餅', '専用光円錐', 'signature light cone',
    ] : [];
}

function effectRows() {
    const rows = [];
    const collect = (sourceType, source, metadata = {}, activationPrefix = (_scope) => null) => {
        const groups = [];
        const add = (effects, scope) => {
            if (!Array.isArray(effects)) return;
            groups.push(...effects
                .filter(effect => effect && typeof effect === 'object')
                .map(effect => ({ effect, scope })));
        };
        add(source.partyEffects, 'party');
        add(source.selfEffects, 'self');
        add(source.partyEffects?.pc2, 'party.pc2');
        add(source.partyEffects?.pc4, 'party.pc4');
        add(source.selfEffects?.pc2, 'self.pc2');
        add(source.selfEffects?.pc4, 'self.pc4');
        for (const { effect, scope } of groups) {
            rows.push({
                category: 'effect',
                id: effect.id,
                name: effect.name,
                description: effect.description || '',
                sourceType,
                sourceId: source.id,
                sourceName: source.name,
                sourceAliases: source.aliases || [],
                scope,
                activationKey: activationPrefix(scope) ? `${activationPrefix(scope)}.${effect.id}` : null,
                activationTargets: ['activeSelfEffectIds', 'party[].activeEffectIds'],
                defaultActive: Boolean(effect.defaultActive),
                stats: effect.stats || null,
                ...metadata,
            });
        }
    };
    Registry.character.list()
        .filter(item => !item.isTestAllEquipment && item.id !== 'template')
        .forEach(item => collect('character', item, {}, () => `char:${item.id}`));
    Registry.lightcone.list().forEach(item => {
        const signatureFor = signatureForLightcone(item.id);
        const signatureAliases = lightconeRelationshipAliases(item.id);
        if (typeof item.partyEffects !== 'function' && typeof item.selfEffects !== 'function') {
            collect('lightcone', item, { signatureFor, signatureAliases }, () => 'lc');
            return;
        }
        for (let superimpose = 1; superimpose <= 5; superimpose++) {
            collect('lightcone', {
                ...item,
                partyEffects: typeof item.partyEffects === 'function' ? item.partyEffects(superimpose) : item.partyEffects,
                selfEffects: typeof item.selfEffects === 'function' ? item.selfEffects(superimpose) : item.selfEffects,
            }, { superimpose, signatureFor, signatureAliases }, () => 'lc');
        }
    });
    Registry.relicSet.list().forEach(item => collect('relic', item, {}, scope => `set:${item.id}:${scope.split('.').at(-1)}`));
    Registry.ornament.list().forEach(item => collect('ornament', item, {}, scope => `orn:${item.id}:${scope.split('.').at(-1)}`));
    return rows;
}

function searchData({ query, queries = [], category = 'all', limit = 20 }) {
    const requestedQueries = [...new Set([query, ...queries].map(value => String(value || '').trim()).filter(Boolean))];
    const needles = requestedQueries.map(normalizeText);
    const matches = text => needles.length === 0 || needles.some(needle => text.includes(needle));
    const rows = [];
    /** @param {string} kind @param {any[]} list @param {(item: any) => object} [extra] */
    const add = (
        kind,
        list,
        extra = /** @type {(item: any) => object} */ (() => ({})),
        relationshipAliases = /** @type {(item: any) => string[]} */ (() => []),
    ) => {
        if (category !== 'all' && category !== kind) return;
        for (const item of list) {
            const aliases = relationshipAliases(item);
            if (!matches(normalizeText([searchableText(item), ...aliases].join(' ')))) continue;
            rows.push({ category: kind, id: item.id, name: item.name, aliases: item.aliases || [], relationshipAliases: aliases, ...extra(item) });
        }
    };
    add('character', Registry.character.list().filter(item => !item.isTestAllEquipment && item.id !== 'template'), item => ({
        element: item.element,
        path: item.path,
        rarity: item.rarity,
        signatureLightcone: signatureLightconeForSearch(item.id),
    }), item => characterRelationshipAliases(item.id));
    add('lightcone', Registry.lightcone.list(), item => ({
        path: item.path,
        rarity: item.rarity,
        signatureFor: signatureForLightcone(item.id),
    }), item => lightconeRelationshipAliases(item.id));
    add('relic', Registry.relicSet.list());
    add('ornament', Registry.ornament.list());
    if (category === 'all' || category === 'effect') {
        for (const row of effectRows()) {
            if (!matches(normalizeText([
                row.id, row.name, row.description, row.sourceId, row.sourceName, ...(row.sourceAliases || []),
                ...(row.signatureAliases || []),
            ].join(' ')))) continue;
            rows.push(row);
        }
    }
    const rowText = row => normalizeText([
        row.id, row.name, ...(row.aliases || []), row.description, row.sourceId, row.sourceName,
        ...(row.sourceAliases || []), ...(row.relationshipAliases || []), ...(row.signatureAliases || []), row.activationKey,
    ].join(' '));
    const groups = requestedQueries.map((requested, index) => {
        const matched = rows.filter(row => rowText(row).includes(needles[index]));
        return { query: requested, count: matched.length, results: matched.slice(0, limit) };
    });
    return {
        query,
        queries,
        category,
        count: Math.min(rows.length, limit),
        results: rows.slice(0, limit),
        groups,
    };
}

function contextSummary(state, savedBuilds = []) {
    const character = Registry.character.get(state.build?.characterId);
    const lightcone = Registry.lightcone.get(state.build?.lightcone?.id);
    return {
        inputMode: state.inputMode,
        buildName: state.build?.name || '',
        character: character ? { id: character.id, name: character.name } : null,
        lightcone: lightcone ? { id: lightcone.id, name: lightcone.name, superimpose: state.build.lightcone.superimpose } : null,
        relicMainStats: Object.fromEntries(Object.entries(state.build?.relics || {}).map(([slot, relic]) => [slot, relic.mainStat])),
        party: state.party.map(slot => ({
            mode: slot.mode,
            characterId: slot.characterId,
            lightcone: slot.lightcone || null,
            ornamentId: slot.ornamentId || null,
            buildId: slot.buildId,
            activeEffectIds: Array.from(slot.activeEffectIds || []),
        })),
        enemy: {
            level: state.options.enemyLevel,
            resistance: state.options.enemyBaseRes,
            breakState: state.options.breakState,
        },
        hasSnapshot: Boolean(state.inputMode === 'direct' ? state.direct.snapshot : state.snapshot),
        substatMode: state.subs.mode,
        savedBuilds: savedBuilds.map(build => ({
            id: build.id,
            name: build.name || '(無名)',
            characterId: build.characterId,
            characterName: Registry.character.get(build.characterId)?.name || build.characterId,
        })),
    };
}

function compactRelics(relics = {}) {
    return Object.fromEntries(Object.entries(relics).map(([slot, relic]) => [slot, {
        setId: relic?.setId || null,
        mainStat: relic?.mainStat || null,
    }]));
}

function comparisonContext(state) {
    return {
        inputMode: state.inputMode,
        build: {
            characterId: state.build?.characterId || null,
            eidolon: state.build?.eidolon ?? 0,
            traceLevel: state.build?.traceLevel || {},
            lightcone: state.build?.lightcone || null,
            relics: compactRelics(state.build?.relics),
            activeSelfEffectIds: state.build?.activeSelfEffectIds || [],
            selfStacksByEffectId: state.build?.selfStacksByEffectId || {},
        },
        directStats: state.inputMode === 'direct' ? state.direct?.stats || {} : undefined,
        party: state.party.map(slot => ({
            mode: slot.mode,
            characterId: slot.characterId,
            levelPreset: slot.levelPreset,
            lightcone: slot.lightcone || null,
            ornamentId: slot.ornamentId || null,
            buildId: slot.buildId,
            build: slot.build || null,
            activeEffectIds: Array.from(slot.activeEffectIds || []),
            stacksByEffectId: { ...(slot.stacksByEffectId || {}) },
        })),
        options: state.options,
        subs: state.subs,
        snapshot: state.inputMode === 'direct' ? state.direct?.snapshot : state.snapshot,
    };
}

function compactValidation(validation) {
    return {
        valid: validation.valid,
        errors: validation.errors || [],
        warnings: validation.warnings || [],
    };
}

function compactFinalStats(finalStats) {
    if (!finalStats) return null;
    return { derived: finalStats.derived || {} };
}

function compactComparisonResult(result) {
    return {
        objective: result.objective,
        fixedConditions: result.fixedConditions,
        metrics: result.metrics,
        base: result.base ? {
            finalStats: compactFinalStats(result.base.finalStats),
            damage: result.base.damage,
            attacks: result.base.attacks || [],
            calculation: result.base.calculation || null,
        } : null,
        cases: result.cases.map(item => ({
            label: item.label,
            changes: item.changes,
            appliedEffects: {
                focus: item.state?.build?.activeSelfEffectIds || [],
                party: (item.state?.party || []).map(slot => ({
                    characterId: slot.characterId,
                    lightcone: slot.lightcone || null,
                    ornamentId: slot.ornamentId || null,
                    activeEffectIds: slot.activeEffectIds || [],
                })),
            },
            finalStats: compactFinalStats(item.finalStats),
            damage: item.damage,
            attacks: item.attacks || [],
            calculation: item.calculation || null,
            differencePercent: item.differencePercent,
        })),
        snapshotComparison: result.snapshotComparison,
        matrix: result.matrix,
    };
}

function proposalId() {
    return `proposal_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * @param {{ session: any, allowApply?: boolean, savedBuilds?: any[] | (() => any[]) }} options
 */
export function createDiminishingTools({ session, allowApply = false, savedBuilds = /** @type {any[] | (() => any[])} */ ([]) }) {
    if (!session?.serialize || !session?.getState) throw new Error('diminishing session が必要です。');
    const getAvailableSavedBuilds = () => {
        const value = typeof savedBuilds === 'function' ? savedBuilds() : savedBuilds;
        return Array.isArray(value)
            ? value.filter(build => build && typeof build === 'object' && build.id && build.characterId)
            : [];
    };
    const proposals = new Map();
    let lastComparison = null;
    const executionHistory = [];

    const handlers = {
        get_diminishing_context({ detail = 'summary' } = {}) {
            const state = session.getState();
            const output = {
                ok: true,
                detail,
                summary: contextSummary(state, getAvailableSavedBuilds()),
                supported: {
                    metrics: DIMINISHING_METRICS,
                    fixedConditions: DIMINISHING_FIXED_CONDITIONS,
                    changeFields: Object.keys(CHANGE_SCHEMA.properties),
                },
            };
            if (detail === 'comparison' || detail === 'full') {
                output.comparison = comparisonContext(state);
                output.supported.mainStats = RELIC_MAIN_OPTIONS;
                output.supported.statKeys = Object.values(STAT);
                output.supported.examples = {
                    thinComparison: {
                        focus: { character: 'アーチャー', eidolon: 0 },
                        cases: [{ lightcone: '理想を焼く奈落で' }, { lightcone: '或る嘘の終幕' }],
                        shared: {
                            stats: { critRate: 100, critDmg: 100 },
                            substats: { atkPercent: 40 },
                            party: ['遠坂凛', '花火', 'フォフォ'],
                            effects: 'all',
                        },
                    },
                };
            }
            if (detail === 'full') output.state = session.serialize();
            return output;
        },
        search_game_data(args) {
            if (args.queries?.length > 20) {
                return {
                    ok: false,
                    error: {
                        code: 'TOO_MANY_SEARCH_QUERIES',
                        message: '一度に検索できる条件は20件までです。',
                    },
                };
            }
            return { ok: true, ...searchData(args) };
        },
        validate_diminishing_job({ job }) {
            const completeJob = { ...job, baseState: session.serialize() };
            const validation = validateDiminishingJob(completeJob);
            return { ok: validation.valid, validation: compactValidation(validation) };
        },
        run_diminishing_comparison({ request, job }) {
            const source = request === undefined
                ? { value: { ...job, baseState: session.serialize() } }
                : createThinComparisonJob(request, session.serialize(), getAvailableSavedBuilds());
            if (source.error) return source.error;
            const completeJob = source.value;
            const validation = validateDiminishingJob(completeJob);
            if (!validation.valid) return { ok: false, stopped: true, validation: compactValidation(validation) };
            const result = runDiminishingJob(validation.normalizedJob);
            const resultValidation = validateDiminishingJob(validation.normalizedJob, result);
            if (!resultValidation.valid) return { ok: false, stopped: true, validation: compactValidation(resultValidation) };
            lastComparison = result;
            return {
                ok: true,
                jobSummary: {
                    objective: result.objective,
                    caseCount: result.cases.length,
                    fixedConditions: result.fixedConditions,
                    metrics: result.metrics,
                    cases: result.cases.map(item => ({ label: item.label, changes: item.changes })),
                    matrix: result.matrix,
                },
                result: compactComparisonResult(result),
                validation: compactValidation(resultValidation),
            };
        },
        propose_diminishing_changes(args) {
            let changes = args.changes;
            let caseLabel = args.caseLabel;
            if (!changes && lastComparison) {
                const selected = lastComparison.cases.find(item => item.label === caseLabel) || lastComparison.cases[0];
                changes = selected?.changes;
                caseLabel = selected?.label;
            }
            if (!changes) return { ok: false, error: { code: 'NO_CHANGES', message: '変更内容または比較ケースを指定してください。' } };
            const job = {
                objective: args.summary || `${caseLabel || '選択条件'}を画面へ反映`,
                baseState: session.serialize(),
                variations: [{ label: caseLabel || '変更案', changes }],
                fixedConditions: [],
                metrics: ['finalStats', 'damage', 'differencePercent'],
            };
            const validation = validateDiminishingJob(job);
            if (!validation.valid) return { ok: false, validation };
            const id = proposalId();
            const proposal = {
                id,
                status: 'pending',
                label: caseLabel || '変更案',
                summary: args.summary || `${caseLabel || '選択した条件'}を現在画面へ反映します。`,
                changes,
                createdAt: new Date().toISOString(),
            };
            proposals.set(id, proposal);
            return { ok: true, approvalRequired: true, proposal };
        },
        apply_diminishing_changes({ proposalId: id, approved }) {
            if (!allowApply) {
                return {
                    ok: false,
                    error: {
                        code: 'APPROVAL_REQUIRED_IN_UI',
                        message: '変更はサイト上で利用者が内容を確認した後に適用してください。',
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
            session.checkpoint();
            session.mutate(state => commitDiminishingChanges(state, proposal.changes));
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
        definitions: DIMINISHING_TOOL_DEFINITIONS,
        execute(name, args = {}) {
            const handler = handlers[name];
            if (!handler) return { ok: false, error: { code: 'UNKNOWN_TOOL', message: `未登録のツールです: ${name}` } };
            const normalizedArgs = args === undefined ? {} : args;
            const argumentErrors = validateToolSchema(normalizedArgs, TOOL_DEFINITIONS_BY_NAME.get(name)?.inputSchema);
            if (argumentErrors.length) {
                const output = {
                    ok: false,
                    error: {
                        code: 'INVALID_TOOL_ARGUMENTS',
                        message: 'ツール引数が不正です。',
                        details: argumentErrors,
                    },
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
