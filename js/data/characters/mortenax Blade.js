import { ELEMENT, PATH } from '../../build/constants.js';
import { STAT, ELEMENT_DMG_KEYS } from '../../build/statKeys.js';
import { Registry } from '../../build/registry.js';

Registry.character.add({
    id: 'mortenax_blade',
    englishName: 'Mortenax Blade',
    aliases: ['千冶・刃'],
    name: '千冶・刃',
    element: ELEMENT.FIRE,
    path: PATH.NIHILITY,
    rarity: 5,

    base: {
        atk: 543,
        hp: 1358,
        def: 485,
        spd: 107,
        aggro: 75,
    },
    maxEnergy: 160,

    traces: {
        stats: {
            [ELEMENT_DMG_KEYS.fire]: 0.224,
            [STAT.CRIT_RATE]: 0.120,
            [STAT.HP_PERCENT]: 0.100,
        },
        passives: [],
    },
    extras: [
        {
            tier: 2,
            name: '百練の骨',
            description: '千冶・刃は最大EPを超えた分のEPを80まで蓄積できる。必殺技を発動した後、上限を超えて蓄積された分のEPを回復し、蓄積した超過分をクリアする。戦闘開始時または結界が解除された時、EPが75%未満の場合、即座に75%まで回復する。EPが上限まで回復した時、自身のすべてのデバフを解除する。'
        },
        {
            tier: 4,
            name: '千鍛の魂',
            description: '結界が展開されている間、敵に攻撃される確率がアップ、自身の受けるダメージ-50%、受ける治癒量+50%。攻撃を受けた後、攻撃者に「修羅の炎」状態を付与し、千冶・刃はチャージを1獲得する。'
        },
        {
            tier: 6,
            name: '万淬の心',
            description: '結界が展開されている間、味方の与ダメージ+50%。パーティに千冶・刃以外の「虚無」の運命を歩むキャラがいる場合、味方の必殺技ダメージ+75%。また、パーティに千冶・刃以外の「虚無」の運命を歩むキャラがいない場合、千冶・刃の与ダメージがさらに+75%。'
        }
    ],

    eidolons: {},
    eidolonsDetail: {
        1: {
            name: '死するまで、この身は成らず',
            description: '結界が展開されている間、敵全体の全属性耐性-20%。天賦による追加の戦闘スキルを発動した後、「無量忿怒」のカウントダウンの行動順を15%遅延させる。',
        },
        2: {
            name: '心は死灰の如く、されど炎は消えず',
            description: '味方キャラが必殺技を発動してダメージを与える時、追加攻撃を行うと見なされる。味方の追加攻撃ダメージ+75%。千冶・刃のチャージ上限が7にダウンする。',
        },
        3: {
            name: '彼岸に渡り、忿怒の本相を現さん',
            description: '必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。',
            levelBoost: { ult: 2, enhancedUlt: 2, talent: 2 }
        },
        4: {
            name: '遺恨に鍛えられ、剣骨自ずと形を成す',
            description: '「万淬の心」は味方の与ダメージをさらに50%アップさせる。',
        },
        5: {
            name: '己が苦を断ち、死より生を知る',
            description: '戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。',
            levelBoost: { skill: 2, basic: 1, enhancedBasic: 1 }
        },
        6: {
            name: '神が殞落するならば、寿瘟を討つと誓わん',
            description: '結界が展開されている間、千冶・刃がダメージを受ける、またはHPを消費した時、チャージを1獲得する。この効果はいずれかの味方または敵のターンが終了した後に再度発動可能になる。「千冶は一を鋳り、万劫を燼滅す」のダメージ倍率が元の倍率の150%になる。',
        }
    },

    skills: {
        basic: { 
            name: '刈り尽くす毀刃',
            type: 'attack', 
            target: 'single', 
            description: '指定した敵単体に千冶・刃の最大HPX%分の炎属性ダメージを与え、ターゲットを挑発状態にする。挑発状態は1ターン継続する。',
            spGain: 1, 
            energyGain: 20, 
            toughness: 10, 
            hitSplit: [1.0], 
            maxLevel: { default: 6, withEidolon: 7 },
            levels: [
                { hpPct: 0.25, enhancedHpPct: 0.50 },
                { hpPct: 0.30, enhancedHpPct: 0.60 },
                { hpPct: 0.35, enhancedHpPct: 0.70 },
                { hpPct: 0.40, enhancedHpPct: 0.80 },
                { hpPct: 0.45, enhancedHpPct: 0.90 },
                { hpPct: 0.50, enhancedHpPct: 1.00 },
                { hpPct: 0.55, enhancedHpPct: 1.10 },
            ]
        },
        enhancedBasic: {
            maxLevel: { default: 6, withEidolon: 7 },
            levels: [
                { hpPct: 0.50 },
                { hpPct: 0.60 },
                { hpPct: 0.70 },
                { hpPct: 0.80 },
                { hpPct: 0.90 },
                { hpPct: 1.00 },
                { hpPct: 1.10 },
            ],
            name: '魂魄を断つ鋭刃',
            type: 'attack', 
            target: 'single', 
            description: '指定した敵単体に千冶・刃の最大HPY%分の炎属性ダメージを与え、ターゲットを挑発状態にする。挑発状態は1ターン継続する。',
            spGain: 1, 
            energyGain: 20, 
            toughness: 20, 
            hitSplit: [1.0]
        },
        skill: { 
            name: '葬り去る千刃',
            type: 'attack', 
            target: 'all', 
            description: '千冶・刃の最大HP10%分のHPを消費し、敵全体に千冶・刃の最大HPX%分の炎属性ダメージを与え、さらに4ヒットする。1ヒットごとにランダムな敵単体に千冶・刃の最大HPY%分の炎属性ダメージを与える。',
            spCost: 0, 
            energyGain: 30, 
            toughness: 20, 
            hitSplit: [0.2, 0.2, 0.2, 0.2, 0.2], 
            damageComponents: [
                { stat: 'hp', multiplierKey: 'hpPctAll', label: '全体攻撃' },
                { stat: 'hp', multiplierKey: 'hpPctBounce', hits: 4, label: 'ランダム4ヒット' },
            ],
            maxLevel: { default: 10, withEidolon: 12 },
            levels: [
                { hpPctAll: 0.360, hpPctBounce: 0.120 },
                { hpPctAll: 0.396, hpPctBounce: 0.132 },
                { hpPctAll: 0.432, hpPctBounce: 0.144 },
                { hpPctAll: 0.468, hpPctBounce: 0.156 },
                { hpPctAll: 0.504, hpPctBounce: 0.168 },
                { hpPctAll: 0.540, hpPctBounce: 0.180 },
                { hpPctAll: 0.585, hpPctBounce: 0.195 },
                { hpPctAll: 0.630, hpPctBounce: 0.210 },
                { hpPctAll: 0.675, hpPctBounce: 0.225 },
                { hpPctAll: 0.720, hpPctBounce: 0.240 },
                { hpPctAll: 0.765, hpPctBounce: 0.255 },
                { hpPctAll: 0.810, hpPctBounce: 0.270 },
            ]
        },
        ult: { 
            name: '骨は炉に、血肉は薪にす',
            type: 'buff', 
            target: 'all', 
            description: '敵全体を「修羅の炎」状態にする。「修羅の炎」状態の敵は防御力-X%、受けるダメージ+Y%、2ターン継続。その後、千冶・刃は最大HP20%分のHPを消費して結界を展開する。結界が展開されている間、千冶・刃は「無量忿怒」状態になる。',
            energyCost: 160, 
            energyGain: 5, 
            toughness: 0, 
            hitSplit: [], 
            maxLevel: { default: 10, withEidolon: 12 },
            levels: [
                { defDown: 0.200, dmgTakenUp: 0.300, cdBuff: 0.300, hpPct: 2.100 },
                { defDown: 0.210, dmgTakenUp: 0.320, cdBuff: 0.330, hpPct: 2.240 },
                { defDown: 0.220, dmgTakenUp: 0.340, cdBuff: 0.360, hpPct: 2.380 },
                { defDown: 0.230, dmgTakenUp: 0.360, cdBuff: 0.390, hpPct: 2.520 },
                { defDown: 0.240, dmgTakenUp: 0.380, cdBuff: 0.420, hpPct: 2.660 },
                { defDown: 0.250, dmgTakenUp: 0.400, cdBuff: 0.450, hpPct: 2.800 },
                { defDown: 0.262, dmgTakenUp: 0.425, cdBuff: 0.488, hpPct: 2.975 },
                { defDown: 0.275, dmgTakenUp: 0.450, cdBuff: 0.525, hpPct: 3.150 },
                { defDown: 0.288, dmgTakenUp: 0.475, cdBuff: 0.562, hpPct: 3.325 },
                { defDown: 0.300, dmgTakenUp: 0.500, cdBuff: 0.600, hpPct: 3.500 },
                { defDown: 0.312, dmgTakenUp: 0.525, cdBuff: 0.638, hpPct: 3.675 },
                { defDown: 0.325, dmgTakenUp: 0.550, cdBuff: 0.675, hpPct: 3.850 },
            ]
        },
        enhancedUlt: {
            maxLevel: { default: 10, withEidolon: 12 },
            levels: [
                { hpPct: 2.10 },
                { hpPct: 2.24 },
                { hpPct: 2.38 },
                { hpPct: 2.52 },
                { hpPct: 2.66 },
                { hpPct: 2.80 },
                { hpPct: 2.975 },
                { hpPct: 3.15 },
                { hpPct: 3.325 },
                { hpPct: 3.50 },
                { hpPct: 3.675 },
                { hpPct: 3.85 },
            ],
            name: '千冶は一を鋳り、万劫を燼滅す',
            type: 'attack',
            target: 'all',
            description: '敵全体に千冶・刃の最大HPW%分の炎属性ダメージを与える。',
            energyCost: 0,
            energyGain: 5,
            toughness: 60,
            hitSplit: [1.0]
        },
        talent: { 
            name: '因果清算',
            type: 'passive',
            description: '結界が展開されている間、味方は敵を攻撃するたびに、ターゲットに「修羅の炎」を付与する。同時に、千冶・刃はチャージを1獲得する。チャージが9に達し、かつ最大HPが1を超えた時、千冶・刃はチャージを9消費して、EPをX回復し、追加で戦闘スキルを1回発動する。なお、この回の戦闘スキルは追加攻撃と見なされる。',
            maxLevel: { default: 10, withEidolon: 12 },
            levels: [
                { epRestore: 15.0 },
                { epRestore: 16.0 },
                { epRestore: 17.0 },
                { epRestore: 18.0 },
                { epRestore: 19.0 },
                { epRestore: 20.0 },
                { epRestore: 21.2 },
                { epRestore: 22.5 },
                { epRestore: 23.8 },
                { epRestore: 25.0 },
                { epRestore: 26.2 },
                { epRestore: 27.5 },
            ]
        },
        technique: {
            name: '十方不赦',
            type: 'passive',
            description: '一定範囲内のすべての敵を即座に攻撃する。戦闘に入った後、敵全体を挑発状態にする。挑発状態は1ターン継続する。また、自身の受けるダメージ-90%、2ターン継続。'
        }
    },

    partyEffects: [
        {
            id: 'shura_no_honoo',
            source: 'ult',
            name: '修羅の炎 (防御デバフ・被ダメUP)',
            description: '敵全体の防御力-X%、受けるダメージ+Y%、2ターン継続。',
            fromLevel: 'ult',
            computeStats: (lv, mult) => ({
                [STAT.DEF_DOWN]: mult.defDown,
                [STAT.DMG_TAKEN]: mult.dmgTakenUp,
            }),
            defaultActive: false,
            target: 'all',
            duration: 2,
            dispellable: true,
        },
        {
            id: 'a6_all_dmg',
            source: 'extra',
            name: '万淬の心 (無量忿怒時)',
            description: '結界が展開されている間、味方の与ダメージ+50%。',
            stats: { [STAT.DMG_ALL]: 0.50 },
            defaultActive: false,
            target: 'all',
            duration: 'permanent',
        },
        {
            id: 'a6_nihility_ult_dmg',
            source: 'extra',
            name: '万淬の心 (虚無キャラあり)',
            description: 'パーティに千冶・刃以外の「虚無」の運命を歩むキャラがいる場合、味方の必殺技ダメージ+75%。',
            stats: { [STAT.DMG_ULT]: 0.75 },
            defaultActive: false,
            target: 'all',
            duration: 'permanent',
        },
        {
            id: 'e1_res_pen',
            source: 'eidolon',
            name: '全属性耐性ダウン (無量忿怒時)',
            description: '結界が展開されている間、敵全体の全属性耐性-20%。',
            stats: { [STAT.RES_PEN]: 0.20 },
            minEidolon: 1,
            defaultActive: false,
            target: 'all',
            duration: 'permanent',
        },
        {
            id: 'e2_follow_up_dmg',
            source: 'eidolon',
            name: '追加攻撃ダメージUP',
            description: '味方キャラが必殺技を発動してダメージを与える時、追加攻撃を行うと見なされる。味方の追加攻撃ダメージ+75%。',
            stats: { [STAT.DMG_FOLLOWUP]: 0.75 },
            minEidolon: 2,
            defaultActive: true,
            target: 'all',
            duration: 'permanent',
        },
        {
            id: 'e4_extra_dmg',
            source: 'eidolon',
            name: '万淬の心 強化 (無量忿怒時)',
            description: '「万淬の心」は味方の与ダメージをさらに50%アップさせる。',
            stats: { [STAT.DMG_ALL]: 0.50 },
            minEidolon: 4,
            defaultActive: false,
            target: 'all',
            duration: 'permanent',
        }
    ],

    selfEffects: [
        {
            id: 'muryou_funnu',
            source: 'ult',
            name: '無量忿怒',
            description: '結界が展開されている間、会心率+20%、会心ダメージ+Z%。',
            fromLevel: 'ult',
            computeStats: (lv, mult) => ({
                [STAT.CRIT_RATE]: 0.20,
                [STAT.CRIT_DMG]: mult.cdBuff,
            }),
            defaultActive: false,
            duration: 'permanent',
            dispellable: false,
        },
        {
            id: 'a4_self_buff',
            source: 'extra',
            name: '千鍛の魂 (無量忿怒時)',
            description: '結界が展開されている間、敵に攻撃される確率がアップ、自身の受けるダメージ-50%、受ける治癒量+50%。',
            // 「受けるダメージ-50%」は被ダメ軽減枠 (生存系) で、本ツールの火力モデルに枠が無いため未反映。
            // 受ける治癒量+50% のみ HEAL_TAKEN で反映する。
            stats: { [STAT.HEAL_TAKEN]: 0.50 },
            defaultActive: false,
            duration: 'permanent',
        },
        {
            id: 'a6_self_dmg',
            source: 'extra',
            name: '万淬の心 (虚無キャラなし)',
            description: 'パーティに千冶・刃以外の「虚無」の運命を歩むキャラがいない場合、千冶・刃の与ダメージがさらに+75%。',
            stats: { [STAT.DMG_ALL]: 0.75 },
            defaultActive: false,
            duration: 'permanent',
        }
    ],

    enemyEffects: [],
    hooks: {}
});
