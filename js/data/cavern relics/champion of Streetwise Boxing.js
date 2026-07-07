// 遺物セット: 成り上がりチャンピオン
//   2pc: 物理属性ダメージ +10%
//   4pc: 攻撃する、または攻撃を受けた後、攻撃力 +5%。最大5層。

import { STAT, ELEMENT_DMG_KEYS } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.relicSet.add({
    id: 'Champion of Streetwise Boxing',
    name: '成り上がりチャンピオン',
    type: SET_TYPE.CAVERN,

    pc2: {
        stats: { [ELEMENT_DMG_KEYS.physical]: 0.10 },
    },

    pc4: {
        stats: {},
    },

    selfEffects: {
        pc4: [
            {
                id: 'champion_hit_atk',
                source: 'set',
                name: '攻撃/被弾 1層あたり自身攻撃力+5% (最大5層)',
                description: '装備キャラが攻撃を行う、または攻撃を受けた後、今回の戦闘中の攻撃力+5%。最大5層。',
                stats: { [STAT.ATK_PERCENT]: 0.05 },
                stackable: { max: 5, default: 5 },
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
