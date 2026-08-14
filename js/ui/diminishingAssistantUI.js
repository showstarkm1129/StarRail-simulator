import { Registry } from '../build/registry.js';
import { Build } from '../build/buildStore.js';
import { createDiminishingTools } from '../ai/diminishingTools.js';
import { createActionOrderSession } from '../build/actionOrderSession.js';
import { createActionOrderTools } from '../ai/actionOrderTools.js';
import { renderBasicMarkdown } from './basicMarkdown.js';
import {
    CLI_PROVIDERS,
    CLI_PROVIDER_IDS,
    CLI_PRESET_IDS,
    defaultCliProviderState,
    normalizeCliProviderPreference,
} from '../ai/cliProviders.js';

const CONNECTION_PREFERENCE_KEY = 'srsim.ai.connection.v1';
const SIMULATION_TARGET_KEY = 'srsim.ai.simulation-target.v1';
const ASSUMPTIONS_KEY = 'srsim.ai.assumptions.v1';

function defaultCliProviderPreferences() {
    const defaults = {};
    for (const id of CLI_PROVIDER_IDS) defaults[id] = defaultCliProviderState(id);
    return defaults;
}

function readConnectionPreference() {
    const fallback = { lastMode: 'cli', cli: { type: 'codex', autoConnect: true, providers: defaultCliProviderPreferences() } };
    try {
        const stored = JSON.parse(localStorage.getItem(CONNECTION_PREFERENCE_KEY) || 'null');
        if (!stored || typeof stored !== 'object') return fallback;
        const cliType = CLI_PROVIDER_IDS.includes(stored.cli?.type) ? stored.cli.type : 'codex';
        // 旧形式 (cli直下にmodel/preset/reasoningEffort/verifiedを直接持つ) はCodexの設定として引き継ぐ。
        const legacy = stored.cli && typeof stored.cli === 'object' && !stored.cli.providers ? stored.cli : null;
        const storedProviders = stored.cli?.providers && typeof stored.cli.providers === 'object' ? stored.cli.providers : null;
        const providers = defaultCliProviderPreferences();
        for (const id of CLI_PROVIDER_IDS) {
            const source = storedProviders?.[id] || (id === 'codex' ? legacy : null);
            if (source) providers[id] = normalizeCliProviderPreference(id, source);
        }
        return {
            lastMode: stored.lastMode === 'api' ? 'api' : 'cli',
            cli: {
                type: cliType,
                autoConnect: (legacy ? legacy.autoConnect : stored.cli?.autoConnect) !== false,
                providers,
            },
        };
    } catch {
        return fallback;
    }
}

function writeConnectionPreference(preference) {
    try {
        localStorage.setItem(CONNECTION_PREFERENCE_KEY, JSON.stringify(preference));
    } catch {
        // localStorage が使えない場合は、この画面を開いている間だけ接続状態を維持する。
    }
}

function readSimulationTarget() {
    try {
        return localStorage.getItem(SIMULATION_TARGET_KEY) === 'actionOrder' ? 'actionOrder' : 'diminishing';
    } catch {
        return 'diminishing';
    }
}

function writeSimulationTarget(target) {
    try {
        localStorage.setItem(SIMULATION_TARGET_KEY, target);
    } catch {
        // 保存できない環境でも、現在の画面内では選択を維持する。
    }
}

function normalizeAssumptions(source) {
    const effectUptimes = Array.isArray(source?.effectUptimes) ? source.effectUptimes
        .filter(item => item && typeof item.key === 'string' && item.key)
        .map(item => ({
            key: item.key,
            name: String(item.name || '効果'),
            source: String(item.source || ''),
            durationTurns: Math.max(0, Math.min(99, Number(item.durationTurns) || 0)),
        })) : [];
    return {
        objective: String(source?.objective || '').slice(0, 1000),
        battleConditions: [], // 選択肢は利用者との対話で確定後に追加する。
        effectUptimes,
        actionOrderGoal: String(source?.actionOrderGoal || '').slice(0, 1000),
    };
}

function readAssumptions() {
    try { return normalizeAssumptions(JSON.parse(localStorage.getItem(ASSUMPTIONS_KEY) || 'null')); }
    catch { return normalizeAssumptions(null); }
}

function writeAssumptions(assumptions) {
    try { localStorage.setItem(ASSUMPTIONS_KEY, JSON.stringify(assumptions)); }
    catch { /* 保存できない環境でも、この画面を開いている間は使用できる。 */ }
}

const FIELD_LABELS = Object.freeze({
    character: 'キャラクター', equipment: '装備', party: 'パーティ', enemy: '敵条件',
    characterId: 'キャラクター', lightcone: '光円錐', relics: '遺物', mainStat: 'メインステータス',
    substats: 'サブステータス', partyEffects: 'パーティ効果', selfEffects: '自己効果', stats: 'ステータス',
    options: '計算条件', body: '胴体', feet: '脚部', sphere: '次元界オーブ', rope: '連結縄',
});

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

async function postJson(path, body) {
    const response = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    const text = await response.text();
    let payload;
    try { payload = text ? JSON.parse(text) : {}; }
    catch { throw new Error(text || `HTTP ${response.status}`); }
    if (!response.ok || payload.ok === false) {
        const error = new Error(payload.error?.message || payload.error || `HTTP ${response.status}`);
        error.code = payload.error?.code || 'REQUEST_FAILED';
        error.diagnosticLogs = Array.isArray(payload.diagnosticLogs) ? payload.diagnosticLogs : [];
        throw error;
    }
    return payload;
}

async function getJson(path) {
    const response = await fetch(path);
    const text = await response.text();
    let payload;
    try { payload = text ? JSON.parse(text) : {}; }
    catch { throw new Error(text || `HTTP ${response.status}`); }
    if (!response.ok || payload.ok === false) throw new Error(payload.error?.message || payload.error || `HTTP ${response.status}`);
    return payload;
}

function number(value, digits = 2) {
    return Number.isFinite(value) ? Number(value).toLocaleString('ja-JP', { maximumFractionDigits: digits }) : '—';
}

function percent(value) {
    return Number.isFinite(value) ? `${number(value * 100, 1)}%` : '—';
}

function collectChangePaths(value, prefix = '', rows = []) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        rows.push(prefix || '変更条件');
        return rows;
    }
    for (const [key, child] of Object.entries(value)) {
        const label = FIELD_LABELS[key] || key;
        const path = prefix ? `${prefix}・${label}` : label;
        if (child && typeof child === 'object' && !Array.isArray(child)) collectChangePaths(child, path, rows);
        else rows.push(path);
    }
    return rows;
}

function renderComparison(output) {
    const result = output?.result;
    if (!result?.cases?.length) return '';

    const conditionRows = result.cases.map(item => {
        const calculation = item.calculation || {};
        const target = calculation.target || {};
        const lightcone = target.superimpose ? `${target.lightconeName} S${target.superimpose}` : target.lightconeName || '—';
        const party = (calculation.party || []).map(member => {
            const equipment = [member.lightconeName && member.lightconeName !== '未装備'
                ? `${member.lightconeName}${member.superimpose ? ` S${member.superimpose}` : ''}` : '',
            member.ornamentName && member.ornamentName !== '未装備' ? member.ornamentName : ''].filter(Boolean).join(' / ');
            const effects = (member.activeEffects || []).map(effect => effect.name).filter(Boolean).join('、');
            return `<strong>${escapeHtml(member.characterName)} E${number(member.eidolon, 0)}</strong>${equipment ? `<br>${escapeHtml(equipment)}` : ''}${effects ? `<br><span class="dim-ai-muted">有効: ${escapeHtml(effects)}</span>` : ''}`;
        }).join('<hr>') || 'なし';
        const options = calculation.options || {};
        const enemy = `Lv.${number(options.enemyLevel, 0)} / 耐性 ${percent(options.enemyBaseRes)} / ${options.critMode === 'crit' ? '確定会心' : '会心期待値'} / ${options.breakState === 'broken' ? '弱点撃破中' : '通常靭性'}`;
        return `<tr><th>${escapeHtml(item.label)}</th><td>${escapeHtml(target.characterName || '—')} E${number(target.eidolon, 0)}</td><td>${escapeHtml(lightcone)}</td><td>${party}</td><td>${escapeHtml(enemy)}</td><td><button class="btn-secondary btn-mini dim-ai-case-propose" data-case-label="${escapeHtml(item.label)}">変更案</button></td></tr>`;
    }).join('');

    const statRows = result.cases.map(item => {
        const stats = item.finalStats?.derived || {};
        return `<tr><th>${escapeHtml(item.label)}</th><td>${number(stats.hp)}</td><td>${number(stats.atk)}</td><td>${number(stats.def)}</td><td>${number(stats.spd)}</td><td>${percent(stats.critRate)}</td><td>${percent(stats.critDmg)}</td><td>${percent(stats.dmgOwnElement)}</td></tr>`;
    }).join('');

    const scalingLabels = { atk: '攻撃力', hp: 'HP', def: '防御力' };
    const attackRows = result.cases.flatMap(item => (item.attacks || []).map(attack => `<tr>
        <th>${escapeHtml(item.label)}</th><td>${escapeHtml(attack.name)}</td><td>${escapeHtml(attack.kind)}</td><td>${escapeHtml(attack.target)}</td>
        <td>${number(attack.level, 0)}</td><td>${escapeHtml(scalingLabels[attack.scalingStat] || attack.scalingStat)} × ${percent(attack.multiplier)}</td>
        <td>${number(attack.damage, 0)}</td><td>${attack.totalDamage == null ? '—' : number(attack.totalDamage, 0)}</td>
    </tr>`)).join('');

    return `<div class="dim-ai-comparison">
        <h4>計算条件</h4>
        <div class="dim-ai-table-scroll"><table><thead><tr><th>ケース</th><th>計算対象</th><th>光円錐</th><th>パーティ・フルバフ</th><th>敵条件</th><th></th></tr></thead><tbody>${conditionRows}</tbody></table></div>
        <h4>フルバフ後ステータス</h4>
        <div class="dim-ai-table-scroll"><table><thead><tr><th>ケース</th><th>HP</th><th>攻撃力</th><th>防御力</th><th>速度</th><th>会心率</th><th>会心ダメ</th><th>自属性与ダメ</th></tr></thead><tbody>${statRows}</tbody></table></div>
        <h4>攻撃別の実ダメージ</h4>
        ${attackRows ? `<div class="dim-ai-table-scroll"><table><thead><tr><th>ケース</th><th>攻撃</th><th>種別</th><th>対象</th><th>軌跡Lv</th><th>倍率</th><th>敵1体・1段</th><th>バウンド全段</th></tr></thead><tbody>${attackRows}</tbody></table></div>` : '<p class="dim-ai-muted">倍率を安全に特定できる攻撃はありません。</p>'}
        <p class="dim-ai-muted">範囲攻撃は敵1体あたり。バウンド全段は全ヒットが命中した場合の合計です。特殊な追加倍率・撃破ダメージ・敵数依存効果は、スキル定義に明示されている場合だけ含みます。</p>
    </div>`;
}

function renderConditionSummary(output) {
    const summary = output?.jobSummary;
    if (!summary) return '';
    const changed = [...new Set((summary.cases || []).flatMap(item => collectChangePaths(item.changes)))];
    return `<div class="dim-ai-condition-summary">
        <strong>AIが理解した条件</strong>
        <span>比較ケース: ${summary.caseCount}件</span>
        <span>固定: ${(summary.fixedConditions || []).map(item => FIELD_LABELS[item] || item).join('、') || '指定なし'}</span>
        <span>変更: ${changed.join('、') || 'なし（現在状態の再計算）'}</span>
        <span>指標: ${(summary.metrics || []).join('、')}</span>
    </div>`;
}

function renderWarnings(executions) {
    const errors = executions.flatMap(item => item.output?.validation?.errors || []);
    if (!errors.length) return '';
    return `<div class="dim-ai-warnings"><strong>計算を停止しました</strong><ul>${errors
        .map(error => `<li>${escapeHtml(error.path)}: ${escapeHtml(error.message)}</li>`).join('')}</ul></div>`;
}

function renderActionTimelines(output) {
    const panels = output?.panels;
    if (!Array.isArray(panels) || !panels.length) return '';
    return `<div class="dim-ai-comparison">
        <h4>行動順・行動回数</h4>
        <div class="dim-ai-table-scroll"><table>
            <thead><tr><th>ケース</th><th>基礎速度</th><th>開始時速度</th><th>目標AV</th><th>行動回数</th><th>到達累計AV</th></tr></thead>
            <tbody>${panels.map(panel => `<tr><th>${escapeHtml(panel.name || `パネル${panel.index + 1}`)}</th><td>${number(panel.baseSpeed, 1)}</td><td>${number(panel.preSpeed, 1)}</td><td>${number(panel.threshold, 0)}</td><td><strong>${number(panel.turnsWithinThreshold, 0)}回</strong></td><td>${number(panel.finalCumulativeAV)}</td></tr>`).join('')}</tbody>
        </table></div>
    </div>`;
}

function providerLabel(provider) {
    const cliMeta = CLI_PROVIDERS[provider.type];
    if (cliMeta) return `${cliMeta.label}${provider.model ? ` / ${provider.model}` : ''}${provider.reasoningEffort ? ` / ${provider.reasoningEffort}` : ''}`;
    return `${provider.type === 'openai' ? 'OpenAI' : 'OpenAI互換API'} / ${provider.model || '未選択'}`;
}

export function initDiminishingAssistantUI({ mount, session, onStateChange, actionOrderBridge }) {
    if (!mount) return null;
    if (!session?.serialize || !actionOrderBridge?.getState || !actionOrderBridge?.applyState) {
        mount.innerHTML = '<p class="dim-ai-muted">比較画面の状態を取得できないため、AIアシスタントを開始できませんでした。</p>';
        return null;
    }
    const localTools = createDiminishingTools({ session, allowApply: true });
    let simulationTarget = readSimulationTarget();
    let selectedActionOrderState = null;
    let assumptions = readAssumptions();

    const aiState = () => {
        const selectedBuildIds = [rosterTargetEl, ...rosterSupportEls]
            .map(element => element?.value)
            .filter(Boolean);
        // クイック追加はパネル保存とは独立したユーザー設定なので、保存済みパネルを選んだ場合も
        // 現在ブラウザに登録されているAI参照メモを常に渡す。
        const currentActionOrderState = actionOrderBridge.getState();
        const actionOrderState = selectedActionOrderState || currentActionOrderState;
        return {
            simulationTarget,
            assumptions,
            // 限界効用逓減タブは手動で試す実験場。現在の入力・パーティー・一時バフはAIへ送らない。
            ...(simulationTarget === 'actionOrder'
                ? {
                    actionOrder: {
                        ...actionOrderState,
                        quickPresets: currentActionOrderState.quickPresets || [],
                    },
                }
                : {}),
            selectedBuildIds,
            // 保存ビルドだけは、AIがツール経由で必要なものを明示して読む。
            savedBuilds: Build.list(),
        };
    };
    const connectionPreference = readConnectionPreference();
    let connectionMode = connectionPreference.lastMode;
    let cliType = connectionPreference.cli.type;
    let connected = false;
    let sessionId = null;
    let providerSessionId = null;
    let lastComparison = null;
    let pendingProposal = null;
    const undoStack = [];
    let busy = false;
    let autoReconnectAttempted = false;
    let diagnosticLogs = [];

    mount.innerHTML = `<section class="dim-ai-workspace" aria-label="AI比較アシスタント">
        <header class="dim-ai-workspace-header">
            <div class="dim-ai-header-actions">
                <div class="dim-ai-header-target-selector" role="radiogroup" aria-label="シミュレーション対象">
                    <button id="dim-ai-target-diminishing" type="button" data-simulation-target="diminishing" role="radio">限界効用逓減</button>
                    <button id="dim-ai-target-action-order" type="button" data-simulation-target="actionOrder" role="radio">行動順</button>
                </div>
                <button id="dim-ai-open-assumptions" type="button" class="dim-ai-assumptions-trigger" aria-expanded="false" aria-controls="dim-ai-assumptions-panel">AIへの依頼条件</button>
                <span id="dim-ai-status" class="dim-ai-status">未接続</span>
                <button id="dim-ai-open-log" type="button" class="btn-secondary btn-mini">ログ <span id="dim-ai-log-count">0</span></button>
            </div>
        </header>
        <div class="dim-ai-workspace-grid">
            <aside class="dim-ai-sidebar" aria-label="AI設定メニュー">
                <section class="dim-ai-setup-card">
                    <div class="dim-ai-step"><span>02</span><div><strong>接続方法</strong><small>CLIとAPIは別設定</small></div></div>
                    <div class="dim-ai-mode-switch" role="tablist" aria-label="AI接続方法">
                        <button id="dim-ai-mode-cli" type="button" class="is-selected" role="tab" aria-selected="true">CLI</button>
                        <button id="dim-ai-mode-api" type="button" role="tab" aria-selected="false">API</button>
                    </div>
                    <div id="dim-ai-cli-panel" class="dim-ai-provider-panel" role="tabpanel">
                        <div class="dim-ai-provider-title"><strong id="dim-ai-cli-type-title">Codex CLI</strong><span id="dim-ai-cli-type-desc">ローカルMCP接続</span></div>
                        <div class="dim-ai-mode-switch" role="tablist" aria-label="CLIの種類">
                            <button id="dim-ai-cli-type-codex" type="button" class="is-selected" role="tab" aria-selected="true" aria-pressed="true">Codex CLI</button>
                            <button id="dim-ai-cli-type-claude" type="button" role="tab" aria-selected="false" aria-pressed="false">Claude Code CLI</button>
                        </div>
                        <label>実行プリセット<select id="dim-ai-cli-preset"><option value="fast">高速</option><option value="standard">標準</option><option value="precise">高精度</option><option value="cli">CLI設定を使用</option><option value="custom">カスタム</option></select></label>
                        <label>モデル<input id="dim-ai-cli-model" type="text" autocomplete="off" placeholder="空欄でCLI設定"></label>
                        <label>推論レベル<select id="dim-ai-cli-reasoning"><option value="">CLI設定</option><option value="low">low</option><option value="medium">medium</option><option value="high">high</option><option value="xhigh">xhigh</option><option value="max">max</option></select></label>
                        <label class="dim-ai-auto-connect"><input id="dim-ai-cli-auto-connect" type="checkbox">次回AI画面を開いたとき自動接続</label>
                        <button id="dim-ai-cli-connect" type="button" class="btn-primary">CLI接続を確認</button>
                        <p id="dim-ai-cli-type-help">ログイン済みのCodex CLIを使用します。APIキーの入力は不要です。</p>
                    </div>
                    <div id="dim-ai-api-panel" class="dim-ai-provider-panel" role="tabpanel" hidden>
                        <div class="dim-ai-provider-title"><strong>Responses API</strong><span>ツール呼び出し対応モデル</span></div>
                        <label>API種別<select id="dim-ai-api-provider"><option value="openai">OpenAI Responses API</option><option value="compatible">OpenAI互換 Responses API</option></select></label>
                        <label>API URL<input id="dim-ai-api-endpoint" type="url" value="https://api.openai.com/v1" autocomplete="off"></label>
                        <label>APIキー<input id="dim-ai-api-key" type="password" autocomplete="off" placeholder="この画面内だけで使用"></label>
                        <label>モデル<input id="dim-ai-api-model" type="text" list="dim-ai-api-models" autocomplete="off" placeholder="モデルを選択または入力"><datalist id="dim-ai-api-models"></datalist></label>
                        <button id="dim-ai-api-connect" type="button" class="btn-primary">API接続を確認</button>
                    </div>
                </section>
                <section class="dim-ai-context" aria-label="比較用データ">
                    <section class="dim-ai-data-section" aria-labelledby="dim-ai-build-selection-title">
                        <header><strong id="dim-ai-build-selection-title">比較に使うビルド（最大4人）</strong><small id="dim-ai-build-selection-help">対象1人と支援3人を選べます。</small></header>
                        <fieldset class="dim-ai-roster"><legend>保存ビルド</legend><label>1<select id="dim-ai-roster-target" aria-label="ビルド1"></select></label><label>2<select id="dim-ai-roster-support-0" aria-label="ビルド2"></select></label><label>3<select id="dim-ai-roster-support-1" aria-label="ビルド3"></select></label><label>4<select id="dim-ai-roster-support-2" aria-label="ビルド4"></select></label><small>行動順では、選択したビルドの速度も参照できます。</small></fieldset>
                    </section>
                    <section id="dim-ai-action-json-section" class="dim-ai-data-section" aria-labelledby="dim-ai-action-json-title" hidden>
                        <header><strong id="dim-ai-action-json-title">行動順JSON</strong><small>保存済みの行動順データを読み込みます。</small></header>
                        <label class="dim-ai-action-json-field">使用するJSON<select id="dim-ai-action-json" aria-label="使用する行動順JSON"></select></label>
                        <small id="dim-ai-action-json-status" class="dim-ai-action-json-status">現在の行動順パネルを使用します。</small>
                    </section>
                </section>
            </aside>
            <main class="dim-ai-chat-panel">
                <div id="dim-ai-feed" class="dim-ai-feed" aria-live="polite">
                    <div class="dim-ai-welcome">
                        <div class="dim-ai-welcome-mark" aria-hidden="true">AI</div>
                        <div class="dim-ai-topic-intro"><span id="dim-ai-welcome-kicker">限界効用逓減</span><strong id="dim-ai-welcome-title">火力条件を比較します</strong><p id="dim-ai-welcome-description">現在のビルド・装備・パーティ条件を使って比較します。</p></div>
                    </div>
                </div>
                <form id="dim-ai-form" class="dim-ai-form">
                    <textarea id="dim-ai-input" rows="4" placeholder="比較したい条件を入力（送信にはAI接続が必要です）"></textarea>
                    <div class="dim-ai-form-actions"><button id="dim-ai-send" class="btn-primary" disabled>AIに依頼</button><button id="dim-ai-cancel" type="button" class="btn-secondary" disabled>中断</button><button id="dim-ai-undo" type="button" class="btn-secondary" disabled>元に戻す</button></div>
                </form>
            </main>
            <section id="dim-ai-assumptions-panel" class="dim-ai-assumptions-panel" aria-labelledby="dim-ai-assumptions-title" hidden>
                <header class="dim-ai-assumptions-panel-header"><div><span>REQUEST SETUP</span><h3 id="dim-ai-assumptions-title">AIへの依頼条件</h3><p>ここで一度に前提を決めてから、AIへの依頼へ戻ります。</p></div><button id="dim-ai-close-assumptions" type="button" class="dim-ai-assumptions-confirm">条件を確定</button></header>
                <div class="dim-ai-assumptions-grid">
                    <label class="dim-ai-assumption-field dim-ai-assumption-objective"><strong>目的</strong><small>今回の提案で最優先したいことを記入してください。</small><textarea id="dim-ai-objective" rows="5" placeholder="例: 0ラウンドを維持しつつ、厳選負担が低い案を探す"></textarea></label>
                    <label class="dim-ai-assumption-field dim-ai-assumption-action-goal"><strong>行動順の目標</strong><small>必要な行動回数や到達AVを記入してください。</small><textarea id="dim-ai-action-order-goal" rows="5" placeholder="例: 1サイクル目に2回行動、累計150AVまで"></textarea></label>
                    <section class="dim-ai-effect-uptimes dim-ai-assumption-effects" aria-labelledby="dim-ai-effect-uptimes-title"><header><strong id="dim-ai-effect-uptimes-title">バフの稼働率</strong><small>選択ビルドから読み込んだEffectを選び、想定継続ターンを指定します。0は未指定です。</small></header><div id="dim-ai-effect-uptime-list"></div></section>
                </div>
            </section>
        </div>
        <dialog id="dim-ai-log-dialog" class="dim-ai-log-dialog" aria-labelledby="dim-ai-log-title">
            <div class="dim-ai-log-window">
                <header><div><h3 id="dim-ai-log-title">AI実行ログ</h3><p>接続試験と会話処理の診断情報です。APIキーと計算状態は記録しません。</p></div><button id="dim-ai-log-close" type="button" class="btn-secondary btn-mini" aria-label="閉じる">閉じる</button></header>
                <pre id="dim-ai-log-output" tabindex="0">ログはまだありません。</pre>
                <footer><span id="dim-ai-log-copy-status" role="status"></span><button id="dim-ai-log-clear" type="button" class="btn-secondary btn-mini">消去</button><button id="dim-ai-log-download" type="button" class="btn-secondary btn-mini">JSON保存</button><button id="dim-ai-log-copy" type="button" class="btn-primary btn-mini">コピー</button></footer>
            </div>
        </dialog>
    </section>`;

    const get = id => mount.querySelector(`#${id}`);
    const workspaceGridEl = mount.querySelector('.dim-ai-workspace-grid');
    const cliPresetEl = get('dim-ai-cli-preset');
    const cliModelEl = get('dim-ai-cli-model');
    const cliReasoningEl = get('dim-ai-cli-reasoning');
    const cliAutoConnectEl = get('dim-ai-cli-auto-connect');
    const apiProviderEl = get('dim-ai-api-provider');
    const apiEndpointEl = get('dim-ai-api-endpoint');
    const apiKeyEl = get('dim-ai-api-key');
    const apiModelEl = get('dim-ai-api-model');
    const statusEl = get('dim-ai-status');
    const feedEl = get('dim-ai-feed');
    const inputEl = get('dim-ai-input');
    const rosterTargetEl = get('dim-ai-roster-target');
    const rosterSupportEls = [0, 1, 2].map(index => get(`dim-ai-roster-support-${index}`));
    const actionJsonSectionEl = get('dim-ai-action-json-section');
    const actionJsonEl = get('dim-ai-action-json');
    const actionJsonStatusEl = get('dim-ai-action-json-status');
    const assumptionsPanelEl = get('dim-ai-assumptions-panel');
    const openAssumptionsEl = get('dim-ai-open-assumptions');
    const closeAssumptionsEl = get('dim-ai-close-assumptions');
    const objectiveEl = get('dim-ai-objective');
    const actionOrderGoalEl = get('dim-ai-action-order-goal');
    const effectUptimeListEl = get('dim-ai-effect-uptime-list');
    const sendEl = get('dim-ai-send');
    const cancelEl = get('dim-ai-cancel');
    const undoEl = get('dim-ai-undo');
    const logDialogEl = get('dim-ai-log-dialog');
    const logOutputEl = get('dim-ai-log-output');
    const logCountEl = get('dim-ai-log-count');
    const logCopyStatusEl = get('dim-ai-log-copy-status');
    let actionJsonEntries = [];

    objectiveEl.value = assumptions.objective;
    actionOrderGoalEl.value = assumptions.actionOrderGoal;

    cliAutoConnectEl.checked = connectionPreference.cli.autoConnect;

    function normalizeDiagnosticLog(entry) {
        return {
            timestamp: typeof entry?.timestamp === 'string' ? entry.timestamp : new Date().toISOString(),
            level: ['info', 'warning', 'error'].includes(entry?.level) ? entry.level : 'info',
            source: String(entry?.source || 'ui'),
            message: String(entry?.message || ''),
            ...(entry?.details !== undefined ? { details: entry.details } : {}),
        };
    }

    function formatDiagnosticLogs() {
        if (!diagnosticLogs.length) return 'ログはまだありません。';
        return diagnosticLogs.map(entry => {
            const details = entry.details === undefined ? '' : `\n  ${JSON.stringify(entry.details)}`;
            return `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.source}] ${entry.message}${details}`;
        }).join('\n');
    }

    function renderDiagnosticLogs() {
        logCountEl.textContent = String(diagnosticLogs.length);
        logOutputEl.textContent = formatDiagnosticLogs();
        logOutputEl.scrollTop = logOutputEl.scrollHeight;
    }

    function appendDiagnosticLogs(entries) {
        if (!Array.isArray(entries) || entries.length === 0) return;
        diagnosticLogs.push(...entries.map(normalizeDiagnosticLog));
        if (diagnosticLogs.length > 500) diagnosticLogs = diagnosticLogs.slice(-500);
        renderDiagnosticLogs();
    }

    function addDiagnosticLog(level, source, message, details) {
        appendDiagnosticLogs([{ timestamp: new Date().toISOString(), level, source, message, details }]);
    }

    function appendExecutionLogs(executions) {
        appendDiagnosticLogs((executions || []).map(execution => ({
            timestamp: new Date().toISOString(),
            level: execution.output?.ok === false || execution.status === 'failed' ? 'error' : 'info',
            source: 'tool',
            message: `${execution.name || 'unknown'}: ${execution.status || (execution.output?.ok === true ? 'completed' : 'unknown')}`,
            details: { ok: execution.output?.ok },
        })));
    }

    function saveConnectionPreference(patch = {}) {
        Object.assign(connectionPreference, patch);
        writeConnectionPreference(connectionPreference);
    }

    function saveCliPreference(patch = {}) {
        connectionPreference.cli.providers[cliType] = { ...connectionPreference.cli.providers[cliType], ...patch };
        writeConnectionPreference(connectionPreference);
    }

    function getRememberedCustomCliValues(preference) {
        const hasCustomModel = Object.prototype.hasOwnProperty.call(preference || {}, 'customModel');
        const hasCustomReasoningEffort = Object.prototype.hasOwnProperty.call(preference || {}, 'customReasoningEffort');
        if (!hasCustomModel && !hasCustomReasoningEffort) return null;
        return {
            model: typeof preference.customModel === 'string' ? preference.customModel : '',
            reasoningEffort: typeof preference.customReasoningEffort === 'string' ? preference.customReasoningEffort : '',
        };
    }

    function provider() {
        if (connectionMode === 'cli') {
            const result = { type: cliType, model: cliModelEl.value.trim(), reasoningEffort: cliReasoningEl.value };
            // verbosity はCodex CLI固有の設定 (model_verbosity)。Claude Code CLIには対応する項目がない。
            if (cliType === 'codex') result.verbosity = cliPresetEl.value === 'cli' ? '' : 'low';
            return result;
        }
        return {
            type: apiProviderEl.value,
            endpoint: apiEndpointEl.value.trim(),
            apiKey: apiKeyEl.value.trim(),
            model: apiModelEl.value.trim(),
        };
    }

    function invalidateConnection(label = '未接続') {
        connected = false;
        sessionId = null;
        providerSessionId = null;
        inputEl.disabled = false;
        sendEl.disabled = true;
        statusEl.textContent = label;
    }

    function applyCliPreset(presetId, { invalidate = true, restoreCustom = false, clearMissingCustom = false } = {}) {
        const selectedPresetId = CLI_PRESET_IDS.includes(presetId) ? presetId : 'fast';
        const preset = CLI_PROVIDERS[cliType].presets[selectedPresetId];
        if (preset) {
            cliModelEl.value = preset.model;
            cliReasoningEl.value = preset.reasoningEffort;
        } else if (selectedPresetId === 'custom' && restoreCustom) {
            const remembered = getRememberedCustomCliValues(connectionPreference.cli.providers[cliType]);
            if (remembered) {
                cliModelEl.value = remembered.model;
                cliReasoningEl.value = remembered.reasoningEffort;
            } else if (clearMissingCustom) {
                cliModelEl.value = '';
                cliReasoningEl.value = '';
            }
        }
        const custom = selectedPresetId === 'custom';
        cliModelEl.disabled = !custom;
        cliReasoningEl.disabled = !custom;
        const preference = {
            verified: invalidate ? false : connectionPreference.cli.providers[cliType].verified,
            preset: selectedPresetId,
            model: cliModelEl.value.trim(),
            reasoningEffort: cliReasoningEl.value,
        };
        if (custom) {
            preference.customModel = preference.model;
            preference.customReasoningEffort = preference.reasoningEffort;
        }
        saveCliPreference(preference);
        if (invalidate && connected) invalidateConnection('設定変更・再接続が必要');
    }

    function selectCliType(type, { remember = true } = {}) {
        cliType = CLI_PROVIDER_IDS.includes(type) ? type : 'codex';
        const meta = CLI_PROVIDERS[cliType];
        get('dim-ai-cli-type-codex').classList.toggle('is-selected', cliType === 'codex');
        get('dim-ai-cli-type-claude').classList.toggle('is-selected', cliType === 'claude');
        get('dim-ai-cli-type-codex').setAttribute('aria-pressed', String(cliType === 'codex'));
        get('dim-ai-cli-type-claude').setAttribute('aria-pressed', String(cliType === 'claude'));
        get('dim-ai-cli-type-codex').setAttribute('aria-selected', String(cliType === 'codex'));
        get('dim-ai-cli-type-claude').setAttribute('aria-selected', String(cliType === 'claude'));
        get('dim-ai-cli-type-title').textContent = meta.label;
        get('dim-ai-cli-type-desc').textContent = meta.connection;
        get('dim-ai-cli-type-help').textContent = meta.helpText;
        const pref = connectionPreference.cli.providers[cliType];
        cliPresetEl.value = pref.preset;
        applyCliPreset(pref.preset, { invalidate: false, restoreCustom: true, clearMissingCustom: true });
        if (remember) {
            connectionPreference.cli.type = cliType;
            writeConnectionPreference(connectionPreference);
            autoReconnectAttempted = false;
        }
        invalidateConnection();
        if (remember) Promise.resolve().then(maybeAutoReconnect);
    }

    function selectConnectionMode(mode, { remember = true } = {}) {
        connectionMode = mode === 'api' ? 'api' : 'cli';
        const cli = connectionMode === 'cli';
        get('dim-ai-cli-panel').hidden = !cli;
        get('dim-ai-api-panel').hidden = cli;
        get('dim-ai-mode-cli').classList.toggle('is-selected', cli);
        get('dim-ai-mode-api').classList.toggle('is-selected', !cli);
        get('dim-ai-mode-cli').setAttribute('aria-selected', String(cli));
        get('dim-ai-mode-api').setAttribute('aria-selected', String(!cli));
        if (remember) saveConnectionPreference({ lastMode: connectionMode });
        invalidateConnection();
        if (!cli) autoReconnectAttempted = false;
        else if (remember) Promise.resolve().then(maybeAutoReconnect);
    }

    function renderInputState() {
        const subject = simulationTarget === 'actionOrder' ? '行動順' : '火力条件';
        inputEl.placeholder = connected
            ? `${subject}で比較したい内容を入力`
            : `${subject}で比較したい内容を入力（送信にはAI接続が必要です）`;
    }

    function selectSimulationTarget(target, { remember = true } = {}) {
        if (busy) return;
        const next = target === 'actionOrder' ? 'actionOrder' : 'diminishing';
        const changed = next !== simulationTarget;
        simulationTarget = next;
        const diminishing = next === 'diminishing';
        get('dim-ai-target-diminishing').classList.toggle('is-selected', diminishing);
        get('dim-ai-target-action-order').classList.toggle('is-selected', !diminishing);
        get('dim-ai-target-diminishing').setAttribute('aria-checked', String(diminishing));
        get('dim-ai-target-action-order').setAttribute('aria-checked', String(!diminishing));
        actionJsonSectionEl.hidden = diminishing;
        get('dim-ai-build-selection-title').textContent = diminishing
            ? '比較に使うビルド（最大4人）'
            : '行動順に参照するビルド（最大4人）';
        get('dim-ai-build-selection-help').textContent = diminishing
            ? '対象1人と支援3人を選べます。'
            : '選んだキャラクターのビルドと速度をAIが参照できます。';
        get('dim-ai-welcome-kicker').textContent = diminishing ? '限界効用逓減' : '行動順';
        get('dim-ai-welcome-title').textContent = diminishing ? '火力条件を比較します' : '行動順を比較します';
        get('dim-ai-welcome-description').textContent = diminishing
            ? '現在のビルド・装備・パーティ条件を使って比較します。'
            : '現在の速度・行動値・行動回数の条件を使って比較します。';
        if (remember) writeSimulationTarget(next);
        if (changed) {
            sessionId = null;
            providerSessionId = null;
            pendingProposal = null;
            lastComparison = null;
        }
        renderInputState();
        if (!diminishing) void refreshActionOrderEntries();
    }

    function renderActionOrderJsonEntries() {
        const currentValue = selectedActionOrderState ? actionJsonEl.value : '__current__';
        const options = actionJsonEntries.map(entry => `<option value="${escapeHtml(entry.id)}">${escapeHtml(entry.name || entry.id)}</option>`).join('');
        actionJsonEl.innerHTML = `<option value="__current__">現在の行動順パネル</option>${options}`;
        actionJsonEl.value = actionJsonEntries.some(entry => entry.id === currentValue) ? currentValue : '__current__';
    }

    async function refreshActionOrderEntries() {
        try {
            const data = await getJson('/api/local-save/action-order');
            actionJsonEntries = Array.isArray(data.entries) ? data.entries : [];
            renderActionOrderJsonEntries();
            if (!selectedActionOrderState) actionJsonStatusEl.textContent = '現在の行動順パネルを使用します。';
        } catch (error) {
            actionJsonEntries = [];
            renderActionOrderJsonEntries();
            actionJsonStatusEl.textContent = `保存済みJSONを取得できませんでした: ${error.message}`;
        }
    }

    async function selectActionOrderJson(entryId) {
        if (busy) return;
        if (entryId === '__current__') {
            selectedActionOrderState = null;
            actionJsonStatusEl.textContent = '現在の行動順パネルを使用します。';
        } else {
            actionJsonStatusEl.textContent = '保存済みJSONを読み込み中…';
            try {
                const data = await getJson(`/api/local-save/action-order/entry/${encodeURIComponent(entryId)}`);
                if (!data.exists || !data.state) throw new Error('選択したJSONが見つかりません。');
                selectedActionOrderState = data.state;
                actionJsonStatusEl.textContent = `「${data.entry?.name || entryId}」を使用します。`;
            } catch (error) {
                selectedActionOrderState = null;
                actionJsonEl.value = '__current__';
                actionJsonStatusEl.textContent = `JSONを読み込めませんでした: ${error.message}`;
                return;
            }
        }
        sessionId = null;
        providerSessionId = null;
        pendingProposal = null;
        lastComparison = null;
    }

    function assumptionEffectsForBuild(build, buildLabel) {
        if (!build?.characterId) return [];
        const character = Registry.character.get(build.characterId);
        if (!character) return [];
        const out = [];
        const buildId = build.id || `current:${build.characterId}`;
        const add = (effects, source, type) => {
            for (const effect of effects || []) {
                if (!effect?.id || (effect.minEidolon && Number(build.eidolon || 0) < effect.minEidolon)) continue;
                out.push({
                    key: `${buildId}:${type}:${source}:${effect.id}`,
                    name: effect.name || effect.id,
                    source: `${buildLabel} / ${source}`,
                    description: effect.description || '',
                    durationTurns: Number.isFinite(effect.duration) ? effect.duration : 0,
                });
            }
        };
        add(character.selfEffects, `キャラ: ${character.name}`, 'self');
        add(character.partyEffects, `キャラ: ${character.name}`, 'party');

        if (build.lightcone?.id) {
            const lightcone = Registry.lightcone.get(build.lightcone.id);
            if (lightcone) {
                const superimpose = Math.max(1, Math.min(5, Number(build.lightcone.superimpose) || 1));
                const effectsFor = key => typeof lightcone[key] === 'function'
                    ? lightcone[key](superimpose) || []
                    : lightcone[key] || [];
                add(effectsFor('selfEffects'), `光円錐: ${lightcone.name} S${superimpose}`, 'self');
                add(effectsFor('partyEffects'), `光円錐: ${lightcone.name} S${superimpose}`, 'party');
            }
        }

        const addSetEffects = (slots, registry, label) => {
            const counts = new Map();
            for (const slot of slots) {
                const setId = build.relics?.[slot]?.setId;
                if (setId) counts.set(setId, (counts.get(setId) || 0) + 1);
            }
            for (const [setId, count] of counts) {
                const set = registry.get(setId);
                if (!set) continue;
                for (const type of ['self', 'party']) {
                    const groups = set[`${type}Effects`];
                    if (!groups) continue;
                    if (count >= 2) add(groups.pc2, `${label}: ${set.name} 2pc`, type);
                    if (count >= 4) add(groups.pc4, `${label}: ${set.name} 4pc`, type);
                }
            }
        };
        addSetEffects(['head', 'hands', 'body', 'feet'], Registry.relicSet, '遺物セット');
        addSetEffects(['sphere', 'rope'], Registry.ornament, 'オーナメント');
        return out;
    }

    function availableAssumptionEffects() {
        const selected = [rosterTargetEl, ...rosterSupportEls]
            .map(element => Build.get(element.value))
            .filter(Boolean);
        return selected.flatMap(build => {
            const character = Registry.character.get(build?.characterId);
            return assumptionEffectsForBuild(build, build?.name || character?.name || '現在のビルド');
        });
    }

    function saveAssumptions() {
        assumptions = normalizeAssumptions(assumptions);
        writeAssumptions(assumptions);
    }

    function commitAssumptionsInputs() {
        assumptions.objective = objectiveEl.value;
        assumptions.actionOrderGoal = actionOrderGoalEl.value;
        saveAssumptions();
    }

    function setAssumptionsEditor(open) {
        if (busy) return;
        if (open) {
            objectiveEl.value = assumptions.objective;
            actionOrderGoalEl.value = assumptions.actionOrderGoal;
            renderEffectUptimes();
        } else {
            commitAssumptionsInputs();
        }
        workspaceGridEl.classList.toggle('is-assumptions-open', open);
        assumptionsPanelEl.hidden = !open;
        openAssumptionsEl.setAttribute('aria-expanded', String(open));
    }

    function renderEffectUptimes() {
        const effects = availableAssumptionEffects();
        const availableKeys = new Set(effects.map(effect => effect.key));
        assumptions.effectUptimes = assumptions.effectUptimes.filter(item => availableKeys.has(item.key));
        saveAssumptions();
        if (!effects.length) {
            effectUptimeListEl.innerHTML = '<p class="dim-ai-muted">保存ビルドを選ぶと、設定できるEffectが表示されます。</p>';
            return;
        }
        const selected = new Map(assumptions.effectUptimes.map(item => [item.key, item]));
        effectUptimeListEl.innerHTML = effects.map(effect => {
            const uptime = selected.get(effect.key);
            const duration = uptime ? uptime.durationTurns : effect.durationTurns;
            return `<label class="dim-ai-effect-uptime-row" title="${escapeHtml(effect.description)}">
                <input type="checkbox" data-effect-uptime-key="${escapeHtml(effect.key)}" ${uptime ? 'checked' : ''}>
                <span><strong>${escapeHtml(effect.name)}</strong><small>${escapeHtml(effect.source)}</small></span>
                <input type="number" min="0" max="99" step="1" value="${escapeHtml(duration)}" aria-label="${escapeHtml(effect.name)} の継続ターン" data-effect-uptime-duration="${escapeHtml(effect.key)}" ${uptime ? '' : 'disabled'}>
                <em>ターン</em>
            </label>`;
        }).join('');
        effectUptimeListEl.querySelectorAll('[data-effect-uptime-key]').forEach(input => input.addEventListener('change', () => {
            const effect = effects.find(item => item.key === input.dataset.effectUptimeKey);
            if (!effect) return;
            const durationInput = effectUptimeListEl.querySelector(`[data-effect-uptime-duration="${input.dataset.effectUptimeKey}"]`);
            if (input.checked) {
                assumptions.effectUptimes = [...assumptions.effectUptimes.filter(item => item.key !== effect.key), {
                    key: effect.key, name: effect.name, source: effect.source,
                    durationTurns: Number(durationInput?.value) || effect.durationTurns,
                }];
            } else {
                assumptions.effectUptimes = assumptions.effectUptimes.filter(item => item.key !== effect.key);
            }
            saveAssumptions();
            renderEffectUptimes();
        }));
        effectUptimeListEl.querySelectorAll('[data-effect-uptime-duration]').forEach(input => input.addEventListener('change', () => {
            const current = assumptions.effectUptimes.find(item => item.key === input.dataset.effectUptimeDuration);
            if (!current) return;
            current.durationTurns = Number(input.value) || 0;
            saveAssumptions();
        }));
    }

    function updateContext() {
        const previous = [rosterTargetEl, ...rosterSupportEls].map(element => element.value);
        const builds = Build.list();
        const buildOptions = builds.map(build => {
            const buildCharacter = Registry.character.get(build.characterId);
            const label = `${build.name || '(無名)'} — ${buildCharacter?.name || build.characterId}`;
            return `<option value="${escapeHtml(build.id)}">${escapeHtml(label)}</option>`;
        }).join('');
        rosterTargetEl.innerHTML = `<option value="">指定しない</option>${buildOptions}`;
        rosterSupportEls.forEach((element, index) => {
            element.innerHTML = `<option value="">指定しない</option>${buildOptions}`;
            if (builds.some(build => build.id === previous[index + 1])) element.value = previous[index + 1];
        });
        if (builds.some(build => build.id === previous[0])) rosterTargetEl.value = previous[0];
        renderEffectUptimes();
        undoEl.disabled = undoStack.length === 0;
        if (simulationTarget === 'actionOrder') void refreshActionOrderEntries();
    }

    function setBusy(value, label = '') {
        busy = value;
        sendEl.disabled = value || !connected;
        inputEl.disabled = value;
        cancelEl.disabled = !value;
        get('dim-ai-cli-connect').disabled = value;
        get('dim-ai-api-connect').disabled = value;
        get('dim-ai-target-diminishing').disabled = value;
        get('dim-ai-target-action-order').disabled = value;
        openAssumptionsEl.disabled = value;
        if (label) statusEl.textContent = label;
    }

    function addMessage(kind, html) {
        const article = document.createElement('article');
        article.className = `dim-ai-message is-${kind}`;
        article.innerHTML = html;
        feedEl.append(article);
        feedEl.scrollTop = feedEl.scrollHeight;
        return article;
    }

    function showProposal(proposal, scope = 'diminishing') {
        feedEl.querySelectorAll('.dim-ai-message.is-proposal').forEach(item => item.remove());
        pendingProposal = { ...proposal, scope };
        const changed = collectChangePaths(proposal.changes).join('、') || '変更条件';
        addMessage('proposal', `<strong>変更案</strong><p>${escapeHtml(proposal.summary || proposal.label || changed)}</p><p class="dim-ai-muted">反映箇所: ${escapeHtml(changed)}</p><div><button class="btn-primary btn-mini dim-ai-apply">反映</button><button class="btn-secondary btn-mini dim-ai-discard">破棄</button></div>`);
    }

    get('dim-ai-mode-cli').addEventListener('click', () => selectConnectionMode('cli'));
    get('dim-ai-mode-api').addEventListener('click', () => selectConnectionMode('api'));
    openAssumptionsEl.addEventListener('click', () => setAssumptionsEditor(true));
    closeAssumptionsEl.addEventListener('click', () => setAssumptionsEditor(false));
    get('dim-ai-target-diminishing').addEventListener('click', () => selectSimulationTarget('diminishing'));
    get('dim-ai-target-action-order').addEventListener('click', () => selectSimulationTarget('actionOrder'));
    actionJsonEl.addEventListener('change', () => { void selectActionOrderJson(actionJsonEl.value); });
    objectiveEl.addEventListener('change', () => {
        commitAssumptionsInputs();
    });
    actionOrderGoalEl.addEventListener('change', () => {
        commitAssumptionsInputs();
    });
    [rosterTargetEl, ...rosterSupportEls].forEach(element => element.addEventListener('change', () => {
        const build = Build.get(element.value);
        if (build) {
            addDiagnosticLog('info', 'ui', 'AI編成の保存ビルドを選択しました。', {
                id: build.id, name: build.name || '(無名)', characterId: build.characterId,
            });
        }
        renderEffectUptimes();
    }));
    get('dim-ai-open-log').addEventListener('click', () => {
        logCopyStatusEl.textContent = '';
        renderDiagnosticLogs();
        logDialogEl.showModal();
    });
    get('dim-ai-log-close').addEventListener('click', () => logDialogEl.close());
    logDialogEl.addEventListener('click', event => {
        if (event.target === logDialogEl) logDialogEl.close();
    });
    get('dim-ai-log-clear').addEventListener('click', () => {
        diagnosticLogs = [];
        logCopyStatusEl.textContent = 'ログを消去しました。';
        renderDiagnosticLogs();
    });
    get('dim-ai-log-copy').addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(formatDiagnosticLogs());
            logCopyStatusEl.textContent = 'クリップボードへコピーしました。';
        } catch {
            logCopyStatusEl.textContent = 'コピーできませんでした。ログ本文を選択してコピーしてください。';
            logOutputEl.focus();
        }
    });
    get('dim-ai-log-download').addEventListener('click', () => {
        const blob = new window.Blob([`${JSON.stringify({ exportedAt: new Date().toISOString(), logs: diagnosticLogs }, null, 2)}\n`], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `srsim-ai-log-${new Date().toISOString().replaceAll(':', '-')}.json`;
        anchor.click();
        URL.revokeObjectURL(url);
        logCopyStatusEl.textContent = 'JSONログを保存しました。';
    });

    const configElements = [apiEndpointEl, apiKeyEl, apiModelEl];
    configElements.forEach(element => element.addEventListener('change', () => {
        if (connected) invalidateConnection('設定変更・再接続が必要');
    }));
    apiProviderEl.addEventListener('change', () => {
        if (apiProviderEl.value === 'openai') apiEndpointEl.value = 'https://api.openai.com/v1';
        if (connected) invalidateConnection('設定変更・再接続が必要');
    });
    cliAutoConnectEl.addEventListener('change', () => {
        connectionPreference.cli.autoConnect = cliAutoConnectEl.checked;
        writeConnectionPreference(connectionPreference);
    });
    cliPresetEl.addEventListener('change', () => applyCliPreset(cliPresetEl.value, { restoreCustom: cliPresetEl.value === 'custom' }));
    [cliModelEl, cliReasoningEl].forEach(element => element.addEventListener('change', () => {
        cliPresetEl.value = 'custom';
        applyCliPreset('custom');
    }));
    cliModelEl.addEventListener('input', () => {
        if (cliPresetEl.value !== 'custom') return;
        applyCliPreset('custom');
    });
    get('dim-ai-cli-type-codex').addEventListener('click', () => selectCliType('codex'));
    get('dim-ai-cli-type-claude').addEventListener('click', () => selectCliType('claude'));

    async function connectCurrentProvider({ automatic = false } = {}) {
        const selectedProvider = provider();
        const startedAt = window.performance.now();
        addDiagnosticLog('info', 'ui', automatic ? 'CLI自動接続を開始しました。' : '接続試験を開始しました。', {
            provider: selectedProvider.type, model: selectedProvider.model || 'default', automatic,
            reasoningEffort: selectedProvider.reasoningEffort || 'CLI setting',
        });
        setBusy(true, automatic ? `${CLI_PROVIDERS[cliType].label}へ自動接続中…` : '接続試験中…');
        try {
            const result = await postJson('/api/ai/connect', {
                provider: selectedProvider,
                state: aiState(),
                scope: 'workspace',
            });
            appendDiagnosticLogs(result.diagnosticLogs);
            addDiagnosticLog('info', 'ui', '接続試験の応答を受信しました。', { durationMs: Math.round(window.performance.now() - startedAt) });
            get('dim-ai-api-models').innerHTML = (result.models || []).map(id => `<option value="${escapeHtml(id)}"></option>`).join('');
            if (result.provider?.model) {
                if (connectionMode === 'cli') cliModelEl.value = result.provider.model;
                else apiModelEl.value = result.provider.model;
            }
            connected = true;
            sessionId = null;
            providerSessionId = null;
            statusEl.textContent = `${providerLabel(provider())} 接続済み`;
            if (connectionMode === 'cli') {
                saveConnectionPreference({ lastMode: 'cli' });
                connectionPreference.cli.autoConnect = cliAutoConnectEl.checked;
                saveCliPreference({
                    verified: true,
                    preset: cliPresetEl.value,
                    model: cliModelEl.value.trim(),
                    reasoningEffort: cliReasoningEl.value,
                    ...(cliPresetEl.value === 'custom'
                        ? {
                            customModel: cliModelEl.value.trim(),
                            customReasoningEffort: cliReasoningEl.value,
                        }
                        : {}),
                });
            }
            renderInputState();
            addMessage('system', automatic
                ? `前回の${CLI_PROVIDERS[cliType].label}設定で自動接続しました。`
                : '接続、モデル応答、計算ツールの実行を確認しました。');
        } catch (error) {
            appendDiagnosticLogs(error.diagnosticLogs);
            addDiagnosticLog('error', 'ui', error.message, {
                code: error.code || 'REQUEST_FAILED', durationMs: Math.round(window.performance.now() - startedAt),
            });
            connected = false;
            if (connectionMode === 'cli') saveCliPreference({ verified: false });
            statusEl.textContent = automatic ? '自動接続失敗' : '接続失敗';
            addMessage('error', escapeHtml(error.message));
        } finally {
            setBusy(false);
        }
    }

    function maybeAutoReconnect() {
        if (autoReconnectAttempted || connected || busy || connectionMode !== 'cli') return;
        const pref = connectionPreference.cli.providers[cliType];
        if (!pref.verified || !connectionPreference.cli.autoConnect) return;
        autoReconnectAttempted = true;
        connected = true;
        sessionId = null;
        providerSessionId = null;
        statusEl.textContent = `${providerLabel(provider())} 接続復元`;
        renderInputState();
        setBusy(false);
        addDiagnosticLog('info', 'ui', '前回確認済みのCLI設定を復元しました。実際の疎通は最初の質問で確認します。', {
            model: provider().model || 'CLI setting', reasoningEffort: provider().reasoningEffort || 'CLI setting',
        });
        addMessage('system', '前回確認済みのCLI設定を復元しました。接続試験を繰り返さず、最初の質問から実行します。');
    }

    get('dim-ai-cli-connect').addEventListener('click', () => connectCurrentProvider());
    get('dim-ai-api-connect').addEventListener('click', () => connectCurrentProvider());

    const aiTabButton = document.querySelector('.tab-btn[data-target="tab-ai"]');
    aiTabButton?.addEventListener('click', () => {
        updateContext();
        Promise.resolve().then(maybeAutoReconnect);
    });

    get('dim-ai-form').addEventListener('submit', async event => {
        event.preventDefault();
        const message = inputEl.value.trim();
        if (!message || busy || !connected) return;
        updateContext();
        if (!sessionId) sessionId = `ui_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
        const startedAt = window.performance.now();
        addDiagnosticLog('info', 'ui', 'AI会話処理を開始しました。', { provider: provider().type });
        addMessage('user', escapeHtml(message));
        inputEl.value = '';
        setBusy(true, '条件を確認中…');
        try {
            const result = await postJson('/api/ai/chat', {
                provider: provider(), state: aiState(),
                message,
                sessionId, providerSessionId, scope: 'workspace',
            });
            appendDiagnosticLogs(result.diagnosticLogs);
            addDiagnosticLog('info', 'ui', 'AI会話処理が完了しました。', {
                durationMs: Math.round(window.performance.now() - startedAt), executionCount: result.executions?.length || 0,
            });
            sessionId = result.sessionId;
            providerSessionId = result.providerSessionId;
            const executions = result.executions || [];
            const serverLoggedTools = result.diagnosticLogs?.some(entry => ['mcp', 'tool'].includes(entry.source));
            if (!serverLoggedTools) appendExecutionLogs(executions);
            const diminishingRuns = executions.filter(item => item.name?.endsWith('run_diminishing_comparison') && item.output?.ok);
            const actionRuns = executions.filter(item => item.name?.endsWith('run_action_order_simulation') && item.output?.ok);
            for (const run of diminishingRuns) {
                lastComparison = run.output.result;
                addMessage('result', `${renderConditionSummary(run.output)}${renderComparison(run.output)}`);
            }
            for (const run of actionRuns) addMessage('result', renderActionTimelines(run.output));
            const warnings = renderWarnings(executions);
            if (warnings) addMessage('warning', warnings);
            const proposal = [...executions].reverse().find(item => item.output?.proposal && item.name?.includes('propose_'));
            if (proposal?.output?.proposal) {
                showProposal(proposal.output.proposal, proposal.name.includes('action_order') ? 'actionOrder' : 'diminishing');
            }
            if (result.partial?.reason === 'timeout_after_tool_success') {
                addMessage('system', 'AIの文章回答はタイムアウトしましたが、上の計算結果は取得できています。必要なら同じ条件で短い質問を続けてください。');
            }
            addMessage('assistant', `<strong>AI</strong><div class="dim-ai-markdown">${renderBasicMarkdown(result.finalText || '処理が完了しました。')}</div>`);
            statusEl.textContent = providerLabel(provider());
        } catch (error) {
            appendDiagnosticLogs(error.diagnosticLogs);
            addDiagnosticLog(error.code === 'ABORTED' ? 'warning' : 'error', 'ui', error.message, {
                code: error.code || 'REQUEST_FAILED', durationMs: Math.round(window.performance.now() - startedAt),
            });
            if (error.code === 'ABORTED') {
                statusEl.textContent = '中断しました';
                addMessage('system', 'AI処理を中断しました。');
            } else {
                statusEl.textContent = '処理失敗';
                addMessage('error', escapeHtml(error.message));
            }
        } finally {
            setBusy(false);
        }
    });

    cancelEl.addEventListener('click', async () => {
        if (!sessionId) return;
        cancelEl.disabled = true;
        statusEl.textContent = '中断中…';
        await postJson('/api/ai/cancel', { sessionId }).catch(() => {});
    });

    feedEl.addEventListener('click', async event => {
        const caseButton = event.target.closest('.dim-ai-case-propose');
        if (caseButton && lastComparison) {
            const selected = lastComparison.cases.find(item => item.label === caseButton.dataset.caseLabel);
            if (selected) showProposal({ label: selected.label, summary: `${selected.label}を現在の画面へ反映`, changes: selected.changes });
            return;
        }
        if (event.target.closest('.dim-ai-discard')) {
            pendingProposal = null;
            event.target.closest('.dim-ai-message')?.remove();
            return;
        }
        if (event.target.closest('.dim-ai-apply') && pendingProposal) {
            if (pendingProposal.scope === 'actionOrder') {
                const actionSession = createActionOrderSession(actionOrderBridge.getState());
                const actionTools = createActionOrderTools({ session: actionSession, allowApply: true, savedBuilds: () => Build.list() });
                const proposed = actionTools.execute('propose_action_order_changes', {
                    changes: pendingProposal.changes,
                    summary: pendingProposal.summary,
                });
                if (!proposed.ok) {
                    addMessage('error', escapeHtml(proposed.error?.message || '行動順の変更案を検証できませんでした。'));
                    return;
                }
                const before = actionOrderBridge.getState();
                const applied = actionTools.execute('apply_action_order_changes', {
                    proposalId: proposed.proposal.id,
                    approved: true,
                });
                if (!applied.ok) {
                    addMessage('error', escapeHtml(applied.error?.message || '行動順へ反映できませんでした。'));
                    return;
                }
                actionOrderBridge.applyState(actionSession.serialize());
                undoStack.push({ scope: 'actionOrder', before });
                if (undoStack.length > 20) undoStack.shift();
                pendingProposal = null;
                event.target.closest('.dim-ai-message')?.remove();
                updateContext();
                addMessage('system', '行動順パネルへ反映しました。必要なら「元に戻す」で取り消せます。');
                return;
            }
            const proposed = await localTools.execute('propose_diminishing_changes', {
                caseLabel: pendingProposal.caseLabel || pendingProposal.label,
                changes: pendingProposal.changes,
                summary: pendingProposal.summary,
            });
            if (!proposed.ok) {
                addMessage('error', escapeHtml(proposed.error?.message || '変更案を検証できませんでした。'));
                return;
            }
            const applied = await localTools.execute('apply_diminishing_changes', { proposalId: proposed.proposal.id, approved: true });
            if (!applied.ok) {
                addMessage('error', escapeHtml(applied.error?.message || '変更を反映できませんでした。'));
                return;
            }
            pendingProposal = null;
            undoStack.push({ scope: 'diminishing', before: applied.before });
            if (undoStack.length > 20) undoStack.shift();
            event.target.closest('.dim-ai-message')?.remove();
            onStateChange?.();
            updateContext();
            addMessage('system', '変更を反映しました。必要なら「元に戻す」で取り消せます。');
        }
    });

    undoEl.addEventListener('click', () => {
        const entry = undoStack.pop();
        if (!entry) return;
        if (entry.scope === 'actionOrder') {
            actionOrderBridge.applyState(entry.before);
        } else {
            session.restore(entry.before);
            onStateChange?.();
        }
        updateContext();
        addMessage('system', 'AI反映前の状態へ戻しました。');
    });

    selectCliType(connectionPreference.cli.type, { remember: false });
    selectConnectionMode(connectionPreference.lastMode, { remember: false });
    selectSimulationTarget(simulationTarget, { remember: false });
    updateContext();
    if (mount.closest('#tab-ai')?.classList.contains('active')) Promise.resolve().then(maybeAutoReconnect);
    return Object.freeze({ updateContext });
}
