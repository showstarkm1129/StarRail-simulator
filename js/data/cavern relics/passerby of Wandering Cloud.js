// 遺物セット: 流雲無痕の過客
//   2pc: 治癒量 +10%
//   4pc: 戦闘開始時、SPを1回復。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.relicSet.add({
    id: 'Passerby of Wandering Cloud',
    name: '流雲無痕の過客',
    type: SET_TYPE.CAVERN,

    pc2: {
        stats: { [STAT.HEAL_BONUS]: 0.10 },
    },

    pc4: {
        stats: {},
    },

    hooks: {},
});
