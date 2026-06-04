import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Registry } from '../js/build/registry.js';

test('add / get / has で定義を出し入れできる', () => {
    const def = { id: '__reg_test_a__', value: 1 };
    Registry.character.add(def);
    assert.equal(Registry.character.has('__reg_test_a__'), true);
    assert.equal(Registry.character.get('__reg_test_a__').value, 1);
});

test('未登録 id の get は null', () => {
    assert.equal(Registry.character.get('__does_not_exist__'), null);
    assert.equal(Registry.character.has('__does_not_exist__'), false);
});

test('id を持たない定義は登録されない', () => {
    const before = Registry.lightcone.size();
    Registry.lightcone.add({ name: 'no id' });
    Registry.lightcone.add(null);
    assert.equal(Registry.lightcone.size(), before);
});

test('取得した定義は freeze されている (誤改変防止)', () => {
    Registry.relicSet.add({ id: '__reg_test_frozen__', n: 1 });
    const got = Registry.relicSet.get('__reg_test_frozen__');
    assert.equal(Object.isFrozen(got), true);
    assert.throws(() => { got.n = 999; }, TypeError);
});

test('ids() / list() / size() が整合する', () => {
    Registry.ornament.add({ id: '__reg_test_x__' });
    Registry.ornament.add({ id: '__reg_test_y__' });
    const ids = Registry.ornament.ids();
    assert.ok(ids.includes('__reg_test_x__'));
    assert.ok(ids.includes('__reg_test_y__'));
    assert.equal(Registry.ornament.list().length, Registry.ornament.size());
});
