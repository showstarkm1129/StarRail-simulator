import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    addBuildCandidate,
    applyBuildCandidate,
    candidateLabel,
    candidateGroupKey,
    getBuildCandidates,
    isEidolonCandidate,
    normalizeCandidateCollection,
    removeBuildCandidate,
} from '../js/build/buildCandidates.js';

function makeBuild() {
    return {
        characterId: 'test',
        eidolon: 0,
        lightcone: { id: 'lc-a', superimpose: 1 },
        relics: {
            body: { mainStat: 'crit_rate', subs: {} },
        },
        candidates: { lightcone: [{ id: 'lc-b', superimpose: 2 }] },
    };
}

test('旧光円錐候補は汎用候補へ移行できる', () => {
    const collection = normalizeCandidateCollection({
        lightcone: [{ id: 'lc-a', superimpose: 3 }, { id: 'lc-a', superimpose: 3 }],
    });
    assert.equal(collection.items.length, 1);
    assert.equal(collection.items[0].type, 'lightcone');
    assert.deepEqual(collection.items[0].changes.build.lightcone, { id: 'lc-a', superimpose: 3 });
});

test('候補の追加・削除は重複せず、互換用光円錐一覧も更新する', () => {
    const build = makeBuild();
    const added = addBuildCandidate(build, {
        type: 'relicMain',
        label: '胴体 / 攻撃力%',
        changes: { build: { relics: { body: { mainStat: 'atk_percent' } } } },
    });
    addBuildCandidate(build, {
        type: 'relicMain',
        label: '同じ変更',
        changes: { build: { relics: { body: { mainStat: 'atk_percent' } } } },
    });
    assert.equal(getBuildCandidates(build).length, 2);
    assert.equal(build.candidates.lightcone.length, 1);
    assert.equal(removeBuildCandidate(build, added.id), true);
    assert.equal(getBuildCandidates(build).length, 1);
});

test('候補適用は元ビルドを変更せず、候補を累積しない', () => {
    const build = makeBuild();
    const first = addBuildCandidate(build, {
        id: 'e2', type: 'eidolon', label: 'E2', changes: { build: { eidolon: 2 } },
    });
    const second = addBuildCandidate(build, {
        id: 'e4', type: 'eidolon', label: 'E4', changes: { build: { eidolon: 4 } },
    });
    const firstApplied = applyBuildCandidate(build, first);
    const secondApplied = applyBuildCandidate(build, second);
    assert.equal(firstApplied.eidolon, 2);
    assert.equal(secondApplied.eidolon, 4);
    assert.equal(build.eidolon, 0);
});

test('星魂候補は火力プレビュー対象外として判定できる', () => {
    assert.equal(isEidolonCandidate({ type: 'eidolon', changes: { build: { eidolon: 2 } } }), true);
    assert.equal(isEidolonCandidate({ changes: { build: { eidolon: 2 } } }), true);
    assert.equal(isEidolonCandidate({ type: 'relicMain', changes: { build: { relics: {} } } }), false);
});

test('星魂候補の表示名はE番号だけにそろえる', () => {
    assert.equal(candidateLabel({ type: 'eidolon', label: '星魂 E2', changes: { build: { eidolon: 2 } } }), 'E2');
});

test('差し替え候補は同時適用単位ごとに分類できる', () => {
    assert.equal(candidateGroupKey({ type: 'lightcone', changes: { build: { lightcone: { id: 'lc' } } } }), 'lightcone');
    assert.equal(candidateGroupKey({ type: 'superimpose', changes: { build: { lightcone: { superimpose: 5 } } } }), 'superimpose');
    assert.equal(candidateGroupKey({ type: 'relicMain', changes: { build: { relics: { head: { mainStat: 'hp_flat' } } } } }), 'relic:head');
    assert.equal(candidateGroupKey({ type: 'relic', changes: { build: { relics: { body: {} }, relicIds: { body: 'r1' } } } }), 'relic:body');
    assert.equal(candidateGroupKey({ type: 'substats', changes: { build: { subsInput: { mode: 'manual' } } } }), 'substats');
});
