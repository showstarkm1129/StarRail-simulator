// diminishing.js — 限界効用逓減の計算エンジン
//
// 役割:
//   2つのビルド(現状 vs 仮想)から「火力に対する貢献率」を計算する。
//   通常ダメージ式の各乗算枠ごとに比率を出し、その積から総合貢献率を算出。
//
// 重要な設計判断 (memory: project_diminishing_scope):
//   - 火力(ダメージ)への貢献率のみを扱う。
//   - SPD変化による行動回数増減は火力換算に含めない(必殺発動可否などで単純比例にならないため)。
//     SPD変化は info.spdDelta として情報表示のみ。
//
// 通常ダメージ式 (最初の計画.md 第0節):
//   damage = base × crit × dmgBonus × def × res × taken × break
//   base = ref_stat × skill_mult + flat_addition
//
// ビルド変更で典型的に変わる枠:
//   - ref_stat (atk/hp/def): 装備変更で大きく動く
//   - crit_factor:           CR/CD サブステ・メインステ
//   - dmgBonus_factor:       球の元素ダメ%、与ダメバフ
//   - def_factor:            防御無視/防御Down系装備・デバフ
//   - res_factor:            耐性貫通系装備・耐性Down系デバフ
//   - break_factor:          靭性状態に依存(本ツールでは固定値で扱う)
//   - taken_factor:          被ダメ増デバフ(攻撃者から見た敵側の係数。本ツールで対象に追加)

import { StatComputer } from './statComputer.js';
import { STAT, STAT_DEFAULTS, ALL_STAT_KEYS, makeElementDmgKey } from './statKeys.js';
import { DAMAGE_SCALE, DAMAGE_SCALE_LIST } from './constants.js';
import { isEidolonCandidate } from './buildCandidates.js';

// ---- デフォルト前提 -----------------------------------------------------

/**
 * ダメージ係数算出オプション。
 * @typedef {Object} DamageOptions
 * @property {'atk'|'hp'|'def'|'spd'} refStat   スキル倍率の参照ステータス (分類指定時は主分類を優先)
 * @property {'atk'|'hp'|'break'|'elation'|null} damageScale キャラクターの主な火力計算系統
 * @property {number} enemyLevel                防御係数算出用の敵レベル
 * @property {number} enemyBaseRes              属性耐性係数算出用の敵基礎耐性
 * @property {'expected'|'crit'} critMode       期待値 or 確定会心
 * @property {'normal'|'broken'} breakState     靭性残 (0.9) or 撃破中 (1.0)
 * @property {string|null} elementOverride      null なら character.element を使用
 * @property {Object} referenceValues            スキル固有の参照値
 */

/** @type {DamageOptions} */
const DEFAULT_OPTIONS = Object.freeze({
    refStat: 'atk',         // 'atk' | 'hp' | 'def' | 'spd' (手動指定時の参照ステータス)
    enemyLevel: 80,         // 防御係数算出用
    enemyBaseRes: 0,        // 属性耐性係数算出用 (0 = 弱点扱い、0.2 = 非弱点等)
    critMode: 'expected',   // 'expected' | 'crit' (期待値 or 確定会心)
    breakState: 'normal',   // 'normal' (靭性残: 0.9) | 'broken' (撃破中: 1.0)
    elementOverride: null,  // null なら character.element を使う
    damageScale: null,
    // スキル固有の参照値。未入力値は 0 として扱い、通常攻撃の計算には影響しない。
    referenceValues: Object.freeze({
        cumulativeHealing: 0,
        summonHp: 0,
        gluttonyStacks: 0,
        elationDegree: 0,
        elationStacks: 0,
        elationUplift: 0,
    }),
});

const ELATION_LEVEL_BASE = 1;

function resolveDamageScale(finalStats, opts) {
    if (DAMAGE_SCALE_LIST.includes(opts.damageScale)) return opts.damageScale;
    if (DAMAGE_SCALE_LIST.includes(finalStats?.meta?.damageScale)) {
        return finalStats.meta.damageScale;
    }
    if (opts.refStat === 'hp') return DAMAGE_SCALE.HP;
    return DAMAGE_SCALE.ATK;
}

function elationFactor(referenceValues = {}) {
    const degree = Math.max(0, Number(referenceValues.elationDegree) || 0);
    const stacks = Math.max(0, Number(referenceValues.elationStacks) || 0);
    const uplift = Math.max(0, Number(referenceValues.elationUplift) || 0);
    const tokenFactor = 1 + (5 * stacks) / (240 + stacks);
    return ELATION_LEVEL_BASE * (1 + degree) * (1 + uplift) * tokenFactor;
}

// スキル種別 breakdown 用の key 一覧。base = 共通枠のみ。
const DMG_TYPE_KEYS = ['base', 'basic', 'skill', 'ult', 'followup'];

const TYPE_SPECIFIC_STATS = Object.freeze({
    critRate: {
        basic: STAT.CRIT_RATE_BASIC,
        skill: STAT.CRIT_RATE_SKILL,
        ult: STAT.CRIT_RATE_ULT,
        followup: STAT.CRIT_RATE_FOLLOWUP,
    },
    critDmg: {
        basic: STAT.CRIT_DMG_BASIC,
        skill: STAT.CRIT_DMG_SKILL,
        ult: STAT.CRIT_DMG_ULT,
        followup: STAT.CRIT_DMG_FOLLOWUP,
    },
    defIgnore: {
        basic: STAT.DEF_IGNORE_BASIC,
        skill: STAT.DEF_IGNORE_SKILL,
        ult: STAT.DEF_IGNORE_ULT,
        followup: STAT.DEF_IGNORE_FOLLOWUP,
    },
    resPen: {
        basic: STAT.RES_PEN_BASIC,
        skill: STAT.RES_PEN_SKILL,
        ult: STAT.RES_PEN_ULT,
        followup: STAT.RES_PEN_FOLLOWUP,
    },
    dmgTaken: {
        basic: STAT.DMG_TAKEN_BASIC,
        skill: STAT.DMG_TAKEN_SKILL,
        ult: STAT.DMG_TAKEN_ULT,
        followup: STAT.DMG_TAKEN_FOLLOWUP,
    },
});

function typeStat(raw, family, type) {
    const key = TYPE_SPECIFIC_STATS[family]?.[type];
    return key ? (raw[key] || 0) : 0;
}

function makeFactorRows(beforeRows, afterRows) {
    const out = {};
    for (const t of DMG_TYPE_KEYS) {
        const b = beforeRows[t];
        const a = afterRows[t];
        const ratio = b > 0 ? (a / b) : 0;
        out[t] = {
            before: b,
            after: a,
            ratio,
            contribution: ratio - 1,
        };
    }
    return out;
}

// ---- 公開 API ----------------------------------------------------------

export const Diminishing = Object.freeze({
    DEFAULT_OPTIONS,
    compareBuilds,
    compareStats,
    compareWithModification,
    rankCandidates,
    // 直接ステ入力モード用 (生ステータス → FinalStats 互換オブジェクト)
    directStatsToFinalStats,
    // ヘルパ
    cloneBuild,
    swapRelicMain,
    setRelicSet,
    setSubs,
    addSub,
    setLightcone,
    setEidolon,
    addEnvBuff,
    // 単一ビルド向けの単独計算 (デバッグ・他ツール用)
    computeDamageFactors,
});

// ---- メイン: ビルド比較 -------------------------------------------------

// before と after の2ビルドを比較して、火力貢献率 + 情報表示用デルタを返す。
//   返り値:
//     {
//       beforeStats, afterStats,           // FinalStats そのまま
//       factors: {
//         atk:       { before, after, ratio, contribution },  // ratio = after/before, contribution = ratio - 1
//         crit:      { before, after, ratio, contribution },
//         dmgBonus:  { before, after, ratio, contribution },
//         def:       { before, after, ratio, contribution },  // 防御無視 + 防御Down (敵デバフ)
//         res:       { before, after, ratio, contribution },  // 耐性貫通 + 耐性Down (敵デバフ)
//         taken:     { before, after, ratio, contribution },  // 被ダメ増 (敵デバフ)
//         break:     { before, after, ratio, contribution },
//         total:     { ratio, contribution },                 // 全枠の積
//       },
//       info: {
//         spdDelta:  number,  // SPD増減 (注意: 火力換算しない)
//         hpDelta:   number,
//         defDelta:  number,
//         epRegenDelta: number,
//       },
//       options: 適用オプション
//     }
function compareBuilds(buildBefore, buildAfter, opts = {}) {
    const beforeStats = StatComputer.compute(buildBefore);
    const afterStats  = StatComputer.compute(buildAfter);
    return compareStats(beforeStats, afterStats, opts);
}

// FinalStats 同士を直接比較する (compareBuilds の内部実体)。
//   直接ステ入力モードでは StatComputer を介さず directStatsToFinalStats() の
//   結果をそのまま渡せる。
function compareStats(beforeStats, afterStats, opts = {}) {
    const options = { ...DEFAULT_OPTIONS, ...opts };

    const beforeFactors = computeDamageFactors(beforeStats, options);
    const afterFactors  = computeDamageFactors(afterStats,  options);

    const factors = {};
    for (const key of ['atk', 'crit', 'dmgBonus', 'def', 'res', 'taken', 'break', 'fixedDmg', 'sepMult']) {
        const b = beforeFactors[key];
        const a = afterFactors[key];
        const ratio = b > 0 ? (a / b) : 0;
        factors[key] = {
            before: b,
            after: a,
            ratio,
            contribution: ratio - 1,
        };
    }

    // スキル種別 breakdown — 与ダメ/会心/防御/耐性/被ダメを種別別に比較
    factors.dmgBonusByType = makeFactorRows(beforeFactors.dmgBonusByType, afterFactors.dmgBonusByType);
    factors.critByType = makeFactorRows(beforeFactors.critByType, afterFactors.critByType);
    factors.defByType = makeFactorRows(beforeFactors.defByType, afterFactors.defByType);
    factors.resByType = makeFactorRows(beforeFactors.resByType, afterFactors.resByType);
    factors.takenByType = makeFactorRows(beforeFactors.takenByType, afterFactors.takenByType);
    factors.damageScale = beforeFactors.damageScale;
    factors.breakEffect = makeFactor(beforeFactors.breakEffect, afterFactors.breakEffect);
    factors.elation = makeFactor(beforeFactors.elation, afterFactors.elation);

    // 火力総合 (種別別) = atk × critByType[t] × dmgBonusByType[t] × defByType[t]
    //                     × resByType[t] × takenByType[t] × break × fixedDmg × sepMult
    //   factors.total は factors.totals.base のエイリアスとして残す (後方互換)
    factors.totals = {};
    const sharedRatio = factors.atk.ratio * factors.break.ratio
                       * factors.fixedDmg.ratio * factors.sepMult.ratio;
    for (const t of DMG_TYPE_KEYS) {
        const r = sharedRatio
            * factors.critByType[t].ratio
            * factors.dmgBonusByType[t].ratio
            * factors.defByType[t].ratio
            * factors.resByType[t].ratio
            * factors.takenByType[t].ratio;
        factors.totals[t] = {
            ratio: r,
            contribution: r - 1,
        };
    }
    factors.total = factors.totals.base;

    return {
        beforeStats,
        afterStats,
        factors,
        info: {
            spdDelta:     afterStats.derived.spd - beforeStats.derived.spd,
            hpDelta:      afterStats.derived.hp  - beforeStats.derived.hp,
            defDelta:     afterStats.derived.def - beforeStats.derived.def,
            epRegenDelta: afterStats.derived.energyRegenPct - beforeStats.derived.energyRegenPct,
        },
        options: { ...options, damageScale: beforeFactors.damageScale },
    };
}

function makeFactor(before, after) {
    const ratio = before > 0 ? after / before : 0;
    return {
        before,
        after,
        ratio,
        contribution: ratio - 1,
    };
}

// 「Build を編集する関数」を渡して比較する糖衣構文。
//   compareWithModification(build, b => swapRelicMain(b, 'feet', 'atk_percent'), options)
function compareWithModification(buildBefore, modifyFn, opts = {}) {
    const buildAfter = modifyFn(cloneBuild(buildBefore));
    return compareBuilds(buildBefore, buildAfter, opts);
}

// ---- 候補比較 (差し替え候補チップ用) ------------------------------------

// 候補一覧を「現状ビルドとの火力貢献率」つきでランキングする。
//   candidates: 呼び出し側が自由に定義する候補オブジェクト配列 (例: [{ id: 1 }, { id: 2 }])
//   computeCandidateStats(candidate) => FinalStats  候補を適用した場合の最終ステータスを返す関数
// 戻り値: 各候補に contribution / spdDelta / error を付与し、貢献率降順でソートした配列。
//   計算に失敗した候補は contribution=null にして末尾へ回す。
function rankCandidates(baseStats, candidates, computeCandidateStats, opts = {}) {
    const results = candidates.map(candidate => {
        if (isEidolonCandidate(candidate)) {
            return {
                ...candidate,
                contribution: null,
                spdDelta: null,
                error: null,
                excludedReason: 'eidolon',
            };
        }
        try {
            const afterStats = computeCandidateStats(candidate);
            const cmp = compareStats(baseStats, afterStats, opts);
            return {
                ...candidate,
                contribution: cmp.factors.total.contribution,
                spdDelta: cmp.info.spdDelta,
                error: null,
                excludedReason: null,
            };
        } catch (error) {
            return { ...candidate, contribution: null, spdDelta: null, error, excludedReason: null };
        }
    });
    return results.sort((a, b) => (b.contribution ?? -Infinity) - (a.contribution ?? -Infinity));
}

// ---- ダメージ係数の算出 -------------------------------------------------

// 1ビルドの FinalStats から、ダメージ式の各乗算枠の数値を求める。
//   返り値: { atk, crit, dmgBonus, def, res, taken, break, fixedDmg, sepMult }
function computeDamageFactors(finalStats, opts = DEFAULT_OPTIONS) {
    const r = finalStats.raw;
    const d = finalStats.derived;
    const element = opts.elementOverride || finalStats.meta.element;
    const damageScale = resolveDamageScale(finalStats, opts);
    const isBreakScale = damageScale === DAMAGE_SCALE.BREAK;
    const isElationScale = damageScale === DAMAGE_SCALE.ELATION;
    const isHpScale = damageScale === DAMAGE_SCALE.HP;

    // ref_stat: スキルの参照ステータス
    const refStatValue = (() => {
        if (isBreakScale) return 1 + (r[STAT.BREAK_EFFECT] || 0);
        if (isElationScale) return elationFactor(opts.referenceValues);
        if (isHpScale) return d.hp;
        switch (opts.refStat) {
            case 'hp':  return d.hp;
            case 'def': return d.def;
            case 'spd': return d.spd;
            case 'atk':
            default:    return d.atk;
        }
    })();

    // 会心係数 (期待値 or 確定)
    const baseCr = STAT_DEFAULTS.CRIT_RATE_BASE + r[STAT.CRIT_RATE];
    const baseCd = STAT_DEFAULTS.CRIT_DMG_BASE  + r[STAT.CRIT_DMG];
    const critFactorForType = (type) => {
        if (isBreakScale) return 1;
        const cr = baseCr + typeStat(r, 'critRate', type);
        const cd = baseCd + typeStat(r, 'critDmg', type);
        return opts.critMode === 'crit'
            ? (1 + cd)
            : (1 + Math.min(cr, 1.0) * cd);
    };
    const critByType = Object.fromEntries(DMG_TYPE_KEYS.map(t => [t, critFactorForType(t)]));
    const critFactor = critByType.base;

    // 与ダメージ係数 (全属性共通 + 自属性別枠) — base
    //   さらにスキル種別ダメ枠 (DMG_BASIC/SKILL/ULT/FOLLOWUP) を加算した
    //   種別別の dmgBonusByType を別途算出する。
    const elementKey = element ? makeElementDmgKey(element) : null;
    const baseBonus = r[STAT.DMG_ALL] + (elementKey ? (r[elementKey] || 0) : 0);
    const dmgFactor = isBreakScale || isElationScale ? 1 : 1 + baseBonus;
    const dmgBonusByType = isBreakScale || isElationScale
        ? Object.fromEntries(DMG_TYPE_KEYS.map(type => [type, 1]))
        : {
            base:     1 + baseBonus,
            basic:    1 + baseBonus + (r[STAT.DMG_BASIC]    || 0),
            skill:    1 + baseBonus + (r[STAT.DMG_SKILL]    || 0),
            ult:      1 + baseBonus + (r[STAT.DMG_ULT]      || 0),
            followup: 1 + baseBonus + (r[STAT.DMG_FOLLOWUP] || 0),
        };

    // 防御係数 (Lv80固定: 100 / ((20 + 敵Lv) × (1 - 防御Down - 防御無視) + 100))
    const defFactorForType = (type) => {
        const defReduction = Math.min(1.0, r[STAT.DEF_DOWN] + r[STAT.DEF_IGNORE] + typeStat(r, 'defIgnore', type));
        return 100 / ((20 + opts.enemyLevel) * (1 - defReduction) + 100);
    };
    const defByType = Object.fromEntries(DMG_TYPE_KEYS.map(t => [t, defFactorForType(t)]));
    const defFactor = defByType.base;

    // 属性耐性係数 (1 - (敵基礎耐性 - 耐性貫通))
    const resByType = Object.fromEntries(DMG_TYPE_KEYS.map(t => [
        t,
        1 - (opts.enemyBaseRes - (r[STAT.RES_PEN] + typeStat(r, 'resPen', t))),
    ]));
    const resFactor = resByType.base;

    // 被ダメ係数 (敵側デバフ: 被ダメ増・脆弱化付与など)
    //   damage *= (1 + DMG_TAKEN)
    //   注: STAT.DMG_TAKEN は敵の受けるダメージ係数として envBuffs 等で正の値で加算される
    const takenByType = Object.fromEntries(DMG_TYPE_KEYS.map(t => [
        t,
        1 + (r[STAT.DMG_TAKEN] || 0) + typeStat(r, 'dmgTaken', t),
    ]));
    const takenFactor = takenByType.base;

    // 確定ダメージ
    const fixedDmgFactor = isBreakScale || isElationScale ? 1 : 1 + (r[STAT.FIXED_DMG] || 0);

    // 別枠乗算
    const sepMultFactor = isBreakScale || isElationScale ? 1 : 1 + (r[STAT.SEP_MULT] || 0);

    // 撃破係数 (靭性が残ってるなら 0.9、撃破中なら 1.0)
    const breakFactor = opts.breakState === 'broken' ? 1.0 : 0.9;

    return {
        // 既存UIとの互換のためキー名は atk のまま返す。値は分類に応じた
        // 主係数であり、HP/撃破/愉悦では攻撃力そのものではない。
        atk: refStatValue,
        scaling: refStatValue,
        damageScale,
        breakEffect: 1 + (r[STAT.BREAK_EFFECT] || 0),
        elation: isElationScale ? refStatValue : 1,
        crit: critFactor,
        critByType,
        dmgBonus: dmgFactor,      // = dmgBonusByType.base (後方互換)
        dmgBonusByType,           // 新規 — スキル種別 breakdown 表示用
        def: defFactor,
        defByType,
        res: resFactor,
        resByType,
        taken: takenFactor,
        takenByType,
        break: breakFactor,
        fixedDmg: fixedDmgFactor,
        sepMult: sepMultFactor,
    };
}

// ---- 直接ステ入力モード ------------------------------------------------
//
// 遺物のメインステ/サブステからビルドを積み上げず、最終ステータスを直接受け取って
// FinalStats 互換オブジェクト ({ raw, derived, meta }) を組み立てる。
//   - 軌跡・パーティバフ・セット効果は一切載らない (入力値が最終値そのもの)。
//   - computeDamageFactors / STATS 表示 がそのまま使える形に整える。
//
// 入力 direct のキー (すべて小数。% は 0.25 = 25%):
//   atk, hp, def, spd                          基礎ステ (最終値)
//   critRate, critDmg                          会心 (基礎 5% / 50% 込みの最終値)
//   critRateBasic/Skill/Ult/Followup           スキル種別会心率
//   critDmgBasic/Skill/Ult/Followup            スキル種別会心ダメ
//   dmgAll                                     与ダメージ% (共通+属性をまとめた値)
//   dmgBasic, dmgSkill, dmgUlt, dmgFollowup    スキル種別ダメ枠
//   fixedDmg, sepMult                          確定ダメージ / 別枠乗算
//   defDown, defIgnore, resPen, dmgTaken       デバフ系
//   defIgnoreBasic/Skill/Ult/Followup          スキル種別防御無視
//   resPenBasic/Skill/Ult/Followup             スキル種別耐性貫通
//   dmgTakenBasic/Skill/Ult/Followup           スキル種別被ダメ増
//   breakEffect, energyRegen, ehr, eres        その他 (energyRegen は 100% 込みの最終値)
function directStatsToFinalStats(direct = {}) {
    const g = (k) => {
        const v = Number(direct[k]);
        return Number.isFinite(v) ? v : 0;
    };

    const raw = {};
    for (const k of ALL_STAT_KEYS) raw[k] = 0;

    // 会心・EP回復は「基礎込みの最終値」を受け取り、raw 側は加算分に戻す
    // (computeDamageFactors / finalize が BASE を再加算するため二重計上を避ける)。
    const critRate = g('critRate');
    const critDmg  = g('critDmg');
    const energyRegen = g('energyRegen');

    raw[STAT.CRIT_RATE]       = critRate - STAT_DEFAULTS.CRIT_RATE_BASE;
    raw[STAT.CRIT_DMG]        = critDmg  - STAT_DEFAULTS.CRIT_DMG_BASE;
    raw[STAT.CRIT_RATE_BASIC]    = g('critRateBasic');
    raw[STAT.CRIT_RATE_SKILL]    = g('critRateSkill');
    raw[STAT.CRIT_RATE_ULT]      = g('critRateUlt');
    raw[STAT.CRIT_RATE_FOLLOWUP] = g('critRateFollowup');
    raw[STAT.CRIT_DMG_BASIC]     = g('critDmgBasic');
    raw[STAT.CRIT_DMG_SKILL]     = g('critDmgSkill');
    raw[STAT.CRIT_DMG_ULT]       = g('critDmgUlt');
    raw[STAT.CRIT_DMG_FOLLOWUP]  = g('critDmgFollowup');
    raw[STAT.ENERGY_REGEN]    = energyRegen - STAT_DEFAULTS.ENERGY_REGEN_BASE;
    raw[STAT.DMG_ALL]         = g('dmgAll');
    raw[STAT.DMG_BASIC]       = g('dmgBasic');
    raw[STAT.DMG_SKILL]       = g('dmgSkill');
    raw[STAT.DMG_ULT]         = g('dmgUlt');
    raw[STAT.DMG_FOLLOWUP]    = g('dmgFollowup');
    raw[STAT.FIXED_DMG]       = g('fixedDmg');
    raw[STAT.SEP_MULT]        = g('sepMult');
    raw[STAT.DEF_DOWN]        = g('defDown');
    raw[STAT.DEF_IGNORE]      = g('defIgnore');
    raw[STAT.DEF_IGNORE_BASIC]    = g('defIgnoreBasic');
    raw[STAT.DEF_IGNORE_SKILL]    = g('defIgnoreSkill');
    raw[STAT.DEF_IGNORE_ULT]      = g('defIgnoreUlt');
    raw[STAT.DEF_IGNORE_FOLLOWUP] = g('defIgnoreFollowup');
    raw[STAT.RES_PEN]         = g('resPen');
    raw[STAT.RES_PEN_BASIC]    = g('resPenBasic');
    raw[STAT.RES_PEN_SKILL]    = g('resPenSkill');
    raw[STAT.RES_PEN_ULT]      = g('resPenUlt');
    raw[STAT.RES_PEN_FOLLOWUP] = g('resPenFollowup');
    raw[STAT.DMG_TAKEN]       = g('dmgTaken');
    raw[STAT.DMG_TAKEN_BASIC]    = g('dmgTakenBasic');
    raw[STAT.DMG_TAKEN_SKILL]    = g('dmgTakenSkill');
    raw[STAT.DMG_TAKEN_ULT]      = g('dmgTakenUlt');
    raw[STAT.DMG_TAKEN_FOLLOWUP] = g('dmgTakenFollowup');
    raw[STAT.BREAK_EFFECT]    = g('breakEffect');
    raw[STAT.EFFECT_HIT_RATE] = g('ehr');
    raw[STAT.EFFECT_RES]      = g('eres');

    const atk = g('atk'), hp = g('hp'), def = g('def'), spd = g('spd');
    const derived = {
        atk, hp, def, spd,
        // 速度が未入力のときは行動値を推測しない。null は「算出不能」を表し、
        // JSON化とAI結果検証でも非有限値を持ち込まない。
        speedAV: spd > 0 ? 10000 / spd : null,
        critRate,
        critDmg,
        critExpected: 1 + Math.min(critRate, 1.0) * critDmg,
        energyRegenPct: energyRegen,
        dmgOwnElement: raw[STAT.DMG_ALL],         // element=null のため共通枠のみ
        breakEffectPct: 1 + raw[STAT.BREAK_EFFECT],
        dmgByElement: {},
    };

    return {
        raw,
        derived,
        contributions: {},
        // element=null にすると computeDamageFactors の与ダメ枠は dmgAll のみ参照する
        meta: {
            characterId: null, element: null, path: null,
            lightconeId: null, superimpose: null, eidolon: 0,
        },
    };
}

// ---- ビルド操作ヘルパ (immutable) ---------------------------------------

function cloneBuild(build) {
    // 構造は浅いオブジェクト + relics の各スロットも浅いオブジェクト
    // JSON 経由のディープクローンで十分(関数を含まない素直なデータ構造)
    return JSON.parse(JSON.stringify(build));
}

function swapRelicMain(build, slot, newMainStat) {
    const next = cloneBuild(build);
    if (!next.relics?.[slot]) {
        throw new Error(`[diminishing] slot "${slot}" がビルドに存在しません`);
    }
    next.relics[slot].mainStat = newMainStat;
    return next;
}

function setRelicSet(build, slot, newSetId) {
    const next = cloneBuild(build);
    if (!next.relics?.[slot]) {
        throw new Error(`[diminishing] slot "${slot}" がビルドに存在しません`);
    }
    next.relics[slot].setId = newSetId;
    return next;
}

function setSubs(build, slot, subs) {
    const next = cloneBuild(build);
    if (!next.relics?.[slot]) {
        throw new Error(`[diminishing] slot "${slot}" がビルドに存在しません`);
    }
    next.relics[slot].subs = { ...subs };
    return next;
}

function addSub(build, slot, subKey, deltaValue) {
    const next = cloneBuild(build);
    if (!next.relics?.[slot]) {
        throw new Error(`[diminishing] slot "${slot}" がビルドに存在しません`);
    }
    const subs = next.relics[slot].subs ||= {};
    subs[subKey] = (subs[subKey] || 0) + deltaValue;
    return next;
}

function setLightcone(build, lcId, superimpose) {
    const next = cloneBuild(build);
    next.lightcone = { id: lcId, superimpose: superimpose ?? next.lightcone?.superimpose ?? 1 };
    return next;
}

function setEidolon(build, eidolon) {
    const next = cloneBuild(build);
    next.eidolon = Math.max(0, Math.min(6, eidolon));
    return next;
}

function addEnvBuff(build, stat, value, label) {
    const next = cloneBuild(build);
    next.envBuffs = [...(next.envBuffs || []), { stat, value, label: label || stat }];
    return next;
}
