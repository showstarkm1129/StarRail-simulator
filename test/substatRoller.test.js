import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    rollsToStatDict, rollTotalMode, rollSingleSlot, calcManualAllocation,
    excludeMainStatFromCandidates,
} from '../js/build/substatRoller.js';
import { SUBSTAT_TABLE } from '../js/build/substatTable.js';

// 決定的な疑似乱数 (シーケンスを返す) — テスト再現性のため
function seqRng(values) {
    let i = 0;
    return () => values[(i++) % values.length];
}

test('rollsToStatDict は subKey 集計を STAT 枠キーへ変換', () => {
    const out = rollsToStatDict({ ATK_PERCENT: 0.1, CRIT_RATE: 0.05 });
    assert.equal(out[SUBSTAT_TABLE.ATK_PERCENT.stat], 0.1);
    assert.equal(out[SUBSTAT_TABLE.CRIT_RATE.stat], 0.05);
});

test('calcManualAllocation は single tier で決定的', () => {
    // CRIT_RATE high = 0.032 ×5, CRIT_DMG high = 0.064 ×4
    const { totals } = calcManualAllocation({
        allocations: { CRIT_RATE: 5, CRIT_DMG: 4 }, tier: 'high',
    });
    assert.ok(Math.abs(totals.CRIT_RATE - 0.032 * 5) < 1e-9);
    assert.ok(Math.abs(totals.CRIT_DMG - 0.064 * 4) < 1e-9);
});

test('calcManualAllocation は 0/負/非数を無視', () => {
    const { totals } = calcManualAllocation({
        allocations: { CRIT_RATE: 0, CRIT_DMG: -3, HP_FLAT: 'abc' }, tier: 'high',
    });
    assert.deepEqual(totals, {});
});

test('rollTotalMode は count 回振り、tier 値を加算 (決定的 rng)', () => {
    // rng=0 → 常に候補[0] を選ぶ
    const { rolls, totals } = rollTotalMode({
        count: 3, tier: 'mid', candidateSubKeys: ['ATK_PERCENT', 'CRIT_RATE'],
        rng: seqRng([0]),
    });
    assert.equal(rolls.ATK_PERCENT, 3);
    assert.ok(Math.abs(totals.ATK_PERCENT - SUBSTAT_TABLE.ATK_PERCENT.mid * 3) < 1e-9);
});

test('rollTotalMode は count<=0 / 候補空 で空結果', () => {
    assert.deepEqual(rollTotalMode({ count: 0, tier: 'high', candidateSubKeys: ['ATK_PERCENT'] }), { rolls: {}, totals: {} });
    assert.deepEqual(rollTotalMode({ count: 5, tier: 'high', candidateSubKeys: [] }), { rolls: {}, totals: {} });
});

test('rollSingleSlot: 初期4 + 強化 のロール総数が一致', () => {
    const r = rollSingleSlot({
        initialCount: 4, enhanceCount: 5, tier: 'mid',
        candidateSubKeys: ['ATK_PERCENT', 'CRIT_RATE', 'CRIT_DMG', 'HP_PERCENT', 'DEF_PERCENT'],
        rng: seqRng([0, 0.3, 0.6, 0.9, 0]),
    });
    assert.equal(r.selectedSubs.length, 4);
    const totalRolls = Object.values(r.rolls).reduce((a, b) => a + b, 0);
    assert.equal(totalRolls, 4 + 5); // 初期4 + 強化5
});

test('rollSingleSlot: 初期3 は追加サブステで4種目に1ロール', () => {
    const r = rollSingleSlot({
        initialCount: 3, enhanceCount: 0, tier: 'low',
        candidateSubKeys: ['ATK_PERCENT', 'CRIT_RATE', 'CRIT_DMG', 'HP_PERCENT'],
        rng: seqRng([0, 0, 0, 0]),
    });
    const totalRolls = Object.values(r.rolls).reduce((a, b) => a + b, 0);
    assert.equal(totalRolls, 4); // 初期3 + 追加1
});

test('excludeMainStatFromCandidates: BODY×会心率メインは CRIT_RATE を除外', () => {
    const out = excludeMainStatFromCandidates('body', 'crit_rate', ['CRIT_RATE', 'CRIT_DMG', 'ATK_PERCENT']);
    assert.deepEqual(out, ['CRIT_DMG', 'ATK_PERCENT']);
});

test('excludeMainStatFromCandidates: 属性ダメメインはサブステに無く無変化', () => {
    const subs = ['CRIT_RATE', 'ATK_PERCENT'];
    assert.deepEqual(excludeMainStatFromCandidates('sphere', 'fire_dmg', subs), subs);
});
