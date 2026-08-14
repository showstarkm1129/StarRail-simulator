// 次元界オーナメント: 酩酊の海域
//   2pc: 攻撃力 +12%。攻撃力2,400/3,600以上の場合、持続ダメージ +12%/+24%。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE, RELIC_USAGE, RELIC_ATTRIBUTE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.ornament.add({
    id: 'Revelry by the Sea',
    name: '酩酊の海域',
    type: SET_TYPE.PLANAR,

    tags: {
        usage: [RELIC_USAGE.OFFENSE],
        attribute: [RELIC_ATTRIBUTE.ATK],
    },

    pc2: {
        stats: { [STAT.ATK_PERCENT]: 0.12 },
    },

    selfEffects: {
        pc2: [
            {
                id: 'revelry_atk_dot_dmg',
                source: 'set',
                name: '攻撃力2400/3600 持続ダメージ+12%/+24%',
                description: '攻撃力が2,400/3,600以上の場合、与える持続ダメージ+12%/+24%。持続ダメージ計算時のみ有効にする。',
                stats: { [STAT.DMG_ALL]: 0 },
                stackable: {
                    max: 2,
                    default: 0,
                    type: 'step',
                    stepValues: {
                        1: { [STAT.DMG_ALL]: 0.12 },
                        2: { [STAT.DMG_ALL]: 0.24 },
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
