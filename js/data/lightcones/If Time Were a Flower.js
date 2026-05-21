// 光円錐: もしも時が花だったら
//
// 効果 (希望):
//   装備キャラの会心ダメージ +36%~60% (S1~S5: 36/42/48/54/60)
//   追加攻撃後、EP+12 +「啓示」獲得 2T (hook 系)
//   「啓示」所持時、味方全体の会心ダメージ +48%~96% (48/60/72/84/96)
//   戦闘開始時、EP+21 +「啓示」獲得 2T (hook 系)
//
// 設計判断:
//   - 自己 CD+% は常時系 → stats[]
//   - 「啓示」中 味方 CD+% は teammate→focus partyEffect (target='all')。
//     戦闘開始時に自動付与 + 追加攻撃で再付与 → ON/OFF トグル可。
//   - path: Wiki 未明記。バフ性能から判断して HARMONY を仮置き。違っていたら要修正。

import { PATH } from '../../build/constants.js';
import { STAT } from '../../build/statKeys.js';
import { Registry } from '../../build/registry.js';

const ALLY_CD_BY_SI = [0.48, 0.60, 0.72, 0.84, 0.96];   // S1~S5

Registry.lightcone.add({
    id: 'moshiToki',
    name: 'もしも時が花だったら',
    path: PATH.HARMONY,
    rarity: 5,

    base: { atk: 529, hp: 1270, def: 396 },

    // 重畳1〜5: 自己 CD +36/42/48/54/60%
    stats: [
        { [STAT.CRIT_DMG]: 0.36 },
        { [STAT.CRIT_DMG]: 0.42 },
        { [STAT.CRIT_DMG]: 0.48 },
        { [STAT.CRIT_DMG]: 0.54 },
        { [STAT.CRIT_DMG]: 0.60 },
    ],

    hooks: (superimpose) => ({}),

    partyEffects: (superimpose) => {
        const idx = Math.max(0, Math.min(4, superimpose - 1));
        const cd = ALLY_CD_BY_SI[idx];
        return [
            {
                id: 'moshiToki_revelation_cd',
                source: 'lc',
                name: `啓示中 味方CD+${(cd*100).toFixed(0)}% (2T)`,
                description: `装備キャラが「啓示」を所持している時、味方全体の会心ダメージ+${(cd*100).toFixed(0)}%、2T継続。啓示は戦闘開始時 + 追加攻撃時に自動付与。`,
                stats: { [STAT.CRIT_DMG]: cd },
                defaultActive: false,
                target: 'all',
                duration: 2,
            },
        ];
    },
});
