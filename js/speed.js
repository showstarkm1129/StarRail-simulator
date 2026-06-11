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
    const advPanelsContainer = document.getElementById('adv-panels');
    const advAddPanelBtn = document.getElementById('adv-add-panel');

    // 共有モーダル要素
    const buffModal = document.getElementById('adv-buff-modal');
    const closeBuffModal = document.getElementById('close-adv-buff-modal');
    const buffModalPanelLabel = document.getElementById('adv-buff-modal-panel');
    const buffModalTurn = document.getElementById('adv-buff-modal-turn');
    const buffModalApply = document.getElementById('adv-buff-modal-apply');
    const buffEventList = document.getElementById('adv-buff-event-list');
    const buffAddEventBtn = document.getElementById('adv-buff-add-event');

    // バフイベントの種類定義 (使いまわし用にここで一元管理)
    const EVENT_TYPES = {
        advance:   { label: '行動値短縮 (%)',   def: 25 },
        speedFlat: { label: '速度増加 (固定)',  def: 20 },
        speedPct:  { label: '速度増加 (%基礎)', def: 12 },
    };

    const advPanels = [];   // パネル状態の配列
    let advPanelSeq = 0;  // パネル連番 (名前デフォルト用)

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

    // ---- シミュレーション本体 ----
    // 1ターン分の行動を「ゲージ充填」で計算する。
    //   ゲージ 0→10000 を speed (AV毎の充填量) で満たす。
    //   行動値短縮 = ゲージへ即時加算 (value% × 10000)。
    //   速度増加   = それ以降の充填速度を上げる。
    //   各イベントは offset(発動AV: ターン開始からの経過AV) の時点で適用。
    //   ※ offset=0 なら従来の「ターン最初に全適用」と一致する。
    //   返り値: { actualAV(実消費AV), endSpeed, startSpeed, fired[](各イベントが発動したか) }
    //   effective: [{ ev, offset }] (各効果を「このターン開始からの発動AV(offset)」へ正規化済み)
    function simulateTurn(panel, effective) {
        const base = panel.baseSpeed > 0 ? panel.baseSpeed : 1;
        const startSpeed = panel.preSpeed > 0 ? panel.preSpeed : 1;
        const EPS = 1e-9;

        // offset昇順に処理。元のindexを保持して発動有無を返す。
        const indexed = effective.map((e, i) => ({ e, i }));
        indexed.sort((a, b) => a.e.offset - b.e.offset);
        const fired = new Array(effective.length).fill(false);

        let speed = startSpeed;
        let gauge = 0;
        let elapsed = 0;
        let k = 0;
        let guard = 0;

        while (guard++ < 2000) {
            const remaining = 10000 - gauge;
            if (remaining <= EPS) break; // 行動値短縮でゲージが満タンに達した

            const avToComplete = remaining / speed;
            const completionElapsed = elapsed + avToComplete;
            const nextOffset = k < indexed.length ? indexed[k].e.offset : Infinity;

            if (completionElapsed <= nextOffset + EPS) {
                // 次イベントより先に行動が完了
                elapsed = completionElapsed;
                break;
            }

            // 次イベントの発動AVまでゲージを進める
            gauge += speed * (nextOffset - elapsed);
            elapsed = nextOffset;

            // 同じ offset のイベントをまとめて適用
            while (k < indexed.length && indexed[k].e.offset <= nextOffset + EPS) {
                const { e, i } = indexed[k];
                const ev = e.ev;
                fired[i] = true;
                if (ev.type === 'advance')        gauge += (ev.value / 100) * 10000;
                else if (ev.type === 'speedFlat') speed += ev.value;
                else if (ev.type === 'speedPct')  speed += base * (ev.value / 100);
                k++;
            }
        }

        return { actualAV: elapsed, endSpeed: speed, startSpeed, fired };
    }

    // ---- イベント参照ヘルパ (旧データへの後方互換デフォルト込み) ----
    function evTiming(ev) { return ev.timing === 'cum' ? 'cum' : 'turn'; }
    function evOffset(ev) { return Number.isFinite(ev.offset) ? ev.offset : 0; }
    function evAtAV(ev)   { return Number.isFinite(ev.atAV) ? ev.atAV : 0; }
    function evAutoLabel(ev) {
        if (ev.type === 'advance') return `短縮${ev.value}%`;
        if (ev.type === 'speedFlat') return `速度+${ev.value}`;
        return `速度+${ev.value}%`;
    }
    // 表示名: カスタム名があればそれ、無ければ自動ラベル
    function evLabel(ev) {
        return (ev.name && ev.name.trim()) ? ev.name.trim() : evAutoLabel(ev);
    }

    // テーブルセル用の効果チップ1個分
    function renderSummaryChip(ev, kind, notFired) {
        const suffix = kind === 'cum' ? `@累計${evAtAV(ev)}` : `@${evOffset(ev)}AV`;
        let style;
        if (notFired) style = 'color:#ff6b6b; text-decoration:line-through; opacity:0.85;';
        else if (kind === 'cum') style = 'color:#ffd479;'; // 累計AV発動は金色で区別
        else style = 'color:#a8d5ff;';
        const title = notFired ? ' title="行動が発動AVより先に完了したため不発"' : '';
        return `<span style="font-size:0.82em; font-weight:bold; ${style}"${title}>${escapeAttr(evLabel(ev))}${suffix}${notFired ? '(不発)' : ''}</span>`;
    }

    function renderPanelTable(panel) {
        const tbody = panel.el && panel.el.tbody;
        if (!tbody) return;
        tbody.innerHTML = '';

        const threshold = panel.threshold > 0 ? panel.threshold : 150;
        const EPS = 1e-9;

        // パネル全体の「累計AV発動」バフを収集 (どのターンで発動するかは順次判定)
        const cumPool = [];
        panel.turns.forEach((td) => {
            (td.events || []).forEach((ev) => {
                if (evTiming(ev) === 'cum') cumPool.push({ ev, fired: false });
            });
        });

        let cumulativeAV = 0;
        let turn = 0;
        let turnsPastThreshold = 0;
        let hasDrawnWall = false;

        while (turnsPastThreshold < 3) {
            if (turn >= panel.turns.length) panel.turns.push({ events: [] });
            const turnData = panel.turns[turn];
            const cumStart = cumulativeAV;

            // このターンに効く効果を effective list へ正規化
            //   turn効果: offset そのまま / cum効果: offset = atAV - cumStart (未発動かつ atAV>=cumStart のもの)
            const effective = [];
            (turnData.events || []).forEach((ev) => {
                if (evTiming(ev) === 'turn') effective.push({ ev, offset: evOffset(ev), kind: 'turn' });
            });
            cumPool.forEach((c) => {
                if (!c.fired && evAtAV(c.ev) >= cumStart - EPS) {
                    effective.push({ ev: c.ev, offset: Math.max(0, evAtAV(c.ev) - cumStart), kind: 'cum', cumRef: c });
                }
            });

            const sim = simulateTurn(panel, effective);
            const actualAV = sim.actualAV;

            // 発動した cum 効果をプール側に記録 (以降のターンで再適用しない)
            effective.forEach((e, idx) => { if (e.kind === 'cum' && sim.fired[idx]) e.cumRef.fired = true; });

            // サマリ: turn効果(不発含む) + このターンで発動した cum効果のみ
            const chips = [];
            effective.forEach((e, idx) => {
                if (e.kind === 'turn') chips.push(renderSummaryChip(e.ev, 'turn', !sim.fired[idx]));
                else if (e.kind === 'cum' && sim.fired[idx]) chips.push(renderSummaryChip(e.ev, 'cum', false));
            });
            const summary = chips.length ? chips.join(' ') : '<span style="color:var(--text-muted)">-</span>';

            let drawWallHere = false;
            if (!hasDrawnWall && (cumulativeAV + actualAV) > threshold) {
                drawWallHere = true;
                hasDrawnWall = true;
            }
            cumulativeAV += actualAV;
            if (cumulativeAV > threshold) turnsPastThreshold++;

            const speedChanged = Math.abs(sim.endSpeed - sim.startSpeed) > 1e-6;
            const speedText = speedChanged
                ? `${sim.startSpeed.toFixed(1)}→${sim.endSpeed.toFixed(1)}`
                : sim.startSpeed.toFixed(1);

            if (drawWallHere) {
                const wallTr = document.createElement('tr');
                wallTr.innerHTML = `
                    <td colspan="5" style="padding:0;">
                        <div style="height:6px; background: repeating-linear-gradient(45deg, #ff4757, #ff4757 10px, transparent 10px, transparent 20px); margin:5px 0; opacity:0.8;"></div>
                        <div style="text-align:center; color:#ff4757; font-size:0.8em; font-weight:bold; margin-bottom:5px; opacity:0.9;">↑ 目標閾値 (${threshold}) 到達 ↓</div>
                    </td>
                `;
                tbody.appendChild(wallTr);
            }

            const tr = document.createElement('tr');
            if (cumulativeAV > threshold) tr.style.opacity = '0.4';
            tr.innerHTML = `
                <td>${turn + 1}</td>
                <td>
                    <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                        <button class="secondary-btn-small adv-buff-setup" data-turn="${turn}" style="padding:2px 8px; font-size:0.8em;">バフ設定</button>
                        <span style="display:flex; gap:6px; flex-wrap:wrap;">${summary}</span>
                    </div>
                </td>
                <td style="${speedChanged ? 'color:#a8d5ff; font-weight:bold;' : ''}">${speedText}</td>
                <td>${actualAV.toFixed(2)}</td>
                <td style="font-weight:bold; color: var(--accent-gold);">${cumulativeAV.toFixed(2)}</td>
            `;
            tbody.appendChild(tr);

            turn++;
            if (turn > 200) break; // 無限ループ防止
        }

        tbody.querySelectorAll('.adv-buff-setup').forEach(btn => {
            btn.addEventListener('click', (e) => {
                openBuffModal(panel.id, parseInt(e.currentTarget.getAttribute('data-turn'), 10), e.currentTarget);
            });
        });
    }

    function renderAllAdvPanels() {
        advPanels.forEach(renderPanelTable);
    }

    async function copyPanelImage(panelEl) {
        const clone = panelEl.cloneNode(true);
        
        clone.querySelectorAll('.adv-panel-remove, .adv-panel-share').forEach(el => el.remove());
        
        const origInputs = panelEl.querySelectorAll('input, select');
        const cloneInputs = clone.querySelectorAll('input, select');
        origInputs.forEach((orig, i) => {
            if (orig.tagName === 'INPUT') {
                cloneInputs[i].setAttribute('value', orig.value);
            } else if (orig.tagName === 'SELECT') {
                const selectedIdx = orig.selectedIndex;
                if (selectedIdx >= 0) {
                    const opts = cloneInputs[i].querySelectorAll('option');
                    if (opts[selectedIdx]) opts[selectedIdx].setAttribute('selected', 'selected');
                }
            }
        });

        let styleText = '';
        for (const sheet of document.styleSheets) {
            try {
                for (const rule of sheet.cssRules) {
                    styleText += rule.cssText + '\n';
                }
            } catch (e) {
                // cross-origin ignore
            }
        }
        
        const bodyStyles = window.getComputedStyle(document.body);
        let inlineStyles = '';
        for (let i = 0; i < bodyStyles.length; i++) {
            const name = bodyStyles[i];
            if (name.startsWith('--')) {
                inlineStyles += `${name}: ${bodyStyles.getPropertyValue(name)};\n`;
            }
        }

        const xmlSerializer = new XMLSerializer();
        const cloneXml = xmlSerializer.serializeToString(clone);
        
        const svgString = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${panelEl.offsetWidth}" height="${panelEl.offsetHeight}">
                <foreignObject width="100%" height="100%">
                    <div xmlns="http://www.w3.org/1999/xhtml" class="screenshot-wrapper" style="width: ${panelEl.offsetWidth}px; height: ${panelEl.offsetHeight}px;">
                        <style>
                        <![CDATA[
                            ${styleText}
                            .screenshot-wrapper {
                                ${inlineStyles}
                            }
                        ]]>
                        </style>
                        <div style="background-color: #1e1e1e; padding: 1rem; box-sizing: border-box; width: 100%; height: 100%; border-radius: 8px;">
                            ${cloneXml}
                        </div>
                    </div>
                </foreignObject>
            </svg>
        `;

        const img = new Image();
        const svgBlob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
        const url = URL.createObjectURL(svgBlob);
        
        return new Promise((resolve, reject) => {
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = panelEl.offsetWidth;
                    canvas.height = panelEl.offsetHeight;
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = '#1e1e1e'; 
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                    URL.revokeObjectURL(url);
                    canvas.toBlob(blob => {
                        if (blob) resolve(blob);
                        else reject(new Error('Canvas to Blob failed'));
                    }, 'image/png');
                } catch (e) {
                    URL.revokeObjectURL(url);
                    reject(e);
                }
            };
            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error('Image load failed'));
            };
            img.src = url;
        });
    }

    function buildPanelDOM(panel) {
        const card = document.createElement('div');
        card.className = 'panel';
        card.style.cssText = 'min-width: 470px; flex: 0 0 auto; padding: 1rem; margin: 0; position: relative;';
        card.innerHTML = `
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:0.8rem;">
                <input type="text" class="adv-panel-name" value="${escapeAttr(panel.name)}" style="font-weight:bold; font-size:1.05rem; flex:1; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); border-radius:4px; padding:4px 8px; color:var(--text-color);">
                <button class="secondary-btn-small adv-panel-share" title="このパネルを画像としてコピー" style="padding:2px 10px;">共有</button>
                <button class="secondary-btn-small adv-panel-remove" title="このパネルを削除" style="padding:2px 10px;">✕</button>
            </div>
            <div style="display:flex; gap:0.8rem; flex-wrap:wrap; margin-bottom:1rem;">
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
            </div>
            <div class="cycle-box" style="margin:0;">
                <table class="cycle-table">
                    <thead>
                        <tr>
                            <th style="width:46px;">ターン</th>
                            <th>効果 (発動AV指定可)</th>
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
            nameInput: card.querySelector('.adv-panel-name'),
            baseInput: card.querySelector('.adv-base-speed'),
            preInput: card.querySelector('.adv-pre-speed'),
            thrInput: card.querySelector('.adv-threshold'),
            tbody: card.querySelector('.adv-tbody'),
        };

        panel.el.nameInput.addEventListener('input', () => {
            panel.name = panel.el.nameInput.value;
            if (modalPanelId === panel.id) buffModalPanelLabel.textContent = panel.name;
        });
        panel.el.baseInput.addEventListener('input', () => {
            panel.baseSpeed = parseFloat(panel.el.baseInput.value) || 1;
            renderPanelTable(panel);
        });
        panel.el.preInput.addEventListener('input', () => {
            panel.preSpeed = parseFloat(panel.el.preInput.value) || 1;
            renderPanelTable(panel);
        });
        panel.el.thrInput.addEventListener('input', () => {
            panel.threshold = parseFloat(panel.el.thrInput.value) || 1;
            renderPanelTable(panel);
        });
        
        const shareBtn = card.querySelector('.adv-panel-share');
        if (shareBtn) {
            shareBtn.addEventListener('click', async () => {
                const originalText = shareBtn.textContent;
                shareBtn.textContent = '生成中...';
                shareBtn.disabled = true;
                try {
                    const blob = await copyPanelImage(card);
                    if (navigator.clipboard && navigator.clipboard.write) {
                        await navigator.clipboard.write([
                            new ClipboardItem({ 'image/png': blob })
                        ]);
                        shareBtn.textContent = 'コピー完了!';
                    } else {
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `timeline_${Date.now()}.png`;
                        a.click();
                        URL.revokeObjectURL(url);
                        shareBtn.textContent = '保存完了!';
                    }
                } catch (err) {
                    console.error(err);
                    shareBtn.textContent = '失敗';
                }
                setTimeout(() => {
                    shareBtn.textContent = originalText;
                    shareBtn.disabled = false;
                }, 2000);
            });
        }
        
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
            turns: [],
            el: null,
        };
        advPanels.push(panel);
        advPanelsContainer.appendChild(buildPanelDOM(panel));
        renderPanelTable(panel);
        return panel;
    }

    function removeAdvPanel(id) {
        const idx = advPanels.findIndex(p => p.id === id);
        if (idx === -1) return;
        const [removed] = advPanels.splice(idx, 1);
        if (removed.el && removed.el.card) removed.el.card.remove();
        if (modalPanelId === id) buffModal.style.display = 'none';
        if (advPanels.length === 0) createAdvPanel(); // 最低1枚は残す
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
            const isCum = evTiming(ev) === 'cum';
            const timeVal = isCum ? evAtAV(ev) : evOffset(ev);
            row.innerHTML = `
                <div style="display:flex; gap:4px; align-items:center;">
                    <select class="adv-ev-type" data-idx="${idx}" style="flex:1; min-width:0; font-size:0.78em; padding:2px;">${typeOpts}</select>
                    <input type="number" class="adv-ev-value" data-idx="${idx}" value="${ev.value}" step="0.1" style="width:50px; flex:none;" title="効果量">
                    <input type="text" class="adv-ev-name" data-idx="${idx}" value="${escapeAttr(ev.name || '')}" placeholder="表示名" title="表示名(任意 例: 鷹25%)" style="flex:1; min-width:0; font-size:0.76em; padding:2px 4px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); border-radius:4px; color:var(--text-color);">
                    <button class="secondary-btn-small adv-ev-del" data-idx="${idx}" title="削除" style="padding:2px 6px; flex:none;">✕</button>
                </div>
                <div style="display:flex; gap:4px; align-items:center;">
                    <select class="adv-ev-timing" data-idx="${idx}" style="flex:1; min-width:0; font-size:0.76em; padding:2px;">
                        <option value="turn" ${!isCum ? 'selected' : ''}>発動AV(ターン基準)</option>
                        <option value="cum" ${isCum ? 'selected' : ''}>累計AVで発動</option>
                    </select>
                    <input type="number" class="adv-ev-time" data-idx="${idx}" value="${timeVal}" min="0" step="1" style="width:54px; flex:none;" title="${isCum ? 'タイムライン全体の累計行動値' : 'ターン開始からの行動値オフセット'}">
                    <span style="font-size:0.72em; color:var(--text-muted); flex:none;">${isCum ? '累計' : 'AV後'}</span>
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
            renderModalEvents(); // 数値欄の意味(発動AV↔累計AV)を切り替えるため再描画
        }));
        buffEventList.querySelectorAll('.adv-ev-time').forEach(inp => inp.addEventListener('input', e => {
            const ev = modalEvents[+e.target.dataset.idx];
            const v = Math.max(0, parseFloat(e.target.value) || 0);
            if (evTiming(ev) === 'cum') ev.atAV = v; else ev.offset = v;
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
            return Array.isArray(a) ? a : [];
        } catch { return []; }
    }
    function saveQuickPresets() {
        try { localStorage.setItem(QUICK_PRESET_KEY, JSON.stringify(customQuickPresets)); } catch { /* 容量超過等は無視 */ }
    }
    function registerQuickPreset(ev) {
        const label = (ev.name && ev.name.trim()) ? ev.name.trim() : evAutoLabel(ev);
        customQuickPresets.push({
            id: 'qp' + Date.now() + Math.random().toString(36).slice(2, 6),
            type: ev.type, value: ev.value, name: ev.name || '', label,
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
            <span style="display:inline-flex; align-items:center; border:1px solid rgba(255,255,255,0.2); border-radius:4px; overflow:hidden;">
                <button class="secondary-btn-small adv-quick-add-custom" data-id="${p.id}" title="このプリセットを追加" style="border:none; border-radius:0;">${escapeAttr(p.label)}</button>
                <button class="adv-quick-del" data-id="${p.id}" title="プリセット削除" style="border:none; background:transparent; color:#ff6b6b; cursor:pointer; padding:0 6px; font-size:0.95em;">×</button>
            </span>
        `).join('');
        quickCustomContainer.querySelectorAll('.adv-quick-add-custom').forEach(b => b.addEventListener('click', () => {
            const p = customQuickPresets.find(x => x.id === b.dataset.id);
            if (!p) return;
            modalEvents.push(makeEvent({ type: p.type, value: p.value, name: p.name }));
            renderModalEvents();
        }));
        quickCustomContainer.querySelectorAll('.adv-quick-del').forEach(b => b.addEventListener('click', () => deleteQuickPreset(b.dataset.id)));
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
            renderPanelTable(panel);
        });
    }

    if (closeBuffModal) {
        closeBuffModal.addEventListener('click', () => { buffModal.style.display = 'none'; });
    }

    // モーダル外クリックで閉じる (削除ボタンで要素がDOMから外れた場合は isConnected で除外)
    document.addEventListener('click', (e) => {
        if (buffModal && buffModal.style.display === 'block') {
            if (e.target.isConnected && !buffModal.contains(e.target) && !e.target.closest('.adv-buff-setup')) {
                buffModal.style.display = 'none';
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
    });

    if (advAddPanelBtn) advAddPanelBtn.addEventListener('click', () => createAdvPanel());

    // 初期化処理
    updateUI();
    renderThresholdTable();
    renderQuickPresets();
    if (advPanelsContainer) {
        createAdvPanel({ name: 'キャラ1' });
        createAdvPanel({ name: 'キャラ2' });
    }
});
