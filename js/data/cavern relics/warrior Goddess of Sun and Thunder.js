// 遺物セット: 烈陽と雷鳴の武神
//   2pc: 速度 +6%
//   4pc: 装備キャラまたは記憶の精霊が、装備キャラおよびその記憶の精霊以外の味方を治癒した後、
//        装備キャラは「慈雨」を獲得 (1Tにmax1回、2T継続)。
//        「慈雨」中、装備キャラ SPD+6%、味方全体 CD+15%、累積不可。
//
// 設計判断:
//   - 2pc SPD+6% は装備者自身の自己ステ → pc2.stats
//   - 4pc 「慈雨」中の装備者 SPD+6% は装備者自身のみ (focus には伝わらない)
//   - 4pc 「慈雨」中の味方全体 CD+15% は teammate→focus partyEffect (target='all')
//     治癒イベント後の条件付き発動だが、ヒーラー teammate の通常運用ではほぼ常時。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE, RELIC_USAGE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.relicSet.add({
    id: 'Warrior Goddess of Sun and Thunder',
    name: '烈陽と雷鳴の武神',
    type: SET_TYPE.CAVERN,

    tags: {
        usage: [RELIC_USAGE.SUPPORT],
        attribute: [],
    },

    pc2: {
        stats: { [STAT.SPD_PERCENT]: 0.06 },
    },

    pc4: {
        stats: {},
    },

    selfEffects: {
        pc4: [
            {
                id: 'warrior_goddess_sweet_rain_spd',
                source: 'set',
                name: '慈雨中 自身速度+6% (2ターン)',
                description: '装備キャラが「慈雨」を持っている場合、速度+6%。',
                stats: { [STAT.SPD_PERCENT]: 0.06 },
                defaultActive: false,
                target: 'single',
                duration: 2,
                tickRule: 'target_turn_start',
                dispellable: false,
            },
        ],
    },

    partyEffects: {
        pc4: [
            {
                id: 'busin_jiu_cd',
                source: 'set',
                name: '慈雨中 味方会心ダメージ+15% (2ターン、累積不可)',
                description: '装備キャラまたは記憶の精霊が他の味方を治癒した後、装備キャラは「慈雨」を獲得 (2ターン)。慈雨中、味方全体の会心ダメージ+15%。',
                stats: { [STAT.CRIT_DMG]: 0.15 },
                defaultActive: false,
                target: 'all',
                duration: 2,
                tickRule: 'target_turn_start',
                dispellable: false,
            },
        ],
    },

    hooks: {
        // onAttack(ctx) {}
    },
});
