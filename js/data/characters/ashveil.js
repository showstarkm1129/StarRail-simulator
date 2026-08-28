import { ELEMENT, PATH } from '../../build/constants.js';
import { STAT, ELEMENT_DMG_KEYS } from '../../build/statKeys.js';
import { addCharacterDefinition } from './_characterRegistry.js';

addCharacterDefinition({
    id: 'ashveil',
    name: '不死途',
    element: ELEMENT.LIGHTNING,
    path: PATH.HUNT,
    rarity: 5,

    base: {
        atk: 776,
        hp: 853,
        def: 388,
        spd: 106,
        aggro: 75,
    },
    maxEnergy: 150,

    traces: {
        stats: {
            [STAT.CRIT_DMG]: 0.373,
            [ELEMENT_DMG_KEYS.lightning]: 0.144,
            [STAT.ATK_PERCENT]: 0.100,
        },
        breakdown: [
            { node: '会心ダメージ強化1 (Lv.1)', stat: STAT.CRIT_DMG, value: 0.053 },
            { node: 'ダメージ強化・雷1 (昇格2)', stat: ELEMENT_DMG_KEYS.lightning, value: 0.032 },
            { node: '会心ダメージ強化2 (昇格3)', stat: STAT.CRIT_DMG, value: 0.053 },
            { node: '攻撃強化1 (昇格3)', stat: STAT.ATK_PERCENT, value: 0.040 },
            { node: '会心ダメージ強化3 (昇格4)', stat: STAT.CRIT_DMG, value: 0.080 },
            { node: 'ダメージ強化・雷2 (昇格5)', stat: ELEMENT_DMG_KEYS.lightning, value: 0.048 },
            { node: '会心ダメージ強化4 (昇格5)', stat: STAT.CRIT_DMG, value: 0.080 },
            { node: '攻撃強化2 (昇格6)', stat: STAT.ATK_PERCENT, value: 0.060 },
            { node: 'ダメージ強化・雷3 (Lv.75)', stat: ELEMENT_DMG_KEYS.lightning, value: 0.064 },
            { node: '会心ダメージ強化5 (Lv.80)', stat: STAT.CRIT_DMG, value: 0.107 },
        ],
    },

    eidolons: {}, // 常時加算ステは無し。Lv上限拡張(levelBoost)は eidolonsDetail 側に記述

    eidolonsDetail: {
        1: {
            name: 'ご用心、満月の夜は外に出るな',
            description: '不死途がフィールド上にいる時、敵全体の受けるダメージ+24%。残りHPの割合が50%以下の敵が受けるダメージアップ効果は36%にアップする。',
        },
        2: {
            name: 'ノック、中に響くのは忍び笑い',
            description: '「暴食」の最大累積可能層数が18層になる。不死途が強化された天賦による追加攻撃を行った後、消費した「暴食」層数の35%が返還される。',
        },
        3: {
            name: '静かに、旧友たちの秘めた想い',
            description: '必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。',
            levelBoost: { ult: 2, basic: 1 },
        },
        4: {
            name: '銘じろ、真実に咀嚼は必要ない',
            description: '不死途が必殺技を発動する時、攻撃力+40%、3ターン継続。',
        },
        5: {
            name: '忠告を、探偵もまた犯人である',
            description: '戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。',
            levelBoost: { skill: 2, talent: 2 },
        },
        6: {
            name: '幕切れ、或いは誰もいなくなる',
            description: 'フィールド上に「餌食」が存在する時、敵全体の全属性耐性-20%。不死途が「暴食」を1層獲得するたびに、与えるダメージ+4%、最大で30層累積できる。',
        },
    },

    skills: {
        basic: {
            name: '鋭き爪よ、礼儀を授けよ',
            type: 'attack', target: 'single',
            element: ELEMENT.LIGHTNING,
            spGain: 1, energyGain: 20, toughness: 10, hitSplit: [1.0],
            description: '指定した敵単体に不死途の攻撃力X%分の雷属性ダメージを与える。',
            maxLevel: { default: 6, withEidolon: 7 },
            levels: [
                { atk: 0.50 }, { atk: 0.60 }, { atk: 0.70 },
                { atk: 0.80 }, { atk: 0.90 }, { atk: 1.00 },
                { atk: 1.10 },
            ],
        },
        skill: {
            name: '鞭と笛よ、悪獣を退けよ',
            type: 'attack', target: 'single',
            element: ELEMENT.LIGHTNING,
            spCost: 1, energyGain: 30, toughness: 20, hitSplit: [1.0],
            damageComponents: [
                {
                    id: 'skill-main', label: '通常攻撃分',
                    scalingStat: 'atk', multiplierKey: 'atk', target: 'single',
                },
                {
                    id: 'skill-prey-extra', label: '餌食への追加分',
                    scalingStat: 'atk', multiplierKey: 'extraAtk', target: 'single',
                    condition: '対象が餌食状態',
                },
            ],
            description: '指定した敵単体を「餌食」にし、不死途の攻撃力X%分の雷属性ダメージを与える。ターゲットが「餌食」の場合、さらに不死途の攻撃力Y%分の雷属性ダメージを与え、SPを1回復する。フィールド上に「餌食」が存在する時、敵全体の防御力-Z%。\nフィールド上に「餌食」が存在しない場合、不死途は即座にフィールド上にいる残りHPが最も低い敵単体を「餌食」にする。「餌食」状態は最後に付与したターゲットにのみ有効。',
            maxLevel: { default: 10, withEidolon: 12 },
            levels: [
                { atk: 1.00, extraAtk: 0.50, defDown: 0.20 },
                { atk: 1.10, extraAtk: 0.55, defDown: 0.22 },
                { atk: 1.20, extraAtk: 0.60, defDown: 0.24 },
                { atk: 1.30, extraAtk: 0.65, defDown: 0.26 },
                { atk: 1.40, extraAtk: 0.70, defDown: 0.28 },
                { atk: 1.50, extraAtk: 0.75, defDown: 0.30 },
                { atk: 1.63, extraAtk: 0.81, defDown: 0.32 },
                { atk: 1.75, extraAtk: 0.88, defDown: 0.35 },
                { atk: 1.88, extraAtk: 0.94, defDown: 0.38 },
                { atk: 2.00, extraAtk: 1.00, defDown: 0.40 },
                { atk: 2.10, extraAtk: 1.05, defDown: 0.42 },
                { atk: 2.20, extraAtk: 1.10, defDown: 0.44 },
            ],
        },
        ult: {
            name: '饗宴の幕、開けば閉じず',
            type: 'attack', target: 'single',
            element: ELEMENT.LIGHTNING,
            energyCost: 150, energyGain: 5, spCost: 0, toughness: 30, hitSplit: [1.0],
            damageComponents: [
                {
                    id: 'ult-main', label: '初回攻撃分',
                    scalingStat: 'atk', multiplierKey: 'atk', target: 'single',
                },
                {
                    id: 'ult-talent-extra', label: '天賦による追加分',
                    scalingStat: 'atk', multiplierKey: 'extraAtk', target: 'single',
                    condition: '餌食への追加攻撃',
                },
                {
                    id: 'ult-gluttony-extra', label: '暴食4層以上の追加分',
                    scalingStat: 'atk', multiplierKey: 'extraAtk', target: 'single',
                    condition: '暴食4層以上', conditionKey: 'gluttonyStacks', conditionMin: 4,
                },
            ],
            description: '指定した敵単体を「餌食」にし、不死途の攻撃力X%分の雷属性ダメージを与える。その後、「餌食」に対し、即座に強化された天賦による追加攻撃を1回行い、不死途はチャージを3獲得する。この回の強化された天賦による追加攻撃はチャージを消費しない。\nこの時、所持している「暴食」が4層以上である限り、「暴食」を4層消費し、追加で不死途の攻撃力Y%分の雷属性ダメージを1回与える。\nまた、この回の追加攻撃の発動中、ターゲットにHPが0になるダメージを与えた時、所持している「暴食」が4層未満になるまで、不死途は新しく「餌食」となった敵に、引き続きダメージを与える。フィールド上にいるすべての敵がHPが0になる攻撃を受けた後、強化された天賦による追加攻撃は即座に終了する。',
            maxLevel: { default: 10, withEidolon: 12 },
            levels: [
                { atk: 2.00, extraAtk: 1.00 },
                { atk: 2.20, extraAtk: 1.10 },
                { atk: 2.40, extraAtk: 1.20 },
                { atk: 2.60, extraAtk: 1.30 },
                { atk: 2.80, extraAtk: 1.40 },
                { atk: 3.00, extraAtk: 1.50 },
                { atk: 3.25, extraAtk: 1.63 },
                { atk: 3.50, extraAtk: 1.75 },
                { atk: 3.75, extraAtk: 1.88 },
                { atk: 4.00, extraAtk: 2.00 },
                { atk: 4.16, extraAtk: 2.08 },
                { atk: 4.32, extraAtk: 2.16 },
            ],
        },
        talent: {
            name: '深き恨み、牙で晴らそう',
            type: 'follow_up', target: 'single',
            element: ELEMENT.LIGHTNING,
            energyGain: 8, toughness: 10, hitSplit: [1.0],
            description: '不死途の初期チャージは2。最大で3まで。「餌食」が不死途以外の味方の攻撃を受けた後、不死途はEPを8回復する。その後をチャージを1消費して「餌食」に追加攻撃を行い、不死途の攻撃力X%分の雷属性ダメージを与え、「暴食」を2層獲得する。「暴食」は最大で12層まで累積できる。',
            maxLevel: { default: 10, withEidolon: 12 },
            levels: [
                { atk: 1.00 }, { atk: 1.10 }, { atk: 1.20 },
                { atk: 1.30 }, { atk: 1.40 }, { atk: 1.50 },
                { atk: 1.63 }, { atk: 1.75 }, { atk: 1.88 },
                { atk: 2.00 }, { atk: 2.10 }, { atk: 2.20 },
            ],
        },
        technique: {
            name: '憎き手よ、食らうがいい',
            type: 'support',
            description: '秘技を使用した後、一定範囲内の敵を10秒間の目眩状態にする。目眩状態の敵は味方を攻撃しない。\n目眩状態の敵を先制攻撃して戦闘に入った時、敵全体に不死途の攻撃力100%分の雷属性ダメージを与え、不死途はチャージを1獲得する。',
        },
    },

    partyEffects: [
        {
            id: 'skill_def_down_party',
            source: 'skill',
            name: '戦闘スキル 防御力ダウン',
            description: 'フィールド上に「餌食」が存在する時、敵全体の防御力-Z%。(Lv連動)',
            fromLevel: 'skill',
            computeStats: (lv, mult, caster) => ({
                [STAT.DEF_DOWN]: mult.defDown,
            }),
            defaultActive: false,
            target: 'all',
            duration: 'permanent', tickRule: 'none', dispellable: false,
        },
        {
            id: 'trace_a6_crit_dmg',
            source: 'extra',
            name: '昇格6 長の狼 (味方会心ダメージUP)',
            description: '不死途がフィールド上にいる時、味方の会心ダメージ+40%。',
            stats: { [STAT.CRIT_DMG]: 0.40 },
            defaultActive: true,
            target: 'all',
            duration: 'permanent', tickRule: 'none', dispellable: false,
        },
        {
            id: 'trace_a6_crit_dmg_fua',
            source: 'extra',
            name: '昇格6 長の狼 (味方追加攻撃会心ダメージUP)',
            description: '不死途がフィールド上にいる時、味方の追加攻撃の会心ダメージがさらに+80%。(※追加攻撃用の会心ダメージ枠未実装のため、手動で加算してください)',
            stats: {},
            defaultActive: true,
            target: 'all',
            duration: 'permanent', tickRule: 'none', dispellable: false,
        },
        {
            id: 'e1_dmg_taken_up',
            source: 'eidolon',
            name: 'E1 敵全体被ダメージアップ',
            description: '不死途がフィールド上にいる時、敵全体の受けるダメージ+24%。残りHPの割合が50%以下の敵が受けるダメージアップ効果は36%にアップする。(デフォルトは24%)',
            stats: { [STAT.DMG_TAKEN]: 0.24 },
            minEidolon: 1,
            defaultActive: true,
            target: 'all',
            duration: 'permanent', tickRule: 'none', dispellable: false,
        },
        {
            id: 'e6_res_pen',
            source: 'eidolon',
            name: 'E6 全属性耐性ダウン',
            description: 'フィールド上に「餌食」が存在する時、敵全体の全属性耐性-20%。',
            stats: { [STAT.RES_PEN]: 0.20 },
            minEidolon: 6,
            defaultActive: false,
            target: 'all',
            duration: 'permanent', tickRule: 'none', dispellable: false,
        },
    ],

    selfEffects: [
        {
            id: 'trace_a4_fua_dmg',
            source: 'extra',
            name: '昇格4 影の腕 (追加攻撃ダメージアップ)',
            description: '不死途の追加攻撃ダメージ+80%。',
            stats: { [STAT.DMG_FOLLOWUP]: 0.80 },
            defaultActive: true,
            target: 'single',
            duration: 'permanent', tickRule: 'none', dispellable: false,
        },
        {
            id: 'trace_a4_fua_dmg_gluttony',
            source: 'extra',
            name: '昇格4 影の腕 (「暴食」による追加攻撃ダメージUP)',
            description: '所持している「暴食」1層につき、さらに追加攻撃ダメージ+10%。(最大12層、E2で18層)',
            stats: { [STAT.DMG_FOLLOWUP]: 0.10 },
            stackable: { max: 18, default: 0 },
            defaultActive: false,
            target: 'single',
            duration: 'permanent', tickRule: 'none', dispellable: false,
        },
        {
            id: 'e4_ult_atk_up',
            source: 'eidolon',
            name: 'E4 必殺技 攻撃力アップ',
            description: '不死途が必殺技を発動する時、攻撃力+40%、3ターン継続。',
            stats: { [STAT.ATK_PERCENT]: 0.40 },
            minEidolon: 4,
            defaultActive: false,
            target: 'single',
            duration: 3, tickRule: 'caster_turn_end', dispellable: false,
        },
        {
            id: 'e6_gluttony_dmg_up',
            source: 'eidolon',
            name: 'E6 「暴食」による与ダメージアップ',
            description: '不死途が「暴食」を1層獲得するたびに、与えるダメージ+4%、最大で30層累積できる。',
            stats: { [STAT.DMG_ALL]: 0.04 },
            minEidolon: 6,
            stackable: { max: 30, default: 0 },
            defaultActive: false,
            target: 'single',
            duration: 'permanent', tickRule: 'none', dispellable: false,
        },
    ],

    enemyEffects: [
        {
            id: 'skill_def_down_enemy',
            source: 'skill',
            name: '戦闘スキル 防御力ダウン',
            description: 'フィールド上に「餌食」が存在する時、敵全体の防御力-Z%。',
            debuffType: 'stat_down',
            baseChance: 1.0,
            fromLevel: 'skill',
            computeStats: (lv, mult, caster) => ({
                [STAT.DEF_DOWN]: mult.defDown,
            }),
            defaultActive: false,
            target: 'all',
            duration: 'permanent', tickRule: 'none', dispellable: false,
        },
    ],

    extras: [
        {
            tier: 2, name: '罪の道',
            description: '不死途が戦闘スキル/必殺技を発動する時、「暴食」を1/2層獲得する。不死途の追加攻撃中に、敵1体がHPが0になる攻撃を受けるたびに、不死途は「暴食」を1層獲得する。',
        },
        {
            tier: 4, name: '影の腕',
            description: '不死途の追加攻撃ダメージ+80%。所持している「暴食」1層につき、さらに追加攻撃ダメージ+10%。',
        },
        {
            tier: 6, name: '長の狼',
            description: '不死途がフィールド上にいる時、味方の会心ダメージ+40%、味方の追加攻撃の会心ダメージがさらに+80%。',
        },
    ],
});
