// diminishingEngine.js — 限界効用の DOM 非依存計算と比較ジョブ実行

import { Registry } from './registry.js';
import { StatComputer, countSetsByType } from './statComputer.js';
import { Diminishing } from './diminishing.js';
import { ALL_SLOTS, SET_TYPE } from './constants.js';
import { STAT } from './statKeys.js';
import { calcManualAllocation, rollsToStatDict } from './substatRoller.js';
import { presetTraceLevels } from './skillUtil.js';
import { computeCharacterAttackDamages } from './attackDamage.js';
import { signatureLightconeForCharacter } from '../data/lightcones/signatureRelations.js';
import {
    cloneDiminishingValue,
    createDiminishingState,
    serializeDiminishingState,
    restorePartySlot,
} from './diminishingSession.js';
import {
    applyBuildCandidate,
    getBuildCandidates,
    isEidolonCandidate,
} from './buildCandidates.js';

export const DIMINISHING_METRICS = Object.freeze([
    'finalStats', 'damage', 'differencePercent',
]);

const SUB_LABEL_PREFIX = 'サブステ.';
const PARTY_LABEL_PREFIX = 'パーティ.';
const SELF_LABEL_PREFIX = '自身バフ.';
const AI_LABEL_PREFIX = 'AI変更.';

const TARGET_STAT_TO_RAW = Object.freeze({
    atk: STAT.ATK_FLAT,
    hp: STAT.HP_FLAT,
    def: STAT.DEF_FLAT,
    spd: STAT.SPD_FLAT,
    critRate: STAT.CRIT_RATE,
    critDmg: STAT.CRIT_DMG,
    energyRegen: STAT.ENERGY_REGEN,
    dmgAll: STAT.DMG_ALL,
    dmgBasic: STAT.DMG_BASIC,
    dmgSkill: STAT.DMG_SKILL,
    dmgUlt: STAT.DMG_ULT,
    dmgFollowup: STAT.DMG_FOLLOWUP,
    fixedDmg: STAT.FIXED_DMG,
    sepMult: STAT.SEP_MULT,
    defDown: STAT.DEF_DOWN,
    defIgnore: STAT.DEF_IGNORE,
    resPen: STAT.RES_PEN,
    dmgTaken: STAT.DMG_TAKEN,
    breakEffect: STAT.BREAK_EFFECT,
    ehr: STAT.EFFECT_HIT_RATE,
    eres: STAT.EFFECT_RES,
});

function blankBuild(characterId) {
    return {
        schemaVersion: 1,
        id: `virtual_${characterId}`,
        name: '',
        characterId,
        eidolon: 0,
        traceLevel: { basic: 6, skill: 10, ult: 10, talent: 10 },
        lightcone: { id: null, superimpose: 1 },
        relics: {
            head: { setId: null, mainStat: 'hp_flat', subs: {} },
            hands: { setId: null, mainStat: 'atk_flat', subs: {} },
            body: { setId: null, mainStat: null, subs: {} },
            feet: { setId: null, mainStat: null, subs: {} },
            sphere: { setId: null, mainStat: null, subs: {} },
            rope: { setId: null, mainStat: null, subs: {} },
        },
        envBuffs: [],
    };
}

function mergeObject(target, patch) {
    for (const [key, value] of Object.entries(patch || {})) {
        if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Set)) {
            const base = target[key] && typeof target[key] === 'object' && !Array.isArray(target[key])
                ? target[key]
                : {};
            target[key] = mergeObject(base, value);
        } else {
            target[key] = cloneDiminishingValue(value);
        }
    }
    return target;
}

function applyPartyPatch(state, patch) {
    const entries = Array.isArray(patch) ? patch.entries() : Object.entries(patch || {});
    for (const [rawIndex, value] of entries) {
        const index = Number(rawIndex);
        if (!Number.isInteger(index) || index < 0 || index >= state.party.length || !value) continue;
        const serialized = {
            ...serializePartyForPatch(state.party[index]),
            ...cloneDiminishingValue(value),
        };
        const nextMode = serialized.mode === 'build' && (serialized.build || serialized.buildId) ? 'build' : 'simple';
        const shouldSelectSignature = nextMode === 'simple'
            && value.lightcone === undefined
            && (value.characterId !== undefined || value.mode === 'simple');
        if (shouldSelectSignature) serialized.lightcone = signatureLightconeForCharacter(serialized.characterId);
        state.party[index] = restorePartySlot(serialized);
    }
}

function serializePartyForPatch(slot) {
    return {
        ...slot,
        activeEffectIds: Array.from(slot.activeEffectIds || []),
        stacksByEffectId: { ...(slot.stacksByEffectId || {}) },
        build: slot.build ? cloneDiminishingValue(slot.build) : null,
    };
}

function selectedEffectState(items, selection = 'defaults') {
    const activeEffectIds = [];
    const stacksByEffectId = {};
    for (const item of items) {
        const selected = selection === 'allApplicable' || (selection === 'defaults' && item.effect.defaultActive);
        if (!selected) continue;
        const stacks = item.effect.stackable
            ? item.effect.stackable.default ?? item.effect.stackable.max ?? 1
            : null;
        // 初期値0の累積効果は、効果が発動していない状態を表す。0層のまま有効化すると
        // 計算状態として矛盾するため、明示指定されるまで選択しない。
        if (stacks !== null && stacks < 1) continue;
        activeEffectIds.push(item.key);
        if (stacks !== null) stacksByEffectId[item.key] = stacks;
    }
    return { activeEffectIds, stacksByEffectId };
}

function applySelectedFocusEffects(state, selection) {
    const selected = selectedEffectState(gatherFocusEffects(state.build), selection);
    state.build.activeSelfEffectIds = selected.activeEffectIds;
    state.build.selfStacksByEffectId = selected.stacksByEffectId;
}

function applyDefaultPartyEffects(state, patch) {
    const entries = Array.isArray(patch) ? patch.entries() : Object.entries(patch || {});
    for (const [rawIndex, value] of entries) {
        const index = Number(rawIndex);
        if (!value || value.activeEffectIds !== undefined || !state.party[index]) continue;
        const build = partyBuildFor(state.party[index]);
        const sourceChanged = value.characterId !== undefined || value.lightcone !== undefined || value.ornamentId !== undefined;
        const selection = value.effectSelection || (sourceChanged ? 'allApplicable' : 'defaults');
        const selected = selectedEffectState(build ? gatherTeammateEffects(build) : [], selection);
        state.party[index].activeEffectIds = new Set(selected.activeEffectIds);
        state.party[index].stacksByEffectId = selected.stacksByEffectId;
    }
}

export function applyDiminishingChanges(inputState, changes = {}) {
    const state = inputState?.visibleRows instanceof Set
        ? inputState
        : createDiminishingState(inputState);

    if (changes.inputMode) state.inputMode = changes.inputMode;
    if (changes.activeCandidateIds !== undefined) {
        state.activeCandidateIds = Array.isArray(changes.activeCandidateIds)
            ? [...new Set(changes.activeCandidateIds.filter(id => typeof id === 'string' && id))]
            : [];
        state.activeCandidateId = state.activeCandidateIds.length === 1 ? state.activeCandidateIds[0] : null;
    }
    if (changes.activeCandidateId !== undefined) {
        state.activeCandidateIds = typeof changes.activeCandidateId === 'string'
            ? [changes.activeCandidateId]
            : [];
        state.activeCandidateId = state.activeCandidateIds[0] || null;
    }
    if (changes.build) mergeObject(state.build, changes.build);
    if (changes.characterId !== undefined) state.build.characterId = changes.characterId;
    const characterWasSelected = changes.characterId !== undefined || changes.build?.characterId !== undefined;
    const lightconeWasSelected = changes.lightcone !== undefined || changes.build?.lightcone !== undefined;
    if (characterWasSelected && !lightconeWasSelected) {
        state.build.lightcone = signatureLightconeForCharacter(state.build.characterId) || { id: null, superimpose: 1 };
    }
    if (changes.eidolon !== undefined) state.build.eidolon = changes.eidolon;
    if (changes.traceLevel) state.build.traceLevel = { ...(state.build.traceLevel || {}), ...changes.traceLevel };
    if (changes.lightcone) state.build.lightcone = { ...(state.build.lightcone || {}), ...changes.lightcone };
    if (changes.relics) {
        for (const [slot, relicPatch] of Object.entries(changes.relics)) {
            state.build.relics[slot] = mergeObject(state.build.relics[slot] || {}, relicPatch);
        }
    }
    if (changes.directStats) state.direct.stats = { ...state.direct.stats, ...changes.directStats };
    if (changes.substats || changes.subs) mergeObject(state.subs, changes.substats || changes.subs);
    if (changes.party) {
        applyPartyPatch(state, changes.party);
        applyDefaultPartyEffects(state, changes.party);
    }
    if (changes.options) state.options = { ...state.options, ...changes.options };
    if (changes.activeSelfEffectIds) state.build.activeSelfEffectIds = [...changes.activeSelfEffectIds];
    if (changes.selfStacksByEffectId) {
        state.build.selfStacksByEffectId = {
            ...(state.build.selfStacksByEffectId || {}),
            ...changes.selfStacksByEffectId,
        };
    }
    const focusSourceChanged = changes.characterId !== undefined || changes.lightcone || changes.relics
        || changes.build?.characterId !== undefined || changes.build?.lightcone || changes.build?.relics;
    if ((focusSourceChanged || changes.effectSelection) && changes.activeSelfEffectIds === undefined) {
        applySelectedFocusEffects(state, changes.effectSelection || 'allApplicable');
    }
    if (changes.visibleRows) state.visibleRows = new Set(changes.visibleRows);
    if (changes.visibleStats) state.visibleStats = new Set(changes.visibleStats);

    if (changes.stats) {
        if (state.inputMode === 'direct') {
            state.direct.stats = { ...state.direct.stats, ...changes.stats };
        } else {
            state.build.aiTargetStats = { ...(state.build.aiTargetStats || {}), ...changes.stats };
        }
    }
    if (changes.envStats) {
        const envBuffs = state.build.envBuffs ||= [];
        for (const [stat, value] of Object.entries(changes.envStats)) {
            const label = `${AI_LABEL_PREFIX}${stat}`;
            const existing = envBuffs.find(buff => buff.label === label);
            if (existing) existing.value = value;
            else envBuffs.push({ stat, value, label });
        }
    }
    return state;
}

// 画面へ反映する場合は、最終ステータス目標を実体の環境バフへ確定する。
// 比較ジョブ内では仮想目標のまま保持し、元状態を変更しない。
export function commitDiminishingChanges(inputState, changes = {}) {
    const state = applyDiminishingChanges(inputState, changes);
    const targets = state.build?.aiTargetStats;
    if (!targets || Object.keys(targets).length === 0) return state;
    const labels = new Set(Object.keys(targets).map(key => `${AI_LABEL_PREFIX}target.${key}`));
    state.build.envBuffs = (state.build.envBuffs || []).filter(buff => !labels.has(buff.label));
    const materialized = materializeDiminishingBuild(state);
    const resolved = (materialized.envBuffs || []).filter(buff => labels.has(buff.label));
    delete state.build.aiTargetStats;
    state.build.envBuffs.push(...resolved.map(cloneDiminishingValue));
    return state;
}

export function mergeDiminishingChanges(...patches) {
    return patches.reduce((result, patch) => mergeObject(result, patch || {}), {});
}

function effectKey(srcKey, effectId) {
    return `${srcKey}.${effectId}`;
}

function applyStackMultiplier(stats, stacks, effect) {
    if (effect?.stackable?.type === 'step' && effect.stackable.stepValues) {
        return effect.stackable.stepValues[stacks] || stats;
    }
    if (!stats || stacks === 1) return stats;
    return Object.fromEntries(Object.entries(stats).map(([key, value]) => [key, value * stacks]));
}

function resolveEffectStats(effect, sourceBuild, sourceStats) {
    if (effect.stats) return effect.stats;
    if (typeof effect.computeStats !== 'function') return null;
    let level = 1;
    let multiplier = null;
    if (effect.fromLevel) {
        const character = Registry.character.get(sourceBuild.characterId);
        const skill = character?.skills?.[effect.fromLevel];
        if (!skill?.levels) return null;
        level = sourceBuild.traceLevel?.[effect.fromLevel] || 1;
        multiplier = skill.levels[Math.max(0, Math.min(skill.levels.length - 1, level - 1))];
    }
    return effect.computeStats(level, multiplier, sourceStats);
}

export function gatherTeammateEffects(teammateBuild) {
    if (!teammateBuild) return [];
    const character = Registry.character.get(teammateBuild.characterId);
    if (!character) return [];
    const output = [];
    const eidolon = teammateBuild.eidolon || 0;
    const push = (srcKey, source, effects) => {
        for (const effect of effects || []) {
            if (effect.minEidolon && eidolon < effect.minEidolon) continue;
            output.push({ srcKey, source, effect, key: effectKey(srcKey, effect.id) });
        }
    };
    push(`char:${character.id}`, `キャラ: ${character.name}`, character.partyEffects);

    if (character.isTestAllEquipment) {
        const si = Math.max(1, Math.min(5, character.testAllSuperimpose ?? 5));
        for (const lightcone of Registry.lightcone.list()) {
            const effects = typeof lightcone.partyEffects === 'function'
                ? lightcone.partyEffects(si)
                : lightcone.partyEffects;
            push(`testlc:${lightcone.id}`, `[テスト] 光円錐: ${lightcone.name} S${si}`, effects);
        }
        for (const set of Registry.relicSet.list()) {
            push(`testset:${set.id}:pc2`, `[テスト] セット: ${set.name} 2pc`, set.partyEffects?.pc2);
            push(`testset:${set.id}:pc4`, `[テスト] セット: ${set.name} 4pc`, set.partyEffects?.pc4);
        }
        for (const ornament of Registry.ornament.list()) {
            push(`testorn:${ornament.id}:pc2`, `[テスト] 次元界: ${ornament.name} 2pc`, ornament.partyEffects?.pc2);
        }
        return output;
    }

    if (teammateBuild.lightcone?.id) {
        const lightcone = Registry.lightcone.get(teammateBuild.lightcone.id);
        const si = Math.max(1, Math.min(5, teammateBuild.lightcone.superimpose || 1));
        const effects = typeof lightcone?.partyEffects === 'function'
            ? lightcone.partyEffects(si)
            : lightcone?.partyEffects;
        push('lc', `光円錐: ${lightcone?.name || teammateBuild.lightcone.id} S${si}`, effects);
    }
    for (const [setId, count] of Object.entries(countSetsByType(teammateBuild.relics, SET_TYPE.CAVERN))) {
        const set = Registry.relicSet.get(setId);
        if (count >= 2) push(`set:${setId}:pc2`, `セット: ${set?.name || setId} 2pc`, set?.partyEffects?.pc2);
        if (count >= 4) push(`set:${setId}:pc4`, `セット: ${set?.name || setId} 4pc`, set?.partyEffects?.pc4);
    }
    for (const [setId, count] of Object.entries(countSetsByType(teammateBuild.relics, SET_TYPE.PLANAR))) {
        const ornament = Registry.ornament.get(setId);
        if (count >= 2) push(`orn:${setId}:pc2`, `次元界: ${ornament?.name || setId} 2pc`, ornament?.partyEffects?.pc2);
    }
    return output;
}

export function gatherFocusEffects(build) {
    if (!build?.characterId) return [];
    const character = Registry.character.get(build.characterId);
    if (!character) return [];
    const eidolon = build.eidolon || 0;
    const output = [];
    const push = (srcKey, source, effects, type) => {
        for (const effect of effects || []) {
            if (effect.minEidolon && eidolon < effect.minEidolon) continue;
            output.push({ srcKey, source, effect, type, key: effectKey(srcKey, effect.id) });
        }
    };
    const characterKey = `char:${character.id}`;
    push(characterKey, `キャラ: ${character.name}`, character.partyEffects, 'party');
    push(characterKey, `キャラ: ${character.name}`, character.selfEffects, 'self');

    if (build.lightcone?.id) {
        const lightcone = Registry.lightcone.get(build.lightcone.id);
        const si = Math.max(1, Math.min(5, build.lightcone.superimpose || 1));
        const party = typeof lightcone?.partyEffects === 'function' ? lightcone.partyEffects(si) : lightcone?.partyEffects;
        const self = typeof lightcone?.selfEffects === 'function' ? lightcone.selfEffects(si) : lightcone?.selfEffects;
        push('lc', `光円錐: ${lightcone?.name || build.lightcone.id} S${si}`, party, 'party');
        push('lc', `光円錐: ${lightcone?.name || build.lightcone.id} S${si}`, self, 'self');
    }
    for (const [setId, count] of Object.entries(countSetsByType(build.relics, SET_TYPE.CAVERN))) {
        const set = Registry.relicSet.get(setId);
        if (count >= 2) {
            push(`set:${setId}:pc2`, `セット: ${set?.name || setId} 2pc`, set?.partyEffects?.pc2, 'party');
            push(`set:${setId}:pc2`, `セット: ${set?.name || setId} 2pc`, set?.selfEffects?.pc2, 'self');
        }
        if (count >= 4) {
            push(`set:${setId}:pc4`, `セット: ${set?.name || setId} 4pc`, set?.partyEffects?.pc4, 'party');
            push(`set:${setId}:pc4`, `セット: ${set?.name || setId} 4pc`, set?.selfEffects?.pc4, 'self');
        }
    }
    for (const [setId, count] of Object.entries(countSetsByType(build.relics, SET_TYPE.PLANAR))) {
        const ornament = Registry.ornament.get(setId);
        if (count >= 2) {
            push(`orn:${setId}:pc2`, `次元界: ${ornament?.name || setId} 2pc`, ornament?.partyEffects?.pc2, 'party');
            push(`orn:${setId}:pc2`, `次元界: ${ornament?.name || setId} 2pc`, ornament?.selfEffects?.pc2, 'self');
        }
    }
    return output;
}

function partyBuildFor(slot) {
    if (slot.build) return cloneDiminishingValue(slot.build);
    if (!slot.characterId) return null;
    const character = Registry.character.get(slot.characterId);
    if (!character) return null;
    const build = blankBuild(slot.characterId);
    build.traceLevel = { ...build.traceLevel, ...presetTraceLevels(character) };
    if (slot.lightcone?.id) build.lightcone = { ...slot.lightcone };
    if (slot.ornamentId) {
        build.relics.sphere.setId = slot.ornamentId;
        build.relics.rope.setId = slot.ornamentId;
    }
    return build;
}

function pushStats(build, stats, label) {
    for (const [stat, value] of Object.entries(stats || {})) {
        build.envBuffs.push({ stat, value, label: `${label}.${stat}` });
    }
}

function applySubstats(build, subs) {
    if (subs.mode === 'manual') {
        pushStats(build, subs.manual, SUB_LABEL_PREFIX.slice(0, -1));
        return;
    }
    if (subs.mode === 'total') {
        const result = subs.total.lastResult || calcManualAllocation(subs.total);
        pushStats(build, rollsToStatDict(result.totals || {}), SUB_LABEL_PREFIX.slice(0, -1));
        return;
    }
    const totals = {};
    for (const slot of ALL_SLOTS) {
        const config = subs.perSlot?.[slot];
        const result = config?.lastResult || (config ? calcManualAllocation(config) : null);
        for (const [key, value] of Object.entries(result?.totals || {})) totals[key] = (totals[key] || 0) + value;
    }
    pushStats(build, rollsToStatDict(totals), SUB_LABEL_PREFIX.slice(0, -1));
}

function hasExplicitSubstatInput(subs) {
    if (!subs) return false;
    if (Object.keys(subs.manual || {}).length > 0) return true;
    if (Object.keys(subs.total?.allocations || {}).length > 0 || subs.total?.lastResult) return true;
    return Object.values(subs.perSlot || {}).some(config =>
        Object.keys(config?.allocations || {}).length > 0 || Boolean(config?.lastResult));
}

function applyPartyEffects(build, party) {
    for (let index = 0; index < party.length; index++) {
        const slot = party[index];
        const teammateBuild = partyBuildFor(slot);
        if (!teammateBuild) continue;
        const teammateStats = StatComputer.compute(teammateBuild);
        for (const item of gatherTeammateEffects(teammateBuild)) {
            if (!slot.activeEffectIds.has(item.key)) continue;
            const perLayer = resolveEffectStats(item.effect, teammateBuild, teammateStats);
            const stacks = item.effect.stackable
                ? (slot.stacksByEffectId?.[item.key] ?? item.effect.stackable.default ?? item.effect.stackable.max ?? 1)
                : 1;
            pushStats(build, applyStackMultiplier(perLayer, stacks, item.effect), `${PARTY_LABEL_PREFIX}${index}.${item.key}`);
        }
    }
}

function applySelfEffects(build) {
    const active = new Set(build.activeSelfEffectIds || []);
    if (active.size === 0) return;
    const baseStats = StatComputer.compute(build);
    for (const item of gatherFocusEffects(build)) {
        if (!active.has(item.key)) continue;
        const perLayer = resolveEffectStats(item.effect, build, baseStats);
        const stacks = item.effect.stackable
            ? (build.selfStacksByEffectId?.[item.key] ?? item.effect.stackable.default ?? item.effect.stackable.max ?? 1)
            : 1;
        pushStats(build, applyStackMultiplier(perLayer, stacks, item.effect), `${SELF_LABEL_PREFIX}${item.key}`);
    }
}

function currentTargetValue(stats, key) {
    if (key === 'energyRegen') return stats.derived.energyRegenPct;
    if (key in stats.derived) return stats.derived[key];
    const rawKey = TARGET_STAT_TO_RAW[key];
    return rawKey ? (stats.raw[rawKey] || 0) : 0;
}

function applyTargetStats(build) {
    const targets = build.aiTargetStats || {};
    if (Object.keys(targets).length === 0) return;
    delete build.aiTargetStats;
    for (const [key, target] of Object.entries(targets)) {
        const rawKey = TARGET_STAT_TO_RAW[key];
        if (!rawKey) continue;
        const stats = StatComputer.compute(build);
        const delta = Number(target) - currentTargetValue(stats, key);
        if (delta) build.envBuffs.push({ stat: rawKey, value: delta, label: `${AI_LABEL_PREFIX}target.${key}` });
    }
}

export function materializeDiminishingBuild(inputState) {
    const state = inputState?.visibleRows instanceof Set ? inputState : createDiminishingState(inputState);
    if (!state.build) throw new Error('ビルドがありません。');
    const candidates = getBuildCandidates(state.build);
    const activeIds = Array.isArray(state.activeCandidateIds) && state.activeCandidateIds.length > 0
        ? state.activeCandidateIds
        : (state.activeCandidateId ? [state.activeCandidateId] : []);
    const build = activeIds.reduce((current, candidateId) => {
        const candidate = candidates.find(item => item.id === candidateId);
        return candidate ? applyBuildCandidate(current, candidate) : current;
    }, cloneDiminishingValue(state.build));
    const replaceSubstats = hasExplicitSubstatInput(state.subs);
    build.envBuffs = (build.envBuffs || []).filter(buff => {
        const label = typeof buff.label === 'string' ? buff.label : '';
        if (label.startsWith(PARTY_LABEL_PREFIX) || label.startsWith(SELF_LABEL_PREFIX)) return false;
        return !(replaceSubstats && label.startsWith(SUB_LABEL_PREFIX));
    });
    if (replaceSubstats) applySubstats(build, state.subs);
    applyPartyEffects(build, state.party);
    applySelfEffects(build);
    applyTargetStats(build);
    return build;
}

function damageByType(finalStats, options) {
    const factors = Diminishing.computeDamageFactors(finalStats, { ...Diminishing.DEFAULT_OPTIONS, ...options });
    const shared = factors.atk * factors.break * factors.fixedDmg * factors.sepMult;
    return Object.fromEntries(['base', 'basic', 'skill', 'ult', 'followup'].map(type => [
        type,
        shared * factors.critByType[type] * factors.dmgBonusByType[type]
            * factors.defByType[type] * factors.resByType[type] * factors.takenByType[type],
    ]));
}

export function computeDiminishingState(inputState) {
    const state = inputState?.visibleRows instanceof Set ? inputState : createDiminishingState(inputState);
    const materializedBuild = state.inputMode === 'direct' ? null : materializeDiminishingBuild(state);
    const finalStats = state.inputMode === 'direct'
        ? Diminishing.directStatsToFinalStats(state.direct.stats)
        : StatComputer.compute(materializedBuild);
    const character = Registry.character.get(state.build?.characterId);
    return {
        mode: state.inputMode,
        finalStats,
        damage: damageByType(finalStats, state.options),
        attacks: computeCharacterAttackDamages(character, materializedBuild || state.build, finalStats, state.options),
        options: { ...state.options },
    };
}

/**
 * 保存ビルドに登録された差分候補を、現在のパーティ・敵条件のまま比較する。
 *
 * 現在適用中の候補を基準にするが、ランキング自体は保存ビルド本体へ
 * 各候補を単独適用して計算する。実際の画面状態では項目ごとの候補を
 * 複数適用でき、同じ項目の候補を選び直すとその項目だけ置き換わる。
 * FinalStats は一度計算した結果を返し、UI側のクリック時再計算を省けるようにする。
 */
export function rankBuildCandidates(inputState) {
    const state = inputState?.visibleRows instanceof Set
        ? inputState
        : createDiminishingState(inputState);
    if (!state.build || state.inputMode === 'direct') {
        return { currentStats: null, candidates: [], activeCandidateIds: [], activeCandidateId: null };
    }

    const baseSerialized = serializeDiminishingState(state);
    baseSerialized.activeCandidateIds = [];
    baseSerialized.activeCandidateId = null;
    const baseState = createDiminishingState(baseSerialized);
    const baseStats = computeDiminishingState(baseState).finalStats;
    const current = computeDiminishingState(state).finalStats;
    const candidates = getBuildCandidates(state.build).map(candidate => {
        try {
            const variantState = createDiminishingState(baseSerialized);
            variantState.activeCandidateIds = [candidate.id];
            variantState.activeCandidateId = candidate.id;
            const afterStats = computeDiminishingState(variantState).finalStats;
            if (isEidolonCandidate(candidate)) {
                return {
                    ...candidate,
                    afterStats,
                    contribution: null,
                    spdDelta: afterStats.derived.spd - baseStats.derived.spd,
                    comparison: null,
                    excludedReason: 'eidolon',
                    error: null,
                };
            }
            // 候補の表示値は保存ビルド本体を基準に固定する。候補をクリックしても
            // 全候補の再ランキングが不要になり、切り替えを軽く保てる。
            const comparison = Diminishing.compareStats(baseStats, afterStats, state.options);
            return {
                ...candidate,
                afterStats,
                contribution: comparison.factors.total.contribution,
                spdDelta: comparison.info.spdDelta,
                comparison,
                excludedReason: null,
                error: null,
            };
        } catch (error) {
            return {
                ...candidate,
                afterStats: null,
                contribution: null,
                spdDelta: null,
                comparison: null,
                excludedReason: null,
                error,
            };
        }
    });
    candidates.sort((a, b) => (b.contribution ?? -Infinity) - (a.contribution ?? -Infinity));
    return {
        baseStats,
        currentStats: current,
        candidates,
        activeCandidateIds: Array.isArray(state.activeCandidateIds) && state.activeCandidateIds.length > 0
            ? [...state.activeCandidateIds]
            : (state.activeCandidateId ? [state.activeCandidateId] : []),
        activeCandidateId: state.activeCandidateId || null,
    };
}

function equipmentSummary(build) {
    const lightcone = Registry.lightcone.get(build?.lightcone?.id);
    return {
        lightconeId: build?.lightcone?.id || null,
        lightconeName: lightcone?.name || build?.lightcone?.id || '未装備',
        superimpose: build?.lightcone?.id ? (build.lightcone.superimpose || 1) : null,
    };
}

function activeEffectSummary(items, activeIds) {
    const active = new Set(activeIds || []);
    return items.filter(item => active.has(item.key)).map(item => ({
        id: item.key,
        source: item.source,
        name: item.effect.name,
    }));
}

function calculationSummary(state) {
    const character = Registry.character.get(state.build?.characterId);
    return {
        inputMode: state.inputMode,
        target: {
            characterId: state.build?.characterId || null,
            characterName: character?.name || state.build?.characterId || '直接入力',
            candidateIds: Array.isArray(state.activeCandidateIds) && state.activeCandidateIds.length > 0
                ? [...state.activeCandidateIds]
                : (state.activeCandidateId ? [state.activeCandidateId] : []),
            candidateId: state.activeCandidateId || null,
            eidolon: state.build?.eidolon || 0,
            ...equipmentSummary(state.build),
            activeEffects: activeEffectSummary(gatherFocusEffects(state.build), state.build?.activeSelfEffectIds),
        },
        party: state.party.flatMap((slot, index) => {
            const build = partyBuildFor(slot);
            if (!build) return [];
            const member = Registry.character.get(build.characterId);
            const ornament = Registry.ornament.get(slot.ornamentId);
            return [{
                slot: index + 2,
                characterId: build.characterId,
                characterName: member?.name || build.characterId,
                eidolon: build.eidolon || 0,
                ...equipmentSummary(build),
                ornamentId: slot.ornamentId || null,
                ornamentName: ornament?.name || slot.ornamentId || '未装備',
                activeEffects: activeEffectSummary(gatherTeammateEffects(build), slot.activeEffectIds),
            }];
        }),
        options: { ...state.options },
    };
}

function makeCase(label, state, baseline) {
    const computed = computeDiminishingState(state);
    const comparison = Diminishing.compareStats(baseline.finalStats, computed.finalStats, state.options);
    return {
        label,
        state: serializeDiminishingState(state),
        finalStats: computed.finalStats,
        damage: computed.damage,
        attacks: computed.attacks,
        calculation: calculationSummary(state),
        differencePercent: Object.fromEntries(Object.entries(comparison.factors.totals).map(([key, value]) => [
            key, value.contribution * 100,
        ])),
        comparison,
    };
}

export function expandDiminishingVariations(job) {
    const variations = Array.isArray(job.variations) && job.variations.length
        ? job.variations.map(item => ({ label: item.label, changes: item.changes || {} }))
        : [{ label: '現在', changes: {} }];
    if (!job.matrix) return variations;
    const rows = Array.isArray(job.matrix.rows) && job.matrix.rows.length ? job.matrix.rows : [{ label: '', changes: {} }];
    const columns = Array.isArray(job.matrix.columns) && job.matrix.columns.length ? job.matrix.columns : [{ label: '', changes: {} }];
    const matrixCases = [];
    for (const row of rows) {
        for (const column of columns) {
            matrixCases.push({
                label: [row.label, column.label].filter(Boolean).join(' × '),
                changes: mergeDiminishingChanges(row.changes, column.changes),
                rowLabel: row.label,
                columnLabel: column.label,
            });
        }
    }
    return variations.length === 1 && variations[0].label === '現在'
        ? matrixCases
        : variations.flatMap(variation => matrixCases.map(item => ({
            ...item,
            label: [variation.label, item.label].filter(Boolean).join(' / '),
            changes: mergeDiminishingChanges(variation.changes, item.changes),
        })));
}

export function runDiminishingJob(job) {
    const baseState = createDiminishingState(job.baseState || {});
    const baseline = computeDiminishingState(baseState);
    const cases = expandDiminishingVariations(job).map(variation => {
        const nextState = createDiminishingState(serializeDiminishingState(baseState));
        applyDiminishingChanges(nextState, variation.changes);
        return {
            ...makeCase(variation.label || '比較条件', nextState, baseline),
            changes: cloneDiminishingValue(variation.changes),
            ...(variation.rowLabel === undefined ? {} : { rowLabel: variation.rowLabel }),
            ...(variation.columnLabel === undefined ? {} : { columnLabel: variation.columnLabel }),
        };
    });

    let snapshotComparison = null;
    const snapshot = baseState.inputMode === 'direct' ? baseState.direct.snapshot : baseState.snapshot;
    if (snapshot) {
        const before = baseState.inputMode === 'direct'
            ? Diminishing.directStatsToFinalStats(snapshot)
            : StatComputer.compute(snapshot);
        snapshotComparison = Diminishing.compareStats(before, baseline.finalStats, baseState.options);
    }

    return {
        objective: job.objective || '限界効用比較',
        fixedConditions: [...(job.fixedConditions || [])],
        metrics: [...(job.metrics || DIMINISHING_METRICS)],
        base: {
            finalStats: baseline.finalStats,
            damage: baseline.damage,
            attacks: baseline.attacks,
            calculation: calculationSummary(baseState),
        },
        cases,
        snapshotComparison,
        matrix: job.matrix ? {
            rows: job.matrix.rows?.map(item => item.label) || [],
            columns: job.matrix.columns?.map(item => item.label) || [],
        } : null,
    };
}
