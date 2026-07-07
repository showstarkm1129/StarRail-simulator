// 遺物セット: 荒海を越える船長
//   2pc: 会心ダメージ +16%
//   4pc: 他の味方のスキルターゲットになった時「助力」を1層獲得、最大2層。
//        必殺技発動時に2層所持している場合、攻撃力 +48%、1T。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.relicSet.add({
    id: 'Wavestrider Captain',
    name: '荒海を越える船長',
    type: SET_TYPE.CAVERN,

    pc2: {
        stats: { [STAT.CRIT_DMG]: 0.16 },
    },

    pc4: {
        stats: {},
    },

    selfEffects: {
        pc4: [
            {
                id: 'wavestrider_assist2_ult_atk',
                source: 'set',
                name: '助力2層 必殺時 自身攻撃力+48% (1ターン)',
                description: '必殺技を発動する時、「助力」を2層所持している場合、すべての「助力」を消費し、攻撃力+48%、1ターン継続。',
                stats: { [STAT.ATK_PERCENT]: 0.48 },
                defaultActive: false,
                target: 'single',
                duration: 1,
                tickRule: 'target_turn_start',
                dispellable: false,
            },
        ],
    },

    hooks: {},
});
