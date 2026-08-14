// statComputer.js — Build → FinalStats
// 役割:
//   - キャラ・光円錐・遺物・環境バフを順に積み上げ、最終ステータスを算出する。
//   - 加算は全て stats.add(key, value, source) を経由 → 二重計上防止 + 内訳トレース自動構築。
//   - トリガー型 hook (onUltUse 等) は実行しない。collectHooks() で配列化して返すだけ。
//
// 入力(Build) と出力(FinalStats) の構造は plan ドキュメント参照。

import { Registry } from './registry.js';
import {
    STAT,
    ALL_STAT_KEYS,
    STAT_DEFAULTS,
    ELEMENT_DMG_KEYS,
    makeElementDmgKey,
} from './statKeys.js';
import {
    ALL_SLOTS,
    SLOT_TO_SET_TYPE,
    SET_TYPE,
} from './constants.js';
import { getMainStatDef } from './relicMainTable.js';

// ---- 内部ヘルパ ---------------------------------------------------------

function makeStatsAccumulator() {
    // 全枠を 0 で初期化(キーの存在保証)
    const raw = {};
    for (const k of ALL_STAT_KEYS) raw[k] = 0;

    const contributions = {};

    return {
        raw,
        contributions,
        add(key, value, source) {
            if (value === undefined || value === null || Number.isNaN(value)) return;
            if (typeof key !== 'string') {
                console.warn('[statComputer] 不正なステ枠キー:', key, 'from', source);
                return;
            }
            // 未知の枠キーは計算結果へ混入させず警告する。
            // 新しい枠を追加する場合は statKeys.js に定義してから使う。
            if (!ALL_STAT_KEYS.includes(key)) {
                console.warn('[statComputer] 未知のステータスキーを無視します:', key, 'from', source);
                return;
            }
            
            if (key === STAT.SEP_MULT) {
                raw[key] = (1 + raw[key]) * (1 + value) - 1;
            } else {
                raw[key] += value;
            }
            (contributions[key] ||= []).push({ source: source ?? 'unknown', value });
        },
        addAll(statsObj, source) {
            if (!statsObj) return;
            for (const [k, v] of Object.entries(statsObj)) this.add(k, v, source);
        },
    };
}

// 遺物セット種別ごとに装着数を集計
//   countSetsByType(build.relics, SET_TYPE.CAVERN) → { 'Messenger Traversing Hackerspace': 4 } 等
export function countSetsByType(relics, type) {
    const counts = {};
    for (const slot of ALL_SLOTS) {
        if (SLOT_TO_SET_TYPE[slot] !== type) continue;
        const r = relics?.[slot];
        if (!r || !r.setId || r.setId === 'none') continue;
        counts[r.setId] = (counts[r.setId] || 0) + 1;
    }
    return counts;
}

// 全種別まとめ(buildToEntity 等で使用)
export function countAllSets(relics) {
    return {
        ...countSetsByType(relics, SET_TYPE.CAVERN),
        ...countSetsByType(relics, SET_TYPE.PLANAR),
    };
}

// ---- 公開 API ----------------------------------------------------------

export const StatComputer = Object.freeze({
    compute,
    collectHooks,
});

function compute(build) {
    if (!build || !build.characterId) {
        throw new Error('[statComputer.compute] build.characterId が必要です');
    }
    const ch = Registry.character.get(build.characterId);
    if (!ch) {
        throw new Error(`[statComputer.compute] character "${build.characterId}" が未登録です`);
    }
    const lc = build.lightcone?.id ? Registry.lightcone.get(build.lightcone.id) : null;
    if (build.lightcone?.id && !lc) {
        console.warn(`[statComputer.compute] lightcone "${build.lightcone.id}" が未登録です。基礎値0で扱います。`);
    }

    const acc = makeStatsAccumulator();

    // Step 1: BASE (キャラ基礎 + 光円錐基礎)
    acc.add(STAT.ATK_BASE, ch.base.atk + (lc?.base?.atk ?? 0), 'base:char+lc');
    acc.add(STAT.HP_BASE,  ch.base.hp  + (lc?.base?.hp  ?? 0), 'base:char+lc');
    acc.add(STAT.DEF_BASE, ch.base.def + (lc?.base?.def ?? 0), 'base:char+lc');
    acc.add(STAT.SPD_BASE, ch.base.spd, 'base:char');

    // Step 2: 軌跡 常時加算ステ
    acc.addAll(ch.traces?.stats, 'traces');

    // Step 3: 星魂 常時加算ステ (1..build.eidolon)
    const eidolon = Math.max(0, Math.min(6, build.eidolon ?? 0));
    for (let lv = 1; lv <= eidolon; lv++) {
        const e = ch.eidolons?.[lv];
        if (e?.stats) acc.addAll(e.stats, `eidolon:E${lv}`);
    }

    // Step 4: 光円錐 重畳別常時ステ
    if (lc) {
        const si = Math.max(1, Math.min(5, build.lightcone?.superimpose ?? 1));
        const lcStats = lc.stats?.[si - 1];
        if (lcStats) acc.addAll(lcStats, `lc:${lc.id}.S${si}`);
    }

    // Step 5: 遺物メインステ (Lv15 値を加算)
    for (const slot of ALL_SLOTS) {
        const r = build.relics?.[slot];
        if (!r || !r.mainStat) continue;
        const def = getMainStatDef(slot, r.mainStat);
        if (!def) {
            console.warn(`[statComputer] 不正なメインステ: ${slot}.${r.mainStat}`);
            continue;
        }
        acc.add(def.stat, def.max, `relicMain:${slot}.${r.mainStat}`);
    }

    // Step 6: 遺物サブステ集計
    for (const slot of ALL_SLOTS) {
        const r = build.relics?.[slot];
        if (!r?.subs) continue;
        acc.addAll(r.subs, `relicSubs:${slot}`);
    }

    // Step 7: セット効果(cavern 2pc/4pc + planar 2pc)
    const cavernCounts = countSetsByType(build.relics, SET_TYPE.CAVERN);
    for (const [setId, cnt] of Object.entries(cavernCounts)) {
        const set = Registry.relicSet.get(setId);
        if (!set) {
            console.warn(`[statComputer] cavern set "${setId}" が未登録です`);
            continue;
        }
        if (cnt >= 2 && set.pc2?.stats) acc.addAll(set.pc2.stats, `set:${setId}.2pc`);
        if (cnt >= 4 && set.pc4?.stats) acc.addAll(set.pc4.stats, `set:${setId}.4pc`);
    }
    const planarCounts = countSetsByType(build.relics, SET_TYPE.PLANAR);
    for (const [setId, cnt] of Object.entries(planarCounts)) {
        const orn = Registry.ornament.get(setId);
        if (!orn) {
            console.warn(`[statComputer] planar set "${setId}" が未登録です`);
            continue;
        }
        if (cnt >= 2 && orn.pc2?.stats) acc.addAll(orn.pc2.stats, `orn:${setId}.2pc`);
    }

    // Step 8: 環境バフ(戦闘前手動入力 — 味方光円錐の常時バフ等)
    if (Array.isArray(build.envBuffs)) {
        for (const b of build.envBuffs) {
            if (!b || !b.stat) continue;
            acc.add(b.stat, b.value ?? 0, `env:${b.label || b.stat}`);
        }
    }

    // Step 9: キャラ固有 onBuildResolved フック(特殊調整)
    //   サンデーE6 のような「型に収まらない最終調整」用
    if (typeof ch.hooks?.onBuildResolved === 'function') {
        ch.hooks.onBuildResolved({
            build,
            stats: acc,
            registry: Registry,
        });
    }

    // Step 10: derived 確定
    return finalize(acc, { character: ch, lightcone: lc, build });
}

function finalize(acc, ctx) {
    const r = acc.raw;
    const atk = r[STAT.ATK_BASE] * (1 + r[STAT.ATK_PERCENT]) + r[STAT.ATK_FLAT];
    const hp  = r[STAT.HP_BASE]  * (1 + r[STAT.HP_PERCENT])  + r[STAT.HP_FLAT];
    const def = r[STAT.DEF_BASE] * (1 + r[STAT.DEF_PERCENT]) + r[STAT.DEF_FLAT];
    const spd = r[STAT.SPD_BASE] * (1 + r[STAT.SPD_PERCENT]) + r[STAT.SPD_FLAT];

    const critRate = STAT_DEFAULTS.CRIT_RATE_BASE + r[STAT.CRIT_RATE];
    const critDmg  = STAT_DEFAULTS.CRIT_DMG_BASE  + r[STAT.CRIT_DMG];
    const energyRegenPct = STAT_DEFAULTS.ENERGY_REGEN_BASE + r[STAT.ENERGY_REGEN];

    // キャラ自属性のダメ枠合計(全属性共通 + 自属性別枠)
    const elementKey = ctx.character.element ? makeElementDmgKey(ctx.character.element) : null;
    const dmgOwnElement = r[STAT.DMG_ALL] + (elementKey ? (r[elementKey] || 0) : 0);

    const derived = {
        atk, hp, def, spd,
        speedAV: spd > 0 ? 10000 / spd : null,
        critRate,
        critDmg,
        critExpected: 1 + Math.min(critRate, 1.0) * critDmg,   // 期待値モード会心係数
        energyRegenPct,
        dmgOwnElement,                                          // 自属性で殴る時の与ダメ枠合計
        breakEffectPct: 1 + r[STAT.BREAK_EFFECT],
        // 各属性別の与ダメ合算(全属性共通 + 個別枠) — ダメ計算で参照しやすい形
        dmgByElement: Object.fromEntries(
            Object.entries(ELEMENT_DMG_KEYS).map(([el, k]) => [el, r[STAT.DMG_ALL] + (r[k] || 0)])
        ),
    };

    return {
        raw: r,
        derived,
        contributions: acc.contributions,
        meta: {
            characterId: ctx.character.id,
            element: ctx.character.element,
            path: ctx.character.path,
            lightconeId: ctx.lightcone?.id ?? null,
            superimpose: ctx.build.lightcone?.superimpose ?? null,
            eidolon: ctx.build.eidolon ?? 0,
        },
    };
}

// ---- トリガー型 hook の収集(本フェーズでは登録のみ。発火は次フェーズ) ---

// build に紐づく全 hook を {onUltUse:[fn,...], onCombatStart:[...]} 形式で集める。
// simulator が Entity 生成時にこれを保持し、対応イベント時に呼び出す予定。
function collectHooks(build) {
    const hooks = {};
    const push = (key, fn, sourceLabel) => {
        if (typeof fn !== 'function') return;
        (hooks[key] ||= []).push({ fn, source: sourceLabel });
    };
    // 1 個のフック定義値を受け取り hooks[key] に正規化して積む。
    //   許容形式:
    //     - function                        … テンプレ例の素朴な書き方 (onTurnStart(ctx) {})
    //     - { fn, source }                  … 単発オブジェクト
    //     - 上記の配列                       … Castorice/黄泉 等の複数 hook 宣言
    const pushItem = (key, item, defaultLabel) => {
        if (item == null) return;
        if (typeof item === 'function') {
            push(key, item, defaultLabel);
        } else if (Array.isArray(item)) {
            for (const sub of item) pushItem(key, sub, defaultLabel);
        } else if (typeof item.fn === 'function') {
            push(key, item.fn, item.source || defaultLabel);
        }
    };
    const collectFrom = (obj, sourceLabel) => {
        if (!obj) return;
        for (const [k, v] of Object.entries(obj)) pushItem(k, v, sourceLabel);
    };

    const ch = Registry.character.get(build.characterId);
    if (!ch) return hooks;

    // キャラ本体の hooks (onBuildResolved は compute で消費済みなので除外)
    if (ch.hooks) {
        const { onBuildResolved, ...rest } = ch.hooks;
        collectFrom(rest, `char:${ch.id}`);
    }

    // 星魂 hooks
    const eidolon = Math.max(0, Math.min(6, build.eidolon ?? 0));
    for (let lv = 1; lv <= eidolon; lv++) {
        collectFrom(ch.eidolons?.[lv]?.hooks, `eidolon:E${lv}`);
    }

    // 光円錐 hooks (重畳レベルを引数に取る関数として定義される)
    if (build.lightcone?.id) {
        const lc = Registry.lightcone.get(build.lightcone.id);
        const si = Math.max(1, Math.min(5, build.lightcone?.superimpose ?? 1));
        if (lc?.hooks) {
            const lcHooks = typeof lc.hooks === 'function' ? lc.hooks(si) : lc.hooks;
            collectFrom(lcHooks, `lc:${lc.id}.S${si}`);
        }
    }

    // セット効果 hooks
    const cavernCounts = countSetsByType(build.relics, SET_TYPE.CAVERN);
    for (const [setId, cnt] of Object.entries(cavernCounts)) {
        const set = Registry.relicSet.get(setId);
        if (!set) continue;
        if (cnt >= 2) collectFrom(set.pc2?.hooks, `set:${setId}.2pc`);
        if (cnt >= 4) collectFrom(set.pc4?.hooks, `set:${setId}.4pc`);
    }
    const planarCounts = countSetsByType(build.relics, SET_TYPE.PLANAR);
    for (const [setId, cnt] of Object.entries(planarCounts)) {
        const orn = Registry.ornament.get(setId);
        if (!orn) continue;
        if (cnt >= 2) collectFrom(orn.pc2?.hooks, `orn:${setId}.2pc`);
    }

    return hooks;
}
