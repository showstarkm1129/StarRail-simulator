// diminishingValidator.js — 限界効用状態・比較ジョブの構造化検証

import { Registry } from './registry.js';
import { ALL_SLOTS, DAMAGE_SCALE_LIST, ELEMENT_LIST } from './constants.js';
import { ALL_STAT_KEYS, STAT } from './statKeys.js';
import { RELIC_MAIN_OPTIONS } from './relicMainTable.js';
import { SUBSTAT_TABLE } from './substatTable.js';
import {
    createDiminishingState,
    serializeDiminishingState,
} from './diminishingSession.js';
import {
    applyDiminishingChanges,
    expandDiminishingVariations,
    gatherFocusEffects,
    gatherTeammateEffects,
    materializeDiminishingBuild,
} from './diminishingEngine.js';
import { getTraceLevelCap } from './skillUtil.js';

export const DIMINISHING_METRICS = Object.freeze(['finalStats', 'damage', 'differencePercent']);
const VALID_METRICS = new Set(DIMINISHING_METRICS);
const VALID_CHANGE_KEYS = new Set([
    'inputMode', 'build', 'characterId', 'eidolon', 'traceLevel', 'lightcone', 'relics',
    'directStats', 'stats', 'envStats', 'substats', 'subs', 'party', 'options',
    'effectSelection', 'activeSelfEffectIds', 'selfStacksByEffectId', 'visibleRows', 'visibleStats',
    'activeCandidateIds', 'activeCandidateId',
]);
const DIRECT_STAT_KEYS = new Set([
    'atk', 'hp', 'def', 'spd', 'critRate', 'critDmg',
    'critRateBasic', 'critRateSkill', 'critRateUlt', 'critRateFollowup',
    'critDmgBasic', 'critDmgSkill', 'critDmgUlt', 'critDmgFollowup',
    'dmgAll', 'dmgBasic', 'dmgSkill', 'dmgUlt', 'dmgFollowup', 'fixedDmg', 'sepMult',
    'defDown', 'defIgnore', 'defIgnoreBasic', 'defIgnoreSkill', 'defIgnoreUlt', 'defIgnoreFollowup',
    'resPen', 'resPenBasic', 'resPenSkill', 'resPenUlt', 'resPenFollowup',
    'dmgTaken', 'dmgTakenBasic', 'dmgTakenSkill', 'dmgTakenUlt', 'dmgTakenFollowup',
    'breakEffect', 'energyRegen', 'ehr', 'eres',
]);
const STATE_KEYS = new Set([
    'schema', 'inputMode', 'build', 'activeCandidateIds', 'activeCandidateId', 'snapshot', 'direct', 'options', 'party', 'subs',
    'visibleRows', 'visibleStats', 'filterPanelOpen', 'statsPanelOpen',
]);
const BUILD_KEYS = new Set([
    'schemaVersion', 'id', 'name', 'meta', 'characterId', 'eidolon', 'traceLevel',
    'lightcone', 'relics', 'envBuffs', 'activeSelfEffectIds', 'selfStacksByEffectId', 'aiTargetStats',
    // キャラビルドタブが付ける編集用メタ情報。計算には影響しないが、
    // 保存ビルドをそのまま渡せるよう既知項目として許可する。
    //   relicIds   : 部位 → 遺物倉庫の遺物 id (どの実物を装備したか)
    //   subsInput  : サブステの入力方法 (倉庫 / 手入力 / ロール)
    //   candidates : 差し替え候補チップ用の登録済み候補 (例: candidates.lightcone)
    'relicIds', 'subsInput', 'candidates',
]);
const PARTY_KEYS = new Set([
    'mode', 'characterId', 'levelPreset', 'lightcone', 'ornamentId', 'effectSelection',
    'buildId', 'build', 'activeEffectIds', 'stacksByEffectId',
]);
const OPTION_KEYS = new Set(['refStat', 'damageScale', 'enemyLevel', 'enemyBaseRes', 'critMode', 'breakState', 'elementOverride', 'referenceValues']);
const REFERENCE_VALUE_KEYS = new Set(['cumulativeHealing', 'summonHp', 'gluttonyStacks', 'elationDegree', 'elationStacks', 'elationUplift']);
const SUBS_KEYS = new Set(['mode', 'manual', 'total', 'perSlot']);
const ROLL_CONFIG_KEYS = new Set(['allocations', 'tier', 'lastResult']);
const DIRECT_KEYS = new Set(['stats', 'snapshot']);
export const DIMINISHING_FIXED_CONDITIONS = Object.freeze([
    'character', 'equipment', 'party', 'enemy', 'equipment.lightcone',
    ...ALL_SLOTS.map(slot => `equipment.${slot}`),
]);
const FIXED_CONDITIONS = new Set(DIMINISHING_FIXED_CONDITIONS);
const JOB_KEYS = new Set(['objective', 'baseState', 'variations', 'matrix', 'fixedConditions', 'metrics']);
/** @type {Set<string>} */
const FLAT_STAT_KEYS = new Set([
    STAT.ATK_BASE, STAT.HP_BASE, STAT.DEF_BASE, STAT.SPD_BASE,
    STAT.ATK_FLAT, STAT.HP_FLAT, STAT.DEF_FLAT, STAT.SPD_FLAT,
]);
const VALID_TIERS = new Set(['low', 'mid', 'high', 'random']);

function issue(code, path, message, details) {
    return { code, path, message, ...(details === undefined ? {} : { details }) };
}

function inspectFinite(value, path, errors, seen = new Set()) {
    if (value === undefined) {
        errors.push(issue('UNDEFINED_VALUE', path, 'undefined は使用できません。'));
        return;
    }
    if (typeof value === 'number' && !Number.isFinite(value)) {
        errors.push(issue('NON_FINITE_NUMBER', path, 'NaN または無限値は使用できません。'));
        return;
    }
    if (!value || typeof value !== 'object' || seen.has(value)) return;
    seen.add(value);
    const entries = value instanceof Set ? Array.from(value).entries() : Object.entries(value);
    for (const [key, item] of entries) inspectFinite(item, `${path}.${key}`, errors, seen);
}

function validateRange(value, min, max, path, errors) {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) {
        errors.push(issue('NUMBER_OUT_OF_RANGE', path, `${min}〜${max} の数値を指定してください。`, { value, min, max }));
    }
}

function validateIntegerRange(value, min, max, path, errors) {
    if (!Number.isInteger(value) || value < min || value > max) {
        errors.push(issue('INTEGER_OUT_OF_RANGE', path, `${min}〜${max} の整数を指定してください。`, { value, min, max }));
    }
}

function validateKnownKeys(value, allowed, path, errors, code = 'UNKNOWN_FIELD') {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return;
    for (const key of Object.keys(value)) {
        if (!allowed.has(key)) errors.push(issue(code, `${path}.${key}`, `未定義の項目です: ${key}`));
    }
}

function validateDirectStatRange(key, value, path, errors) {
    if (!Number.isFinite(value)) return;
    if (['atk', 'hp', 'def'].includes(key)) validateRange(value, 0, 10_000_000, path, errors);
    else if (key === 'spd') validateRange(value, 0.01, 10_000, path, errors);
    else validateRange(value, -100, 100, path, errors);
}

function validateStatsObject(stats, path, errors, allowedKeys = new Set(ALL_STAT_KEYS)) {
    if (!stats || typeof stats !== 'object' || Array.isArray(stats)) {
        errors.push(issue('INVALID_STATS_OBJECT', path, 'ステータスはオブジェクトで指定してください。'));
        return;
    }
    for (const [key, value] of Object.entries(stats)) {
        if (!allowedKeys.has(key)) errors.push(issue('UNKNOWN_STAT_KEY', `${path}.${key}`, `未登録のステータスキーです: ${key}`));
        if (typeof value !== 'number' || !Number.isFinite(value)) {
            errors.push(issue('INVALID_STAT_VALUE', `${path}.${key}`, 'ステータス値は有限の数値で指定してください。'));
        } else if (allowedKeys === DIRECT_STAT_KEYS) {
            validateDirectStatRange(key, value, `${path}.${key}`, errors);
        } else if (FLAT_STAT_KEYS.has(key)) {
            validateRange(value, -10_000_000, 10_000_000, `${path}.${key}`, errors);
        } else {
            validateRange(value, -100, 100, `${path}.${key}`, errors);
        }
    }
}

function validateBuild(build, path, errors) {
    if (!build || typeof build !== 'object') {
        errors.push(issue('MISSING_BUILD', path, 'ビルドがありません。'));
        return;
    }
    validateKnownKeys(build, BUILD_KEYS, path, errors);
    if (build.activeSelfEffectIds !== undefined && !Array.isArray(build.activeSelfEffectIds)) errors.push(issue('INVALID_EFFECT_IDS', `${path}.activeSelfEffectIds`, '効果IDは配列で指定してください。'));
    if (build.selfStacksByEffectId !== undefined && (
        !build.selfStacksByEffectId || typeof build.selfStacksByEffectId !== 'object' || Array.isArray(build.selfStacksByEffectId)
    )) {
        errors.push(issue('INVALID_EFFECT_STACKS', `${path}.selfStacksByEffectId`, '効果の累積数はIDをキーにしたオブジェクトで指定してください。'));
    }
    if (build.aiTargetStats) validateStatsObject(build.aiTargetStats, `${path}.aiTargetStats`, errors, DIRECT_STAT_KEYS);
    const character = Registry.character.get(build.characterId);
    if (!character) errors.push(issue('UNKNOWN_CHARACTER', `${path}.characterId`, `未登録のキャラIDです: ${build.characterId || '(空)'}`));
    validateIntegerRange(build.eidolon ?? 0, 0, 6, `${path}.eidolon`, errors);
    for (const [skill, level] of Object.entries(build.traceLevel || {})) {
        validateIntegerRange(level, 1, getTraceLevelCap(skill), `${path}.traceLevel.${skill}`, errors);
    }

    const lightconeId = build.lightcone?.id;
    validateKnownKeys(build.lightcone, new Set(['id', 'superimpose']), `${path}.lightcone`, errors);
    validateIntegerRange(build.lightcone?.superimpose ?? 1, 1, 5, `${path}.lightcone.superimpose`, errors);
    if (lightconeId) {
        const lightcone = Registry.lightcone.get(lightconeId);
        if (!lightcone) {
            errors.push(issue('UNKNOWN_LIGHTCONE', `${path}.lightcone.id`, `未登録の光円錐IDです: ${lightconeId}`));
        } else if (character && !character.isTestAllEquipment && lightcone.path && character.path && lightcone.path !== character.path) {
            errors.push(issue('LIGHTCONE_PATH_MISMATCH', `${path}.lightcone.id`, 'キャラの運命と光円錐の運命が一致しません。', {
                characterPath: character.path,
                lightconePath: lightcone.path,
            }));
        }
    }

    validateKnownKeys(build.relics, new Set(ALL_SLOTS), `${path}.relics`, errors, 'UNKNOWN_RELIC_SLOT');
    for (const slot of ALL_SLOTS) {
        const relic = build.relics?.[slot];
        if (!relic) {
            errors.push(issue('MISSING_RELIC_SLOT', `${path}.relics.${slot}`, `遺物部位 ${slot} がありません。`));
            continue;
        }
        validateKnownKeys(relic, new Set(['setId', 'mainStat', 'subs']), `${path}.relics.${slot}`, errors);
        if (relic.mainStat && !RELIC_MAIN_OPTIONS[slot]?.[relic.mainStat]) {
            errors.push(issue('INVALID_MAIN_STAT', `${path}.relics.${slot}.mainStat`, `${slot} には指定できないメインステです: ${relic.mainStat}`));
        }
        if (relic.setId && relic.setId !== 'none') {
            const isRelicSlot = slot === 'head' || slot === 'hands' || slot === 'body' || slot === 'feet';
            const store = isRelicSlot ? Registry.relicSet : Registry.ornament;
            if (!store.has(relic.setId)) {
                errors.push(issue('UNKNOWN_RELIC_SET', `${path}.relics.${slot}.setId`, `部位に対応しない、または未登録のセットIDです: ${relic.setId}`));
            }
        }
        validateStatsObject(relic.subs || {}, `${path}.relics.${slot}.subs`, errors);
    }
    if (build.envBuffs !== undefined && !Array.isArray(build.envBuffs)) errors.push(issue('INVALID_ENV_BUFFS', `${path}.envBuffs`, '環境バフは配列で指定してください。'));
    validateCandidates(build.candidates, `${path}.candidates`, errors);
    for (const [index, buff] of (Array.isArray(build.envBuffs) ? build.envBuffs : []).entries()) {
        if (!ALL_STAT_KEYS.includes(buff.stat)) errors.push(issue('UNKNOWN_STAT_KEY', `${path}.envBuffs.${index}.stat`, `未登録のステータスキーです: ${buff.stat}`));
        if (typeof buff.value !== 'number' || !Number.isFinite(buff.value)) {
            errors.push(issue('INVALID_STAT_VALUE', `${path}.envBuffs.${index}.value`, '環境バフ値は有限の数値で指定してください。'));
        }
    }
}

function validateCandidates(candidates, path, errors) {
    if (candidates === undefined) return;
    if (!candidates || typeof candidates !== 'object' || Array.isArray(candidates)) {
        errors.push(issue('INVALID_CANDIDATES', path, '差分候補はオブジェクトで指定してください。'));
        return;
    }
    validateKnownKeys(candidates, new Set(['items', 'lightcone']), path, errors);
    if (candidates.lightcone !== undefined && !Array.isArray(candidates.lightcone)) {
        errors.push(issue('INVALID_LIGHTCONE_CANDIDATES', `${path}.lightcone`, '光円錐候補は配列で指定してください。'));
    }
    if (candidates.items === undefined) return;
    if (!Array.isArray(candidates.items)) {
        errors.push(issue('INVALID_CANDIDATE_ITEMS', `${path}.items`, '差分候補一覧は配列で指定してください。'));
        return;
    }
    for (const [index, candidate] of candidates.items.entries()) {
        const itemPath = `${path}.items.${index}`;
        validateKnownKeys(candidate, new Set(['id', 'type', 'label', 'description', 'changes']), itemPath, errors);
        if (!candidate || typeof candidate !== 'object') continue;
        if (typeof candidate.id !== 'string' || !candidate.id) errors.push(issue('INVALID_CANDIDATE_ID', `${itemPath}.id`, '候補IDがありません。'));
        if (typeof candidate.type !== 'string' || !candidate.type) errors.push(issue('INVALID_CANDIDATE_TYPE', `${itemPath}.type`, '候補種類がありません。'));
        if (!candidate.changes || typeof candidate.changes !== 'object' || Array.isArray(candidate.changes)) {
            errors.push(issue('INVALID_CANDIDATE_CHANGES', `${itemPath}.changes`, '候補の変更内容がありません。'));
        } else if (!candidate.changes.build || typeof candidate.changes.build !== 'object' || Array.isArray(candidate.changes.build)) {
            errors.push(issue('INVALID_CANDIDATE_BUILD_PATCH', `${itemPath}.changes.build`, '候補は changes.build にビルド差分を指定してください。'));
        }
    }
}

function validateSubstats(subs, path, errors) {
    validateKnownKeys(subs, SUBS_KEYS, path, errors);
    if (!['manual', 'total', 'perSlot'].includes(subs.mode)) {
        errors.push(issue('INVALID_SUBSTAT_MODE', `${path}.mode`, 'サブステモードは manual / total / perSlot のいずれかです。'));
    }
    validateStatsObject(subs.manual || {}, `${path}.manual`, errors);
    validateKnownKeys(subs.total, ROLL_CONFIG_KEYS, `${path}.total`, errors);
    if (!VALID_TIERS.has(subs.total?.tier)) errors.push(issue('INVALID_ROLL_TIER', `${path}.total.tier`, 'ロール段階が不正です。'));
    const validateAllocation = (allocation, allocationPath) => {
        for (const [key, value] of Object.entries(allocation || {})) {
            if (!SUBSTAT_TABLE[key]) errors.push(issue('UNKNOWN_SUBSTAT_KEY', `${allocationPath}.${key}`, `未登録のサブステキーです: ${key}`));
            if (!Number.isInteger(value) || value < 0 || value > 60) {
                errors.push(issue('INVALID_ROLL_COUNT', `${allocationPath}.${key}`, 'ロール数は0〜60の整数で指定してください。'));
            }
        }
    };
    validateAllocation(subs.total?.allocations, `${path}.total.allocations`);
    for (const slot of ALL_SLOTS) {
        validateKnownKeys(subs.perSlot?.[slot], ROLL_CONFIG_KEYS, `${path}.perSlot.${slot}`, errors);
        if (!VALID_TIERS.has(subs.perSlot?.[slot]?.tier)) errors.push(issue('INVALID_ROLL_TIER', `${path}.perSlot.${slot}.tier`, 'ロール段階が不正です。'));
        validateAllocation(subs.perSlot?.[slot]?.allocations, `${path}.perSlot.${slot}.allocations`);
    }
}

function getPartyBuild(slot) {
    if (slot.build) return slot.build;
    if (!slot.characterId) return null;
    const build = {
        characterId: slot.characterId,
        eidolon: 0,
        traceLevel: {},
        lightcone: { id: null, superimpose: 1 },
        relics: Object.fromEntries(ALL_SLOTS.map(slotName => [slotName, {
            setId: null,
            mainStat: slotName === 'head' ? 'hp_flat' : slotName === 'hands' ? 'atk_flat' : null,
            subs: {},
        }])),
        envBuffs: [],
    };
    if (slot.lightcone?.id) build.lightcone = { ...slot.lightcone };
    if (slot.ornamentId) {
        build.relics.sphere.setId = slot.ornamentId;
        build.relics.rope.setId = slot.ornamentId;
    }
    return build;
}

function validateEffects(state, errors, path) {
    const focusEffects = gatherFocusEffects(state.build);
    const focusKeys = new Set(focusEffects.map(item => item.key));
    const activeSelfEffectIds = Array.isArray(state.build.activeSelfEffectIds)
        ? state.build.activeSelfEffectIds
        : [];
    for (const [index, key] of activeSelfEffectIds.entries()) {
        if (!focusKeys.has(key)) errors.push(issue('INAPPLICABLE_SELF_EFFECT', `${path}.build.activeSelfEffectIds.${index}`, `現在の装備条件では適用できない効果です: ${key}`));
    }
    for (const [key, stacks] of Object.entries(state.build.selfStacksByEffectId || {})) {
        const effect = focusEffects.find(item => item.key === key)?.effect;
        if (!effect?.stackable) errors.push(issue('INAPPLICABLE_EFFECT_STACK', `${path}.build.selfStacksByEffectId.${key}`, '累積できない効果です。'));
        else validateIntegerRange(stacks, 1, effect.stackable.max ?? 1, `${path}.build.selfStacksByEffectId.${key}`, errors);
    }
    state.party.forEach((slot, index) => {
        if (slot.characterId && !Registry.character.has(slot.characterId)) {
            errors.push(issue('UNKNOWN_PARTY_CHARACTER', `${path}.party.${index}.characterId`, `未登録のパーティキャラIDです: ${slot.characterId}`));
            return;
        }
        if (slot.ornamentId && !Registry.ornament.has(slot.ornamentId)) {
            errors.push(issue('UNKNOWN_PARTY_ORNAMENT', `${path}.party.${index}.ornamentId`, `未登録の次元界オーナメントIDです: ${slot.ornamentId}`));
        }
        if (slot.lightcone?.id) {
            const lightcone = Registry.lightcone.get(slot.lightcone.id);
            const character = Registry.character.get(slot.characterId);
            if (!lightcone) {
                errors.push(issue('UNKNOWN_PARTY_LIGHTCONE', `${path}.party.${index}.lightcone.id`, `未登録の光円錐IDです: ${slot.lightcone.id}`));
            } else if (character && lightcone.path !== character.path) {
                errors.push(issue('PARTY_LIGHTCONE_PATH_MISMATCH', `${path}.party.${index}.lightcone.id`, 'サポーターの運命と光円錐の運命が一致しません。'));
            }
            validateIntegerRange(slot.lightcone.superimpose ?? 1, 1, 5, `${path}.party.${index}.lightcone.superimpose`, errors);
        }
        if (slot.mode === 'build' && slot.buildId && !slot.build) {
            errors.push(issue('UNRESOLVED_PARTY_BUILD', `${path}.party.${index}.build`, '保存ビルドの実体がありません。状態取得時にビルドを含めてください。'));
            return;
        }
        const partyBuild = getPartyBuild(slot);
        if (!partyBuild) return;
        if (slot.mode === 'build') validateBuild(partyBuild, `${path}.party.${index}.build`, errors);
        const validKeys = new Set(gatherTeammateEffects(partyBuild).map(item => item.key));
        for (const key of slot.activeEffectIds) {
            if (!validKeys.has(key)) errors.push(issue('INAPPLICABLE_PARTY_EFFECT', `${path}.party.${index}.activeEffectIds`, `現在のパーティ条件では適用できない効果です: ${key}`));
        }
        for (const [key, stacks] of Object.entries(slot.stacksByEffectId || {})) {
            const effect = gatherTeammateEffects(partyBuild).find(item => item.key === key)?.effect;
            if (!effect?.stackable) errors.push(issue('INAPPLICABLE_EFFECT_STACK', `${path}.party.${index}.stacksByEffectId.${key}`, '累積できない効果です。'));
            else validateIntegerRange(stacks, 1, effect.stackable.max ?? 1, `${path}.party.${index}.stacksByEffectId.${key}`, errors);
        }
    });
}

function validateOptions(options, path, errors) {
    validateKnownKeys(options, OPTION_KEYS, path, errors);
    if (options.damageScale !== null && !DAMAGE_SCALE_LIST.includes(options.damageScale)) {
        errors.push(issue('INVALID_DAMAGE_SCALE', `${path}.damageScale`, '火力計算系統が不正です。'));
    }
    if (!['atk', 'hp', 'def', 'spd'].includes(options.refStat)) errors.push(issue('INVALID_REF_STAT', `${path}.refStat`, '参照ステータスが不正です。'));
    validateIntegerRange(options.enemyLevel, 1, 100, `${path}.enemyLevel`, errors);
    validateRange(options.enemyBaseRes, -1, 1, `${path}.enemyBaseRes`, errors);
    if (!['expected', 'crit'].includes(options.critMode)) errors.push(issue('INVALID_CRIT_MODE', `${path}.critMode`, '会心モードが不正です。'));
    if (!['normal', 'broken'].includes(options.breakState)) errors.push(issue('INVALID_BREAK_STATE', `${path}.breakState`, '靭性状態が不正です。'));
    if (options.elementOverride !== null && !ELEMENT_LIST.includes(options.elementOverride)) {
        errors.push(issue('INVALID_ELEMENT', `${path}.elementOverride`, '未登録の属性です。'));
    }
    if (options.referenceValues !== undefined) {
        validateKnownKeys(options.referenceValues, REFERENCE_VALUE_KEYS, `${path}.referenceValues`, errors);
        for (const key of REFERENCE_VALUE_KEYS) {
            if (options.referenceValues[key] !== undefined) {
                validateRange(options.referenceValues[key], 0, Number.MAX_SAFE_INTEGER, `${path}.referenceValues.${key}`, errors);
            }
        }
    }
}

export function validateDiminishingState(input, path = '$.baseState') {
    const errors = [];
    inspectFinite(input, path, errors);
    validateKnownKeys(input, STATE_KEYS, path, errors);
    if (input?.party !== undefined && (!Array.isArray(input.party) || input.party.length > 3)) {
        errors.push(issue('INVALID_PARTY', `${path}.party`, 'パーティ枠は3件以下の配列で指定してください。'));
    }
    if (input?.visibleRows !== undefined && !Array.isArray(input.visibleRows)) errors.push(issue('INVALID_VISIBLE_ROWS', `${path}.visibleRows`, '表示行は配列で指定してください。'));
    if (input?.visibleStats !== undefined && !Array.isArray(input.visibleStats)) errors.push(issue('INVALID_VISIBLE_STATS', `${path}.visibleStats`, '表示ステータスは配列で指定してください。'));
    validateKnownKeys(input?.direct, DIRECT_KEYS, `${path}.direct`, errors);
    validateKnownKeys(input?.subs, SUBS_KEYS, `${path}.subs`, errors);
    if (input?.schema !== undefined && input.schema !== 'srsim.diminishing.v2') {
        errors.push(issue('UNSUPPORTED_STATE_SCHEMA', `${path}.schema`, '対応していない状態形式です。'));
    }
    if (input?.inputMode !== undefined && !['build', 'direct'].includes(input.inputMode)) {
        errors.push(issue('INVALID_INPUT_MODE', `${path}.inputMode`, '入力モードが不正です。'));
    }
    if (input?.activeCandidateId !== undefined && input.activeCandidateId !== null
        && (typeof input.activeCandidateId !== 'string' || !input.activeCandidateId)) {
        errors.push(issue('INVALID_ACTIVE_CANDIDATE', `${path}.activeCandidateId`, '適用候補IDが不正です。'));
    }
    if (input?.activeCandidateIds !== undefined && (
        !Array.isArray(input.activeCandidateIds)
        || input.activeCandidateIds.some(id => typeof id !== 'string' || !id)
    )) {
        errors.push(issue('INVALID_ACTIVE_CANDIDATES', `${path}.activeCandidateIds`, '適用候補ID一覧が不正です。'));
    }
    if (input?.subs?.mode !== undefined && !['manual', 'total', 'perSlot'].includes(input.subs.mode)) {
        errors.push(issue('INVALID_SUBSTAT_MODE', `${path}.subs.mode`, 'サブステモードが不正です。'));
    }
    for (const [index, slot] of (Array.isArray(input?.party) ? input.party : []).entries()) {
        validateKnownKeys(slot, PARTY_KEYS, `${path}.party.${index}`, errors);
        if (slot.mode !== undefined && !['simple', 'build'].includes(slot.mode)) errors.push(issue('INVALID_PARTY_MODE', `${path}.party.${index}.mode`, 'パーティ枠のモードが不正です。'));
        if (slot.levelPreset !== undefined && !['default', 'eidolon'].includes(slot.levelPreset)) errors.push(issue('INVALID_LEVEL_PRESET', `${path}.party.${index}.levelPreset`, 'パーティ効果のレベル条件が不正です。'));
        if (slot.activeEffectIds !== undefined && !Array.isArray(slot.activeEffectIds)) errors.push(issue('INVALID_EFFECT_IDS', `${path}.party.${index}.activeEffectIds`, '効果IDは配列で指定してください。'));
        if (slot.stacksByEffectId !== undefined && (
            !slot.stacksByEffectId || typeof slot.stacksByEffectId !== 'object' || Array.isArray(slot.stacksByEffectId)
        )) errors.push(issue('INVALID_EFFECT_STACKS', `${path}.party.${index}.stacksByEffectId`, '効果の累積数はIDをキーにしたオブジェクトで指定してください。'));
    }
    let state;
    try {
        state = createDiminishingState(input);
    } catch (error) {
        errors.push(issue('STATE_RESTORE_FAILED', path, `状態を復元できません: ${error.message}`));
        return { valid: false, errors, warnings: [], state: null };
    }
    if (!['build', 'direct'].includes(state.inputMode)) errors.push(issue('INVALID_INPUT_MODE', `${path}.inputMode`, '入力モードが不正です。'));
    validateBuild(state.build, `${path}.build`, errors);
    validateSubstats(state.subs, `${path}.subs`, errors);
    validateOptions(state.options, `${path}.options`, errors);
    if (state.inputMode === 'direct') validateStatsObject(state.direct.stats, `${path}.direct.stats`, errors, DIRECT_STAT_KEYS);
    if (state.inputMode === 'direct' && state.direct.snapshot) validateStatsObject(state.direct.snapshot, `${path}.direct.snapshot`, errors, DIRECT_STAT_KEYS);
    if (state.inputMode === 'build' && state.snapshot) validateBuild(state.snapshot, `${path}.snapshot`, errors);
    if (state.build) validateEffects(state, errors, path);
    try {
        if (state.inputMode === 'build' && state.build) materializeDiminishingBuild(state);
    } catch (error) {
        errors.push(issue('STATE_COMPUTE_FAILED', path, `状態を計算用ビルドへ変換できません: ${error.message}`));
    }
    return { valid: errors.length === 0, errors, warnings: [], state };
}

function validateChangeObject(changes, path, errors) {
    if (!changes || typeof changes !== 'object' || Array.isArray(changes)) {
        errors.push(issue('INVALID_CHANGES', path, 'changes はオブジェクトで指定してください。'));
        return;
    }
    for (const key of Object.keys(changes)) {
        if (!VALID_CHANGE_KEYS.has(key)) errors.push(issue('UNKNOWN_CHANGE_FIELD', `${path}.${key}`, `推測できない変更項目です: ${key}`));
    }
    if (changes.inputMode && !['build', 'direct'].includes(changes.inputMode)) errors.push(issue('INVALID_INPUT_MODE', `${path}.inputMode`, '入力モードが不正です。'));
    if (changes.activeCandidateId !== undefined && changes.activeCandidateId !== null
        && (typeof changes.activeCandidateId !== 'string' || !changes.activeCandidateId)) {
        errors.push(issue('INVALID_ACTIVE_CANDIDATE', `${path}.activeCandidateId`, '適用候補IDが不正です。'));
    }
    if (changes.activeCandidateIds !== undefined && (
        !Array.isArray(changes.activeCandidateIds)
        || changes.activeCandidateIds.some(id => typeof id !== 'string' || !id)
    )) {
        errors.push(issue('INVALID_ACTIVE_CANDIDATES', `${path}.activeCandidateIds`, '適用候補ID一覧が不正です。'));
    }
    if (changes.effectSelection && !['allApplicable', 'defaults', 'none'].includes(changes.effectSelection)) {
        errors.push(issue('INVALID_EFFECT_SELECTION', `${path}.effectSelection`, '効果選択は allApplicable / defaults / none で指定してください。'));
    }
    if (changes.build) validateKnownKeys(changes.build, BUILD_KEYS, `${path}.build`, errors);
    if (changes.eidolon !== undefined) validateIntegerRange(changes.eidolon, 0, 6, `${path}.eidolon`, errors);
    for (const [skill, level] of Object.entries(changes.traceLevel || {})) validateIntegerRange(level, 1, getTraceLevelCap(skill), `${path}.traceLevel.${skill}`, errors);
    validateKnownKeys(changes.lightcone, new Set(['id', 'superimpose']), `${path}.lightcone`, errors);
    if (changes.lightcone?.superimpose !== undefined) validateIntegerRange(changes.lightcone.superimpose, 1, 5, `${path}.lightcone.superimpose`, errors);
    if (changes.stats) validateStatsObject(changes.stats, `${path}.stats`, errors, DIRECT_STAT_KEYS);
    if (changes.directStats) validateStatsObject(changes.directStats, `${path}.directStats`, errors, DIRECT_STAT_KEYS);
    if (changes.envStats) validateStatsObject(changes.envStats, `${path}.envStats`, errors);
    if (changes.options) validateKnownKeys(changes.options, OPTION_KEYS, `${path}.options`, errors);
    if (changes.activeSelfEffectIds !== undefined && !Array.isArray(changes.activeSelfEffectIds)) errors.push(issue('INVALID_EFFECT_IDS', `${path}.activeSelfEffectIds`, '効果IDは配列で指定してください。'));
    if (changes.selfStacksByEffectId !== undefined && (
        !changes.selfStacksByEffectId || typeof changes.selfStacksByEffectId !== 'object' || Array.isArray(changes.selfStacksByEffectId)
    )) errors.push(issue('INVALID_EFFECT_STACKS', `${path}.selfStacksByEffectId`, '効果の累積数はIDをキーにしたオブジェクトで指定してください。'));
    if (changes.visibleRows !== undefined && !Array.isArray(changes.visibleRows)) errors.push(issue('INVALID_VISIBLE_ROWS', `${path}.visibleRows`, '表示行は配列で指定してください。'));
    if (changes.visibleStats !== undefined && !Array.isArray(changes.visibleStats)) errors.push(issue('INVALID_VISIBLE_STATS', `${path}.visibleStats`, '表示ステータスは配列で指定してください。'));
    if (changes.party) {
        const partyEntries = Array.isArray(changes.party) ? changes.party.entries() : Object.entries(changes.party);
        for (const [rawIndex, slot] of partyEntries) {
            const index = Number(rawIndex);
            if (!Number.isInteger(index) || index < 0 || index > 2) errors.push(issue('INVALID_PARTY_INDEX', `${path}.party.${rawIndex}`, 'パーティ枠は0〜2で指定してください。'));
            validateKnownKeys(slot, PARTY_KEYS, `${path}.party.${rawIndex}`, errors);
            validateKnownKeys(slot?.lightcone, new Set(['id', 'superimpose']), `${path}.party.${rawIndex}.lightcone`, errors);
            if (slot?.lightcone?.superimpose !== undefined) {
                validateIntegerRange(slot.lightcone.superimpose, 1, 5, `${path}.party.${rawIndex}.lightcone.superimpose`, errors);
            }
            if (slot?.effectSelection && !['allApplicable', 'defaults', 'none'].includes(slot.effectSelection)) {
                errors.push(issue('INVALID_EFFECT_SELECTION', `${path}.party.${rawIndex}.effectSelection`, '効果選択は allApplicable / defaults / none で指定してください。'));
            }
            if (slot?.stacksByEffectId !== undefined && (
                !slot.stacksByEffectId || typeof slot.stacksByEffectId !== 'object' || Array.isArray(slot.stacksByEffectId)
            )) errors.push(issue('INVALID_EFFECT_STACKS', `${path}.party.${rawIndex}.stacksByEffectId`, '効果の累積数はIDをキーにしたオブジェクトで指定してください。'));
        }
    }
    if (changes.relics) {
        for (const [slot, relic] of Object.entries(changes.relics)) {
            if (!ALL_SLOTS.some(item => item === slot)) errors.push(issue('UNKNOWN_RELIC_SLOT', `${path}.relics.${slot}`, `未登録の遺物部位です: ${slot}`));
            validateKnownKeys(relic, new Set(['setId', 'mainStat', 'subs']), `${path}.relics.${slot}`, errors);
            if (relic.mainStat !== undefined && relic.mainStat !== null && !RELIC_MAIN_OPTIONS[slot]?.[relic.mainStat]) {
                errors.push(issue('INVALID_MAIN_STAT', `${path}.relics.${slot}.mainStat`, `${slot} には指定できないメインステです: ${relic.mainStat}`));
            }
            if (relic.subs) validateStatsObject(relic.subs, `${path}.relics.${slot}.subs`, errors);
        }
    }
}

function hasBuildOnlyChanges(changes = {}) {
    return [
        'build', 'characterId', 'eidolon', 'traceLevel', 'lightcone', 'relics', 'envStats',
        'substats', 'subs', 'party', 'effectSelection', 'activeSelfEffectIds', 'selfStacksByEffectId',
    ].some(key => changes[key] !== undefined);
}

function touchesFixed(changes, fixed) {
    const equipment = changes.lightcone || changes.relics || changes.build?.lightcone || changes.build?.relics;
    const character = changes.characterId !== undefined || changes.eidolon !== undefined || changes.traceLevel || changes.build?.characterId !== undefined || changes.build?.eidolon !== undefined || changes.build?.traceLevel;
    const party = changes.party;
    const enemy = changes.options && ['enemyLevel', 'enemyBaseRes', 'breakState', 'elementOverride'].some(key => key in changes.options);
    if (fixed === 'equipment') return Boolean(equipment);
    if (fixed === 'character') return Boolean(character);
    if (fixed === 'party') return Boolean(party);
    if (fixed === 'enemy') return Boolean(enemy);
    if (fixed.startsWith('equipment.')) {
        const part = fixed.slice('equipment.'.length);
        if (part === 'lightcone') return Boolean(changes.lightcone || changes.build?.lightcone);
        return Boolean(changes.relics?.[part] || changes.build?.relics?.[part]);
    }
    return false;
}

function stableStringify(value) {
    if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
    if (value && typeof value === 'object') {
        return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
    }
    return JSON.stringify(value);
}

function fixedConditionValue(state, condition) {
    const serialized = state?.visibleRows instanceof Set ? serializeDiminishingState(state) : state;
    if (condition === 'character') {
        return {
            characterId: serialized?.build?.characterId,
            eidolon: serialized?.build?.eidolon,
            traceLevel: serialized?.build?.traceLevel,
        };
    }
    if (condition === 'equipment') {
        return {
            lightcone: serialized?.build?.lightcone,
            relics: serialized?.build?.relics,
        };
    }
    if (condition === 'party') return serialized?.party;
    if (condition === 'enemy') {
        return Object.fromEntries(['enemyLevel', 'enemyBaseRes', 'breakState', 'elementOverride']
            .map(key => [key, serialized?.options?.[key]]));
    }
    if (condition === 'equipment.lightcone') return serialized?.build?.lightcone;
    if (condition.startsWith('equipment.')) {
        return serialized?.build?.relics?.[condition.slice('equipment.'.length)];
    }
    return undefined;
}

export function validateDiminishingJob(job, result = null) {
    const errors = [];
    const warnings = [];
    if (!job || typeof job !== 'object' || Array.isArray(job)) {
        return { valid: false, errors: [issue('INVALID_JOB', '$', '計算ジョブはオブジェクトで指定してください。')], warnings };
    }
    inspectFinite(job, '$', errors);
    validateKnownKeys(job, JOB_KEYS, '$', errors, 'UNKNOWN_JOB_FIELD');
    if (typeof job.objective !== 'string' || !job.objective.trim()) errors.push(issue('MISSING_OBJECTIVE', '$.objective', '比較目的を指定してください。'));
    const stateValidation = validateDiminishingState(job.baseState);
    errors.push(...stateValidation.errors);
    warnings.push(...stateValidation.warnings);

    const metrics = Array.isArray(job.metrics) ? job.metrics : [];
    if (!Array.isArray(job.metrics)) errors.push(issue('INVALID_METRICS', '$.metrics', '指標は配列で指定してください。'));
    for (const [index, metric] of metrics.entries()) {
        if (!VALID_METRICS.has(metric)) errors.push(issue('UNKNOWN_METRIC', `$.metrics.${index}`, `未対応の指標です: ${metric}`));
    }
    const fixed = Array.isArray(job.fixedConditions) ? job.fixedConditions : [];
    if (!Array.isArray(job.fixedConditions)) errors.push(issue('INVALID_FIXED_CONDITIONS', '$.fixedConditions', '固定条件は配列で指定してください。'));
    for (const [index, condition] of fixed.entries()) {
        if (!FIXED_CONDITIONS.has(condition)) errors.push(issue('UNKNOWN_FIXED_CONDITION', `$.fixedConditions.${index}`, `未対応の固定条件です: ${condition}`));
    }
    if (!Array.isArray(job.variations)) errors.push(issue('INVALID_VARIATIONS', '$.variations', '比較ケースは配列で指定してください。'));
    for (const [index, variation] of (Array.isArray(job.variations) ? job.variations : []).entries()) {
        validateKnownKeys(variation, new Set(['label', 'changes']), `$.variations.${index}`, errors);
    }
    if (job.matrix !== undefined) {
        if (!job.matrix || typeof job.matrix !== 'object' || Array.isArray(job.matrix)) errors.push(issue('INVALID_MATRIX', '$.matrix', '行列条件はオブジェクトで指定してください。'));
        validateKnownKeys(job.matrix, new Set(['rows', 'columns']), '$.matrix', errors);
        for (const axis of ['rows', 'columns']) {
            if (job.matrix?.[axis] !== undefined && !Array.isArray(job.matrix[axis])) errors.push(issue('INVALID_MATRIX_AXIS', `$.matrix.${axis}`, '行列条件は配列で指定してください。'));
            for (const [index, item] of (Array.isArray(job.matrix?.[axis]) ? job.matrix[axis] : []).entries()) {
                validateKnownKeys(item, new Set(['label', 'changes']), `$.matrix.${axis}.${index}`, errors);
                if (typeof item.label !== 'string' || !item.label.trim()) errors.push(issue('MISSING_CASE_LABEL', `$.matrix.${axis}.${index}.label`, '行列条件名を指定してください。'));
                validateChangeObject(item.changes, `$.matrix.${axis}.${index}.changes`, errors);
            }
        }
    }
    const variations = expandDiminishingVariations(job);
    if (variations.length > 100) errors.push(issue('TOO_MANY_CASES', '$.variations', '比較ケースは100件以内にしてください。', { count: variations.length }));

    const baseSerialized = stateValidation.state ? serializeDiminishingState(stateValidation.state) : null;
    for (const [index, variation] of variations.entries()) {
        const path = `$.variations.${index}`;
        if (typeof variation.label !== 'string' || !variation.label.trim()) errors.push(issue('MISSING_CASE_LABEL', `${path}.label`, '比較ケース名を指定してください。'));
        validateChangeObject(variation.changes, `${path}.changes`, errors);
        const resolvedInputMode = variation.changes?.inputMode || baseSerialized?.inputMode;
        if (resolvedInputMode === 'direct' && hasBuildOnlyChanges(variation.changes)) {
            errors.push(issue(
                'BUILD_CHANGES_REQUIRE_BUILD_MODE',
                `${path}.changes.inputMode`,
                'キャラ・装備・パーティ・サブステの変更を計算するには inputMode を build にしてください。',
            ));
        }
        for (const condition of fixed) {
            if (touchesFixed(variation.changes, condition)) errors.push(issue('FIXED_CONDITION_CHANGED', `${path}.changes`, `固定条件「${condition}」を変更しようとしています。`, { condition }));
        }
        if (baseSerialized) {
            try {
                const variant = createDiminishingState(baseSerialized);
                applyDiminishingChanges(variant, variation.changes);
                const validation = validateDiminishingState(serializeDiminishingState(variant), `${path}.resolvedState`);
                errors.push(...validation.errors);
                if (stableStringify(baseSerialized) !== stableStringify(serializeDiminishingState(stateValidation.state))) {
                    errors.push(issue('BASE_STATE_MUTATED', '$.baseState', '比較処理で元の状態が変更されました。'));
                }
            } catch (error) {
                errors.push(issue('CHANGE_APPLY_FAILED', `${path}.changes`, `変更を適用できません: ${error.message}`));
            }
        }
    }

    if (result) {
        inspectFinite(result, '$.result', errors);
        if (!Array.isArray(result.cases) || result.cases.length !== variations.length) {
            errors.push(issue('RESULT_CASE_MISMATCH', '$.result.cases', '結果件数が比較条件と一致しません。'));
        }
        for (const [index, item] of (Array.isArray(result.cases) ? result.cases : []).entries()) {
            const restored = validateDiminishingState(item.state, `$.result.cases.${index}.state`);
            errors.push(...restored.errors);
            if (restored.state && stateValidation.state) {
                for (const condition of fixed) {
                    const before = fixedConditionValue(stateValidation.state, condition);
                    const after = fixedConditionValue(restored.state, condition);
                    if (stableStringify(before) !== stableStringify(after)) {
                        errors.push(issue(
                            'RESULT_FIXED_CONDITION_CHANGED',
                            `$.result.cases.${index}.state`,
                            `結果内で固定条件「${condition}」が変更されています。`,
                            { condition },
                        ));
                    }
                }
            }
        }
        if (stableStringify(result.fixedConditions || []) !== stableStringify(fixed)) {
            errors.push(issue('RESULT_FIXED_CONDITION_MISMATCH', '$.result.fixedConditions', '結果の固定条件が計算ジョブと一致しません。'));
        }
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
        normalizedJob: {
            objective: job.objective,
            baseState: baseSerialized || job.baseState,
            variations: Array.isArray(job.variations) ? job.variations.map(item => ({ label: item.label, changes: item.changes || {} })) : [],
            ...(job.matrix ? { matrix: job.matrix } : {}),
            fixedConditions: fixed,
            metrics: metrics.length ? metrics : ['finalStats', 'damage', 'differencePercent'],
        },
    };
}
