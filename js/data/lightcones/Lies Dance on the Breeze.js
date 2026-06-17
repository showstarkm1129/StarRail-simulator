// 光円錐: 風に揺蕩う虚言 / 虚無
//
// 効果 (欺瞞):
//   装備キャラの速度+18%~30% (S1~S5: 18/21/24/27/30)
//   装備キャラが攻撃を行った後、120%の基礎確率で敵それぞれを「茫然」状態にする。
//   「茫然」状態の敵の防御力-16%~24% (S1~S5: 16/18/20/22/24)、2ターン継続。
//   また、装備キャラの速度が170以上の場合、120%の基礎確率で敵それぞれを「盗難」状態にする。
//   「盗難」状態の敵の防御力-8%~12% (S1~S5: 8/9/10/11/12)、2ターン継続。
//   「茫然」または「盗難」状態が重複して付与された場合、最後に付与されたもののみが有効となる。

import { PATH } from '../../build/constants.js';
import { STAT } from '../../build/statKeys.js';
import { Registry } from '../../build/registry.js';

const SPD_BY_SI = [0.18, 0.21, 0.24, 0.27, 0.30];
const DEF_DOWN_DAZED = [0.16, 0.18, 0.20, 0.22, 0.24];
const DEF_DOWN_STOLEN = [0.08, 0.09, 0.10, 0.11, 0.12];

Registry.lightcone.add({
    id: 'kazeNiTayutauKyogen',
    name: '風に揺蕩う虚言',
    path: PATH.NIHILITY,
    rarity: 5,

    base: { atk: 582, hp: 952, def: 529 },

    stats: SPD_BY_SI.map(v => ({ [STAT.SPD_PERCENT]: v })),

    hooks: (superimpose) => ({
        // onTurnStart(ctx) {},
        // onHit(ctx) {},
        // onSkillUse(ctx) {}
    }),

    partyEffects: (superimpose) => {
        const idx = Math.max(0, Math.min(4, superimpose - 1));
        const dazed = DEF_DOWN_DAZED[idx];
        const stolen = DEF_DOWN_STOLEN[idx];
        return [
            {
                id: 'kazeKyogen_dazed_party',
                source: 'lc',
                name: `攻撃後 敵防御力-${(dazed*100).toFixed(0)}% (茫然/2T)`,
                description: `装備キャラが攻撃を行った後、敵の防御力-${(dazed*100).toFixed(0)}%。2ターン継続。`,
                stats: { [STAT.DEF_DOWN]: dazed },
                defaultActive: true,
                target: 'all',
                duration: 2,
                tickRule: 'target_turn_start',
                dispellable: false,
            },
            {
                id: 'kazeKyogen_stolen_party',
                source: 'lc',
                name: `速度170以上時 敵防御力-${(stolen*100).toFixed(0)}% (盗難/2T)`,
                description: `装備キャラの速度が170以上の場合、敵の防御力-${(stolen*100).toFixed(0)}%。2ターン継続。`,
                stats: { [STAT.DEF_DOWN]: stolen },
                defaultActive: false, // 速度170以上の条件があるため手動トグル
                target: 'all',
                duration: 2,
                tickRule: 'target_turn_start',
                dispellable: false,
            }
        ];
    },

    enemyEffects: (superimpose) => {
        const idx = Math.max(0, Math.min(4, superimpose - 1));
        const dazed = DEF_DOWN_DAZED[idx];
        const stolen = DEF_DOWN_STOLEN[idx];
        const baseChance = 1.2;
        return [
            {
                id: 'kazeKyogen_dazed',
                source: 'lc',
                name: `攻撃後 敵防御力-${(dazed*100).toFixed(0)}% (茫然/2T)`,
                description: `装備キャラが攻撃を行った後、${(baseChance*100).toFixed(0)}%の基礎確率で攻撃を受ける敵の防御力-${(dazed*100).toFixed(0)}%、2ターン継続。`,
                stats: { [STAT.DEF_DOWN]: dazed },
                defaultActive: true,
                target: 'single', // Enemy target
                duration: 2,
                tickRule: 'target_turn_start',
                dispellable: false,
                debuffType: 'stat_down',
                baseChance: baseChance,
            },
            {
                id: 'kazeKyogen_stolen',
                source: 'lc',
                name: `速度170以上時 敵防御力-${(stolen*100).toFixed(0)}% (盗難/2T)`,
                description: `装備キャラの速度が170以上の場合、${(baseChance*100).toFixed(0)}%の基礎確率で攻撃を受ける敵の防御力-${(stolen*100).toFixed(0)}%、2ターン継続。`,
                stats: { [STAT.DEF_DOWN]: stolen },
                defaultActive: false,
                target: 'single', // Enemy target
                duration: 2,
                tickRule: 'target_turn_start',
                dispellable: false,
                debuffType: 'stat_down',
                baseChance: baseChance,
            }
        ];
    },
});
