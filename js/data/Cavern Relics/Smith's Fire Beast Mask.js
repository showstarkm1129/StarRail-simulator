// 遺物セット: 神業を探求する名匠
//   2pc: 最大HP+12%
//   4pc: 装備キャラが防御力ダウン状態の敵に与える会心ダメージ+28%。
//        装備キャラが敵に防御力ダウン状態を付与した後、味方全体が「助燃」を獲得する。「助燃」は2ターン継続する。
//        この効果は累積できない。「助燃」を持つ味方の与ダメージ+15%。
//        この効果は装備キャラが攻撃を行った後に再度発動できる。
//
// 設計判断:
//   - 2pc 最大HP+12% は装備者の自己ステ → pc2.stats
//   - 4pc 防御力ダウン状態の敵に与える会心ダメージ+28% は条件付き自己バフ → selfEffects.pc4
//   - 4pc 「助燃」による味方全体の与ダメージ+15% は条件付きパーティバフ → partyEffects.pc4

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.relicSet.add({
    id: 'kamiwazaMeisho',
    name: '神業を探求する名匠',
    type: SET_TYPE.CAVERN,

    pc2: {
        stats: { [STAT.HP_PERCENT]: 0.12 },
    },

    pc4: {
        stats: {},
    },

    selfEffects: {
        pc4: [
            {
                id: 'kamiwaza_def_down_cd',
                source: 'set',
                name: '防御ダウン敵へCD+28%',
                description: '装備キャラが防御力ダウン状態の敵に与える会心ダメージ+28%。(対象が防御ダウン状態の前提でON)',
                stats: { [STAT.CRIT_DMG]: 0.28 },
                defaultActive: false,
                target: 'single',
                duration: 'conditional',
                tickRule: 'none',
                dispellable: false,
            },
        ],
    },

    partyEffects: {
        pc4: [
            {
                id: 'kamiwaza_jonen_dmg',
                source: 'set',
                name: '助燃:味方与ダメ+15% (2T)',
                description: '装備キャラが敵に防御力ダウン状態を付与した後、味方全体が「助燃」を獲得する(2T継続)。「助燃」を持つ味方の与ダメージ+15%。',
                stats: { [STAT.DMG_ALL]: 0.15 },
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
