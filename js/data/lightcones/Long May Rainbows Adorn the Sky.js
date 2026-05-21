// 光円錐: 空の虹が消えぬように
//
// 「包容」:
//   速度+18%~30% (重畳ステ・常時)
//   装備キャラの通常/戦闘スキル/必殺発動時、味方それぞれが残りHPの 1.0%~2.0% を消費し、
//   装備キャラの記憶の精霊が次の攻撃を行った後に「消費HP合計の 250%~500% 分の付加ダメージ」を1回与える。
//   記憶の精霊が精霊スキル発動時、敵全体の受けるダメージ+18%~36% (2T、同系統と非累積)。
//
// 簡易シミュ実装方針:
//   - 常時系 (速度+%): stats[] に重畳別の SPD_PERCENT を載せる
//   - 味方HP消費 → 付加ダメ: 累計付加ダメ計算が必要なため hook (本ツール対象外)
//   - 精霊スキル時 敵全体 被ダメ+%: partyEffect として登録 (DMG_TAKEN 枠、target='all')

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
    //   精霊スキル発動時、敵全体の受けるダメージ+18%~36% (2T、同系統と非累積)
    //   S1=18% / S5=36% / 線形 +4.5%/重畳 → 18.0, 22.5, 27.0, 31.5, 36.0
    partyEffects: (superimpose) => {
        const TAKEN_BY_SI = [0.180, 0.225, 0.270, 0.315, 0.360];
        const taken = TAKEN_BY_SI[Math.max(0, Math.min(4, superimpose - 1))];
        return [
            {
                id: 'hyaSky_spirit_taken',
                source: 'lc',
                name: `精霊スキル発動時 敵被ダメ+${(taken*100).toFixed(1)}% (2T、同系統非累積)`,
                description: `記憶の精霊が精霊スキルを発動した時、敵全体の受けるダメージ+${(taken*100).toFixed(1)}%、2T継続。同系統スキルは重ねがけ不可。`,
                stats: { [STAT.DMG_TAKEN]: taken },
                defaultActive: false,
                target: 'all',
                duration: 2,
            },
        ];
    },
});
