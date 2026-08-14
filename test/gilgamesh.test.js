import { test } from 'node:test';
import assert from 'node:assert/strict';

import { Registry } from '../js/build/registry.js';
import { STAT } from '../js/build/statKeys.js';

import '../js/data/characters/gilgamesh.js';

test('ギルガメッシュの天賦はセイバー専用の必殺技強化をパーティー効果に公開する', () => {
    const gilgamesh = Registry.character.get('gilgamesh');
    const effect = gilgamesh.partyEffects.find(item => item.id === 'gilgamesh_talent_saber_ult_sep_mult');

    assert.ok(effect);
    assert.equal(effect.target, 'single');
    assert.equal(effect.defaultActive, false);
    assert.deepEqual(effect.computeStats(10, { saberUltDmg: 2.00 }), { [STAT.SEP_MULT]: 1.00 });
});
