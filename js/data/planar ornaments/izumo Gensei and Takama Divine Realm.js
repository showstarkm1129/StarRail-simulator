// 次元界オーナメント: 顕世の出雲と高天の神国
//   2pc: 攻撃力 +12%。同じ運命の味方が他に存在する場合、会心率 +12%。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.ornament.add({
    id: 'Izumo Gensei and Takama Divine Realm',
    name: '顕世の出雲と高天の神国',
    type: SET_TYPE.PLANAR,

    pc2: {
        stats: { [STAT.ATK_PERCENT]: 0.12 },
    },

    selfEffects: {
        pc2: [
            {
                id: 'izumo_same_path_cr',
                source: 'set',
                name: '同運命味方あり 自身会心率+12%',
                description: '戦闘に入る時、装備キャラと同じ運命のキャラが他に存在する場合、会心率+12%。',
                stats: { [STAT.CRIT_RATE]: 0.12 },
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
