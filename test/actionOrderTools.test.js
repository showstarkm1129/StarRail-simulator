// 行動順AIツールのテスト。
// 画面を介さずツール単体で呼び、入出力と承認フローを検証する。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Registry } from '../js/build/registry.js';
import { STAT } from '../js/build/statKeys.js';
import { ELEMENT, PATH } from '../js/build/constants.js';
import { createActionOrderSession } from '../js/build/actionOrderSession.js';
import {
    ACTION_ORDER_TOOL_DEFINITIONS,
    asOpenAiTools,
    createActionOrderTools,
} from '../js/ai/actionOrderTools.js';
import '../js/data/characters/rin Tohsaka.js';
import '../js/data/lightcones/dance! Dance! Dance!.js';

const CHAR_ID = '__ao_tools_char__';

Registry.character.add({
    id: CHAR_ID,
    name: 'ツール検証キャラ',
    element: ELEMENT.WIND,
    path: PATH.HARMONY,
    base: { atk: 500, hp: 1000, def: 400, spd: 107 },
    maxEnergy: 100,
    traces: { stats: { [STAT.SPD_FLAT]: 14 } },
    skills: {
        basic: { energyGain: 20 }, skill: { energyGain: 30 }, ult: { energyCost: 100, energyGain: 5 },
    },
});

Registry.character.add({
    id: '__ao_energy_support__',
    name: 'EP支援役',
    element: ELEMENT.WIND,
    path: PATH.HARMONY,
    base: { atk: 500, hp: 1000, def: 400, spd: 120 },
    maxEnergy: 60,
    skills: {
        basic: { energyGain: 20 }, skill: { energyGain: 30 }, ult: { energyCost: 60, energyGain: 5 },
    },
    energyEffects: [{
        id: 'ao_energy_support_ult', name: '必殺技EP供給', trigger: 'ult', target: 'selectedAllies', amount: { kind: 'flat', value: 25 },
    }],
});

Registry.lightcone.add({
    id: '__ao_harmony_lc__', name: '調和候補', path: PATH.HARMONY, rarity: 4,
    base: {}, stats: [{}, {}, {}, {}, {}],
});
Registry.lightcone.add({
    id: '__ao_hunt_lc__', name: '巡狩候補', path: PATH.HUNT, rarity: 4,
    base: {}, stats: [{}, {}, {}, {}, {}],
});

const SAVED_BUILD = {
    id: 'build_ao_1',
    name: '速度ビルド',
    characterId: CHAR_ID,
    eidolon: 0,
    lightcone: null,
    candidates: { lightcone: [{ id: '__ao_harmony_lc__', superimpose: 3 }, { id: '__ao_hunt_lc__', superimpose: 5 }] },
    relics: {},
    substats: {},
};

function makeTools({ allowApply = true, savedBuilds = [SAVED_BUILD] } = {}) {
    const session = createActionOrderSession({
        quickPresets: [{ id: 'quick-ddd', type: 'advance', value: 24, label: 'DDD', memo: '調和キャラの必殺技後だけ使う' }],
        panels: [
            { name: 'A', baseSpeed: 100, preSpeed: 100, threshold: 150, turns: [] },
            { name: 'B', baseSpeed: 134, preSpeed: 134, threshold: 150, turns: [] },
        ],
    });
    return { session, tools: createActionOrderTools({ session, allowApply, savedBuilds }) };
}

test('session が無ければ生成時に例外', () => {
    assert.throws(() => createActionOrderTools({ session: null }), /session/);
});

test('ツール定義は OpenAI 形式へ変換できる', () => {
    const converted = asOpenAiTools();
    assert.equal(converted.length, ACTION_ORDER_TOOL_DEFINITIONS.length);
    assert.ok(converted.every(item => item.type === 'function' && item.parameters));
});

test('未登録のツール名はエラーを返す', () => {
    const { tools } = makeTools();
    const output = tools.execute('run_diminishing_comparison', {});
    assert.equal(output.ok, false);
    assert.equal(output.error.code, 'UNKNOWN_TOOL');
});

test('スキーマ違反の引数は実行前に弾かれ、履歴へ残る', () => {
    const { tools } = makeTools();
    const output = tools.execute('read_build_speed', { build: 123 });
    assert.equal(output.ok, false);
    assert.equal(output.error.code, 'INVALID_TOOL_ARGUMENTS');
    assert.equal(tools.getHistory().at(-1).name, 'read_build_speed');
});

// ---- 状態取得 ----

test('get_action_order_context: パネルごとの行動回数を返す', () => {
    const { tools } = makeTools();
    const output = tools.execute('get_action_order_context', {});
    assert.equal(output.ok, true);
    assert.equal(output.panelCount, 2);
    assert.equal(output.panels[0].name, 'A');
    assert.equal(output.panels[0].turnsWithinThreshold, 1);
    assert.equal(output.panels[1].turnsWithinThreshold, 2, '速度134なら150AVまでに2回');
    assert.ok(output.supported.eventTypes.some(item => item.type === 'advance'));
});

test('get_action_order_context: full では効果の発動有無まで返す', () => {
    const { session, tools } = makeTools();
    session.applyChanges({
        patches: [{ index: 0, turns: [{ events: [{ type: 'speedFlat', value: 50, timing: 'turn', offset: 999 }] }] }],
    });
    const output = tools.execute('get_action_order_context', { detail: 'full' });
    assert.deepEqual(output.panels[0].unfiredEffects.map(item => item.turn), [1]);
});

test('list_action_order_quick_presets: 利用者登録の効果とAI参照メモを返す', () => {
    const { tools } = makeTools();
    const output = tools.execute('list_action_order_quick_presets', {});
    assert.equal(output.ok, true);
    assert.deepEqual(output.presets, [{
        id: 'quick-ddd', label: 'DDD', type: 'advance', value: 24,
        name: undefined, memo: '調和キャラの必殺技後だけ使う',
    }]);
});

// ---- 検索 ----

test('search_speed_data: キャラの基礎速度と軌跡速度を返す', () => {
    const { tools } = makeTools();
    const output = tools.execute('search_speed_data', { queries: ['ツール検証キャラ'] });
    assert.equal(output.ok, true, JSON.stringify(output));
    const hit = output.results.find(item => item.id === CHAR_ID);
    assert.equal(hit.baseSpeed, 107);
    assert.equal(hit.traceSpeedFlat, 14);
    assert.equal(hit.path, PATH.HARMONY);
});

test('list_equippable_lightcones: 運命一致と保存ビルドの候補だけを返す', () => {
    const { tools } = makeTools();
    const configured = tools.execute('list_equippable_lightcones', {
        character: CHAR_ID, build: '速度ビルド', scope: 'configured',
    });
    assert.equal(configured.ok, true);
    assert.equal(configured.character.path, PATH.HARMONY);
    assert.deepEqual(configured.lightcones.map(item => item.id), ['__ao_harmony_lc__']);
    assert.equal(configured.lightcones[0].superimpose, 3);

    const all = tools.execute('list_equippable_lightcones', { character: CHAR_ID, scope: 'all' });
    assert.ok(all.lightcones.some(item => item.id === '__ao_harmony_lc__'));
    assert.equal(all.lightcones.some(item => item.id === '__ao_hunt_lc__'), false);
});

test('validate_lightcone_assignment: 運命不一致の装備をエラーにする', () => {
    const { tools } = makeTools();
    const valid = tools.execute('validate_lightcone_assignment', {
        character: CHAR_ID, lightcone: '__ao_harmony_lc__',
    });
    assert.equal(valid.ok, true);

    const invalid = tools.execute('validate_lightcone_assignment', {
        character: CHAR_ID, lightcone: '__ao_hunt_lc__',
    });
    assert.equal(invalid.ok, false);
    assert.equal(invalid.error.code, 'LIGHTCONE_PATH_MISMATCH');
    assert.equal(invalid.error.character.path, PATH.HARMONY);
    assert.equal(invalid.error.lightcone.path, PATH.HUNT);
});

test('validate_lightcone_assignment: 遠坂凛へDDDは装備不可として拒否する', () => {
    const { tools } = makeTools();
    const output = tools.execute('validate_lightcone_assignment', {
        character: 'rin_tohsaka', lightcone: 'Dance! Dance! Dance!',
    });
    assert.equal(output.ok, false);
    assert.equal(output.error.code, 'LIGHTCONE_PATH_MISMATCH');
    assert.equal(output.error.character.path, PATH.ERUDITION);
    assert.equal(output.error.lightcone.path, PATH.HARMONY);
});

test('estimate_ultimate_cycle: 保存ビルドと編成のEP供給で必殺技回転を計算する', () => {
    const { tools } = makeTools();
    const output = tools.execute('estimate_ultimate_cycle', {
        focus: { id: 'focus', build: '速度ビルド', rotation: ['skill'] },
        party: [{ character: '__ao_energy_support__', energyTargetIds: ['focus'] }],
    });
    assert.equal(output.ok, true, JSON.stringify(output));
    assert.equal(output.focus.id, 'focus');
    assert.equal(output.focus.speed, 121);
    assert.ok(output.energyGrants.some(grant => grant.targetId === 'focus'));
    assert.ok(output.reliableTurnsPerUltimate >= output.shortestTurnsPerUltimate);
});

test('search_speed_data: 空の検索語と件数超過を弾く', () => {
    const { tools } = makeTools();
    assert.equal(tools.execute('search_speed_data', { queries: ['  '] }).error.code, 'EMPTY_QUERY');
    const tooMany = tools.execute('search_speed_data', { queries: Array.from({ length: 21 }, (_, i) => `q${i}`) });
    assert.equal(tooMany.error.code, 'TOO_MANY_QUERIES');
});

test('search_action_effects: 由来つきの効果一覧と注意書きを返す', () => {
    const { tools } = makeTools();
    const output = tools.execute('search_action_effects', { queries: ['ツール検証キャラ'] });
    assert.equal(output.ok, true);
    const trace = output.effects.find(item => item.path === 'traces.stats');
    assert.equal(trace.kind, 'speedFlat');
    assert.equal(trace.value, 14);
    assert.equal(trace.origin, 'stats');
    assert.equal(trace.sourcePath, PATH.HARMONY);
    assert.match(output.guidance, /description/);
});

// ---- 保存ビルド ----

test('list_saved_builds: 保存ビルドをキャラ名つきで返す', () => {
    const { tools } = makeTools();
    const output = tools.execute('list_saved_builds', {});
    assert.equal(output.total, 1);
    assert.equal(output.builds[0].characterName, 'ツール検証キャラ');
});

test('read_build_speed: 速度と内訳だけを返し、火力の値は含まない', () => {
    const { tools } = makeTools();
    const output = tools.execute('read_build_speed', { build: '速度ビルド' });
    assert.equal(output.ok, true);
    assert.equal(output.speed, 121, '基礎107 + 軌跡14');
    assert.equal(output.breakdown.base, 107);
    assert.equal(output.breakdown.flat, 14);
    assert.equal(output.characterName, 'ツール検証キャラ');
    assert.equal('atk' in output, false, '攻撃力は返さない');
    assert.equal('damage' in output, false, 'ダメージは返さない');
});

test('read_build_speed: 保存ビルドが無い / 見つからない場合は理由を返す', () => {
    assert.equal(
        makeTools({ savedBuilds: [] }).tools.execute('read_build_speed', { build: 'x' }).error.code,
        'NO_SAVED_BUILDS',
    );
    const { tools } = makeTools();
    const output = tools.execute('read_build_speed', { build: '存在しない' });
    assert.equal(output.error.code, 'UNKNOWN_BUILD');
    assert.equal(output.error.available[0].id, 'build_ao_1');
});

test('read_build_speed: 未登録キャラのビルドは計算失敗として返す', () => {
    const { tools } = makeTools({ savedBuilds: [{ ...SAVED_BUILD, characterId: '__missing__' }] });
    const output = tools.execute('read_build_speed', { build: '速度ビルド' });
    assert.equal(output.ok, false);
    assert.equal(output.error.code, 'BUILD_COMPUTE_FAILED');
});

test('savedBuilds は関数でも渡せ、不正な要素は除外される', () => {
    const session = createActionOrderSession({ panels: [{ name: 'A' }] });
    const tools = createActionOrderTools({
        session, allowApply: false, savedBuilds: () => [SAVED_BUILD, null, { id: 'x' }],
    });
    assert.equal(tools.execute('list_saved_builds', {}).total, 1);
});

// ---- 計算 ----

test('run_action_order_simulation: 渡したパネルを計算し、画面状態は変えない', () => {
    const { session, tools } = makeTools();
    const output = tools.execute('run_action_order_simulation', {
        panels: [
            { name: '速度134', baseSpeed: 134, preSpeed: 134, threshold: 300, turns: [] },
            { name: '速度160', baseSpeed: 160, preSpeed: 160, threshold: 300, turns: [] },
        ],
    });
    assert.equal(output.ok, true);
    assert.equal(output.source, 'request');
    assert.equal(output.panels[0].turnsWithinThreshold, 4);
    assert.equal(output.panels[1].turnsWithinThreshold, 4);
    assert.equal(session.getState().panels.length, 2, '状態は変わらない');
    assert.equal(session.getState().panels[0].name, 'A');
});

test('run_action_order_simulation: パネル省略時は現在状態を計算する', () => {
    const { tools } = makeTools();
    const output = tools.execute('run_action_order_simulation', {});
    assert.equal(output.source, 'currentState');
    assert.equal(output.panels.length, 2);
});

test('run_action_order_simulation: 行動値短縮を入れると行動回数が増える', () => {
    const { tools } = makeTools();
    const output = tools.execute('run_action_order_simulation', {
        panels: [
            { name: '短縮なし', baseSpeed: 100, preSpeed: 100, threshold: 300, turns: [] },
            {
                name: '毎ターン短縮50%', baseSpeed: 100, preSpeed: 100, threshold: 300,
                turns: Array.from({ length: 6 }, () => ({ events: [{ type: 'advance', value: 50 }] })),
            },
        ],
    });
    assert.equal(output.panels[0].turnsWithinThreshold, 3);
    assert.equal(output.panels[1].turnsWithinThreshold, 6, '50AVずつ進むので6回');
});

test('run_action_order_simulation: 行動順遅延は advance の負値で表せる', () => {
    const { tools } = makeTools();
    const output = tools.execute('run_action_order_simulation', {
        panels: [{
            name: '遅延', baseSpeed: 100, preSpeed: 100, threshold: 300,
            turns: [{ events: [{ type: 'advance', value: -50 }] }],
        }],
        detail: 'full',
    });
    // ゲージ -5000 から開始 → 15000 を速度100で埋める
    assert.ok(Math.abs(output.panels[0].turns[0].actualAV - 150) < 0.01);
});

test('run_action_order_simulation: パネルが無い / 多すぎる場合は理由を返す', () => {
    const session = createActionOrderSession({ panels: [] });
    const tools = createActionOrderTools({ session, allowApply: true });
    assert.equal(tools.execute('run_action_order_simulation', {}).error.code, 'NO_PANELS');

    const { tools: full } = makeTools();
    const tooMany = full.execute('run_action_order_simulation', {
        panels: Array.from({ length: 9 }, (_, i) => ({ name: `p${i}`, baseSpeed: 100, preSpeed: 100 })),
    });
    assert.equal(tooMany.error.code, 'TOO_MANY_PANELS');
});

// ---- 承認フロー ----

test('propose → apply: 承認して初めて状態が変わり、undo できる', () => {
    const { session, tools } = makeTools();
    const proposed = tools.execute('propose_action_order_changes', {
        changes: { patches: [{ index: 0, preSpeed: 160 }] },
        summary: 'パネルAの開始前速度を160へ',
    });

    assert.equal(proposed.ok, true);
    assert.equal(proposed.approvalRequired, true);
    assert.equal(proposed.proposal.status, 'pending');
    assert.equal(proposed.proposal.preview[0].preSpeed, 160, '承認前に結果を確認できる');
    assert.equal(session.getState().panels[0].preSpeed, 100, 'まだ画面状態は変わらない');

    const applied = tools.execute('apply_action_order_changes', { proposalId: proposed.proposal.id, approved: true });
    assert.equal(applied.applied, true);
    assert.equal(session.getState().panels[0].preSpeed, 160);
    assert.equal(applied.undoAvailable, true);

    session.undo();
    assert.equal(session.getState().panels[0].preSpeed, 100);
});

test('propose: 不正な変更案は検証エラーを返す', () => {
    const { tools } = makeTools();
    const output = tools.execute('propose_action_order_changes', { changes: { patches: [{ index: 99 }] } });
    assert.equal(output.ok, false);
    assert.equal(output.validation.valid, false);
});

test('apply: 承認しなければ破棄され、状態は変わらない', () => {
    const { session, tools } = makeTools();
    const proposed = tools.execute('propose_action_order_changes', { changes: { patches: [{ index: 0, preSpeed: 160 }] } });
    const applied = tools.execute('apply_action_order_changes', { proposalId: proposed.proposal.id, approved: false });
    assert.equal(applied.applied, false);
    assert.equal(applied.proposal.status, 'discarded');
    assert.equal(session.getState().panels[0].preSpeed, 100);
});

test('apply: 同じ変更案は二度適用できない', () => {
    const { tools } = makeTools();
    const proposed = tools.execute('propose_action_order_changes', { changes: { patches: [{ index: 0, preSpeed: 160 }] } });
    tools.execute('apply_action_order_changes', { proposalId: proposed.proposal.id, approved: true });
    const again = tools.execute('apply_action_order_changes', { proposalId: proposed.proposal.id, approved: true });
    assert.equal(again.error.code, 'PROPOSAL_ALREADY_HANDLED');
});

test('apply: 存在しない変更案IDは弾く', () => {
    const { tools } = makeTools();
    assert.equal(
        tools.execute('apply_action_order_changes', { proposalId: 'nope', approved: true }).error.code,
        'UNKNOWN_PROPOSAL',
    );
});

test('apply: allowApply=false のサーバー側では適用できない', () => {
    const { session, tools } = makeTools({ allowApply: false });
    const proposed = tools.execute('propose_action_order_changes', { changes: { patches: [{ index: 0, preSpeed: 160 }] } });
    const applied = tools.execute('apply_action_order_changes', { proposalId: proposed.proposal.id, approved: true });
    assert.equal(applied.error.code, 'APPROVAL_REQUIRED_IN_UI');
    assert.equal(session.getState().panels[0].preSpeed, 100);
});

test('propose: 全置換の変更案もプレビューできる', () => {
    const { tools } = makeTools();
    const proposed = tools.execute('propose_action_order_changes', {
        changes: { panels: [{ name: '新規', baseSpeed: 120, preSpeed: 120, threshold: 150, turns: [] }] },
    });
    assert.equal(proposed.proposal.preview.length, 1);
    assert.equal(proposed.proposal.preview[0].name, '新規');
});

test('listProposals / getProposal で変更案を追える', () => {
    const { tools } = makeTools();
    const proposed = tools.execute('propose_action_order_changes', { changes: { patches: [{ index: 0, preSpeed: 160 }] } });
    assert.equal(tools.listProposals().length, 1);
    assert.equal(tools.getProposal(proposed.proposal.id).status, 'pending');
    assert.equal(tools.getProposal('nope'), null);
});
