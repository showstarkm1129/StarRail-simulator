// 遺物セット: 天地再創の救世主
//   2pc: 会心率 +8%
//   4pc: 装備キャラが通常攻撃または戦闘スキルを発動した後、
//        装備キャラの記憶の精霊がフィールド上の場合:
//        - 装備キャラとその記憶の精霊の最大HP +24%
//        - 味方全体の与ダメージ +15%
//        装備キャラが次に通常攻撃または戦闘スキルを発動した後まで継続
//
// 設計判断:
//   - 2pc CR+8% は装備者の自己ステ → pc2.stats
//   - 4pc 装備者 HP+24% は装備者自身のみ (focus には伝わらない)
//   - 4pc 味方全体 DMG+15% は teammate→focus partyEffect (target='all')
//     記憶の精霊持ち teammate が通常/スキル使用後ON、次の通常/スキルまで持続。
//     ほぼ常時取得可能な前提で運用。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.relicSet.add({
    id: 'tenchiSaisou',
    name: '天地再創の救世主',
    type: SET_TYPE.CAVERN,

    pc2: {
        stats: { [STAT.CRIT_RATE]: 0.08 },
    },

    pc4: {
        stats: {},
    },

    partyEffects: {
        pc4: [
            {
                id: 'tenchiSaisou_spirit_dmg',
                source: 'set',
                name: '通常/スキル後 味方与ダメ+15% (記憶の精霊在中)',
                description: '装備キャラが通常攻撃または戦闘スキルを発動した後、装備キャラの記憶の精霊がフィールド上にいる場合、味方全体の与ダメージ+15%。次の通常/スキル発動まで継続。',
                stats: { [STAT.DMG_ALL]: 0.15 },
                defaultActive: false,
                target: 'all',
                duration: 'permanent',
                tickRule: 'none',
                dispellable: false,
            },
        ],
    },

    hooks: {
        // onAttack(ctx) {}
    },
});
