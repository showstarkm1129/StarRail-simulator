// buildUI.js — キャラビルドタブ
//
// 目的: 「キャラクターを精密にビルドする」ことだけに責務を絞ったタブ。
//       キャラ・星魂・軌跡レベル・光円錐・遺物 (装備とその数値) を確定させ、ビルドとして保存する。
//
// このタブでやらないこと (意図的に持たない):
//   - 自身バフ / パーティバフの ON/OFF        → 限界効用逓減タブ・AI アシスタント
//   - スナップショット比較・火力貢献率の表     → 限界効用逓減タブ
//   保存ビルドにはキャラ・星魂・装備・数値が入るので、受け取った側でバフ計算まで再現できる。
//
// 構成:
//   1. ビルド管理バー (名前 / 保存・新規・複製・削除 / JSON 入出力 / 他タブへ送る)
//   2. 左  : キャラ・星魂・軌跡レベル・光円錐
//   3. 中央: 遺物 6 部位 (メイン = 遺物倉庫から装備)
//   4. 右  : 最終ステータス (バフなし) / 有効セット効果
//
// 遺物の入力は 3 モード:
//   relics : 倉庫の遺物を各部位に装備する (メイン)
//   manual : サブステ合計値を直接入力  (装備中のサブステは無視)
//   roll   : サブステをロール回数で指定 (装備中のサブステは無視)
//
// 設計判断:
//   - セットは「装備した遺物そのもの」で決まる。セット一括プリセットは持たない
//     (遺物と別にセットだけ変わる状態を作らないため)。
//   - 「実物の遺物リンク」(build.relicIds) は traceability 用。メインステを手で変えた
//     部位はリンクだけ外して数値は残す (実験を壊さない)。
//   - 同じ遺物は何ビルドからでも同時に装備できる (実機の重複制約は再現しない)。

import { Registry } from '../build/registry.js';
import { StatComputer, countSetsByType } from '../build/statComputer.js';
import { Diminishing } from '../build/diminishing.js';
import { Build as BuildStore } from '../build/buildStore.js';
import {
    addBuildCandidate,
    candidateGroupKey,
    candidateLabel,
    getBuildCandidates,
    isEidolonCandidate,
    normalizeBuildCandidates,
    removeBuildCandidate,
    applyBuildCandidate,
} from '../build/buildCandidates.js';
import { RelicStore } from '../build/relicStore.js';
import { ALL_SLOTS, DAMAGE_SCALE, SLOT_TO_SET_TYPE, SET_TYPE } from '../build/constants.js';
import { RELIC_MAIN_OPTIONS, getMainStatDef } from '../build/relicMainTable.js';
import { STAT } from '../build/statKeys.js';
import { SUBSTAT_TABLE, SUBSTAT_ORDER, STAT_TO_SUB_KEY } from '../build/substatTable.js';
import { calcManualAllocation, rollsToStatDict } from '../build/substatRoller.js';
import {
    getTraceLevelCap, getTraceLevelDefault, clampLevel, presetTraceLevels,
} from '../build/skillUtil.js';
import { signatureLightconeForCharacter } from '../data/lightcones/signatureRelations.js';
import { statLabel } from './statIcons.js';
import { enhanceSelect } from './smartPicker.js';
import { renderCandidateChips, bindCandidateChips } from './candidateChips.js';

// ---- 定数 --------------------------------------------------------------

// 限界効用逓減タブが envBuffs に展開する派生バフのラベル接頭辞。
//   サブステ.  … このタブでも manual/roll モードで生成する (再構築対象)
//   自身バフ.  … このタブは扱わないが、保存ビルドからは消さずに保持する
const SUB_LABEL_PREFIX = 'サブステ.';
const SELF_LABEL_PREFIX = '自身バフ.';

const SLOT_LABELS = Object.freeze({
    head: '頭部', hands: '手部', body: '胴体', feet: '脚部', sphere: '次元界オーブ', rope: '連結縄',
});

const SKILL_LABELS = Object.freeze({
    basic: '通常', skill: '戦闘', ult: '必殺', talent: '天賦',
    memorySkill: '精霊スキル', memoryTalent: '精霊天賦',
});
const LEVEL_SKILL_KEYS = Object.freeze(['basic', 'skill', 'ult', 'talent', 'memorySkill', 'memoryTalent']);

const ELEMENT_LABELS = Object.freeze({
    physical: '物理', fire: '炎', ice: '氷', lightning: '雷',
    wind: '風', quantum: '量子', imaginary: '虚数',
});
const PATH_LABELS = Object.freeze({
    destruction: '壊滅', hunt: '巡狩', erudition: '知恵', harmony: '調和', nihility: '虚無',
    preservation: '存護', abundance: '豊穣', remembrance: '記憶', elation: '愉悦',
});

const DAMAGE_SCALE_LABELS = Object.freeze({
    [DAMAGE_SCALE.ATK]: 'ATKスケール',
    [DAMAGE_SCALE.HP]: 'HPスケール',
    [DAMAGE_SCALE.BREAK]: '撃破スケール',
    [DAMAGE_SCALE.ELATION]: '愉悦スケール',
});

const SUBS_MODES = Object.freeze([
    { mode: 'relics', label: '倉庫から装備', badge: 'メイン' },
    { mode: 'manual', label: 'サブステ合計を手入力' },
    { mode: 'roll',   label: 'サブステをロールで作る' },
]);

// 右パネルの最終ステータス行。core=常時表示 / それ以外は 0 のとき折りたたむ。
const STAT_ROWS = Object.freeze([
    { label: '防御力',        core: true, get: s => s.derived.def,             fmt: 'num' },
    { label: '基本行動値',    core: true, get: s => s.derived.speedAV,         fmt: 'num2' },
    { label: '与ダメージ(自属性)', core: true, statKey: STAT.DMG_ALL, get: s => s.derived.dmgOwnElement, fmt: 'pct' },
    { label: '会心期待値',    core: true, get: s => s.derived.critExpected,    fmt: 'num3' },
    { label: 'EP回復効率',    core: true, statKey: STAT.ENERGY_REGEN, get: s => s.derived.energyRegenPct, fmt: 'pct' },
    { label: '撃破特効',      core: true, statKey: STAT.BREAK_EFFECT, get: s => s.raw[STAT.BREAK_EFFECT], fmt: 'pct' },
    { label: '効果命中',      core: true, statKey: STAT.EFFECT_HIT_RATE, get: s => s.raw[STAT.EFFECT_HIT_RATE], fmt: 'pct' },
    { label: '効果抵抗',      core: true, statKey: STAT.EFFECT_RES, get: s => s.raw[STAT.EFFECT_RES], fmt: 'pct' },
    { label: '治癒量',        core: true, statKey: STAT.HEAL_BONUS, get: s => s.raw[STAT.HEAL_BONUS], fmt: 'pct' },
    { label: '通常攻撃ダメ枠',   statKey: STAT.DMG_BASIC,    get: s => s.raw[STAT.DMG_BASIC],    fmt: 'pct' },
    { label: '戦闘スキルダメ枠', statKey: STAT.DMG_SKILL,    get: s => s.raw[STAT.DMG_SKILL],    fmt: 'pct' },
    { label: '必殺ダメ枠',       statKey: STAT.DMG_ULT,      get: s => s.raw[STAT.DMG_ULT],      fmt: 'pct' },
    { label: '追加攻撃ダメ枠',   statKey: STAT.DMG_FOLLOWUP, get: s => s.raw[STAT.DMG_FOLLOWUP], fmt: 'pct' },
    { label: '確定ダメージ',     statKey: STAT.FIXED_DMG,    get: s => s.raw[STAT.FIXED_DMG],    fmt: 'pct' },
    { label: '別枠乗算',         statKey: STAT.SEP_MULT,     get: s => s.raw[STAT.SEP_MULT],     fmt: 'pct' },
    { label: '防御Down',         statKey: STAT.DEF_DOWN,     get: s => s.raw[STAT.DEF_DOWN],     fmt: 'pct' },
    { label: '防御無視',         statKey: STAT.DEF_IGNORE,   get: s => s.raw[STAT.DEF_IGNORE],   fmt: 'pct' },
    { label: '耐性貫通',         statKey: STAT.RES_PEN,      get: s => s.raw[STAT.RES_PEN],      fmt: 'pct' },
    { label: '被ダメ増',         statKey: STAT.DMG_TAKEN,    get: s => s.raw[STAT.DMG_TAKEN],    fmt: 'pct' },
]);

// サブステ合計を手入力するモードのフィールド (SUBSTAT_ORDER と同じ並び)
const MANUAL_SUB_FIELDS = SUBSTAT_ORDER.map(subKey => ({
    subKey,
    stat: SUBSTAT_TABLE[subKey].stat,
    label: SUBSTAT_TABLE[subKey].label,
    asPercent: SUBSTAT_TABLE[subKey].asPercent,
}));

// 火力差分を計算する候補数の上限 (超えたら差分省略 + 絞り込みを促す)
const DELTA_LIMIT = 150;

// 遺物倉庫が空でも操作できるよう、部位ごとの既定メインステを持つ。
const DEFAULT_MAIN_BY_SLOT = Object.freeze({
    head: 'hp_flat', hands: 'atk_flat', body: 'crit_rate',
    feet: 'spd_flat', sphere: 'atk_percent', rope: 'atk_percent',
});

// ---- 状態 --------------------------------------------------------------

const state = {
    /** @type {any} 編集中のビルド (buildStore スキーマ + relicIds / subsInput) */
    build: null,
    /** @type {string|null} 保存済みビルドの id (未保存なら null) */
    savedId: null,
    /** @type {any} 保存/読込した時点の FinalStats (差分表示用) */
    baseline: null,
    /** @type {string|null} 遺物ピッカーを開いている部位 */
    pickerSlot: null,
    /** @type {'pick'|'edit'|null} 遺物ポップオーバーを開いた操作 */
    pickerAction: null,
    /** @type {any} 仮想遺物エディタの下書き (null = 閉じている) */
    editor: null,
    pickerFilters: { setId: '', mainStat: '', kind: '' },
    /** 火力差分の参照ステ (攻撃力参照キャラ以外は切り替える) */
    refStat: 'auto',
    showZeroStats: false,
    /** @type {Object<string, boolean>} 遺物メインステの差し替え候補チップを展開中の部位 */
    mainStatCandsOpen: {},
    /** キャラビルド画面で最後に適用した候補 (表示上のフィードバック用) */
    activeCandidateId: null,
};

// ---- エントリ ----------------------------------------------------------

export function initBuildUI() {
    const root = document.getElementById('tab-build');
    if (!root) return;

    const firstCharId = Registry.character.ids().find(id => id !== 'template') || Registry.character.ids()[0];
    if (!firstCharId) {
        root.innerHTML = '<p class="cb-hint">キャラクターデータが登録されていません。</p>';
        return;
    }

    root.innerHTML = renderShell();
    state.build = newBuild(firstCharId);
    state.activeCandidateId = null;
    bindStaticEvents();
    // 他タブ (限界効用逓減 / AI) がビルドを保存・削除した時も一覧を追従させる。
    document.addEventListener('srsim:builds-changed', refreshBuildList);
    document.addEventListener('srsim:tab-change', event => {
        if (event.detail?.targetId === 'tab-build') notifyContextBar();
    });
    refreshAll();
}

// ---- ビルド生成・正規化 -------------------------------------------------

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function newBuild(characterId) {
    const build = BuildStore.blank(characterId);
    build.name = '';
    return normalizeBuild(build, characterId);
}

// 保存ビルド / 新規ビルドの双方を、このタブが扱える形に整える。
function normalizeBuild(build, characterId = build.characterId) {
    const character = Registry.character.get(characterId);
    build.characterId = characterId;
    build.traceLevel = { ...presetTraceLevels(character), ...(build.traceLevel || {}) };
    build.lightcone = build.lightcone?.id
        ? { id: build.lightcone.id, superimpose: build.lightcone.superimpose || 1 }
        : (signatureLightconeForCharacter(characterId) || { id: null, superimpose: 1 });
    build.relics ||= {};
    for (const slot of ALL_SLOTS) {
        const relic = build.relics[slot] || {};
        build.relics[slot] = {
            setId: relic.setId || null,
            mainStat: relic.mainStat || DEFAULT_MAIN_BY_SLOT[slot],
            subs: { ...(relic.subs || {}) },
        };
    }
    build.relicIds = { ...(build.relicIds || {}) };
    build.candidates = normalizeBuildCandidates(build).candidates;
    build.subsInput = {
        mode: SUBS_MODES.some(m => m.mode === build.subsInput?.mode) ? build.subsInput.mode : 'relics',
        manual: { ...(build.subsInput?.manual || {}) },
        alloc: { ...(build.subsInput?.alloc || {}) },
        tier: build.subsInput?.tier || 'high',
    };
    // 旧バージョンのこのタブが書いていた作業用フィールド。現在は使わないので落とす。
    delete build.seenSelfEffectIds;
    adoptSubstatEnvBuffs(build);
    return build;
}

// 限界効用逓減タブで作られたビルドは、サブステが relics ではなく
// envBuffs (`サブステ.*`) に入っている。同じ意味になる手入力モードへ移して
// 読み込み → 保存でサブステが失われないようにする。
function adoptSubstatEnvBuffs(build) {
    const generated = (build.envBuffs || []).filter(buff => isSubstatBuff(buff));
    if (generated.length === 0) return;
    const hasRelicSubs = ALL_SLOTS.some(slot => Object.keys(build.relics[slot].subs || {}).length > 0);
    if (!hasRelicSubs) {
        const manual = { ...build.subsInput.manual };
        for (const buff of generated) {
            manual[buff.stat] = (manual[buff.stat] || 0) + (Number(buff.value) || 0);
        }
        build.subsInput = { ...build.subsInput, mode: 'manual', manual };
    }
    // 表示・保存時は subsInput から再生成するので、元の展開結果は残さない。
    build.envBuffs = (build.envBuffs || []).filter(buff => !isSubstatBuff(buff));
}

function isSubstatBuff(buff) {
    return typeof buff?.label === 'string' && buff.label.startsWith(SUB_LABEL_PREFIX);
}

function isSelfBuff(buff) {
    return typeof buff?.label === 'string' && buff.label.startsWith(SELF_LABEL_PREFIX);
}

// 計算用ビルドを組み立てる。
//   - サブステ入力モードが manual/roll のときは装備サブステを捨て、入力値を envBuffs に載せる
//   - 条件付きバフ (自身バフ) はこのタブでは載せない = 素の数値を表示する
function materialize(build) {
    const next = clone(build);
    next.envBuffs = (next.envBuffs || []).filter(buff => !isSubstatBuff(buff) && !isSelfBuff(buff));

    const mode = build.subsInput?.mode || 'relics';
    if (mode !== 'relics') {
        for (const slot of ALL_SLOTS) next.relics[slot].subs = {};
        for (const [stat, value] of Object.entries(subsFromInput(build))) {
            if (value) next.envBuffs.push({ stat, value, label: `${SUB_LABEL_PREFIX}${stat}` });
        }
    }
    return next;
}

// 保存用ビルド: 表示と同じ内容 + 条件付きバフの選択状態はそのまま残す。
function buildForSave() {
    const saved = clone(state.build);
    saved.envBuffs = [
        ...(saved.envBuffs || []).filter(buff => !isSubstatBuff(buff)),
        ...Object.entries(subsFromInput(state.build))
            .filter(([, value]) => value)
            .map(([stat, value]) => ({ stat, value, label: `${SUB_LABEL_PREFIX}${stat}` })),
    ];
    return saved;
}

// manual / roll モードのサブステ合計を { statKey: value } で返す。
function subsFromInput(build) {
    const input = build.subsInput || {};
    if (input.mode === 'manual') {
        const out = {};
        for (const field of MANUAL_SUB_FIELDS) {
            const value = Number(input.manual?.[field.stat]) || 0;
            if (value) out[field.stat] = value;
        }
        return out;
    }
    if (input.mode === 'roll') {
        const { totals } = calcManualAllocation({ allocations: input.alloc || {}, tier: input.tier || 'high' });
        return rollsToStatDict(totals);
    }
    return {};
}

function computeStats(build = state.build) {
    try {
        return StatComputer.compute(materialize(build));
    } catch (error) {
        console.error('[buildUI] ステータス計算に失敗', error);
        return null;
    }
}

function damageOptions() {
    const character = Registry.character.get(state.build?.characterId);
    const damageScale = state.refStat === 'auto'
        ? (character?.damageScale || null)
        : DAMAGE_SCALE.ATK;
    return {
        ...Diminishing.DEFAULT_OPTIONS,
        ...(state.refStat === 'auto' ? {} : { refStat: state.refStat }),
        damageScale,
    };
}

// ---- HTML 骨組み -------------------------------------------------------

function renderShell() {
    return `
        <div class="cb-container cb-mock-shell">
            <div class="cb-intro">
                <div>
                    <span class="cb-section-kicker">01 — BUILD</span>
                    <h2 class="cb-title">キャラビルド</h2>
                    <p class="cb-intro-help">設定は必要なときだけ開き、右側で結果を確認しながら調整します。</p>
                </div>
                <span class="cb-intro-status">● 計算可能 / 実データ</span>
            </div>

            <div class="cb-mgr cb-build-toolbar">
                <label class="cb-lbl">ビルド名</label>
                <input id="cb-name" type="text" placeholder="例: 花火 速度160">
                <button id="cb-save" class="btn-primary btn-mini">保存 / 上書き</button>
                <button id="cb-new" class="btn-secondary btn-mini">新規</button>
                <button id="cb-dup" class="btn-secondary btn-mini">複製</button>
                <span class="cb-mgr-sep"></span>
                <label class="cb-lbl">保存済み</label>
                <select id="cb-list"></select>
                <button id="cb-load" class="btn-secondary btn-mini">読込</button>
                <button id="cb-delete" class="btn-secondary btn-mini">削除</button>
                <span class="cb-mgr-sep"></span>
                <button id="cb-json-toggle" class="btn-secondary btn-mini">JSON</button>
                <span id="cb-status" class="cb-status"></span>
            </div>
            <div id="cb-json-area" class="cb-json-area" style="display:none">
                <textarea id="cb-json-text" rows="6" placeholder="JSONをここに貼り付け / 書出時はここに表示"></textarea>
                <div class="cb-mgr">
                    <button id="cb-json-export" class="btn-secondary btn-mini">全ビルドを書出</button>
                    <button id="cb-json-export-backup" class="btn-secondary btn-mini" style="display:none">退避データを表示</button>
                    <button id="cb-reset-storage" class="btn-secondary btn-mini" style="display:none">保存データをリセット</button>
                    <button id="cb-json-import" class="btn-primary btn-mini">貼り付けた JSON を取り込む (merge)</button>
                </div>
            </div>

            <div class="cb-workspace">
                <section class="cb-flow-stack" aria-label="ビルド設定">
                    <article class="cb-card cb-flow-card">
                        <span class="cb-section-kicker">01 — BUILD</span>
                        <h2>ビルド設定</h2>
                        <p class="cb-section-help">上から順に決めれば、保存・比較まで迷わず進められます。</p>

                        <details class="cb-flow-step" open>
                            <summary>キャラクター・光円錐 <span id="cb-flow-char-meta" class="cb-summary-meta">基本設定</span></summary>
                            <div class="cb-step-body">
                                <div class="cb-field-grid">
                                    <div class="cb-field cb-field-control">
                                        <span class="cb-field-label">キャラクター</span>
                                        <div id="cb-char-meta" class="cb-char-meta"></div>
                                        <select id="cb-char"></select>
                                    </div>
                                    <div class="cb-field cb-field-control">
                                        <span class="cb-field-label">星魂</span>
                                        <select id="cb-eidolon"></select>
                                        <button type="button" id="cb-eidolon-cand-add" class="btn-secondary btn-mini">＋ 星魂を候補登録</button>
                                    </div>
                                    <div class="cb-field cb-field-control">
                                        <span class="cb-field-label">光円錐</span>
                                        <select id="cb-lc"></select>
                                        <select id="cb-lc-si"></select>
                                        <div id="cb-lc-note" class="cb-hint cb-hint-tight"></div>
                                        <div class="cb-actions cb-actions-inline">
                                            <button type="button" id="cb-lc-si-cand-add" class="btn-secondary btn-mini">＋ 重畳を候補登録</button>
                                            <button type="button" id="cb-lc-cand-add" class="btn-secondary btn-mini">＋ 光円錐を候補登録</button>
                                        </div>
                                        <div id="cb-lc-cands" class="cb-lc-cands"></div>
                                    </div>
                                    <div class="cb-field cb-field-control">
                                        <span class="cb-field-label">軌跡レベル</span>
                                        <button class="btn-secondary btn-mini" id="cb-trace-cand-add">＋ 軌跡を候補登録</button>
                                        <div id="cb-level-grid" class="cb-level-grid"></div>
                                        <span class="cb-field-label cb-field-label-sub">常時加算</span>
                                        <div id="cb-trace-bonus" class="cb-trace-bonus"></div>
                                    </div>
                                </div>
                            </div>
                        </details>

                        <details class="cb-flow-step" open>
                            <summary>遺物・サブステータス <span id="cb-flow-relic-meta" class="cb-summary-meta">6部位 / SPD —</span></summary>
                            <div class="cb-step-body">
                                <div class="cb-mode-tabs" id="cb-mode-tabs">
                                    ${SUBS_MODES.map(m => `
                                        <button type="button" class="cb-mode-tab" data-cb-mode="${m.mode}">
                                            ${m.label}${m.badge ? `<span class="cb-badge">${m.badge}</span>` : ''}
                                        </button>
                                    `).join('')}
                                    <span class="cb-spacer"></span>
                                    <button id="cb-clear-relics" class="btn-secondary btn-mini">全部外す</button>
                                </div>
                                <div id="cb-slots" class="cb-slots"></div>
                                <div id="cb-subs-input" class="cb-subs-input"></div>
                                <button type="button" id="cb-subs-cand-add" class="btn-secondary btn-mini">＋ サブステ設定を候補登録</button>
                                <p class="cb-hint cb-hint-tight">
                                    候補の「共通火力 ±%」は今のビルドと入れ替えた時の差分です。条件付きバフは含まない素の数値で比較します。
                                </p>
                            </div>
                        </details>

                        <details class="cb-flow-step" id="candidate-section" open>
                            <summary>差分候補 <span id="cb-flow-candidate-meta" class="cb-summary-meta">候補を登録できます</span></summary>
                            <div class="cb-step-body">
                                <p class="cb-section-help">候補を選ぶと、このビルドへ反映した状態を右側の結果に即時反映します。</p>
                                <div id="cb-candidates" class="cb-candidate-list"></div>
                            </div>
                        </details>

                        <details class="cb-flow-step">
                            <summary>パーティ・敵条件 <span class="cb-summary-meta">限界効用逓減で設定</span></summary>
                            <div class="cb-step-body">
                                <p class="cb-section-help cb-flow-note">パーティバフ、敵レベル、会心モードは限界効用逓減タブで設定します。ここではビルドの素の数値を素早く調整します。</p>
                            </div>
                        </details>

                        <details class="cb-flow-step">
                            <summary>詳細設定・計算根拠 <span class="cb-summary-meta">必要なときだけ開く</span></summary>
                            <div class="cb-step-body">
                                <p class="cb-section-help cb-flow-note">計算式・条件付きバフのON/OFF・攻撃別の比較は、限界効用逓減タブと戦闘シミュタブで確認できます。</p>
                            </div>
                        </details>
                    </article>
                </section>

                <aside class="cb-result-wrap" id="cb-result-panel" aria-label="現在のビルド結果">
                    <article class="cb-card cb-result-card">
                        <div class="cb-result-header">
                            <div><span class="cb-section-kicker">02 — RESULT</span><h2>現在のビルド結果</h2></div>
                            <span class="cb-result-state" id="cb-result-state">● 即時反映</span>
                        </div>
                        <p class="cb-result-target">対象: <strong id="cb-result-target">現在のビルド</strong> 条件: <strong>バフなし / 保存時との差分</strong></p>
                        <div id="cb-stats"></div>
                        <label class="cb-check-inline">
                            <input type="checkbox" id="cb-show-zero"> 0 の項目も表示
                        </label>
                        <div class="cb-result-divider"></div>
                        <h3>有効セット効果</h3>
                        <div id="cb-sets"></div>
                    </article>

                    <article class="cb-next-action">
                        <span class="cb-section-kicker">03 — NEXT ACTION</span>
                        <h3>この結果で次にすること</h3>
                        <p>比較対象を決めたら保存し、限界効用逓減または戦闘シミュへ送れます。</p>
                        <div class="cb-row cb-next-ref"><label>参照ステ</label><select id="cb-ref-stat">
                            <option value="auto">キャラ分類に合わせる</option>
                            <option value="atk">攻撃力</option>
                            <option value="hp">HP</option>
                            <option value="def">防御力</option>
                            <option value="spd">速度</option>
                        </select></div>
                        <div class="cb-actions cb-actions-inline">
                            <button id="cb-send-dim" class="btn-primary">保存して比較へ</button>
                            <button id="cb-send-combat" class="btn-secondary">戦闘シミュへ送る</button>
                        </div>
                        <p class="cb-hint cb-hint-tight">参照ステは候補の火力差分表示にだけ使います。</p>
                    </article>

                    <div class="cb-stepper" aria-label="検証の進行状況">
                        <div class="cb-step done">✓ 01<br>ビルド</div>
                        <div class="cb-step active">● 02<br>比較</div>
                        <div class="cb-step">03<br>検証</div>
                    </div>
                </aside>
            </div>
        </div>
    `;
}

// ---- 全体再描画 --------------------------------------------------------

function refreshAll() {
    fillCharacterSelect();
    fillEidolonSelect();
    fillLightconeSelect();
    fillSuperimposeSelect();
    renderCharacterMeta();
    renderLevelGrid();
    renderTraceBonus();
    renderLightconeNote();
    renderLightconeCandidates();
    renderRegisteredCandidates();
    renderModeTabs();
    renderSlots();
    renderSubsInput();
    renderPicker();
    renderRightPanel();
    const refSelect = document.getElementById('cb-ref-stat');
    if (refSelect) refSelect.value = state.refStat;
    refreshBuildList();
    const nameInput = document.getElementById('cb-name');
    if (nameInput) nameInput.value = state.build.name || '';
    renderFlowSummary();
    notifyContextBar();
}

// 装備・入力が変わった時の軽量な再描画 (select の作り直しはしない)
function refreshAfterEdit() {
    renderSlots();
    renderSubsInput();
    renderPicker();
    renderRightPanel();
    renderLightconeCandidates();
    renderRegisteredCandidates();
    renderFlowSummary();
    notifyContextBar();
}

function renderFlowSummary() {
    if (!state.build) return;
    const character = Registry.character.get(state.build.characterId);
    const lightcone = state.build.lightcone?.id ? Registry.lightcone.get(state.build.lightcone.id) : null;
    const stats = computeStats();
    const equippedCount = ALL_SLOTS.filter(slot => (
        state.build.relicIds?.[slot] || state.build.relics?.[slot]?.setId
    )).length;
    const candidates = getBuildCandidates(state.build);

    const charMeta = document.getElementById('cb-flow-char-meta');
    if (charMeta) {
        const lcText = lightcone ? `${lightcone.name || state.build.lightcone.id} S${state.build.lightcone.superimpose || 1}` : '光円錐なし';
        charMeta.textContent = `${character?.name || state.build.characterId} / ${lcText}`;
    }
    const relicMeta = document.getElementById('cb-flow-relic-meta');
    if (relicMeta) relicMeta.textContent = `${equippedCount}/6部位 / SPD ${stats ? formatByKind(stats.derived.spd, 'num1') : '—'}`;
    const candidateMeta = document.getElementById('cb-flow-candidate-meta');
    if (candidateMeta) {
        candidateMeta.textContent = state.activeCandidateId
            ? `${candidates.length}件 / 1件を選択中`
            : candidates.length ? `${candidates.length}件を登録済み` : '候補を登録できます';
    }
}

function notifyContextBar() {
    if (!state.build) return;
    const character = Registry.character.get(state.build.characterId);
    const resultState = document.getElementById('cb-result-state');
    if (resultState) {
        resultState.textContent = state.activeCandidateId
            ? '● 候補を比較中'
            : state.baseline ? '● 基準値' : '● 即時反映';
    }
    const resultTarget = document.getElementById('cb-result-target');
    if (resultTarget) resultTarget.textContent = `${character?.name || state.build.characterId} / ${state.build.name || '新規ビルド'}`;
    window.dispatchEvent(new CustomEvent('srsim:context-update', {
        detail: {
            character: character?.name || state.build.characterId || '未選択',
            build: state.build.name?.trim() || (state.savedId ? '保存ビルドを編集中' : '新規ビルド'),
            status: state.savedId ? '保存済み / 編集中' : '未保存の変更',
            baseline: state.baseline ? '保存時' : '比較基準なし',
        },
    }));
}

// ---- キャラ / 光円錐 ---------------------------------------------------

function fillCharacterSelect() {
    const select = document.getElementById('cb-char');
    if (!select) return;
    const visibleOptions = Registry.character.list()
        .filter(ch => ch.id !== 'template' && !ch.isTestAllEquipment)
        .map(ch => `<option value="${ch.id}">${escapeHtml(ch.name || ch.id)}</option>`)
        .join('');
    // testAll は通常選択には出さないが、自動検証がDOMから明示指定できるよう
    // hidden option としてだけ残す。通常の利用者には表示されない。
    const internalOptions = Registry.character.list()
        .filter(ch => ch.isTestAllEquipment)
        .map(ch => `<option value="${ch.id}" hidden>${escapeHtml(ch.name || ch.id)} (内部テスト)</option>`)
        .join('');
    select.innerHTML = visibleOptions + internalOptions;
    select.value = state.build.characterId;
    enhanceSelect(select, {
        kind: 'character',
        placeholder: 'キャラ名で検索',
        noResultsText: '該当キャラなし',
        recentKey: 'srsim.recent.characters',
        getOptionMeta(option) {
            const ch = Registry.character.get(option.value);
            return {
                label: option.textContent?.trim() || option.value,
                subLabel: ch?.englishName || ch?.id,
                searchText: [ch?.name, ch?.englishName, ch?.id].filter(Boolean).join(' '),
                chips: ch ? [
                    { label: ELEMENT_LABELS[ch.element] || ch.element, tone: `element-${ch.element}` },
                    { label: PATH_LABELS[ch.path] || ch.path, tone: 'path' },
                ] : [],
            };
        },
    });
}

function fillEidolonSelect() {
    const select = document.getElementById('cb-eidolon');
    if (!select) return;
    select.innerHTML = Array.from({ length: 7 }, (_, i) => `<option value="${i}">${i === 0 ? '無凸 (E0)' : `E${i}`}</option>`).join('');
    select.value = String(state.build.eidolon || 0);
}

function fillLightconeSelect() {
    const select = document.getElementById('cb-lc');
    if (!select) return;
    const options = Registry.lightcone.list()
        .map(lc => `<option value="${escapeHtml(lc.id)}">${escapeHtml(lc.name || lc.id)}</option>`)
        .join('');
    select.innerHTML = `<option value="">(装備なし)</option>${options}`;
    select.value = state.build.lightcone?.id || '';
    enhanceSelect(select, {
        kind: 'lightcone',
        placeholder: '光円錐名 / 英名で検索',
        noResultsText: '該当光円錐なし',
        recentKey: 'srsim.recent.lightcones',
        getOptionMeta(option) {
            const lc = Registry.lightcone.get(option.value);
            return {
                label: option.textContent?.trim() || option.value,
                subLabel: lc?.id,
                searchText: [lc?.name, lc?.id].filter(Boolean).join(' '),
                chips: lc?.path ? [{ label: PATH_LABELS[lc.path] || lc.path, tone: 'path' }] : [],
            };
        },
    });
}

function fillSuperimposeSelect() {
    const select = document.getElementById('cb-lc-si');
    if (!select) return;
    select.innerHTML = [1, 2, 3, 4, 5].map(n => `<option value="${n}">S${n}</option>`).join('');
    select.value = String(state.build.lightcone?.superimpose || 1);
    select.disabled = !state.build.lightcone?.id;
}

function renderCharacterMeta() {
    const wrap = document.getElementById('cb-char-meta');
    if (!wrap) return;
    const ch = Registry.character.get(state.build.characterId);
    if (!ch) {
        wrap.innerHTML = '';
        return;
    }
    wrap.innerHTML = `
        <b>${escapeHtml(ch.name || ch.id)}</b>
        <span class="cb-chip cb-chip-el">${escapeHtml(ELEMENT_LABELS[ch.element] || ch.element || '?')}</span>
        <span class="cb-chip">${escapeHtml(PATH_LABELS[ch.path] || ch.path || '?')}</span>
        <span class="cb-chip">★${ch.rarity || '?'}</span>
        <span class="cb-chip">基礎速度 ${ch.base?.spd ?? '?'}</span>
    `;
    wrap.insertAdjacentHTML('beforeend', `<span class="cb-chip">${escapeHtml(DAMAGE_SCALE_LABELS[ch.damageScale] || 'ATKスケール')}</span>`);
}

function renderLevelGrid() {
    const wrap = document.getElementById('cb-level-grid');
    if (!wrap) return;
    const ch = Registry.character.get(state.build.characterId);
    const keys = LEVEL_SKILL_KEYS.filter(key => ch?.skills?.[key]);
    if (keys.length === 0) {
        wrap.innerHTML = '<p class="cb-hint cb-hint-tight">レベル指定できるスキルがありません。</p>';
        return;
    }
    wrap.innerHTML = keys.map(key => {
        const max = getTraceLevelCap(key);
        const value = clampLevel(state.build.traceLevel?.[key] ?? getTraceLevelDefault(key), max);
        return `
            <label class="cb-level-cell" title="上限 Lv${max}">
                <span>${SKILL_LABELS[key] || key}</span>
                <input type="number" min="1" max="${max}" value="${value}" data-cb-level="${key}">
            </label>
        `;
    }).join('');

    wrap.querySelectorAll('input[data-cb-level]').forEach(input => {
        input.addEventListener('input', () => {
            const key = input.dataset.cbLevel;
            const max = Number(input.max) || 1;
            const next = clampLevel(Number(input.value) || 1, max);
            if (String(next) !== input.value) input.value = String(next);
            state.build.traceLevel = { ...(state.build.traceLevel || {}), [key]: next };
            refreshAfterEdit();
        });
    });
}

function renderTraceBonus() {
    const wrap = document.getElementById('cb-trace-bonus');
    if (!wrap) return;
    const ch = Registry.character.get(state.build.characterId);
    // 登録時に traceBonuses は traces.breakdown ({ node, stat, value }) へ正規化される。
    const bonuses = ch?.traces?.breakdown || [];
    wrap.innerHTML = bonuses.length === 0
        ? '<span class="cb-muted">登録なし</span>'
        : bonuses.map(b => `${escapeHtml(b.node || statShortLabel(b.stat))} +${formatStatValue(b.stat, b.value)}`).join(' ／ ');
}

function renderLightconeNote() {
    const wrap = document.getElementById('cb-lc-note');
    if (!wrap) return;
    const lc = Registry.lightcone.get(state.build.lightcone?.id);
    if (!lc) {
        wrap.textContent = '光円錐は未装備です。';
        return;
    }
    const si = state.build.lightcone.superimpose || 1;
    const base = lc.base || {};
    wrap.innerHTML = `
        基礎 HP ${Math.round(base.hp || 0)} / 攻撃 ${Math.round(base.atk || 0)} / 防御 ${Math.round(base.def || 0)}
        <br>常時ステは自動加算。条件付き効果 (現在 S${si}) は限界効用逓減タブで ON/OFF します。
    `;
}

// ---- 差し替え候補チップ (星魂 / 重畳) -----------------------------------
//
// 選択肢が少なく列挙のコストが低い項目は、常時全候補を計算して表示する。

/* function renderEidolonCandidates() {
    const wrap = document.getElementById('cb-eidolon-cands');
    if (!wrap) return;
    const current = state.build.eidolon || 0;
    const candidates = [0, 1, 2, 3, 4, 5, 6].map(eidolon => ({ id: String(eidolon), eidolon }));
    // 星魂は能力改変・追加・行動変化を含むため、火力差分欄を表示しない。
    // 選択肢としての表示・適用は維持する。
    const ranked = candidates.map(c => ({ ...c, contribution: null, hideDelta: true }));

    wrap.innerHTML = renderCandidateChips(ranked.map(c => ({
        id: c.id,
        label: `E${c.eidolon}`,
        contribution: c.contribution,
        hideDelta: c.hideDelta,
        current: c.eidolon === current,
    })));
    bindCandidateChips(wrap, {
        onSelect: id => {
            state.build.eidolon = Number(id) || 0;
            fillEidolonSelect();
            renderLevelGrid();
            refreshAfterEdit();
            setStatus(`星魂 E${state.build.eidolon} を反映しました。`);
        },
    });
}

function renderSuperimposeCandidates() {
    const wrap = document.getElementById('cb-lc-si-cands');
    if (!wrap) return;
    if (!state.build.lightcone?.id) {
        wrap.innerHTML = '';
        return;
    }
    const current = state.build.lightcone.superimpose || 1;
    const baseStats = computeStats();
    const candidates = [1, 2, 3, 4, 5].map(si => ({ id: String(si), si }));
    const ranked = baseStats
        ? Diminishing.rankCandidates(baseStats, candidates, ({ si }) => {
            const next = clone(state.build);
            next.lightcone = { ...next.lightcone, superimpose: si };
            return StatComputer.compute(materialize(next));
        }, damageOptions())
        : candidates.map(c => ({ ...c, contribution: null }));

    wrap.innerHTML = renderCandidateChips(ranked.map(c => ({
        id: c.id,
        label: `S${c.si}`,
        contribution: c.contribution,
        current: c.si === current,
    })));
    bindCandidateChips(wrap, {
        onSelect: id => {
            state.build.lightcone = { ...state.build.lightcone, superimpose: Number(id) || 1 };
            fillSuperimposeSelect();
            refreshAfterEdit();
            setStatus(`重畳 S${state.build.lightcone.superimpose} を反映しました。`);
        },
    });
}

// ---- 登録済み候補 -------------------------------------------------------

*/

function addCandidate(raw) {
    try {
        const beforeIds = new Set(getBuildCandidates(state.build).map(candidate => candidate.id));
        const candidate = addBuildCandidate(state.build, raw);
        setStatus(beforeIds.has(candidate.id)
            ? `差分候補「${candidateLabel(candidate)}」は既に登録されています。`
            : `差分候補「${candidateLabel(candidate)}」を登録しました。`);
        renderRegisteredCandidates();
        renderLightconeCandidates();
    } catch (error) {
        setStatus(`差分候補を登録できませんでした: ${error.message}`, true);
    }
}

function addCurrentRelicMainCandidate(slot) {
    const relic = state.build.relics[slot];
    const main = getMainStatDef(slot, relic.mainStat);
    addCandidate({
        type: 'relicMain',
        label: `${SLOT_LABELS[slot]} / ${main?.label || relic.mainStat}`,
        changes: { build: { relics: { [slot]: { mainStat: relic.mainStat } } } },
    });
}

function addCurrentRelicCandidate(slot) {
    const relic = state.build.relics[slot];
    const set = setOf(slot);
    const relicId = state.build.relicIds?.[slot] || null;
    addCandidate({
        type: 'relic',
        label: `${SLOT_LABELS[slot]} / ${set?.name || 'セットなし'} / ${relic.mainStat || 'メインなし'}`,
        changes: {
            build: {
                relics: { [slot]: clone(relic) },
                relicIds: { [slot]: relicId },
            },
        },
    });
}

function renderRegisteredCandidateList(wrap, candidates) {
    if (!wrap) return;
    if (candidates.length === 0) {
        wrap.innerHTML = '<span class="cb-muted cand-chip-empty">登録なし</span>';
        return;
    }
    const baseStats = computeStats();
    const ranked = baseStats
        ? Diminishing.rankCandidates(baseStats, candidates, candidate =>
            StatComputer.compute(materialize(applyBuildCandidate(state.build, candidate))), damageOptions())
        : candidates.map(candidate => ({ ...candidate, contribution: null }));
    const groups = new Map();
    for (const candidate of ranked) {
        const key = candidateGroupKey(candidate);
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(candidate);
    }
    const groupOrder = ['eidolon', 'traceLevel', 'superimpose', 'substats',
        'lightcone', ...Object.keys(SLOT_LABELS).map(slot => `relic:${slot}`), 'type:custom'];
    const orderedGroups = [...groups.entries()].sort(([a], [b]) => {
        const ai = groupOrder.indexOf(a);
        const bi = groupOrder.indexOf(b);
        return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi) || a.localeCompare(b);
    });
    wrap.innerHTML = orderedGroups.map(([key, group]) => `
        <section class="cb-candidate-group" data-cb-candidate-group="${escapeHtml(key)}">
            <div class="cb-candidate-group-head">
                <b>${escapeHtml(candidateGroupLabel(key))}</b>
                <span class="cb-muted">${group.length}件</span>
            </div>
            ${renderCandidateChips(group.map(candidate => ({
                id: candidate.id,
                label: candidateLabel(candidate),
                contribution: candidate.contribution,
                hideDelta: candidate.excludedReason === 'eidolon' || isEidolonCandidate(candidate),
                current: candidate.id === state.activeCandidateId,
                removable: true,
            })))}
        </section>
    `).join('');
    bindCandidateChips(wrap, {
        onSelect: id => {
            const candidate = getBuildCandidates(state.build).find(item => item.id === id);
            if (!candidate) return;
            state.build = applyBuildCandidate(state.build, candidate);
            state.activeCandidateId = candidate.id;
            refreshAll();
            setStatus(`差し替え「${candidateLabel(candidate)}」を反映しました。`);
        },
        onRemove: id => {
            const candidate = getBuildCandidates(state.build).find(item => item.id === id);
            removeBuildCandidate(state.build, id);
            if (state.activeCandidateId === id) state.activeCandidateId = null;
            renderRegisteredCandidates();
            renderLightconeCandidates();
            setStatus(`差し替え「${candidateLabel(candidate)}」を削除しました。`);
        },
    });
}

function renderRegisteredCandidates() {
    const wrap = document.getElementById('cb-candidates');
    if (!wrap) return;
    const candidates = getBuildCandidates(state.build).filter(candidate => (
        candidate.type !== 'lightcone' && candidate.type !== 'superimpose'
    ));
    renderRegisteredCandidateList(wrap, candidates);
}

// 光円錐は候補が膨大 (自由度が高い) なので全列挙せず、ユーザーが登録した候補だけを比較する。
function renderLightconeCandidates() {
    const wrap = document.getElementById('cb-lc-cands');
    if (!wrap) return;
    const list = getBuildCandidates(state.build).filter(candidate => (
        candidate.type === 'lightcone' || candidate.type === 'superimpose'
    ));
    if (list.length === 0) {
        wrap.innerHTML = '<span class="cb-muted cand-chip-empty">候補は未登録です。光円錐または重畳を選んで候補登録できます。</span>';
        return;
    }
    renderRegisteredCandidateList(wrap, list);
}

function candidateGroupLabel(key) {
    if (key === 'eidolon') return '星魂';
    if (key === 'traceLevel') return '軌跡レベル';
    if (key === 'lightcone') return '光円錐';
    if (key === 'superimpose') return '重畳';
    if (key === 'substats') return 'サブステ';
    if (key.startsWith('relic:')) {
        const slots = key.slice('relic:'.length).split(',');
        return slots.map(slot => SLOT_LABELS[slot] || slot).join(' / ');
    }
    return key.replace(/^type:/, 'その他');
}

// ---- 遺物モードタブ / 部位カード ---------------------------------------

function renderModeTabs() {
    const mode = state.build.subsInput?.mode || 'relics';
    document.querySelectorAll('[data-cb-mode]').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-cb-mode') === mode);
    });
}

function relicKindOf(slot) {
    const id = state.build.relicIds?.[slot];
    if (!id) return null;
    return RelicStore.get(id)?.kind || null;
}

function setOf(slot) {
    const setId = state.build.relics[slot].setId;
    return SLOT_TO_SET_TYPE[slot] === SET_TYPE.PLANAR
        ? Registry.ornament.get(setId)
        : Registry.relicSet.get(setId);
}

function renderSlots() {
    const wrap = document.getElementById('cb-slots');
    if (!wrap) return;
    const subsIgnored = (state.build.subsInput?.mode || 'relics') !== 'relics';

    wrap.innerHTML = ALL_SLOTS.map(slot => {
        const relic = state.build.relics[slot];
        const set = setOf(slot);
        const mainDef = getMainStatDef(slot, relic.mainStat);
        const kind = relicKindOf(slot);
        const subEntries = Object.entries(relic.subs || {}).filter(([, v]) => v);
        const mainOptions = Object.entries(RELIC_MAIN_OPTIONS[slot])
            .map(([id, def]) => `<option value="${id}" ${id === relic.mainStat ? 'selected' : ''}>${escapeHtml(def.label)}</option>`)
            .join('');
        const isEmpty = !relic.setId && subEntries.length === 0 && !kind;

        return `
            <div class="cb-slot${state.pickerSlot === slot ? ' is-picking' : ''}${isEmpty ? ' is-empty' : ''}">
                <div class="cb-slot-top">
                    <span>${SLOT_LABELS[slot]}</span>
                    ${kind === 'owned' ? '<span class="cb-tag cb-tag-owned">手持ち</span>' : ''}
                    ${kind === 'virtual' ? '<span class="cb-tag cb-tag-virtual">仮想</span>' : ''}
                    ${!kind && !isEmpty ? '<span class="cb-tag cb-tag-manual">手入力</span>' : ''}
                </div>
                <div class="cb-slot-set">${escapeHtml(set?.name || '(セットなし)')}</div>
                <div class="cb-slot-main">
                    <select data-cb-main="${slot}" ${Object.keys(RELIC_MAIN_OPTIONS[slot]).length < 2 ? 'disabled' : ''}>${mainOptions}</select>
                    <span class="cb-slot-main-value">${mainDef ? formatStatValue(mainDef.stat, mainDef.max) : '—'}</span>
                    ${Object.keys(RELIC_MAIN_OPTIONS[slot]).length >= 2
                        ? `<button type="button" class="btn-secondary btn-mini" data-cb-main-cand-toggle="${slot}">${state.mainStatCandsOpen[slot] ? '候補を閉じる' : '候補を見る'}</button>`
                        : ''}
                </div>
                <div class="cb-slot-main-cands" data-cb-main-cand-wrap="${slot}"></div>
                <div class="cb-slot-subs ${subsIgnored ? 'is-muted' : ''}">
                    ${subEntries.length === 0
                        ? '<span class="cb-muted">サブステなし</span>'
                        : subEntries.map(([stat, value]) => `
                            <span><i>${escapeHtml(statShortLabel(stat))}</i>${formatStatValue(stat, value)}</span>
                        `).join('')}
                </div>
                <div class="cb-slot-acts">
                    <span class="cb-slot-action-anchor">
                        <button class="btn-secondary btn-mini" data-cb-pick="${slot}">倉庫から選ぶ</button>
                        <div class="cb-picker cb-slot-popover" data-cb-picker-slot="${slot}" data-cb-picker-action="pick" hidden></div>
                    </span>
                    <span class="cb-slot-action-anchor">
                        <button class="btn-secondary btn-mini" data-cb-edit="${slot}">数値を編集</button>
                        <div class="cb-picker cb-slot-popover" data-cb-picker-slot="${slot}" data-cb-picker-action="edit" hidden></div>
                    </span>
                    <button class="btn-secondary btn-mini" data-cb-main-cand-add="${slot}">＋ メインステを候補登録</button>
                    <button class="btn-secondary btn-mini" data-cb-relic-cand-add="${slot}">＋ この遺物を候補登録</button>
                    <button class="btn-secondary btn-mini" data-cb-unequip="${slot}">外す</button>
                </div>
            </div>
        `;
    }).join('');

    wrap.querySelectorAll('select[data-cb-main]').forEach(select => {
        select.addEventListener('change', () => {
            const slot = select.getAttribute('data-cb-main');
            state.build.relics[slot].mainStat = select instanceof HTMLSelectElement ? select.value : null;
            const linked = state.build.relicIds?.[slot] ? RelicStore.get(state.build.relicIds[slot]) : null;
            if (linked && linked.mainStat !== state.build.relics[slot].mainStat) state.build.relicIds[slot] = null;
            refreshAfterEdit();
        });
    });
    wrap.querySelectorAll('[data-cb-pick]').forEach(btn => {
        btn.addEventListener('click', () => openPicker(btn.getAttribute('data-cb-pick')));
    });
    wrap.querySelectorAll('[data-cb-edit]').forEach(btn => {
        btn.addEventListener('click', () => openEditor(btn.getAttribute('data-cb-edit')));
    });
    wrap.querySelectorAll('[data-cb-main-cand-add]').forEach(btn => {
        btn.addEventListener('click', () => addCurrentRelicMainCandidate(btn.getAttribute('data-cb-main-cand-add')));
    });
    wrap.querySelectorAll('[data-cb-relic-cand-add]').forEach(btn => {
        btn.addEventListener('click', () => addCurrentRelicCandidate(btn.getAttribute('data-cb-relic-cand-add')));
    });
    wrap.querySelectorAll('[data-cb-unequip]').forEach(btn => {
        btn.addEventListener('click', () => {
            const slot = btn.getAttribute('data-cb-unequip');
            state.build.relics[slot] = { setId: null, mainStat: DEFAULT_MAIN_BY_SLOT[slot], subs: {} };
            state.build.relicIds[slot] = null;
            refreshAfterEdit();
        });
    });
    wrap.querySelectorAll('[data-cb-main-cand-toggle]').forEach(btn => {
        btn.addEventListener('click', () => {
            const slot = btn.getAttribute('data-cb-main-cand-toggle');
            state.mainStatCandsOpen[slot] = !state.mainStatCandsOpen[slot];
            renderSlots();
        });
    });
    for (const slot of ALL_SLOTS) renderMainStatCandidates(slot);
}

// 遺物メインステの差し替え候補チップ (部位ごとの折りたたみ)。
//   最大6部位 x 最大8択の全計算は毎キー入力で走ると重いため、展開時のみ計算する。
function renderMainStatCandidates(slot) {
    const wrap = document.querySelector(`[data-cb-main-cand-wrap="${slot}"]`);
    if (!wrap) return;
    if (!state.mainStatCandsOpen[slot]) {
        wrap.innerHTML = '';
        return;
    }
    const current = state.build.relics[slot].mainStat;
    const baseStats = computeStats();
    const candidates = Object.keys(RELIC_MAIN_OPTIONS[slot]).map(id => ({ id }));
    const ranked = baseStats
        ? Diminishing.rankCandidates(baseStats, candidates, ({ id }) => {
            const next = clone(state.build);
            next.relics[slot] = { ...next.relics[slot], mainStat: id };
            return StatComputer.compute(materialize(next));
        }, damageOptions())
        : candidates.map(c => ({ ...c, contribution: null }));

    wrap.innerHTML = renderCandidateChips(ranked.map(c => ({
        id: c.id,
        label: RELIC_MAIN_OPTIONS[slot][c.id]?.label || c.id,
        contribution: c.contribution,
        current: c.id === current,
    })));
    bindCandidateChips(wrap, {
        onSelect: id => {
            state.build.relics[slot].mainStat = id;
            const linked = state.build.relicIds?.[slot] ? RelicStore.get(state.build.relicIds[slot]) : null;
            if (linked && linked.mainStat !== state.build.relics[slot].mainStat) state.build.relicIds[slot] = null;
            refreshAfterEdit();
            setStatus(`${SLOT_LABELS[slot]}のメインステ「${RELIC_MAIN_OPTIONS[slot][id]?.label || id}」を反映しました。`);
        },
    });
}

// ---- サブステ入力モード (manual / roll) --------------------------------

function renderSubsInput() {
    const wrap = document.getElementById('cb-subs-input');
    if (!wrap) return;
    const input = state.build.subsInput;
    if (input.mode === 'relics') {
        wrap.innerHTML = '';
        return;
    }

    const isRoll = input.mode === 'roll';
    const totals = subsFromInput(state.build);
    wrap.innerHTML = `
        <p class="cb-warn">
            このモードでは<b>装備中の遺物のサブステは無視</b>され、下の入力値が使われます
            (メインステとセット効果は有効)。
        </p>
        ${isRoll ? `
            <div class="cb-row cb-row-inline">
                <label>ロールの質</label>
                <select id="cb-roll-tier">
                    ${[['low', '低'], ['mid', '中'], ['high', '高']]
                        .map(([v, l]) => `<option value="${v}" ${input.tier === v ? 'selected' : ''}>${l}</option>`).join('')}
                </select>
                <span class="cb-muted">
                    1 ロールあたりの加算値。保存したビルドの数値がぶれないよう固定値のみ扱います
                    (抽選シミュは限界効用逓減タブ)。
                </span>
            </div>
        ` : ''}
        <div class="cb-subs-grid">
            ${MANUAL_SUB_FIELDS.map(field => {
                const value = isRoll
                    ? (Number(input.alloc?.[field.subKey]) || 0)
                    : (Number(input.manual?.[field.stat]) || 0);
                const display = isRoll ? value : (field.asPercent ? trimNumber(value * 100) : trimNumber(value));
                const resultText = isRoll
                    ? (totals[field.stat] ? formatStatValue(field.stat, totals[field.stat]) : '—')
                    : '';
                return `
                    <div class="cb-sub-row">
                        <label>${statLabel(field.stat, field.label)}</label>
                        <input type="number" min="0" step="${isRoll ? '1' : (field.asPercent ? '0.1' : '1')}"
                               value="${display}" data-cb-sub="${isRoll ? field.subKey : field.stat}"
                               data-cb-pct="${!isRoll && field.asPercent ? '1' : '0'}">
                        <span class="cb-sub-unit">${isRoll ? 'ロール' : (field.asPercent ? '%' : '')}</span>
                        <span class="cb-sub-result">${resultText}</span>
                    </div>
                `;
            }).join('')}
        </div>
    `;

    const tierSelect = document.getElementById('cb-roll-tier');
    tierSelect?.addEventListener('change', () => {
        state.build.subsInput.tier = tierSelect instanceof HTMLSelectElement ? tierSelect.value : 'high';
        refreshAfterEdit();
    });
    wrap.querySelectorAll('input[data-cb-sub]').forEach(field => {
        field.addEventListener('input', () => {
            const key = field.getAttribute('data-cb-sub');
            const raw = Math.max(0, Number(field.value) || 0);
            if (isRoll) state.build.subsInput.alloc[key] = Math.round(raw);
            else state.build.subsInput.manual[key] = field.getAttribute('data-cb-pct') === '1' ? raw / 100 : raw;
            renderRightPanel();
            if (isRoll) updateRollResultCells();
        });
    });
}

function updateRollResultCells() {
    const totals = subsFromInput(state.build);
    document.querySelectorAll('#cb-subs-input .cb-sub-row').forEach(row => {
        const input = row.querySelector('input[data-cb-sub]');
        const cell = row.querySelector('.cb-sub-result');
        if (!input || !cell) return;
        const def = SUBSTAT_TABLE[input.getAttribute('data-cb-sub')];
        if (!def) return;
        cell.textContent = totals[def.stat] ? formatStatValue(def.stat, totals[def.stat]) : '—';
    });
}

// ---- 遺物ピッカー ------------------------------------------------------

function openPicker(slot) {
    state.pickerSlot = slot;
    state.pickerAction = 'pick';
    state.editor = null;
    state.pickerFilters = { setId: '', mainStat: '', kind: '' };
    renderSlots();
    renderPicker();
}

function closePicker() {
    state.pickerSlot = null;
    state.pickerAction = null;
    state.editor = null;
    renderSlots();
    renderPicker();
}

// 他ビルドでの使用状況 (制限はしない。参考表示のみ)
function otherBuildsUsing(relicId) {
    return BuildStore.list()
        .filter(build => build.id !== state.savedId)
        .filter(build => Object.values(build.relicIds || {}).includes(relicId))
        .map(build => build.name || '(無名)');
}

function buildWithRelic(slot, relic) {
    const next = clone(state.build);
    next.relics[slot] = {
        setId: relic.setId,
        mainStat: relic.mainStat,
        subs: { ...relic.subs },
    };
    return next;
}

function renderPicker() {
    if (!state.pickerSlot) return;
    const action = state.pickerAction || 'pick';
    const wrap = document.querySelector(`[data-cb-picker-slot="${state.pickerSlot}"][data-cb-picker-action="${action}"]`);
    if (!wrap) return;
    wrap.hidden = false;

    if (state.editor) {
        renderEditor(wrap);
        return;
    }

    const slot = state.pickerSlot;
    const setType = SLOT_TO_SET_TYPE[slot];
    const all = RelicStore.list().filter(relic => relic.slot === slot);
    const filters = state.pickerFilters;
    const candidates = all.filter(relic =>
        (!filters.setId || relic.setId === filters.setId)
        && (!filters.mainStat || relic.mainStat === filters.mainStat)
        && (!filters.kind || relic.kind === filters.kind));

    const options = damageOptions();
    let baseStats = null;
    try {
        baseStats = StatComputer.compute(materialize(state.build));
    } catch (error) {
        console.error('[buildUI] 現ビルドの計算に失敗', error);
    }

    // 候補 1 件ごとに「入れ替えた場合」を丸ごと再計算するため、件数が多すぎる時は
    // 差分計算を止めてフィルタを促す (体感速度を守る)。
    const withDelta = candidates.length <= DELTA_LIMIT;
    let rows;
    if (baseStats && withDelta) {
        rows = Diminishing.rankCandidates(
            baseStats,
            candidates.map(relic => ({ relic })),
            ({ relic }) => StatComputer.compute(materialize(buildWithRelic(slot, relic))),
            options,
        );
        for (const row of rows) {
            if (row.error) console.warn('[buildUI] 候補の差分計算に失敗', row.relic.id, row.error);
        }
    } else {
        rows = candidates.map(relic => ({ relic, contribution: null, spdDelta: null }));
    }

    const equippedId = state.build.relicIds?.[slot] || null;
    const setFilterList = setType === SET_TYPE.PLANAR ? Registry.ornament.list() : Registry.relicSet.list();

    wrap.innerHTML = `
        <div class="cb-picker-head">
            <b>${SLOT_LABELS[slot]} に装備する遺物を選ぶ</b>
            <span class="cb-muted">倉庫 ${RelicStore.list().length} 件 → この部位 ${all.length} 件 / 条件一致 ${candidates.length} 件</span>
            <span class="cb-spacer"></span>
            <button id="cb-picker-new" class="btn-secondary btn-mini">＋ 仮想遺物を作る</button>
            <button id="cb-picker-close" class="btn-secondary btn-mini">閉じる</button>
        </div>
        <div class="cb-picker-filters">
            <label class="cb-lbl">セット</label>
            <select id="cb-pf-set">
                <option value="">すべて</option>
                ${setFilterList.map(set => `<option value="${escapeHtml(set.id)}" ${filters.setId === set.id ? 'selected' : ''}>${escapeHtml(set.name || set.id)}</option>`).join('')}
            </select>
            <label class="cb-lbl">メイン</label>
            <select id="cb-pf-main">
                <option value="">すべて</option>
                ${Object.entries(RELIC_MAIN_OPTIONS[slot]).map(([id, def]) => `<option value="${id}" ${filters.mainStat === id ? 'selected' : ''}>${escapeHtml(def.label)}</option>`).join('')}
            </select>
            <label class="cb-lbl">種類</label>
            <select id="cb-pf-kind">
                <option value="" ${filters.kind === '' ? 'selected' : ''}>すべて</option>
                <option value="owned" ${filters.kind === 'owned' ? 'selected' : ''}>手持ち</option>
                <option value="virtual" ${filters.kind === 'virtual' ? 'selected' : ''}>仮想</option>
            </select>
            <span class="cb-muted">${withDelta
                ? '火力貢献の高い順に並びます。'
                : `候補が ${DELTA_LIMIT} 件を超えるため火力差分は省略中。セット / メインステで絞り込んでください。`}</span>
        </div>
        <div class="cb-cand-list">
            ${rows.length === 0
                ? '<p class="cb-hint cb-hint-tight">この部位の遺物が倉庫にありません。「＋ 仮想遺物を作る」か、遺物タブで登録してください。</p>'
                : rows.map(row => renderCandidate(row, equippedId)).join('')}
        </div>
    `;

    document.getElementById('cb-picker-close')?.addEventListener('click', closePicker);
    document.getElementById('cb-picker-new')?.addEventListener('click', () => openEditor(slot, { blank: true }));
    for (const [id, key] of [['cb-pf-set', 'setId'], ['cb-pf-main', 'mainStat'], ['cb-pf-kind', 'kind']]) {
        const select = document.getElementById(id);
        select?.addEventListener('change', () => {
            state.pickerFilters[key] = select instanceof HTMLSelectElement ? select.value : '';
            renderPicker();
        });
    }
    wrap.querySelectorAll('[data-cb-equip]').forEach(btn => {
        btn.addEventListener('click', () => equipRelic(slot, btn.getAttribute('data-cb-equip')));
    });
}

function renderCandidate({ relic, contribution, spdDelta }, equippedId) {
    const set = SLOT_TO_SET_TYPE[relic.slot] === SET_TYPE.PLANAR
        ? Registry.ornament.get(relic.setId)
        : Registry.relicSet.get(relic.setId);
    const mainDef = getMainStatDef(relic.slot, relic.mainStat);
    const isEquipped = relic.id === equippedId;
    const others = otherBuildsUsing(relic.id);
    const subs = Object.entries(relic.subs || {})
        .map(([stat, value]) => `${escapeHtml(statShortLabel(stat))} <b>${formatStatValue(stat, value)}</b>`)
        .join(' ・ ') || '<span class="cb-muted">サブステなし</span>';

    return `
        <div class="cb-cand${isEquipped ? ' is-equipped' : ''}">
            <div class="cb-cand-set">
                ${escapeHtml(set?.name || relic.setId)}
                <span class="cb-tag ${relic.kind === 'virtual' ? 'cb-tag-virtual' : 'cb-tag-owned'}">${relic.kind === 'virtual' ? '仮想' : '手持ち'}</span>
                ${relic.label ? `<span class="cb-muted">${escapeHtml(relic.label)}</span>` : ''}
                ${others.length ? `<span class="cb-cand-used">${escapeHtml(others.join(' / '))} でも使用中</span>` : ''}
            </div>
            <div class="cb-cand-subs">
                ${mainDef ? `${escapeHtml(mainDef.label)} ${formatStatValue(mainDef.stat, mainDef.max)} ｜ ` : ''}${subs}
            </div>
            <div class="cb-cand-delta">
                ${contribution === null
                    ? '<span class="cb-muted">計算不可</span>'
                    : `<span class="${deltaClass(contribution)}" title="共通ダメージだけを使った目安です。通常攻撃・スキル・必殺技・追撃ごとの違いは含みません。">共通火力 ${formatSigned(contribution * 100, 2)}%</span>`}
                ${spdDelta ? `<br><span class="${deltaClass(spdDelta)}">速度 ${formatSigned(spdDelta, 1)}</span>` : ''}
            </div>
            <div>
                ${isEquipped
                    ? '<button class="btn-secondary btn-mini" disabled>装備中</button>'
                    : `<button class="btn-primary btn-mini" data-cb-equip="${escapeHtml(relic.id)}">装備</button>`}
            </div>
        </div>
    `;
}

function equipRelic(slot, relicId) {
    const relic = RelicStore.get(relicId);
    if (!relic) return;
    state.build.relics[slot] = {
        setId: relic.setId,
        mainStat: relic.mainStat,
        subs: { ...relic.subs },
    };
    state.build.relicIds[slot] = relic.id;
    refreshAfterEdit();
}

// ---- 仮想遺物エディタ --------------------------------------------------

function openEditor(slot, { blank = false } = {}) {
    const relic = state.build.relics[slot];
    const linkedId = state.build.relicIds?.[slot] || null;
    const linked = linkedId ? RelicStore.get(linkedId) : null;
    const entries = Object.entries(blank ? {} : (relic.subs || {})).filter(([, v]) => v).slice(0, 4);
    while (entries.length < 4) entries.push(['', 0]);

    state.pickerSlot = slot;
    state.pickerAction = 'edit';
    state.editor = {
        slot,
        // 実物 (owned) を編集する場合は複製 = 新規仮想遺物として保存する
        sourceId: !blank && linked?.kind === 'virtual' ? linked.id : null,
        copiedFromOwned: !blank && linked?.kind === 'owned',
        setId: relic.setId || '',
        mainStat: blank ? (relic.mainStat || DEFAULT_MAIN_BY_SLOT[slot]) : relic.mainStat,
        label: blank ? '' : (linked?.label || ''),
        subs: entries.map(([stat, value]) => ({ stat, value })),
    };
    renderSlots();
    renderPicker();
}

function renderEditor(wrap) {
    const editor = state.editor;
    const slot = editor.slot;
    const setType = SLOT_TO_SET_TYPE[slot];
    const setList = setType === SET_TYPE.PLANAR ? Registry.ornament.list() : Registry.relicSet.list();
    const mainDef = getMainStatDef(slot, editor.mainStat);
    const excludedStat = mainDef?.stat;

    wrap.innerHTML = `
        <div class="cb-picker-head">
            <b>${SLOT_LABELS[slot]} の遺物を作る / 編集する</b>
            <span class="cb-muted">
                ${editor.sourceId ? '仮想遺物を上書き保存します。' : ''}
                ${editor.copiedFromOwned ? '手持ち遺物は変更せず、仮想遺物として複製します。' : ''}
            </span>
            <span class="cb-spacer"></span>
            <button id="cb-editor-cancel" class="btn-secondary btn-mini">キャンセル</button>
        </div>
        <div class="cb-editor">
            <div class="cb-row"><label>セット</label>
                <select id="cb-ed-set">
                    <option value="">(なし)</option>
                    ${setList.map(set => `<option value="${escapeHtml(set.id)}" ${set.id === editor.setId ? 'selected' : ''}>${escapeHtml(set.name || set.id)}</option>`).join('')}
                </select>
            </div>
            <div class="cb-row"><label>メイン</label>
                <select id="cb-ed-main">
                    ${Object.entries(RELIC_MAIN_OPTIONS[slot]).map(([id, def]) => `<option value="${id}" ${id === editor.mainStat ? 'selected' : ''}>${escapeHtml(def.label)}</option>`).join('')}
                </select>
                <span class="cb-muted">${mainDef ? formatStatValue(mainDef.stat, mainDef.max) : ''} (★5 Lv15)</span>
            </div>
            <div class="cb-row"><label>メモ</label><input id="cb-ed-label" type="text" value="${escapeHtml(editor.label)}" placeholder="例: 速度25 脚部"></div>
            <h4>サブステ (最大 4 種)</h4>
            <div class="cb-editor-subs">
                ${editor.subs.map((sub, index) => {
                    const def = SUBSTAT_TABLE[STAT_TO_SUB_KEY[sub.stat]];
                    const display = def?.asPercent ? trimNumber(sub.value * 100) : trimNumber(sub.value);
                    return `
                        <div class="cb-sub-row">
                            <select data-cb-ed-sub="${index}">
                                <option value="">(なし)</option>
                                ${SUBSTAT_ORDER
                                    .filter(subKey => SUBSTAT_TABLE[subKey].stat !== excludedStat)
                                    .map(subKey => {
                                        const item = SUBSTAT_TABLE[subKey];
                                        return `<option value="${escapeHtml(item.stat)}" ${item.stat === sub.stat ? 'selected' : ''}>${escapeHtml(item.label)}</option>`;
                                    }).join('')}
                            </select>
                            <input type="number" min="0" step="${def?.asPercent ? '0.1' : '1'}" value="${display}" data-cb-ed-val="${index}">
                            <span class="cb-sub-unit">${def?.asPercent ? '%' : ''}</span>
                            <span class="cb-muted">${def ? `1ロール ${def.asPercent ? `${trimNumber(def.high * 100)}%` : trimNumber(def.high)} / 換算 ${(sub.value / def.high).toFixed(1)}` : ''}</span>
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="cb-actions cb-actions-inline">
                <button id="cb-ed-save" class="btn-primary btn-mini">倉庫に保存して装備</button>
                <button id="cb-ed-apply" class="btn-secondary btn-mini">この部位だけに反映 (倉庫に残さない)</button>
            </div>
            <p class="cb-hint cb-hint-tight">
                メインステの値は ★5 Lv15 固定です。同じ性能の遺物が倉庫にある場合は 1 つに統合されます。
            </p>
        </div>
    `;

    document.getElementById('cb-editor-cancel')?.addEventListener('click', () => {
        state.editor = null;
        renderPicker();
    });
    document.getElementById('cb-ed-set')?.addEventListener('change', event => {
        state.editor.setId = event.target.value;
    });
    document.getElementById('cb-ed-main')?.addEventListener('change', event => {
        state.editor.mainStat = event.target.value;
        const nextExcluded = getMainStatDef(slot, state.editor.mainStat)?.stat;
        for (const sub of state.editor.subs) {
            if (sub.stat === nextExcluded) { sub.stat = ''; sub.value = 0; }
        }
        renderPicker();
    });
    document.getElementById('cb-ed-label')?.addEventListener('input', event => {
        state.editor.label = event.target.value;
    });
    wrap.querySelectorAll('[data-cb-ed-sub]').forEach(select => {
        select.addEventListener('change', () => {
            const index = Number(select.getAttribute('data-cb-ed-sub'));
            state.editor.subs[index].stat = select.value;
            renderPicker();
        });
    });
    wrap.querySelectorAll('[data-cb-ed-val]').forEach(input => {
        input.addEventListener('input', () => {
            const index = Number(input.getAttribute('data-cb-ed-val'));
            const sub = state.editor.subs[index];
            const def = SUBSTAT_TABLE[STAT_TO_SUB_KEY[sub.stat]];
            const raw = Math.max(0, Number(input.value) || 0);
            sub.value = def?.asPercent ? raw / 100 : raw;
        });
    });
    document.getElementById('cb-ed-save')?.addEventListener('click', () => saveEditor({ toStore: true }));
    document.getElementById('cb-ed-apply')?.addEventListener('click', () => saveEditor({ toStore: false }));
}

function editorSubsDict() {
    const subs = {};
    for (const sub of state.editor.subs) {
        if (!sub.stat || !sub.value) continue;
        subs[sub.stat] = (subs[sub.stat] || 0) + sub.value;
    }
    return subs;
}

function saveEditor({ toStore }) {
    const editor = state.editor;
    const slot = editor.slot;
    const subs = editorSubsDict();

    if (!toStore) {
        state.build.relics[slot] = { setId: editor.setId || null, mainStat: editor.mainStat, subs };
        state.build.relicIds[slot] = null;
        state.editor = null;
        state.pickerSlot = null;
        state.pickerAction = null;
        refreshAfterEdit();
        setStatus('この部位に反映しました (倉庫には保存していません)。');
        return;
    }

    if (!editor.setId) {
        setStatus('倉庫に保存するにはセットを選んでください。', true);
        return;
    }
    try {
        const result = RelicStore.save({
            id: editor.sourceId || undefined,
            kind: 'virtual',
            slot,
            setId: editor.setId,
            mainStat: editor.mainStat,
            subs,
            label: editor.label,
            source: { type: 'manual', from: 'buildTab' },
        });
        state.editor = null;
        equipRelic(slot, result.relic.id);
        state.pickerSlot = null;
        state.pickerAction = null;
        renderPicker();
        setStatus(result.duplicate
            ? '同じ性能の遺物が既にあったので、そちらを装備しました。'
            : '仮想遺物を倉庫に保存して装備しました。');
    } catch (error) {
        setStatus(String(error.message || error), true);
    }
}

// ---- 右パネル ----------------------------------------------------------

function renderRightPanel() {
    renderStats(computeStats());
    renderSets();
}

function renderStats(stats) {
    const wrap = document.getElementById('cb-stats');
    if (!wrap) return;
    if (!stats) {
        wrap.innerHTML = '<p class="cb-warn">ステータスを計算できませんでした。キャラ・セットの選択を確認してください。</p>';
        return;
    }
    const base = state.baseline;
    const hero = [
        { label: '攻撃力', value: stats.derived.atk, fmt: 'num', prev: base?.derived.atk },
        { label: '速度', value: stats.derived.spd, fmt: 'num1', prev: base?.derived.spd },
        { label: '会心率', value: stats.derived.critRate, fmt: 'pct', prev: base?.derived.critRate },
        { label: '会心ダメ', value: stats.derived.critDmg, fmt: 'pct', prev: base?.derived.critDmg },
    ];

    // HP/DEF 参照のキャラクターでも、主要ステータスを同じ優先度で確認できるようにする。
    hero.unshift({ label: 'HP', value: stats.derived.hp, fmt: 'num', prev: base?.derived.hp });
    hero.splice(2, 0, { label: 'DEF', value: stats.derived.def, fmt: 'num', prev: base?.derived.def });

    wrap.innerHTML = `
        <div class="cb-stat-hero">
            ${hero.map(item => `
                <div class="cb-hero-box">
                    <span>${item.label}</span>
                    <strong>${formatByKind(item.value, item.fmt)}</strong>
                    ${renderDiff(item.value, item.prev, item.fmt)}
                </div>
            `).join('')}
        </div>
        <div class="cb-stat-grid">
        ${STAT_ROWS.map(row => {
            const value = row.get(stats) ?? 0;
            if (!row.core && !state.showZeroStats && !value) return '';
            const prev = base ? (row.get(base) ?? 0) : null;
            return `
                <div class="cb-stat-row">
                    <span class="cb-stat-k">${row.statKey ? statLabel(row.statKey, row.label) : row.label}</span>
                    <span class="cb-stat-v">${formatByKind(value, row.fmt)}${renderDiff(value, prev, row.fmt)}</span>
                </div>
            `;
        }).join('')}
        </div>
    `;
}

function renderDiff(value, prev, fmt) {
    if (prev === null || prev === undefined) return '';
    const diff = (value || 0) - (prev || 0);
    if (Math.abs(diff) < 1e-9) return '';
    const text = fmt === 'pct' ? `${formatSigned(diff * 100, 1)}%` : formatSigned(diff, fmt === 'num' ? 0 : 2);
    return ` <span class="cb-diff ${diff > 0 ? 'is-up' : 'is-down'}">${text}</span>`;
}

function renderSets() {
    const wrap = document.getElementById('cb-sets');
    if (!wrap) return;
    const cavern = countSetsByType(state.build.relics, SET_TYPE.CAVERN);
    const planar = countSetsByType(state.build.relics, SET_TYPE.PLANAR);
    const lines = [];
    const warnings = [];

    for (const [setId, count] of Object.entries(cavern)) {
        const set = Registry.relicSet.get(setId);
        const statusText = count >= 4 ? '2pc + 4pc 有効' : count >= 2 ? '2pc 有効' : '未成立';
        lines.push({ name: set?.name || setId, count: `${count} / 4`, statusText, ok: count >= 2 });
        if (count === 1) warnings.push(`${set?.name || setId} は 1 部位のみのため 2pc 未成立`);
        if (count === 3) warnings.push(`${set?.name || setId} は 3 部位のため 4pc 未成立 (2pc のみ有効)`);
    }
    for (const [setId, count] of Object.entries(planar)) {
        const set = Registry.ornament.get(setId);
        lines.push({ name: set?.name || setId, count: `${count} / 2`, statusText: count >= 2 ? '2pc 有効' : '未成立', ok: count >= 2 });
        if (count === 1) warnings.push(`${set?.name || setId} は 1 部位のみのため 2pc 未成立`);
    }

    const emptySlots = ALL_SLOTS.filter(slot => !state.build.relics[slot].setId);
    if (emptySlots.length) warnings.push(`セット未選択: ${emptySlots.map(slot => SLOT_LABELS[slot]).join(' / ')}`);

    wrap.innerHTML = `
        ${lines.length === 0 ? '<p class="cb-hint cb-hint-tight">セットが選択されていません。</p>' : lines.map(line => `
            <div class="cb-setline">
                <span class="cb-setline-n">${escapeHtml(line.name)}</span>
                <span class="cb-setline-c ${line.ok ? '' : 'is-warn'}">${line.count}</span>
                <span class="cb-muted">${line.statusText}</span>
            </div>
        `).join('')}
        ${warnings.map(text => `<p class="cb-warn cb-warn-tight">${escapeHtml(text)}</p>`).join('')}
    `;
}

// ---- ビルド管理 --------------------------------------------------------

function refreshBuildList() {
    const select = document.getElementById('cb-list');
    if (!select) return;
    const builds = BuildStore.list()
        .slice()
        .sort((a, b) => (b.meta?.updatedAt || '').localeCompare(a.meta?.updatedAt || ''));
    const storageStatus = BuildStore.getStorageStatus?.();
    const backupButton = document.getElementById('cb-json-export-backup');
    const resetButton = document.getElementById('cb-reset-storage');
    if (storageStatus?.corrupted) {
        setStatus('保存データが壊れているため読み取り専用です。退避データを確認してからリセットしてください。', true);
    }
    if (backupButton) backupButton.style.display = storageStatus?.backupAvailable ? '' : 'none';
    if (resetButton) resetButton.style.display = storageStatus?.corrupted ? '' : 'none';
    select.innerHTML = builds.length === 0
        ? '<option value="">(保存ビルドなし)</option>'
        : builds.map(build => {
            const ch = Registry.character.get(build.characterId);
            return `<option value="${build.id}">${escapeHtml(build.name || '(無名)')} — ${escapeHtml(ch?.name || build.characterId)}</option>`;
        }).join('');
    if (state.savedId && builds.some(build => build.id === state.savedId)) select.value = state.savedId;
    enhanceSelect(select, {
        kind: 'build',
        placeholder: 'ビルド名 / キャラ名で検索',
        noResultsText: '該当ビルドなし',
        recentKey: 'srsim.recent.builds',
        getOptionMeta(option) {
            const build = BuildStore.get(option.value);
            const ch = build ? Registry.character.get(build.characterId) : null;
            return {
                label: option.textContent?.trim() || option.value,
                subLabel: ch?.name,
                searchText: [build?.name, ch?.name, ch?.id].filter(Boolean).join(' '),
                chips: ch ? [{ label: ELEMENT_LABELS[ch.element] || ch.element, tone: `element-${ch.element}` }] : [],
            };
        },
    });
}

function saveBuild() {
    const nameInput = document.getElementById('cb-name');
    state.build.name = (nameInput instanceof HTMLInputElement ? nameInput.value : '').trim();
    if (!state.build.name) {
        const ch = Registry.character.get(state.build.characterId);
        state.build.name = `${ch?.name || state.build.characterId} ビルド`;
        if (nameInput instanceof HTMLInputElement) nameInput.value = state.build.name;
    }
    try {
        const saved = BuildStore.save(buildForSave());
        state.build.id = saved.id;
        state.savedId = saved.id;
        state.baseline = computeStats();
        refreshBuildList();
        renderRightPanel();
        notifyBuildsChanged();
        setStatus(`「${saved.name}」を保存しました。`);
        return saved;
    } catch (error) {
        setStatus(String(error.message || error), true);
        return null;
    }
}

function loadBuild(id) {
    const build = BuildStore.get(id);
    if (!build) {
        setStatus('ビルドが見つかりません。', true);
        return;
    }
    state.build = normalizeBuild(clone(build));
    state.savedId = build.id;
    state.activeCandidateId = null;
    state.pickerSlot = null;
    state.pickerAction = null;
    state.editor = null;
    state.baseline = computeStats();
    refreshAll();
    setStatus(`「${build.name || '(無名)'}」を読み込みました。`);
}

function bindStaticEvents() {
    document.getElementById('cb-char')?.addEventListener('change', event => {
        const characterId = event.target.value;
        state.build.characterId = characterId;
        state.refStat = 'auto';
        state.build.traceLevel = presetTraceLevels(Registry.character.get(characterId));
        state.build.lightcone = signatureLightconeForCharacter(characterId) || { id: null, superimpose: 1 };
        refreshAll();
    });
    document.getElementById('cb-eidolon')?.addEventListener('change', event => {
        state.build.eidolon = Number(event.target.value) || 0;
        renderLevelGrid();
        refreshAfterEdit();
    });
    document.getElementById('cb-eidolon-cand-add')?.addEventListener('click', () => {
        addCandidate({
            type: 'eidolon',
            label: `星魂 E${state.build.eidolon || 0}`,
            changes: { build: { eidolon: state.build.eidolon || 0 } },
        });
    });
    document.getElementById('cb-trace-cand-add')?.addEventListener('click', () => {
        addCandidate({
            type: 'traceLevel',
            label: '現在の軌跡レベル',
            changes: { build: { traceLevel: clone(state.build.traceLevel) } },
        });
    });
    document.getElementById('cb-subs-cand-add')?.addEventListener('click', () => {
        addCandidate({
            type: 'substats',
            label: `現在のサブステ設定 (${SUBS_MODES.find(mode => mode.mode === state.build.subsInput?.mode)?.label || '設定'})`,
            changes: { build: { subsInput: clone(state.build.subsInput), relics: clone(state.build.relics) } },
        });
    });
    document.getElementById('cb-lc')?.addEventListener('change', event => {
        const id = event.target.value || null;
        state.build.lightcone = { id, superimpose: state.build.lightcone?.superimpose || 1 };
        fillSuperimposeSelect();
        renderLightconeNote();
        refreshAfterEdit();
    });
    document.getElementById('cb-lc-si')?.addEventListener('change', event => {
        state.build.lightcone = { ...state.build.lightcone, superimpose: Number(event.target.value) || 1 };
        renderLightconeNote();
        refreshAfterEdit();
    });
    document.getElementById('cb-lc-cand-add')?.addEventListener('click', () => {
        const lc = state.build.lightcone;
        if (!lc?.id) {
            setStatus('光円錐が未選択です。', true);
            return;
        }
        const superimpose = lc.superimpose || 1;
        const lightcone = Registry.lightcone.get(lc.id);
        addCandidate({
            type: 'lightcone',
            label: `${lightcone?.name || lc.id} S${superimpose}`,
            changes: { build: { lightcone: { id: lc.id, superimpose } } },
        });
    });
    document.getElementById('cb-lc-si-cand-add')?.addEventListener('click', () => {
        const lc = state.build.lightcone;
        if (!lc?.id) {
            setStatus('光円錐が未選択です。', true);
            return;
        }
        const lightcone = Registry.lightcone.get(lc.id);
        const superimpose = lc.superimpose || 1;
        addCandidate({
            type: 'superimpose',
            label: `${lightcone?.name || lc.id} の重畳 S${superimpose}`,
            changes: { build: { lightcone: { superimpose } } },
        });
    });
    document.querySelectorAll('[data-cb-mode]').forEach(btn => {
        btn.addEventListener('click', () => {
            state.build.subsInput.mode = btn.getAttribute('data-cb-mode');
            renderModeTabs();
            refreshAfterEdit();
        });
    });
    document.getElementById('cb-clear-relics')?.addEventListener('click', () => {
        for (const slot of ALL_SLOTS) {
            state.build.relics[slot] = { setId: null, mainStat: DEFAULT_MAIN_BY_SLOT[slot], subs: {} };
            state.build.relicIds[slot] = null;
        }
        state.pickerSlot = null;
        state.pickerAction = null;
        state.editor = null;
        refreshAfterEdit();
    });

    document.getElementById('cb-ref-stat')?.addEventListener('change', event => {
        state.refStat = event.target.value;
        renderPicker();
    });
    document.getElementById('cb-show-zero')?.addEventListener('change', event => {
        state.showZeroStats = Boolean(event.target.checked);
        renderRightPanel();
    });

    document.getElementById('cb-save')?.addEventListener('click', () => saveBuild());
    document.getElementById('cb-new')?.addEventListener('click', () => {
        state.build = newBuild(state.build.characterId);
        state.savedId = null;
        state.baseline = null;
        state.activeCandidateId = null;
        state.pickerSlot = null;
        state.pickerAction = null;
        state.editor = null;
        refreshAll();
        setStatus('新規ビルドを作りました。');
    });
    document.getElementById('cb-dup')?.addEventListener('click', () => {
        const copy = normalizeBuild(clone(state.build));
        delete copy.id;
        delete copy.meta;
        copy.name = `${state.build.name || '無名'} のコピー`;
        state.build = copy;
        state.savedId = null;
        state.activeCandidateId = null;
        refreshAll();
        setStatus('複製しました。「保存 / 上書き」で確定します。');
    });
    document.getElementById('cb-load')?.addEventListener('click', () => {
        const id = selectValue('cb-list');
        if (id) loadBuild(id);
    });
    document.getElementById('cb-delete')?.addEventListener('click', () => {
        const id = selectValue('cb-list');
        if (!id) return;
        const target = BuildStore.get(id);
        if (!target) return;
        if (!confirm(`「${target.name || '(無名)'}」を削除しますか?`)) return;
        BuildStore.delete(id);
        if (state.savedId === id) state.savedId = null;
        refreshBuildList();
        notifyBuildsChanged();
        setStatus('削除しました。');
    });

    document.getElementById('cb-json-toggle')?.addEventListener('click', () => {
        const area = document.getElementById('cb-json-area');
        if (area) area.style.display = area.style.display === 'none' ? '' : 'none';
    });
    document.getElementById('cb-json-export')?.addEventListener('click', () => {
        const text = document.getElementById('cb-json-text');
        if (text instanceof HTMLElement) text.value = BuildStore.exportJson();
        setStatus('全ビルドを JSON で書き出しました。');
    });
    document.getElementById('cb-json-export-backup')?.addEventListener('click', () => {
        const text = document.getElementById('cb-json-text');
        try {
            if (text instanceof HTMLElement) text.value = BuildStore.exportCorruptBackup();
            setStatus('退避された保存データを表示しました。内容を確認してからリセットしてください。');
        } catch (error) {
            setStatus(String(error.message || error), true);
        }
    });
    document.getElementById('cb-reset-storage')?.addEventListener('click', () => {
        if (!confirm('退避された保存データを含め、保存ビルドをすべてリセットしますか?')) return;
        try {
            BuildStore.clear();
            refreshBuildList();
            notifyBuildsChanged();
            setStatus('保存データをリセットしました。');
        } catch (error) {
            setStatus(String(error.message || error), true);
        }
    });
    document.getElementById('cb-json-import')?.addEventListener('click', () => {
        const text = document.getElementById('cb-json-text');
        try {
            const count = BuildStore.importJson(text.value, 'merge');
            refreshBuildList();
            notifyBuildsChanged();
            setStatus(`取り込みました (保存ビルド ${count} 件)。`);
        } catch (error) {
            setStatus(String(error.message || error), true);
        }
    });

    document.getElementById('cb-send-dim')?.addEventListener('click', () => {
        const saved = saveBuild();
        if (!saved) return;
        document.querySelector('.tab-btn[data-target="tab-diminishing"]')?.click();
        const select = document.getElementById('dim-build-list');
        if (select instanceof HTMLSelectElement) {
            select.value = saved.id;
            document.getElementById('dim-build-load')?.click();
        }
    });
    document.getElementById('cb-send-combat')?.addEventListener('click', () => {
        const saved = saveBuild();
        if (!saved) return;
        document.querySelector('.tab-btn[data-target="tab-combat"]')?.click();
        document.getElementById('build-loader-refresh')?.click();
        const select = document.getElementById('build-loader-select');
        if (select instanceof HTMLSelectElement) {
            select.value = saved.id;
            document.getElementById('build-loader-add')?.click();
        }
    });
}

// 保存ビルド一覧を持つ他タブへ「更新して」と伝える
function notifyBuildsChanged() {
    document.dispatchEvent(new CustomEvent('srsim:builds-changed'));
}

function setStatus(message, isError = false) {
    const el = document.getElementById('cb-status');
    if (!el) return;
    el.textContent = message;
    el.classList.toggle('is-error', isError);
    notifyContextBar();
}

function selectValue(id) {
    const el = document.getElementById(id);
    return el instanceof HTMLSelectElement ? el.value : '';
}

// ---- 表示ヘルパ --------------------------------------------------------

const PERCENT_STATS = new Set([
    STAT.ATK_PERCENT, STAT.HP_PERCENT, STAT.DEF_PERCENT, STAT.SPD_PERCENT,
    STAT.CRIT_RATE, STAT.CRIT_DMG, STAT.EFFECT_HIT_RATE, STAT.EFFECT_RES,
    STAT.BREAK_EFFECT, STAT.ENERGY_REGEN, STAT.HEAL_BONUS,
    STAT.DMG_ALL, STAT.DMG_BASIC, STAT.DMG_SKILL, STAT.DMG_ULT, STAT.DMG_FOLLOWUP,
    STAT.DEF_DOWN, STAT.DEF_IGNORE, STAT.RES_PEN, STAT.DMG_TAKEN,
    STAT.FIXED_DMG, STAT.SEP_MULT,
]);

function isPercentStat(stat) {
    if (PERCENT_STATS.has(stat)) return true;
    const def = SUBSTAT_TABLE[STAT_TO_SUB_KEY[stat]];
    if (def) return def.asPercent;
    // 属性別ダメ枠 (dmgFire 等) や種別別会心枠は全て % 表記
    return /^(dmg|crit|res|def)[A-Z]/.test(stat);
}

function statShortLabel(stat) {
    const def = SUBSTAT_TABLE[STAT_TO_SUB_KEY[stat]];
    if (def) return def.label;
    for (const table of Object.values(RELIC_MAIN_OPTIONS)) {
        for (const item of Object.values(table)) {
            if (item.stat === stat) return item.label;
        }
    }
    return stat;
}

function formatStatValue(stat, value) {
    return isPercentStat(stat) ? `${trimNumber(value * 100)}%` : trimNumber(value);
}

function formatByKind(value, kind) {
    const number = Number(value) || 0;
    switch (kind) {
        case 'pct':  return `${(number * 100).toFixed(1)}%`;
        case 'num1': return number.toFixed(1);
        case 'num2': return number.toFixed(2);
        case 'num3': return number.toFixed(3);
        default:     return Math.round(number).toLocaleString('ja-JP');
    }
}

function formatSigned(value, digits) {
    const sign = value > 0 ? '+' : '';
    return `${sign}${Number(value).toFixed(digits)}`;
}

function deltaClass(value) {
    return value > 0 ? 'is-up' : value < 0 ? 'is-down' : 'cb-muted';
}

function trimNumber(value) {
    const number = Number(value) || 0;
    return String(Math.round(number * 100) / 100);
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
    })[char]);
}
