// candidateChips.js — 差し替え候補チップの共通描画コンポーネント
//
// 「現在の値と入れ替えた場合の火力貢献率」を横並びのチップとして表示し、
// クリックで即座に切り替えられるようにする汎用 UI パーツ。
// 候補の生成・貢献率の計算は呼び出し側 (Diminishing.rankCandidates 等) が行い、
// このモジュールは表示とクリックのバインドだけを担当する (キャラビルドタブ・限界効用逓減タブ共通)。

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
    })[char]);
}

function deltaClass(value) {
    if (value === null || value === undefined) return 'cb-muted';
    return value > 0 ? 'is-up' : value < 0 ? 'is-down' : 'cb-muted';
}

function formatContribution(value) {
    if (value === null || value === undefined) return '—';
    const sign = value > 0 ? '+' : '';
    return `${sign}${(value * 100).toFixed(2)}%`;
}

/**
 * @typedef {Object} CandidateChipItem
 * @property {boolean} [hideDelta]  火力差分欄を表示しない
 * @property {string} id            候補を一意に識別する文字列 (data 属性に埋め込む)
 * @property {string} label         チップに表示するラベル
 * @property {number|null} contribution  Diminishing.compareStats 由来の火力貢献率 (null = 計算不可)
 * @property {boolean} [current]    現在選択中の値なら true (クリック不可・ハイライト表示)
 * @property {boolean} [removable]  候補リストからの削除ボタンを出すか
 */

/** @param {CandidateChipItem[]} items */
export function renderCandidateChips(items) {
    if (!items || items.length === 0) {
        return '<span class="cb-muted cand-chip-empty">候補がありません。</span>';
    }
    return `<div class="cand-chip-row">${items.map(item => `
        <span class="cand-chip${item.current ? ' is-current' : ''}">
            <button type="button" class="cand-chip-main" data-cand-id="${escapeHtml(item.id)}" ${item.current ? 'disabled' : ''}>
                <span class="cand-chip-label">${escapeHtml(item.label)}</span>
                ${item.hideDelta ? '' : `<span class="cand-chip-delta ${deltaClass(item.contribution)}" title="共通ダメージだけを使った目安です。通常攻撃・スキル・必殺技・追撃ごとの違いは含みません。">${formatContribution(item.contribution)}</span>`}
            </button>
            ${item.removable ? `<button type="button" class="cand-chip-remove" data-cand-remove="${escapeHtml(item.id)}" title="候補から削除">×</button>` : ''}
        </span>
    `).join('')}</div>`;
}

/**
 * container 内の候補チップにクリックイベントを結びつける。
 * @param {ParentNode} container
 * @param {{ onSelect?: (id: string) => void, onRemove?: (id: string) => void }} handlers
 */
export function bindCandidateChips(container, { onSelect, onRemove } = {}) {
    container?.querySelectorAll('.cand-chip-main[data-cand-id]').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.disabled) return;
            onSelect?.(btn.getAttribute('data-cand-id'));
        });
    });
    container?.querySelectorAll('.cand-chip-remove[data-cand-remove]').forEach(btn => {
        btn.addEventListener('click', event => {
            event.stopPropagation();
            onRemove?.(btn.getAttribute('data-cand-remove'));
        });
    });
}
