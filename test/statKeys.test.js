import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    STAT, ALL_STAT_KEYS, ELEMENT_DMG_KEYS, makeElementDmgKey, STAT_DEFAULTS,
} from '../js/build/statKeys.js';
import { ELEMENT_LIST } from '../js/build/constants.js';

test('makeElementDmgKey は dmg + 先頭大文字の属性名', () => {
    assert.equal(makeElementDmgKey('fire'), 'dmgFire');
    assert.equal(makeElementDmgKey('lightning'), 'dmgLightning');
    assert.equal(makeElementDmgKey('quantum'), 'dmgQuantum');
});

test('ELEMENT_DMG_KEYS は全属性分そろっている', () => {
    for (const el of ELEMENT_LIST) {
        assert.equal(ELEMENT_DMG_KEYS[el], makeElementDmgKey(el));
    }
    assert.equal(Object.keys(ELEMENT_DMG_KEYS).length, ELEMENT_LIST.length);
});

test('STAT の枠キー値に重複がない (タイポ検知)', () => {
    const values = Object.values(STAT);
    assert.equal(new Set(values).size, values.length);
});

test('ALL_STAT_KEYS は STAT + 属性ダメ枠を網羅し重複なし', () => {
    const set = new Set(ALL_STAT_KEYS);
    assert.equal(set.size, ALL_STAT_KEYS.length);
    for (const v of Object.values(STAT)) assert.ok(set.has(v));
    for (const v of Object.values(ELEMENT_DMG_KEYS)) assert.ok(set.has(v));
});

test('ゲーム既定値が想定どおり', () => {
    assert.equal(STAT_DEFAULTS.CRIT_RATE_BASE, 0.05);
    assert.equal(STAT_DEFAULTS.CRIT_DMG_BASE, 0.50);
    assert.equal(STAT_DEFAULTS.ENERGY_REGEN_BASE, 1.00);
});
