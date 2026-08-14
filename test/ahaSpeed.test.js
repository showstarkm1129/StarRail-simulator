import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    AHA_BASE_SPEED,
    AHA_CHARACTER_SLOTS,
    AHA_SPEED_WEIGHTS,
    computeAhaSpeed,
} from '../js/build/ahaSpeed.js';

test('アッハ速度: 4人を速度順に並べて各係数を適用する', () => {
    const result = computeAhaSpeed([100, 200, 150, 120]);

    assert.equal(result.baseSpeed, 80);
    assert.equal(result.speed, 143.5);
    assert.ok(Math.abs(result.actionValue - (10000 / 143.5)) < 1e-9);
    assert.deepEqual(
        result.ranked.map(entry => [entry.slotIndex, entry.speed, entry.weight, entry.contribution]),
        [
            [1, 200, 0.2, 40],
            [2, 150, 0.1, 15],
            [3, 120, 0.05, 6],
            [0, 100, 0.025, 2.5],
        ],
    );
});

test('アッハ速度: 同速では元の枠順を維持する', () => {
    const result = computeAhaSpeed([100, 100, 100, 100]);

    assert.equal(AHA_BASE_SPEED, 80);
    assert.equal(AHA_CHARACTER_SLOTS, 4);
    assert.deepEqual(AHA_SPEED_WEIGHTS, [0.2, 0.1, 0.05, 0.025]);
    assert.equal(result.speed, 117.5);
    assert.deepEqual(result.ranked.map(entry => entry.slotIndex), [0, 1, 2, 3]);
});

test('アッハ速度: 空欄・不正値・不足枠は速度0として安全に計算する', () => {
    const result = computeAhaSpeed(['160', '', -10]);

    assert.equal(result.speed, 112);
    assert.deepEqual(result.ranked.map(entry => entry.speed), [160, 0, 0, 0]);
});

test('アッハ速度: 配列以外は明示的に拒否する', () => {
    assert.throws(() => computeAhaSpeed(null), TypeError);
});
