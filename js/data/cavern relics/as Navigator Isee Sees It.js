// 遺物セット: ナビゲーター・アイシーの見たままに
//   2pc: 攻撃力 +12%
//   4pc: 戦闘開始時と戦闘スキル発動時にスタックを獲得。
//        1層につき戦闘スキルと必殺技の与ダメージ +18%、最大3層。
//
// 注: 日本語名は公式表記未確認の仮訳。memo.txt に記録。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.relicSet.add({
    id: 'As Navigator Isee Sees It',
    name: 'ナビゲーター・アイシーの見たままに',
    type: SET_TYPE.CAVERN,

    pc2: {
        stats: { [STAT.ATK_PERCENT]: 0.12 },
    },

    pc4: {
        stats: {},
    },

    selfEffects: {
        pc4: [
            {
                id: 'navigator_stack_skill_ult_dmg',
                source: 'set',
                name: 'スタック 1層あたりスキル/必殺与ダメージ+18% (最大3層)',
                description: '戦闘開始時と戦闘スキル発動時にスタックを獲得。1層につき戦闘スキルと必殺技の与ダメージ+18%、最大3層。',
                stats: { [STAT.DMG_SKILL]: 0.18, [STAT.DMG_ULT]: 0.18 },
                stackable: { max: 3, default: 3 },
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
