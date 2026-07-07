// 次元界オーナメント: 宇宙封印ステーション
//   2pc: 攻撃力 +12%。装備キャラの速度が120以上の場合、さらに攻撃力 +12%。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.ornament.add({
    id: 'Space Sealing Station',
    name: '宇宙封印ステーション',
    type: SET_TYPE.PLANAR,

    pc2: {
        stats: { [STAT.ATK_PERCENT]: 0.12 },
    },

    selfEffects: {
        pc2: [
            {
                id: 'space_sealing_station_spd120_atk',
                source: 'set',
                name: '速度≧120 自身攻撃力+12%',
                description: '装備キャラの速度が120以上の場合、さらに攻撃力+12%。',
                stats: { [STAT.ATK_PERCENT]: 0.12 },
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
