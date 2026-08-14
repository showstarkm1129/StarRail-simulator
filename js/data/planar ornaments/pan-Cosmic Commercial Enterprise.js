// 次元界オーナメント: 汎銀河商事会社
//   2pc: 効果命中 +10%。現在の効果命中25%分、攻撃力アップ。最大 +25%。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE, RELIC_USAGE, RELIC_ATTRIBUTE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.ornament.add({
    id: 'Pan-Cosmic Commercial Enterprise',
    name: '汎銀河商事会社',
    type: SET_TYPE.PLANAR,

    tags: {
        usage: [RELIC_USAGE.OFFENSE],
        attribute: [RELIC_ATTRIBUTE.ATK],
    },

    pc2: {
        stats: { [STAT.EFFECT_HIT_RATE]: 0.10 },
    },

    selfEffects: {
        pc2: [
            {
                id: 'pan_cosmic_ehr_to_atk',
                source: 'set',
                name: '効果命中の25%分 自身攻撃力+ (最大25%)',
                description: '装備キャラの現在の効果命中25%分、攻撃力アップ。最大+25%。',
                computeStats: (_lv, _mult, stats) => ({
                    [STAT.ATK_PERCENT]: Math.min((stats?.raw?.[STAT.EFFECT_HIT_RATE] || 0) * 0.25, 0.25),
                }),
                defaultActive: true,
                target: 'single',
                duration: 'permanent',
                tickRule: 'none',
                dispellable: false,
            },
        ],
    },
    hooks: {},
});
