// 遺物セット: 純庭教会の聖騎士
//   2pc: 防御力 +15%
//   4pc: 装備キャラが付与するバリアの耐久値 +20%。
//
// 注: バリア耐久値の専用ステータス枠は未対応。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.relicSet.add({
    id: 'Knight of Purity Palace',
    name: '純庭教会の聖騎士',
    type: SET_TYPE.CAVERN,

    pc2: {
        stats: { [STAT.DEF_PERCENT]: 0.15 },
    },

    pc4: {
        stats: {},
    },

    hooks: {},
});
