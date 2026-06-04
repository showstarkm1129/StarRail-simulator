import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    getSkillMaxLevel, getSkillMaxLevelWithEidolon, getSkillDefaultMaxLevel,
    getSkillMultAt, clampLevel, presetDefaultMaxLevels, presetEidolonMaxLevels,
} from '../js/build/skillUtil.js';
import { makeFixtureCharacter } from './fixtures.js';

const ch = makeFixtureCharacter();

test('星魂0 では maxLevel.default を返す', () => {
    assert.equal(getSkillMaxLevel(ch, 'ult', 0), 10);
});

test('星魂ブーストで Lv 上限が拡張される (E3: ult +2)', () => {
    assert.equal(getSkillMaxLevel(ch, 'ult', 3), 12);
    // levels テーブル長 (12) を超えてクランプされる
    assert.equal(getSkillMaxLevel(ch, 'ult', 6), 12);
});

test('E5 の basic +1 が反映される', () => {
    assert.equal(getSkillMaxLevel(ch, 'basic', 4), 6);
    assert.equal(getSkillMaxLevel(ch, 'basic', 5), 7);
});

test('存在しないスキルは null', () => {
    assert.equal(getSkillMaxLevel(ch, 'nope', 6), null);
});

test('getSkillMaxLevelWithEidolon = 凸後MAX', () => {
    assert.equal(getSkillMaxLevelWithEidolon(ch, 'skill'), 12);
});

test('getSkillDefaultMaxLevel = 無凸MAX', () => {
    assert.equal(getSkillDefaultMaxLevel(ch, 'skill'), 10);
});

test('getSkillMultAt は範囲外を端にクランプ', () => {
    const skill = ch.skills.basic;
    assert.deepEqual(getSkillMultAt(skill, 1), skill.levels[0]);
    assert.deepEqual(getSkillMultAt(skill, 999), skill.levels[skill.levels.length - 1]);
    assert.deepEqual(getSkillMultAt(skill, 0), skill.levels[0]);
});

test('clampLevel は [1, maxLevel] に収める', () => {
    assert.equal(clampLevel(0, 10), 1);
    assert.equal(clampLevel(5, 10), 5);
    assert.equal(clampLevel(99, 10), 10);
    assert.equal(clampLevel(5, null), 1);
});

test('preset* は全スキルキー分そろう', () => {
    const def = presetDefaultMaxLevels(ch);
    const eid = presetEidolonMaxLevels(ch);
    assert.deepEqual(Object.keys(def).sort(), ['basic', 'skill', 'talent', 'ult']);
    assert.equal(def.ult, 10);
    assert.equal(eid.ult, 12);
});
