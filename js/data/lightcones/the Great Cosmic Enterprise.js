// 光円錐: 宇宙一の大商い！ / 知恵 (Ver.3.2)

import { PATH } from '../../build/constants.js';
import { STAT } from '../../build/statKeys.js';
import { Registry } from '../../build/registry.js';

const ATK = [0.08, 0.10, 0.12, 0.14, 0.16];
const DMG_PER_WEAKNESS = [0.04, 0.05, 0.06, 0.07, 0.08];

Registry.lightcone.add({
    id: 'The Great Cosmic Enterprise',
    name: '宇宙一の大商い！',
    path: PATH.ERUDITION,
    rarity: 4,
    base: { atk: 476, hp: 952, def: 330 },
    stats: ATK.map(atk => ({ [STAT.ATK_PERCENT]: atk })),
    hooks: () => ({}),
    selfEffects: (superimpose) => {
        const index = Math.max(0, Math.min(4, superimpose - 1));
        const perWeakness = DMG_PER_WEAKNESS[index];
        return [
            {
                id: 'the_great_cosmic_enterprise_dmg', source: 'lc', name: `敵弱点数ごとの与ダメージ+${(perWeakness * 100).toFixed(0)}%`,
                description: '敵が持つ異なる弱点属性1つにつき、装備者がその敵に与えるダメージ+X%。最大7つまで数える。',
                stats: { [STAT.DMG_ALL]: perWeakness }, defaultActive: false,
                stackable: { max: 7, default: 1 }, duration: 'conditional', dispellable: false,
            },
        ];
    },
});
