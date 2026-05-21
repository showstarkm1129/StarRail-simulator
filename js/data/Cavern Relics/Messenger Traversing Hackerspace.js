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

    // パーティ枠経由で focus キャラに与える効果
    //   pc2/pc4 ごとに、装着 teammate が居て該当セットを満たす時に表示される
    partyEffects: {
        pc4: [
            {
                id: 'msg4_ult_spd',
                source: 'set',
                name: '必殺後 味方 SPD+12% (1T)',
                description: '装着 teammate が必殺を発動した時、味方全体の SPD +12%、1T',
                stats: { [STAT.SPD_PERCENT]: 0.12 },
                defaultActive: false,
                target: 'all',
                duration: 1,
            },
        ],
    },
});
