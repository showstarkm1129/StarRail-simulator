// 次元界オーナメント: 建創者のベロブルグ
//   2pc: 防御力 +15%。効果命中が50%以上の場合、さらに防御力 +15%。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE, RELIC_USAGE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.ornament.add({
    id: 'Belobog of the Architects',
    name: '建創者のベロブルグ',
    type: SET_TYPE.PLANAR,

    tags: {
        usage: [RELIC_USAGE.SURVIVAL],
        attribute: [],
    },

    pc2: {
        stats: { [STAT.DEF_PERCENT]: 0.15 },
    },

    selfEffects: {
        pc2: [
            {
                id: 'belobog_ehr50_def',
                source: 'set',
                name: '効果命中≧50% 自身防御力+15%',
                description: '装備キャラの効果命中が50%以上の場合、さらに防御力+15%。',
                stats: { [STAT.DEF_PERCENT]: 0.15 },
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
