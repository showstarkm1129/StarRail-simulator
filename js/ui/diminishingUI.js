// diminishingUI.js — 限界効用逓減タブのUIロジック
//
// キャラクター本体(光円錐・遺物・軌跡レベル)の作成はキャラビルドタブの責務。
// このタブは「保存ビルドを読み込んで比較する」ことに専念し、キャラ・星魂の
// 切替だけを直接編集項目として持つ (光円錐・遺物・サブステの直接入力は持たない)。
//
// 構成:
//   1. ビルド管理 (保存/新規/読込/削除/JSON入出力)
//   2. キャラパネル (キャラ選択 + 星魂)
//   3. 自身バフ・デバフ設定パネル
//   4. パーティパネル (他メンバーのバフ)
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
    ALL_SLOTS, SET_TYPE, ELEMENT_LIST, PATH,
} from '../build/constants.js';
import {
    getTraceLevelCap, getSkillMultAt,
    presetTraceLevels,
} from '../build/skillUtil.js';
import { signatureLightconeForCharacter } from '../data/lightcones/signatureRelations.js';
import {
    DEFAULT_VISIBLE_ROWS,
    DEFAULT_VISIBLE_STATS,
    diminishingSession,
} from '../build/diminishingSession.js';
import {
    computeDiminishingState,
    materializeDiminishingBuild,
    rankBuildCandidates,
} from '../build/diminishingEngine.js';
import {
    candidateGroupKey, candidateLabel, getBuildCandidates, isEidolonCandidate,
} from '../build/buildCandidates.js';
import { statLabel } from './statIcons.js';
import { enhanceSelect, refreshSmartPickers } from './smartPicker.js';

const PARTY_LABEL_PREFIX = 'パーティ.';   // envBuffs のラベル識別子

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

const ELEMENT_LABELS = Object.freeze({
    physical: '物理',
    fire: '炎',
    ice: '氷',
    lightning: '雷',
    wind: '風',
    quantum: '量子',
    imaginary: '虚数',
});

const PATH_LABELS = Object.freeze({
    destruction: '壊滅',
    hunt: '巡狩',
    erudition: '知恵',
    harmony: '調和',
    nihility: '虚無',
    preservation: '存護',
    abundance: '豊穣',
    remembrance: '記憶',
    elation: '愉悦',
});

const ELEMENT_FILTER_OPTIONS = ELEMENT_LIST.map(value => ({
    value,
    label: ELEMENT_LABELS[value] || value,
}));

const PATH_FILTER_OPTIONS = Object.values(PATH).map(value => ({
    value,
    label: PATH_LABELS[value] || value,
}));

const RARITY_FILTER_OPTIONS = [
    { value: '5', label: '★5' },
    { value: '4', label: '★4' },
    { value: '3', label: '★3' },
];

const CHARACTER_PICKER_FILTERS = [
    { key: 'element', label: '属性', options: ELEMENT_FILTER_OPTIONS },
    { key: 'path', label: '運命', options: PATH_FILTER_OPTIONS },
    { key: 'rarity', label: 'レア', options: RARITY_FILTER_OPTIONS },
];

function selectOptionText(option) {
    return option?.textContent?.trim() || option?.value || '(未選択)';
}

function characterPickerConfig(extra = {}) {
    return {
        kind: 'character',
        placeholder: 'キャラ名 / 英名で検索',
        noResultsText: '該当キャラなし',
        recentKey: 'srsim.recent.characters',
        filters: CHARACTER_PICKER_FILTERS,
        ...extra,
        getOptionMeta(option) {
            const ch = Registry.character.get(option.value);
            if (!ch) return { label: selectOptionText(option), searchText: option.value };
            return {
                label: selectOptionText(option),
                subLabel: ch.id,
                searchText: [ch.name, ch.id, ...(ch.aliases || [])].join(' '),
                filterValues: {
                    element: ch.element,
                    path: ch.path,
                    rarity: String(ch.rarity || ''),
                },
                chips: [
                    ch.element ? { label: ELEMENT_LABELS[ch.element] || ch.element, tone: `element-${ch.element}` } : null,
                    ch.path ? { label: PATH_LABELS[ch.path] || ch.path, tone: 'path' } : null,
                    ch.rarity ? { label: `★${ch.rarity}`, tone: `rarity-${ch.rarity}` } : null,
                ],
            };
        },
    };
}

function buildPickerConfig(extra = {}) {
    return {
        kind: 'build',
        placeholder: 'ビルド名 / キャラ名で検索',
        noResultsText: '該当ビルドなし',
        recentKey: 'srsim.recent.builds',
        filters: CHARACTER_PICKER_FILTERS,
        ...extra,
        getOptionMeta(option) {
            const build = BuildStore.get(option.value);
            if (!build) return { label: selectOptionText(option), searchText: option.value };
            const ch = Registry.character.get(build.characterId);
            return {
                label: selectOptionText(option),
                subLabel: build.id,
                searchText: [build.name, build.id, ch?.name, ch?.id, build.characterId].join(' '),
                filterValues: {
                    element: ch?.element,
                    path: ch?.path,
                    rarity: String(ch?.rarity || ''),
                },
                chips: [
                    ch?.element ? { label: ELEMENT_LABELS[ch.element] || ch.element, tone: `element-${ch.element}` } : null,
                    ch?.path ? { label: PATH_LABELS[ch.path] || ch.path, tone: 'path' } : null,
                    ch?.rarity ? { label: `★${ch.rarity}`, tone: `rarity-${ch.rarity}` } : null,
                ],
            };
        },
    };
}

// ---- 状態 --------------------------------------------------------------

// ===== 参照ステ・表示項目のショートカット (プリセット) =====
//   1クリックで「参照ステ + 最終ステ表示項目 + 火力貢献率の表示行」を一括設定する。
//   ・アタッカー: 撃破特効を除く、ダメージ式に効く全項目を表示 (参照ステ atk/hp のみ差替)
//   ・サポーター: 速度/EP/効果命中などのサポート指標 + デバフ型の貢献枠
//   ・カスタム: 現在の表示状態を名前付きで保存 (localStorage、いくつでも追加可)
const REF_PRESET_STORAGE_KEY = 'srsim.dim.refPresets';

// アタッカー共通の最終ステ表示 (撃破特効は除外)。参照ステ(atk/hp)だけ先頭で差し替える。
const ATTACKER_DMG_STATS = [
    'critRate', 'critDmg', 'critExpected',
    'critRateBasic', 'critRateSkill', 'critRateUlt', 'critRateFollowup',
    'critDmgBasic', 'critDmgSkill', 'critDmgUlt', 'critDmgFollowup',
    'dmgOwnElement', 'dmgBasic', 'dmgSkill', 'dmgUlt', 'dmgFollowup',
    'dmgTotalBasic', 'dmgTotalSkill', 'dmgTotalUlt', 'dmgTotalFollowup',
    'fixedDmg', 'sepMult',
    'defDown', 'defIgnore', 'defReductionTotal', 'resPen', 'dmgTaken',
    'defIgnoreBasic', 'defIgnoreSkill', 'defIgnoreUlt', 'defIgnoreFollowup',
    'resPenBasic', 'resPenSkill', 'resPenUlt', 'resPenFollowup',
    'dmgTakenBasic', 'dmgTakenSkill', 'dmgTakenUlt', 'dmgTakenFollowup',
];
// アタッカー共通の火力貢献率の表示行 (撃破係数は除外)。
const ATTACKER_DMG_ROWS = [
    'atk', 'crit',
    'crit.basic', 'crit.skill', 'crit.ult', 'crit.followup',
    'dmg.base', 'dmg.basic', 'dmg.skill', 'dmg.ult', 'dmg.followup',
    'def', 'def.basic', 'def.skill', 'def.ult', 'def.followup',
    'res', 'res.basic', 'res.skill', 'res.ult', 'res.followup',
    'taken', 'taken.basic', 'taken.skill', 'taken.ult', 'taken.followup',
    'fixedDmg', 'sepMult',
    'total.base', 'total.basic', 'total.skill', 'total.ult', 'total.followup',
];

const REF_PRESETS_BUILTIN = [
    {
        id: 'atkDealer', name: '攻撃アタッカー', refStat: 'atk',
        visibleStats: ['atk', 'spd', 'energyRegen', ...ATTACKER_DMG_STATS],
        visibleRows: ATTACKER_DMG_ROWS,
    },
    {
        id: 'hpDealer', name: 'HPアタッカー', refStat: 'hp',
        visibleStats: ['hp', 'spd', 'energyRegen', ...ATTACKER_DMG_STATS],
        visibleRows: ATTACKER_DMG_ROWS,
    },
    {
        id: 'support', name: 'サポーター', refStat: 'atk',
        visibleStats: ['spd', 'energyRegen', 'ehr', 'eres', 'hp', 'def', 'critRate', 'critDmg', 'defDown', 'defIgnore', 'resPen', 'dmgTaken'],
        visibleRows: ['def', 'res', 'taken', 'total.base'],
    },
];

const STATS_CATEGORIES = {
    basic: '① 基礎ステータス',
    crit: '② 会心関連',
    dmg_individual: '③ ダメージアップ系',
    dmg_total: '④ 与ダメージバフ合計',
    debuff: '⑤ デバフ・防御・耐性',
    other: '⑥ その他・特殊',
};

const FACTOR_CATEGORIES = {
    basic_crit: '① 基礎・会心係数',
    dmg: '② 与ダメージ係数',
    debuff: '③ 防御・耐性・被ダメ係数',
    break: '④ 撃破係数',
    total: '⑤ 火力総合 (結果)',
};

// 状態本体は DOM 非依存セッションが所有する。UI は同じ参照を入力・描画に使う。
const state = diminishingSession.getState();
let assistantUi = null;
let selectedBuildId = null;
let candidateRankCacheKey = '';
let candidateRankCache = null;

const DIM_CANDIDATE_SLOT_LABELS = Object.freeze({
    head: '頭部', hands: '手部', body: '胴体', feet: '脚部', sphere: '次元界オーブ', rope: '連結縄',
});

function activeCandidateIds() {
    if (Array.isArray(state.activeCandidateIds) && state.activeCandidateIds.length > 0) {
        return [...state.activeCandidateIds];
    }
    return state.activeCandidateId ? [state.activeCandidateId] : [];
}

function setActiveCandidateIds(ids) {
    state.activeCandidateIds = [...new Set(ids.filter(id => typeof id === 'string' && id))];
    state.activeCandidateId = state.activeCandidateIds.length === 1 ? state.activeCandidateIds[0] : null;
}

function clearActiveCandidates() {
    setActiveCandidateIds([]);
}

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
    selectedBuildId = null;
    clearActiveCandidates();
    invalidateCandidateRankingCache();
    // 軌跡Lv は共通の初期値 (通常攻撃系6 / その他10) で初期化
    state.build.traceLevel = presetTraceLevels(Registry.character.get(firstCharId));

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
    renderRefPresets();
    bindRefPresets();
    refreshAllForms();
    applyInputModeVisibility();
    recompute();
    // 他タブ (キャラビルド) がビルドを保存・削除した時に一覧を追従させる。
    document.addEventListener('srsim:builds-changed', refreshBuildList);
    window.SRSIM_LOCAL?.registerTab({
        tab: 'diminishing',
        label: '限界効用',
        mount: '.dim-container',
        getState: serializeDiminishingLocalState,
        applyState: applyDiminishingLocalState,
    });
    return Object.freeze({
        session: diminishingSession,
        getState: serializeDiminishingLocalState,
        applyState: applyDiminishingLocalState,
        refresh: applyDiminishingSessionToUi,
        attachAssistant(handle) {
            assistantUi = handle;
        },
    });
}

function serializeDiminishingLocalState() {
    const serialized = diminishingSession.serialize();
    // 保存ビルドを使うパーティ枠は、DOM/LocalStorage がない計算環境でも再現できるよう実体を同梱する。
    serialized.party = serialized.party.map(slot => ({
        ...slot,
        build: slot.buildId ? BuildStore.get(slot.buildId) : slot.build,
    }));
    return serialized;
}

function applyDiminishingLocalState(payload) {
    diminishingSession.restore(payload);

    // この画面は保存済みキャラビルドを比較対象にする。旧ローカル状態に
    // 直接入力モードや自身効果の選択が残っていても、UIの責務へ戻す。
    state.inputMode = 'build';
    if (state.build?.id && BuildStore.get(state.build.id)) {
        selectedBuildId = state.build.id;
        state.build = sanitizeSelectedBuild(BuildStore.get(state.build.id));
    } else {
        selectedBuildId = null;
    }
    clearActiveCandidates();
    invalidateCandidateRankingCache();

    applyDiminishingSessionToUi();
}

function applyDiminishingSessionToUi() {

    const nameInput = document.getElementById('dim-build-name');
    if (nameInput) nameInput.value = state.build?.name || '';
    refreshAllForms(false);
    applyInputModeVisibility();
    updateSnapshotStatus();
    recompute();
}

// ---- HTML 骨組み -------------------------------------------------------

function renderShell() {
    return `
        <div class="dim-container">
            <h2 class="dim-title">限界効用逓減計算機</h2>
            <p class="dim-help">
                <b>キャラビルドタブ</b>で作成した保存ビルドを選択 → 登録済みの差分候補を切り替え →
                パーティと敵条件を調整して火力貢献率を確認します。
                <br><span style="color: var(--text-muted)">※ SPD変化は情報表示のみ。行動回数の影響は「速度・行動回数」タブで別途確認してください。</span>
            </p>

            <div class="dim-build-mgr">
                <h3 class="dim-build-mgr-title">キャラビルドを選択</h3>
                <div class="dim-build-mgr-row">
                    <label>保存済み</label>
                    <select id="dim-build-list"></select>
                    <button id="dim-build-load" class="btn-secondary btn-mini">読込</button>
                </div>
                <input id="dim-build-name" type="text" class="dim-selected-build-name" readonly placeholder="未選択">
                <p class="dim-panel-hint">キャラ・装備・星魂・差分候補は、キャラビルドタブで保存した内容を使います。</p>
            </div>

            <div class="dim-controls">
                <button id="dim-snapshot-btn" class="btn-primary">現状をスナップショットして比較開始</button>
                <button id="dim-clear-btn" class="btn-secondary">スナップショットをクリア</button>
                <span id="dim-snapshot-status" class="dim-snapshot-status">スナップショット: なし</span>
            </div>

            <div class="dim-main">
              <div class="dim-col-left">
            <div class="dim-panel" id="dim-candidates-panel">
                <h3>差分候補</h3>
                <p class="dim-panel-hint">
                    キャラビルド側で登録した候補を、現在のパーティ・敵条件のまま切り替えます。
                    候補は項目ごとに1件ずつ選択できます。別の項目は組み合わせて適用でき、
                    同じ項目を選び直すとその項目だけ置き換わります。
                </p>
                <div id="dim-candidates"></div>
            </div>

            <div class="dim-panel dim-party-panel">
                <h3>パーティ (他メンバーのバフ)</h3>
                <p class="dim-panel-hint">
                    サポート枠のキャラを追加 → 効果のチェックボックスで、メイン火力キャラの計算に反映されます。
                    <b>キャラのみモード</b>はキャラ + Lvプリセット + モチーフ光円錐S1で、そのキャラ固有のバフとモチーフ光円錐効果が対象。モチーフが未登録のキャラは光円錐なしになります。<b>保存ビルドモード</b>は保存済みビルドを丸ごと読み込み、光円錐・遺物セットのパーティ効果も含めて計算します。
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
                <div id="dim-special-refs" class="dim-special-refs"></div>
            </div>
              </div><!-- /dim-col-left -->

              <div class="dim-col-right">
            <div id="dim-presets" class="dim-presets"></div>
            <div id="dim-result" class="dim-result"></div>

            <div id="dim-char-detail" class="dim-char-detail"></div>
              </div><!-- /dim-col-right -->
            </div><!-- /dim-main -->
        </div>
    `;
}

// ---- フォーム初期化 ----------------------------------------------------

function refreshAllForms() {
    fillOptionInputs();
    refreshBuildList();
    renderCandidates();
    renderParty();
    renderCharDetail();
    refreshSmartPickers(document.getElementById('tab-diminishing'));
}

// サブステ・遺物メインステの直接入力 UI は削除済み。
//   遺物(セット/メインステ/サブステ)・光円錐はキャラビルドタブで作成した保存ビルドの読込のみで設定する。
function fillOptionInputs() {
    document.getElementById('dim-opt-ref').value = state.options.refStat;
    document.getElementById('dim-opt-crit').value = state.options.critMode;
    document.getElementById('dim-opt-enemy-lv').value = state.options.enemyLevel;
    document.getElementById('dim-opt-enemy-res').value = (state.options.enemyBaseRes * 100);
    document.getElementById('dim-opt-break').value = state.options.breakState;
    renderSpecialReferenceInputs();
}

const SPECIAL_REFERENCE_META = Object.freeze({
    cumulativeHealing: { label: '本戦闘の累計治癒量', unit: '', hint: 'ヒアンシーの精霊スキル用' },
    summonHp: { label: '召喚物の最大HP', unit: '', hint: 'キャストリスの死竜など。息吹モード用' },
    gluttonyStacks: { label: '暴食の層数', unit: '層', hint: '不死途の条件付き追加攻撃用' },
});

function specialReferenceKeysForCurrentCharacter() {
    const character = Registry.character.get(state.build?.characterId);
    const keys = new Set();
    for (const skill of Object.values(character?.skills || {})) {
        for (const component of skill.damageComponents || []) {
            if (component.referenceKey) keys.add(component.referenceKey);
            if (component.conditionKey) keys.add(component.conditionKey);
        }
    }
    return [...keys].filter(key => SPECIAL_REFERENCE_META[key]);
}

function renderSpecialReferenceInputs() {
    const wrap = document.getElementById('dim-special-refs');
    if (!wrap) return;
    const keys = specialReferenceKeysForCurrentCharacter();
    if (keys.length === 0) {
        wrap.innerHTML = '';
        return;
    }
    const values = state.options.referenceValues || {};
    wrap.innerHTML = `
        <p class="dim-panel-hint">特殊な攻撃倍率が参照する値（未入力は0）</p>
        <div class="dim-options-row dim-special-refs-row">
            ${keys.map(key => {
                const meta = SPECIAL_REFERENCE_META[key];
                return `<div class="dim-row">
                    <label>${escapeHtml(meta.label)}</label>
                    <input type="number" min="0" step="any" data-dim-reference-key="${escapeHtml(key)}" value="${Number(values[key] || 0)}">
                    ${meta.unit ? `<span class="dim-sub-unit">${escapeHtml(meta.unit)}</span>` : ''}
                    <small class="dim-special-ref-hint">${escapeHtml(meta.hint)}</small>
                </div>`;
            }).join('')}
        </div>
    `;
}

// ---- イベントバインド --------------------------------------------------

function bindAll() {
    document.getElementById('dim-snapshot-btn').addEventListener('click', () => {
        if (state.inputMode === 'direct') {
            state.direct.snapshot = { ...state.direct.stats };
        } else {
            state.snapshot = materializeDiminishingBuild(state);
        }
        updateSnapshotStatus();
        recompute();
    });
    document.getElementById('dim-clear-btn').addEventListener('click', () => {
        if (state.inputMode === 'direct') state.direct.snapshot = null;
        else                              state.snapshot = null;
        updateSnapshotStatus();
        recompute();
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
    document.getElementById('dim-special-refs').addEventListener('input', e => {
        const key = e.target.dataset.dimReferenceKey;
        if (!key) return;
        state.options.referenceValues = {
            ...(state.options.referenceValues || {}),
            [key]: Math.max(0, parseFloat(e.target.value) || 0),
        };
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

    document.getElementById('dim-build-list').addEventListener('change', () => {
        loadSelectedBuild();
    });
    document.getElementById('dim-build-load').addEventListener('click', () => {
        loadSelectedBuild();
    });
}

// ---- パーティ枠 (Feature 3: Plan A) -----------------------------------

// 各 slot に対し、計算用 teammate build を派生する。
//   buildId 優先 (BuildStore から完全ビルド)。なければ簡易モード(char + Lv preset)で blank ビルドを構築。
function partyBuildFor(slot) {
    if (slot.build) return JSON.parse(JSON.stringify(slot.build));
    if (slot.buildId) {
        const b = BuildStore.get(slot.buildId);
        if (b) return JSON.parse(JSON.stringify(b));   // 防御コピー
    }
    if (!slot.characterId) return null;
    const ch = Registry.character.get(slot.characterId);
    if (!ch) return null;
    const b = BuildStore.blank(slot.characterId);
    b.traceLevel = presetTraceLevels(ch);
    if (slot.lightcone?.id) b.lightcone = { ...slot.lightcone };
    if (slot.ornamentId) {
        b.relics.sphere.setId = slot.ornamentId;
        b.relics.rope.setId = slot.ornamentId;
    }
    return b;
}

// teammate に紐づく全 partyEffects をソース別に収集
//   返り値: [{ srcKey, srcLabel, ef }, ...]
//     srcKey 例: 'char' | 'lc' | 'set:Messenger Traversing Hackerspace:pc4' | 'orn:Sprightly Vonwacq:pc2'
//
// 星魂条件 (ef.minEidolon) 付きの効果は、teammate の現在星魂が満たない場合は除外される。
function gatherTeammateEffects(teammateBuild) {
    if (!teammateBuild) return [];
    const out = [];
    const ch = Registry.character.get(teammateBuild.characterId);
    if (!ch) return out;

    const teammateEidolon = teammateBuild.eidolon || 0;

    // キャラ (星魂条件 minEidolon でフィルタ)
    const charSrcKey = `char:${ch.id}`;
    for (const ef of ch.partyEffects || []) {
        if (ef.minEidolon && teammateEidolon < ef.minEidolon) continue;
        out.push({ srcKey: charSrcKey, srcLabel: `キャラ: ${ch.name}`, ef });
    }

    // テスト用キャラ: 全 LC / 全セット (2pc+4pc) / 全オーナメントの partyEffects を
    //   「全部所有している teammate」として一括列挙し、通常の equipped 装備処理は飛ばす。
    //   光円錐の superimpose は ch.testAllSuperimpose (1〜5) を参照。未定義は 5 (S5)。
    if (ch.isTestAllEquipment) {
        const si = Math.max(1, Math.min(5, ch.testAllSuperimpose ?? 5));
        for (const lc of Registry.lightcone.list()) {
            const effs = typeof lc.partyEffects === 'function'
                ? (lc.partyEffects(si) || [])
                : (lc.partyEffects || []);
            for (const ef of effs) {
                out.push({ srcKey: `testlc:${lc.id}`, srcLabel: `[テスト] 光円錐: ${lc.name} S${si}`, ef });
            }
        }
        for (const set of Registry.relicSet.list()) {
            if (!set.partyEffects) continue;
            for (const ef of (set.partyEffects.pc2 || [])) {
                out.push({ srcKey: `testset:${set.id}:pc2`, srcLabel: `[テスト] セット: ${set.name} 2pc`, ef });
            }
            for (const ef of (set.partyEffects.pc4 || [])) {
                out.push({ srcKey: `testset:${set.id}:pc4`, srcLabel: `[テスト] セット: ${set.name} 4pc`, ef });
            }
        }
        for (const orn of Registry.ornament.list()) {
            if (!orn.partyEffects) continue;
            for (const ef of (orn.partyEffects.pc2 || [])) {
                out.push({ srcKey: `testorn:${orn.id}:pc2`, srcLabel: `[テスト] 次元界: ${orn.name} 2pc`, ef });
            }
        }
        return out;   // 通常の equipped 装備処理 (下記) はスキップ
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
//   ef.computeStats が定義 → FinalStats(caster) を使って動的計算
//     ・ef.fromLevel あり: 該当スキルの Lv と倍率テーブル mult を渡す (Lv 連動効果)
//     ・ef.fromLevel なし: lv=1, mult=null を渡す (速度/星魂など Lv 非依存の効果。例: サフェル)
function resolveEffectStats(ef, teammateBuild, teammateStats) {
    if (ef.stats) return ef.stats;
    if (typeof ef.computeStats === 'function') {
        let lv = 1;
        let mult = null;
        if (ef.fromLevel) {
            const ch = Registry.character.get(teammateBuild.characterId);
            const skill = ch?.skills?.[ef.fromLevel];
            if (!skill?.levels) return null;
            lv = (teammateBuild.traceLevel?.[ef.fromLevel]) || 1;
            const idx = Math.max(0, Math.min(skill.levels.length - 1, lv - 1));
            mult = skill.levels[idx];
        }
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

/*
// focus キャラクターの effects (partyEffects + selfEffects) を収集
function gatherFocusEffects(build) {
    if (!build || !build.characterId) return [];
    const out = [];
    const ch = Registry.character.get(build.characterId);
    if (!ch) return out;

    const eidolon = build.eidolon || 0;

    // 1. キャラ
    const charSrcKey = `char:${ch.id}`;
    for (const ef of ch.partyEffects || []) {
        if (ef.minEidolon && eidolon < ef.minEidolon) continue;
        out.push({ srcKey: charSrcKey, srcLabel: `キャラ: ${ch.name}`, ef, type: 'party' });
    }
    for (const ef of ch.selfEffects || []) {
        if (ef.minEidolon && eidolon < ef.minEidolon) continue;
        out.push({ srcKey: charSrcKey, srcLabel: `キャラ: ${ch.name}`, ef, type: 'self' });
    }

    // 2. 光円錐
    if (build.lightcone?.id) {
        const lc = Registry.lightcone.get(build.lightcone.id);
        if (lc) {
            const si = Math.max(1, Math.min(5, build.lightcone.superimpose || 1));
            const lcEffects = typeof lc.partyEffects === 'function'
                ? (lc.partyEffects(si) || [])
                : (lc.partyEffects || []);
            for (const ef of lcEffects) {
                out.push({ srcKey: 'lc', srcLabel: `光円錐: ${lc.name} S${si}`, ef, type: 'party' });
            }
            const lcSelfEffects = typeof lc.selfEffects === 'function'
                ? (lc.selfEffects(si) || [])
                : (lc.selfEffects || []);
            for (const ef of lcSelfEffects) {
                out.push({ srcKey: 'lc', srcLabel: `光円錐: ${lc.name} S${si}`, ef, type: 'self' });
            }
        }
    }

    // 3. 遺物セット (cavern)
    const cavCounts = countSetsByType(build.relics, SET_TYPE.CAVERN);
    for (const [setId, cnt] of Object.entries(cavCounts)) {
        const set = Registry.relicSet.get(setId);
        if (!set) continue;
        if (set.partyEffects) {
            if (cnt >= 2) for (const ef of set.partyEffects.pc2 || []) {
                out.push({ srcKey: `set:${setId}:pc2`, srcLabel: `セット: ${set.name} 2pc`, ef, type: 'party' });
            }
            if (cnt >= 4) for (const ef of set.partyEffects.pc4 || []) {
                out.push({ srcKey: `set:${setId}:pc4`, srcLabel: `セット: ${set.name} 4pc`, ef, type: 'party' });
            }
        }
        if (set.selfEffects) {
            if (cnt >= 2) for (const ef of set.selfEffects.pc2 || []) {
                out.push({ srcKey: `set:${setId}:pc2`, srcLabel: `セット: ${set.name} 2pc`, ef, type: 'self' });
            }
            if (cnt >= 4) for (const ef of set.selfEffects.pc4 || []) {
                out.push({ srcKey: `set:${setId}:pc4`, srcLabel: `セット: ${set.name} 4pc`, ef, type: 'self' });
            }
        }
    }

    // 4. オーナメント (planar)
    const ornCounts = countSetsByType(build.relics, SET_TYPE.PLANAR);
    for (const [setId, cnt] of Object.entries(ornCounts)) {
        const orn = Registry.ornament.get(setId);
        if (!orn) continue;
        if (orn.partyEffects) {
            if (cnt >= 2) for (const ef of orn.partyEffects.pc2 || []) {
                out.push({ srcKey: `orn:${setId}:pc2`, srcLabel: `次元界: ${orn.name} 2pc`, ef, type: 'party' });
            }
        }
        if (orn.selfEffects) {
            if (cnt >= 2) for (const ef of orn.selfEffects.pc2 || []) {
                out.push({ srcKey: `orn:${setId}:pc2`, srcLabel: `次元界: ${orn.name} 2pc`, ef, type: 'self' });
            }
        }
    }

    return out;
}

 * 自身バフ・デバフの旧UI実装は、保存ビルドの候補比較へ責務を一本化したため
 * 画面から外している。計算エンジン側にはAI/旧状態互換のため実装を残す。
const SELF_LABEL_PREFIX = '自身バフ.';

function applySelfBuffsToEnvBuffs() {
    // 既存の自身バフを一掃
    state.build.envBuffs = (state.build.envBuffs || []).filter(b =>
        !(typeof b.label === 'string' && b.label.startsWith(SELF_LABEL_PREFIX))
    );

    if (!state.build || !state.build.characterId) return;

    // 依存関係を解決するために、自身バフ適用前（かつパーティバフとサブステは適用済み）のベースステータスを計算
    let baseStats = null;
    try {
        baseStats = StatComputer.compute(state.build);
    } catch (err) {
        console.error('[applySelfBuffsToEnvBuffs] baseStats compute failed', err);
        return;
    }

    const effects = gatherFocusEffects(state.build);
    const activeSet = new Set(state.build.activeSelfEffectIds || []);
    const stacksMap = state.build.selfStacksByEffectId || {};

    for (const { srcKey, ef } of effects) {
        const ekey = effectKey(srcKey, ef.id);
        if (!activeSet.has(ekey)) continue;

        const stats = resolveEffectStats(ef, state.build, baseStats);
        if (!stats) continue;

        const stacks = ef.stackable
            ? (stacksMap[ekey] ?? ef.stackable.default ?? ef.stackable.max ?? 1)
            : 1;

        const finalStats = applyStackMult(stats, stacks, ef);

        for (const [stat, value] of Object.entries(finalStats)) {
            state.build.envBuffs.push({
                stat,
                value: value,
                label: `${SELF_LABEL_PREFIX}${srcKey}.${ef.id}.${stat}`,
            });
        }
    }
}

function applyDefaultActiveSelfEffects(preserveExisting = false) {
    const build = state.build;
    if (!build) return;
    build.activeSelfEffectIds ||= [];
    build.selfStacksByEffectId ||= {};
    const effects = gatherFocusEffects(build);
    const activeSet = new Set(preserveExisting ? build.activeSelfEffectIds : []);
    const nextStacks = {};

    for (const { srcKey, ef } of effects) {
        const ekey = effectKey(srcKey, ef.id);
        if (!preserveExisting && ef.defaultActive) {
            activeSet.add(ekey);
        } else if (preserveExisting) {
            if (ef.defaultActive && !build.activeSelfEffectIds.includes(ekey)) {
                activeSet.add(ekey);
            }
        }
        if (ef.stackable) {
            nextStacks[ekey] = build.selfStacksByEffectId[ekey] ?? ef.stackable.default ?? ef.stackable.max ?? 1;
        }
    }

    const validKeys = new Set(effects.map(({ srcKey, ef }) => effectKey(srcKey, ef.id)));
    for (const k of activeSet) {
        if (!validKeys.has(k)) {
            activeSet.delete(k);
        }
    }

    build.activeSelfEffectIds = Array.from(activeSet);
    build.selfStacksByEffectId = nextStacks;
}

function renderSelfBuffs() {
    const wrap = document.getElementById('dim-self-buffs-content');
    if (!wrap) return;

    const build = state.build;
    if (!build || !build.characterId) {
        wrap.innerHTML = '<p class="dim-panel-hint">キャラクターを選択してください</p>';
        return;
    }

    build.activeSelfEffectIds ||= [];
    build.selfStacksByEffectId ||= {};

    const effects = gatherFocusEffects(build);

    const partyEffectsList = effects.filter(e => e.type === 'party');
    const selfEffectsList = effects.filter(e => e.type === 'self');

    const renderList = (list) => {
        if (list.length === 0) {
            return '<p class="dim-panel-hint">対象の効果がありません</p>';
        }

        const groups = new Map();
        for (const item of list) {
            if (!groups.has(item.srcLabel)) groups.set(item.srcLabel, []);
            groups.get(item.srcLabel).push(item);
        }

        const cleanBuild = JSON.parse(JSON.stringify(build));
        cleanBuild.envBuffs = (cleanBuild.envBuffs || []).filter(b =>
            !(typeof b.label === 'string' && b.label.startsWith(SELF_LABEL_PREFIX))
        );
        let baseStats = null;
        try {
            baseStats = StatComputer.compute(cleanBuild);
        } catch (err) {
            console.error('[renderSelfBuffs] baseStats compute failed', err);
        }

        return Array.from(groups.entries()).map(([srcLabel, items]) => `
            <div class="dim-party-source-group">
                <h5 class="dim-party-source-label">${escapeHtml(srcLabel)}</h5>
                ${items.map(({ srcKey, ef }) => {
                    const ekey = effectKey(srcKey, ef.id);
                    const checked = build.activeSelfEffectIds.includes(ekey);
                    const eidolonBadge = ef.minEidolon
                        ? `<span class="dim-party-effect-eidolon" title="星魂 E${ef.minEidolon} 以上で解放">E${ef.minEidolon}+</span>`
                        : '';
                    const stacks = ef.stackable
                        ? (build.selfStacksByEffectId[ekey] ?? ef.stackable.default ?? ef.stackable.max ?? 1)
                        : 1;
                    const min = ef.stackable?.min ?? (ef.stackable?.default === 0 ? 0 : 1);
                    const stackInputHtml = ef.stackable
                        ? `<span class="dim-party-effect-stack-wrap" title="累積層数 (${min}〜${ef.stackable.max})">
                              × <input type="number" class="dim-party-effect-stacks dim-self-effect-stacks"
                                       min="${min}" max="${ef.stackable.max}" value="${stacks}"
                                       data-effect-key="${ekey}">
                              <span class="dim-party-effect-stack-unit">層</span>
                           </span>`
                        : '';
                    
                    const resolvedStats = baseStats ? resolveEffectStats(ef, build, baseStats) : null;
                    const finalStats = applyStackMult(resolvedStats, stacks, ef);

                    return `
                        <div class="dim-party-effect-row" title="${escapeHtml(ef.description || '')}">
                            <label class="dim-party-effect-main">
                                <input type="checkbox" class="dim-self-effect"
                                       data-effect-key="${ekey}"
                                       ${checked ? 'checked' : ''}>
                                <span class="dim-party-effect-name">${eidolonBadge}${escapeHtml(ef.name)}</span>
                            </label>
                            ${stackInputHtml}
                            <span class="dim-self-effect-stats" data-effect-key="${ekey}">${formatEffectStats(finalStats, ef.stackable ? { perLayer: resolvedStats, stacks, ef } : null)}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        `).join('');
    };

    wrap.innerHTML = `
        <div class="dim-self-buffs-grid">
            <div class="dim-self-buffs-col">
                <h4 class="dim-self-buffs-col-title">自身へのパーティ効果 (partyEffect)</h4>
                ${renderList(partyEffectsList)}
            </div>
            <div class="dim-self-buffs-col">
                <h4 class="dim-self-buffs-col-title">自己バフ・デバフ (自身のみ)</h4>
                ${renderList(selfEffectsList)}
            </div>
        </div>
    `;

    wrap.querySelectorAll('.dim-self-effect').forEach(cb => {
        cb.addEventListener('change', () => {
            const key = cb.dataset.effectKey;
            const activeSet = new Set(build.activeSelfEffectIds || []);
            if (cb.checked) activeSet.add(key);
            else activeSet.delete(key);
            build.activeSelfEffectIds = Array.from(activeSet);
            applySelfBuffsToEnvBuffs();
            recompute();
            renderSelfBuffs();
        });
    });

    wrap.querySelectorAll('.dim-self-effect-stacks').forEach(inp => {
        inp.addEventListener('input', () => {
            const ekey = inp.dataset.effectKey;
            const max = parseInt(inp.max, 10) || 99;
            let min = parseInt(inp.min, 10);
            if (isNaN(min)) min = 1;
            let v = parseInt(inp.value, 10);
            if (isNaN(v)) v = min;
            v = Math.max(min, Math.min(max, v));
            if (v !== parseInt(inp.value, 10)) inp.value = v;
            build.selfStacksByEffectId[ekey] = v;
            
            updateSelfEffectStatsDisplay(ekey);
            applySelfBuffsToEnvBuffs();
            recompute();
        });
    });
}

function updateSelfEffectStatsDisplay(ekey) {
    const build = state.build;
    if (!build) return;

    const cleanBuild = JSON.parse(JSON.stringify(build));
    cleanBuild.envBuffs = (cleanBuild.envBuffs || []).filter(b =>
        !(typeof b.label === 'string' && b.label.startsWith(SELF_LABEL_PREFIX))
    );
    let baseStats = null;
    try {
        baseStats = StatComputer.compute(cleanBuild);
    } catch (err) {
        console.error('[updateSelfEffectStatsDisplay] baseStats compute failed', err);
        return;
    }

    const effects = gatherFocusEffects(build);
    const match = effects.find(({ srcKey, ef }) => effectKey(srcKey, ef.id) === ekey);
    if (!match) return;
    const { ef } = match;
    const perLayer = resolveEffectStats(ef, build, baseStats);
    if (!perLayer) return;
    const stacks = build.selfStacksByEffectId[ekey] ?? ef.stackable?.default ?? 1;
    const final = applyStackMult(perLayer, stacks, ef);

    const statsEl = document.querySelector(`.dim-self-effect-stats[data-effect-key="${ekey}"]`);
    if (statsEl) {
        statsEl.innerHTML = formatEffectStats(final, ef.stackable ? { perLayer, stacks, ef } : null);
    }
}

*/

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
                state.party[idx].build = null;
                state.party[idx].lightcone = signatureLightconeForCharacter(state.party[idx].characterId);
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
            state.party[idx].build = null;
            state.party[idx].lightcone = signatureLightconeForCharacter(state.party[idx].characterId);
            applyDefaultActiveEffects(idx);
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
                if (b) {
                    state.party[idx].characterId = b.characterId;
                    state.party[idx].build = JSON.parse(JSON.stringify(b));
                }
            } else {
                state.party[idx].build = null;
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

    // stackable 効果の層数入力
    grid.querySelectorAll('.dim-party-effect-stacks').forEach(inp => {
        inp.addEventListener('input', () => {
            const idx = parseInt(inp.dataset.idx, 10);
            const ekey = inp.dataset.effectKey;
            const max = parseInt(inp.max, 10) || 99;
            let min = parseInt(inp.min, 10);
            if (isNaN(min)) min = 1;
            let v = parseInt(inp.value, 10);
            if (isNaN(v)) v = min;
            v = Math.max(min, Math.min(max, v));
            if (v !== parseInt(inp.value, 10)) inp.value = v;
            if (!state.party[idx].stacksByEffectId) state.party[idx].stacksByEffectId = {};
            state.party[idx].stacksByEffectId[ekey] = v;
            // 入力フォーカス維持のため部分更新: stats span だけ書き換える
            updatePartyEffectStatsDisplay(idx, ekey);
            applyPartyToEnvBuffs();
            recompute();
        });
    });

    grid.querySelectorAll('.dim-party-char').forEach(sel => {
        enhanceSelect(sel, characterPickerConfig({
            placeholder: 'サポート名 / 英名で検索',
        }));
    });
    grid.querySelectorAll('.dim-party-buildsel').forEach(sel => {
        enhanceSelect(sel, buildPickerConfig({
            placeholder: '保存ビルド名 / キャラ名で検索',
            recentKey: 'srsim.recent.partyBuilds',
        }));
    });
}

// 1 効果行の stats span だけを再計算して書き換える (フォーカスを保つ部分更新)
function updatePartyEffectStatsDisplay(idx, ekey) {
    const slot = state.party[idx];
    const tBuild = partyBuildFor(slot);
    if (!tBuild) return;
    const tStats = StatComputer.compute(tBuild);
    const effects = gatherTeammateEffects(tBuild);
    const match = effects.find(({ srcKey, ef }) => effectKey(srcKey, ef.id) === ekey);
    if (!match) return;
    const { ef } = match;
    const perLayer = resolveEffectStats(ef, tBuild, tStats);
    if (!perLayer) return;
    const stacks = slot.stacksByEffectId?.[ekey] ?? ef.stackable?.default ?? 1;
    const final = applyStackMult(perLayer, stacks, ef);
    const row = document.querySelector(
        `.dim-party-effect-row .dim-party-effect[data-idx="${idx}"][data-effect-key="${ekey}"]`
    )?.closest('.dim-party-effect-row');
    if (!row) return;
    const statsEl = row.querySelector('.dim-party-effect-stats');
    if (statsEl) {
        statsEl.innerHTML = formatEffectStats(final, ef.stackable ? { perLayer, stacks, ef } : null);
    }
}

// キャラ/ビルド変更時に default-active な効果を自動チェック + stackable の初期層数設定
function applyDefaultActiveEffects(idx) {
    const slot = state.party[idx];
    slot.activeEffectIds = new Set();
    slot.stacksByEffectId = {};
    const tBuild = partyBuildFor(slot);
    if (!tBuild) return;
    const effects = gatherTeammateEffects(tBuild);
    for (const { srcKey, ef } of effects) {
        const ekey = effectKey(srcKey, ef.id);
        if (ef.defaultActive) slot.activeEffectIds.add(ekey);
        if (ef.stackable) {
            slot.stacksByEffectId[ekey] = ef.stackable.default ?? ef.stackable.max ?? 1;
        }
    }
}

function renderPartySlot(slot, idx) {
    // 注: メイン火力キャラと同じキャラもサポート枠に入れられる(セルフバフ計算用)。
    //     ただし常時発動バフ(昇格6 等)はメイン側の軌跡に既に含まれており
    //     サポート側でも ON にすると二重計上になるため、ユーザー側で off にすること。
    const charOptions = [`<option value="">(なし)</option>`].concat(
        Registry.character.list()
            .filter(c => c.id !== 'template' && !c.isTestAllEquipment)
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
    const simpleLightcone = !isBuildMode && slot.lightcone?.id ? Registry.lightcone.get(slot.lightcone.id) : null;
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
                    const eidolonBadge = ef.minEidolon
                        ? `<span class="dim-party-effect-eidolon" title="星魂 E${ef.minEidolon} 以上で解放">E${ef.minEidolon}+</span>`
                        : '';
                    // stackable: 層数を slot.stacksByEffectId から取得 (未設定なら default)
                    const stacks = ef.stackable
                        ? (slot.stacksByEffectId?.[ekey] ?? ef.stackable.default ?? ef.stackable.max ?? 1)
                        : 1;
                    const min = ef.stackable?.min ?? (ef.stackable?.default === 0 ? 0 : 1);
                    const stackInputHtml = ef.stackable
                        ? `<span class="dim-party-effect-stack-wrap" title="累積層数 (${min}〜${ef.stackable.max})">
                              × <input type="number" class="dim-party-effect-stacks"
                                       min="${min}" max="${ef.stackable.max}" value="${stacks}"
                                       data-idx="${idx}" data-effect-key="${ekey}">
                              <span class="dim-party-effect-stack-unit">層</span>
                           </span>`
                        : '';
                    // 表示用 stats は 層数倍率込みの最終値、内訳表示のため perLayer も渡す
                    const finalStats = applyStackMult(resolvedStats, stacks, ef);
                    return `
                        <div class="dim-party-effect-row" title="${escapeHtml(ef.description || '')}">
                            <label class="dim-party-effect-main">
                                <input type="checkbox" class="dim-party-effect"
                                       data-idx="${idx}" data-effect-key="${ekey}"
                                       ${checked ? 'checked' : ''}>
                                <span class="dim-party-effect-name">${eidolonBadge}${escapeHtml(ef.name)}</span>
                            </label>
                            ${stackInputHtml}
                            <span class="dim-party-effect-stats">${formatEffectStats(finalStats, ef.stackable ? { perLayer: resolvedStats, stacks, ef } : null)}</span>
                        </div>
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
                    <label class="dim-radio" title="キャラと凸プリセットを指定。登録済みなら本人のモチーフ光円錐S1も自動装備します。">
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
                        ${simpleLightcone ? `<span class="dim-ai-muted">モチーフ: ${escapeHtml(simpleLightcone.name)} S${slot.lightcone.superimpose || 1}</span>` : ''}
                    </div>
                `}
            </div>
            <div class="dim-party-effects">${effectsHtml}</div>
        </div>
    `;
}

// stats: 表示する最終値 (stackable の場合は per-layer × stacks 済み)
// stackInfo: stackable の場合のみ { perLayer, stacks } を渡す → 「×N 内訳」を併記
function formatEffectStats(stats, stackInfo = null) {
    if (!stats) return '<span class="dim-party-effect-stats-empty">—</span>';
    const fmt = (k, val) => {
        const isFlat = k.endsWith('Flat') || k === 'spdBase' || k === 'atkBase';
        return isFlat ? `+${val.toFixed(1)}` : `+${(val * 100).toFixed(2)}%`;
    };
    const parts = Object.entries(stats).map(([k, v]) => {
        let formula = '';
        if (stats.__meta && stats.__meta[k]) {
            const m = stats.__meta[k];
            const ratioStr = (m.ratio * 100).toString().replace(/\.0+$/, '') + '%';
            const flatStr = m.flat ? ` + ${(m.flat * 100).toString().replace(/\.0+$/, '')}%` : '';
            formula = `${m.label}の${ratioStr}${flatStr} = `;
        }

        if (stackInfo && stackInfo.stacks > 1 && stackInfo.perLayer && stackInfo.perLayer[k] != null) {
            if (stackInfo.ef && stackInfo.ef.stackable?.type === 'step') {
                return `${formatStatLabel(k)} ${formula}${fmt(k, v)}`;
            }
            const per = stackInfo.perLayer[k];
            return `${formatStatLabel(k)} ${formula}${fmt(k, per)} ×${stackInfo.stacks} = ${fmt(k, v)}`;
        }
        return `${formatStatLabel(k)} ${formula}${fmt(k, v)}`;
    });
    return parts.join(' / ');
}

// 全 stats 値に層数倍率を掛けて新しい dict を返す
function applyStackMult(stats, stacks, ef = null) {
    if (ef && ef.stackable && ef.stackable.type === 'step' && ef.stackable.stepValues) {
        return ef.stackable.stepValues[stacks] || stats;
    }
    if (!stats || stacks === 1) return stats;
    const out = {};
    for (const [k, v] of Object.entries(stats)) {
        out[k] = v * stacks;
    }
    if (stats.__meta) {
        Object.defineProperty(out, '__meta', { value: stats.__meta, enumerable: false });
    }
    return out;
}

// パーティ効果を state.build.envBuffs に反映 (既存「パーティ.*」を一掃して書き直し)
//   stackable 効果は slot.stacksByEffectId[ekey] 倍 (未設定なら ef.stackable.default) で計上
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
            const stackMult = ef.stackable
                ? (slot.stacksByEffectId?.[ekey] ?? ef.stackable.default ?? ef.stackable.max ?? 1)
                : 1;
            const finalStats = applyStackMult(stats, stackMult, ef);
            for (const [stat, value] of Object.entries(finalStats)) {
                state.build.envBuffs.push({
                    stat,
                    value: value,
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
        selectedBuildId = null;
        const nameInput = document.getElementById('dim-build-name');
        if (nameInput) nameInput.value = '';
        enhanceSelect(sel, buildPickerConfig());
        return;
    }
    sel.innerHTML = builds
        .sort((a, b) => (b.meta?.updatedAt || '').localeCompare(a.meta?.updatedAt || ''))
        .map(b => {
            const ch = Registry.character.get(b.characterId);
            const charName = ch?.name || b.characterId || '?';
            return `<option value="${b.id}">${escapeHtml(b.name || '(無名)')} — ${charName}</option>`;
        }).join('');
    const currentId = selectedBuildId && builds.some(build => build.id === selectedBuildId)
        ? selectedBuildId
        : (BuildStore.get(state.build?.id)?.id || '');
    sel.value = currentId;
    selectedBuildId = currentId || null;
    const selected = currentId ? BuildStore.get(currentId) : null;
    const nameInput = document.getElementById('dim-build-name');
    if (nameInput) nameInput.value = selected?.name || '';
    enhanceSelect(sel, buildPickerConfig());
}

function loadSelectedBuild() {
    const id = document.getElementById('dim-build-list')?.value;
    if (!id) return;
    const saved = BuildStore.get(id);
    if (!saved) return;
    state.build = sanitizeSelectedBuild(saved);
    clearActiveCandidates();
    state.snapshot = null;
    selectedBuildId = saved.id;
    invalidateCandidateRankingCache();
    const nameInput = document.getElementById('dim-build-name');
    if (nameInput) nameInput.value = saved.name || '';
    refreshAllForms();
    updateSnapshotStatus();
    recompute();
}

function sanitizeSelectedBuild(build) {
    const sanitized = JSON.parse(JSON.stringify(build));
    // 自身バフ・デバフはこのタブでは設定しない。旧バージョンで保存された
    // 選択状態や展開済み値があっても、保存ビルドの装備・育成情報だけを使う。
    sanitized.activeSelfEffectIds = [];
    sanitized.selfStacksByEffectId = {};
    sanitized.envBuffs = (sanitized.envBuffs || []).filter(buff =>
        !(typeof buff.label === 'string' && buff.label.startsWith('自身バフ.'))
    );
    return sanitized;
}

function invalidateCandidateRankingCache() {
    candidateRankCacheKey = '';
    candidateRankCache = null;
}

function candidateRankingKey() {
    const serialized = diminishingSession.serialize();
    return JSON.stringify({
        inputMode: serialized.inputMode,
        build: serialized.build,
        party: serialized.party,
        subs: serialized.subs,
        options: serialized.options,
    });
}

function getCandidateRanking() {
    if (!selectedBuildId || !state.build) return null;
    const key = candidateRankingKey();
    if (candidateRankCache && candidateRankCacheKey === key) return candidateRankCache;
    candidateRankCache = rankBuildCandidates(state);
    candidateRankCacheKey = key;
    return candidateRankCache;
}

function diminishingCandidateGroupLabel(key) {
    if (key === 'eidolon') return '星魂';
    if (key === 'traceLevel') return '軌跡レベル';
    if (key === 'lightcone') return '光円錐';
    if (key === 'superimpose') return '重畳';
    if (key === 'substats') return 'サブステ';
    if (key.startsWith('relic:')) {
        return key.slice('relic:'.length).split(',')
            .map(slot => DIM_CANDIDATE_SLOT_LABELS[slot] || slot)
            .join(' / ');
    }
    return key.replace(/^type:/, 'その他');
}

function candidateContributionText(value) {
    if (value === null || value === undefined) return '—';
    return `${value > 0 ? '+' : ''}${(value * 100).toFixed(2)}%`;
}

function candidateContributionClass(value) {
    if (value > 0) return 'is-up';
    if (value < 0) return 'is-down';
    return 'cb-muted';
}

function renderCandidates() {
    const wrap = document.getElementById('dim-candidates');
    if (!wrap) return;
    if (!selectedBuildId) {
        wrap.innerHTML = '<p class="dim-panel-hint">保存済みのキャラビルドを選択してください。</p>';
        return;
    }
    const candidates = getBuildCandidates(state.build);
    if (candidates.length === 0) {
        wrap.innerHTML = '<p class="dim-panel-hint">候補はありません。キャラビルドタブで候補を登録して保存してください。</p>';
        return;
    }
    const ranking = getCandidateRanking();
    const resultItems = ranking?.candidates || candidates.map(candidate => ({
        ...candidate,
        contribution: null,
    }));
    const groups = new Map();
    for (const candidate of resultItems) {
        const key = candidateGroupKey(candidate);
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(candidate);
    }
    const activeIds = activeCandidateIds();
    const activeSet = new Set(activeIds);
    const groupOrder = ['eidolon', 'traceLevel', 'lightcone', 'superimpose', 'substats',
        ...Object.keys(DIM_CANDIDATE_SLOT_LABELS).map(slot => `relic:${slot}`), 'type:custom'];
    const orderedGroups = [...groups.entries()].sort(([a], [b]) => {
        const ai = groupOrder.indexOf(a);
        const bi = groupOrder.indexOf(b);
        return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi) || a.localeCompare(b);
    });
    wrap.innerHTML = `
        <div class="dim-candidate-actions">
            <button type="button" id="dim-candidate-reset" class="btn-secondary btn-mini" ${activeIds.length ? '' : 'disabled'}>すべて解除</button>
            <span class="dim-panel-hint">項目ごとに1件を選択できます。別の項目は組み合わせて適用されます。</span>
        </div>
        <div class="dim-candidate-groups">
            ${orderedGroups.map(([key, group]) => {
                const activeInGroup = group.filter(candidate => activeSet.has(candidate.id));
                return `
                    <section class="dim-candidate-group" data-dim-candidate-group="${escapeHtml(key)}">
                        <div class="dim-candidate-group-head">
                            <span class="dim-candidate-group-title">${escapeHtml(diminishingCandidateGroupLabel(key))}</span>
                            <span class="dim-candidate-group-count">${group.length}件</span>
                            ${activeInGroup.length ? `<span class="dim-candidate-group-active">${escapeHtml(candidateLabel(activeInGroup[0]))} 適用中</span>` : ''}
                        </div>
                        <div class="dim-candidate-group-body">
                            <div class="dim-candidate-group-actions">
                                <button type="button" class="btn-secondary btn-mini" data-dim-candidate-clear-group="${escapeHtml(key)}" ${activeInGroup.length ? '' : 'disabled'}>この項目を解除</button>
                            </div>
                            <div class="dim-candidate-options" role="radiogroup" aria-label="${escapeHtml(diminishingCandidateGroupLabel(key))}">
                                ${group.map(candidate => {
                                    const current = activeSet.has(candidate.id);
                                    const hideDelta = candidate.excludedReason === 'eidolon' || isEidolonCandidate(candidate);
                                    return `
                                        <label class="dim-candidate-option${current ? ' is-current' : ''}">
                                            <input type="radio" name="dim-candidate-${escapeHtml(key)}" value="${escapeHtml(candidate.id)}" data-dim-candidate-radio="${escapeHtml(candidate.id)}" ${current ? 'checked' : ''}>
                                            <span class="dim-candidate-option-copy">
                                                <span class="dim-candidate-option-label">${escapeHtml(candidateLabel(candidate))}</span>
                                                <span class="dim-candidate-option-meta">${hideDelta ? '能力変更のため共通火力差分なし' : '現在の条件での共通火力差分'}</span>
                                            </span>
                                            <span class="dim-candidate-option-delta ${hideDelta ? 'cb-muted' : candidateContributionClass(candidate.contribution)}" title="共通ダメージだけを使った目安です。通常攻撃・スキル・必殺技・追撃ごとの違いは含みません。">${hideDelta ? '—' : candidateContributionText(candidate.contribution)}</span>
                                        </label>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    </section>
                `;
            }).join('')}
        </div>
    `;
    document.getElementById('dim-candidate-reset')?.addEventListener('click', () => {
        clearActiveCandidates();
        renderCandidates();
        renderCharDetail();
        recompute();
    });
    wrap.querySelectorAll('[data-dim-candidate-clear-group]').forEach(button => {
        button.addEventListener('click', () => {
            const groupKey = button.getAttribute('data-dim-candidate-clear-group');
            setActiveCandidateIds(activeCandidateIds().filter(id => {
                const candidate = getBuildCandidates(state.build).find(item => item.id === id);
                return !candidate || candidateGroupKey(candidate) !== groupKey;
            }));
            renderCandidates();
            renderCharDetail();
            recompute();
        });
    });
    wrap.querySelectorAll('[data-dim-candidate-radio]').forEach(input => {
        input.addEventListener('change', () => {
            const id = input.getAttribute('data-dim-candidate-radio');
            const allCandidates = getBuildCandidates(state.build);
            const selected = allCandidates.find(candidate => candidate.id === id);
            if (!selected) return;
            const groupKey = candidateGroupKey(selected);
            const nextIds = activeCandidateIds().filter(activeId => {
                const active = allCandidates.find(candidate => candidate.id === activeId);
                return active && candidateGroupKey(active) !== groupKey;
            });
            nextIds.push(id);
            setActiveCandidateIds(nextIds);
            renderCandidates();
            renderCharDetail();
            recompute();
        });
    });
}

function updateSnapshotStatus() {
    const el = document.getElementById('dim-snapshot-status');
    const snap = state.inputMode === 'direct' ? state.direct.snapshot : state.snapshot;
    if (!snap) {
        el.textContent = 'スナップショット: なし';
        el.style.color = 'var(--text-muted)';
    } else {
        const label = state.inputMode === 'direct' ? '直接入力' : snap.characterId;
        el.textContent = `スナップショット: 保存済み (${label} / 比較中)`;
        el.style.color = 'var(--accent-gold)';
    }
}

// ---- 計算 + 結果描画 ---------------------------------------------------

// 過去の表示切替処理の名残があっても、現在のパネルを隠さない。
function applyInputModeVisibility() {
    for (const sel of [
        '.dim-build-mgr', '#dim-candidates-panel', '.dim-party-panel', '#dim-char-detail',
    ]) {
        const el = document.querySelector(sel);
        if (el) el.style.display = '';
    }
}

// 直接ステ入力モードの計算 + 結果描画 (recompute から委譲)。
function recomputeDirect(resultEl) {
    let currentResult;
    try { currentResult = computeDiminishingState(state); }
    catch (err) { resultEl.innerHTML = `<div class="dim-error">計算エラー: ${err.message}</div>`; return; }
    const nowStats = currentResult.finalStats;

    if (!state.direct.snapshot) {
        resultEl.innerHTML = renderStatsOnly(nowStats, currentResult.attacks);
        bindStatsFilter();
        return;
    }
    let cmp;
    try {
        const beforeStats = Diminishing.directStatsToFinalStats(state.direct.snapshot);
        cmp = Diminishing.compareStats(beforeStats, nowStats, state.options);
    } catch (err) { resultEl.innerHTML = `<div class="dim-error">比較エラー: ${err.message}</div>`; return; }
    resultEl.innerHTML = renderComparison(cmp, currentResult.attacks);
    bindComparisonFilter();
}

function recompute() {
    assistantUi?.updateContext();
    const resultEl = document.getElementById('dim-result');
    if (!resultEl) return;

    if (state.inputMode === 'direct') {
        recomputeDirect(resultEl);
        window.SRSIM_LOCAL?.markDirty('diminishing');
        return;
    }

    renderCandidates();
    if (!selectedBuildId) {
        resultEl.innerHTML = '<div class="dim-empty">保存済みのキャラビルドを選択すると、最終ステータスと差分候補を表示します。</div>';
        window.SRSIM_LOCAL?.markDirty('diminishing');
        return;
    }

    let currentResult;
    try { currentResult = computeDiminishingState(state); }
    catch (err) { resultEl.innerHTML = `<div class="dim-error">計算エラー: ${err.message}</div>`; return; }
    const nowStats = currentResult.finalStats;

    if (!state.snapshot) {
        resultEl.innerHTML = renderStatsOnly(nowStats, currentResult.attacks);
        bindStatsFilter();
        window.SRSIM_LOCAL?.markDirty('diminishing');
        return;
    }
    let cmp;
    try {
        const beforeStats = StatComputer.compute(state.snapshot);
        cmp = Diminishing.compareStats(beforeStats, nowStats, state.options);
    }
    catch (err) { resultEl.innerHTML = `<div class="dim-error">比較エラー: ${err.message}</div>`; return; }
    resultEl.innerHTML = renderComparison(cmp, currentResult.attacks);
    bindComparisonFilter();
    window.SRSIM_LOCAL?.markDirty('diminishing');
}

// ===== 参照ステ・表示項目プリセット =====

function loadCustomRefPresets() {
    try {
        const arr = JSON.parse(localStorage.getItem(REF_PRESET_STORAGE_KEY) || '[]');
        return Array.isArray(arr) ? arr : [];
    } catch { return []; }
}
function saveCustomRefPresets(arr) {
    try { localStorage.setItem(REF_PRESET_STORAGE_KEY, JSON.stringify(arr)); }
    catch (err) { console.warn('[refPresets] 保存に失敗', err); }
}
function getAllRefPresets() {
    return [...REF_PRESETS_BUILTIN, ...loadCustomRefPresets()];
}

// プリセットを現在の状態へ適用 (参照ステ + 両表示フィルタを一括反映)。
function applyRefPreset(preset) {
    if (!preset) return;
    if (preset.refStat) {
        state.options.refStat = preset.refStat;
        const sel = document.getElementById('dim-opt-ref');
        if (sel) sel.value = preset.refStat;
    }
    if (Array.isArray(preset.visibleStats)) state.visibleStats = new Set(preset.visibleStats);
    if (Array.isArray(preset.visibleRows))  state.visibleRows  = new Set(preset.visibleRows);
    recompute();
}

// 現在の設定を名前付きカスタムプリセットとして保存。
function saveCurrentAsRefPreset() {
    const name = (prompt('プリセット名を入力してください') || '').trim();
    if (!name) return;
    const custom = loadCustomRefPresets();
    custom.push({
        id: 'c' + Date.now().toString(36),
        name,
        refStat: state.options.refStat,
        visibleStats: [...state.visibleStats],
        visibleRows: [...state.visibleRows],
    });
    saveCustomRefPresets(custom);
    renderRefPresets();
}

function deleteCustomRefPreset(id) {
    saveCustomRefPresets(loadCustomRefPresets().filter(p => p.id !== id));
    renderRefPresets();
}

// プリセットバーを #dim-presets に描画 (built-in 3 種 + カスタム + 保存ボタン)。
function renderRefPresets() {
    const wrap = document.getElementById('dim-presets');
    if (!wrap) return;
    const custom = loadCustomRefPresets();
    const chip = (p, isCustom) => `
        <span class="dim-preset-chip${isCustom ? ' is-custom' : ''}">
            <button type="button" class="dim-preset-apply" data-preset-id="${p.id}">${escapeHtml(p.name)}</button>
            ${isCustom ? `<button type="button" class="dim-preset-del" data-preset-id="${p.id}" title="削除">×</button>` : ''}
        </span>`;
    wrap.innerHTML = `
        <span class="dim-presets-label">表示プリセット</span>
        ${REF_PRESETS_BUILTIN.map(p => chip(p, false)).join('')}
        ${custom.length ? '<span class="dim-presets-sep"></span>' : ''}
        ${custom.map(p => chip(p, true)).join('')}
        <button type="button" id="dim-preset-save" class="dim-preset-save" title="現在の参照ステ・表示項目を保存">＋現在の設定を保存</button>
    `;
}

// プリセットバーのクリックを委譲で処理 (内部は再描画されるため bind は1回だけ)。
function bindRefPresets() {
    const wrap = document.getElementById('dim-presets');
    if (!wrap) return;
    wrap.addEventListener('click', e => {
        const applyBtn = e.target.closest('.dim-preset-apply');
        if (applyBtn) {
            applyRefPreset(getAllRefPresets().find(p => p.id === applyBtn.dataset.presetId));
            return;
        }
        const delBtn = e.target.closest('.dim-preset-del');
        if (delBtn) {
            if (confirm('このプリセットを削除しますか?')) deleteCustomRefPreset(delBtn.dataset.presetId);
            return;
        }
        if (e.target.closest('#dim-preset-save')) saveCurrentAsRefPreset();
    });
}

// 比較表上部のフィルタチェックボックスの change イベントを bind (renderComparison 毎に再 bind)
function bindComparisonFilter() {
    const details = document.querySelector('.dim-result-filter');
    if (details) {
        details.addEventListener('toggle', () => {
            state.filterPanelOpen = details.open;
        });
    }
    // 係数行 (visibleRows)
    document.querySelectorAll('.dim-result-filter input[type="checkbox"][data-row-key]').forEach(cb => {
        cb.addEventListener('change', () => {
            const key = cb.dataset.rowKey;
            if (cb.checked) state.visibleRows.add(key);
            else            state.visibleRows.delete(key);
            recompute();
        });
    });
    // ステータス行 (visibleStats) — 比較表でも操作可
    document.querySelectorAll('.dim-result-filter input[type="checkbox"][data-stat-key]').forEach(cb => {
        cb.addEventListener('change', () => {
            const key = cb.dataset.statKey;
            if (cb.checked) state.visibleStats.add(key);
            else            state.visibleStats.delete(key);
            recompute();
        });
    });
    // Quick Actions
    document.querySelectorAll('.dim-result-filter .btn-filter-action').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            const type = btn.dataset.type;
            if (type === 'row') {
                const factorRows = [...COMPARISON_ROWS, ...TOTAL_ROWS];
                if (action === 'all') {
                    factorRows.forEach(r => state.visibleRows.add(r.key));
                } else if (action === 'none') {
                    state.visibleRows.clear();
                } else if (action === 'default') {
                    state.visibleRows = new Set(DEFAULT_VISIBLE_ROWS);
                }
            } else if (type === 'stat') {
                if (action === 'all') {
                    STATS_ROWS.forEach(r => state.visibleStats.add(r.key));
                } else if (action === 'none') {
                    state.visibleStats.clear();
                } else if (action === 'default') {
                    state.visibleStats = new Set(DEFAULT_VISIBLE_STATS);
                }
            }
            recompute();
        });
    });
    // Subgroup Actions
    document.querySelectorAll('.dim-result-filter .btn-subgroup-action').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            const category = btn.dataset.category;
            const type = btn.dataset.type;
            if (type === 'row') {
                const factorRows = [...COMPARISON_ROWS, ...TOTAL_ROWS];
                const targetRows = factorRows.filter(r => r.category === category);
                if (action === 'all') {
                    targetRows.forEach(r => state.visibleRows.add(r.key));
                } else if (action === 'none') {
                    targetRows.forEach(r => state.visibleRows.delete(r.key));
                }
            } else if (type === 'stat') {
                const targetRows = STATS_ROWS.filter(r => r.category === category);
                if (action === 'all') {
                    targetRows.forEach(r => state.visibleStats.add(r.key));
                } else if (action === 'none') {
                    targetRows.forEach(r => state.visibleStats.delete(r.key));
                }
            }
            recompute();
        });
    });
}

// ステータス行の定義 (key, label, fmt, num)
//   key:   visibleStats フィルタの ID
//   label: 表示名
//   fmt:   'flat1' | 'pct' | 'mul' | 'spd' | 'breakEffect'  (値整形 + 差分表示の形式)
//   num:   (FinalStats) => number  数値抽出 (single 表示と diff 計算で共通使用)
//   av?:   (FinalStats) => number  速度行のみ補足表示用 (AV)
//
// pre-snapshot (renderStatsOnly) と post-snapshot (renderComparison の最終ステ表)
// の両方で使用される。同じ filter (state.visibleStats) で表示制御。
const STATS_ROWS = [
    { key: 'atk',           label: '攻撃力',           fmt: 'flat1', num: (s) => s.derived.atk, category: 'basic' },
    { key: 'hp',            label: 'HP',               fmt: 'flat1', num: (s) => s.derived.hp, category: 'basic' },
    { key: 'def',           label: '防御力',           fmt: 'flat1', num: (s) => s.derived.def, category: 'basic' },
    { key: 'spd',           label: '速度',             fmt: 'spd',   num: (s) => s.derived.spd, av: (s) => s.derived.speedAV, category: 'basic' },
    { key: 'critRate',      label: '会心率',           fmt: 'pct',   num: (s) => s.derived.critRate, category: 'crit' },
    { key: 'critDmg',       label: '会心ダメ',         fmt: 'pct',   num: (s) => s.derived.critDmg, category: 'crit' },
    { key: 'critExpected',  label: '会心期待値',       fmt: 'mul',   num: (s) => s.derived.critExpected, category: 'crit' },
    { key: 'critRateBasic',    label: '通常攻撃会心率',     fmt: 'pct', num: (s) => s.raw.critRateBasic    || 0, category: 'crit' },
    { key: 'critRateSkill',    label: '戦闘スキル会心率',   fmt: 'pct', num: (s) => s.raw.critRateSkill    || 0, category: 'crit' },
    { key: 'critRateUlt',      label: '必殺会心率',         fmt: 'pct', num: (s) => s.raw.critRateUlt      || 0, category: 'crit' },
    { key: 'critRateFollowup', label: '追加攻撃会心率',     fmt: 'pct', num: (s) => s.raw.critRateFollowup || 0, category: 'crit' },
    { key: 'critDmgBasic',     label: '通常攻撃会心ダメ',   fmt: 'pct', num: (s) => s.raw.critDmgBasic     || 0, category: 'crit' },
    { key: 'critDmgSkill',     label: '戦闘スキル会心ダメ', fmt: 'pct', num: (s) => s.raw.critDmgSkill     || 0, category: 'crit' },
    { key: 'critDmgUlt',       label: '必殺会心ダメ',       fmt: 'pct', num: (s) => s.raw.critDmgUlt       || 0, category: 'crit' },
    { key: 'critDmgFollowup',  label: '追加攻撃会心ダメ',   fmt: 'pct', num: (s) => s.raw.critDmgFollowup  || 0, category: 'crit' },
    { key: 'energyRegen',   label: 'EP回復効率',       fmt: 'pct',   num: (s) => s.derived.energyRegenPct, category: 'basic' },

    // ===== 与ダメ枠 (個別) =====
    { key: 'dmgOwnElement', label: '自属性ダメ枠 (共通+元素)', fmt: 'pct', num: (s) => s.derived.dmgOwnElement, category: 'dmg_individual' },
    { key: 'dmgBasic',      label: '通常攻撃ダメ枠',   fmt: 'pct',   num: (s) => s.raw.dmgBasic    || 0, category: 'dmg_individual' },
    { key: 'dmgSkill',      label: '戦闘スキルダメ枠', fmt: 'pct',   num: (s) => s.raw.dmgSkill    || 0, category: 'dmg_individual' },
    { key: 'dmgUlt',        label: '必殺ダメ枠',       fmt: 'pct',   num: (s) => s.raw.dmgUlt      || 0, category: 'dmg_individual' },
    { key: 'dmgFollowup',   label: '追加攻撃ダメ枠',   fmt: 'pct',   num: (s) => s.raw.dmgFollowup || 0, category: 'dmg_individual' },
    { key: 'fixedDmg',      label: '確定ダメージ',     fmt: 'pct',   num: (s) => s.raw.fixedDmg    || 0, category: 'dmg_individual' },
    { key: 'sepMult',       label: '別枠乗算',         fmt: 'pct',   num: (s) => s.raw.sepMult     || 0, category: 'dmg_individual' },

    // ===== 与ダメ合計 (共通+元素+種別) — 加算済み数値 =====
    { key: 'dmgTotalBasic',    label: '通常与ダメ合計 (通常 = 共通+属性+通常)',
      fmt: 'pct', num: (s) => s.derived.dmgOwnElement + (s.raw.dmgBasic    || 0), category: 'dmg_total' },
    { key: 'dmgTotalSkill',    label: 'スキル与ダメ合計 (戦闘スキル = 共通+属性+スキル)',
      fmt: 'pct', num: (s) => s.derived.dmgOwnElement + (s.raw.dmgSkill    || 0), category: 'dmg_total' },
    { key: 'dmgTotalUlt',      label: '必殺与ダメ合計 (必殺 = 共通+属性+必殺)',
      fmt: 'pct', num: (s) => s.derived.dmgOwnElement + (s.raw.dmgUlt      || 0), category: 'dmg_total' },
    { key: 'dmgTotalFollowup', label: '追加攻撃与ダメ合計 (追加攻撃 = 共通+属性+追加)',
      fmt: 'pct', num: (s) => s.derived.dmgOwnElement + (s.raw.dmgFollowup || 0), category: 'dmg_total' },

    // ===== デバフ枠 (個別) =====
    { key: 'defDown',       label: '防御Down (敵)',    fmt: 'pct',   num: (s) => s.raw.defDown   || 0, category: 'debuff' },
    { key: 'defIgnore',     label: '防御無視',         fmt: 'pct',   num: (s) => s.raw.defIgnore || 0, category: 'debuff' },
    { key: 'defIgnoreBasic',    label: '通常攻撃防御無視',     fmt: 'pct', num: (s) => s.raw.defIgnoreBasic    || 0, category: 'debuff' },
    { key: 'defIgnoreSkill',    label: '戦闘スキル防御無視',   fmt: 'pct', num: (s) => s.raw.defIgnoreSkill    || 0, category: 'debuff' },
    { key: 'defIgnoreUlt',      label: '必殺防御無視',         fmt: 'pct', num: (s) => s.raw.defIgnoreUlt      || 0, category: 'debuff' },
    { key: 'defIgnoreFollowup', label: '追加攻撃防御無視',     fmt: 'pct', num: (s) => s.raw.defIgnoreFollowup || 0, category: 'debuff' },

    // ===== デバフ合計 =====
    { key: 'defReductionTotal', label: '防御減少 合計 (Down+無視)',
      fmt: 'pct', num: (s) => (s.raw.defDown || 0) + (s.raw.defIgnore || 0), category: 'debuff' },
    { key: 'resPen',        label: '耐性貫通 / 耐性Down (合計)',
      fmt: 'pct',   num: (s) => s.raw.resPen   || 0, category: 'debuff' },
    { key: 'resPenBasic',    label: '通常攻撃耐性貫通',     fmt: 'pct', num: (s) => s.raw.resPenBasic    || 0, category: 'debuff' },
    { key: 'resPenSkill',    label: '戦闘スキル耐性貫通',   fmt: 'pct', num: (s) => s.raw.resPenSkill    || 0, category: 'debuff' },
    { key: 'resPenUlt',      label: '必殺耐性貫通',         fmt: 'pct', num: (s) => s.raw.resPenUlt      || 0, category: 'debuff' },
    { key: 'resPenFollowup', label: '追加攻撃耐性貫通',     fmt: 'pct', num: (s) => s.raw.resPenFollowup || 0, category: 'debuff' },
    { key: 'dmgTaken',      label: '被ダメ増 (合計)',  fmt: 'pct',   num: (s) => s.raw.dmgTaken || 0, category: 'debuff' },
    { key: 'dmgTakenBasic',    label: '通常攻撃被ダメ増',     fmt: 'pct', num: (s) => s.raw.dmgTakenBasic    || 0, category: 'debuff' },
    { key: 'dmgTakenSkill',    label: '戦闘スキル被ダメ増',   fmt: 'pct', num: (s) => s.raw.dmgTakenSkill    || 0, category: 'debuff' },
    { key: 'dmgTakenUlt',      label: '必殺被ダメ増',         fmt: 'pct', num: (s) => s.raw.dmgTakenUlt      || 0, category: 'debuff' },
    { key: 'dmgTakenFollowup', label: '追加攻撃被ダメ増',     fmt: 'pct', num: (s) => s.raw.dmgTakenFollowup || 0, category: 'debuff' },

    // ===== その他 =====
    { key: 'breakEffect',   label: '撃破特効',         fmt: 'breakEffect', num: (s) => s.derived.breakEffectPct, category: 'other' },
    { key: 'ehr',           label: '効果命中',         fmt: 'pct',   num: (s) => s.raw.ehr  || 0, category: 'other' },
    { key: 'eres',          label: '効果抵抗',         fmt: 'pct',   num: (s) => s.raw.eres || 0, category: 'other' },
];

// 単一値表示
function formatStatCell(row, s) {
    const n = row.num(s);
    switch (row.fmt) {
        case 'flat1':       return n.toFixed(1);
        case 'pct':         return `${(n * 100).toFixed(2)}%`;
        case 'mul':         return `×${n.toFixed(4)}`;
        case 'spd': {
            const actionValue = row.av ? row.av(s) : null;
            const actionValueLabel = Number.isFinite(actionValue) ? actionValue.toFixed(1) : '—';
            return `${n.toFixed(2)} (AV ${actionValueLabel})`;
        }
        case 'breakEffect': return `${((n - 1) * 100).toFixed(2)}%`;
        default:            return String(n);
    }
}

// 差分表示 (post-snapshot 用)
function formatStatDiff(diff, fmt) {
    const sign = diff >= 0 ? '+' : '';
    switch (fmt) {
        case 'flat1':       return `${sign}${diff.toFixed(1)}`;
        case 'pct':         return `${sign}${(diff * 100).toFixed(2)}%pt`;
        case 'mul':         return `${sign}${diff.toFixed(4)}`;
        case 'spd':         return `${sign}${diff.toFixed(2)}`;
        case 'breakEffect': return `${sign}${(diff * 100).toFixed(2)}%pt`;
        default:            return String(diff);
    }
}

function renderStatsOnly(s, attacks = []) {
    const grouped = {};
    for (const catKey of Object.keys(STATS_CATEGORIES)) {
        grouped[catKey] = [];
    }
    for (const r of STATS_ROWS) {
        if (state.visibleStats.has(r.key)) {
            grouped[r.category].push(r);
        }
    }

    const tbodyHtml = Object.entries(STATS_CATEGORIES).map(([catKey, catName]) => {
        const rows = grouped[catKey] || [];
        if (rows.length === 0) return '';
        const headerRow = `<tr class="dim-table-category-header"><td colspan="2">${catName}</td></tr>`;
        const rowsHtml = rows.map(r => `<tr><th>${statLabel(r.key, r.label)}</th><td>${formatStatCell(r, s)}</td></tr>`).join('');
        return headerRow + rowsHtml;
    }).join('');

    return `
        ${renderStatsFilter()}
        ${renderAttackTable(attacks)}
        <h3>現状の最終ステータス</h3>
        <table class="dim-result-table">
            <tbody>
                ${tbodyHtml}
            </tbody>
        </table>
        <p class="dim-help">「現状をスナップショット」を押してから装備等を変更すると、火力貢献率が表示されます。</p>
    `;
}
// 現状ステータスの行フィルタ (折りたたみチェックボックス群)
function renderAttackTable(attacks) {
    if (!Array.isArray(attacks) || attacks.length === 0) return '';
    const scalingLabels = { atk: '攻撃力', hp: 'HP', def: '防御力', reference: '特殊参照値' };
    const rows = attacks.map(row => {
        const damage = row.active ? formatFactorValue(row.damage) : '条件未適用';
        const total = row.active && row.totalDamage != null ? formatFactorValue(row.totalDamage) : '—';
        const reference = row.referenceKey
            ? `${row.referenceValue.toFixed(1)}（${escapeHtml(row.referenceKey)}）`
            : `${(row.multiplier * 100).toFixed(1)}%`;
        const condition = row.condition
            ? `${escapeHtml(row.condition)}${row.active ? '' : '（未適用）'}`
            : '—';
        return `<tr>
            <th>${escapeHtml(row.name)}</th>
            <td>${escapeHtml(row.kind)}</td>
            <td>${escapeHtml(row.target)}</td>
            <td>${escapeHtml(scalingLabels[row.scalingStat] || row.scalingStat)} / ${reference}</td>
            <td>${damage}</td>
            <td>${total}${row.hitCount ? `（${row.hitCount}回）` : ''}</td>
            <td>${condition}</td>
        </tr>`;
    }).join('');
    return `
        <h3>キャラ固有攻撃の目安</h3>
        <p class="dim-help">共通ダメージ係数に、各攻撃の倍率・参照ステータス・条件付き要素を反映した値です。実戦の敵数や行動順は含みません。</p>
        <table class="dim-result-table dim-attack-table">
            <thead><tr><th>攻撃</th><th>種別</th><th>対象</th><th>倍率 / 参照</th><th>1回</th><th>合計</th><th>条件</th></tr></thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}

function renderStatsFilter() {
    const grouped = {};
    for (const catKey of Object.keys(STATS_CATEGORIES)) {
        grouped[catKey] = [];
    }
    for (const r of STATS_ROWS) {
        grouped[r.category].push(r);
    }

    const sectionsHtml = Object.entries(STATS_CATEGORIES).map(([catKey, catName]) => {
        const rows = grouped[catKey] || [];
        if (rows.length === 0) return '';
        const checkboxes = rows.map(r => `
            <label class="dim-filter-item">
                <input type="checkbox" data-stat-key="${r.key}" ${state.visibleStats.has(r.key) ? 'checked' : ''}>
                <span>${statLabel(r.key, r.label)}</span>
            </label>
        `).join('');
        return `
            <div class="dim-filter-group">
                <h6 class="dim-filter-subgroup-title">
                    <span>${catName}</span>
                    <span class="dim-filter-subgroup-actions">
                        <button type="button" class="btn-subgroup-action" data-action="all" data-category="${catKey}" data-type="stat">全選択</button>
                        <button type="button" class="btn-subgroup-action" data-action="none" data-category="${catKey}" data-type="stat">全解除</button>
                    </span>
                </h6>
                <div class="dim-filter-grid">${checkboxes}</div>
            </div>
        `;
    }).join('');

    const visibleCount = STATS_ROWS.filter(r => state.visibleStats.has(r.key)).length;
    return `
        <details class="dim-result-filter" ${state.statsPanelOpen ? 'open' : ''}>
            <summary>表示項目 (${visibleCount} / ${STATS_ROWS.length})</summary>
            <div class="dim-filter-section">
                <div class="dim-filter-global-actions">
                    <span>ステータス行:</span>
                    <button type="button" class="btn-filter-action" data-action="all" data-type="stat">すべて選択</button>
                    <button type="button" class="btn-filter-action" data-action="none" data-type="stat">すべて解除</button>
                    <button type="button" class="btn-filter-action" data-action="default" data-type="stat">デフォルト</button>
                </div>
                ${sectionsHtml}
            </div>
        </details>
    `;
}

// ステータス filter の change/toggle を bind (renderStatsOnly 毎に再 bind)
function bindStatsFilter() {
    const details = document.querySelector('.dim-result-filter');
    if (details) {
        details.addEventListener('toggle', () => {
            state.statsPanelOpen = details.open;
        });
    }
    document.querySelectorAll('.dim-result-filter input[type="checkbox"][data-stat-key]').forEach(cb => {
        cb.addEventListener('change', () => {
            const key = cb.dataset.statKey;
            if (cb.checked) state.visibleStats.add(key);
            else            state.visibleStats.delete(key);
            recompute();
        });
    });
    document.querySelectorAll('.dim-result-filter .btn-filter-action').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            const type = btn.dataset.type;
            if (type === 'stat') {
                if (action === 'all') {
                    STATS_ROWS.forEach(r => state.visibleStats.add(r.key));
                } else if (action === 'none') {
                    state.visibleStats.clear();
                } else if (action === 'default') {
                    state.visibleStats = new Set(DEFAULT_VISIBLE_STATS);
                }
            }
            recompute();
        });
    });
    // Subgroup Actions
    document.querySelectorAll('.dim-result-filter .btn-subgroup-action').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            const category = btn.dataset.category;
            const type = btn.dataset.type;
            if (type === 'stat') {
                const targetRows = STATS_ROWS.filter(r => r.category === category);
                if (action === 'all') {
                    targetRows.forEach(r => state.visibleStats.add(r.key));
                } else if (action === 'none') {
                    targetRows.forEach(r => state.visibleStats.delete(r.key));
                }
            }
            recompute();
        });
    });
}

// 比較表の全行定義 (rowKey + 表示ラベル + factor 取得関数)
//   visibleRows フィルタと共有するためトップレベルに定数化
const COMPARISON_ROWS = [
    { key: 'atk',           label: (opts) => `参照ステ (${factorLabel(opts.refStat)})`, get: (f) => f.atk, category: 'basic_crit' },
    { key: 'crit',          label: () => '会心係数',                                  get: (f) => f.crit, category: 'basic_crit' },
    { key: 'crit.basic',    label: () => '会心係数 (通常)',                            get: (f) => f.critByType.basic, category: 'basic_crit' },
    { key: 'crit.skill',    label: () => '会心係数 (スキル)',                          get: (f) => f.critByType.skill, category: 'basic_crit' },
    { key: 'crit.ult',      label: () => '会心係数 (必殺)',                            get: (f) => f.critByType.ult, category: 'basic_crit' },
    { key: 'crit.followup', label: () => '会心係数 (追撃)',                            get: (f) => f.critByType.followup, category: 'basic_crit' },
    { key: 'dmg.base',      label: () => '与ダメ枠 (共通)',                            get: (f) => f.dmgBonusByType.base, category: 'dmg' },
    { key: 'dmg.basic',     label: () => '与ダメ枠 (通常)',                            get: (f) => f.dmgBonusByType.basic, category: 'dmg' },
    { key: 'dmg.skill',     label: () => '与ダメ枠 (スキル)',                          get: (f) => f.dmgBonusByType.skill, category: 'dmg' },
    { key: 'dmg.ult',       label: () => '与ダメ枠 (必殺)',                            get: (f) => f.dmgBonusByType.ult, category: 'dmg' },
    { key: 'dmg.followup',  label: () => '与ダメ枠 (追撃)',                            get: (f) => f.dmgBonusByType.followup, category: 'dmg' },
    { key: 'def',           label: () => '防御係数',                                  get: (f) => f.def, category: 'debuff' },
    { key: 'def.basic',     label: () => '防御係数 (通常)',                            get: (f) => f.defByType.basic, category: 'debuff' },
    { key: 'def.skill',     label: () => '防御係数 (スキル)',                          get: (f) => f.defByType.skill, category: 'debuff' },
    { key: 'def.ult',       label: () => '防御係数 (必殺)',                            get: (f) => f.defByType.ult, category: 'debuff' },
    { key: 'def.followup',  label: () => '防御係数 (追撃)',                            get: (f) => f.defByType.followup, category: 'debuff' },
    { key: 'res',           label: () => '耐性係数',                                  get: (f) => f.res, category: 'debuff' },
    { key: 'res.basic',     label: () => '耐性係数 (通常)',                            get: (f) => f.resByType.basic, category: 'debuff' },
    { key: 'res.skill',     label: () => '耐性係数 (スキル)',                          get: (f) => f.resByType.skill, category: 'debuff' },
    { key: 'res.ult',       label: () => '耐性係数 (必殺)',                            get: (f) => f.resByType.ult, category: 'debuff' },
    { key: 'res.followup',  label: () => '耐性係数 (追撃)',                            get: (f) => f.resByType.followup, category: 'debuff' },
    { key: 'taken',         label: () => '被ダメ係数',                                get: (f) => f.taken, category: 'debuff' },
    { key: 'taken.basic',    label: () => '被ダメ係数 (通常)',                         get: (f) => f.takenByType.basic, category: 'debuff' },
    { key: 'taken.skill',    label: () => '被ダメ係数 (スキル)',                       get: (f) => f.takenByType.skill, category: 'debuff' },
    { key: 'taken.ult',      label: () => '被ダメ係数 (必殺)',                         get: (f) => f.takenByType.ult, category: 'debuff' },
    { key: 'taken.followup', label: () => '被ダメ係数 (追撃)',                         get: (f) => f.takenByType.followup, category: 'debuff' },
    { key: 'break',         label: () => '撃破係数',                                  get: (f) => f.break, category: 'break' },
    { key: 'fixedDmg',      label: () => '確定ダメージ係数',                          get: (f) => f.fixedDmg, category: 'dmg' },
    { key: 'sepMult',       label: () => '別枠乗算係数',                              get: (f) => f.sepMult, category: 'dmg' },
];
const TOTAL_ROWS = [
    { key: 'total.base',     label: () => '火力総合 (共通)',   get: (f) => f.totals.base, category: 'total' },
    { key: 'total.basic',    label: () => '火力総合 (通常)',   get: (f) => f.totals.basic, category: 'total' },
    { key: 'total.skill',    label: () => '火力総合 (スキル)', get: (f) => f.totals.skill, category: 'total' },
    { key: 'total.ult',      label: () => '火力総合 (必殺)',   get: (f) => f.totals.ult, category: 'total' },
    { key: 'total.followup', label: () => '火力総合 (追撃)',   get: (f) => f.totals.followup, category: 'total' },
];

function renderComparison(cmp, attacks = []) {
    const f = cmp.factors;

    const factorRows = [...COMPARISON_ROWS, ...TOTAL_ROWS];
    const grouped = {};
    for (const catKey of Object.keys(FACTOR_CATEGORIES)) {
        grouped[catKey] = [];
    }
    for (const r of factorRows) {
        if (state.visibleRows.has(r.key)) {
            grouped[r.category].push(r);
        }
    }

    const tbodyHtml = Object.entries(FACTOR_CATEGORIES).map(([catKey, catName]) => {
        const rows = grouped[catKey] || [];
        if (rows.length === 0) return '';
        const headerRow = `<tr class="dim-table-category-header"><td colspan="5">${catName}</td></tr>`;
        const rowsHtml = rows.map(r => {
            if (r.category === 'total') {
                const t = r.get(f);
                return `<tr class="dim-total-row">
                    <th>${statLabel(r.key, r.label())}</th>
                    <td>—</td><td>—</td>
                    <td>×${t.ratio.toFixed(4)}</td>
                    <td class="${contribClass(t.contribution)}">${formatContrib(t.contribution)}</td>
                </tr>`;
            } else {
                return renderFactorRow({ key: r.key, name: r.label(cmp.options), ...r.get(f) });
            }
        }).join('');
        return headerRow + rowsHtml;
    }).join('');

    return `
        ${renderComparisonFilter()}
        ${renderAttackTable(attacks)}
        <h3>火力貢献率</h3>
        <table class="dim-result-table">
            <thead><tr><th>項目</th><th title="スナップショット(比較基準)">基準</th><th>現在</th><th>比率</th><th>貢献率</th></tr></thead>
            <tbody>
                ${tbodyHtml}
            </tbody>
        </table>

        <h3>最終ステータス</h3>
        <table class="dim-result-table">
            <thead><tr><th>項目</th><th title="スナップショット(比較基準)">基準</th><th>現在</th><th>差分</th></tr></thead>
            <tbody>
                ${renderComparisonStatsRows(cmp.beforeStats, cmp.afterStats)}
            </tbody>
        </table>
    `;
}

// STATS_ROWS の visible 行を before/after/差分 形式で描画 (renderComparison の最終ステータス section)
function renderComparisonStatsRows(before, after) {
    const grouped = {};
    for (const catKey of Object.keys(STATS_CATEGORIES)) {
        grouped[catKey] = [];
    }
    for (const r of STATS_ROWS) {
        if (state.visibleStats.has(r.key)) {
            grouped[r.category].push(r);
        }
    }

    return Object.entries(STATS_CATEGORIES).map(([catKey, catName]) => {
        const rows = grouped[catKey] || [];
        if (rows.length === 0) return '';
        const headerRow = `<tr class="dim-table-category-header"><td colspan="4">${catName}</td></tr>`;
        const rowsHtml = rows.map(r => {
            const beforeNum = r.num(before);
            const afterNum  = r.num(after);
            const diff      = afterNum - beforeNum;
            const beforeStr = formatStatCell(r, before);
            const afterStr  = formatStatCell(r, after);
            const diffStr   = formatStatDiff(diff, r.fmt);
            return `<tr>
                <th>${statLabel(r.key, r.label)}</th>
                <td>${beforeStr}</td>
                <td>${afterStr}</td>
                <td class="${contribClass(diff)}">${diffStr}</td>
            </tr>`;
        }).join('');
        return headerRow + rowsHtml;
    }).join('');
}

// 比較表上部のフィルタ折りたたみセクション (チェックボックス群)
//   火力貢献率 行 (visibleRows) と 最終ステータス 行 (visibleStats) の両方を 1 つの details にまとめる
function renderComparisonFilter() {
    const factorRows = [...COMPARISON_ROWS, ...TOTAL_ROWS];

    // Group factors by category
    const groupedFactors = {};
    for (const catKey of Object.keys(FACTOR_CATEGORIES)) {
        groupedFactors[catKey] = [];
    }
    for (const r of factorRows) {
        groupedFactors[r.category].push(r);
    }
    const factorSectionsHtml = Object.entries(FACTOR_CATEGORIES).map(([catKey, catName]) => {
        const rows = groupedFactors[catKey] || [];
        if (rows.length === 0) return '';
        const checkboxes = rows.map(r => `
            <label class="dim-filter-item">
                <input type="checkbox" data-row-key="${r.key}" ${state.visibleRows.has(r.key) ? 'checked' : ''}>
                <span>${statLabel(r.key, r.label({ refStat: state.options.refStat }))}</span>
            </label>
        `).join('');
        return `
            <div class="dim-filter-group">
                <h6 class="dim-filter-subgroup-title">
                    <span>${catName}</span>
                    <span class="dim-filter-subgroup-actions">
                        <button type="button" class="btn-subgroup-action" data-action="all" data-category="${catKey}" data-type="row">全選択</button>
                        <button type="button" class="btn-subgroup-action" data-action="none" data-category="${catKey}" data-type="row">全解除</button>
                    </span>
                </h6>
                <div class="dim-filter-grid">${checkboxes}</div>
            </div>
        `;
    }).join('');

    // Group stats by category
    const groupedStats = {};
    for (const catKey of Object.keys(STATS_CATEGORIES)) {
        groupedStats[catKey] = [];
    }
    for (const r of STATS_ROWS) {
        groupedStats[r.category].push(r);
    }

    const statSectionsHtml = Object.entries(STATS_CATEGORIES).map(([catKey, catName]) => {
        const rows = groupedStats[catKey] || [];
        if (rows.length === 0) return '';
        const checkboxes = rows.map(r => `
            <label class="dim-filter-item">
                <input type="checkbox" data-stat-key="${r.key}" ${state.visibleStats.has(r.key) ? 'checked' : ''}>
                <span>${statLabel(r.key, r.label)}</span>
            </label>
        `).join('');
        return `
            <div class="dim-filter-group">
                <h6 class="dim-filter-subgroup-title">
                    <span>${catName}</span>
                    <span class="dim-filter-subgroup-actions">
                        <button type="button" class="btn-subgroup-action" data-action="all" data-category="${catKey}" data-type="stat">全選択</button>
                        <button type="button" class="btn-subgroup-action" data-action="none" data-category="${catKey}" data-type="stat">全解除</button>
                    </span>
                </h6>
                <div class="dim-filter-grid">${checkboxes}</div>
            </div>
        `;
    }).join('');
    const visibleFactors = factorRows.filter(r => state.visibleRows.has(r.key)).length;
    const visibleStats   = STATS_ROWS.filter(r => state.visibleStats.has(r.key)).length;

    return `
        <details class="dim-result-filter" ${state.filterPanelOpen ? 'open' : ''}>
            <summary>表示項目 (係数 ${visibleFactors}/${factorRows.length} ・ ステ ${visibleStats}/${STATS_ROWS.length})</summary>
            <div class="dim-filter-section">
                <!-- 係数行コントロール -->
                <div class="dim-filter-main-group">
                    <h5 class="dim-filter-group-title">
                        火力貢献率 — 係数行
                        <span class="dim-filter-actions">
                            <button type="button" class="btn-filter-action" data-action="all" data-type="row">すべて選択</button>
                            <button type="button" class="btn-filter-action" data-action="none" data-type="row">すべて解除</button>
                            <button type="button" class="btn-filter-action" data-action="default" data-type="row">デフォルト</button>
                        </span>
                    </h5>
                    ${factorSectionsHtml}
                </div>

                <!-- ステータス行コントロール -->
                <div class="dim-filter-main-group" style="margin-top: 1rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                    <h5 class="dim-filter-group-title">
                        最終ステータス — ステ行
                        <span class="dim-filter-actions">
                            <button type="button" class="btn-filter-action" data-action="all" data-type="stat">すべて選択</button>
                            <button type="button" class="btn-filter-action" data-action="none" data-type="stat">すべて解除</button>
                            <button type="button" class="btn-filter-action" data-action="default" data-type="stat">デフォルト</button>
                        </span>
                    </h5>
                    ${statSectionsHtml}
                </div>
            </div>
        </details>
    `;
}

const renderFactorRow = (row) => `
    <tr>
        <th>${statLabel(row.key, row.name)}</th>
        <td>${formatFactorValue(row.before)}</td>
        <td>${formatFactorValue(row.after)}</td>
        <td>×${row.ratio.toFixed(4)}</td>
        <td class="${contribClass(row.contribution)}">${formatContrib(row.contribution)}</td>
    </tr>
`;
function formatFactorValue(v) { return Math.abs(v) >= 100 ? v.toFixed(1) : v.toFixed(4); }
function formatContrib(c) { return `${c >= 0 ? '+' : ''}${(c * 100).toFixed(2)}%`; }
function contribClass(c) { return c > 0 ? 'dim-contrib-pos' : c < 0 ? 'dim-contrib-neg' : 'dim-contrib-zero'; }
function factorLabel(refStat) { return ({ atk: '攻撃力', hp: 'HP', def: '防御力', spd: '速度' })[refStat] || refStat; }

// ---- キャラ詳細パネル(アコーディオン) -------------------------------

function renderCharDetail() {
    const wrap = document.getElementById('dim-char-detail');
    if (!wrap) return;
    if (!selectedBuildId || !state.build) {
        wrap.innerHTML = '<p class="dim-panel-hint">保存済みビルドを選択すると、キャラ詳細を表示します。</p>';
        return;
    }
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
        const maxLv = getTraceLevelCap(key);
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
                ${bd.map(n => `<tr><th>${n.node}</th><td>${statLabel(n.stat, formatStatLabel(n.stat))}</td><td>+${formatStatValue(n.stat, n.value)}</td></tr>`).join('')}
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
        critRateBasic: '通常攻撃会心率', critRateSkill: '戦闘スキル会心率',
        critRateUlt: '必殺会心率', critRateFollowup: '追加攻撃会心率',
        critDmgBasic: '通常攻撃会心ダメ', critDmgSkill: '戦闘スキル会心ダメ',
        critDmgUlt: '必殺会心ダメ', critDmgFollowup: '追加攻撃会心ダメ',
        dmgAll: '与ダメ枠', breakEffect: '撃破特効',
        dmgBasic: '通常攻撃ダメ枠', dmgSkill: '戦闘スキルダメ枠',
        dmgUlt: '必殺ダメ枠',       dmgFollowup: '追加攻撃ダメ枠',
        ehr: '効果命中', eres: '効果抵抗',
        energyRegen: 'EP回復',
        resPen: '耐性貫通', defIgnore: '防御無視', defDown: '防御ダウン',
        defIgnoreBasic: '通常攻撃防御無視', defIgnoreSkill: '戦闘スキル防御無視',
        defIgnoreUlt: '必殺防御無視', defIgnoreFollowup: '追加攻撃防御無視',
        resPenBasic: '通常攻撃耐性貫通', resPenSkill: '戦闘スキル耐性貫通',
        resPenUlt: '必殺耐性貫通', resPenFollowup: '追加攻撃耐性貫通',
        dmgTaken: '被ダメ増',
        dmgTakenBasic: '通常攻撃被ダメ増', dmgTakenSkill: '戦闘スキル被ダメ増',
        dmgTakenUlt: '必殺被ダメ増', dmgTakenFollowup: '追加攻撃被ダメ増',
        healBonus: '治癒量', healTaken: '被治癒量',
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
