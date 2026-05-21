// 光円錐: 運命は常に不公平 / 存護
//
// 効果 (オールイン):
//   装備キャラの防御力 +40%~64% (S1~S5: 40/46/52/58/64)
//   装備キャラがバリアを付与する時、装備キャラの会心ダメージ +40%~64% (同値)、2T継続
//   装備キャラの追加攻撃が敵に命中する時、100%~160% の基礎確率で
//     攻撃を受ける敵の被ダメージ +10.0%~16.0% (S1~S5: 10/11.5/13/14.5/16)、2T継続
//
// 設計判断:
//   - 自己 DEF+% は常時系 → stats[]
//   - 「バリア付与時の自己 CD+%」は装備者自身のみ。teammate→focus partyEffect ではないため
//     partyEffects には登録しない。
//   - 「追加攻撃命中時の敵被ダメ+%」は敵デバフ。Diminishing の taken factor に作用するため
//     partyEffect として登録 (DMG_TAKEN 枠、target='all')。基礎確率は計算上 100% として扱う。

import { PATH } from '../../build/constants.js';
import { STAT } from '../../build/statKeys.js';
import { Registry } from '../../build/registry.js';

const DEF_BY_SI    = [0.40, 0.46, 0.52, 0.58, 0.64];   // S1~S5
const TAKEN_BY_SI  = [0.100, 0.115, 0.130, 0.145, 0.160];   // S1~S5

Registry.lightcone.add({
    id: 'fukouheiUnmei',
    name: '運命は常に不公平',
    path: PATH.PRESERVATION,
    rarity: 5,

    base: { atk: 423, hp: 1058, def: 661 },

    // 重畳1〜5: 自己 DEF +40/46/52/58/64%
    stats: DEF_BY_SI.map(v => ({ [STAT.DEF_PERCENT]: v })),

    hooks: (superimpose) => ({}),

    partyEffects: (superimpose) => {
        const idx = Math.max(0, Math.min(4, superimpose - 1));
        const taken = TAKEN_BY_SI[idx];
        return [
            {
                id: 'fukoUnmei_taken',
                source: 'lc',
                name: `追加攻撃命中時 敵被ダメ+${(taken*100).toFixed(1)}% (2T)`,
                description: `装備キャラの追加攻撃が敵に命中する時、100%の基礎確率で攻撃を受ける敵の被ダメージ+${(taken*100).toFixed(1)}%、2T継続。`,
                stats: { [STAT.DMG_TAKEN]: taken },
                defaultActive: false,
                target: 'all',
                duration: 2,
            },
        ];
    },
});
