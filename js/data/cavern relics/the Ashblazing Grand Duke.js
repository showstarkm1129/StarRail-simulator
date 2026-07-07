// 遺物セット: 灰燼を燃やし尽くす大公
//   2pc: 追加攻撃の与ダメージ +20%
//   4pc: 追加攻撃のヒットごとに攻撃力 +6%。最大8層、3T。次の追加攻撃で解除。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.relicSet.add({
    id: 'The Ashblazing Grand Duke',
    name: '灰燼を燃やし尽くす大公',
    type: SET_TYPE.CAVERN,

    pc2: {
        stats: { [STAT.DMG_FOLLOWUP]: 0.20 },
    },

    pc4: {
        stats: {},
    },

    selfEffects: {
        pc4: [
            {
                id: 'ashblazing_followup_hit_atk',
                source: 'set',
                name: '追加攻撃ヒット 1回あたり自身攻撃力+6% (最大8層)',
                description: '装備キャラが追加攻撃を行った時、ダメージを与えるたびに攻撃力+6%。最大8層、3ターン継続。次の追加攻撃で解除。',
                stats: { [STAT.ATK_PERCENT]: 0.06 },
                stackable: { max: 8, default: 8 },
                defaultActive: false,
                target: 'single',
                duration: 3,
                tickRule: 'target_turn_start',
                dispellable: false,
            },
        ],
    },

    hooks: {},
});
