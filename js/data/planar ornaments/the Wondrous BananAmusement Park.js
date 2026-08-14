// 次元界オーナメント: 奇想天外のバナダイス
//   2pc: 会心ダメージ +16%。召喚ユニットがフィールド上にいる場合、さらに会心ダメージ +32%。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE, RELIC_USAGE, RELIC_ATTRIBUTE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.ornament.add({
    id: 'The Wondrous BananAmusement Park',
    name: '奇想天外のバナダイス',
    type: SET_TYPE.PLANAR,

    tags: {
        usage: [RELIC_USAGE.OFFENSE],
        attribute: [RELIC_ATTRIBUTE.CRIT_DMG],
    },

    pc2: {
        stats: { [STAT.CRIT_DMG]: 0.16 },
    },

    selfEffects: {
        pc2: [
            {
                id: 'bananamusement_summon_cd',
                source: 'set',
                name: '召喚ユニット在場 自身会心ダメージ+32%',
                description: '装備キャラが召喚したユニットがフィールド上にいる場合、さらに会心ダメージ+32%。',
                stats: { [STAT.CRIT_DMG]: 0.32 },
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
