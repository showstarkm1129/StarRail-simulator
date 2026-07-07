// 光円錐: 驚魂の夜 / 豊穣
//
// 効果 (全力深呼吸):
//   装備キャラの EP回復効率 +12%~20% (S1~S5: 12/14/16/18/20)
//   味方が必殺技を発動した時、装備キャラは残りHP最低の味方の HP を、
//     その味方の最大HP 10%~14% 分回復 (10/11/12/13/14) — hook 系
//   装備キャラが味方に治癒した時、その味方の攻撃力+2.4%~4.0%
//     (2.4/2.8/3.2/3.6/4.0)、最大5層、2T継続
//
// 設計判断:
//   - 自己 ERR+% は常時系 → stats[]
//   - 治癒時 ATK+% は teammate→focus partyEffect。stackable: { max:5, default:5 }
//   - HP回復トリガーは hook 系 (本ツール対象外)

import { PATH } from '../../build/constants.js';
import { STAT } from '../../build/statKeys.js';
import { Registry } from '../../build/registry.js';

const ATK_PER_STACK_BY_SI = [0.024, 0.028, 0.032, 0.036, 0.040];   // S1~S5

Registry.lightcone.add({
    id: 'Night of Fright',
    name: '驚魂の夜',
    path: PATH.ABUNDANCE,
    rarity: 5,

    base: { atk: 476, hp: 1164, def: 529 },

    // 重畳1〜5: ERR +12/14/16/18/20%
    stats: [
        { [STAT.ENERGY_REGEN]: 0.12 },
        { [STAT.ENERGY_REGEN]: 0.14 },
        { [STAT.ENERGY_REGEN]: 0.16 },
        { [STAT.ENERGY_REGEN]: 0.18 },
        { [STAT.ENERGY_REGEN]: 0.20 },
    ],

    hooks: (superimpose) => ({
        // onTurnStart(ctx) {},
        // onHit(ctx) {},
        // onSkillUse(ctx) {}
    }),

    partyEffects: (superimpose) => {
        const per = ATK_PER_STACK_BY_SI[Math.max(0, Math.min(4, superimpose - 1))];
        return [
            {
                id: 'night_of_fright_heal_atk',
                source: 'lc',
                name: `治癒後 1層あたり ATK+${(per*100).toFixed(1)}% (2T、max5層)`,
                description: `装備キャラが味方に治癒を行った時、その味方の攻撃力+${(per*100).toFixed(1)}%、最大5層累積、2T継続。`,
                stats: { [STAT.ATK_PERCENT]: per },
                stackable: { max: 5, default: 5 },
                defaultActive: false,
                target: 'single',
                duration: 2,
                tickRule: 'target_turn_start',
                dispellable: false,
            },
        ];
    },
});
