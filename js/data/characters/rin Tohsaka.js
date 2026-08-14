// 遠坂凛 (Rin Tohsaka) — Ver.4.4

import { ELEMENT, PATH } from '../../build/constants.js';
import { STAT, ELEMENT_DMG_KEYS } from '../../build/statKeys.js';
import { Registry } from '../../build/registry.js';

const SKILL = [
    [0.90, 0.45, 0.45], [0.99, 0.49, 0.49], [1.08, 0.54, 0.54], [1.17, 0.58, 0.58], [1.26, 0.63, 0.63],
    [1.35, 0.67, 0.67], [1.46, 0.73, 0.73], [1.57, 0.78, 0.78], [1.68, 0.84, 0.84], [1.80, 0.90, 0.90],
    [1.98, 0.99, 0.99], [2.16, 1.08, 1.08],
];
const ULT = [
    [3.00, 1.00, 0.10], [3.30, 1.10, 0.11], [3.60, 1.20, 0.12], [3.90, 1.30, 0.13], [4.20, 1.40, 0.14],
    [4.50, 1.50, 0.15], [4.87, 1.62, 0.16], [5.25, 1.75, 0.17], [5.62, 1.87, 0.18], [6.00, 2.00, 0.20],
    [6.60, 2.20, 0.22], [7.20, 2.40, 0.24],
];
const TALENT = [
    [0.35, 1.50], [0.38, 1.65], [0.42, 1.80], [0.45, 1.95], [0.49, 2.10],
    [0.52, 2.25], [0.56, 2.43], [0.61, 2.62], [0.65, 2.81], [0.70, 3.00],
    [0.77, 3.30], [0.84, 3.60],
];

Registry.character.add({
    id: 'rin_tohsaka',
    name: '遠坂凛',
    element: ELEMENT.QUANTUM,
    path: PATH.ERUDITION,
    rarity: 5,
    base: { atk: 698, hp: 1047, def: 460, spd: 102, aggro: 75 },
    maxEnergy: 160,
    traces: {
        stats: {
            [STAT.CRIT_DMG]: 0.373,
            [STAT.ATK_PERCENT]: 0.18,
            [ELEMENT_DMG_KEYS.quantum]: 0.08,
        },
        breakdown: [
            { node: '会心ダメージ強化', stat: STAT.CRIT_DMG, value: 0.373 },
            { node: '攻撃強化', stat: STAT.ATK_PERCENT, value: 0.18 },
            { node: 'ダメージ強化・量子', stat: ELEMENT_DMG_KEYS.quantum, value: 0.08 },
        ],
    },
    eidolons: {},
    eidolonsDetail: {
        1: { name: '宝石翁の弟子', description: '一度の強化戦闘スキルで宝石エネルギーを30以上消費すると、影の宝石を獲得する。' },
        2: { name: '次元界を旅する者', description: '遠坂凛の戦闘スキルダメージ+30%。フィールド上にいる時、味方全体の戦闘スキルダメージが本来の130%になる。' },
        3: { name: '聖杯戦争：勝利記念', description: '戦闘スキルLv.+2、通常攻撃Lv.+1。', levelBoost: { skill: 2, basic: 1 } },
        4: { name: 'あかいあくま・3倍速い', description: '天賦の会心ダメージアップが遠坂凛に適用される時、最大2層まで累積可能になる。' },
        5: { name: '金星神の寵愛', description: '必殺技Lv.+2、天賦Lv.+2。', levelBoost: { ult: 2, talent: 2 } },
        6: { name: '今回はヘマしなかった！', description: '全属性耐性貫通+20%。必殺技時に宝石エネルギー24層と追加ターンを得る。' },
    },
    skills: {
        basic: {
            name: '八極拳', type: 'attack', target: 'single', element: ELEMENT.QUANTUM,
            spGain: 1, energyGain: 20, toughness: 10, hitSplit: [1.0],
            description: '敵単体に遠坂凛の攻撃力X%分の量子属性ダメージを与える。',
            maxLevel: { default: 6, withEidolon: 7 },
            levels: [0.50, 0.60, 0.70, 0.80, 0.90, 1.00, 1.10].map(atk => ({ atk })),
        },
        skill: {
            name: '宝石剣ゼルレッチ', type: 'attack', target: 'single', element: ELEMENT.QUANTUM,
            spCost: 1, energyGain: 30, toughness: 20, hitSplit: [1.0],
            description: '敵単体に量子属性ダメージを与える。宝石エネルギーが15以上またはSPが7以上なら「第二魔法の実験」に強化され、敵全体への攻撃後に最大33回のバウンド攻撃を行う。',
            maxLevel: { default: 10, withEidolon: 12 },
            levels: SKILL.map(([atk, atkAll, bounceAtk]) => ({ atk, atkAll, bounceAtk })),
        },
        ult: {
            name: '山脈震撼す明星の薪（アンガルタ・キガルシュ）', type: 'attack', target: 'all', element: ELEMENT.QUANTUM,
            energyCost: 160, energyGain: 5, spCost: 0, toughness: 30, hitSplit: [1.0],
            description: '敵単体とその他の敵に量子属性ダメージを与え、味方のSPを1回復する。敵全体の受けるダメージ+Z%、3ターン。',
            maxLevel: { default: 10, withEidolon: 12 },
            levels: ULT.map(([atkSingle, atkOther, dmgTaken]) => ({ atkSingle, atkOther, dmgTaken })),
        },
        talent: {
            name: '宝石魔術', type: 'passive', target: 'all_ally',
            description: '戦闘開始時に宝石エネルギーを20獲得する。味方がSPを消費または回復するたび、その味方の会心ダメージ+X%、2ターン。',
            maxLevel: { default: 10, withEidolon: 12 },
            levels: TALENT.map(([critDmg, followUpAtk]) => ({ critDmg, followUpAtk })),
        },
        technique: { name: '変換チャージ', type: 'support', description: '次の戦闘開始時に宝石エネルギーを10獲得する。' },
    },
    selfEffects: [
        {
            id: 'rin_tohsaka_extra2_self', source: 'extra', name: '追加能力「優雅たれ」',
            description: '戦闘開始時、遠坂凛の攻撃力+150%、量子属性耐性貫通+15%。',
            stats: { [STAT.ATK_PERCENT]: 1.50, [STAT.RES_PEN]: 0.15 }, defaultActive: true, duration: 'permanent', dispellable: false,
        },
        {
            id: 'rin_tohsaka_extra4_spd', source: 'extra', name: '追加能力「淑女らしく」',
            description: '戦闘開始時および強化戦闘スキル発動後、速度+20%、3ターン。',
            stats: { [STAT.SPD_PERCENT]: 0.20 }, defaultActive: true, duration: 3, tickRule: 'caster_turn_end', dispellable: false,
        },
    ],
    partyEffects: [
        {
            id: 'rin_tohsaka_talent_crit_dmg', source: 'talent', name: '天賦: SP変動時の会心ダメージ',
            description: '味方がSPを消費または回復した時、その味方の会心ダメージ+X%、2ターン。', fromLevel: 'talent',
            computeStats: (_lv, mult) => ({ [STAT.CRIT_DMG]: mult?.critDmg ?? 0 }),
            defaultActive: false, target: 'single', duration: 2, tickRule: 'target_turn_end', dispellable: false,
        },
        {
            id: 'rin_tohsaka_ult_dmg_taken', source: 'ult', name: '必殺技: 敵被ダメージ',
            description: '必殺技後、敵全体の受けるダメージ+Z%、3ターン。', fromLevel: 'ult',
            computeStats: (_lv, mult) => ({ [STAT.DMG_TAKEN]: mult?.dmgTaken ?? 0 }),
            defaultActive: false, target: 'all', duration: 3, tickRule: 'caster_turn_end', dispellable: false,
        },
        {
            id: 'rin_tohsaka_extra2_archer_buff', source: 'extra', name: '追加能力「優雅たれ」（アーチャー）',
            description: 'パーティにアーチャーがいる場合、そのアーチャーも攻撃力+150%、量子属性耐性貫通+15%。',
            stats: { [STAT.ATK_PERCENT]: 1.50, [STAT.RES_PEN]: 0.15 }, defaultActive: false, target: 'single',
        },
    ],
    wiki: {
        listUrl: 'https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7',
        pageUrl: 'https://wikiwiki.jp/star-rail/%E9%81%A0%E5%9D%82%E5%87%9B',
        version: '4.4',
    },
});
