import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Build } from '../js/build/buildStore.js';
import { Registry } from '../js/build/registry.js';
import { STAT } from '../js/build/statKeys.js';
import {
    createDiminishingSession,
    createDiminishingState,
    cloneDiminishingValue,
} from '../js/build/diminishingSession.js';
import {
    applyDiminishingChanges,
    commitDiminishingChanges,
    computeDiminishingState,
    gatherFocusEffects,
    gatherTeammateEffects,
    materializeDiminishingBuild,
    mergeDiminishingChanges,
    runDiminishingJob,
} from '../js/build/diminishingEngine.js';
import { validateDiminishingJob, validateDiminishingState } from '../js/build/diminishingValidator.js';
import { loadRegisteredGameData } from '../js/ai/loadGameData.js';
import { createDiminishingTools } from '../js/ai/diminishingTools.js';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
await loadRegisteredGameData(ROOT);

function blankState(characterId = 'bronya') {
    const character = Registry.character.get(characterId) || Registry.character.list().find(item => item.id !== 'template');
    return createDiminishingSession({ build: Build.blank(character.id) });
}

function jobFor(state, changes = {}, extra = {}) {
    return {
        objective: '検証', baseState: state,
        variations: [{ label: 'ケース', changes }],
        fixedConditions: [], metrics: ['finalStats', 'damage', 'differencePercent'],
        ...extra,
    };
}

function assertInvalid(stateOrJob, expectedCode, isJob = false) {
    const result = isJob ? validateDiminishingJob(stateOrJob) : validateDiminishingState(stateOrJob);
    assert.equal(result.valid, false, expectedCode);
    assert.ok(result.errors.some(error => error.code === expectedCode), `${expectedCode}: ${JSON.stringify(result.errors)}`);
}

test('session clone, restore, checkpoint, mutate, and bounded undo preserve serializable state', () => {
    const session = blankState();
    const initial = session.serialize();
    assert.ok(cloneDiminishingValue(new Set(['a'])) instanceof Set);
    assert.throws(() => cloneDiminishingValue({ bad: undefined }));
    assert.throws(() => cloneDiminishingValue({ bad: Number.POSITIVE_INFINITY }));

    session.mutate(state => { state.options.enemyLevel = 90; }, { checkpoint: true });
    assert.equal(session.canUndo(), true);
    assert.equal(session.clone().options.enemyLevel, 90);
    assert.ok(session.undo());
    assert.equal(session.getState().options.enemyLevel, initial.options.enemyLevel);
    assert.equal(session.undo(), null);

    session.restore({ state: { ...initial, inputMode: 'direct', direct: { stats: { atk: 100, hp: 100, def: 100, spd: 100 } } } });
    assert.equal(session.getState().inputMode, 'direct');
    for (let index = 0; index < 25; index++) session.checkpoint();
    for (let index = 0; index < 20; index++) assert.ok(session.undo());
    assert.equal(session.undo(), null);
    assert.throws(() => session.restore(null));
    assert.throws(() => session.mutate(null));
});

test('engine applies reusable build, party, effect, substat, option, and display changes', () => {
    const session = blankState();
    const state = session.getState();
    const character = Registry.character.get(state.build.characterId);
    const lightcone = Registry.lightcone.list().find(item => item.path === character.path && (item.selfEffects || item.partyEffects));
    if (lightcone) state.build.lightcone = { id: lightcone.id, superimpose: 2 };

    const cavern = Registry.relicSet.list().find(item => item.selfEffects?.pc4 || item.partyEffects?.pc4 || item.selfEffects?.pc2);
    if (cavern) for (const slot of ['head', 'hands', 'body', 'feet']) state.build.relics[slot].setId = cavern.id;
    const ornament = Registry.ornament.list().find(item => item.partyEffects?.pc2 || item.selfEffects?.pc2);
    if (ornament) for (const slot of ['sphere', 'rope']) state.build.relics[slot].setId = ornament.id;

    const focus = gatherFocusEffects(state.build);
    const activeFocus = focus.find(item => item.effect.stats || item.effect.computeStats);
    if (activeFocus) {
        state.build.activeSelfEffectIds = [activeFocus.key];
        if (activeFocus.effect.stackable) state.build.selfStacksByEffectId = { [activeFocus.key]: 1 };
    }

    const testAll = Build.blank('testAll');
    testAll.eidolon = 6;
    const testEffect = gatherTeammateEffects(testAll).find(item => item.effect.stats || item.effect.computeStats);
    state.party[0].characterId = 'testAll';
    if (testEffect) state.party[0].activeEffectIds.add(testEffect.key);

    const teammate = Build.blank(state.build.characterId);
    if (lightcone) teammate.lightcone = { id: lightcone.id, superimpose: 3 };
    if (cavern) for (const slot of ['head', 'hands', 'body', 'feet']) teammate.relics[slot].setId = cavern.id;
    if (ornament) for (const slot of ['sphere', 'rope']) teammate.relics[slot].setId = ornament.id;
    const teammateEffect = gatherTeammateEffects(teammate).find(item => item.effect.stats || item.effect.computeStats);
    state.party[1] = createDiminishingState({ party: [{}, { mode: 'build', characterId: teammate.characterId, buildId: 'embedded', build: teammate }] }).party[1];
    if (teammateEffect) state.party[1].activeEffectIds.add(teammateEffect.key);

    applyDiminishingChanges(state, {
        build: { name: '変更後' }, eidolon: 1, traceLevel: { basic: 2 },
        lightcone: { superimpose: lightcone ? 4 : 1 },
        relics: { body: { mainStat: 'crit_rate', subs: { [STAT.CRIT_DMG]: 0.1 } } },
        substats: { mode: 'total', total: { allocations: { crit_rate: 2 }, tier: 'mid', lastResult: null } },
        party: [{ levelPreset: 'default' }], options: { enemyLevel: 85 },
        activeSelfEffectIds: state.build.activeSelfEffectIds || [], selfStacksByEffectId: {},
        visibleRows: ['atk'], visibleStats: ['spd'], envStats: { [STAT.ATK_PERCENT]: 0.1 },
    });
    assert.equal(state.build.name, '変更後');
    assert.equal(state.party[0].levelPreset, 'default');
    assert.deepEqual([...state.visibleRows], ['atk']);
    assert.ok(Number.isFinite(computeDiminishingState(state).damage.base));
    assert.ok(materializeDiminishingBuild(state).envBuffs.length > 0);

    commitDiminishingChanges(state, { stats: { spd: 140 } });
    assert.equal(computeDiminishingState(state).finalStats.derived.spd, 140);
    const merged = mergeDiminishingChanges({ relics: { body: { mainStat: 'crit_rate' } } }, { relics: { rope: { mainStat: 'energy_regen' } } });
    assert.equal(merged.relics.rope.mainStat, 'energy_regen');

    applyDiminishingChanges(state, { inputMode: 'direct', directStats: { atk: 1000, hp: 2000, def: 500, spd: 120 }, stats: { critRate: 0.5 } });
    assert.equal(computeDiminishingState(state).finalStats.derived.critRate, 0.5);
});

test('実ダメージは攻撃スキルだけを倍率と最終ステータスから計算する', () => {
    const archer = blankState('archer');
    const archerComputed = computeDiminishingState(archer.getState());
    assert.deepEqual(archerComputed.attacks.map(item => item.skillKey), ['basic', 'skill', 'ult', 'talent']);
    assert.ok(archerComputed.attacks.every(item => Number.isFinite(item.damage) && item.damage > 0));
    assert.equal(archerComputed.attacks.some(item => item.skillKey === 'technique'), false);

    const bronya = blankState('bronya');
    const bronyaComputed = computeDiminishingState(bronya.getState());
    assert.deepEqual(bronyaComputed.attacks.map(item => item.skillKey), ['basic']);

    const ruanMei = blankState('ruan_mei');
    const ruanMeiComputed = computeDiminishingState(ruanMei.getState());
    assert.deepEqual(ruanMeiComputed.attacks.map(item => item.skillKey), ['basic']);
});

test('validator rejects malformed state without normalizing or guessing it', () => {
    const base = blankState().serialize();
    const cases = [
        [{ ...base, schema: 'unknown' }, 'UNSUPPORTED_STATE_SCHEMA'],
        [{ ...base, guessed: true }, 'UNKNOWN_FIELD'],
        [{ ...base, inputMode: 'guess' }, 'INVALID_INPUT_MODE'],
        [{ ...base, party: {} }, 'INVALID_PARTY'],
        [{ ...base, visibleRows: 'atk' }, 'INVALID_VISIBLE_ROWS'],
        [{ ...base, visibleStats: 'spd' }, 'INVALID_VISIBLE_STATS'],
        [{ ...base, direct: { ...base.direct, guessed: 1 } }, 'UNKNOWN_FIELD'],
        [{ ...base, build: null }, 'MISSING_BUILD'],
        [{ ...base, build: { ...base.build, characterId: 'missing' } }, 'UNKNOWN_CHARACTER'],
        [{ ...base, build: { ...base.build, eidolon: 7 } }, 'INTEGER_OUT_OF_RANGE'],
        [{ ...base, build: { ...base.build, eidolon: 1.5 } }, 'INTEGER_OUT_OF_RANGE'],
        [{ ...base, build: { ...base.build, traceLevel: { basic: 99 } } }, 'INTEGER_OUT_OF_RANGE'],
        [{ ...base, build: { ...base.build, lightcone: { id: 'missing', superimpose: 1 } } }, 'UNKNOWN_LIGHTCONE'],
        [{ ...base, build: { ...base.build, lightcone: { id: null, superimpose: 8 } } }, 'INTEGER_OUT_OF_RANGE'],
        [{ ...base, build: { ...base.build, relics: { ...base.build.relics, body: { ...base.build.relics.body, mainStat: 'bad' } } } }, 'INVALID_MAIN_STAT'],
        [{ ...base, build: { ...base.build, relics: { ...base.build.relics, head: { ...base.build.relics.head, setId: 'missing' } } } }, 'UNKNOWN_RELIC_SET'],
        [{ ...base, build: { ...base.build, envBuffs: [{ stat: 'bad', value: 1 }] } }, 'UNKNOWN_STAT_KEY'],
        [{ ...base, build: { ...base.build, activeSelfEffectIds: 'bad' } }, 'INVALID_EFFECT_IDS'],
        [{ ...base, subs: { ...base.subs, mode: 'bad' } }, 'INVALID_SUBSTAT_MODE'],
        [{ ...base, subs: { ...base.subs, total: { ...base.subs.total, tier: 'bad' } } }, 'INVALID_ROLL_TIER'],
        [{ ...base, subs: { ...base.subs, total: { ...base.subs.total, allocations: { bad: 1 } } } }, 'UNKNOWN_SUBSTAT_KEY'],
        [{ ...base, subs: { ...base.subs, total: { ...base.subs.total, allocations: { CRIT_RATE: '1' } } } }, 'INVALID_ROLL_COUNT'],
        [{ ...base, options: { ...base.options, enemyLevel: 0 } }, 'INTEGER_OUT_OF_RANGE'],
        [{ ...base, options: { ...base.options, elementOverride: 'bad' } }, 'INVALID_ELEMENT'],
        [{ ...base, party: [{ ...base.party[0], characterId: 'missing' }] }, 'UNKNOWN_PARTY_CHARACTER'],
        [{ ...base, party: [{ ...base.party[0], mode: 'build', buildId: 'missing', build: null, characterId: base.build.characterId }] }, 'UNRESOLVED_PARTY_BUILD'],
        [{ ...base, party: [{ ...base.party[0], characterId: base.build.characterId, activeEffectIds: ['bad'] }] }, 'INAPPLICABLE_PARTY_EFFECT'],
        [{ ...base, inputMode: 'direct', direct: { stats: { atk: 1, hp: 1, def: 1, spd: 0 }, snapshot: null } }, 'NUMBER_OUT_OF_RANGE'],
    ];
    for (const [state, code] of cases) assertInvalid(state, code);

    const allEquipment = blankState('testAll').serialize();
    const anyLightcone = Registry.lightcone.list()[0];
    allEquipment.build.lightcone = { id: anyLightcone.id, superimpose: 1 };
    const allEquipmentValidation = validateDiminishingState(allEquipment);
    assert.equal(allEquipmentValidation.valid, true, JSON.stringify(allEquipmentValidation.errors));
});

test('job validator rejects malformed jobs and validates computed result restoration', () => {
    const base = blankState().serialize();
    const malformed = [
        [null, 'INVALID_JOB'],
        [{ ...jobFor(base), guessed: true }, 'UNKNOWN_JOB_FIELD'],
        [{ ...jobFor(base), objective: '' }, 'MISSING_OBJECTIVE'],
        [{ ...jobFor(base), metrics: 'damage' }, 'INVALID_METRICS'],
        [{ ...jobFor(base), metrics: ['bad'] }, 'UNKNOWN_METRIC'],
        [{ ...jobFor(base), fixedConditions: 'enemy' }, 'INVALID_FIXED_CONDITIONS'],
        [{ ...jobFor(base), fixedConditions: ['bad'] }, 'UNKNOWN_FIXED_CONDITION'],
        [{ ...jobFor(base), variations: 'bad' }, 'INVALID_VARIATIONS'],
        [{ ...jobFor(base), variations: [{ label: '', changes: {} }] }, 'MISSING_CASE_LABEL'],
        [jobFor(base, { guessed: 1 }), 'UNKNOWN_CHANGE_FIELD'],
        [jobFor(base, { effectSelection: 'guess' }), 'INVALID_EFFECT_SELECTION'],
        [jobFor(base, { party: { 4: { characterId: base.build.characterId } } }), 'INVALID_PARTY_INDEX'],
        [jobFor(base, {}, { matrix: 'bad' }), 'INVALID_MATRIX'],
        [jobFor(base, {}, { matrix: { rows: 'bad', columns: [] } }), 'INVALID_MATRIX_AXIS'],
        [jobFor(base, {}, { matrix: { rows: [{ label: '', changes: {} }], columns: [] } }), 'MISSING_CASE_LABEL'],
        [jobFor(base, { options: { enemyLevel: 90 } }, { fixedConditions: ['enemy'] }), 'FIXED_CONDITION_CHANGED'],
    ];
    for (const [job, code] of malformed) assertInvalid(job, code, true);

    const direct = blankState().serialize();
    direct.inputMode = 'direct';
    const ignoredBuildChange = validateDiminishingJob(jobFor(direct, { characterId: direct.build.characterId }));
    assert.equal(ignoredBuildChange.valid, false);
    assert.ok(ignoredBuildChange.errors.some(error => error.code === 'BUILD_CHANGES_REQUIRE_BUILD_MODE'));

    const validJob = jobFor(base, { stats: { spd: 134 } });
    const validated = validateDiminishingJob(validJob);
    assert.equal(validated.valid, true, JSON.stringify(validated.errors));
    const result = runDiminishingJob(validated.normalizedJob);
    assert.equal(validateDiminishingJob(validated.normalizedJob, result).valid, true);
    const mismatch = validateDiminishingJob(validated.normalizedJob, { ...result, cases: [] });
    assert.equal(mismatch.valid, false);
    assert.ok(mismatch.errors.some(error => error.code === 'RESULT_CASE_MISMATCH'));

    const badResult = { ...result, fixedConditions: ['enemy'], cases: [{ ...result.cases[0], damage: { base: Number.NaN } }] };
    const resultValidation = validateDiminishingJob(validated.normalizedJob, badResult);
    assert.equal(resultValidation.valid, false);
    assert.ok(resultValidation.errors.some(error => ['NON_FINITE_NUMBER', 'RESULT_FIXED_CONDITION_MISMATCH'].includes(error.code)));

    const fixedJob = jobFor(base, {}, { fixedConditions: ['character'] });
    const fixedValidated = validateDiminishingJob(fixedJob);
    const tampered = runDiminishingJob(fixedValidated.normalizedJob);
    tampered.cases[0].state.build.eidolon = 1;
    const tamperedValidation = validateDiminishingJob(fixedValidated.normalizedJob, tampered);
    assert.equal(tamperedValidation.valid, false);
    assert.ok(tamperedValidation.errors.some(error => error.code === 'RESULT_FIXED_CONDITION_CHANGED'));
});

test('simple party ornament is materialized and its default effect is selected', () => {
    const session = blankState('archer');
    const search = createDiminishingTools({ session }).execute('search_game_data', {
        query: '',
        queries: ['花火', 'ルサカ'],
        category: 'all',
        limit: 20,
    });
    const lushakaGroup = search.groups.find(group => group.query === 'ルサカ');
    assert.ok(lushakaGroup.results.some(item => item.activationKey === 'orn:Lushaka, the Sunken Seas:pc2.rusaka_first_slot_atk'));

    const state = session.getState();
    applyDiminishingChanges(state, {
        party: [{
            characterId: 'sparkle',
            levelPreset: 'default',
            ornamentId: 'Lushaka, the Sunken Seas',
        }],
    });

    assert.equal(state.party[0].ornamentId, 'Lushaka, the Sunken Seas');
    assert.ok(state.party[0].activeEffectIds.has('orn:Lushaka, the Sunken Seas:pc2.rusaka_first_slot_atk'));
    assert.ok(state.party[0].activeEffectIds.has('char:sparkle.extra6_atk_percent'));
    const materialized = materializeDiminishingBuild(state);
    assert.ok(materialized.envBuffs.some(buff => (
        buff.stat === STAT.ATK_PERCENT && buff.label.includes('rusaka_first_slot_atk')
    )));
    const serialized = createDiminishingSession(state).serialize();
    assert.equal(serialized.party[0].ornamentId, 'Lushaka, the Sunken Seas');
});

test('薄い指定だけで直接入力から光円錐とパーティを比較できる', () => {
    const session = blankState('archer');
    const state = session.serialize();
    state.inputMode = 'direct';
    state.direct = {
        stats: { atk: 1, hp: 1, def: 1, spd: 1, critRate: 0.05, critDmg: 0.5, energyRegen: 1 },
        snapshot: null,
    };
    session.restore(state);

    const result = createDiminishingTools({ session }).execute('run_diminishing_comparison', {
        request: {
            objective: 'アーチャーE0の光円錐比較',
            focus: { character: 'アーチャー', eidolon: 0 },
            cases: [{ lightcone: '理想を焼く奈落で' }, { lightcone: '或る嘘の終幕' }],
            shared: {
                stats: { critRate: 100, critDmg: 100 },
                substats: { atkPercent: 40 },
                party: ['遠坂凛', '花火', 'フォフォ'],
                effects: 'all',
            },
        },
    });

    assert.equal(result.ok, true, JSON.stringify(result.validation?.errors));
    assert.deepEqual(result.result.cases.map(item => item.label), ['理想を焼く奈落で', '或る嘘の終幕']);
    assert.ok(result.result.cases.every(item => item.calculation.party.length === 3));
    assert.ok(result.result.cases.every(item => item.calculation.target.eidolon === 0));
});

test('character-only selection equips the registered signature S1 without overriding explicit equipment', () => {
    const session = blankState('bronya');
    const state = session.getState();

    applyDiminishingChanges(state, { characterId: 'archer' });
    assert.deepEqual(state.build.lightcone, {
        id: 'The Hell Where Ideals Burn',
        superimpose: 1,
    });
    assert.ok(state.build.activeSelfEffectIds.includes('lc.the_hell_where_ideals_burn_self_atk_1'));

    applyDiminishingChanges(state, {
        characterId: 'archer',
        lightcone: { id: 'The Finale of a Lie', superimpose: 2 },
    });
    assert.deepEqual(state.build.lightcone, {
        id: 'The Finale of a Lie',
        superimpose: 2,
    });

    applyDiminishingChanges(state, {
        party: [{ characterId: 'sparkle', levelPreset: 'default' }],
    });
    assert.deepEqual(state.party[0].lightcone, {
        id: 'Earthly Escapade',
        superimpose: 1,
    });
    assert.ok(state.party[0].activeEffectIds.has('lc.earthly_escapade_mask_cr_cd'));

    applyDiminishingChanges(state, {
        party: [{
            characterId: 'sparkle',
            lightcone: { id: 'But the Battle Isn\'t Over', superimpose: 3 },
        }],
    });
    assert.deepEqual(state.party[0].lightcone, {
        id: 'But the Battle Isn\'t Over',
        superimpose: 3,
    });

    const restored = createDiminishingSession({
        build: Build.blank('archer'),
        party: [{ mode: 'simple', characterId: 'sparkle', lightcone: null }],
    });
    assert.deepEqual(restored.getState().party[0].lightcone, {
        id: 'Earthly Escapade',
        superimpose: 1,
    });

    const savedBuild = Build.blank('sparkle');
    savedBuild.lightcone = { id: 'But the Battle Isn\'t Over', superimpose: 4 };
    const restoredSavedBuild = createDiminishingSession({
        build: Build.blank('archer'),
        party: [{
            mode: 'build',
            characterId: 'sparkle',
            buildId: savedBuild.id,
            build: savedBuild,
            lightcone: null,
        }],
    });
    assert.equal(restoredSavedBuild.getState().party[0].lightcone, null);
    assert.deepEqual(restoredSavedBuild.getState().party[0].build.lightcone, {
        id: 'But the Battle Isn\'t Over',
        superimpose: 4,
    });
});

test('named character and lightcone select all applicable effects unless explicitly disabled', () => {
    const state = blankState('archer').getState();
    applyDiminishingChanges(state, {
        lightcone: { id: 'The Hell Where Ideals Burn', superimpose: 1 },
    });
    assert.ok(state.build.activeSelfEffectIds.includes('lc.the_hell_where_ideals_burn_self_atk_1'));
    assert.ok(state.build.activeSelfEffectIds.includes('lc.the_hell_where_ideals_burn_self_atk_2'));

    applyDiminishingChanges(state, { effectSelection: 'none' });
    assert.deepEqual(state.build.activeSelfEffectIds, []);

    applyDiminishingChanges(state, {
        party: [{
            characterId: 'sparkle',
            levelPreset: 'default',
            lightcone: { id: 'Earthly Escapade', superimpose: 1 },
        }],
    });
    assert.ok(state.party[0].activeEffectIds.has('lc.earthly_escapade_mask_cr_cd'));
    assert.deepEqual(state.party[0].lightcone, { id: 'Earthly Escapade', superimpose: 1 });

    applyDiminishingChanges(state, { party: [{ effectSelection: 'none' }] });
    assert.deepEqual([...state.party[0].activeEffectIds], []);
});
