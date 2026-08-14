// 遺物セット: 荒地で盗みを働く廃土客
//   2pc: 虚数属性ダメージ +10%
//   4pc: デバフ状態の敵へ会心率 +10%。禁錮状態の敵へ会心ダメージ +20%。

import { STAT, ELEMENT_DMG_KEYS } from '../../build/statKeys.js';
import { SET_TYPE, RELIC_USAGE, RELIC_ATTRIBUTE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.relicSet.add({
    id: 'Wastelander of Banditry Desert',
    name: '荒地で盗みを働く廃土客',
    type: SET_TYPE.CAVERN,

    tags: {
        usage: [RELIC_USAGE.OFFENSE],
        attribute: [RELIC_ATTRIBUTE.IMAGINARY, RELIC_ATTRIBUTE.CRIT_RATE, RELIC_ATTRIBUTE.CRIT_DMG],
    },

    pc2: {
        stats: { [ELEMENT_DMG_KEYS.imaginary]: 0.10 },
    },

    pc4: {
        stats: {},
    },

    selfEffects: {
        pc4: [
            {
                id: 'wastelander_debuff_cr',
                source: 'set',
                name: 'デバフ敵へ 自身会心率+10%',
                description: 'デバフ状態の敵にダメージを与えた時、会心率+10%。',
                stats: { [STAT.CRIT_RATE]: 0.10 },
                defaultActive: false,
                target: 'single',
                duration: 'conditional',
                tickRule: 'none',
                dispellable: false,
            },
            {
                id: 'wastelander_imprisoned_cd',
                source: 'set',
                name: '禁錮敵へ 自身会心ダメージ+20%',
                description: '禁錮状態の敵にダメージを与えた時、会心ダメージ+20%。',
                stats: { [STAT.CRIT_DMG]: 0.20 },
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
