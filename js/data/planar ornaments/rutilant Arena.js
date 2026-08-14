// 次元界オーナメント: 星々の競技場
//   2pc: 会心率 +8%。会心率70%以上の場合、通常攻撃と戦闘スキルの与ダメージ +20%。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE, RELIC_USAGE, RELIC_ATTRIBUTE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.ornament.add({
    id: 'Rutilant Arena',
    name: '星々の競技場',
    type: SET_TYPE.PLANAR,

    tags: {
        usage: [RELIC_USAGE.OFFENSE],
        attribute: [RELIC_ATTRIBUTE.CRIT_RATE],
    },

    pc2: {
        stats: { [STAT.CRIT_RATE]: 0.08 },
    },

    selfEffects: {
        pc2: [
            {
                id: 'rutilant_cr70_basic_skill_dmg',
                source: 'set',
                name: '会心率≧70% 通常/スキル与ダメージ+20%',
                description: '装備キャラの会心率が70%以上の場合、通常攻撃と戦闘スキルの与ダメージ+20%。',
                stats: { [STAT.DMG_BASIC]: 0.20, [STAT.DMG_SKILL]: 0.20 },
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
