// 次元界オーナメント: 自転がとまったサルソット
//   2pc: 会心率 +8%。会心率50%以上の場合、必殺技と追加攻撃の与ダメージ +15%。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE, RELIC_USAGE, RELIC_ATTRIBUTE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.ornament.add({
    id: 'Inert Salsotto',
    name: '自転がとまったサルソット',
    type: SET_TYPE.PLANAR,

    tags: {
        usage: [RELIC_USAGE.OFFENSE],
        attribute: [RELIC_ATTRIBUTE.CRIT_RATE, RELIC_ATTRIBUTE.FOLLOWUP],
    },

    pc2: {
        stats: { [STAT.CRIT_RATE]: 0.08 },
    },

    selfEffects: {
        pc2: [
            {
                id: 'salsotto_cr50_ult_followup_dmg',
                source: 'set',
                name: '会心率≧50% 必殺/追加攻撃与ダメージ+15%',
                description: '装備キャラの会心率が50%以上の場合、必殺技と追加攻撃の与ダメージ+15%。',
                stats: { [STAT.DMG_ULT]: 0.15, [STAT.DMG_FOLLOWUP]: 0.15 },
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
