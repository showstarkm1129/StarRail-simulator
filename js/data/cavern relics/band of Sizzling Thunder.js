// 遺物セット: 雷鳴轟くバンド
//   2pc: 雷属性ダメージ +10%
//   4pc: 戦闘スキル発動時、攻撃力 +20%、1T。

import { STAT, ELEMENT_DMG_KEYS } from '../../build/statKeys.js';
import { SET_TYPE, RELIC_USAGE, RELIC_ATTRIBUTE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.relicSet.add({
    id: 'Band of Sizzling Thunder',
    name: '雷鳴轟くバンド',
    type: SET_TYPE.CAVERN,

    tags: {
        usage: [RELIC_USAGE.OFFENSE],
        attribute: [RELIC_ATTRIBUTE.LIGHTNING, RELIC_ATTRIBUTE.ATK],
    },

    pc2: {
        stats: { [ELEMENT_DMG_KEYS.lightning]: 0.10 },
    },

    pc4: {
        stats: {},
    },

    selfEffects: {
        pc4: [
            {
                id: 'band_skill_atk',
                source: 'set',
                name: 'スキル後 自身攻撃力+20% (1ターン)',
                description: '装備キャラが戦闘スキルを発動した時、攻撃力+20%、1ターン継続。',
                stats: { [STAT.ATK_PERCENT]: 0.20 },
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
