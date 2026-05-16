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
//   - def_factor:            防御無視/防御Down系装備
//   - res_factor:            耐性貫通系装備
//   - break_factor:          靭性状態に依存(本ツールでは固定値で扱う)
//   - taken_factor:          被ダメ増デバフ(敵側、対象外)

import { StatComputer } from './statComputer.js';
import { STAT, STAT_DEFAULTS, makeElementDmgKey } from './statKeys.js';

// ---- デフォルト前提 -----------------------------------------------------

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
    compareWithModification,
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
//         def:       { before, after, ratio, contribution },
//         res:       { before, after, ratio, contribution },
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
    const options = { ...DEFAULT_OPTIONS, ...opts };

    const beforeStats = StatComputer.compute(buildBefore);
    const afterStats  = StatComputer.compute(buildAfter);

    const beforeFactors = computeDamageFactors(beforeStats, options);
    const afterFactors  = computeDamageFactors(afterStats,  options);

    const factors = {};
    let totalRatio = 1;
    for (const key of ['atk', 'crit', 'dmgBonus', 'def', 'res', 'break']) {
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
    factors.total = {
        ratio: totalRatio,
        contribution: totalRatio - 1,
    };

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
//   返り値: { atk, crit, dmgBonus, def, res, break }
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

    // 与ダメージ係数 (全属性共通 + 自属性別枠)
    const elementKey = element ? makeElementDmgKey(element) : null;
    const dmgBonus = r[STAT.DMG_ALL] + (elementKey ? (r[elementKey] || 0) : 0);
    const dmgFactor = 1 + dmgBonus;

    // 防御係数 (Lv80固定: 100 / ((20 + 敵Lv) × (1 - 防御Down - 防御無視) + 100))
    const defReduction = Math.min(1.0, r[STAT.DEF_DOWN] + r[STAT.DEF_IGNORE]);
    const defFactor = 100 / ((20 + opts.enemyLevel) * (1 - defReduction) + 100);

    // 属性耐性係数 (1 - (敵基礎耐性 - 耐性貫通))
    const resFactor = 1 - (opts.enemyBaseRes - r[STAT.RES_PEN]);

    // 撃破係数 (靭性が残ってるなら 0.9、撃破中なら 1.0)
    const breakFactor = opts.breakState === 'broken' ? 1.0 : 0.9;

    return {
        atk: refStatValue,        // ref_stat そのもの (skill_mult はキャンセルされるので不要)
        crit: critFactor,
        dmgBonus: dmgFactor,
        def: defFactor,
        res: resFactor,
        break: breakFactor,
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
