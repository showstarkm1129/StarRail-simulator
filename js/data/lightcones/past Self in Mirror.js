// 光円錐: 鏡の中の私 / 調和
//
// 効果 (徹骨梅香):
//   装備キャラの撃破特効 +60%~100% (S1~S5: 60/70/80/90/100)
//   必殺発動後、味方の与ダメージ +24%~40% (24/28/32/36/40)、3T継続
//   装備キャラの撃破特効が150%以上の場合、SP+1 (hook 系)
//   各ウェーブ開始時、味方の EP +10.0~20.0 (10.0/12.5/15.0/17.5/20.0) (hook 系)
//   同系統重複不可。
//
// 設計判断:
//   - 自己 撃破特効 +% は常時系 → stats[] (BREAK_EFFECT 枠)
//   - 「必殺後 味方 与ダメ+%」は teammate→focus partyEffect (target='all')

import { PATH } from '../../build/constants.js';
import { STAT } from '../../build/statKeys.js';
import { Registry } from '../../build/registry.js';

const ALLY_DMG_BY_SI = [0.24, 0.28, 0.32, 0.36, 0.40];   // S1~S5

Registry.lightcone.add({
    id: 'Past Self in Mirror',
    name: '鏡の中の私',
    path: PATH.HARMONY,
    rarity: 5,

    base: { atk: 529, hp: 1058, def: 529 },

    // 重畳1〜5: 自己 撃破特効 +60/70/80/90/100%
    stats: [
        { [STAT.BREAK_EFFECT]: 0.60 },
        { [STAT.BREAK_EFFECT]: 0.70 },
        { [STAT.BREAK_EFFECT]: 0.80 },
        { [STAT.BREAK_EFFECT]: 0.90 },
        { [STAT.BREAK_EFFECT]: 1.00 },
    ],

    hooks: (superimpose) => ({
        // onTurnStart(ctx) {},
        // onHit(ctx) {},
        // onSkillUse(ctx) {}
    }),

    partyEffects: (superimpose) => {
        const idx = Math.max(0, Math.min(4, superimpose - 1));
        const dmg = ALLY_DMG_BY_SI[idx];
        return [
            {
                id: 'past_self_in_mirror_ult_dmg',
                source: 'lc',
                name: `必殺後 味方与ダメ+${(dmg*100).toFixed(0)}% (3T、同系統非累積)`,
                description: `装備キャラが必殺技を発動した後、味方の与ダメージ+${(dmg*100).toFixed(0)}%、3T継続。同系統スキルは重ねがけ不可。`,
                stats: { [STAT.DMG_ALL]: dmg },
                defaultActive: false,
                target: 'all',
                duration: 3,
                tickRule: 'target_turn_start',
                dispellable: false,
            },
        ];
    },
});
