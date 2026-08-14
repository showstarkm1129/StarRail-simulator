// 遺物セット: 蝗害を一掃せし鉄騎
//   2pc: 撃破特効 +16%
//   4pc: 撃破特効150%以上で弱点撃破ダメージが防御力を10%無視。
//        撃破特効250%以上で超撃破ダメージがさらに防御力を15%無視。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE, RELIC_USAGE, RELIC_ATTRIBUTE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.relicSet.add({
    id: 'Iron Cavalry Against the Scourge',
    name: '蝗害を一掃せし鉄騎',
    type: SET_TYPE.CAVERN,

    tags: {
        usage: [RELIC_USAGE.OFFENSE],
        attribute: [RELIC_ATTRIBUTE.BREAK_EFFECT],
    },

    pc2: {
        stats: { [STAT.BREAK_EFFECT]: 0.16 },
    },

    pc4: {
        stats: {},
    },

    selfEffects: {
        pc4: [
            {
                id: 'iron_cavalry_be150_break_def_ignore',
                source: 'set',
                name: '撃破特効≧150% 弱点撃破防御無視+10%',
                description: '撃破特効が150%以上の時、敵に与える弱点撃破ダメージが防御力を10%無視する。弱点撃破ダメージ計算時のみ有効にする。',
                stats: { [STAT.DEF_IGNORE]: 0.10 },
                defaultActive: false,
                target: 'single',
                duration: 'conditional',
                tickRule: 'none',
                dispellable: false,
            },
            {
                id: 'iron_cavalry_be250_superbreak_def_ignore',
                source: 'set',
                name: '撃破特効≧250% 超撃破防御無視+15%',
                description: '撃破特効が250%以上の時、さらに敵に与える超撃破ダメージが防御力を15%無視する。超撃破ダメージ計算時のみ有効にする。',
                stats: { [STAT.DEF_IGNORE]: 0.15 },
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
