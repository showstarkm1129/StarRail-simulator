// FinalStats の枠キー定数 — 全データ層がここの定数を参照する。
// 文字列リテラルを直接書かないこと(タイポ防止)。
//
// 設計指針:
//   - ATK/HP/DEF/SPD は BASE/PERCENT/FLAT の3枠を必ず分離
//     最終値 = base × (1 + percent合計) + flat合計
//   - 与ダメージ係数枠 (DMG_*) は属性別と全属性共通を分離。合算は計算時。
//   - 防御係数枠 (DEF_DOWN / DEF_IGNORE) は同枠加算
//   - 耐性貫通 (RES_PEN) は属性耐性係数枠
//   - 各乗算枠は独立して保持し、ダメージ計算/限界効用逓減で必要な枠だけ参照する

import { ELEMENT_LIST } from './constants.js';

export const STAT = Object.freeze({
    // 攻撃力
    ATK_BASE: 'atkBase',
    ATK_PERCENT: 'atkPercent',
    ATK_FLAT: 'atkFlat',
    // HP
    HP_BASE: 'hpBase',
    HP_PERCENT: 'hpPercent',
    HP_FLAT: 'hpFlat',
    // 防御力
    DEF_BASE: 'defBase',
    DEF_PERCENT: 'defPercent',
    DEF_FLAT: 'defFlat',
    // 速度
    SPD_BASE: 'spdBase',
    SPD_PERCENT: 'spdPercent',
    SPD_FLAT: 'spdFlat',
    // 会心 (会心率はゲーム既定 5%、会心ダメは既定 50% を derived で加算)
    CRIT_RATE: 'critRate',
    CRIT_DMG: 'critDmg',
    // 与ダメ枠
    DMG_ALL: 'dmgAll',                  // 全属性共通
    // 属性別ダメ枠は makeElementDmgKey() で生成 → 'dmgFire' 等
    // 防御係数枠
    DEF_DOWN: 'defDown',
    DEF_IGNORE: 'defIgnore',
    // 属性耐性係数枠
    RES_PEN: 'resPen',
    // 被ダメ係数枠
    DMG_TAKEN: 'dmgTaken',
    // 撃破特効
    BREAK_EFFECT: 'breakEffect',
    // EP回復効率 (ゲーム既定 100% に対する加算分。derived で 1 + energyRegen を返す)
    ENERGY_REGEN: 'energyRegen',
    // デバフ命中・抵抗
    EFFECT_HIT_RATE: 'ehr',
    EFFECT_RES: 'eres',
    // 治療
    HEAL_BONUS: 'healBonus',
    HEAL_TAKEN: 'healTaken',
});

// 属性別ダメージ枠キー(動的生成)
export function makeElementDmgKey(element) {
    return 'dmg' + element.charAt(0).toUpperCase() + element.slice(1);
}

// 属性別ダメ枠の一覧 ('dmgPhysical', 'dmgFire', ...) を作っておく
export const ELEMENT_DMG_KEYS = Object.freeze(
    ELEMENT_LIST.reduce((acc, el) => {
        acc[el] = makeElementDmgKey(el);
        return acc;
    }, {})
);

// FinalStats.raw の初期 0 セット用の全キー一覧
export const ALL_STAT_KEYS = Object.freeze([
    ...Object.values(STAT),
    ...Object.values(ELEMENT_DMG_KEYS),
]);

// ゲーム既定値(計算時に derived で乗せる)
export const STAT_DEFAULTS = Object.freeze({
    CRIT_RATE_BASE: 0.05,
    CRIT_DMG_BASE: 0.50,
    ENERGY_REGEN_BASE: 1.00,    // 100%
});

// 遺物メインステ用 ID → STAT 枠キーのマッピングは relicMainTable.js で定義する。
