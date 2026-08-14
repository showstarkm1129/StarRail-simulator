// 次元界オーナメント: Punklorde Stage Zero
//   2pc: 愉悦 +8%。愉悦が初めて40%/80%に達した時、会心ダメージ +20%/+32%。
//
// 注: 現在 STAT に愉悦専用枠がないため、愉悦 +8% は未反映。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE, RELIC_USAGE, RELIC_ATTRIBUTE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.ornament.add({
    id: 'Punklorde Stage Zero',
    name: 'パンクロード・ステージゼロ',
    type: SET_TYPE.PLANAR,

    tags: {
        usage: [RELIC_USAGE.OFFENSE],
        attribute: [RELIC_ATTRIBUTE.CRIT_DMG],
    },

    pc2: {
        stats: {},
    },

    selfEffects: {
        pc2: [
            {
                id: 'punklorde_elation40_cd',
                source: 'set',
                name: '愉悦40%初到達 自身会心ダメージ+20%',
                description: '愉悦が初めて40%に達した時、会心ダメージ+20%。愉悦+8%本体は専用枠未対応。',
                stats: { [STAT.CRIT_DMG]: 0.20 },
                defaultActive: false,
                target: 'single',
                duration: 'permanent',
                tickRule: 'none',
                dispellable: false,
            },
            {
                id: 'punklorde_elation80_cd',
                source: 'set',
                name: '愉悦80%初到達 自身会心ダメージ+32%',
                description: '愉悦が初めて80%に達した時、会心ダメージ+32%。愉悦+8%本体は専用枠未対応。',
                stats: { [STAT.CRIT_DMG]: 0.32 },
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
