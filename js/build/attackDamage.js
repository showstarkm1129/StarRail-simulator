// attackDamage.js — キャラクターの攻撃スキル定義から実ダメージ行を組み立てる。
//
// 複雑な固有攻撃は skill.damageComponents で明示できる。未指定の場合は、既存データで
// 一般的な atk / hpPct / def 系の倍率だけを安全に解決し、推測できない攻撃は返さない。

import { Diminishing } from './diminishing.js';
import { getTraceLevelCap, getSkillMultAt } from './skillUtil.js';

const ATTACK_TYPES = new Set(['attack', 'follow_up']);
const ENEMY_TARGETS = new Set(['single', 'blast', 'all', 'bounce']);
const COMPONENT_STATS = new Set(['atk', 'hp', 'def', 'reference']);

const SKILL_KIND_LABELS = Object.freeze({
    basic: '通常攻撃',
    skill: '戦闘スキル',
    ult: '必殺技',
    followup: '追加攻撃',
    other: 'その他',
});

const TARGET_LABELS = Object.freeze({
    single: '単体',
    blast: '拡散（主対象）',
    all: '全体（敵1体）',
    bounce: 'バウンド（1段）',
});

const STAT_CANDIDATES = Object.freeze({
    atk: ['atk', 'atkSingle', 'atkAll', 'bounceAtk'],
    hp: ['hpPct', 'hp', 'singleHpPct', 'hpPctAll', 'hpPctBounce'],
    def: ['def', 'defPct', 'defPctAll'],
});

function damageTypeFor(skillKey, skill) {
    if (skill.type === 'follow_up') return 'followup';
    if (skillKey === 'basic' || skillKey.toLowerCase().includes('basic')) return 'basic';
    if (skillKey === 'ult' || skillKey.toLowerCase().includes('ult')) return 'ult';
    if (skillKey === 'skill' || skillKey.toLowerCase().includes('skill')) return 'skill';
    return 'base';
}

function kindLabel(type) {
    return SKILL_KIND_LABELS[type === 'base' ? 'other' : type] || SKILL_KIND_LABELS.other;
}

function orderedKeys(stat, target) {
    const keys = [...STAT_CANDIDATES[stat]];
    const preferred = target === 'all'
        ? ({ atk: 'atkAll', hp: 'hpPctAll', def: 'defPctAll' })[stat]
        : target === 'bounce'
            ? ({ atk: 'bounceAtk', hp: 'hpPctBounce' })[stat]
            : target === 'single' || target === 'blast'
                ? ({ atk: 'atkSingle', hp: 'singleHpPct' })[stat]
                : null;
    return preferred ? [preferred, ...keys.filter(key => key !== preferred)] : keys;
}

function scalingOrder(skill) {
    if (COMPONENT_STATS.has(skill.scalingStat)) return [skill.scalingStat];
    const multiplier = skill.mult || skill.levels?.[0] || {};
    const hasKey = stat => STAT_CANDIDATES[stat].some(key => Number.isFinite(Number(multiplier[key])));
    const keyedStats = ['atk', 'hp', 'def'].filter(hasKey);
    if (keyedStats.length > 0) return keyedStats;
    const description = String(skill.description || '');
    if (/防御力/.test(description)) return ['def'];
    if (/(?:最大)?HP/.test(description)) return ['hp'];
    if (/攻撃力/.test(description)) return ['atk'];
    return ['atk', 'hp', 'def'];
}

function resolveGenericComponent(skill, multiplier) {
    for (const stat of scalingOrder(skill)) {
        for (const key of orderedKeys(stat, skill.target)) {
            const value = Number(multiplier?.[key]);
            if (Number.isFinite(value) && value > 0) {
                return {
                    scalingStat: stat,
                    multiplierKey: key,
                    multiplier: value,
                    target: skill.damageTarget || skill.target,
                };
            }
        }
    }
    const fallback = Object.entries(multiplier || {}).find(([key, value]) => {
        if (!Number.isFinite(Number(value)) || Number(value) <= 0) return false;
        return !/(cost|gain|energy|toughness|ignore|down|pen|buff|amp|min|max|chance|count|flat)/i.test(key);
    });
    if (fallback) {
        const [key, value] = fallback;
        const stat = /^hp/i.test(key) ? 'hp' : /^def/i.test(key) ? 'def' : 'atk';
        return {
            scalingStat: stat,
            multiplierKey: key,
            multiplier: Number(value),
            target: skill.damageTarget || skill.target,
        };
    }
    return null;
}

function resolveComponents(skill, levelMultiplier) {
    if (Array.isArray(skill.damageComponents)) {
        return skill.damageComponents
            .map(component => normalizeComponent(component, skill, levelMultiplier))
            .filter(Boolean);
    }
    const generic = resolveGenericComponent(skill, levelMultiplier);
    const normalized = generic ? normalizeComponent(generic, skill, levelMultiplier) : null;
    return normalized ? [normalized] : [];
}

function fillMissingMultipliers(skill, level, levelMultiplier) {
    const out = { ...levelMultiplier };
    for (const key of Object.keys(out)) {
        if (typeof out[key] === 'number' && Number.isFinite(out[key])) continue;
        for (let index = Math.min(level - 2, (skill.levels?.length || 0) - 1); index >= 0; index -= 1) {
            const previous = skill.levels?.[index]?.[key];
            if (typeof previous === 'number' && Number.isFinite(previous)) {
                out[key] = previous;
                break;
            }
        }
    }
    return out;
}

function normalizeComponent(component, skill, levelMultiplier) {
    const scalingStat = component.scalingStat || component.stat
        || (component.referenceKey ? 'reference' : null);
    const multiplier = Number(component.multiplier ?? levelMultiplier?.[component.multiplierKey]);
    const target = component.target || skill.damageTarget || skill.target;
    if (!COMPONENT_STATS.has(scalingStat) || !ENEMY_TARGETS.has(target)
        || !Number.isFinite(multiplier) || multiplier <= 0) return null;
    return { ...component, scalingStat, target, multiplier };
}

function damageFactor(finalStats, options, damageType, refStat) {
    const factors = Diminishing.computeDamageFactors(finalStats, { ...Diminishing.DEFAULT_OPTIONS, ...options, refStat });
    const baseFactor = refStat === 'reference' ? 1 : factors.atk;
    return baseFactor * factors.break * factors.fixedDmg * factors.sepMult
        * factors.critByType[damageType] * factors.dmgBonusByType[damageType]
        * factors.defByType[damageType] * factors.resByType[damageType]
        * factors.takenByType[damageType];
}

function conditionActive(component, options) {
    if (!component.conditionKey) return true;
    const value = Number(options.referenceValues?.[component.conditionKey] ?? 0);
    const minimum = Number(component.conditionMin ?? 1);
    return Number.isFinite(value) && value >= minimum;
}

function componentBaseValue(component, options) {
    if (!component.referenceKey) return 1;
    const value = Number(options.referenceValues?.[component.referenceKey] ?? component.referenceValue ?? 0);
    return Number.isFinite(value) && value >= 0 ? value : 0;
}

function skillLevel(character, build, skillKey, skill) {
    const max = getTraceLevelCap(skillKey);
    return Math.max(1, Math.min(max, build?.traceLevel?.[skillKey] || max));
}

/**
 * @returns {Array<{skillKey:string,name:string,kind:string,target:string,level:number,scalingStat:string,multiplier:number,damage:number,totalDamage:number|null,hitCount:number|null,active:boolean}>}
 */
export function computeCharacterAttackDamages(character, build, finalStats, options = {}) {
    if (!character?.skills || !finalStats) return [];
    /** @type {Record<string, any>} */
    const resolvedOptions = { ...Diminishing.DEFAULT_OPTIONS, ...options };
    const rows = [];
    for (const [skillKey, skill] of Object.entries(character.skills)) {
        if (!ATTACK_TYPES.has(skill?.type) || skillKey === 'technique') continue;
        const level = skillLevel(character, build, skillKey, skill);
        const levelMultiplier = fillMissingMultipliers(
            skill,
            level,
            { ...(skill.mult || {}), ...(getSkillMultAt(skill, level) || {}) },
        );
        const damageType = skill.damageType || damageTypeFor(skillKey, skill);
        const components = resolveComponents(skill, levelMultiplier);
        for (const component of components) {
            const active = conditionActive(component, resolvedOptions);
            const damage = active
                ? damageFactor(finalStats, resolvedOptions, damageType, component.scalingStat)
                    * componentBaseValue(component, resolvedOptions) * component.multiplier
                : 0;
            const hitCount = Number.isInteger(component.hits) && component.hits > 0
                ? component.hits
                : component.target === 'bounce' && Number.isInteger(skill.bounceCount) && skill.bounceCount > 0
                    ? skill.bounceCount
                    : null;
            rows.push({
                skillKey,
                name: component.label ? `${skill.name || skillKey}（${component.label}）` : (skill.name || skillKey),
                kind: kindLabel(damageType),
                target: TARGET_LABELS[component.target] || component.target || '—',
                level,
                scalingStat: component.scalingStat,
                multiplier: component.multiplier,
                damage,
                totalDamage: hitCount ? damage * hitCount : null,
                hitCount,
                active,
                condition: component.condition || '',
                referenceKey: component.referenceKey || null,
                referenceValue: component.referenceKey ? componentBaseValue(component, resolvedOptions) : null,
                conditionValue: component.conditionKey
                    ? Number(resolvedOptions.referenceValues?.[component.conditionKey] ?? 0)
                    : null,
            });
        }
    }
    return rows;
}
