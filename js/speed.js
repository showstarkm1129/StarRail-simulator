document.addEventListener('DOMContentLoaded', () => {
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
        calculate();
    };

    // イベントリスナーの登録
    modeSelect.addEventListener('change', updateUI);
    customType.addEventListener('change', updateUI);
    
    [speedInput, customFirst, customNext, customMax, customTotal].forEach(el => {
        el.addEventListener('input', calculate);
    });

    function calculate() {
        const speed = parseFloat(speedInput.value);
        if (isNaN(speed) || speed <= 0) {
            avResult.textContent = '---';
            cycleTbody.innerHTML = '';
            return;
        }

        // 基本行動値の計算 (10000 / 速度)
        const baseAV = 10000 / speed;
        avResult.textContent = baseAV.toFixed(2);

        generateTable(baseAV, speed);
    }

    function generateTable(baseAV, speed) {
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

                // +1行動するための目標速度 = (現在の累計行動回数 + 1) * 10000 / 累積行動値
                // 切り上げ処理を入れて、確実にその回数行動できる値にする
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
            // 末日の幻影などの総行動値制
            tableHeader.innerHTML = '<th>到達行動値</th><th>行動回数</th><th>余裕 (AV)</th><th>+1回行動の目標速度</th>';
            
            // 100ごとに区切って表示
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
                
                // +1行動するための目標速度
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

    // 初期化
    updateUI();
});
