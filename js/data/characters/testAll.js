// テスト用キャラ: テスト全装備 (S5)
//
// パーティ枠でこのキャラを選択すると、現在 Registry に登録された
// 全光円錐 / 全トンネル遺物セット (2pc+4pc) / 全次元界オーナメント の partyEffects を
// 「全部所有している teammate」として列挙し、UI で個別にトグルできる。
//
// キャラ自体は基礎ステ最小・スキル空・partyEffects 空 — テスト目的のみ。
// 光円錐の superimpose は testAllSuperimpose で指定 (この個体は S5)。
//
// 識別フラグ:
//   isTestAllEquipment: true        — 全装備モード ON
//   testAllSuperimpose: 1〜5         — 光円錐の重畳 (default 5)

import { Registry } from '../../build/registry.js';

Registry.character.add({
    id: 'testAll',
    name: 'テスト全装備',
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

    // キャラ自身からのバフ効果は無し
    partyEffects: [],

    extras: [],
    hooks: {},

    // テスト専用フラグ — UI 側はこれを見て全装備の partyEffects を一括列挙する。
    isTestAllEquipment: true,
    testAllSuperimpose: 5,
});
