// 光円錐: 長き夜に輝く星へ / 記憶
//
// 「眠れない」:
//   装備キャラの最大HP +30%~60% (重畳常時)
//   装備キャラの記憶の精霊がスキル発動時、装備キャラは「夜色」を獲得
//   「夜色」中:
//     - 味方の記憶の精霊全体の与ダメは敵防御力を 20%~30% 無視
//     - 装備キャラとその精霊の与ダメ +30%~60%
//   装備キャラの記憶の精霊が退場時、装備キャラのEPを 8~16 回復 (本ツール対象外)
//
// 設計判断:
//   - 「最大HP+%」は常時 → stats[] (HP_PERCENT)
//   - 「夜色」効果は装備キャラ本人 (=記憶DPSの想定) にかかるセルフバフ。
//     スナップショット計算は steady-state 前提なので stats[] に DEF_IGNORE / DMG_ALL を
//     直接載せ、コメントで「夜色 ON 想定」を明記。
//     条件を外したい場合は LC を外してスナップ比較で差分確認。
//   - EP回復 / 精霊退場トリガーは hook 系 (本ツール対象外)
//
// 重畳補間: Wiki 表は S1/S2/S5 のみ。S3/S4 は等差で補完。
//   HP/与ダメ:    30 / 37.5 / 45  / 52.5 / 60   (+7.5/重畳)
//   防御力無視:   20 / 22.5 / 25  / 27.5 / 30   (+2.5/重畳)
//   EP回復:        8 / 10   / 12  / 14   / 16   (+2/重畳) ← 本ツール未使用

import { PATH } from '../../build/constants.js';
import { STAT } from '../../build/statKeys.js';
import { Registry } from '../../build/registry.js';

const HP_BY_SI      = [0.300, 0.375, 0.450, 0.525, 0.600];
const DEF_IGN_BY_SI = [0.200, 0.225, 0.250, 0.275, 0.300];
const DMG_BY_SI     = [0.300, 0.375, 0.450, 0.525, 0.600];

Registry.lightcone.add({
    id: "To Evernight's Stars",
    name: '長き夜に輝く星へ',
    path: PATH.REMEMBRANCE,
    rarity: 5,

    // Lv80 基礎ステ (Wiki)
    base: { atk: 529, hp: 1164, def: 463 },

    // 重畳1〜5 の常時ステ (HP%) + 「夜色」想定の DEF_IGNORE / DMG_ALL
    //   ※ DEF_IGNORE / DMG_ALL は「夜色」獲得中のみ発動する条件付き効果。
    //     記憶DPS用LCのため steady-state では常時ON想定で stats[] に組み込み。
    stats: [
        { [STAT.HP_PERCENT]: HP_BY_SI[0], [STAT.DEF_IGNORE]: DEF_IGN_BY_SI[0], [STAT.DMG_ALL]: DMG_BY_SI[0] },
        { [STAT.HP_PERCENT]: HP_BY_SI[1], [STAT.DEF_IGNORE]: DEF_IGN_BY_SI[1], [STAT.DMG_ALL]: DMG_BY_SI[1] },
        { [STAT.HP_PERCENT]: HP_BY_SI[2], [STAT.DEF_IGNORE]: DEF_IGN_BY_SI[2], [STAT.DMG_ALL]: DMG_BY_SI[2] },
        { [STAT.HP_PERCENT]: HP_BY_SI[3], [STAT.DEF_IGNORE]: DEF_IGN_BY_SI[3], [STAT.DMG_ALL]: DMG_BY_SI[3] },
        { [STAT.HP_PERCENT]: HP_BY_SI[4], [STAT.DEF_IGNORE]: DEF_IGN_BY_SI[4], [STAT.DMG_ALL]: DMG_BY_SI[4] },
    ],

    hooks: (superimpose) => ({
        // onTurnStart(ctx) {},
        // onHit(ctx) {},
        // onSkillUse(ctx) {}
    }),

    // パーティ枠 (装備者が teammate の場合) 経由のバフは無し — 効果は装備者本人に集中
    partyEffects: (superimpose) => [],
});
