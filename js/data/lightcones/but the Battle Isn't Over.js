// 光円錐: だが戦争は終わらない / 調和
//
// 効果 (継承者):
//   装備キャラの EP回復効率 +10%~18% (S1~S5: 10/12/14/16/18)
//   味方が必殺技を発動した時、SPを1回復 (必殺2回ごと 1回発動) — hook 系
//   装備キャラが戦闘スキル発動後、次に行動する他の味方の与ダメージ
//     +30%~50% (S1~S5: 30/35/40/45/50)、1T継続
//
// 設計判断:
//   - 「自己 ERR+%」は常時系 → stats[]
//   - 「次行動の他の味方 与ダメ+%」は teammate→focus partyEffect。target='single' (次行動)。
//     条件は「他の味方」=非装備者 = focus 想定 → 常時トグル可。

import { PATH } from '../../build/constants.js';
import { STAT } from '../../build/statKeys.js';
import { Registry } from '../../build/registry.js';

const DMG_BY_SI = [0.30, 0.35, 0.40, 0.45, 0.50];   // S1~S5

Registry.lightcone.add({
    id: "But the Battle Isn't Over",
    name: 'だが戦争は終わらない',
    path: PATH.HARMONY,
    rarity: 5,

    base: { atk: 529, hp: 1164, def: 463 },

    // 重畳1〜5: ERR +10/12/14/16/18%
    stats: [
        { [STAT.ENERGY_REGEN]: 0.10 },
        { [STAT.ENERGY_REGEN]: 0.12 },
        { [STAT.ENERGY_REGEN]: 0.14 },
        { [STAT.ENERGY_REGEN]: 0.16 },
        { [STAT.ENERGY_REGEN]: 0.18 },
    ],

    hooks: (superimpose) => ({
        // onTurnStart(ctx) {},
        // onHit(ctx) {},
        // onSkillUse(ctx) {}
    }),

    partyEffects: (superimpose) => {
        const dmg = DMG_BY_SI[Math.max(0, Math.min(4, superimpose - 1))];
        return [
            {
                id: 'but_the_battle_isnt_over_skill_next_dmg',
                source: 'lc',
                name: `戦闘スキル後 次行動の他味方 与ダメ+${(dmg*100).toFixed(0)}% (1T)`,
                description: `装備キャラが戦闘スキルを発動した後、次に行動する他の味方の与ダメージ+${(dmg*100).toFixed(0)}%、1ターン継続。`,
                stats: { [STAT.DMG_ALL]: dmg },
                defaultActive: false,
                target: 'single',
                duration: 1,
                tickRule: 'target_turn_start',
                dispellable: false,
            },
        ];
    },
});
