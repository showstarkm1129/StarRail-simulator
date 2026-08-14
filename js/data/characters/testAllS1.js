// テスト用キャラ: テスト全装備 (S1)
//
// testAll の S1 バリエーション。光円錐の重畳のみ S1 を仮定し、
// 残りの仕様 (全 LC/全セット/全オーナメントを一括列挙、自身は無効果) は同じ。
//
// 識別フラグ:
//   isTestAllEquipment: true
//   testAllSuperimpose: 1

import { Registry } from '../../build/registry.js';

Registry.character.add({
    id: 'testAllS1',
    name: 'テスト全装備 (S1)',
    element: null,
    path: null,
    rarity: 5,

    base: { atk: 1, hp: 1, def: 1, spd: 100 },
    maxEnergy: 120,

    traces: { stats: {}, breakdown: [] },
    eidolons: {},
    eidolonsDetail: {},

    skills: {
        basic: {
            name: '(テスト用ダミー)',
            type: 'attack', target: 'single',
            energy: 0,
            description: 'テスト用キャラのためダミー定義。',
            maxLevel: { default: 1, withEidolon: 1 },
            levels: [{ atk: 0 }],
        },
    },

    partyEffects: [],
    extras: [],
    hooks: {},

    isTestAllEquipment: true,
    testAllSuperimpose: 1,
});
