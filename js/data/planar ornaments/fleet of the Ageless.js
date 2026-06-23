// 次元界オーナメント: 老いぬ者の仙舟
//   2pc: 装備キャラの最大HP+12% / 装備キャラのSPD>=120 で味方全体 ATK+8%
//
// 設計判断:
//   - 「自己 HP+12%」は装備者の自己ステ → pc2.stats に常時加算
//   - 「SPD>=120 → 味方全体 ATK+8%」は条件付きの teammate→focus バフ → partyEffects に登録
//     条件成立はユーザー判断 (UI チェックボックス) に委ねる。
//     description で条件を明示する。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.ornament.add({
    id: 'rougaiSenshu',
    name: '老いぬ者の仙舟',
    type: SET_TYPE.PLANAR,

    pc2: {
        stats: { [STAT.HP_PERCENT]: 0.12 },
    },

    partyEffects: {
        pc2: [
            {
                id: 'rougai_atk_aura',
                source: 'set',
                name: 'SPD≧120 条件 味方ATK+8% (常時発動)',
                description: '装備キャラのSPDが120以上の場合、味方全体の攻撃力+8%。装備 teammate の SPD が条件を満たしていればONにする。',
                stats: { [STAT.ATK_PERCENT]: 0.08 },
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
