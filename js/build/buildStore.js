// buildStore.js — ビルドの永続化(localStorage)+ JSON エクスポート/インポート
//
// 保存形式:
//   localStorage[KEY] = JSON.stringify({ schemaVersion, builds: [...] })
//
// スキーマ更新時はキー自体を v2 にして共存・段階移行する想定。
// migrate() は内部で1段ずつ schemaVersion を上げる方式に拡張可能。

const KEY = 'srsim_builds_v1';
const SCHEMA = 1;

// ---- 内部 ---------------------------------------------------------------

function readRaw() {
    try {
        const text = localStorage.getItem(KEY);
        if (!text) return { schemaVersion: SCHEMA, builds: [] };
        const parsed = JSON.parse(text);
        return migrate(parsed);
    } catch (err) {
        console.warn('[buildStore] localStorage 読み込み失敗。空状態で復帰します。', err);
        return { schemaVersion: SCHEMA, builds: [] };
    }
}

function writeRaw(data) {
    try {
        localStorage.setItem(KEY, JSON.stringify(data));
    } catch (err) {
        console.error('[buildStore] localStorage 書き込み失敗', err);
        throw err;
    }
}

function migrate(data) {
    // 将来 v2/v3 への移行ロジックをここに集約
    if (!data || typeof data !== 'object') return { schemaVersion: SCHEMA, builds: [] };
    if (!Array.isArray(data.builds)) data.builds = [];
    if (data.schemaVersion === SCHEMA) return data;
    // 未知バージョン → 警告のみ。互換可能な範囲でそのまま使う。
    console.warn(`[buildStore] schemaVersion ${data.schemaVersion} は未知です。現バージョン ${SCHEMA} で扱います。`);
    return { ...data, schemaVersion: SCHEMA };
}

function nowIso() {
    return new Date().toISOString();
}

function genId() {
    return 'build_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6);
}

function normalize(build) {
    if (!build) throw new Error('[buildStore] build が空です');
    if (!build.characterId) throw new Error('[buildStore] build.characterId が必要です');
    const meta = build.meta || {};
    return {
        schemaVersion: SCHEMA,
        ...build,
        id: build.id || genId(),
        meta: {
            createdAt: meta.createdAt || nowIso(),
            updatedAt: nowIso(),
        },
    };
}

// ---- 公開 API ----------------------------------------------------------

export const Build = Object.freeze({
    SCHEMA_VERSION: SCHEMA,
    STORAGE_KEY: KEY,

    list() {
        return readRaw().builds;
    },

    get(id) {
        return this.list().find(b => b.id === id) || null;
    },

    save(build) {
        const data = readRaw();
        const norm = normalize(build);
        const idx = data.builds.findIndex(b => b.id === norm.id);
        if (idx >= 0) {
            // 既存の createdAt は維持
            norm.meta.createdAt = data.builds[idx].meta?.createdAt || norm.meta.createdAt;
            data.builds[idx] = norm;
        } else {
            data.builds.push(norm);
        }
        writeRaw(data);
        return norm;
    },

    delete(id) {
        const data = readRaw();
        const before = data.builds.length;
        data.builds = data.builds.filter(b => b.id !== id);
        writeRaw(data);
        return data.builds.length < before;
    },

    clear() {
        localStorage.removeItem(KEY);
    },

    // 全ビルドを1つの JSON 文字列として書き出す
    exportJson() {
        return JSON.stringify({
            app: 'srsim',
            schemaVersion: SCHEMA,
            exportedAt: nowIso(),
            builds: this.list(),
        }, null, 2);
    },

    // 単体ビルドだけ書き出す(共有用)
    exportOne(id) {
        const b = this.get(id);
        if (!b) throw new Error(`[buildStore] build "${id}" が存在しません`);
        return JSON.stringify({
            app: 'srsim',
            schemaVersion: SCHEMA,
            exportedAt: nowIso(),
            builds: [b],
        }, null, 2);
    },

    // mode: 'merge' (同 id は上書き、新規は追加) | 'replace' (全置換)
    importJson(text, mode = 'merge') {
        let parsed;
        try {
            parsed = JSON.parse(text);
        } catch (err) {
            throw new Error('[buildStore] JSON パース失敗: ' + err.message);
        }
        if (parsed.app !== 'srsim') {
            throw new Error('[buildStore] srsim 形式ではありません');
        }
        const incoming = migrate(parsed).builds;
        if (!Array.isArray(incoming)) {
            throw new Error('[buildStore] builds 配列がありません');
        }

        const data = readRaw();
        if (mode === 'replace') {
            data.builds = incoming.map(normalize);
        } else {
            for (const b of incoming) {
                const norm = normalize(b);
                const idx = data.builds.findIndex(x => x.id === norm.id);
                if (idx >= 0) data.builds[idx] = norm;
                else data.builds.push(norm);
            }
        }
        writeRaw(data);
        return data.builds.length;
    },

    // 新規ビルド作成用の最小スケルトン
    blank(characterId) {
        return {
            schemaVersion: SCHEMA,
            id: genId(),
            name: '',
            characterId,
            eidolon: 0,
            traceLevel: { basic: 1, skill: 10, ult: 10, talent: 10 },
            lightcone: { id: null, superimpose: 1 },
            relics: {
                head:   { setId: null, mainStat: 'hp_flat',   subs: {} },
                hands:  { setId: null, mainStat: 'atk_flat',  subs: {} },
                body:   { setId: null, mainStat: null,        subs: {} },
                feet:   { setId: null, mainStat: null,        subs: {} },
                sphere: { setId: null, mainStat: null,        subs: {} },
                rope:   { setId: null, mainStat: null,        subs: {} },
            },
            envBuffs: [],
            meta: { createdAt: nowIso(), updatedAt: nowIso() },
        };
    },
});
