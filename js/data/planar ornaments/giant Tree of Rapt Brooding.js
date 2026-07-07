// 次元界オーナメント: 深慮に浸る巨樹
//   2pc: 装備キャラの速度 +6% /
//        装備キャラの速度が 135 以上の時、装備キャラ及びその記憶の精霊の治癒量 +12%
//        装備キャラの速度が 180 以上の時、装備キャラ及びその記憶の精霊の治癒量 +20%
//
// 設計判断:
//   - 「自己 SPD+6%」は装備者の自己ステ → pc2.stats
//   - 「装備者の治癒量 +%」は装備者自身のみ作用 (焦点キャラには伝わらない) →
//     partyEffects: pc2 は空配列。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.ornament.add({
    id: 'Giant Tree of Rapt Brooding',
    name: '深慮に浸る巨樹',
    type: SET_TYPE.PLANAR,

    pc2: {
        stats: { [STAT.SPD_PERCENT]: 0.06 },
    },

    selfEffects: {
        pc2: [
            {
                id: 'giant_tree_spd_heal_bonus',
                source: 'set',
                name: '速度135/180 自身治癒量+12%/+20%',
                description: '装備キャラの速度が135/180以上の時、装備キャラ及びその記憶の精霊の治癒量+12%/+20%。',
                stats: { [STAT.HEAL_BONUS]: 0 },
                stackable: {
                    max: 2,
                    default: 0,
                    type: 'step',
                    stepValues: {
                        1: { [STAT.HEAL_BONUS]: 0.12 },
                        2: { [STAT.HEAL_BONUS]: 0.20 },
                    },
                },
                defaultActive: false,
                target: 'single',
                duration: 'permanent',
                tickRule: 'none',
                dispellable: false,
            },
        ],
    },

    partyEffects: { pc2: [] },
    hooks: {},
});
