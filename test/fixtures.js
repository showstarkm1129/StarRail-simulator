// テスト用フィクスチャ — 実データに依存しない最小キャラ/セットを Registry に登録する。
// 各テストの先頭で registerFixtures() を呼ぶ (重複登録は Registry が上書き許容)。

import { Registry } from '../js/build/registry.js';
import { STAT } from '../js/build/statKeys.js';
import { ELEMENT, PATH } from '../js/build/constants.js';

export const FIXTURE_CHAR_ID = '__test_fixture_char__';
export const FIXTURE_CAVERN_ID = '__test_fixture_cavern__';
export const FIXTURE_PLANAR_ID = '__test_fixture_planar__';

// 決定的な基礎値を持つフィクスチャキャラ
export function makeFixtureCharacter() {
    return {
        id: FIXTURE_CHAR_ID,
        name: 'テスト用キャラ',
        element: ELEMENT.FIRE,
        path: PATH.DESTRUCTION,
        base: { atk: 600, hp: 1000, def: 400, spd: 100 },
        traces: {
            stats: {
                [STAT.ATK_PERCENT]: 0.28,
                [STAT.CRIT_RATE]: 0.12,
                [STAT.CRIT_DMG]: 0.50,
            },
        },
        eidolons: {
            1: { stats: { [STAT.ATK_PERCENT]: 0.10 } },
            2: { stats: { [STAT.CRIT_DMG]: 0.20 } },
        },
        skills: {
            basic: { maxLevel: { default: 6, withEidolon: 7 }, levels: makeLevels(7) },
            skill: { maxLevel: { default: 10, withEidolon: 12 }, levels: makeLevels(12) },
            ult:   { maxLevel: { default: 10, withEidolon: 12 }, levels: makeLevels(12) },
            talent:{ maxLevel: { default: 10, withEidolon: 12 }, levels: makeLevels(12) },
        },
        eidolonsDetail: {
            3: { levelBoost: { ult: 2, talent: 2 } },
            5: { levelBoost: { basic: 1, skill: 2 } },
        },
        // collectHooks / Step9(onBuildResolved) のカバレッジ用。いずれも副作用なし。
        hooks: {
            onBuildResolved: () => {},
            onTurnStart: () => {},
        },
    };
}

function makeLevels(n) {
    return Array.from({ length: n }, (_, i) => ({ mult: 1 + i * 0.1 }));
}

export function makeFixtureCavernSet() {
    return {
        id: FIXTURE_CAVERN_ID,
        name: 'テスト用4部位セット',
        pc2: { stats: { [STAT.ATK_PERCENT]: 0.12 } },
        pc4: { stats: { [STAT.DMG_ALL]: 0.10 }, hooks: { onUltUse: () => {} } },
    };
}

export function makeFixturePlanarSet() {
    return {
        id: FIXTURE_PLANAR_ID,
        name: 'テスト用2部位セット',
        pc2: { stats: { [STAT.ATK_PERCENT]: 0.05 } },
    };
}

// 全フィクスチャを Registry に登録 (副作用)
export function registerFixtures() {
    Registry.character.add(makeFixtureCharacter());
    Registry.relicSet.add(makeFixtureCavernSet());
    Registry.ornament.add(makeFixturePlanarSet());
}

// 決定的なビルド: フィクスチャキャラ + 4部位セット + 球/縄
export function makeFixtureBuild(overrides = {}) {
    return {
        characterId: FIXTURE_CHAR_ID,
        eidolon: 0,
        lightcone: null,
        relics: {
            head:   { setId: FIXTURE_CAVERN_ID, mainStat: 'hp_flat',  subs: {} },
            hands:  { setId: FIXTURE_CAVERN_ID, mainStat: 'atk_flat', subs: {} },
            body:   { setId: FIXTURE_CAVERN_ID, mainStat: 'crit_rate', subs: {} },
            feet:   { setId: FIXTURE_CAVERN_ID, mainStat: 'atk_percent', subs: {} },
            sphere: { setId: FIXTURE_PLANAR_ID, mainStat: 'fire_dmg', subs: {} },
            rope:   { setId: FIXTURE_PLANAR_ID, mainStat: 'atk_percent', subs: {} },
        },
        envBuffs: [],
        ...overrides,
    };
}
