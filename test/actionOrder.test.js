import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    ACTION_ORDER_STATE_SCHEMA,
    EVENT_TYPES,
    PANEL_DEFAULTS,
    normalizeNumber,
    normalizeEvent,
    normalizeQuickPreset,
    normalizeQuickPresets,
    normalizeTurns,
    trimEmptyTrailingTurns,
    normalizePanel,
    serializePanel,
    buildStatePayload,
    normalizeState,
    parseStateText,
    evTiming,
    evOffset,
    evAtAV,
    evAutoLabel,
    evLabel,
    simulateTurn,
    computeTimeline,
    computeAllTimelines,
    summarizeTimeline,
} from '../js/build/actionOrder.js';

function panel(overrides = {}) {
    return normalizePanel({ name: 'テスト', baseSpeed: 100, preSpeed: 100, threshold: 150, turns: [], ...overrides });
}

// ---- 正規化 ----

test('normalizeNumber: 数値化できない値は既定値、minValue で下限を切り上げる', () => {
    assert.equal(normalizeNumber('123.5', 0), 123.5);
    assert.equal(normalizeNumber('あ', 42), 42);
    assert.equal(normalizeNumber(undefined, 7), 7);
    assert.equal(normalizeNumber(-5, 0, 1), 1);
    assert.equal(normalizeNumber(-5, 0), -5);
});

test('normalizeEvent: 未知の種別は advance、既定値と timing が補完される', () => {
    assert.deepEqual(normalizeEvent({ type: 'unknown' }), {
        type: 'advance', value: EVENT_TYPES.advance.def, name: '', timing: 'turn',
        offset: 0, atAV: 100, refPanel: 0, refTurn: 1,
    });
    assert.deepEqual(normalizeEvent({ type: 'speedFlat', value: 30, timing: 'cum', atAV: 80, name: '花火' }), {
        type: 'speedFlat', value: 30, name: '花火', timing: 'cum',
        offset: 0, atAV: 80, refPanel: 0, refTurn: 1,
    });
    // offset / atAV は負値を許さない
    assert.equal(normalizeEvent({ offset: -10 }).offset, 0);
    assert.equal(normalizeEvent({ atAV: -10 }).atAV, 0);
});

test('normalizeEvent: パネル参照は整数へ丸め、下限を守る', () => {
    const event = normalizeEvent({ type: 'advance', timing: 'panel', refPanel: 1.6, refTurn: 2.4 });
    assert.equal(event.timing, 'panel');
    assert.equal(event.refPanel, 2);
    assert.equal(event.refTurn, 2);
    assert.equal(normalizeEvent({ timing: 'panel', refPanel: -3, refTurn: 0 }).refPanel, 0);
    assert.equal(normalizeEvent({ timing: 'panel', refPanel: -3, refTurn: 0 }).refTurn, 1);
});

test('normalizeQuickPresets: AI参照用メモを保持し、不正・重複IDを除外する', () => {
    const presets = normalizeQuickPresets([
        { id: 'ddd', type: 'advance', value: 24, name: 'DDD', memo: '必殺技後に全体短縮' },
        { id: 'ddd', type: 'speedFlat', value: 99 },
        { id: '', type: 'advance', value: 10 },
    ]);
    assert.deepEqual(presets, [{
        id: 'ddd', type: 'advance', value: 24, name: 'DDD', label: 'DDD', memo: '必殺技後に全体短縮',
    }]);
    assert.equal(normalizeQuickPreset({ id: 'x', type: 'speedPct', value: 12 }).label, '速度+12%');
});

test('normalizeTurns: 配列でない入力は空、events 欠落は空配列になる', () => {
    assert.deepEqual(normalizeTurns(null), []);
    assert.deepEqual(normalizeTurns([{}, { events: null }]), [{ events: [] }, { events: [] }]);
    assert.equal(normalizeTurns([{ events: [{ type: 'advance', value: 25 }] }])[0].events.length, 1);
});

test('trimEmptyTrailingTurns: 末尾の空ターンだけを落とす', () => {
    const turns = [
        { events: [{ type: 'advance', value: 25 }] },
        { events: [] },
        { events: [{ type: 'speedFlat', value: 10 }] },
        { events: [] },
        { events: [] },
    ];
    assert.equal(trimEmptyTrailingTurns(turns).length, 3);
    assert.deepEqual(trimEmptyTrailingTurns([{ events: [] }]), []);
});

test('normalizePanel: 名前が空なら index から既定名、速度は 1 未満にならない', () => {
    const result = normalizePanel({ name: '   ', baseSpeed: 0, preSpeed: -3, threshold: 0 }, 2);
    assert.equal(result.name, 'キャラ3');
    assert.equal(result.baseSpeed, 1);
    assert.equal(result.preSpeed, 1);
    assert.equal(result.threshold, 1);
    assert.deepEqual(result.turns, []);
});

test('normalizePanel: 値が無いときは既定値を使う', () => {
    const result = normalizePanel({});
    assert.equal(result.baseSpeed, PANEL_DEFAULTS.baseSpeed);
    assert.equal(result.preSpeed, PANEL_DEFAULTS.preSpeed);
    assert.equal(result.threshold, PANEL_DEFAULTS.threshold);
});

test('serializePanel: 末尾の空ターンを落として保存形へ変換する', () => {
    const result = serializePanel({
        name: '花火', baseSpeed: 134, preSpeed: 160, threshold: 200,
        turns: [{ events: [{ type: 'advance', value: 50 }] }, { events: [] }],
    });
    assert.equal(result.name, '花火');
    assert.equal(result.turns.length, 1);
});

test('buildStatePayload: schema と mode を含む保存形を返す', () => {
    const payload = buildStatePayload([{ name: 'A' }], 'panel');
    assert.equal(payload.schema, ACTION_ORDER_STATE_SCHEMA);
    assert.equal(payload.mode, 'panel');
    assert.equal(payload.panels.length, 1);
    assert.equal(buildStatePayload([], 'その他').mode, 'all');
    assert.deepEqual(buildStatePayload(null).panels, []);
});

test('normalizeState: 配列 / panels / panel の3形式を受け付ける', () => {
    assert.equal(normalizeState([{ name: 'A' }, { name: 'B' }]).panels.length, 2);
    assert.equal(normalizeState({ panels: [{ name: 'A' }] }).mode, 'all');
    assert.equal(normalizeState({ panel: { name: 'A' } }).mode, 'panel');
    assert.throws(() => normalizeState({ panels: [] }), /panels/);
    assert.throws(() => normalizeState(null), /panels/);
});

test('parseStateText: JSON 文字列から状態を復元する', () => {
    const text = JSON.stringify({ panels: [{ name: 'A', baseSpeed: 120 }] });
    assert.equal(parseStateText(text).panels[0].baseSpeed, 120);
});

// ---- イベント参照ヘルパ ----

test('イベント参照ヘルパ: 旧データの欠落値を補って読む', () => {
    assert.equal(evTiming({ timing: 'cum' }), 'cum');
    assert.equal(evTiming({}), 'turn');
    assert.equal(evOffset({}), 0);
    assert.equal(evOffset({ offset: 12 }), 12);
    assert.equal(evAtAV({}), 0);
    assert.equal(evAtAV({ atAV: 90 }), 90);
});

test('evAutoLabel / evLabel: 種別ごとの自動ラベルとカスタム名', () => {
    assert.equal(evAutoLabel({ type: 'advance', value: 25 }), '短縮25%');
    assert.equal(evAutoLabel({ type: 'speedFlat', value: 20 }), '速度+20');
    assert.equal(evAutoLabel({ type: 'speedPct', value: 12 }), '速度+12%');
    assert.equal(evLabel({ type: 'advance', value: 25, name: '  ' }), '短縮25%');
    assert.equal(evLabel({ type: 'advance', value: 25, name: ' 花火 ' }), '花火');
});

// ---- シミュレーション ----

test('simulateTurn: 効果が無ければ 10000 / 速度 の行動値を消費する', () => {
    const result = simulateTurn(panel({ preSpeed: 100 }), []);
    assert.ok(Math.abs(result.actualAV - 100) < 1e-9);
    assert.equal(result.startSpeed, 100);
    assert.equal(result.endSpeed, 100);
});

test('simulateTurn: ターン開始時の行動値短縮はゲージへ即時加算される', () => {
    const result = simulateTurn(panel({ preSpeed: 100 }), [
        { ev: { type: 'advance', value: 25 }, offset: 0 },
    ]);
    // ゲージ2500から開始 → 残り7500を速度100で埋める
    assert.ok(Math.abs(result.actualAV - 75) < 1e-9);
    assert.deepEqual(result.fired, [true]);
});

test('simulateTurn: 速度増加は適用時点以降の充填速度だけを上げる', () => {
    const result = simulateTurn(panel({ baseSpeed: 100, preSpeed: 100 }), [
        { ev: { type: 'speedFlat', value: 100 }, offset: 50 },
    ]);
    // 0〜50AVで5000充填 → 以降は速度200で残り5000 → +25AV
    assert.ok(Math.abs(result.actualAV - 75) < 1e-9);
    assert.equal(result.endSpeed, 200);
});

test('simulateTurn: speedPct は基礎速度に対する割合で加算する', () => {
    const result = simulateTurn(panel({ baseSpeed: 200, preSpeed: 100 }), [
        { ev: { type: 'speedPct', value: 50 }, offset: 0 },
    ]);
    // 200 * 50% = +100 → 速度200
    assert.equal(result.endSpeed, 200);
    assert.ok(Math.abs(result.actualAV - 50) < 1e-9);
});

test('simulateTurn: 行動完了より後に設定された効果は不発になる', () => {
    const result = simulateTurn(panel({ preSpeed: 100 }), [
        { ev: { type: 'speedFlat', value: 100 }, offset: 500 },
    ]);
    assert.ok(Math.abs(result.actualAV - 100) < 1e-9);
    assert.deepEqual(result.fired, [false]);
});

test('simulateTurn: 短縮100%ならゲージが即満タンになり行動値を消費しない', () => {
    const result = simulateTurn(panel({ preSpeed: 100 }), [
        { ev: { type: 'advance', value: 100 }, offset: 0 },
    ]);
    assert.equal(result.actualAV, 0);
});

test('simulateTurn: 速度が未設定でも 1 として扱い落ちない', () => {
    const result = simulateTurn({ baseSpeed: 0, preSpeed: 0 }, []);
    assert.equal(result.startSpeed, 1);
    assert.equal(result.actualAV, 10000);
});

test('simulateTurn: 速度減少イベントでも速度は1未満にならない', () => {
    const result = simulateTurn(panel({ baseSpeed: 100, preSpeed: 100 }), [
        { ev: { type: 'speedFlat', value: -1000 }, offset: 0 },
    ]);
    assert.equal(result.endSpeed, 1);
    assert.ok(Number.isFinite(result.actualAV));
});

// ---- タイムライン ----

test('computeTimeline: 閾値超過後3ターンまで計算し、入力パネルを変更しない', () => {
    const source = panel({ preSpeed: 100, threshold: 150 });
    const before = JSON.stringify(source);
    const { threshold, rows, turnCount } = computeTimeline(source);

    assert.equal(threshold, 150);
    assert.equal(JSON.stringify(source), before, 'panel.turns が書き換えられていない');
    assert.equal(turnCount, rows.length);
    // 100AVずつ進むので T2 で 200AV → 閾値超過。そこから3ターン分。
    assert.deepEqual(rows.map(row => row.turn), [1, 2, 3, 4]);
    assert.deepEqual(rows.map(row => row.pastThreshold), [false, true, true, true]);
});

test('computeTimeline: 閾値を跨ぐ直前の行に区切りフラグが立つ', () => {
    const { rows } = computeTimeline(panel({ preSpeed: 100, threshold: 150 }));
    assert.deepEqual(rows.map(row => row.drawWallBefore), [false, true, false, false]);
});

test('computeTimeline: 累計AV発動(cum)の効果は条件を満たしたターンで一度だけ発動する', () => {
    const source = panel({
        preSpeed: 100,
        threshold: 400,
        turns: [{ events: [{ type: 'advance', value: 50, timing: 'cum', atAV: 150 }] }],
    });
    const { rows } = computeTimeline(source);

    // T1 は 0〜100AV。累計150AV発動なので T2 (100〜) の offset 50 で発動する。
    assert.deepEqual(rows[0].chips, []);
    assert.equal(rows[1].chips.length, 1);
    assert.equal(rows[1].chips[0].kind, 'cum');
    // 以降のターンでは再発動しない
    assert.deepEqual(rows.slice(2).flatMap(row => row.chips), []);
});

test('computeTimeline: turn 効果は不発でもチップとして残る', () => {
    const { rows } = computeTimeline(panel({
        preSpeed: 100,
        threshold: 150,
        turns: [{ events: [{ type: 'speedFlat', value: 50, timing: 'turn', offset: 999 }] }],
    }));
    assert.equal(rows[0].chips.length, 1);
    assert.equal(rows[0].chips[0].notFired, true);
});

test('computeTimeline: 速度が変化したターンには speedChanged が立つ', () => {
    const { rows } = computeTimeline(panel({
        preSpeed: 100,
        threshold: 150,
        turns: [{ events: [{ type: 'speedFlat', value: 50, timing: 'turn', offset: 0 }] }],
    }));
    assert.equal(rows[0].speedChanged, true);
    assert.equal(rows[1].speedChanged, false);
});

test('computeTimeline: threshold が 0 以下なら既定値を使う', () => {
    const { threshold } = computeTimeline({ baseSpeed: 100, preSpeed: 100, threshold: 0, turns: [] });
    assert.equal(threshold, PANEL_DEFAULTS.threshold);
});

test('computeTimeline: turns が配列でなくても落ちない', () => {
    const { rows } = computeTimeline({ baseSpeed: 100, preSpeed: 100, threshold: 150, turns: null });
    assert.ok(rows.length > 0);
});

// ---- パネル間参照 (timing=panel) ----

test('computeAllTimelines: 他パネルの指定ターン到達AVで発動する', () => {
    const [buffer, receiver] = computeAllTimelines([
        // パネル0: 速度200 → T1 は 50AV で終わる
        { name: 'バッファー', baseSpeed: 200, preSpeed: 200, threshold: 300, turns: [] },
        // パネル1: パネル0 の T1 終了 (累計50AV) で速度+100
        {
            name: '受け手', baseSpeed: 100, preSpeed: 100, threshold: 300,
            turns: [{ events: [{ type: 'speedFlat', value: 100, timing: 'panel', refPanel: 0, refTurn: 1 }] }],
        },
    ].map(item => normalizePanel(item)));

    assert.ok(Math.abs(buffer.rows[0].cumulativeAV - 50) < 1e-9);
    // 0〜50AVで5000充填 → 速度200で残り5000 → +25AV
    assert.ok(Math.abs(receiver.rows[0].actualAV - 75) < 1e-9);
    assert.equal(receiver.rows[0].chips[0].kind, 'panel');
    assert.deepEqual(receiver.unresolvedRefs, []);
});

test('computeAllTimelines: 循環参照でも停止し、解けない側を報告する', () => {
    const panelRef = (refPanel) => normalizePanel({
        baseSpeed: 100, preSpeed: 100, threshold: 150,
        turns: [{ events: [{ type: 'speedFlat', value: 100, timing: 'panel', refPanel, refTurn: 1 }] }],
    });
    const [a, b] = computeAllTimelines([panelRef(1), panelRef(0)]);

    // 無限再帰せず両方とも計算結果が返ること
    assert.ok(a.rows.length > 0 && b.rows.length > 0);
    // 循環の輪を断つため、少なくとも片側は解決不能として報告される
    assert.ok(a.unresolvedRefs.length + b.unresolvedRefs.length >= 1);
    // 解決不能と報告された側は、その効果が発動していない (素の100AVのまま)
    for (const timeline of [a, b]) {
        if (timeline.unresolvedRefs.length) {
            assert.ok(Math.abs(timeline.rows[0].actualAV - 100) < 1e-9);
        }
    }
});

test('computeTimeline: 単体計算では panel 参照は発動しない', () => {
    const { rows, unresolvedRefs } = computeTimeline(normalizePanel({
        baseSpeed: 100, preSpeed: 100, threshold: 150,
        turns: [{ events: [{ type: 'speedFlat', value: 100, timing: 'panel', refPanel: 0, refTurn: 1 }] }],
    }));
    assert.ok(Math.abs(rows[0].actualAV - 100) < 1e-9);
    assert.equal(unresolvedRefs.length, 1);
});

test('computeAllTimelines: 配列以外を渡しても落ちない', () => {
    assert.deepEqual(computeAllTimelines(null), []);
});

test('summarizeTimeline: 閾値までの行動回数と到達累計AVを返す', () => {
    const summary = summarizeTimeline({ name: '速度100', baseSpeed: 100, preSpeed: 100, threshold: 150, turns: [] });
    assert.equal(summary.name, '速度100');
    assert.equal(summary.turnsWithinThreshold, 1);
    assert.ok(Math.abs(summary.finalCumulativeAV - 100) < 1e-9);
    assert.equal(summary.turns[0].speedStart, 100);
    assert.deepEqual(summary.turns[0].effects, []);
});

test('summarizeTimeline: 速度が上がると閾値までの行動回数が増える', () => {
    const slow = summarizeTimeline({ baseSpeed: 100, preSpeed: 100, threshold: 300, turns: [] });
    const fast = summarizeTimeline({ baseSpeed: 160, preSpeed: 160, threshold: 300, turns: [] });
    assert.equal(slow.turnsWithinThreshold, 3);
    assert.equal(fast.turnsWithinThreshold, 4);
});

test('summarizeTimeline: 効果は発動有無つきで列挙される', () => {
    const summary = summarizeTimeline({
        baseSpeed: 100, preSpeed: 100, threshold: 150,
        turns: [{ events: [
            { type: 'advance', value: 25, timing: 'turn', offset: 0, name: '短縮' },
            { type: 'speedFlat', value: 10, timing: 'turn', offset: 999 },
        ] }],
    });
    assert.deepEqual(summary.turns[0].effects.map(effect => [effect.label, effect.fired]), [
        ['短縮', true],
        ['速度+10', false],
    ]);
});

test('summarizeTimeline: 閾値ゼロ相当でも finalCumulativeAV は 0 を返す', () => {
    const summary = summarizeTimeline({ baseSpeed: 100, preSpeed: 100, threshold: 1, turns: [] });
    assert.equal(summary.turnsWithinThreshold, 0);
    assert.equal(summary.finalCumulativeAV, 0);
});
