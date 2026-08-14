// サブステ値テーブル (★5・Lv15 想定)
//
// ロール1回あたりの加算値を 低 / 中 / 高 の 3 段階で保持する。
// 強化ロールでは「既存サブステに +1 (= 1ロール) する」運用なので、
// この 1 単位の値を加算するだけで全パターンを表現できる。
//
// 出典: ユーザー提供のサブステータス表 (理論最大値は 1 部位あたり強化全集中 + 全大幅)
//   理論最大値 = max × 6 (初期1 + 強化5 = 1サブステに最大6ロール)
//
// 注意: %値は内部表現に合わせ「小数 0.034 = 3.4%」で格納する。
//       SPD は実数(2 = +2.0 速度)。

import { STAT } from './statKeys.js';

// 各サブステの 1 ロールあたり加算値
//   subKey       : SUBSTAT_KEYS のキー (ロジック側で参照する識別子)
//   stat         : STAT 枠キー (FinalStats / envBuffs に流す)
//   label        : UI 表示名
//   asPercent    : true なら %表示 (値は内部で小数保持、表示時 × 100)
//   low/mid/high : 1 ロールあたり加算値
//   max          : 1 部位の理論最大値 (high × 6) ※参考値、計算には未使用
export const SUBSTAT_TABLE = Object.freeze({
    HP_FLAT: {
        subKey: 'HP_FLAT',
        stat: STAT.HP_FLAT,
        label: 'HP実数',
        asPercent: false,
        low: 33, mid: 38, high: 42, max: 252,
    },
    ATK_FLAT: {
        subKey: 'ATK_FLAT',
        stat: STAT.ATK_FLAT,
        label: '攻撃力実数',
        asPercent: false,
        low: 16, mid: 19, high: 21, max: 126,
    },
    DEF_FLAT: {
        subKey: 'DEF_FLAT',
        stat: STAT.DEF_FLAT,
        label: '防御力実数',
        asPercent: false,
        low: 16, mid: 19, high: 21, max: 126,
    },
    HP_PERCENT: {
        subKey: 'HP_PERCENT',
        stat: STAT.HP_PERCENT,
        label: 'HP%',
        asPercent: true,
        low: 0.034, mid: 0.038, high: 0.043, max: 0.259,
    },
    ATK_PERCENT: {
        subKey: 'ATK_PERCENT',
        stat: STAT.ATK_PERCENT,
        label: '攻撃力%',
        asPercent: true,
        low: 0.034, mid: 0.038, high: 0.043, max: 0.259,
    },
    DEF_PERCENT: {
        subKey: 'DEF_PERCENT',
        stat: STAT.DEF_PERCENT,
        label: '防御力%',
        asPercent: true,
        low: 0.043, mid: 0.048, high: 0.054, max: 0.324,
    },
    CRIT_RATE: {
        subKey: 'CRIT_RATE',
        stat: STAT.CRIT_RATE,
        label: '会心率',
        asPercent: true,
        low: 0.025, mid: 0.029, high: 0.032, max: 0.194,
    },
    CRIT_DMG: {
        subKey: 'CRIT_DMG',
        stat: STAT.CRIT_DMG,
        label: '会心ダメ',
        asPercent: true,
        low: 0.051, mid: 0.058, high: 0.064, max: 0.388,
    },
    SPD_FLAT: {
        subKey: 'SPD_FLAT',
        stat: STAT.SPD_FLAT,
        label: '速度',
        asPercent: false,
        low: 2.0, mid: 2.3, high: 2.6, max: 15.6,
    },
    BREAK_EFFECT: {
        subKey: 'BREAK_EFFECT',
        stat: STAT.BREAK_EFFECT,
        label: '撃破特効',
        asPercent: true,
        low: 0.051, mid: 0.058, high: 0.064, max: 0.388,
    },
    EFFECT_HIT_RATE: {
        subKey: 'EFFECT_HIT_RATE',
        stat: STAT.EFFECT_HIT_RATE,
        label: '効果命中',
        asPercent: true,
        low: 0.034, mid: 0.038, high: 0.043, max: 0.259,
    },
    EFFECT_RES: {
        subKey: 'EFFECT_RES',
        stat: STAT.EFFECT_RES,
        label: '効果抵抗',
        asPercent: true,
        low: 0.034, mid: 0.038, high: 0.043, max: 0.259,
    },
});

// UI で扱う順序 (表示順を統一する)
export const SUBSTAT_ORDER = Object.freeze([
    'HP_FLAT', 'ATK_FLAT', 'DEF_FLAT',
    'HP_PERCENT', 'ATK_PERCENT', 'DEF_PERCENT',
    'CRIT_RATE', 'CRIT_DMG', 'SPD_FLAT',
    'BREAK_EFFECT', 'EFFECT_HIT_RATE', 'EFFECT_RES',
]);

// STAT 枠キーから subKey を逆引きするマップ (メインステ除外時に使用)
export const STAT_TO_SUB_KEY = Object.freeze(
    Object.values(SUBSTAT_TABLE).reduce((acc, def) => {
        acc[def.stat] = def.subKey;
        return acc;
    }, {})
);

// 1 ロールあたり加算値を tier に応じて取得
//   tier: 'low' | 'mid' | 'high' | 'random'
//   ランダム時は 低/中/高 から 1/3 ずつの確率で抽選
export function rollOneValue(subKey, tier, rng = Math.random) {
    const def = SUBSTAT_TABLE[subKey];
    if (!def) return 0;
    if (tier === 'low')  return def.low;
    if (tier === 'mid')  return def.mid;
    if (tier === 'high') return def.high;
    // random
    const r = Math.floor(rng() * 3);
    return r === 0 ? def.low : (r === 1 ? def.mid : def.high);
}
