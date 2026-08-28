import { test } from 'node:test';
import assert from 'node:assert/strict';

import { computeCharacterAttackDamages } from '../js/build/attackDamage.js';
import { Registry } from '../js/build/registry.js';
import { StatComputer } from '../js/build/statComputer.js';
import { STAT } from '../js/build/statKeys.js';
import { presetEidolonMaxLevels } from '../js/build/skillUtil.js';

import '../js/data/characters/_index.js';

function buildFor(characterId) {
    return {
        characterId,
        eidolon: 6,
        traceLevel: presetEidolonMaxLevels(Registry.character.get(characterId)),
        lightcone: { id: null, superimpose: 1 },
        relics: {
            head: { setId: null, mainStat: 'hp_flat', subs: {} },
            hands: { setId: null, mainStat: 'atk_flat', subs: {} },
            body: { setId: null, mainStat: null, subs: {} },
            feet: { setId: null, mainStat: null, subs: {} },
            sphere: { setId: null, mainStat: null, subs: {} },
            rope: { setId: null, mainStat: null, subs: {} },
        },
        envBuffs: [],
    };
}

test('ナターシャの回復倍率と星魂による上限上昇が登録されている', () => {
    const natasha = Registry.character.get('natasha');

    assert.equal(natasha.skills.basic.levels.length, 7);
    assert.deepEqual(natasha.skills.skill.levels[0], {
        healPct: 0.07,
        healFlat: 70,
        hotPct: 0.048,
        hotFlat: 48,
    });
    assert.deepEqual(natasha.skills.ult.levels.at(-1), { healPct: 0.147, healFlat: 409 });
    assert.equal(natasha.skills.talent.levels.at(-1).healBoost, 0.55);
    assert.equal(natasha.skills.skill.maxLevel.withEidolon, 12);
    assert.equal(natasha.skills.ult.maxLevel.withEidolon, 12);

    const passive = natasha.selfEffects.find(effect => effect.id === 'extra4_heal_bonus');
    assert.equal(passive.stats.healBonus, 0.10);
    const conditional = natasha.selfEffects.find(effect => effect.id === 'talent_low_hp_heal_bonus');
    assert.deepEqual(
        conditional.computeStats(10, natasha.skills.talent.levels[9]),
        { healBonus: 0.50 },
    );
});

test('千冶・刃の強化攻撃と戦闘スキルの多段内訳がダメージ計算に出る', () => {
    const character = Registry.character.get('mortenax_blade');
    const build = buildFor(character.id);
    const rows = computeCharacterAttackDamages(character, build, StatComputer.compute(build));

    assert.equal(character.skills.enhancedBasic.levels.at(-1).hpPct, 1.10);
    assert.equal(character.skills.enhancedUlt.levels.at(-1).hpPct, 3.85);
    assert.equal(character.skills.skill.damageComponents[1].hits, 4);
    assert.deepEqual(
        rows.map(row => row.skillKey),
        ['basic', 'enhancedBasic', 'skill', 'skill', 'enhancedUlt'],
    );
    assert.equal(rows[3].multiplier, 0.27);
    assert.equal(rows[3].hitCount, 4);
});

test('撃破キャラの攻撃行は靭性削り量を超撃破係数に使い、ATKを参照しない', () => {
    const character = Registry.character.get('firefly');
    const build = buildFor(character.id);
    const baseRow = computeCharacterAttackDamages(character, build, StatComputer.compute(build))
        .find(row => row.skillKey === 'basic');
    const atkBuild = {
        ...build,
        envBuffs: [{ stat: STAT.ATK_PERCENT, value: 1, label: 'ATK+100%' }],
    };
    const atkRow = computeCharacterAttackDamages(character, atkBuild, StatComputer.compute(atkBuild))
        .find(row => row.skillKey === 'basic');
    const breakBuild = {
        ...build,
        envBuffs: [{ stat: STAT.BREAK_EFFECT, value: 1, label: '撃破特効+100%' }],
    };
    const breakRow = computeCharacterAttackDamages(character, breakBuild, StatComputer.compute(breakBuild))
        .find(row => row.skillKey === 'basic');

    assert.equal(baseRow.multiplier, character.skills.basic.toughness / 10);
    assert.equal(atkRow.damage, baseRow.damage);
    assert.ok(breakRow.damage > baseRow.damage);
});

test('複合攻撃・外部参照値・条件付き追加攻撃を共通行へ展開する', () => {
    const rowsFor = (characterId, options = {}) => {
        const character = Registry.character.get(characterId);
        const build = buildFor(characterId);
        return computeCharacterAttackDamages(character, build, StatComputer.compute(build), options);
    };

    const hyacine = rowsFor('hyacine', { referenceValues: { cumulativeHealing: 10000 } });
    assert.equal(hyacine.find(row => row.skillKey === 'memorySkill').scalingStat, 'reference');
    assert.ok(hyacine.find(row => row.skillKey === 'memorySkill').damage > 0);

    const castorice = rowsFor('castorice', { referenceValues: { summonHp: 20000 } });
    assert.deepEqual(
        castorice.filter(row => row.skillKey === 'memorySkill').map(row => row.scalingStat),
        ['hp', 'reference'],
    );

    const acheron = rowsFor('acheron').filter(row => row.skillKey === 'ult');
    assert.deepEqual(acheron.map(row => row.target), ['単体', '全体（敵1体）']);

    const ashveilDefault = rowsFor('ashveil').filter(row => row.skillKey === 'ult');
    assert.equal(ashveilDefault.at(-1).active, false);
    const ashveilCharged = rowsFor('ashveil', { referenceValues: { gluttonyStacks: 4 } })
        .filter(row => row.skillKey === 'ult');
    assert.equal(ashveilCharged.at(-1).active, true);

    const gilgamesh = rowsFor('gilgamesh').filter(row => row.skillKey === 'skill');
    assert.equal(gilgamesh.length, 2);
    const yao = rowsFor('yao_guang').filter(row => row.skillKey === '愉悦スキル');
    assert.equal(yao.at(-1).hitCount, 5);
    assert.equal(rowsFor('yukong').find(row => row.skillKey === 'ult').target, '単体');
});
