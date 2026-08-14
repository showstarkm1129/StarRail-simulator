// 遺物セット: 風雲を薙ぎ払う勇烈
//   2pc: 攻撃力 +12%
//   4pc: 会心率 +6%。追加攻撃を行う時、必殺技ダメージ +36%、1T。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE, RELIC_USAGE, RELIC_ATTRIBUTE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.relicSet.add({
    id: 'The Wind-Soaring Valorous',
    name: '風雲を薙ぎ払う勇烈',
    type: SET_TYPE.CAVERN,

    tags: {
        usage: [RELIC_USAGE.OFFENSE],
        attribute: [RELIC_ATTRIBUTE.ATK, RELIC_ATTRIBUTE.CRIT_RATE],
    },

    pc2: {
        stats: { [STAT.ATK_PERCENT]: 0.12 },
    },

    pc4: {
        stats: { [STAT.CRIT_RATE]: 0.06 },
    },

    selfEffects: {
        pc4: [
            {
                id: 'valorous_followup_ult_dmg',
                source: 'set',
                name: '追加攻撃後 必殺与ダメージ+36% (1ターン)',
                description: '装備キャラが追加攻撃を行う時、必殺技によるダメージ+36%、1ターン継続。',
                stats: { [STAT.DMG_ULT]: 0.36 },
                defaultActive: false,
                target: 'single',
                duration: 1,
                tickRule: 'target_turn_start',
                dispellable: false,
            },
        ],
    },

    hooks: {},
});
