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
    id: 'shinryoKyoju',
    name: '深慮に浸る巨樹',
    type: SET_TYPE.PLANAR,

    pc2: {
        stats: { [STAT.SPD_PERCENT]: 0.06 },
    },

    partyEffects: { pc2: [] },
});
