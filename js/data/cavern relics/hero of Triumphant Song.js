// 遺物セット: 凱歌を揚げる英雄
//   2pc: 攻撃力 +12%
//   4pc: 記憶の精霊がフィールドにいる時、速度 +6%。
//        記憶の精霊が攻撃を行う時、装備キャラと記憶の精霊の会心ダメージ +30%、2T。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE, RELIC_USAGE, RELIC_ATTRIBUTE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.relicSet.add({
    id: 'Hero of Triumphant Song',
    name: '凱歌を揚げる英雄',
    type: SET_TYPE.CAVERN,

    tags: {
        usage: [RELIC_USAGE.OFFENSE, RELIC_USAGE.SUPPORT],
        attribute: [RELIC_ATTRIBUTE.ATK, RELIC_ATTRIBUTE.CRIT_DMG],
    },

    pc2: {
        stats: { [STAT.ATK_PERCENT]: 0.12 },
    },

    pc4: {
        stats: {},
    },

    selfEffects: {
        pc4: [
            {
                id: 'hero_spirit_spd',
                source: 'set',
                name: '記憶の精霊在場 自身速度+6%',
                description: '装備キャラの記憶の精霊がフィールドにいる時、速度+6%。',
                stats: { [STAT.SPD_PERCENT]: 0.06 },
                defaultActive: false,
                target: 'single',
                duration: 'conditional',
                tickRule: 'none',
                dispellable: false,
            },
            {
                id: 'hero_spirit_attack_cd',
                source: 'set',
                name: '記憶の精霊攻撃後 自身会心ダメージ+30% (2ターン)',
                description: '装備キャラの記憶の精霊が攻撃を行う時、装備キャラおよびその記憶の精霊の会心ダメージ+30%、2ターン継続。',
                stats: { [STAT.CRIT_DMG]: 0.30 },
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
