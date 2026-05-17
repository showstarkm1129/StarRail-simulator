// 遺物メインステの取り得る種別と Lv15 (★5) 最大値のテーブル。
// 部位ごとに「許可される main 種別」と「Lv15 で固定される値」を持つ。
//
// UI 側はこのテーブルを読んで select の選択肢を動的生成する。
// statComputer は build.relics[slot].mainStat を引数に
// RELIC_MAIN_OPTIONS[slot][mainStat] を引いて加算する。
//
// 値の出典: ゲーム内 ★5 Lv15 メインステ実数(共通仕様)
//   - HP固定:    705.6
//   - ATK固定:   352.8
//   - HP%/ATK%:  43.20%
//   - DEF%:      54.00%
//   - 会心率:    32.40%
//   - 会心ダメ:  64.80%
//   - 治療効果:  34.56%
//   - EHR:       43.20%
//   - SPD固定:   25.032
//   - 元素ダメ%: 38.88%
//   - EP回復:    19.4%
//   - 撃破特効:  64.80%

import { STAT, ELEMENT_DMG_KEYS } from './statKeys.js';
import { SLOT } from './constants.js';

export const RELIC_MAIN_OPTIONS = Object.freeze({
    [SLOT.HEAD]: Object.freeze({
        hp_flat: { stat: STAT.HP_FLAT, max: 705.6, label: 'HP' },
    }),
    [SLOT.HANDS]: Object.freeze({
        atk_flat: { stat: STAT.ATK_FLAT, max: 352.8, label: '攻撃力' },
    }),
    [SLOT.BODY]: Object.freeze({
        hp_percent:  { stat: STAT.HP_PERCENT,       max: 0.4320, label: 'HP%' },
        atk_percent: { stat: STAT.ATK_PERCENT,      max: 0.4320, label: '攻撃力%' },
        def_percent: { stat: STAT.DEF_PERCENT,      max: 0.5400, label: '防御力%' },
        crit_rate:   { stat: STAT.CRIT_RATE,        max: 0.3240, label: '会心率' },
        crit_dmg:    { stat: STAT.CRIT_DMG,         max: 0.6480, label: '会心ダメ' },
        heal_bonus:  { stat: STAT.HEAL_BONUS,       max: 0.3456, label: '治療効果' },
        ehr:         { stat: STAT.EFFECT_HIT_RATE,  max: 0.4320, label: '効果命中' },
    }),
    [SLOT.FEET]: Object.freeze({
        hp_percent:  { stat: STAT.HP_PERCENT,  max: 0.4320, label: 'HP%' },
        atk_percent: { stat: STAT.ATK_PERCENT, max: 0.4320, label: '攻撃力%' },
        def_percent: { stat: STAT.DEF_PERCENT, max: 0.5400, label: '防御力%' },
        spd_flat:    { stat: STAT.SPD_FLAT,    max: 25.032, label: '速度' },
    }),
    [SLOT.SPHERE]: Object.freeze({
        hp_percent:    { stat: STAT.HP_PERCENT,           max: 0.4320, label: 'HP%' },
        atk_percent:   { stat: STAT.ATK_PERCENT,          max: 0.4320, label: '攻撃力%' },
        def_percent:   { stat: STAT.DEF_PERCENT,          max: 0.5400, label: '防御力%' },
        physical_dmg:  { stat: ELEMENT_DMG_KEYS.physical, max: 0.3888, label: '物理ダメ' },
        fire_dmg:      { stat: ELEMENT_DMG_KEYS.fire,     max: 0.3888, label: '炎ダメ' },
        ice_dmg:       { stat: ELEMENT_DMG_KEYS.ice,      max: 0.3888, label: '氷ダメ' },
        lightning_dmg: { stat: ELEMENT_DMG_KEYS.lightning,max: 0.3888, label: '雷ダメ' },
        wind_dmg:      { stat: ELEMENT_DMG_KEYS.wind,     max: 0.3888, label: '風ダメ' },
        quantum_dmg:   { stat: ELEMENT_DMG_KEYS.quantum,  max: 0.3888, label: '量子ダメ' },
        imaginary_dmg: { stat: ELEMENT_DMG_KEYS.imaginary,max: 0.3888, label: '虚数ダメ' },
    }),
    [SLOT.ROPE]: Object.freeze({
        hp_percent:   { stat: STAT.HP_PERCENT,   max: 0.4320, label: 'HP%' },
        atk_percent:  { stat: STAT.ATK_PERCENT,  max: 0.4320, label: '攻撃力%' },
        def_percent:  { stat: STAT.DEF_PERCENT,  max: 0.5400, label: '防御力%' },
        energy_regen: { stat: STAT.ENERGY_REGEN, max: 0.1944, label: 'EP回復効率' },
        break_effect: { stat: STAT.BREAK_EFFECT, max: 0.6480, label: '撃破特効' },
    }),
});

// 安全な引き出し: 不正な mainStat を渡されたら null を返す
export function getMainStatDef(slot, mainStatId) {
    const slotTable = RELIC_MAIN_OPTIONS[slot];
    if (!slotTable) return null;
    return slotTable[mainStatId] || null;
}
