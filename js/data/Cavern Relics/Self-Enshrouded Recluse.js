// 遺物セット: 星の光を隠した隠者
//   2pc: 装備キャラが付与するバリアの耐久値 +10%
//   4pc: 装備キャラが付与するバリアの耐久値 +12% (※2pcとは別枠の追加)
//        装備キャラが付与したバリアを持つ味方の会心ダメージ +15%
//
// 設計判断:
//   - 2pc 効果は装備者のバリア性能のみ → 自己ステ枠 (stats なし、本ツールでは未計算)
//     現スキーマでは「バリア耐久」専用枠が無いため stats は空に。
//   - 4pc の追加バリア耐久も同様に未モデル化。
//   - 4pc の「バリア持ち味方 CD+15%」は teammate→focus partyEffect (target='all')。
//     focus が装備 teammate のバリアを受けている前提でON。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.relicSet.add({
    id: 'hoshikageInja',
    name: '星の光を隠した隠者',
    type: SET_TYPE.CAVERN,

    pc2: {
        stats: {},   // バリア耐久+10% は専用枠未対応のため未反映
    },

    pc4: {
        stats: {},   // バリア耐久+12% 追加分も未反映
    },

    partyEffects: {
        pc4: [
            {
                id: 'recluse_barrier_cd',
                source: 'set',
                name: 'バリア付与味方 CD+15% (常時発動)',
                description: '装備キャラが付与したバリアを持つ味方の会心ダメージ+15%。focus が装備 teammate のバリアを受けている前提で ON。',
                stats: { [STAT.CRIT_DMG]: 0.15 },
                defaultActive: false,
                target: 'all',
                duration: 'permanent',
            },
        ],
    },
});
