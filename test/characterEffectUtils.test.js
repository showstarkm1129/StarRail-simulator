import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
    effectStatNames,
    isFireDebuffEffect,
    makeFireDebuffMirror,
    upsertEffect,
} from '../scripts/character-effect-utils.mjs';

test('upsertEffect は同じIDの効果を差し替え、なければ追加する', () => {
    const def = { selfEffects: [] };
    const inserted = upsertEffect(def, 'selfEffects', {
        id: 'extra_crit',
        stat: 'CRIT_RATE',
        value: 0.1,
    });
    assert.deepEqual(inserted, { action: 'inserted', group: 'selfEffects', id: 'extra_crit' });
    assert.equal(def.selfEffects.length, 1);

    const replaced = upsertEffect(def, 'selfEffects', {
        id: 'extra_crit',
        stat: 'CRIT_RATE',
        value: 0.2,
    });
    assert.deepEqual(replaced, { action: 'replaced', group: 'selfEffects', id: 'extra_crit' });
    assert.equal(def.selfEffects.length, 1);
    assert.equal(def.selfEffects[0].value, 0.2);
});

test('effectStatNames は効果の各形式からステータス名を集める', () => {
    const stats = effectStatNames({
        stat: 'DMG_TAKEN',
        statFields: {
            DEF_DOWN: 'defDown',
        },
        stackable: {
            stepValues: {
                1: {
                    RES_PEN: 0.1,
                },
            },
        },
    });

    assert.deepEqual(stats, ['DEF_DOWN', 'DMG_TAKEN', 'RES_PEN']);
});

test('敵デバフの火力計算用ミラーを作れる', () => {
    const effect = {
        id: 'ult_taken',
        source: 'ult',
        name: 'テスト',
        description: '敵の受けるダメージ+20%。',
        target: 'single',
        stat: 'DMG_TAKEN',
        value: 0.2,
    };

    assert.equal(isFireDebuffEffect(effect), true);

    const mirror = makeFireDebuffMirror(effect);
    assert.equal(mirror.id, 'ult_taken_mirror');
    assert.equal(mirror.target, 'all');
    assert.equal(mirror.stat, 'DMG_TAKEN');
    assert.match(mirror.name, /火力計算用/);
    assert.match(mirror.description, /火力計算用ミラー/);
});
