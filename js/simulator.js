function escapeSimulatorHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
    })[char]);
}

class Entity {
    constructor(id, name, isEnemy, baseSpd, bonusSpd, maxEP, err, equipment) {
        this.id = id;
        this.name = name;
        this.isEnemy = isEnemy;
        this.baseSpd = baseSpd;
        this.bonusSpd = bonusSpd;
        this.maxEP = maxEP;
        this.currentEP = isEnemy ? 0 : 50; // 味方は初期EP50
        this.err = err / 100; // EP回復効率
        this.equipment = equipment || { lc: 'none', relic1: 'none', relic2: 'none', ornament: 'none' };
        this.buffs = []; // { name, spdMod, duration }
        this.actionValue = 0;
        this.speed = 0;
        
        this.maxHP = 1000;
        this.currentHP = 1000;
        this.isSummon = false;

        // per-entity マーク (集真赤などの per-enemy stack 状態)
        //   key = mark type id, value = { count, max, displayName }
        //   simulator は数値のみ管理。倍率/効果はキャラ側のフックで処理する。
        this.marks = {};

        // リソース表示メタ (キャラ側 resource をそのまま参照)
        //   buildToEntity で entity.resource に設定される。未設定なら 'EP'。
        this.resource = null;
        
        // セット効果フラグ (setCounts が後から付与された場合にも対応するフォールバック)
        this.hasEagle4 = (this.setCounts?.['Eagle of Twilight Line'] >= 4) || (this.setCounts?.eagle >= 4)
            || (this.equipment.relic1 === 'Eagle of Twilight Line' && this.equipment.relic2 === 'Eagle of Twilight Line')
            || (this.equipment.relic1 === 'eagle' && this.equipment.relic2 === 'eagle');
        this.hasMessenger4 = (this.setCounts?.['Messenger Traversing Hackerspace'] >= 4) || (this.setCounts?.messenger >= 4)
            || (this.equipment.relic1 === 'Messenger Traversing Hackerspace' && this.equipment.relic2 === 'Messenger Traversing Hackerspace')
            || (this.equipment.relic1 === 'messenger' && this.equipment.relic2 === 'messenger');
        this.hasDDD        = (this.equipment.lc === 'Dance! Dance! Dance!');
        this.hasVonwacq = (this.setCounts?.['Sprightly Vonwacq'] >= 2) || (this.setCounts?.vonwacq >= 2)
            || (this.equipment.ornament === 'Sprightly Vonwacq') || (this.equipment.ornament === 'vonwacq');
        
        this.calculateSpeed();
        this.resetActionValue();
        
        // 戦闘開始時の行動順短縮 (ウェンワック等)
        if (!isEnemy && this.hasVonwacq) {
            this.actionValue = Math.max(0, this.actionValue - (10000 / this.speed) * 0.40);
        }
    }

    calculateSpeed() {
        let spdMod = 0;
        for (const b of this.buffs) {
            spdMod += b.spdMod || 0;
        }
        const oldSpeed = this.speed;
        
        // メッセンジャー等の速度バフは基礎速度に乗算される
        this.speed = this.baseSpd * (1 + spdMod) + this.bonusSpd;
        
        // バフ等で速度が変わった場合、残り行動値の割合を維持して再計算
        if (oldSpeed && oldSpeed !== this.speed && this.actionValue > 0) {
            this.actionValue = this.actionValue * (oldSpeed / this.speed);
        }
    }

    addBuff(buff) {
        // メッセンジャーの速度バフは累積しない（上書き）
        if (buff.name === 'messenger_spd') {
            this.buffs = this.buffs.filter(b => b.name !== 'messenger_spd');
        }
        this.buffs.push(buff);
        this.calculateSpeed();
    }

    tickBuffs() {
        // ターン終了時にバフのターンを消費
        this.buffs.forEach(b => b.duration--);
        this.buffs = this.buffs.filter(b => b.duration > 0);
        this.calculateSpeed();
    }

    resetActionValue() {
        this.actionValue = 10000 / this.speed;
    }

    advanceAction(percent) {
        // 行動順短縮 (現在の速度基準の基本AVに対してpercent分短縮)
        const baseAV = 10000 / this.speed;
        this.actionValue = Math.max(0, this.actionValue - (baseAV * percent));
    }

    gainEP(baseAmount) {
        if (this.isEnemy) return;
        // 非標準リソース (例: 黄泉の残夢 resource.kind='nihility_charge') を持つキャラは
        // 通常攻撃/戦闘スキルの energyGain では加算しない。
        // リソースの蓄積は各キャラ側 hook (onSkillUse/onAllySkillUse 等) で行う。
        if (this.resource?.kind && this.resource.kind !== 'energy') return;
        this.currentEP = Math.min(this.maxEP, this.currentEP + baseAmount * this.err);
    }
}

// ES Modules (bootstrap.js) からも new Entity() できるようにグローバルへ公開
if (typeof window !== 'undefined') window.Entity = Entity;

document.addEventListener('DOMContentLoaded', () => {
    let entities = [];
    const state = {
        currentAV: 0,
        activeEntity: null,
        phase: 'SETUP' // 'SETUP', 'WAITING_ACTION', 'ACTION_FINISHED'
    };

    let nextId = 1;

    // Elements

    const charList = document.getElementById('char-list');
    const startBtn = document.getElementById('start-combat-btn');
    
    const combatSetupPanel = document.getElementById('combat-setup-panel');
    const combatArea = document.getElementById('combat-area');
    const timeline = document.getElementById('timeline');
    const currentAvDisplay = document.getElementById('current-av-display');
    const activeActorName = document.getElementById('active-actor-name');
    const activeActorSpd = document.getElementById('active-actor-spd');
    const activeActorBuffs = document.getElementById('active-actor-buffs');
    
    const btnAttack = document.getElementById('btn-attack');
    const btnSkill = document.getElementById('btn-skill');
    const btnNextTurn = document.getElementById('btn-next-turn');
    
    const btnEndCombat = document.getElementById('btn-end-combat');
    const statusModal = document.getElementById('status-modal');
    const closeStatusModal = document.getElementById('close-status-modal');
    const statusModalName = document.getElementById('status-modal-name');
    const statusModalBody = document.getElementById('status-modal-body');



    // ---- 保存ビルドからの読み込み(Feature 2) ----
    const buildLoaderSelect  = document.getElementById('build-loader-select');
    const buildLoaderAdd     = document.getElementById('build-loader-add');
    const buildLoaderRefresh = document.getElementById('build-loader-refresh');

    function enhanceBuildLoaderSelect() {
        window.SRSIM?.UI?.SmartPicker?.enhanceSelect(buildLoaderSelect, {
            kind: 'build',
            placeholder: 'ビルド名 / キャラ名で検索',
            noResultsText: '該当ビルドなし',
            recentKey: 'srsim.recent.combatBuilds',
            getOptionMeta(option) {
                const build = window.SRSIM?.Build?.get(option.value);
                const ch = build ? window.SRSIM?.Registry?.character.get(build.characterId) : null;
                return {
                    label: option.textContent.trim() || option.value || '(未選択)',
                    subLabel: build?.id || '',
                    searchText: [option.textContent, option.value, build?.name, ch?.name, ch?.id].join(' '),
                    chips: ch ? [{ label: ch.name, tone: 'character' }] : [],
                };
            },
        });
    }

    function refreshBuildLoaderList() {
        if (!buildLoaderSelect) return;
        if (!window.SRSIM?.Build) {
            buildLoaderSelect.innerHTML = '<option value="">(SRSIM 未初期化)</option>';
            enhanceBuildLoaderSelect();
            return;
        }
        const builds = window.SRSIM.Build.list();
        if (!builds.length) {
            buildLoaderSelect.innerHTML = '<option value="">(保存ビルドなし — 限界効用逓減タブで保存してください)</option>';
            enhanceBuildLoaderSelect();
            return;
        }
        buildLoaderSelect.innerHTML = builds
            .sort((a, b) => (b.meta?.updatedAt || '').localeCompare(a.meta?.updatedAt || ''))
            .map(b => {
                const ch = window.SRSIM.Registry.character.get(b.characterId);
                return `<option value="${escapeSimulatorHtml(b.id)}">${escapeSimulatorHtml(b.name || '(無名)')} — ${escapeSimulatorHtml(ch?.name || b.characterId)}</option>`;
            }).join('');
        enhanceBuildLoaderSelect();
    }

    if (buildLoaderRefresh) {
        buildLoaderRefresh.addEventListener('click', refreshBuildLoaderList);
    }

    if (buildLoaderAdd) {
        buildLoaderAdd.addEventListener('click', () => {
            if (!window.SRSIM?.buildToEntity) {
                alert('ビルドシステムが未初期化です');
                return;
            }
            if (entities.filter(e => !e.isEnemy).length >= 4) {
                alert('パーティメンバーは最大4名までです');
                return;
            }
            const id = buildLoaderSelect.value;
            if (!id) { alert('読み込むビルドを選択してください'); return; }
            const build = window.SRSIM.Build.get(id);
            if (!build) { alert('ビルドが見つかりません'); return; }
            try {
                const entity = window.SRSIM.buildToEntity(build, { id: `c${nextId++}` });
                entities.push(entity);
                updateSetupList();
            } catch (err) {
                alert('ビルドの追加に失敗: ' + err.message);
                console.error(err);
            }
        });
    }

    // 初期表示(モジュール起動を待ってから)
    setTimeout(refreshBuildLoaderList, 0);

    function cloneJson(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function serializeCombatEntity(entity) {
        return {
            id: entity.id,
            name: entity.name,
            isEnemy: entity.isEnemy,
            isSummon: entity.isSummon,
            baseSpd: entity.baseSpd,
            bonusSpd: entity.bonusSpd,
            maxEP: entity.maxEP,
            currentEP: entity.currentEP,
            err: entity.err,
            equipment: cloneJson(entity.equipment || {}),
            buffs: cloneJson(entity.buffs || []),
            actionValue: entity.actionValue,
            speed: entity.speed,
            maxHP: entity.maxHP,
            currentHP: entity.currentHP,
            marks: cloneJson(entity.marks || {}),
            resource: cloneJson(entity.resource || null),
            build: entity.build ? cloneJson(entity.build) : null,
            setCounts: cloneJson(entity.setCounts || {}),
        };
    }

    function restoreCombatEntity(raw) {
        let entity;
        if (raw.build && window.SRSIM?.buildToEntity) {
            entity = window.SRSIM.buildToEntity(raw.build, { id: raw.id });
        } else {
            entity = new Entity(
                raw.id,
                raw.name || raw.id,
                Boolean(raw.isEnemy),
                Number(raw.baseSpd) || 100,
                Number(raw.bonusSpd) || 0,
                Number(raw.maxEP) || 0,
                (Number(raw.err) || 0) * 100,
                raw.equipment || { lc: 'none', relic1: 'none', relic2: 'none', ornament: 'none' },
            );
        }
        entity.id = raw.id || entity.id;
        entity.name = raw.name || entity.name;
        entity.isEnemy = Boolean(raw.isEnemy);
        entity.isSummon = Boolean(raw.isSummon);
        entity.currentEP = Number.isFinite(raw.currentEP) ? raw.currentEP : entity.currentEP;
        entity.maxEP = Number.isFinite(raw.maxEP) ? raw.maxEP : entity.maxEP;
        entity.maxHP = Number.isFinite(raw.maxHP) ? raw.maxHP : entity.maxHP;
        entity.currentHP = Number.isFinite(raw.currentHP) ? raw.currentHP : entity.currentHP;
        entity.buffs = Array.isArray(raw.buffs) ? raw.buffs : [];
        entity.marks = raw.marks && typeof raw.marks === 'object' ? raw.marks : {};
        entity.resource = raw.resource || entity.resource;
        entity.setCounts = raw.setCounts || entity.setCounts || {};
        entity.calculateSpeed();
        entity.actionValue = Number.isFinite(raw.actionValue) ? raw.actionValue : entity.actionValue;
        return entity;
    }

    function getCombatLocalState() {
        return {
            schema: 'srsim.combat.v1',
            nextId,
            state: {
                currentAV: state.currentAV,
                phase: state.phase,
                activeEntityId: state.activeEntity?.id || null,
            },
            entities: entities.map(serializeCombatEntity),
        };
    }

    function applyCombatLocalState(payload) {
        const source = payload && typeof payload === 'object' && payload.state && payload.entities
            ? payload
            : payload?.combat || null;
        if (!source || !Array.isArray(source.entities)) throw new Error('戦闘シミュJSONではありません。');
        entities = source.entities.map(restoreCombatEntity);
        nextId = Math.max(
            Number(source.nextId) || 1,
            ...entities.map(entity => {
                const m = String(entity.id || '').match(/(\d+)$/);
                return m ? Number(m[1]) + 1 : 1;
            }),
        );
        state.currentAV = Number(source.state?.currentAV) || 0;
        state.phase = source.state?.phase || 'SETUP';
        state.activeEntity = entities.find(entity => entity.id === source.state?.activeEntityId) || null;
        if (state.phase === 'SETUP' || !state.activeEntity) {
            state.phase = 'SETUP';
            combatArea.style.display = 'none';
            combatSetupPanel.style.display = 'block';
            updateSetupList();
        } else {
            combatSetupPanel.style.display = 'none';
            combatArea.style.display = 'block';
            window.updateUI();
        }
    }

    function updateSetupList() {
        charList.innerHTML = '';

        const mapName = (v) => {
            if (window.SRSIM?.Registry) {
                const r = window.SRSIM.Registry;
                return r.lightcone.get(v)?.name
                    || r.relicSet.get(v)?.name
                    || r.ornament.get(v)?.name
                    || (v === 'none' ? 'なし' : v);
            }
            // Fallback (旧UI用)
            if(v === 'none') return 'なし';
            if(v === 'Eagle of Twilight Line' || v === 'eagle') return '昼夜の狭間を翔ける鷹';
            if(v === 'Messenger Traversing Hackerspace' || v === 'messenger') return 'メッセンジャー';
            if(v === 'Dance! Dance! Dance!') return 'ダンス';
            if(v === 'Sprightly Vonwacq' || v === 'vonwacq') return '生命のウェンワーク';
            return v;
        };

        entities.forEach(e => {
            if (e.isEnemy) return;
            const div = document.createElement('div');
            div.className = 'setup-char-item';
            div.style.display = 'flex';
            div.style.justifyContent = 'space-between';
            div.style.alignItems = 'center';

            let detailHtml;
            if (e.finalStats) {
                // ビルド経由の Entity: 完全ステを表示
                const d = e.finalStats.derived;
                const ch = window.SRSIM.Registry.character.get(e.build.characterId);
                const lcName = e.build.lightcone?.id ? mapName(e.build.lightcone.id) : 'なし';
                detailHtml = `
                    <strong>${escapeSimulatorHtml(e.name)}</strong>
                    <span class="build-tag">ビルド</span>
                    <span style="font-size: 0.85rem; color: var(--text-muted); margin-left: 10px;">
                        ${escapeSimulatorHtml(ch?.name || '')} | SPD ${d.spd.toFixed(1)} | ATK ${d.atk.toFixed(0)} | HP ${d.hp.toFixed(0)} | CR ${(d.critRate*100).toFixed(1)}% | CD ${(d.critDmg*100).toFixed(1)}% | 円錐:${escapeSimulatorHtml(lcName)}
                    </span>
                `;
            } else {
                // 旧UI入力の Entity: 装備フラグから簡易表示
                const lcName = mapName(e.equipment.lc);
                const r1 = mapName(e.equipment.relic1);
                const r2 = mapName(e.equipment.relic2);
                const relicName = (r1 === r2) ? (r1 === 'なし' ? 'なし' : `${r1}4`) : `${r1}2+${r2}2`;
                const ornamentName = mapName(e.equipment.ornament);
                detailHtml = `
                    <strong>${escapeSimulatorHtml(e.name)}</strong>
                    <span style="font-size: 0.85rem; color: var(--text-muted); margin-left: 10px;">
                        合計速度:${e.speed.toFixed(1)} | 円錐:${escapeSimulatorHtml(lcName)} | 遺物:${escapeSimulatorHtml(relicName)} | オーナメント:${escapeSimulatorHtml(ornamentName)}
                    </span>
                `;
            }

            div.innerHTML = `
                <div>${detailHtml}</div>
                <button class="delete-char-btn" data-id="${escapeSimulatorHtml(e.id)}" style="background: transparent; border: 1px solid #ff6b6b; color: #ff6b6b; border-radius: 4px; padding: 3px 8px; cursor: pointer; font-size: 0.8rem;" onmouseover="this.style.backgroundColor='rgba(255,107,107,0.1)'" onmouseout="this.style.backgroundColor='transparent'">削除</button>
            `;

            div.querySelector('.delete-char-btn').addEventListener('click', (ev) => {
                const targetId = ev.target.getAttribute('data-id');
                entities = entities.filter(ent => ent.id !== targetId);
                div.remove();
            });

            charList.appendChild(div);
        });
        window.SRSIM_LOCAL?.markDirty('combat');
    }

    // 戦闘開始
    startBtn.addEventListener('click', () => {
        if (entities.length === 0) return alert('キャラクターを追加してください');

        // ダミー敵の追加
        entities.push(new Entity('e1', 'ダミーエネミーA', true, 120, 0, 0, 0, 'none'));
        entities.push(new Entity('e2', 'ダミーエネミーB', true, 100, 0, 0, 0, 'none'));

        state.phase = 'WAITING_ACTION';
        state.currentAV = 0;

        // 戦闘開始フック (onCombatStart) を全味方に対して発火
        const allies = entities.filter(e => !e.isEnemy);
        const enemies = entities.filter(e => e.isEnemy);
        for (const ally of allies) {
            if (!Array.isArray(ally.hooks?.onCombatStart)) continue;
            const ctx = { self: ally, allies, enemies };
            for (const h of ally.hooks.onCombatStart) {
                try { h.fn(ctx); } catch (err) { console.error(`[combatStart hook ${h.source}]`, err); }
            }
        }

        combatSetupPanel.style.display = 'none';
        combatArea.style.display = 'block';

        nextTurn();
    });

    // 戦闘終了
    btnEndCombat.addEventListener('click', () => {
        if (!confirm('戦闘を終了して設定画面に戻りますか？')) return;
        
        // 敵を削除し、味方のステータスをリセット
        entities = entities.filter(e => !e.isEnemy && !e.isSummon);
        entities.forEach(e => {
            e.currentEP = 50;
            e.currentHP = e.maxHP;
            e.buffs = [];
            e.calculateSpeed();
            e.resetActionValue();
        });
        
        state.phase = 'SETUP';
        
        combatArea.style.display = 'none';
        combatSetupPanel.style.display = 'block';
    });

    const btnTestDamage = document.getElementById('btn-test-damage');
    if (btnTestDamage) {
        btnTestDamage.addEventListener('click', () => {
            window.consumeAlliesHP(0.3); // 30%のHPを消費
        });
    }

    const btnTestHeal = document.getElementById('btn-test-heal');
    if (btnTestHeal) {
        btnTestHeal.addEventListener('click', () => {
            window.healAllies(1000); // 1000回復
        });
    }

    // モーダルを閉じる
    closeStatusModal.addEventListener('click', () => {
        statusModal.style.display = 'none';
    });

    window.openStatus = function(id) {
        const entity = entities.find(e => e.id === id);
        if (!entity) return;
        
        statusModalName.textContent = entity.name;
        
        let buffsHtml = entity.buffs.length === 0 ? '<span style="color: var(--text-muted)">なし</span>' : '';
        entity.buffs.forEach(b => {
            const buffName = b.name === 'messenger_spd' ? '速度+12% (メッセンジャー)' : b.name;
            buffsHtml += `<span class="buff-badge" style="margin-right: 5px; margin-bottom: 5px; display: inline-block;">${escapeSimulatorHtml(buffName)} (${b.duration}T)</span>`;
        });

        // ビルド経由の場合は完全ステ、そうでなければ簡易表示
        let statsHtml = '';
        if (entity.finalStats) {
            const d = entity.finalStats.derived;
            statsHtml = `
                <div class="status-item"><span>攻撃力</span><strong>${d.atk.toFixed(1)}</strong></div>
                <div class="status-item"><span>最大HP</span><strong>${d.hp.toFixed(1)}</strong></div>
                <div class="status-item"><span>現在HP</span><strong>${entity.currentHP.toFixed(1)}</strong></div>
                <div class="status-item"><span>防御力</span><strong>${d.def.toFixed(1)}</strong></div>
                <div class="status-item"><span>会心率</span><strong>${(d.critRate*100).toFixed(2)}%</strong></div>
                <div class="status-item"><span>会心ダメージ</span><strong>${(d.critDmg*100).toFixed(2)}%</strong></div>
                <div class="status-item"><span>自属性ダメ枠</span><strong>${(d.dmgOwnElement*100).toFixed(2)}%</strong></div>
                <div class="status-item"><span>撃破特効</span><strong>${((d.breakEffectPct-1)*100).toFixed(2)}%</strong></div>
            `;
        }

        // 装備セクション (ビルド経由ならビルドから、旧UIなら equipment フラグから)
        let equipHtml = '';
        if (entity.build && window.SRSIM?.Registry) {
            const r = window.SRSIM.Registry;
            const lcName = entity.build.lightcone?.id ? r.lightcone.get(entity.build.lightcone.id)?.name : 'なし';
            const setCounts = entity.setCounts || {};
            const setSummary = Object.entries(setCounts).map(([id, n]) => {
                const name = r.relicSet.get(id)?.name || r.ornament.get(id)?.name || id;
                return `${name} ${n}pc`;
            }).join(' / ') || 'なし';
            equipHtml = `
                <div class="status-item" style="flex-direction: column; align-items: flex-start; gap: 4px;">
                    <span style="color:var(--text-muted); font-size:0.8rem;">光円錐: ${escapeSimulatorHtml(lcName)} (重畳${entity.build.lightcone?.superimpose ?? '-'})</span>
                    <span style="color:var(--text-muted); font-size:0.8rem;">セット: ${escapeSimulatorHtml(setSummary)}</span>
                </div>
            `;
        } else if (entity.equipment) {
            equipHtml = `
                <div class="status-item" style="flex-direction: column; align-items: flex-start; gap: 4px;">
                    <span style="color:var(--text-muted); font-size:0.8rem;">光円錐: ${entity.equipment?.lc === 'Dance! Dance! Dance!' ? 'ダンス！ダンス！ダンス！' : 'なし'}</span>
                    <span style="color:var(--text-muted); font-size:0.8rem;">遺物1: ${entity.equipment?.relic1 === 'Eagle of Twilight Line' || entity.equipment?.relic1 === 'eagle' ? '昼夜の狭間を翔ける鷹' : entity.equipment?.relic1 === 'Messenger Traversing Hackerspace' || entity.equipment?.relic1 === 'messenger' ? 'メッセンジャー' : 'なし'}</span>
                    <span style="color:var(--text-muted); font-size:0.8rem;">遺物2: ${entity.equipment?.relic2 === 'Eagle of Twilight Line' || entity.equipment?.relic2 === 'eagle' ? '昼夜の狭間を翔ける鷹' : entity.equipment?.relic2 === 'Messenger Traversing Hackerspace' || entity.equipment?.relic2 === 'messenger' ? 'メッセンジャー' : 'なし'}</span>
                    <span style="color:var(--text-muted); font-size:0.8rem;">オーナメント: ${entity.equipment?.ornament === 'Sprightly Vonwacq' || entity.equipment?.ornament === 'vonwacq' ? '生命のウェンワーク' : 'なし'}</span>
                </div>
            `;
        }

        // リソース表示ラベル (黄泉=残夢, Castorice=新蕾, それ以外=EP)
        const resourceLabel = entity.resource?.displayName || 'EP';

        // marks (集真赤など per-entity stack) の HTML
        let marksHtml = '';
        if (entity.marks && Object.keys(entity.marks).length > 0) {
            const marksList = Object.entries(entity.marks)
                .filter(([, m]) => m.count > 0)
                .map(([, m]) => `<span class="buff-badge" style="margin-right:5px;">${escapeSimulatorHtml(m.displayName)} ${m.count}/${m.max}</span>`)
                .join('');
            if (marksList) {
                marksHtml = `
                    <div class="status-item" style="flex-direction: column; align-items: flex-start; gap: 8px;">
                        <span>マーク</span>
                        <div>${marksList}</div>
                    </div>
                `;
            }
        }

        statusModalBody.innerHTML = `
            ${statsHtml}
            <div class="status-item">
                <span>${escapeSimulatorHtml(resourceLabel)}</span>
                <strong>${Math.floor(entity.currentEP)} / ${entity.maxEP}</strong>
            </div>
            ${marksHtml}
            <div class="status-item">
                <span>速度</span>
                <strong>${entity.speed.toFixed(1)} <span style="font-size:0.8rem; color:var(--text-muted);">(基礎${entity.baseSpd} + 加算${entity.bonusSpd.toFixed(1)})</span></strong>
            </div>
            <div class="status-item">
                <span>残り行動値 (AV)</span>
                <strong>${entity.actionValue.toFixed(1)}</strong>
            </div>
            ${equipHtml}
            <div class="status-item" style="flex-direction: column; align-items: flex-start; gap: 8px;">
                <span>バフ・デバフ一覧</span>
                <div>${buffsHtml}</div>
            </div>
        `;
        
        statusModal.style.display = 'flex';
    };

    function nextTurn() {
        // 行動値の少ない順（＝行動順）にソート
        entities.sort((a, b) => a.actionValue - b.actionValue);
        const nextActor = entities[0];
        const elapsed = nextActor.actionValue;

        // 時間（AV）を進める
        if (elapsed > 0) {
            state.currentAV += elapsed;
            entities.forEach(e => {
                e.actionValue = Math.max(0, e.actionValue - elapsed);
            });
        }

        state.activeEntity = nextActor;
        state.phase = 'WAITING_ACTION';

        // ターン開始フック (onTurnStart) を発火
        if (Array.isArray(nextActor.hooks?.onTurnStart)) {
            const allies = entities.filter(e => !e.isEnemy);
            const enemies = entities.filter(e => e.isEnemy);
            const ctx = { self: nextActor, allies, enemies };
            for (const h of nextActor.hooks.onTurnStart) {
                try { h.fn(ctx); } catch (err) { console.error(`[turnStart hook ${h.source}]`, err); }
            }
        }

        updateUI();
    }

    // UIの描画更新
    window.updateUI = function() {
        window.SRSIM_LOCAL?.markDirty('combat');
        currentAvDisplay.textContent = state.currentAV.toFixed(1);
        
        // Timeline垂直描画 (AVの昇順)
        const sorted = [...entities].sort((a, b) => a.actionValue - b.actionValue);
        timeline.innerHTML = '';
        sorted.forEach(e => {
            const div = document.createElement('div');
            div.className = `timeline-item ${e.isEnemy ? 'enemy' : ''}`;
            if (e.id === state.activeEntity.id) {
                div.style.borderColor = 'var(--accent-gold)';
                div.style.backgroundColor = 'rgba(212, 175, 55, 0.2)';
            }
            div.innerHTML = `
                <div class="clickable-area" data-action="open-status" data-entity-id="${escapeSimulatorHtml(e.id)}" style="padding: 5px; border-radius: 4px;">
                    <div>${escapeSimulatorHtml(e.name)}</div>
                    <div class="timeline-av">${e.actionValue.toFixed(1)} AV</div>
                </div>
            `;
            div.querySelector('[data-action="open-status"]').addEventListener('click', () => window.openStatus(e.id));
            timeline.appendChild(div);
        });
        
        // 現在のアクター情報
        const actor = state.activeEntity;
        
        activeActorSpd.textContent = actor.speed.toFixed(1);
        
        activeActorBuffs.innerHTML = '';
        actor.buffs.forEach(b => {
            const span = document.createElement('span');
            span.className = 'buff-badge';
            span.textContent = `${b.name === 'messenger_spd' ? '速度+12%' : b.name} (${b.duration}T)`;
            activeActorBuffs.appendChild(span);
        });

        if (state.phase === 'WAITING_ACTION') {
            if (!actor.isEnemy) {
                activeActorName.textContent = actor.name;
                btnAttack.style.display = 'flex';
                btnSkill.style.display = 'flex';
                btnNextTurn.style.display = 'none';
            } else {
                activeActorName.textContent = `${actor.name} (敵のターン)`;
                btnAttack.style.display = 'none';
                btnSkill.style.display = 'none';
                btnNextTurn.style.display = 'block';
                btnNextTurn.textContent = '敵の行動を完了する';
            }
        } else if (state.phase === 'ACTION_FINISHED') {
            activeActorName.textContent = `${actor.name} (行動完了・待機中)`;
            btnAttack.style.display = 'none';
            btnSkill.style.display = 'none';
            btnNextTurn.style.display = 'block';
            btnNextTurn.textContent = '次の行動順へ進む (時間を進める)';
        }

        // Party HUD (Bottom Left)
        const partyHud = document.getElementById('party-hud');
        if (partyHud) {
            partyHud.innerHTML = '';
            entities.filter(e => !e.isEnemy && !e.isSummon).forEach((e, index) => {
                const isReady = e.currentEP >= e.maxEP;
                const epPercent = (e.currentEP / e.maxEP) * 100;
                const hpPercent = (e.currentHP / e.maxHP) * 100;
                const resourceText = e.resource?.displayName
                    ? `${e.resource.displayName} ${Math.floor(e.currentEP)}/${e.maxEP}`
                    : `EP ${Math.floor(e.currentEP)}/${e.maxEP}`;

                const div = document.createElement('div');
                div.className = 'char-hud-item';
                div.innerHTML = `
                    <button class="char-ult-btn ${isReady ? 'ready' : ''}" data-action="trigger-ult" data-entity-id="${escapeSimulatorHtml(e.id)}" ${!isReady ? 'disabled' : ''}>
                        必殺技
                    </button>
                    <div class="clickable-area" data-action="open-status" data-entity-id="${escapeSimulatorHtml(e.id)}" style="padding: 5px; border-radius: 4px; width: 100%; text-align: center;">
                        <div class="char-name-hud" style="color: ${e.id === actor.id ? 'var(--accent-gold)' : 'white'}; margin: 0 auto;">${escapeSimulatorHtml(e.name)}</div>
                        <div style="font-size: 0.7rem; color: var(--text-muted); margin-bottom: 2px;">${escapeSimulatorHtml(resourceText)}</div>
                        <div class="char-bars" style="margin: 0 auto;">
                            <div class="hp-bar"><div class="hp-fill" style="width: ${hpPercent}%"></div></div>
                            <div class="ep-bar"><div class="ep-fill" style="width: ${epPercent}%"></div></div>
                        </div>
                    </div>
                `;
                div.querySelector('[data-action="trigger-ult"]').addEventListener('click', () => window.triggerUlt(e.id));
                div.querySelector('[data-action="open-status"]').addEventListener('click', () => window.openStatus(e.id));
                partyHud.appendChild(div);
            });
        }
    }

    // 必殺技の割り込み発動 (グローバルから呼べるようにする)
    window.triggerUlt = function(id) {
        const actor = entities.find(e => e.id === id);
        if (!actor || actor.currentEP < actor.maxEP) return;

        // 必殺技消費
        actor.currentEP = 0;
        actor.gainEP(5); // 使用時の固定回復

        const allies = entities.filter(e => !e.isEnemy);
        const enemies = entities.filter(e => e.isEnemy);

        if (actor.hooks !== undefined) {
            // 新形態: buildToEntity 経由で hooks が紐付いている Entity は
            //         data/ 配下の hook 定義経由でディスパッチする。
            const ctx = { self: actor, allies, enemies };
            const onUltUse = actor.hooks?.onUltUse;
            if (Array.isArray(onUltUse)) {
                for (const h of onUltUse) {
                    try { h.fn(ctx); }
                    catch (err) { console.error(`[ult hook ${h.source}]`, err); }
                }
            }
            // 必殺もアクションとして onAllySkillUse を発火 (簡易版)
            dispatchAllySkillUse(actor, allies, enemies);
        } else {
            // 旧形態: 旧UIで直接生成された Entity 向けハードコード経路
            // 鷹4セット
            if (actor.hasEagle4) actor.advanceAction(0.25);
            // ダンス・ダンス・ダンス (重畳指定なしのため S1 = 16% を採用)
            if (actor.hasDDD) allies.forEach(ally => ally.advanceAction(0.16));
            // メッセンジャー4セット
            if (actor.hasMessenger4) {
                allies.forEach(ally => ally.addBuff({ name: 'messenger_spd', spdMod: 0.12, duration: 1 }));
            }
        }

        // 再描画 (行動値が変化している可能性があるため)
        window.updateUI();
    };

    // キャストリス用・味方のHP消費関数 (フックから呼べるようにする)
    window.consumeAlliesHP = function(ratio) {
        const allies = entities.filter(e => !e.isEnemy && !e.isSummon);
        let totalConsumed = 0;
        
        allies.forEach(ally => {
            const consumed = ally.currentHP * ratio;
            ally.currentHP = Math.max(1, ally.currentHP - consumed);
            totalConsumed += consumed;
        });

        // キャストリスがいる場合、新蕾を増やす
        const castorice = allies.find(e => e.build && e.build.characterId === 'castorice');
        if (castorice) {
            const hasNetherwing = entities.some(e => e.isSummon && e.name === '死竜');
            if (!hasNetherwing) {
                castorice.currentEP = Math.min(castorice.maxEP, castorice.currentEP + totalConsumed);
            }
        }
        window.updateUI();
    };

    // キャストリス用・味方の回復（治癒）関数
    window.healAllies = function(amount) {
        const allies = entities.filter(e => !e.isEnemy && !e.isSummon);
        let totalHealed = 0;
        
        allies.forEach(ally => {
            const before = ally.currentHP;
            ally.currentHP = Math.min(ally.maxHP, ally.currentHP + amount);
            const actualHealed = ally.currentHP - before;
            totalHealed += actualHealed;
        });

        // キャストリスがいる場合、新蕾を増やす
        const castorice = allies.find(e => e.build && e.build.characterId === 'castorice');
        if (castorice) {
            const hasNetherwing = entities.some(e => e.isSummon && e.name === '死竜');
            if (!hasNetherwing) {
                // 治癒量の100%を新蕾に変換 (簡易化のため上限処理は省略)
                castorice.currentEP = Math.min(castorice.maxEP, castorice.currentEP + totalHealed);
            }
        }
        window.updateUI();
    };

    // 特殊召喚関数 (フックから呼べるようにする)
    window.summonEntity = function(name, speed) {
        const summon = new Entity(`summon_${nextId++}`, name, false, speed, 0, 0, 0, 'none');
        summon.isSummon = true;
        summon.actionValue = 0; // 行動順を100%早める（即時行動）
        entities.push(summon);
        window.updateUI();
    };

    // ---- マーク管理 (集真赤 / 持続デバフスタック) -----------------------
    // entity.marks[markType] = { count, max, displayName }
    //   黄泉用に追加。汎用 per-entity スタックなので他キャラからも使える。
    function ensureMark(entity, markType, max, displayName) {
        if (!entity.marks[markType]) {
            entity.marks[markType] = { count: 0, max: max ?? 99, displayName: displayName ?? markType };
        }
        if (typeof max === 'number')         entity.marks[markType].max = max;
        if (typeof displayName === 'string') entity.marks[markType].displayName = displayName;
        return entity.marks[markType];
    }

    window.applyMark = function(entityId, markType, amount = 1, opts = {}) {
        const target = entities.find(e => e.id === entityId);
        if (!target) return 0;
        const m = ensureMark(target, markType, opts.max, opts.displayName);
        const before = m.count;
        m.count = Math.min(m.max, m.count + amount);
        window.updateUI?.();
        return m.count - before;
    };

    window.consumeMarks = function(entityId, markType, maxConsume) {
        const target = entities.find(e => e.id === entityId);
        if (!target) return 0;
        const m = target.marks?.[markType];
        if (!m || m.count <= 0) return 0;
        const consumed = Math.min(m.count, maxConsume ?? m.count);
        m.count -= consumed;
        window.updateUI?.();
        return consumed;
    };

    window.getMarkCount = function(entityId, markType) {
        const target = entities.find(e => e.id === entityId);
        return target?.marks?.[markType]?.count ?? 0;
    };

    // 集真赤の引き継ぎ用: 退場した敵の mark を、同 mark の最多保持敵に移す。
    // 現状 simulator では敵撃破が起きないため呼び出し側用ヘルパとしてだけ提供。
    window.transferMarksOnExit = function(exitingId, markType) {
        const exiting = entities.find(e => e.id === exitingId);
        if (!exiting) return;
        const stash = exiting.marks?.[markType]?.count ?? 0;
        if (stash <= 0) return;
        // 同じマークの最多保持敵を探す (退場本人は除外)
        const candidates = entities.filter(e => e.isEnemy && e.id !== exitingId && (e.marks?.[markType]?.count ?? 0) > 0);
        candidates.sort((a, b) => (b.marks[markType].count) - (a.marks[markType].count));
        const heir = candidates[0] || entities.find(e => e.isEnemy && e.id !== exitingId);
        if (!heir) return;
        const m = ensureMark(heir, markType, exiting.marks[markType].max, exiting.marks[markType].displayName);
        m.count = Math.min(m.max, m.count + stash);
        delete exiting.marks[markType];
        window.updateUI?.();
    };

    // ターン消費アクション (通常攻撃・戦闘スキル)
    btnAttack.addEventListener('click', () => {
        executeTurnAction('attack');
    });
    btnSkill.addEventListener('click', () => {
        executeTurnAction('skill');
    });

    btnNextTurn.addEventListener('click', () => {
        if (state.phase === 'WAITING_ACTION' && state.activeEntity.isEnemy) {
            // 敵の行動処理
            state.activeEntity.tickBuffs();
            state.activeEntity.resetActionValue();
            state.phase = 'ACTION_FINISHED';
            window.updateUI();
        } else if (state.phase === 'ACTION_FINISHED') {
            // 次のターンへ時間を進める
            nextTurn();
        }
    });

    // 任意の味方が行動した時、他味方の onAllySkillUse フックを発火させる。
    // 簡易版: per-turn ガードなし / デバフ判定なし。
    // 厳密には HSR 仕様で「攻撃時にデバフ付与された場合のみ +1, 1行動1回まで」だが、
    // 工数判断で雑表現として実装。actor 自身の onSkillUse とは別経路。
    function dispatchAllySkillUse(actor, allies, enemies) {
        for (const ally of allies) {
            if (ally === actor) continue;
            if (!Array.isArray(ally.hooks?.onAllySkillUse)) continue;
            const ctx = { self: ally, actor, allies, enemies };
            for (const h of ally.hooks.onAllySkillUse) {
                try { h.fn(ctx); } catch (err) { console.error(`[onAllySkillUse hook ${h.source}]`, err); }
            }
        }
    }

    function executeTurnAction(type) {
        const actor = state.activeEntity;

        const allies = entities.filter(e => !e.isEnemy);
        const enemies = entities.filter(e => e.isEnemy);
        const ctx = { self: actor, allies, enemies };

        if (type === 'attack') {
            actor.gainEP(20);
            if (actor.hooks?.onAttackUse) {
                for (const h of actor.hooks.onAttackUse) {
                    try { h.fn(ctx); } catch (err) { console.error(`[attack hook ${h.source}]`, err); }
                }
            }
            dispatchAllySkillUse(actor, allies, enemies);
        }
        else if (type === 'skill') {
            actor.gainEP(30);
            if (actor.hooks?.onSkillUse) {
                for (const h of actor.hooks.onSkillUse) {
                    try { h.fn(ctx); } catch (err) { console.error(`[skill hook ${h.source}]`, err); }
                }
            }
            dispatchAllySkillUse(actor, allies, enemies);
        }
        
        // ターン終了処理
        actor.tickBuffs();
        actor.resetActionValue();
        
        // 状態を行動完了に変更し、手動で次に進むのを待つ
        state.phase = 'ACTION_FINISHED';
        window.updateUI(); 
    }

    window.SRSIM_LOCAL?.registerTab({
        tab: 'combat',
        label: '戦闘シミュ',
        mount: '#tab-combat',
        schema: 'srsim.combat.v1',
        getState: getCombatLocalState,
        applyState: applyCombatLocalState,
    });
});
