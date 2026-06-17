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

// ---- デフォルト前提 -----------------------------------------------------

/**
 * ダメージ係数算出オプション。
 * @typedef {Object} DamageOptions
 * @property {'atk'|'hp'|'def'|'spd'} refStat   スキル倍率の参照ステータス
 * @property {number} enemyLevel                防御係数算出用の敵レベル
 * @property {number} enemyBaseRes              属性耐性係数算出用の敵基礎耐性
 * @property {'expected'|'crit'} critMode       期待値 or 確定会心
 * @property {'normal'|'broken'} breakState     靭性残 (0.9) or 撃破中 (1.0)
 * @property {string|null} elementOverride      null なら character.element を使用
 */

/** @type {DamageOptions} */
const DEFAULT_OPTIONS = Object.freeze({
    refStat: 'atk',         // 'atk' | 'hp' | 'def' | 'spd' (どれをスキル倍率の参照に使うか)
    enemyLevel: 80,         // 防御係数算出用
    enemyBaseRes: 0,        // 属性耐性係数算出用 (0 = 弱点扱い、0.2 = 非弱点等)
    critMode: 'expected',   // 'expected' | 'crit' (期待値 or 確定会心)
    breakState: 'normal',   // 'normal' (靭性残: 0.9) | 'broken' (撃破中: 1.0)
    elementOverride: null,  // null なら character.element を使う
});

// ---- 公開 API ----------------------------------------------------------

export const Diminishing = Object.freeze({
    DEFAULT_OPTIONS,
    compareBuilds,
    compareStats,
    compareWithModification,
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
    let totalRatio = 1;
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
        totalRatio *= ratio;
    }

    // スキル種別 breakdown — 与ダメ枠を 5 種類で別途比較
    factors.dmgBonusByType = {};
    for (const t of DMG_TYPE_KEYS) {
        const b = beforeFactors.dmgBonusByType[t];
        const a = afterFactors.dmgBonusByType[t];
        const ratio = b > 0 ? (a / b) : 0;
        factors.dmgBonusByType[t] = {
            before: b,
            after: a,
            ratio,
            contribution: ratio - 1,
        };
    }

    // 火力総合 (種別別) = atk × crit × dmgBonusByType[t] × def × res × taken × break × fixedDmg × sepMult
    //   factors.total は factors.totals.base のエイリアスとして残す (後方互換)
    factors.totals = {};
    const nonDmgRatio = factors.atk.ratio * factors.crit.ratio
                       * factors.def.ratio * factors.res.ratio
                       * factors.taken.ratio * factors.break.ratio
                       * factors.fixedDmg.ratio * factors.sepMult.ratio;
    for (const t of DMG_TYPE_KEYS) {
        const r = nonDmgRatio * factors.dmgBonusByType[t].ratio;
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
        options,
    };
}

// 「Build を編集する関数」を渡して比較する糖衣構文。
//   compareWithModification(build, b => swapRelicMain(b, 'feet', 'atk_percent'), options)
function compareWithModification(buildBefore, modifyFn, opts = {}) {
    const buildAfter = modifyFn(cloneBuild(buildBefore));
    return compareBuilds(buildBefore, buildAfter, opts);
}

// ---- ダメージ係数の算出 -------------------------------------------------

// 1ビルドの FinalStats から、ダメージ式の各乗算枠の数値を求める。
//   返り値: { atk, crit, dmgBonus, def, res, taken, break, fixedDmg, sepMult }
function computeDamageFactors(finalStats, opts = DEFAULT_OPTIONS) {
    const r = finalStats.raw;
    const d = finalStats.derived;
    const element = opts.elementOverride || finalStats.meta.element;

    // ref_stat: スキルの参照ステータス
    const refStatValue = (() => {
        switch (opts.refStat) {
            case 'hp':  return d.hp;
            case 'def': return d.def;
            case 'spd': return d.spd;
            case 'atk':
            default:    return d.atk;
        }
    })();

    // 会心係数 (期待値 or 確定)
    const cr = STAT_DEFAULTS.CRIT_RATE_BASE + r[STAT.CRIT_RATE];
    const cd = STAT_DEFAULTS.CRIT_DMG_BASE  + r[STAT.CRIT_DMG];
    const critFactor = opts.critMode === 'crit'
        ? (1 + cd)
        : (1 + Math.min(cr, 1.0) * cd);

    // 与ダメージ係数 (全属性共通 + 自属性別枠) — base
    //   さらにスキル種別ダメ枠 (DMG_BASIC/SKILL/ULT/FOLLOWUP) を加算した
    //   種別別の dmgBonusByType を別途算出する。
    const elementKey = element ? makeElementDmgKey(element) : null;
    const baseBonus = r[STAT.DMG_ALL] + (elementKey ? (r[elementKey] || 0) : 0);
    const dmgFactor = 1 + baseBonus;
    const dmgBonusByType = {
        base:     1 + baseBonus,
        basic:    1 + baseBonus + (r[STAT.DMG_BASIC]    || 0),
        skill:    1 + baseBonus + (r[STAT.DMG_SKILL]    || 0),
        ult:      1 + baseBonus + (r[STAT.DMG_ULT]      || 0),
        followup: 1 + baseBonus + (r[STAT.DMG_FOLLOWUP] || 0),
    };

    // 防御係数 (Lv80固定: 100 / ((20 + 敵Lv) × (1 - 防御Down - 防御無視) + 100))
    const defReduction = Math.min(1.0, r[STAT.DEF_DOWN] + r[STAT.DEF_IGNORE]);
    const defFactor = 100 / ((20 + opts.enemyLevel) * (1 - defReduction) + 100);

    // 属性耐性係数 (1 - (敵基礎耐性 - 耐性貫通))
    const resFactor = 1 - (opts.enemyBaseRes - r[STAT.RES_PEN]);

    // 被ダメ係数 (敵側デバフ: 被ダメ増・脆弱化付与など)
    //   damage *= (1 + DMG_TAKEN)
    //   注: STAT.DMG_TAKEN は敵の受けるダメージ係数として envBuffs 等で正の値で加算される
    const takenFactor = 1 + (r[STAT.DMG_TAKEN] || 0);

    // 確定ダメージ
    const fixedDmgFactor = 1 + (r[STAT.FIXED_DMG] || 0);

    // 別枠乗算
    const sepMultFactor = 1 + (r[STAT.SEP_MULT] || 0);

    // 撃破係数 (靭性が残ってるなら 0.9、撃破中なら 1.0)
    const breakFactor = opts.breakState === 'broken' ? 1.0 : 0.9;

    return {
        atk: refStatValue,        // ref_stat そのもの (skill_mult はキャンセルされるので不要)
        crit: critFactor,
        dmgBonus: dmgFactor,      // = dmgBonusByType.base (後方互換)
        dmgBonusByType,           // 新規 — スキル種別 breakdown 表示用
        def: defFactor,
        res: resFactor,
        taken: takenFactor,
        break: breakFactor,
        fixedDmg: fixedDmgFactor,
        sepMult: sepMultFactor,
    };
}

// スキル種別 breakdown 用の key 一覧。base = 共通枠のみ、他 4 つは + DMG_<TYPE>。
const DMG_TYPE_KEYS = ['base', 'basic', 'skill', 'ult', 'followup'];

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
//   dmgAll                                     与ダメージ% (共通+属性をまとめた値)
//   dmgBasic, dmgSkill, dmgUlt, dmgFollowup    スキル種別ダメ枠
//   fixedDmg, sepMult                          確定ダメージ / 別枠乗算
//   defDown, defIgnore, resPen, dmgTaken       デバフ系
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
    raw[STAT.RES_PEN]         = g('resPen');
    raw[STAT.DMG_TAKEN]       = g('dmgTaken');
    raw[STAT.BREAK_EFFECT]    = g('breakEffect');
    raw[STAT.EFFECT_HIT_RATE] = g('ehr');
    raw[STAT.EFFECT_RES]      = g('eres');

    const atk = g('atk'), hp = g('hp'), def = g('def'), spd = g('spd');
    const derived = {
        atk, hp, def, spd,
        speedAV: spd > 0 ? 10000 / spd : Infinity,
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
