// 光円錐: 光あふれる夜 / 調和
//
// 効果 (慰め):
//   味方攻撃ごとに「朗唱」+1層 (max 5)。1層につき装備キャラ EP回復効率 +3.0%~5.0%
//     (S1~S5: 3.0/3.5/4.0/4.5/5.0) → max 15.0%~25.0%
//   必殺発動時、朗唱解除 →「華彩」獲得 1T。
//   華彩中: 装備キャラ ATK +48%~96% (48/60/72/84/96)、
//          味方全体 与ダメ +24%~40% (24/28/32/36/40)
//
// 設計判断:
//   - 自己 ERR は条件付き (朗唱層数依存) のため stats[] には載せない。
//   - 「華彩」発動中の自己 ATK+% と 味方 与ダメ+% は teammate→focus partyEffect。
//     必殺発動直後の 1T 限定だが、スナップショット計算では ON/OFF トグル扱い。
//
// 注: Wiki にあった ATK Lv60=756 は前後の値からして typo。Lv80=635 を採用。

import { PATH } from '../../build/constants.js';
import { STAT } from '../../build/statKeys.js';
import { Registry } from '../../build/registry.js';

const SELF_ATK_BY_SI = [0.48, 0.60, 0.72, 0.84, 0.96];   // S1~S5
const ALLY_DMG_BY_SI = [0.24, 0.28, 0.32, 0.36, 0.40];   // S1~S5

Registry.lightcone.add({
    id: 'hikariNoYoru',
    name: '光あふれる夜',
    path: PATH.HARMONY,
    rarity: 5,

    base: { atk: 635, hp: 952, def: 463 },

    // 常時系は無し (朗唱層数依存・華彩中効果はトリガー型)
    stats: [{}, {}, {}, {}, {}],

    hooks: (superimpose) => ({}),

    partyEffects: (superimpose) => {
        const idx = Math.max(0, Math.min(4, superimpose - 1));
        const dmg = ALLY_DMG_BY_SI[idx];
        return [
            {
                id: 'hikariNoYoru_kasai_dmg',
                source: 'lc',
                name: `華彩中 味方与ダメ+${(dmg*100).toFixed(0)}% (1T)`,
                description: `必殺発動後の「華彩」状態中、味方全体の与ダメージ+${(dmg*100).toFixed(0)}%、1T継続。装備キャラ自身は ATK+${(SELF_ATK_BY_SI[idx]*100).toFixed(0)}% (本人ステ反映済み想定 — focus には伝わらない)。`,
                stats: { [STAT.DMG_ALL]: dmg },
                defaultActive: false,
                target: 'all',
                duration: 1,
            },
        ];
    },
});
