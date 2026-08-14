document.addEventListener('DOMContentLoaded', () => {

    // --- UI: サブタブの切り替え ---
    const subTabBtns = document.querySelectorAll('.sub-tab-btn');
    const subTabPanes = document.querySelectorAll('.sub-tab-pane');

    subTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            subTabBtns.forEach(b => b.classList.remove('active'));
            subTabPanes.forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-sub-target');
            document.getElementById(targetId).classList.add('active');
            
            // 表示されたタブに応じて再計算
            if (targetId === 'sub-speed-basic') {
                calculateBasic();
            } else if (targetId === 'sub-speed-threshold') {
                renderThresholdTable();
            } else if (targetId === 'sub-speed-advanced') {
                renderAllAdvPanels();
                scheduleAdvScrollButtonUpdate();
            } else if (targetId === 'sub-speed-aha') {
                renderAhaSpeed();
            }
        });
    });

    // --- Sub Tab 1: 基本計算 ---
    const speedInput = document.getElementById('speed-input');
    const avResult = document.getElementById('base-av');
    const cycleTbody = document.getElementById('cycle-tbody');
    
    // モード選択とカスタム設定
    const modeSelect = document.getElementById('mode-select');
    const customSettings = document.getElementById('custom-settings');
    const customType = document.getElementById('custom-type');
    const customRoundInputs = document.getElementById('custom-round-inputs');
    const customAvInputs = document.getElementById('custom-av-inputs');
    
    const customFirst = document.getElementById('custom-first');
    const customNext = document.getElementById('custom-next');
    const customMax = document.getElementById('custom-max');
    const customTotal = document.getElementById('custom-total');

    const tableTitle = document.getElementById('table-title');
    const tableHelp = document.getElementById('table-help');
    const tableHeader = document.getElementById('table-header');

    // UIの表示切り替え
    const updateUI = () => {
        if (modeSelect.value === 'custom') {
            customSettings.style.display = 'flex';
            if (customType.value === 'round') {
                customRoundInputs.style.display = 'flex';
                customAvInputs.style.display = 'none';
            } else {
                customRoundInputs.style.display = 'none';
                customAvInputs.style.display = 'flex';
            }
        } else {
            customSettings.style.display = 'none';
        }
        calculateBasic();
    };

    modeSelect.addEventListener('change', updateUI);
    customType.addEventListener('change', updateUI);
    
    [speedInput, customFirst, customNext, customMax, customTotal].forEach(el => {
        el.addEventListener('input', calculateBasic);
    });

    function calculateBasic() {
        const speed = parseFloat(speedInput.value);
        if (isNaN(speed) || speed <= 0) {
            avResult.textContent = '---';
            cycleTbody.innerHTML = '';
            return;
        }

        const baseAV = 10000 / speed;
        avResult.textContent = baseAV.toFixed(2);

        generateBasicTable(baseAV, speed);
    }

    function generateBasicTable(baseAV, speed) {
        cycleTbody.innerHTML = '';
        const mode = modeSelect.value;
        
        let isRoundBased = true;
        let firstAV = 150, nextAV = 100, maxR = 5, totalAVTarget = 650;

        // モード別の設定値
        if (mode === 'moc') {
            firstAV = 150; nextAV = 100; maxR = 5;
            tableTitle.textContent = 'ラウンドごとの行動回数 (忘却の庭)';
            tableHelp.textContent = '※ 0R: 行動値150, 以降: 行動値100';
        } else if (mode === 'pf') {
            firstAV = 150; nextAV = 100; maxR = 4;
            tableTitle.textContent = 'ラウンドごとの行動回数 (虚構叙事)';
            tableHelp.textContent = '※ 0R: 行動値150, 以降: 行動値100';
        } else if (mode === 'as') {
            isRoundBased = false; totalAVTarget = 650;
            tableTitle.textContent = '到達行動値と行動回数 (末日の幻影)';
            tableHelp.textContent = '※ 行動値650で★3クリアライン';
        } else if (mode === 'ar') {
            firstAV = 300; nextAV = 100; maxR = 6;
            tableTitle.textContent = 'ラウンドごとの行動回数 (異相の仲裁)';
            tableHelp.textContent = '※ 0R: 行動値300, 以降: 行動値100';
        } else if (mode === 'custom') {
            isRoundBased = customType.value === 'round';
            firstAV = parseFloat(customFirst.value) || 0;
            nextAV = parseFloat(customNext.value) || 0;
            maxR = parseInt(customMax.value) || 0;
            totalAVTarget = parseFloat(customTotal.value) || 1;
            
            tableTitle.textContent = isRoundBased ? 'ラウンドごとの行動回数 (自由設定)' : '到達行動値と行動回数 (自由設定)';
            tableHelp.textContent = isRoundBased 
                ? `※ 0R: 行動値${firstAV}, 以降: 行動値${nextAV}`
                : `※ 目標行動値: ${totalAVTarget}`;
        }

        if (isRoundBased) {
            tableHeader.innerHTML = '<th>ラウンド数</th><th>累積行動値</th><th>行動回数</th><th>+1回行動の目標速度</th>';
            let totalAVLimit = 0;
            let cumulativeActions = 0;

            for (let cycle = 0; cycle <= maxR; cycle++) {
                totalAVLimit += (cycle === 0) ? firstAV : nextAV;
                
                const actions = Math.floor(totalAVLimit / baseAV);
                const cycleActions = actions - cumulativeActions;
                cumulativeActions = actions;

                const targetSpeedRaw = ((actions + 1) * 10000) / totalAVLimit;
                const targetSpeed = Math.ceil(targetSpeedRaw * 10) / 10;
                const neededSpeed = (targetSpeed - speed).toFixed(1);

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${cycle}ラウンド</td>
                    <td>${totalAVLimit}</td>
                    <td>${cycleActions} 回 (累計: ${cumulativeActions}回)</td>
                    <td style="color: var(--text-muted); font-size: 0.9em;">
                        <strong>${targetSpeed.toFixed(1)}</strong> <span style="color: #ff6b6b; margin-left: 0.5rem;">(+${neededSpeed})</span>
                    </td>
                `;
                
                if (cycleActions >= 2) {
                    tr.style.color = 'var(--accent-gold)';
                    tr.style.fontWeight = 'bold';
                }
                
                cycleTbody.appendChild(tr);
            }
        } else {
            tableHeader.innerHTML = '<th>到達行動値</th><th>行動回数</th><th>余裕 (AV)</th><th>+1回行動の目標速度</th>';
            
            const steps = [];
            for (let av = 100; av <= totalAVTarget; av += 100) {
                steps.push(av);
            }
            if (steps.length === 0 || steps[steps.length - 1] !== totalAVTarget) {
                steps.push(totalAVTarget);
            }

            for (const stepAV of steps) {
                const actions = Math.floor(stepAV / baseAV);
                const remainingAV = (stepAV - actions * baseAV).toFixed(2);
                
                const targetSpeedRaw = ((actions + 1) * 10000) / stepAV;
                const targetSpeed = Math.ceil(targetSpeedRaw * 10) / 10;
                const neededSpeed = (targetSpeed - speed).toFixed(1);

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${stepAV}</td>
                    <td>${actions} 回</td>
                    <td>+${remainingAV}</td>
                    <td style="color: var(--text-muted); font-size: 0.9em;">
                        <strong>${targetSpeed.toFixed(1)}</strong> <span style="color: #ff6b6b; margin-left: 0.5rem;">(+${neededSpeed})</span>
                    </td>
                `;
                
                if (stepAV === totalAVTarget) {
                    tr.style.color = 'var(--accent-gold)';
                    tr.style.fontWeight = 'bold';
                    tr.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
                }
                
                cycleTbody.appendChild(tr);
            }
        }
    }

    // --- Sub Tab 2: 速度閾値表 ---
    const thresholdSpeedInput = document.getElementById('threshold-speed-input');
    const thresholdTbody = document.getElementById('threshold-tbody');
    
    thresholdSpeedInput.addEventListener('input', renderThresholdTable);

    const thresholdContentMap = {
        100: '基本的な1ラウンドの闘値',
        150: '裏庭/虚構0R目',
        250: '裏庭2R',
        300: '異相0R目',
        450: '虚構4R(全ラウンド)',
        500: '異相2R(★3)',
        550: '裏庭5R(★3)',
        700: '末日★3/異相4R(★2)',
        900: '異相6R(★1)'
    };

    function renderThresholdTable() {
        if (!thresholdTbody) return;
        thresholdTbody.innerHTML = '';
        const speed = parseFloat(thresholdSpeedInput.value) || 0;

        for (let av = 50; av <= 1000; av += 50) {
            const content = thresholdContentMap[av] || '-';
            const actions = (speed * av / 10000).toFixed(1);
            
            // おすすめ速度の計算
            const reqSpeedPerAction = (10000 / av);
            
            // 100より大きい速度になる最初の行動回数を見つける (100ぴったりの場合はスキップ)
            let startCount = 1;
            while ((startCount * reqSpeedPerAction) <= 100 && startCount < 20) {
                startCount++;
            }
            
            const recSpeeds = [];
            for (let i = 0; i < 5; i++) {
                recSpeeds.push(Math.ceil((startCount + i) * reqSpeedPerAction));
            }
            
            let increaseText = `${(Math.floor(reqSpeedPerAction * 10) / 10).toFixed(1)}毎に+1回`;
            if (reqSpeedPerAction === 100) {
                increaseText = `100毎に+1回`;
            }

            // おすすめ速度をバッジ風に表示
            let recHtml = '';
            // AV50などの場合、現実的ではないため少し調整するのもありだが、そのまま表示する
            recHtml = recSpeeds.map(s => `<span style="display: inline-block; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; padding: 2px 6px; color: var(--accent-gold); font-weight: bold;">${s}</span>`).join('');

            const tr = document.createElement('tr');
            
            if (thresholdContentMap[av]) {
                tr.style.backgroundColor = 'rgba(212, 175, 55, 0.05)'; // 少しハイライト
            }

            tr.innerHTML = `
                <td>${content}</td>
                <td>${av}</td>
                <td style="font-weight: bold; color: var(--accent-gold);">${actions}</td>
                <td style="font-size: 0.9em; color: var(--text-muted);">${increaseText}</td>
                <td style="font-size: 0.85em; display: flex; flex-wrap: wrap; gap: 4px;">${recHtml}</td>
            `;
            thresholdTbody.appendChild(tr);
        }
    }

    // --- Sub Tab 3: 行動順シミュ (複数パネル比較) ---
    // 各パネルは独立したタイムライン。バフは「ターン開始からの行動値オフセット(発動AV)」で
    // 発動タイミングを指定でき、ターン内ゲージ計算で正確に反映する。
    const advPanelsWrap = document.querySelector('.adv-panels-wrap');
    const advPanelsContainer = document.getElementById('adv-panels');
    const advAddPanelBtn = document.getElementById('adv-add-panel');
    const advCopyStateBtn = document.getElementById('adv-copy-state');
    const advImportStateBtn = document.getElementById('adv-import-state');
    const advLoadLocalStateBtn = document.getElementById('adv-load-local-state');
    const advCopyLocalPathBtn = document.getElementById('adv-copy-local-path');
    const advScrollLeftBtn = document.getElementById('adv-scroll-left');
    const advScrollRightBtn = document.getElementById('adv-scroll-right');
    const advPanelPrevBtn = document.getElementById('adv-panel-prev');
    const advPanelNextBtn = document.getElementById('adv-panel-next');

    // 共有モーダル要素
    const buffModal = document.getElementById('adv-buff-modal');
    const closeBuffModal = document.getElementById('close-adv-buff-modal');
    const buffModalPanelLabel = document.getElementById('adv-buff-modal-panel');
    const buffModalTurn = document.getElementById('adv-buff-modal-turn');
    const buffModalApply = document.getElementById('adv-buff-modal-apply');
    const buffEventList = document.getElementById('adv-buff-event-list');
    const buffAddEventBtn = document.getElementById('adv-buff-add-event');
    const stateModal = document.getElementById('adv-state-modal');
    const closeStateModal = document.getElementById('close-adv-state-modal');
    const stateInput = document.getElementById('adv-state-input');
    const stateMessage = document.getElementById('adv-state-message');
    const stateCopyFromModalBtn = document.getElementById('adv-state-copy-from-modal');
    const stateApplyBtn = document.getElementById('adv-state-apply');
    // 計算・正規化は build/actionOrder.js (DOM非依存) に集約。
    // 行動順タブと AI ツールが同じ計算を共有するため、ここでは参照するだけにする。
    const ActionOrder = window.SRSIM && window.SRSIM.ActionOrder;
    // バフイベントの種類定義 (ラベル・既定値はモジュール側で一元管理)
    const EVENT_TYPES = ActionOrder ? ActionOrder.EVENT_TYPES : {};
    const ADV_STATE_SCHEMA = ActionOrder ? ActionOrder.ACTION_ORDER_STATE_SCHEMA : 'srsim.speedAdvanced.v1';
    const ADV_LOCAL_STATE_ENDPOINT = '/api/local-save/action-order/entry/_autosave';
    const advPanels = [];   // パネル状態の配列
    let advPanelSeq = 0;  // パネル連番 (名前デフォルト用)
    let advScrollUpdateScheduled = false;
    let advLocalSyncEnabled = false;
    let advLocalSyncPaused = false;
    let advLocalStatePath = 'local/action-order-state.json';
    let advLocalWriteTimer = null;
    let advLocalWriteInFlight = false;
    let advLocalWritePending = false;

    // モーダルの編集対象
    let modalPanelId = null;
    let modalTurnIndex = -1;
    let modalEvents = []; // 編集中イベントの作業コピー (適用するまで反映しない)

    function escapeAttr(s) {
        return String(s)
            .replace(/&/g, '&amp;').replace(/"/g, '&quot;')
            .replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // モーダルを body 直下へ (絶対配置のため)
    if (buffModal && buffModal.parentElement !== document.body) {
        document.body.appendChild(buffModal);
    }

    // --- Sub Tab 4: アッハ速度計算器 ---
    const ahaSpeedInputs = Array.from(document.querySelectorAll('.aha-character-speed'));
    const ahaSpeedResult = document.getElementById('aha-speed-result');
    const ahaAvResult = document.getElementById('aha-av-result');
    const ahaFormulaDetail = document.getElementById('aha-formula-detail');
    const ahaRankingTbody = document.getElementById('aha-ranking-tbody');

    function renderAhaSpeed() {
        if (!ahaSpeedResult || !ahaAvResult || !ahaFormulaDetail || !ahaRankingTbody) return;

        const calculator = window.SRSIM && window.SRSIM.AhaSpeed;
        if (!calculator) {
            ahaSpeedResult.textContent = '---';
            ahaAvResult.textContent = '---';
            ahaFormulaDetail.textContent = '計算機能を読み込めませんでした。';
            ahaRankingTbody.innerHTML = '';
            return;
        }

        const result = calculator.computeAhaSpeed(ahaSpeedInputs.map(input => input.value));
        ahaSpeedResult.textContent = result.speed.toFixed(3);
        ahaAvResult.textContent = result.actionValue.toFixed(2);
        ahaFormulaDetail.textContent = `${result.baseSpeed} + ${result.ranked
            .map(entry => `${entry.speed.toFixed(1)}×${entry.weight}`)
            .join(' + ')} = ${result.speed.toFixed(3)}`;

        ahaRankingTbody.innerHTML = '';
        result.ranked.forEach((entry) => {
            const row = document.createElement('tr');
            const values = [
                `${entry.rankIndex + 1}位`,
                `愉悦キャラ ${entry.slotIndex + 1}`,
                entry.speed.toFixed(1),
                `×${entry.weight}`,
                `+${entry.contribution.toFixed(3)}`,
            ];
            values.forEach((value) => {
                const cell = document.createElement('td');
                cell.textContent = value;
                row.appendChild(cell);
            });
            ahaRankingTbody.appendChild(row);
        });
    }

    ahaSpeedInputs.forEach(input => input.addEventListener('input', renderAhaSpeed));
    if (stateModal && stateModal.parentElement !== document.body) {
        document.body.appendChild(stateModal);
    }
    // ---- イベント参照ヘルパ (計算モジュールへの委譲) ----
    const evTiming = (ev) => ActionOrder.evTiming(ev);
    const evOffset = (ev) => ActionOrder.evOffset(ev);
    const evAtAV = (ev) => ActionOrder.evAtAV(ev);
    const evRefPanel = (ev) => ActionOrder.evRefPanel(ev);
    const evRefTurn = (ev) => ActionOrder.evRefTurn(ev);
    const evAutoLabel = (ev) => ActionOrder.evAutoLabel(ev);
    const evLabel = (ev) => ActionOrder.evLabel(ev);

    // テーブルセル用の効果チップ1個分
    function renderSummaryChip(ev, kind, notFired) {
        let suffix;
        if (kind === 'cum') suffix = `@累計${evAtAV(ev)}`;
        else if (kind === 'panel') suffix = `@P${evRefPanel(ev) + 1}-T${evRefTurn(ev)}`;
        else suffix = `@${evOffset(ev)}AV`;
        let style;
        if (notFired) style = 'color:#ff6b6b; text-decoration:line-through; opacity:0.85;';
        else if (kind === 'cum') style = 'color:#ffd479;'; // 累計AV発動は金色で区別
        else if (kind === 'panel') style = 'color:#c9a8ff;'; // 他パネル参照発動は紫で区別
        else style = 'color:#a8d5ff;';
        const title = notFired ? ' title="行動が発動AVより先に完了したため不発"' : '';
        return `<span style="font-size:0.82em; font-weight:bold; ${style}"${title}>${escapeAttr(evLabel(ev))}${suffix}${notFired ? '(不発)' : ''}</span>`;
    }

    // ---- タイムライン計算 (テーブル描画とテキスト共有で共通利用) ----
    // 計算本体は build/actionOrder.js。パネル参照バフ (他パネルの指定ターン到達AVに追従) は
    // パネル間の依存関係を解決する必要があるため、常に全パネル分をまとめて計算する。
    function computePanelTimeline(panel) {
        const idx = advPanels.indexOf(panel);
        if (idx === -1) return ActionOrder.computeTimeline(panel);
        return ActionOrder.computeAllTimelines(advPanels)[idx];
    }

    function renderPanelTable(panel) {
        const tbody = panel.el && panel.el.tbody;
        if (!tbody) return;
        tbody.innerHTML = '';

        const { threshold, rows } = computePanelTimeline(panel);

        rows.forEach((r) => {
            const summary = r.chips.length
                ? r.chips.map(c => renderSummaryChip(c.ev, c.kind, c.notFired)).join(' ')
                : '<span style="color:var(--text-muted)">-</span>';
            const speedText = r.speedChanged
                ? `${r.sim.startSpeed.toFixed(1)}→${r.sim.endSpeed.toFixed(1)}`
                : r.sim.startSpeed.toFixed(1);

            if (r.drawWallBefore) {
                const wallTr = document.createElement('tr');
                wallTr.innerHTML = `
                    <td colspan="5" style="padding:0;">
                        <div style="height:6px; background: repeating-linear-gradient(45deg, #ff4757, #ff4757 10px, transparent 10px, transparent 20px); margin:5px 0; opacity:0.8;"></div>
                        <div style="text-align:center; color:#ff4757; font-size:0.8em; font-weight:bold; margin-bottom:5px; opacity:0.9;">↑ 目標閾値 (${threshold}) 到達 ↓</div>
                    </td>
                `;
                tbody.appendChild(wallTr);
            }

            // そのターン自身に設定されたバフがある場合のみ削除(✕)ボタンを表示
            const hasOwnEvents = ((panel.turns[r.turn - 1] || {}).events || []).length > 0;
            const delBtn = hasOwnEvents
                ? `<button class="secondary-btn-small adv-turn-clear" data-turn="${r.turn - 1}" title="このターンのバフを削除" style="padding:2px 7px; font-size:0.8em; color:#ff8787; margin-left:auto;">✕</button>`
                : '';

            const tr = document.createElement('tr');
            if (r.pastThreshold) tr.style.opacity = '0.4';
            tr.innerHTML = `
                <td>${r.turn}</td>
                <td>
                    <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                        <button class="secondary-btn-small adv-buff-setup" data-turn="${r.turn - 1}" style="padding:2px 8px; font-size:0.8em;">バフ設定</button>
                        <span style="display:flex; gap:6px; flex-wrap:wrap; max-width:44ch; word-break:break-word;">${summary}</span>
                        ${delBtn}
                    </div>
                </td>
                <td style="${r.speedChanged ? 'color:#a8d5ff; font-weight:bold;' : ''}">${speedText}</td>
                <td>${r.actualAV.toFixed(2)}</td>
                <td style="font-weight:bold; color: var(--accent-gold);">${r.cumulativeAV.toFixed(2)}</td>
            `;
            tbody.appendChild(tr);
        });

        tbody.querySelectorAll('.adv-buff-setup').forEach(btn => {
            btn.addEventListener('click', (e) => {
                openBuffModal(panel.id, parseInt(e.currentTarget.getAttribute('data-turn'), 10), e.currentTarget);
            });
        });

        // このターンのバフを削除 (その場で即削除して再描画)
        tbody.querySelectorAll('.adv-turn-clear').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const ti = parseInt(e.currentTarget.getAttribute('data-turn'), 10);
                if (panel.turns[ti]) panel.turns[ti].events = [];
                if (modalPanelId === panel.id && modalTurnIndex === ti) buffModal.style.display = 'none';
                renderAllAdvPanels(); // 他パネルのパネル参照バフが追従できるよう全パネル再計算
            });
        });

        scheduleAdvLocalStateWrite();
    }

    // タイムラインを共有用プレーンテキストに整形 (画像化はChromeのCanvas汚染で不可のため)
    function buildPanelText(panel) {
        const { threshold, rows } = computePanelTimeline(panel);
        const lines = [];
        lines.push(`【${panel.name}】`);
        lines.push(`基礎速度:${panel.baseSpeed} / 開始前速度:${panel.preSpeed} / 目標閾値:${threshold}`);
        lines.push('ターン | 効果 | 適用速度 | 実行動値 | 累計AV');
        rows.forEach((r) => {
            if (r.drawWallBefore) lines.push(`--- 目標閾値(${threshold})到達 ---`);
            const eff = r.chips.length
                ? r.chips.map(c => {
                    const suffix = c.kind === 'cum' ? `@累計${evAtAV(c.ev)}`
                        : c.kind === 'panel' ? `@P${evRefPanel(c.ev) + 1}-T${evRefTurn(c.ev)}`
                        : `@${evOffset(c.ev)}AV`;
                    return evLabel(c.ev) + suffix + (c.notFired ? '(不発)' : '');
                }).join(', ')
                : '-';
            const speedText = r.speedChanged
                ? `${r.sim.startSpeed.toFixed(1)}→${r.sim.endSpeed.toFixed(1)}`
                : r.sim.startSpeed.toFixed(1);
            lines.push(`T${r.turn} | ${eff} | ${speedText} | ${r.actualAV.toFixed(2)} | ${r.cumulativeAV.toFixed(2)}`);
        });
        return lines.join('\n');
    }

    // クリップボードへテキストをコピー (Clipboard API → 旧execCommand の順でフォールバック)
    //   非フォーカス時など Clipboard API が拒否するケースでも execCommand で救済する。
    async function copyTextToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(text);
                return;
            } catch {
                // フォーカス無し/権限拒否などは下の execCommand 経路へフォールバック
            }
        }
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.top = '-9999px';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        if (!ok) throw new Error('execCommand copy failed');
    }

    // ---- 正規化・保存形式 (計算モジュールへの委譲) ----
    const normalizeAdvTurns = (turns) => ActionOrder.normalizeTurns(turns);
    const buildAdvStatePayload = (panels, mode) => ActionOrder.buildStatePayload(panels, mode);
    const parseAdvStateText = (text) => ActionOrder.parseStateText(text);

    function buildAdvStateText(panels, mode) {
        return JSON.stringify(buildAdvStatePayload(panels, mode), null, 2);
    }

    // 行動順タブの保存状況は、上部の「行動順 JSON」パネル(js/localSave.js)のログ欄に一本化して表示する
    function setAdvLocalSyncStatus(text, isError) {
        window.SRSIM_LOCAL?.setStatus('action-order', text, isError);
    }

    function updateAdvLocalPath(data) {
        if (!data || typeof data !== 'object') return;
        advLocalStatePath = data.statePath || data.stateFile || advLocalStatePath;
    }

    async function readJsonResponse(res) {
        const raw = await res.text();
        if (!raw.trim()) return {};
        try {
            return JSON.parse(raw);
        } catch {
            return { error: raw };
        }
    }

    function scheduleAdvLocalStateWrite() {
        if (!advLocalSyncEnabled || advLocalSyncPaused) return;
        if (advLocalWriteTimer) clearTimeout(advLocalWriteTimer);
        advLocalWriteTimer = setTimeout(flushAdvLocalStateWrite, 350);
    }

    async function flushAdvLocalStateWrite() {
        if (!advLocalSyncEnabled || advLocalSyncPaused) return;
        if (advLocalWriteInFlight) {
            advLocalWritePending = true;
            return;
        }
        advLocalWriteInFlight = true;
        advLocalWritePending = false;
        setAdvLocalSyncStatus('ローカルJSON: 保存中...', false);
        try {
            const res = await fetch(ADV_LOCAL_STATE_ENDPOINT, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ state: buildAdvStatePayload(advPanels, 'all') }),
            });
            const data = await readJsonResponse(res);
            if (!res.ok) throw new Error(data.error || 'ローカルJSONへ保存できませんでした。');
            updateAdvLocalPath(data);
            setAdvLocalSyncStatus(`ローカルJSON: 保存済み (${data.stateFile || advLocalStatePath})`, false);
            window.SRSIM_LOCAL?.refresh('action-order');
        } catch (err) {
            advLocalSyncEnabled = false;
            setAdvLocalSyncStatus(`ローカルJSON: 自動保存停止 (${err.message})`, true);
        } finally {
            advLocalWriteInFlight = false;
            if (advLocalWritePending) scheduleAdvLocalStateWrite();
        }
    }

    async function loadAdvLocalState(options) {
        const isManual = Boolean(options && options.manual);
        try {
            const res = await fetch(ADV_LOCAL_STATE_ENDPOINT, { cache: 'no-store' });
            const data = await readJsonResponse(res);
            if (!res.ok) throw new Error(data.error || 'ローカルJSONを読めませんでした。');
            updateAdvLocalPath(data);

            if (!data.exists) {
                advLocalSyncEnabled = true;
                setAdvLocalSyncStatus(`ローカルJSON: 新規保存先 (${data.stateFile || advLocalStatePath})`, false);
                scheduleAdvLocalStateWrite();
                return false;
            }

            const imported = parseAdvStateText(JSON.stringify(data.state));
            advLocalSyncPaused = true;
            importAdvPanels(imported);
            advLocalSyncPaused = false;
            advLocalSyncEnabled = true;
            setAdvLocalSyncStatus(`ローカルJSON: 読込済み (${data.stateFile || advLocalStatePath})`, false);
            return true;
        } catch (err) {
            advLocalSyncPaused = false;
            advLocalSyncEnabled = false;
            const prefix = isManual ? 'ローカルJSON読込失敗' : 'ローカルJSON: 未接続';
            setAdvLocalSyncStatus(`${prefix} (${err.message})`, true);
            return false;
        }
    }

    function clearAdvPanels() {
        advPanels.forEach((panel) => {
            if (panel.el && panel.el.card) panel.el.card.remove();
        });
        advPanels.length = 0;
    }

    function importAdvPanels(imported) {
        const append = imported.mode === 'panel';
        if (!append) clearAdvPanels();
        imported.panels.forEach((panel) => createAdvPanel(panel));
        refreshPanelOrders();
        scheduleAdvScrollButtonUpdate();
    }

    function setStateMessage(text, isError) {
        if (!stateMessage) return;
        stateMessage.textContent = text;
        stateMessage.style.color = isError ? '#ff8787' : 'var(--text-muted)';
    }

    async function copyAdvState(panels, mode, button) {
        const originalText = button ? button.textContent : '';
        const text = buildAdvStateText(panels, mode);
        if (button) button.disabled = true;
        try {
            await copyTextToClipboard(text);
            if (button) button.textContent = 'コピー完了!';
            setStateMessage('コピーしました。', false);
        } catch (err) {
            console.error(err);
            openStateModal(text);
            if (button) button.textContent = '失敗';
            setStateMessage('クリップボードにコピーできませんでした。テキスト欄からコピーしてください。', true);
        }
        if (button) {
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 1500);
        }
    }

    function openStateModal(prefill) {
        if (!stateModal || !stateInput) return;
        stateInput.value = prefill || '';
        setStateMessage('', false);
        stateModal.style.display = 'block';
        stateInput.focus();
        if (prefill) stateInput.select();
    }

    function applyStateInput() {
        if (!stateInput) return;
        let imported;
        try {
            imported = parseAdvStateText(stateInput.value);
        } catch (err) {
            setStateMessage(`読み取りに失敗しました: ${err.message}`, true);
            return;
        }
        if (imported.mode !== 'panel' && advPanels.length > 0) {
            const ok = window.confirm('現在の行動順シミュのパネルを置き換えて復元しますか？');
            if (!ok) return;
        }
        importAdvPanels(imported);
        if (stateModal) stateModal.style.display = 'none';
    }

    function renderAllAdvPanels() {
        advPanels.forEach(renderPanelTable);
        scheduleAdvScrollButtonUpdate();
    }

    function getAdvMaxScroll() {
        if (!advPanelsContainer) return 0;
        return Math.max(0, advPanelsContainer.scrollWidth - advPanelsContainer.clientWidth);
    }

    function updateAdvScrollButtons() {
        if (!advPanelsContainer) return;
        const maxScroll = getAdvMaxScroll();
        const atStart = maxScroll <= 0 || advPanelsContainer.scrollLeft <= 2;
        const atEnd = maxScroll <= 0 || advPanelsContainer.scrollLeft >= maxScroll - 2;
        if (advScrollLeftBtn) advScrollLeftBtn.disabled = atStart;
        if (advScrollRightBtn) advScrollRightBtn.disabled = atEnd;
        if (advPanelPrevBtn) advPanelPrevBtn.disabled = atStart;
        if (advPanelNextBtn) advPanelNextBtn.disabled = atEnd;
    }

    function scheduleAdvScrollButtonUpdate() {
        if (!advPanelsContainer || advScrollUpdateScheduled) return;
        advScrollUpdateScheduled = true;
        requestAnimationFrame(() => {
            updateAdvScrollButtons();
            requestAnimationFrame(() => {
                updateAdvScrollButtons();
                advScrollUpdateScheduled = false;
            });
        });
        setTimeout(updateAdvScrollButtons, 80);
    }

    function clampAdvScroll(left) {
        return Math.max(0, Math.min(left, getAdvMaxScroll()));
    }

    function normalizeWheelDelta(delta, deltaMode, pageSize) {
        if (deltaMode === WheelEvent.DOM_DELTA_LINE) return delta * 16;
        if (deltaMode === WheelEvent.DOM_DELTA_PAGE) return delta * pageSize;
        return delta;
    }

    function scrollAdvPanelsBy(delta) {
        if (!advPanelsContainer || delta === 0) return false;
        const nextLeft = clampAdvScroll(advPanelsContainer.scrollLeft + delta);
        if (Math.abs(nextLeft - advPanelsContainer.scrollLeft) < 0.5) return false;
        advPanelsContainer.scrollLeft = nextLeft;
        scheduleAdvScrollButtonUpdate();
        return true;
    }

    function getAdvPanelOffsets() {
        if (!advPanelsContainer) return [];
        const containerRect = advPanelsContainer.getBoundingClientRect();
        return advPanels
            .filter(panel => panel.el && panel.el.card)
            .map(panel => {
                const rect = panel.el.card.getBoundingClientRect();
                return advPanelsContainer.scrollLeft + rect.left - containerRect.left;
            });
    }

    function scrollAdvPanelToIndex(index) {
        const offsets = getAdvPanelOffsets();
        if (offsets.length === 0) return;
        const targetIndex = Math.max(0, Math.min(index, offsets.length - 1));
        const nextLeft = clampAdvScroll(offsets[targetIndex]);
        advPanelsContainer.scrollLeft = nextLeft;
        scheduleAdvScrollButtonUpdate();
    }

    function scrollAdvPanelByStep(direction) {
        const offsets = getAdvPanelOffsets();
        if (offsets.length === 0 || direction === 0) return;
        const currentLeft = advPanelsContainer.scrollLeft;
        const EPS = 4;
        if (direction > 0) {
            const nextIndex = offsets.findIndex(left => left > currentLeft + EPS);
            scrollAdvPanelToIndex(nextIndex === -1 ? offsets.length - 1 : nextIndex);
            return;
        }
        let prevIndex = 0;
        for (let i = offsets.length - 1; i >= 0; i--) {
            if (offsets[i] < currentLeft - EPS) {
                prevIndex = i;
                break;
            }
        }
        scrollAdvPanelToIndex(prevIndex);
    }

    function isPointInRect(x, y, rect) {
        return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    }

    function handleAdvPanelJumpClick(e) {
        if (!advPanelPrevBtn || !advPanelNextBtn) return;
        const x = e.clientX;
        const y = e.clientY;
        const prevRect = advPanelPrevBtn.getBoundingClientRect();
        const nextRect = advPanelNextBtn.getBoundingClientRect();
        if (isPointInRect(x, y, prevRect)) {
            e.preventDefault();
            e.stopPropagation();
            if (!advPanelPrevBtn.disabled) scrollAdvPanelByStep(-1);
        } else if (isPointInRect(x, y, nextRect)) {
            e.preventDefault();
            e.stopPropagation();
            if (!advPanelNextBtn.disabled) scrollAdvPanelByStep(1);
        }
    }

    function buildPanelDOM(panel) {
        const card = document.createElement('div');
        card.className = 'panel';
        card.style.cssText = 'min-width: 470px; flex: 0 0 auto; padding: 1rem; margin: 0; position: relative;';
        card.innerHTML = `
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:0.8rem;">
                <span style="font-size:0.78em; color:var(--text-muted); flex:none;">No.</span>
                <input type="number" class="adv-panel-order" min="1" step="1" value="1" title="番号を変更するとその位置へ並び替えます" style="width:42px; flex:none; text-align:center; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); border-radius:4px; padding:4px 2px; color:var(--text-color); font-weight:bold;">
                <input type="text" class="adv-panel-name" value="${escapeAttr(panel.name)}" style="font-weight:bold; font-size:1.05rem; flex:1; min-width:0; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); border-radius:4px; padding:4px 8px; color:var(--text-color);">
                <button class="secondary-btn-small adv-panel-duplicate" title="このパネルを複製" style="padding:2px 10px; flex:none;">複製</button>
                <button class="secondary-btn-small adv-panel-share" title="タイムラインをテキストでコピー" style="padding:2px 10px; flex:none;">共有</button>
                <button class="secondary-btn-small adv-panel-copy-state" title="このパネルの復元用データをコピー" style="padding:2px 10px; flex:none;">データ</button>
                <button class="secondary-btn-small adv-panel-remove" title="このパネルを削除" style="padding:2px 10px; flex:none;">✕</button>
            </div>
            <div style="display:flex; gap:0.8rem; flex-wrap:wrap; align-items:flex-end; margin-bottom:1rem;">
                <div class="input-group" style="margin-bottom:0;">
                    <label>基礎速度:</label>
                    <input type="number" class="adv-base-speed" value="${panel.baseSpeed}" min="1" step="1" style="width:90px;">
                </div>
                <div class="input-group" style="margin-bottom:0;">
                    <label>開始前速度:</label>
                    <input type="number" class="adv-pre-speed" value="${panel.preSpeed}" min="1" step="0.1" style="width:90px;">
                </div>
                <div class="input-group" style="margin-bottom:0;">
                    <label>目標閾値:</label>
                    <input type="number" class="adv-threshold" value="${panel.threshold}" min="1" step="1" style="width:90px;">
                </div>
                <button class="secondary-btn-small adv-panel-clear-buffs" title="このパネルの全ターンのバフを消去" style="margin-left:auto; padding:4px 10px; color:#ff8787;">バフ全消去</button>
            </div>
            <div class="cycle-box" style="margin:0;">
                <table class="cycle-table">
                    <thead>
                        <tr>
                            <th style="width:46px;">ターン</th>
                            <th>効果</th>
                            <th style="width:96px;">適用速度</th>
                            <th style="width:70px;">実行動値</th>
                            <th style="width:78px;">累計</th>
                        </tr>
                    </thead>
                    <tbody class="adv-tbody"></tbody>
                </table>
            </div>
        `;

        panel.el = {
            card,
            orderInput: card.querySelector('.adv-panel-order'),
            nameInput: card.querySelector('.adv-panel-name'),
            baseInput: card.querySelector('.adv-base-speed'),
            preInput: card.querySelector('.adv-pre-speed'),
            thrInput: card.querySelector('.adv-threshold'),
            tbody: card.querySelector('.adv-tbody'),
        };

        panel.el.nameInput.addEventListener('input', () => {
            panel.name = panel.el.nameInput.value;
            if (modalPanelId === panel.id) buffModalPanelLabel.textContent = panel.name;
            scheduleAdvLocalStateWrite();
        });
        // 速度系の変更は他パネルのパネル参照バフの解決先AVにも影響しうるため、全パネルまとめて再計算する。
        panel.el.baseInput.addEventListener('input', () => {
            panel.baseSpeed = parseFloat(panel.el.baseInput.value) || 1;
            renderAllAdvPanels();
        });
        panel.el.preInput.addEventListener('input', () => {
            panel.preSpeed = parseFloat(panel.el.preInput.value) || 1;
            renderAllAdvPanels();
        });
        panel.el.thrInput.addEventListener('input', () => {
            panel.threshold = parseFloat(panel.el.thrInput.value) || 1;
            renderAllAdvPanels();
        });

        // No. 変更で並び替え
        panel.el.orderInput.addEventListener('change', () => {
            const cur = advPanels.findIndex(p => p.id === panel.id);
            if (cur === -1) return;
            let target = parseInt(panel.el.orderInput.value, 10);
            if (!Number.isFinite(target)) { refreshPanelOrders(); return; }
            target = Math.max(1, Math.min(advPanels.length, target)) - 1; // 0-based へ
            if (target === cur) { refreshPanelOrders(); return; }
            const [moved] = advPanels.splice(cur, 1);
            advPanels.splice(target, 0, moved);
            reorderPanelDOM();
            refreshPanelOrders();
            renderAllAdvPanels(); // パネル参照バフは位置(パネル番号)で参照先を決めるため、並び替え後は再計算が必要
        });

        const shareBtn = card.querySelector('.adv-panel-share');
        if (shareBtn) {
            shareBtn.addEventListener('click', async () => {
                const originalText = shareBtn.textContent;
                shareBtn.disabled = true;
                try {
                    await copyTextToClipboard(buildPanelText(panel));
                    shareBtn.textContent = 'コピー完了!';
                } catch (err) {
                    console.error(err);
                    shareBtn.textContent = '失敗';
                }
                setTimeout(() => {
                    shareBtn.textContent = originalText;
                    shareBtn.disabled = false;
                }, 1500);
            });
        }

        const copyStateBtn = card.querySelector('.adv-panel-copy-state');
        if (copyStateBtn) {
            copyStateBtn.addEventListener('click', () => copyAdvState([panel], 'panel', copyStateBtn));
        }

        card.querySelector('.adv-panel-duplicate').addEventListener('click', () => duplicateAdvPanel(panel.id));
        card.querySelector('.adv-panel-clear-buffs').addEventListener('click', () => {
            if (!window.confirm(`「${panel.name}」の全ターンのバフを消去しますか？`)) return;
            panel.turns.forEach(t => { t.events = []; });
            if (modalPanelId === panel.id) buffModal.style.display = 'none';
            renderAllAdvPanels();
        });
        card.querySelector('.adv-panel-remove').addEventListener('click', () => removeAdvPanel(panel.id));

        return card;
    }

    function createAdvPanel(initial) {
        advPanelSeq++;
        const panel = {
            id: 'adv-panel-' + advPanelSeq,
            name: (initial && initial.name) || `キャラ${advPanelSeq}`,
            baseSpeed: (initial && initial.baseSpeed) || 100,
            preSpeed: (initial && initial.preSpeed) || 134,
            threshold: (initial && initial.threshold) || 150,
            turns: normalizeAdvTurns(initial && initial.turns),
            el: null,
        };
        advPanels.push(panel);
        advPanelsContainer.appendChild(buildPanelDOM(panel));
        renderAllAdvPanels();
        refreshPanelOrders();
        scheduleAdvScrollButtonUpdate();
        return panel;
    }

    // パネルを複製 (状態をディープコピーして元パネルの直後へ挿入)
    function duplicateAdvPanel(id) {
        const idx = advPanels.findIndex(p => p.id === id);
        if (idx === -1) return;
        const src = advPanels[idx];
        advPanelSeq++;
        const copy = {
            id: 'adv-panel-' + advPanelSeq,
            name: src.name + ' (複製)',
            baseSpeed: src.baseSpeed,
            preSpeed: src.preSpeed,
            threshold: src.threshold,
            turns: src.turns.map(t => ({ events: (t.events || []).map(ev => ({ ...ev })) })),
            el: null,
        };
        advPanels.splice(idx + 1, 0, copy);
        const card = buildPanelDOM(copy);
        src.el.card.after(card); // 元パネルの直後へ配置
        renderAllAdvPanels(); // 挿入位置以降のパネル番号がずれるため、パネル参照バフも含めて全体を再計算
        refreshPanelOrders();
        scheduleAdvScrollButtonUpdate();
    }

    // 配列順に合わせて DOM を並び替え (appendChild は既存ノードを移動させる)
    function reorderPanelDOM() {
        advPanels.forEach(p => { if (p.el && p.el.card) advPanelsContainer.appendChild(p.el.card); });
    }

    // 各パネル左上の No. 表示を現在の並び順 (1始まり) に同期
    function refreshPanelOrders() {
        advPanels.forEach((p, i) => {
            if (p.el && p.el.orderInput) p.el.orderInput.value = String(i + 1);
        });
    }

    function removeAdvPanel(id) {
        const idx = advPanels.findIndex(p => p.id === id);
        if (idx === -1) return;
        const [removed] = advPanels.splice(idx, 1);
        if (removed.el && removed.el.card) removed.el.card.remove();
        if (modalPanelId === id) buffModal.style.display = 'none';
        if (advPanels.length === 0) createAdvPanel(); // 最低1枚は残す
        refreshPanelOrders();
        renderAllAdvPanels(); // 削除でパネル番号がずれるため、パネル参照バフも含めて全体を再計算
        scheduleAdvScrollButtonUpdate();
    }

    // ---- バフ設定モーダル (イベントリスト編集) ----
    function openBuffModal(panelId, turnIndex, anchorEl) {
        const panel = advPanels.find(p => p.id === panelId);
        if (!panel) return;
        while (panel.turns.length <= turnIndex) panel.turns.push({ events: [] });

        modalPanelId = panelId;
        modalTurnIndex = turnIndex;
        modalEvents = panel.turns[turnIndex].events.map(ev => ({ ...ev }));

        buffModalPanelLabel.textContent = panel.name;
        buffModalTurn.textContent = turnIndex + 1;
        renderModalEvents();

        // 先に表示して実寸を測り、画面内に収まるよう位置をクランプ
        buffModal.style.visibility = 'hidden';
        buffModal.style.display = 'block';
        positionBuffModal(anchorEl.getBoundingClientRect());
        buffModal.style.visibility = '';
    }

    // モーダルをアンカー(バフ設定ボタン)付近かつビューポート内に配置
    function positionBuffModal(rect) {
        const margin = 10;
        const mw = buffModal.offsetWidth;
        const mh = buffModal.offsetHeight;

        // 横: ボタン左に合わせつつ右端からはみ出さない
        let left = window.scrollX + rect.left;
        const maxLeft = window.scrollX + window.innerWidth - mw - margin;
        left = Math.max(window.scrollX + margin, Math.min(left, maxLeft));

        // 縦: 基本はボタンの下。下に収まらなければ上に出す。
        let top = window.scrollY + rect.bottom + 5;
        const minTop = window.scrollY + margin;
        const maxTop = window.scrollY + window.innerHeight - mh - margin;
        if (top > maxTop) {
            top = window.scrollY + rect.top - mh - 5; // ボタンの上に配置を試みる
        }
        // 最終的に必ずビューポート内へクランプ (アンカーが画面外でも見切れないように)
        top = Math.max(minTop, Math.min(top, Math.max(minTop, maxTop)));

        buffModal.style.left = left + 'px';
        buffModal.style.top = top + 'px';
    }

    // パネル参照バフ (timing=panel) のプレビュー: 現在の全パネル状態から解決先AVを計算する (解決不能なら null)
    //   自パネル自身を参照すると必ず循環参照になり null になる (自パネルのタイムラインは自分自身の計算結果に依存できないため)。
    function computeRefPreviewAV(ev) {
        if (!ActionOrder.computeAllTimelines || advPanels.length === 0) return null;
        const timelines = ActionOrder.computeAllTimelines(advPanels);
        const refTimeline = timelines[evRefPanel(ev)];
        const row = refTimeline && refTimeline.rows[evRefTurn(ev) - 1];
        return row ? row.cumulativeAV : null;
    }

    function refreshRefPreview(idx) {
        const span = buffEventList.querySelector(`.adv-ev-ref-preview[data-idx="${idx}"]`);
        if (!span) return;
        const av = computeRefPreviewAV(modalEvents[idx]);
        span.textContent = av === null ? '未到達/循環' : `→ ${av.toFixed(2)}AV`;
        span.style.color = av === null ? '#ff8787' : '#c9a8ff';
    }

    function renderModalEvents() {
        buffEventList.innerHTML = '';
        if (modalEvents.length === 0) {
            buffEventList.innerHTML = '<p class="help-text" style="margin:0; font-size:0.82em;">効果がありません。「クイック追加」か「＋ 効果を追加」で追加してください。</p>';
            return;
        }
        modalEvents.forEach((ev, idx) => {
            const row = document.createElement('div');
            row.style.cssText = 'border:1px solid rgba(255,255,255,0.12); border-radius:6px; padding:5px 6px; display:flex; flex-direction:column; gap:4px;';
            const typeOpts = Object.entries(EVENT_TYPES).map(([k, v]) =>
                `<option value="${k}" ${k === ev.type ? 'selected' : ''}>${v.label}</option>`).join('');
            const timing = evTiming(ev);
            const timeVal = timing === 'cum' ? evAtAV(ev) : evOffset(ev);

            let timingControls;
            if (timing === 'panel') {
                const refIdx = evRefPanel(ev);
                const refTurn = evRefTurn(ev);
                const panelOpts = advPanels.map((p, i) =>
                    `<option value="${i}" ${i === refIdx ? 'selected' : ''}>${escapeAttr(p.name)}(パネル${i + 1})</option>`).join('');
                const previewAV = computeRefPreviewAV(ev);
                const previewText = previewAV === null ? '未到達/循環' : `→ ${previewAV.toFixed(2)}AV`;
                timingControls = `
                    <select class="adv-ev-refpanel" data-idx="${idx}" title="参照するパネル" style="flex:1; min-width:64px; font-size:0.76em; padding:2px;">${panelOpts}</select>
                    <input type="number" class="adv-ev-refturn" data-idx="${idx}" value="${refTurn}" min="1" step="1" style="width:40px; flex:none;" title="参照するターン番号(1始まり)">
                    <span style="font-size:0.72em; color:var(--text-muted); flex:none;">T目</span>
                    <span class="adv-ev-ref-preview" data-idx="${idx}" style="font-size:0.74em; font-weight:bold; color:${previewAV === null ? '#ff8787' : '#c9a8ff'}; flex:none;" title="選択したパネル・ターンが実際に到達する累計AV。相手側の設定が変わると自動で追従する。">${previewText}</span>
                `;
            } else {
                timingControls = `
                    <input type="number" class="adv-ev-time" data-idx="${idx}" value="${timeVal}" min="0" step="1" style="width:54px; flex:none;" title="${timing === 'cum' ? 'タイムライン全体の累計行動値' : 'ターン開始からの行動値オフセット'}">
                    <span style="font-size:0.72em; color:var(--text-muted); flex:none;">${timing === 'cum' ? '累計' : 'AV後'}</span>
                `;
            }

            row.innerHTML = `
                <div style="display:flex; gap:4px; align-items:center;">
                    <select class="adv-ev-type" data-idx="${idx}" style="flex:1; min-width:0; font-size:0.78em; padding:2px;">${typeOpts}</select>
                    <input type="number" class="adv-ev-value" data-idx="${idx}" value="${ev.value}" step="0.1" style="width:50px; flex:none;" title="効果量">
                    <input type="text" class="adv-ev-name" data-idx="${idx}" value="${escapeAttr(ev.name || '')}" placeholder="表示名" title="表示名(任意 例: 鷹25%)" style="flex:1; min-width:0; font-size:0.76em; padding:2px 4px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); border-radius:4px; color:var(--text-color);">
                    <button class="secondary-btn-small adv-ev-del" data-idx="${idx}" title="削除" style="padding:2px 6px; flex:none;">✕</button>
                </div>
                <div style="display:flex; gap:4px; align-items:center; flex-wrap:wrap;">
                    <select class="adv-ev-timing" data-idx="${idx}" style="flex:1; min-width:0; font-size:0.76em; padding:2px;">
                        <option value="turn" ${timing === 'turn' ? 'selected' : ''}>発動AV(ターン基準)</option>
                        <option value="cum" ${timing === 'cum' ? 'selected' : ''}>累計AVで発動</option>
                        <option value="panel" ${timing === 'panel' ? 'selected' : ''}>他パネルのターン到達AVで発動</option>
                    </select>
                    ${timingControls}
                    <button class="secondary-btn-small adv-ev-register" data-idx="${idx}" title="この効果をクイック追加に登録" style="padding:2px 6px; flex:none; margin-left:auto; font-size:0.74em;">★登録</button>
                </div>
            `;
            buffEventList.appendChild(row);
        });

        buffEventList.querySelectorAll('.adv-ev-type').forEach(sel => sel.addEventListener('change', e => {
            modalEvents[+e.target.dataset.idx].type = e.target.value;
        }));
        buffEventList.querySelectorAll('.adv-ev-value').forEach(inp => inp.addEventListener('input', e => {
            modalEvents[+e.target.dataset.idx].value = parseFloat(e.target.value) || 0;
        }));
        buffEventList.querySelectorAll('.adv-ev-name').forEach(inp => inp.addEventListener('input', e => {
            modalEvents[+e.target.dataset.idx].name = e.target.value;
        }));
        buffEventList.querySelectorAll('.adv-ev-timing').forEach(sel => sel.addEventListener('change', e => {
            modalEvents[+e.target.dataset.idx].timing = e.target.value;
            renderModalEvents(); // 発動タイミングの種類ごとに欄の構成が変わるため再描画
        }));
        buffEventList.querySelectorAll('.adv-ev-time').forEach(inp => inp.addEventListener('input', e => {
            const ev = modalEvents[+e.target.dataset.idx];
            const v = Math.max(0, parseFloat(e.target.value) || 0);
            if (evTiming(ev) === 'cum') ev.atAV = v; else ev.offset = v;
        }));
        buffEventList.querySelectorAll('.adv-ev-refpanel').forEach(sel => sel.addEventListener('change', e => {
            const idx = +e.target.dataset.idx;
            modalEvents[idx].refPanel = parseInt(e.target.value, 10) || 0;
            refreshRefPreview(idx);
        }));
        buffEventList.querySelectorAll('.adv-ev-refturn').forEach(inp => inp.addEventListener('input', e => {
            const idx = +e.target.dataset.idx;
            modalEvents[idx].refTurn = Math.max(1, parseInt(e.target.value, 10) || 1);
            refreshRefPreview(idx);
        }));
        buffEventList.querySelectorAll('.adv-ev-register').forEach(btn => btn.addEventListener('click', e => {
            registerQuickPreset(modalEvents[+e.currentTarget.dataset.idx]);
        }));
        buffEventList.querySelectorAll('.adv-ev-del').forEach(btn => btn.addEventListener('click', e => {
            modalEvents.splice(+e.currentTarget.dataset.idx, 1);
            renderModalEvents();
        }));
    }

    // ---- クイック追加プリセット (ユーザー定義 / localStorage 永続化) ----
    const QUICK_PRESET_KEY = 'srsim_adv_quick_presets';
    const quickCustomContainer = document.getElementById('adv-quick-custom');

    function loadQuickPresets() {
        try {
            const a = JSON.parse(localStorage.getItem(QUICK_PRESET_KEY));
            return ActionOrder?.normalizeQuickPresets
                ? ActionOrder.normalizeQuickPresets(a)
                : Array.isArray(a) ? a : [];
        } catch { return []; }
    }
    function saveQuickPresets() {
        try { localStorage.setItem(QUICK_PRESET_KEY, JSON.stringify(customQuickPresets)); } catch { /* 容量超過等は無視 */ }
    }
    function registerQuickPreset(ev) {
        const label = (ev.name && ev.name.trim()) ? ev.name.trim() : evAutoLabel(ev);
        customQuickPresets.push({
            id: 'qp' + Date.now() + Math.random().toString(36).slice(2, 6),
            type: ev.type, value: ev.value, name: ev.name || '', label, memo: '',
        });
        saveQuickPresets();
        renderQuickPresets();
    }
    function deleteQuickPreset(id) {
        const i = customQuickPresets.findIndex(p => p.id === id);
        if (i !== -1) { customQuickPresets.splice(i, 1); saveQuickPresets(); renderQuickPresets(); }
    }
    function renderQuickPresets() {
        if (!quickCustomContainer) return;
        quickCustomContainer.innerHTML = customQuickPresets.map(p => `
            <span style="display:inline-flex; flex-direction:column; gap:3px; vertical-align:top; max-width:220px; padding:4px; border:1px solid rgba(255,255,255,0.2); border-radius:4px;">
                <span style="display:flex; align-items:center; overflow:hidden;">
                    <button class="secondary-btn-small adv-quick-add-custom" data-id="${p.id}" title="${escapeAttr(p.memo ? `追加: ${p.memo}` : 'このプリセットを追加')}" style="border:none; border-radius:0; flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeAttr(p.label)}</button>
                    <button class="adv-quick-del" data-id="${p.id}" title="プリセット削除" style="border:none; background:transparent; color:#ff6b6b; cursor:pointer; padding:0 6px; font-size:0.95em;">×</button>
                </span>
                <input class="adv-quick-memo" data-id="${p.id}" type="text" value="${escapeAttr(p.memo || '')}" maxlength="2000" placeholder="AI参照用メモ" aria-label="${escapeAttr(p.label)} のAI参照用メモ" style="min-width:0; width:100%; box-sizing:border-box; font-size:0.74em; padding:2px 4px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); border-radius:3px; color:var(--text-color);">
            </span>
        `).join('');
        quickCustomContainer.querySelectorAll('.adv-quick-add-custom').forEach(b => b.addEventListener('click', () => {
            const p = customQuickPresets.find(x => x.id === b.dataset.id);
            if (!p) return;
            modalEvents.push(makeEvent({ type: p.type, value: p.value, name: p.name }));
            renderModalEvents();
        }));
        quickCustomContainer.querySelectorAll('.adv-quick-del').forEach(b => b.addEventListener('click', () => deleteQuickPreset(b.dataset.id)));
        quickCustomContainer.querySelectorAll('.adv-quick-memo').forEach(input => input.addEventListener('input', () => {
            const preset = customQuickPresets.find(item => item.id === input.dataset.id);
            if (!preset) return;
            preset.memo = input.value.slice(0, 2000);
            saveQuickPresets();
        }));
    }

    const customQuickPresets = loadQuickPresets();

    function makeEvent(opts) {
        return {
            type: (opts && opts.type) || 'advance',
            value: (opts && opts.value !== undefined) ? opts.value : EVENT_TYPES.advance.def,
            name: (opts && opts.name) || '',
            timing: 'turn',
            offset: 0,
            atAV: 100,
            refPanel: 0,
            refTurn: 1,
        };
    }

    if (buffAddEventBtn) {
        buffAddEventBtn.addEventListener('click', () => {
            modalEvents.push(makeEvent());
            renderModalEvents();
        });
    }

    buffModal.querySelectorAll('.adv-quick-add').forEach(btn => {
        btn.addEventListener('click', () => {
            modalEvents.push(makeEvent({
                type: btn.dataset.type,
                value: parseFloat(btn.dataset.value) || 0,
                name: btn.dataset.name || '',
            }));
            renderModalEvents();
        });
    });

    if (buffModalApply) {
        buffModalApply.addEventListener('click', () => {
            const panel = advPanels.find(p => p.id === modalPanelId);
            if (!panel || modalTurnIndex < 0) { buffModal.style.display = 'none'; return; }
            while (panel.turns.length <= modalTurnIndex) panel.turns.push({ events: [] });
            panel.turns[modalTurnIndex].events = modalEvents.map(ev => ({ ...ev }));
            buffModal.style.display = 'none';
            renderAllAdvPanels(); // 他パネルのパネル参照バフが追従できるよう全パネル再計算
        });
    }

    if (closeBuffModal) {
        closeBuffModal.addEventListener('click', () => { buffModal.style.display = 'none'; });
    }
    if (closeStateModal) {
        closeStateModal.addEventListener('click', () => { stateModal.style.display = 'none'; });
    }
    if (stateInput) {
        stateInput.placeholder = 'コピーした行動順シミュのJSONを貼り付け';
    }
    if (stateCopyFromModalBtn) {
        stateCopyFromModalBtn.addEventListener('click', () => copyAdvState(advPanels, 'all', stateCopyFromModalBtn));
    }
    if (stateApplyBtn) {
        stateApplyBtn.addEventListener('click', applyStateInput);
    }
    // モーダル外クリックで閉じる (削除ボタンで要素がDOMから外れた場合は isConnected で除外)
    document.addEventListener('click', (e) => {
        if (buffModal && buffModal.style.display === 'block') {
            if (e.target.isConnected && !buffModal.contains(e.target) && !e.target.closest('.adv-buff-setup')) {
                buffModal.style.display = 'none';
            }
        }
        if (stateModal && stateModal.style.display === 'block') {
            if (e.target.isConnected && !stateModal.contains(e.target) && !e.target.closest('#adv-import-state')) {
                stateModal.style.display = 'none';
            }
        }
    });

    document.addEventListener('keydown', (e) => {
        if (buffModal && buffModal.style.display === 'block') {
            if (e.key === 'Escape') {
                buffModal.style.display = 'none';
                e.preventDefault();
            } else if (e.key === 'Enter') {
                if (buffModalApply) buffModalApply.click();
                e.preventDefault();
            }
        }
        if (stateModal && stateModal.style.display === 'block' && e.key === 'Escape') {
            stateModal.style.display = 'none';
            e.preventDefault();
        }
    });

    if (advAddPanelBtn) advAddPanelBtn.addEventListener('click', () => createAdvPanel());
    if (advCopyStateBtn) advCopyStateBtn.addEventListener('click', () => copyAdvState(advPanels, 'all', advCopyStateBtn));
    if (advImportStateBtn) advImportStateBtn.addEventListener('click', () => openStateModal());
    if (advLoadLocalStateBtn) {
        advLoadLocalStateBtn.addEventListener('click', () => loadAdvLocalState({ manual: true }));
    }
    if (advCopyLocalPathBtn) {
        advCopyLocalPathBtn.addEventListener('click', async () => {
            const originalText = advCopyLocalPathBtn.textContent;
            advCopyLocalPathBtn.disabled = true;
            try {
                await copyTextToClipboard(advLocalStatePath);
                advCopyLocalPathBtn.textContent = 'コピー完了!';
            } catch (err) {
                console.error(err);
                advCopyLocalPathBtn.textContent = '失敗';
            }
            setTimeout(() => {
                advCopyLocalPathBtn.textContent = originalText;
                advCopyLocalPathBtn.disabled = false;
            }, 1500);
        });
    }

    if (advScrollLeftBtn) {
        advScrollLeftBtn.addEventListener('click', () => {
            scrollAdvPanelsBy(-Math.max(240, advPanelsContainer.clientWidth * 0.75));
        });
    }
    if (advScrollRightBtn) {
        advScrollRightBtn.addEventListener('click', () => {
            scrollAdvPanelsBy(Math.max(240, advPanelsContainer.clientWidth * 0.75));
        });
    }
    if (advPanelPrevBtn) {
        advPanelPrevBtn.addEventListener('click', () => scrollAdvPanelByStep(-1));
    }
    if (advPanelNextBtn) {
        advPanelNextBtn.addEventListener('click', () => scrollAdvPanelByStep(1));
    }
    if (advPanelsWrap) {
        advPanelsWrap.addEventListener('click', handleAdvPanelJumpClick, true);
    }

    // 縦スクロールはページに通し、横意図が明確な入力だけパネル列の横移動に使う。
    //   - トラックパッド等の横ホイール(deltaX優勢)
    //   - Shift + 縦ホイール
    if (advPanelsContainer) {
        advPanelsContainer.addEventListener('scroll', scheduleAdvScrollButtonUpdate);
        window.addEventListener('resize', scheduleAdvScrollButtonUpdate);
        advPanelsContainer.addEventListener('wheel', (e) => {
            if (e.ctrlKey || getAdvMaxScroll() <= 0) return;
            const target = e.target;
            if (
                document.activeElement === target &&
                (target instanceof HTMLInputElement ||
                 target instanceof HTMLSelectElement ||
                 target instanceof HTMLTextAreaElement)
            ) {
                return;
            }

            const pageSize = advPanelsContainer.clientWidth || window.innerWidth;
            const dx = normalizeWheelDelta(e.deltaX, e.deltaMode, pageSize);
            const dy = normalizeWheelDelta(e.deltaY, e.deltaMode, pageSize);
            const absX = Math.abs(dx);
            const absY = Math.abs(dy);

            if (absX > absY && scrollAdvPanelsBy(dx)) {
                e.preventDefault();
            } else if (e.shiftKey && absY > 0 && scrollAdvPanelsBy(dy)) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    // 初期化処理
    updateUI();
    renderThresholdTable();
    renderAhaSpeed();
    renderQuickPresets();
    if (advPanelsContainer && !ActionOrder) {
        // 計算モジュール未読込。速度タブの他機能は生かしたまま、行動順シミュだけ停止する。
        // (この時点では下の「行動順 JSON」パネルすら登録できないため、直接表示する)
        const moduleLoadErrorMsg = '行動順シミュの計算モジュールを読み込めませんでした。';
        console.error(moduleLoadErrorMsg);
        advPanelsContainer.textContent = moduleLoadErrorMsg;
    } else if (advPanelsContainer) {
        createAdvPanel({ name: 'キャラ1' });
        createAdvPanel({ name: 'キャラ2' });

        const applyAdvState = (payload) => {
            const imported = parseAdvStateText(JSON.stringify(payload));
            advLocalSyncPaused = true;
            importAdvPanels(imported);
            advLocalSyncPaused = false;
        };

        // 「行動順 JSON」パネル(js/localSave.js)を先に登録してから保存状況を流し込む。
        // このパネルの自動保存/自動読込は使わず、下の loadAdvLocalState() 側の
        // 常時オートセーブ経路(サーバー上の _autosave ファイルへ直接書き込む)に一本化している。
        window.SRSIM_LOCAL?.registerTab({
            tab: 'action-order',
            label: '行動順',
            mount: '#sub-speed-advanced',
            schema: ADV_STATE_SCHEMA,
            autosave: false,
            autoload: false,
            getState: () => buildAdvStatePayload(advPanels, 'all'),
            applyState: applyAdvState,
        });

        setAdvLocalSyncStatus('ローカルJSON確認中...', false);
        loadAdvLocalState();

        // 行動順AIアシスタント用の橋渡し。
        // AI は画面の状態をここから読み、承認された変更だけをここから書き戻す。
        window.SRSIM_ACTION_ORDER = Object.freeze({
            getState: () => ({
                ...buildAdvStatePayload(advPanels, 'all'),
                quickPresets: ActionOrder.normalizeQuickPresets(customQuickPresets),
            }),
            applyState: applyAdvState,
        });
    }
});
