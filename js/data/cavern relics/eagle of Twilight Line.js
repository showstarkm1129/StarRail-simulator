// 遺物セット: 昼夜の狭間を翔ける鷹
//   2pc: 風属性ダメージ +10%
//   4pc: 必殺技を発動した後、自身の行動値を 25% 短縮

import { ELEMENT_DMG_KEYS } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.relicSet.add({
    id: 'Eagle of Twilight Line',
    name: '昼夜の狭間を翔ける鷹',
    type: SET_TYPE.CAVERN,

    pc2: {
        stats: { [ELEMENT_DMG_KEYS.wind]: 0.10 },
    },

    pc4: {
        stats: {},
        hooks: {
            onUltUse(ctx) {
                ctx.self?.advanceAction?.(0.25);
            },
        },
    },

    hooks: {
        // onAttack(ctx) {}
    },
});
