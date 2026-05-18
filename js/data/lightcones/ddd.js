// 光円錐: ダンス・ダンス・ダンス
// 常時ステは持たず、必殺技後に味方全体の行動値を短縮するトリガー型。

import { PATH } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.lightcone.add({
    id: 'ddd',
    name: 'ダンス・ダンス・ダンス',
    path: PATH.HARMONY,
    rarity: 4,

    base: { atk: 476, hp: 952, def: 396 },

    // 重畳1〜5。常時ステ無しなので空オブジェクトのみ。
    stats: [{}, {}, {}, {}, {}],

    // 重畳レベルを引数に取り hook 群を返す。
    // S1=16% から +2%/重畳 (S5=24%)
    hooks: (superimpose) => ({
        onUltUse(ctx) {
            const pct = 0.16 + (superimpose - 1) * 0.02;
            ctx.allies?.forEach(a => a.advanceAction?.(pct));
        },
    }),

    // パーティ枠経由で focus キャラに与える効果
    //   関数または配列。関数なら (superimpose) を受け取り配列を返す。
    //   DDD は行動値短縮のみで focus キャラのステータスには影響しないため空配列。
    partyEffects: (superimpose) => [],
});
