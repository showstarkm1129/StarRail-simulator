// relicStore.js — 所持遺物 / 仮想遺物の永続化と外部取り込み境界

import { ALL_SLOTS } from './constants.js';
import { getMainStatDef } from './relicMainTable.js';
import { SUBSTAT_TABLE } from './substatTable.js';
import { normalizeRelicRollInput, relicRollsToStats } from './relicSubstatInput.js';

const KEY = 'srsim_relics_v1';
const SCHEMA = 1;
/** @type {Set<string>} */
const VALID_SUBSTAT_KEYS = new Set(Object.values(SUBSTAT_TABLE).map(item => item.stat));

function nowIso() {
    return new Date().toISOString();
}

function genId() {
    return `relic_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function readRaw() {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return { schemaVersion: SCHEMA, relics: [] };
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.relics)) {
            return { schemaVersion: SCHEMA, relics: [] };
        }
        return {
            schemaVersion: SCHEMA,
            relics: parsed.relics.map(normalize).filter(Boolean),
        };
    } catch (error) {
        console.warn('[relicStore] localStorage 読み込み失敗。空状態で復帰します。', error);
        return { schemaVersion: SCHEMA, relics: [] };
    }
}

function writeRaw(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
}

function normalizeSubs(rawSubs, mainStat) {
    const subs = {};
    for (const [key, value] of Object.entries(rawSubs || {})) {
        if (!VALID_SUBSTAT_KEYS.has(key)) continue;
        const numeric = Number(value);
        if (!Number.isFinite(numeric) || numeric <= 0 || key === mainStat) continue;
        subs[key] = numeric;
    }
    return subs;
}

function normalize(input) {
    if (!input || typeof input !== 'object') return null;
    const slot = input.slot;
    const mainDef = getMainStatDef(slot, input.mainStat);
    if (!ALL_SLOTS.includes(slot) || !mainDef || typeof input.setId !== 'string' || !input.setId) return null;
    const meta = input.meta || {};
    const subInput = normalizeRelicRollInput(input.subInput);
    const sourceSubs = subInput ? relicRollsToStats(subInput) : input.subs;
    const normalizedSubs = normalizeSubs(sourceSubs, mainDef.stat);
    return {
        schemaVersion: SCHEMA,
        id: input.id || genId(),
        kind: input.kind === 'virtual' ? 'virtual' : 'owned',
        slot,
        setId: input.setId,
        mainStat: input.mainStat,
        subs: normalizedSubs,
        ...(subInput ? { subInput } : {}),
        label: String(input.label || '').trim(),
        tags: [...new Set((Array.isArray(input.tags) ? input.tags : [])
            .map(tag => String(tag).trim()).filter(Boolean))],
        source: input.source && typeof input.source === 'object' ? clone(input.source) : { type: 'manual' },
        meta: {
            createdAt: meta.createdAt || nowIso(),
            updatedAt: nowIso(),
        },
    };
}

/**
 * 計算に影響する値だけで同一品を判定する。手持ち/仮想ラベル、名前、タグ、取得元は除外する。
 * @param {any} relic
 */
export function relicFingerprint(relic) {
    const normalized = normalize(relic);
    if (!normalized) return null;
    const subs = Object.entries(normalized.subs)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => [key, value]);
    return JSON.stringify([normalized.slot, normalized.setId, normalized.mainStat, subs]);
}

/**
 * 外部APIのアダプタが渡す共通形式。provider固有のレスポンス変換はこの手前に置く。
 * @typedef {{id?:string, kind?:'owned'|'virtual', slot:string, setId:string, mainStat:string, subs:Record<string,number>, label?:string, tags?:string[], source?:object}} ExternalRelic
 */

function collectExternalRelics(payload) {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.items)) return payload.items;
    if (Array.isArray(payload?.relics)) return payload.relics;
    if (!Array.isArray(payload?.characters)) return [];
    return payload.characters.flatMap(character => (character.relics || []).map(relic => ({
        ...relic,
        source: {
            ...(relic.source || {}),
            characterId: character.id || character.characterId || null,
            characterName: character.name || null,
        },
    })));
}

export const RelicStore = Object.freeze({
    SCHEMA_VERSION: SCHEMA,
    STORAGE_KEY: KEY,

    list() {
        return readRaw().relics;
    },

    get(id) {
        return this.list().find(relic => relic.id === id) || null;
    },

    toBuildRelic(relic) {
        const normalized = normalize(relic);
        return normalized ? {
            setId: normalized.setId,
            mainStat: normalized.mainStat,
            subs: clone(normalized.subs),
        } : null;
    },

    save(input) {
        const relic = normalize(input);
        if (!relic) throw new Error('[relicStore] 部位・セット・有効なメインステータスが必要です');
        const data = readRaw();
        const fingerprint = relicFingerprint(relic);
        const duplicate = data.relics.find(item => item.id !== relic.id && relicFingerprint(item) === fingerprint);
        if (duplicate) {
            return { relic: duplicate, created: false, duplicate: true };
        }
        const index = data.relics.findIndex(item => item.id === relic.id);
        if (index >= 0) {
            relic.meta.createdAt = data.relics[index].meta?.createdAt || relic.meta.createdAt;
            data.relics[index] = relic;
        } else {
            data.relics.push(relic);
        }
        writeRaw(data);
        return { relic, created: index < 0, duplicate: false };
    },

    delete(id) {
        const data = readRaw();
        const before = data.relics.length;
        data.relics = data.relics.filter(relic => relic.id !== id);
        writeRaw(data);
        return before !== data.relics.length;
    },

    clear() {
        localStorage.removeItem(KEY);
    },

    /**
     * APIレスポンスをアダプタが共通形式へ変換した後、候補一覧を作る。
     * ここでは保存しないため、UIで1件ずつ選択してから importSelected を呼べる。
     */
    prepareImport(payload, { provider = 'external' } = {}) {
        return collectExternalRelics(payload).map((raw, index) => {
            const candidate = normalize({
                ...raw,
                kind: raw.kind || 'owned',
                source: { type: 'api', provider, ...(raw.source || {}), externalId: raw.id || String(index) },
            });
            if (!candidate) return {
                // API の id は遺物インスタンスではなく種類 ID の場合があるため、
                // 候補の選択 ID には常に配列位置を含める。
                id: `candidate_${index}_${raw?.id || 'invalid'}`,
                valid: false,
                reason: raw?.source?.importIssues?.join(' / ') || '部位・セット・メインステータス・サブステの形式を確認してください。',
                raw,
            };
            const duplicate = this.list().find(item => relicFingerprint(item) === relicFingerprint(candidate));
            return {
                id: `candidate_${index}_${candidate.source.externalId || candidate.id}`,
                valid: true,
                duplicate: duplicate || null,
                relic: candidate,
            };
        });
    },

    importSelected(candidates, selectedIds) {
        const selected = new Set(selectedIds || []);
        const results = { created: [], duplicates: [], invalid: [] };
        for (const candidate of candidates || []) {
            if (!selected.has(candidate.id)) continue;
            if (!candidate.valid || !candidate.relic) {
                results.invalid.push(candidate);
                continue;
            }
            const saved = this.save(candidate.relic);
            (saved.duplicate ? results.duplicates : results.created).push(saved.relic);
        }
        return results;
    },
});
