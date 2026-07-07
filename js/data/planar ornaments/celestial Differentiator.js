// 次元界オーナメント: 天体階差機関
//   2pc: 会心ダメージ +16%。会心ダメージが120%以上の場合、初回攻撃終了まで会心率 +60%。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.ornament.add({
    id: 'Celestial Differentiator',
    name: '天体階差機関',
    type: SET_TYPE.PLANAR,

    pc2: {
        stats: { [STAT.CRIT_DMG]: 0.16 },
    },

    selfEffects: {
        pc2: [
            {
                id: 'celestial_first_attack_cr',
                source: 'set',
                name: '会心ダメージ≧120% 初回攻撃会心率+60%',
                description: '装備キャラの会心ダメージが120%以上の場合、戦闘に入った後、初回攻撃終了まで会心率+60%。初回攻撃の計算時のみ有効にする。',
                stats: { [STAT.CRIT_RATE]: 0.60 },
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
