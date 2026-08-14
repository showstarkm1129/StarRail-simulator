import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { StatComputer } from '../js/build/statComputer.js';
import { Diminishing } from '../js/build/diminishing.js';
import { STAT } from '../js/build/statKeys.js';
import { registerFixtures, makeFixtureBuild } from './fixtures.js';

const approx = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} ≈ ${b}`);

before(registerFixtures);

test('computeDamageFactors: 各乗算枠が式どおり', () => {
    const stats = StatComputer.compute(makeFixtureBuild());
    const f = Diminishing.computeDamageFactors(stats);
    approx(f.atk, 1741.2, 1e-3);              // ref_stat = atk
    approx(f.crit, 1.494);                    // 1 + min(0.494,1)×1.00
    approx(f.dmgBonus, 1.4888);               // 1 + (dmgAll 0.10 + dmgFire 0.3888)
    approx(f.def, 0.5);                        // 100/((20+80)+100)
    approx(f.res, 1.0);
    approx(f.taken, 1.0);
    approx(f.break, 0.9);                      // 靭性残
    approx(f.fixedDmg, 1.0);
    approx(f.sepMult, 1.0);
});

test('computeDamageFactors: critMode=crit は確定会心係数', () => {
    const stats = StatComputer.compute(makeFixtureBuild());
    const f = Diminishing.computeDamageFactors(stats, { ...Diminishing.DEFAULT_OPTIONS, critMode: 'crit' });
    approx(f.crit, 2.0); // 1 + critDmg(1.00)
});

test('computeDamageFactors: breakState=broken は撃破係数1.0', () => {
    const stats = StatComputer.compute(makeFixtureBuild());
    const f = Diminishing.computeDamageFactors(stats, { ...Diminishing.DEFAULT_OPTIONS, breakState: 'broken' });
    approx(f.break, 1.0);
});

test('computeDamageFactors: スキル種別 breakdown が共通枠 + 種別枠', () => {
    const build = makeFixtureBuild({
        envBuffs: [{ stat: STAT.DMG_ULT, value: 0.30, label: 'ult+' }],
    });
    const stats = StatComputer.compute(build);
    const f = Diminishing.computeDamageFactors(stats);
    approx(f.dmgBonusByType.base, 1.4888);
    approx(f.dmgBonusByType.ult, 1.4888 + 0.30);
    approx(f.dmgBonusByType.basic, 1.4888); // basic 枠は無いので base と同じ
});

test('computeDamageFactors: スキル種別の会心/被ダメ枠は該当種別だけに乗る', () => {
    const build = makeFixtureBuild({
        envBuffs: [
            { stat: STAT.CRIT_DMG_FOLLOWUP, value: 0.50, label: 'followup cd+' },
            { stat: STAT.DMG_TAKEN_FOLLOWUP, value: 0.25, label: 'followup taken+' },
        ],
    });
    const stats = StatComputer.compute(build);
    const f = Diminishing.computeDamageFactors(stats, { ...Diminishing.DEFAULT_OPTIONS, critMode: 'crit' });

    approx(f.critByType.base, 2.0);
    approx(f.critByType.followup, 2.5);
    approx(f.takenByType.base, 1.0);
    approx(f.takenByType.followup, 1.25);
});

test('compareBuilds: 会心ダメ追加で crit 枠だけ比率>1、atk 枠は不変', () => {
    const before = makeFixtureBuild();
    const after = Diminishing.addEnvBuff(before, STAT.CRIT_DMG, 0.20, 'CD+');
    const res = Diminishing.compareBuilds(before, after);
    assert.equal(res.factors.atk.ratio, 1);
    assert.ok(res.factors.crit.ratio > 1);
    // total は各枠の積 → crit 比率と一致 (他枠不変)
    approx(res.factors.crit.ratio, res.factors.total.ratio, 1e-9);
});

test('compareWithModification: ヘルパは元ビルドを破壊しない (immutable)', () => {
    const before = makeFixtureBuild();
    const snapshot = JSON.stringify(before);
    const res = Diminishing.compareWithModification(
        before,
        b => Diminishing.addEnvBuff(b, STAT.ATK_PERCENT, 0.10, 'ATK+'),
    );
    assert.equal(JSON.stringify(before), snapshot); // before は不変
    assert.ok(res.factors.atk.ratio > 1);           // atk は増えている
});

test('compareBuilds: info に火力換算しない SPD デルタを情報表示', () => {
    const before = makeFixtureBuild();
    const after = Diminishing.addEnvBuff(before, STAT.SPD_FLAT, 12, 'SPD+');
    const res = Diminishing.compareBuilds(before, after);
    approx(res.info.spdDelta, 12);
    // SPD は火力係数に影響しない
    assert.equal(res.factors.total.ratio, 1);
});

test('rankCandidates: 貢献率の降順にソートし、計算に失敗した候補は contribution=null で末尾に回す', () => {
    const before = makeFixtureBuild();
    const baseStats = StatComputer.compute(before);
    const candidates = [
        { id: 'no-change' },
        { id: 'atk-up' },
        { id: 'broken', shouldThrow: true },
    ];
    const ranked = Diminishing.rankCandidates(baseStats, candidates, candidate => {
        if (candidate.shouldThrow) throw new Error('boom');
        const build = candidate.id === 'atk-up'
            ? Diminishing.addEnvBuff(before, STAT.ATK_PERCENT, 0.50, 'ATK+')
            : before;
        return StatComputer.compute(build);
    });

    assert.equal(ranked.length, 3);
    assert.equal(ranked[0].id, 'atk-up');
    assert.ok(ranked[0].contribution > 0);
    assert.equal(ranked[1].id, 'no-change');
    approx(ranked[1].contribution, 0);
    assert.equal(ranked[2].id, 'broken');
    assert.equal(ranked[2].contribution, null);
    assert.ok(ranked[2].error instanceof Error);
});

test('rankCandidates: 星魂候補は火力率を計算しない', () => {
    const before = makeFixtureBuild();
    const baseStats = StatComputer.compute(before);
    let callbackCalled = false;
    const ranked = Diminishing.rankCandidates(baseStats, [
        { id: 'e2', type: 'eidolon', changes: { build: { eidolon: 2 } } },
        { id: 'atk-up' },
    ], candidate => {
        callbackCalled = true;
        return StatComputer.compute(Diminishing.addEnvBuff(before, STAT.ATK_PERCENT, 0.10, candidate.id));
    });

    const eidolon = ranked.find(item => item.id === 'e2');
    assert.equal(eidolon.contribution, null);
    assert.equal(eidolon.excludedReason, 'eidolon');
    assert.equal(callbackCalled, true);
});

test('swapRelicMain / setEidolon は存在しないスロット/範囲を安全に扱う', () => {
    const build = makeFixtureBuild();
    assert.throws(() => Diminishing.swapRelicMain(build, 'no_slot', 'atk_percent'), /slot/);
    const e = Diminishing.setEidolon(build, 99);
    assert.equal(e.eidolon, 6); // [0,6] にクランプ
});

test('ビルド操作ヘルパは immutable に新ビルドを返す', () => {
    const build = makeFixtureBuild();
    const snap = JSON.stringify(build);

    const a = Diminishing.swapRelicMain(build, 'feet', 'atk_percent');
    a.relics.feet.mainStat = 'def_percent'; // 戻り値の改変は元に影響しない
    const b = Diminishing.setRelicSet(build, 'head', '__other_set__');
    const c = Diminishing.setSubs(build, 'body', { CRIT_DMG: 0.1 });
    const d = Diminishing.addSub(build, 'body', 'CRIT_RATE', 0.05);
    const e = Diminishing.setLightcone(build, '__lc__', 3);

    assert.equal(JSON.stringify(build), snap, '元ビルドは不変であるべき');
    assert.equal(b.relics.head.setId, '__other_set__');
    assert.equal(c.relics.body.subs.CRIT_DMG, 0.1);
    assert.equal(d.relics.body.subs.CRIT_RATE, 0.05);
    assert.deepEqual(e.lightcone, { id: '__lc__', superimpose: 3 });
});

test('存在しないスロットへの helper は明示エラー', () => {
    const build = makeFixtureBuild();
    assert.throws(() => Diminishing.setRelicSet(build, 'no_slot', 'x'), /slot/);
    assert.throws(() => Diminishing.setSubs(build, 'no_slot', {}), /slot/);
    assert.throws(() => Diminishing.addSub(build, 'no_slot', 'CRIT_RATE', 0.1), /slot/);
});

// ---- 直接ステ入力モード -------------------------------------------------

test('directStatsToFinalStats: 入力値が最終ステ/各乗算枠にそのまま反映される', () => {
    const stats = Diminishing.directStatsToFinalStats({
        atk: 2000, critRate: 0.50, critDmg: 1.00, dmgAll: 0.50, resPen: 0.20,
    });
    // 会心・EP回復は基礎込みの最終値として derived に出る
    approx(stats.derived.atk, 2000);
    approx(stats.derived.critRate, 0.50);
    approx(stats.derived.critDmg, 1.00);
    approx(stats.derived.critExpected, 1.5);          // 1 + 0.50×1.00
    approx(stats.derived.dmgOwnElement, 0.50);

    const f = Diminishing.computeDamageFactors(stats);
    approx(f.atk, 2000);
    approx(f.crit, 1.5);                                // 基礎5%/50%の二重計上が無いこと
    approx(f.dmgBonus, 1.5);                            // element=null なので dmgAll のみ
    approx(f.res, 1.2);                                 // 1 - (0 - 0.20)
});

test('directStatsToFinalStats: 未指定キーは 0、EP回復は既定100%扱い', () => {
    const stats = Diminishing.directStatsToFinalStats({});
    approx(stats.derived.atk, 0);
    assert.equal(stats.derived.speedAV, null);
    approx(stats.derived.critRate, 0);                  // 入力 0 → そのまま (基礎は足さない)
    approx(stats.derived.energyRegenPct, 0);
    // raw 側は基礎分を引いた加算値 (CRIT_RATE_BASE=0.05)
    approx(stats.raw[STAT.CRIT_RATE], -0.05);
});

test('compareStats: 直接入力の前後比較が乗算枠の積になる', () => {
    const beforeStats = Diminishing.directStatsToFinalStats({ atk: 2000, dmgAll: 0.50 });
    const afterStats = Diminishing.directStatsToFinalStats({ atk: 2200, dmgAll: 0.80 });
    const res = Diminishing.compareStats(beforeStats, afterStats);
    approx(res.factors.atk.ratio, 1.1);                 // 2200/2000
    approx(res.factors.dmgBonus.ratio, 1.8 / 1.5);      // (1+0.8)/(1+0.5)
    approx(res.factors.total.ratio, 1.1 * (1.8 / 1.5));
});
