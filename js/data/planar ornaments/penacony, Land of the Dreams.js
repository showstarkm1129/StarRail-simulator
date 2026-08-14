// 次元界オーナメント: 夢の地ピノコニー
//   2pc: 装備キャラの EP回復効率 +5% /
//        パーティ中の装備キャラと同じ属性の味方の与ダメージ +10%
//
// 設計判断:
//   - 「自己 ERR+5%」は装備者の自己ステ → pc2.stats
//   - 「同属性味方 与ダメ+10%」は teammate→focus partyEffect (target='all')。
//     条件成立はユーザー判断 (focus と teammate が同属性なら ON)。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE, RELIC_USAGE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.ornament.add({
    id: 'Penacony, Land of the Dreams',
    name: '夢の地ピノコニー',
    type: SET_TYPE.PLANAR,

    tags: {
        usage: [RELIC_USAGE.SUPPORT],
        attribute: [],
    },

    pc2: {
        stats: { [STAT.ENERGY_REGEN]: 0.05 },
    },

    partyEffects: {
        pc2: [
            {
                id: 'penacony_same_element_dmg',
                source: 'set',
                name: '同属性味方 与ダメ+10% (常時発動)',
                description: 'パーティ中の装備キャラと同じ属性の味方の与ダメージ+10%。計算対象と装備している味方が同属性なら有効にする。',
                stats: { [STAT.DMG_ALL]: 0.10 },
                defaultActive: false,
                target: 'all',
                duration: 'permanent',
                tickRule: 'none',
                dispellable: false,
            },
        ],
    },
    hooks: {},
});
