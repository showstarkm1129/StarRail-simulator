import assert from 'node:assert/strict';
import { test } from 'node:test';

import { Build } from '../js/build/buildStore.js';
import { createWorkspaceSession, createWorkspaceTools } from '../js/ai/workspaceTools.js';
import { loadRegisteredGameData } from '../js/ai/loadGameData.js';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));

/** @param {'diminishing' | 'actionOrder'} [simulationTarget] */
async function makeTools(simulationTarget = 'diminishing') {
    await loadRegisteredGameData(ROOT);
    const saved = Build.blank('bronya');
    saved.id = 'selected-bronya';
    saved.name = '選択ブローニャ';
    const session = createWorkspaceSession({
        diminishing: { build: Build.blank('bronya') },
        actionOrder: {
            panels: [{ name: '速度134', baseSpeed: 100, preSpeed: 134, threshold: 150, turns: [] }],
            quickPresets: [{ id: 'quick-note', type: 'speedPct', value: 12, label: 'メッセ4', memo: '味方スキル後だけ有効' }],
        },
        assumptions: {
            objective: '厳選負担を抑えて比較',
            effectUptimes: [{ key: 'bronya:party:skill', name: '戦闘スキル', source: 'ブローニャ', durationTurns: 1 }],
            actionOrderGoal: '累計150AVまで',
        },
    });
    return createWorkspaceTools({
        session,
        savedBuilds: [saved],
        selectedBuildIds: ['selected-bronya'],
        simulationTarget,
    });
}

test('workspace tools expose only the selected diminishing simulator', async () => {
    const tools = await makeTools();
    assert.deepEqual(tools.definitions.map(item => item.name), [
        'get_workspace_context', 'read_saved_builds',
        'search_game_data', 'run_diminishing_comparison', 'propose_diminishing_changes',
    ]);
    const output = tools.execute('get_workspace_context', {});
    assert.equal(output.ok, true);
    assert.equal(output.simulationTarget, 'diminishing');
    assert.equal(output.diminishing.ok, true);
    assert.equal('actionOrder' in output, false);
    assert.equal(output.savedBuilds.selected[0].id, 'selected-bronya');
    assert.equal(output.assumptions.objective, '厳選負担を抑えて比較');
    assert.equal(output.assumptions.effectUptimes[0].durationTurns, 1);
    assert.equal('state' in output.diminishing, false);
    assert.equal(tools.execute('run_action_order_simulation', {}).error.code, 'UNKNOWN_TOOL');

    const savedOnly = tools.execute('get_workspace_context', { sections: ['savedBuilds'] });
    assert.equal(savedOnly.savedBuilds.total, 1);
    assert.equal('diminishing' in savedOnly, false);
    assert.equal('actionOrder' in savedOnly, false);
});

test('workspace tools expose only the selected action-order simulator', async () => {
    const tools = await makeTools('actionOrder');
    assert.deepEqual(tools.definitions.map(item => item.name), [
        'get_workspace_context', 'read_saved_builds',
        'list_action_order_quick_presets', 'search_speed_data', 'list_equippable_lightcones', 'validate_lightcone_assignment', 'estimate_ultimate_cycle', 'search_action_effects', 'read_build_speed', 'run_action_order_simulation', 'propose_action_order_changes',
    ]);
    const context = tools.execute('get_workspace_context', {});
    assert.equal(context.simulationTarget, 'actionOrder');
    assert.equal(context.actionOrder.panelCount, 1);
    assert.equal(tools.execute('list_action_order_quick_presets', {}).presets[0].memo, '味方スキル後だけ有効');
    assert.equal('diminishing' in context, false);
    assert.equal(tools.execute('read_build_speed', { build: '選択ブローニャ' }).ok, true);
    assert.equal(tools.execute('run_diminishing_comparison', {}).error.code, 'UNKNOWN_TOOL');
});

test('workspace tools read requested saved builds and delegate the selected calculator', async () => {
    const actionTools = await makeTools('actionOrder');
    const builds = actionTools.execute('read_saved_builds', { references: ['選択ブローニャ'] });
    assert.equal(builds.ok, true);
    assert.equal(builds.builds[0].characterName, 'ブローニャ');
    assert.equal('meta' in builds.builds[0], false);

    const action = actionTools.execute('run_action_order_simulation', {});
    assert.equal(action.ok, true);
    assert.equal(action.panels[0].turnsWithinThreshold > 0, true);

    const diminishingTools = await makeTools('diminishing');
    const diminishing = diminishingTools.execute('run_diminishing_comparison', {
        request: { objective: '現在状態', cases: [{ label: '現在' }] },
    });
    assert.equal(diminishing.ok, true);
    assert.equal(diminishing.result.cases.length, 1);
});

test('workspace tools reject oversized and unknown saved-build requests', async () => {
    const tools = await makeTools();
    assert.equal(tools.execute('read_saved_builds', { references: Array(9).fill('x') }).error.code, 'TOO_MANY_BUILDS');
    assert.equal(tools.execute('read_saved_builds', { references: ['missing'] }).error.code, 'BUILD_NOT_FOUND');
});
