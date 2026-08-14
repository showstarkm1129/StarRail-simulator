import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estimateUltimateCycle } from '../js/build/ultimateCycle.js';
import { Registry } from '../js/build/registry.js';
import '../js/data/characters/_index.js';

function character({ id, name = id, maxEnergy = 100, basic = 20, skill = 30, energyEffects = [] }) {
    return {
        id,
        name,
        maxEnergy,
        base: { spd: 100 },
        skills: {
            basic: { energyGain: basic },
            skill: { energyGain: skill },
            ult: { energyCost: maxEnergy, energyGain: 5 },
        },
        energyEffects,
    };
}

test('EP獲得量が最大の行動を選び、最短必殺技回転を返す', () => {
    const focus = character({ id: 'focus', maxEnergy: 100 });
    const output = estimateUltimateCycle({ focusId: 'focus', members: [{ id: 'focus', character: focus, speed: 100 }] });

    assert.deepEqual(output.focus.rotation, ['skill']);
    assert.equal(output.firstUltimate.turns, 4);
    assert.equal(output.reliableTurnsPerUltimate, 4, '満タンで得た余剰EPは持ち越さない');
    assert.equal(output.shortestTurnsPerUltimate, 4);
});

test('指定ローテーションとEP回復効率を反映する', () => {
    const focus = character({ id: 'focus', maxEnergy: 100 });
    const output = estimateUltimateCycle({
        focusId: 'focus',
        members: [{ id: 'focus', character: focus, speed: 100, energyRegen: 1.2, rotation: ['basic', 'skill'] }],
    });

    assert.deepEqual(output.focus.rotation, ['basic', 'skill']);
    assert.equal(output.firstUltimate.turns, 4);
    assert.equal(output.reliableTurnsPerUltimate, 4);
});

test('invalid rotation actions are ignored and fall back to a supported action', () => {
    const focus = character({ id: 'focus' });
    const output = estimateUltimateCycle({
        focusId: 'focus',
        members: [{ id: 'focus', character: focus, speed: 100, rotation: ['ult'] }],
    });
    assert.deepEqual(output.focus.rotation, ['skill']);
});

test('全体・単体の登録済みEP供給を編成と凸数に応じて適用する', () => {
    const focus = character({ id: 'focus', maxEnergy: 100, skill: 20 });
    const allSupport = character({
        id: 'all_support',
        maxEnergy: 60,
        energyEffects: [{
            id: 'all_energy', name: '全体EP', trigger: 'ult', target: 'allOtherAllies', amount: { kind: 'flat', value: 20 },
        }],
    });
    const singleSupport = character({
        id: 'single_support',
        maxEnergy: 60,
        energyEffects: [{
            id: 'single_energy', name: '単体EP', trigger: 'ult', target: 'selectedAllies', amount: { kind: 'flat', value: 30 },
        }, {
            id: 'e6_energy', name: '凸追加EP', trigger: 'ult', target: 'selectedAllies', minEidolon: 6, amount: { kind: 'flat', value: 10 },
        }],
    });
    const output = estimateUltimateCycle({
        focusId: 'focus',
        members: [
            { id: 'focus', character: focus, speed: 100 },
            { id: 'all', character: allSupport, speed: 100 },
            { id: 'single', character: singleSupport, speed: 100, eidolon: 6, energyTargetIds: ['focus'] },
        ],
    });

    assert.ok(output.energyGrants.some(grant => grant.effectId === 'all_energy'));
    assert.ok(output.energyGrants.some(grant => grant.effectId === 'single_energy'));
    assert.ok(output.energyGrants.some(grant => grant.effectId === 'e6_energy'));
    assert.ok(output.reliableTurnsPerUltimate < 5, '味方EP供給により自己完結の5ターンより短くなる');
});

test('無効な編成は明確に失敗する', () => {
    assert.throws(() => estimateUltimateCycle({ focusId: 'x', members: [] }), /編成/);
    const focus = character({ id: 'focus' });
    assert.throws(() => estimateUltimateCycle({
        focusId: 'focus', members: [{ id: 'focus', character: focus }, { id: 'focus', character: focus }],
    }), /重複/);
});

test('フォフォと停雲のEP供給は構造化データとして登録される', () => {
    const huohuo = Registry.character.get('huohuo');
    const tingyun = Registry.character.get('tingyun');
    assert.equal(huohuo.energyEffects[0].amount.kind, 'percentMax');
    assert.equal(huohuo.energyEffects[0].amount.value, 0.2);
    assert.equal(tingyun.energyEffects.find(effect => effect.minEidolon === 6).amount.value, 10);
});
