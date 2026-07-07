// 遺物セット: 知識の海に溺れる学者
//   2pc: 会心率 +8%
//   4pc: 戦闘スキルおよび必殺技の与ダメージ +20%。必殺技後、次の戦闘スキル与ダメージ +25%。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.relicSet.add({
    id: 'Scholar Lost in Erudition',
    name: '知識の海に溺れる学者',
    type: SET_TYPE.CAVERN,

    pc2: {
        stats: { [STAT.CRIT_RATE]: 0.08 },
    },

    pc4: {
        stats: { [STAT.DMG_SKILL]: 0.20, [STAT.DMG_ULT]: 0.20 },
    },

    selfEffects: {
        pc4: [
            {
                id: 'scholar_after_ult_skill_dmg',
                source: 'set',
                name: '必殺後 次スキル与ダメ+25%',
                description: '必殺技を発動した後、次に戦闘スキルを発動する時、与ダメージがさらに+25%。次の戦闘スキル計算時のみ有効にする。',
                stats: { [STAT.DMG_SKILL]: 0.25 },
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
