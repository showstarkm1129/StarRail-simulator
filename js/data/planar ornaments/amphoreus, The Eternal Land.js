// 次元界オーナメント: 永遠の地オンパロス
//   2pc: 装備キャラの会心率 +8% /
//        装備キャラの記憶の精霊がフィールド上にいる時、味方全体の速度+8% (累積不可)
//
// 設計判断:
//   - 「自己 CR+8%」は装備者の自己ステ → pc2.stats
//   - 「精霊在中時 味方全体 SPD+8%」は teammate→focus partyEffect (target='all')。
//     条件成立 (teammate が記憶の精霊持ち + 召喚済み) はユーザー判断で ON。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.ornament.add({
    id: 'Amphoreus, The Eternal Land',
    name: '永遠の地オンパロス',
    type: SET_TYPE.PLANAR,

    pc2: {
        stats: { [STAT.CRIT_RATE]: 0.08 },
    },

    partyEffects: {
        pc2: [
            {
                id: 'onparos_spirit_spd',
                source: 'set',
                name: '記憶の精霊フィールド上時 味方速度+8% (累積不可)',
                description: '装備キャラの記憶の精霊がフィールド上にいる時、味方全体の速度+8%。同系統は累積不可。',
                stats: { [STAT.SPD_PERCENT]: 0.08 },
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
