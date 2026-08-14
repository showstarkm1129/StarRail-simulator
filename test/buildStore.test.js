import { beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { Build } from '../js/build/buildStore.js';

class MemoryStorage {
    #values = new Map();

    get length() {
        return this.#values.size;
    }

    getItem(key) {
        return this.#values.has(key) ? this.#values.get(key) : null;
    }

    setItem(key, value) {
        this.#values.set(key, String(value));
    }

    removeItem(key) {
        this.#values.delete(key);
    }

    clear() {
        this.#values.clear();
    }

    key(index) {
        return [...this.#values.keys()][index] ?? null;
    }
}

beforeEach(() => {
    globalThis.localStorage = new MemoryStorage();
});

test('Build は新規保存・更新・取得・削除・全消去を行える', () => {
    assert.deepEqual(Build.list(), []);

    const saved = Build.save(Build.blank('bronya'));
    assert.equal(Build.get(saved.id)?.characterId, 'bronya');

    const updated = Build.save({ ...saved, name: 'updated' });
    assert.equal(updated.meta.createdAt, saved.meta.createdAt);
    assert.equal(Build.get(saved.id)?.name, 'updated');

    assert.equal(Build.delete('missing'), false);
    assert.equal(Build.delete(saved.id), true);
    assert.equal(Build.get(saved.id), null);

    Build.save(Build.blank('bronya'));
    Build.clear();
    assert.deepEqual(Build.list(), []);
});

test('Build は限界効用逓減の一時的なパーティーバフを保存しない', () => {
    const build = Build.blank('bronya');
    build.envBuffs = [
        { stat: 'atkPercent', value: 0.2, label: '手動調整' },
        { stat: 'critDmg', value: 0.3, label: 'パーティ.0.character.buff' },
    ];

    const saved = Build.save(build);
    assert.deepEqual(saved.envBuffs, [{ stat: 'atkPercent', value: 0.2, label: '手動調整' }]);

    localStorage.setItem(Build.STORAGE_KEY, JSON.stringify({
        schemaVersion: Build.SCHEMA_VERSION,
        builds: [build],
    }));
    assert.deepEqual(Build.list()[0].envBuffs, [{ stat: 'atkPercent', value: 0.2, label: '手動調整' }]);
});

test('Build のJSON入出力は統合・置換と旧セットID移行に対応する', () => {
    const first = Build.save(Build.blank('bronya'));
    const allExport = JSON.parse(Build.exportJson());
    assert.equal(allExport.app, 'srsim');
    assert.equal(allExport.builds.length, 1);
    assert.equal(JSON.parse(Build.exportOne(first.id)).builds[0].id, first.id);
    assert.throws(() => Build.exportOne('missing'));

    const legacy = Build.blank('hyacine');
    legacy.relics.head.setId = 'eagle';
    assert.equal(Build.importJson(JSON.stringify({
        app: 'srsim',
        schemaVersion: 0,
        builds: [legacy],
    })), 2);
    assert.equal(Build.get(legacy.id)?.relics.head.setId, 'Eagle of Twilight Line');

    const replacement = Build.blank('bronya');
    assert.equal(Build.importJson(JSON.stringify({
        app: 'srsim',
        schemaVersion: Build.SCHEMA_VERSION,
        builds: [replacement],
    }), 'replace'), 1);
    assert.equal(Build.list()[0].id, replacement.id);
});

test('Build.save does not mutate the input while migrating legacy set ids', () => {
    const build = Build.blank('hyacine');
    build.relics.head.setId = 'eagle';

    const saved = Build.save(build);

    assert.equal(build.relics.head.setId, 'eagle');
    assert.equal(saved.relics.head.setId, 'Eagle of Twilight Line');
});

test('Build は光円錐の差し替え候補 (candidates.lightcone) を正規化する', () => {
    const blank = Build.blank('bronya');
    assert.deepEqual(blank.candidates, { lightcone: [] });

    // 重複・重畳の範囲外・不正値は保存時に落とす
    const withCandidates = Build.blank('bronya');
    withCandidates.candidates = {
        lightcone: [
            { id: 'lc-a', superimpose: 3 },
            { id: 'lc-a', superimpose: 3 },      // 重複 → 1件に統合
            { id: 'lc-b', superimpose: 99 },     // 範囲外 → 5にクランプ
            { id: '', superimpose: 1 },          // id 不正 → 除外
            { superimpose: 2 },                  // id 欠落 → 除外
        ],
    };
    const saved = Build.save(withCandidates);
    assert.deepEqual(saved.candidates.lightcone, [
        { id: 'lc-a', superimpose: 3 },
        { id: 'lc-b', superimpose: 5 },
    ]);

    // このフィールドを持たない旧形式の保存データを読み込んでも壊れない
    localStorage.setItem(Build.STORAGE_KEY, JSON.stringify({
        schemaVersion: Build.SCHEMA_VERSION,
        builds: [{ id: 'legacy1', characterId: 'bronya', relics: {} }],
    }));
    assert.deepEqual(Build.get('legacy1').candidates, { lightcone: [] });
});

test('Build は種類をまたぐ差分候補を candidates.items へ保存する', () => {
    const build = Build.blank('bronya');
    build.candidates = {
        lightcone: [],
        items: [
            {
                id: 'eidolon-e2',
                type: 'eidolon',
                label: '星魂 E2',
                changes: { build: { eidolon: 2 } },
            },
            {
                id: 'body-crit',
                type: 'relicMain',
                label: '胴体 / 会心率',
                changes: { build: { relics: { body: { mainStat: 'crit_rate' } } } },
            },
        ],
    };

    const saved = Build.save(build);
    assert.deepEqual(saved.candidates.items.map(item => item.type), ['eidolon', 'relicMain']);
    assert.equal(saved.candidates.items[0].changes.build.eidolon, 2);
    assert.deepEqual(saved.candidates.lightcone, []);

    const restored = Build.get(saved.id);
    assert.equal(restored.candidates.items.length, 2);
    assert.equal(restored.candidates.items[1].changes.build.relics.body.mainStat, 'crit_rate');
});

test('Build は壊れた保存値と不正なインポートを拒否または安全に空扱いする', () => {
    localStorage.setItem(Build.STORAGE_KEY, '{broken');
    const originalWarn = console.warn;
    console.warn = () => {};
    try {
        assert.deepEqual(Build.list(), []);
    } finally {
        console.warn = originalWarn;
    }
    assert.equal(Build.getStorageStatus().corrupted, true);
    assert.equal(Build.getStorageStatus().backupAvailable, true);
    assert.equal(Build.exportCorruptBackup(), '{broken');
    assert.throws(() => Build.save(Build.blank('bronya')), /保存データが壊れている/);
    Build.clear();
    assert.equal(Build.getStorageStatus().ok, true);

    assert.throws(() => Build.save(null));
    assert.throws(() => Build.save({ name: 'character missing' }));
    assert.throws(() => Build.importJson('{broken'));
    assert.throws(() => Build.importJson(JSON.stringify({ app: 'other', builds: [] })));
});
