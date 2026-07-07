// 遺物セット: 深い牢獄の囚人
//   2pc: 攻撃力 +12%
//   4pc: 敵の持続ダメージ系デバフ1つにつき、防御力を6%無視。最大3つ。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.relicSet.add({
    id: 'Prisoner in Deep Confinement',
    name: '深い牢獄の囚人',
    type: SET_TYPE.CAVERN,

    pc2: {
        stats: { [STAT.ATK_PERCENT]: 0.12 },
    },

    pc4: {
        stats: {},
    },

    selfEffects: {
        pc4: [
            {
                id: 'prisoner_dot_def_ignore',
                source: 'set',
                name: '持続ダメージデバフ 1つあたり防御無視+6% (最大3)',
                description: '敵に付与された持続ダメージ系デバフ1つにつき、装備キャラがその敵にダメージを与える時に防御力を6%無視する。最大3つまで。',
                stats: { [STAT.DEF_IGNORE]: 0.06 },
                stackable: { max: 3, default: 3 },
                defaultActive: false,
                target: 'single',
                duration: 'conditional',
                tickRule: 'none',
                dispellable: false,
            },
        ],
    },

    hooks: {},
});
