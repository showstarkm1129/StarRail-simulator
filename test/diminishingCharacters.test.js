import { test } from 'node:test';
import assert from 'node:assert/strict';

import { Diminishing } from '../js/build/diminishing.js';
import { Registry } from '../js/build/registry.js';
import { StatComputer } from '../js/build/statComputer.js';
import { ALL_STAT_KEYS, STAT } from '../js/build/statKeys.js';
import { presetEidolonMaxLevels } from '../js/build/skillUtil.js';

import '../js/data/characters/_index.js';

const VALID_STAT_KEYS = new Set(ALL_STAT_KEYS);
const TEST_ONLY_CHARACTER_IDS = new Set(['template', 'testAll', 'testAllS1']);
const EFFECT_GROUPS = ['partyEffects', 'selfEffects'];

function realCharacters() {
    return Registry.character.list().filter(ch => !TEST_ONLY_CHARACTER_IDS.has(ch.id));
}

function makeCharacterBuild(character, overrides = {}) {
    return {
        characterId: character.id,
        eidolon: 6,
        traceLevel: presetEidolonMaxLevels(character),
        lightcone: { id: null, superimpose: 1 },
        relics: {
            head:   { setId: null, mainStat: 'hp_flat',  subs: {} },
            hands:  { setId: null, mainStat: 'atk_flat', subs: {} },
            body:   { setId: null, mainStat: null,       subs: {} },
            feet:   { setId: null, mainStat: null,       subs: {} },
            sphere: { setId: null, mainStat: null,       subs: {} },
            rope:   { setId: null, mainStat: null,       subs: {} },
        },
        envBuffs: [],
        ...overrides,
    };
}

function assertFiniteNumber(label, value) {
    assert.equal(typeof value, 'number', `${label}: 数値ではない`);
    assert.ok(Number.isFinite(value), `${label}: 有限数ではない`);
}

function assertFinalStatsFinite(label, finalStats) {
    for (const [section, obj] of [['raw', finalStats.raw], ['derived', finalStats.derived]]) {
        for (const [key, value] of Object.entries(obj || {})) {
            if (typeof value === 'number') {
                assertFiniteNumber(`${label}.${section}.${key}`, value);
            } else if (value && typeof value === 'object') {
                for (const [subKey, subValue] of Object.entries(value)) {
                    if (typeof subValue === 'number') {
                        assertFiniteNumber(`${label}.${section}.${key}.${subKey}`, subValue);
                    }
                }
            }
        }
    }
}

function assertComparisonFinite(label, comparison) {
    const assertRow = (rowLabel, row) => {
        for (const field of ['before', 'after', 'ratio', 'contribution']) {
            if (field in row) assertFiniteNumber(`${rowLabel}.${field}`, row[field]);
        }
    };

    for (const [key, value] of Object.entries(comparison.factors || {})) {
        if (key.endsWith('ByType') || key === 'totals') {
            for (const [subKey, row] of Object.entries(value)) {
                assertRow(`${label}.factors.${key}.${subKey}`, row);
            }
        } else if (value && typeof value === 'object') {
            assertRow(`${label}.factors.${key}`, value);
        }
    }
}

function stackValuesOf(effect) {
    if (!effect.stackable) return [1];
    const min = effect.stackable.min ?? (effect.stackable.default === 0 ? 0 : 1);
    const max = effect.stackable.max ?? effect.stackable.default ?? 1;
    const def = effect.stackable.default ?? max;
    return [...new Set([min, def, max].filter(v => Number.isInteger(v) && v >= min && v <= max))];
}

function applyStack(stats, stacks, effect) {
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
        assert.ok(skill?.levels, `character:${character?.id} effect:${effect.id} fromLevel '${effect.fromLevel}' の倍率表がない`);
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
        assertFiniteNumber(`${label}.${key}`, value);
    }
}

test('全キャラクターは限界効用逓減のビルド比較に使える', () => {
    const characters = realCharacters();
    assert.equal(characters.length, 90, 'ver4.4時点の実キャラ数');

    for (const character of characters) {
        const before = makeCharacterBuild(character);
        const after = Diminishing.addEnvBuff(before, STAT.ATK_PERCENT, 0.01, 'smoke.atk');
        const label = `character:${character.id}`;

        assertFinalStatsFinite(`${label}.before`, StatComputer.compute(before));
        assertFinalStatsFinite(`${label}.after`, StatComputer.compute(after));
        assertComparisonFinite(label, Diminishing.compareBuilds(before, after));
    }
});

test('全キャラクター効果は限界効用逓減の環境バフ経路に流せる', () => {
    for (const character of realCharacters()) {
        const build = makeCharacterBuild(character);
        const casterStats = StatComputer.compute(build);
        const beforeStats = StatComputer.compute(build);

        for (const group of EFFECT_GROUPS) {
            for (const effect of character[group] || []) {
                const stats = resolveEffectStats(effect, build, casterStats);
                assert.ok(stats, `character:${character.id}.${group}.${effect.id}: stats を解決できない`);

                for (const stacks of stackValuesOf(effect)) {
                    const finalStatsBlock = applyStack(stats, stacks, effect);
                    const label = `character:${character.id}.${group}.${effect.id}.x${stacks}`;
                    assertStatsBlock(label, finalStatsBlock);

                    const afterBuild = makeCharacterBuild(character, {
                        envBuffs: Object.entries(finalStatsBlock).map(([stat, value]) => ({
                            stat,
                            value,
                            label,
                        })),
                    });
                    const afterStats = StatComputer.compute(afterBuild);
                    assertFinalStatsFinite(label, afterStats);
                    assertComparisonFinite(label, Diminishing.compareStats(beforeStats, afterStats));
                }
            }
        }
    }
});
