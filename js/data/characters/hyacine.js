// ヒアンシー — Wiki (Lv80・軌跡完凸前提) より反映
//
// 風属性・記憶の運命。記憶の精霊「イカルン」を召喚する回復キャラ。
// 火力よりも HP バフ・治癒・E6時の耐性貫通バフが味方への寄与となる。
//
// データ構造拡張版 (ブローニャと同じレイアウト):
//   skills.<x>.levels:   レベル別倍率テーブル (Lv1 から)
//   skills.<x>.maxLevel: { default, withEidolon }
//   skills.<x>.description
//   memorySkill / memoryTalent は記憶の精霊持ち専用キー (ヒアンシー独自)
//   extras: 追加能力 (昇格2/4/6)
//   eidolonsDetail: 星魂の説明
//
// 注意:
//   - Lv11 は Wiki 未掲載 (`%` のみ) のため Lv10/Lv12 の中間値で暫定補完。
//     正規データ取得次第差し替え推奨。
//   - 「速度>200時 HP+20%」「超過速度毎に治癒量+1%」等の条件付き効果は
//     traces に常時加算しない (条件成立を保証できないため)。

import { ELEMENT, PATH } from '../../build/constants.js';
import { STAT, ELEMENT_DMG_KEYS } from '../../build/statKeys.js';
import { Registry } from '../../build/registry.js';

Registry.character.add({
    id: 'hyacine',
    name: 'ヒアンシー',
    element: ELEMENT.WIND,
    path: PATH.REMEMBRANCE,
    rarity: 5,

    base: { atk: 388, hp: 1086, def: 630, spd: 110 },
    maxEnergy: 140,

    // 常時加算ステ (軌跡ステータスボーナス + 追加能力の常時系)
    //   軌跡ステータスボーナス: 速度+14 / 効果抵抗+18% / 最大HP+10%
    //   昇格2 微笑む暗雲      : 本人の会心率+100% (味方には及ばない)
    //   昇格4 優しい雷雨      : 本人の効果抵抗+50%
    //   昇格6 凪いだ暴風      : 速度>200 で HP+20% (条件付き → 未加算)
    traces: {
        stats: {
            [STAT.SPD_FLAT]:   14,
            [STAT.EFFECT_RES]: 0.18 + 0.50,    // 軌跡18% + 昇格4の50%
            [STAT.HP_PERCENT]: 0.10,
            [STAT.CRIT_RATE]:  1.00,           // 昇格2 本人会心率+100%
        },
        breakdown: [
            { node: '速度強化',         stat: STAT.SPD_FLAT,   value: 14 },
            { node: '効果抵抗強化(軌跡)', stat: STAT.EFFECT_RES, value: 0.18 },
            { node: 'HP強化',           stat: STAT.HP_PERCENT, value: 0.10 },
            { node: '昇格2 微笑む暗雲 (本人会心率+100%)', stat: STAT.CRIT_RATE,  value: 1.00 },
            { node: '昇格4 優しい雷雨 (本人効果抵抗+50%)', stat: STAT.EFFECT_RES, value: 0.50 },
        ],
    },

    // 星魂は常時ステ加算なし (条件付き/挙動変更のみ)
    eidolons: {},

    eidolonsDetail: {
        1: {
            name: '闇夜の灯火を守って',
            description: 'ヒアンシーが「雨上がり」状態の時、味方それぞれの最大HPアップ効果がさらに50%アップし、味方が攻撃を行った後、その味方のHPをヒアンシーの最大HP8%分回復する。',
        },
        2: {
            name: 'わたしの庭でくつろいで',
            description: '味方のHPが減った時、その味方の速度+30%、2ターン継続。',
        },
        3: {
            name: '出発！太陽へ向かう冒険',
            description: '必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。精霊スキルのLv.+1、最大Lv.10まで。',
            levelBoost: { ult: 2, basic: 1, memorySkill: 1 },
        },
        4: {
            name: 'お日様色の琥珀をあなたに',
            description: '軌跡「凪いだ暴風」が強化される。超過した速度1につき、さらにヒアンシーと「イカルン」の会心ダメージ+2%。',
        },
        5: {
            name: '海に揺らぐ赤い霞',
            description: '戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。精霊天賦のLv.+1、最大Lv.10まで。',
            levelBoost: { skill: 2, talent: 2, memoryTalent: 1 },
        },
        6: {
            name: '天空よ…願いを叶えたまえ',
            description: '「イカルン」が精霊スキルを発動した後、クリアされる累計治癒量の割合が12%になる。イカルンがフィールド上にいる時、味方全体の全属性耐性貫通+20%。',
        },
    },

    // スキル定義
    //   通常 / 戦闘スキル / 必殺 / 天賦 / 精霊スキル / 精霊天賦 / 秘技
    skills: {
        basic: {
            name: '雲を撫でるそよ風',
            type: 'attack', target: 'single',
            element: ELEMENT.WIND,
            energy: 20,
            description: '指定した敵単体にヒアンシーの最大HPX%分の風属性ダメージを与える。',
            maxLevel: { default: 6, withEidolon: 7 },   // E3 で +1
            // X% (最大HP倍率)
            levels: [
                { hpPct: 0.25 }, { hpPct: 0.30 }, { hpPct: 0.35 },
                { hpPct: 0.40 }, { hpPct: 0.45 }, { hpPct: 0.50 },
                { hpPct: 0.55 },
            ],
        },
        skill: {
            name: '降り注ぐ彩虹の愛',
            type: 'heal', target: 'all_ally',
            energy: 30,
            description: '記憶の精霊「イカルン」を召喚し、イカルン以外の味方全体のHPをヒアンシーの最大HPX%+Y回復、イカルンのHPをヒアンシーの最大HPZ%+W回復。',
            maxLevel: { default: 10, withEidolon: 12 },  // E5 で +2
            // X%+Y (全体回復), Z%+W (イカルン回復)
            levels: [
                { allyHpPct: 0.040, allyHpFlat: 40,  ikarunHpPct: 0.050, ikarunHpFlat: 50  },
                { allyHpPct: 0.045, allyHpFlat: 64,  ikarunHpPct: 0.056, ikarunHpFlat: 80  },
                { allyHpPct: 0.050, allyHpFlat: 82,  ikarunHpPct: 0.062, ikarunHpFlat: 102 },
                { allyHpPct: 0.055, allyHpFlat: 100, ikarunHpPct: 0.069, ikarunHpFlat: 125 },
                { allyHpPct: 0.060, allyHpFlat: 112, ikarunHpPct: 0.075, ikarunHpFlat: 140 },
                { allyHpPct: 0.064, allyHpFlat: 124, ikarunHpPct: 0.080, ikarunHpFlat: 155 },
                { allyHpPct: 0.068, allyHpFlat: 133, ikarunHpPct: 0.085, ikarunHpFlat: 166 },
                { allyHpPct: 0.072, allyHpFlat: 142, ikarunHpPct: 0.090, ikarunHpFlat: 177 },
                { allyHpPct: 0.076, allyHpFlat: 151, ikarunHpPct: 0.095, ikarunHpFlat: 188 },
                { allyHpPct: 0.080, allyHpFlat: 160, ikarunHpPct: 0.100, ikarunHpFlat: 200 },
                // Lv11: Wiki 未掲載 (Lv10/Lv12 の中間で暫定補完)
                { allyHpPct: 0.084, allyHpFlat: 169, ikarunHpPct: 0.105, ikarunHpFlat: 212 },
                { allyHpPct: 0.088, allyHpFlat: 178, ikarunHpPct: 0.110, ikarunHpFlat: 223 },
            ],
        },
        ult: {
            name: '晨昏に飛び込むわたしたち',
            type: 'support', target: 'all_ally',
            energy: 140,
            description: '記憶の精霊「イカルン」を召喚し回復を行い、ヒアンシーは「雨上がり」状態 (3T) に入る。雨上がり中、味方それぞれの最大HPがA%+Bアップ。',
            maxLevel: { default: 10, withEidolon: 12 },  // E3 で +2
            // X%+Y (全体回復), Z%+W (イカルン回復), A%+B (最大HPアップ)
            levels: [
                { allyHpPct: 0.050, allyHpFlat: 50,  ikarunHpPct: 0.060, ikarunHpFlat: 60,  maxHpPct: 0.150, maxHpFlat: 150 },
                { allyHpPct: 0.056, allyHpFlat: 80,  ikarunHpPct: 0.068, ikarunHpFlat: 96,  maxHpPct: 0.165, maxHpFlat: 240 },
                { allyHpPct: 0.062, allyHpFlat: 102, ikarunHpPct: 0.075, ikarunHpFlat: 123, maxHpPct: 0.180, maxHpFlat: 307 },
                { allyHpPct: 0.069, allyHpFlat: 125, ikarunHpPct: 0.082, ikarunHpFlat: 150, maxHpPct: 0.195, maxHpFlat: 375 },
                { allyHpPct: 0.075, allyHpFlat: 140, ikarunHpPct: 0.090, ikarunHpFlat: 168, maxHpPct: 0.210, maxHpFlat: 420 },
                { allyHpPct: 0.080, allyHpFlat: 155, ikarunHpPct: 0.096, ikarunHpFlat: 186, maxHpPct: 0.225, maxHpFlat: 465 },
                { allyHpPct: 0.085, allyHpFlat: 166, ikarunHpPct: 0.102, ikarunHpFlat: 199, maxHpPct: 0.244, maxHpFlat: 498 },
                { allyHpPct: 0.090, allyHpFlat: 177, ikarunHpPct: 0.108, ikarunHpFlat: 213, maxHpPct: 0.262, maxHpFlat: 532 },
                { allyHpPct: 0.095, allyHpFlat: 188, ikarunHpPct: 0.114, ikarunHpFlat: 226, maxHpPct: 0.281, maxHpFlat: 566 },
                { allyHpPct: 0.100, allyHpFlat: 200, ikarunHpPct: 0.120, ikarunHpFlat: 240, maxHpPct: 0.300, maxHpFlat: 600 },
                // Lv11: Wiki 未掲載 (Lv10/Lv12 中間で暫定補完)
                { allyHpPct: 0.105, allyHpFlat: 212, ikarunHpPct: 0.126, ikarunHpFlat: 254, maxHpPct: 0.315, maxHpFlat: 634 },
                { allyHpPct: 0.110, allyHpFlat: 223, ikarunHpPct: 0.132, ikarunHpFlat: 267, maxHpPct: 0.330, maxHpFlat: 668 },
            ],
        },
        talent: {
            name: '世界を癒やす暁の光',
            type: 'passive',
            description: 'イカルンの初期最大HPはヒアンシーの最大HP50%分。ヒアンシーまたはイカルンが治癒を行う時、イカルンの与ダメージ+X%、2T (最大3層)。',
            maxLevel: { default: 10, withEidolon: 12 },  // E5 で +2
            // X% (イカルン与ダメバフ)
            levels: [
                { ikarunDmgBuff: 0.40 }, { ikarunDmgBuff: 0.44 }, { ikarunDmgBuff: 0.48 },
                { ikarunDmgBuff: 0.52 }, { ikarunDmgBuff: 0.56 }, { ikarunDmgBuff: 0.60 },
                { ikarunDmgBuff: 0.65 }, { ikarunDmgBuff: 0.70 }, { ikarunDmgBuff: 0.75 },
                { ikarunDmgBuff: 0.80 }, { ikarunDmgBuff: 0.84 }, { ikarunDmgBuff: 0.88 },
            ],
        },
        memorySkill: {
            name: '黒雲退散！',
            type: 'attack', target: 'all',
            element: ELEMENT.WIND,
            description: '敵全体に、ヒアンシーとイカルンの本戦闘における累計治癒量のX%分の風属性ダメージを与える。発動後、累計治癒量の50%がクリア (E6で12%)。',
            maxLevel: { default: 6, withEidolon: 7 },    // E3 で +1
            // X% (累計治癒量の倍率)
            levels: [
                { healDmgRatio: 0.10 }, { healDmgRatio: 0.12 }, { healDmgRatio: 0.14 },
                { healDmgRatio: 0.16 }, { healDmgRatio: 0.18 }, { healDmgRatio: 0.20 },
                { healDmgRatio: 0.22 },
            ],
        },
        memoryTalent: {
            name: '青空と手を取り合って',
            type: 'passive',
            description: 'イカルンが他味方のHP減少を検知すると、自身の最大HP4%を消費し、減HP味方をヒアンシーの最大HPX%+Y回復。雨上がり中はヒアンシーのスキル後にイカルンが追加ターン獲得し「黒雲退散!」自動発動。',
            maxLevel: { default: 6, withEidolon: 7 },    // E5 で +1
            // X%+Y (回復量)
            levels: [
                { ikarunHealPct: 0.010, ikarunHealFlat: 10 },
                { ikarunHealPct: 0.012, ikarunHealFlat: 12 },
                { ikarunHealPct: 0.014, ikarunHealFlat: 14 },
                { ikarunHealPct: 0.016, ikarunHealFlat: 16 },
                { ikarunHealPct: 0.018, ikarunHealFlat: 18 },
                { ikarunHealPct: 0.020, ikarunHealFlat: 20 },
                { ikarunHealPct: 0.022, ikarunHealFlat: 22 },
            ],
        },
        technique: {
            name: 'お日様ぽかぽか、輝くみんな！',
            type: 'support',
            description: '次の戦闘開始時、味方全体のHPをヒアンシーの最大HP30%+600回復。さらに、味方それぞれの最大HP+20%、2T。',
            effect: { healPct: 0.30, healFlat: 600, maxHpPct: 0.20, duration: 2 },
        },
    },

    // パーティに居る時、メイン火力キャラへ寄与する効果一覧
    //
    // 火力直結のバフは少ないが、HP依存スキル持ちには HP+ が効く。
    // E6 解放時は全属性耐性貫通+20% が常時系として乗る。
    partyEffects: [
        {
            id: 'ult_max_hp',
            source: 'ult',
            name: '必殺 最大HPバフ',
            description: '必殺発動時、味方全体の最大HP +X%+Y、2T (X%/Y はヒアンシーの必殺Lv 倍率)',
            fromLevel: 'ult',
            computeStats: (lv, mult, caster) => ({
                [STAT.HP_PERCENT]: mult.maxHpPct,
                [STAT.HP_FLAT]:    mult.maxHpFlat,
            }),
            defaultActive: false,
            target: 'all',
            duration: 2,
        },
        {
            id: 'technique_max_hp',
            source: 'technique',
            name: '秘技 最大HPバフ (戦闘開始2T)',
            description: '秘技使用時、戦闘開始時に味方全体の最大HP+20%、2T',
            stats: { [STAT.HP_PERCENT]: 0.20 },
            defaultActive: false,
            target: 'all',
            duration: 2,
        },
        {
            id: 'tier6_aura',
            source: 'extra',
            name: '星魂6 全属性耐性貫通 (常時発動)',
            description: 'E6解放時、イカルンがフィールド上にいる時、味方全体の全属性耐性貫通+20% (E6未満なら OFF にしてください)',
            stats: { [STAT.RES_PEN]: 0.20 },
            defaultActive: false,
            target: 'all',
            duration: 'permanent',
        },
    ],

    // 追加能力 (昇格2/4/6)
    extras: [
        {
            tier: 2, name: '微笑む暗雲',
            description: 'ヒアンシーと「イカルン」の会心率+100%。残りHPが最大HP50%以下の味方に治癒を行う時、ヒアンシーとイカルンの治癒量+25%。',
        },
        {
            tier: 4, name: '優しい雷雨',
            description: 'ヒアンシーの効果抵抗+50%。戦闘スキルまたは必殺技を発動する時、味方それぞれのデバフを1つ解除する。',
        },
        {
            tier: 6, name: '凪いだ暴風',
            description: 'ヒアンシーの速度が200を超える時、ヒアンシーと「イカルン」の最大HP+20%。超過した速度1につき、ヒアンシーとイカルンの治癒量+1%、超過した速度は最大200までカウント。',
        },
    ],

    hooks: {
        // 必要になり次第追加
    },
});
