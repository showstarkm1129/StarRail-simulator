// 遺物セット: 仮想空間を漫遊するメッセンジャー
//   2pc: 速度 +6%
//   4pc: 必殺技使用時、味方全体の速度+12% (1ターン)

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE, RELIC_USAGE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.relicSet.add({
    id: 'Messenger Traversing Hackerspace',
    name: '仮想空間を漫遊するメッセンジャー',
    type: SET_TYPE.CAVERN,

    tags: {
        usage: [RELIC_USAGE.SUPPORT],
        attribute: [],
    },

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
                name: '味方対象の必殺後 味方速度+12% (1ターン)',
                description: '装備している味方が味方対象の必殺技を発動した時、味方全体の速度+12%、1ターン継続。',
                stats: { [STAT.SPD_PERCENT]: 0.12 },
                defaultActive: false,
                target: 'all',
                duration: 1,
                tickRule: 'target_turn_start',
                dispellable: false,
            },
        ],
    },

    hooks: {
        // onAttack(ctx) {}
    },
});
