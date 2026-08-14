// 遺物セット: 吹雪と対峙する兵士
//   2pc: 被ダメージ -8%
//   4pc: ターン開始時、HP50%以下ならHP回復とEP回復。
//
// 注: 現在の火力計算には装備者の被ダメージ軽減やHP/EP回復を反映する枠がないため stats は空。

import { SET_TYPE, RELIC_USAGE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.relicSet.add({
    id: 'Guard of Wuthering Snow',
    name: '吹雪と対峙する兵士',
    type: SET_TYPE.CAVERN,

    tags: {
        usage: [RELIC_USAGE.SURVIVAL],
        attribute: [],
    },

    pc2: {
        stats: {},
    },

    pc4: {
        stats: {},
    },

    hooks: {},
});
