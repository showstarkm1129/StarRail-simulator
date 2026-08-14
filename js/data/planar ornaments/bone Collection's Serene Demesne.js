// 次元界オーナメント: 静謐な拾骨地
//   2pc: 最大HP +12%。最大HPが5,000以上の時、装備キャラと記憶の精霊の会心ダメージ +28%。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE, RELIC_USAGE, RELIC_ATTRIBUTE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.ornament.add({
    id: 'Bone Collection\'s Serene Demesne',
    name: '静謐な拾骨地',
    type: SET_TYPE.PLANAR,

    tags: {
        usage: [RELIC_USAGE.OFFENSE],
        attribute: [RELIC_ATTRIBUTE.HP, RELIC_ATTRIBUTE.CRIT_DMG],
    },

    pc2: {
        stats: { [STAT.HP_PERCENT]: 0.12 },
    },

    selfEffects: {
        pc2: [
            {
                id: 'bone_collection_hp5000_cd',
                source: 'set',
                name: 'HP≧5000 自身会心ダメージ+28%',
                description: '装備キャラの最大HPが5,000以上の時、装備キャラおよびその記憶の精霊の会心ダメージ+28%。',
                stats: { [STAT.CRIT_DMG]: 0.28 },
                defaultActive: false,
                target: 'single',
                duration: 'permanent',
                tickRule: 'none',
                dispellable: false,
            },
        ],
    },
    hooks: {},
});
