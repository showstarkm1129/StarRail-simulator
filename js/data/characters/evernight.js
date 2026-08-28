// 長夜月 — Wiki (Lv80・軌跡完凸前提) より反映
//
// 氷属性・記憶の運命。記憶の精霊「長夜」を召喚するアタッカー。
// 「憶質」メカニクスを持ち、蓄積量に応じて精霊スキルが強化される。
//
// データ構造 (キャストリス・ヒアンシーと同じレイアウト):
//   skills.<x>.levels:   レベル別倍率テーブル (Lv1 から)
//   skills.<x>.maxLevel: { default, withEidolon }
//   skills.<x>.description
//   memorySkill / memoryTalent は記憶の精霊持ち専用キー
//   extras: 追加能力 (昇格2/4/6)
//   eidolonsDetail: 星魂の説明

import { ELEMENT, PATH } from '../../build/constants.js';
import { STAT } from '../../build/statKeys.js';
import { addCharacterDefinition } from './_characterRegistry.js';

addCharacterDefinition({
    id: 'evernight',
    name: '長夜月',
    element: ELEMENT.ICE,
    path: PATH.REMEMBRANCE,
    rarity: 5,

    base: { atk: 543, hp: 1319, def: 582, spd: 99, aggro: 100 },
    maxEnergy: 240,

    // 常時加算ステ (軌跡ステータスボーナスのみ)
    //   軌跡ステータスボーナス: 会心率+18.7% / 最大HP+18.0% / 会心ダメージ+13.3%
    //   昇格2 暗い夜の孤独な月 の会心率+35% は selfEffects で管理 (条件付き扱い)
    traces: {
        stats: {
            [STAT.CRIT_RATE]:  0.187,
            [STAT.HP_PERCENT]: 0.18,
            [STAT.CRIT_DMG]:   0.133,
        },
        breakdown: [
            { node: '会心率強化',       stat: STAT.CRIT_RATE,  value: 0.187 },
            { node: '最大HP強化',       stat: STAT.HP_PERCENT, value: 0.18 },
            { node: '会心ダメージ強化', stat: STAT.CRIT_DMG,   value: 0.133 },
        ],
    },

    // 星魂の常時ステ加算
    //   E2: 長夜月と「長夜」の会心ダメージ+40% → 本人(と精霊)だけに乗る常時ステ → eidolons に置く
    //   E6: 「味方全体」の全属性耐性貫通+20% → チーム全体オーラ → partyEffects (e6_res_pen) のみで管理。
    //       eidolons には書かない (二重計上防止 & サポート役時に主役へオーラを届けるため)。
    //       ※ 判断基準: 自分(と召喚物)だけ=eidolons / 味方全体に配る=partyEffects
    eidolons: {
        2: {
            stats: {
                [STAT.CRIT_DMG]: 0.40,
            },
        },
    },

    eidolonsDetail: {
        1: {
            name: '眠って、長い夜にはいい夢を',
            description: '長夜月がフィールド上にいる時、フィールド上にいる敵の数が4体以上/3/2/1の場合、味方の記憶の精霊によるダメージは本来のダメージの120%/125%/130%/150%分になる。',
        },
        2: {
            name: '耳を澄まして、眠りの中のささやき',
            description: '長夜月と記憶の精霊「長夜」の会心ダメージ+40%。長夜月が「憶質」を獲得するたびに、獲得する「憶質」の数+2。必殺技を発動する時、追加で「至暗の謎」のチャージを2獲得する。',
        },
        3: {
            name: '大丈夫、悪夢はもう過ぎ去った',
            description: '戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。精霊天賦のLv.+1、最大Lv.10まで。',
            levelBoost: { skill: 2, basic: 1, memoryTalent: 1 },
        },
        4: {
            name: '起きて、アンタの明日が訪れる',
            description: '長夜月がフィールド上にいる時、味方の記憶の精霊の弱点撃破効率+25%、記憶の精霊「長夜」の弱点撃破効率はさらに+25%。',
        },
        5: {
            name: '忘れて、記憶の中のアタシを',
            description: '必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。精霊スキルのLv.+1、最大Lv.10まで。',
            levelBoost: { ult: 2, talent: 2, memorySkill: 1 },
        },
        6: {
            name: 'このまま、ずっと',
            description: '長夜月がフィールド上にいる時、味方全体の全属性耐性貫通+20%。記憶の精霊「長夜」が「露のように儚い夢」を発動した後、その回の攻撃で消費された「憶質」の30%分を獲得する。',
        },
    },

    // スキル定義
    skills: {
        basic: {
            name: '歳月はここより霞む',
            type: 'attack', target: 'single',
            element: ELEMENT.ICE,
            spGain: 1, energyGain: 20, toughness: 10, hitSplit: [1.0],
            description: '指定した敵単体に長夜月の最大HPX%分の氷属性ダメージを与える。',
            maxLevel: { default: 6, withEidolon: 7 }, // E3 で +1
            levels: [
                { hpPct: 0.25 }, { hpPct: 0.30 }, { hpPct: 0.35 },
                { hpPct: 0.40 }, { hpPct: 0.45 }, { hpPct: 0.50 },
                { hpPct: 0.55 },
            ],
        },
        skill: {
            name: '白昼は静かに去る',
            type: 'summon', target: 'all_ally',
            spCost: 1, energyGain: 30, toughness: 0, hitSplit: [],
            description: '長夜月の残りHP10%分のHPを消費して、記憶の精霊「長夜」を召喚する。味方の記憶の精霊全体の会心ダメージが長夜月の会心ダメージX%分アップする、2ターン継続。長夜がすでにフィールド上にいる場合、長夜のHPをその最大HP50%分回復する。「憶質」を2獲得、「至暗の謎」状態の場合は追加で12獲得。',
            maxLevel: { default: 10, withEidolon: 12 }, // E3 で +2
            // 精霊会心ダメバフ = 長夜月の会心ダメ × cdRatio + cdFlat
            // cdRatio: 自身の会心ダメに乗じる割合, cdFlat: レベル依存固定加算値
            levels: [
                { cdRatio: 0.12, cdFlat: 0.12 }, { cdRatio: 0.13, cdFlat: 0.13 }, { cdRatio: 0.14, cdFlat: 0.14 },
                { cdRatio: 0.15, cdFlat: 0.15 }, { cdRatio: 0.16, cdFlat: 0.16 }, { cdRatio: 0.18, cdFlat: 0.18 },
                { cdRatio: 0.19, cdFlat: 0.19 }, { cdRatio: 0.21, cdFlat: 0.21 }, { cdRatio: 0.22, cdFlat: 0.22 },
                { cdRatio: 0.24, cdFlat: 0.24 }, { cdRatio: 0.25, cdFlat: 0.25 }, { cdRatio: 0.26, cdFlat: 0.26 },
            ],
        },
        ult: {
            name: '眠れぬ世界に永き眠りを',
            type: 'attack', target: 'all',
            element: ELEMENT.ICE,
            energyCost: 240, energyGain: 5, spCost: 0, toughness: 30, hitSplit: [1.0],
            description: '記憶の精霊「長夜」を召喚。長夜は敵全体に自身の最大HPX%分の氷属性ダメージを与え、長夜月は「至暗の謎」状態に入る。「至暗の謎」中、敵全体の受けるダメージ+Y%、長夜月と長夜の与ダメージ+Z%、行動制限系デバフに抵抗できる。',
            maxLevel: { default: 10, withEidolon: 12 }, // E5 で +2
            // X% (全体ダメ), Y% (被ダメアップ), Z% (与ダメアップ)
            levels: [
                { hpPct: 1.00, dmgTakenBuff: 0.15, dmgBuff: 0.30 },
                { hpPct: 1.10, dmgTakenBuff: 0.16, dmgBuff: 0.33 },
                { hpPct: 1.20, dmgTakenBuff: 0.18, dmgBuff: 0.36 },
                { hpPct: 1.30, dmgTakenBuff: 0.19, dmgBuff: 0.39 },
                { hpPct: 1.40, dmgTakenBuff: 0.21, dmgBuff: 0.42 },
                { hpPct: 1.50, dmgTakenBuff: 0.22, dmgBuff: 0.45 },
                { hpPct: 1.62, dmgTakenBuff: 0.24, dmgBuff: 0.48 },
                { hpPct: 1.75, dmgTakenBuff: 0.26, dmgBuff: 0.52 },
                { hpPct: 1.87, dmgTakenBuff: 0.28, dmgBuff: 0.56 },
                { hpPct: 2.00, dmgTakenBuff: 0.30, dmgBuff: 0.60 },
                { hpPct: 2.10, dmgTakenBuff: 0.32, dmgBuff: 0.63 },
                { hpPct: 2.20, dmgTakenBuff: 0.33, dmgBuff: 0.66 },
            ],
        },
        talent: {
            name: '今夜、アタシと共に',
            type: 'passive',
            description: '戦闘に入るとき、記憶の精霊「長夜」を召喚する。長夜の初期速度は160、初期最大HPは長夜月の最大HP50%分。長夜月または長夜のHPが減少するたびに、長夜月と長夜の会心ダメージ+X%、2ターン継続。同時に「憶質」を2獲得。この効果はそれぞれが攻撃を受けるたびに最大で1回発動できる。',
            maxLevel: { default: 10, withEidolon: 12 }, // E5 で +2
            // X% (会心ダメージアップ)
            levels: [
                { cdBuff: 0.30 }, { cdBuff: 0.33 }, { cdBuff: 0.36 },
                { cdBuff: 0.39 }, { cdBuff: 0.42 }, { cdBuff: 0.45 },
                { cdBuff: 0.48 }, { cdBuff: 0.52 }, { cdBuff: 0.56 },
                { cdBuff: 0.60 }, { cdBuff: 0.63 }, { cdBuff: 0.66 },
            ],
        },
        memorySkill: {
            name: '雨のように降る記憶 / 露のように儚い夢',
            type: 'attack', target: 'all',
            element: ELEMENT.ICE,
            spCost: 0, energyGain: 0, toughness: 20, hitSplit: [1.0],
            description: '「雨のように降る記憶」: 敵単体に「長夜」の最大HPX%分の氷属性ダメージを与え、長夜月の「憶質」4につきさらに長夜の最大HPY%分の氷属性ダメージを与える。「露のように儚い夢」: 「憶質」16以上で発動。所持「憶質」1につきメインターゲットに長夜の最大HPZ%分、その他ターゲットにW%分の氷属性ダメージ。発動後、HPと「憶質」をすべて消費し退場。',
            maxLevel: { default: 6, withEidolon: 7 }, // E5 で +1
            // X% (単体ダメ), Y% (追加ダメ/憶質4あたり), Z% (夢・単体/憶質1あたり), W% (夢・その他/憶質1あたり)
            levels: [
                { singleHpPct: 0.25, extraHpPct: 0.050, dreamSingleHpPct: 0.060, dreamOtherHpPct: 0.030 },
                { singleHpPct: 0.30, extraHpPct: 0.060, dreamSingleHpPct: 0.072, dreamOtherHpPct: 0.036 },
                { singleHpPct: 0.35, extraHpPct: 0.070, dreamSingleHpPct: 0.084, dreamOtherHpPct: 0.042 },
                { singleHpPct: 0.40, extraHpPct: 0.080, dreamSingleHpPct: 0.096, dreamOtherHpPct: 0.048 },
                { singleHpPct: 0.45, extraHpPct: 0.090, dreamSingleHpPct: 0.108, dreamOtherHpPct: 0.054 },
                { singleHpPct: 0.50, extraHpPct: 0.100, dreamSingleHpPct: 0.120, dreamOtherHpPct: 0.060 },
                { singleHpPct: 0.55, extraHpPct: 0.110, dreamSingleHpPct: 0.132, dreamOtherHpPct: 0.066 },
            ],
        },
        memoryTalent: {
            name: '暗闇に浮かぶ孤独 / 影のように夜に寄りそう / さよなら、永遠に',
            type: 'passive',
            description: '「長夜」は行動制限系デバフに抵抗でき、攻撃される確率がアップする。長夜がフィールド上にいる時、長夜月と長夜の与ダメージ+X%。召喚された時に即座に行動する。退場する時、長夜月の速度+10%、「露のように儚い夢」で退場時は消費「憶質」1につき速度+1%（最大40まで）。',
            maxLevel: { default: 6, withEidolon: 7 }, // E3 で +1
            // X% (与ダメージアップ)
            levels: [
                { dmgBuff: 0.25 }, { dmgBuff: 0.30 }, { dmgBuff: 0.35 },
                { dmgBuff: 0.40 }, { dmgBuff: 0.45 }, { dmgBuff: 0.50 },
                { dmgBuff: 0.55 },
            ],
        },
        technique: {
            name: '冷たい雨を願って',
            type: 'support',
            description: '秘技を使用した後、次の戦闘開始時に戦闘スキルと同様の、味方の記憶の精霊全体の会心ダメージをアップする効果を獲得し、「憶質」を1獲得する。',
        },
    },

    // パーティに居る時、メイン火力キャラへ寄与する効果一覧
    partyEffects: [
        // --- 戦闘スキル ---
        {
            id: 'skill_memory_spirit_cd',
            source: 'skill',
            name: '戦闘スキル 精霊全体会心ダメバフ (白昼は静かに去る)',
            description: '味方の記憶の精霊全体の会心ダメージが (長夜月の会心ダメ × X%) + X% アップ、2ターン継続。',
            fromLevel: 'skill',
            computeStats: (lv, mult, caster) => {
                const stats = { [STAT.CRIT_DMG]: caster.derived.critDmg * mult.cdRatio + mult.cdFlat };
                Object.defineProperty(stats, '__meta', {
                    value: {
                        [STAT.CRIT_DMG]: {
                            label: '自身の会心ダメ',
                            ratio: mult.cdRatio,
                            flat: mult.cdFlat
                        }
                    },
                    enumerable: false
                });
                return stats;
            },
            defaultActive: false,
            target: 'all',
            duration: 2, tickRule: 'target_turn_end', dispellable: true,
        },
        // --- 必殺技 ---
        {
            id: 'ult_dmg_taken',
            source: 'ult',
            name: '必殺 敵の被ダメージアップ (至暗の謎)',
            description: '「至暗の謎」状態中、敵全体の受けるダメージ+Y%。',
            fromLevel: 'ult',
            computeStats: (lv, mult, caster) => ({
                [STAT.DMG_TAKEN]: mult.dmgTakenBuff,
            }),
            defaultActive: false,
            target: 'all',
            duration: 3, tickRule: 'target_turn_end', dispellable: true,
        },
        {
            id: 'ult_dmg_buff',
            source: 'ult',
            name: '必殺 与ダメージアップ (至暗の謎)',
            description: '「至暗の謎」状態中、長夜月と長夜の与ダメージ+Z%。',
            fromLevel: 'ult',
            computeStats: (lv, mult, caster) => ({
                [STAT.DMG_ALL]: mult.dmgBuff,
            }),
            defaultActive: false,
            target: 'all',
            duration: 3, tickRule: 'target_turn_end', dispellable: true,
        },
        // --- 天賦 ---
        {
            id: 'talent_cd_buff',
            source: 'talent',
            name: '天賦 会心ダメアップ (今夜、アタシと共に)',
            description: '長夜月または長夜のHPが減少するたびに、長夜月と長夜の会心ダメージ+X%、2ターン継続。',
            fromLevel: 'talent',
            computeStats: (lv, mult, caster) => ({
                [STAT.CRIT_DMG]: mult.cdBuff,
            }),
            defaultActive: false,
            target: 'all',
            duration: 2, tickRule: 'target_turn_end', dispellable: true,
        },
        // --- 精霊天賦 ---
        {
            id: 'memory_talent_dmg_buff',
            source: 'talent',
            name: '精霊天賦 与ダメアップ (暗闇に浮かぶ孤独)',
            description: '長夜がフィールド上にいる時、長夜月と長夜の与ダメージ+X%。',
            fromLevel: 'memoryTalent',
            computeStats: (lv, mult, caster) => ({
                [STAT.DMG_ALL]: mult.dmgBuff,
            }),
            defaultActive: false,
            target: 'all',
            duration: 'permanent', tickRule: 'none', dispellable: false,
        },
        // --- 精霊退場時速度バフ ---
        {
            id: 'memory_talent_exit_spd',
            source: 'talent',
            name: '精霊退場 速度アップ (さよなら、永遠に)',
            description: '退場する時、長夜月の速度+10%。「露のように儚い夢」で退場した場合、消費「憶質」1につきさらに速度+1%（最大40まで）。合計10%〜50%。',
            stats: { [STAT.SPD_PERCENT]: 0.01 },
            stackable: { max: 50, default: 10 },
            defaultActive: false,
            target: 'single',
            duration: 1, tickRule: 'target_turn_end', dispellable: true,
        },
        // --- 秘技 ---
        {
            id: 'technique_memory_spirit_cd',
            source: 'technique',
            name: '秘技 精霊会心ダメバフ (冷たい雨を願って)',
            description: '秘技使用後、次の戦闘開始時に戦闘スキルと同様の精霊全体の会心ダメージアップ効果を獲得。(長夜月の会心ダメ × X%) + X%。',
            fromLevel: 'skill',
            computeStats: (lv, mult, caster) => ({
                [STAT.CRIT_DMG]: caster.derived.critDmg * mult.cdRatio + mult.cdFlat,
            }),
            defaultActive: false,
            target: 'all',
            duration: 2, tickRule: 'target_turn_end', dispellable: true,
        },
        // --- 追加能力 ---
        {
            id: 'trace_a2_cd_buff',
            source: 'extra',
            name: '昇格2 スキル発動時 会心ダメ+15% (暗い夜の孤独な月)',
            description: 'スキルを発動する時、自身の残りHPを5%分消費し、両者の会心ダメージを15%アップする、2ターン継続。',
            stats: { [STAT.CRIT_DMG]: 0.15 },
            defaultActive: false,
            target: 'all',
            duration: 2, tickRule: 'target_turn_end', dispellable: true,
        },
        // --- 昇格6: 記憶の運命キャラ数に応じた精霊会心ダメアップ ---
        {
            id: 'trace_a6_remembrance',
            source: 'extra',
            name: '昇格6 記憶人数 精霊会心ダメバフ (夜明けに降り出す雨)',
            description: 'パーティに「記憶」の運命を歩むキャラが1名以上の時、戦闘スキル継続中に味方の記憶の精霊全体の会心ダメージアップ。(1名:+5%、2名:+15%、3名:+50%、4名以上:+65%)',
            stats: { [STAT.CRIT_DMG]: 0 }, // fallback
            stackable: {
                max: 4,
                default: 1,
                type: 'step',
                stepValues: {
                    1: { [STAT.CRIT_DMG]: 0.05 },
                    2: { [STAT.CRIT_DMG]: 0.15 },
                    3: { [STAT.CRIT_DMG]: 0.50 },
                    4: { [STAT.CRIT_DMG]: 0.65 },
                }
            },
            defaultActive: false,
            target: 'all',
            duration: 2, tickRule: 'target_turn_end', dispellable: true,
        },
        // ===== 星魂条件付き =====
        // E1: 敵数による精霊与ダメ階段 — 「本来の N% になる」表現は別枠乗算 (SEP_MULT)
        //     4体以上 ×1.20 / 3体 ×1.25 / 2体 ×1.30 / 1体 ×1.50。排他で1つだけONにする。
        //     SEP_MULT は statComputer 側で乗算結合 ((1+a)*(1+b)-1) されるので、
        //     通常の与ダメUP枠 (DMG_ALL=加算) とは独立に掛かる。
        {
            id: 'e1_spirit_dmg_4plus',
            source: 'eidolon',
            name: '敵4体以上 精霊ダメ ×1.20 (眠って、長い夜にはいい夢を・別枠乗算)',
            description: 'フィールド上の敵が4体以上の場合、味方の記憶の精霊によるダメージは本来の120%分になる (別枠乗算)。',
            stats: { [STAT.SEP_MULT]: 0.20 },
            minEidolon: 1,
            defaultActive: false,
            target: 'all',
            duration: 'permanent', tickRule: 'none', dispellable: false,
        },
        {
            id: 'e1_spirit_dmg_3',
            source: 'eidolon',
            name: '敵3体 精霊ダメ ×1.25 (眠って、長い夜にはいい夢を・別枠乗算)',
            description: 'フィールド上の敵が3体の場合、味方の記憶の精霊によるダメージは本来の125%分になる (別枠乗算)。',
            stats: { [STAT.SEP_MULT]: 0.25 },
            minEidolon: 1,
            defaultActive: false,
            target: 'all',
            duration: 'permanent', tickRule: 'none', dispellable: false,
        },
        {
            id: 'e1_spirit_dmg_2',
            source: 'eidolon',
            name: '敵2体 精霊ダメ ×1.30 (眠って、長い夜にはいい夢を・別枠乗算)',
            description: 'フィールド上の敵が2体の場合、味方の記憶の精霊によるダメージは本来の130%分になる (別枠乗算)。',
            stats: { [STAT.SEP_MULT]: 0.30 },
            minEidolon: 1,
            defaultActive: false,
            target: 'all',
            duration: 'permanent', tickRule: 'none', dispellable: false,
        },
        {
            id: 'e1_spirit_dmg_1',
            source: 'eidolon',
            name: '敵1体 精霊ダメ ×1.50 (眠って、長い夜にはいい夢を・別枠乗算)',
            description: 'フィールド上の敵が1体の場合、味方の記憶の精霊によるダメージは本来の150%分になる (別枠乗算)。',
            stats: { [STAT.SEP_MULT]: 0.50 },
            minEidolon: 1,
            defaultActive: false,
            target: 'all',
            duration: 'permanent', tickRule: 'none', dispellable: false,
        },
        {
            id: 'e6_res_pen',
            source: 'eidolon',
            name: '全属性耐性貫通+20% (このまま、ずっと)',
            description: '長夜月がフィールド上にいる時、味方全体の全属性耐性貫通+20%。',
            stats: { [STAT.RES_PEN]: 0.20 },
            minEidolon: 6,
            defaultActive: true,
            target: 'all',
            duration: 'permanent', tickRule: 'none', dispellable: false,
        },
    ],
    selfEffects: [
        {
            id: 'trace_a2_crit_rate',
            source: 'extra',
            name: '追加能力 暗い夜の孤独な月 (常時)',
            description: '長夜月と記憶の精霊「長夜」の会心率+35%。',
            stats: { [STAT.CRIT_RATE]: 0.35 },
            defaultActive: false, duration: 'permanent', tickRule: 'none', dispellable: false,
        },
    ],

    // 追加能力 (昇格2/4/6)
    extras: [
        {
            tier: 2, name: '暗い夜の孤独な月',
            description: '長夜月と記憶の精霊「長夜」の会心率+35%。スキルを発動する時、自身の残りHPを5%分消費し、両者の会心ダメージを15%アップする、2ターン継続。長夜が「露のように儚い夢」を発動した後、味方のSPを1回復する。',
        },
        {
            tier: 4, name: '蝋燭は灯り、そして消える',
            description: '戦闘開始時、長夜月はEPを70回復し、「憶質」を1獲得する。長夜月または味方の記憶の精霊がスキルを発動した時、長夜月はEPを5回復し、「憶質」を1獲得する。',
        },
        {
            tier: 6, name: '夜明けに降り出す雨',
            description: 'パーティに「記憶」の運命を歩むキャラが1/2/3/4名またはそれ以上いる場合、長夜月の戦闘スキルの継続期間中、味方の記憶の精霊全体の会心ダメージをさらに5%/15%/50%/65%アップさせる。',
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
