// 光円錐: 静かに瞬く小さな火 / 知恵 (Ver.4.4)

import { PATH } from '../../build/constants.js';
import { STAT } from '../../build/statKeys.js';
import { Registry } from '../../build/registry.js';

const CRIT_RATE = [0.18, 0.21, 0.24, 0.27, 0.30];
const PARTY_DEF_IGNORE = [0.20, 0.24, 0.28, 0.32, 0.36];
const SKILL_DMG = [0.72, 0.84, 0.96, 1.08, 1.20];

Registry.lightcone.add({
    id: 'Flickering Stars',
    name: '静かに瞬く小さな火',
    path: PATH.ERUDITION,
    rarity: 5,
    base: { atk: 635, hp: 846, def: 529 },
    stats: CRIT_RATE.map(critRate => ({ [STAT.CRIT_RATE]: critRate })),
    hooks: () => ({}),
    selfEffects: (superimpose) => {
        const index = Math.max(0, Math.min(4, superimpose - 1));
        return [
            {
                id: 'flickering_stars_skill_dmg', source: 'lc', name: `「輝く王冠」戦闘スキル与ダメージ+${(SKILL_DMG[index] * 100).toFixed(0)}%`,
                description: '味方が1ターン中に合計4以上のSPを消費すると「輝く王冠」を獲得。効果中、装備者の戦闘スキルダメージが上昇する。',
                stats: { [STAT.DMG_SKILL]: SKILL_DMG[index] }, defaultActive: false,
                duration: 3, tickRule: 'caster_turn_end', dispellable: false,
            },
        ];
    },
    partyEffects: (superimpose) => {
        const index = Math.max(0, Math.min(4, superimpose - 1));
        return [
            {
                id: 'flickering_stars_party_def_ignore', source: 'lc', name: `「輝く王冠」味方全体 防御力無視+${(PARTY_DEF_IGNORE[index] * 100).toFixed(0)}%`,
                description: '味方が1ターン中に合計4以上のSPを消費すると「輝く王冠」を獲得。効果中、味方全体が与えるダメージは敵の防御力を無視する。',
                stats: { [STAT.DEF_IGNORE]: PARTY_DEF_IGNORE[index] }, defaultActive: false,
                target: 'all', duration: 3, tickRule: 'caster_turn_end', dispellable: false,
            },
        ];
    },
});
