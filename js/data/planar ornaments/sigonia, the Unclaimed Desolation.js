// 次元界オーナメント: 荒涼の惑星ツガンニヤ
//   2pc: 会心率 +4%。敵撃破時、会心ダメージ +4%。最大10層。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.ornament.add({
    id: 'Sigonia, the Unclaimed Desolation',
    name: '荒涼の惑星ツガンニヤ',
    type: SET_TYPE.PLANAR,

    pc2: {
        stats: { [STAT.CRIT_RATE]: 0.04 },
    },

    selfEffects: {
        pc2: [
            {
                id: 'sigonia_kill_cd',
                source: 'set',
                name: '敵撃破 1層あたり会心ダメージ+4% (最大10層)',
                description: '敵が倒された時、装備キャラの会心ダメージ+4%。最大10層。',
                stats: { [STAT.CRIT_DMG]: 0.04 },
                stackable: { max: 10, default: 10 },
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
