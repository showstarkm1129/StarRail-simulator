// 光円錐: 在るがままの我 / 壊滅 (Ver.4.4)

import { PATH } from '../../build/constants.js';
import { STAT } from '../../build/statKeys.js';
import { Registry } from '../../build/registry.js';

const ATK = [0.18, 0.21, 0.24, 0.26, 0.30];
const ENERGY_REGEN = [0.10, 0.125, 0.15, 0.175, 0.20];
const ULT_DMG_MAX = [0.72, 0.90, 1.08, 1.26, 1.44];
const PARTY_CRIT_DMG = [0.24, 0.30, 0.36, 0.42, 0.48];

Registry.lightcone.add({
    id: 'I Am As You Behold',
    name: '在るがままの我',
    path: PATH.DESTRUCTION,
    rarity: 5,
    base: { atk: 635, hp: 952, def: 463 },
    stats: ATK.map((atk, index) => ({ [STAT.ATK_PERCENT]: atk, [STAT.ENERGY_REGEN]: ENERGY_REGEN[index] })),
    hooks: () => ({}),
    selfEffects: (superimpose) => {
        const index = Math.max(0, Math.min(4, superimpose - 1));
        return [
            {
                id: 'i_am_as_you_behold_ult_dmg', source: 'lc',
                name: `EP全消費時 必殺技与ダメージ+${(ULT_DMG_MAX[index] * 100).toFixed(0)}%`,
                description: '必殺技発動時、消費EP1につき必殺技ダメージが上昇する。表示値は最大360EPを消費した場合。',
                stats: { [STAT.DMG_ULT]: ULT_DMG_MAX[index] }, defaultActive: false,
            },
        ];
    },
    partyEffects: (superimpose) => {
        const index = Math.max(0, Math.min(4, superimpose - 1));
        return [
            {
                id: 'i_am_as_you_behold_party_crit_dmg', source: 'lc', name: `「王の娯楽」味方全体 会心ダメージ+${(PARTY_CRIT_DMG[index] * 100).toFixed(0)}%`,
                description: '戦闘開始時または必殺技発動時に「王の娯楽」を獲得。効果中、味方全体の会心ダメージが上昇する。',
                stats: { [STAT.CRIT_DMG]: PARTY_CRIT_DMG[index] }, defaultActive: true,
                target: 'all', duration: 3, tickRule: 'caster_turn_end', dispellable: false,
            },
        ];
    },
});
