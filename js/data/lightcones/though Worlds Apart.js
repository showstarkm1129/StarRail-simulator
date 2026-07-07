// 光円錐: 万里の山河を越えて (Though Worlds Apart) / 存護
//
// 効果 (新たな鱗):
//   装備キャラの攻撃力 +64%~128% (S1~S5: 64/80/96/112/128 — 線形)
//   装備キャラが必殺技を発動する時、味方全体の HP を装備キャラの攻撃力 10%~20%
//     (S1~S5: 10/12/15/17/20 — Wiki抜けは線形補間) 分回復、+ 残HP最低キャラへ追加で
//     同量回復。同時に味方全体は「守護」獲得 (3T継続)。
//   「守護」獲得した味方の与ダメージ +24%~48% (S1~S5: 24/30/36/42/48)、
//     さらに召喚物を持つ場合は追加で与ダメージ +12%~24% (S1~S5: 12/15/18/21/24)
//
// 設計判断:
//   - 自己 ATK+% は常時系 → stats[]
//   - 「守護」中の味方全体 DMG+% は teammate→focus partyEffect (target='all')
//   - 「召喚物持ち」追加 DMG+% は条件付き分の上乗せ partyEffect (target='single' 想定)。
//     focus が記憶の精霊持ち (ヒアンシー等) の時のみON。
//   - HP回復は hook 系 (本ツール対象外)

import { PATH } from '../../build/constants.js';
import { STAT } from '../../build/statKeys.js';
import { Registry } from '../../build/registry.js';

const ATK_BY_SI         = [0.64, 0.80, 0.96, 1.12, 1.28];
const ALLY_DMG_BY_SI    = [0.24, 0.30, 0.36, 0.42, 0.48];
const SUMMON_DMG_BY_SI  = [0.12, 0.15, 0.18, 0.21, 0.24];

Registry.lightcone.add({
    id: 'Though Worlds Apart',
    name: '万里の山河を越えて',
    path: PATH.PRESERVATION,
    rarity: 5,

    base: { atk: 582, hp: 1058, def: 463 },

    stats: ATK_BY_SI.map(v => ({ [STAT.ATK_PERCENT]: v })),

    hooks: (superimpose) => ({
        // onTurnStart(ctx) {},
        // onHit(ctx) {},
        // onSkillUse(ctx) {}
    }),

    partyEffects: (superimpose) => {
        const idx = Math.max(0, Math.min(4, superimpose - 1));
        const dmg    = ALLY_DMG_BY_SI[idx];
        const summon = SUMMON_DMG_BY_SI[idx];
        return [
            {
                id: 'though_worlds_apart_ward_dmg',
                source: 'lc',
                name: `守護中 味方与ダメ+${(dmg*100).toFixed(0)}% (3T)`,
                description: `装備キャラの必殺発動後、味方全体は「守護」を獲得 (3T)。守護中の味方の与ダメージ+${(dmg*100).toFixed(0)}%。`,
                stats: { [STAT.DMG_ALL]: dmg },
                defaultActive: false,
                target: 'all',
                duration: 3,
                tickRule: 'target_turn_start',
                dispellable: false,
            },
            {
                id: 'though_worlds_apart_summon_bonus',
                source: 'lc',
                name: `守護中 召喚物持ち追加 与ダメ+${(summon*100).toFixed(0)}% (3T)`,
                description: `「守護」を獲得した味方が召喚物を持っている場合、追加で与ダメージ+${(summon*100).toFixed(0)}%。focus が記憶の精霊持ち等であれば「守護中バフ」と併用してONにする。`,
                stats: { [STAT.DMG_ALL]: summon },
                defaultActive: false,
                target: 'single',
                duration: 3,
                tickRule: 'target_turn_start',
                dispellable: false,
            },
        ];
    },
});
