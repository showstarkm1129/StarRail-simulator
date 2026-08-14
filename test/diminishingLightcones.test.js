import { test } from 'node:test';
import assert from 'node:assert/strict';

import { Diminishing } from '../js/build/diminishing.js';
import { Registry } from '../js/build/registry.js';
import { StatComputer } from '../js/build/statComputer.js';
import { ALL_STAT_KEYS } from '../js/build/statKeys.js';

import '../js/data/characters/_index.js';
import '../js/data/lightcones/_index.js';

const VALID_STAT_KEYS = new Set(ALL_STAT_KEYS);
const EFFECT_GROUPS = ['selfEffects', 'partyEffects', 'enemyEffects'];

function makeTestBuild(lightconeId = null, superimpose = 1) {
    const character = Registry.character.get('testAll') || Registry.character.list().find(ch => ch.id !== 'template');
    assert.ok(character, '検査用キャラが登録されているべき');
    return {
        characterId: character.id,
        eidolon: 0,
        traceLevel: { basic: 1, skill: 1, ult: 1, talent: 1 },
        lightcone: { id: lightconeId, superimpose },
        relics: {
            head:   { setId: null, mainStat: 'hp_flat',  subs: {} },
            hands:  { setId: null, mainStat: 'atk_flat', subs: {} },
            body:   { setId: null, mainStat: null,       subs: {} },
            feet:   { setId: null, mainStat: null,       subs: {} },
            sphere: { setId: null, mainStat: null,       subs: {} },
            rope:   { setId: null, mainStat: null,       subs: {} },
        },
        envBuffs: [],
    };
}

function asEffectArray(group, superimpose) {
    if (typeof group === 'function') return group(superimpose) || [];
    if (Array.isArray(group)) return group;
    return [];
}

function stackValuesOf(effect) {
    if (!effect.stackable) return [1];
    const min = effect.stackable.min ?? (effect.stackable.default === 0 ? 0 : 1);
    const max = effect.stackable.max ?? effect.stackable.default ?? 1;
    const def = effect.stackable.default ?? max;
    return [...new Set([min, def, max].filter(v => Number.isInteger(v) && v >= min && v <= max))];
}

function applyStack(stats, stacks, effect) {
    if (!stats) return null;
    if (effect.stackable?.type === 'step' && effect.stackable.stepValues) {
        return effect.stackable.stepValues[stacks] || stats;
    }
    if (stacks === 1) return stats;
    const out = {};
    for (const [key, value] of Object.entries(stats)) {
        if (key === '__meta') continue;
        out[key] = value * stacks;
    }
    return out;
}

function resolveEffectStats(effect, casterBuild, casterStats) {
    if (effect.stats) return effect.stats;
    if (typeof effect.computeStats !== 'function') return null;

    let level = 1;
    let mult = null;
    if (effect.fromLevel) {
        const character = Registry.character.get(casterBuild.characterId);
        const skill = character?.skills?.[effect.fromLevel];
        if (!skill?.levels) return null;
        level = casterBuild.traceLevel?.[effect.fromLevel] || 1;
        const index = Math.max(0, Math.min(skill.levels.length - 1, level - 1));
        mult = skill.levels[index];
    }
    return effect.computeStats(level, mult, casterStats);
}

function assertStatsBlock(label, stats) {
    assert.ok(stats && typeof stats === 'object', `${label}: stats が object ではない`);
    for (const [key, value] of Object.entries(stats)) {
        if (key === '__meta') continue;
        assert.ok(VALID_STAT_KEYS.has(key), `${label}: stat キー '${key}' は未定義`);
        assert.equal(typeof value, 'number', `${label}.${key}: 数値ではない`);
        assert.ok(Number.isFinite(value), `${label}.${key}: 有限数ではない`);
    }
}

function assertFinalStatsFinite(label, finalStats) {
    for (const [section, obj] of [['raw', finalStats.raw], ['derived', finalStats.derived]]) {
        for (const [key, value] of Object.entries(obj || {})) {
            if (typeof value === 'number') {
                assert.ok(Number.isFinite(value), `${label}: ${section}.${key} が有限数ではない`);
            } else if (value && typeof value === 'object') {
                for (const [subKey, subValue] of Object.entries(value)) {
                    if (typeof subValue === 'number') {
                        assert.ok(Number.isFinite(subValue), `${label}: ${section}.${key}.${subKey} が有限数ではない`);
                    }
                }
            }
        }
    }
}

function assertComparisonFinite(label, comparison) {
    const assertRow = (rowLabel, row) => {
        for (const field of ['before', 'after', 'ratio', 'contribution']) {
            if (field in row) {
                assert.ok(Number.isFinite(row[field]), `${rowLabel}.${field} が有限数ではない`);
            }
        }
    };

    for (const [key, value] of Object.entries(comparison.factors || {})) {
        if (key.endsWith('ByType') || key === 'totals') {
            for (const [subKey, row] of Object.entries(value)) {
                assertRow(`${label}: factors.${key}.${subKey}`, row);
            }
        } else if (value && typeof value === 'object') {
            assertRow(`${label}: factors.${key}`, value);
        }
    }
}

test('全光円錐は限界効用逓減タブの計算経路で S1〜S5 すべて計算できる', () => {
    const beforeStats = StatComputer.compute(makeTestBuild());
    assertFinalStatsFinite('基準ビルド', beforeStats);

    for (const lightcone of Registry.lightcone.list()) {
        for (let superimpose = 1; superimpose <= 5; superimpose++) {
            const label = `lightcone:${lightcone.id}.S${superimpose}`;
            const afterStats = StatComputer.compute(makeTestBuild(lightcone.id, superimpose));
            assertFinalStatsFinite(label, afterStats);
            assertComparisonFinite(label, Diminishing.compareStats(beforeStats, afterStats));
        }
    }
});

test('全光円錐の効果は限界効用逓減タブの envBuff 経路に流しても破綻しない', () => {
    const beforeStats = StatComputer.compute(makeTestBuild());

    for (const lightcone of Registry.lightcone.list()) {
        for (let superimpose = 1; superimpose <= 5; superimpose++) {
            const casterBuild = makeTestBuild(lightcone.id, superimpose);
            const casterStats = StatComputer.compute(casterBuild);

            for (const group of EFFECT_GROUPS) {
                for (const effect of asEffectArray(lightcone[group], superimpose)) {
                    const stats = resolveEffectStats(effect, casterBuild, casterStats);
                    if (!stats) continue;

                    for (const stacks of stackValuesOf(effect)) {
                        const finalStatsBlock = applyStack(stats, stacks, effect);
                        const label = `lightcone:${lightcone.id}.S${superimpose}.${group}.${effect.id}.x${stacks}`;
                        assertStatsBlock(label, finalStatsBlock);

                        const build = makeTestBuild(lightcone.id, superimpose);
                        build.envBuffs = Object.entries(finalStatsBlock).map(([stat, value]) => ({
                            stat,
                            value,
                            label,
                        }));

                        const afterStats = StatComputer.compute(build);
                        assertFinalStatsFinite(label, afterStats);
                        assertComparisonFinite(label, Diminishing.compareStats(beforeStats, afterStats));
                    }
                }
            }
        }
    }
});
