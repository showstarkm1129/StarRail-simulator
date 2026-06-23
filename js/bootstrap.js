// bootstrap.js — ES Modules エントリ
// 役割:
//   1. 全データ定義 (_index.js) を import → Registry に副作用登録
//   2. 計算層・永続化層・橋渡しを window.SRSIM に公開
//      → 既存の非モジュール simulator.js / speed.js / ui.js から参照可能
//
// 既存 3 タブ(速度・行動回数 / 戦闘シミュ / 自由設定)の挙動は無改変。

// データ層(import 時に副作用で Registry に登録される)
import './data/characters/_index.js';
import './data/lightcones/_index.js';
import './data/cavern relics/_index.js';
import './data/planar ornaments/_index.js';

// 計算・永続化・橋渡し
import { Registry } from './build/registry.js';
import { StatComputer, countAllSets, countSetsByType } from './build/statComputer.js';
import { Build } from './build/buildStore.js';
import { buildToEntity } from './build/buildToEntity.js';
import { Diminishing } from './build/diminishing.js';
import * as SkillUtil from './build/skillUtil.js';

// UI
import { initDiminishingUI } from './ui/diminishingUI.js';

// 定数(UI 側で select 生成等に使う)
import {
    ELEMENT, ELEMENT_LIST, PATH, SLOT,
    RELIC_SLOTS, ORNAMENT_SLOTS, ALL_SLOTS,
    SET_TYPE, SLOT_TO_SET_TYPE,
} from './build/constants.js';
import {
    STAT, STAT_DEFAULTS, ALL_STAT_KEYS, ELEMENT_DMG_KEYS, makeElementDmgKey,
} from './build/statKeys.js';
import { RELIC_MAIN_OPTIONS, getMainStatDef } from './build/relicMainTable.js';

// グローバルに公開
window.SRSIM = Object.freeze({
    Registry,
    StatComputer,
    Build,
    buildToEntity,
    Diminishing,
    SkillUtil,
    countAllSets,
    countSetsByType,
    Constants: Object.freeze({
        ELEMENT, ELEMENT_LIST, PATH, SLOT,
        RELIC_SLOTS, ORNAMENT_SLOTS, ALL_SLOTS,
        SET_TYPE, SLOT_TO_SET_TYPE,
    }),
    Stats: Object.freeze({
        STAT, STAT_DEFAULTS, ALL_STAT_KEYS, ELEMENT_DMG_KEYS, makeElementDmgKey,
    }),
    Relics: Object.freeze({
        RELIC_MAIN_OPTIONS,
        getMainStatDef,
    }),
});

// 初期登録状況をログ出力(動作確認用)
console.info(
    `[SRSIM] ready - characters:${Registry.character.size()} ` +
    `lightcones:${Registry.lightcone.size()} ` +
    `relicSets:${Registry.relicSet.size()} ` +
    `ornaments:${Registry.ornament.size()}`
);

// UI 初期化 (DOM はモジュール実行時点で既にパース済み)
initDiminishingUI();

// 数値入力フィールド上でのホイールイベントを「フォーカス時のみ値増減」に統一する。
//
// 既定動作: input[type=number] にフォーカスがあると、ホイールは値を増減するが、
//           同時にページもスクロールしてしまう (Chrome 既定動作)。
// この対策: フォーカス中の数値入力上でホイールが発生した時のみ preventDefault し、
//           手動で stepUp/stepDown + input/change イベントを発火する。
//           フォーカスが無い状態 (ただホバーしているだけ) では何もせず、
//           通常通りページがスクロールする (意図しない値変更を防ぐ)。
//
// document への 1 つの listener で全 input に対応 (動的に再生成される input にも有効)。
// passive: false を指定しないと preventDefault が無視される。
document.addEventListener('wheel', (e) => {
    const t = e.target;
    if (!(t instanceof HTMLInputElement) || t.type !== 'number') return;
    if (document.activeElement !== t) return;   // フォーカス時のみ反応
    if (t.disabled || t.readOnly) return;
    e.preventDefault();
    if (e.deltaY < 0)      t.stepUp();
    else if (e.deltaY > 0) t.stepDown();
    t.dispatchEvent(new Event('input',  { bubbles: true }));
    t.dispatchEvent(new Event('change', { bubbles: true }));
}, { passive: false });
