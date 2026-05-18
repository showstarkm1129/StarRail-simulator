// ブローニャ — Wiki (Lv80・軌跡完凸前提) より反映
//
// データ構造拡張版:
//   skills.<x>.levels: レベル別倍率テーブル(Lv1から)
//   skills.<x>.maxLevel: { default, withEidolon } — 無凸時 / 凸後 の上限
//   skills.<x>.description: 効果テキスト(Wikiベース)
//   extras: 追加能力(昇格2/4/6)
//   eidolonsDetail: 星魂の説明テキスト(stats とは別管理)
//
// 注: 星魂効果はすべて挙動変更(条件付きバフ、追加攻撃、Lv上限+2 等)で
//     常時ステ加算は無し → eidolons.stats は空

import { ELEMENT, PATH } from '../../build/constants.js';
import { STAT, ELEMENT_DMG_KEYS } from '../../build/statKeys.js';
import { Registry } from '../../build/registry.js';

Registry.character.add({
    id: 'bronya',
    name: 'ブローニャ',
    element: ELEMENT.WIND,
    path: PATH.HARMONY,
    rarity: 5,

    base: { atk: 582, hp: 1241, def: 533, spd: 99 },
    maxEnergy: 120,

    // 軌跡完凸時に常時加算されるステ
    //   軌跡ステータスボーナス: 風ダメ+22.4% / 会心ダメ+24% / 効果抵抗+10%
    //   追加能力 昇格6 軍勢: 与ダメ+10% (フィールド上にいる時=常時)
    traces: {
        stats: {
            [ELEMENT_DMG_KEYS.wind]: 0.224,
            [STAT.CRIT_DMG]:         0.24,
            [STAT.EFFECT_RES]:       0.10,
            [STAT.DMG_ALL]:          0.10,
        },
        // 内訳(参考表示用): 各ノードに分かれる
        breakdown: [
            { node: 'ダメージ強化・風1', stat: ELEMENT_DMG_KEYS.wind, value: 0.032 },
            { node: '会心ダメージ強化1', stat: STAT.CRIT_DMG,         value: 0.053 },
            { node: 'ダメージ強化・風2', stat: ELEMENT_DMG_KEYS.wind, value: 0.032 },
            { node: '効果抵抗強化1',     stat: STAT.EFFECT_RES,       value: 0.040 },
            { node: 'ダメージ強化・風3', stat: ELEMENT_DMG_KEYS.wind, value: 0.048 },
            { node: '会心ダメージ強化2', stat: STAT.CRIT_DMG,         value: 0.080 },
            { node: 'ダメージ強化・風4', stat: ELEMENT_DMG_KEYS.wind, value: 0.048 },
            { node: '効果抵抗強化2',     stat: STAT.EFFECT_RES,       value: 0.060 },
            { node: '会心ダメージ強化3', stat: STAT.CRIT_DMG,         value: 0.107 },
            { node: 'ダメージ強化・風5', stat: ELEMENT_DMG_KEYS.wind, value: 0.064 },
        ],
    },

    // 星魂は常時ステ加算なし
    eidolons: {},

    // 星魂の説明(stats とは別管理)
    eidolonsDetail: {
        1: {
            name: '英気を養う',
            description: '戦闘スキルを発動した時、50%の固定確率でSPを1回復する。クールタイムは1ターン。',
        },
        2: {
            name: '急行軍',
            description: '戦闘スキルを発動した時、指定された味方は行動した後に速度+30%、1ターン継続。',
        },
        3: {
            name: '一斉射撃',
            description: '必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。',
            levelBoost: { ult: 2, talent: 2 },   // Lv上限を +2
        },
        4: {
            name: '不意打ち',
            description: '他の味方が、弱点が風属性の敵に通常攻撃を行った後、ブローニャは追加攻撃を行い、その敵に通常攻撃のダメージ80%分の風属性ダメージを与える。この効果はターンが回ってくるたびに1回発動できる。',
        },
        5: {
            name: '向かう所敵なし',
            description: '戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。',
            levelBoost: { skill: 2, basic: 1 },
        },
        6: {
            name: '気勢貫天',
            description: '戦闘スキルが付与する、指定した味方の与ダメージアップ効果の継続時間+1ターン。',
        },
    },

    // スキル定義(レベル別倍率テーブル付き)
    //   maxLevel.default = 無凸時の最大Lv (E3/E5未解放)
    //   maxLevel.withEidolon = E3/E5解放時の最大Lv
    //   levels[i] = Lv(i+1) の倍率値オブジェクト
    skills: {
        basic: {
            name: '疾風の弾丸',
            type: 'attack', target: 'single',
            element: ELEMENT.WIND,
            energy: 20,
            description: '指定した敵単体にブローニャの攻撃力X%分の風属性ダメージを与える。',
            maxLevel: { default: 6, withEidolon: 7 },  // E5で+1
            // X% (攻撃力倍率)
            levels: [
                { atk: 0.50 }, { atk: 0.60 }, { atk: 0.70 },
                { atk: 0.80 }, { atk: 0.90 }, { atk: 1.00 },
                { atk: 1.10 },
            ],
        },
        skill: {
            name: '作戦再展開',
            type: 'buff', target: 'single_ally',
            energy: 30,
            description: '指定した味方単体のデバフを1つ解除し、その味方を即座に行動させ、与ダメージ+X%、1ターン継続。自身に対してこのスキルを発動した時、即時行動の効果は発動しない。',
            maxLevel: { default: 10, withEidolon: 12 },  // E5で+2
            // X% (与ダメ枠バフ)
            levels: [
                { dmgBuff: 0.33 }, { dmgBuff: 0.36 }, { dmgBuff: 0.39 },
                { dmgBuff: 0.42 }, { dmgBuff: 0.46 }, { dmgBuff: 0.49 },
                { dmgBuff: 0.53 }, { dmgBuff: 0.57 }, { dmgBuff: 0.61 },
                { dmgBuff: 0.66 }, { dmgBuff: 0.69 }, { dmgBuff: 0.72 },
            ],
        },
        ult: {
            name: 'ベロブルグ行進曲',
            type: 'buff', target: 'all_ally',
            energy: 120,
            description: '味方全体の攻撃力+X%、会心ダメージがブローニャの会心ダメージのY%+Z%アップする、2ターン継続。',
            maxLevel: { default: 10, withEidolon: 12 },  // E3で+2
            // X% (攻撃力バフ), Y% (caster.CD × Y%), Z% (CD固定値加算)
            levels: [
                { atkBuff: 0.33, cdRatio: 0.120, cdFlat: 0.120 },
                { atkBuff: 0.35, cdRatio: 0.124, cdFlat: 0.128 },
                { atkBuff: 0.37, cdRatio: 0.128, cdFlat: 0.136 },
                { atkBuff: 0.39, cdRatio: 0.132, cdFlat: 0.144 },
                { atkBuff: 0.41, cdRatio: 0.136, cdFlat: 0.152 },
                { atkBuff: 0.44, cdRatio: 0.140, cdFlat: 0.160 },
                { atkBuff: 0.46, cdRatio: 0.145, cdFlat: 0.170 },
                { atkBuff: 0.49, cdRatio: 0.150, cdFlat: 0.180 },
                { atkBuff: 0.52, cdRatio: 0.155, cdFlat: 0.190 },
                { atkBuff: 0.55, cdRatio: 0.160, cdFlat: 0.200 },
                { atkBuff: 0.57, cdRatio: 0.164, cdFlat: 0.208 },
                { atkBuff: 0.59, cdRatio: 0.168, cdFlat: 0.216 },
            ],
        },
        talent: {
            name: '先人一歩',
            type: 'passive',
            description: '通常攻撃を行った後、ブローニャの行動順がX％早まる。',
            maxLevel: { default: 10, withEidolon: 12 },  // E3で+2
            // X% (行動値短縮)
            levels: [
                { advance: 0.15 }, { advance: 0.16 }, { advance: 0.18 },
                { advance: 0.19 }, { advance: 0.21 }, { advance: 0.22 },
                { advance: 0.24 }, { advance: 0.26 }, { advance: 0.28 },
                { advance: 0.30 }, { advance: 0.31 }, { advance: 0.33 },
            ],
        },
        technique: {
            name: '旗の下で',
            type: 'support',
            description: '秘技を使用した後、次の戦闘開始時、味方全体の攻撃力+15%、2ターン継続。',
            effect: { atkBuff: 0.15, duration: 2 },
        },
    },

    // パーティに居る時、メイン火力キャラへ寄与する効果一覧
    //
    // 構造:
    //   stats:        固定値(Lv 非依存) — そのまま envBuffs に流す
    //   fromLevel + computeStats: Lv 連動。サポート枠キャラ自身の skills[fromLevel].levels[lv-1]
    //                  を mult として、computeStats(lv, mult, caster) で算出
    //                  caster = サポート枠キャラ自身の最終ステ (FinalStats)
    //   target='all'/'single': 単体スキルはメイン火力キャラが対象になった想定でのみ適用
    //   duration:     表示用(計算には不使用、説明・参考)
    partyEffects: [
        {
            id: 'aura_tier6',
            source: 'extra',
            name: '昇格6 軍勢 (常時発動)',
            description: 'ブローニャがフィールド上にいる時、味方全体に与ダメ+10%',
            stats: { [STAT.DMG_ALL]: 0.10 },
            defaultActive: true,
            target: 'all',
            duration: 'permanent',
        },
        {
            id: 'ult_atk',
            source: 'ult',
            name: '必殺 攻撃力バフ',
            description: '必殺発動時、味方全体の攻撃力+X%、2T (X%はブローニャ自身の必殺Lv に依存)',
            fromLevel: 'ult',
            computeStats: (lv, mult, caster) => ({
                [STAT.ATK_PERCENT]: mult.atkBuff,
            }),
            defaultActive: false,
            target: 'all',
            duration: 2,
        },
        {
            id: 'ult_cd',
            source: 'ult',
            name: '必殺 会心ダメ (発動者CDに連動)',
            description: '必殺発動時、味方全体の会心ダメ = (発動者ブローニャの会心ダメ × Y%) + Z%、2T',
            fromLevel: 'ult',
            computeStats: (lv, mult, caster) => ({
                [STAT.CRIT_DMG]: caster.derived.critDmg * mult.cdRatio + mult.cdFlat,
            }),
            defaultActive: false,
            target: 'all',
            duration: 2,
        },
        {
            id: 'skill_dmg',
            source: 'skill',
            name: '戦闘スキル 与ダメバフ (対象単体)',
            description: '指定した味方単体に与ダメ+X%、1T (E6で2T)',
            fromLevel: 'skill',
            computeStats: (lv, mult, caster) => ({
                [STAT.DMG_ALL]: mult.dmgBuff,
            }),
            defaultActive: false,
            target: 'single',
            duration: 1,
        },
        {
            id: 'tier4_def',
            source: 'extra',
            name: '昇格4 陣地 (戦闘開始2T)',
            description: '戦闘開始時、味方全体の防御力+20%、2T',
            stats: { [STAT.DEF_PERCENT]: 0.20 },
            defaultActive: false,
            target: 'all',
            duration: 2,
        },
        {
            id: 'technique',
            source: 'technique',
            name: '秘技 攻撃力バフ (戦闘開始2T)',
            description: '秘技使用時、戦闘開始時に味方全体の攻撃力+15%、2T',
            stats: { [STAT.ATK_PERCENT]: 0.15 },
            defaultActive: false,
            target: 'all',
            duration: 2,
        },
    ],

    // 追加能力(昇格2/4/6)
    extras: [
        {
            tier: 2, name: '号令',
            description: '通常攻撃の会心率が100%まで上がる。',
        },
        {
            tier: 4, name: '陣地',
            description: '戦闘開始時、味方全体の防御力+20%、2ターン継続。',
        },
        {
            tier: 6, name: '軍勢',
            description: 'ブローニャがフィールド上にいる時、味方全体の与ダメージ+10%。',
            // 常時アクティブ扱いとして traces.stats に組み込み済み
        },
    ],

    hooks: {
        // 必要になり次第追加
    },
});
