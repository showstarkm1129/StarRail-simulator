// 次元界オーナメント: 折れた竜骨
//   2pc: 装備キャラの効果抵抗+10% / 装備キャラの効果抵抗>=30% でパーティ全体の CD+10%
//
// 設計判断:
//   - 「効果抵抗+10%」は自己ステ → pc2.stats
//   - 「効果抵抗>=30% で味方全体 CD+10%」は teammate 自身の効果抵抗条件付き →
//     partyEffects に登録、条件成立はユーザー判断 (UI チェックボックス)

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.ornament.add({
    id: 'oretaRyukotsu',
    name: '折れた竜骨',
    type: SET_TYPE.PLANAR,

    pc2: {
        stats: { [STAT.EFFECT_RES]: 0.10 },
    },

    partyEffects: {
        pc2: [
            {
                id: 'oretaRyukotsu_crit_dmg',
                source: 'set',
                name: '効果抵抗≧30% 条件 味方CD+10% (常時発動)',
                description: '装備キャラの効果抵抗が30%以上の場合、パーティ全体の会心ダメージ+10%。装備 teammate の効果抵抗が条件を満たしていればONにする。',
                stats: { [STAT.CRIT_DMG]: 0.10 },
                defaultActive: false,
                target: 'all',
                duration: 'permanent',
            },
        ],
    },
});
