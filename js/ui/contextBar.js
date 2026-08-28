// contextBar.js — 画面上部の「今どの条件を検証しているか」表示
//
// タブをまたいで残る情報を一か所に集約し、長い画面をスクロールしても
// 現在の作業対象・比較基準・保存状態を見失わないようにする。

const TAB_CONTEXT = Object.freeze({
    'tab-speed': {
        mode: '速度・行動回数', baseline: '入力値', status: '入力値を検証中',
        action: 'キャラビルドを開く →', actionType: 'tab', actionTarget: 'tab-build',
    },
    'tab-combat': {
        mode: '戦闘シミュ', baseline: '戦闘条件', status: '編集中',
        action: 'キャラビルドを開く →', actionType: 'tab', actionTarget: 'tab-build',
    },
    'tab-build': {
        mode: 'キャラビルド', baseline: '保存時', status: '未保存の変更',
        action: '結果を見る →', actionType: 'scroll', actionTarget: '#cb-stats',
    },
    'tab-diminishing': {
        mode: '限界効用逓減', baseline: 'スナップショット', status: '未比較',
        action: '比較結果を見る →', actionType: 'scroll', actionTarget: '#dim-result',
    },
    'tab-relics': {
        mode: '遺物', baseline: '倉庫データ', status: '編集中',
        action: 'キャラビルドを開く →', actionType: 'tab', actionTarget: 'tab-build',
    },
    'tab-ai': {
        mode: 'AIアシスタント', baseline: '現在のビルド', status: '準備中',
        action: 'キャラビルドを開く →', actionType: 'tab', actionTarget: 'tab-build',
    },
});

function getRefs() {
    return {
        bar: document.getElementById('app-context-bar'),
        character: document.getElementById('app-context-character'),
        build: document.getElementById('app-context-build'),
        mode: document.getElementById('app-context-mode'),
        baseline: document.getElementById('app-context-baseline'),
        status: document.getElementById('app-context-save-status'),
        action: document.getElementById('app-context-action'),
    };
}

export function initContextBar() {
    const refs = getRefs();
    if (!refs.bar) return null;

    const state = {
        tabId: document.querySelector('.tab-btn.active')?.getAttribute('data-target') || 'tab-speed',
        character: '未選択',
        build: '保存ビルド未選択',
        status: '',
        baseline: '',
        actionType: 'tab',
        actionTarget: 'tab-build',
        hasReceivedTabSelection: false,
    };

    const render = () => {
        const defaults = TAB_CONTEXT[state.tabId] || TAB_CONTEXT['tab-speed'];
        refs.character.textContent = state.character;
        refs.build.textContent = state.build;
        refs.mode.textContent = defaults.mode;
        refs.baseline.textContent = state.baseline || defaults.baseline;
        refs.status.textContent = state.status || defaults.status;
        refs.action.textContent = defaults.action;
        state.actionType = defaults.actionType;
        state.actionTarget = defaults.actionTarget;
    };

    const setTab = tabId => {
        if (!TAB_CONTEXT[tabId]) return;
        if (state.tabId !== tabId || !state.hasReceivedTabSelection) {
            // 状態ラベルはタブごとに意味が違うため、移動時はそのタブの初期値へ戻す。
            state.status = '';
            state.baseline = '';
        }
        state.tabId = tabId;
        state.hasReceivedTabSelection = true;
        render();
    };

    const update = detail => {
        if (!detail || typeof detail !== 'object') return;
        if (detail.character) state.character = String(detail.character);
        if (detail.build) state.build = String(detail.build);
        if (detail.status) state.status = String(detail.status);
        if (detail.baseline) state.baseline = String(detail.baseline);
        render();
    };

    const activateTab = tabId => {
        document.querySelector(`.tab-btn[data-target="${tabId}"]`)?.click();
    };

    refs.action.addEventListener('click', () => {
        if (state.actionType === 'tab') {
            activateTab(state.actionTarget);
            return;
        }
        const target = document.querySelector(state.actionTarget);
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    window.addEventListener('srsim:tab-change', event => {
        setTab(event.detail?.targetId);
    });
    window.addEventListener('srsim:context-update', event => {
        update(event.detail);
    });

    render();
    return Object.freeze({ setTab, update });
}
