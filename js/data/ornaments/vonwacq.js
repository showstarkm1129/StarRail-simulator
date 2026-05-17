// 次元界オーナメント: 生命のウェンワーク
//   2pc: EP回復効率 +5% / 戦闘開始時、自分の行動値を 40% 短縮
//
// 注: 遺物(洞窟遺物・次元界オーナメント)に運命制限は存在しない。
//     どのキャラでも装備可能で、効果は常に適用される。

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.ornament.add({
    id: 'vonwacq',
    name: '生命のウェンワーク',
    type: SET_TYPE.PLANAR,

    pc2: {
        stats: { [STAT.ENERGY_REGEN]: 0.05 },
        hooks: {
            onCombatStart(ctx) {
                ctx.self?.advanceAction?.(0.40);
            },
        },
    },
});
