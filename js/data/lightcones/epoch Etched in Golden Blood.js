// 光円錐: 黄金の血で刻む時代 / 調和
//
// 効果:
//   装備キャラの攻撃力 +64%~128% (S1~S5: 64/80/96/112/128 — 線形 +16/重畳)
//   必殺技で攻撃を行った後、SPを1回復 (hook 系・本ツール対象外)
//   装備キャラが味方単体に戦闘スキル発動後、その味方の戦闘スキルダメージ
//     +54.0%~108.0% (S1~S5: 54.0/67.5/81.0/94.5/108.0 — 線形 +13.5/重畳)、3T
//
// 設計判断:
//   - 「装備者 ATK+%」は常時系 → stats[] に ATK_PERCENT を載せる
//   - 「単体味方の戦闘スキルダメージ+%」は STAT.DMG_SKILL 枠 (スキル種別ダメ枠) で登録。
//     比較表「与ダメ枠 (戦闘スキル)」行に加算され、戦闘スキル以外を計算する場合は
//     寄与しない (正しい挙動)。defaultActive: false は維持 — 焦点キャラが戦闘スキル
//     主体でない場合は無関係なため。

import { PATH } from '../../build/constants.js';
import { STAT } from '../../build/statKeys.js';
import { Registry } from '../../build/registry.js';

const SKILL_DMG_BY_SI = [0.54, 0.675, 0.81, 0.945, 1.08];   // S1~S5

Registry.lightcone.add({
    id: 'oogonNoChi',
    name: '黄金の血で刻む時代',
    path: PATH.HARMONY,
    rarity: 5,

    base: { atk: 635, hp: 952, def: 463 },

    // 重畳1〜5: ATK +64/80/96/112/128%
    stats: [
        { [STAT.ATK_PERCENT]: 0.64 },
        { [STAT.ATK_PERCENT]: 0.80 },
        { [STAT.ATK_PERCENT]: 0.96 },
        { [STAT.ATK_PERCENT]: 1.12 },
        { [STAT.ATK_PERCENT]: 1.28 },
    ],

    hooks: (superimpose) => ({
        // onTurnStart(ctx) {},
        // onHit(ctx) {},
        // onSkillUse(ctx) {}
    }),

    partyEffects: (superimpose) => {
        const skillDmg = SKILL_DMG_BY_SI[Math.max(0, Math.min(4, superimpose - 1))];
        return [
            {
                id: 'oogon_skill_dmg',
                source: 'lc',
                name: `戦闘スキル後 味方単体 戦闘スキルダメ+${(skillDmg*100).toFixed(1)}% (3T)`,
                description: `装備キャラが味方単体に戦闘スキルを発動した後、その味方の戦闘スキルダメージ+${(skillDmg*100).toFixed(1)}%、3T継続。DMG_SKILL 枠 (比較表「与ダメ枠 (戦闘スキル)」行に反映)。`,
                stats: { [STAT.DMG_SKILL]: skillDmg },
                defaultActive: false,
                target: 'single',
                duration: 3,
                tickRule: 'target_turn_start',
                dispellable: false,
            },
        ];
    },
});
