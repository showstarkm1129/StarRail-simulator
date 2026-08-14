import assert from 'node:assert/strict';
import { test } from 'node:test';
import { recoverCodexTimeout } from '../js/ai/serverGateway.js';

test('recoverCodexTimeout: 成功済みのMCP計算結果をタイムアウト後も返す', () => {
    const recovered = recoverCodexTimeout([{
        type: 'thread.started',
        thread_id: 'thread_123',
    }, {
        type: 'item.completed',
        item: {
            id: 'call_123',
            type: 'mcp_tool_call',
            tool: 'run_action_order_simulation',
            arguments: '{"panels":[]}',
            status: 'completed',
            result: { structuredContent: { ok: true, panels: [{ name: '速度134' }] } },
        },
    }]);

    assert.equal(recovered.providerSessionId, 'thread_123');
    assert.equal(recovered.executions.length, 1);
    assert.equal(recovered.executions[0].output.ok, true);
});

test('recoverCodexTimeout: 成功したツール結果がなければ回復しない', () => {
    assert.equal(recoverCodexTimeout([{
        type: 'item.completed',
        item: {
            id: 'call_failed',
            type: 'mcp_tool_call',
            tool: 'run_action_order_simulation',
            status: 'failed',
            result: { structuredContent: { ok: false } },
        },
    }]), null);
});
