// アベンチュリン — Wiki (Lv80・軌跡完凸前提) より反映
//
// 属性: 虚数 / 運命: 存護 / ★5
//
// メカニクス概要:
//   防御力参照アタッカー兼シールド役。通常攻撃・必殺技・天賦の追加攻撃は
//   すべて「防御力%」でダメージを与える。
//   ・戦闘スキル/A4: 味方全体に「堅固なチップ」バリアを付与 (防御力参照)。
//   ・天賦: 「ブラインドベット」を7獲得するたびに7段の追加攻撃を発動。
//   ・A2 レバレッジ: 防御力1600超過分100ごとに会心率+2% (最大+48%) → hooks で変換。
//   ・E2 全耐性ダウン / 必殺「動揺」会心ダメUP は火力デバフ → partyEffects にミラー。
//
// 注: 星魂効果はすべて挙動変更・条件付きバフ・Lv上限+2 等で
//     常時ステ加算は無し → eidolons.stats は空

import { ELEMENT, PATH } from '../../build/constants.js';
import { STAT, ELEMENT_DMG_KEYS } from '../../build/statKeys.js';
import { addCharacterDefinition } from './_characterRegistry.js';

addCharacterDefinition({
    id: 'aventurine',
    name: 'アベンチュリン',
    element: ELEMENT.IMAGINARY,
    path: PATH.PRESERVATION,
    rarity: 5,

    base: {
        atk: 446,
        hp: 1203,
        def: 654,
        spd: 106,
        aggro: 150,
    },
    maxEnergy: 110,

    // 軌跡完凸時に常時加算されるステ
    //   防御力+35% / 虚数ダメ+14.4% / 効果抵抗+10%
    traces: {
        stats: {
            [STAT.DEF_PERCENT]: 0.35,
            [ELEMENT_DMG_KEYS.imaginary]: 0.144,
            [STAT.EFFECT_RES]: 0.10,
        },
        // 内訳(参考表示用): 各ノードに分かれる
        breakdown: [
            { node: '防御力強化1', stat: STAT.DEF_PERCENT, value: 0.050 },
            { node: 'ダメージ強化・虚数1', stat: ELEMENT_DMG_KEYS.imaginary, value: 0.032 },
            { node: '防御力強化2', stat: STAT.DEF_PERCENT, value: 0.075 },
            { node: '効果抵抗強化1', stat: STAT.EFFECT_RES, value: 0.040 },
            { node: 'ダメージ強化・虚数2', stat: ELEMENT_DMG_KEYS.imaginary, value: 0.048 },
            { node: '防御力強化3', stat: STAT.DEF_PERCENT, value: 0.100 },
            { node: '効果抵抗強化2', stat: STAT.EFFECT_RES, value: 0.060 },
            { node: 'ダメージ強化・虚数3', stat: ELEMENT_DMG_KEYS.imaginary, value: 0.064 },
            { node: '防御力強化4', stat: STAT.DEF_PERCENT, value: 0.125 },
        ],
    },

    // 星魂は常時ステ加算なし (条件付き効果は partyEffects / selfEffects で管理)
    eidolons: {},

    // 星魂の説明(stats とは別管理)
    eidolonsDetail: {
        1: {
            name: '囚人のジレンマ',
            description: '「堅固なチップ」を持つ味方の会心ダメージ+20%。アベンチュリンが必殺技を発動した後、味方全体に戦闘スキルの150%分の「堅固なチップ」バリアを付与する。',
        },
        2: {
            name: '限定合理性',
            description: 'アベンチュリンが通常攻撃を行う時、ターゲットの全属性耐性-12%、3ターン継続。',
        },
        3: {
            name: '最高倍率',
            description: '必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.7まで。',
            levelBoost: { ult: 2, basic: 1 },
        },
        4: {
            name: '予期せぬ絞首刑',
            description: '天賦による追加攻撃を発動する前に、アベンチュリンの防御力+40%、2ターン継続。天賦による追加攻撃の段数+3。',
        },
        5: {
            name: '曖昧性忌避',
            description: '戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。',
            levelBoost: { skill: 2, talent: 2 },
        },
        6: {
            name: 'スタグハントゲーム',
            description: 'バリアを持つ自身以外の味方1名につき、アベンチュリンの与ダメージ+50%、最大+150%。',
        },
    },

    // スキル定義(レベル別倍率テーブル付き)
    //   maxLevel.default = 無凸時の最大Lv (E3/E5未解放)
    //   maxLevel.withEidolon = E3/E5解放時の最大Lv
    //   levels[i] = Lv(i+1) の値オブジェクト
    skills: {
        basic: {
            name: 'ストレートベット',
            type: 'attack', target: 'single',
            element: ELEMENT.IMAGINARY,
            spGain: 1, energyGain: 20, toughness: 10, hitSplit: [1.0],
            description: '指定した敵単体にアベンチュリンの防御力X%分の虚数属性ダメージを与える。',
            maxLevel: { default: 6, withEidolon: 7 },  // E3で+1
            // def: 防御力倍率
            levels: [
                { def: 0.50 }, { def: 0.60 }, { def: 0.70 }, { def: 0.80 },
                { def: 0.90 }, { def: 1.00 }, { def: 1.10 },
            ],
        },
        skill: {
            name: '繁栄の基石',
            type: 'buff', target: 'all_ally', shieldStat: STAT.DEF_BASE,
            spCost: 1, energyGain: 30, toughness: 0, hitSplit: [],
            description: '味方全体にアベンチュリンの防御力X%+Yの耐久値を持つ「堅固なチップ」バリアを付与する、3ターン継続。バリアが重複して付与された場合、耐久値は累積するが防御力27%+180を上限とする。',
            maxLevel: { default: 10, withEidolon: 12 },  // E5で+2
            // shieldPct: 防御力倍率, shieldFlat: 固定値
            levels: [
                { shieldPct: 0.160, shieldFlat: 80 }, { shieldPct: 0.170, shieldFlat: 128 },
                { shieldPct: 0.180, shieldFlat: 164 }, { shieldPct: 0.190, shieldFlat: 200 },
                { shieldPct: 0.200, shieldFlat: 224 }, { shieldPct: 0.208, shieldFlat: 248 },
                { shieldPct: 0.216, shieldFlat: 266 }, { shieldPct: 0.224, shieldFlat: 284 },
                { shieldPct: 0.232, shieldFlat: 302 }, { shieldPct: 0.240, shieldFlat: 320 },
                { shieldPct: 0.248, shieldFlat: 338 }, { shieldPct: 0.256, shieldFlat: 356 },
            ],
        },
        ult: {
            name: 'ロード・オブ・ルーレット',
            type: 'attack', target: 'single',
            element: ELEMENT.IMAGINARY,
            energyCost: 110, energyGain: 5, toughness: 30, hitSplit: [1.0],
            description: 'ランダムで「ブラインドベット」を1〜7獲得し、指定した敵単体を「動揺」状態にする、3ターン継続。「動揺」状態の敵に味方が命中する時、与える会心ダメージ+Y%。さらに指定した敵単体にアベンチュリンの防御力X%分の虚数属性ダメージを与える。',
            maxLevel: { default: 10, withEidolon: 12 },  // E3で+2
            // def: 防御力倍率, debuff: 「動揺」会心ダメージアップ量
            levels: [
                { def: 1.62, debuff: 0.090 }, { def: 1.72, debuff: 0.096 },
                { def: 1.83, debuff: 0.102 }, { def: 1.94, debuff: 0.108 },
                { def: 2.05, debuff: 0.114 }, { def: 2.16, debuff: 0.120 },
                { def: 2.29, debuff: 0.127 }, { def: 2.43, debuff: 0.135 },
                { def: 2.56, debuff: 0.142 }, { def: 2.70, debuff: 0.150 },
                { def: 2.80, debuff: 0.156 }, { def: 2.91, debuff: 0.162 },
            ],
        },
        talent: {
            name: '銃口の右には…',
            type: 'follow_up', target: 'bounce', bounceCount: 7,
            element: ELEMENT.IMAGINARY,
            energyGain: 7, toughness: 10, hitSplit: [1.0], // energyGain / toughness は推定値
            description: '「堅固なチップ」を持つ味方単体の効果抵抗+Z%。アベンチュリンが「ブラインドベット」を7獲得するたびに、7段の追加攻撃を発動し、各段でランダムな敵単体にアベンチュリンの防御力X%分の虚数属性ダメージを与える。',
            maxLevel: { default: 10, withEidolon: 12 },  // E5で+2
            // def: 1段あたりの防御力倍率, resPct: 効果抵抗バフ量(Z%)
            levels: [
                { def: 0.12, resPct: 0.250 }, { def: 0.13, resPct: 0.275 },
                { def: 0.15, resPct: 0.300 }, { def: 0.16, resPct: 0.325 },
                { def: 0.17, resPct: 0.350 }, { def: 0.18, resPct: 0.375 },
                { def: 0.20, resPct: 0.406 }, { def: 0.21, resPct: 0.437 },
                { def: 0.23, resPct: 0.468 }, { def: 0.25, resPct: 0.500 },
                { def: 0.26, resPct: 0.525 }, { def: 0.27, resPct: 0.550 },
            ],
        },
        technique: {
            name: '赤と黒の狭間で',
            type: 'support',
            description: '秘技を使用した後、ランダムで防御力+24%/36%/60%のいずれかを獲得する。次の戦闘開始時、味方全体の防御力を対応する値分アップさせる、3ターン継続。',
        },
    },

    partyEffects: [
        {
            id: 'talent_res',
            source: 'talent',
            name: '天賦 効果抵抗バフ',
            description: '「堅固なチップ」を持つ味方の効果抵抗アップ（常時バリアがある前提で一律付与）',
            fromLevel: 'talent',
            computeStats: (lv, mult) => ({
                [STAT.EFFECT_RES]: mult.resPct,
            }),
            defaultActive: true, target: 'all', duration: 'permanent', tickRule: 'none', dispellable: false,
        },
        {
            // enemyEffects.ult_unnerved (敵単体「動揺」: 味方の会心ダメージUP) の火力計算用ミラー。
            // 火力計算は enemyEffects を読まないため、ここ partyEffects に CRIT_DMG で載せる。
            // enemyEffects 側はシミュ用データとして別途保持 (命中率・継続等を含む)。
            id: 'ult_unnerved_party',
            source: 'ult',
            name: '必殺 動揺 (会心ダメージアップ)',
            description: '必殺技で敵を「動揺」状態にし、その敵へ味方が命中する時、与える会心ダメージ+Y%、3ターン継続。',
            fromLevel: 'ult',
            computeStats: (lv, mult) => ({
                [STAT.CRIT_DMG]: mult.debuff,
            }),
            defaultActive: false, target: 'all', duration: 3, tickRule: 'target_turn_start', dispellable: true,
        },
        {
            // enemyEffects.e2_res_down (通常攻撃時 全耐性-12%) の火力計算用ミラー。
            // 火力計算は enemyEffects を読まないため、ここ partyEffects に RES_PEN で載せる。
            id: 'e2_res_down_party',
            source: 'eidolon',
            name: '限定合理性 (通常攻撃 全耐性ダウン)',
            description: 'アベンチュリンが通常攻撃を行う時、ターゲットの全属性耐性-12%、3ターン継続。',
            stats: { [STAT.RES_PEN]: 0.12 },
            minEidolon: 2,
            defaultActive: false, target: 'all', duration: 3, tickRule: 'target_turn_start', dispellable: true,
        },
        {
            id: 'e1_crit_dmg',
            source: 'eidolon',
            name: '囚人のジレンマ (バリア時)',
            description: '「堅固なチップ」を持つ味方の会心ダメージ+20%',
            stats: { [STAT.CRIT_DMG]: 0.20 },
            minEidolon: 1,
            defaultActive: true, target: 'all', duration: 'permanent', tickRule: 'none', dispellable: false,
        },
        {
            id: 'tech_def_24',
            source: 'technique',
            name: '秘技 防御力バフ (+24%)',
            description: '秘技使用時、確率で防御力+24%',
            stats: { [STAT.DEF_PERCENT]: 0.24 },
            defaultActive: false, target: 'all', duration: 3, tickRule: 'target_turn_end', dispellable: false,
        },
        {
            id: 'tech_def_36',
            source: 'technique',
            name: '秘技 防御力バフ (+36%)',
            description: '秘技使用時、高確率で防御力+36%',
            stats: { [STAT.DEF_PERCENT]: 0.36 },
            defaultActive: false, target: 'all', duration: 3, tickRule: 'target_turn_end', dispellable: false,
        },
        {
            id: 'tech_def_60',
            source: 'technique',
            name: '秘技 防御力バフ (+60%)',
            description: '秘技使用時、低確率で防御力+60%',
            stats: { [STAT.DEF_PERCENT]: 0.60 },
            defaultActive: false, target: 'all', duration: 3, tickRule: 'target_turn_end', dispellable: false,
        },
    ],

    selfEffects: [
        {
            id: 'e4_def_buff',
            source: 'eidolon',
            name: '予期せぬ絞首刑 (追加攻撃前)',
            description: '追加攻撃を発動する前に防御力+40%',
            stats: { [STAT.DEF_PERCENT]: 0.40 },
            minEidolon: 4,
            defaultActive: false, target: 'single', duration: 2, tickRule: 'caster_turn_end', dispellable: true,
        },
        {
            id: 'e6_dmg_buff',
            source: 'eidolon',
            name: 'スタグハントゲーム',
            description: 'バリアを持つ自身以外の味方1名につき、与ダメージ+50%、最大+150%',
            stats: { [STAT.DMG_ALL]: 0.50 },
            minEidolon: 6,
            stackable: { max: 3, default: 3 },
            defaultActive: false, target: 'single', duration: 'permanent', tickRule: 'none', dispellable: false,
        },
    ],

    // enemyEffects: 将来の戦闘シミュ用データ保管庫。
    //   火力計算(限界効用逓減)に効かせたいデバフは上の partyEffects 側へミラー済み:
    //     ult_unnerved → ult_unnerved_party (CRIT_DMG)
    //     e2_res_down  → e2_res_down_party  (RES_PEN)
    enemyEffects: [
        {
            id: 'ult_unnerved',
            source: 'ult',
            name: '動揺 (必殺技)',
            description: '敵単体を「動揺」状態にする。味方の攻撃が命中する時、与える会心ダメージがアップする。',
            debuffType: 'stat_down',
            baseChance: 1.0, // base chance not specified in description, assuming 100% base chance or fixed apply
            fromLevel: 'ult',
            computeStats: (lv, mult) => ({
                [STAT.CRIT_DMG]: mult.debuff, // Treated as adding to the attacker's CRIT_DMG against this target
            }),
            defaultActive: false, target: 'single', duration: 3, tickRule: 'target_turn_start', dispellable: true,
        },
        {
            id: 'e2_res_down',
            source: 'eidolon',
            name: '限定合理性 (通常攻撃)',
            description: '通常攻撃を行う時、ターゲットの全耐性-12%',
            debuffType: 'stat_down',
            baseChance: 1.0,
            stats: { [STAT.RES_PEN]: 0.12 }, // Used RES_PEN to reduce enemy RES in damage calc
            minEidolon: 2,
            defaultActive: false, target: 'single', duration: 3, tickRule: 'target_turn_start', dispellable: true,
        },
    ],

    // 追加能力(昇格2/4/6)
    extras: [
        { tier: 2, name: 'レバレッジ', description: '防御力が1,600を超えた場合、超過分100につき会心率+2%、最大+48%。' },
        { tier: 4, name: 'ホットハンド', description: '戦闘開始時、味方全体に戦闘スキルの100%分の「堅固なチップ」を付与(3T)。' },
        { tier: 6, name: 'ビンゴ！', description: '味方の追加攻撃でブラインドベット獲得。自身の追加攻撃で味方全体にバリア付与。' },
    ],

    hooks: {
        onBuildResolved(ctx) {
            // A2 Leverage: 1600を超える防御力100につき、会心率+2%（最大48%）
            const defTotal = ctx.stats.raw.defBase * (1 + ctx.stats.raw.defPercent) + ctx.stats.raw.defFlat;
            if (defTotal > 1600) {
                const excess = defTotal - 1600;
                let crBonus = Math.floor(excess / 100) * 0.02;
                if (crBonus > 0.48) crBonus = 0.48; // Max 48%

                if (crBonus > 0) {
                    ctx.stats.add(STAT.CRIT_RATE, crBonus, 'self.A2.leverage');
                }
            }
        },

        // --- 以下、戦闘シミュレータ用のスタブ（未完成状態） ---

        // A4: 戦闘開始時、味方全体に「堅固なチップ」バリアを付与する
        onCombatStart(ctx) {
            // Stub: 実際のバリア付与処理を実装する
        },

        // A6: 自身以外の味方が追加攻撃を行った後、ブラインドベットを1獲得
        onHit(ctx) {
            // Stub: 味方の追加攻撃を検知してスタックを追加する処理
        },

        // 天賦・A6: 自身のターン時、追加攻撃の処理やバリアの付与
        onTurnEnd(ctx) {
            // Stub: ブラインドベットが7層に達した際の追加攻撃発動処理
            // Stub: 追加攻撃後のバリア付与処理
        },

        // 1凸: 必殺技発動後、味方全体にバリア付与
        onUltUse(ctx) {
            // Stub: 必殺技後のバリア付与処理
        },
    },
});
