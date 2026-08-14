// 遺物倉庫 UI: 実物/仮想遺物の作成・検索と、公開プロフィールからの選択取り込み。

import { Registry } from '../build/registry.js';
import { ALL_SLOTS, SLOT_TO_SET_TYPE, SET_TYPE, RELIC_USAGE, RELIC_ATTRIBUTE } from '../build/constants.js';
import { RELIC_MAIN_OPTIONS, getMainStatDef } from '../build/relicMainTable.js';
import { SUBSTAT_ORDER, SUBSTAT_TABLE } from '../build/substatTable.js';
import { STAT, ELEMENT_DMG_KEYS } from '../build/statKeys.js';
import { RelicStore } from '../build/relicStore.js';
import {
    RELIC_ROLL_MAX, RELIC_ROLL_TIERS, RELIC_SUBSTAT_INPUT_MODE,
    relicRollsToStats,
} from '../build/relicSubstatInput.js';
import { enhanceSelect, enhanceMultiSelect, refreshSmartPickers } from './smartPicker.js';

const UID_STORAGE_KEY = 'srsim_mihomo_uid_v1';
const MIHOMO_ENDPOINT = '/api/mihomo';
const SUBSTAT_INPUT_MODE_OPTIONS = Object.freeze([
    { value: RELIC_SUBSTAT_INPUT_MODE.VALUE, label: '表示値を入力' },
    { value: RELIC_SUBSTAT_INPUT_MODE.ROLL, label: '命中数を入力' },
]);
const ROLL_TIER_LABELS = Object.freeze({ low: '低', mid: '中', high: '高' });
const SLOT_LABELS = Object.freeze({
    head: '頭部', hands: '手部', body: '胴体', feet: '脚部', sphere: '次元界オーブ', rope: '連結縄',
});
const API_SLOT_MAP = Object.freeze({
    1: 'head', 2: 'hands', 3: 'body', 4: 'feet', 5: 'sphere', 6: 'rope',
    head: 'head', hands: 'hands', body: 'body', feet: 'feet', sphere: 'sphere', rope: 'rope',
});

// セット picker のフィルタ用ラベル (js/build/constants.js の RELIC_USAGE / RELIC_ATTRIBUTE に対応)
const USAGE_FILTER_OPTIONS = Object.freeze([
    { value: RELIC_USAGE.OFFENSE, label: '火力' },
    { value: RELIC_USAGE.SURVIVAL, label: '耐久' },
    { value: RELIC_USAGE.SUPPORT, label: 'サポート' },
]);
const ATTRIBUTE_FILTER_OPTIONS = Object.freeze([
    { value: RELIC_ATTRIBUTE.PHYSICAL, label: '物理' },
    { value: RELIC_ATTRIBUTE.FIRE, label: '炎' },
    { value: RELIC_ATTRIBUTE.ICE, label: '氷' },
    { value: RELIC_ATTRIBUTE.LIGHTNING, label: '雷' },
    { value: RELIC_ATTRIBUTE.WIND, label: '風' },
    { value: RELIC_ATTRIBUTE.QUANTUM, label: '量子' },
    { value: RELIC_ATTRIBUTE.IMAGINARY, label: '虚数' },
    { value: RELIC_ATTRIBUTE.ATK, label: '攻撃' },
    { value: RELIC_ATTRIBUTE.HP, label: 'HP' },
    { value: RELIC_ATTRIBUTE.CRIT_RATE, label: '会心率' },
    { value: RELIC_ATTRIBUTE.CRIT_DMG, label: '会心ダメ' },
    { value: RELIC_ATTRIBUTE.BREAK_EFFECT, label: '撃破特効' },
    { value: RELIC_ATTRIBUTE.FOLLOWUP, label: '追加攻撃' },
    { value: RELIC_ATTRIBUTE.DMG_ALL, label: '汎用ダメ' },
]);
const USAGE_LABELS = Object.freeze(Object.fromEntries(USAGE_FILTER_OPTIONS.map(o => [o.value, o.label])));
const ATTRIBUTE_LABELS = Object.freeze(Object.fromEntries(ATTRIBUTE_FILTER_OPTIONS.map(o => [o.value, o.label])));
const ELEMENT_ATTRIBUTE_VALUES = new Set([
    RELIC_ATTRIBUTE.PHYSICAL, RELIC_ATTRIBUTE.FIRE, RELIC_ATTRIBUTE.ICE, RELIC_ATTRIBUTE.LIGHTNING,
    RELIC_ATTRIBUTE.WIND, RELIC_ATTRIBUTE.QUANTUM, RELIC_ATTRIBUTE.IMAGINARY,
]);
const RELIC_SET_PICKER_FILTERS = Object.freeze([
    { key: 'usage', label: '用途', options: USAGE_FILTER_OPTIONS },
    { key: 'attribute', label: '属性', options: ATTRIBUTE_FILTER_OPTIONS },
]);

// 公開APIの affix は type (内部ID) が実数/% を一意に決めるので最優先で引く。
// キーは normalizeText() 後の形 (記号を除いた小文字) で持つこと。
const AFFIX_TYPE_MAP = Object.freeze({
    hpdelta: STAT.HP_FLAT, attackdelta: STAT.ATK_FLAT, defencedelta: STAT.DEF_FLAT,
    hpaddedratio: STAT.HP_PERCENT, attackaddedratio: STAT.ATK_PERCENT, defenceaddedratio: STAT.DEF_PERCENT,
    speeddelta: STAT.SPD_FLAT,
    criticalchancebase: STAT.CRIT_RATE, criticaldamagebase: STAT.CRIT_DMG,
    statusprobabilitybase: STAT.EFFECT_HIT_RATE, statusresistancebase: STAT.EFFECT_RES,
    breakdamageaddedratiobase: STAT.BREAK_EFFECT, breakdamageaddedratio: STAT.BREAK_EFFECT,
    spratiobase: STAT.ENERGY_REGEN, healratiobase: STAT.HEAL_BONUS, healratio: STAT.HEAL_BONUS,
    physicaladdedratio: ELEMENT_DMG_KEYS.physical, fireaddedratio: ELEMENT_DMG_KEYS.fire,
    iceaddedratio: ELEMENT_DMG_KEYS.ice, thunderaddedratio: ELEMENT_DMG_KEYS.lightning,
    lightningaddedratio: ELEMENT_DMG_KEYS.lightning, windaddedratio: ELEMENT_DMG_KEYS.wind,
    quantumaddedratio: ELEMENT_DMG_KEYS.quantum, imaginaryaddedratio: ELEMENT_DMG_KEYS.imaginary,
});

// type が無い/未知の場合の予備。field だけで実数か % か一意に決まるものだけを載せる。
const AFFIX_FIELD_MAP = Object.freeze({
    spd: STAT.SPD_FLAT, speed: STAT.SPD_FLAT, speeddelta: STAT.SPD_FLAT,
    critrate: STAT.CRIT_RATE, criticalchance: STAT.CRIT_RATE,
    critdmg: STAT.CRIT_DMG, criticaldamage: STAT.CRIT_DMG,
    breakdamage: STAT.BREAK_EFFECT, breakeffect: STAT.BREAK_EFFECT,
    sprate: STAT.ENERGY_REGEN, energyregen: STAT.ENERGY_REGEN,
    effecthit: STAT.EFFECT_HIT_RATE, effecthitrate: STAT.EFFECT_HIT_RATE,
    effectres: STAT.EFFECT_RES, effectresistance: STAT.EFFECT_RES,
    healrate: STAT.HEAL_BONUS, healbonus: STAT.HEAL_BONUS,
    physicaldmg: ELEMENT_DMG_KEYS.physical, firedmg: ELEMENT_DMG_KEYS.fire,
    icedmg: ELEMENT_DMG_KEYS.ice, lightningdmg: ELEMENT_DMG_KEYS.lightning,
    thunderdmg: ELEMENT_DMG_KEYS.lightning, winddmg: ELEMENT_DMG_KEYS.wind,
    quantumdmg: ELEMENT_DMG_KEYS.quantum, imaginarydmg: ELEMENT_DMG_KEYS.imaginary,
});

// field が "hp" / "atk" / "def" の時だけは実数と % を区別できないため、別途フラグで判定する。
const AFFIX_AMBIGUOUS_FIELD_MAP = Object.freeze({
    hp: { flat: STAT.HP_FLAT, percent: STAT.HP_PERCENT },
    atk: { flat: STAT.ATK_FLAT, percent: STAT.ATK_PERCENT },
    attack: { flat: STAT.ATK_FLAT, percent: STAT.ATK_PERCENT },
    def: { flat: STAT.DEF_FLAT, percent: STAT.DEF_PERCENT },
    defence: { flat: STAT.DEF_FLAT, percent: STAT.DEF_PERCENT },
});

const MAIN_STAT_BY_STAT = Object.freeze({
    [STAT.HP_FLAT]: 'hp_flat', [STAT.HP_PERCENT]: 'hp_percent',
    [STAT.ATK_FLAT]: 'atk_flat', [STAT.ATK_PERCENT]: 'atk_percent',
    [STAT.DEF_PERCENT]: 'def_percent', [STAT.SPD_FLAT]: 'spd_flat',
    [STAT.CRIT_RATE]: 'crit_rate', [STAT.CRIT_DMG]: 'crit_dmg',
    [STAT.BREAK_EFFECT]: 'break_effect', [STAT.ENERGY_REGEN]: 'energy_regen',
    [STAT.EFFECT_HIT_RATE]: 'ehr', [STAT.HEAL_BONUS]: 'heal_bonus',
    [ELEMENT_DMG_KEYS.physical]: 'physical_dmg', [ELEMENT_DMG_KEYS.fire]: 'fire_dmg',
    [ELEMENT_DMG_KEYS.ice]: 'ice_dmg', [ELEMENT_DMG_KEYS.lightning]: 'lightning_dmg',
    [ELEMENT_DMG_KEYS.wind]: 'wind_dmg', [ELEMENT_DMG_KEYS.quantum]: 'quantum_dmg',
    [ELEMENT_DMG_KEYS.imaginary]: 'imaginary_dmg',
});

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
    })[char]);
}

function normalizeText(value) {
    return String(value || '').toLocaleLowerCase('ja').replace(/[\s\u3000・\-_/]/g, '');
}

function setOptions(slot, selected = '') {
    const source = SLOT_TO_SET_TYPE[slot] === SET_TYPE.PLANAR ? Registry.ornament.list() : Registry.relicSet.list();
    return source.map(set => `<option value="${escapeHtml(set.id)}" ${set.id === selected ? 'selected' : ''}>${escapeHtml(set.name)}</option>`).join('');
}

function mainOptions(slot, selected = '') {
    return Object.entries(RELIC_MAIN_OPTIONS[slot] || {}).map(([id, definition]) => (
        `<option value="${escapeHtml(id)}" ${id === selected ? 'selected' : ''}>${escapeHtml(definition.label)}</option>`
    )).join('');
}

// 検索用: 全部位のセット (トンネル+次元界) をまとめた選択肢。
function allSetFilterOptions() {
    return ['<option value="">すべてのセット</option>',
        ...Registry.relicSet.list().map(set => `<option value="${escapeHtml(set.id)}">${escapeHtml(set.name)}</option>`),
        ...Registry.ornament.list().map(set => `<option value="${escapeHtml(set.id)}">${escapeHtml(set.name)}</option>`),
    ].join('');
}

// 検索用: 全部位のメインステ種別 (id は部位間で同じ意味を持つため重複排除するだけでよい)。
function allMainStatFilterOptions() {
    const seen = new Map();
    for (const slot of ALL_SLOTS) {
        for (const [id, definition] of Object.entries(RELIC_MAIN_OPTIONS[slot] || {})) {
            if (!seen.has(id)) seen.set(id, definition.label);
        }
    }
    return ['<option value="">すべてのメイン</option>',
        ...[...seen].map(([id, label]) => `<option value="${escapeHtml(id)}">${escapeHtml(label)}</option>`),
    ].join('');
}

// --- 検索フィルタの相互絞り込み ---
// 「部位」「セット」「メイン」「サブステ」は互いに実現不可能な組み合わせがあるため、
// 一つを選ぶと他の選択肢からあり得ないものを取り除く (例: オーブ選択時はEP回復効率がメインの選択肢に出ない)。

function slotsForSetType(setId) {
    if (!setId) return ALL_SLOTS;
    const type = Registry.ornament.get(setId) ? SET_TYPE.PLANAR : SET_TYPE.CAVERN;
    return ALL_SLOTS.filter(slot => SLOT_TO_SET_TYPE[slot] === type);
}

function slotsForMainStat(mainStatId) {
    if (!mainStatId) return ALL_SLOTS;
    return ALL_SLOTS.filter(slot => mainStatId in (RELIC_MAIN_OPTIONS[slot] || {}));
}

function mainStatIdToStat(mainStatId) {
    for (const slot of ALL_SLOTS) {
        const stat = RELIC_MAIN_OPTIONS[slot]?.[mainStatId]?.stat;
        if (stat) return stat;
    }
    return null;
}

function rebuildSlotFilterOptions(select, allowedSlots) {
    const previous = select.value;
    select.innerHTML = ['<option value="">すべての部位</option>',
        ...allowedSlots.map(slot => `<option value="${escapeHtml(slot)}">${escapeHtml(SLOT_LABELS[slot])}</option>`),
    ].join('');
    select.value = allowedSlots.includes(previous) ? previous : '';
}

function rebuildSetFilterOptions(select, allowedTypes) {
    const previous = select.value;
    const cavern = allowedTypes.has(SET_TYPE.CAVERN) ? Registry.relicSet.list() : [];
    const planar = allowedTypes.has(SET_TYPE.PLANAR) ? Registry.ornament.list() : [];
    const all = [...cavern, ...planar];
    select.innerHTML = ['<option value="">すべてのセット</option>',
        ...all.map(set => `<option value="${escapeHtml(set.id)}">${escapeHtml(set.name)}</option>`),
    ].join('');
    select.value = all.some(set => set.id === previous) ? previous : '';
}

function rebuildMainFilterOptions(select, allowedIds) {
    const previous = select.value;
    const seen = new Map();
    for (const slot of ALL_SLOTS) {
        for (const [id, definition] of Object.entries(RELIC_MAIN_OPTIONS[slot] || {})) {
            if (allowedIds.has(id) && !seen.has(id)) seen.set(id, definition.label);
        }
    }
    select.innerHTML = ['<option value="">すべてのメイン</option>',
        ...[...seen].map(([id, label]) => `<option value="${escapeHtml(id)}">${escapeHtml(label)}</option>`),
    ].join('');
    select.value = seen.has(previous) ? previous : '';
}

function rebuildSubstatFilterOptions(select, excludedStat) {
    const previouslySelected = new Set([...select.selectedOptions].map(option => option.value));
    select.innerHTML = SUBSTAT_ORDER
        .filter(key => SUBSTAT_TABLE[key].stat !== excludedStat)
        .map(key => {
            const item = SUBSTAT_TABLE[key];
            return `<option value="${escapeHtml(item.stat)}" ${previouslySelected.has(item.stat) ? 'selected' : ''}>${escapeHtml(item.label)}</option>`;
        }).join('');
}

function substatOptions(selected = '') {
    return ['<option value="">未設定</option>', ...SUBSTAT_ORDER.map(key => {
        const item = SUBSTAT_TABLE[key];
        return `<option value="${escapeHtml(item.stat)}" ${item.stat === selected ? 'selected' : ''}>${escapeHtml(item.label)}</option>`;
    })].join('');
}

function formatStat(key, value) {
    const definition = Object.values(SUBSTAT_TABLE).find(item => item.stat === key);
    if (!definition) return `${key} +${value}`;
    return `${definition.label} +${definition.asPercent ? `${(value * 100).toFixed(1)}%` : Number(Number(value).toFixed(1))}`;
}

function relicSetPickerConfig() {
    return {
        kind: 'relic-set',
        placeholder: 'セット名 / 英名で検索',
        noResultsText: '該当セットなし',
        recentKey: 'srsim.recent.relicSets',
        filters: RELIC_SET_PICKER_FILTERS,
        getOptionMeta(option) {
            const isPlanar = Boolean(Registry.ornament.get(option.value));
            const set = (isPlanar ? Registry.ornament : Registry.relicSet).get(option.value);
            if (!set) return null;
            const usage = set.tags?.usage || [];
            const attribute = set.tags?.attribute || [];
            return {
                subLabel: set.id,
                searchText: [
                    set.name, set.id, ...(set.aliases || []),
                    ...usage.map(u => USAGE_LABELS[u]), ...attribute.map(a => ATTRIBUTE_LABELS[a]),
                ].join(' '),
                filterValues: { usage, attribute },
                chips: [
                    { label: isPlanar ? '次元界' : 'トンネル', tone: isPlanar ? 'ornament' : 'relic-set' },
                    ...usage.map(u => ({ label: USAGE_LABELS[u] || u, tone: `usage-${u}` })),
                    ...attribute.map(a => ({
                        label: ATTRIBUTE_LABELS[a] || a,
                        tone: ELEMENT_ATTRIBUTE_VALUES.has(a) ? `element-${a}` : `attribute-${a}`,
                    })),
                ],
            };
        },
    };
}

function relicMainPickerConfig() {
    return {
        kind: 'relic-main',
        placeholder: 'メインステータスで検索',
        noResultsText: '該当なし',
        recentKey: 'srsim.recent.relicMain',
    };
}

function relicSlotPickerConfig() {
    return {
        kind: 'relic-slot',
        placeholder: '部位で検索',
        noResultsText: '該当なし',
        // 部位は作成フォームの初期順を維持する。選択履歴で並び替えない。
    };
}

function relicKindFilterPickerConfig() {
    return {
        kind: 'relic-kind-filter',
        placeholder: '種類で検索',
        noResultsText: '該当なし',
    };
}

function relicSlotFilterPickerConfig() {
    return {
        kind: 'relic-slot-filter',
        placeholder: '部位で検索',
        noResultsText: '該当なし',
    };
}

function relicSetFilterPickerConfig() {
    return {
        ...relicSetPickerConfig(),
        kind: 'relic-set-filter',
        placeholder: 'セット名 / 英名で検索',
    };
}

function relicMainFilterPickerConfig() {
    return {
        kind: 'relic-main-filter',
        placeholder: 'メインステータスで検索',
        noResultsText: '該当なし',
    };
}

function relicSubstatFilterPickerConfig() {
    return {
        kind: 'relic-substat-filter',
        placeholder: 'サブステータスで検索',
        noResultsText: '該当なし',
        emptyLabel: '指定なし',
    };
}

function relicName(relic) {
    const set = (SLOT_TO_SET_TYPE[relic.slot] === SET_TYPE.PLANAR ? Registry.ornament : Registry.relicSet).get(relic.setId);
    const main = getMainStatDef(relic.slot, relic.mainStat);
    return `${set?.name || relic.setId} / ${SLOT_LABELS[relic.slot]} / ${main?.label || relic.mainStat}`;
}

function substatInputModeOptions(selected = RELIC_SUBSTAT_INPUT_MODE.VALUE) {
    return SUBSTAT_INPUT_MODE_OPTIONS.map(option => (
        `<option value="${option.value}" ${option.value === selected ? 'selected' : ''}>${option.label}</option>`
    )).join('');
}

function rollTierOptions(selected = 'high') {
    return RELIC_ROLL_TIERS.map(tier => (
        `<option value="${tier}" ${tier === selected ? 'selected' : ''}>${ROLL_TIER_LABELS[tier]}</option>`
    )).join('');
}

function updateRelicSubstatInputMode(container) {
    const mode = container.querySelector('[data-relic-sub-mode]')?.value || RELIC_SUBSTAT_INPUT_MODE.VALUE;
    const rollMode = mode === RELIC_SUBSTAT_INPUT_MODE.ROLL;
    const previousMode = container.dataset.relicSubMode;
    if (previousMode && previousMode !== mode) {
        container.querySelectorAll('.relic-sub-input').forEach(row => {
            const input = row.querySelector('.relic-sub-entry');
            if (!input) return;
            input.dataset[previousMode] = input.value;
            input.value = input.dataset[mode] || '';
        });
    }
    container.querySelectorAll('.relic-sub-entry').forEach(input => {
        input.placeholder = rollMode ? '命中数' : '表示値';
        input.step = rollMode ? '1' : '0.1';
        if (rollMode) input.max = String(RELIC_ROLL_MAX);
        else input.removeAttribute('max');
    });
    container.dataset.relicSubMode = mode;
    const tierField = container.querySelector('.relic-roll-tier-field');
    if (tierField) tierField.hidden = !rollMode;
}

function readRelicSubstats(container, mainStat) {
    const mode = container.querySelector('[data-relic-sub-mode]')?.value || RELIC_SUBSTAT_INPUT_MODE.VALUE;
    const tier = container.querySelector('[data-relic-sub-tier]')?.value || 'high';
    const mainDef = Object.values(SUBSTAT_TABLE).find(item => item.stat === mainStat);
    const subs = {};
    const rolls = {};
    const seen = new Set();
    for (const row of container.querySelectorAll('.relic-sub-input')) {
        const stat = row.querySelector('select').value;
        const rawValue = row.querySelector('.relic-sub-entry')?.value.trim();
        if (!stat && !rawValue) continue;
        if (!stat || !rawValue) throw new Error('サブステータスは種類と数値を両方設定してください。');
        if (seen.has(stat)) throw new Error('同じサブステータスは1枠だけ設定できます。');
        const definition = Object.values(SUBSTAT_TABLE).find(item => item.stat === stat);
        if (!definition) throw new Error('サブステータスの種類を確認してください。');
        if (stat === mainDef?.stat) throw new Error('メインステータスと同じサブステータスは設定できません。');
        if (mode === RELIC_SUBSTAT_INPUT_MODE.ROLL) {
            const count = Number(rawValue);
            if (!Number.isInteger(count) || count < 0 || count > RELIC_ROLL_MAX) {
                throw new Error(`命中数は0〜${RELIC_ROLL_MAX}の整数で設定してください。`);
            }
            if (count > 0) rolls[definition.subKey] = count;
        } else {
            const inputValue = Number(rawValue);
            if (!Number.isFinite(inputValue) || inputValue <= 0) throw new Error('サブステータスの数値は0より大きい数値で設定してください。');
            subs[stat] = definition.asPercent ? inputValue / 100 : inputValue;
        }
        seen.add(stat);
    }
    const subInput = mode === RELIC_SUBSTAT_INPUT_MODE.ROLL
        ? { mode, tier, rolls }
        : null;
    return {
        subs: mode === RELIC_SUBSTAT_INPUT_MODE.ROLL ? relicRollsToStats(subInput) : subs,
        ...(subInput ? { subInput } : {}),
    };
}

function readManualRelic(form) {
    const slot = form.querySelector('#relic-create-slot').value;
    const mainStat = form.querySelector('#relic-create-main').value;
    const substats = readRelicSubstats(form, getMainStatDef(slot, mainStat)?.stat);
    return {
        kind: form.querySelector('input[name="relic-kind"]:checked').value,
        slot, setId: form.querySelector('#relic-create-set').value, mainStat,
        ...substats,
        label: form.querySelector('#relic-create-label').value,
        tags: form.querySelector('#relic-create-tags').value.split(',').map(tag => tag.trim()).filter(Boolean),
        source: { type: 'manual' },
    };
}

function formatSubstatInputValue(stat, value) {
    if (!stat || value === '') return '';
    const definition = Object.values(SUBSTAT_TABLE).find(item => item.stat === stat);
    const displayValue = definition?.asPercent ? Number(value) * 100 : Number(value);
    return Number.isFinite(displayValue) ? Number(displayValue.toFixed(4)) : '';
}

function editableSubstatRows(relic) {
    const mode = relic.subInput?.mode === RELIC_SUBSTAT_INPUT_MODE.ROLL
        ? RELIC_SUBSTAT_INPUT_MODE.ROLL
        : RELIC_SUBSTAT_INPUT_MODE.VALUE;
    const calculatedRollStats = mode === RELIC_SUBSTAT_INPUT_MODE.ROLL
        ? relicRollsToStats(relic.subInput)
        : {};
    const entries = mode === RELIC_SUBSTAT_INPUT_MODE.ROLL
        ? Object.entries(relic.subInput?.rolls || {}).map(([subKey, count]) => [
            SUBSTAT_TABLE[subKey]?.stat,
            relic.subs[SUBSTAT_TABLE[subKey]?.stat] ?? calculatedRollStats[SUBSTAT_TABLE[subKey]?.stat],
            count,
        ]).filter(([stat]) => stat)
        : Object.entries(relic.subs).map(([stat, value]) => [stat, value, '']);
    const rowCount = Math.max(4, entries.length);
    return Array.from({ length: rowCount }, (_, index) => {
        const [stat, value, count] = entries[index] || ['', '', ''];
        const displayValue = mode === RELIC_SUBSTAT_INPUT_MODE.ROLL ? count : formatSubstatInputValue(stat, value);
        const directValue = formatSubstatInputValue(stat, value);
        const rollValue = count ?? '';
        return `<div class="relic-sub-input"><select class="relic-edit-sub-stat">${substatOptions(stat)}</select><input class="relic-sub-entry relic-edit-sub-value" type="number" min="0" step="0.1" placeholder="表示値" value="${escapeHtml(displayValue)}" data-value="${escapeHtml(directValue)}" data-roll="${escapeHtml(rollValue)}"></div>`;
    }).join('');
}

function readEditableRelic(form, existing) {
    const slot = form.querySelector('.relic-edit-slot').value;
    const mainStat = form.querySelector('.relic-edit-main').value;
    const substats = readRelicSubstats(form, getMainStatDef(slot, mainStat)?.stat);
    return {
        id: existing.id,
        kind: form.querySelector('.relic-edit-kind:checked').value,
        slot,
        setId: form.querySelector('.relic-edit-set').value,
        mainStat,
        ...substats,
        label: form.querySelector('.relic-edit-label').value,
        tags: form.querySelector('.relic-edit-tags').value.split(',').map(tag => tag.trim()).filter(Boolean),
        source: existing.source,
    };
}

function editableRelicForm(relic) {
    const mode = relic.subInput?.mode === RELIC_SUBSTAT_INPUT_MODE.ROLL
        ? RELIC_SUBSTAT_INPUT_MODE.ROLL
        : RELIC_SUBSTAT_INPUT_MODE.VALUE;
    const tier = relic.subInput?.tier || 'high';
    const substatRows = editableSubstatRows(relic);
    return `<form class="relic-edit-form" data-id="${escapeHtml(relic.id)}">
        <div class="relic-grid">
            <div class="relic-field"><span class="relic-field-label">種別</span><span class="relic-kind-toggle"><label class="relic-kind-option"><input class="relic-edit-kind" type="radio" name="relic-edit-kind-${escapeHtml(relic.id)}" value="owned" ${relic.kind === 'owned' ? 'checked' : ''}><span>所持</span></label><label class="relic-kind-option"><input class="relic-edit-kind" type="radio" name="relic-edit-kind-${escapeHtml(relic.id)}" value="virtual" ${relic.kind === 'virtual' ? 'checked' : ''}><span>仮想</span></label></span></div>
            <label>部位<select class="relic-edit-slot">${ALL_SLOTS.map(slot => `<option value="${slot}" ${slot === relic.slot ? 'selected' : ''}>${SLOT_LABELS[slot]}</option>`).join('')}</select></label>
            <label>セット<select class="relic-edit-set">${setOptions(relic.slot, relic.setId)}</select></label>
            <label>メインステータス<select class="relic-edit-main">${mainOptions(relic.slot, relic.mainStat)}</select></label>
            <label>固有名・メモ<input class="relic-edit-label" type="text" value="${escapeHtml(relic.label)}"></label>
            <label>ラベル（カンマ区切り）<input class="relic-edit-tags" type="text" value="${escapeHtml(relic.tags.join(', '))}"></label>
        </div>
        <div class="relic-sub-controls"><label>入力方式<select data-relic-sub-mode class="relic-edit-sub-mode">${substatInputModeOptions(mode)}</select></label><label class="relic-roll-tier-field" ${mode === RELIC_SUBSTAT_INPUT_MODE.ROLL ? '' : 'hidden'}>伸び幅<select data-relic-sub-tier class="relic-edit-sub-tier">${rollTierOptions(tier)}</select></label><span>命中数は1回の強化で増えた回数です。</span></div>
        <fieldset class="relic-subs"><legend>サブステータス</legend>${substatRows}</fieldset>
        <div class="relic-actions"><button class="btn-primary" type="submit">変更を保存</button><button class="btn-secondary btn-mini relic-edit-cancel" type="button">キャンセル</button><span class="relic-edit-status" role="status"></span></div>
    </form>`;
}

/** hp/atk/def は field だけでは実数と % を区別できないため、percent フラグ → 表示文字列 → 値域の順で判定する。 */
function isPercentAffix(affix) {
    if (typeof affix?.percent === 'boolean') return affix.percent;
    if (typeof affix?.display === 'string' && affix.display.includes('%')) return true;
    if (typeof affix?.value === 'string' && affix.value.includes('%')) return true;
    const numeric = Number(affix?.value);
    // 実数は最小でも 16 (攻撃力サブステ1ロール)、% は小数表現なので 1 未満に収まる。
    return Number.isFinite(numeric) && numeric > 0 && numeric < 1;
}

function apiStatKey(affix) {
    const byType = AFFIX_TYPE_MAP[normalizeText(affix?.type)];
    if (byType) return byType;
    const field = normalizeText(affix?.field);
    const ambiguous = AFFIX_AMBIGUOUS_FIELD_MAP[field];
    if (ambiguous) return isPercentAffix(affix) ? ambiguous.percent : ambiguous.flat;
    return AFFIX_FIELD_MAP[field] || null;
}

function apiAffixValue(affix, stat) {
    const raw = typeof affix?.value === 'string' ? affix.value.replace('%', '') : affix?.value;
    let value = Number(raw);
    if (!Number.isFinite(value)) return null;
    const percentage = [STAT.HP_PERCENT, STAT.ATK_PERCENT, STAT.DEF_PERCENT, STAT.CRIT_RATE, STAT.CRIT_DMG,
        STAT.BREAK_EFFECT, STAT.ENERGY_REGEN, STAT.EFFECT_HIT_RATE, STAT.EFFECT_RES, STAT.HEAL_BONUS,
        ...Object.values(ELEMENT_DMG_KEYS)].includes(stat);
    if (percentage && value > 1) value /= 100;
    return value > 0 ? value : null;
}

function resolveSetId(slot, name) {
    const source = SLOT_TO_SET_TYPE[slot] === SET_TYPE.PLANAR ? Registry.ornament.list() : Registry.relicSet.list();
    const target = normalizeText(name);
    return source.find(set => [set.id, set.name, ...(set.aliases || [])].some(value => normalizeText(value) === target))?.id || null;
}

function adaptMihomoPayload(payload) {
    const characters = Array.isArray(payload?.characters) ? payload.characters : [];
    return { characters: characters.map((character, characterIndex) => ({
        id: character.id || `character_${characterIndex}`,
        name: character.name || `キャラクター ${characterIndex + 1}`,
        relics: (character.relics || []).map((relic, relicIndex) => {
            // Parsed Data API の遺物部位は character.pos ではなく relic.type (1〜6)。
            const slot = API_SLOT_MAP[relic?.type ?? relic?.pos ?? relic?.position ?? relic?.slot];
            const mainStat = MAIN_STAT_BY_STAT[apiStatKey(relic?.main_affix)];
            const setId = slot ? resolveSetId(slot, relic?.set_name) : null;
            const importIssues = [
                !slot && `部位 type=${relic?.type ?? '(未設定)'} を認識できません`,
                !setId && `セット「${relic?.set_name || '(名称なし)'}」がアプリ内に未登録です`,
                !mainStat && `メイン「${relic?.main_affix?.field || relic?.main_affix?.type || '(名称なし)'}」を認識できません`,
            ].filter(Boolean);
            const subs = Object.fromEntries((relic?.sub_affix || []).map(affix => {
                const stat = apiStatKey(affix);
                return [stat, apiAffixValue(affix, stat)];
            }).filter(([stat, value]) => stat && value));
            return {
                id: `mihomo_${character.id || characterIndex}_${relicIndex}_${relic?.id || 'relic'}`,
                slot, setId, mainStat, subs,
                label: `${character.name || `キャラクター ${characterIndex + 1}`} / ${relic.name || SLOT_LABELS[slot] || '遺物'}`,
                source: {
                    externalId: relic?.id || null, apiSetName: relic?.set_name || null,
                    level: relic?.level ?? null, importIssues,
                },
            };
        }),
    })) };
}

export function initRelicUI() {
    const root = document.getElementById('tab-relics');
    if (!root) return null;
    let candidates = [];
    let editingRelicId = null;

    root.innerHTML = `
        <section class="relic-workspace" aria-label="遺物倉庫">
            <section class="relic-card relic-create-card"><h3>遺物を作成</h3><form id="relic-create-form">
                    <div class="relic-grid">
                        <div class="relic-field"><span class="relic-field-label">種類</span><span class="relic-kind-toggle"><label class="relic-kind-option"><input type="radio" name="relic-kind" value="owned" checked><span>実物</span></label><label class="relic-kind-option"><input type="radio" name="relic-kind" value="virtual"><span>仮想</span></label></span></div>
                        <label>部位<select id="relic-create-slot">${ALL_SLOTS.map(slot => `<option value="${slot}">${SLOT_LABELS[slot]}</option>`).join('')}</select></label>
                        <label>セット<select id="relic-create-set">${setOptions('head')}</select></label>
                        <label>メインステータス<select id="relic-create-main">${mainOptions('head')}</select></label>
                        <label>固有名・メモ<input id="relic-create-label" type="text" placeholder="例: 速度20頭部"></label>
                        <label>ラベル（カンマ区切り）<input id="relic-create-tags" type="text" placeholder="例: アーチャー用,速度型"></label>
                    </div>
                    <div class="relic-sub-controls"><label>入力方式<select id="relic-create-sub-mode" data-relic-sub-mode>${substatInputModeOptions()}</select></label><label class="relic-roll-tier-field" hidden>伸び幅<select id="relic-create-sub-tier" data-relic-sub-tier>${rollTierOptions()}</select></label><span>命中数は1回の強化で増えた回数です。</span></div>
                    <fieldset class="relic-subs"><legend>サブステータス</legend>${Array.from({ length: 4 }, () => `<div class="relic-sub-input"><select class="relic-create-sub-stat">${substatOptions()}</select><input class="relic-sub-entry relic-sub-value" type="number" min="0" step="0.1" placeholder="表示値" data-value="" data-roll=""></div>`).join('')}</fieldset>
                    <div class="relic-actions"><button class="btn-primary" type="submit">遺物を保存</button><button id="relic-create-reset" class="btn-secondary btn-mini" type="button">入力をリセット</button><span id="relic-create-status" role="status"></span></div>
                </form></section>
            <section class="relic-card relic-list-card"><div class="relic-list-heading"><div><h3>検索</h3><p>ラベル・セット名・メイン/サブステータスで絞り込めます。すべての条件は複合(AND)で適用され、選べない組み合わせは選択肢から自動的に外れます。</p></div><div class="relic-search-controls"><input id="relic-search" type="search" placeholder="検索"><select id="relic-filter-kind"><option value="">すべての種類</option><option value="owned">実物</option><option value="virtual">仮想</option></select><select id="relic-filter-slot"><option value="">すべての部位</option>${ALL_SLOTS.map(slot => `<option value="${slot}">${SLOT_LABELS[slot]}</option>`).join('')}</select><select id="relic-filter-set">${allSetFilterOptions()}</select><select id="relic-filter-main">${allMainStatFilterOptions()}</select></div><div class="relic-substat-filter"><span class="relic-substat-filter-label">サブステ絞込<small>(全て該当する遺物のみ表示)</small></span><select id="relic-filter-subs" multiple>${SUBSTAT_ORDER.map(key => { const item = SUBSTAT_TABLE[key]; return `<option value="${escapeHtml(item.stat)}">${escapeHtml(item.label)}</option>`; }).join('')}</select></div></div><div id="relic-results" class="relic-results"></div></section>
            <section class="relic-card relic-api-card"><div><h3>公開データ取得</h3><p>UIDから公開中のキャラクター装備を取得し、必要な遺物だけを保存します。ログインは不要です。</p></div><div class="relic-api-controls"><label>UID<input id="relic-api-uid" inputmode="numeric" autocomplete="off" placeholder="例: 800000000"></label><label class="relic-remember"><input id="relic-api-remember" type="checkbox"> この端末にUIDを記憶</label><button id="relic-api-fetch" class="btn-primary" type="button">公開データを取得</button></div><p id="relic-api-status" role="status" class="relic-api-status"></p><details class="relic-api-log"><summary>取得ログ（全件）</summary><pre id="relic-api-log-output">まだ取得していません。</pre><div class="relic-actions"><button id="relic-api-copy-log" class="btn-secondary btn-mini" type="button">ログをコピー</button><button id="relic-api-download-log" class="btn-secondary btn-mini" type="button">ログを保存</button></div></details><div id="relic-import-preview" class="relic-import-preview" aria-live="polite">UIDを入力して取得すると、遺物を1つずつ選んで保存できます。</div><div class="relic-actions"><button id="relic-import-all" class="btn-secondary" type="button" disabled>有効な候補をすべて選択</button><button id="relic-import-save" class="btn-primary" type="button" disabled>選択した遺物を保存</button></div></section>
        </section>`;

    const get = id => root.querySelector(`#${id}`);
    const resultsEl = get('relic-results');

    function applyEditMainStatExclusion(form) {
        const slot = form.querySelector('.relic-edit-slot').value;
        const mainStat = form.querySelector('.relic-edit-main').value;
        const mainStatKey = getMainStatDef(slot, mainStat)?.stat || null;
        form.querySelectorAll('.relic-edit-sub-stat').forEach(select => {
            for (const option of select.options) {
                if (option.value) option.disabled = Boolean(mainStatKey) && option.value === mainStatKey;
            }
        });
    }

    function closeRelicEditor() {
        resultsEl.querySelector('.relic-edit-form')?.remove();
        resultsEl.querySelector('.relic-edit')?.setAttribute('aria-expanded', 'false');
        editingRelicId = null;
    }

    function openRelicEditor(card, id) {
        if (editingRelicId === id) {
            closeRelicEditor();
            return;
        }
        const relic = RelicStore.get(id);
        if (!relic) return;
        closeRelicEditor();
        editingRelicId = id;
        card.insertAdjacentHTML('beforeend', editableRelicForm(relic));
        card.querySelector('.relic-edit')?.setAttribute('aria-expanded', 'true');
        const form = card.querySelector('.relic-edit-form');
        updateRelicSubstatInputMode(form);
        applyEditMainStatExclusion(form);
    }

    function addEditControls() {
        resultsEl.querySelectorAll('.relic-result').forEach(card => {
            if (card.querySelector('.relic-edit')) return;
            const deleteButton = card.querySelector('.relic-delete');
            if (!deleteButton) return;
            const editButton = document.createElement('button');
            editButton.className = 'btn-secondary btn-mini relic-edit';
            editButton.type = 'button';
            editButton.dataset.id = deleteButton.dataset.id;
            editButton.textContent = '編集';
            editButton.setAttribute('aria-expanded', 'false');
            deleteButton.before(editButton);
        });
    }

    new window.MutationObserver(addEditControls).observe(resultsEl, { childList: true });
    resultsEl.addEventListener('click', event => {
        const editButton = event.target.closest('.relic-edit');
        if (editButton) {
            openRelicEditor(editButton.closest('.relic-result'), editButton.dataset.id);
            return;
        }
        if (event.target.closest('.relic-edit-cancel')) closeRelicEditor();
        if (event.target.closest('.relic-delete')?.dataset.id === editingRelicId) editingRelicId = null;
    });
    resultsEl.addEventListener('change', event => {
        const form = event.target.closest('.relic-edit-form');
        if (!form) return;
        if (event.target.matches('.relic-edit-slot')) {
            const slot = form.querySelector('.relic-edit-slot').value;
            const setEl = form.querySelector('.relic-edit-set');
            const mainEl = form.querySelector('.relic-edit-main');
            setEl.innerHTML = setOptions(slot, setEl.value);
            mainEl.innerHTML = mainOptions(slot, mainEl.value);
        }
        if (event.target.matches('.relic-edit-slot, .relic-edit-main')) applyEditMainStatExclusion(form);
        if (event.target.matches('.relic-edit-sub-mode')) updateRelicSubstatInputMode(form);
    });
    resultsEl.addEventListener('submit', event => {
        const form = event.target.closest('.relic-edit-form');
        if (!form) return;
        event.preventDefault();
        const existing = RelicStore.get(form.dataset.id);
        const status = form.querySelector('.relic-edit-status');
        if (!existing) {
            status.textContent = '対象の遺物が見つかりません。';
            return;
        }
        try {
            const result = RelicStore.save(readEditableRelic(form, existing));
            if (result.duplicate) {
                status.textContent = '同じ性能の遺物が既に登録されています。';
                return;
            }
            editingRelicId = null;
            renderResults();
        } catch (error) {
            status.textContent = error.message;
        }
    });
    const statusEl = get('relic-create-status');
    const createForm = get('relic-create-form');
    const slotEl = get('relic-create-slot');
    const setEl = get('relic-create-set');
    const mainEl = get('relic-create-main');
    enhanceSelect(slotEl, relicSlotPickerConfig());
    enhanceSelect(setEl, relicSetPickerConfig());
    enhanceSelect(mainEl, relicMainPickerConfig());
    enhanceSelect(get('relic-filter-kind'), relicKindFilterPickerConfig());
    enhanceSelect(get('relic-filter-slot'), relicSlotFilterPickerConfig());
    enhanceSelect(get('relic-filter-set'), relicSetFilterPickerConfig());
    enhanceSelect(get('relic-filter-main'), relicMainFilterPickerConfig());
    enhanceMultiSelect(get('relic-filter-subs'), relicSubstatFilterPickerConfig());

    function applyMainStatExclusion() {
        const mainStat = getMainStatDef(slotEl.value, mainEl.value)?.stat || null;
        get('relic-create-form').querySelectorAll('.relic-create-sub-stat').forEach(select => {
            for (const option of select.options) {
                if (!option.value) continue;
                option.disabled = Boolean(mainStat) && option.value === mainStat;
            }
        });
    }
    mainEl.addEventListener('change', applyMainStatExclusion);
    applyMainStatExclusion();
    updateRelicSubstatInputMode(createForm);
    const selectedSetByType = {
        [SET_TYPE.CAVERN]: setEl.value,
        [SET_TYPE.PLANAR]: Registry.ornament.list()[0]?.id || '',
    };
    const savedUid = localStorage.getItem(UID_STORAGE_KEY) || '';
    const apiLogs = [];
    get('relic-api-uid').value = savedUid;
    get('relic-api-remember').checked = Boolean(savedUid);

    function writeApiLog(message) {
        apiLogs.push(`${new Date().toLocaleTimeString('ja-JP')}  ${message}`);
        get('relic-api-log-output').textContent = apiLogs.join('\n');
    }

    function maskedUid(uid) {
        return uid.length > 5 ? `${uid.slice(0, 3)}…${uid.slice(-2)}` : uid;
    }

    function candidateLogLine(candidate, index) {
        const relic = candidate.valid ? candidate.relic : candidate.raw;
        const source = relic?.source || {};
        const result = candidate.valid ? (candidate.duplicate ? '登録済み' : '保存可能') : `除外: ${candidate.reason}`;
        return [
            `#${index + 1}`, relic?.label || '名称なし', result,
            `部位=${relic?.slot || '(未認識)'}`,
            `セットAPI=${source.apiSetName || '(名称なし)'}`,
            `セット変換=${relic?.setId || '(未登録)'}`,
            `メイン=${relic?.mainStat || '(未認識)'}`,
            `サブステ=${Object.keys(relic?.subs || {}).length}個`,
        ].join(' | ');
    }

    function renderResults() {
        const query = get('relic-search').value.trim().toLocaleLowerCase('ja');
        const kind = get('relic-filter-kind').value;
        const slot = get('relic-filter-slot').value;
        const setId = get('relic-filter-set').value;
        const mainStat = get('relic-filter-main').value;
        const requiredSubs = [...get('relic-filter-subs').selectedOptions].map(option => option.value);
        const relics = RelicStore.list().filter(relic => {
            const text = `${relicName(relic)} ${relic.label} ${relic.tags.join(' ')} ${Object.keys(relic.subs).map(key => formatStat(key, 0)).join(' ')}`.toLocaleLowerCase('ja');
            return (!query || text.includes(query))
                && (!kind || relic.kind === kind)
                && (!slot || relic.slot === slot)
                && (!setId || relic.setId === setId)
                && (!mainStat || relic.mainStat === mainStat)
                && requiredSubs.every(stat => stat in relic.subs);
        });
        get('relic-results').innerHTML = relics.length ? relics.map(relic => `<article class="relic-result"><div><span class="relic-kind is-${relic.kind}">${relic.kind === 'owned' ? '実物' : '仮想'}</span><strong>${escapeHtml(relic.label || relicName(relic))}</strong><p>${escapeHtml(relicName(relic))}</p><div class="relic-stat-list">${Object.entries(relic.subs).map(([key, value]) => `<span>${escapeHtml(formatStat(key, value))}</span>`).join('') || '<span>サブステなし</span>'}</div>${relic.tags.length ? `<div class="relic-tags">${relic.tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</div>` : ''}</div><button class="btn-secondary btn-mini relic-delete" type="button" data-id="${escapeHtml(relic.id)}">削除</button></article>`).join('') : '<p class="relic-empty">条件に一致する遺物はありません。</p>';
    }

    /** 部位/セット/メイン/サブステフィルタの選択肢を、実現可能な組み合わせだけに絞り込んでから再描画する。 */
    function updateFilterAvailability() {
        const filterSlotEl = get('relic-filter-slot');
        const filterSetEl = get('relic-filter-set');
        const filterMainEl = get('relic-filter-main');
        const filterSubsEl = get('relic-filter-subs');

        const setValue = filterSetEl.value;
        const mainValue = filterMainEl.value;
        const subValues = new Set([...filterSubsEl.selectedOptions].map(option => option.value));

        const allowedSlots = slotsForSetType(setValue).filter(slot => slotsForMainStat(mainValue).includes(slot));
        const effectiveSlot = allowedSlots.includes(filterSlotEl.value) ? filterSlotEl.value : '';

        const slotsForSet = effectiveSlot ? [effectiveSlot] : slotsForMainStat(mainValue);
        const allowedSetTypes = new Set(slotsForSet.map(slot => SLOT_TO_SET_TYPE[slot]));

        const slotsForMain = effectiveSlot ? [effectiveSlot] : slotsForSetType(setValue);
        const allowedMainIds = new Set();
        for (const slot of slotsForMain) {
            for (const id of Object.keys(RELIC_MAIN_OPTIONS[slot] || {})) allowedMainIds.add(id);
        }
        for (const id of [...allowedMainIds]) {
            const stat = mainStatIdToStat(id);
            if (stat && subValues.has(stat)) allowedMainIds.delete(id);
        }

        const excludedSubStat = mainValue ? mainStatIdToStat(mainValue) : null;

        rebuildSlotFilterOptions(filterSlotEl, allowedSlots);
        rebuildSetFilterOptions(filterSetEl, allowedSetTypes);
        rebuildMainFilterOptions(filterMainEl, allowedMainIds);
        rebuildSubstatFilterOptions(filterSubsEl, excludedSubStat);

        renderResults();
    }

    function renderImportPreview() {
        const preview = get('relic-import-preview');
        get('relic-import-save').disabled = !candidates.some(candidate => candidate.valid);
        get('relic-import-all').disabled = !candidates.some(candidate => candidate.valid);
        const byCharacter = new Map();
        for (const candidate of candidates) {
            const key = candidate.relic?.source?.characterName || candidate.raw?.source?.characterName || '読み込み結果';
            if (!byCharacter.has(key)) byCharacter.set(key, []);
            byCharacter.get(key).push(candidate);
        }
        preview.innerHTML = candidates.length ? [...byCharacter].map(([name, items]) => `<section class="relic-import-group"><h4>${escapeHtml(name)}</h4>${items.map(candidate => {
            if (!candidate.valid) return `<label class="relic-import-row is-invalid"><input type="checkbox" disabled> <span>${escapeHtml(candidate.raw?.label || '遺物')}：${escapeHtml(candidate.reason)}</span></label>`;
            return `<label class="relic-import-row${candidate.duplicate ? ' is-duplicate' : ''}"><input class="relic-import-choice" type="checkbox" value="${escapeHtml(candidate.id)}" ${candidate.duplicate ? '' : 'checked'}> <span>${escapeHtml(candidate.relic.label || relicName(candidate.relic))}</span><small>${candidate.duplicate ? '同じ性能の遺物が登録済み' : '保存可能'}</small></label>`;
        }).join('')}</section>`).join('') : '取得結果に読み込める遺物がありません。';
    }

    setEl.addEventListener('change', () => {
        selectedSetByType[SLOT_TO_SET_TYPE[slotEl.value]] = setEl.value;
    });
    slotEl.addEventListener('change', () => {
        const setType = SLOT_TO_SET_TYPE[slotEl.value];
        setEl.innerHTML = setOptions(slotEl.value, selectedSetByType[setType]);
        selectedSetByType[setType] = setEl.value;
        mainEl.innerHTML = mainOptions(slotEl.value);
        applyMainStatExclusion();
    });
    createForm.addEventListener('change', event => {
        if (event.target.matches('[data-relic-sub-mode]')) updateRelicSubstatInputMode(createForm);
    });
    get('relic-create-reset').addEventListener('click', () => {
        createForm.reset();
        slotEl.value = 'head';
        setEl.innerHTML = setOptions('head');
        mainEl.innerHTML = mainOptions('head');
        createForm.querySelectorAll('.relic-create-sub-stat').forEach(select => { select.value = ''; });
        createForm.querySelectorAll('.relic-sub-entry').forEach(input => {
            input.value = '';
            input.dataset.value = '';
            input.dataset.roll = '';
        });
        createForm.querySelector('#relic-create-sub-mode').value = RELIC_SUBSTAT_INPUT_MODE.VALUE;
        createForm.querySelector('#relic-create-sub-tier').value = 'high';
        selectedSetByType[SET_TYPE.CAVERN] = setEl.value;
        refreshSmartPickers(createForm);
        updateRelicSubstatInputMode(createForm);
        applyMainStatExclusion();
        statusEl.textContent = '入力をリセットしました。';
    });
    createForm.addEventListener('submit', event => {
        event.preventDefault();
        try {
            const result = RelicStore.save(readManualRelic(createForm));
            statusEl.textContent = result.duplicate
                ? '同じ性能の遺物が既にあるため、既存の1個を使います。入力内容は保持しています。'
                : '保存しました。入力内容は保持しています。';
            renderResults();
        } catch (error) { statusEl.textContent = error.message; }
    });
    get('relic-search').addEventListener('input', renderResults);
    get('relic-filter-kind').addEventListener('change', renderResults);
    get('relic-filter-slot').addEventListener('change', updateFilterAvailability);
    get('relic-filter-set').addEventListener('change', updateFilterAvailability);
    get('relic-filter-main').addEventListener('change', updateFilterAvailability);
    get('relic-filter-subs').addEventListener('change', updateFilterAvailability);
    get('relic-results').addEventListener('click', event => {
        const button = event.target.closest('.relic-delete');
        if (!button || !confirm('この遺物を削除しますか?')) return;
        RelicStore.delete(button.dataset.id);
        renderResults();
    });
    get('relic-api-fetch').addEventListener('click', async () => {
        const uid = get('relic-api-uid').value.trim();
        const apiStatus = get('relic-api-status');
        if (!/^\d{5,15}$/.test(uid)) { apiStatus.textContent = 'UIDは数字で入力してください。'; return; }
        if (get('relic-api-remember').checked) localStorage.setItem(UID_STORAGE_KEY, uid);
        else localStorage.removeItem(UID_STORAGE_KEY);
        apiStatus.textContent = '公開データを取得しています…';
        writeApiLog(`UID ${maskedUid(uid)} の取得を開始`);
        get('relic-api-fetch').disabled = true;
        try {
            const response = await fetch(`${MIHOMO_ENDPOINT}/${encodeURIComponent(uid)}`);
            const payload = await response.json().catch(() => null);
            if (!response.ok) {
                const message = payload?.error?.message || `取得に失敗しました（${response.status}）`;
                const error = new Error(message);
                error.diagnosticLogs = payload?.diagnosticLogs || [];
                error.status = response.status;
                throw error;
            }
            if (!payload) throw new Error('公開APIの応答を読み取れませんでした。');
            candidates = RelicStore.prepareImport(adaptMihomoPayload(payload), { provider: 'mihomo', uid });
            const validCount = candidates.filter(candidate => candidate.valid).length;
            const invalidReasons = candidates.filter(candidate => !candidate.valid)
                .map(candidate => candidate.reason)
                .reduce((counts, reason) => counts.set(reason, (counts.get(reason) || 0) + 1), new Map());
            writeApiLog(`HTTP ${response.status}: キャラクター ${payload.characters?.length || 0} 人、遺物候補 ${candidates.length} 個、有効 ${validCount} 個`);
            for (const [reason, count] of invalidReasons) writeApiLog(`除外 ${count} 個: ${reason}`);
            writeApiLog('--- 遺物ごとの変換結果 ---');
            candidates.forEach((candidate, index) => writeApiLog(candidateLogLine(candidate, index)));
            apiStatus.textContent = `${validCount} 個の遺物を選択できます。`;
            renderImportPreview();
        } catch (error) {
            candidates = [];
            renderImportPreview();
            apiStatus.textContent = error.message || '公開データを取得できませんでした。';
            writeApiLog(`失敗${error.status ? ` (HTTP ${error.status})` : ''}: ${error.message || '不明なエラー'}`);
            for (const detail of error.diagnosticLogs || []) writeApiLog(`詳細: ${detail}`);
        } finally { get('relic-api-fetch').disabled = false; }
    });
    get('relic-import-all').addEventListener('click', () => root.querySelectorAll('.relic-import-choice:not(:disabled)').forEach(input => { input.checked = true; }));
    get('relic-import-save').addEventListener('click', () => {
        const selected = [...root.querySelectorAll('.relic-import-choice:checked')].map(input => input.value);
        const result = RelicStore.importSelected(candidates, selected);
        get('relic-api-status').textContent = `${result.created.length} 個を保存しました。${result.duplicates.length ? ` ${result.duplicates.length} 個は登録済みです。` : ''}`;
        candidates = [];
        renderImportPreview();
        renderResults();
    });
    get('relic-api-copy-log').addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(get('relic-api-log-output').textContent);
            get('relic-api-status').textContent = '取得ログをコピーしました。';
        } catch {
            get('relic-api-status').textContent = 'コピーに失敗しました。ログ欄から手動でコピーしてください。';
        }
    });
    get('relic-api-download-log').addEventListener('click', () => {
        const blob = new Blob([get('relic-api-log-output').textContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `srsim-relic-import-${new Date().toISOString().replace(/[:.]/g, '-')}.log`;
        anchor.click();
        URL.revokeObjectURL(url);
    });
    updateFilterAvailability();
    return Object.freeze({ refresh: renderResults });
}
