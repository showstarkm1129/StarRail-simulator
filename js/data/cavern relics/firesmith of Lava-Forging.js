// 遺物セット: 溶岩で鍛造する火匠
//   2pc: 炎属性ダメージ +10%
//   4pc: 戦闘スキル与ダメージ +12%。必殺技後、次の攻撃の炎属性与ダメージ +12%。

import { STAT, ELEMENT_DMG_KEYS } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.relicSet.add({
    id: 'Firesmith of Lava-Forging',
    name: '溶岩で鍛造する火匠',
    type: SET_TYPE.CAVERN,

    pc2: {
        stats: { [ELEMENT_DMG_KEYS.fire]: 0.10 },
    },

    pc4: {
        stats: { [STAT.DMG_SKILL]: 0.12 },
    },

    selfEffects: {
        pc4: [
            {
                id: 'firesmith_after_ult_fire_dmg',
                source: 'set',
                name: '必殺後 次攻撃炎与ダメ+12%',
                description: '必殺技を発動した後、次の攻撃の炎属性与ダメージ+12%。次の攻撃計算時のみ有効にする。',
                stats: { [ELEMENT_DMG_KEYS.fire]: 0.12 },
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
