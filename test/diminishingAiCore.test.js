import test from 'node:test';
import assert from 'node:assert/strict';

import '../js/data/characters/bronya.js';
import '../js/data/characters/hyacine.js';
import '../js/data/characters/archer.js';
import '../js/data/lightcones/but the Battle Isn\'t Over.js';
import '../js/data/lightcones/the Hell Where Ideals Burn.js';

import { Registry } from '../js/build/registry.js';
import { Build } from '../js/build/buildStore.js';
import { STAT } from '../js/build/statKeys.js';
import { SUBSTAT_ORDER } from '../js/build/substatTable.js';
import {
    createDiminishingSession,
} from '../js/build/diminishingSession.js';
import {
    computeDiminishingState,
    gatherTeammateEffects,
    materializeDiminishingBuild,
    rankBuildCandidates,
    runDiminishingJob,
} from '../js/build/diminishingEngine.js';
import { validateDiminishingJob } from '../js/build/diminishingValidator.js';
import { createDiminishingTools } from '../js/ai/diminishingTools.js';
import { createAiGateway, createFakeLlmAdapter } from '../js/ai/aiGateway.js';

function makeState() {
    const character = Registry.character.list().find(item => item.id !== 'template');
    assert.ok(character);
    const build = Build.blank(character.id);
    build.name = 'AI基盤テスト';
    return createDiminishingSession({ build });
}

function makeJob(session, variations, extra = {}) {
    return {
        objective: 'テスト比較',
        baseState: session.serialize(),
        variations,
        fixedConditions: [],
        metrics: ['finalStats', 'damage', 'differencePercent'],
        ...extra,
    };
}

test('現在状態、単一変更、複数条件をDOMなしで計算できる', () => {
    const session = makeState();
    const current = computeDiminishingState(session.getState());
    assert.ok(Number.isFinite(current.finalStats.derived.atk));

    const job = makeJob(session, [
        { label: '現在', changes: {} },
        { label: '会心率+10%', changes: { envStats: { [STAT.CRIT_RATE]: 0.10 } } },
        { label: '速度134', changes: { stats: { spd: 134 } } },
    ]);
    const validation = validateDiminishingJob(job);
    assert.equal(validation.valid, true, JSON.stringify(validation.errors));
    const result = runDiminishingJob(validation.normalizedJob);
    assert.equal(result.cases.length, 3);
    assert.equal(result.cases[0].differencePercent.base, 0);
    assert.ok(result.cases[1].finalStats.derived.critRate > result.base.finalStats.derived.critRate);
    assert.equal(result.cases[2].finalStats.derived.spd, 134);
});

test('保存ビルドの差分候補は常に本体から再計算され、高速切替用の結果を返す', () => {
    const session = makeState();
    const build = session.getState().build;
    build.candidates = {
        items: [
            {
                id: 'body-crit-rate', type: 'relicMain', label: '会心率胴',
                changes: { build: { relics: { body: { mainStat: 'crit_rate' } } } },
            },
            {
                id: 'body-crit-dmg', type: 'relicMain', label: '会心ダメ胴',
                changes: { build: { relics: { body: { mainStat: 'crit_dmg' } } } },
            },
        ],
    };
    const before = JSON.stringify(build);
    const ranked = rankBuildCandidates(session.getState());
    assert.equal(ranked.candidates.length, 2);
    assert.ok(ranked.candidates.every(item => Number.isFinite(item.contribution)));
    assert.equal(JSON.stringify(session.getState().build), before);

    session.getState().activeCandidateId = 'body-crit-rate';
    const critRateBody = computeDiminishingState(session.getState()).finalStats;
    session.getState().activeCandidateId = 'body-crit-dmg';
    const critDmgBody = computeDiminishingState(session.getState()).finalStats;
    assert.notEqual(critRateBody.derived.critRate, critDmgBody.derived.critRate);
    assert.equal(session.getState().build.relics.body.mainStat, null);
});

test('差し替え候補は項目ごとに複数を同時適用できる', () => {
    const session = makeState();
    session.getState().build.candidates = {
        items: [
            {
                id: 'body-crit-rate', type: 'relicMain', label: '会心率胴',
                changes: { build: { relics: { body: { mainStat: 'crit_rate' } } } },
            },
            {
                id: 'rope-atk', type: 'relicMain', label: '攻撃縄',
                changes: { build: { relics: { rope: { mainStat: 'atk_percent' } } } },
            },
        ],
    };
    const state = session.getState();
    state.activeCandidateIds = ['body-crit-rate', 'rope-atk'];
    state.activeCandidateId = null;
    const stats = computeDiminishingState(state).finalStats;
    assert.equal(stats.derived.critRate, 0.374);
    const materialized = materializeDiminishingBuild(state);
    assert.equal(materialized.relics.body.mainStat, 'crit_rate');
    assert.equal(materialized.relics.rope.mainStat, 'atk_percent');
    assert.ok(stats.derived.atk > 0);
});

test('保存ビルドの星魂候補は火力率を表示対象外にする', () => {
    const session = makeState();
    session.getState().build.candidates = {
        items: [
            {
                id: 'e2', type: 'eidolon', label: 'E2',
                changes: { build: { eidolon: 2 } },
            },
            {
                id: 'body-crit-rate', type: 'relicMain', label: '会心率胴',
                changes: { build: { relics: { body: { mainStat: 'crit_rate' } } } },
            },
        ],
    };

    const ranked = rankBuildCandidates(session.getState());
    const eidolon = ranked.candidates.find(item => item.id === 'e2');
    assert.equal(eidolon.contribution, null);
    assert.equal(eidolon.excludedReason, 'eidolon');
    assert.ok(eidolon.afterStats);
});

test('行×列の比較を展開し、元状態を変更しない', () => {
    const session = makeState();
    const before = JSON.stringify(session.serialize());
    const job = makeJob(session, [], {
        matrix: {
            rows: [
                { label: '会心率胴', changes: { relics: { body: { mainStat: 'crit_rate' } } } },
                { label: '会心ダメ胴', changes: { relics: { body: { mainStat: 'crit_dmg' } } } },
            ],
            columns: [
                { label: '攻撃縄', changes: { relics: { rope: { mainStat: 'atk_percent' } } } },
                { label: 'EP縄', changes: { relics: { rope: { mainStat: 'energy_regen' } } } },
            ],
        },
    });
    const validation = validateDiminishingJob(job);
    assert.equal(validation.valid, true, JSON.stringify(validation.errors));
    const result = runDiminishingJob(validation.normalizedJob);
    assert.equal(result.cases.length, 4);
    assert.deepEqual(result.matrix.rows.length, 2);
    assert.deepEqual(result.matrix.columns.length, 2);
    assert.ok(result.cases.every(item => item.rowLabel && item.columnLabel));
    assert.equal(JSON.stringify(session.serialize()), before);
});

test('ビルド/直接入力、サブステ3モード、スナップショットを計算できる', () => {
    const session = makeState();
    const base = session.serialize();
    const subKey = SUBSTAT_ORDER[0];
    const jobs = [
        makeJob(session, [{ label: '自由入力', changes: { substats: { mode: 'manual', manual: { [STAT.ATK_PERCENT]: 0.1 } } } }]),
        makeJob(session, [{ label: '総合ロール', changes: { substats: { mode: 'total', total: { allocations: { [subKey]: 3 }, tier: 'high', lastResult: null } } } }]),
        makeJob(session, [{ label: '部位別ロール', changes: { substats: { mode: 'perSlot', perSlot: { head: { allocations: { [subKey]: 2 }, tier: 'high', lastResult: null } } } } }]),
    ];
    for (const job of jobs) {
        const validation = validateDiminishingJob(job);
        assert.equal(validation.valid, true, JSON.stringify(validation.errors));
        assert.equal(runDiminishingJob(validation.normalizedJob).cases.length, 1);
    }

    const directState = {
        ...base,
        inputMode: 'direct',
        direct: {
            stats: { atk: 3000, hp: 4000, def: 1000, spd: 100, critRate: 0.7, critDmg: 1.4, energyRegen: 1 },
            snapshot: { atk: 2800, hp: 4000, def: 1000, spd: 100, critRate: 0.6, critDmg: 1.2, energyRegen: 1 },
        },
    };
    const directJob = { ...makeJob(session, [{ label: '直接入力', changes: { directStats: { atk: 3200 } } }]), baseState: directState };
    const validation = validateDiminishingJob(directJob);
    assert.equal(validation.valid, true, JSON.stringify(validation.errors));
    const result = runDiminishingJob(validation.normalizedJob);
    assert.equal(result.cases[0].finalStats.derived.atk, 3200);
    assert.ok(result.snapshotComparison);

    const buildSnapshotSession = makeState();
    buildSnapshotSession.getState().snapshot = materializeDiminishingBuild(buildSnapshotSession.getState());
    buildSnapshotSession.getState().build.envBuffs.push({ stat: STAT.CRIT_RATE, value: 0.1, label: 'snapshot-test' });
    const buildSnapshotJob = makeJob(buildSnapshotSession, [{ label: '現在', changes: {} }]);
    const buildSnapshotValidation = validateDiminishingJob(buildSnapshotJob);
    assert.equal(buildSnapshotValidation.valid, true, JSON.stringify(buildSnapshotValidation.errors));
    assert.ok(runDiminishingJob(buildSnapshotValidation.normalizedJob).snapshotComparison);
});

test('パーティバフを適用し、不正条件と固定条件違反を拒否する', () => {
    const session = makeState();
    const teammate = Registry.character.list().find(character => character.id !== 'template' && character.partyEffects?.length);
    assert.ok(teammate);
    const slot = session.getState().party[0];
    slot.characterId = teammate.id;
    const virtualBuild = Build.blank(teammate.id);
    virtualBuild.eidolon = 6;
    const effect = gatherTeammateEffects(virtualBuild)[0];
    assert.ok(effect);
    slot.activeEffectIds.add(effect.key);
    const computed = computeDiminishingState(session.getState());
    assert.ok(computed.finalStats.contributions);

    const badId = makeJob(session, [{ label: '不正', changes: { characterId: '推測した存在しないID' } }]);
    assert.equal(validateDiminishingJob(badId).valid, false);

    const fixed = makeJob(session, [{ label: '違反', changes: { relics: { body: { mainStat: 'crit_rate' } } } }], {
        fixedConditions: ['equipment'],
    });
    const validation = validateDiminishingJob(fixed);
    assert.equal(validation.valid, false);
    assert.ok(validation.errors.some(error => error.code === 'FIXED_CONDITION_CHANGED'));
});

test('不明項目、不正ロール、非有限値を推測せず構造化して拒否する', () => {
    const session = makeState();
    const unknown = makeJob(session, [{ label: '不明変更', changes: { guessedField: 1 } }]);
    const unknownValidation = validateDiminishingJob(unknown);
    assert.equal(unknownValidation.valid, false);
    assert.ok(unknownValidation.errors.some(error => error.code === 'UNKNOWN_CHANGE_FIELD'));

    const invalidTier = session.serialize();
    invalidTier.subs.total.tier = 'guessed';
    const tierValidation = validateDiminishingJob({ ...makeJob(session, [{ label: '現在', changes: {} }]), baseState: invalidTier });
    assert.equal(tierValidation.valid, false);
    assert.ok(tierValidation.errors.some(error => error.code === 'INVALID_ROLL_TIER'));

    const nonFinite = session.serialize();
    nonFinite.options.enemyLevel = Number.NaN;
    const finiteValidation = validateDiminishingJob({ ...makeJob(session, [{ label: '現在', changes: {} }]), baseState: nonFinite });
    assert.equal(finiteValidation.valid, false);
    assert.ok(finiteValidation.errors.some(error => error.code === 'NON_FINITE_NUMBER'));
});

test('直接入力で速度が未入力でも現在状態を再計算できる', () => {
    const base = makeState().serialize();
    const session = createDiminishingSession({
        ...base,
        inputMode: 'direct',
        direct: {
            stats: { critRate: 0.05, critDmg: 0.5, energyRegen: 1 },
            snapshot: null,
        },
    });
    const tools = createDiminishingTools({ session, allowApply: false });
    const output = tools.execute('run_diminishing_comparison', {
        job: {
            objective: '接続試験: 現在状態の再計算',
            variations: [{ label: '現在', changes: {} }],
            fixedConditions: ['character', 'equipment', 'party', 'enemy'],
            metrics: ['finalStats', 'damage', 'differencePercent'],
        },
    });

    assert.equal(output.ok, true, JSON.stringify(output.validation?.errors));
    assert.equal(output.result.base.finalStats.derived.speedAV, null);
});

test('AIツールは検証後に計算し、提案を承認後だけ適用して取り消せる', () => {
    const session = makeState();
    const tools = createDiminishingTools({ session, allowApply: true });
    const comparisonDefinition = tools.definitions.find(item => item.name === 'run_diminishing_comparison');
    const requestSchema = /** @type {any} */ (comparisonDefinition).inputSchema.properties.request;
    assert.ok(requestSchema.properties.focus);
    assert.ok(requestSchema.properties.shared);
    assert.equal(requestSchema.properties.changes, undefined);
    const context = tools.execute('get_diminishing_context', {});
    assert.equal(context.ok, true);
    assert.equal(context.detail, 'summary');
    assert.equal(context.state, undefined);
    assert.equal(context.comparison, undefined);
    const comparisonContext = tools.execute('get_diminishing_context', { detail: 'comparison' });
    assert.equal(comparisonContext.comparison.build.characterId, session.getState().build.characterId);
    assert.equal(comparisonContext.state, undefined);
    const fullContext = tools.execute('get_diminishing_context', { detail: 'full' });
    assert.equal(fullContext.state.schema, 'srsim.diminishing.v2');
    const invalidSearch = tools.execute('search_game_data', { query: '', limit: 999 });
    assert.equal(invalidSearch.error.code, 'INVALID_TOOL_ARGUMENTS');
    const job = makeJob(session, [{ label: '速度134', changes: { stats: { spd: 134 } } }]);
    const toolJob = { ...job };
    delete toolJob.baseState;
    const comparison = tools.execute('run_diminishing_comparison', { job: toolJob });
    assert.equal(comparison.ok, true, JSON.stringify(comparison.validation?.errors));
    assert.equal(comparison.result.cases[0].state, undefined);
    assert.equal(comparison.result.cases[0].finalStats.raw, undefined);
    assert.equal(comparison.validation.normalizedJob, undefined);
    const guessedCharacter = tools.execute('run_diminishing_comparison', {
        job: { ...toolJob, variations: [{ label: '誤った項目名', changes: { character: session.getState().build.characterId } }] },
    });
    assert.equal(guessedCharacter.error.code, 'INVALID_TOOL_ARGUMENTS');
    const proposalResult = tools.execute('propose_diminishing_changes', { caseLabel: '速度134' });
    assert.equal(proposalResult.approvalRequired, true);
    const before = session.serialize().build.aiTargetStats;
    assert.equal(before, undefined);
    const rejected = tools.execute('apply_diminishing_changes', { proposalId: proposalResult.proposal.id, approved: false });
    assert.equal(rejected.applied, false);
    const replayed = tools.execute('apply_diminishing_changes', { proposalId: proposalResult.proposal.id, approved: true });
    assert.equal(replayed.error.code, 'PROPOSAL_ALREADY_HANDLED');

    const proposal2 = tools.execute('propose_diminishing_changes', { changes: { stats: { spd: 134 } }, summary: '速度を反映' });
    const applied = tools.execute('apply_diminishing_changes', { proposalId: proposal2.proposal.id, approved: true });
    assert.equal(applied.applied, true);
    assert.equal(session.getState().build.aiTargetStats, undefined);
    assert.equal(computeDiminishingState(session.getState()).finalStats.derived.spd, 134);
    assert.ok(session.undo());
    assert.equal(session.getState().build.aiTargetStats, undefined);
});

test('薄い比較指定を内部の厳密な計算ジョブへ変換する', () => {
    const session = makeState();
    const tools = createDiminishingTools({ session, allowApply: false });
    const result = tools.execute('run_diminishing_comparison', {
        request: {
            objective: 'アーチャーの光円錐比較',
            focus: { character: 'アーチャー', eidolon: 0 },
            cases: [{ lightcone: '理想を焼く奈落で', superimpose: 1 }],
            shared: {
                stats: { critRate: 100, critDmg: 100 },
                substats: { atkPercent: 40 },
                party: ['ブローニャ'],
                effects: 'all',
                enemy: { level: 95, resistance: 20, broken: false },
            },
        },
    });

    assert.equal(result.ok, true, JSON.stringify(result.validation?.errors));
    const [caseResult] = result.result.cases;
    assert.equal(caseResult.label, '理想を焼く奈落で');
    assert.equal(caseResult.changes.characterId, 'archer');
    assert.deepEqual(caseResult.changes.lightcone, { id: 'The Hell Where Ideals Burn', superimpose: 1 });
    assert.equal(caseResult.changes.stats.critRate, 1);
    assert.equal(caseResult.changes.substats.manual.atkPercent, 0.4);
    assert.equal(caseResult.changes.party[0].characterId, 'bronya');
    assert.equal(caseResult.changes.options.enemyBaseRes, 0.2);

    const unknownStat = tools.execute('run_diminishing_comparison', {
        request: { objective: '不正な数値', cases: [{ stats: { impossible: 1 } }] },
    });
    assert.equal(unknownStat.ok, false);
    assert.equal(unknownStat.error.code, 'UNSUPPORTED_NUMERIC_VALUE');
});

test('保存済みビルドを名前で選び、現在の入力状態に依存せず比較できる', () => {
    const session = makeState();
    const savedBuild = Build.blank('archer');
    savedBuild.id = 'saved_archer_build';
    savedBuild.name = 'アーチャー厳選後';
    savedBuild.eidolon = 2;
    savedBuild.lightcone = { id: 'The Hell Where Ideals Burn', superimpose: 1 };
    savedBuild.relics.body = { setId: null, mainStat: 'crit_dmg', subs: { [STAT.ATK_PERCENT]: 0.4 } };
    const tools = createDiminishingTools({ session, allowApply: false, savedBuilds: [savedBuild] });
    const context = tools.execute('get_diminishing_context', {});
    assert.deepEqual(context.summary.savedBuilds, [{
        id: savedBuild.id,
        name: savedBuild.name,
        characterId: 'archer',
        characterName: 'アーチャー',
    }]);

    const result = tools.execute('run_diminishing_comparison', {
        request: {
            objective: '保存ビルドを基準にした比較',
            focus: { savedBuild: 'アーチャー厳選後' },
            cases: [{ label: '保存状態' }],
        },
    });

    assert.equal(result.ok, true, JSON.stringify(result.validation?.errors));
    const [caseResult] = result.result.cases;
    assert.equal(caseResult.changes.build.id, savedBuild.id);
    assert.equal(caseResult.changes.substats.mode, 'manual');
    assert.deepEqual(caseResult.changes.substats.manual, {});
    assert.equal(caseResult.calculation.target.characterId, 'archer');
    assert.equal(caseResult.calculation.target.eidolon, 2);
    assert.equal(caseResult.calculation.target.lightconeId, 'The Hell Where Ideals Burn');
});

test('保存済みビルドを対象と支援3人へ分け、パーティー効果を別条件として扱える', () => {
    const session = makeState();
    const target = Build.blank('archer');
    target.id = 'roster_target';
    target.name = '対象アーチャー';
    target.lightcone = { id: 'The Hell Where Ideals Burn', superimpose: 1 };
    const support = Build.blank('bronya');
    support.id = 'roster_support';
    support.name = '支援ブローニャ';
    support.lightcone = { id: 'But the Battle Isn\'t Over', superimpose: 1 };
    const tools = createDiminishingTools({ session, allowApply: false, savedBuilds: [target, support] });

    const result = tools.execute('run_diminishing_comparison', {
        request: {
            objective: '保存済み4人編成',
            focus: { savedBuild: target.id },
            shared: { partyBuilds: [support.id, support.id, support.id], partyEffects: 'all' },
            cases: [{ label: '保存編成' }],
        },
    });

    assert.equal(result.ok, true, JSON.stringify(result.validation?.errors));
    const [caseResult] = result.result.cases;
    assert.equal(caseResult.changes.build.id, target.id);
    assert.equal(caseResult.changes.party.length, 3);
    assert.ok(caseResult.changes.party.every(slot => slot.buildId === support.id));
    assert.equal(caseResult.calculation.party.length, 3);
    assert.ok(caseResult.calculation.party.every(member => member.characterId === 'bronya'));
});

test('画面外のAI実行層は承認済みを装っても変更を適用できない', () => {
    const session = makeState();
    const tools = createDiminishingTools({ session, allowApply: false });
    const proposal = tools.execute('propose_diminishing_changes', {
        changes: { stats: { spd: 134 } },
        summary: '速度を反映',
    });
    const before = session.serialize();
    const result = tools.execute('apply_diminishing_changes', {
        proposalId: proposal.proposal.id,
        approved: true,
    });

    assert.equal(result.ok, false);
    assert.equal(result.error.code, 'APPROVAL_REQUIRED_IN_UI');
    assert.deepEqual(session.serialize(), before);
});

test('偽LLMでツール呼び出しループと最終回答を取得できる', async () => {
    const session = makeState();
    const tools = createDiminishingTools({ session });
    const fake = createFakeLlmAdapter([
        { sessionId: 'fake-provider-session', toolCalls: [{ id: 'call-1', name: 'get_diminishing_context', arguments: {} }] },
        request => {
            assert.equal(request.toolOutputs[0].output.ok, true);
            return { finalText: '現在の限界効用状態を確認しました。' };
        },
    ]);
    const gateway = createAiGateway({ adapter: fake, tools, timeoutMs: 1000 });
    const result = await gateway.run({ message: '現在状態を確認して' });
    assert.equal(result.ok, true);
    assert.equal(result.finalText, '現在の限界効用状態を確認しました。');
    assert.equal(result.toolCalls[0].name, 'get_diminishing_context');
    assert.equal(gateway.getSession(result.sessionId).executions.length, 1);
    assert.deepEqual(gateway.listSessions(), [{ id: result.sessionId, turnCount: 1 }]);
});

test('共通ゲートウェイは不正引数を拒否し、中断とタイムアウトを処理する', async () => {
    const session = makeState();
    const tools = createDiminishingTools({ session });
    const invalidArgs = createFakeLlmAdapter([
        { toolCalls: [{ id: 'invalid', name: 'search_game_data', arguments: { query: '', limit: 999 } }] },
        request => {
            assert.equal(request.toolOutputs[0].output.error.code, 'INVALID_TOOL_ARGUMENTS');
            return { finalText: '不正な引数を拒否しました。' };
        },
    ]);
    const validationGateway = createAiGateway({ adapter: invalidArgs, tools, timeoutMs: 1000 });
    const validationResult = await validationGateway.run({ message: '不正引数試験' });
    assert.equal(validationResult.ok, true);
    assert.equal(validationResult.toolCalls.length, 0);

    const waitingAdapter = {
        respond({ signal }) {
            return new Promise((resolve, reject) => {
                signal.addEventListener('abort', () => reject(signal.reason), { once: true });
            });
        },
    };
    const cancellable = createAiGateway({ adapter: waitingAdapter, tools, timeoutMs: 1000 });
    const cancelledPromise = cancellable.run({ message: '中断試験', runId: 'cancel-me' });
    assert.equal(cancellable.cancel('cancel-me'), true);
    const cancelled = await cancelledPromise;
    assert.equal(cancelled.ok, false);
    assert.equal(cancelled.error.code, 'ABORTED');
    assert.equal(cancellable.cancel('cancel-me'), false);

    const timeoutGateway = createAiGateway({ adapter: waitingAdapter, tools, timeoutMs: 10 });
    const timedOut = await timeoutGateway.run({ message: 'タイムアウト試験' });
    assert.equal(timedOut.ok, false);
    assert.equal(timedOut.error.code, 'TIMEOUT');
});

test('AI game-data search exposes signature lightcone relationships by character phrase', () => {
    const session = makeState();
    const tools = createDiminishingTools({ session, allowApply: false });

    const characterSearch = tools.execute('search_game_data', {
        query: 'アーチャー',
        category: 'character',
        limit: 10,
    });
    const archer = characterSearch.results.find(item => item.id === 'archer');
    assert.deepEqual(archer.signatureLightcone, {
        id: 'The Hell Where Ideals Burn',
        name: '理想を焼く奈落で',
    });

    const signatureSearch = tools.execute('search_game_data', {
        query: 'アーチャーのモチーフ武器',
        category: 'lightcone',
        limit: 10,
    });
    const lightcone = signatureSearch.results.find(item => item.id === 'The Hell Where Ideals Burn');
    assert.ok(lightcone);
    assert.deepEqual(lightcone.signatureFor, [{ id: 'archer', name: 'アーチャー' }]);
});
