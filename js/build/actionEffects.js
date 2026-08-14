// actionEffects.js — 行動順シミュ向けの「速度・行動値」効果カタログ
//
// 目的:
//   登録済みのキャラ/光円錐/遺物/オーナメントから、行動順に影響する効果だけを抜き出し、
//   行動順パネルのイベント (advance / speedFlat / speedPct) に対応づけられる形で返す。
//   火力係数は一切扱わない。
//
// 由来 (origin) を必ず添える。数値の信頼度が違うため、利用者へ提示するとき区別できるようにする。
//   stats       … partyEffects/selfEffects/装備ステの STAT.SPD_* から取得。値は正確。
//   skillLevels … skills.<key>.levels[].advance から取得。値は正確 (軌跡Lv指定が必要)。
//   hook        … hooks 内の advanceAction(...) 呼び出し。関数のため数値は推定できない場合がある。
//   description … 説明文から抽出。数値は文面どおりだが、対象 (自分/味方/敵) と発動条件は
//                 文面を読んで判断する必要がある。sentence を必ず添えて検証可能にする。

import { Registry } from './registry.js';
import { STAT } from './statKeys.js';

/** 行動順パネルのイベント種別と対応する種類 */
export const ACTION_EFFECT_KINDS = Object.freeze({
    ADVANCE: 'advance',       // 行動値短縮 (%) — パネルの advance と同じ
    DELAY: 'delay',           // 行動順遅延 (%) — パネルでは advance に負値で入れる
    SPEED_FLAT: 'speedFlat',  // 速度 実数加算
    SPEED_PCT: 'speedPct',    // 速度 基礎値に対する % 加算
});

export const ACTION_EFFECT_ORIGINS = Object.freeze(['stats', 'skillLevels', 'hook', 'description']);

// 説明文から行動順操作を拾うパターン。
//   数値パターンと、レベル依存の伏字 (X/Y/Z) パターンを分けて扱う。
const DESCRIPTION_PATTERNS = Object.freeze([
    { kind: ACTION_EFFECT_KINDS.ADVANCE, re: /行動順(?:が|を)([0-9]+(?:\.[0-9]+)?)[%％](?:分)?(?:早|進)/g },
    { kind: ACTION_EFFECT_KINDS.ADVANCE, re: /行動値(?:が|を)([0-9]+(?:\.[0-9]+)?)[%％](?:分)?短縮/g },
    { kind: ACTION_EFFECT_KINDS.DELAY, re: /行動順(?:が|を)([0-9]+(?:\.[0-9]+)?)[%％](?:分)?遅延/g },
]);

const DESCRIPTION_PLACEHOLDER_PATTERNS = Object.freeze([
    { kind: ACTION_EFFECT_KINDS.ADVANCE, re: /行動順(?:が|を)([XYZ])[%％](?:分)?(?:早|進)/g },
    { kind: ACTION_EFFECT_KINDS.ADVANCE, re: /行動値(?:が|を)([XYZ])[%％](?:分)?短縮/g },
    { kind: ACTION_EFFECT_KINDS.DELAY, re: /行動順(?:が|を)([XYZ])[%％](?:分)?遅延/g },
]);

/** 説明文のうち、該当表現を含む一文だけを切り出す (利用者が検証できるように) */
function sentenceAround(text, index) {
    const separators = /[。\n]/;
    let start = 0;
    for (let i = index; i > 0; i--) {
        if (separators.test(text[i - 1])) { start = i; break; }
    }
    let end = text.length;
    for (let i = index; i < text.length; i++) {
        if (separators.test(text[i])) { end = i + 1; break; }
    }
    return text.slice(start, end).trim();
}

/** SPD 系ステータスを行動順イベントへ変換する。該当なしなら空配列。 */
function speedRowsFromStats(stats) {
    if (!stats || typeof stats !== 'object') return [];
    const rows = [];
    const percent = Number(stats[STAT.SPD_PERCENT]);
    const flat = Number(stats[STAT.SPD_FLAT]);
    if (Number.isFinite(percent) && percent !== 0) {
        rows.push({ kind: ACTION_EFFECT_KINDS.SPEED_PCT, value: percent * 100 });
    }
    if (Number.isFinite(flat) && flat !== 0) {
        rows.push({ kind: ACTION_EFFECT_KINDS.SPEED_FLAT, value: flat });
    }
    return rows;
}

/** 光円錐の重畳依存フィールドを配列/関数の両方に対応して取り出す */
function resolveBySuperimpose(value, superimpose) {
    if (typeof value === 'function') {
        try { return value(superimpose); } catch { return null; }
    }
    if (Array.isArray(value) && value.length === 5 && superimpose >= 1 && superimpose <= 5) {
        return value[superimpose - 1];
    }
    return value;
}

/** partyEffects / selfEffects を (effect, scope) の組へ平坦化する */
function flattenEffects(source, superimpose) {
    const groups = [];
    const add = (effects, scope) => {
        const resolved = resolveBySuperimpose(effects, superimpose);
        if (!Array.isArray(resolved)) return;
        for (const effect of resolved) {
            if (effect && typeof effect === 'object') groups.push({ effect, scope });
        }
    };
    add(source.partyEffects, 'party');
    add(source.selfEffects, 'self');
    add(source.partyEffects?.pc2, 'party.pc2');
    add(source.partyEffects?.pc4, 'party.pc4');
    add(source.selfEffects?.pc2, 'self.pc2');
    add(source.selfEffects?.pc4, 'self.pc4');
    return groups;
}

/** 効果の stats を取り出す (computeStats はレベル依存のため対象外) */
function effectStats(effect) {
    if (effect.stats && typeof effect.stats === 'object') return effect.stats;
    return null;
}

/** skills.<key>.levels[].advance のようなレベル別の行動値短縮を拾う */
function skillAdvanceRows(source) {
    const rows = [];
    const skills = source.skills;
    if (!skills || typeof skills !== 'object') return rows;
    for (const [skillKey, skill] of Object.entries(skills)) {
        if (!skill || typeof skill !== 'object' || !Array.isArray(skill.levels)) continue;
        const levels = skill.levels
            .map(level => (level && Number.isFinite(Number(level.advance)) ? Number(level.advance) * 100 : null));
        if (!levels.some(value => value !== null)) continue;
        rows.push({
            kind: ACTION_EFFECT_KINDS.ADVANCE,
            origin: 'skillLevels',
            path: `skills.${skillKey}`,
            effectName: skill.name || skillKey,
            description: skill.description || '',
            value: null,
            levels,
            note: '軌跡レベルで値が変わる。levels[軌跡Lv-1] を使う。',
        });
    }
    return rows;
}

/**
 * hooks 内の advanceAction(...) 呼び出しを検出する (数値が定数なら拾う)。
 * 遺物・オーナメントは pc2 / pc4 の下にも hooks を持つため、そちらも見る。
 */
function hookAdvanceRows(source, superimpose) {
    const rows = [];
    const scan = (rawHooks, prefix) => {
        const hooks = resolveBySuperimpose(rawHooks, superimpose);
        if (!hooks || typeof hooks !== 'object') return;
        for (const [hookName, hook] of Object.entries(hooks)) {
            if (typeof hook !== 'function') continue;
            const body = String(hook);
            if (!body.includes('advanceAction')) continue;
            const literal = body.match(/advanceAction\?\.\(\s*(-?[0-9]+(?:\.[0-9]+)?)\s*\)/);
            rows.push({
                kind: ACTION_EFFECT_KINDS.ADVANCE,
                origin: 'hook',
                path: `${prefix}.${hookName}`,
                effectName: hookName,
                description: '',
                value: literal ? Number(literal[1]) * 100 : null,
                note: literal
                    ? '戦闘シミュ用フックの定数値。'
                    : '戦闘シミュ用フックで動的に決まるため、値は説明文または重畳段階から判断する。',
            });
        }
    };
    scan(source.hooks, 'hooks');
    scan(source.pc2?.hooks, 'pc2.hooks');
    scan(source.pc4?.hooks, 'pc4.hooks');
    return rows;
}

/** オブジェクトを再帰的に辿り、文字列フィールドを (path, text) で列挙する */
function walkStrings(value, path, out, depth = 0) {
    if (depth > 8 || value == null) return out;
    if (typeof value === 'string') {
        if (value.length >= 4) out.push({ path, text: value });
        return out;
    }
    if (typeof value !== 'object') return out;
    if (Array.isArray(value)) {
        value.forEach((item, index) => walkStrings(item, `${path}[${index}]`, out, depth + 1));
        return out;
    }
    for (const [key, item] of Object.entries(value)) {
        if (typeof item === 'function') continue;
        walkStrings(item, path ? `${path}.${key}` : key, out, depth + 1);
    }
    return out;
}

/** 説明文から行動順操作を抽出する */
function descriptionRows(source) {
    const rows = [];
    const seen = new Set();
    for (const { path, text } of walkStrings(source, '', [])) {
        if (!text.includes('行動順') && !text.includes('行動値')) continue;
        const push = (kind, value, placeholder, matchIndex) => {
            const sentence = sentenceAround(text, matchIndex);
            const key = `${kind}|${value ?? placeholder}|${sentence}`;
            if (seen.has(key)) return;
            seen.add(key);
            rows.push({
                kind,
                origin: 'description',
                path,
                effectName: '',
                description: sentence,
                value,
                placeholder: placeholder || null,
                sentence,
                note: '説明文からの抽出。対象 (自分/味方/敵) と発動条件は文面で確認すること。',
            });
        };
        for (const { kind, re } of DESCRIPTION_PATTERNS) {
            re.lastIndex = 0;
            let match;
            while ((match = re.exec(text)) !== null) push(kind, Number(match[1]), null, match.index);
        }
        for (const { kind, re } of DESCRIPTION_PLACEHOLDER_PATTERNS) {
            re.lastIndex = 0;
            let match;
            while ((match = re.exec(text)) !== null) push(kind, null, match[1], match.index);
        }
    }
    return rows;
}

/** 1 エントリ (キャラ/光円錐/セット) 分の行動順関連効果を集める */
function collectFromSource(sourceType, source, { superimpose = null } = {}) {
    const base = {
        sourceType,
        sourceId: source.id,
        sourceName: source.name || source.id,
        superimpose,
    };
    const rows = [];

    // 1. 効果枠の SPD ステータス
    for (const { effect, scope } of flattenEffects(source, superimpose)) {
        for (const row of speedRowsFromStats(effectStats(effect))) {
            rows.push({
                ...base, ...row,
                origin: 'stats',
                path: `${scope}.${effect.id}`,
                effectId: effect.id,
                effectName: effect.name || effect.id,
                description: effect.description || '',
                target: effect.target || (scope.startsWith('self') ? 'self' : 'all'),
                defaultActive: Boolean(effect.defaultActive),
                minEidolon: effect.minEidolon ?? null,
            });
        }
    }

    // 2. 常時加算ステ (軌跡ノード / 光円錐ステ / セット 2pc・4pc)
    const passiveStatSources = [
        { path: 'traces.stats', stats: source.traces?.stats },
        { path: 'stats', stats: resolveBySuperimpose(source.stats, superimpose) },
        { path: 'pc2.stats', stats: source.pc2?.stats },
        { path: 'pc4.stats', stats: source.pc4?.stats },
    ];
    for (const { path, stats } of passiveStatSources) {
        for (const row of speedRowsFromStats(stats)) {
            rows.push({
                ...base, ...row,
                origin: 'stats',
                path,
                effectId: null,
                effectName: path,
                description: '常時加算。装備・軌跡の時点で最終速度に含まれる。',
                target: 'self',
                defaultActive: true,
                alwaysOn: true,
            });
        }
    }

    // 3. レベル別の行動値短縮 / フック / 説明文
    for (const row of skillAdvanceRows(source)) rows.push({ ...base, ...row });
    for (const row of hookAdvanceRows(source, superimpose)) rows.push({ ...base, ...row });
    for (const row of descriptionRows(source)) rows.push({ ...base, ...row });

    return rows;
}

/**
 * 登録済みデータ全体から行動順関連の効果を集める。
 * 光円錐は重畳で値が変わる場合があるため、superimpose を指定するとその段階で解決する。
 */
export function collectActionEffects({ superimpose = 1 } = {}) {
    const rows = [];
    for (const item of Registry.character.list()) rows.push(...collectFromSource('character', item));
    for (const item of Registry.lightcone.list()) rows.push(...collectFromSource('lightcone', item, { superimpose }));
    for (const item of Registry.relicSet.list()) rows.push(...collectFromSource('relic', item));
    for (const item of Registry.ornament.list()) rows.push(...collectFromSource('ornament', item));
    return rows;
}

function normalizeText(value) {
    return String(value || '').normalize('NFKC').toLocaleLowerCase('ja');
}

/**
 * 名前・ID で行動順関連の効果を検索する。
 * queries が空なら全件 (limit まで) を返す。
 */
export function searchActionEffects({ queries = [], kinds = null, origins = null, limit = 40, superimpose = 1 } = {}) {
    const needles = [...new Set(queries.map(value => String(value || '').trim()).filter(Boolean))]
        .map(normalizeText);
    const kindFilter = Array.isArray(kinds) && kinds.length ? new Set(kinds) : null;
    const originFilter = Array.isArray(origins) && origins.length ? new Set(origins) : null;

    const matched = collectActionEffects({ superimpose }).filter(row => {
        if (kindFilter && !kindFilter.has(row.kind)) return false;
        if (originFilter && !originFilter.has(row.origin)) return false;
        if (!needles.length) return true;
        const haystack = normalizeText([
            row.sourceId, row.sourceName, row.effectName, row.description, row.path,
        ].filter(Boolean).join(' '));
        return needles.some(needle => haystack.includes(needle));
    });

    return {
        total: matched.length,
        truncated: matched.length > limit,
        effects: matched.slice(0, limit),
    };
}

/**
 * 行動順効果を、行動順パネルのイベント形へ変換する。
 * delay は advance の負値として表現する (ゲージを戻す)。
 * value が未確定 (レベル依存・伏字) の場合は null を返し、呼び出し側で値を決めさせる。
 */
export function toPanelEvent(row, { timing = 'turn', offset = 0, atAV = 0, level = null } = {}) {
    let value = row.value;
    if (value === null && Array.isArray(row.levels) && level != null) {
        value = row.levels[level - 1] ?? null;
    }
    if (value === null || value === undefined) return null;

    const type = row.kind === ACTION_EFFECT_KINDS.DELAY
        ? ACTION_EFFECT_KINDS.ADVANCE
        : row.kind;
    const signedValue = row.kind === ACTION_EFFECT_KINDS.DELAY ? -value : value;

    return {
        type,
        value: signedValue,
        name: row.effectName || row.sourceName,
        timing: timing === 'cum' ? 'cum' : 'turn',
        offset: timing === 'cum' ? 0 : offset,
        atAV: timing === 'cum' ? atAV : 0,
    };
}
