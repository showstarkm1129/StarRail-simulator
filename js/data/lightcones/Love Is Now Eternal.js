// 光円錐: 愛はいま永遠に / 記憶
//
// 「約束」:
//   装備キャラの速度+18%~30% (重畳常時)
//   装備キャラの記憶の精霊は、味方単体に精霊スキル発動時に「空白」獲得
//     → 敵全体の受けるダメ +10%~18%
//   装備キャラの記憶の精霊は、敵に精霊スキル発動時に「詩句」獲得
//     → 味方全体の会心ダメ +16%~28%
//   「空白」と「詩句」を同時所持時、両効果が元の値の 60%~80% 分アップ
//
// 設計判断:
//   - 「速度+%」は常時 → stats[] (SPD_PERCENT)
//   - 「空白」「詩句」は教団スキル (=記憶の精霊スキル) のトリガで起動するため、装備キャラが
//     teammate として支援する用途を想定し partyEffects で個別トグル化:
//       1) 「空白」: 敵全体 DMG_TAKEN+%   (target='all')
//       2) 「詩句」: 味方全体 CRIT_DMG+%   (target='all')
//       3) 「両方所持時 効果アップ」: 上記2つの差分をブースト分として加算 (target='all')
//          ユーザは「空白+詩句+両方ブースト」の3つを ON にすることで完全状態を再現できる。
//   - パターン的に hyaSky (Long May Rainbows Adorn the Sky) と同様、equipper を teammate に
//     置いた時に focus キャラへ波及する想定。

import { PATH } from '../../build/constants.js';
import { STAT } from '../../build/statKeys.js';
import { Registry } from '../../build/registry.js';

const SPD_BY_SI   = [0.18, 0.21, 0.24, 0.27, 0.30];
const VOID_BY_SI  = [0.10, 0.12, 0.14, 0.16, 0.18];   // 「空白」 敵 DMG_TAKEN
const VERSE_BY_SI = [0.16, 0.19, 0.22, 0.25, 0.28];   // 「詩句」 味方 CRIT_DMG
const BOOST_BY_SI = [0.60, 0.65, 0.70, 0.75, 0.80];   // 両方所持時 効果倍率

Registry.lightcone.add({
    id: 'aiWaIma',
    name: '愛はいま永遠に',
    path: PATH.REMEMBRANCE,
    rarity: 5,

    // Lv80 基礎ステ (Wiki)
    base: { atk: 476, hp: 1270, def: 463 },

    // 重畳1〜5 の常時ステ (速度+%)
    stats: [
        { [STAT.SPD_PERCENT]: SPD_BY_SI[0] },
        { [STAT.SPD_PERCENT]: SPD_BY_SI[1] },
        { [STAT.SPD_PERCENT]: SPD_BY_SI[2] },
        { [STAT.SPD_PERCENT]: SPD_BY_SI[3] },
        { [STAT.SPD_PERCENT]: SPD_BY_SI[4] },
    ],

    hooks: (superimpose) => ({}),

    partyEffects: (superimpose) => {
        const si = Math.max(0, Math.min(4, superimpose - 1));
        const voidTaken   = VOID_BY_SI[si];
        const verseCD     = VERSE_BY_SI[si];
        const boostMult   = BOOST_BY_SI[si];
        const voidBoost   = voidTaken * boostMult;
        const verseBoost  = verseCD   * boostMult;
        return [
            {
                id: 'aiWaIma_void',
                source: 'lc',
                name: `「空白」 敵全体 被ダメ+${(voidTaken*100).toFixed(1)}%`,
                description: `装備キャラの記憶の精霊が味方単体に精霊スキル発動時、「空白」獲得 → 敵全体の受けるダメージ +${(voidTaken*100).toFixed(1)}%。DMG_TAKEN 枠。`,
                stats: { [STAT.DMG_TAKEN]: voidTaken },
                defaultActive: false,
                target: 'all',
                duration: 'conditional',
            },
            {
                id: 'aiWaIma_verse',
                source: 'lc',
                name: `「詩句」 味方全体 会心ダメ+${(verseCD*100).toFixed(1)}%`,
                description: `装備キャラの記憶の精霊が敵に精霊スキル発動時、「詩句」獲得 → 味方全体の会心ダメ +${(verseCD*100).toFixed(1)}%。`,
                stats: { [STAT.CRIT_DMG]: verseCD },
                defaultActive: false,
                target: 'all',
                duration: 'conditional',
            },
            {
                id: 'aiWaIma_both_boost',
                source: 'lc',
                name: `「空白」+「詩句」同時所持 効果+${(boostMult*100).toFixed(1)}% (差分加算)`,
                description: `両方所持時、空白/詩句の効果が ${(boostMult*100).toFixed(1)}% 分アップ。空白+${(voidBoost*100).toFixed(2)}%pt (DMG_TAKEN)、詩句+${(verseBoost*100).toFixed(2)}%pt (CRIT_DMG)。空白/詩句と併用して ON にする。`,
                stats: { [STAT.DMG_TAKEN]: voidBoost, [STAT.CRIT_DMG]: verseBoost },
                defaultActive: false,
                target: 'all',
                duration: 'conditional',
            },
        ];
    },
});
