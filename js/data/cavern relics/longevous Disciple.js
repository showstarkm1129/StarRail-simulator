// 遺物セット: 宝命長存の蒔者
//   2pc: 最大HP +12%
//   4pc: 攻撃を受ける、または味方によってHPを消費させられた後、会心率 +8%。最大2層、2T。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE, RELIC_USAGE, RELIC_ATTRIBUTE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.relicSet.add({
    id: 'Longevous Disciple',
    name: '宝命長存の蒔者',
    type: SET_TYPE.CAVERN,

    tags: {
        usage: [RELIC_USAGE.OFFENSE],
        attribute: [RELIC_ATTRIBUTE.HP, RELIC_ATTRIBUTE.CRIT_RATE],
    },

    pc2: {
        stats: { [STAT.HP_PERCENT]: 0.12 },
    },

    pc4: {
        stats: {},
    },

    selfEffects: {
        pc4: [
            {
                id: 'longevous_hp_change_cr',
                source: 'set',
                name: '被弾/HP消費 1層あたり会心率+8% (最大2層)',
                description: '攻撃を受ける、または味方によってHPを消費させられた後、会心率+8%、2ターン継続。最大2層。',
                stats: { [STAT.CRIT_RATE]: 0.08 },
                stackable: { max: 2, default: 2 },
                defaultActive: false,
                target: 'single',
                duration: 2,
                tickRule: 'target_turn_start',
                dispellable: false,
            },
        ],
    },

    hooks: {},
});
