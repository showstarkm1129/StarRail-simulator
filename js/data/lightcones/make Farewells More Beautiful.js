// 光円錐: 永訣よ美しくあれ / 記憶
//
// 「銘刻」:
//   装備キャラの最大HP +30%~60% (重畳常時)
//   装備キャラまたはその記憶の精霊が自身のターンでHPを失った時、装備キャラは「冥花」獲得、2T
//   「冥花」中、装備キャラとその精霊の与ダメは敵防御力を 30%~50% 無視
//   装備キャラの記憶の精霊が消えた時、装備キャラの行動順が 12%~24% 早まる
//     (1回まで発動、必殺技でリセット — 本ツール対象外: 行動順加速は速度タブの領分)
//
// 設計判断:
//   - 「最大HP+%」は常時 → stats[]
//   - 「冥花」中 DEF_IGNORE+% は記憶DPSで HP損失が常時発生する steady-state 想定で
//     stats[] に常時込み (条件外し検証は LC を外して比較)
//   - 行動順加速は速度タブの行動回数計算に属し、限界効用逓減 (火力貢献率) では対象外。
//     記録としてコメントで残し、stats には含めない。

import { PATH } from '../../build/constants.js';
import { STAT } from '../../build/statKeys.js';
import { Registry } from '../../build/registry.js';

// Wiki は整数% (30/37/45/52/60) 表示だが、HSR 共通の +7.5%/重畳 パターンに準拠
const HP_BY_SI      = [0.300, 0.375, 0.450, 0.525, 0.600];
const DEF_IGN_BY_SI = [0.30, 0.35, 0.40, 0.45, 0.50];
// 参考 (本ツール未使用): 行動順加速 = [0.12, 0.15, 0.18, 0.21, 0.24]

Registry.lightcone.add({
    id: 'Make Farewells More Beautiful',
    name: '永訣よ美しくあれ',
    path: PATH.REMEMBRANCE,
    rarity: 5,

    // Lv80 基礎ステ (Wiki)
    base: { atk: 529, hp: 1270, def: 396 },

    // 重畳1〜5: HP+% + 「冥花」中 DEF_IGNORE
    stats: [
        { [STAT.HP_PERCENT]: HP_BY_SI[0], [STAT.DEF_IGNORE]: DEF_IGN_BY_SI[0] },
        { [STAT.HP_PERCENT]: HP_BY_SI[1], [STAT.DEF_IGNORE]: DEF_IGN_BY_SI[1] },
        { [STAT.HP_PERCENT]: HP_BY_SI[2], [STAT.DEF_IGNORE]: DEF_IGN_BY_SI[2] },
        { [STAT.HP_PERCENT]: HP_BY_SI[3], [STAT.DEF_IGNORE]: DEF_IGN_BY_SI[3] },
        { [STAT.HP_PERCENT]: HP_BY_SI[4], [STAT.DEF_IGNORE]: DEF_IGN_BY_SI[4] },
    ],

    hooks: (superimpose) => ({
        // onTurnStart(ctx) {},
        // onHit(ctx) {},
        // onSkillUse(ctx) {}
    }),

    partyEffects: (superimpose) => [],
});
