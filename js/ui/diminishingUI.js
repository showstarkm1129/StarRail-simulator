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
    ALL_SLOTS, RELIC_SLOTS, ORNAMENT_SLOTS, SLOT, SET_TYPE,
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
import { statLabel } from './statIcons.js';

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

// ---- 直接ステ入力モード -----------------------------------------------
//
// ビルド(キャラ+光円錐+遺物+バフ)を組まず、最終ステータスを直接打ち込んで
// 火力貢献率を見るモード。値は Diminishing.directStatsToFinalStats() にそのまま渡す。
//   pct=true の項目は UI 上は「25」と入力 → 内部 0.25 で保持。
const DIRECT_CATEGORIES = {
    basic:  '① 基礎ステータス',
    crit:   '② 会心',
    dmg:    '③ 与ダメージ・乗算',
    debuff: '④ デバフ (敵)',
    other:  '⑤ その他',
};

const DIRECT_FIELDS = [
    { key: 'atk',         label: '攻撃力',                 unit: '',  pct: false, cat: 'basic'  },
    { key: 'hp',          label: 'HP',                     unit: '',  pct: false, cat: 'basic'  },
    { key: 'def',         label: '防御力',                 unit: '',  pct: false, cat: 'basic'  },
    { key: 'spd',         label: '速度',                   unit: '',  pct: false, cat: 'basic'  },
    { key: 'critRate',    label: '会心率',                 unit: '%', pct: true,  cat: 'crit'   },
    { key: 'critDmg',     label: '会心ダメ',               unit: '%', pct: true,  cat: 'crit'   },
    { key: 'dmgAll',      label: '与ダメージ% (共通+属性)', unit: '%', pct: true,  cat: 'dmg'    },
    { key: 'dmgBasic',    label: '通常攻撃ダメ枠',         unit: '%', pct: true,  cat: 'dmg'    },
    { key: 'dmgSkill',    label: '戦闘スキルダメ枠',       unit: '%', pct: true,  cat: 'dmg'    },
    { key: 'dmgUlt',      label: '必殺ダメ枠',             unit: '%', pct: true,  cat: 'dmg'    },
    { key: 'dmgFollowup', label: '追加攻撃ダメ枠',         unit: '%', pct: true,  cat: 'dmg'    },
    { key: 'fixedDmg',    label: '確定ダメージ',           unit: '%', pct: true,  cat: 'dmg'    },
    { key: 'sepMult',     label: '別枠乗算',               unit: '%', pct: true,  cat: 'dmg'    },
    { key: 'defDown',     label: '防御Down',               unit: '%', pct: true,  cat: 'debuff' },
    { key: 'defIgnore',   label: '防御無視',               unit: '%', pct: true,  cat: 'debuff' },
    { key: 'resPen',      label: '耐性貫通 / 耐性Down',    unit: '%', pct: true,  cat: 'debuff' },
    { key: 'dmgTaken',    label: '被ダメ増',               unit: '%', pct: true,  cat: 'debuff' },
    { key: 'breakEffect', label: '撃破特効',               unit: '%', pct: true,  cat: 'other'  },
    { key: 'energyRegen', label: 'EP回復効率',             unit: '%', pct: true,  cat: 'other'  },
    { key: 'ehr',         label: '効果命中',               unit: '%', pct: true,  cat: 'other'  },
    { key: 'eres',        label: '効果抵抗',               unit: '%', pct: true,  cat: 'other'  },
];

// 直接入力モードの初期値 (会心・EP回復はゲーム既定の最終値を入れておく)。
const DIRECT_DEFAULTS = {
    critRate: 0.05, critDmg: 0.50, energyRegen: 1.00,
};

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

const DEFAULT_VISIBLE_ROWS = new Set([
    'atk', 'crit', 'def', 'res', 'taken', 'break',
    'dmg.base',
    'total.base',
]);

const DEFAULT_VISIBLE_STATS = new Set([
    'atk', 'hp', 'def', 'spd',
    'critRate', 'critDmg', 'critExpected',
    'energyRegen', 'dmgOwnElement', 'breakEffect',
]);

// ===== 参照ステ・表示項目のショートカット (プリセット) =====
//   1クリックで「参照ステ + 最終ステ表示項目 + 火力貢献率の表示行」を一括設定する。
//   ・アタッカー: 撃破特効を除く、ダメージ式に効く全項目を表示 (参照ステ atk/hp のみ差替)
//   ・サポーター: 速度/EP/効果命中などのサポート指標 + デバフ型の貢献枠
//   ・カスタム: 現在の表示状態を名前付きで保存 (localStorage、いくつでも追加可)
const REF_PRESET_STORAGE_KEY = 'srsim.dim.refPresets';

// アタッカー共通の最終ステ表示 (撃破特効は除外)。参照ステ(atk/hp)だけ先頭で差し替える。
const ATTACKER_DMG_STATS = [
    'critRate', 'critDmg', 'critExpected',
    'dmgOwnElement', 'dmgBasic', 'dmgSkill', 'dmgUlt', 'dmgFollowup',
    'dmgTotalBasic', 'dmgTotalSkill', 'dmgTotalUlt', 'dmgTotalFollowup',
    'fixedDmg', 'sepMult',
    'defDown', 'defIgnore', 'defReductionTotal', 'resPen', 'dmgTaken',
];
// アタッカー共通の火力貢献率の表示行 (撃破係数は除外)。
const ATTACKER_DMG_ROWS = [
    'atk', 'crit',
    'dmg.base', 'dmg.basic', 'dmg.skill', 'dmg.ult', 'dmg.followup',
    'def', 'res', 'taken', 'fixedDmg', 'sepMult',
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

const state = {
    build: null,
    snapshot: null,
    // 入力モード: 'build' = キャラ/装備からビルドを組む / 'direct' = 最終ステ直接入力
    inputMode: 'build',
    // 直接入力モードの状態 (stats: 現在値の dict / snapshot: 比較基準の dict)
    direct: { stats: { ...DIRECT_DEFAULTS }, snapshot: null },
    options: { ...Diminishing.DEFAULT_OPTIONS },
    // パーティ枠: focus 以外のメンバー × 3
    //   各要素: {
    //     characterId: string|null,           簡易モード用 (キャラ select の値)
    //     levelPreset: 'default'|'eidolon',   簡易モード用 (無凸MAX / 凸後MAX)
    //     buildId: string|null,                ビルドモード用 (BuildStore の id、優先)
    //     activeEffectIds: Set<string>,        合成ID: 'char.<id>' | 'lc.<id>' | 'set:<setId>:pc2.<id>' 等
    //     stacksByEffectId: { [ekey]: number }, stackable 効果の現在層数 (1〜ef.stackable.max)
    //   }
    party: [
        { mode: 'simple', characterId: null, levelPreset: 'eidolon', buildId: null, activeEffectIds: new Set(), stacksByEffectId: {} },
        { mode: 'simple', characterId: null, levelPreset: 'eidolon', buildId: null, activeEffectIds: new Set(), stacksByEffectId: {} },
        { mode: 'simple', characterId: null, levelPreset: 'eidolon', buildId: null, activeEffectIds: new Set(), stacksByEffectId: {} },
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
    // 比較表の行表示フィルタ — true の行 key だけ renderComparison で描画される。
    //   行 key の命名:
    //     'atk' / 'crit' / 'def' / 'res' / 'taken' / 'break'
    //     'dmg.base' / 'dmg.basic' / 'dmg.skill' / 'dmg.ult' / 'dmg.followup'
    //     'total.base' / 'total.basic' / 'total.skill' / 'total.ult' / 'total.followup'
    //   デフォルトは「現状の見た目」と一致するように共通行のみ ON、種別 4 つは OFF。
    visibleRows: new Set(DEFAULT_VISIBLE_ROWS),
    // 「表示項目」フィルタの開閉状態 (再描画で <details open> 状態を維持するため)
    filterPanelOpen: false,
    // 「現状の最終ステータス」(スナップショット前) のステータス行表示フィルタ。
    // 既存 10 項目をデフォルト表示 (現状の見た目と一致)、デバフ/種別ダメは OFF。
    visibleStats: new Set(DEFAULT_VISIBLE_STATS),
    statsPanelOpen: false,
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
    renderRefPresets();
    bindRefPresets();
    refreshAllForms();
    applyInputModeVisibility();
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

            <div class="dim-main">
              <div class="dim-col-left">
            <div class="dim-grid">
                <div class="dim-panel" id="dim-char-panel">
                    <h3>キャラ・光円錐・セット効果</h3>
                    <div class="dim-char-cols">
                      <div class="dim-char-col">
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

                      <div class="dim-char-col">
                        <h4 class="dim-subheading dim-subheading-first">セット効果(一括選択)</h4>
                        <p class="dim-panel-hint">セットを選ぶと自動で各部位に適用されます。</p>

                        <div class="dim-preset-block">
                            <div class="dim-preset-mode">
                                <label class="dim-radio"><input type="radio" name="cav-mode" value="4set" checked> トンネル 4セット</label>
                                <label class="dim-radio"><input type="radio" name="cav-mode" value="2+2"> トンネル 2+2</label>
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
                        </div>

                        <div class="dim-preset-block">
                            <div class="dim-preset-row">
                                <label>次元界 (球・縄)</label>
                                <select id="dim-preset-planar"></select>
                            </div>
                        </div>
                      </div>
                    </div>
                </div>

                <div class="dim-panel dim-subs-panel">
                    <h3>ステータス入力</h3>
                    <div id="dim-mainstat-section">
                        <h4 class="dim-subheading-inline">遺物メインステ</h4>
                        <div class="dim-relic-main-grid">
                            ${ALL_SLOTS.map(slot => `
                                <div class="dim-relic-slot">
                                    <label>${slotLabel(slot)}</label>
                                    <select class="dim-relic-main" data-slot="${slot}"></select>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <p class="dim-panel-hint dim-subs-global-hint">
                        数値入力欄はクリックでフォーカスした後、マウスホイールでも増減できます (下限 0)。
                    </p>
                    <div class="dim-subs-tabs" id="dim-subs-tabs">
                        <button type="button" class="dim-subs-tab" data-mode="manual">自由入力</button>
                        <button type="button" class="dim-subs-tab" data-mode="total">総合ロール</button>
                        <button type="button" class="dim-subs-tab" data-mode="perSlot">部位別ロール</button>
                        <button type="button" class="dim-subs-tab dim-subs-tab-direct" data-mode="direct">ステータス直接入力</button>
                    </div>
                    <div class="dim-subs-tab-body" id="dim-subs-body"></div>
                </div>
            </div>

            <div class="dim-panel dim-self-buffs-panel" id="dim-self-buffs-panel">
                <h3>自身バフ・デバフ設定 (本人の能力・装備効果)</h3>
                <p class="dim-panel-hint">
                    メイン（Focus）キャラクター本人のパーティ効果や自己バフ効果を選択し、ステータスに反映させます。
                </p>
                <div id="dim-self-buffs-content" class="dim-self-buffs-content"></div>
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

function slotLabel(slot) {
    return ({ head: '頭', hands: '手', body: '胴', feet: '足', sphere: '球', rope: '縄' })[slot] || slot;
}

// 直接ステ入力フィールドを描画 (renderSubsBody から「ステータス直接入力」タブ選択時に呼ばれる)。
//   値は state.direct.stats から読むため、他モードへ切替→再選択しても入力値が維持される。
function renderDirectFields() {
    const groups = Object.entries(DIRECT_CATEGORIES).map(([cat, title]) => {
        const fields = DIRECT_FIELDS.filter(f => f.cat === cat);
        if (fields.length === 0) return '';
        const rows = fields.map(f => {
            const v = state.direct.stats[f.key] ?? 0;
            const display = f.pct ? trimNumber(v * 100) : trimNumber(v);
            return `
                <div class="dim-sub-row">
                    <label>${statLabel(f.key, f.label)}</label>
                    <input type="number" step="${f.pct ? '0.1' : '1'}" class="dim-direct-input"
                           data-key="${f.key}" data-pct="${f.pct ? '1' : '0'}" value="${display}">
                    <span class="dim-sub-unit">${f.unit}</span>
                </div>
            `;
        }).join('');
        return `<h4 class="dim-subheading">${title}</h4><div class="dim-subs-grid">${rows}</div>`;
    }).join('');

    return `
        <p class="dim-panel-hint">
            遺物ビルドの最終ステータスを直接入力します。<b>軌跡・パーティバフ・セット効果は計算に含まれません</b> (入力値がそのまま最終値)。
            % 欄は数値で「25」と入力すると 25% 扱いです。会心率・会心ダメは基礎値 (5% / 50%) 込みの最終値を入力してください。
        </p>
        ${groups}
    `;
}

// 末尾の余計な 0 を落として表示する (例: 25.00 → 25, 25.50 → 25.5)。
function trimNumber(n) {
    return Number(n.toFixed(2)).toString();
}

// ---- フォーム初期化 ----------------------------------------------------

function refreshAllForms() {
    fillCharacterSelect();
    fillEidolonSelect();
    fillLightconeSelect();
    fillSuperimposeSelect();
    for (const slot of ALL_SLOTS) {
        fillRelicMainSelect(slot);
    }
    initSubsFromEnvBuffs();
    renderSubsBody();
    fillOptionInputs();
    fillLevelInputs();
    fillPresetSelects();
    refreshBuildList();
    applyDefaultActiveSelfEffects(true);
    renderSelfBuffs();
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
    // 各キャラには対応する運命 (path) の光円錐のみ装備可能。
    // ただし isTestAllEquipment = true のテストキャラは全光円錐を許容。
    const ch = Registry.character.get(state.build.characterId);
    const isTestAll = !!ch?.isTestAllEquipment;
    const charPath = ch?.path;
    const lcs = Registry.lightcone.list().filter(lc => {
        if (isTestAll) return true;
        if (!charPath) return true;        // キャラ未選択時は全表示 (fallback)
        return lc.path === charPath;
    });
    sel.innerHTML = [`<option value="">(なし)</option>`].concat(
        lcs.map(lc =>
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

    // タブの active 表示 (直接入力モード時は 'direct' タブをアクティブに)
    const activeMode = state.inputMode === 'direct' ? 'direct' : state.subs.mode;
    document.querySelectorAll('#dim-subs-tabs .dim-subs-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === activeMode);
    });

    if (state.inputMode === 'direct')       body.innerHTML = renderDirectFields();
    else if (state.subs.mode === 'manual')  body.innerHTML = renderSubsTab_manual();
    else if (state.subs.mode === 'total')   body.innerHTML = renderSubsTab_total();
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
                        <label>${statLabel(s.key, s.label)}</label>
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
    // ── direct (ステータス直接入力) ──
    document.querySelectorAll('.dim-direct-input').forEach(inp => {
        inp.addEventListener('input', () => {
            const key = inp.dataset.key;
            const isPct = inp.dataset.pct === '1';
            const raw = parseFloat(inp.value);
            const val = Number.isFinite(raw) ? raw : 0;
            state.direct.stats[key] = isPct ? val / 100 : val;
            recompute();
        });
    });

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
        if (state.inputMode === 'direct') {
            state.direct.snapshot = { ...state.direct.stats };
        } else {
            state.snapshot = JSON.parse(JSON.stringify(state.build));
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

    document.getElementById('dim-char').addEventListener('change', e => {
        state.build.characterId = e.target.value;
        // キャラ変更時はLvを無凸MAXで再初期化
        const newCh = Registry.character.get(e.target.value);
        state.build.traceLevel = presetDefaultMaxLevels(newCh);
        // 運命不一致の光円錐は自動解除 (testAll は全装備許容のためスキップ)
        const curLcId = state.build.lightcone?.id;
        if (curLcId && newCh && !newCh.isTestAllEquipment) {
            const curLc = Registry.lightcone.get(curLcId);
            if (curLc && curLc.path !== newCh.path) {
                state.build.lightcone.id = null;
            }
        }
        // ※ パーティ枠に同キャラがいてもクリアしない (セルフバフ計算を許容)
        //   常時オーラ等は二重計上になるためユーザー側で off にすること
        fillLevelInputs();
        fillLightconeSelect();   // キャラの運命に合わせて選択肢を絞り直す
        renderParty();    // 選択肢の表示更新
        applyPartyToEnvBuffs();
        renderCharDetail();
        onEquipmentChange(false);
        recompute();
    });
    document.getElementById('dim-eidolon').addEventListener('change', e => {
        state.build.eidolon = parseInt(e.target.value, 10);
        // 星魂上昇でLv上限が変わる可能性があるためLv inputを再描画
        fillLevelInputs();
        renderCharDetail();
        onEquipmentChange(true);
        recompute();
    });
    document.getElementById('dim-lc').addEventListener('change', e => {
        state.build.lightcone.id = e.target.value || null;
        onEquipmentChange(true);
        recompute();
    });
    document.getElementById('dim-lc-si').addEventListener('change', e => {
        state.build.lightcone.superimpose = parseInt(e.target.value, 10);
        onEquipmentChange(true);
        recompute();
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

    // サブステ / 直接入力タブ切替
    //   'direct' タブ = ステータス直接入力モード、その他 = ビルド計算モードのサブステ各方式
    document.querySelectorAll('#dim-subs-tabs .dim-subs-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            if (mode === 'direct') {
                state.inputMode = 'direct';
            } else {
                state.inputMode = 'build';
                state.subs.mode = mode;
            }
            applyInputModeVisibility();
            renderSubsBody();
            if (state.inputMode === 'build') applySubsToEnvBuffs();
            updateSnapshotStatus();
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
            document.getElementById('dim-preset-cav4').style.display   = (mode === '4set') ? 'flex' : 'none';
            document.getElementById('dim-preset-cav22').style.display  = (mode === '2+2')  ? 'flex' : 'none';
            if (mode === 'none') {
                for (const slot of RELIC_SLOTS) state.build.relics[slot].setId = null;
                onEquipmentChange(true);
                recompute();
            }
        });
    });

    // 4セット — auto-apply
    document.getElementById('dim-preset-cav-a').addEventListener('change', e => {
        const id = e.target.value || null;
        for (const slot of RELIC_SLOTS) state.build.relics[slot].setId = id;
        onEquipmentChange(true);
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
        onEquipmentChange(true);
        recompute();
    };
    document.getElementById('dim-preset-cav-22a').addEventListener('change', apply22);
    document.getElementById('dim-preset-cav-22b').addEventListener('change', apply22);

    // Planar — auto-apply
    document.getElementById('dim-preset-planar').addEventListener('change', e => {
        const id = e.target.value || null;
        for (const slot of ORNAMENT_SLOTS) state.build.relics[slot].setId = id;
        onEquipmentChange(true);
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

function onEquipmentChange(preserveExisting = true) {
    applyDefaultActiveSelfEffects(preserveExisting);
    renderSelfBuffs();
}

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

// 直接入力モードでもビルド系パネルは隠さない (ユーザー要望: タブ/パネルが消えないように)。
//   モード差はサブステタブ本文 (renderSubsBody) と結果計算 (recompute) 側だけで吸収する。
//   過去に display:none が付与されていた場合に備え、念のため全表示へ戻すだけのリセット処理。
function applyInputModeVisibility() {
    for (const sel of [
        '.dim-build-mgr', '#dim-char-panel', '#dim-mainstat-section',
        '#dim-self-buffs-panel', '.dim-party-panel', '#dim-char-detail',
    ]) {
        const el = document.querySelector(sel);
        if (el) el.style.display = '';
    }
}

// 直接ステ入力モードの計算 + 結果描画 (recompute から委譲)。
function recomputeDirect(resultEl) {
    let nowStats;
    try { nowStats = Diminishing.directStatsToFinalStats(state.direct.stats); }
    catch (err) { resultEl.innerHTML = `<div class="dim-error">計算エラー: ${err.message}</div>`; return; }

    if (!state.direct.snapshot) {
        resultEl.innerHTML = renderStatsOnly(nowStats);
        bindStatsFilter();
        return;
    }
    let cmp;
    try {
        const beforeStats = Diminishing.directStatsToFinalStats(state.direct.snapshot);
        cmp = Diminishing.compareStats(beforeStats, nowStats, state.options);
    } catch (err) { resultEl.innerHTML = `<div class="dim-error">比較エラー: ${err.message}</div>`; return; }
    resultEl.innerHTML = renderComparison(cmp);
    bindComparisonFilter();
}

function recompute() {
    const resultEl = document.getElementById('dim-result');
    if (!resultEl) return;

    if (state.inputMode === 'direct') {
        recomputeDirect(resultEl);
        return;
    }

    applySelfBuffsToEnvBuffs();

    let nowStats;
    try { nowStats = StatComputer.compute(state.build); }
    catch (err) { resultEl.innerHTML = `<div class="dim-error">計算エラー: ${err.message}</div>`; return; }

    if (!state.snapshot) {
        resultEl.innerHTML = renderStatsOnly(nowStats);
        bindStatsFilter();
        return;
    }
    let cmp;
    try { cmp = Diminishing.compareBuilds(state.snapshot, state.build, state.options); }
    catch (err) { resultEl.innerHTML = `<div class="dim-error">比較エラー: ${err.message}</div>`; return; }
    resultEl.innerHTML = renderComparison(cmp);
    bindComparisonFilter();
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

    // ===== デバフ合計 =====
    { key: 'defReductionTotal', label: '防御減少 合計 (Down+無視)',
      fmt: 'pct', num: (s) => (s.raw.defDown || 0) + (s.raw.defIgnore || 0), category: 'debuff' },
    { key: 'resPen',        label: '耐性貫通 / 耐性Down (合計)',
      fmt: 'pct',   num: (s) => s.raw.resPen   || 0, category: 'debuff' },
    { key: 'dmgTaken',      label: '被ダメ増 (合計)',  fmt: 'pct',   num: (s) => s.raw.dmgTaken || 0, category: 'debuff' },

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
        case 'spd':         return `${n.toFixed(2)} (AV ${(row.av ? row.av(s) : 0).toFixed(1)})`;
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

function renderStatsOnly(s) {
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
    { key: 'dmg.base',      label: () => '与ダメ枠 (共通)',                            get: (f) => f.dmgBonusByType.base, category: 'dmg' },
    { key: 'dmg.basic',     label: () => '与ダメ枠 (通常)',                            get: (f) => f.dmgBonusByType.basic, category: 'dmg' },
    { key: 'dmg.skill',     label: () => '与ダメ枠 (スキル)',                          get: (f) => f.dmgBonusByType.skill, category: 'dmg' },
    { key: 'dmg.ult',       label: () => '与ダメ枠 (必殺)',                            get: (f) => f.dmgBonusByType.ult, category: 'dmg' },
    { key: 'dmg.followup',  label: () => '与ダメ枠 (追撃)',                            get: (f) => f.dmgBonusByType.followup, category: 'dmg' },
    { key: 'def',           label: () => '防御係数',                                  get: (f) => f.def, category: 'debuff' },
    { key: 'res',           label: () => '耐性係数',                                  get: (f) => f.res, category: 'debuff' },
    { key: 'taken',         label: () => '被ダメ係数',                                get: (f) => f.taken, category: 'debuff' },
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

function renderComparison(cmp) {
    const f = cmp.factors;
    const a = cmp.beforeStats.derived;
    const b = cmp.afterStats.derived;

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
        dmgAll: '与ダメ枠', breakEffect: '撃破特効',
        dmgBasic: '通常攻撃ダメ枠', dmgSkill: '戦闘スキルダメ枠',
        dmgUlt: '必殺ダメ枠',       dmgFollowup: '追加攻撃ダメ枠',
        ehr: '効果命中', eres: '効果抵抗',
        energyRegen: 'EP回復',
        resPen: '耐性貫通', defIgnore: '防御無視', defDown: '防御ダウン',
        dmgTaken: '被ダメ増', healBonus: '治癒量', healTaken: '被治癒量',
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
