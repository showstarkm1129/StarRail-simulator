// 次元界オーナメント: 蒼穹戦線グラモス
//   2pc: 攻撃力 +12%。速度135/160以上で与ダメージ +12%/+18%。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.ornament.add({
    id: 'Firmament Frontline: Glamoth',
    name: '蒼穹戦線グラモス',
    type: SET_TYPE.PLANAR,

    pc2: {
        stats: { [STAT.ATK_PERCENT]: 0.12 },
    },

    selfEffects: {
        pc2: [
            {
                id: 'glamoth_spd_dmg',
                source: 'set',
                name: '速度135/160 自身与ダメージ+12%/+18%',
                description: '装備キャラの速度が135/160以上の時、与ダメージ+12%/+18%。該当段階を選択。',
                stats: { [STAT.DMG_ALL]: 0 },
                stackable: {
                    max: 2,
                    default: 0,
                    type: 'step',
                    stepValues: {
                        1: { [STAT.DMG_ALL]: 0.12 },
                        2: { [STAT.DMG_ALL]: 0.18 },
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
