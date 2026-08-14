// 遺物セット: 流星の跡を追う怪盗
//   2pc: 撃破特効 +16%
//   4pc: 撃破特効 +16%。弱点撃破後、EPを3回復。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE, RELIC_USAGE, RELIC_ATTRIBUTE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.relicSet.add({
    id: 'Thief of Shooting Meteor',
    name: '流星の跡を追う怪盗',
    type: SET_TYPE.CAVERN,

    tags: {
        usage: [RELIC_USAGE.OFFENSE],
        attribute: [RELIC_ATTRIBUTE.BREAK_EFFECT],
    },

    pc2: {
        stats: { [STAT.BREAK_EFFECT]: 0.16 },
    },

    pc4: {
        stats: { [STAT.BREAK_EFFECT]: 0.16 },
    },

    hooks: {},
});
