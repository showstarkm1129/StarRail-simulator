// diminishingSession.js — 限界効用タブの DOM 非依存セッション状態

import { ALL_SLOTS } from './constants.js';
import { Diminishing } from './diminishing.js';
import { signatureLightconeForCharacter } from '../data/lightcones/signatureRelations.js';

export const DIMINISHING_STATE_SCHEMA = 'srsim.diminishing.v2';

export const DIRECT_DEFAULTS = Object.freeze({
    critRate: 0.05,
    critDmg: 0.50,
    energyRegen: 1.00,
});

export const DEFAULT_VISIBLE_ROWS = Object.freeze([
    'atk', 'crit', 'def', 'res', 'taken', 'break',
    'dmg.base', 'total.base',
]);

export const DEFAULT_VISIBLE_STATS = Object.freeze([
    'atk', 'hp', 'def', 'spd',
    'critRate', 'critDmg', 'critExpected',
    'energyRegen', 'dmgOwnElement', 'breakEffect',
]);

const EMPTY_PARTY_SLOT = Object.freeze({
    mode: 'simple',
    characterId: null,
    levelPreset: 'eidolon',
    lightcone: null,
    ornamentId: null,
    buildId: null,
    build: null,
    activeEffectIds: [],
    stacksByEffectId: {},
});

function assertCloneable(value, path = '$') {
    if (value === undefined) throw new Error(`${path} に undefined は保存できません。`);
    if (typeof value === 'number' && !Number.isFinite(value)) {
        throw new Error(`${path} に有限でない数値は保存できません。`);
    }
    if (!value || typeof value !== 'object') return;
    if (value instanceof Set) {
        for (const item of value) assertCloneable(item, `${path}[]`);
        return;
    }
    for (const [key, item] of Object.entries(value)) assertCloneable(item, `${path}.${key}`);
}

export function cloneDiminishingValue(value) {
    assertCloneable(value);
    if (value instanceof Set) return new Set(Array.from(value, cloneDiminishingValue));
    if (Array.isArray(value)) return value.map(cloneDiminishingValue);
    if (value && typeof value === 'object') {
        return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cloneDiminishingValue(item)]));
    }
    return value;
}

function createSubs(raw = {}) {
    const perSlot = {};
    for (const slot of ALL_SLOTS) {
        const source = raw.perSlot?.[slot] || {};
        perSlot[slot] = {
            allocations: { ...(source.allocations || {}) },
            tier: source.tier || 'high',
            lastResult: source.lastResult ? cloneDiminishingValue(source.lastResult) : null,
        };
    }
    return {
        mode: ['manual', 'total', 'perSlot'].includes(raw.mode) ? raw.mode : 'manual',
        manual: { ...(raw.manual || {}) },
        total: {
            allocations: { ...(raw.total?.allocations || {}) },
            tier: raw.total?.tier || 'high',
            lastResult: raw.total?.lastResult ? cloneDiminishingValue(raw.total.lastResult) : null,
        },
        perSlot,
    };
}

export function restorePartySlot(raw = {}) {
    const hasSavedBuild = Boolean(raw.build || raw.buildId);
    const mode = raw.mode === 'build' && hasSavedBuild ? 'build' : 'simple';
    const characterId = raw.characterId || null;
    return {
        ...EMPTY_PARTY_SLOT,
        mode,
        characterId,
        levelPreset: raw.levelPreset === 'default' ? 'default' : 'eidolon',
        lightcone: raw.lightcone
            ? cloneDiminishingValue(raw.lightcone)
            : mode === 'simple' ? signatureLightconeForCharacter(characterId) : null,
        ornamentId: raw.ornamentId || null,
        buildId: raw.buildId || null,
        build: raw.build ? cloneDiminishingValue(raw.build) : null,
        activeEffectIds: new Set(Array.isArray(raw.activeEffectIds) ? raw.activeEffectIds : []),
        stacksByEffectId: { ...(raw.stacksByEffectId || {}) },
    };
}

export function createDiminishingState(initial = {}) {
    const direct = initial.direct || {};
    const activeCandidateIds = Array.isArray(initial.activeCandidateIds)
        ? [...new Set(initial.activeCandidateIds.filter(id => typeof id === 'string' && id))]
        : (typeof initial.activeCandidateId === 'string' && initial.activeCandidateId
            ? [initial.activeCandidateId]
            : []);
    return {
        schema: DIMINISHING_STATE_SCHEMA,
        build: initial.build ? cloneDiminishingValue(initial.build) : null,
        // キャラビルドに保存された差分候補のうち、現在適用中の候補。
        // 項目ごとに1件ずつ選べる。activeCandidateId は旧状態との互換用。
        activeCandidateIds,
        activeCandidateId: activeCandidateIds.length === 1 ? activeCandidateIds[0] : null,
        snapshot: initial.snapshot ? cloneDiminishingValue(initial.snapshot) : null,
        inputMode: initial.inputMode === 'direct' ? 'direct' : 'build',
        direct: {
            stats: { ...DIRECT_DEFAULTS, ...(direct.stats || {}) },
            snapshot: direct.snapshot ? cloneDiminishingValue(direct.snapshot) : null,
        },
        options: { ...Diminishing.DEFAULT_OPTIONS, ...(initial.options || {}) },
        party: [0, 1, 2].map(index => restorePartySlot(initial.party?.[index])),
        subs: createSubs(initial.subs),
        visibleRows: new Set(Array.isArray(initial.visibleRows) ? initial.visibleRows : DEFAULT_VISIBLE_ROWS),
        filterPanelOpen: Boolean(initial.filterPanelOpen),
        visibleStats: new Set(Array.isArray(initial.visibleStats) ? initial.visibleStats : DEFAULT_VISIBLE_STATS),
        statsPanelOpen: Boolean(initial.statsPanelOpen),
    };
}

function serializePartySlot(slot) {
    return {
        mode: slot.mode,
        characterId: slot.characterId,
        levelPreset: slot.levelPreset,
        lightcone: slot.lightcone ? cloneDiminishingValue(slot.lightcone) : null,
        ornamentId: slot.ornamentId || null,
        buildId: slot.buildId,
        build: slot.build ? cloneDiminishingValue(slot.build) : null,
        activeEffectIds: Array.from(slot.activeEffectIds || []),
        stacksByEffectId: { ...(slot.stacksByEffectId || {}) },
    };
}

export function serializeDiminishingState(state) {
    const activeCandidateIds = Array.isArray(state.activeCandidateIds) && state.activeCandidateIds.length > 0
        ? [...state.activeCandidateIds]
        : (typeof state.activeCandidateId === 'string' && state.activeCandidateId
            ? [state.activeCandidateId]
            : []);
    return {
        schema: DIMINISHING_STATE_SCHEMA,
        inputMode: state.inputMode,
        build: state.build ? cloneDiminishingValue(state.build) : null,
        activeCandidateIds,
        activeCandidateId: activeCandidateIds.length === 1 ? activeCandidateIds[0] : null,
        snapshot: state.snapshot ? cloneDiminishingValue(state.snapshot) : null,
        direct: cloneDiminishingValue(state.direct),
        options: { ...state.options },
        party: state.party.map(serializePartySlot),
        subs: cloneDiminishingValue(state.subs),
        visibleRows: Array.from(state.visibleRows || []),
        visibleStats: Array.from(state.visibleStats || []),
        filterPanelOpen: Boolean(state.filterPanelOpen),
        statsPanelOpen: Boolean(state.statsPanelOpen),
    };
}

function replaceObject(target, next) {
    for (const key of Object.keys(target)) delete target[key];
    Object.assign(target, next);
    return target;
}

export function createDiminishingSession(initial = {}) {
    const state = createDiminishingState(initial);
    const undoStack = [];
    const pushCheckpoint = () => {
        undoStack.push(serializeDiminishingState(state));
        if (undoStack.length > 20) undoStack.shift();
        return undoStack.length;
    };
    return Object.freeze({
        getState: () => state,
        serialize: () => serializeDiminishingState(state),
        clone: () => createDiminishingState(serializeDiminishingState(state)),
        checkpoint: pushCheckpoint,
        restore(payload, { checkpoint = false } = {}) {
            const source = payload?.state && typeof payload.state === 'object' ? payload.state : payload;
            if (!source || typeof source !== 'object') throw new Error('限界効用の状態ではありません。');
            if (checkpoint) pushCheckpoint();
            else undoStack.length = 0;
            replaceObject(state, createDiminishingState(source));
            return state;
        },
        mutate(mutator, { checkpoint = false } = {}) {
            if (typeof mutator !== 'function') throw new Error('変更関数が必要です。');
            if (checkpoint) pushCheckpoint();
            mutator(state);
            return state;
        },
        canUndo: () => undoStack.length > 0,
        undo() {
            const previous = undoStack.pop();
            if (!previous) return null;
            replaceObject(state, createDiminishingState(previous));
            return state;
        },
    });
}

export const diminishingSession = createDiminishingSession();
