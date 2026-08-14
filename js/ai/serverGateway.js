// serverGateway.js — サイト内AIと外部プロバイダーの差を吸収するNode.js側の境界。
import { spawn } from 'node:child_process';
import { access, mkdir, unlink, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { createAiGateway } from './aiGateway.js';
import { asOpenAiTools, createDiminishingTools } from './diminishingTools.js';
import { createActionOrderTools } from './actionOrderTools.js';
import { loadRegisteredGameData } from './loadGameData.js';
import { createDiminishingSession } from '../build/diminishingSession.js';
import { createActionOrderSession } from '../build/actionOrderSession.js';
import { createWorkspaceSession, createWorkspaceTools } from './workspaceTools.js';
import { loadSystemPrompt } from './prompts/loadSystemPrompt.js';

const DEFAULT_OPENAI_ENDPOINT = 'https://api.openai.com/v1';
const DEFAULT_TIMEOUT_MS = 120000;
const MAX_CLI_RESUME_TURNS = 3;
const AI_SESSION_TTL_MS = 30 * 60 * 1000;
const MAX_AI_SESSIONS = 100;
const MAX_PROCESS_OUTPUT = 4 * 1024 * 1024;
const SYSTEM_INSTRUCTIONS = loadSystemPrompt('diminishingSystemPrompt.md');
const CONNECTION_TEST_REQUEST = Object.freeze({
    objective: '接続試験: 現在状態の再計算',
    cases: [{ label: '現在' }],
});

const ACTION_ORDER_SYSTEM_INSTRUCTIONS = loadSystemPrompt('actionOrderSystemPrompt.md');

const ACTION_ORDER_CONNECTION_TEST_PANELS = Object.freeze([
    { name: '接続試験', baseSpeed: 100, preSpeed: 134, threshold: 150, turns: [] },
]);

const WORKSPACE_SYSTEM_INSTRUCTIONS = loadSystemPrompt('workspaceSystemPrompt.md');

/**
 * タブごとのAI設定。既定は限界効用で、行動順タブは scope='actionOrder' を渡して切り替える。
 * 片方の設定を変えてももう片方に影響しないよう、ここで完全に分離する。
 */
const SCOPES = Object.freeze({
    workspace: Object.freeze({
        id: 'workspace',
        label: 'AIワークスペース',
        stateDir: 'ai-workspace',
        instructions: WORKSPACE_SYSTEM_INSTRUCTIONS,
        createSession: state => createWorkspaceSession(state),
        createTools: (session, getSavedBuilds, getSelectedBuildIds, getSimulationTarget) => createWorkspaceTools({
            session,
            savedBuilds: getSavedBuilds,
            selectedBuildIds: getSelectedBuildIds,
            simulationTarget: getSimulationTarget(),
            allowApply: false,
        }),
        cliEnabledTools: [
            'get_workspace_context', 'read_saved_builds', 'search_game_data',
            'list_action_order_quick_presets', 'search_speed_data', 'list_equippable_lightcones', 'validate_lightcone_assignment', 'estimate_ultimate_cycle', 'search_action_effects', 'read_build_speed', 'run_diminishing_comparison',
            'run_action_order_simulation', 'propose_diminishing_changes',
            'propose_action_order_changes',
        ],
        connectionTool: 'get_workspace_context',
        connectionPrompt: '接続試験です。get_workspace_context を detail="summary" で1回呼び、取得できた対象の種類だけを一文で回答してください。',
        connectionArgs: { detail: 'summary' },
        requiredTool: null,
        memoryTools: ['run_diminishing_comparison', 'run_action_order_simulation'],
        requireToolForChat: false,
        requiredPattern: /$^/,
        failureMessage: '現在状態の取得成功を確認できませんでした',
    }),
    diminishing: Object.freeze({
        id: 'diminishing',
        label: '限界効用',
        stateDir: 'diminishing',
        instructions: SYSTEM_INSTRUCTIONS,
        createSession: state => createDiminishingSession(state),
        createTools: (session, getSavedBuilds) => createDiminishingTools({
            session, allowApply: false, savedBuilds: getSavedBuilds,
        }),
        cliEnabledTools: [
            'get_diminishing_context', 'search_game_data', 'validate_diminishing_job',
            'run_diminishing_comparison', 'propose_diminishing_changes',
        ],
        connectionTool: 'run_diminishing_comparison',
        connectionPrompt: `接続試験です。ほかのツールを呼ばず、run_diminishing_comparison のrequestに次の条件をそのまま渡してください。最後に成功可否だけを一文で回答してください。\n${JSON.stringify(CONNECTION_TEST_REQUEST)}`,
        connectionArgs: { request: CONNECTION_TEST_REQUEST },
        requiredTool: 'run_diminishing_comparison',
        requiredPattern: /(比較|計算|火力|速度|ステータス|装備|遺物|会心|compare|damage|speed|stat|relic)/i,
        failureMessage: '限界効用の再計算成功を確認できませんでした',
    }),
    actionOrder: Object.freeze({
        id: 'actionOrder',
        label: '行動順',
        stateDir: 'action-order',
        instructions: ACTION_ORDER_SYSTEM_INSTRUCTIONS,
        createSession: state => createActionOrderSession(state),
        createTools: (session, getSavedBuilds) => createActionOrderTools({
            session, allowApply: false, savedBuilds: getSavedBuilds,
        }),
        cliEnabledTools: [
            'get_action_order_context', 'list_action_order_quick_presets', 'search_speed_data', 'list_equippable_lightcones', 'validate_lightcone_assignment', 'estimate_ultimate_cycle', 'search_action_effects',
            'list_saved_builds', 'read_build_speed', 'run_action_order_simulation',
            'propose_action_order_changes',
        ],
        connectionTool: 'run_action_order_simulation',
        connectionPrompt: `接続試験です。ほかのツールを呼ばず、run_action_order_simulation に次のパネルをそのまま渡してください。最後に成功可否だけを一文で回答してください。\n${JSON.stringify({ panels: ACTION_ORDER_CONNECTION_TEST_PANELS })}`,
        connectionArgs: { panels: ACTION_ORDER_CONNECTION_TEST_PANELS },
        requiredTool: 'run_action_order_simulation',
        requiredPattern: /(行動順|行動値|行動回数|速度|ターン|AV|バフ|短縮|遅延|speed|turn|action)/i,
        failureMessage: '行動順の計算成功を確認できませんでした',
    }),
});

function resolveScope(value) {
    return SCOPES[value] || SCOPES.diminishing;
}

function diagnosticLog(level, source, message, details = undefined, timestamp = new Date().toISOString()) {
    const entry = { timestamp, level, source, message };
    if (details !== undefined) entry.details = details;
    return entry;
}

function safeDiagnosticText(value, limit = 1000) {
    return String(value || '')
        .replace(/Bearer\s+[^\s"']+/gi, 'Bearer [REDACTED]')
        .replace(/\bsk-[a-zA-Z0-9_-]+/g, '[REDACTED_API_KEY]')
        .slice(-limit);
}

const LOGIN_HINT_PATTERN = /not logged in|not authenticated|unauthorized|401|please run \/login|please log ?in|log in to|token has expired|re-?authenticate/i;
const LOGIN_HINTS = Object.freeze({
    codex: ' ターミナルで `codex login` を実行してログインしてください。',
    claude: ' ターミナルで `claude auth login`（対話モードでは `/login`）を実行してログインしてください。',
});

// CLIの失敗メッセージから未ログイン・認証切れらしき文言を検知し、再ログイン手順のヒントを付け足す。
function loginHint(type, detail) {
    return LOGIN_HINT_PATTERN.test(String(detail || '')) ? LOGIN_HINTS[type] || '' : '';
}

function parseToolArguments(value) {
    if (value && typeof value === 'object') return value;
    if (typeof value !== 'string') return {};
    try { return JSON.parse(value); } catch { return {}; }
}

function diagnosticToolArguments(name, value) {
    const args = parseToolArguments(value);
    if (String(name).endsWith('search_game_data')) {
        return {
            query: safeDiagnosticText(args.query, 100),
            queries: Array.isArray(args.queries)
                ? args.queries.slice(0, 20).map(item => safeDiagnosticText(item, 100))
                : [],
            category: args.category || 'all',
            limit: args.limit || 20,
        };
    }
    if (String(name).endsWith('get_diminishing_context')) {
        return { detail: args.detail || 'summary' };
    }
    if (String(name).endsWith('run_diminishing_comparison') || String(name).endsWith('validate_diminishing_job')) {
        return {
            objective: safeDiagnosticText(args.request?.objective || args.job?.objective, 200),
            caseCount: Array.isArray(args.request?.cases)
                ? args.request.cases.length
                : Array.isArray(args.job?.variations) ? args.job.variations.length : 0,
        };
    }
    if (String(name).endsWith('propose_diminishing_changes')) {
        return { caseLabel: safeDiagnosticText(args.caseLabel, 100) };
    }
    return undefined;
}

function codexEventDiagnostics(events) {
    return events.flatMap(event => {
        if (event.type === 'thread.started') {
            return [diagnosticLog('info', 'codex', 'Codex会話を開始しました。', { event: event.type }, event._receivedAt)];
        }
        const item = event.item;
        if (item?.type === 'mcp_tool_call' && ['item.completed', 'item.updated'].includes(event.type)) {
            const toolName = item.tool || item.name || 'unknown';
            const argumentsSummary = diagnosticToolArguments(toolName, item.arguments);
            return [diagnosticLog(
                item.status === 'failed' ? 'error' : 'info',
                'mcp',
                `${toolName}: ${item.status || 'unknown'}`,
                {
                    event: event.type,
                    outcome: executionOutcome({ output: extractMcpOutput(item) }),
                    ...(argumentsSummary ? { arguments: argumentsSummary } : {}),
                },
                event._receivedAt,
            )];
        }
        if (event.type === 'turn.completed' || event.type === 'turn.failed') {
            return [diagnosticLog(event.type === 'turn.failed' ? 'error' : 'info', 'codex', event.type, { event: event.type }, event._receivedAt)];
        }
        return [];
    });
}

function attachDiagnosticLogs(error, logs) {
    const current = Array.isArray(error?.diagnosticLogs) ? error.diagnosticLogs : [];
    if (error && typeof error === 'object') error.diagnosticLogs = [...logs, ...current];
    return error;
}

function hasRequiredExecution(executions, message, scope = SCOPES.diminishing) {
    if ('requireToolForChat' in scope && scope.requireToolForChat === false) return true;
    const calculationRequested = scope.requiredPattern.test(String(message || ''));
    const ran = toolName => executions.some(item => (
        String(item.name || '').endsWith(toolName) && item.output?.ok === true
    ));
    return calculationRequested
        ? ran(scope.requiredTool)
        : executions.some(item => item.output?.ok === true);
}

function cleanEndpoint(value, type) {
    const raw = String(value || (type === 'openai' ? DEFAULT_OPENAI_ENDPOINT : '')).trim().replace(/\/+$/, '');
    if (!raw) throw new Error('API URLを入力してください。');
    const url = new URL(raw);
    const loopback = ['localhost', '127.0.0.1', '::1'].includes(url.hostname);
    if (url.protocol !== 'https:' && !(url.protocol === 'http:' && loopback)) {
        throw new Error('API URLはHTTPS、またはローカルHTTPだけを使用できます。');
    }
    return raw.endsWith('/v1') ? raw : `${raw}/v1`;
}

function normalizeConfig(input = {}) {
    const type = String(input.type || 'codex');
    if (!['codex', 'claude', 'openai', 'compatible'].includes(type)) throw new Error('未対応のAI接続方式です。');
    if (type === 'codex' || type === 'claude') {
        const reasoningEffort = String(input.reasoningEffort || '').trim();
        if (reasoningEffort && !['low', 'medium', 'high', 'xhigh', 'max'].includes(reasoningEffort)) {
            throw new Error('未対応の推論レベルです。');
        }
        const config = {
            type,
            model: String(input.model || '').trim(),
            reasoningEffort,
        };
        // verbosity は Codex CLI (model_verbosity) だけの概念。Claude Code CLIには対応する設定がない。
        if (type === 'codex') config.verbosity = input.verbosity === 'low' ? 'low' : '';
        return config;
    }
    const apiKey = String(input.apiKey || '').trim();
    if (!apiKey) throw new Error('APIキーを入力してください。');
    return {
        type,
        endpoint: cleanEndpoint(input.endpoint, type),
        apiKey,
        model: String(input.model || '').trim(),
    };
}

async function fetchJson(url, init, label) {
    const response = await fetch(url, init);
    const text = await response.text();
    let body;
    try { body = text ? JSON.parse(text) : {}; }
    catch { throw new Error(`${label}の応答がJSONではありません。`); }
    if (!response.ok) {
        const message = body?.error?.message || body?.message || `${response.status} ${response.statusText}`;
        throw new Error(`${label}に失敗しました: ${message}`);
    }
    return body;
}

function responseText(response) {
    if (typeof response.output_text === 'string') return response.output_text;
    return (response.output || [])
        .filter(item => item.type === 'message')
        .flatMap(item => item.content || [])
        .filter(item => item.type === 'output_text')
        .map(item => item.text || '')
        .join('\n');
}

function createResponsesAdapter(config, scope = SCOPES.diminishing) {
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
    };
    return {
        async listModels(signal) {
            const body = await fetchJson(`${config.endpoint}/models`, { headers, signal }, 'モデル一覧の取得');
            return (body.data || []).map(item => item.id).filter(Boolean).sort();
        },
        async respond({ input, toolOutputs, tools, signal, sessionId, metadata = {} }) {
            const toolChoice = /** @type {{ toolChoice?: string }} */ (metadata).toolChoice;
            const body = {
                model: config.model,
                tools: asOpenAiTools(tools),
                parallel_tool_calls: true,
                store: true,
                // Responses API では previous_response_id を使っても instructions は次へ
                // 引き継がれないため、ツール結果を返すラウンドにも毎回付ける。
                instructions: scope.instructions,
            };
            if (sessionId) body.previous_response_id = sessionId;
            if (toolOutputs?.length) {
                body.input = toolOutputs.map(item => ({
                    type: 'function_call_output',
                    call_id: item.callId,
                    output: JSON.stringify(item.output),
                }));
            } else {
                body.input = String(input || '');
            }
            if (toolChoice) body.tool_choice = { type: 'function', name: toolChoice };
            const response = await fetchJson(`${config.endpoint}/responses`, {
                method: 'POST', headers, signal, body: JSON.stringify(body),
            }, 'Responses APIの呼び出し');
            const toolCalls = (response.output || [])
                .filter(item => item.type === 'function_call')
                .map(item => ({ id: item.call_id, name: item.name, arguments: item.arguments }));
            return {
                sessionId: response.id,
                finalText: toolCalls.length ? undefined : responseText(response),
                toolCalls,
                events: [{ type: 'response', id: response.id, status: response.status }],
            };
        },
    };
}

function appendLimited(current, chunk) {
    if (current.length >= MAX_PROCESS_OUTPUT) return current;
    return (current + chunk).slice(0, MAX_PROCESS_OUTPUT);
}

function runProcess(command, args, { cwd, signal, timeoutMs = DEFAULT_TIMEOUT_MS }) {
    return new Promise((resolveRun, rejectRun) => {
        let stdout = '';
        let stderr = '';
        let stdoutLineBuffer = '';
        const stdoutTimeline = [];
        let timedOut = false;
        // プロンプトは常に引数で渡す。stdin を pipe にすると Codex CLI が追加入力を待つ
        // 経路に入ることがあるため、明示的に無効化して終了待ちを防ぐ。
        const child = spawn(command, args, {
            cwd,
            shell: false,
            windowsHide: true,
            stdio: ['ignore', 'pipe', 'pipe'],
        });
        const stop = () => child.kill('SIGTERM');
        if (signal?.aborted) stop();
        else signal?.addEventListener('abort', stop, { once: true });
        const timer = setTimeout(() => { timedOut = true; stop(); }, timeoutMs);
        child.stdout?.on('data', chunk => {
            const text = chunk.toString('utf8');
            stdout = appendLimited(stdout, text);
            stdoutLineBuffer = appendLimited(stdoutLineBuffer, text);
            let newline = stdoutLineBuffer.indexOf('\n');
            while (newline >= 0) {
                const line = stdoutLineBuffer.slice(0, newline).trim();
                stdoutLineBuffer = stdoutLineBuffer.slice(newline + 1);
                if (line && stdoutTimeline.length < 2000) stdoutTimeline.push({ line, receivedAt: new Date().toISOString() });
                newline = stdoutLineBuffer.indexOf('\n');
            }
        });
        child.stderr?.on('data', chunk => { stderr = appendLimited(stderr, chunk.toString('utf8')); });
        child.on('error', error => {
            clearTimeout(timer);
            signal?.removeEventListener('abort', stop);
            rejectRun(error);
        });
        child.on('close', code => {
            clearTimeout(timer);
            signal?.removeEventListener('abort', stop);
            const remaining = stdoutLineBuffer.trim();
            if (remaining && stdoutTimeline.length < 2000) stdoutTimeline.push({ line: remaining, receivedAt: new Date().toISOString() });
            resolveRun({ code, stdout, stderr, timedOut, stdoutTimeline });
        });
    });
}

async function findCodex(signal) {
    const finder = process.platform === 'win32'
        ? await runProcess('where.exe', ['codex'], { cwd: process.cwd(), signal, timeoutMs: 10000 })
        : await runProcess('which', ['codex'], { cwd: process.cwd(), signal, timeoutMs: 10000 });
    const candidates = finder.stdout.split(/\r?\n/).map(value => value.trim()).filter(Boolean);
    if (finder.code !== 0 || candidates.length === 0) throw new Error('Codex CLIが見つかりません。CodexをインストールしてPATHへ追加してください。');
    if (process.platform === 'win32') {
        const commandWrapper = candidates.find(value => value.toLowerCase().endsWith('.cmd'));
        if (commandWrapper) {
            const script = join(dirname(commandWrapper), 'node_modules', '@openai', 'codex', 'bin', 'codex.js');
            try {
                await access(script);
                return { command: process.execPath, prefixArgs: [script] };
            } catch { /* npm版でなければ実行可能なexeへフォールバックする。 */ }
        }
        const executable = candidates.find(value => value.toLowerCase().endsWith('.exe'));
        if (executable) return { command: executable, prefixArgs: [] };
    }
    return { command: candidates[0], prefixArgs: [] };
}

async function findClaude(signal) {
    const finder = process.platform === 'win32'
        ? await runProcess('where.exe', ['claude'], { cwd: process.cwd(), signal, timeoutMs: 10000 })
        : await runProcess('which', ['claude'], { cwd: process.cwd(), signal, timeoutMs: 10000 });
    const candidates = finder.stdout.split(/\r?\n/).map(value => value.trim()).filter(Boolean);
    if (finder.code !== 0 || candidates.length === 0) throw new Error('Claude Code CLIが見つかりません。Claude CodeをインストールしてPATHへ追加してください。');
    if (process.platform === 'win32') {
        // ネイティブインストールは claude.exe をそのまま実行できる。npm版の claude.cmd はシェル無しでは直接起動できないため、
        // 中の cli.js を node から直接起動する (Codexの.cmdラッパー対応と同じ考え方)。
        const executable = candidates.find(value => value.toLowerCase().endsWith('.exe'));
        if (executable) return { command: executable, prefixArgs: [] };
        const commandWrapper = candidates.find(value => value.toLowerCase().endsWith('.cmd'));
        if (commandWrapper) {
            const script = join(dirname(commandWrapper), 'node_modules', '@anthropic-ai', 'claude-code', 'cli.js');
            try {
                await access(script);
                return { command: process.execPath, prefixArgs: [script] };
            } catch { /* npm版のラッパー構成が異なる場合はそのまま実行する。 */ }
        }
    }
    return { command: candidates[0], prefixArgs: [] };
}

function parseJsonLines(text) {
    const events = [];
    for (const line of text.split(/\r?\n/)) {
        if (!line.trim()) continue;
        try { events.push(JSON.parse(line)); }
        catch { /* CodexのJSONL以外の診断行はstderrと同様に扱う。 */ }
    }
    return events;
}

function parseJsonTimeline(lines) {
    return lines.flatMap(({ line, receivedAt }) => {
        try { return [{ ...JSON.parse(line), _receivedAt: receivedAt }]; }
        catch { return []; }
    });
}

function extractMcpOutput(item) {
    const structured = item.result?.structuredContent || item.output?.structuredContent;
    if (structured) return structured;
    const content = item.result?.content || item.output?.content || [];
    const text = content.find(part => part.type === 'text')?.text;
    if (!text) return item.result || item.output || item.error || null;
    try { return JSON.parse(text); } catch { return text; }
}

function executionOutcome(item) {
    const output = item?.output;
    if (output?.ok === true) return 'ok';
    const issue = output?.validation?.errors?.[0] || output?.error;
    if (issue) {
        const location = issue.path ? ` ${issue.path}` : '';
        return `${output?.ok ?? 'error'}:${issue.code || 'ERROR'}${location} ${issue.message || ''}`.trim();
    }
    return output?.message ?? output?.ok ?? 'no-result';
}

function normalizeCodexEvents(events) {
    let providerSessionId = null;
    let finalText = '';
    const executions = [];
    for (const event of events) {
        if (event.type === 'thread.started') providerSessionId = event.thread_id;
        const item = event.item;
        if (!item || !['item.completed', 'item.updated'].includes(event.type)) continue;
        if (item.type === 'agent_message' && item.text) finalText = item.text;
        if (item.type === 'mcp_tool_call') {
            executions.push({
                callId: item.id,
                name: item.tool || item.name,
                arguments: item.arguments || {},
                output: extractMcpOutput(item),
                status: item.status,
            });
        }
    }
    return { providerSessionId, finalText, executions };
}

/**
 * Codex CLI が終了を返さなくても、JSONL に成功したツール結果が残っていれば
 * 計算結果そのものは利用できる。最終文章は捨てずに UI へ返すための回復用処理。
 * @param {any[]} events
 */
export function recoverCodexTimeout(events) {
    const normalized = normalizeCodexEvents(events);
    return normalized.executions.some(item => item.output?.ok === true) ? normalized : null;
}

function extractClaudeToolOutput(toolResultBlock) {
    const content = toolResultBlock.content;
    const text = Array.isArray(content) ? content.find(part => part.type === 'text')?.text : undefined;
    if (typeof content === 'string' && !text) {
        try { return JSON.parse(content); } catch { return content; }
    }
    if (!text) return content ?? null;
    try { return JSON.parse(text); } catch { return text; }
}

function claudeEventDiagnostics(events) {
    const pendingCalls = new Map();
    return events.flatMap(event => {
        if (event.type === 'system' && event.subtype === 'init') {
            return [diagnosticLog('info', 'claude', 'Claude Code会話を開始しました。', { event: event.type }, event._receivedAt)];
        }
        if (event.type === 'assistant') {
            for (const block of event.message?.content || []) {
                if (block.type === 'tool_use') pendingCalls.set(block.id, { name: block.name, arguments: block.input });
            }
            return [];
        }
        if (event.type === 'user') {
            return (event.message?.content || []).filter(block => block.type === 'tool_result').map(block => {
                const call = pendingCalls.get(block.tool_use_id) || {};
                pendingCalls.delete(block.tool_use_id);
                const toolName = call.name || 'unknown';
                const argumentsSummary = diagnosticToolArguments(toolName, call.arguments);
                return diagnosticLog(
                    block.is_error ? 'error' : 'info',
                    'mcp',
                    `${toolName}: ${block.is_error ? 'failed' : 'completed'}`,
                    {
                        event: event.type,
                        outcome: executionOutcome({ output: extractClaudeToolOutput(block) }),
                        ...(argumentsSummary ? { arguments: argumentsSummary } : {}),
                    },
                    event._receivedAt,
                );
            });
        }
        if (event.type === 'result') {
            return [diagnosticLog(event.is_error ? 'error' : 'info', 'claude', event.is_error ? 'turn.failed' : 'turn.completed', { event: event.type }, event._receivedAt)];
        }
        return [];
    });
}

function normalizeClaudeEvents(events) {
    let providerSessionId = null;
    let finalText = '';
    const pendingCalls = new Map();
    const executions = [];
    for (const event of events) {
        if (event.session_id) providerSessionId = event.session_id;
        if (event.type === 'assistant') {
            for (const block of event.message?.content || []) {
                if (block.type === 'tool_use') pendingCalls.set(block.id, { name: block.name, arguments: block.input || {} });
            }
        } else if (event.type === 'user') {
            for (const block of event.message?.content || []) {
                if (block.type !== 'tool_result') continue;
                const call = pendingCalls.get(block.tool_use_id) || {};
                pendingCalls.delete(block.tool_use_id);
                executions.push({
                    callId: block.tool_use_id,
                    name: call.name,
                    arguments: call.arguments || {},
                    output: extractClaudeToolOutput(block),
                    status: block.is_error ? 'failed' : 'completed',
                });
            }
        } else if (event.type === 'result' && !event.is_error && typeof event.result === 'string') {
            finalText = event.result;
        }
    }
    return { providerSessionId, finalText, executions };
}

async function runCodex({
    root, stateFile, model, reasoningEffort, verbosity, prompt,
    providerSessionId, signal, timeoutMs = DEFAULT_TIMEOUT_MS, ephemeral = false,
    scope = SCOPES.diminishing,
}) {
    const startedAt = Date.now();
    const logs = [diagnosticLog('info', 'codex', 'Codex CLIの実行準備を開始しました。', {
        model: model || 'default', resume: Boolean(providerSessionId),
    })];
    let executable;
    try {
        executable = await findCodex(signal);
        logs.push(diagnosticLog('info', 'codex', 'Codex CLIをPATHから検出しました。'));
    } catch (error) {
        logs.push(diagnosticLog('error', 'codex', error.message || 'Codex CLIを検出できませんでした。'));
        throw attachDiagnosticLogs(error, logs);
    }
    const mcpScript = join(root, 'scripts', 'srsim-mcp-server.mjs');
    const nodeExecutable = process.execPath;
    const runtimeDir = join(tmpdir(), 'srsim-ai-runtime');
    await mkdir(runtimeDir, { recursive: true });
    const enabledTools = scope.cliEnabledTools;
    const mcpArgs = [mcpScript, '--state', stateFile, '--scope', scope.id];
    const common = [
        '--json',
        '--sandbox', 'read-only',
        '--cd', runtimeDir,
        '--skip-git-repo-check',
        '--ignore-user-config',
        '--ignore-rules',
        '-c', 'approval_policy="never"',
        '-c', 'features.shell_tool=false',
        '-c', `mcp_servers.srsim.command=${JSON.stringify(nodeExecutable)}`,
        '-c', `mcp_servers.srsim.args=[${mcpArgs.map(value => JSON.stringify(value)).join(',')}]`,
        '-c', 'mcp_servers.srsim.required=true',
        '-c', `mcp_servers.srsim.enabled_tools=[${enabledTools.map(value => JSON.stringify(value)).join(',')}]`,
        '-c', 'mcp_servers.srsim.default_tools_approval_mode="approve"',
    ];
    if (model) common.push('--model', model);
    if (reasoningEffort) common.push('-c', `model_reasoning_effort=${JSON.stringify(reasoningEffort)}`);
    if (verbosity) common.push('-c', `model_verbosity=${JSON.stringify(verbosity)}`);
    if (ephemeral) common.push('--ephemeral');
    const fullPrompt = `${scope.instructions}\n\n利用者の依頼:\n${prompt}`;
    const args = providerSessionId
        ? ['exec', ...common, 'resume', providerSessionId, fullPrompt]
        : ['exec', ...common, fullPrompt];
    let result;
    try {
        result = await runProcess(executable.command, [...executable.prefixArgs, ...args], { cwd: runtimeDir, signal, timeoutMs });
    } catch (error) {
        logs.push(diagnosticLog('error', 'codex', 'Codex CLIプロセスを開始できませんでした。', {
            message: safeDiagnosticText(error.message), durationMs: Date.now() - startedAt,
        }));
        throw attachDiagnosticLogs(error, logs);
    }
    const events = result.stdoutTimeline?.length
        ? parseJsonTimeline(result.stdoutTimeline)
        : parseJsonLines(result.stdout);
    logs.push(...codexEventDiagnostics(events));
    if (signal?.aborted) {
        const error = Object.assign(new Error('AI処理を中断しました。'), { code: 'ABORTED' });
        logs.push(diagnosticLog('warning', 'codex', error.message, { durationMs: Date.now() - startedAt }));
        throw attachDiagnosticLogs(error, logs);
    }
    if (result.timedOut) {
        const lastEvent = events.at(-1)?.type || 'なし';
        const stderr = safeDiagnosticText(result.stderr, 500);
        const recovered = recoverCodexTimeout(events);
        if (recovered) {
            logs.push(diagnosticLog('warning', 'codex', 'Codex CLIは最終文章を返す前にタイムアウトしましたが、成功済みの計算結果を返します。', {
                durationMs: Date.now() - startedAt, lastEvent, stderr,
            }));
            return {
                ...recovered,
                events,
                stderr: result.stderr,
                diagnosticLogs: logs,
                partial: { reason: 'timeout_after_tool_success', lastEvent },
            };
        }
        const error = new Error(`Codex CLIが時間内に完了しませんでした（最終イベント: ${lastEvent}${stderr ? ` / ${stderr}` : ''}）。`);
        logs.push(diagnosticLog('error', 'codex', 'Codex CLIがタイムアウトしました。', {
            durationMs: Date.now() - startedAt, lastEvent, stderr,
        }));
        throw attachDiagnosticLogs(error, logs);
    }
    if (result.code !== 0) {
        const stderr = safeDiagnosticText(result.stderr);
        const hint = loginHint('codex', stderr);
        const error = new Error(`Codex CLIに失敗しました (exit ${result.code}): ${stderr}${hint}`);
        logs.push(diagnosticLog('error', 'codex', `Codex CLIが終了コード ${result.code} で終了しました。`, {
            durationMs: Date.now() - startedAt, stderr, loginHint: Boolean(hint),
        }));
        throw attachDiagnosticLogs(error, logs);
    }
    logs.push(diagnosticLog('info', 'codex', 'Codex CLIが正常終了しました。', {
        durationMs: Date.now() - startedAt, eventCount: events.length,
    }));
    return { ...normalizeCodexEvents(events), events, stderr: result.stderr, diagnosticLogs: logs, partial: null };
}

async function runClaude({
    root, stateFile, model, reasoningEffort, prompt,
    providerSessionId, signal, timeoutMs = DEFAULT_TIMEOUT_MS, ephemeral = false,
    scope = SCOPES.diminishing,
}) {
    const startedAt = Date.now();
    const logs = [diagnosticLog('info', 'claude', 'Claude Code CLIの実行準備を開始しました。', {
        model: model || 'default', resume: Boolean(providerSessionId),
    })];
    let executable;
    try {
        executable = await findClaude(signal);
        logs.push(diagnosticLog('info', 'claude', 'Claude Code CLIをPATHから検出しました。'));
    } catch (error) {
        logs.push(diagnosticLog('error', 'claude', error.message || 'Claude Code CLIを検出できませんでした。'));
        throw attachDiagnosticLogs(error, logs);
    }
    const mcpScript = join(root, 'scripts', 'srsim-mcp-server.mjs');
    const nodeExecutable = process.execPath;
    const runtimeDir = join(tmpdir(), 'srsim-ai-runtime');
    await mkdir(runtimeDir, { recursive: true });
    const mcpArgs = [mcpScript, '--state', stateFile, '--scope', scope.id];
    // srsimという名前でMCPサーバーを1つだけ登録する。Claude側のツール名は mcp__srsim__<tool> になる。
    const mcpConfig = JSON.stringify({ mcpServers: { srsim: { command: nodeExecutable, args: mcpArgs } } });
    const allowedTools = scope.cliEnabledTools.map(name => `mcp__srsim__${name}`);
    const args = [
        '--print',
        '--output-format', 'stream-json',
        '--verbose',
        '--mcp-config', mcpConfig,
        '--strict-mcp-config',
        '--tools', '',
        '--allowedTools', ...allowedTools,
        '--permission-mode', 'bypassPermissions',
        '--system-prompt', scope.instructions,
    ];
    if (model) args.push('--model', model);
    if (reasoningEffort) args.push('--effort', reasoningEffort);
    if (ephemeral) args.push('--no-session-persistence');
    if (providerSessionId) args.push('--resume', providerSessionId);
    args.push(prompt);
    let result;
    try {
        result = await runProcess(executable.command, [...executable.prefixArgs, ...args], { cwd: runtimeDir, signal, timeoutMs });
    } catch (error) {
        logs.push(diagnosticLog('error', 'claude', 'Claude Code CLIプロセスを開始できませんでした。', {
            message: safeDiagnosticText(error.message), durationMs: Date.now() - startedAt,
        }));
        throw attachDiagnosticLogs(error, logs);
    }
    const events = result.stdoutTimeline?.length
        ? parseJsonTimeline(result.stdoutTimeline)
        : parseJsonLines(result.stdout);
    logs.push(...claudeEventDiagnostics(events));
    if (signal?.aborted) {
        const error = Object.assign(new Error('AI処理を中断しました。'), { code: 'ABORTED' });
        logs.push(diagnosticLog('warning', 'claude', error.message, { durationMs: Date.now() - startedAt }));
        throw attachDiagnosticLogs(error, logs);
    }
    if (result.timedOut) {
        const lastEvent = events.at(-1)?.type || 'なし';
        const stderr = safeDiagnosticText(result.stderr, 500);
        const error = new Error(`Claude Code CLIが時間内に完了しませんでした（最終イベント: ${lastEvent}${stderr ? ` / ${stderr}` : ''}）。`);
        logs.push(diagnosticLog('error', 'claude', 'Claude Code CLIがタイムアウトしました。', {
            durationMs: Date.now() - startedAt, lastEvent, stderr,
        }));
        throw attachDiagnosticLogs(error, logs);
    }
    if (result.code !== 0) {
        const resultEvent = [...events].reverse().find(event => event.type === 'result');
        const detail = safeDiagnosticText(resultEvent?.result || result.stderr);
        const hint = loginHint('claude', detail);
        const error = new Error(`Claude Code CLIに失敗しました (exit ${result.code}): ${detail}${hint}`);
        logs.push(diagnosticLog('error', 'claude', `Claude Code CLIが終了コード ${result.code} で終了しました。`, {
            durationMs: Date.now() - startedAt, stderr: safeDiagnosticText(result.stderr), loginHint: Boolean(hint),
        }));
        throw attachDiagnosticLogs(error, logs);
    }
    logs.push(diagnosticLog('info', 'claude', 'Claude Code CLIが正常終了しました。', {
        durationMs: Date.now() - startedAt, eventCount: events.length,
    }));
    return { ...normalizeClaudeEvents(events), events, stderr: result.stderr, diagnosticLogs: logs, partial: null };
}

const CLI_RUNNERS = Object.freeze({ codex: runCodex, claude: runClaude });

function safeSessionFile(localDir, sessionId, scope = SCOPES.diminishing) {
    const safe = String(sessionId || 'connect').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80);
    return resolve(localDir, scope.stateDir, `_ai-${safe}.json`);
}

function savedBuildsFromState(state) {
    return Array.isArray(state?.savedBuilds) ? state.savedBuilds : [];
}

function selectedBuildIdsFromState(state) {
    return Array.isArray(state?.selectedBuildIds) ? state.selectedBuildIds.filter(Boolean) : [];
}

function simulationTargetFromState(state) {
    return state?.simulationTarget === 'actionOrder' ? 'actionOrder' : 'diminishing';
}

function assumptionsFromState(state) {
    const source = state?.assumptions;
    return {
        objective: String(source?.objective || '').trim().slice(0, 1000),
        battleConditions: Array.isArray(source?.battleConditions) ? source.battleConditions.slice(0, 20) : [],
        effectUptimes: Array.isArray(source?.effectUptimes) ? source.effectUptimes
            .filter(item => item && item.key)
            .slice(0, 100)
            .map(item => ({
                name: String(item.name || '効果'),
                source: String(item.source || ''),
                durationTurns: Math.max(0, Math.min(99, Number(item.durationTurns) || 0)),
            })) : [],
        actionOrderGoal: String(source?.actionOrderGoal || '').trim().slice(0, 1000),
    };
}

function assumptionsPrompt(state) {
    const assumptions = assumptionsFromState(state);
    const lines = [];
    if (assumptions.objective) lines.push(`- 目的: ${assumptions.objective}`);
    if (assumptions.battleConditions.length) lines.push(`- 戦闘条件: ${assumptions.battleConditions.join('、')}`);
    if (assumptions.effectUptimes.length) lines.push(`- バフの稼働率: ${assumptions.effectUptimes.map(item => `${item.name}${item.source ? `（${item.source}）` : ''}: ${item.durationTurns || '未指定'}ターン`).join('、')}`);
    if (assumptions.actionOrderGoal) lines.push(`- 行動順の目標: ${assumptions.actionOrderGoal}`);
    return lines.length
        ? `\n\n利用者がUIで設定した固定条件です。依頼文と同等に優先し、矛盾する推測で上書きしないでください。\n${lines.join('\n')}`
        : '';
}

function scopeWithSelectedWorkspaceTools(scope, state) {
    if (scope.id !== 'workspace') return scope;
    const simulationTarget = simulationTargetFromState(state);
    const targetScope = simulationTarget === 'actionOrder' ? SCOPES.actionOrder : SCOPES.diminishing;
    const targetTools = simulationTarget === 'actionOrder'
        ? ['list_action_order_quick_presets', 'search_speed_data', 'list_equippable_lightcones', 'validate_lightcone_assignment', 'estimate_ultimate_cycle', 'search_action_effects', 'read_build_speed', 'run_action_order_simulation', 'propose_action_order_changes']
        : ['search_game_data', 'run_diminishing_comparison', 'propose_diminishing_changes'];
    return {
        ...scope,
        // 統合AI画面でも、選択中の計算対象専用の指示を必ず渡す。
        instructions: `${WORKSPACE_SYSTEM_INSTRUCTIONS}\n\n現在の計算対象は ${targetScope.label} です。以下の専用指示を適用してください。\n${targetScope.instructions}${assumptionsPrompt(state)}`,
        cliEnabledTools: ['get_workspace_context', 'read_saved_builds', ...targetTools],
    };
}

export function createServerAiController({ root, localDir, timeoutMs = DEFAULT_TIMEOUT_MS }) {
    const sessions = new Map();
    const cliConversations = new Map();
    const activeRuns = new Map();

    function removeSessionState(id, scopeId) {
        const scope = resolveScope(scopeId);
        void unlink(safeSessionFile(localDir, id, scope)).catch(() => {});
    }

    function pruneSessions(now = Date.now()) {
        for (const [id, entry] of sessions) {
            if (now - (entry.lastUsedAt || 0) > AI_SESSION_TTL_MS && !activeRuns.has(id)) {
                sessions.delete(id);
                removeSessionState(id, entry.scopeId);
            }
        }
        for (const [id, entry] of cliConversations) {
            if (now - (entry.lastUsedAt || 0) > AI_SESSION_TTL_MS && !activeRuns.has(id)) {
                cliConversations.delete(id);
                removeSessionState(id, entry.scopeId);
            }
        }
        while (sessions.size > MAX_AI_SESSIONS) {
            const removable = [...sessions.entries()]
                .filter(([id]) => !activeRuns.has(id))
                .sort(([, a], [, b]) => (a.lastUsedAt || 0) - (b.lastUsedAt || 0))[0];
            if (!removable) break;
            sessions.delete(removable[0]);
            removeSessionState(removable[0], removable[1].scopeId);
        }
        while (cliConversations.size > MAX_AI_SESSIONS) {
            const removable = [...cliConversations.entries()]
                .filter(([id]) => !activeRuns.has(id))
                .sort(([, a], [, b]) => (a.lastUsedAt || 0) - (b.lastUsedAt || 0))[0];
            if (!removable) break;
            cliConversations.delete(removable[0]);
            removeSessionState(removable[0], removable[1].scopeId);
        }
    }

    async function saveState(state, sessionId, scope = SCOPES.diminishing) {
        const file = safeSessionFile(localDir, sessionId, scope);
        await mkdir(join(localDir, scope.stateDir), { recursive: true });
        await writeFile(file, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
        return file;
    }

    async function connect({ provider, state, scope: scopeName = 'diminishing' }) {
        const scope = resolveScope(scopeName);
        const executionScope = scopeWithSelectedWorkspaceTools(scope, state);
        const logs = [diagnosticLog('info', 'server', 'AI接続試験を受け付けました。', {
            provider: provider?.type || 'codex', model: provider?.model || 'default', scope: scope.id,
        })];
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
            await loadRegisteredGameData(root);
            logs.push(diagnosticLog('info', 'server', 'ゲームデータを読み込みました。'));
            const config = normalizeConfig(provider);
            const stateFile = await saveState(state, `connect-${Date.now()}`, scope);
            logs.push(diagnosticLog('info', 'server', `現在の${scope.label}状態を接続試験用に保存しました。`));
            if (config.type === 'codex' || config.type === 'claude') {
                const cliLabel = config.type === 'codex' ? 'Codex' : 'Claude Code';
                const result = await CLI_RUNNERS[config.type]({
                    root, stateFile, model: config.model, reasoningEffort: config.reasoningEffort, verbosity: config.verbosity,
                    prompt: executionScope.connectionPrompt,
                    providerSessionId: null, signal: controller.signal, timeoutMs, ephemeral: true, scope: executionScope,
                });
                logs.push(...result.diagnosticLogs);
                const toolWorked = result.executions.some(item => (
                    String(item.name || '').endsWith(scope.connectionTool) && item.output?.ok === true
                ));
                if (!toolWorked) {
                    const executionSummary = result.executions
                        .map(item => {
                            const outcome = executionOutcome(item);
                            return `${item.name || 'unknown'}:${item.status || 'unknown'}:${outcome}`;
                        })
                        .join(', ') || 'ツール呼び出しなし';
                    throw new Error(`${cliLabel}は応答しましたが、${scope.failureMessage} (${executionSummary})。`);
                }
                return {
                    ok: true, provider: {
                        type: config.type, model: config.model, reasoningEffort: config.reasoningEffort,
                    }, models: [], toolTest: true,
                    diagnosticLogs: [...logs, diagnosticLog('info', 'server', '接続試験に成功しました。')],
                };
            }
            const adapter = createResponsesAdapter(config, executionScope);
            logs.push(diagnosticLog('info', 'api', 'モデル一覧を取得しています。'));
            const models = await adapter.listModels(controller.signal);
            logs.push(diagnosticLog('info', 'api', 'モデル一覧を取得しました。', { modelCount: models.length }));
            if (!config.model) config.model = models[0] || '';
            if (!config.model) throw new Error('利用できるモデルが見つかりません。');
            if (models.length && !models.includes(config.model)) throw new Error(`モデル「${config.model}」はモデル一覧にありません。`);
            const session = scope.createSession(state);
            const savedBuilds = savedBuildsFromState(state);
            const selectedBuildIds = selectedBuildIdsFromState(state);
            const simulationTarget = simulationTargetFromState(state);
            const tools = scope.createTools(session, () => savedBuilds, () => selectedBuildIds, () => simulationTarget);
            const first = await adapter.respond({
                input: scope.connectionPrompt,
                toolOutputs: [], tools: tools.definitions, signal: controller.signal, sessionId: null,
                metadata: { toolChoice: scope.connectionTool },
            });
            const call = first.toolCalls?.find(item => item.name === scope.connectionTool);
            if (!call) throw new Error('モデルが正式なツール呼び出しを返しませんでした。');
            const args = typeof call.arguments === 'string' ? JSON.parse(call.arguments) : call.arguments;
            const output = await tools.execute(call.name, args || {});
            logs.push(diagnosticLog(output?.ok === true ? 'info' : 'error', 'tool', `${call.name}: ${output?.ok === true ? 'ok' : 'failed'}`));
            if (output?.ok !== true) throw new Error(`接続試験の${scope.label}計算に失敗しました。`);
            const second = await adapter.respond({
                input: null,
                toolOutputs: [{ callId: call.id, name: call.name, output }],
                tools: tools.definitions, signal: controller.signal, sessionId: first.sessionId,
            });
            if (typeof second.finalText !== 'string' || !second.finalText.trim()) throw new Error('ツール結果を返した後の最終回答を確認できませんでした。');
            return {
                ok: true,
                provider: { type: config.type, endpoint: config.endpoint, model: config.model },
                models,
                toolTest: true,
                diagnosticLogs: [...logs, diagnosticLog('info', 'server', '接続試験に成功しました。')],
            };
        } catch (error) {
            const failure = diagnosticLog('error', 'server', error.message || '接続試験に失敗しました。', {
                code: error.code || 'AI_CONNECT_FAILED',
            });
            throw attachDiagnosticLogs(error, [...logs, failure]);
        } finally {
            clearTimeout(timer);
        }
    }

    async function chat({ provider, state, message, sessionId = null, providerSessionId = null, scope: scopeName = 'diminishing' }) {
        pruneSessions();
        const scope = resolveScope(scopeName);
        const executionScope = scopeWithSelectedWorkspaceTools(scope, state);
        await loadRegisteredGameData(root);
        const config = normalizeConfig(provider);
        const savedBuilds = savedBuildsFromState(state);
        const id = sessionId || `ai_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
        if (activeRuns.has(id)) {
            throw Object.assign(new Error('同じAIセッションで別の処理が実行中です。完了してからもう一度お試しください。'), { code: 'SESSION_BUSY' });
        }
        const controller = new AbortController();
        activeRuns.set(id, controller);
        try {
            const stateFile = await saveState(state, id, scope);
            if (config.type === 'codex' || config.type === 'claude') {
                const cliLabel = config.type === 'codex' ? 'Codex' : 'Claude Code';
                const conversation = cliConversations.get(id) || { resumeTurns: 0, memory: [], lastUsedAt: Date.now(), scopeId: scope.id };
                conversation.scopeId = scope.id;
                conversation.lastUsedAt = Date.now();
                let effectiveProviderSessionId = providerSessionId;
                let prompt = String(message || '');
                const compressionLogs = [];
                if (conversation.resumeTurns >= MAX_CLI_RESUME_TURNS) {
                    effectiveProviderSessionId = null;
                    prompt = `前の会話から引き継ぐ確定情報です。過去の巨大なツール結果は参照せず、この要約と現在状態を使用してください。\n${JSON.stringify(conversation.memory)}\n\n今回の依頼:\n${prompt}`;
                    conversation.resumeTurns = 0;
                    compressionLogs.push(diagnosticLog('info', 'server', `会話コンテキストを圧縮して新しい${cliLabel}会話へ切り替えました。`, {
                        retainedTurns: conversation.memory.length,
                    }));
                }
                const result = await CLI_RUNNERS[config.type]({
                    root, stateFile, model: config.model, reasoningEffort: config.reasoningEffort, verbosity: config.verbosity,
                    prompt, providerSessionId: effectiveProviderSessionId, signal: controller.signal, timeoutMs, scope: executionScope,
                });
                result.diagnosticLogs = [...compressionLogs, ...(result.diagnosticLogs || [])];
                if (!hasRequiredExecution(result.executions, message, scope)) {
                    const error = new Error(`${cliLabel}が必要な計算ツールを実行しなかったため、回答を採用しませんでした。`);
                    throw attachDiagnosticLogs(error, result.diagnosticLogs || []);
                }
                const memoryTools = scope.memoryTools || [scope.requiredTool].filter(Boolean);
                const comparisons = result.executions
                    .filter(item => memoryTools.some(name => String(item.name || '').endsWith(name)) && item.output?.ok)
                    .map(item => item.output.jobSummary ?? item.output.panels);
                conversation.resumeTurns += 1;
                conversation.memory.push({ request: String(message || '').slice(0, 600), comparisons });
                conversation.memory = conversation.memory.slice(-MAX_CLI_RESUME_TURNS);
                cliConversations.delete(id);
                cliConversations.set(id, conversation);
                pruneSessions();
                return {
                    ok: true, sessionId: id,
                    providerSessionId: result.providerSessionId || providerSessionId,
                    finalText: result.finalText,
                    executions: result.executions,
                    diagnosticLogs: result.diagnosticLogs,
                    partial: result.partial,
                };
            }
            let entry = sessions.get(id);
            const simulationTarget = simulationTargetFromState(state);
            const configKey = `${scope.id}|${simulationTarget}|${config.type}|${config.endpoint}|${config.model}`;
            if (!entry) {
                const scopeSession = scope.createSession(state);
                entry = { configKey, scopeId: scope.id, savedBuilds, selectedBuildIds: selectedBuildIdsFromState(state), simulationTarget, scopeSession, lastUsedAt: Date.now() };
                const tools = scope.createTools(
                    scopeSession,
                    () => entry.savedBuilds,
                    () => entry.selectedBuildIds,
                    () => entry.simulationTarget,
                );
                entry.gateway = createAiGateway({ adapter: createResponsesAdapter(config, executionScope), tools, timeoutMs });
                sessions.set(id, entry);
            } else {
                if (entry.configKey !== configKey) throw new Error('会話中にAI接続先やタブは変更できません。新しい会話を開始してください。');
                entry.scopeSession.restore(state);
                entry.savedBuilds = savedBuilds;
                entry.selectedBuildIds = selectedBuildIdsFromState(state);
            }
            entry.lastUsedAt = Date.now();
            const result = await entry.gateway.run({
                message: String(message || ''),
                sessionId: id,
                signal: controller.signal,
            });
            if (result.ok && !hasRequiredExecution(result.executions, message, scope)) throw new Error('AIが必要な計算ツールを実行しなかったため、回答を採用しませんでした。');
            return { ...result, events: undefined };
        } finally {
            if (activeRuns.get(id) === controller) activeRuns.delete(id);
            const entry = sessions.get(id);
            if (entry) entry.lastUsedAt = Date.now();
            const conversation = cliConversations.get(id);
            if (conversation) conversation.lastUsedAt = Date.now();
            pruneSessions();
        }
    }

    return Object.freeze({
        connect,
        chat,
        cancel(sessionId) {
            const controller = activeRuns.get(sessionId);
            if (!controller) return false;
            controller.abort(Object.assign(new Error('AI処理を中断しました。'), { code: 'ABORTED' }));
            return true;
        },
    });
}
