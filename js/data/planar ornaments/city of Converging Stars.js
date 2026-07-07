// 次元界オーナメント: 千の星が集う街
//   2pc: 装備キャラが追加攻撃時、自身の ATK+24%、2T継続。
//        敵が倒された時、その戦闘中、味方全体の CD+12%、累積不可。
//
// 設計判断:
//   - 「追加攻撃時 自身 ATK+24%」は装備者の self trigger → self用 partyEffect ではなく
//     hooks 領域 (現状トリガー型未実装) のため、partyEffects には登録しない。
//     pc2.stats にも入れない (条件付きのため)。
//   - 「敵撃破時 味方全体 CD+12%」は teammate→focus partyEffect。
//     その戦闘中持続 (≒常時扱い) なのでスナップショット計算でON/OFFトグル可。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.ornament.add({
    id: 'City of Converging Stars',
    name: '千の星が集う街',
    type: SET_TYPE.PLANAR,

    pc2: {
        stats: {},
    },

    selfEffects: {
        pc2: [
            {
                id: 'city_followup_atk',
                source: 'set',
                name: '追加攻撃後 自身攻撃力+24% (2ターン)',
                description: '装備キャラが追加攻撃を行った時、自身の攻撃力+24%、2ターン継続。',
                stats: { [STAT.ATK_PERCENT]: 0.24 },
                defaultActive: false,
                target: 'single',
                duration: 2,
                tickRule: 'target_turn_start',
                dispellable: false,
            },
        ],
    },

    partyEffects: {
        pc2: [
            {
                id: 'sennoHoshi_kill_cd',
                source: 'set',
                name: '敵撃破後 味方会心ダメージ+12% (戦闘中持続)',
                description: '敵が倒された時、その戦闘中、味方全体の会心ダメージ+12% (累積不可)。撃破イベント後に有効にする。',
                stats: { [STAT.CRIT_DMG]: 0.12 },
                defaultActive: false,
                target: 'all',
                duration: 'permanent',
                tickRule: 'none',
                dispellable: false,
            },
        ],
    },
    hooks: {},
});
