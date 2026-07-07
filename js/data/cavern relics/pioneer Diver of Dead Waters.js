// 遺物セット: 死水に潜る先駆者
//   2pc: デバフの影響を受けている敵への与ダメージ +12%
//   4pc: 会心率 +4%。デバフ2/3つ以上の敵への会心ダメージ +8%/+12%。
//        装備キャラが敵にデバフを付与した後、上記効果が2倍、1T。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.relicSet.add({
    id: 'Pioneer Diver of Dead Waters',
    name: '死水に潜る先駆者',
    type: SET_TYPE.CAVERN,

    pc2: {
        stats: {},
    },

    pc4: {
        stats: { [STAT.CRIT_RATE]: 0.04 },
    },

    selfEffects: {
        pc2: [
            {
                id: 'pioneer_debuffed_enemy_dmg',
                source: 'set',
                name: 'デバフ敵へ 自身与ダメ+12%',
                description: 'デバフの影響を受けている敵への与ダメージ+12%。',
                stats: { [STAT.DMG_ALL]: 0.12 },
                defaultActive: false,
                target: 'single',
                duration: 'conditional',
                tickRule: 'none',
                dispellable: false,
            },
        ],
        pc4: [
            {
                id: 'pioneer_debuff_count_cd',
                source: 'set',
                name: 'デバフ2/3個 自身会心ダメージ+8%/+12%',
                description: 'デバフを2/3つ以上付与されている敵に対する会心ダメージ+8%/+12%。',
                stats: { [STAT.CRIT_DMG]: 0 },
                stackable: {
                    max: 2,
                    default: 0,
                    type: 'step',
                    stepValues: {
                        1: { [STAT.CRIT_DMG]: 0.08 },
                        2: { [STAT.CRIT_DMG]: 0.12 },
                    },
                },
                defaultActive: false,
                target: 'single',
                duration: 'conditional',
                tickRule: 'none',
                dispellable: false,
            },
            {
                id: 'pioneer_after_debuff_double_cd',
                source: 'set',
                name: 'デバフ付与後 デバフ2/3個会心ダメージ+16%/+24% (1ターン)',
                description: '装備キャラが敵にデバフを付与した後、4セットの会心ダメージ効果が2倍になる。1ターン継続。',
                stats: { [STAT.CRIT_DMG]: 0 },
                stackable: {
                    max: 2,
                    default: 0,
                    type: 'step',
                    stepValues: {
                        1: { [STAT.CRIT_DMG]: 0.16 },
                        2: { [STAT.CRIT_DMG]: 0.24 },
                    },
                },
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
