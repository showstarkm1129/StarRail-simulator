// cliProviders.js — ローカルCLI接続 (Codex CLI / Claude Code CLI) の共通メタデータ。
// 統合AIワークスペースUIから参照する。
// サーバー側 (serverGateway.js) の接続方式そのものはこのファイルに依存しない (実行方法はそちら側で定義)。

export const CLI_PROVIDER_IDS = Object.freeze(['codex', 'claude']);

export const CLI_PROVIDERS = Object.freeze({
    codex: Object.freeze({
        id: 'codex',
        label: 'Codex CLI',
        connection: 'ローカルMCP接続',
        helpText: 'ログイン済みのCodex CLIを使用します。APIキーの入力は不要です。',
        presets: Object.freeze({
            fast: Object.freeze({ model: 'gpt-5.6-luna', reasoningEffort: 'low', label: '高速' }),
            standard: Object.freeze({ model: 'gpt-5.6-terra', reasoningEffort: 'medium', label: '標準' }),
            precise: Object.freeze({ model: 'gpt-5.6-sol', reasoningEffort: 'high', label: '高精度' }),
            cli: Object.freeze({ model: '', reasoningEffort: '', label: 'CLI設定' }),
        }),
    }),
    claude: Object.freeze({
        id: 'claude',
        label: 'Claude Code CLI',
        connection: 'ローカルMCP接続',
        helpText: 'ログイン済みのClaude Code CLIを使用します。APIキーの入力は不要です。',
        presets: Object.freeze({
            fast: Object.freeze({ model: 'claude-haiku-4-5-20251001', reasoningEffort: 'low', label: '高速' }),
            standard: Object.freeze({ model: 'claude-sonnet-5', reasoningEffort: 'medium', label: '標準' }),
            precise: Object.freeze({ model: 'claude-opus-5', reasoningEffort: 'high', label: '高精度' }),
            cli: Object.freeze({ model: '', reasoningEffort: '', label: 'CLI設定' }),
        }),
    }),
});

export const CLI_PRESET_IDS = Object.freeze(['fast', 'standard', 'precise', 'cli', 'custom']);

export function defaultCliProviderState(providerId = 'codex') {
    const provider = CLI_PROVIDERS[providerId] || CLI_PROVIDERS.codex;
    const fastPreset = provider.presets.fast;
    return {
        verified: false,
        preset: 'fast',
        model: fastPreset.model,
        reasoningEffort: fastPreset.reasoningEffort,
    };
}

/**
 * 保存済みCLI設定を現在のプロバイダーのプリセットへ合わせて整える。
 * customModel/customReasoningEffortは、組み込みプリセットへ切り替えた後も
 * カスタム設定へ戻れるように、現在のmodel/reasoningEffortとは別に保持する。
 */
export function normalizeCliProviderPreference(providerId, source) {
    const provider = CLI_PROVIDERS[providerId] || CLI_PROVIDERS.codex;
    const storedModel = typeof source?.model === 'string' ? source.model : '';
    const storedReasoningEffort = typeof source?.reasoningEffort === 'string' ? source.reasoningEffort : '';
    const hasStoredPreset = CLI_PRESET_IDS.includes(source?.preset);
    const storedPreset = hasStoredPreset ? source.preset : storedModel ? 'custom' : 'fast';
    const preset = provider.presets[storedPreset];
    const hasCustomModel = typeof source?.customModel === 'string';
    const hasCustomReasoningEffort = typeof source?.customReasoningEffort === 'string';
    const remembersCustom = hasCustomModel || hasCustomReasoningEffort || storedPreset === 'custom';
    const customModel = hasCustomModel ? source.customModel : storedPreset === 'custom' ? storedModel : '';
    const customReasoningEffort = hasCustomReasoningEffort
        ? source.customReasoningEffort
        : storedPreset === 'custom' ? storedReasoningEffort : '';

    return {
        verified: hasStoredPreset && source?.verified === true,
        preset: storedPreset,
        model: storedPreset === 'custom' ? customModel : preset ? preset.model : storedModel,
        reasoningEffort: storedPreset === 'custom'
            ? customReasoningEffort
            : preset ? preset.reasoningEffort : storedReasoningEffort,
        ...(remembersCustom ? { customModel, customReasoningEffort } : {}),
    };
}
