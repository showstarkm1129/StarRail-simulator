// 光円錐: 大地より天を目指して / 調和
//
// 効果 (新たなる旅立ち):
//   装備キャラが味方単体に戦闘スキル/必殺技を発動すると、装備キャラ EP+6.0~8.0 回復
//     (S1~S5: 6.0/6.5/7.0/7.5/8.0 — 線形補間)、スキルターゲットに「聖なる詠唱」+1層
//     (max 3 層) 3T継続。
//   「聖なる詠唱」1層につき、所持者の与ダメージ+15%~24% (S1~S5: 15/17/19/21/24 → Wiki抜け部分は線形補間)
//   装備キャラが単体スキル/ult を2回発動するたび SP+1 (hook 系)
//
// 設計判断:
//   - EP回復は装備者自己への trigger → hook 系 (本ツール対象外)
//   - 「聖なる詠唱」スタック与ダメ+% は teammate→focus partyEffect (target='single')。
//     stackable: { max: 3, default: 3 } を指定 — UI 上でユーザが層数 (1〜3) を選択可能。
//     stats は「1層あたり」の値を登録し、UI 側で × 層数 する。

import { PATH } from '../../build/constants.js';
import { STAT } from '../../build/statKeys.js';
import { Registry } from '../../build/registry.js';

// 1層あたり与ダメ+ (S1~S5)。Wiki Lv3/Lv4 抜けは線形補間。
const PER_LAYER_DMG_BY_SI = [0.15, 0.17, 0.19, 0.21, 0.24];

Registry.lightcone.add({
    id: 'A Grounded Ascent',
    name: '大地より天を目指して',
    path: PATH.HARMONY,
    rarity: 5,

    base: { atk: 476, hp: 1164, def: 529 },

    // 常時系は無し
    stats: [{}, {}, {}, {}, {}],

    hooks: (superimpose) => ({
        // onTurnStart(ctx) {},
        // onHit(ctx) {},
        // onSkillUse(ctx) {}
    }),

    partyEffects: (superimpose) => {
        const idx = Math.max(0, Math.min(4, superimpose - 1));
        const per = PER_LAYER_DMG_BY_SI[idx];
        return [
            {
                id: 'a_grounded_ascent_chorus',
                source: 'lc',
                name: `聖なる詠唱 1層あたり 与ダメ+${(per*100).toFixed(0)}%`,
                description: `装備キャラの単体スキル/必殺を受けたターゲットに「聖なる詠唱」+1層 (max3層、3T継続)、1層につき与ダメ+${(per*100).toFixed(0)}%。層数は UI で 1〜3 を選択。`,
                stats: { [STAT.DMG_ALL]: per },
                stackable: { max: 3, default: 3 },
                defaultActive: false,
                target: 'single',
                duration: 3,
                tickRule: 'target_turn_start',
                dispellable: false,
            },
        ];
    },
});
