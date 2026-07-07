import { PATH } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';
import { STAT } from '../../build/statKeys.js';

const PATH_BY_NAME = Object.freeze({
    Destruction: PATH.DESTRUCTION,
    'The Hunt': PATH.HUNT,
    Erudition: PATH.ERUDITION,
    Harmony: PATH.HARMONY,
    Nihility: PATH.NIHILITY,
    Preservation: PATH.PRESERVATION,
    Abundance: PATH.ABUNDANCE,
    Remembrance: PATH.REMEMBRANCE,
    Elation: PATH.ELATION,
});

const STAT_LABELS = Object.freeze({
    [STAT.HP_PERCENT]: 'HP',
    [STAT.ATK_PERCENT]: '攻撃力',
    [STAT.DEF_PERCENT]: '防御力',
    [STAT.SPD_PERCENT]: '速度',
    [STAT.SPD_FLAT]: '速度固定',
    [STAT.CRIT_RATE]: '会心率',
    [STAT.CRIT_DMG]: '会心ダメ',
    [STAT.DMG_ALL]: '与ダメ',
    [STAT.DMG_BASIC]: '通常与ダメ',
    [STAT.DMG_SKILL]: '戦闘スキル与ダメ',
    [STAT.DMG_ULT]: '必殺与ダメ',
    [STAT.DMG_FOLLOWUP]: '追加攻撃与ダメ',
    [STAT.DEF_IGNORE]: '防御無視',
    [STAT.DEF_DOWN]: '防御ダウン',
    [STAT.RES_PEN]: '耐性貫通',
    [STAT.DMG_TAKEN]: '敵被ダメ',
    [STAT.SEP_MULT]: '別枠',
    [STAT.BREAK_EFFECT]: '撃破特効',
    [STAT.ENERGY_REGEN]: 'EP回復効率',
    [STAT.EFFECT_HIT_RATE]: '効果命中',
    [STAT.EFFECT_RES]: '効果抵抗',
    [STAT.HEAL_BONUS]: '治癒量',
    [STAT.HEAL_TAKEN]: '被治癒',
});

function siIndex(superimpose) {
    return Math.max(0, Math.min(4, (superimpose || 1) - 1));
}

function valueAt(values, superimpose) {
    return values[siIndex(superimpose)] ?? 0;
}

function resolveEntries(entries = [], superimpose) {
    const out = {};
    for (const entry of entries) {
        const value = valueAt(entry.values, superimpose);
        out[entry.key] = (out[entry.key] || 0) + value;
    }
    return out;
}

function effectName(baseName, effect, superimpose) {
    const stats = resolveEntries(effect.stats, superimpose);
    const labels = Object.keys(stats).map(key => STAT_LABELS[key] || key).join('+') || effect.name;
    const parts = Object.values(stats)
        .filter(v => typeof v === 'number' && v !== 0)
        .map(v => `${(v * 100).toFixed(Math.abs(v) < 1 ? 1 : 0)}%`);
    return parts.length ? `${baseName}: ${labels} ${parts.join(' / ')}` : `${baseName}: ${labels}`;
}

function resolveEffects(baseName, effects = [], superimpose) {
    return effects.map(effect => ({
        id: effect.id,
        source: 'lc',
        name: effectName(baseName, effect, superimpose),
        description: effect.description || effect.name,
        stats: resolveEntries(effect.stats, superimpose),
        defaultActive: effect.defaultActive ?? false,
        target: effect.target || 'single',
        duration: effect.duration ?? 'conditional',
        tickRule: effect.tickRule || 'none',
        dispellable: effect.dispellable ?? false,
        ...(effect.stackable ? { stackable: effect.stackable } : {}),
        ...(effect.baseChance != null ? { baseChance: effect.baseChance } : {}),
        ...(effect.debuffType ? { debuffType: effect.debuffType } : {}),
    }));
}

export function addLightcone(def) {
    Registry.lightcone.add({
        id: def.id,
        name: def.name,
        path: PATH_BY_NAME[def.path] || def.path,
        rarity: def.rarity,
        base: def.base,
        stats: [1, 2, 3, 4, 5].map(si => resolveEntries(def.stats, si)),
        hooks: () => ({}),
        selfEffects: si => resolveEffects(def.name, def.selfEffects, si),
        partyEffects: si => resolveEffects(def.name, def.partyEffects, si),
        enemyEffects: si => resolveEffects(def.name, def.enemyEffects, si),
    });
}
