// キャストリス — Wiki (Lv80・軌跡完凸前提) より反映
//
// 量子属性・記憶の運命。記憶の精霊「死竜」を召喚するアタッカー。
//
// データ構造 (ヒアンシーと同じレイアウト):
//   skills.<x>.levels:   レベル別倍率テーブル (Lv1 から)
//   skills.<x>.maxLevel: { default, withEidolon }
//   skills.<x>.description
//   memorySkill / memoryTalent は記憶の精霊持ち専用キー
//   extras: 追加能力 (昇格2/4/6)
//   eidolonsDetail: 星魂の説明

import { ELEMENT, PATH } from '../../build/constants.js';
import { STAT } from '../../build/statKeys.js';
import { Registry } from '../../build/registry.js';

Registry.character.add({
    id: 'castorice',
    name: 'キャストリス',
    element: ELEMENT.QUANTUM,
    path: PATH.REMEMBRANCE,
    rarity: 5,

    base: { atk: 523, hp: 1629, def: 485, spd: 95, aggro: 100 },
    maxEnergy: 34000, // 新蕾の上限

    // 常時加算ステ (軌跡ステータスボーナス + 追加能力の常時系)
    //   軌跡ステータスボーナス: 会心率+18.7% / 量子属性ダメージ+14.4% / 会心ダメージ+13.3%
    traces: {
        stats: {
            [STAT.CRIT_RATE]:  0.187,
            [STAT.CRIT_DMG]:   0.133,
            dmgQuantum:        0.144, // 量子属性ダメージ+14.4%
        },
        breakdown: [
            { node: '会心率強化',         stat: STAT.CRIT_RATE,  value: 0.187 },
            { node: '会心ダメージ強化',   stat: STAT.CRIT_DMG,   value: 0.133 },
            { node: 'ダメージ強化・量子', stat: 'dmgQuantum',    value: 0.144 },
        ],
    },

    // 星魂の常時ステ加算 (E6時の量子属性耐性貫通+20%はここに登録して常時加算に反映)
    eidolons: {
        6: {
            stats: {
                [STAT.RES_PEN]: 0.20,
            }
        }
    },

    eidolonsDetail: {
        1: {
            name: '雪地の聖女、記憶を棺に閉じ込めて',
            description: '敵の残りHPが最大HP80%/50%以下の時、その敵に対する「骸爪、冥竜の抱擁」、「冥茫裂く爪痕」、「晦冥焼き払う息吹」、「幽墟奪略の晦翼」の与ダメージは本来の120%/140%になる。',
        },
        2: {
            name: '翼翅と花の冠を戴く',
            description: '記憶の精霊「死竜」を召喚した後、キャストリスは「熾意」を2層獲得する。「熾意」は最大で2層累積でき、死竜の精霊スキル「晦冥焼き払う息吹」が消費するHPの代わりとして消費できる。さらにキャストリスの行動順が100%早まり、次の強化戦闘スキル発動後、キャストリスは「新蕾」の上限30%分の「新蕾」を獲得する。',
        },
        3: {
            name: '敬虔な旅人、死境で軽やかに舞って',
            description: '必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。精霊天賦のLv.+1、最大Lv.10まで。',
            levelBoost: { ult: 2, basic: 1, memoryTalent: 1 },
        },
        4: {
            name: '哀歌を抱く安らかな眠り',
            description: 'キャストリスがフィールドにいる時、味方全体が治癒を受けた場合、回復量+20%。',
        },
        5: {
            name: '純白の新編、預言で彩られて',
            description: '戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。精霊スキルのLv.+1、最大Lv.10まで。',
            levelBoost: { skill: 2, talent: 2, memorySkill: 1 },
        },
        6: {
            name: '流年を待ち繭を破る',
            description: 'キャストリスと死竜がダメージを与える時、量子属性耐性貫通+20%。死竜は攻撃時、弱点属性を無視して敵の靭性を削ることができる。敵を弱点撃破した時、量子属性の弱点撃破効果を発動する。また、精霊天賦「幽墟奪略の晦翼」のバウンド回数+3。',
        },
    },

    // スキル定義
    skills: {
        basic: {
            name: '哀悼、死海の小波',
            type: 'attack', target: 'single',
            element: ELEMENT.QUANTUM,
            spGain: 1, energyGain: 20, toughness: 10, hitSplit: [1.0],
            description: '指定した敵単体にキャストリスの最大HPX%分の量子属性ダメージを与える。',
            maxLevel: { default: 6, withEidolon: 7 }, // E3 で +1
            levels: [
                { hpPct: 0.25 }, { hpPct: 0.30 }, { hpPct: 0.35 },
                { hpPct: 0.40 }, { hpPct: 0.45 }, { hpPct: 0.50 }, // Lv.6 推測値
                { hpPct: 0.55 }, // Lv.7 推測値
            ],
        },
        skill: {
            name: '沈黙、幽蝶の慈しみ / 骸爪、冥竜の抱擁',
            type: 'attack', target: 'all',
            element: ELEMENT.QUANTUM,
            spCost: 1, energyGain: 30, toughness: 20, hitSplit: [1.0],
            description: '味方それぞれの残りHP30％分を消費し、指定した敵単体にキャストリスの最大HPX％分の量子属性ダメージを与え、隣接する敵にキャストリスの最大HPY％分の量子属性ダメージを与える。死竜がフィールドにいる時、味方それぞれの残りHP40％分を消費し、敵全体にキャストリスの最大HPZ％分とW％分の量子属性ダメージを与える。残りHPが足りない場合残りHPが1になる。',
            maxLevel: { default: 10, withEidolon: 12 }, // E5 で +2
            levels: [
                { singleHpPct: 0.25, adjHpPct: 0.15, jointCasterHpPct: 0.15, jointDragonHpPct: 0.25 },
                { singleHpPct: 0.27, adjHpPct: 0.16, jointCasterHpPct: 0.165, jointDragonHpPct: 0.275 },
                { singleHpPct: 0.30, adjHpPct: 0.18, jointCasterHpPct: 0.18, jointDragonHpPct: 0.30 },
                { singleHpPct: 0.32, adjHpPct: 0.19, jointCasterHpPct: 0.195, jointDragonHpPct: 0.325 },
                { singleHpPct: 0.35, adjHpPct: 0.21, jointCasterHpPct: 0.21, jointDragonHpPct: 0.35 },
                { singleHpPct: 0.37, adjHpPct: 0.22, jointCasterHpPct: 0.225, jointDragonHpPct: 0.375 },
                { singleHpPct: 0.40, adjHpPct: 0.24, jointCasterHpPct: 0.243, jointDragonHpPct: 0.406 },
                { singleHpPct: 0.43, adjHpPct: 0.26, jointCasterHpPct: 0.262, jointDragonHpPct: 0.437 },
                { singleHpPct: 0.46, adjHpPct: 0.28, jointCasterHpPct: 0.281, jointDragonHpPct: 0.468 },
                { singleHpPct: 0.50, adjHpPct: 0.30, jointCasterHpPct: 0.30, jointDragonHpPct: 0.50 },
                { singleHpPct: 0.52, adjHpPct: 0.31, jointCasterHpPct: 0.315, jointDragonHpPct: 0.525 }, // Lv.11 推測値
                { singleHpPct: 0.55, adjHpPct: 0.33, jointCasterHpPct: 0.33, jointDragonHpPct: 0.55 }, // Lv.12 推測値
                { singleHpPct: 0.57, adjHpPct: 0.34, jointCasterHpPct: 0.345, jointDragonHpPct: 0.575 }, // Lv.13
            ],
        },
        ult: {
            name: '亡者の怒咆、蘇生の鐘',
            type: 'support', target: 'all_ally',
            energyCost: 34000, energyGain: 5, spCost: 0, toughness: 0, hitSplit: [],
            description: '記憶の精霊「死竜」を召喚し、その行動順を100%早める。同時に、境界「遺世 of 冥域」を展開し、敵全体の全属性耐性をX%ダウンさせる。',
            maxLevel: { default: 10, withEidolon: 12 }, // E3 で +2
            levels: [
                { resDown: 0.10 }, { resDown: 0.11 }, { resDown: 0.12 },
                { resDown: 0.13 }, { resDown: 0.14 }, { resDown: 0.15 },
                { resDown: 0.16 }, { resDown: 0.17 }, { resDown: 0.18 },
                { resDown: 0.20 },
                { resDown: 0.21 }, // Lv.11 推測値
                { resDown: 0.22 }, // Lv.12 推測値
            ],
        },
        talent: {
            name: '手のひらを伝う衰亡',
            type: 'passive',
            description: '「新蕾」の上限は全キャラのレベルに関係する。味方がHPを1失うたびに「新蕾」を1獲得。味方がHPを失った時、キャストリスと死竜の与ダメージ+X%、最大3層、3T。死竜がいる間「新蕾」を獲得できないが、他味方のHP消費が死竜への回復に変換される。「月の繭の庇護」：味方のHPが0になる時戦闘不能を遅延（1戦闘1回）。',
            maxLevel: { default: 10, withEidolon: 12 }, // E5 で +2
            levels: [
                { dmgBuff: 0.10 }, { dmgBuff: 0.11 }, { dmgBuff: 0.12 },
                { dmgBuff: 0.13 }, { dmgBuff: 0.14 }, { dmgBuff: 0.15 },
                { dmgBuff: 0.16 }, { dmgBuff: 0.17 }, { dmgBuff: 0.18 },
                { dmgBuff: 0.20 },
                { dmgBuff: 0.21 }, // Lv.11 推測値
                { dmgBuff: 0.22 }, // Lv.12 推測値
            ],
        },
        memorySkill: {
            name: '冥茫裂く爪痕 / 晦冥焼き払う息吹',
            type: 'attack', target: 'all',
            element: ELEMENT.QUANTUM,
            spCost: 0, energyGain: 0, toughness: 20, hitSplit: [1.0],
            description: '敵全体にキャストリスの最大HPX%分の量子属性ダメージを与える。または、死竜の最大HP25%分を消費し、敵全体に最大HPY%分の量子属性ダメージを与える（重複発動可能、最大Z%/W%までダメージアップ）。',
            maxLevel: { default: 6, withEidolon: 7 }, // E5 で +1
            levels: [
                { clawHpPct: 0.20, breathHpPct: 0.12, breathAmpMin: 0.14, breathAmpMax: 0.17 },
                { clawHpPct: 0.24, breathHpPct: 0.144, breathAmpMin: 0.168, breathAmpMax: 0.204 },
                { clawHpPct: 0.28, breathHpPct: 0.168, breathAmpMin: 0.196, breathAmpMax: 0.238 },
                { clawHpPct: 0.32, breathHpPct: 0.192, breathAmpMin: 0.224, breathAmpMax: 0.272 },
                { clawHpPct: 0.36, breathHpPct: 0.216, breathAmpMin: 0.252, breathAmpMax: 0.306 },
                { clawHpPct: 0.40, breathHpPct: 0.24, breathAmpMin: 0.28, breathAmpMax: 0.34 },
                { clawHpPct: 0.44, breathHpPct: 0.264, breathAmpMin: 0.308, breathAmpMax: 0.374 }, // Lv.7 推測値
                { clawHpPct: 0.48, breathHpPct: 0.288, breathAmpMin: 0.336, breathAmpMax: 0.408 }, // Lv.8
            ],
        },
        memoryTalent: {
            name: '月の繭が覆う身躯 / 静寂を揺るがす怒咆 / 幽墟奪略の晦翼',
            type: 'passive',
            description: '死竜がいる間、味方の残りHPが1を下回らなくなり代わりに死竜がHPを消費する。召喚時味方全体の与ダメージ+10%。消滅時敵全体に6回バウンド量子ダメージ（最大HPX%分）を与え、味方全体を最大HPY%+Z回復。',
            maxLevel: { default: 6, withEidolon: 7 }, // E3 で +1
            levels: [
                { wingHpPct: 0.20, wingHealHpPct: 0.03, wingHealFlat: 400 },
                { wingHpPct: 0.24, wingHealHpPct: 0.03, wingHealFlat: 480 },
                { wingHpPct: 0.28, wingHealHpPct: 0.04, wingHealFlat: 560 },
                { wingHpPct: 0.32, wingHealHpPct: 0.04, wingHealFlat: 640 },
                { wingHpPct: 0.36, wingHealHpPct: 0.05, wingHealFlat: 720 },
                { wingHpPct: 0.40, wingHealHpPct: 0.06, wingHealFlat: 800 },
                { wingHpPct: 0.44, wingHealHpPct: 0.066, wingHealFlat: 880 }, // Lv.7 推測値
            ],
        },
        technique: {
            name: '慟哭、死の兆しを贈る',
            type: 'support',
            description: '20秒間の「冥茫」状態に入る。戦闘突入時、死竜を召喚しその行動順を100%早め、境界を展開。死竜以外の味方HPを40%消費する。召喚しなかった場合新蕾上限30%を獲得する。',
        },
    },

    // パーティ効果一覧 (シミュレータバフ表示＆計算用)
    partyEffects: [
        {
            id: 'ult_res_down',
            source: 'ult',
            name: '必殺 全属性耐性ダウン (遺世の冥域)',
            description: '境界「遺世の冥域」を展開し、敵全体の全属性耐性をダウンさせる。',
            fromLevel: 'ult',
            computeStats: (lv, mult, caster) => ({
                [STAT.RES_PEN]: mult.resDown,
            }),
            defaultActive: false,
            target: 'all',
            duration: 3, tickRule: 'target_turn_end', dispellable: false,
        },
        {
            id: 'memory_talent_dmg_buff',
            source: 'talent',
            name: '精霊召喚時 与ダメアップ (静寂を揺るがす怒咆)',
            description: '「死竜」が召喚された時、味方全体の与ダメージ+10%、3ターン継続。',
            stats: { [STAT.DMG_ALL]: 0.10 },
            defaultActive: false,
            target: 'all',
            duration: 3, tickRule: 'target_turn_end', dispellable: true,
        },
        // ===== 星魂条件付き =====
        {
            id: 'e4_heal_ratio',
            source: 'eidolon',
            name: 'E4 被治癒量+20%',
            description: 'E4「哀歌を抱く安らかな眠り」: キャストリスがフィールドにいる時、味方全体が治癒を受けた場合の回復量+20%。',
            stats: { [STAT.HEAL_TAKEN]: 0.20 },
            minEidolon: 4,
            defaultActive: true,
            target: 'all',
            duration: 'permanent', tickRule: 'none', dispellable: false,
        },
    ],
    selfEffects: [
        {
            id: 'trace_hp_spd',
            source: 'extra',
            name: '追加能力 反転した炬火 (HP≧50%)',
            description: 'キャストリスの残りHPが自身の最大HP50%以上の時、自身の速度+40%',
            stats: { [STAT.SPD_PERCENT]: 0.40 },
            defaultActive: false, duration: 'permanent', tickRule: 'none', dispellable: false,
        },
    ],

    // 追加能力
    extras: [
        {
            tier: 2, name: '瓶の中の暗流',
            description: '死竜以外の味方が治癒を受けた後、治癒量の100%を「新蕾」に変換（死竜がいる場合は死竜のHPに変換）。味方それぞれの累積変換量は新蕾上限の12%を超えず、任意のユニット行動後にリセットされる。',
        },
        {
            tier: 4, name: '反転した炬火',
            description: 'キャストリスの残りHPが自身の最大HP50%以上の時、キャストリスの速度+40%。死竜が敵全体にHPが0になるダメージを与えるかそれ以上削れない時、死竜の速度+100%、1ターン継続。',
        },
        {
            tier: 6, name: '寸陰留まる西風',
            description: '死竜が「晦冥焼き払う息吹」を発動するたびに与ダメージ+30%、最大6層まで累積。ターン終了まで継続。',
        },
    ],

    hooks: {
        // onTurnStart(ctx)   {},
        // onTurnEnd(ctx)     {},
        // onAttack(ctx)      {},
        // onHit(ctx)         {},
        // onSkillUse(ctx)    {},
    },
});
