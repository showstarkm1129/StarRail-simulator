// ギルガメッシュ — Ver.4.4

import { ELEMENT, PATH } from '../../build/constants.js';
import { STAT, ELEMENT_DMG_KEYS } from '../../build/statKeys.js';
import { addCharacterDefinition } from './_characterRegistry.js';

const SKILL = [
    [0.15, 1.40, 0.70], [0.16, 1.54, 0.77], [0.18, 1.68, 0.84], [0.19, 1.82, 0.91], [0.21, 1.96, 0.98],
    [0.22, 2.10, 1.05], [0.24, 2.27, 1.13], [0.26, 2.45, 1.22], [0.28, 2.62, 1.31], [0.30, 2.80, 1.40],
    [0.33, 3.08, 1.54], [0.36, 3.36, 1.68],
];
const ULT = [
    [2.00, 0.50], [2.20, 0.55], [2.40, 0.60], [2.60, 0.65], [2.80, 0.70],
    [3.00, 0.75], [3.25, 0.81], [3.50, 0.87], [3.75, 0.93], [4.00, 1.00],
    [4.40, 1.10], [4.80, 1.20],
];
const TALENT = [
    [0.20, 2.00, 3.00, 1.20], [0.22, 2.20, 3.30, 1.28], [0.24, 2.40, 3.60, 1.36], [0.26, 2.60, 3.90, 1.44], [0.28, 2.80, 4.20, 1.52],
    [0.30, 3.00, 4.50, 1.60], [0.32, 3.25, 4.87, 1.70], [0.35, 3.50, 5.25, 1.80], [0.37, 3.75, 5.62, 1.90], [0.40, 4.00, 6.00, 2.00],
    [0.44, 4.40, 6.60, 2.20], [0.48, 4.80, 7.20, 2.40],
];

addCharacterDefinition({
    id: 'gilgamesh',
    name: 'ギルガメッシュ',
    element: ELEMENT.LIGHTNING,
    path: PATH.DESTRUCTION,
    rarity: 5,
    base: { atk: 717, hp: 1125, def: 509, spd: 97, aggro: 125 },
    maxEnergy: 360,

    traces: {
        stats: {
            [STAT.CRIT_RATE]: 0.187,
            [STAT.ATK_PERCENT]: 0.18,
            [ELEMENT_DMG_KEYS.lightning]: 0.08,
        },
        breakdown: [
            { node: '会心率強化', stat: STAT.CRIT_RATE, value: 0.187 },
            { node: '攻撃強化', stat: STAT.ATK_PERCENT, value: 0.18 },
            { node: 'ダメージ強化・雷', stat: ELEMENT_DMG_KEYS.lightning, value: 0.08 },
        ],
    },
    eidolons: {},
    eidolonsDetail: {
        1: { name: 'すべてを見届ける者', description: '「王が認める」の防御無視を他の味方にも適用し、自身の攻撃力+60%。' },
        2: { name: '万物に通用する叡智', description: '戦闘開始時と必殺技発動時に「興」を獲得し、戦闘スキルを強化する。' },
        3: { name: '千里の山河を越える旅', description: '戦闘スキルLv.+2、通常攻撃Lv.+1。', levelBoost: { skill: 2, basic: 1 } },
        4: { name: '唯我独尊の王', description: 'EP回復効率+20%。' },
        5: { name: '人神決別の剣', description: '必殺技Lv.+2、天賦Lv.+2。', levelBoost: { ult: 2, talent: 2 } },
        6: { name: '親友に鍛えられし魂', description: '必殺技のバウンド倍率を強化。味方全体の全属性耐性貫通+20%。' },
    },

    skills: {
        basic: {
            name: '気まぐれ', type: 'attack', target: 'single', element: ELEMENT.LIGHTNING,
            spGain: 1, energyGain: 20, toughness: 10, hitSplit: [1.0],
            description: '敵単体にギルガメッシュの攻撃力X%分の雷属性ダメージを与える。',
            maxLevel: { default: 6, withEidolon: 7 },
            levels: [0.50, 0.60, 0.70, 0.80, 0.90, 1.00, 1.10].map(atk => ({ atk })),
        },
        skill: {
            name: '王の財宝（ゲート・オブ・バビロン）', type: 'attack', target: 'blast', element: ELEMENT.LIGHTNING,
            spCost: 1, energyGain: 30, toughness: 20, hitSplit: [1.0],
            damageComponents: [
                {
                    id: 'skill-main', label: '主対象',
                    scalingStat: 'atk', multiplierKey: 'atk', target: 'single',
                },
                {
                    id: 'skill-adjacent', label: '隣接対象',
                    scalingStat: 'atk', multiplierKey: 'atkAdjacent', target: 'blast',
                },
            ],
            description: '「王が認める」を獲得し、3ターンの間、与ダメージ時に敵の防御力をX%無視する。敵単体と隣接する敵に雷属性ダメージを与える。',
            maxLevel: { default: 10, withEidolon: 12 },
            levels: SKILL.map(([defIgnore, atk, atkAdjacent]) => ({ defIgnore, atk, atkAdjacent })),
        },
        ult: {
            name: '天地乖離す開闢の星（エヌマ・エリシュ）', type: 'attack', target: 'all', element: ELEMENT.LIGHTNING,
            energyCost: 360, energyGain: 5, spCost: 0, toughness: 30, hitSplit: [1.0],
            description: '敵全体に雷属性ダメージを与え、さらにランダムな敵単体に10ヒットする。',
            maxLevel: { default: 10, withEidolon: 12 },
            levels: ULT.map(([atkAll, atk]) => ({ atkAll, atk })),
        },
        talent: {
            name: '「我を存分に楽しませよ」', type: 'passive',
            description: '他の味方の必殺技発動時、自身の必殺技ダメージ+X%。「興」1層ごとに速度+10%。ギルガメッシュまたはセイバーの攻撃を8回数えると、連携追加攻撃を発動する。',
            maxLevel: { default: 10, withEidolon: 12 },
            levels: TALENT.map(([ultDmg, followUpAtk, saberFollowUpAtk, saberUltDmg]) => ({ ultDmg, followUpAtk, saberFollowUpAtk, saberUltDmg })),
        },
        technique: { name: '天の鎖（エルキドゥ）', type: 'debuff', description: '特殊領域内の敵を行動不能にし、戦闘開始時に敵全体へ雷属性ダメージを与える。' },
    },
    selfEffects: [
        {
            id: 'gilgamesh_skill_def_ignore', source: 'skill', name: '「王が認める」防御力無視',
            description: '戦闘スキル後、与ダメージ時に敵の防御力をX%無視する（3ターン）。', fromLevel: 'skill',
            computeStats: (_lv, mult) => ({ [STAT.DEF_IGNORE]: mult?.defIgnore ?? 0 }),
            defaultActive: false, duration: 3, tickRule: 'caster_turn_end', dispellable: false,
        },
        {
            id: 'gilgamesh_talent_ult_dmg', source: 'talent', name: '天賦: 必殺技与ダメージ',
            description: '他の味方が必殺技を発動した後、自身の必殺技与ダメージ+X%（3ターン）。', fromLevel: 'talent',
            computeStats: (_lv, mult) => ({ [STAT.DMG_ULT]: mult?.ultDmg ?? 0 }),
            defaultActive: false, duration: 3, tickRule: 'caster_turn_end', dispellable: false,
        },
        {
            id: 'gilgamesh_charge_spd', source: 'talent', name: '「興」速度',
            description: '「興」1層ごとに速度+10%。最大10層。', stats: { [STAT.SPD_PERCENT]: 0.10 },
            defaultActive: false, stackable: { max: 10, default: 1 }, duration: 'permanent', dispellable: false,
        },
    ],
    partyEffects: [
        {
            id: 'gilgamesh_talent_saber_ult_sep_mult', source: 'talent', name: '天賦: セイバーの次の必殺技',
            description: '「攻撃を許す」の連携追加攻撃後、セイバーはEPを120回復し、次に発動する必殺技の与ダメージが元のX%になる。セイバーにのみ適用。', fromLevel: 'talent',
            computeStats: (_lv, mult) => ({ [STAT.SEP_MULT]: Math.max(0, (mult?.saberUltDmg ?? 1) - 1) }),
            defaultActive: false, target: 'single', duration: 'conditional', dispellable: false,
        },
        {
            id: 'gilgamesh_extra6_res_pen', source: 'eidolon', name: '星魂6: 全属性耐性貫通',
            description: 'ギルガメッシュがフィールド上にいる時、味方全体の全属性耐性貫通+20%。',
            stats: { [STAT.RES_PEN]: 0.20 }, defaultActive: true, target: 'all', minEidolon: 6,
        },
    ],
    wiki: {
        listUrl: 'https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7',
        pageUrl: 'https://wikiwiki.jp/star-rail/%E3%82%AE%E3%83%AB%E3%82%AC%E3%83%A1%E3%83%83%E3%82%B7%E3%83%A5',
        version: '4.4',
    },
});
