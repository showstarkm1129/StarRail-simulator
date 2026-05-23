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
                renderAdvancedTable();
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

    // --- Sub Tab 3: 行動順シミュ ---
    const advBaseSpeedInput = document.getElementById('adv-base-speed');
    const advPreSpeedInput = document.getElementById('adv-pre-speed');
    const advThresholdInput = document.getElementById('adv-threshold');
    const advancedTbody = document.getElementById('advanced-tbody');
    
    // Modal elements
    const buffModal = document.getElementById('adv-buff-modal');
    const closeBuffModal = document.getElementById('close-adv-buff-modal');
    const buffModalTurn = document.getElementById('adv-buff-modal-turn');
    const buffModalApply = document.getElementById('adv-buff-modal-apply');
    
    const enableEagle = document.getElementById('enable-eagle');
    const inputEagle = document.getElementById('adv-buff-eagle');
    const btnEagleMinus = document.getElementById('btn-eagle-minus');
    const btnEaglePlus = document.getElementById('btn-eagle-plus');

    const enableDdd = document.getElementById('enable-ddd');
    const inputDdd = document.getElementById('adv-buff-ddd');
    const btnDddMinus = document.getElementById('btn-ddd-minus');
    const btnDddPlus = document.getElementById('btn-ddd-plus');

    const inputImmediate = document.getElementById('adv-buff-immediate');

    const enableMessenger = document.getElementById('enable-messenger');
    const inputMessenger = document.getElementById('adv-buff-messenger');
    const btnMessengerMinus = document.getElementById('btn-messenger-minus');
    const btnMessengerPlus = document.getElementById('btn-messenger-plus');

    let currentEditingTurn = -1;
    let advancedState = [];

    function setupSpinner(enableCb, inputEl, btnMinus, btnPlus) {
        if (!enableCb) return;
        enableCb.addEventListener('change', () => {
            const isChecked = enableCb.checked;
            inputEl.disabled = !isChecked;
            btnMinus.disabled = !isChecked;
            btnPlus.disabled = !isChecked;
            if (isChecked) {
                if (parseInt(inputEl.value) < 1 || isNaN(parseInt(inputEl.value))) {
                    inputEl.value = 1;
                }
            }
        });

        btnMinus.addEventListener('click', () => {
            if (!btnMinus.disabled) {
                let val = parseInt(inputEl.value) || 1;
                if (val > 1) inputEl.value = val - 1;
            }
        });

        btnPlus.addEventListener('click', () => {
            if (!btnPlus.disabled) {
                let val = parseInt(inputEl.value) || 1;
                if (val < 10) inputEl.value = val + 1;
            }
        });
    }

    setupSpinner(enableEagle, inputEagle, btnEagleMinus, btnEaglePlus);
    setupSpinner(enableDdd, inputDdd, btnDddMinus, btnDddPlus);
    setupSpinner(enableMessenger, inputMessenger, btnMessengerMinus, btnMessengerPlus);

    [advBaseSpeedInput, advPreSpeedInput, advThresholdInput].forEach(el => {
        if(el) el.addEventListener('input', renderAdvancedTable);
    });

    // Make sure the modal is attached to body for absolute positioning
    if (buffModal && buffModal.parentElement !== document.body) {
        document.body.appendChild(buffModal);
    }

    if (closeBuffModal) {
        closeBuffModal.addEventListener('click', () => {
            buffModal.style.display = 'none';
        });
    }

    // Click outside to close
    document.addEventListener('click', (e) => {
        if (buffModal && buffModal.style.display === 'block') {
            if (!buffModal.contains(e.target) && !e.target.closest('.btn-buff-setup')) {
                buffModal.style.display = 'none';
            }
        }
    });

    // Keyboard events
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

    if (buffModalApply) {
        buffModalApply.addEventListener('click', () => {
            if (currentEditingTurn >= 0) {
                while (advancedState.length <= currentEditingTurn) {
                    advancedState.push({ eagle: 0, ddd: 0, immediate: 0, messenger: 0 });
                }
                advancedState[currentEditingTurn].eagle = enableEagle.checked ? (parseInt(inputEagle.value) || 1) : 0;
                advancedState[currentEditingTurn].ddd = enableDdd.checked ? (parseInt(inputDdd.value) || 1) : 0;
                advancedState[currentEditingTurn].immediate = inputImmediate.checked ? 1 : 0;
                advancedState[currentEditingTurn].messenger = enableMessenger.checked ? (parseInt(inputMessenger.value) || 1) : 0;
                buffModal.style.display = 'none';
                renderAdvancedTable();
            }
        });
    }

    function getBuffText(state) {
        let texts = [];
        if (state.eagle > 0) texts.push(`鷹4x${state.eagle}`);
        if (state.ddd > 0) texts.push(`DDDx${state.ddd}`);
        if (state.immediate > 0) texts.push(`即時x${state.immediate}`);
        if (state.messenger > 0) texts.push(`メッセ4x${state.messenger}`);
        return texts.length > 0 ? texts.join(', ') : '<span style="color:var(--text-muted)">-</span>';
    }

    function renderAdvancedTable() {
        if (!advancedTbody) return;
        advancedTbody.innerHTML = '';
        
        const baseSpeed = parseFloat(advBaseSpeedInput.value) || 100;
        const preSpeed = parseFloat(advPreSpeedInput.value) || 100;
        const threshold = parseFloat(advThresholdInput.value) || 150;
        
        let cumulativeAV = 0;
        let turn = 0;
        let turnsPastThreshold = 0;
        let hasDrawnWall = false;

        while (turnsPastThreshold < 3) {
            if (turn >= advancedState.length) {
                advancedState.push({ eagle: 0, ddd: 0, immediate: 0, messenger: 0 });
            }
            const state = advancedState[turn];
            
            // 速度計算
            let currentSpeed = preSpeed;
            if (state.messenger > 0) {
                currentSpeed += (baseSpeed * 0.12) * state.messenger;
            }
            
            // 行動値計算
            const baseAV = 10000 / currentSpeed;
            let advanceFraction = 0;
            advanceFraction += 0.25 * state.eagle;
            advanceFraction += 0.24 * state.ddd;
            advanceFraction += 1.0 * state.immediate;
            
            // 行動値は0未満にはならない
            const actualAV = baseAV * Math.max(0, 1 - advanceFraction);
            
            let drawWallHere = false;
            // cumulativeAV + actualAV が閾値を超え、かつ今まで壁を書いていない場合
            if (!hasDrawnWall && (cumulativeAV + actualAV) > threshold) {
                drawWallHere = true;
                hasDrawnWall = true;
            }
            
            cumulativeAV += actualAV;
            
            if (cumulativeAV > threshold) {
                turnsPastThreshold++;
            }
            
            const tr = document.createElement('tr');
            
            if (cumulativeAV > threshold) {
                tr.style.opacity = '0.4';
            }
            
            const buffText = getBuffText(state);
            
            const effectsHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <button class="secondary-btn-small btn-buff-setup" data-turn="${turn}" style="padding: 2px 8px; font-size: 0.85em;">バフ設定</button>
                    <span style="font-size: 0.9em; font-weight: bold; color: #a8d5ff;">${buffText}</span>
                </div>
            `;
            
            tr.innerHTML = `
                <td>${turn + 1}</td>
                <td>${effectsHTML}</td>
                <td style="${state.messenger > 0 ? 'color: #a8d5ff; font-weight: bold;' : ''}">${currentSpeed.toFixed(1)}</td>
                <td>${actualAV.toFixed(2)}</td>
                <td style="font-weight: bold; color: var(--accent-gold);">${cumulativeAV.toFixed(2)}</td>
            `;
            
            if (drawWallHere) {
                const wallTr = document.createElement('tr');
                wallTr.innerHTML = `
                    <td colspan="5" style="padding: 0;">
                        <div style="height: 6px; background: repeating-linear-gradient(45deg, #ff4757, #ff4757 10px, transparent 10px, transparent 20px); margin: 5px 0; opacity: 0.8;"></div>
                        <div style="text-align: center; color: #ff4757; font-size: 0.85em; font-weight: bold; margin-bottom: 5px; opacity: 0.9;">↑ 目標閾値 (${threshold}) 到達ライン ↓</div>
                    </td>
                `;
                advancedTbody.appendChild(wallTr);
            }
            
            advancedTbody.appendChild(tr);
            turn++;
            
            if (turn > 200) break; // 無限ループ防止
        }
        
        advancedTbody.querySelectorAll('.btn-buff-setup').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const t = parseInt(e.target.getAttribute('data-turn'));
                currentEditingTurn = t;
                buffModalTurn.textContent = t + 1;
                
                const state = advancedState[t];
                
                // Eagle
                enableEagle.checked = state.eagle > 0;
                inputEagle.value = state.eagle > 0 ? state.eagle : 1;
                inputEagle.disabled = !enableEagle.checked;
                btnEagleMinus.disabled = !enableEagle.checked;
                btnEaglePlus.disabled = !enableEagle.checked;

                // DDD
                enableDdd.checked = state.ddd > 0;
                inputDdd.value = state.ddd > 0 ? state.ddd : 1;
                inputDdd.disabled = !enableDdd.checked;
                btnDddMinus.disabled = !enableDdd.checked;
                btnDddPlus.disabled = !enableDdd.checked;

                // Immediate
                inputImmediate.checked = state.immediate > 0;

                // Messenger
                enableMessenger.checked = state.messenger > 0;
                inputMessenger.value = state.messenger > 0 ? state.messenger : 1;
                inputMessenger.disabled = !enableMessenger.checked;
                btnMessengerMinus.disabled = !enableMessenger.checked;
                btnMessengerPlus.disabled = !enableMessenger.checked;
                
                const rect = e.target.getBoundingClientRect();
                buffModal.style.top = (window.scrollY + rect.bottom + 5) + 'px';
                buffModal.style.left = Math.max(10, (window.scrollX + rect.left)) + 'px';
                
                buffModal.style.display = 'block'; 
            });
        });
    }

    // 初期化処理
    updateUI();
    renderThresholdTable();
    renderAdvancedTable();
});
