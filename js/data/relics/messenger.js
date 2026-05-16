// 遺物セット: 仮想空間を漫遊するメッセンジャー
//   2pc: 速度 +6%
//   4pc: 必殺技使用時、味方全体の速度+12% (1ターン)

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.relicSet.add({
    id: 'messenger',
    name: '仮想空間を漫遊するメッセンジャー',
    type: SET_TYPE.CAVERN,

    pc2: {
        stats: { [STAT.SPD_PERCENT]: 0.06 },
    },

    pc4: {
        stats: {},
        hooks: {
            onUltUse(ctx) {
                ctx.allies?.forEach(a => a.addBuff?.({
                    name: 'messenger_spd', spdMod: 0.12, duration: 1,
                }));
            },
        },
    },
});
