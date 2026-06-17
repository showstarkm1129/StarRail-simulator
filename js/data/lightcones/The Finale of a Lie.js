// 光円錐: 或る嘘の終幕
//
// 呑噬:
//   装備キャラの会心率+18%~30%。
//   戦闘開始時、または装備キャラが追加攻撃を累計4回発動するたびに、装備キャラに「影喰い」を付与する、3ターン継続。
//   装備キャラが「影喰い」を持つ時、攻撃力+40%~80%、敵全体の受けるダメージ+20%~30%。同系統のスキルは累積できない。

import { PATH } from '../../build/constants.js';
import { STAT } from '../../build/statKeys.js';
import { Registry } from '../../build/registry.js';

const CRIT_BY_SI = [0.18, 0.21, 0.24, 0.27, 0.30];
const ATK_BY_SI = [0.40, 0.50, 0.60, 0.70, 0.80];
const TAKEN_BY_SI = [0.20, 0.225, 0.25, 0.275, 0.30];

Registry.lightcone.add({
    id: 'aruUsoNoShuumaku',
    name: '或る嘘の終幕',
    path: PATH.HUNT,
    rarity: 5,

    base: { atk: 635, hp: 846, def: 529 },

    stats: [
        { [STAT.CRIT_RATE]: CRIT_BY_SI[0] },
        { [STAT.CRIT_RATE]: CRIT_BY_SI[1] },
        { [STAT.CRIT_RATE]: CRIT_BY_SI[2] },
        { [STAT.CRIT_RATE]: CRIT_BY_SI[3] },
        { [STAT.CRIT_RATE]: CRIT_BY_SI[4] },
    ],

    hooks: (superimpose) => ({
        // onTurnStart(ctx) {},
        // onHit(ctx) {},
        // onSkillUse(ctx) {}
    }),

    selfEffects: (superimpose) => {
        const idx = Math.max(0, Math.min(4, superimpose - 1));
        const atk = ATK_BY_SI[idx];
        return [
            {
                id: 'aruUso_kagekui_atk',
                source: 'lc',
                name: `「影喰い」攻撃力+${(atk*100).toFixed(0)}% (3T)`,
                description: `戦闘開始時、または装備キャラが追加攻撃を累計4回発動するたびに「影喰い」を付与(3T)。装備キャラが「影喰い」を持つ時、攻撃力+${(atk*100).toFixed(0)}%。`,
                stats: { [STAT.ATK_PERCENT]: atk },
                defaultActive: true,
                target: 'self',
                duration: 3,
                tickRule: 'caster_turn_end',
                dispellable: false,
            }
        ];
    },

    partyEffects: (superimpose) => {
        const idx = Math.max(0, Math.min(4, superimpose - 1));
        const taken = TAKEN_BY_SI[idx];
        return [
            {
                id: 'aruUso_kagekui_taken_party',
                source: 'lc',
                name: `「影喰い」敵全体被ダメ+${(taken*100).toFixed(1)}% (3T)`,
                description: `装備キャラが「影喰い」を持つ時、敵全体の受けるダメージ+${(taken*100).toFixed(1)}%。同系統スキルは重ねがけ不可。`,
                stats: { [STAT.DMG_TAKEN]: taken },
                defaultActive: true,
                target: 'all',
                duration: 3,
                tickRule: 'caster_turn_end',
                dispellable: false,
            }
        ];
    },

    enemyEffects: (superimpose) => {
        const idx = Math.max(0, Math.min(4, superimpose - 1));
        const taken = TAKEN_BY_SI[idx];
        return [
            {
                id: 'aruUso_kagekui_taken',
                source: 'lc',
                name: `「影喰い」敵全体被ダメ+${(taken*100).toFixed(1)}% (3T)`,
                description: `装備キャラが「影喰い」を持つ時、敵全体の受けるダメージ+${(taken*100).toFixed(1)}%。同系統スキルは重ねがけ不可。`,
                stats: { [STAT.DMG_TAKEN]: taken },
                defaultActive: true,
                target: 'all',
                duration: 3,
                tickRule: 'caster_turn_end',
                dispellable: false,
                baseChance: 1.0,
            }
        ];
    }
});
