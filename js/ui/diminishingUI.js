// diminishingUI.js — 限界効用逓減タブのUIロジック
//
// 構成:
//   1. キャラ・光円錐パネル (+ 軌跡レベル指定 + 無凸MAX/凸後MAXプリセット)
//   2. 遺物 各部位パネル (個別調整)
//   3. セット効果プリセットパネル (4セット / 2+2 / 単一planar の一括適用)
//   4. サブステ合計パネル
//   5. 計算オプションパネル
//   6. 結果パネル(スナップショット未取得時は単独表示)
//   7. キャラ詳細アコーディオン(通常/スキル/必殺/天賦/秘技/追加能力/星魂/軌跡内訳)
//
// SPD変化は情報表示のみで火力換算しない(memory: project_diminishing_scope)。

import { Registry } from '../build/registry.js';
import { StatComputer, countSetsByType } from '../build/statComputer.js';
import { Diminishing } from '../build/diminishing.js';
import { Build as BuildStore } from '../build/buildStore.js';
import {
    ALL_SLOTS, RELIC_SLOTS, ORNAMENT_SLOTS, SLOT, SET_TYPE, SLOT_TO_SET_TYPE,
} from '../build/constants.js';
import { RELIC_MAIN_OPTIONS } from '../build/relicMainTable.js';
import { STAT } from '../build/statKeys.js';
import {
    getSkillMaxLevel, getSkillMultAt, clampLevel,
    presetDefaultMaxLevels, presetEidolonMaxLevels,
} from '../build/skillUtil.js';

// ---- UI で扱う「サブステ合計」入力フィールド定義 -----------------------

const SUB_INPUTS = [
    { key: STAT.ATK_PERCENT,       label: '攻撃力%',   unit: '%',   asPercent: true  },
    { key: STAT.HP_PERCENT,        label: 'HP%',       unit: '%',   asPercent: true  },
    { key: STAT.DEF_PERCENT,       label: '防御力%',   unit: '%',   asPercent: true  },
    { key: STAT.SPD_FLAT,          label: '速度',      unit: '',    asPercent: false },
    { key: STAT.ATK_FLAT,          label: '攻撃力固定', unit: '',    asPercent: false },
    { key: STAT.HP_FLAT,           label: 'HP固定',    unit: '',    asPercent: false },
    { key: STAT.DEF_FLAT,          label: '防御力固定', unit: '',    asPercent: false },
    { key: STAT.CRIT_RATE,         label: '会心率',    unit: '%',   asPercent: true  },
    { key: STAT.CRIT_DMG,          label: '会心ダメ',  unit: '%',   asPercent: true  },
    { key: STAT.EFFECT_HIT_RATE,   label: '効果命中',  unit: '%',   asPercent: true  },
    { key: STAT.EFFECT_RES,        label: '効果抵抗',  unit: '%',   asPercent: true  },
    { key: STAT.BREAK_EFFECT,      label: '撃破特効',  unit: '%',   asPercent: true  },
];

const SUB_LABEL_PREFIX = 'サブステ.';
const PARTY_LABEL_PREFIX = 'パーティ.';   // envBuffs のラベル識別子

const PARTY_SLOTS = 3;   // focus 以外のチームメンバー枠数

// スキルキーの表示順 / 表示名
const SKILL_DISPLAY_ORDER = ['basic', 'skill', 'ult', 'talent', 'technique'];
const SKILL_LABELS = {
    basic:     '通常攻撃',
    skill:     '戦闘スキル',
    ult:       '必殺技',
    talent:    '天賦',
    technique: '秘技',
};

// 軌跡レベル指定対象 (technique はLv非対応のため除外)
const LEVEL_KEYS = ['basic', 'skill', 'ult', 'talent'];

// ---- 状態 --------------------------------------------------------------

const state = {
    build: null,
    snapshot: null,
    options: { ...Diminishing.DEFAULT_OPTIONS },
    // パーティ枠: focus 以外のメンバー × 3
    //   各要素: {
    //     characterId: string|null,           簡易モード用 (キャラ select の値)
    //     levelPreset: 'default'|'eidolon',   簡易モード用 (無凸MAX / 凸後MAX)
    //     buildId: string|null,                ビルドモード用 (BuildStore の id、優先)
    //     activeEffectIds: Set<string>,        合成ID: 'char.<id>' | 'lc.<id>' | 'set:<setId>:pc2.<id>' 等
    //   }
    party: [
        { mode: 'simple', characterId: null, levelPreset: 'eidolon', buildId: null, activeEffectIds: new Set() },
        { mode: 'simple', characterId: null, levelPreset: 'eidolon', buildId: null, activeEffectIds: new Set() },
        { mode: 'simple', characterId: null, levelPreset: 'eidolon', buildId: null, activeEffectIds: new Set() },
    ],
};

// ---- エントリ ----------------------------------------------------------

export function initDiminishingUI() {
    const root = document.getElementById('tab-diminishing');
    if (!root) return;

    const firstCharId = Registry.character.ids().find(id => id !== 'template') || Registry.character.ids()[0];
    if (!firstCharId) {
        root.innerHTML = '<p style="color: var(--text-muted)">キャラクターデータが登録されていません。</p>';
        return;
    }
    state.build = BuildStore.blank(firstCharId);
    state.build.name = '比較ビルド';
    // 軌跡Lv は無凸MAX で初期化
    state.build.traceLevel = presetDefaultMaxLevels(Registry.character.get(firstCharId));

    root.innerHTML = renderShell();
    bindAll();
    refreshAllForms();
    recompute();
}

// ---- HTML 骨組み -------------------------------------------------------

function renderShell() {
    return `
        <div class="dim-container">
            <h2 class="dim-title">限界効用逓減計算機</h2>
            <p class="dim-help">
                ビルドを編集 → <b>「現状をスナップショット」</b>で比較基準を固定 →
                ビルドの一部を変更 → 火力貢献率が自動表示されます。
                <br><span style="color: var(--text-muted)">※ SPD変化は情報表示のみ。行動回数の影響は「速度・行動回数」タブで別途確認してください。</span>
            </p>

            <div class="dim-build-mgr">
                <h3 class="dim-build-mgr-title">ビルド管理</h3>
                <div class="dim-build-mgr-row">
                    <label>名前</label>
                    <input id="dim-build-name" type="text" placeholder="ビルド名" value="">
                    <button id="dim-build-save" class="btn-primary btn-mini">保存 / 上書き</button>
                    <button id="dim-build-new" class="btn-secondary btn-mini">新規 (クリア)</button>
                </div>
                <div class="dim-build-mgr-row">
                    <label>保存済み</label>
                    <select id="dim-build-list"></select>
                    <button id="dim-build-load" class="btn-secondary btn-mini">読込</button>
                    <button id="dim-build-delete" class="btn-secondary btn-mini">削除</button>
                </div>
                <div class="dim-build-mgr-row">
                    <button id="dim-build-export" class="btn-secondary btn-mini">JSON書出</button>
                    <button id="dim-build-import" class="btn-secondary btn-mini">JSON読込</button>
                </div>
                <div id="dim-build-json-area" class="dim-build-json-area" style="display:none">
                    <textarea id="dim-build-json-text" rows="6" placeholder="JSONをここに貼り付け / 書出時はここに表示"></textarea>
                    <div class="dim-build-mgr-row">
                        <button id="dim-build-json-apply" class="btn-primary btn-mini">適用 (merge)</button>
                        <button id="dim-build-json-close" class="btn-secondary btn-mini">閉じる</button>
                    </div>
                </div>
            </div>

            <div class="dim-controls">
                <button id="dim-snapshot-btn" class="btn-primary">現状をスナップショットして比較開始</button>
                <button id="dim-clear-btn" class="btn-secondary">スナップショットをクリア</button>
                <span id="dim-snapshot-status" class="dim-snapshot-status">スナップショット: なし</span>
            </div>

            <div class="dim-grid">
                <div class="dim-panel">
                    <h3>キャラ・光円錐</h3>
                    <div class="dim-row">
                        <label>キャラ</label>
                        <select id="dim-char"></select>
                    </div>
                    <div class="dim-row">
                        <label>星魂</label>
                        <select id="dim-eidolon"></select>
                    </div>
                    <div class="dim-row">
                        <label>光円錐</label>
                        <select id="dim-lc"></select>
                    </div>
                    <div class="dim-row">
                        <label>重畳</label>
                        <select id="dim-lc-si"></select>
                    </div>

                    <h4 class="dim-subheading">軌跡レベル</h4>
                    <div class="dim-level-presets">
                        <button class="btn-secondary btn-mini" data-preset="default">無凸MAX</button>
                        <button class="btn-secondary btn-mini" data-preset="eidolon">凸後MAX</button>
                    </div>
                    <div id="dim-level-grid" class="dim-level-grid"></div>
                </div>

                <div class="dim-panel">
                    <h3>遺物</h3>
                    <h4 class="dim-subheading-inline">メインステ</h4>
                    <div class="dim-relic-main-grid">
                        ${ALL_SLOTS.map(slot => `
                            <div class="dim-relic-slot">
                                <label>${slotLabel(slot)}</label>
                                <select class="dim-relic-main" data-slot="${slot}"></select>
                            </div>
                        `).join('')}
                    </div>

                    <h4 class="dim-subheading">セット効果(一括選択)</h4>
                    <p class="dim-panel-hint">セットを選ぶと自動で各部位に適用されます。</p>

                    <div class="dim-preset-block">
                        <div class="dim-preset-mode">
                            <label class="dim-radio"><input type="radio" name="cav-mode" value="4set" checked> 洞窟 4セット</label>
                            <label class="dim-radio"><input type="radio" name="cav-mode" value="2+2"> 洞窟 2+2</label>
                            <label class="dim-radio"><input type="radio" name="cav-mode" value="individual"> 個別</label>
                            <label class="dim-radio"><input type="radio" name="cav-mode" value="none"> 装着なし</label>
                        </div>
                        <div id="dim-preset-cav4" class="dim-preset-row">
                            <label>洞窟セット</label>
                            <select id="dim-preset-cav-a"></select>
                        </div>
                        <div id="dim-preset-cav22" class="dim-preset-row" style="display:none">
                            <label>A (頭・手)</label>
                            <select id="dim-preset-cav-22a"></select>
                            <label>B (胴・足)</label>
                            <select id="dim-preset-cav-22b"></select>
                        </div>
                        <div id="dim-preset-cavInd" class="dim-preset-grid" style="display:none">
                            ${RELIC_SLOTS.map(slot => `
                                <div class="dim-preset-row">
                                    <label>${slotLabel(slot)}</label>
                                    <select class="dim-relic-set" data-slot="${slot}"></select>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="dim-preset-block">
                        <div class="dim-preset-row">
                            <label>次元界 (球・縄)</label>
                            <select id="dim-preset-planar"></select>
                        </div>
                    </div>
                </div>

                <div class="dim-panel dim-subs-panel">
                    <h3>サブステ合計</h3>
                    <p class="dim-panel-hint">遺物全体の副詞品集計値を入力 (% は数値で「25」と入力すると 25%)</p>
                    <div class="dim-subs-grid">
                        ${SUB_INPUTS.map(s => `
                            <div class="dim-sub-row">
                                <label>${s.label}</label>
                                <input type="number" step="0.1" class="dim-sub-input" data-stat="${s.key}" data-unit="${s.asPercent ? 'pct' : 'flat'}" value="0">
                                <span class="dim-sub-unit">${s.unit}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div class="dim-panel dim-party-panel">
                <h3>パーティ (他メンバーのバフ)</h3>
                <p class="dim-panel-hint">
                    teammate を枠に追加 → 効果のチェックボックスで focus キャラの計算に反映。
                    <b>簡易モード</b>はキャラ + Lvプリセットのみ、<b>ビルドモード</b>は保存ビルドから完全ステを読み込み(光円錐・遺物セットの partyEffects も対象に)。
                    caster ステ依存(必殺CD = caster.CD × Y% + Z% 等)は teammate の実 CD を使って動的計算されます。
                    <br><span style="color: var(--text-muted)">※ focus と同じキャラを teammate に入れることも可能(セルフバフ計算用)。ただし常時オーラ(昇格6 等)は focus の traces に既に含まれているため、二重計上を避けるため party 側で OFF にすること。</span>
                </p>
                <div id="dim-party-grid" class="dim-party-grid"></div>
            </div>

            <div class="dim-panel dim-options-panel">
                <h3>計算オプション</h3>
                <div class="dim-options-row">
                    <div class="dim-row">
                        <label>参照ステ</label>
                        <select id="dim-opt-ref">
                            <option value="atk">攻撃力</option>
                            <option value="hp">HP</option>
                            <option value="def">防御力</option>
                            <option value="spd">速度</option>
                        </select>
                    </div>
                    <div class="dim-row">
                        <label>会心モード</label>
                        <select id="dim-opt-crit">
                            <option value="expected">期待値</option>
                            <option value="crit">確定会心</option>
                        </select>
                    </div>
                    <div class="dim-row">
                        <label>敵Lv</label>
                        <input id="dim-opt-enemy-lv" type="number" min="1" value="80">
                    </div>
                    <div class="dim-row">
                        <label>敵基礎耐性</label>
                        <input id="dim-opt-enemy-res" type="number" step="1" value="0">
                        <span class="dim-sub-unit">%</span>
                    </div>
                    <div class="dim-row">
                        <label>撃破状態</label>
                        <select id="dim-opt-break">
                            <option value="normal">靭性残 (×0.9)</option>
                            <option value="broken">撃破中 (×1.0)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div id="dim-result" class="dim-result"></div>

            <div id="dim-char-detail" class="dim-char-detail"></div>
        </div>
    `;
}

function slotLabel(slot) {
    return ({ head: '頭', hands: '手', body: '胴', feet: '足', sphere: '球', rope: '縄' })[slot] || slot;
}

// ---- フォーム初期化 ----------------------------------------------------

function refreshAllForms() {
    fillCharacterSelect();
    fillEidolonSelect();
    fillLightconeSelect();
    fillSuperimposeSelect();
    for (const slot of ALL_SLOTS) {
        fillRelicSetSelect(slot);
        fillRelicMainSelect(slot);
    }
    fillSubInputs();
    fillOptionInputs();
    fillLevelInputs();
    fillPresetSelects();
    refreshBuildList();
    renderParty();
    renderCharDetail();
}

function fillCharacterSelect() {
    const sel = document.getElementById('dim-char');
    sel.innerHTML = Registry.character.list()
        .filter(c => c.id !== 'template')
        .map(c => `<option value="${c.id}" ${c.id === state.build.characterId ? 'selected' : ''}>${c.name}</option>`)
        .join('');
}
function fillEidolonSelect() {
    const sel = document.getElementById('dim-eidolon');
    sel.innerHTML = [0,1,2,3,4,5,6]
        .map(n => `<option value="${n}" ${n === state.build.eidolon ? 'selected' : ''}>E${n}</option>`)
        .join('');
}
function fillLightconeSelect() {
    const sel = document.getElementById('dim-lc');
    sel.innerHTML = [`<option value="">(なし)</option>`].concat(
        Registry.lightcone.list().map(lc =>
            `<option value="${lc.id}" ${lc.id === state.build.lightcone?.id ? 'selected' : ''}>${lc.name}</option>`
        )
    ).join('');
}
function fillSuperimposeSelect() {
    const sel = document.getElementById('dim-lc-si');
    const cur = state.build.lightcone?.superimpose ?? 1;
    sel.innerHTML = [1,2,3,4,5]
        .map(n => `<option value="${n}" ${n === cur ? 'selected' : ''}>S${n}</option>`)
        .join('');
}
function fillRelicSetSelect(slot) {
    const sel = document.querySelector(`.dim-relic-set[data-slot="${slot}"]`);
    if (!sel) return;
    const setType = SLOT_TO_SET_TYPE[slot];
    const items = setType === SET_TYPE.CAVERN ? Registry.relicSet.list() : Registry.ornament.list();
    const cur = state.build.relics[slot]?.setId ?? null;
    sel.innerHTML = [`<option value="">(なし)</option>`].concat(
        items.map(s => `<option value="${s.id}" ${s.id === cur ? 'selected' : ''}>${s.name}</option>`)
    ).join('');
}
function fillRelicMainSelect(slot) {
    const sel = document.querySelector(`.dim-relic-main[data-slot="${slot}"]`);
    if (!sel) return;
    const cur = state.build.relics[slot]?.mainStat ?? null;
    const options = RELIC_MAIN_OPTIONS[slot];
    sel.innerHTML = Object.entries(options).map(([id, def]) =>
        `<option value="${id}" ${id === cur ? 'selected' : ''}>${def.label}</option>`
    ).join('');
    if (!cur) {
        const firstId = Object.keys(options)[0];
        state.build.relics[slot].mainStat = firstId;
        sel.value = firstId;
    }
}
function fillSubInputs() {
    const map = {};
    for (const b of state.build.envBuffs || []) {
        if (typeof b.label === 'string' && b.label.startsWith(SUB_LABEL_PREFIX)) map[b.stat] = b.value;
    }
    document.querySelectorAll('.dim-sub-input').forEach(inp => {
        const stat = inp.dataset.stat;
        const isPct = inp.dataset.unit === 'pct';
        const v = map[stat] ?? 0;
        inp.value = isPct ? (v * 100).toFixed(2).replace(/\.?0+$/, '') : v;
    });
}
function fillOptionInputs() {
    document.getElementById('dim-opt-ref').value = state.options.refStat;
    document.getElementById('dim-opt-crit').value = state.options.critMode;
    document.getElementById('dim-opt-enemy-lv').value = state.options.enemyLevel;
    document.getElementById('dim-opt-enemy-res').value = (state.options.enemyBaseRes * 100);
    document.getElementById('dim-opt-break').value = state.options.breakState;
}

// 軌跡レベル input を描画
function fillLevelInputs() {
    const grid = document.getElementById('dim-level-grid');
    if (!grid) return;
    const ch = Registry.character.get(state.build.characterId);
    if (!ch) { grid.innerHTML = ''; return; }
    grid.innerHTML = LEVEL_KEYS.map(key => {
        const max = getSkillMaxLevel(ch, key, state.build.eidolon) || 1;
        const cur = clampLevel(state.build.traceLevel?.[key] || 1, max);
        state.build.traceLevel = state.build.traceLevel || {};
        state.build.traceLevel[key] = cur;
        return `
            <div class="dim-level-row">
                <label>${SKILL_LABELS[key]}</label>
                <input type="number" min="1" max="${max}" value="${cur}" class="dim-level-input" data-skill="${key}">
                <span class="dim-level-max">/ ${max}</span>
            </div>
        `;
    }).join('');
}

function fillPresetSelects() {
    const cavOpts = Registry.relicSet.list();
    const planOpts = Registry.ornament.list();
    const optHtml = (items) =>
        [`<option value="">(なし)</option>`]
            .concat(items.map(s => `<option value="${s.id}">${s.name}</option>`)).join('');
    document.getElementById('dim-preset-cav-a').innerHTML = optHtml(cavOpts);
    document.getElementById('dim-preset-cav-22a').innerHTML = optHtml(cavOpts);
    document.getElementById('dim-preset-cav-22b').innerHTML = optHtml(cavOpts);
    document.getElementById('dim-preset-planar').innerHTML = optHtml(planOpts);
}

// ---- イベントバインド --------------------------------------------------

function bindAll() {
    document.getElementById('dim-snapshot-btn').addEventListener('click', () => {
        state.snapshot = JSON.parse(JSON.stringify(state.build));
        updateSnapshotStatus();
        recompute();
    });
    document.getElementById('dim-clear-btn').addEventListener('click', () => {
        state.snapshot = null;
        updateSnapshotStatus();
        recompute();
    });

    document.getElementById('dim-char').addEventListener('change', e => {
        state.build.characterId = e.target.value;
        // キャラ変更時はLvを無凸MAXで再初期化
        state.build.traceLevel = presetDefaultMaxLevels(Registry.character.get(e.target.value));
        // ※ パーティ枠に同キャラがいてもクリアしない (セルフバフ計算を許容)
        //   常時オーラ等は二重計上になるためユーザー側で off にすること
        fillLevelInputs();
        renderParty();    // 選択肢の表示更新
        applyPartyToEnvBuffs();
        renderCharDetail();
        recompute();
    });
    document.getElementById('dim-eidolon').addEventListener('change', e => {
        state.build.eidolon = parseInt(e.target.value, 10);
        // 星魂上昇でLv上限が変わる可能性があるためLv inputを再描画
        fillLevelInputs();
        renderCharDetail();
        recompute();
    });
    document.getElementById('dim-lc').addEventListener('change', e => {
        state.build.lightcone.id = e.target.value || null;
        recompute();
    });
    document.getElementById('dim-lc-si').addEventListener('change', e => {
        state.build.lightcone.superimpose = parseInt(e.target.value, 10);
        recompute();
    });

    // 遺物個別
    document.querySelectorAll('.dim-relic-set').forEach(sel => {
        sel.addEventListener('change', e => {
            state.build.relics[sel.dataset.slot].setId = e.target.value || null;
            recompute();
        });
    });
    document.querySelectorAll('.dim-relic-main').forEach(sel => {
        sel.addEventListener('change', e => {
            state.build.relics[sel.dataset.slot].mainStat = e.target.value;
            recompute();
        });
    });

    // サブステ
    document.querySelectorAll('.dim-sub-input').forEach(inp => {
        inp.addEventListener('input', () => {
            applySubInputs();
            recompute();
        });
    });

    // オプション
    document.getElementById('dim-opt-ref').addEventListener('change', e => {
        state.options.refStat = e.target.value;
        recompute();
    });
    document.getElementById('dim-opt-crit').addEventListener('change', e => {
        state.options.critMode = e.target.value;
        recompute();
    });
    document.getElementById('dim-opt-enemy-lv').addEventListener('input', e => {
        state.options.enemyLevel = Math.max(1, parseInt(e.target.value, 10) || 80);
        recompute();
    });
    document.getElementById('dim-opt-enemy-res').addEventListener('input', e => {
        state.options.enemyBaseRes = (parseFloat(e.target.value) || 0) / 100;
        recompute();
    });
    document.getElementById('dim-opt-break').addEventListener('change', e => {
        state.options.breakState = e.target.value;
        recompute();
    });

    // 軌跡レベルプリセット
    //   無凸MAX: 星魂を E0 にリセットして Lv 上限の拡張も外す (default max)
    //   凸後MAX: 星魂を E6 にして Lv 上限拡張を全部適用 (with-eidolon max)
    document.querySelectorAll('.dim-level-presets button').forEach(btn => {
        btn.addEventListener('click', () => {
            const ch = Registry.character.get(state.build.characterId);
            if (!ch) return;
            if (btn.dataset.preset === 'eidolon') {
                state.build.eidolon = 6;
                state.build.traceLevel = presetEidolonMaxLevels(ch);
            } else {
                state.build.eidolon = 0;
                state.build.traceLevel = presetDefaultMaxLevels(ch);
            }
            document.getElementById('dim-eidolon').value = String(state.build.eidolon);
            fillLevelInputs();
            renderCharDetail();
            recompute();
        });
    });

    // 軌跡レベル入力 (Event Delegation: fillLevelInputs で再描画されるため)
    document.getElementById('dim-level-grid').addEventListener('input', e => {
        if (!e.target.matches('.dim-level-input')) return;
        const key = e.target.dataset.skill;
        const ch = Registry.character.get(state.build.characterId);
        const max = getSkillMaxLevel(ch, key, state.build.eidolon) || 1;
        const lv = clampLevel(parseInt(e.target.value, 10) || 1, max);
        state.build.traceLevel[key] = lv;
        if (lv !== parseInt(e.target.value, 10)) e.target.value = lv;
        renderCharDetail();
    });

    // セット効果プリセット モード切替(可視性のみ変更。装着なしのみ即時クリア)
    document.querySelectorAll('input[name="cav-mode"]').forEach(r => {
        r.addEventListener('change', () => {
            if (!r.checked) return;
            const mode = r.value;
            document.getElementById('dim-preset-cav4').style.display   = (mode === '4set')       ? 'flex' : 'none';
            document.getElementById('dim-preset-cav22').style.display  = (mode === '2+2')        ? 'flex' : 'none';
            document.getElementById('dim-preset-cavInd').style.display = (mode === 'individual') ? 'grid' : 'none';
            if (mode === 'none') {
                for (const slot of RELIC_SLOTS) state.build.relics[slot].setId = null;
                recompute();
            }
        });
    });

    // 4セット — auto-apply
    document.getElementById('dim-preset-cav-a').addEventListener('change', e => {
        const id = e.target.value || null;
        for (const slot of RELIC_SLOTS) state.build.relics[slot].setId = id;
        for (const slot of RELIC_SLOTS) fillRelicSetSelect(slot);
        recompute();
    });

    // 2+2 — auto-apply (A=頭・手、B=胴・足)
    const apply22 = () => {
        const a = document.getElementById('dim-preset-cav-22a').value || null;
        const b = document.getElementById('dim-preset-cav-22b').value || null;
        state.build.relics[SLOT.HEAD].setId = a;
        state.build.relics[SLOT.HANDS].setId = a;
        state.build.relics[SLOT.BODY].setId = b;
        state.build.relics[SLOT.FEET].setId = b;
        for (const slot of RELIC_SLOTS) fillRelicSetSelect(slot);
        recompute();
    };
    document.getElementById('dim-preset-cav-22a').addEventListener('change', apply22);
    document.getElementById('dim-preset-cav-22b').addEventListener('change', apply22);

    // 個別 (.dim-relic-set) は既に上の per-slot 用バインドで処理済み

    // Planar — auto-apply
    document.getElementById('dim-preset-planar').addEventListener('change', e => {
        const id = e.target.value || null;
        for (const slot of ORNAMENT_SLOTS) state.build.relics[slot].setId = id;
        recompute();
    });

    // キャラ詳細アコーディオン(委譲)
    document.getElementById('dim-char-detail').addEventListener('click', e => {
        const head = e.target.closest('.dim-acc-head');
        if (!head) return;
        const body = head.nextElementSibling;
        const open = body?.classList.toggle('open');
        head.classList.toggle('open', !!open);
    });

    // ---- ビルド管理 ----------------------------------------------------
    document.getElementById('dim-build-save').addEventListener('click', () => {
        const name = document.getElementById('dim-build-name').value.trim();
        if (!name) { alert('ビルド名を入力してください'); return; }
        state.build.name = name;
        // 同名既存があれば ID 引き継ぎ(=上書き)、なければ既存 ID で保存(=新規 or 既存上書き)
        const existing = BuildStore.list().find(b => b.name === name);
        if (existing && existing.id !== state.build.id) state.build.id = existing.id;
        const saved = BuildStore.save(state.build);
        state.build.id = saved.id;
        refreshBuildList();
    });

    document.getElementById('dim-build-new').addEventListener('click', () => {
        if (!confirm('現在の編集内容をクリアして新規ビルドを作成しますか?')) return;
        const ch = Registry.character.get(state.build.characterId)
                || Registry.character.list().find(c => c.id !== 'template');
        state.build = BuildStore.blank(ch.id);
        state.build.name = '';
        state.build.traceLevel = presetDefaultMaxLevels(ch);
        document.getElementById('dim-build-name').value = '';
        refreshAllForms();
        recompute();
    });

    document.getElementById('dim-build-load').addEventListener('click', () => {
        const id = document.getElementById('dim-build-list').value;
        if (!id) return;
        const b = BuildStore.get(id);
        if (!b) { alert('ビルドが見つかりません'); return; }
        state.build = JSON.parse(JSON.stringify(b));
        document.getElementById('dim-build-name').value = b.name || '';
        // eidolon select 反映
        const eSel = document.getElementById('dim-eidolon');
        if (eSel) eSel.value = String(state.build.eidolon || 0);
        refreshAllForms();
        recompute();
    });

    document.getElementById('dim-build-delete').addEventListener('click', () => {
        const id = document.getElementById('dim-build-list').value;
        if (!id) return;
        const b = BuildStore.get(id);
        if (!b) return;
        if (!confirm(`「${b.name || id}」を削除しますか?`)) return;
        BuildStore.delete(id);
        refreshBuildList();
    });

    document.getElementById('dim-build-export').addEventListener('click', () => {
        const text = BuildStore.exportJson();
        const area = document.getElementById('dim-build-json-area');
        area.style.display = 'block';
        document.getElementById('dim-build-json-text').value = text;
    });

    document.getElementById('dim-build-import').addEventListener('click', () => {
        const area = document.getElementById('dim-build-json-area');
        area.style.display = 'block';
        document.getElementById('dim-build-json-text').value = '';
        document.getElementById('dim-build-json-text').focus();
    });

    document.getElementById('dim-build-json-apply').addEventListener('click', () => {
        const text = document.getElementById('dim-build-json-text').value.trim();
        if (!text) return;
        try {
            const total = BuildStore.importJson(text, 'merge');
            alert(`読み込み完了。合計 ${total} 件のビルドが保存済みです。`);
            refreshBuildList();
            document.getElementById('dim-build-json-area').style.display = 'none';
        } catch (err) {
            alert('JSON読込エラー: ' + err.message);
        }
    });

    document.getElementById('dim-build-json-close').addEventListener('click', () => {
        document.getElementById('dim-build-json-area').style.display = 'none';
    });
}

// ---- パーティ枠 (Feature 3: Plan A) -----------------------------------

// 各 slot に対し、計算用 teammate build を派生する。
//   buildId 優先 (BuildStore から完全ビルド)。なければ簡易モード(char + Lv preset)で blank ビルドを構築。
function partyBuildFor(slot) {
    if (slot.buildId) {
        const b = BuildStore.get(slot.buildId);
        if (b) return JSON.parse(JSON.stringify(b));   // 防御コピー
    }
    if (!slot.characterId) return null;
    const ch = Registry.character.get(slot.characterId);
    if (!ch) return null;
    const b = BuildStore.blank(slot.characterId);
    b.eidolon = slot.levelPreset === 'eidolon' ? 6 : 0;
    b.traceLevel = slot.levelPreset === 'eidolon'
        ? presetEidolonMaxLevels(ch)
        : presetDefaultMaxLevels(ch);
    return b;
}

// teammate に紐づく全 partyEffects をソース別に収集
//   返り値: [{ srcKey, srcLabel, ef }, ...]
//     srcKey 例: 'char' | 'lc' | 'set:messenger:pc4' | 'orn:vonwacq:pc2'
function gatherTeammateEffects(teammateBuild) {
    if (!teammateBuild) return [];
    const out = [];
    const ch = Registry.character.get(teammateBuild.characterId);
    if (!ch) return out;

    // キャラ
    for (const ef of ch.partyEffects || []) {
        out.push({ srcKey: 'char', srcLabel: `キャラ: ${ch.name}`, ef });
    }

    // 光円錐
    if (teammateBuild.lightcone?.id) {
        const lc = Registry.lightcone.get(teammateBuild.lightcone.id);
        if (lc) {
            const si = Math.max(1, Math.min(5, teammateBuild.lightcone.superimpose || 1));
            const lcEffects = typeof lc.partyEffects === 'function'
                ? (lc.partyEffects(si) || [])
                : (lc.partyEffects || []);
            for (const ef of lcEffects) {
                out.push({ srcKey: 'lc', srcLabel: `光円錐: ${lc.name} S${si}`, ef });
            }
        }
    }

    // 洞窟セット (装着 setId のセット効果のみ)
    const cavCounts = countSetsByType(teammateBuild.relics, SET_TYPE.CAVERN);
    for (const [setId, cnt] of Object.entries(cavCounts)) {
        const set = Registry.relicSet.get(setId);
        if (!set?.partyEffects) continue;
        if (cnt >= 2) for (const ef of set.partyEffects.pc2 || []) {
            out.push({ srcKey: `set:${setId}:pc2`, srcLabel: `セット: ${set.name} 2pc`, ef });
        }
        if (cnt >= 4) for (const ef of set.partyEffects.pc4 || []) {
            out.push({ srcKey: `set:${setId}:pc4`, srcLabel: `セット: ${set.name} 4pc`, ef });
        }
    }

    // 次元界オーナメント
    const ornCounts = countSetsByType(teammateBuild.relics, SET_TYPE.PLANAR);
    for (const [setId, cnt] of Object.entries(ornCounts)) {
        const orn = Registry.ornament.get(setId);
        if (!orn?.partyEffects) continue;
        if (cnt >= 2) for (const ef of orn.partyEffects.pc2 || []) {
            out.push({ srcKey: `orn:${setId}:pc2`, srcLabel: `次元界: ${orn.name} 2pc`, ef });
        }
    }

    return out;
}

// 効果1つに対する実際の stats を解決
//   ef.stats が定義 → そのまま
//   ef.fromLevel + ef.computeStats が定義 → teammate の Lv と FinalStats を使って動的計算
function resolveEffectStats(ef, teammateBuild, teammateStats) {
    if (ef.stats) return ef.stats;
    if (typeof ef.computeStats === 'function') {
        const ch = Registry.character.get(teammateBuild.characterId);
        const skill = ch?.skills?.[ef.fromLevel];
        if (!skill?.levels) return null;
        const lv = (teammateBuild.traceLevel?.[ef.fromLevel]) || 1;
        const idx = Math.max(0, Math.min(skill.levels.length - 1, lv - 1));
        const mult = skill.levels[idx];
        try {
            return ef.computeStats(lv, mult, teammateStats);
        } catch (err) {
            console.warn('[diminishingUI] computeStats failed', ef.id, err);
            return null;
        }
    }
    return null;
}

// 合成 effect ID: srcKey + '.' + ef.id (チェックボックスの状態管理用)
const effectKey = (srcKey, efId) => `${srcKey}.${efId}`;

function renderParty() {
    const grid = document.getElementById('dim-party-grid');
    if (!grid) return;
    grid.innerHTML = state.party.map((slot, idx) => renderPartySlot(slot, idx)).join('');

    // モード(簡易/ビルド)ラジオ
    grid.querySelectorAll('.dim-party-mode').forEach(r => {
        r.addEventListener('change', e => {
            if (!r.checked) return;
            const idx = parseInt(r.dataset.idx, 10);
            state.party[idx].mode = r.value;
            if (state.party[idx].mode === 'simple') {
                state.party[idx].buildId = null;
            }
            applyDefaultActiveEffects(idx);
            renderParty();
            applyPartyToEnvBuffs();
            recompute();
        });
    });

    // キャラ選択 (簡易モード)
    grid.querySelectorAll('.dim-party-char').forEach(sel => {
        sel.addEventListener('change', e => {
            const idx = parseInt(sel.dataset.idx, 10);
            state.party[idx].characterId = e.target.value || null;
            state.party[idx].buildId = null;   // 簡易モードに切替
            applyDefaultActiveEffects(idx);
            renderParty();
            applyPartyToEnvBuffs();
            recompute();
        });
    });

    // 凸プリセット (簡易モード)
    grid.querySelectorAll('.dim-party-levelpreset').forEach(r => {
        r.addEventListener('change', () => {
            if (!r.checked) return;
            const idx = parseInt(r.dataset.idx, 10);
            state.party[idx].levelPreset = r.value;
            renderParty();
            applyPartyToEnvBuffs();
            recompute();
        });
    });

    // ビルド選択 (ビルドモード)
    grid.querySelectorAll('.dim-party-buildsel').forEach(sel => {
        sel.addEventListener('change', e => {
            const idx = parseInt(sel.dataset.idx, 10);
            state.party[idx].buildId = e.target.value || null;
            if (state.party[idx].buildId) {
                const b = BuildStore.get(state.party[idx].buildId);
                if (b) state.party[idx].characterId = b.characterId;
            }
            applyDefaultActiveEffects(idx);
            renderParty();
            applyPartyToEnvBuffs();
            recompute();
        });
    });

    // 効果チェックボックス
    grid.querySelectorAll('.dim-party-effect').forEach(cb => {
        cb.addEventListener('change', () => {
            const idx = parseInt(cb.dataset.idx, 10);
            const key = cb.dataset.effectKey;
            if (cb.checked) state.party[idx].activeEffectIds.add(key);
            else state.party[idx].activeEffectIds.delete(key);
            renderParty();    // 計算済み値の表示を更新するため再描画
            applyPartyToEnvBuffs();
            recompute();
        });
    });
}

// キャラ/ビルド変更時に default-active な効果を自動チェック
function applyDefaultActiveEffects(idx) {
    const slot = state.party[idx];
    slot.activeEffectIds = new Set();
    const tBuild = partyBuildFor(slot);
    if (!tBuild) return;
    const effects = gatherTeammateEffects(tBuild);
    for (const { srcKey, ef } of effects) {
        if (ef.defaultActive) slot.activeEffectIds.add(effectKey(srcKey, ef.id));
    }
}

function renderPartySlot(slot, idx) {
    // 注: focus と同じキャラも party に入れられる(セルフバフ計算用)。
    //     ただし常時オーラ(昇格6 等)は focus の traces に既に含まれており
    //     party 側でも ON にすると二重計上になるため、ユーザー側で off にすること。
    const charOptions = [`<option value="">(なし)</option>`].concat(
        Registry.character.list()
            .filter(c => c.id !== 'template')
            .map(c => {
                const sameAsFocus = c.id === state.build.characterId;
                const label = sameAsFocus ? `${c.name} (focusと同キャラ)` : c.name;
                return `<option value="${c.id}" ${c.id === slot.characterId ? 'selected' : ''}>${label}</option>`;
            })
    ).join('');

    const buildOptions = [`<option value="">(なし)</option>`].concat(
        BuildStore.list()
            .map(b => {
                const ch = Registry.character.get(b.characterId);
                const sameAsFocus = b.characterId === state.build.characterId;
                const tag = sameAsFocus ? ' (focusと同キャラ)' : '';
                return `<option value="${b.id}" ${b.id === slot.buildId ? 'selected' : ''}>${escapeHtml(b.name || '(無名)')} — ${ch?.name || b.characterId}${tag}</option>`;
            })
    ).join('');

    const isBuildMode = slot.mode === 'build';
    const tBuild = partyBuildFor(slot);
    const ch = tBuild ? Registry.character.get(tBuild.characterId) : null;
    let tStats = null;
    try { tStats = tBuild ? StatComputer.compute(tBuild) : null; }
    catch (err) { console.error('[party] tStats compute failed', err, tBuild); }
    const effects = gatherTeammateEffects(tBuild);

    // ソース別にグルーピング
    const groups = new Map();   // srcLabel → [{srcKey, ef, resolvedStats}, ...]
    for (const item of effects) {
        const resolvedStats = resolveEffectStats(item.ef, tBuild, tStats);
        if (!groups.has(item.srcLabel)) groups.set(item.srcLabel, []);
        groups.get(item.srcLabel).push({ ...item, resolvedStats });
    }

    const effectsHtml = (groups.size === 0)
        ? (ch ? '<p class="dim-empty">パーティ効果データ未登録</p>' : '<p class="dim-empty">キャラ/ビルドを選択してください</p>')
        : Array.from(groups.entries()).map(([srcLabel, items]) => `
            <div class="dim-party-source-group">
                <h5 class="dim-party-source-label">${escapeHtml(srcLabel)}</h5>
                ${items.map(({ srcKey, ef, resolvedStats }) => {
                    const ekey = effectKey(srcKey, ef.id);
                    const checked = slot.activeEffectIds.has(ekey);
                    return `
                        <label class="dim-party-effect-row" title="${escapeHtml(ef.description || '')}">
                            <input type="checkbox" class="dim-party-effect"
                                   data-idx="${idx}" data-effect-key="${ekey}"
                                   ${checked ? 'checked' : ''}>
                            <span class="dim-party-effect-name">${escapeHtml(ef.name)}</span>
                            <span class="dim-party-effect-stats">${formatEffectStats(resolvedStats)}</span>
                        </label>
                    `;
                }).join('')}
            </div>
        `).join('');

    return `
        <div class="dim-party-slot">
            <div class="dim-party-slot-head">
                <span class="dim-party-slot-label">枠 ${idx + 1}</span>
                ${ch ? `<span class="dim-party-slot-char">${escapeHtml(ch.name)}</span>` : ''}
            </div>
            <div class="dim-party-slot-config">
                <div class="dim-party-mode-row">
                    <label class="dim-radio">
                        <input type="radio" class="dim-party-mode" data-idx="${idx}" name="party-mode-${idx}" value="simple" ${!isBuildMode ? 'checked' : ''}> 簡易
                    </label>
                    <label class="dim-radio">
                        <input type="radio" class="dim-party-mode" data-idx="${idx}" name="party-mode-${idx}" value="build" ${isBuildMode ? 'checked' : ''}> ビルドから
                    </label>
                </div>
                ${isBuildMode ? `
                    <div class="dim-party-buildmode-config">
                        <label>ビルド</label>
                        <select class="dim-party-buildsel" data-idx="${idx}">${buildOptions}</select>
                    </div>
                ` : `
                    <div class="dim-party-simplemode-config">
                        <label>キャラ</label>
                        <select class="dim-party-char" data-idx="${idx}">${charOptions}</select>
                        <span class="dim-party-lvpreset">
                            <label class="dim-radio">
                                <input type="radio" class="dim-party-levelpreset" data-idx="${idx}" name="party-lv-${idx}" value="default" ${slot.levelPreset === 'default' ? 'checked' : ''}> 無凸MAX
                            </label>
                            <label class="dim-radio">
                                <input type="radio" class="dim-party-levelpreset" data-idx="${idx}" name="party-lv-${idx}" value="eidolon" ${slot.levelPreset === 'eidolon' ? 'checked' : ''}> 凸後MAX
                            </label>
                        </span>
                    </div>
                `}
            </div>
            <div class="dim-party-effects">${effectsHtml}</div>
        </div>
    `;
}

function formatEffectStats(stats) {
    if (!stats) return '<span class="dim-party-effect-stats-empty">—</span>';
    const parts = Object.entries(stats).map(([k, v]) => {
        const isFlat = k.endsWith('Flat') || k === 'spdBase' || k === 'atkBase';
        const valStr = isFlat ? `+${v.toFixed(1)}` : `+${(v * 100).toFixed(2)}%`;
        return `${formatStatLabel(k)} ${valStr}`;
    });
    return parts.join(' / ');
}

// パーティ効果を state.build.envBuffs に反映 (既存「パーティ.*」を一掃して書き直し)
function applyPartyToEnvBuffs() {
    state.build.envBuffs = (state.build.envBuffs || []).filter(b =>
        !(typeof b.label === 'string' && b.label.startsWith(PARTY_LABEL_PREFIX))
    );
    for (let idx = 0; idx < state.party.length; idx++) {
        const slot = state.party[idx];
        const tBuild = partyBuildFor(slot);
        if (!tBuild) continue;
        const tStats = StatComputer.compute(tBuild);
        const effects = gatherTeammateEffects(tBuild);
        for (const { srcKey, ef } of effects) {
            const ekey = effectKey(srcKey, ef.id);
            if (!slot.activeEffectIds.has(ekey)) continue;
            const stats = resolveEffectStats(ef, tBuild, tStats);
            if (!stats) continue;
            for (const [stat, value] of Object.entries(stats)) {
                state.build.envBuffs.push({
                    stat,
                    value,
                    label: `${PARTY_LABEL_PREFIX}${idx}.${srcKey}.${ef.id}.${stat}`,
                });
            }
        }
    }
}

function refreshBuildList() {
    const sel = document.getElementById('dim-build-list');
    if (!sel) return;
    const builds = BuildStore.list();
    if (builds.length === 0) {
        sel.innerHTML = '<option value="">(保存ビルドなし)</option>';
        return;
    }
    sel.innerHTML = builds
        .sort((a, b) => (b.meta?.updatedAt || '').localeCompare(a.meta?.updatedAt || ''))
        .map(b => {
            const ch = Registry.character.get(b.characterId);
            const charName = ch?.name || b.characterId || '?';
            return `<option value="${b.id}">${escapeHtml(b.name || '(無名)')} — ${charName}</option>`;
        }).join('');
}

function applySubInputs() {
    state.build.envBuffs = (state.build.envBuffs || []).filter(b =>
        !(typeof b.label === 'string' && b.label.startsWith(SUB_LABEL_PREFIX))
    );
    document.querySelectorAll('.dim-sub-input').forEach(inp => {
        const stat = inp.dataset.stat;
        const isPct = inp.dataset.unit === 'pct';
        const raw = parseFloat(inp.value) || 0;
        if (raw === 0) return;
        const value = isPct ? raw / 100 : raw;
        state.build.envBuffs.push({ stat, value, label: SUB_LABEL_PREFIX + stat });
    });
}

function updateSnapshotStatus() {
    const el = document.getElementById('dim-snapshot-status');
    if (!state.snapshot) {
        el.textContent = 'スナップショット: なし';
        el.style.color = 'var(--text-muted)';
    } else {
        el.textContent = `スナップショット: 保存済み (${state.snapshot.characterId} / 比較中)`;
        el.style.color = 'var(--accent-gold)';
    }
}

// ---- 計算 + 結果描画 ---------------------------------------------------

function recompute() {
    const resultEl = document.getElementById('dim-result');
    if (!resultEl) return;
    let nowStats;
    try { nowStats = StatComputer.compute(state.build); }
    catch (err) { resultEl.innerHTML = `<div class="dim-error">計算エラー: ${err.message}</div>`; return; }

    if (!state.snapshot) { resultEl.innerHTML = renderStatsOnly(nowStats); return; }
    let cmp;
    try { cmp = Diminishing.compareBuilds(state.snapshot, state.build, state.options); }
    catch (err) { resultEl.innerHTML = `<div class="dim-error">比較エラー: ${err.message}</div>`; return; }
    resultEl.innerHTML = renderComparison(cmp);
}

function renderStatsOnly(s) {
    const d = s.derived;
    return `
        <h3>現状の最終ステータス</h3>
        <table class="dim-result-table">
            <tr><th>攻撃力</th><td>${d.atk.toFixed(1)}</td></tr>
            <tr><th>HP</th><td>${d.hp.toFixed(1)}</td></tr>
            <tr><th>防御力</th><td>${d.def.toFixed(1)}</td></tr>
            <tr><th>速度</th><td>${d.spd.toFixed(2)} (AV ${d.speedAV.toFixed(1)})</td></tr>
            <tr><th>会心率</th><td>${(d.critRate * 100).toFixed(2)}%</td></tr>
            <tr><th>会心ダメ</th><td>${(d.critDmg * 100).toFixed(2)}%</td></tr>
            <tr><th>会心期待値</th><td>×${d.critExpected.toFixed(4)}</td></tr>
            <tr><th>EP回復効率</th><td>${(d.energyRegenPct * 100).toFixed(2)}%</td></tr>
            <tr><th>自属性ダメ枠合計</th><td>${(d.dmgOwnElement * 100).toFixed(2)}%</td></tr>
            <tr><th>撃破特効</th><td>${((d.breakEffectPct - 1) * 100).toFixed(2)}%</td></tr>
        </table>
        <p class="dim-help">「現状をスナップショット」を押してから装備等を変更すると、火力貢献率が表示されます。</p>
    `;
}

function renderComparison(cmp) {
    const f = cmp.factors;
    const a = cmp.beforeStats.derived;
    const b = cmp.afterStats.derived;
    const rows = [
        { name: `参照ステ (${factorLabel(cmp.options.refStat)})`, ...f.atk },
        { name: '会心係数',     ...f.crit },
        { name: '与ダメ枠',     ...f.dmgBonus },
        { name: '防御係数',     ...f.def },
        { name: '耐性係数',     ...f.res },
        { name: '撃破係数',     ...f.break },
    ];
    return `
        <h3>火力貢献率</h3>
        <table class="dim-result-table">
            <thead><tr><th>項目</th><th>スナップショット</th><th>現在</th><th>比率</th><th>貢献率</th></tr></thead>
            <tbody>
                ${rows.map(renderFactorRow).join('')}
                <tr class="dim-total-row">
                    <th>火力総合</th>
                    <td>—</td><td>—</td>
                    <td>×${f.total.ratio.toFixed(4)}</td>
                    <td class="${contribClass(f.total.contribution)}">${formatContrib(f.total.contribution)}</td>
                </tr>
            </tbody>
        </table>

        <h3>最終ステータス</h3>
        <table class="dim-result-table">
            <thead><tr><th>項目</th><th>スナップショット</th><th>現在</th><th>差分</th></tr></thead>
            <tbody>
                ${renderStatRow('攻撃力', a.atk, b.atk, 1)}
                ${renderStatRow('HP',     a.hp,  b.hp,  1)}
                ${renderStatRow('防御力', a.def, b.def, 1)}
                ${renderStatRowSpd(a.spd, b.spd, cmp.info.spdDelta)}
                ${renderStatRowPct('会心率',     a.critRate,       b.critRate)}
                ${renderStatRowPct('会心ダメ',   a.critDmg,        b.critDmg)}
                ${renderStatRowMul('会心期待値', a.critExpected,   b.critExpected)}
                ${renderStatRowPct('自属性ダメ枠', a.dmgOwnElement, b.dmgOwnElement)}
                ${renderStatRowPct('EP回復効率', a.energyRegenPct, b.energyRegenPct)}
            </tbody>
        </table>
    `;
}

const renderFactorRow = (row) => `
    <tr>
        <th>${row.name}</th>
        <td>${formatFactorValue(row.before)}</td>
        <td>${formatFactorValue(row.after)}</td>
        <td>×${row.ratio.toFixed(4)}</td>
        <td class="${contribClass(row.contribution)}">${formatContrib(row.contribution)}</td>
    </tr>
`;
function renderStatRow(name, before, after, decimals) {
    const d = after - before; const sign = d >= 0 ? '+' : '';
    return `<tr><th>${name}</th><td>${before.toFixed(decimals)}</td><td>${after.toFixed(decimals)}</td><td class="${contribClass(d)}">${sign}${d.toFixed(decimals)}</td></tr>`;
}
function renderStatRowSpd(before, after, delta) {
    const sign = delta >= 0 ? '+' : '';
    return `<tr><th>速度 <span class="dim-note">(行動回数は速度タブで)</span></th><td>${before.toFixed(2)}</td><td>${after.toFixed(2)}</td><td class="${contribClass(delta)}">${sign}${delta.toFixed(2)}</td></tr>`;
}
function renderStatRowPct(name, before, after) {
    const d = after - before; const sign = d >= 0 ? '+' : '';
    return `<tr><th>${name}</th><td>${(before*100).toFixed(2)}%</td><td>${(after*100).toFixed(2)}%</td><td class="${contribClass(d)}">${sign}${(d*100).toFixed(2)}%pt</td></tr>`;
}
function renderStatRowMul(name, before, after) {
    const ratio = before > 0 ? after / before : 0;
    return `<tr><th>${name}</th><td>×${before.toFixed(4)}</td><td>×${after.toFixed(4)}</td><td class="${contribClass(ratio-1)}">×${ratio.toFixed(4)}</td></tr>`;
}
function formatFactorValue(v) { return Math.abs(v) >= 100 ? v.toFixed(1) : v.toFixed(4); }
function formatContrib(c) { return `${c >= 0 ? '+' : ''}${(c * 100).toFixed(2)}%`; }
function contribClass(c) { return c > 0 ? 'dim-contrib-pos' : c < 0 ? 'dim-contrib-neg' : 'dim-contrib-zero'; }
function factorLabel(refStat) { return ({ atk: '攻撃力', hp: 'HP', def: '防御力', spd: '速度' })[refStat] || refStat; }

// ---- キャラ詳細パネル(アコーディオン) -------------------------------

function renderCharDetail() {
    const wrap = document.getElementById('dim-char-detail');
    if (!wrap) return;
    const ch = Registry.character.get(state.build.characterId);
    if (!ch) { wrap.innerHTML = ''; return; }
    const eidolon = state.build.eidolon ?? 0;

    wrap.innerHTML = `
        <h3 class="dim-detail-title">${ch.name} 詳細</h3>
        ${accordion('スキル / 軌跡', renderSkillsSection(ch))}
        ${accordion('追加能力', renderExtrasSection(ch))}
        ${accordion('星魂', renderEidolonsSection(ch, eidolon))}
        ${accordion('軌跡ステータスボーナス', renderTraceBreakdown(ch))}
    `;
}

function accordion(title, body, open = false) {
    return `
        <div class="dim-acc">
            <div class="dim-acc-head ${open ? 'open' : ''}">
                <span class="dim-acc-caret">▶</span> ${title}
            </div>
            <div class="dim-acc-body ${open ? 'open' : ''}">${body}</div>
        </div>
    `;
}

function renderSkillsSection(ch) {
    return SKILL_DISPLAY_ORDER.filter(key => ch.skills?.[key]).map(key => {
        const skill = ch.skills[key];
        const isTechnique = key === 'technique';
        if (isTechnique) {
            return `
                <div class="dim-skill-block">
                    <div class="dim-skill-head">
                        <span class="dim-skill-tag">${SKILL_LABELS[key]}</span>
                        <span class="dim-skill-name">${skill.name || '—'}</span>
                    </div>
                    <p class="dim-skill-desc">${escapeHtml(skill.description || '')}</p>
                </div>
            `;
        }
        const curLv = state.build.traceLevel?.[key] || 1;
        const maxLv = getSkillMaxLevel(ch, key, state.build.eidolon) || 1;
        const mult = getSkillMultAt(skill, curLv);
        const description = skill.description || '';
        const filledDesc = fillSkillTemplate(description, mult);
        return `
            <div class="dim-skill-block">
                <div class="dim-skill-head">
                    <span class="dim-skill-tag">${SKILL_LABELS[key]}</span>
                    <span class="dim-skill-name">${skill.name || '—'}</span>
                    <span class="dim-skill-meta">Lv ${curLv}/${maxLv}${skill.energy ? ` ・ EP ${skill.energy}` : ''}</span>
                </div>
                <p class="dim-skill-desc">${escapeHtml(filledDesc)}</p>
                ${renderMultDetail(mult)}
            </div>
        `;
    }).join('');
}

// 説明文中の "X%" / "Y%" / "Z%" を倍率値で置換
function fillSkillTemplate(text, mult) {
    if (!text || !mult) return text;
    let s = text;
    if (typeof mult.atk === 'number')      s = s.replace(/攻撃力X%/g,  `攻撃力${(mult.atk*100).toFixed(0)}%`);
    if (typeof mult.dmgBuff === 'number')  s = s.replace(/与ダメージ\+?X%/g, `与ダメージ+${(mult.dmgBuff*100).toFixed(0)}%`);
    if (typeof mult.atkBuff === 'number')  s = s.replace(/攻撃力\+?X%/g, `攻撃力+${(mult.atkBuff*100).toFixed(0)}%`);
    if (typeof mult.cdRatio === 'number')  s = s.replace(/Y%/g, `${(mult.cdRatio*100).toFixed(1)}%`);
    if (typeof mult.cdFlat === 'number')   s = s.replace(/Z%/g, `${(mult.cdFlat*100).toFixed(1)}%`);
    if (typeof mult.advance === 'number')  s = s.replace(/X％|X%/g, `${(mult.advance*100).toFixed(0)}%`);
    return s;
}

// mult オブジェクトの key を表示用に列挙
function renderMultDetail(mult) {
    if (!mult) return '';
    const KEY_LABELS = {
        atk: '攻撃力倍率', dmgBuff: '与ダメバフ', atkBuff: '攻撃力バフ',
        cdRatio: '会心ダメ係数(対caster.CD)', cdFlat: '会心ダメ固定値',
        advance: '行動値短縮',
    };
    const FMT_PCT_KEYS = new Set(['dmgBuff', 'atkBuff', 'cdRatio', 'cdFlat', 'advance']);
    const items = Object.entries(mult).map(([k, v]) => {
        const lbl = KEY_LABELS[k] || k;
        const val = typeof v === 'number'
            ? (FMT_PCT_KEYS.has(k) ? `${(v*100).toFixed(1)}%` : k === 'atk' ? `${(v*100).toFixed(0)}%` : v)
            : v;
        return `<span class="dim-skill-mult"><b>${lbl}</b>: ${val}</span>`;
    });
    return `<div class="dim-skill-mults">${items.join('')}</div>`;
}

function renderExtrasSection(ch) {
    if (!ch.extras?.length) return '<p class="dim-empty">追加能力なし</p>';
    return ch.extras.map(ex => `
        <div class="dim-extra-block">
            <div class="dim-extra-head">
                <span class="dim-skill-tag">昇格${ex.tier}</span>
                <span class="dim-skill-name">${ex.name}</span>
            </div>
            <p class="dim-skill-desc">${escapeHtml(ex.description)}</p>
        </div>
    `).join('');
}

function renderEidolonsSection(ch, curEidolon) {
    const detail = ch.eidolonsDetail || {};
    return [1,2,3,4,5,6].map(n => {
        const e = detail[n];
        if (!e) return '';
        const active = n <= curEidolon;
        const boostLine = e.levelBoost
            ? `<span class="dim-skill-meta">Lv上限拡張: ${Object.entries(e.levelBoost).map(([k,v])=>`${SKILL_LABELS[k]||k}+${v}`).join(' / ')}</span>`
            : '';
        return `
            <div class="dim-eidolon-block ${active ? 'active' : 'inactive'}">
                <div class="dim-extra-head">
                    <span class="dim-skill-tag">E${n}</span>
                    <span class="dim-skill-name">${e.name}</span>
                    ${active ? '<span class="dim-active-badge">解放</span>' : ''}
                </div>
                <p class="dim-skill-desc">${escapeHtml(e.description || '')}</p>
                ${boostLine}
            </div>
        `;
    }).join('');
}

function renderTraceBreakdown(ch) {
    const bd = ch.traces?.breakdown;
    if (!bd?.length) {
        // breakdown 未定義時は合計値のみ
        const stats = ch.traces?.stats || {};
        const rows = Object.entries(stats).map(([k, v]) => `<tr><th>${k}</th><td>+${formatStatValue(k, v)}</td></tr>`).join('');
        return `<table class="dim-result-table">${rows}</table>`;
    }
    const totals = {};
    for (const node of bd) totals[node.stat] = (totals[node.stat] || 0) + node.value;
    return `
        <table class="dim-result-table">
            <thead><tr><th>ノード</th><th>枠</th><th>値</th></tr></thead>
            <tbody>
                ${bd.map(n => `<tr><th>${n.node}</th><td>${formatStatLabel(n.stat)}</td><td>+${formatStatValue(n.stat, n.value)}</td></tr>`).join('')}
                <tr class="dim-total-row">
                    <th colspan="2">合計</th>
                    <td>${Object.entries(totals).map(([k,v])=>`${formatStatLabel(k)} +${formatStatValue(k,v)}`).join(' / ')}</td>
                </tr>
            </tbody>
        </table>
    `;
}

function formatStatLabel(stat) {
    const map = {
        atkPercent: '攻撃力%', atkFlat: '攻撃力固定',
        hpPercent: 'HP%', hpFlat: 'HP固定',
        defPercent: '防御力%', defFlat: '防御力固定',
        spdPercent: '速度%', spdFlat: '速度',
        critRate: '会心率', critDmg: '会心ダメ',
        dmgAll: '与ダメ枠', breakEffect: '撃破特効',
        ehr: '効果命中', eres: '効果抵抗',
        energyRegen: 'EP回復',
        dmgPhysical: '物理ダメ', dmgFire: '炎ダメ', dmgIce: '氷ダメ',
        dmgLightning: '雷ダメ', dmgWind: '風ダメ', dmgQuantum: '量子ダメ', dmgImaginary: '虚数ダメ',
    };
    return map[stat] || stat;
}
function formatStatValue(stat, v) {
    const isFlat = stat.endsWith('Flat');
    if (isFlat) return v.toString();
    return `${(v * 100).toFixed(1)}%`;
}

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => (
        { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]
    ));
}
