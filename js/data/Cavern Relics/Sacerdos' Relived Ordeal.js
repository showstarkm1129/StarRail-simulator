// 遺物セット: 再び苦難の道を歩む司祭
//   2pc: 速度 +6%
//   4pc: 味方単体に対して戦闘スキルまたは必殺技を発動する時、
//        スキルターゲットの会心ダメージ +18%、2T継続。最大2層累積。
//
// 注意: 複数キャラが装備すると、それぞれ独立した「司祭バフ」が同じ focus に乗る。
//       例) 2人が装備して両者が focus を対象に発動 → 最大 4 層 (= 72%) 相当。
//       本ツールでは「1 サポート枠あたり最大 2 層」として stackable: { max: 2, default: 2 } で表現。
//       2 サポート枠で同セット装備時はそれぞれの枠で 2 層を設定すると正しい総量になる。
//
// 設計判断:
//   - 2pc SPD+6% は装備者の自己ステ → pc2.stats
//   - 4pc CD+18% は stackable な partyEffect (target='single' = focus)

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.relicSet.add({
    id: 'kunanShisai',
    name: '再び苦難の道を歩む司祭',
    type: SET_TYPE.CAVERN,

    pc2: {
        stats: { [STAT.SPD_PERCENT]: 0.06 },
    },

    pc4: {
        stats: {},
    },

    partyEffects: {
        pc4: [
            {
                id: 'shisai_target_cd',
                source: 'set',
                name: '単体スキル/必殺後 1層あたり ターゲット CD+18% (2T、max2層)',
                description: '装備キャラが味方単体に戦闘スキルまたは必殺技を発動した時、スキルターゲットの会心ダメージ+18%、2T継続、最大2層。focus が対象になる前提で ON。',
                stats: { [STAT.CRIT_DMG]: 0.18 },
                stackable: { max: 2, default: 2 },
                defaultActive: false,
                target: 'single',
                duration: 2,
            },
        ],
    },
});
