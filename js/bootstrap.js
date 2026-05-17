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
import './data/relics/_index.js';
import './data/ornaments/_index.js';

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
