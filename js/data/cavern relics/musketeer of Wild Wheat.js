// 遺物セット: 草の穂ガンマン
//   2pc: 攻撃力 +12%
//   4pc: 速度 +6%、通常攻撃の与ダメージ +10%

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.relicSet.add({
    id: 'Musketeer of Wild Wheat',
    name: '草の穂ガンマン',
    type: SET_TYPE.CAVERN,

    pc2: {
        stats: { [STAT.ATK_PERCENT]: 0.12 },
    },

    pc4: {
        stats: { [STAT.SPD_PERCENT]: 0.06, [STAT.DMG_BASIC]: 0.10 },
    },

    hooks: {},
});
