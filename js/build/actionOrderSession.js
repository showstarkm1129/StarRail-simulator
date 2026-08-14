// actionOrderSession.js — 行動順タブの DOM 非依存セッション状態
//
// diminishingSession.js と同じ形 (getState / serialize / checkpoint / mutate / undo / restore)。
// 保存形式は行動順タブが既に使っている srsim.speedAdvanced.v1 をそのまま用いる。

import {
    ACTION_ORDER_STATE_SCHEMA,
    normalizePanel,
    normalizeTurns,
    normalizeQuickPresets,
    normalizeNumber,
    serializePanel,
    PANEL_DEFAULTS,
} from './actionOrder.js';

export { ACTION_ORDER_STATE_SCHEMA };

/** 1 セッションで扱えるパネル数の上限 (画面の横スクロール前提の実用上限) */
export const MAX_PANELS = 8;

export function createActionOrderState(initial = {}) {
    const panels = Array.isArray(initial.panels) ? initial.panels : [];
    return {
        schema: ACTION_ORDER_STATE_SCHEMA,
        panels: panels.slice(0, MAX_PANELS).map((panel, index) => normalizePanel(panel, index)),
        quickPresets: normalizeQuickPresets(initial.quickPresets),
    };
}

export function serializeActionOrderState(state) {
    return {
        schema: ACTION_ORDER_STATE_SCHEMA,
        panels: (state.panels || []).map(serializePanel),
        quickPresets: normalizeQuickPresets(state.quickPresets),
    };
}

function replaceObject(target, next) {
    for (const key of Object.keys(target)) delete target[key];
    Object.assign(target, next);
    return target;
}

/** 変更案の1件分を検証する。問題があればエラー配列を返す。 */
function validatePanelPatch(patch, path, panelCount) {
    const errors = [];
    if (!patch || typeof patch !== 'object') {
        errors.push({ path, message: 'パネル指定がオブジェクトではありません。' });
        return errors;
    }
    if (patch.index !== undefined) {
        if (!Number.isInteger(patch.index) || patch.index < 0 || patch.index >= panelCount) {
            errors.push({ path: `${path}.index`, message: `0〜${panelCount - 1} のパネル番号を指定してください。` });
        }
    }
    for (const key of ['baseSpeed', 'preSpeed', 'threshold']) {
        if (patch[key] === undefined) continue;
        const value = Number(patch[key]);
        if (!Number.isFinite(value) || value < 1) {
            errors.push({ path: `${path}.${key}`, message: '1 以上の数値が必要です。' });
        }
    }
    if (patch.turns !== undefined && !Array.isArray(patch.turns)) {
        errors.push({ path: `${path}.turns`, message: 'turns は配列で指定してください。' });
    }
    return errors;
}

/**
 * 変更案を検証する。適用はしない。
 *   changes.panels  … 全パネルを置き換える (AI が最終形を提示する場合)
 *   changes.patches … 既存パネルへの部分更新 [{ index, name?, baseSpeed?, preSpeed?, threshold?, turns? }]
 */
export function validateActionOrderChanges(state, changes = {}) {
    const errors = [];
    const hasPanels = Array.isArray(changes.panels);
    const hasPatches = Array.isArray(changes.patches);
    if (!hasPanels && !hasPatches) {
        errors.push({ path: '$', message: 'panels または patches のどちらかが必要です。' });
    }
    if (hasPanels) {
        if (changes.panels.length === 0) errors.push({ path: '$.panels', message: 'パネルが空です。' });
        if (changes.panels.length > MAX_PANELS) {
            errors.push({ path: '$.panels', message: `パネルは ${MAX_PANELS} 個までです。` });
        }
        changes.panels.forEach((panel, index) => {
            errors.push(...validatePanelPatch(
                { ...panel, index: undefined }, `$.panels[${index}]`, changes.panels.length,
            ));
        });
    }
    if (hasPatches) {
        changes.patches.forEach((patch, index) => {
            errors.push(...validatePanelPatch(patch, `$.patches[${index}]`, state.panels.length));
        });
    }
    return { valid: errors.length === 0, errors };
}

function applyPatchToPanel(panel, patch) {
    return normalizePanel({
        name: patch.name !== undefined ? patch.name : panel.name,
        baseSpeed: patch.baseSpeed !== undefined
            ? normalizeNumber(patch.baseSpeed, PANEL_DEFAULTS.baseSpeed, 1) : panel.baseSpeed,
        preSpeed: patch.preSpeed !== undefined
            ? normalizeNumber(patch.preSpeed, PANEL_DEFAULTS.preSpeed, 1) : panel.preSpeed,
        threshold: patch.threshold !== undefined
            ? normalizeNumber(patch.threshold, PANEL_DEFAULTS.threshold, 1) : panel.threshold,
        turns: patch.turns !== undefined ? normalizeTurns(patch.turns) : panel.turns,
    });
}

/** 変更案を適用した新しい状態を返す (入力は変更しない) */
export function applyActionOrderChanges(inputState, changes = {}) {
    const state = createActionOrderState(serializeActionOrderState(inputState));
    if (Array.isArray(changes.panels)) {
        state.panels = changes.panels.slice(0, MAX_PANELS).map((panel, index) => normalizePanel(panel, index));
    }
    if (Array.isArray(changes.patches)) {
        for (const patch of changes.patches) {
            const index = Number.isInteger(patch.index) ? patch.index : 0;
            if (!state.panels[index]) continue;
            state.panels[index] = applyPatchToPanel(state.panels[index], patch);
        }
    }
    return state;
}

export function createActionOrderSession(initial = {}) {
    const state = createActionOrderState(initial);
    const undoStack = [];
    const pushCheckpoint = () => {
        undoStack.push(serializeActionOrderState(state));
        if (undoStack.length > 20) undoStack.shift();
        return undoStack.length;
    };
    return Object.freeze({
        getState: () => state,
        serialize: () => serializeActionOrderState(state),
        clone: () => createActionOrderState(serializeActionOrderState(state)),
        checkpoint: pushCheckpoint,
        restore(payload, { checkpoint = false } = {}) {
            const source = payload?.state && typeof payload.state === 'object' ? payload.state : payload;
            if (!source || typeof source !== 'object') throw new Error('行動順の状態ではありません。');
            if (checkpoint) pushCheckpoint();
            else undoStack.length = 0;
            replaceObject(state, createActionOrderState(source));
            return state;
        },
        mutate(mutator, { checkpoint = false } = {}) {
            if (typeof mutator !== 'function') throw new Error('変更関数が必要です。');
            if (checkpoint) pushCheckpoint();
            mutator(state);
            return state;
        },
        applyChanges(changes, { checkpoint = true } = {}) {
            if (checkpoint) pushCheckpoint();
            replaceObject(state, applyActionOrderChanges(state, changes));
            return state;
        },
        canUndo: () => undoStack.length > 0,
        undo() {
            const previous = undoStack.pop();
            if (!previous) return null;
            replaceObject(state, createActionOrderState(previous));
            return state;
        },
    });
}

export const actionOrderSession = createActionOrderSession();
