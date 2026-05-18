// 光円錐: 空の虹が消えぬように (ヒアンシーのモチーフ光円錐)
//
// 「包容」:
//   速度+18%~30% (重畳ステ・常時)
//   装備キャラの通常/戦闘スキル/必殺発動時、味方それぞれが残りHPの 1.0%~2.0% を消費し、
//   装備キャラの記憶の精霊が次の攻撃を行った後に「消費HP合計の 250%~500% 分の付加ダメージ」を1回与える。
//   記憶の精霊が精霊スキル発動時、敵全体の受けるダメージ+18%~36% (2T、同系統と非累積)。
//
// 簡易シミュ実装方針:
//   - 常時系 (速度+%): stats[] に重畳別の SPD_PERCENT を載せる
//   - トリガー型 (味方HP消費 → 付加ダメ、精霊スキル時の被ダメ+): 現状の hook 仕様に
//     収まりにくいため、partyEffects は空配列 (将来の damage.js 実装時に hooks 拡張)

import { PATH } from '../../build/constants.js';
import { STAT } from '../../build/statKeys.js';
import { Registry } from '../../build/registry.js';

Registry.lightcone.add({
    id: 'hyaSky',
    name: '空の虹が消えぬように',
    path: PATH.REMEMBRANCE,
    rarity: 5,

    // Lv80 基礎ステ (Wiki より)
    base: { atk: 476, hp: 1164, def: 529 },

    // 重畳1〜5 の常時ステ (速度+%)
    //   S1: 18% / S2: 21% / S3: 24% / S4: 27% / S5: 30%
    stats: [
        { [STAT.SPD_PERCENT]: 0.18 },
        { [STAT.SPD_PERCENT]: 0.21 },
        { [STAT.SPD_PERCENT]: 0.24 },
        { [STAT.SPD_PERCENT]: 0.27 },
        { [STAT.SPD_PERCENT]: 0.30 },
    ],

    // 重畳に応じた hook 群 (現状トリガー型未実装のため空)
    hooks: (superimpose) => ({}),

    // パーティ枠経由で focus キャラに与える効果
    //   付加ダメ・被ダメ+効果は damage.js 実装時に再評価。
    //   常時バフではないため、現状は空配列。
    partyEffects: (superimpose) => [],
});
