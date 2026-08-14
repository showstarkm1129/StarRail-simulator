import assert from 'node:assert/strict';
import { test } from 'node:test';

import { normalizeCliProviderPreference } from '../js/ai/cliProviders.js';

test('CLI設定は旧形式のcustom値を復元できる', () => {
    const preference = normalizeCliProviderPreference('codex', {
        verified: true,
        preset: 'custom',
        model: 'custom-model',
        reasoningEffort: 'xhigh',
    });

    assert.deepEqual(preference, {
        verified: true,
        preset: 'custom',
        model: 'custom-model',
        reasoningEffort: 'xhigh',
        customModel: 'custom-model',
        customReasoningEffort: 'xhigh',
    });
});

test('CLI設定はプリセット切替後もcustom値を保持する', () => {
    const preference = normalizeCliProviderPreference('codex', {
        preset: 'standard',
        model: 'gpt-5.6-terra',
        reasoningEffort: 'medium',
        customModel: 'saved-custom-model',
        customReasoningEffort: 'max',
    });

    assert.equal(preference.preset, 'standard');
    assert.equal(preference.model, 'gpt-5.6-terra');
    assert.equal(preference.reasoningEffort, 'medium');
    assert.equal(preference.customModel, 'saved-custom-model');
    assert.equal(preference.customReasoningEffort, 'max');
});
