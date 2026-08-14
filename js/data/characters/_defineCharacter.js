import { ELEMENT, PATH } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';
import { STAT, ELEMENT_DMG_KEYS } from '../../build/statKeys.js';

const ELEMENT_BY_NAME = Object.freeze({
    Physical: ELEMENT.PHYSICAL,
    Fire: ELEMENT.FIRE,
    Ice: ELEMENT.ICE,
    Lightning: ELEMENT.LIGHTNING,
    Wind: ELEMENT.WIND,
    Quantum: ELEMENT.QUANTUM,
    Imaginary: ELEMENT.IMAGINARY,
});

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

const AGGRO_BY_PATH = Object.freeze({
    [PATH.DESTRUCTION]: 125,
    [PATH.HUNT]: 75,
    [PATH.ERUDITION]: 75,
    [PATH.HARMONY]: 100,
    [PATH.NIHILITY]: 100,
    [PATH.PRESERVATION]: 150,
    [PATH.ABUNDANCE]: 100,
    [PATH.REMEMBRANCE]: 100,
    [PATH.ELATION]: 100,
});

const TRACE_STAT_BY_LABEL = Object.freeze({
    '最大HP': STAT.HP_PERCENT,
    '攻撃力': STAT.ATK_PERCENT,
    '防御力': STAT.DEF_PERCENT,
    '速度': STAT.SPD_FLAT,
    '会心率': STAT.CRIT_RATE,
    '会心ダメージ': STAT.CRIT_DMG,
    '効果命中': STAT.EFFECT_HIT_RATE,
    '効果抵抗': STAT.EFFECT_RES,
    '撃破特効': STAT.BREAK_EFFECT,
    '治癒量': STAT.HEAL_BONUS,
    '物理ダメージ': ELEMENT_DMG_KEYS.physical,
    '炎ダメージ': ELEMENT_DMG_KEYS.fire,
    '氷ダメージ': ELEMENT_DMG_KEYS.ice,
    '雷ダメージ': ELEMENT_DMG_KEYS.lightning,
    '風ダメージ': ELEMENT_DMG_KEYS.wind,
    '量子ダメージ': ELEMENT_DMG_KEYS.quantum,
    '虚数ダメージ': ELEMENT_DMG_KEYS.imaginary,
});

const EFFECT_STAT_BY_NAME = Object.freeze({
    ATK_FLAT: STAT.ATK_FLAT,
    ATK_PERCENT: STAT.ATK_PERCENT,
    HP_PERCENT: STAT.HP_PERCENT,
    HP_FLAT: STAT.HP_FLAT,
    DEF_PERCENT: STAT.DEF_PERCENT,
    SPD_PERCENT: STAT.SPD_PERCENT,
    SPD_FLAT: STAT.SPD_FLAT,
    CRIT_RATE: STAT.CRIT_RATE,
    CRIT_DMG: STAT.CRIT_DMG,
    CRIT_RATE_BASIC: STAT.CRIT_RATE_BASIC,
    CRIT_RATE_SKILL: STAT.CRIT_RATE_SKILL,
    CRIT_RATE_ULT: STAT.CRIT_RATE_ULT,
    CRIT_RATE_FOLLOWUP: STAT.CRIT_RATE_FOLLOWUP,
    CRIT_DMG_BASIC: STAT.CRIT_DMG_BASIC,
    CRIT_DMG_SKILL: STAT.CRIT_DMG_SKILL,
    CRIT_DMG_ULT: STAT.CRIT_DMG_ULT,
    CRIT_DMG_FOLLOWUP: STAT.CRIT_DMG_FOLLOWUP,
    DMG_ALL: STAT.DMG_ALL,
    DMG_BASIC: STAT.DMG_BASIC,
    DMG_SKILL: STAT.DMG_SKILL,
    DMG_ULT: STAT.DMG_ULT,
    DMG_FOLLOWUP: STAT.DMG_FOLLOWUP,
    DEF_DOWN: STAT.DEF_DOWN,
    DEF_IGNORE: STAT.DEF_IGNORE,
    DEF_IGNORE_BASIC: STAT.DEF_IGNORE_BASIC,
    DEF_IGNORE_SKILL: STAT.DEF_IGNORE_SKILL,
    DEF_IGNORE_ULT: STAT.DEF_IGNORE_ULT,
    DEF_IGNORE_FOLLOWUP: STAT.DEF_IGNORE_FOLLOWUP,
    RES_PEN: STAT.RES_PEN,
    RES_PEN_BASIC: STAT.RES_PEN_BASIC,
    RES_PEN_SKILL: STAT.RES_PEN_SKILL,
    RES_PEN_ULT: STAT.RES_PEN_ULT,
    RES_PEN_FOLLOWUP: STAT.RES_PEN_FOLLOWUP,
    DMG_TAKEN: STAT.DMG_TAKEN,
    DMG_TAKEN_BASIC: STAT.DMG_TAKEN_BASIC,
    DMG_TAKEN_SKILL: STAT.DMG_TAKEN_SKILL,
    DMG_TAKEN_ULT: STAT.DMG_TAKEN_ULT,
    DMG_TAKEN_FOLLOWUP: STAT.DMG_TAKEN_FOLLOWUP,
    BREAK_EFFECT: STAT.BREAK_EFFECT,
    ENERGY_REGEN: STAT.ENERGY_REGEN,
    EFFECT_HIT_RATE: STAT.EFFECT_HIT_RATE,
    EFFECT_RES: STAT.EFFECT_RES,
    HEAL_BONUS: STAT.HEAL_BONUS,
    HEAL_TAKEN: STAT.HEAL_TAKEN,
    DMG_PHYSICAL: ELEMENT_DMG_KEYS.physical,
    DMG_FIRE: ELEMENT_DMG_KEYS.fire,
    DMG_ICE: ELEMENT_DMG_KEYS.ice,
    DMG_LIGHTNING: ELEMENT_DMG_KEYS.lightning,
    DMG_WIND: ELEMENT_DMG_KEYS.wind,
    DMG_QUANTUM: ELEMENT_DMG_KEYS.quantum,
    DMG_IMAGINARY: ELEMENT_DMG_KEYS.imaginary,
});

function addTrace(stats, entry) {
    const key = TRACE_STAT_BY_LABEL[entry.label];
    if (!key) return null;
    stats[key] = (stats[key] || 0) + entry.value;
    return { node: entry.label, stat: key, value: entry.value };
}

function buildTraces(traceBonuses) {
    const stats = {};
    const breakdown = [];
    for (const entry of traceBonuses || []) {
        const row = addTrace(stats, entry);
        if (row) breakdown.push(row);
    }
    return { stats, breakdown };
}

function scaleLevels(values, key = 'atk') {
    return values.map(value => ({ [key]: value }));
}

function isAttackSkill(skill) {
    return skill.type === 'attack' || skill.type === 'follow_up';
}

function generatedMaxLevel(skillKey, levels) {
    const withEidolon = levels?.length || null;
    const lowerKey = skillKey.toLowerCase();
    if (!withEidolon) return undefined;

    if (lowerKey.includes('basic') || lowerKey.includes('memoryskill') || lowerKey.includes('memorytalent')) {
        return { default: Math.min(6, withEidolon), withEidolon };
    }
    if (lowerKey.includes('skill') || lowerKey.includes('ult') || lowerKey.includes('talent')) {
        return { default: Math.min(10, withEidolon), withEidolon };
    }
    return { default: withEidolon, withEidolon };
}

function generatedSkillDefaults(skillKey, skill, def, element) {
    const attack = isAttackSkill(skill);
    const common = {
        hitSplit: attack ? [1.0] : [],
    };
    if (attack) common.element = element;

    if (skillKey === 'basic' || skillKey === 'enhancedBasic') {
        return { ...common, spGain: 1, energyGain: 20, toughness: attack ? 10 : 0 };
    }
    if (skillKey === 'skill') {
        return { ...common, spCost: 1, energyGain: 30, toughness: attack ? 20 : 0 };
    }
    if (skillKey === 'ult') {
        return {
            ...common,
            energyCost: def.maxEnergy,
            energyGain: 5,
            spCost: 0,
            toughness: attack ? 30 : 0,
        };
    }
    if (skillKey === 'memorySkill') {
        return { ...common, spCost: 0, energyGain: 0, toughness: attack ? 20 : 0 };
    }
    return common;
}

function cloneLevels(levels) {
    if (!Array.isArray(levels)) return undefined;
    return levels.map(level => ({ ...level }));
}

function makeGeneratedSkill(def, element, skillKey, rawSkill) {
    const levels = cloneLevels(rawSkill.levels);
    const skill = {
        ...rawSkill,
    };
    if (levels) skill.levels = levels;
    const defaults = generatedSkillDefaults(skillKey, skill, def, element);
    return {
        ...defaults,
        ...skill,
        maxLevel: skill.maxLevel || generatedMaxLevel(skillKey, levels),
    };
}

function makeCharacterSkills(def, element) {
    if (!def.skills) return makeGenericSkills(def, element);

    const skills = {};
    for (const [skillKey, rawSkill] of Object.entries(def.skills)) {
        skills[skillKey] = makeGeneratedSkill(def, element, skillKey, rawSkill);
    }
    return skills;
}

function resolveEffectStat(statName) {
    const stat = EFFECT_STAT_BY_NAME[statName];
    if (!stat) throw new Error(`[character effect] unknown stat name: ${statName}`);
    return stat;
}

function normalizeEffectStats(stats) {
    if (!stats) return undefined;
    const out = {};
    for (const [statName, value] of Object.entries(stats)) {
        out[resolveEffectStat(statName)] = value;
    }
    return out;
}

function normalizeStepValues(stepValues) {
    if (!stepValues) return undefined;
    const out = {};
    for (const [step, stats] of Object.entries(stepValues)) {
        out[step] = normalizeEffectStats(stats);
    }
    return out;
}

function normalizeEffect(effect) {
    if (!effect || typeof effect !== 'object') return effect;

    const {
        stats,
        stat,
        value,
        statField,
        statFields,
        compute,
        sourceStat,
        ratioField,
        flatField,
        ratio,
        cap,
        threshold,
        step,
        valuePerStep,
        stackable,
        ...rest
    } = effect;
    const normalized = { ...rest };

    if (stats) {
        normalized.stats = normalizeEffectStats(stats);
    } else if (stat && typeof value === 'number') {
        normalized.stats = { [resolveEffectStat(stat)]: value };
    }

    if (compute === 'casterDerivedRatio' && stat && sourceStat && ratioField) {
        const statKey = resolveEffectStat(stat);
        normalized.computeStats = (lv, mult, casterStats) => {
            const baseValue = casterStats?.derived?.[sourceStat] ?? casterStats?.raw?.[sourceStat] ?? 0;
            return { [statKey]: baseValue * (mult?.[ratioField] ?? 0) + (flatField ? (mult?.[flatField] ?? 0) : 0) };
        };
    } else if (compute === 'casterRawRatioCap' && stat && sourceStat && typeof ratio === 'number') {
        const statKey = resolveEffectStat(stat);
        normalized.computeStats = (_lv, _mult, casterStats) => {
            const value = (casterStats?.raw?.[sourceStat] ?? 0) * ratio;
            return { [statKey]: typeof cap === 'number' ? Math.min(value, cap) : value };
        };
    } else if (compute === 'casterDerivedFixedRatio' && stat && sourceStat && typeof ratio === 'number') {
        const statKey = resolveEffectStat(stat);
        normalized.computeStats = (_lv, _mult, casterStats) => {
            const baseValue = casterStats?.derived?.[sourceStat] ?? casterStats?.raw?.[sourceStat] ?? 0;
            const value = baseValue * ratio;
            return { [statKey]: typeof cap === 'number' ? Math.min(value, cap) : value };
        };
    } else if (compute === 'casterDerivedExcessStepCap' && stat && sourceStat) {
        const statKey = resolveEffectStat(stat);
        normalized.computeStats = (_lv, _mult, casterStats) => {
            const baseValue = casterStats?.derived?.[sourceStat] ?? casterStats?.raw?.[sourceStat] ?? 0;
            const steps = Math.max(0, Math.floor((baseValue - (threshold ?? 0)) / (step || 1)));
            const value = steps * (valuePerStep ?? 0);
            return { [statKey]: typeof cap === 'number' ? Math.min(value, cap) : value };
        };
    } else if (stat && statField) {
        const statKey = resolveEffectStat(stat);
        normalized.computeStats = (lv, mult) => ({ [statKey]: mult?.[statField] ?? 0 });
    } else if (statFields) {
        const entries = Object.entries(statFields).map(([statName, field]) => [resolveEffectStat(statName), field]);
        normalized.computeStats = (lv, mult) => {
            const out = {};
            for (const [statKey, field] of entries) out[statKey] = mult?.[field] ?? 0;
            return out;
        };
    }

    if (stackable) {
        normalized.stackable = {
            ...stackable,
            stepValues: normalizeStepValues(stackable.stepValues),
        };
    }
    return normalized;
}

function normalizeEffects(effects) {
    return Array.isArray(effects) ? effects.map(normalizeEffect) : [];
}

function makeGenericSkills(def, element) {
    return {
        basic: {
            name: '通常攻撃',
            type: 'attack',
            target: 'single',
            element,
            spGain: 1,
            energyGain: 20,
            toughness: 10,
            hitSplit: [1.0],
            description: `${def.name}の攻撃力X%分の${def.elementLabel}属性ダメージを与える。倍率は暫定の汎用枠。`,
            maxLevel: { default: 6, withEidolon: 6 },
            levels: scaleLevels([0.50, 0.60, 0.70, 0.80, 0.90, 1.00]),
        },
        skill: {
            name: '戦闘スキル',
            type: 'attack',
            target: 'single',
            element,
            spCost: 1,
            energyGain: 30,
            toughness: 20,
            hitSplit: [1.0],
            description: `${def.name}の攻撃力X%分の${def.elementLabel}属性ダメージを与える。倍率は暫定の汎用枠。`,
            maxLevel: { default: 10, withEidolon: 10 },
            levels: scaleLevels([1.00, 1.10, 1.20, 1.30, 1.40, 1.50, 1.62, 1.75, 1.87, 2.00]),
        },
        ult: {
            name: '必殺技',
            type: 'attack',
            target: 'all',
            element,
            energyCost: def.maxEnergy,
            energyGain: 5,
            spCost: 0,
            toughness: 30,
            hitSplit: [1.0],
            description: `敵全体に${def.name}の攻撃力X%分の${def.elementLabel}属性ダメージを与える。倍率は暫定の汎用枠。`,
            maxLevel: { default: 10, withEidolon: 10 },
            levels: scaleLevels([1.20, 1.32, 1.44, 1.56, 1.68, 1.80, 1.95, 2.10, 2.25, 2.40]),
        },
        talent: {
            name: '天賦',
            type: 'passive',
            description: '個別効果は未登録。必要な条件付き効果は今後 selfEffects / partyEffects に追加する。',
            maxLevel: { default: 10, withEidolon: 10 },
            levels: scaleLevels([0.10, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.20], 'generic'),
        },
        technique: {
            name: '秘技',
            type: 'support',
            description: '秘技の個別効果は未登録。',
        },
    };
}

export function idFromEnglishName(name) {
    return name
        .toLowerCase()
        .replace(/lv\./g, 'lv_')
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
}

export function addCharacter(def) {
    const element = ELEMENT_BY_NAME[def.element] || def.element;
    const path = PATH_BY_NAME[def.path] || def.path;
    Registry.character.add({
        id: def.id || idFromEnglishName(def.englishName),
        name: def.name,
        aliases: Array.isArray(def.aliases) ? [...def.aliases] : [],
        element,
        path,
        rarity: def.rarity,
        base: {
            atk: def.base.atk,
            hp: def.base.hp,
            def: def.base.def,
            spd: def.base.spd,
            aggro: AGGRO_BY_PATH[path] || 100,
        },
        maxEnergy: def.maxEnergy,
        traces: buildTraces(def.traceBonuses),
        eidolons: {},
        eidolonsDetail: def.eidolonsDetail || {},
        skills: makeCharacterSkills(def, element),
        partyEffects: normalizeEffects(def.partyEffects),
        selfEffects: normalizeEffects(def.selfEffects),
        enemyEffects: normalizeEffects(def.enemyEffects),
        // 必殺技回転用の、数値が確定したEP供給効果。説明文を解析せずこの構造だけを使う。
        energyEffects: Array.isArray(def.energyEffects) ? def.energyEffects.map(effect => ({ ...effect })) : [],
        extras: def.extras || [],
        wiki: def.wiki,
        implementationStatus: {
            source: def.skills ? 'wiki_character_pages' : 'wiki_roster_table',
            skillMultipliers: def.skills ? 'wiki_trace_tables' : 'provisional_generic',
        },
    });
}
