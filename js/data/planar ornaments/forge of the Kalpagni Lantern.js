// 次元界オーナメント: 劫火と蓮灯の鋳煉宮
//   2pc: 装備キャラの速度 +6% /
//        装備キャラの攻撃が炎弱点の敵に命中する時、撃破特効 +40%、1T継続
//
// 設計判断:
//   - 「自己 SPD+6%」は装備者の自己ステ → pc2.stats
//   - 「炎弱点命中時 撃破特効+40%」は装備者自身のみ作用 (focus には伝わらない) →
//     partyEffects: pc2 は空配列。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE, RELIC_USAGE, RELIC_ATTRIBUTE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.ornament.add({
    id: 'Forge of the Kalpagni Lantern',
    name: '劫火と蓮灯の鋳煉宮',
    type: SET_TYPE.PLANAR,

    tags: {
        usage: [RELIC_USAGE.OFFENSE, RELIC_USAGE.SUPPORT],
        attribute: [RELIC_ATTRIBUTE.BREAK_EFFECT],
    },

    pc2: {
        stats: { [STAT.SPD_PERCENT]: 0.06 },
    },

    selfEffects: {
        pc2: [
            {
                id: 'forge_fire_weakness_break',
                source: 'set',
                name: '炎弱点命中 自身撃破特効+40% (1ターン)',
                description: '装備キャラの攻撃が炎属性弱点を持つ敵に命中する時、撃破特効+40%、1ターン継続。',
                stats: { [STAT.BREAK_EFFECT]: 0.40 },
                defaultActive: false,
                target: 'single',
                duration: 1,
                tickRule: 'target_turn_start',
                dispellable: false,
            },
        ],
    },

    partyEffects: { pc2: [] },
    hooks: {},
});
