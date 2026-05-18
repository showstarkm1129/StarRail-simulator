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
import {
    SUBSTAT_TABLE, SUBSTAT_ORDER,
} from '../build/substatTable.js';
import {
    calcManualAllocation, rollsToStatDict, excludeMainStatFromCandidates,
} from '../build/substatRoller.js';

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
// memorySkill/memoryTalent は記憶の精霊持ち (ヒアンシー等) 専用。
// キャラ側で skills.memorySkill / memoryTalent が定義されていれば表示される。
const SKILL_DISPLAY_ORDER = [
    'basic', 'skill', 'ult', 'talent',
    'memorySkill', 'memoryTalent',
    'technique',
];
const SKILL_LABELS = {
    basic:        '通常攻撃',
    skill:        '戦闘スキル',
    ult:          '必殺技',
    talent:       '天賦',
    memorySkill:  '精霊スキル',
    memoryTalent: '精霊天賦',
    technique:    '秘技',
};

// 軌跡レベル指定対象を「キャラが実際に定義しているスキルキーのみ」動的に決定。
//   - technique は Lv 非対応のため除外
//   - キャラに無いスキル (例: ブローニャの memorySkill) は表示されない
function getLevelKeysForCharacter(character) {
    if (!character?.skills) return [];
    return SKILL_DISPLAY_ORDER.filter(k => k !== 'technique' && character.skills[k]);
}

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
    // サブステの 3 モード独立 state。現在選択中の mode の結果のみ envBuffs に流す。
    //   manual : 自由入力 (stat → 値 を直接編集)
    //   total  : 6 部位合計の手動配分 (各サブステに振り回数を指定)
    //   perSlot: 部位ごとの手動配分 (メインステ自動除外)
    //
    // allocations: { [subKey]: rollCount } 各サブステに何ロール振るかの直接指定。
    // tier: 'low'|'mid'|'high'|'random' 伸び幅。random のみ「シミュレート」が必要。
    // lastResult: { totals: { [subKey]: 値 } } 計算済み結果。
    //   - tier ∈ {low,mid,high} のとき: 入力即時に決定的計算で更新
    //   - tier == 'random' のとき: シミュレートボタン押下時に都度乱数で更新
    subs: {
        mode: 'manual',
        manual: { /* statKey → 値 (envBuffs から init 時に復元) */ },
        total: {
            allocations: {},   // 初期は全 0 (= 空 dict)
            tier: 'high',
            lastResult: null,
        },
        perSlot: {
            // slot ごとに { allocations, tier, lastResult }
            // initDiminishingUI() で各部位を初期化
        },
    },
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

    // 部位別ロールの初期 state (各部位デフォルト = 全 0 ロール / 高 / 未計算)
    for (const slot of ALL_SLOTS) {
        state.subs.perSlot[slot] = {
            allocations: {},
            tier: 'high',
            lastResult: null,
        };
    }

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
                            <label class="dim-radio"><input type="radio" name="cav-mode" value="4set" checked> トンネル 4セット</label>
                            <label class="dim-radio"><input type="radio" name="cav-mode" value="2+2"> トンネル 2+2</label>
                            <label class="dim-radio"><input type="radio" name="cav-mode" value="individual"> 個別</label>
                            <label class="dim-radio"><input type="radio" name="cav-mode" value="none"> 装着なし</label>
                        </div>
                        <div id="dim-preset-cav4" class="dim-preset-row">
                            <label>トンネルセット</label>
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
                    <p class="dim-panel-hint dim-subs-global-hint">
                        数値入力欄はクリックでフォーカスした後、マウスホイールでも増減できます (下限 0)。
                    </p>
                    <div class="dim-subs-tabs" id="dim-subs-tabs">
                        <button type="button" class="dim-subs-tab" data-mode="manual">自由入力</button>
                        <button type="button" class="dim-subs-tab" data-mode="total">総合ロール</button>
                        <button type="button" class="dim-subs-tab" data-mode="perSlot">部位別ロール</button>
                    </div>
                    <div class="dim-subs-tab-body" id="dim-subs-body"></div>
                </div>
            </div>

            <div class="dim-panel dim-party-panel">
                <h3>パーティ (他メンバーのバフ)</h3>
                <p class="dim-panel-hint">
                    サポート枠のキャラを追加 → 効果のチェックボックスで、メイン火力キャラの計算に反映されます。
                    <b>キャラのみモード</b>はキャラ + Lvプリセットのみで、そのキャラ固有のバフ(必殺・軌跡など)が対象。<b>保存ビルドモード</b>は保存済みビルドを丸ごと読み込み、光円錐・遺物セットのパーティ効果も含めて計算します。
                    発動者のステに連動するバフ(例: 必殺の会心ダメ = 発動者の会心ダメ × Y% + Z%)は、サポート枠キャラの実ステ(装備込み)を使って動的計算されます。
                    <br><span style="color: var(--text-muted)">※ メイン火力キャラと同じキャラをサポート枠に入れることも可能(セルフバフ計算用)。ただし常時発動バフ(昇格6 等)はメイン側の軌跡に既に含まれているため、二重計上を避けるためサポート側で OFF にしてください。</span>
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
    initSubsFromEnvBuffs();
    renderSubsBody();
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
// ---- サブステパネル (3 モード切替) ------------------------------------

// 現モードを再描画 + イベント再バインド + envBuffs 反映 + recompute
function renderSubsBody() {
    const body = document.getElementById('dim-subs-body');
    if (!body) return;

    // タブの active 表示
    document.querySelectorAll('#dim-subs-tabs .dim-subs-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === state.subs.mode);
    });

    if (state.subs.mode === 'manual')      body.innerHTML = renderSubsTab_manual();
    else if (state.subs.mode === 'total')  body.innerHTML = renderSubsTab_total();
    else if (state.subs.mode === 'perSlot') body.innerHTML = renderSubsTab_perSlot();

    bindSubsTabBody();
}

// ── モード 1: 自由入力 ──
function renderSubsTab_manual() {
    return `
        <p class="dim-panel-hint">遺物全体のサブステ集計値を直接入力 (% は数値で「25」と入力すると 25%)。</p>
        <div class="dim-subs-grid">
            ${SUB_INPUTS.map(s => {
                const v = state.subs.manual[s.key] ?? 0;
                const display = s.asPercent ? (v * 100).toFixed(2).replace(/\.?0+$/, '') : v;
                return `
                    <div class="dim-sub-row">
                        <label>${s.label}</label>
                        <input type="number" min="0" step="0.1" class="dim-sub-input"
                               data-stat="${s.key}" data-unit="${s.asPercent ? 'pct' : 'flat'}"
                               value="${display}">
                        <span class="dim-sub-unit">${s.unit}</span>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// ── モード 2: 総合ロール (手動配分) ──
function renderSubsTab_total() {
    const t = state.subs.total;
    const totalRolls = sumAllocations(t.allocations);
    const allocInputs = SUBSTAT_ORDER.map(subKey => renderAllocationInput({
        subKey,
        scope: 'total',
        value: t.allocations[subKey] || 0,
        disabled: false,
    })).join('');
    const isRandom = t.tier === 'random';

    return `
        <p class="dim-panel-hint">
            部位の区別なく、各サブステに振り回数を直接指定します。メインステ制約は適用されません(簡易シミュ)。
            低/中/高 を選択時は入力即計算、ランダム時のみ「シミュレート」で都度乱数。
        </p>
        <div class="dim-roll-controls">
            <div class="dim-roll-row">
                <label>伸び幅</label>
                ${renderTierRadios('total', t.tier)}
            </div>
            <div class="dim-roll-row dim-roll-row-cands">
                <label>振り回数</label>
                <div class="dim-alloc-grid">${allocInputs}</div>
            </div>
            <div class="dim-roll-row">
                <label></label>
                <span class="dim-roll-hint" id="dim-roll-total-sum-hint">合計 <strong>${totalRolls}</strong> ロール (HSR最大 54)</span>
            </div>
            <div class="dim-roll-actions">
                ${isRandom
                    ? `<button type="button" class="primary-btn" id="dim-roll-total-go">${t.lastResult ? '再シミュレート' : 'シミュレート'}</button>`
                    : ''}
                <button type="button" class="secondary-btn-small" id="dim-roll-total-clear">全部 0 にクリア</button>
            </div>
            <div id="dim-roll-total-result-wrap">${renderRollResult(t.lastResult)}</div>
        </div>
    `;
}

// ── モード 3: 部位別ロール (手動配分・メインステ除外) ──
function renderSubsTab_perSlot() {
    const slotHtml = ALL_SLOTS.map(slot => {
        const cfg = state.subs.perSlot[slot];
        const r = state.build.relics?.[slot];
        const mainStatId = r?.mainStat;
        const mainStatLabel = mainStatId
            ? (RELIC_MAIN_OPTIONS[slot][mainStatId]?.label || mainStatId)
            : '(未設定)';
        const candKeys = excludeMainStatFromCandidates(slot, mainStatId, SUBSTAT_ORDER);
        const allowed = new Set(candKeys);

        const allocInputs = SUBSTAT_ORDER.map(subKey => {
            const excluded = !allowed.has(subKey);
            return renderAllocationInput({
                subKey,
                scope: 'perslot',
                slot,
                value: cfg.allocations[subKey] || 0,
                disabled: excluded,
            });
        }).join('');

        const totalRolls = sumAllocations(cfg.allocations);
        const isRandom = cfg.tier === 'random';
        const overLimit = totalRolls > 9;

        return `
            <div class="dim-perslot-card" data-slot="${slot}">
                <div class="dim-perslot-head">
                    <span class="dim-perslot-name">${slotLabel(slot)}</span>
                    <span class="dim-perslot-main">メイン: ${mainStatLabel}</span>
                </div>
                <div class="dim-roll-row">
                    <label>伸び幅</label>
                    ${renderTierRadios('perslot-' + slot, cfg.tier, slot)}
                </div>
                <div class="dim-roll-row dim-roll-row-cands">
                    <label>振り回数</label>
                    <div class="dim-alloc-grid dim-alloc-grid-compact">${allocInputs}</div>
                </div>
                <div class="dim-roll-row">
                    <label></label>
                    <span class="dim-roll-hint ${overLimit ? 'dim-roll-hint-warn' : ''}">
                        合計 <strong>${totalRolls}</strong> ロール (HSR最大 9)
                        ${overLimit ? ' ⚠ 上限超過' : ''}
                    </span>
                </div>
                <div class="dim-roll-actions">
                    ${isRandom
                        ? `<button type="button" class="secondary-btn-small dim-roll-perslot-go" data-slot="${slot}">${cfg.lastResult ? '再シミュ' : 'シミュ'}</button>`
                        : ''}
                    <button type="button" class="secondary-btn-small dim-roll-perslot-clear" data-slot="${slot}">クリア</button>
                </div>
                <div class="dim-roll-result-wrap">${renderRollResult(cfg.lastResult)}</div>
            </div>
        `;
    }).join('');

    const aggregateHtml = renderPerSlotAggregate();

    // ランダム伸び幅を使っている部位があれば「全部位シミュ」ボタンを表示
    const anyRandom = ALL_SLOTS.some(slot => state.subs.perSlot[slot].tier === 'random');

    return `
        <p class="dim-panel-hint">
            部位ごとに各サブステの振り回数を指定。メインステに該当するサブステは入力不可。
            低/中/高 選択時は入力即計算、ランダム時のみシミュボタン押下で都度乱数。
        </p>
        <div class="dim-roll-actions" style="margin-bottom: 0.6rem;">
            ${anyRandom
                ? `<button type="button" class="primary-btn" id="dim-roll-perslot-all">ランダムを一括シミュ</button>`
                : ''}
            <button type="button" class="secondary-btn-small" id="dim-roll-perslot-clear-all">全部位クリア</button>
        </div>
        <div class="dim-perslot-grid">${slotHtml}</div>
        <div id="dim-perslot-summary-wrap">${aggregateHtml}</div>
    `;
}

// 全部位合算プレビューの HTML 生成 (部分更新用に独立)
function renderPerSlotAggregate() {
    const agg = aggregatePerSlotResults();
    if (!agg) {
        return '<p class="dim-panel-hint" style="margin-top: 0.5rem;">各部位の振り回数を入力すると結果が表示されます (ランダム伸び幅時はシミュボタンが必要)。</p>';
    }
    return `<div class="dim-perslot-summary">
        <h4>全部位合算</h4>
        ${renderRollTotalsTable(agg)}
    </div>`;
}

// allocations の合計回数
function sumAllocations(allocations) {
    let sum = 0;
    for (const v of Object.values(allocations)) sum += (parseInt(v, 10) || 0);
    return sum;
}

// 1 サブステの振り回数入力 UI
//   scope: 'total' | 'perslot'  (perslot は slot 必須)
//   max  : total は実質上限なし (99 まで) / perslot は HSR 仕様準拠 (6)
function renderAllocationInput({ subKey, scope, slot = null, value, disabled }) {
    const def = SUBSTAT_TABLE[subKey];
    const maxVal = scope === 'total' ? 99 : 6;
    const dataAttr = scope === 'total'
        ? `data-scope="total" data-subkey="${subKey}"`
        : `data-scope="perslot" data-slot="${slot}" data-subkey="${subKey}"`;
    return `
        <div class="dim-alloc-row ${disabled ? 'dim-alloc-row-disabled' : ''}"
             title="${disabled ? 'メインステと重複するため除外' : ''}">
            <span class="dim-alloc-label">${def.label}</span>
            <input type="number" class="dim-alloc-input"
                   min="0" max="${maxVal}" value="${value}"
                   ${dataAttr} ${disabled ? 'disabled' : ''}>
        </div>
    `;
}

// 伸び幅ラジオの描画 (totalとperSlotで共用)
function renderTierRadios(scopeKey, currentTier, slot = null) {
    const TIERS = [
        { value: 'low',    label: '低のみ' },
        { value: 'mid',    label: '中のみ' },
        { value: 'high',   label: '高のみ' },
        { value: 'random', label: 'ランダム' },
    ];
    return TIERS.map(t => `
        <label class="dim-roll-radio">
            <input type="radio" class="dim-roll-tier" name="tier-${scopeKey}"
                   data-scope="${scopeKey}" data-slot="${slot ?? ''}" value="${t.value}"
                   ${currentTier === t.value ? 'checked' : ''}>
            ${t.label}
        </label>
    `).join('');
}

// ロール結果プレビュー (totals: { subKey: 値 })
function renderRollResult(lastResult) {
    if (!lastResult) return '';
    return `<div class="dim-roll-result">
        <div class="dim-roll-result-head">結果</div>
        ${renderRollTotalsTable(lastResult.totals)}
    </div>`;
}

function renderRollTotalsTable(totals) {
    const entries = Object.entries(totals)
        .filter(([, v]) => v > 0)
        .sort((a, b) => {
            const ai = SUBSTAT_ORDER.indexOf(a[0]);
            const bi = SUBSTAT_ORDER.indexOf(b[0]);
            return ai - bi;
        });
    if (entries.length === 0) return '<div class="dim-roll-empty">(なし)</div>';
    return `<table class="dim-roll-totals">
        ${entries.map(([subKey, v]) => {
            const def = SUBSTAT_TABLE[subKey];
            if (!def) return '';
            // SUBSTAT_TABLE は小数 3 桁 (例: 0.043) で定義しているため、×100 後は
             // 小数 2 位が常に 0 になる。表示は小数 1 位までで十分。
             const display = def.asPercent ? `${(v * 100).toFixed(1)}%` : v.toFixed(1);
            return `<tr><th>${def.label}</th><td>${display}</td></tr>`;
        }).join('')}
    </table>`;
}

// perSlot 全結果を合算 (subKey ベース)
function aggregatePerSlotResults() {
    const out = {};
    let any = false;
    for (const slot of ALL_SLOTS) {
        const r = state.subs.perSlot[slot]?.lastResult;
        if (!r) continue;
        any = true;
        for (const [k, v] of Object.entries(r.totals)) {
            out[k] = (out[k] || 0) + v;
        }
    }
    return any ? out : null;
}

// 既存 envBuffs (BuildStore からのロード等) を state.subs.manual に取り込む
function initSubsFromEnvBuffs() {
    state.subs.manual = {};
    for (const b of state.build.envBuffs || []) {
        if (typeof b.label === 'string' && b.label.startsWith(SUB_LABEL_PREFIX)) {
            state.subs.manual[b.stat] = b.value;
        }
    }
}

// ビルド切替時のリセット (mode を manual に戻し、ロール系の state を完全クリア)
//   ロード直後は env から取り込んだ自由入力値が表示されるのが自然
function resetSubsForBuildSwitch() {
    state.subs.mode = 'manual';
    state.subs.total.allocations = {};
    state.subs.total.lastResult = null;
    for (const slot of ALL_SLOTS) {
        if (state.subs.perSlot[slot]) {
            state.subs.perSlot[slot].allocations = {};
            state.subs.perSlot[slot].lastResult = null;
        }
    }
}

// 総合ロール (手動配分) 計算
//   tier=low/mid/high  : 決定的計算 — 入力即呼び出し可
//   tier=random        : 都度乱数 — シミュボタン押下時のみ呼ぶ
//
// 注: 入力中のフォーカスを保つため、サブステ panel 全体は再描画しない。
//     結果プレビュー DOM だけ部分更新する。
function recalcTotal() {
    const t = state.subs.total;
    t.lastResult = calcManualAllocation({
        allocations: t.allocations,
        tier: t.tier,
    });
    updateTotalResultPreview();
    applySubsToEnvBuffs();
    recompute();
}

// 部位別ロール (手動配分) 計算
//   slot 指定なし: 全部位を再計算
function recalcPerSlot(targetSlot = null) {
    const slots = targetSlot ? [targetSlot] : ALL_SLOTS.slice();
    for (const slot of slots) {
        const cfg = state.subs.perSlot[slot];
        // メインステ除外: 念のため対象外サブステの値を 0 扱いで計算
        const r = state.build.relics?.[slot];
        const allowed = new Set(excludeMainStatFromCandidates(slot, r?.mainStat, SUBSTAT_ORDER));
        const cleanAlloc = {};
        for (const [k, v] of Object.entries(cfg.allocations)) {
            if (allowed.has(k)) cleanAlloc[k] = v;
        }
        cfg.lastResult = calcManualAllocation({ allocations: cleanAlloc, tier: cfg.tier });
        updatePerSlotResultPreview(slot);
    }
    updatePerSlotAggregatePreview();
    applySubsToEnvBuffs();
    recompute();
}

// ---- 結果プレビュー部分更新 (フォーカス維持のため renderSubsBody は使わない) ----

function updateTotalResultPreview() {
    const wrap = document.getElementById('dim-roll-total-result-wrap');
    if (wrap) wrap.innerHTML = renderRollResult(state.subs.total.lastResult);
}
function updatePerSlotResultPreview(slot) {
    const card = document.querySelector(`.dim-perslot-card[data-slot="${slot}"]`);
    if (!card) return;
    const wrap = card.querySelector('.dim-roll-result-wrap');
    if (wrap) wrap.innerHTML = renderRollResult(state.subs.perSlot[slot].lastResult);
}
function updatePerSlotAggregatePreview() {
    const sumEl = document.getElementById('dim-perslot-summary-wrap');
    if (sumEl) sumEl.innerHTML = renderPerSlotAggregate();
}

// 現在描画中のサブステタブ本文内のイベントバインド (renderSubsBody から都度呼ばれる)
function bindSubsTabBody() {
    // ── manual ──
    document.querySelectorAll('.dim-sub-input').forEach(inp => {
        inp.addEventListener('input', () => {
            const stat = inp.dataset.stat;
            const isPct = inp.dataset.unit === 'pct';
            // 直接タイプで負数が入る可能性があるため Math.max(0, ...) でクランプ
            const raw = Math.max(0, parseFloat(inp.value) || 0);
            state.subs.manual[stat] = isPct ? raw / 100 : raw;
            applySubsToEnvBuffs();
            recompute();
        });
    });

    // ── 共通: 振り回数入力 (total / perslot) ──
    document.querySelectorAll('.dim-alloc-input').forEach(inp => {
        inp.addEventListener('input', () => {
            const isTotal = inp.dataset.scope === 'total';
            // total は実質上限なし (99) / perslot は HSR 仕様 (1サブステ最大6ロール)
            const maxVal = isTotal ? 99 : 6;
            const v = Math.max(0, Math.min(maxVal, parseInt(inp.value, 10) || 0));
            const subKey = inp.dataset.subkey;
            if (isTotal) {
                state.subs.total.allocations[subKey] = v;
                updateTotalHint();
                // 確定計算 (low/mid/high) は即反映、random は次のシミュ押下まで保留
                if (state.subs.total.tier !== 'random') recalcTotal();
                else invalidateTotalResult();
            } else {
                const slot = inp.dataset.slot;
                state.subs.perSlot[slot].allocations[subKey] = v;
                updatePerSlotHint(slot);
                if (state.subs.perSlot[slot].tier !== 'random') recalcPerSlot(slot);
                else invalidatePerSlotResult(slot);
            }
        });
    });

    // ── total: 伸び幅・ボタン ──
    document.querySelectorAll('.dim-roll-tier[data-scope="total"]').forEach(r => {
        r.addEventListener('change', () => {
            if (!r.checked) return;
            state.subs.total.tier = r.value;
            // 伸び幅切替: low/mid/high なら即計算、random なら結果無効化 + UI 再描画 (ボタン表示切替)
            if (r.value === 'random') {
                state.subs.total.lastResult = null;
                renderSubsBody();
                applySubsToEnvBuffs();
                recompute();
            } else {
                recalcTotal();
                renderSubsBody();
            }
        });
    });
    const totalGo = document.getElementById('dim-roll-total-go');
    if (totalGo) totalGo.addEventListener('click', () => {
        recalcTotal();
        renderSubsBody();
    });
    const totalClear = document.getElementById('dim-roll-total-clear');
    if (totalClear) totalClear.addEventListener('click', () => {
        state.subs.total.allocations = {};
        state.subs.total.lastResult = null;
        renderSubsBody();
        applySubsToEnvBuffs();
        recompute();
    });

    // ── perSlot: 伸び幅・ボタン ──
    document.querySelectorAll('.dim-roll-tier[data-scope^="perslot-"]').forEach(r => {
        r.addEventListener('change', () => {
            if (!r.checked) return;
            const slot = r.dataset.slot;
            state.subs.perSlot[slot].tier = r.value;
            if (r.value === 'random') {
                state.subs.perSlot[slot].lastResult = null;
                renderSubsBody();
                applySubsToEnvBuffs();
                recompute();
            } else {
                recalcPerSlot(slot);
                renderSubsBody();
            }
        });
    });
    document.querySelectorAll('.dim-roll-perslot-go').forEach(btn => {
        btn.addEventListener('click', () => {
            recalcPerSlot(btn.dataset.slot);
            renderSubsBody();
        });
    });
    document.querySelectorAll('.dim-roll-perslot-clear').forEach(btn => {
        btn.addEventListener('click', () => {
            const slot = btn.dataset.slot;
            state.subs.perSlot[slot].allocations = {};
            state.subs.perSlot[slot].lastResult = null;
            renderSubsBody();
            applySubsToEnvBuffs();
            recompute();
        });
    });
    const allGo = document.getElementById('dim-roll-perslot-all');
    if (allGo) allGo.addEventListener('click', () => {
        // ランダム伸び幅の部位だけシミュ実行 (固定伸び幅は既にリアルタイム計算済み)
        for (const slot of ALL_SLOTS) {
            if (state.subs.perSlot[slot].tier === 'random') recalcPerSlot(slot);
        }
        renderSubsBody();
    });
    const allClear = document.getElementById('dim-roll-perslot-clear-all');
    if (allClear) allClear.addEventListener('click', () => {
        for (const slot of ALL_SLOTS) {
            state.subs.perSlot[slot].allocations = {};
            state.subs.perSlot[slot].lastResult = null;
        }
        renderSubsBody();
        applySubsToEnvBuffs();
        recompute();
    });
}

// 軽量な部分更新: 入力即時の合計バーだけ更新 (フル再描画でフォーカスが飛ぶのを防ぐ)
function updateTotalHint() {
    const hint = document.getElementById('dim-roll-total-sum-hint');
    if (!hint) return;
    const total = sumAllocations(state.subs.total.allocations);
    hint.innerHTML = `合計 <strong>${total}</strong> ロール (HSR最大 54)`;
}
function updatePerSlotHint(slot) {
    const card = document.querySelector(`.dim-perslot-card[data-slot="${slot}"]`);
    if (!card) return;
    const hint = card.querySelector('.dim-roll-hint');
    if (!hint) return;
    const total = sumAllocations(state.subs.perSlot[slot].allocations);
    const overLimit = total > 9;
    hint.innerHTML = `合計 <strong>${total}</strong> ロール (HSR最大 9)${overLimit ? ' ⚠ 上限超過' : ''}`;
    hint.classList.toggle('dim-roll-hint-warn', overLimit);
}

// ランダム tier の結果無効化 (前回の固定計算結果を消す)
function invalidateTotalResult() {
    if (state.subs.total.lastResult) {
        state.subs.total.lastResult = null;
        renderSubsBody();
        applySubsToEnvBuffs();
        recompute();
    }
}
function invalidatePerSlotResult(slot) {
    if (state.subs.perSlot[slot].lastResult) {
        state.subs.perSlot[slot].lastResult = null;
        renderSubsBody();
        applySubsToEnvBuffs();
        recompute();
    }
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
    const levelKeys = getLevelKeysForCharacter(ch);
    grid.innerHTML = levelKeys.map(key => {
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
            const slot = sel.dataset.slot;
            state.build.relics[slot].mainStat = e.target.value;
            // 部位別ロールでメインステ変更 → 候補から外れる subKey の allocation を 0 に戻し、
            // 当該パネルを再描画して入力欄を disable 状態に揃える
            if (state.subs.mode === 'perSlot') {
                const cfg = state.subs.perSlot[slot];
                const allowed = new Set(excludeMainStatFromCandidates(slot, e.target.value, SUBSTAT_ORDER));
                for (const k of Object.keys(cfg.allocations)) {
                    if (!allowed.has(k)) delete cfg.allocations[k];
                }
                // メインステ変更で除外サブステに値が入っていたら結果も無効化
                recalcPerSlot(slot);
                renderSubsBody();
            }
            recompute();
        });
    });

    // サブステタブ切替
    document.querySelectorAll('#dim-subs-tabs .dim-subs-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            state.subs.mode = btn.dataset.mode;
            renderSubsBody();
            applySubsToEnvBuffs();
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
        resetSubsForBuildSwitch();
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
        resetSubsForBuildSwitch();
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

    // トンネルセット (装着 setId のセット効果のみ)
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
    // 注: メイン火力キャラと同じキャラもサポート枠に入れられる(セルフバフ計算用)。
    //     ただし常時発動バフ(昇格6 等)はメイン側の軌跡に既に含まれており
    //     サポート側でも ON にすると二重計上になるため、ユーザー側で off にすること。
    const charOptions = [`<option value="">(なし)</option>`].concat(
        Registry.character.list()
            .filter(c => c.id !== 'template')
            .map(c => {
                const sameAsFocus = c.id === state.build.characterId;
                const label = sameAsFocus ? `${c.name} (メインと同キャラ)` : c.name;
                return `<option value="${c.id}" ${c.id === slot.characterId ? 'selected' : ''}>${label}</option>`;
            })
    ).join('');

    const buildOptions = [`<option value="">(なし)</option>`].concat(
        BuildStore.list()
            .map(b => {
                const ch = Registry.character.get(b.characterId);
                const sameAsFocus = b.characterId === state.build.characterId;
                const tag = sameAsFocus ? ' (メインと同キャラ)' : '';
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
                    <label class="dim-radio" title="キャラと凸プリセットだけ指定。そのキャラ固有の効果(必殺・軌跡など)のみ表示されます。">
                        <input type="radio" class="dim-party-mode" data-idx="${idx}" name="party-mode-${idx}" value="simple" ${!isBuildMode ? 'checked' : ''}> キャラのみ
                    </label>
                    <label class="dim-radio" title="保存ビルドを丸ごと指定。装備込みの実ステを使って、光円錐・遺物セットの効果も含めて計算します。">
                        <input type="radio" class="dim-party-mode" data-idx="${idx}" name="party-mode-${idx}" value="build" ${isBuildMode ? 'checked' : ''}> 保存ビルド
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

// 現モードのサブステ結果を envBuffs に書き込む (既存 SUB_LABEL_PREFIX を一掃して再構築)
//   manual : state.subs.manual の入力値
//   total  : state.subs.total.lastResult.totals
//   perSlot: 全部位の lastResult.totals を合算
function applySubsToEnvBuffs() {
    state.build.envBuffs = (state.build.envBuffs || []).filter(b =>
        !(typeof b.label === 'string' && b.label.startsWith(SUB_LABEL_PREFIX))
    );
    const pushStatDict = (statDict) => {
        for (const [stat, value] of Object.entries(statDict)) {
            if (!value) continue;
            state.build.envBuffs.push({ stat, value, label: SUB_LABEL_PREFIX + stat });
        }
    };

    if (state.subs.mode === 'manual') {
        pushStatDict(state.subs.manual);
        return;
    }
    if (state.subs.mode === 'total') {
        const t = state.subs.total.lastResult;
        if (t) pushStatDict(rollsToStatDict(t.totals));
        return;
    }
    if (state.subs.mode === 'perSlot') {
        const agg = aggregatePerSlotResults();
        if (agg) pushStatDict(rollsToStatDict(agg));
        return;
    }
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
        // 共通系
        atk:           '攻撃力倍率',
        hpPct:         '最大HP倍率',
        dmgBuff:       '与ダメバフ',
        atkBuff:       '攻撃力バフ',
        cdRatio:       '会心ダメ係数(発動者CDに対する%)',
        cdFlat:        '会心ダメ固定値',
        advance:       '行動値短縮',
        // ヒーラー / 記憶の精霊系
        allyHpPct:     '味方HP%回復',
        allyHpFlat:    '味方HP固定回復',
        ikarunHpPct:   'イカルンHP%回復',
        ikarunHpFlat:  'イカルンHP固定回復',
        maxHpPct:      '最大HP+%',
        maxHpFlat:     '最大HP+固定値',
        ikarunDmgBuff: 'イカルン与ダメ+%',
        healDmgRatio: '累計治癒量倍率',
        ikarunHealPct: 'イカルン回復%',
        ikarunHealFlat:'イカルン回復固定値',
    };
    // % 表示するキー (小数値を × 100 して % 付与)
    const FMT_PCT_KEYS = new Set([
        'dmgBuff', 'atkBuff', 'cdRatio', 'cdFlat', 'advance',
        'hpPct', 'allyHpPct', 'ikarunHpPct', 'maxHpPct',
        'ikarunDmgBuff', 'healDmgRatio', 'ikarunHealPct',
    ]);
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
