// 遺物セット: 永遠に輝く魔法少女
//   2pc: 会心ダメージ +16%
//   4pc: 装備キャラと記憶の精霊が与える愉悦ダメージが防御力を10%無視。
//        味方が獲得した「笑いどころ」が5累積するごとに、さらに防御力を1%無視。最大10層。
//
// 注: 日本語名は公式表記未確認の仮訳。memo.txt に記録。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE, RELIC_USAGE, RELIC_ATTRIBUTE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.relicSet.add({
    id: 'Ever-Glorious Magical Girl',
    name: '永遠に輝く魔法少女',
    type: SET_TYPE.CAVERN,

    tags: {
        usage: [RELIC_USAGE.OFFENSE],
        attribute: [RELIC_ATTRIBUTE.CRIT_DMG],
    },

    pc2: {
        stats: { [STAT.CRIT_DMG]: 0.16 },
    },

    pc4: {
        stats: {},
    },

    selfEffects: {
        pc4: [
            {
                id: 'magical_girl_elation_def_ignore',
                source: 'set',
                name: '愉悦ダメージ 防御無視+10%',
                description: '装備キャラと記憶の精霊が与える愉悦ダメージが防御力を10%無視する。愉悦ダメージ計算時のみ有効にする。',
                stats: { [STAT.DEF_IGNORE]: 0.10 },
                defaultActive: false,
                target: 'single',
                duration: 'conditional',
                tickRule: 'none',
                dispellable: false,
            },
            {
                id: 'magical_girl_punchline_def_ignore',
                source: 'set',
                name: '笑いどころ5累積ごと 防御無視+1% (最大10層)',
                description: '味方が獲得した「笑いどころ」が5累積するごとに、愉悦ダメージがさらに防御力を1%無視。最大10層。愉悦ダメージ計算時のみ有効にする。',
                stats: { [STAT.DEF_IGNORE]: 0.01 },
                stackable: { max: 10, default: 10 },
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
