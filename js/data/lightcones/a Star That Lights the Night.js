// 光円錐: 夜を照らす導きの星 / 知恵 (Ver.4.4)

import { PATH } from '../../build/constants.js';
import { STAT } from '../../build/statKeys.js';
import { Registry } from '../../build/registry.js';

const DEF_IGNORE = [0.32, 0.36, 0.40, 0.44, 0.48];
const PER_STACK_SUPPORT_DMG = [0.20, 0.25, 0.30, 0.35, 0.40];

Registry.lightcone.add({
    id: 'A Star That Lights the Night',
    name: '夜を照らす導きの星',
    path: PATH.ERUDITION,
    rarity: 5,
    base: { atk: 635, hp: 846, def: 529 },
    stats: DEF_IGNORE.map(defIgnore => ({ [STAT.DEF_IGNORE]: defIgnore })),
    hooks: () => ({}),
    selfEffects: (superimpose) => {
        const index = Math.max(0, Math.min(4, superimpose - 1));
        const perStack = PER_STACK_SUPPORT_DMG[index];
        return [
            {
                id: 'a_star_that_lights_the_night_ult_dmg', source: 'lc',
                name: `「出航」3層 必殺技与ダメージ+${(perStack * 300).toFixed(0)}%`,
                description: `支援スキルの発動時に「出航」を獲得。3層時、1層につき必殺技ダメージ+${(perStack * 100).toFixed(0)}%。支援スキルダメージ+は現行のダメージ枠に未対応。`,
                stats: { [STAT.DMG_ULT]: perStack }, defaultActive: false,
                stackable: { max: 3, default: 3 }, duration: 2, tickRule: 'caster_turn_end', dispellable: false,
            },
        ];
    },
});
