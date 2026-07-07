// 遺物セット: 夢を弄ぶ時計屋
//   2pc: 撃破特効 +16%
//   4pc: 味方に対して必殺技を発動する時、味方全体の撃破特効 +30%、2T。累積不可。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.relicSet.add({
    id: 'Watchmaker, Master of Dream Machinations',
    name: '夢を弄ぶ時計屋',
    type: SET_TYPE.CAVERN,

    pc2: {
        stats: { [STAT.BREAK_EFFECT]: 0.16 },
    },

    pc4: {
        stats: {},
    },

    partyEffects: {
        pc4: [
            {
                id: 'watchmaker_ult_break',
                source: 'set',
                name: '味方対象の必殺後 味方撃破特効+30% (2ターン)',
                description: '装備キャラが味方に対して必殺技を発動する時、味方全体の撃破特効+30%、2ターン継続。累積不可。',
                stats: { [STAT.BREAK_EFFECT]: 0.30 },
                defaultActive: false,
                target: 'all',
                duration: 2,
                tickRule: 'target_turn_start',
                dispellable: false,
            },
        ],
    },

    hooks: {},
});
