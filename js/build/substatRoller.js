// サブステ「ロール」シミュレータ
//
// 2 つのモードを提供:
//   1. rollTotalMode  — 部位区別なし。候補からランダムに 1 つ選んで count 回振る (簡易シミュ)
//   2. rollPerSlotMode — 部位ごとに HSR 実装準拠でシミュ。
//                         初期 4 種類抽出 → 強化はその 4 種類に分配。メインステ自動除外。
//
// 共通方針:
//   - rng は Math.random を差し替え可能にして、テスト時はシード再現可
//   - 結果は { [statKey]: totalValue } の形 (envBuffs に流せる形式)
//   - 内部では subKey ベースで集計 → 最後に stat キーに変換

import { SUBSTAT_TABLE, STAT_TO_SUB_KEY, rollOneValue } from './substatTable.js';
import { getMainStatDef } from './relicMainTable.js';

// 候補配列からランダムに 1 つ選ぶ
function pickRandom(arr, rng) {
    if (arr.length === 0) return null;
    return arr[Math.floor(rng() * arr.length)];
}

// 候補配列からランダムに n 個 (重複なし) を選ぶ
function pickRandomN(arr, n, rng) {
    const pool = arr.slice();
    const picked = [];
    while (picked.length < n && pool.length > 0) {
        const idx = Math.floor(rng() * pool.length);
        picked.push(pool.splice(idx, 1)[0]);
    }
    return picked;
}

// subKey ベースの集計結果を STAT 枠キー辞書に変換
//   rolls: { HP_PERCENT: 0.172, CRIT_RATE: 0.087, ... }   subKey ベース
//   → { hpPercent: 0.172, critRate: 0.087, ... }          stat キーベース (envBuffs 用)
export function rollsToStatDict(subKeyTotals) {
    const out = {};
    for (const [subKey, value] of Object.entries(subKeyTotals)) {
        const def = SUBSTAT_TABLE[subKey];
        if (!def) continue;
        out[def.stat] = (out[def.stat] || 0) + value;
    }
    return out;
}

// ---- モード2: 総合ロール (簡易シミュ) ----------------------------------
//
// candidateSubKeys からランダムに 1 つ選び、tier の値を加算。count 回繰り返す。
// 部位の区別なし、メインステ制約なし。
//
// 入力:
//   count            : 振り回数 (0 以上の整数)
//   tier             : 'low' | 'mid' | 'high' | 'random'
//   candidateSubKeys : 候補 subKey の配列 (空なら結果も空)
//   rng              : 乱数源 (省略時 Math.random)
//
// 出力:
//   { rolls: { [subKey]: 回数 }, totals: { [subKey]: 値 } }
export function rollTotalMode({ count, tier, candidateSubKeys, rng = Math.random }) {
    const rolls  = {};
    const totals = {};
    if (count <= 0 || candidateSubKeys.length === 0) {
        return { rolls, totals };
    }
    for (let i = 0; i < count; i++) {
        const sub = pickRandom(candidateSubKeys, rng);
        if (!sub) continue;
        rolls[sub]  = (rolls[sub]  || 0) + 1;
        totals[sub] = (totals[sub] || 0) + rollOneValue(sub, tier, rng);
    }
    return { rolls, totals };
}

// ---- モード3: 部位別ロール (HSR 実装準拠) ------------------------------
//
// 1 部位のシミュ:
//   1. candidateSubKeys からランダムに 4 種類を抽出 (= 実装上の「初期サブステ」)
//      ※ 初期 3 でも内部的に 4 種類選んでおき、追加サブステ取得で 4 種類目を使う
//   2. 初期 X 個 (= initialCount: 3 or 4) のサブステに 1 ロールずつ
//   3. 初期 3 なら「追加サブステ取得」イベント (4 種類目に 1 ロール)
//   4. 強化を enhanceCount 回、4 種類のサブステにランダム分配
//
// 入力:
//   initialCount     : 3 or 4
//   enhanceCount     : 0..5 (Lv15 まで強化なら 5)
//   tier             : 'low' | 'mid' | 'high' | 'random'
//   candidateSubKeys : 候補 subKey 配列 (メインステは呼び出し側で除外済み想定)
//   rng              : 乱数源
//
// 出力: { selectedSubs: [...], rolls: {...}, totals: {...} }
export function rollSingleSlot({ initialCount, enhanceCount, tier, candidateSubKeys, rng = Math.random }) {
    const result = { selectedSubs: [], rolls: {}, totals: {} };

    // 候補が 4 未満なら振れる範囲で抽出 (部分的にシミュ続行)
    const takeCount = Math.min(4, candidateSubKeys.length);
    if (takeCount === 0) return result;

    const selected = pickRandomN(candidateSubKeys, takeCount, rng);
    result.selectedSubs = selected.slice();

    const addRoll = (sub) => {
        result.rolls[sub]  = (result.rolls[sub]  || 0) + 1;
        result.totals[sub] = (result.totals[sub] || 0) + rollOneValue(sub, tier, rng);
    };

    // 初期 X 種類 (3 or 4) に 1 ロールずつ
    const init = Math.min(initialCount, takeCount);
    for (let i = 0; i < init; i++) addRoll(selected[i]);

    // 初期 3 の場合 → 追加サブステ取得 (4 種類目に 1 ロール)
    if (initialCount === 3 && selected.length >= 4) {
        addRoll(selected[3]);
    }

    // 強化 enhanceCount 回をランダム分配 (常に 4 種類 = selected が対象)
    for (let i = 0; i < enhanceCount; i++) {
        const target = pickRandom(selected, rng);
        if (target) addRoll(target);
    }

    return result;
}

// 6 部位を一括シミュ
//
// 入力:
//   slots : [{ slot, mainStat, initialCount, enhanceCount, tier, candidateSubKeys }, ...]
//           candidateSubKeys は呼び出し側で「メインステ除外済み」を渡す想定
//   rng   : 乱数源
//
// 出力:
//   { perSlot: { [slot]: SingleSlotResult }, totals: { [subKey]: 値 } }
export function rollPerSlotMode({ slots, rng = Math.random }) {
    const perSlot = {};
    const totals  = {};

    for (const cfg of slots) {
        const r = rollSingleSlot({
            initialCount:     cfg.initialCount,
            enhanceCount:     cfg.enhanceCount,
            tier:             cfg.tier,
            candidateSubKeys: cfg.candidateSubKeys,
            rng,
        });
        perSlot[cfg.slot] = r;
        for (const [sub, v] of Object.entries(r.totals)) {
            totals[sub] = (totals[sub] || 0) + v;
        }
    }

    return { perSlot, totals };
}

// ---- 手動配分: 各サブステに直接ロール回数を指定 ------------------------
//
// ランダム抽選を一切行わず、ユーザーが指定したロール数だけ
// 該当サブステに加算する。
//
// 入力:
//   allocations : { [subKey]: rollCount }  振り回数指定 (0 は無視)
//   tier        : 'low' | 'mid' | 'high' | 'random'
//                 単一指定 (low/mid/high) なら結果は決定的 = 入力即計算可
//                 'random' のみ各ロール毎に低/中/高をランダム抽選 → 都度乱数
//   rng         : 乱数源 (random 時のみ使用)
//
// 出力:
//   { totals: { [subKey]: 加算値合計 } }
//
// 例:
//   calcManualAllocation({
//     allocations: { CRIT_RATE: 5, CRIT_DMG: 4 },
//     tier: 'high',
//   }) → totals: { CRIT_RATE: 0.16, CRIT_DMG: 0.256 }
export function calcManualAllocation({ allocations, tier, rng = Math.random }) {
    const totals = {};
    for (const [subKey, rawCount] of Object.entries(allocations)) {
        const count = Math.max(0, parseInt(rawCount, 10) || 0);
        if (count === 0) continue;
        let sum = 0;
        for (let i = 0; i < count; i++) {
            sum += rollOneValue(subKey, tier, rng);
        }
        totals[subKey] = sum;
    }
    return { totals };
}

// メインステに該当する subKey を候補から除外
//
//   slot       : SLOT 定数 ('head'/'hands'/'body'/...)
//   mainStatId : RELIC_MAIN_OPTIONS のキー ('hp_flat'/'crit_rate'/...)
//   subKeys    : 元候補 (省略時は全 12 種)
//
// 例:
//   - HEAD (HP_FLAT 固定)            → HP_FLAT を除外
//   - BODY × crit_rate メイン        → CRIT_RATE を除外
//   - SPHERE × wind_dmg メイン       → そもそも属性ダメはサブステに無いので無変化
export function excludeMainStatFromCandidates(slot, mainStatId, subKeys = Object.keys(SUBSTAT_TABLE)) {
    const def = getMainStatDef(slot, mainStatId);
    if (!def) return subKeys.slice();
    const excludedSubKey = STAT_TO_SUB_KEY[def.stat];   // 属性ダメ等はサブステに無いので undefined
    if (!excludedSubKey) return subKeys.slice();
    return subKeys.filter(k => k !== excludedSubKey);
}
