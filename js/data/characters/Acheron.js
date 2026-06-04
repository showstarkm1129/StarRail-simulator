// 黄泉 (Acheron) — Wiki (Lv80・軌跡完凸前提) より反映
//
// 雷属性・虚無の運命。「残夢 (Nihility Charge)」9 層蓄積で必殺を解放する
// 必殺特化アタッカー。必殺は「啼沢斬り」×3 + 「黄泉返り」×1 の複合構造で、
// 各 啼沢斬り が敵にある「集真赤 (Crimson Knot)」を最大 3 層消去し、
// 消去層数ごとに倍率上昇 + AoE 雷ダメージ追加が発生する。
//
// === テンプレ拡張点 (黄泉実装で新設したフィールド) ===
//   skills.skill.target = 'blast'        … 単体+隣接の拡散攻撃 (template 例には無い)
//   skills.<x>.ignoreWeakness            … 弱点属性無視で靭性を削るスキル用
//   skills.ult.phases[]                  … 多段サブアクション (啼沢斬り×N + 黄泉返り×1)
//   skills.<x>.damageTypeOverride        … E6「基本/スキルを必殺扱い」用
//   resource                             … EP ではないリソース (残夢) の宣言
//   eidolons[6].damageTypeOverride       … 同上 (eidolon 段階で発動するため別経路でも保持)
//
// === 表現できない/未配線のため selfEffects で手動 ON 化した条件付き効果 ===
//   E1 デバフ敵会心率+18%            : selfEffects, defaultActive:false
//   E4 戦闘突入時 敵の必殺被ダメ+8%  : enemyEffects, defaultActive:false
//   E6 必殺技のみ RES_PEN+20%        : selfEffects, defaultActive:false (注釈で必殺計算時のみ ON)
//   A4 奈落 (虚無人数 step buff)     : selfEffects.stackable.type='step'
//   A6 雷心 (3層スタック, 3T)         : selfEffects.stackable + defaultActive:false
//
// === 未配線フック (simulator が拾わないが将来用に登録) ===
//   onAllySkillUse                    : 天賦の「他キャラスキル後 残夢+1」を表現
//   onEnemyDebuffApplied              : 同上の「敵にデバフ付与時」サブ条件
//
// 数値は HSR 公式 Wiki Lv.80 突破後の値で反映:
//   基礎HP 1125 / ATK 698 / DEF 436 / SPD 101
//   軌跡ボーナス合計: ATK% +28 / CD +24 / 雷属性ダメ +8

import { ELEMENT, PATH } from '../../build/constants.js';
import { STAT, ELEMENT_DMG_KEYS } from '../../build/statKeys.js';
import { Registry } from '../../build/registry.js';

Registry.character.add({
    id: 'acheron',
    name: '黄泉',
    element: ELEMENT.LIGHTNING,
    path: PATH.NIHILITY,
    rarity: 5,

    base: { atk: 698, hp: 1125, def: 436, spd: 101, aggro: 100 },

    // 必殺は EP ではなく「残夢」9 層で解放される。
    // simulator.js の Entity.currentEP / maxEP を流用 (Castorice の新蕾と同じ手法)。
    // resource フィールドは UI/将来拡張用のメタ宣言 (現 simulator は無視)。
    maxEnergy: 9,
    resource: {
        kind: 'nihility_charge',
        max: 9,
        displayName: '残夢',
        gainTriggers: [
            { event: 'self_skill_use', amount: 1 },
            { event: 'ally_skill_apply_debuff', amount: 1 },
            { event: 'turn_start_e2', amount: 1, minEidolon: 2 },
            { event: 'combat_start_extra2', amount: 5 },
            { event: 'technique', amount: 1 },
        ],
        triggerUltAt: 9,
    },

    // 軌跡完凸時に常時加算されるステ
    //   ATK% +28% (4+4+6+6+8) / CD +24% (5.3+8.0+10.7) / 雷ダメ +8% (3.2+4.8)
    traces: {
        stats: {
            [STAT.ATK_PERCENT]:          0.28,
            [STAT.CRIT_DMG]:             0.24,
            [ELEMENT_DMG_KEYS.lightning]: 0.08,
        },
        breakdown: [
            { node: '攻撃強化1 (Lv.1)',       stat: STAT.ATK_PERCENT,           value: 0.040 },
            { node: '会心ダメージ強化1 (昇格2)', stat: STAT.CRIT_DMG,             value: 0.053 },
            { node: '攻撃強化2 (Lv.3)',       stat: STAT.ATK_PERCENT,           value: 0.040 },
            { node: 'ダメージ強化・雷1 (Lv.3)', stat: ELEMENT_DMG_KEYS.lightning, value: 0.032 },
            { node: '攻撃強化3 (昇格4)',      stat: STAT.ATK_PERCENT,           value: 0.060 },
            { node: '会心ダメージ強化2 (昇格4)', stat: STAT.CRIT_DMG,             value: 0.080 },
            { node: '攻撃強化4 (Lv.5)',       stat: STAT.ATK_PERCENT,           value: 0.060 },
            { node: 'ダメージ強化・雷2 (昇格6)', stat: ELEMENT_DMG_KEYS.lightning, value: 0.048 },
            { node: '会心ダメージ強化3 (Lv.75)', stat: STAT.CRIT_DMG,             value: 0.107 },
            { node: '攻撃強化5 (Lv.80)',      stat: STAT.ATK_PERCENT,           value: 0.080 },
        ],
    },

    // 星魂ステ (常時加算がある段階のみ記載。条件付きは selfEffects / enemyEffects)
    //   E1: デバフ敵への会心率 +18% (条件付き → selfEffects)
    //   E2: 必要虚無人数 -1 / ターン開始時 残夢+1, 集真赤+1 (ロジック - 未配線)
    //   E3: Lv 上限 +2 (ult), +1 (basic)
    //   E4: 戦闘に入った敵が必殺被ダメ+8% (enemyEffects)
    //   E5: Lv 上限 +2 (skill, talent)
    //   E6: 必殺 RES_PEN+20% / 通常・スキル→必殺扱い (条件 → selfEffects)
    eidolons: {},

    eidolonsDetail: {
        1: {
            name: '高天寥落、真言始まる',
            description: 'デバフ状態の敵にダメージを与える時、会心率+18%。',
        },
        2: {
            name: '雷霆静まり、秋風止む',
            description: '軌跡「奈落」の効果の最大値に達するために必要な「虚無」の運命を歩むキャラクターの数-1名。自身のターンが回ってきた時、「残夢」を1層獲得し、「集真赤」が最も多い敵に「集真赤」を1層付与する。',
        },
        3: {
            name: '永蟄を脅かす寒風',
            description: '必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。',
            levelBoost: { ult: 2, basic: 1 },
        },
        4: {
            name: '鏡中を照らす永焔',
            description: '戦闘に入った敵は、必殺技被ダメージアップ状態になり、受ける必殺技のダメージ+8%。',
        },
        5: {
            name: '盤石崩落、千身漂落',
            description: '戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。',
            levelBoost: { skill: 2, talent: 2 },
        },
        6: {
            name: '束縛を解く災い',
            description: '黄泉が与える必殺技ダメージの全耐性貫通+20%。通常攻撃ダメージ、戦闘スキルダメージが同時に必殺技ダメージと見なされ、弱点属性を無視して敵の靭性を削る。敵を弱点撃破した時、雷属性の弱点撃破効果を触発する。',
            // ダメージ種別オーバーライド (将来 simulator が参照する想定)
            damageTypeOverride: { basic: 'ult', skill: 'ult' },
        },
    },

    // スキル定義
    //   basic / skill / ult / talent / technique
    //   maxLevel: { default, withEidolon }   E3/E5 解放時の上限
    //   levels[i]: Lv(i+1) の倍率
    skills: {
        basic: {
            name: '三途の枯木',
            type: 'attack', target: 'single',
            element: ELEMENT.LIGHTNING,
            spGain: 1, energyGain: 20, toughness: 10, hitSplit: [1.0],
            description: '指定した敵単体に黄泉の攻撃力X%分の雷属性ダメージを与える。',
            maxLevel: { default: 6, withEidolon: 7 }, // E3 で +1
            // X% (攻撃力倍率)
            levels: [
                { atk: 0.50 }, { atk: 0.60 }, { atk: 0.70 },
                { atk: 0.80 }, { atk: 0.90 }, { atk: 1.00 },
                { atk: 1.10 },
            ],
        },
        skill: {
            name: '八雷渡り',
            type: 'attack',
            target: 'blast', // [拡散攻撃] 単体+隣接 (template 例にない新 enum)
            element: ELEMENT.LIGHTNING,
            spCost: 1, energyGain: 30, toughness: 20, hitSplit: [1.0],
            description: '「残夢」を1層獲得する。敵単体に「集真赤」を1層付与し、黄泉の攻撃力X%分の雷属性ダメージを与え、隣接する敵に黄泉の攻撃力Y%分の雷属性ダメージを与える。',
            maxLevel: { default: 10, withEidolon: 12 }, // E5 で +2
            // X% (単体), Y% (隣接)
            levels: [
                { atk: 0.80, adj: 0.30 }, { atk: 0.88, adj: 0.33 }, { atk: 0.96, adj: 0.36 },
                { atk: 1.04, adj: 0.39 }, { atk: 1.12, adj: 0.42 }, { atk: 1.20, adj: 0.45 },
                { atk: 1.30, adj: 0.48 }, { atk: 1.40, adj: 0.52 }, { atk: 1.50, adj: 0.56 },
                { atk: 1.60, adj: 0.60 }, { atk: 1.68, adj: 0.63 }, { atk: 1.76, adj: 0.66 },
            ],
        },
        ult: {
            name: '残夢染める繚乱の一太刀',
            type: 'attack', target: 'all',
            element: ELEMENT.LIGHTNING,
            energyCost: 9, // 残夢 9 層消費 (= maxEnergy)
            energyGain: 0, spCost: 0, toughness: 60, hitSplit: [1.0],
            description: '「啼沢斬り」を3回、「黄泉返り」を1回の順で発動。指定単体に最大X%、その他に最大Y%。発動中、敵に「集真赤」を付与できない。',
            ignoreWeakness: true, // 弱点属性無視で靭性を削る (新フィールド)
            maxLevel: { default: 10, withEidolon: 12 }, // E3 で +2
            // 「最大ダメージ倍率」= 啼沢×3 + 黄泉返り の合計理論値
            //   singleMax       : 単体合計倍率の理論最大値 (X%)
            //   otherMax        : 単体以外への合計倍率の理論最大値 (Y%)
            //   slashSingle     : 啼沢斬り 単体倍率 (Z%) — 各回 atk×Z
            //   slashAoe        : 集真赤 1 層消去で発生する敵全体ダメ (x%)
            //   slashAmp        : 集真赤 1 層消去ごとに加算されるダメ倍率 (y%, 最大3層)
            //   ouraReturn      : 黄泉返り 敵全体ダメ (z%)
            levels: [
                { singleMax: 2.23, otherMax: 1.80, slashSingle: 0.144, slashAoe: 0.090, slashAmp: 0.360, ouraReturn: 0.72 },
                { singleMax: 2.38, otherMax: 1.92, slashSingle: 0.153, slashAoe: 0.096, slashAmp: 0.384, ouraReturn: 0.76 },
                { singleMax: 2.52, otherMax: 2.04, slashSingle: 0.163, slashAoe: 0.102, slashAmp: 0.408, ouraReturn: 0.81 },
                { singleMax: 2.67, otherMax: 2.16, slashSingle: 0.172, slashAoe: 0.108, slashAmp: 0.432, ouraReturn: 0.86 },
                { singleMax: 2.82, otherMax: 2.28, slashSingle: 0.182, slashAoe: 0.114, slashAmp: 0.456, ouraReturn: 0.91 },
                { singleMax: 2.97, otherMax: 2.40, slashSingle: 0.192, slashAoe: 0.120, slashAmp: 0.480, ouraReturn: 0.96 },
                { singleMax: 3.16, otherMax: 2.55, slashSingle: 0.204, slashAoe: 0.127, slashAmp: 0.510, ouraReturn: 1.02 },
                { singleMax: 3.34, otherMax: 2.70, slashSingle: 0.216, slashAoe: 0.135, slashAmp: 0.540, ouraReturn: 1.08 },
                { singleMax: 3.53, otherMax: 2.85, slashSingle: 0.228, slashAoe: 0.142, slashAmp: 0.570, ouraReturn: 1.14 },
                { singleMax: 3.72, otherMax: 3.00, slashSingle: 0.240, slashAoe: 0.150, slashAmp: 0.600, ouraReturn: 1.20 },
                { singleMax: 3.86, otherMax: 3.12, slashSingle: 0.249, slashAoe: 0.156, slashAmp: 0.624, ouraReturn: 1.24 },
                { singleMax: 4.01, otherMax: 3.24, slashSingle: 0.259, slashAoe: 0.162, slashAmp: 0.648, ouraReturn: 1.29 },
            ],
            // 多段構造 (将来 simulator が読む想定の新 schema)
            phases: [
                {
                    id: 'slash',
                    name: '啼沢斬り',
                    target: 'single',
                    count: 3,
                    multKey: 'slashSingle',
                    onConsumeKnot: {
                        aoeKey: 'slashAoe',          // 1 層消去で敵全体に slashAoe% AoE
                        ampPerStackKey: 'slashAmp',  // 1 層消去ごとに mult +slashAmp% (最大3層)
                        maxConsume: 3,
                    },
                },
                {
                    id: 'ouraReturn',
                    name: '黄泉返り',
                    target: 'all',
                    count: 1,
                    multKey: 'ouraReturn',
                    clearAllKnots: true,
                    // E6「雷心」追加6ヒット (各 25% ランダム単体 雷)
                    bonusHitsWithExtra: {
                        tier: 6,           // A6 開放時
                        count: 6,
                        atkMult: 0.25,
                        target: 'random_single',
                        countedAs: 'ult',
                    },
                },
            ],
        },
        talent: {
            name: '紅葉に時雨、万里の空',
            type: 'passive',
            description: '「残夢」が9層に達すると必殺技を発動できる。必殺発動中は弱点属性を無視して敵の靭性を削り、敵全体の全耐性-X%を必殺終了まで継続。任意のユニットがスキル発動時に敵にデバフを付与すると、黄泉は「残夢」を1層獲得し、該当敵に「集真赤」を1層付与 (スキル毎1回)。複数敵デバフ時は「集真赤」最多の敵に付与。フィールド上の敵退場/撃破時、その「集真赤」は最多の敵に引き継ぐ。',
            maxLevel: { default: 10, withEidolon: 12 }, // E5 で +2
            // X% (敵全耐性ダウン)
            levels: [
                { resDown: 0.10 }, { resDown: 0.11 }, { resDown: 0.12 },
                { resDown: 0.13 }, { resDown: 0.14 }, { resDown: 0.15 },
                { resDown: 0.16 }, { resDown: 0.17 }, { resDown: 0.18 },
                { resDown: 0.20 }, { resDown: 0.21 }, { resDown: 0.22 },
            ],
        },
        technique: {
            name: '四相断我',
            type: 'support',
            description: '各ウェーブ開始時、「四相断我」を獲得し、敵全体に攻撃力200%分の雷属性ダメージ、弱点属性を無視して靭性を削る。「四相断我」: 黄泉が必殺発動後、「残夢」1層 + ランダム敵に「集真赤」1層付与。通常エネミー攻撃時は戦闘に入らず即撃破。命中失敗時は秘技ポイント消費なし。A2 開放後は max 3 層蓄積可能。',
            ignoreWeakness: true,
            effect: { atkMult: 2.00, maxStacks: 1, maxStacksWithExtra2: 3 },
        },
    },

    // パーティに居る時、メイン火力キャラへ寄与する効果一覧
    //
    // 黄泉は基本的にアタッカーで他キャラへのバフは少ない。
    // 唯一の対外効果は「天賦の必殺中・敵全耐性-X%」 → RES_PEN として表現。
    partyEffects: [
        {
            id: 'talent_all_res_down',
            source: 'talent',
            name: '天賦 全耐性ダウン (必殺発動中)',
            description: '必殺発動中、敵全体の全耐性-X%。必殺終了まで継続 (Lv連動)。',
            fromLevel: 'talent',
            computeStats: (lv, mult, caster) => ({
                [STAT.RES_PEN]: mult.resDown,
            }),
            defaultActive: false,
            target: 'all',
            duration: 1, tickRule: 'target_turn_end', dispellable: false,
        },
        {
            // enemyEffects.e4_ult_taken_up の火力計算用ミラー。
            // 火力計算は enemyEffects を読まないため partyEffects に DMG_TAKEN で併載する。
            // 必殺被ダメ限定の枠を全スキル共通の DMG_TAKEN で代用するため、必殺ダメ計算時のみON。
            id: 'e4_ult_taken_up_party',
            source: 'eidolon',
            name: 'E4 必殺被ダメ+8% (戦闘突入時)',
            description: '戦闘に入った敵は、受ける必殺技のダメージ+8%。**必殺ダメ計算時のみ ON** にしてください (DMG_TAKEN 枠は全スキル種別共通のため誤適用注意)。',
            stats: { [STAT.DMG_TAKEN]: 0.08 },
            minEidolon: 4,
            defaultActive: false,
            target: 'all',
            duration: 'permanent', tickRule: 'none', dispellable: false,
        },
    ],

    selfEffects: [
        // --- 軌跡 (追加能力) ---
        {
            id: 'trace_a4_naraku_1',
            source: 'extra',
            name: '昇格4 奈落 (虚無キャラ階段バフ・別枠乗算)',
            // 別枠乗算 (multiplicative outgoing damage) を STAT.SEP_MULT で表現:
            //   公式仕様: 「通常/戦闘スキル/必殺の与ダメージが本来の115%/160%になる」
            //   = 最終ダメージに対して ×1.15 / ×1.60 を独立に掛ける乗算枠。
            //   STAT.SEP_MULT は statComputer 側で乗算結合される
            //   ((1+a)*(1+b)-1 形式)。通常の与ダメUP枠 (STAT.DMG_ALL = 加算) とは
            //   合算されない。
            description: 'パーティ内の他「虚無」運命キャラ 1名 / 2名 で 通常/戦闘スキル/必殺の与ダメが本来の 115% / 160% (= ×1.15 / ×1.60、別枠乗算)。E2 開放時、必要人数 -1 (1名で最大値到達)。',
            stats: { [STAT.SEP_MULT]: 0 },
            stackable: {
                max: 2,
                default: 0,
                type: 'step',
                stepValues: {
                    1: { [STAT.SEP_MULT]: 0.15 },
                    2: { [STAT.SEP_MULT]: 0.60 },
                },
            },
            condition: 'nihility_allies_count',
            defaultActive: false,
            target: 'single',
            duration: 'permanent', tickRule: 'none', dispellable: false,
        },
        // --- 追加能力 A6 雷心 (3層, 3T) ---
        {
            id: 'trace_a6_thunderheart',
            source: 'extra',
            name: '昇格6 雷心 (啼沢斬り→集真赤敵命中時 与ダメ+30%)',
            description: '必殺の「啼沢斬り」が「集真赤」を持つ敵に命中した時、黄泉の与ダメージ+30%、最大3層、3T。発動条件成立時に手動でONにしてください。',
            stats: { [STAT.DMG_ALL]: 0.30 },
            stackable: { max: 3, default: 3 },
            defaultActive: false,
            duration: 3, tickRule: 'caster_turn_end', dispellable: false,
        },
        // --- 星魂 ---
        {
            id: 'e1_debuffed_crit',
            source: 'eidolon',
            name: 'E1 デバフ敵への会心率+18%',
            description: 'デバフ状態の敵にダメージを与える時、会心率+18%。デバフ敵を殴る前提で計算する時 ON。',
            stats: { [STAT.CRIT_RATE]: 0.18 },
            minEidolon: 1,
            defaultActive: false,
            duration: 'permanent', tickRule: 'none', dispellable: false,
        },
        {
            id: 'e6_ult_res_pen',
            source: 'eidolon',
            name: 'E6 必殺技 全耐性貫通+20%',
            description: '黄泉が与える必殺技ダメージの全耐性貫通+20%。**必殺技ダメ計算時のみ ON** にしてください (RES_PEN 枠は全スキル種別共通のため、誤適用に注意)。',
            stats: { [STAT.RES_PEN]: 0.20 },
            minEidolon: 6,
            defaultActive: false,
            duration: 'permanent', tickRule: 'none', dispellable: false,
        },
        {
            id: 'e6_basic_skill_as_ult',
            source: 'eidolon',
            name: 'E6 通常攻撃・戦闘スキル → 必殺扱い',
            description: '通常攻撃ダメージ、戦闘スキルダメージが必殺技ダメージと見なされ、弱点属性を無視して敵の靭性を削る。敵を弱点撃破時、雷属性の弱点撃破効果を発動。基本/スキルダメ計算時、DMG_ULT 枠の補正を合算したい場合に参考にしてください (現 schema では DMG_ULT 自動合流の仕組みは無いため、手動で DMG_BASIC/DMG_SKILL に同値を加える運用)。',
            stats: {},
            minEidolon: 6,
            defaultActive: false,
            duration: 'permanent', tickRule: 'none', dispellable: false,
        },
        // --- 内部状態 (四相断我) ---
        {
            id: 'state_shisou_dangaga',
            source: 'technique',
            name: '内部状態 四相断我 (秘技/A2 で蓄積)',
            description: '各ウェーブ開始時 +1、必殺後 +1 (A2 開放後)。残夢上限到達後の獲得分が四相断我に変換。max 1 (デフォルト) / 3 (A2 開放後)。表示・状態管理用 (与ダメ補正なし)。',
            stats: {},
            stackable: { max: 3, default: 0 },
            defaultActive: false,
            duration: 'permanent', tickRule: 'none', dispellable: false,
        },
    ],

    enemyEffects: [
        // --- 天賦: 敵全耐性ダウン (必殺中) ---
        {
            id: 'talent_all_res_down_enemy',
            source: 'talent',
            name: '天賦 全耐性ダウン (必殺発動中)',
            description: '必殺発動中、敵全体の全耐性-X% (Lv連動、必殺終了まで)。partyEffects 側でも RES_PEN として参照可能。',
            debuffType: 'res_down',
            baseChance: 1.0,
            fromLevel: 'talent',
            computeStats: (lv, mult, caster) => ({
                [STAT.RES_PEN]: mult.resDown,
            }),
            defaultActive: false,
            target: 'all',
            duration: 1, tickRule: 'target_turn_end', dispellable: false,
        },
        // --- 戦闘スキル: 集真赤 1 層付与 ---
        {
            id: 'skill_crimson_knot',
            source: 'skill',
            name: '戦闘スキル 集真赤 (1層付与)',
            description: '戦闘スキルで敵単体に「集真赤」を1層付与 (max 9, 必殺の啼沢斬りで最大3層ずつ消去・追加 AoE 雷)。状態 marker (現 simulator では per-enemy stack は未配線)。',
            debuffType: 'mark',
            baseChance: 1.0,
            stats: {},
            stackable: { max: 9, default: 1 },
            defaultActive: false,
            target: 'single',
            duration: 'permanent', tickRule: 'none', dispellable: false,
        },
        // --- 星魂 E4 ---
        {
            id: 'e4_ult_taken_up',
            source: 'eidolon',
            name: 'E4 必殺被ダメ+8% (戦闘突入時)',
            description: '戦闘に入った敵は、受ける必殺技のダメージ+8%。**必殺ダメ計算時のみ DMG_TAKEN を有効化** してください (DMG_TAKEN 枠は全スキル種別共通のため誤適用注意)。',
            debuffType: 'stat_down',
            baseChance: 1.0,
            stats: { [STAT.DMG_TAKEN]: 0.08 },
            minEidolon: 4,
            defaultActive: false,
            target: 'all',
            duration: 'permanent', tickRule: 'none', dispellable: false,
        },
    ],

    // 追加能力 (昇格2/4/6)
    extras: [
        {
            tier: 2, name: '赤鬼',
            description: '戦闘開始時、「残夢」を5層獲得し、ランダムな敵1体に「集真赤」を5層付与する。「残夢」が上限値まで蓄積された後、「残夢」を1層獲得するごとに「四相断我」を1層獲得する。「四相断我」は3層まで蓄積できるようになる。',
        },
        {
            tier: 4, name: '奈落',
            description: 'パーティ内に黄泉以外の「虚無」の運命を歩むキャラクターが1名/2名存在する場合、黄泉の通常攻撃、戦闘スキル、必殺技の与ダメージが本来の115%/160%になる。',
        },
        {
            tier: 6, name: '雷心',
            description: '必殺技の「啼沢斬り」が「集真赤」を持つ敵に命中する時、黄泉の与ダメージ+30%、最大3層、3ターン継続。「黄泉返り」発動時、さらに6ヒットしランダム敵に攻撃力25%分の雷属性ダメ (必殺扱い)。',
        },
    ],

    hooks: {
        // 残夢蓄積トリガ (現 simulator 未配線。collectHooks は任意キーを集めるので登録は無害)
        //
        // onAllySkillUse: 他キャラがスキルを使い、敵にデバフを付与した時に
        //                 残夢+1 / 集真赤最多敵に+1。
        // onEnemyDebuffApplied: 敵がデバフを受けた時の上位フック (将来 dispatch 用)。
        onAllySkillUse: [
            {
                source: 'acheron_talent_charge',
                fn: (ctx) => {
                    // 受け取り側: ctx.self=Acheron, ctx.actor=行動した味方, ctx.enemies
                    //
                    // ⚠ 簡易実装 (致命バグだけ直して放置モード):
                    //   本来のHSR仕様は「攻撃時にデバフ付与が発生 + 1行動につき1層上限」
                    //   だが、simulator がデバフ付与イベントの dispatch を持たないため
                    //   「他味方が行動する度に +1」の雑表現で代用。
                    //   黄泉自身の戦闘スキル本体経路は onSkillUse 側で別途 +1 されるため、
                    //   厳密な仕様では再現できないケース (戦闘スキル+モチーフで +2 等) は
                    //   この実装では取りこぼす。
                    const self = ctx.self;
                    if (!self || self.build?.characterId !== 'acheron') return;
                    self.currentEP = Math.min(self.maxEP, self.currentEP + 1);
                    // 集真赤: 集真赤を最も多く持つ敵 (= 最多敵) に+1
                    if (typeof window !== 'undefined' && window.applyMark) {
                        const enemies = (ctx.enemies || []).filter(e => !e.isSummon);
                        if (enemies.length > 0) {
                            const top = [...enemies].sort((a, b) =>
                                (b.marks?.crimsonKnot?.count || 0) - (a.marks?.crimsonKnot?.count || 0)
                            )[0];
                            window.applyMark(top.id, 'crimsonKnot', 1, { max: 9, displayName: '集真赤' });
                        }
                    }
                },
            },
        ],
        onTurnStart: [
            {
                source: 'acheron_e2_turn_charge',
                fn: (ctx) => {
                    const self = ctx.self;
                    if (!self || self.build?.characterId !== 'acheron') return;
                    if ((self.build?.eidolon || 0) < 2) return;
                    // E2: 自身のターン開始時 残夢+1, 集真赤最多の敵に集真赤+1
                    self.currentEP = Math.min(self.maxEP, self.currentEP + 1);
                    if (typeof window !== 'undefined' && window.applyMark) {
                        const enemies = (ctx.enemies || []).filter(e => !e.isSummon);
                        if (enemies.length > 0) {
                            const top = [...enemies].sort((a, b) =>
                                (b.marks?.crimsonKnot?.count || 0) - (a.marks?.crimsonKnot?.count || 0)
                            )[0];
                            window.applyMark(top.id, 'crimsonKnot', 1, { max: 9, displayName: '集真赤' });
                        }
                    }
                },
            },
        ],
        onCombatStart: [
            {
                source: 'acheron_a2_init',
                fn: (ctx) => {
                    const self = ctx.self;
                    if (!self || self.build?.characterId !== 'acheron') return;
                    // A2「赤鬼」: 戦闘開始時 残夢 5 層獲得 (max は maxEP=9 でクランプ)
                    self.currentEP = Math.min(self.maxEP, self.currentEP + 5);
                    // 集真赤 5 層をランダム敵 1 体に付与
                    if (typeof window !== 'undefined' && window.applyMark) {
                        const enemies = (ctx.enemies || []).filter(e => !e.isSummon);
                        if (enemies.length > 0) {
                            const target = enemies[Math.floor(Math.random() * enemies.length)];
                            window.applyMark(target.id, 'crimsonKnot', 5, { max: 9, displayName: '集真赤' });
                        }
                    }
                },
            },
        ],
        onSkillUse: [
            {
                source: 'acheron_skill_charge',
                fn: (ctx) => {
                    // 自身の戦闘スキル発動時に 残夢+1, 単体先頭敵に集真赤+1
                    const self = ctx.self;
                    if (!self || self.build?.characterId !== 'acheron') return;
                    self.currentEP = Math.min(self.maxEP, self.currentEP + 1);
                    if (typeof window !== 'undefined' && window.applyMark) {
                        const target = (ctx.enemies || []).find(e => !e.isSummon);
                        if (target) {
                            window.applyMark(target.id, 'crimsonKnot', 1, { max: 9, displayName: '集真赤' });
                        }
                    }
                },
            },
        ],
        onUltUse: [
            {
                source: 'acheron_ult_slash',
                fn: (ctx) => {
                    // 必殺の啼沢斬り×3: 単体ターゲットの集真赤を最大3層消去
                    //   現 simulator は単体ターゲット選択UIが無いため、集真赤を持つ
                    //   敵のうち最多の1体を「指定単体」と見なす。
                    const self = ctx.self;
                    if (!self || self.build?.characterId !== 'acheron') return;
                    if (typeof window === 'undefined' || !window.consumeMarks) return;

                    const enemies = (ctx.enemies || []).filter(e => !e.isSummon);
                    const target = [...enemies].sort((a, b) =>
                        (b.marks?.crimsonKnot?.count || 0) - (a.marks?.crimsonKnot?.count || 0)
                    )[0];
                    if (target && (target.marks?.crimsonKnot?.count || 0) > 0) {
                        // 啼沢×3 で計 max 9 層消去できるが、ターゲット側にあるだけ消す
                        window.consumeMarks(target.id, 'crimsonKnot', Math.min(9, target.marks.crimsonKnot.count));
                    }
                    // 黄泉返り: 全敵の集真赤を完全クリア
                    for (const enemy of enemies) {
                        const c = enemy.marks?.crimsonKnot?.count || 0;
                        if (c > 0) window.consumeMarks(enemy.id, 'crimsonKnot', c);
                    }
                },
            },
        ],
    },
});
