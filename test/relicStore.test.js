import { beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';

import { RelicStore, relicFingerprint } from '../js/build/relicStore.js';

class MemoryStorage {
    #values = new Map();
    get length() { return this.#values.size; }
    getItem(key) { return this.#values.get(key) ?? null; }
    setItem(key, value) { this.#values.set(key, String(value)); }
    removeItem(key) { this.#values.delete(key); }
    clear() { this.#values.clear(); }
    key(index) { return [...this.#values.keys()][index] ?? null; }
}

function makeRelic(overrides = {}) {
    return {
        kind: 'owned',
        slot: 'rope',
        setId: 'Sprightly Vonwacq',
        mainStat: 'energy_regen',
        subs: { critRate: 0.12, atkPercent: 0.11 },
        ...overrides,
    };
}

beforeEach(() => {
    globalThis.localStorage = new MemoryStorage();
});

test('遺物を手持ち/仮想ラベルとともに保存し、同じ性能は重複作成しない', () => {
    const first = RelicStore.save(makeRelic({ label: '手持ちEP縄', tags: ['アーチャー用'] }));
    assert.equal(first.created, true);
    assert.equal(first.relic.kind, 'owned');
    assert.deepEqual(first.relic.tags, ['アーチャー用']);

    const duplicate = RelicStore.save(makeRelic({ kind: 'virtual', label: '理想EP縄' }));
    assert.equal(duplicate.duplicate, true);
    assert.equal(RelicStore.list().length, 1);
    assert.equal(relicFingerprint(first.relic), relicFingerprint(duplicate.relic));
});

test('メインステと同じサブステを除外し、計算用の遺物形式へ変換できる', () => {
    const result = RelicStore.save(makeRelic({
        slot: 'feet', mainStat: 'atk_percent',
        subs: { atkPercent: 0.1, critDmg: 0.2 },
    }));
    assert.deepEqual(result.relic.subs, { critDmg: 0.2 });
    assert.deepEqual(RelicStore.toBuildRelic(result.relic), {
        setId: 'Sprightly Vonwacq', mainStat: 'atk_percent', subs: { critDmg: 0.2 },
    });
});

test('命中数入力は既存のロール計算で表示値へ変換し、再編集用の入力も保持する', () => {
    const result = RelicStore.save(makeRelic({
        subs: { critRate: 0.01 },
        subInput: { mode: 'roll', tier: 'high', rolls: { CRIT_RATE: 3 } },
    }));
    assert.deepEqual(result.relic.subs, { critRate: 0.096 });
    assert.deepEqual(result.relic.subInput, {
        mode: 'roll', tier: 'high', rolls: { CRIT_RATE: 3 },
    });
    assert.deepEqual(RelicStore.toBuildRelic(result.relic), {
        setId: 'Sprightly Vonwacq', mainStat: 'energy_regen', subs: { critRate: 0.096 },
    });
});

test('外部取得結果は保存せず候補化し、選んだ遺物だけを取り込める', () => {
    const candidates = RelicStore.prepareImport({
        characters: [{ id: 'archer', name: 'アーチャー', relics: [
            makeRelic({ id: 'api-rope' }),
            { id: 'broken', slot: 'rope', setId: '', mainStat: 'energy_regen', subs: {} },
        ] }],
    }, { provider: 'hoyolab' });
    assert.equal(candidates.length, 2);
    assert.equal(candidates[0].valid, true);
    assert.equal(candidates[0].relic.source.characterId, 'archer');
    assert.equal(candidates[1].valid, false);
    assert.equal(RelicStore.list().length, 0);

    const imported = RelicStore.importSelected(candidates, candidates.map(candidate => candidate.id));
    assert.equal(imported.created.length, 1);
    assert.equal(imported.invalid.length, 1);
    assert.equal(RelicStore.list()[0].source.provider, 'hoyolab');
});
