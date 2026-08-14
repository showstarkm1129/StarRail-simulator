// 遺物サブステータスの入力方式と、命中数からの値変換を共通化する。

import { SUBSTAT_TABLE } from './substatTable.js';
import { calcManualAllocation, rollsToStatDict } from './substatRoller.js';

export const RELIC_SUBSTAT_INPUT_MODE = Object.freeze({
    VALUE: 'value',
    ROLL: 'roll',
});

export const RELIC_ROLL_TIERS = Object.freeze(['low', 'mid', 'high']);
export const RELIC_ROLL_MAX = 6;

function isValidTier(tier) {
    return RELIC_ROLL_TIERS.includes(tier);
}

/**
 * 保存データに入れる命中数入力を正規化する。
 * 命中数は遺物1個あたり最大6回までに制限する。
 * @param {any} raw
 * @returns {{mode:'roll', tier:'low'|'mid'|'high', rolls:Record<string, number>}|null}
 */
export function normalizeRelicRollInput(raw) {
    if (raw?.mode !== RELIC_SUBSTAT_INPUT_MODE.ROLL) return null;
    const tier = isValidTier(raw.tier) ? raw.tier : 'high';
    /** @type {Record<string, number>} */
    const rolls = {};
    for (const [subKey, rawCount] of Object.entries(raw.rolls || {})) {
        if (!SUBSTAT_TABLE[subKey]) continue;
        const count = Number(rawCount);
        if (!Number.isInteger(count) || count <= 0 || count > RELIC_ROLL_MAX) continue;
        rolls[subKey] = count;
    }
    return { mode: RELIC_SUBSTAT_INPUT_MODE.ROLL, tier, rolls };
}

/**
 * 命中数入力を遺物保存形式の stat キー辞書へ変換する。
 * @param {{mode?:string, tier?:string, rolls?:Record<string, number>}} input
 * @returns {Record<string, number>}
 */
export function relicRollsToStats(input) {
    const normalized = normalizeRelicRollInput(input);
    if (!normalized || Object.keys(normalized.rolls).length === 0) {
        return /** @type {Record<string, number>} */ ({});
    }
    const { totals } = calcManualAllocation({
        allocations: normalized.rolls,
        tier: normalized.tier,
    });
    return /** @type {Record<string, number>} */ (rollsToStatDict(totals));
}
