// 遺物セット: 星の如く輝く天才
//   2pc: 量子属性ダメージ +10%
//   4pc: 敵にダメージを与えた時、防御力を10%無視。量子弱点がある場合、さらに10%無視。

import { STAT, ELEMENT_DMG_KEYS } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.relicSet.add({
    id: 'Genius of Brilliant Stars',
    name: '星の如く輝く天才',
    type: SET_TYPE.CAVERN,

    pc2: {
        stats: { [ELEMENT_DMG_KEYS.quantum]: 0.10 },
    },

    pc4: {
        stats: { [STAT.DEF_IGNORE]: 0.10 },
    },

    selfEffects: {
        pc4: [
            {
                id: 'genius_quantum_weakness_def_ignore',
                source: 'set',
                name: '量子弱点敵へ 防御無視+10%',
                description: '敵に量子属性の弱点がある場合、さらに防御力を10%無視する。',
                stats: { [STAT.DEF_IGNORE]: 0.10 },
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
