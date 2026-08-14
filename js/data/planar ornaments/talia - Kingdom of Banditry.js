// 次元界オーナメント: 盗賊公国タリア
//   2pc: 撃破特効 +16%。装備キャラの速度が145以上の場合、さらに撃破特効 +20%。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE, RELIC_USAGE, RELIC_ATTRIBUTE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.ornament.add({
    id: 'Talia: Kingdom of Banditry',
    name: '盗賊公国タリア',
    type: SET_TYPE.PLANAR,

    tags: {
        usage: [RELIC_USAGE.OFFENSE],
        attribute: [RELIC_ATTRIBUTE.BREAK_EFFECT],
    },

    pc2: {
        stats: { [STAT.BREAK_EFFECT]: 0.16 },
    },

    selfEffects: {
        pc2: [
            {
                id: 'talia_spd145_break',
                source: 'set',
                name: '速度≧145 自身撃破特効+20%',
                description: '装備キャラの速度が145以上の場合、さらに撃破特効+20%。',
                stats: { [STAT.BREAK_EFFECT]: 0.20 },
                defaultActive: false,
                target: 'single',
                duration: 'permanent',
                tickRule: 'none',
                dispellable: false,
            },
        ],
    },
    hooks: {},
});
