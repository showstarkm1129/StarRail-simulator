(function () {
    const AUTOSAVE_ID = '_autosave';
    const tabs = new Map();

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function formatSavedAt(iso) {
        if (!iso) return '';
        const date = new Date(iso);
        if (Number.isNaN(date.getTime())) return '';
        const pad = (n) => String(n).padStart(2, '0');
        return `${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    async function readJsonResponse(response) {
        const raw = await response.text();
        if (!raw.trim()) return {};
        try { return JSON.parse(raw); }
        catch { return { error: raw }; }
    }

    async function api(tab, path, options) {
        const response = await fetch(`/api/local-save/${encodeURIComponent(tab)}${path}`, options);
        const data = await readJsonResponse(response);
        if (!response.ok) throw new Error(data.error || 'ローカルJSON操作に失敗しました。');
        return data;
    }

    function setStatus(adapter, text, isError = false) {
        if (!adapter.ui?.status) return;
        adapter.ui.status.textContent = text;
        adapter.ui.status.style.color = isError ? '#ff8787' : 'var(--text-muted)';
    }

    function currentEntryId(adapter) {
        return adapter.ui?.select?.value || adapter.activeId || AUTOSAVE_ID;
    }

    function selectedEntry(adapter) {
        const id = currentEntryId(adapter);
        return (adapter.entries || []).find(entry => entry.id === id) || null;
    }

    function fillEntrySelect(adapter) {
        if (!adapter.ui?.select) return;
        const entries = adapter.entries || [];
        adapter.ui.select.innerHTML = entries.length
            ? entries.map(entry => `<option value="${escapeHtml(entry.id)}">${escapeHtml(entry.name || entry.id)}</option>`).join('')
            : '<option value="">(保存なし)</option>';
        const wanted = adapter.activeId || AUTOSAVE_ID;
        if (entries.some(entry => entry.id === wanted)) adapter.ui.select.value = wanted;
        else if (entries.length) adapter.ui.select.value = entries[0].id;
        // select.value の代入は "change" イベントも MutationObserver の attributes 監視も
        // 発火させないため、検索UI(SmartPicker)側のボタン表示を明示的に同期する。
        adapter.ui.picker?.refresh();
    }

    async function refreshEntries(adapter) {
        const data = await api(adapter.tab, '');
        adapter.entries = Array.isArray(data.entries) ? data.entries : [];
        adapter.activeId = data.activeId || AUTOSAVE_ID;
        fillEntrySelect(adapter);
        return data;
    }

    async function saveEntry(adapter, options = {}) {
        const selectedBeforeSave = currentEntryId(adapter);
        const data = await api(adapter.tab, '', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: options.id,
                name: options.name,
                active: options.active,
                state: adapter.getState(),
            }),
        });
        adapter.entries = data.index?.entries || adapter.entries || [];
        adapter.activeId = data.index?.activeId || data.entry?.id || adapter.activeId;
        fillEntrySelect(adapter);
        if (adapter.ui?.select) {
            const nextSelection = options.select === false ? selectedBeforeSave : data.entry?.id;
            if ((adapter.entries || []).some(entry => entry.id === nextSelection)) {
                adapter.ui.select.value = nextSelection;
            }
        }
        return data;
    }

    function scheduleAutosave(adapter) {
        if (!adapter.ready || adapter.paused || adapter.autosave === false) return;
        if (adapter.autosaveTimer) clearTimeout(adapter.autosaveTimer);
        adapter.autosaveTimer = setTimeout(async () => {
            try {
                setStatus(adapter, 'ローカルJSON: 保存中...');
                await saveEntry(adapter, {
                    id: AUTOSAVE_ID,
                    name: '自動保存',
                    active: currentEntryId(adapter) === AUTOSAVE_ID,
                    select: false,
                });
                setStatus(adapter, 'ローカルJSON: 保存済み');
            } catch (error) {
                setStatus(adapter, `ローカルJSON: 保存失敗 (${error.message})`, true);
            }
        }, 400);
    }

    function createPanel(adapter) {
        const mount = typeof adapter.mount === 'string' ? document.querySelector(adapter.mount) : adapter.mount;
        if (!mount) return;
        const panel = document.createElement('div');
        panel.className = 'local-save-panel';
        panel.innerHTML = `
            <div class="local-save-head">
                <strong>${escapeHtml(adapter.label)} JSON</strong>
                <span class="local-save-status">確認中...</span>
            </div>
            <div class="local-save-row">
                <span class="local-save-label">データ選択:</span>
                <select class="local-save-select" title="呼込み・複製・削除の対象となる保存データを選ぶ。「読込」を押すまで画面には反映されない。" aria-label="対象の保存データ"></select>
                <input class="local-save-name" type="text" placeholder="新規保存の名前 (空欄=選択中を上書き)" title="ここに名前を入れて「保存」すると別名で新規保存される。空欄のまま「保存」すると、左で選択中のデータに上書きされる。">
                <button class="secondary-btn-small local-save-save" title="現在の画面の内容を保存する。名前欄が空欄なら選択中のデータに上書き、名前を入れれば新規保存。">保存</button>
                <button class="secondary-btn-small local-save-load" title="左で選択した保存データを読み込み、現在の画面の内容を置き換える。">読込</button>
                <button class="secondary-btn-small local-save-copy" title="選択中の保存データを別名でコピーして新規保存する(元データは変更されない)。">複製</button>
                <button class="secondary-btn-small local-save-delete" title="選択中の保存データを削除する(自動保存は削除できない)。">削除</button>
            </div>`;
        if (adapter.insert === 'append') mount.appendChild(panel);
        else mount.insertBefore(panel, mount.firstChild);

        adapter.ui = {
            panel,
            status: panel.querySelector('.local-save-status'),
            select: panel.querySelector('.local-save-select'),
            name: panel.querySelector('.local-save-name'),
        };

        // 既存の select はそのまま値の本体として使い、見た目だけ検索・並び替え可能な
        // 共通UI (js/ui/smartPicker.js) に差し替える。全タブで使われているのと同じ部品。
        adapter.ui.picker = window.SRSIM?.UI?.SmartPicker?.enhanceSelect(adapter.ui.select, {
            kind: 'local-save',
            placeholder: '保存名で検索',
            emptyLabel: '(保存なし)',
            noResultsText: '該当する保存データなし',
            recentKey: `srsim.recent.localSave.${adapter.tab}`,
            getOptionMeta: (option) => {
                const entry = (adapter.entries || []).find(e => e.id === option.value);
                const savedAt = formatSavedAt(entry?.updatedAt);
                return {
                    label: entry?.name || option.textContent.trim() || option.value,
                    subLabel: savedAt ? `更新: ${savedAt}` : '',
                    chips: option.value === AUTOSAVE_ID ? [{ label: '自動保存', tone: 'recent' }] : [],
                };
            },
        }) || null;

        panel.querySelector('.local-save-save').addEventListener('click', async () => {
            const name = adapter.ui.name.value.trim();
            const existing = (adapter.entries || []).find(entry => entry.name === name);
            const selected = selectedEntry(adapter);
            const id = existing?.id || (!name && selected?.id !== AUTOSAVE_ID ? selected?.id : '');
            try {
                const data = await saveEntry(adapter, { id, name: name || selected?.name || '保存データ', active: true });
                adapter.ui.name.value = '';
                setStatus(adapter, `保存しました (${data.entry.name})`);
            } catch (error) {
                setStatus(adapter, `保存失敗 (${error.message})`, true);
            }
        });

        panel.querySelector('.local-save-load').addEventListener('click', async () => {
            const id = currentEntryId(adapter);
            if (!id) return;
            try {
                const data = await api(adapter.tab, `/entry/${encodeURIComponent(id)}`);
                if (!data.exists) throw new Error('JSONが見つかりません。');
                adapter.paused = true;
                adapter.applyState(data.state);
                adapter.paused = false;
                adapter.activeId = id;
                setStatus(adapter, `読み込みました (${data.entry.name})`);
            } catch (error) {
                adapter.paused = false;
                setStatus(adapter, `読込失敗 (${error.message})`, true);
            }
        });

        panel.querySelector('.local-save-copy').addEventListener('click', async () => {
            const entry = selectedEntry(adapter);
            try {
                const data = await saveEntry(adapter, { name: `${entry?.name || adapter.label} copy`, active: true });
                setStatus(adapter, `複製しました (${data.entry.name})`);
            } catch (error) {
                setStatus(adapter, `複製失敗 (${error.message})`, true);
            }
        });

        panel.querySelector('.local-save-delete').addEventListener('click', async () => {
            const entry = selectedEntry(adapter);
            if (!entry || entry.id === AUTOSAVE_ID) {
                setStatus(adapter, '自動保存は削除できません。', true);
                return;
            }
            if (!window.confirm(`「${entry.name || entry.id}」を削除しますか？`)) return;
            try {
                await api(adapter.tab, `/entry/${encodeURIComponent(entry.id)}`, { method: 'DELETE' });
                await refreshEntries(adapter);
                setStatus(adapter, '削除しました。');
            } catch (error) {
                setStatus(adapter, `削除失敗 (${error.message})`, true);
            }
        });
    }

    async function registerTab(config) {
        const adapter = {
            ...config,
            entries: [],
            activeId: AUTOSAVE_ID,
            ready: false,
            paused: false,
            autosave: config.autosave !== false,
        };
        tabs.set(adapter.tab, adapter);
        createPanel(adapter);
        try {
            await refreshEntries(adapter);
            const autosave = await api(adapter.tab, `/entry/${AUTOSAVE_ID}`);
            if (adapter.autoload !== false && autosave.exists) {
                adapter.paused = true;
                adapter.applyState(autosave.state);
                adapter.paused = false;
                setStatus(adapter, 'ローカルJSON: 自動保存を読み込みました');
            } else {
                setStatus(adapter, 'ローカルJSON: 準備完了');
            }
            adapter.ready = true;
            if (adapter.autosave !== false && !autosave.exists) scheduleAutosave(adapter);
        } catch (error) {
            adapter.paused = false;
            setStatus(adapter, `ローカルJSON: 未接続 (${error.message})`, true);
        }
        return adapter;
    }

    window.SRSIM_LOCAL = {
        registerTab,
        markDirty(tab) {
            const adapter = tabs.get(tab);
            if (adapter) scheduleAutosave(adapter);
        },
        refresh(tab) {
            const adapter = tabs.get(tab);
            return adapter ? refreshEntries(adapter) : Promise.resolve(null);
        },
        setStatus(tab, text, isError = false) {
            const adapter = tabs.get(tab);
            if (adapter) setStatus(adapter, text, isError);
        },
    };
}());
