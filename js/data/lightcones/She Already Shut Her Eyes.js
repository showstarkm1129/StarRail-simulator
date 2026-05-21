// 光円錐: 閉ざした瞳 (She Already Shut Her Eyes) / 存護
//
// 効果 (視界):
//   装備キャラの最大HP +24%~40% (S1~S5: 24/28/32/36/40)
//   装備キャラの EP回復効率 +12%~20% (S1~S5: 12/14/16/18/20)
//   装備キャラの HP が減った時、味方全体の与ダメージ +9.0%~15.0%
//     (S1~S5: 9/10.5/12/13.5/15)、2T継続
//   各ウェーブ開始時、味方全体の HP をそれぞれ失った HP の 80%~100% 分回復 — hook 系
//
// 設計判断:
//   - 自己 HP+% / ERR+% は常時系 → stats[]
//   - 「HP減少時 味方全体 DMG+%」は teammate→focus partyEffect (target='all', 2T)。
//     装備者の HP が減ることはほぼ常時想定なので利用可能。

import { PATH } from '../../build/constants.js';
import { STAT } from '../../build/statKeys.js';
import { Registry } from '../../build/registry.js';

const HP_BY_SI  = [0.24, 0.28, 0.32, 0.36, 0.40];
const ERR_BY_SI = [0.12, 0.14, 0.16, 0.18, 0.20];
const DMG_BY_SI = [0.090, 0.105, 0.120, 0.135, 0.150];

Registry.lightcone.add({
    id: 'tojitaHitomi',
    name: '閉ざした瞳',
    path: PATH.PRESERVATION,
    rarity: 5,

    base: { atk: 423, hp: 1270, def: 529 },

    stats: HP_BY_SI.map((hp, i) => ({
        [STAT.HP_PERCENT]:    hp,
        [STAT.ENERGY_REGEN]:  ERR_BY_SI[i],
    })),

    hooks: (superimpose) => ({}),

    partyEffects: (superimpose) => {
        const dmg = DMG_BY_SI[Math.max(0, Math.min(4, superimpose - 1))];
        return [
            {
                id: 'tojitaHitomi_hp_loss_dmg',
                source: 'lc',
                name: `装備者HP減少時 味方与ダメ+${(dmg*100).toFixed(1)}% (2T)`,
                description: `装備キャラのHPが減った時、味方全体の与ダメージ+${(dmg*100).toFixed(1)}%、2T継続。`,
                stats: { [STAT.DMG_ALL]: dmg },
                defaultActive: false,
                target: 'all',
                duration: 2,
            },
        ];
    },
});
