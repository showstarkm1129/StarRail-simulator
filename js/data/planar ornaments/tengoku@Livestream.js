// 次元界オーナメント: 天国@配信ルーム
//   2pc: 会心ダメージ +16%。同じターンにSPを3以上消費した場合、さらに会心ダメージ +32%、3T。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE, RELIC_USAGE, RELIC_ATTRIBUTE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.ornament.add({
    id: 'Tengoku@Livestream',
    name: '天国@配信ルーム',
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
                id: 'tengoku_sp3_cd',
                source: 'set',
                name: '同一ターンSP3消費 自身会心ダメージ+32% (3ターン)',
                description: '同じターンにSPを3以上消費した場合、さらに会心ダメージ+32%、3ターン継続。',
                stats: { [STAT.CRIT_DMG]: 0.32 },
                defaultActive: false,
                target: 'single',
                duration: 3,
                tickRule: 'target_turn_start',
                dispellable: false,
            },
        ],
    },
    hooks: {},
});
