import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile, rm } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

async function getFreePort() {
    const { createServer } = await import('node:net');
    return new Promise((resolvePort, rejectPort) => {
        const server = createServer();
        server.on('error', rejectPort);
        server.listen(0, '127.0.0.1', () => {
            const address = server.address();
            if (!address || typeof address === 'string') {
                server.close(() => rejectPort(new Error('port not available')));
                return;
            }
            server.close(() => resolvePort(address.port));
        });
    });
}

async function waitForServer(baseUrl, child) {
    let lastError;
    for (let index = 0; index < 60; index++) {
        if (child.exitCode !== null) throw new Error(`server exited early: ${child.exitCode}`);
        try {
            const response = await fetch(baseUrl);
            if (response.ok) return;
        } catch (error) {
            lastError = error;
        }
        await new Promise(resolveWait => setTimeout(resolveWait, 100));
    }
    throw lastError || new Error('server did not start');
}

async function startTestServer(repoRoot) {
    const port = await getFreePort();
    const localDir = `.tmp/server-local-state-${process.pid}-${Date.now()}`;
    const child = spawn(process.execPath, ['server.js'], {
        cwd: repoRoot,
        env: { ...process.env, PORT: String(port), SRSIM_LOCAL_DIR: localDir },
        stdio: ['ignore', 'pipe', 'pipe'],
    });
    const baseUrl = `http://127.0.0.1:${port}`;
    await waitForServer(baseUrl, child);
    return { child, baseUrl, localDir: resolve(repoRoot, localDir) };
}

async function stopTestServer(child) {
    if (child.exitCode !== null) return;
    child.kill('SIGTERM');
    await new Promise(resolveStop => child.once('exit', resolveStop));
}

test('server persists local JSON and rejects removed arbitrary CLI endpoints', async () => {
    const repoRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
    const { child, baseUrl, localDir } = await startTestServer(repoRoot);
    try {
        const actionOrderState = {
            schema: 'srsim.speedAdvanced.v1',
            mode: 'all',
            panels: [{ name: '保存テスト', baseSpeed: 100, preSpeed: 134, threshold: 150, turns: [] }],
        };
        const putResponse = await fetch(`${baseUrl}/api/action-order/state`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ state: actionOrderState }),
        });
        const putData = await putResponse.json();
        assert.equal(putResponse.ok, true);
        assert.equal(putData.stateFile, relative(repoRoot, join(localDir, 'action-order-state.json')));
        assert.equal(JSON.parse(await readFile(join(localDir, 'action-order-state.json'), 'utf8')).panels[0].name, '保存テスト');

        const getData = await (await fetch(`${baseUrl}/api/action-order/state`)).json();
        assert.equal(getData.state.panels[0].name, '保存テスト');

        const removedActionAi = await fetch(`${baseUrl}/api/action-order/ai-run`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command: 'echo unsafe', state: actionOrderState }),
        });
        assert.equal(removedActionAi.status, 404);

        const namedState = { schema: 'srsim.diminishing.v2', build: { name: 'ビルド1' } };
        const saveResponse = await fetch(`${baseUrl}/api/local-save/diminishing`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'ビルド1', state: namedState }),
        });
        const saveData = await saveResponse.json();
        assert.equal(saveResponse.ok, true);
        assert.equal(saveData.entry.name, 'ビルド1');

        const listData = await (await fetch(`${baseUrl}/api/local-save/diminishing`)).json();
        assert.equal(listData.entries.length, 1);
        const readData = await (await fetch(`${baseUrl}/api/local-save/diminishing/entry/${encodeURIComponent(saveData.entry.id)}`)).json();
        assert.equal(readData.state.build.name, 'ビルド1');

        const removedGenericAi = await fetch(`${baseUrl}/api/local-save/diminishing/ai-run`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command: 'echo unsafe', state: namedState }),
        });
        assert.equal(removedGenericAi.status, 404);

        const deleteResponse = await fetch(`${baseUrl}/api/local-save/diminishing/entry/${encodeURIComponent(saveData.entry.id)}`, { method: 'DELETE' });
        assert.equal((await deleteResponse.json()).exists, false);
    } finally {
        await stopTestServer(child);
        await rm(localDir, { recursive: true, force: true });
    }
});
