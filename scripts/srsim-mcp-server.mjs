#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDiminishingSession } from '../js/build/diminishingSession.js';
import { createDiminishingTools } from '../js/ai/diminishingTools.js';
import { createActionOrderSession } from '../js/build/actionOrderSession.js';
import { createActionOrderTools } from '../js/ai/actionOrderTools.js';
import { createWorkspaceSession, createWorkspaceTools } from '../js/ai/workspaceTools.js';
import { loadRegisteredGameData } from '../js/ai/loadGameData.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const stateArgIndex = args.indexOf('--state');
const scopeArgIndex = args.indexOf('--scope');
// scope で扱うタブを切り替える。未指定なら従来どおり限界効用。
const requestedScope = scopeArgIndex >= 0 ? args[scopeArgIndex + 1] : 'diminishing';
const scope = ['workspace', 'actionOrder', 'diminishing'].includes(requestedScope) ? requestedScope : 'diminishing';
const stateDirectory = scope === 'workspace' ? 'ai-workspace' : scope === 'actionOrder' ? 'action-order' : 'diminishing';
const defaultStateFile = join(ROOT, 'local', stateDirectory, '_ai-current.json');
const stateFile = resolve(stateArgIndex >= 0 ? args[stateArgIndex + 1] : process.env.SRSIM_DIMINISHING_STATE_FILE || defaultStateFile);

async function readStatePayload() {
    const parsed = JSON.parse(await readFile(stateFile, 'utf8'));
    return parsed.state && typeof parsed.state === 'object' ? parsed.state : parsed;
}

await loadRegisteredGameData(ROOT);
const statePayload = await readStatePayload();
const tools = scope === 'workspace'
    ? createWorkspaceTools({
        session: createWorkspaceSession(statePayload),
        allowApply: false,
        savedBuilds: statePayload.savedBuilds,
        selectedBuildIds: statePayload.selectedBuildIds,
        simulationTarget: statePayload.simulationTarget,
    })
    : scope === 'actionOrder'
        ? createActionOrderTools({
        session: createActionOrderSession(statePayload),
        allowApply: false,
        savedBuilds: statePayload.savedBuilds,
        })
        : createDiminishingTools({
        session: createDiminishingSession(statePayload),
        allowApply: false,
        savedBuilds: statePayload.savedBuilds,
        });

function send(payload) {
    process.stdout.write(`${JSON.stringify(payload)}\n`);
}

function toolResult(output) {
    return {
        content: [{ type: 'text', text: JSON.stringify(output) }],
        structuredContent: output,
        isError: output?.ok === false,
    };
}

async function callTool(name, input) {
    return tools.execute(name, input === undefined ? {} : input);
}

async function handle(message) {
    if (!message || typeof message !== 'object' || !message.method) return;
    if (message.method === 'initialize') {
        send({
            jsonrpc: '2.0',
            id: message.id,
            result: {
                protocolVersion: message.params?.protocolVersion || '2025-06-18',
                capabilities: { tools: { listChanged: false } },
                serverInfo: { name: `srsim-${scope}`, version: '1.0.0' },
            },
        });
        return;
    }
    if (message.method === 'ping') {
        send({ jsonrpc: '2.0', id: message.id, result: {} });
        return;
    }
    if (message.method === 'tools/list') {
        send({
            jsonrpc: '2.0',
            id: message.id,
            result: {
                tools: tools.definitions.map(definition => ({
                    name: definition.name,
                    description: definition.description,
                    inputSchema: definition.inputSchema,
                })),
            },
        });
        return;
    }
    if (message.method === 'tools/call') {
        const output = await callTool(message.params?.name, message.params?.arguments);
        send({ jsonrpc: '2.0', id: message.id, result: toolResult(output) });
        return;
    }
    if (message.id !== undefined) {
        send({
            jsonrpc: '2.0',
            id: message.id,
            error: { code: -32601, message: `Method not found: ${message.method}` },
        });
    }
}

let buffer = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => {
    buffer += chunk;
    let newline = buffer.indexOf('\n');
    while (newline >= 0) {
        const line = buffer.slice(0, newline).trim();
        buffer = buffer.slice(newline + 1);
        if (line) {
            Promise.resolve()
                .then(() => handle(JSON.parse(line)))
                .catch(error => send({ jsonrpc: '2.0', id: null, error: { code: -32603, message: error.message } }));
        }
        newline = buffer.indexOf('\n');
    }
});
