// aiGateway.js — API / CLI 差を吸収する共通ツール呼び出しループ

import { validateToolSchema } from './toolSchema.js';

function gatewayError(code, message, details) {
    return Object.assign(new Error(message), { code, details });
}

function linkAbortSignals(controller, externalSignal) {
    if (!externalSignal) return () => {};
    const abort = () => controller.abort(externalSignal.reason || gatewayError('ABORTED', '処理が中断されました。'));
    if (externalSignal.aborted) abort();
    else externalSignal.addEventListener('abort', abort, { once: true });
    return () => externalSignal.removeEventListener('abort', abort);
}

export function createAiGateway({ adapter, tools, maxLoops = 8, timeoutMs = 120000 }) {
    if (!adapter?.respond) throw new Error('AI adapter.respond が必要です。');
    if (!tools?.execute || !Array.isArray(tools.definitions)) throw new Error('AI tools が必要です。');
    const definitions = new Map(tools.definitions.map(definition => [definition.name, definition]));
    const sessions = new Map();
    const activeRuns = new Map();
    const activeSessionRuns = new Map();
    const sessionTtlMs = 30 * 60 * 1000;
    const maxSessions = 100;

    function pruneSessions(now = Date.now()) {
        for (const [id, session] of sessions) {
            if (now - (session.lastUsedAt || 0) > sessionTtlMs && !activeSessionRuns.has(id)) sessions.delete(id);
        }
        while (sessions.size > maxSessions) {
            const removable = [...sessions.values()]
                .filter(session => !activeSessionRuns.has(session.id))
                .sort((a, b) => (a.lastUsedAt || 0) - (b.lastUsedAt || 0))[0];
            if (!removable) break;
            sessions.delete(removable.id);
        }
    }

    async function run({ message, sessionId = null, runId: requestedRunId = null, signal = null, metadata = {} }) {
        const runId = requestedRunId || `run_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
        if (activeRuns.has(runId)) throw gatewayError('DUPLICATE_RUN_ID', `実行ID「${runId}」はすでに使用中です。`);
        pruneSessions();
        const session = sessions.get(sessionId) || {
            id: sessionId || `session_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
            adapterSessionId: null,
            turns: [],
            executions: [],
            lastUsedAt: Date.now(),
        };
        if (activeSessionRuns.has(session.id)) {
            throw gatewayError('SESSION_BUSY', '同じAIセッションで別の処理が実行中です。完了してからもう一度お試しください。');
        }
        const controller = new AbortController();
        const unlink = linkAbortSignals(controller, signal);
        const timer = setTimeout(() => controller.abort(gatewayError('TIMEOUT', `AI処理が ${timeoutMs / 1000} 秒でタイムアウトしました。`)), timeoutMs);
        activeRuns.set(runId, controller);
        activeSessionRuns.set(session.id, runId);
        session.lastUsedAt = Date.now();
        sessions.set(session.id, session);
        const turn = {
            id: runId,
            message,
            metadata,
            startedAt: new Date().toISOString(),
            events: [],
            toolCalls: [],
        };
        session.turns.push(turn);

        try {
            let input = message;
            let toolOutputs = [];
            for (let loop = 0; loop < maxLoops; loop++) {
                if (controller.signal.aborted) throw controller.signal.reason || gatewayError('ABORTED', 'AI処理が中断されました。');
                const response = await adapter.respond({
                    input,
                    toolOutputs,
                    tools: tools.definitions,
                    signal: controller.signal,
                    sessionId: session.adapterSessionId,
                    history: session.turns,
                    metadata,
                });
                if (response.sessionId) session.adapterSessionId = response.sessionId;
                turn.events.push(...(response.events || []));
                const calls = Array.isArray(response.toolCalls) ? response.toolCalls : [];
                if (calls.length === 0) {
                    if (typeof response.finalText !== 'string') throw gatewayError('MISSING_FINAL_ANSWER', 'AIから最終回答を取得できませんでした。');
                    turn.finalText = response.finalText;
                    turn.completedAt = new Date().toISOString();
                    return {
                        ok: true,
                        runId,
                        sessionId: session.id,
                        providerSessionId: session.adapterSessionId,
                        finalText: response.finalText,
                        toolCalls: turn.toolCalls,
                        events: turn.events,
                        executions: turn.toolCalls.map(item => item.execution),
                    };
                }

                toolOutputs = [];
                for (const call of calls) {
                    const definition = definitions.get(call.name);
                    if (!definition) {
                        toolOutputs.push({ callId: call.id, name: call.name, output: { ok: false, error: { code: 'UNKNOWN_TOOL', message: `未登録のツールです: ${call.name}` } } });
                        continue;
                    }
                    let args = call.arguments;
                    if (typeof args === 'string') {
                        try { args = JSON.parse(args); }
                        catch (error) {
                            toolOutputs.push({ callId: call.id, name: call.name, output: { ok: false, error: { code: 'INVALID_TOOL_JSON', message: error.message } } });
                            continue;
                        }
                    }
                    const normalizedArgs = args === undefined ? {} : args;
                    const argumentErrors = validateToolSchema(normalizedArgs, definition.inputSchema);
                    if (argumentErrors.length) {
                        toolOutputs.push({ callId: call.id, name: call.name, output: { ok: false, error: { code: 'INVALID_TOOL_ARGUMENTS', message: 'ツール引数が不正です。', details: argumentErrors } } });
                        continue;
                    }
                    const output = await Promise.resolve(tools.execute(call.name, normalizedArgs));
                    const execution = {
                        callId: call.id,
                        name: call.name,
                        arguments: normalizedArgs,
                        output,
                        at: new Date().toISOString(),
                    };
                    turn.toolCalls.push({ ...call, execution });
                    session.executions.push(execution);
                    toolOutputs.push({ callId: call.id, name: call.name, output });
                }
                input = null;
            }
            throw gatewayError('TOOL_LOOP_LIMIT', `ツール呼び出しが上限 ${maxLoops} 回を超えました。`);
        } catch (error) {
            turn.failedAt = new Date().toISOString();
            turn.error = { code: error.code || 'GATEWAY_FAILED', message: error.message };
            return {
                ok: false,
                runId,
                sessionId: session.id,
                error: turn.error,
                toolCalls: turn.toolCalls,
                events: turn.events,
            };
        } finally {
            clearTimeout(timer);
            unlink();
            if (activeRuns.get(runId) === controller) activeRuns.delete(runId);
            if (activeSessionRuns.get(session.id) === runId) activeSessionRuns.delete(session.id);
            session.lastUsedAt = Date.now();
        }
    }

    return Object.freeze({
        run,
        cancel(runId) {
            const controller = activeRuns.get(runId);
            if (!controller) return false;
            controller.abort(gatewayError('ABORTED', '利用者がAI処理を中断しました。'));
            return true;
        },
        getSession(id) {
            pruneSessions();
            const session = sessions.get(id);
            return session ? { ...session, turns: [...session.turns], executions: [...session.executions] } : null;
        },
        listSessions: () => {
            pruneSessions();
            return Array.from(sessions.values(), session => ({ id: session.id, turnCount: session.turns.length }));
        },
    });
}

export function createFakeLlmAdapter(script) {
    const steps = [...script];
    const calls = [];
    return {
        calls,
        async respond(request) {
            calls.push(request);
            const next = steps.shift();
            if (!next) throw gatewayError('FAKE_LLM_EXHAUSTED', '偽LLMの応答が不足しています。');
            return typeof next === 'function' ? next(request) : next;
        },
    };
}
