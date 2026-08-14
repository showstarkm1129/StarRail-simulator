import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    ACTION_ORDER_STATE_SCHEMA,
    MAX_PANELS,
    createActionOrderState,
    serializeActionOrderState,
    validateActionOrderChanges,
    applyActionOrderChanges,
    createActionOrderSession,
} from '../js/build/actionOrderSession.js';

function baseState() {
    return {
        panels: [
            { name: 'A', baseSpeed: 100, preSpeed: 100, threshold: 150, turns: [] },
            { name: 'B', baseSpeed: 134, preSpeed: 134, threshold: 150, turns: [] },
        ],
    };
}

test('createActionOrderState: パネルを正規化し、上限で切り捨てる', () => {
    const state = createActionOrderState(baseState());
    assert.equal(state.schema, ACTION_ORDER_STATE_SCHEMA);
    assert.equal(state.panels.length, 2);
    assert.equal(state.panels[0].name, 'A');

    const many = createActionOrderState({ panels: Array.from({ length: MAX_PANELS + 3 }, () => ({})) });
    assert.equal(many.panels.length, MAX_PANELS);
});

test('createActionOrderState: panels が無ければ空で作る', () => {
    assert.deepEqual(createActionOrderState().panels, []);
    assert.deepEqual(createActionOrderState({ panels: 'invalid' }).panels, []);
});

test('serializeActionOrderState: 保存形へ落とせる', () => {
    const state = createActionOrderState(baseState());
    const serialized = serializeActionOrderState(state);
    assert.equal(serialized.schema, ACTION_ORDER_STATE_SCHEMA);
    assert.equal(serialized.panels[1].baseSpeed, 134);
});

test('createActionOrderState: クイック追加のAI参照メモを保存形へ引き継ぐ', () => {
    const state = createActionOrderState({
        ...baseState(),
        quickPresets: [{ id: 'tingyun-ult', type: 'advance', value: 20, label: '天賦短縮', memo: '必殺技後に使う' }],
    });
    assert.deepEqual(serializeActionOrderState(state).quickPresets, [{
        id: 'tingyun-ult', type: 'advance', value: 20, name: '', label: '天賦短縮', memo: '必殺技後に使う',
    }]);
});

// ---- 検証 ----

test('validateActionOrderChanges: panels も patches も無ければ不正', () => {
    const state = createActionOrderState(baseState());
    const result = validateActionOrderChanges(state, {});
    assert.equal(result.valid, false);
    assert.match(result.errors[0].message, /panels または patches/);
});

test('validateActionOrderChanges: 正しい patches は通る', () => {
    const state = createActionOrderState(baseState());
    assert.equal(validateActionOrderChanges(state, { patches: [{ index: 1, preSpeed: 160 }] }).valid, true);
});

test('validateActionOrderChanges: 範囲外のパネル番号を弾く', () => {
    const state = createActionOrderState(baseState());
    const result = validateActionOrderChanges(state, { patches: [{ index: 9, preSpeed: 160 }] });
    assert.equal(result.valid, false);
    assert.equal(result.errors[0].path, '$.patches[0].index');
});

test('validateActionOrderChanges: 速度は 1 未満を弾く', () => {
    const state = createActionOrderState(baseState());
    const result = validateActionOrderChanges(state, { patches: [{ index: 0, baseSpeed: 0, preSpeed: -1 }] });
    assert.equal(result.valid, false);
    assert.deepEqual(result.errors.map(error => error.path), ['$.patches[0].baseSpeed', '$.patches[0].preSpeed']);
});

test('validateActionOrderChanges: turns は配列でなければ弾く', () => {
    const state = createActionOrderState(baseState());
    const result = validateActionOrderChanges(state, { patches: [{ index: 0, turns: 'なし' }] });
    assert.equal(result.valid, false);
    assert.equal(result.errors[0].path, '$.patches[0].turns');
});

test('validateActionOrderChanges: 空の panels と上限超過を弾く', () => {
    const state = createActionOrderState(baseState());
    assert.equal(validateActionOrderChanges(state, { panels: [] }).valid, false);
    const tooMany = validateActionOrderChanges(state, {
        panels: Array.from({ length: MAX_PANELS + 1 }, () => ({ name: 'x' })),
    });
    assert.equal(tooMany.valid, false);
});

test('validateActionOrderChanges: パネル指定がオブジェクトでなければ弾く', () => {
    const state = createActionOrderState(baseState());
    const result = validateActionOrderChanges(state, { patches: ['bad'] });
    assert.equal(result.valid, false);
    assert.match(result.errors[0].message, /オブジェクト/);
});

// ---- 適用 ----

test('applyActionOrderChanges: patches は指定項目だけを差し替える', () => {
    const state = createActionOrderState(baseState());
    const next = applyActionOrderChanges(state, { patches: [{ index: 1, preSpeed: 160 }] });

    assert.equal(next.panels[1].preSpeed, 160);
    assert.equal(next.panels[1].baseSpeed, 134, '指定していない項目は元のまま');
    assert.equal(next.panels[1].name, 'B');
    assert.equal(state.panels[1].preSpeed, 134, '入力状態は変更しない');
});

test('applyActionOrderChanges: panels は全置換する', () => {
    const state = createActionOrderState(baseState());
    const next = applyActionOrderChanges(state, { panels: [{ name: 'C', baseSpeed: 120, preSpeed: 120 }] });
    assert.equal(next.panels.length, 1);
    assert.equal(next.panels[0].name, 'C');
});

test('applyActionOrderChanges: 存在しないパネル番号の patch は無視する', () => {
    const state = createActionOrderState(baseState());
    const next = applyActionOrderChanges(state, { patches: [{ index: 5, preSpeed: 999 }] });
    assert.deepEqual(next.panels.map(panel => panel.preSpeed), [100, 134]);
});

test('applyActionOrderChanges: index 省略時は先頭パネルを更新する', () => {
    const state = createActionOrderState(baseState());
    const next = applyActionOrderChanges(state, { patches: [{ preSpeed: 111 }] });
    assert.equal(next.panels[0].preSpeed, 111);
});

test('applyActionOrderChanges: turns を差し替えられる', () => {
    const state = createActionOrderState(baseState());
    const next = applyActionOrderChanges(state, {
        patches: [{ index: 0, turns: [{ events: [{ type: 'advance', value: 25 }] }] }],
    });
    assert.equal(next.panels[0].turns[0].events[0].value, 25);
});

// ---- セッション ----

test('セッション: applyChanges で変更でき、undo で戻せる', () => {
    const session = createActionOrderSession(baseState());
    assert.equal(session.canUndo(), false);

    session.applyChanges({ patches: [{ index: 0, preSpeed: 180 }] });
    assert.equal(session.getState().panels[0].preSpeed, 180);
    assert.equal(session.canUndo(), true);

    session.undo();
    assert.equal(session.getState().panels[0].preSpeed, 100);
    assert.equal(session.canUndo(), false);
    assert.equal(session.undo(), null);
});

test('セッション: restore で画面状態を取り込み、undo 履歴は消える', () => {
    const session = createActionOrderSession(baseState());
    session.applyChanges({ patches: [{ index: 0, preSpeed: 180 }] });
    session.restore({ panels: [{ name: 'Z', baseSpeed: 90, preSpeed: 90, threshold: 100, turns: [] }] });

    assert.equal(session.getState().panels.length, 1);
    assert.equal(session.getState().panels[0].name, 'Z');
    assert.equal(session.canUndo(), false);
});

test('セッション: restore は { state } 包みも受け付け、不正値は例外', () => {
    const session = createActionOrderSession(baseState());
    session.restore({ state: { panels: [{ name: 'W' }] } });
    assert.equal(session.getState().panels[0].name, 'W');
    assert.throws(() => session.restore(null), /行動順の状態/);
});

test('セッション: restore に checkpoint を指定すると undo できる', () => {
    const session = createActionOrderSession(baseState());
    session.restore({ panels: [{ name: 'Z' }] }, { checkpoint: true });
    assert.equal(session.canUndo(), true);
    session.undo();
    assert.equal(session.getState().panels.length, 2);
});

test('セッション: mutate で直接編集でき、関数以外は例外', () => {
    const session = createActionOrderSession(baseState());
    session.mutate(state => { state.panels[0].name = '変更'; }, { checkpoint: true });
    assert.equal(session.getState().panels[0].name, '変更');
    session.undo();
    assert.equal(session.getState().panels[0].name, 'A');
    assert.throws(() => session.mutate('not a function'), /変更関数/);
});

test('セッション: clone は独立した状態を返す', () => {
    const session = createActionOrderSession(baseState());
    const copy = session.clone();
    copy.panels[0].name = '別物';
    assert.equal(session.getState().panels[0].name, 'A');
});

test('セッション: undo 履歴は20件までに保たれる', () => {
    const session = createActionOrderSession(baseState());
    for (let i = 0; i < 25; i++) session.applyChanges({ patches: [{ index: 0, preSpeed: 100 + i }] });
    let count = 0;
    while (session.undo()) count++;
    assert.equal(count, 20);
});

test('セッション: applyChanges で checkpoint を無効にできる', () => {
    const session = createActionOrderSession(baseState());
    session.applyChanges({ patches: [{ index: 0, preSpeed: 180 }] }, { checkpoint: false });
    assert.equal(session.canUndo(), false);
    assert.equal(session.getState().panels[0].preSpeed, 180);
});
