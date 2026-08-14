import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
    classifyEffectText,
    isUnsupportedRule,
} from '../js/data/characters/effectRules.js';

test('効果分類辞書は既存の数値枠で扱える効果を見つける', () => {
    const rules = classifyEffectText('味方全体の追加攻撃が与える会心ダメージ+25%。');
    assert.ok(rules.some(rule => rule.id === 'crit_dmg_followup'));
    assert.equal(rules.some(rule => rule.id === 'crit_dmg_all'), false);
    assert.equal(rules.some(rule => rule.id === 'dmg_followup'), false);
});

test('効果分類辞書は火力ミラーが必要な敵デバフを見つける', () => {
    const rules = classifyEffectText('敵全体の防御力-40%、2ターン継続。');
    assert.ok(rules.some(rule => rule.id === 'def_down'));
});

test('未対応の専用形式は対応待ちとして分類する', () => {
    const rules = classifyEffectText('愉悦度を1獲得し、愉悦スキルを発動する。');
    const unsupported = rules.filter(isUnsupportedRule);
    assert.ok(unsupported.some(rule => rule.id === 'elation_degree'));
});

test('速度%と速度固定値を分けて分類する', () => {
    const percentRules = classifyEffectText('味方全体の速度+16%。');
    assert.ok(percentRules.some(rule => rule.id === 'spd_percent'));
    assert.equal(percentRules.some(rule => rule.id === 'spd_flat'), false);

    const flatRules = classifyEffectText('自身の速度+20、3ターン継続。');
    assert.ok(flatRules.some(rule => rule.id === 'spd_flat'));

    const movementRules = classifyEffectText('フィールド上にいる味方キャラの移動速度+50%。');
    assert.equal(movementRules.some(rule => rule.id === 'spd_percent'), false);
    assert.ok(movementRules.some(rule => rule.id === 'field_movement'));
});

test('発動条件にスキル名がある全体与ダメージをスキル専用枠にしない', () => {
    const rules = classifyEffectText('戦闘スキルによる治癒を受けるたび、その味方の与ダメージ+10%。');
    assert.ok(rules.some(rule => rule.id === 'dmg_all'));
    assert.equal(rules.some(rule => rule.id === 'dmg_skill'), false);
});
