// 次元界オーナメント: 劫火と蓮灯の鋳煉宮
//   2pc: 装備キャラの速度 +6% /
//        装備キャラの攻撃が炎弱点の敵に命中する時、撃破特効 +40%、1T継続
//
// 設計判断:
//   - 「自己 SPD+6%」は装備者の自己ステ → pc2.stats
//   - 「炎弱点命中時 撃破特効+40%」は装備者自身のみ作用 (focus には伝わらない) →
//     partyEffects: pc2 は空配列。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.ornament.add({
    id: 'gokkaRenchu',
    name: '劫火と蓮灯の鋳煉宮',
    type: SET_TYPE.PLANAR,

    pc2: {
        stats: { [STAT.SPD_PERCENT]: 0.06 },
    },

    partyEffects: { pc2: [] },
    hooks: {},
});
