// 遺物セット: 亡国の悲哀を詠う詩人
//   2pc: 量子属性ダメージ +10%
//   4pc: 速度 -8%。戦闘前速度が110/95未満の場合、会心率 +20%/+32%。

import { STAT, ELEMENT_DMG_KEYS } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.relicSet.add({
    id: 'Poet of Mourning Collapse',
    name: '亡国の悲哀を詠う詩人',
    type: SET_TYPE.CAVERN,

    pc2: {
        stats: { [ELEMENT_DMG_KEYS.quantum]: 0.10 },
    },

    pc4: {
        stats: { [STAT.SPD_PERCENT]: -0.08 },
    },

    selfEffects: {
        pc4: [
            {
                id: 'poet_low_spd_cr',
                source: 'set',
                name: '戦闘前速度<110/95 自身会心率+20%/+32%',
                description: '戦闘に入る前、装備キャラの速度が110/95を下回る時、会心率+20%/+32%。該当段階を選択。',
                stats: { [STAT.CRIT_RATE]: 0 },
                stackable: {
                    max: 2,
                    default: 0,
                    type: 'step',
                    stepValues: {
                        1: { [STAT.CRIT_RATE]: 0.20 },
                        2: { [STAT.CRIT_RATE]: 0.32 },
                    },
                },
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
