// buildStore.js — ビルドの永続化(localStorage)+ JSON エクスポート/インポート
//
// 保存形式:
//   localStorage[KEY] = JSON.stringify({ schemaVersion, builds: [...] })
//
// スキーマ更新時はキー自体を v2 にして共存・段階移行する想定。
// migrate() は内部で1段ずつ schemaVersion を上げる方式に拡張可能。

import { normalizeBuildCandidates } from './buildCandidates.js';

const KEY = 'srsim_builds_v1';
const CORRUPT_BACKUP_KEY = `${KEY}_corrupt_backup`;
const SCHEMA = 1;
// 限界効用逓減タブではパーティー効果を envBuffs へ一時展開する。
// 保存ビルドは本人の装備・育成情報だけを表すため、ここへは残さない。
const DIMINISHING_PARTY_BUFF_PREFIX = 'パーティ.';
const corruptedStorages = new WeakSet();

const SET_ID_ALIASES = Object.freeze({
    // 旧ローマ字/短縮ID → 公式英名ID。保存済みビルドの互換用。
    eagle: 'Eagle of Twilight Line',
    messenger: 'Messenger Traversing Hackerspace',
    kunanShisai: 'Sacerdos\' Relived Ordeal',
    hoshikageInja: 'Self-Enshrouded Recluse',
    kamiwazaMeisho: 'Divine-Querying Master Smith',
    retsuyoBusin: 'Warrior Goddess of Sun and Thunder',
    tenchiSaisou: 'World-Remaking Deliverer',

    vonwacq: 'Sprightly Vonwacq',
    rougaiSenshu: 'Fleet of the Ageless',
    oretaRyukotsu: 'Broken Keel',
    rusaka: 'Lushaka, the Sunken Seas',
    yumePenacony: 'Penacony, Land of the Dreams',
    onparos: 'Amphoreus, The Eternal Land',
    gokkaRenchu: 'Forge of the Kalpagni Lantern',
    shinryoKyoju: 'Giant Tree of Rapt Brooding',
    sennoHoshi: 'City of Converging Stars',
});

// ---- 内部 ---------------------------------------------------------------

function readRaw() {
    let text = null;
    try {
        text = localStorage.getItem(KEY);
        if (!text) return { schemaVersion: SCHEMA, builds: [] };
        const parsed = JSON.parse(text);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed) || !Array.isArray(parsed.builds)) {
            throw new Error('保存形式に builds 配列がありません');
        }
        return migrate(parsed);
    } catch (err) {
        const alreadyCorrupt = corruptedStorages.has(localStorage) || readCorruptBackup() !== null;
        corruptedStorages.add(localStorage);
        if (typeof text === 'string' && readCorruptBackup() === null) {
            try {
                localStorage.setItem(CORRUPT_BACKUP_KEY, text);
            } catch (backupError) {
                console.error('[buildStore] 破損した保存データの退避にも失敗しました。', backupError);
            }
        }
        if (!alreadyCorrupt) {
            console.warn('[buildStore] localStorage の保存データが壊れています。バックアップを退避し、読み取り専用にします。', err);
        }
        return { schemaVersion: SCHEMA, builds: [] };
    }
}

function readCorruptBackup() {
    try {
        return localStorage.getItem(CORRUPT_BACKUP_KEY);
    } catch {
        return null;
    }
}

function assertStorageWritable() {
    if (corruptedStorages.has(localStorage) || readCorruptBackup() !== null) {
        throw Object.assign(
            new Error('保存データが壊れているため保存を停止しています。退避データを確認してから「保存データをリセット」してください。'),
            { code: 'BUILD_STORAGE_CORRUPT' },
        );
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
    data.builds = data.builds.map(build => normalizeCandidates(stripDiminishingPartyBuffs(normalizeLegacySetIds(build))));
    if (data.schemaVersion === SCHEMA) return data;
    // 未知バージョン → 警告のみ。互換可能な範囲でそのまま使う。
    console.warn(`[buildStore] schemaVersion ${data.schemaVersion} は未知です。現バージョン ${SCHEMA} で扱います。`);
    return { ...data, schemaVersion: SCHEMA };
}

function stripDiminishingPartyBuffs(build) {
    if (!build || typeof build !== 'object' || !Array.isArray(build.envBuffs)) return build;
    return {
        ...build,
        envBuffs: build.envBuffs.filter(buff => !(
            typeof buff?.label === 'string'
            && buff.label.startsWith(DIMINISHING_PARTY_BUFF_PREFIX)
        )),
    };
}

function normalizeLegacySetIds(build) {
    if (!build || typeof build !== 'object' || !build.relics) return build;
    const relics = Object.fromEntries(Object.entries(build.relics).map(([slot, relic]) => {
        if (!relic || typeof relic !== 'object' || !SET_ID_ALIASES[relic.setId]) {
            return [slot, relic];
        }
        return [slot, { ...relic, setId: SET_ID_ALIASES[relic.setId] }];
    }));
    return { ...build, relics };
}

// 差し替え候補を共通形式へ正規化する。
//   normalizeBuildCandidates は旧 candidates.lightcone も items へ移行する。
function normalizeCandidates(build) {
    return normalizeBuildCandidates(build);
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
    build = normalizeCandidates(stripDiminishingPartyBuffs(normalizeLegacySetIds(build)));
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
        assertStorageWritable();
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
        assertStorageWritable();
        const before = data.builds.length;
        data.builds = data.builds.filter(b => b.id !== id);
        writeRaw(data);
        return data.builds.length < before;
    },

    clear() {
        localStorage.removeItem(KEY);
        localStorage.removeItem(CORRUPT_BACKUP_KEY);
        corruptedStorages.delete(localStorage);
    },

    getStorageStatus() {
        const backup = readCorruptBackup();
        const corrupted = corruptedStorages.has(localStorage) || backup !== null;
        return {
            ok: !corrupted,
            corrupted,
            backupAvailable: backup !== null,
        };
    },

    exportCorruptBackup() {
        const backup = readCorruptBackup();
        if (backup === null) throw new Error('退避された破損データはありません。');
        return backup;
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
        assertStorageWritable();
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
            traceLevel: { basic: 6, skill: 10, ult: 10, talent: 10 },
            lightcone: { id: null, superimpose: 1 },
            candidates: { lightcone: [] },
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
