// 遺物セット: 雪の密林の狩人
//   2pc: 氷属性ダメージ +10%
//   4pc: 必殺技を発動した時、会心ダメージ +25%、2T。

import { STAT, ELEMENT_DMG_KEYS } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.relicSet.add({
    id: 'Hunter of Glacial Forest',
    name: '雪の密林の狩人',
    type: SET_TYPE.CAVERN,

    pc2: {
        stats: { [ELEMENT_DMG_KEYS.ice]: 0.10 },
    },

    pc4: {
        stats: {},
    },

    selfEffects: {
        pc4: [
            {
                id: 'hunter_ult_cd',
                source: 'set',
                name: '必殺後 自身会心ダメージ+25% (2ターン)',
                description: '装備キャラが必殺技を発動した時、会心ダメージ+25%、2ターン継続。',
                stats: { [STAT.CRIT_DMG]: 0.25 },
                defaultActive: false,
                target: 'single',
                duration: 2,
                tickRule: 'target_turn_start',
                dispellable: false,
            },
        ],
    },

    hooks: {},
});
