// 共通の検索付き選択 UI。
// 既存の <select> を値の本体として残し、見た目だけ差し替える。

const instances = new WeakMap();
let openInstance = null;

function normalizeText(value) {
    return String(value || '')
        .normalize('NFKC')
        .toLowerCase()
        .replace(/\s+/g, '');
}

function queryTokens(value) {
    return String(value || '')
        .normalize('NFKC')
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map(token => token.replace(/\s+/g, ''));
}

function readRecent(key) {
    if (!key) return [];
    try {
        const raw = JSON.parse(localStorage.getItem(key) || '[]');
        return Array.isArray(raw) ? raw.filter(Boolean).map(String) : [];
    } catch {
        return [];
    }
}

function writeRecent(key, value, limit = 8) {
    if (!key || !value) return;
    const next = [String(value), ...readRecent(key).filter(v => v !== String(value))].slice(0, limit);
    try {
        localStorage.setItem(key, JSON.stringify(next));
    } catch {
        // localStorage が使えない環境では最近使った順だけ諦める。
    }
}

function makeElement(tag, className, text = '') {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
}

// CSS 側でモバイル幅 (max-width: 640px) だけ position:fixed のボトムシートに切り替えるため、
// その場合は JS 側の座標計算をせず CSS のレイアウトに任せる。
const MOBILE_POPOVER_MAX_WIDTH = 640;
function isMobilePopoverLayout() {
    return (document.documentElement.clientWidth || window.innerWidth) <= MOBILE_POPOVER_MAX_WIDTH;
}

function remToPx(rem) {
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    return rem * rootFontSize;
}

// ポップオーバーは position:fixed でビューポート座標に直接配置する (wrapper 基準の相対値にしない)。
// wrapper 基準の left にすると、ボタンが画面右寄りの狭い列にある場合に補正で left が負値になり、
// ancestor 側に scrollable overflow が生じてページ全体に横スクロールバーが出てしまうため。
function clampPopoverHorizontal(wrapper, popover) {
    if (isMobilePopoverLayout()) return;
    const margin = 8;
    const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
    const wrapperRect = wrapper.getBoundingClientRect();
    const popoverWidth = popover.offsetWidth;
    const maxViewportLeft = Math.max(margin, viewportWidth - margin - popoverWidth);
    const desiredViewportLeft = Math.min(Math.max(wrapperRect.left, margin), maxViewportLeft);
    popover.style.left = `${desiredViewportLeft}px`;
    popover.style.right = 'auto';
}

// 下に開くと画面下端をはみ出す場合はボタンの上側に反転表示し、それでも収まらない分は
// 実際に使える高さに合わせて max-height を詰めてポップオーバー自身をスクロール可能にする。
function clampPopoverVertical(wrapper, popover) {
    if (isMobilePopoverLayout()) return;
    const margin = 8;
    const gap = remToPx(0.35);
    const viewportHeight = document.documentElement.clientHeight || window.innerHeight;
    const wrapperRect = wrapper.getBoundingClientRect();
    const naturalHeight = popover.scrollHeight;
    const spaceBelow = Math.max(0, viewportHeight - wrapperRect.bottom - gap - margin);
    const spaceAbove = Math.max(0, wrapperRect.top - gap - margin);
    if (naturalHeight > spaceBelow && spaceAbove > spaceBelow) {
        popover.style.top = 'auto';
        popover.style.bottom = `${viewportHeight - wrapperRect.top + gap}px`;
        popover.style.maxHeight = `${Math.max(120, spaceAbove)}px`;
    } else {
        popover.style.bottom = 'auto';
        popover.style.top = `${wrapperRect.bottom + gap}px`;
        popover.style.maxHeight = `${Math.max(120, spaceBelow)}px`;
    }
}

function clampPopover(wrapper, popover) {
    clampPopoverHorizontal(wrapper, popover);
    clampPopoverVertical(wrapper, popover);
}

function positionPopover(wrapper, popover) {
    popover.style.left = '';
    popover.style.right = '';
    popover.style.top = '';
    popover.style.bottom = '';
    popover.style.maxHeight = '';
    clampPopover(wrapper, popover);
    // ポップオーバーの表示でスクロールバーが出現/消失してレイアウトが微妙にずれることがあるため、
    // レイアウト確定後にもう一度補正する。
    requestAnimationFrame(() => clampPopover(wrapper, popover));
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, c => (
        { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]
    ));
}

function escapeAttr(value) {
    return escapeHtml(value);
}

function optionLabel(option) {
    return option?.textContent?.trim() || option?.value || '(未選択)';
}

function optionToItem(option, config) {
    const meta = config.getOptionMeta?.(option) || {};
    const label = meta.label || optionLabel(option);
    const subLabel = meta.subLabel || '';
    const aliases = Array.isArray(meta.aliases) ? meta.aliases : [];
    const searchText = [
        option.textContent,
        option.value,
        label,
        subLabel,
        meta.searchText,
        ...aliases,
    ].join(' ');

    return {
        option,
        value: option.value,
        label,
        subLabel,
        hidden: option.hidden,
        disabled: option.disabled,
        chips: Array.isArray(meta.chips) ? meta.chips.filter(Boolean) : [],
        filterValues: meta.filterValues || {},
        searchText: normalizeText(searchText),
    };
}

function activeFilters(filters) {
    return Object.entries(filters || {}).filter(([, value]) => value != null && value !== '');
}

function itemMatches(item, tokens, filters) {
    if (tokens.length && !tokens.every(token => item.searchText.includes(token))) return false;
    for (const [key, value] of activeFilters(filters)) {
        const itemValue = item.filterValues?.[key];
        if (Array.isArray(itemValue)) {
            if (!itemValue.map(String).includes(String(value))) return false;
        } else if (String(itemValue ?? '') !== String(value)) {
            return false;
        }
    }
    return true;
}

class SmartPicker {
    constructor(select, config) {
        this.select = select;
        this.config = config || {};
        this.items = [];
        this.filteredItems = [];
        this.filters = {};
        this.activeIndex = -1;
        this.isOpen = false;

        this.wrapper = makeElement('div', 'sr-picker');
        this.wrapper.dataset.kind = this.config.kind || 'generic';

        this.button = makeElement('button', 'sr-picker-button');
        this.button.type = 'button';
        this.button.setAttribute('aria-haspopup', 'listbox');
        this.button.setAttribute('aria-expanded', 'false');
        this.button.innerHTML = `
            <span class="sr-picker-button-main"></span>
            <span class="sr-picker-button-sub"></span>
        `;

        this.popover = makeElement('div', 'sr-picker-popover');
        this.popover.hidden = true;
        this.popover.innerHTML = `
            <div class="sr-picker-search-row">
                <input class="sr-picker-search" type="search" autocomplete="off">
            </div>
            <div class="sr-picker-filters"></div>
            <div class="sr-picker-count"></div>
            <div class="sr-picker-results" role="listbox"></div>
        `;

        this.input = this.popover.querySelector('.sr-picker-search');
        this.filterWrap = this.popover.querySelector('.sr-picker-filters');
        this.countEl = this.popover.querySelector('.sr-picker-count');
        this.resultsEl = this.popover.querySelector('.sr-picker-results');

        this.wrapper.append(this.button, this.popover);
        this.select.classList.add('sr-picker-source');
        this.select.insertAdjacentElement('afterend', this.wrapper);

        this.bind();
        this.observe();
        this.refresh();
    }

    setConfig(config) {
        this.config = config || {};
        this.wrapper.dataset.kind = this.config.kind || 'generic';
        this.refresh();
    }

    bind() {
        this.wrapper.addEventListener('click', e => {
            e.stopPropagation();
        });
        this.button.addEventListener('click', () => {
            if (this.isOpen) this.close();
            else this.open();
        });
        this.button.addEventListener('keydown', e => {
            if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.open();
            }
        });
        this.input.addEventListener('input', () => {
            this.activeIndex = -1;
            this.renderResults();
        });
        this.input.addEventListener('keydown', e => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.moveActive(1);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.moveActive(-1);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                this.chooseActive();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                this.close(true);
            }
        });
        this.filterWrap.addEventListener('click', e => {
            const btn = e.target.closest('.sr-picker-filter');
            if (!btn) return;
            const key = btn.dataset.filterKey;
            const value = btn.dataset.filterValue;
            this.filters[key] = this.filters[key] === value ? '' : value;
            this.activeIndex = -1;
            this.renderFilters();
            this.renderResults();
            this.input.focus();
        });
        this.resultsEl.addEventListener('click', e => {
            const btn = e.target.closest('.sr-picker-option');
            if (!btn || btn.disabled) return;
            const item = this.filteredItems[Number(btn.dataset.index)];
            if (item) this.choose(item);
        });
        this.select.addEventListener('change', () => this.refresh());
    }

    observe() {
        const Observer = window.MutationObserver;
        if (!Observer) return;
        this.observer = new Observer(() => this.refresh());
        this.observer.observe(this.select, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['disabled', 'label', 'selected'],
        });
    }

    refresh() {
        this.items = Array.from(this.select.options).map(option => optionToItem(option, this.config));
        this.button.disabled = this.select.disabled;
        this.syncButtonLabel();
        if (this.isOpen) {
            this.renderFilters();
            this.renderResults();
        }
    }

    selectedItem() {
        const selected = this.select.selectedOptions?.[0] || this.select.options?.[this.select.selectedIndex];
        if (!selected) return null;
        return optionToItem(selected, this.config);
    }

    syncButtonLabel() {
        const item = this.selectedItem();
        const main = this.button.querySelector('.sr-picker-button-main');
        const sub = this.button.querySelector('.sr-picker-button-sub');
        main.textContent = item?.label || this.config.emptyLabel || '(未選択)';
        const chipText = item?.chips?.map(chip => chip.label).filter(Boolean).join(' / ') || item?.subLabel || '';
        sub.textContent = chipText;
        sub.hidden = !chipText;
    }

    open() {
        if (openInstance && openInstance !== this) openInstance.close();
        openInstance = this;
        this.isOpen = true;
        this.wrapper.classList.add('is-open');
        this.popover.hidden = false;
        this.button.setAttribute('aria-expanded', 'true');
        this.input.value = '';
        this.input.placeholder = this.config.placeholder || '名前で検索';
        this.activeIndex = this.indexOfSelected();
        this.renderFilters();
        this.renderResults();
        positionPopover(this.wrapper, this.popover);
        requestAnimationFrame(() => this.input.focus());
    }

    close(returnFocus = false) {
        this.isOpen = false;
        this.wrapper.classList.remove('is-open');
        this.popover.hidden = true;
        this.button.setAttribute('aria-expanded', 'false');
        if (openInstance === this) openInstance = null;
        if (returnFocus) this.button.focus();
    }

    getFilters() {
        const filters = typeof this.config.filters === 'function'
            ? this.config.filters(this.select)
            : this.config.filters;
        return Array.isArray(filters) ? filters : [];
    }

    renderFilters() {
        const filters = this.getFilters();
        if (!filters.length) {
            this.filterWrap.innerHTML = '';
            this.filterWrap.hidden = true;
            return;
        }
        this.filterWrap.hidden = false;
        this.filterWrap.innerHTML = filters.map(group => {
            const buttons = (group.options || []).map(opt => {
                const active = String(this.filters[group.key] || '') === String(opt.value);
                return `
                    <button type="button"
                            class="sr-picker-filter${active ? ' is-active' : ''}"
                            data-filter-key="${escapeAttr(group.key)}"
                            data-filter-value="${escapeAttr(opt.value)}">
                        ${escapeHtml(opt.label)}
                    </button>
                `;
            }).join('');
            return `
                <div class="sr-picker-filter-group">
                    <span class="sr-picker-filter-label">${escapeHtml(group.label)}</span>
                    <span class="sr-picker-filter-options">${buttons}</span>
                </div>
            `;
        }).join('');
    }

    filtered() {
        const tokens = queryTokens(this.input.value);
        const filters = activeFilters(this.filters);
        let items = this.items.filter(item => !item.hidden && itemMatches(item, tokens, this.filters));
        const recent = readRecent(this.config.recentKey);
        if (!tokens.length && !filters.length && recent.length) {
            const rank = new Map(recent.map((value, index) => [value, index]));
            items = items.slice().sort((a, b) => {
                const ar = rank.has(a.value) ? rank.get(a.value) : Number.POSITIVE_INFINITY;
                const br = rank.has(b.value) ? rank.get(b.value) : Number.POSITIVE_INFINITY;
                return ar - br;
            });
        }
        return items;
    }

    renderResults() {
        this.filteredItems = this.filtered();
        if (this.activeIndex < 0) {
            const selectedIndex = this.filteredItems.findIndex(item => item.value === this.select.value && !item.disabled);
            this.activeIndex = selectedIndex >= 0 ? selectedIndex : this.firstEnabledIndex();
        } else if (this.activeIndex >= this.filteredItems.length || this.filteredItems[this.activeIndex]?.disabled) {
            this.activeIndex = this.firstEnabledIndex();
        }
        this.countEl.textContent = `${this.filteredItems.length}件`;
        if (!this.filteredItems.length) {
            this.resultsEl.innerHTML = `<div class="sr-picker-empty">${this.config.noResultsText || '該当なし'}</div>`;
            return;
        }
        const recent = new Set(readRecent(this.config.recentKey));
        this.resultsEl.innerHTML = this.filteredItems.map((item, index) => {
            const selected = item.value === this.select.value;
            const active = index === this.activeIndex;
            const chips = item.chips.concat(recent.has(item.value) ? [{ label: '最近', tone: 'recent' }] : []);
            return `
                <button type="button"
                        class="sr-picker-option${selected ? ' is-selected' : ''}${active ? ' is-active' : ''}"
                        role="option"
                        aria-selected="${selected ? 'true' : 'false'}"
                        data-index="${index}"
                        ${item.disabled ? 'disabled' : ''}>
                    <span class="sr-picker-option-main">
                        <span class="sr-picker-option-title">${escapeHtml(item.label)}</span>
                        ${item.subLabel ? `<span class="sr-picker-option-sub">${escapeHtml(item.subLabel)}</span>` : ''}
                    </span>
                    <span class="sr-picker-chips">
                        ${chips.map(chip => `<span class="sr-picker-chip ${chip.tone ? `tone-${escapeAttr(chip.tone)}` : ''}">${escapeHtml(chip.label)}</span>`).join('')}
                    </span>
                </button>
            `;
        }).join('');
        this.scrollActiveIntoView();
    }

    indexOfSelected() {
        const value = this.select.value;
        return this.filteredItems.findIndex(item => item.value === value);
    }

    firstEnabledIndex() {
        return this.filteredItems.findIndex(item => !item.disabled);
    }

    moveActive(delta) {
        if (!this.filteredItems.length) return;
        let next = this.activeIndex;
        for (let i = 0; i < this.filteredItems.length; i++) {
            next = (next + delta + this.filteredItems.length) % this.filteredItems.length;
            if (!this.filteredItems[next]?.disabled) {
                this.activeIndex = next;
                this.renderResults();
                return;
            }
        }
    }

    chooseActive() {
        const item = this.filteredItems[this.activeIndex] || this.filteredItems[this.firstEnabledIndex()];
        if (item && !item.disabled) this.choose(item);
    }

    choose(item) {
        this.select.value = item.value;
        writeRecent(this.config.recentKey, item.value, this.config.recentLimit || 8);
        this.select.dispatchEvent(new Event('change', { bubbles: true }));
        this.syncButtonLabel();
        this.close(true);
    }

    scrollActiveIntoView() {
        const active = this.resultsEl.querySelector('.sr-picker-option.is-active');
        active?.scrollIntoView({ block: 'nearest' });
    }
}

// SmartPicker の複数選択版。値の本体は <select multiple> のまま残し、
// ポップオーバー内はチェックボックス一覧にする (選択してもポップオーバーは閉じない)。
class SmartMultiPicker {
    constructor(select, config) {
        this.select = select;
        this.config = config || {};
        this.items = [];
        this.filteredItems = [];
        this.isOpen = false;

        this.wrapper = makeElement('div', 'sr-picker sr-picker-multi');
        this.wrapper.dataset.kind = this.config.kind || 'generic';

        this.button = makeElement('button', 'sr-picker-button');
        this.button.type = 'button';
        this.button.setAttribute('aria-haspopup', 'listbox');
        this.button.setAttribute('aria-expanded', 'false');
        this.button.innerHTML = `
            <span class="sr-picker-button-main"></span>
            <span class="sr-picker-button-sub"></span>
        `;

        this.popover = makeElement('div', 'sr-picker-popover');
        this.popover.hidden = true;
        this.popover.innerHTML = `
            <div class="sr-picker-search-row">
                <input class="sr-picker-search" type="search" autocomplete="off">
            </div>
            <div class="sr-picker-count"></div>
            <div class="sr-picker-results" role="listbox" aria-multiselectable="true"></div>
        `;

        this.input = this.popover.querySelector('.sr-picker-search');
        this.countEl = this.popover.querySelector('.sr-picker-count');
        this.resultsEl = this.popover.querySelector('.sr-picker-results');

        this.wrapper.append(this.button, this.popover);
        this.select.classList.add('sr-picker-source');
        this.select.insertAdjacentElement('afterend', this.wrapper);

        this.bind();
        this.observe();
        this.refresh();
    }

    setConfig(config) {
        this.config = config || {};
        this.wrapper.dataset.kind = this.config.kind || 'generic';
        this.refresh();
    }

    bind() {
        this.wrapper.addEventListener('click', e => e.stopPropagation());
        this.button.addEventListener('click', () => {
            if (this.isOpen) this.close();
            else this.open();
        });
        this.button.addEventListener('keydown', e => {
            if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.open();
            }
        });
        this.input.addEventListener('input', () => this.renderResults());
        this.input.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                e.preventDefault();
                this.close(true);
            }
        });
        this.resultsEl.addEventListener('change', e => {
            const checkbox = e.target.closest('input[type="checkbox"]');
            if (!checkbox) return;
            const item = this.filteredItems[Number(checkbox.dataset.index)];
            if (!item) return;
            item.option.selected = checkbox.checked;
            this.select.dispatchEvent(new Event('change', { bubbles: true }));
        });
        this.select.addEventListener('change', () => this.refresh());
    }

    observe() {
        const Observer = window.MutationObserver;
        if (!Observer) return;
        this.observer = new Observer(() => this.refresh());
        this.observer.observe(this.select, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['disabled', 'label', 'selected'],
        });
    }

    refresh() {
        this.items = Array.from(this.select.options).map(option => optionToItem(option, this.config));
        this.button.disabled = this.select.disabled;
        this.syncButtonLabel();
        if (this.isOpen) this.renderResults();
    }

    selectedItems() {
        return this.items.filter(item => item.option.selected);
    }

    syncButtonLabel() {
        const selected = this.selectedItems();
        const main = this.button.querySelector('.sr-picker-button-main');
        const sub = this.button.querySelector('.sr-picker-button-sub');
        if (!selected.length) {
            main.textContent = this.config.emptyLabel || '(未選択)';
            sub.hidden = true;
            sub.textContent = '';
        } else if (selected.length <= 2) {
            main.textContent = selected.map(item => item.label).join(' / ');
            sub.hidden = true;
            sub.textContent = '';
        } else {
            main.textContent = `${selected.length}件選択中`;
            sub.hidden = false;
            sub.textContent = selected.map(item => item.label).join(' / ');
        }
    }

    open() {
        if (openInstance && openInstance !== this) openInstance.close();
        openInstance = this;
        this.isOpen = true;
        this.wrapper.classList.add('is-open');
        this.popover.hidden = false;
        this.button.setAttribute('aria-expanded', 'true');
        this.input.value = '';
        this.input.placeholder = this.config.placeholder || '検索';
        this.renderResults();
        positionPopover(this.wrapper, this.popover);
        requestAnimationFrame(() => this.input.focus());
    }

    close(returnFocus = false) {
        this.isOpen = false;
        this.wrapper.classList.remove('is-open');
        this.popover.hidden = true;
        this.button.setAttribute('aria-expanded', 'false');
        if (openInstance === this) openInstance = null;
        if (returnFocus) this.button.focus();
    }

    filtered() {
        const tokens = queryTokens(this.input.value);
        if (!tokens.length) return this.items;
        return this.items.filter(item => tokens.every(token => item.searchText.includes(token)));
    }

    renderResults() {
        this.filteredItems = this.filtered();
        this.countEl.textContent = `${this.filteredItems.length}件`;
        if (!this.filteredItems.length) {
            this.resultsEl.innerHTML = `<div class="sr-picker-empty">${this.config.noResultsText || '該当なし'}</div>`;
            return;
        }
        this.resultsEl.innerHTML = this.filteredItems.map((item, index) => `
            <label class="sr-picker-option sr-picker-option-multi${item.option.selected ? ' is-selected' : ''}${item.disabled ? ' is-disabled' : ''}">
                <input type="checkbox" data-index="${index}" ${item.option.selected ? 'checked' : ''} ${item.disabled ? 'disabled' : ''}>
                <span class="sr-picker-option-main">
                    <span class="sr-picker-option-title">${escapeHtml(item.label)}</span>
                    ${item.subLabel ? `<span class="sr-picker-option-sub">${escapeHtml(item.subLabel)}</span>` : ''}
                </span>
                <span class="sr-picker-chips">
                    ${item.chips.map(chip => `<span class="sr-picker-chip ${chip.tone ? `tone-${escapeAttr(chip.tone)}` : ''}">${escapeHtml(chip.label)}</span>`).join('')}
                </span>
            </label>
        `).join('');
    }
}

export function enhanceSelect(select, config = {}) {
    if (!select) return null;
    const current = instances.get(select);
    if (current) {
        current.setConfig(config);
        return current;
    }
    const instance = new SmartPicker(select, config);
    instances.set(select, instance);
    return instance;
}

export function enhanceMultiSelect(select, config = {}) {
    if (!select) return null;
    const current = instances.get(select);
    if (current) {
        current.setConfig(config);
        return current;
    }
    const instance = new SmartMultiPicker(select, config);
    instances.set(select, instance);
    return instance;
}

export function refreshSmartPickers(root = document) {
    root?.querySelectorAll?.('select.sr-picker-source').forEach(select => {
        instances.get(select)?.refresh();
    });
}

document.addEventListener('click', e => {
    if (!openInstance) return;
    if (openInstance.wrapper.contains(e.target)) return;
    openInstance.close();
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && openInstance) openInstance.close(true);
});

// position:fixed のポップオーバーはページスクロールに追従してボタンの位置とズレるため、
// ポップオーバー内部のスクロール (結果一覧など) を除きスクロールが起きたら閉じる。
document.addEventListener('scroll', e => {
    if (!openInstance) return;
    if (openInstance.popover.contains(e.target)) return;
    openInstance.close();
}, true);
