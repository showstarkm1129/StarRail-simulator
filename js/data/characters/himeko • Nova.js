// 姫子・旅立ち (Himeko • Nova) — Ver.4.4
// 数値: 崩壊：スターレイル日本語Wikiのキャラクターページを基準に登録。

import { ELEMENT, PATH } from '../../build/constants.js';
import { STAT, ELEMENT_DMG_KEYS } from '../../build/statKeys.js';
import { addCharacterDefinition } from './_characterRegistry.js';

const SKILL_DMG = [0.10, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.20, 0.22, 0.24];
const ULT = [
    [3.81, 1.26, 0.40, 0.16, 0.10, 0.15], [4.19, 1.38, 0.44, 0.17, 0.11, 0.16],
    [4.57, 1.51, 0.48, 0.19, 0.12, 0.18], [4.95, 1.63, 0.52, 0.20, 0.13, 0.19],
    [5.33, 1.76, 0.56, 0.22, 0.14, 0.21], [5.71, 1.89, 0.60, 0.24, 0.15, 0.22],
    [6.19, 2.04, 0.65, 0.26, 0.16, 0.24], [6.66, 2.20, 0.70, 0.28, 0.17, 0.26],
    [7.14, 2.36, 0.75, 0.30, 0.18, 0.28], [7.62, 2.52, 0.80, 0.32, 0.20, 0.30],
    [8.38, 2.77, 0.88, 0.35, 0.22, 0.33], [9.14, 3.02, 0.96, 0.38, 0.24, 0.36],
];
const TALENT = [
    [0.10, 0.40, 0.80, 0.12, 1.00, 0.18], [0.11, 0.44, 0.88, 0.13, 1.10, 0.19],
    [0.12, 0.48, 0.96, 0.14, 1.20, 0.20], [0.13, 0.52, 1.04, 0.15, 1.30, 0.22],
    [0.14, 0.56, 1.12, 0.16, 1.40, 0.23], [0.15, 0.60, 1.20, 0.18, 1.50, 0.25],
    [0.16, 0.65, 1.30, 0.19, 1.62, 0.26], [0.17, 0.70, 1.40, 0.21, 1.75, 0.28],
    [0.18, 0.75, 1.50, 0.22, 1.87, 0.30], [0.20, 0.80, 1.60, 0.24, 2.00, 0.32],
    [0.22, 0.88, 1.76, 0.26, 2.20, 0.35], [0.24, 0.96, 1.92, 0.29, 2.40, 0.38],
];

addCharacterDefinition({
    id: 'himeko_nova',
    name: '姫子・旅立ち',
    element: ELEMENT.FIRE,
    path: PATH.ERUDITION,
    rarity: 5,
    base: { atk: 756, hp: 1125, def: 485, spd: 98, aggro: 75 },
    maxEnergy: 150,

    traces: {
        stats: {
            [STAT.ATK_PERCENT]: 0.28,
            [STAT.CRIT_RATE]: 0.12,
            [ELEMENT_DMG_KEYS.fire]: 0.08,
        },
        breakdown: [
            { node: '攻撃強化', stat: STAT.ATK_PERCENT, value: 0.28 },
            { node: '会心率強化', stat: STAT.CRIT_RATE, value: 0.12 },
            { node: 'ダメージ強化・炎', stat: ELEMENT_DMG_KEYS.fire, value: 0.08 },
        ],
    },

    eidolons: {},
    eidolonsDetail: {
        1: { name: '道と呼ばれるものこそ開拓', description: '天賦の追加支援スキルの発動可能回数+1。同行協定ごとの必要条件を緩和し、支援スキルの追加ヒット数+1。' },
        2: { name: '旗は下ろされることなき帆', description: '支援スキルの上限が2回に上昇。必殺技と支援スキルの与ダメージは本来の130%になる。' },
        3: { name: '星の子も星に思いを馳せる', description: '必殺技Lv.+2、通常攻撃Lv.+1。', levelBoost: { ult: 2, basic: 1 } },
        4: { name: '空へ伸ばされる手を取って', description: '天賦の耐性貫通が味方全体に有効となり、姫子自身はさらに全耐性貫通+10%。' },
        5: { name: '宇宙を全て踏破する', description: '戦闘スキルLv.+2、天賦Lv.+2。', levelBoost: { skill: 2, talent: 2 } },
        6: { name: '群星に辿り着く誓いを胸に', description: '炎属性耐性貫通+20%。原動力上限+3。支援スキルダメージを強化する。' },
    },

    skills: {
        basic: {
            name: 'はじまりの航路標識を灯して', type: 'attack', target: 'single', element: ELEMENT.FIRE,
            spGain: 1, energyGain: 20, toughness: 10, hitSplit: [1.0],
            description: '敵単体に姫子・旅立ちの攻撃力X%分の炎属性ダメージを与える。',
            maxLevel: { default: 6, withEidolon: 7 },
            levels: [0.50, 0.60, 0.70, 0.80, 0.90, 1.00, 1.10].map(atk => ({ atk })),
        },
        skill: {
            name: '立ち昇る導きの狼煙', type: 'buff', target: 'all_ally', spCost: 1, energyGain: 30, toughness: 0,
            description: '支援スキルの使用回数を全回復し、「導く旗印」を3ターン獲得する。旗印中、味方全体の与ダメージ+X%。',
            maxLevel: { default: 10, withEidolon: 12 },
            levels: SKILL_DMG.map(dmgBuff => ({ dmgBuff })),
        },
        ult: {
            name: '我ら、星を追う巨人', type: 'attack', target: 'all', element: ELEMENT.FIRE,
            energyCost: 150, energyGain: 5, spCost: 0, toughness: 30, hitSplit: [1.0],
            description: '「星を拓く者」を操縦し、超光速粒子ビームと軌道殲滅パルス砲で攻撃する。ラストアタックはランダムな敵単体に3ヒットする。',
            maxLevel: { default: 10, withEidolon: 12 },
            levels: ULT.map(([atkSingle, atkOther, atkLast, beamAtk, pulseAtk, bounceAtk]) => ({ atkSingle, atkOther, atkLast, beamAtk, pulseAtk, bounceAtk })),
        },
        talent: {
            name: '共に灼熱の遠征へ', type: 'passive', target: 'all_ally',
            description: '「星開きの視界」を展開し、味方に支援スキルを与える。姫子・旅立ちは全耐性貫通+X%、会心ダメージ+Y%。支援スキルは敵全体を攻撃する。',
            maxLevel: { default: 10, withEidolon: 12 },
            levels: TALENT.map(([resPen, critDmg, allyAtk, allyBounce, selfAtk, selfBounce]) => ({ resPen, critDmg, allyAtk, allyBounce, selfAtk, selfBounce })),
        },
        technique: {
            name: '星を拓く巡航', type: 'support',
            description: '30秒間「巡航」状態になり、各ウェーブ開始時に戦闘スキルを1回発動する。',
        },
    },

    selfEffects: [
        {
            id: 'himeko_nova_talent_self', source: 'talent', name: '天賦: 全耐性貫通・会心ダメージ',
            description: 'フィールド上で「星開きの視界」を展開中、姫子・旅立ちの全属性耐性貫通+20%、会心ダメージ+80%（天賦Lv.10）。',
            stats: { [STAT.RES_PEN]: 0.20, [STAT.CRIT_DMG]: 0.80 }, defaultActive: true,
        },
    ],
    partyEffects: [
        {
            id: 'himeko_nova_skill_dmg', source: 'skill', name: '「導く旗印」与ダメージ',
            description: '戦闘スキル後、味方全体の与ダメージ+X%、3ターン。', fromLevel: 'skill',
            computeStats: (_lv, mult) => ({ [STAT.DMG_ALL]: mult?.dmgBuff ?? 0 }),
            defaultActive: false, target: 'all', duration: 3, tickRule: 'caster_turn_end', dispellable: false,
        },
    ],
    wiki: {
        listUrl: 'https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7',
        pageUrl: 'https://wikiwiki.jp/star-rail/%E5%A7%AB%E5%AD%90%E3%83%BB%E6%97%85%E7%AB%8B%E3%81%A1',
        version: '4.4',
    },
});
