import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { createDiminishingSession } from '../js/build/diminishingSession.js';
import { Build } from '../js/build/buildStore.js';
import { Registry } from '../js/build/registry.js';
import { createServerAiController } from '../js/ai/serverGateway.js';
import { loadRegisteredGameData } from '../js/ai/loadGameData.js';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));

async function makeState() {
    await loadRegisteredGameData(ROOT);
    const character = Registry.character.list().find(item => item.id !== 'template');
    assert.ok(character);
    return createDiminishingSession({ build: Build.blank(character.id) }).serialize();
}

function createMcpClient(child) {
    let buffer = '';
    const pending = new Map();
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', chunk => {
        buffer += chunk;
        let newline = buffer.indexOf('\n');
        while (newline >= 0) {
            const line = buffer.slice(0, newline).trim();
            buffer = buffer.slice(newline + 1);
            if (line) {
                const message = JSON.parse(line);
                const waiter = pending.get(message.id);
                if (waiter) {
                    pending.delete(message.id);
                    waiter.resolve(message);
                }
            }
            newline = buffer.indexOf('\n');
        }
    });
    return {
        request(id, method, params = {}) {
            return new Promise((resolveRequest, rejectRequest) => {
                const timer = setTimeout(() => {
                    pending.delete(id);
                    rejectRequest(new Error(`MCP timeout: ${method}`));
                }, 10000);
                pending.set(id, {
                    resolve(message) { clearTimeout(timer); resolveRequest(message); },
                });
                child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, params })}\n`);
            });
        },
    };
}

test('local MCP exposes only structured diminishing tools and blocks unapproved apply', async () => {
    const state = await makeState();
    const savedBuild = Build.blank('archer');
    savedBuild.id = 'mcp_saved_archer';
    savedBuild.name = 'MCP保存アーチャー';
    savedBuild.lightcone = { id: 'The Hell Where Ideals Burn', superimpose: 1 };
    state.savedBuilds = [savedBuild];
    const directory = join(ROOT, '.tmp', `mcp-${process.pid}-${Date.now()}`);
    const stateFile = join(directory, 'state.json');
    await mkdir(directory, { recursive: true });
    await writeFile(stateFile, JSON.stringify(state), 'utf8');
    const child = spawn(process.execPath, ['scripts/srsim-mcp-server.mjs', '--state', stateFile], {
        cwd: ROOT, stdio: ['pipe', 'pipe', 'pipe'],
    });
    try {
        const client = createMcpClient(child);
        const initialized = await client.request(1, 'initialize', { protocolVersion: '2025-06-18' });
        assert.equal(initialized.result.serverInfo.name, 'srsim-diminishing');
        const listed = await client.request(2, 'tools/list');
        assert.deepEqual(listed.result.tools.map(item => item.name), [
            'get_diminishing_context',
            'search_game_data',
            'validate_diminishing_job',
            'run_diminishing_comparison',
            'propose_diminishing_changes',
            'apply_diminishing_changes',
        ]);
        const context = await client.request(3, 'tools/call', { name: 'get_diminishing_context', arguments: {} });
        assert.equal(context.result.structuredContent.ok, true);
        const invalid = await client.request(31, 'tools/call', {
            name: 'search_game_data', arguments: { query: '', limit: 999 },
        });
        assert.equal(invalid.result.structuredContent.error.code, 'INVALID_TOOL_ARGUMENTS');
        const effects = await client.request(32, 'tools/call', {
            name: 'search_game_data', arguments: {
                query: '', queries: ['会心', '速度'], category: 'effect', limit: 50,
            },
        });
        assert.equal(effects.result.structuredContent.ok, true);
        assert.ok(effects.result.structuredContent.count > 0);
        const savedBuildComparison = await client.request(33, 'tools/call', {
            name: 'run_diminishing_comparison',
            arguments: {
                request: {
                    objective: '保存ビルド比較',
                    focus: { savedBuild: 'MCP保存アーチャー' },
                    cases: [{ label: '保存状態' }],
                },
            },
        });
        assert.equal(savedBuildComparison.result.structuredContent.ok, true);
        assert.equal(savedBuildComparison.result.structuredContent.result.cases[0].calculation.target.characterId, 'archer');
        const apply = await client.request(4, 'tools/call', {
            name: 'apply_diminishing_changes', arguments: { proposalId: 'missing', approved: true },
        });
        assert.equal(apply.result.structuredContent.error.code, 'APPROVAL_REQUIRED_IN_UI');
    } finally {
        child.kill('SIGTERM');
        await new Promise(resolveExit => child.once('exit', resolveExit));
        await rm(directory, { recursive: true, force: true });
    }
});

test('Responses API connection requires model listing and a real tool round trip', async () => {
    const requests = [];
    let responseNumber = 0;
    const fakeApi = createServer(async (request, response) => {
        const url = new URL(request.url, 'http://localhost');
        assert.equal(request.headers.authorization, 'Bearer test-key');
        if (request.method === 'GET' && url.pathname === '/v1/models') {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ data: [{ id: 'tool-model' }] }));
            return;
        }
        let text = '';
        for await (const chunk of request) text += chunk;
        const body = JSON.parse(text);
        requests.push(body);
        responseNumber += 1;
        if (String(body.input || '').includes('CANCEL_TEST')) {
            await new Promise(resolveDelay => setTimeout(resolveDelay, 250));
        }
        response.writeHead(200, { 'Content-Type': 'application/json' });
        if (String(body.input || '').includes('ASK_TEST')) {
            response.end(JSON.stringify({
                id: `response-${responseNumber}`, status: 'completed',
                output: [{ type: 'message', content: [{ type: 'output_text', text: '比較に必要な条件を確認します。' }] }],
            }));
            return;
        }
        if (!body.previous_response_id) {
            const forced = body.tool_choice?.name;
            const comparison = String(body.input || '').includes('COMPARE_TEST');
            const toolName = forced || (comparison ? 'run_diminishing_comparison' : 'get_diminishing_context');
            const args = toolName === 'search_game_data'
                ? { query: '', category: 'character', limit: 1 }
                : toolName === 'run_diminishing_comparison'
                    ? {
                        request: {
                            objective: '速度比較',
                            cases: [
                                { label: '速度134', stats: { speed: 134 } },
                                { label: '速度160', stats: { speed: 160 } },
                            ],
                        },
                    }
                    : {};
            response.end(JSON.stringify({
                id: `response-${responseNumber}`, status: 'completed',
                output: [{ type: 'function_call', call_id: `call-${responseNumber}`, name: toolName, arguments: JSON.stringify(args) }],
            }));
            return;
        }
        response.end(JSON.stringify({
            id: `response-${responseNumber}`, status: 'completed',
            output: [{ type: 'message', content: [{ type: 'output_text', text: 'ツール結果を確認しました。' }] }],
        }));
    });
    await new Promise(resolveListen => fakeApi.listen(0, '127.0.0.1', () => resolveListen()));
    const address = fakeApi.address();
    assert.ok(address && typeof address !== 'string');
    const localDir = join(ROOT, '.tmp', `api-${process.pid}-${Date.now()}`);
    try {
        const state = await makeState();
        const provider = {
            type: 'compatible', endpoint: `http://127.0.0.1:${address.port}`,
            apiKey: 'test-key', model: 'tool-model',
        };
        const controller = createServerAiController({ root: ROOT, localDir, timeoutMs: 10000 });
        const connected = await controller.connect({ provider, state });
        assert.equal(connected.toolTest, true);
        assert.deepEqual(connected.models, ['tool-model']);
        assert.ok(connected.diagnosticLogs.some(entry => entry.message === 'run_diminishing_comparison: ok'));
        assert.ok(connected.diagnosticLogs.every(entry => !JSON.stringify(entry).includes('test-key')));
        assert.equal(requests[0].tool_choice.name, 'run_diminishing_comparison');
        assert.equal(requests[1].input[0].type, 'function_call_output');
        assert.equal(typeof requests[1].instructions, 'string', 'ツール結果ラウンドにもinstructionsを再送する');

        const chat = await controller.chat({ provider, state, message: '現在状態を確認', sessionId: 'api-test' });
        assert.equal(chat.ok, true);
        assert.equal(chat.executions[0].name, 'get_diminishing_context');
        assert.equal(chat.finalText, 'ツール結果を確認しました。');

        const comparison = await controller.chat({
            provider, state, message: 'COMPARE_TEST compare speed damage', sessionId: 'api-comparison',
        });
        assert.equal(comparison.ok, true);
        assert.equal(comparison.executions[0].name, 'run_diminishing_comparison');
        assert.deepEqual(comparison.executions[0].output.result.cases.map(item => item.label), ['速度134', '速度160']);

        const requestsBeforeMissingCalculation = requests.length;
        await assert.rejects(
            controller.chat({ provider, state, message: 'compare damage without calculation', sessionId: 'api-no-comparison' }),
            /必要な計算ツールを実行しなかった/,
        );
        assert.equal(requests.length - requestsBeforeMissingCalculation, 2, 'ツール未実行時にLLM全体を再試行しない');

        const cancelledPromise = controller.chat({
            provider, state, message: 'CANCEL_TEST', sessionId: 'api-cancel',
        });
        for (let index = 0; index < 20 && !controller.cancel('api-cancel'); index++) {
            await new Promise(resolveDelay => setTimeout(resolveDelay, 5));
        }
        const cancelled = await cancelledPromise;
        assert.equal(cancelled.ok, false);
        assert.equal(cancelled.error.code, 'ABORTED');

        const busyPromise = controller.chat({
            provider, state, message: 'CANCEL_TEST', sessionId: 'api-busy',
        });
        await new Promise(resolveDelay => setTimeout(resolveDelay, 20));
        await assert.rejects(
            controller.chat({ provider, state, message: '同じセッションの二重送信', sessionId: 'api-busy' }),
            error => Boolean(error && typeof error === 'object' && 'code' in error && error.code === 'SESSION_BUSY'),
        );
        await busyPromise;

        const workspaceState = {
            diminishing: state,
            actionOrder: { panels: [{ name: '現在', baseSpeed: 100, preSpeed: 100, threshold: 150, turns: [] }] },
            savedBuilds: [],
            selectedBuildIds: [],
            assumptions: { objective: '厳選負担を抑えて比較' },
        };
        const workspaceConnected = await controller.connect({ provider, state: workspaceState, scope: 'workspace' });
        assert.equal(workspaceConnected.toolTest, true);
        assert.match(requests.at(-1).instructions, /あなたは崩壊スターレイルの限界効用計算アシスタントです/);
        assert.match(requests.at(-1).instructions, /目的: 厳選負担を抑えて比較/);
        const clarification = await controller.chat({
            provider, state: workspaceState, message: 'ASK_TEST', sessionId: 'workspace-clarification', scope: 'workspace',
        });
        assert.equal(clarification.ok, true);
        assert.equal(clarification.finalText, '比較に必要な条件を確認します。');
        assert.deepEqual(clarification.executions, []);

        const actionOrderState = { ...workspaceState, simulationTarget: 'actionOrder' };
        const actionOrderConnected = await controller.connect({ provider, state: actionOrderState, scope: 'workspace' });
        assert.equal(actionOrderConnected.toolTest, true);
        assert.match(requests.at(-1).instructions, /あなたは崩壊スターレイルの行動順シミュレーターのアシスタントです/);
    } finally {
        await new Promise(resolveClose => fakeApi.close(resolveClose));
        await rm(localDir, { recursive: true, force: true });
    }
});
