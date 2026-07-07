// 遺物セット: 遠方を占う者
//   2pc: 速度 +6%
//   4pc: 戦闘前の速度が120/160以上の場合、会心率 +10%/+18%。
//        各戦闘で初めて愉悦スキルを発動した時、味方全体の愉悦 +10%。累積不可。
//
// 注: 日本語名は公式表記未確認の仮訳。memo.txt に記録。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.relicSet.add({
    id: 'Diviner of Distant Reach',
    name: '遠方を占う者',
    type: SET_TYPE.CAVERN,

    pc2: {
        stats: { [STAT.SPD_PERCENT]: 0.06 },
    },

    pc4: {
        stats: {},
    },

    selfEffects: {
        pc4: [
            {
                id: 'diviner_spd_cr',
                source: 'set',
                name: '戦闘前速度120/160 自身会心率+10%/+18%',
                description: '戦闘に入る前、装備キャラの速度が120/160以上の場合、会心率+10%/+18%。該当段階を選択。',
                stats: { [STAT.CRIT_RATE]: 0 },
                stackable: {
                    max: 2,
                    default: 0,
                    type: 'step',
                    stepValues: {
                        1: { [STAT.CRIT_RATE]: 0.10 },
                        2: { [STAT.CRIT_RATE]: 0.18 },
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
