// 次元界オーナメント: 夢を紡ぐ妖精の楽園
//   2pc: 味方数が4ではない時、1名超過/不足ごとに与ダメージ +9%/+12%。
//        超過は最大4層、不足は最大3層。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.ornament.add({
    id: 'Arcadia of Woven Dreams',
    name: '夢を紡ぐ妖精の楽園',
    type: SET_TYPE.PLANAR,

    pc2: {
        stats: {},
    },

    selfEffects: {
        pc2: [
            {
                id: 'arcadia_extra_allies_dmg',
                source: 'set',
                name: '味方超過 1名あたり自身与ダメージ+9% (最大4層)',
                description: 'フィールド上にいる現在の味方の数が4より多い時、1名超過するごとに装備キャラおよび記憶の精霊の与ダメージ+9%。',
                stats: { [STAT.DMG_ALL]: 0.09 },
                stackable: { max: 4, default: 1 },
                defaultActive: false,
                target: 'single',
                duration: 'conditional',
                tickRule: 'none',
                dispellable: false,
            },
            {
                id: 'arcadia_missing_allies_dmg',
                source: 'set',
                name: '味方不足 1名あたり自身与ダメージ+12% (最大3層)',
                description: 'フィールド上にいる現在の味方の数が4より少ない時、1名不足するごとに装備キャラおよび記憶の精霊の与ダメージ+12%。',
                stats: { [STAT.DMG_ALL]: 0.12 },
                stackable: { max: 3, default: 1 },
                defaultActive: false,
                target: 'single',
                duration: 'conditional',
                tickRule: 'none',
                dispellable: false,
            },
        ],
    },
    hooks: {},
});
