// 次元界オーナメント: 奔狼の都藍王朝
//   2pc: 味方が追加攻撃を行う時、勲功を1層獲得。最大5層。
//        1層につき追加攻撃ダメージ +5%。5層時、さらに会心ダメージ +25%。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE, RELIC_USAGE, RELIC_ATTRIBUTE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.ornament.add({
    id: 'Duran, Dynasty of Running Wolves',
    name: '奔狼の都藍王朝',
    type: SET_TYPE.PLANAR,

    tags: {
        usage: [RELIC_USAGE.OFFENSE],
        attribute: [RELIC_ATTRIBUTE.FOLLOWUP, RELIC_ATTRIBUTE.CRIT_DMG],
    },

    pc2: {
        stats: {},
    },

    selfEffects: {
        pc2: [
            {
                id: 'duran_merit_followup_dmg',
                source: 'set',
                name: '勲功 1層あたり追加攻撃与ダメージ+5% (最大5層)',
                description: '味方が追加攻撃を行う時、装備キャラは「勲功」を1層獲得。1層につき追加攻撃ダメージ+5%。',
                stats: { [STAT.DMG_FOLLOWUP]: 0.05 },
                stackable: { max: 5, default: 5 },
                defaultActive: false,
                target: 'single',
                duration: 'permanent',
                tickRule: 'none',
                dispellable: false,
            },
            {
                id: 'duran_merit5_cd',
                source: 'set',
                name: '勲功5層 自身会心ダメージ+25%',
                description: '「勲功」が5層に達する時、さらに装備キャラの会心ダメージ+25%。',
                stats: { [STAT.CRIT_DMG]: 0.25 },
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
