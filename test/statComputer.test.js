import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { StatComputer, countSetsByType, countAllSets } from '../js/build/statComputer.js';
import { STAT } from '../js/build/statKeys.js';
import { SET_TYPE } from '../js/build/constants.js';
import { registerFixtures, makeFixtureBuild, FIXTURE_CAVERN_ID, FIXTURE_PLANAR_ID } from './fixtures.js';

const approx = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} ≈ ${b}`);

before(registerFixtures);

test('compute: ATK は base×(1+%合計)+flat の式どおり', () => {
    const stats = StatComputer.compute(makeFixtureBuild());
    // atkPercent = traces 0.28 + feet 0.432 + rope 0.432 + cavern2pc 0.12 + planar2pc 0.05 = 1.314
    // atk = 600×(1+1.314) + 352.8 = 1741.2
    approx(stats.raw[STAT.ATK_PERCENT], 1.314);
    approx(stats.derived.atk, 1741.2, 1e-3);
});

test('compute: HP は head の hp_flat メインを加算', () => {
    const stats = StatComputer.compute(makeFixtureBuild());
    approx(stats.derived.hp, 1705.6, 1e-3);
});

test('compute: 会心率/ダメは既定値を derived で上乗せ', () => {
    const stats = StatComputer.compute(makeFixtureBuild());
    // raw.critRate = traces 0.12 + body 0.324 = 0.444 → derived 0.05+0.444
    approx(stats.derived.critRate, 0.494);
    approx(stats.derived.critDmg, 1.00); // 0.50 既定 + 0.50 traces
});

test('compute: 4pc/2pc セット効果が適用される', () => {
    const stats = StatComputer.compute(makeFixtureBuild());
    // cavern 4pc dmgAll 0.10 + sphere fire_dmg 0.3888 → 自属性合算 0.4888
    approx(stats.raw[STAT.DMG_ALL], 0.10);
    approx(stats.derived.dmgOwnElement, 0.4888);
});

test('compute: 星魂常時ステが累積する (E2 で critDmg+0.20)', () => {
    const e0 = StatComputer.compute(makeFixtureBuild({ eidolon: 0 }));
    const e2 = StatComputer.compute(makeFixtureBuild({ eidolon: 2 }));
    approx(e2.derived.critDmg - e0.derived.critDmg, 0.20);
    // E1 の atkPercent+0.10 も乗る
    approx(e2.raw[STAT.ATK_PERCENT] - e0.raw[STAT.ATK_PERCENT], 0.10);
});

test('compute: SEP_MULT は別枠乗算で累積する', () => {
    const build = makeFixtureBuild({
        envBuffs: [
            { stat: STAT.SEP_MULT, value: 0.2, label: 'a' },
            { stat: STAT.SEP_MULT, value: 0.5, label: 'b' },
        ],
    });
    const stats = StatComputer.compute(build);
    // (1+0.2)(1+0.5)-1 = 0.8
    approx(stats.raw[STAT.SEP_MULT], 0.8);
});

test('compute: contributions に内訳が記録される', () => {
    const stats = StatComputer.compute(makeFixtureBuild());
    assert.ok(Array.isArray(stats.contributions[STAT.ATK_PERCENT]));
    assert.ok(stats.contributions[STAT.ATK_PERCENT].length >= 2);
});

test('compute: 未登録キャラ / characterId 欠落は例外', () => {
    assert.throws(() => StatComputer.compute({}), /characterId/);
    assert.throws(() => StatComputer.compute({ characterId: '__nope__' }), /未登録/);
});

test('collectHooks: キャラ hook と 4pc セット hook を集約し onBuildResolved は除外', () => {
    const hooks = StatComputer.collectHooks(makeFixtureBuild());
    // キャラの onTurnStart が集約される
    assert.ok(Array.isArray(hooks.onTurnStart) && hooks.onTurnStart.length >= 1);
    // 4pc セットの onUltUse が集約される (cavern フィクスチャ 4 部位装着)
    assert.ok(Array.isArray(hooks.onUltUse) && hooks.onUltUse.length >= 1);
    // compute で消費される onBuildResolved は hook 一覧に含めない
    assert.equal(hooks.onBuildResolved, undefined);
});

test('collectHooks: 未登録キャラなら空オブジェクト', () => {
    assert.deepEqual(StatComputer.collectHooks({ characterId: '__nope__' }), {});
});

test('countSetsByType / countAllSets で装着数を集計', () => {
    const relics = makeFixtureBuild().relics;
    assert.deepEqual(countSetsByType(relics, SET_TYPE.CAVERN), { [FIXTURE_CAVERN_ID]: 4 });
    assert.deepEqual(countSetsByType(relics, SET_TYPE.PLANAR), { [FIXTURE_PLANAR_ID]: 2 });
    const all = countAllSets(relics);
    assert.equal(all[FIXTURE_CAVERN_ID], 4);
    assert.equal(all[FIXTURE_PLANAR_ID], 2);
});
