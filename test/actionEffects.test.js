// 行動順効果カタログのテスト。
// Registry へ専用のテスト用データを登録し、抽出ロジックだけを検証する
// (実データの内容に依存すると、データ追加のたびに壊れるため)。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Registry } from '../js/build/registry.js';
import { STAT } from '../js/build/statKeys.js';
import { ELEMENT, PATH, SET_TYPE } from '../js/build/constants.js';
import {
    ACTION_EFFECT_KINDS,
    collectActionEffects,
    searchActionEffects,
    toPanelEvent,
} from '../js/build/actionEffects.js';

const CHAR_ID = '__ao_effect_char__';
const LC_ID = '__ao_effect_lc__';
const SET_ID = '__ao_effect_set__';

function registerFixtures() {
    Registry.character.add({
        id: CHAR_ID,
        name: 'テスト行動順キャラ',
        element: ELEMENT.WIND,
        path: PATH.HARMONY,
        base: { atk: 500, hp: 1000, def: 400, spd: 107 },
        traces: {
            stats: { [STAT.SPD_FLAT]: 14 },
        },
        skills: {
            talent: {
                name: '先行',
                description: '通常攻撃を行った後、自身の行動順がX％早まる。',
                levels: [{ advance: 0.15 }, { advance: 0.16 }, { advance: 0.18 }],
            },
            skill: {
                name: '無関係スキル',
                description: '味方全体の攻撃力+20%。',
                levels: [{ atkBuff: 0.2 }],
            },
        },
        eidolons: {
            2: { name: '星魂2', description: '戦闘開始時、自身の行動順が100%早まる。' },
            4: { name: '星魂4', description: '敵の行動順を30%遅延させる。' },
        },
        partyEffects: [
            {
                id: 'party_spd',
                name: '味方速度+12%',
                description: '必殺技発動後、味方全体の速度+12%、1ターン継続。',
                stats: { [STAT.SPD_PERCENT]: 0.12 },
                defaultActive: false,
                target: 'all',
            },
            {
                id: 'party_atk_only',
                name: '攻撃力バフのみ',
                description: '味方全体の攻撃力+30%。',
                stats: { [STAT.ATK_PERCENT]: 0.30 },
            },
        ],
        selfEffects: [
            {
                id: 'self_spd_flat',
                name: '自己速度+20',
                description: '自身の速度+20。',
                stats: { [STAT.SPD_FLAT]: 20 },
                minEidolon: 1,
            },
        ],
    });

    Registry.lightcone.add({
        id: LC_ID,
        name: 'テスト光円錐',
        path: PATH.HARMONY,
        rarity: 5,
        base: { atk: 500, hp: 900, def: 400 },
        stats: [0.08, 0.09, 0.10, 0.11, 0.12].map(value => ({ [STAT.SPD_PERCENT]: value })),
        hooks: (superimpose) => ({
            onUltUse(ctx) {
                const pct = 0.16 + (superimpose - 1) * 0.02;
                ctx.allies?.forEach(a => a.advanceAction?.(pct));
            },
        }),
    });

    Registry.relicSet.add({
        id: SET_ID,
        name: 'テスト遺物セット',
        type: SET_TYPE.CAVERN,
        pc2: { stats: { [STAT.SPD_PERCENT]: 0.06 } },
        pc4: {
            description: '必殺技を発動した後、自身の行動値を25%短縮する。',
            hooks: {
                onUltUse(ctx) { ctx.self?.advanceAction?.(0.25); },
            },
        },
    });
}

registerFixtures();

function rowsFor(sourceId, superimpose = 1) {
    return collectActionEffects({ superimpose }).filter(row => row.sourceId === sourceId);
}

test('速度%バフを持つ効果を stats 由来として拾う', () => {
    const row = rowsFor(CHAR_ID).find(item => item.path === 'party.party_spd');
    assert.ok(row, '速度%の partyEffect が見つかる');
    assert.equal(row.kind, ACTION_EFFECT_KINDS.SPEED_PCT);
    assert.equal(row.value, 12, '0.12 → 12% へ変換される');
    assert.equal(row.origin, 'stats');
    assert.equal(row.target, 'all');
    assert.equal(row.defaultActive, false);
});

test('速度に関係しない効果は拾わない', () => {
    assert.equal(rowsFor(CHAR_ID).some(row => row.path === 'party.party_atk_only'), false);
});

test('selfEffects の速度実数加算を拾い、星魂条件も残す', () => {
    const row = rowsFor(CHAR_ID).find(item => item.path === 'self.self_spd_flat');
    assert.ok(row);
    assert.equal(row.kind, ACTION_EFFECT_KINDS.SPEED_FLAT);
    assert.equal(row.value, 20);
    assert.equal(row.minEidolon, 1);
});

test('軌跡ノードの速度加算は常時扱いで拾う', () => {
    const row = rowsFor(CHAR_ID).find(item => item.path === 'traces.stats');
    assert.ok(row);
    assert.equal(row.kind, ACTION_EFFECT_KINDS.SPEED_FLAT);
    assert.equal(row.value, 14);
    assert.equal(row.alwaysOn, true);
});

test('軌跡レベル別の行動値短縮を skillLevels として拾う', () => {
    const row = rowsFor(CHAR_ID).find(item => item.origin === 'skillLevels');
    assert.ok(row);
    assert.equal(row.path, 'skills.talent');
    assert.equal(row.kind, ACTION_EFFECT_KINDS.ADVANCE);
    assert.equal(row.value, null, 'レベル指定が要るので単一値は確定しない');
    assert.deepEqual(row.levels, [15, 16, 18]);
});

test('advance を持たないスキルは skillLevels に含めない', () => {
    const rows = rowsFor(CHAR_ID).filter(item => item.origin === 'skillLevels');
    assert.equal(rows.length, 1);
    assert.equal(rows.some(row => row.path === 'skills.skill'), false);
});

test('説明文から行動値短縮と行動順遅延を抽出し、原文を添える', () => {
    const rows = rowsFor(CHAR_ID).filter(item => item.origin === 'description');
    const advance = rows.find(row => row.value === 100);
    const delay = rows.find(row => row.kind === ACTION_EFFECT_KINDS.DELAY);

    assert.ok(advance, '「行動順が100%早まる」を拾う');
    assert.equal(advance.kind, ACTION_EFFECT_KINDS.ADVANCE);
    assert.match(advance.sentence, /行動順が100%早まる/);

    assert.ok(delay, '「行動順を30%遅延させる」を拾う');
    assert.equal(delay.value, 30);
    assert.match(delay.sentence, /遅延/);
});

test('説明文の伏字 (X%) は値 null と placeholder で返す', () => {
    const row = rowsFor(CHAR_ID)
        .find(item => item.origin === 'description' && item.placeholder === 'X');
    assert.ok(row);
    assert.equal(row.value, null);
    assert.equal(row.kind, ACTION_EFFECT_KINDS.ADVANCE);
});

test('光円錐の重畳依存ステータスは指定段階で解決する', () => {
    const s1 = rowsFor(LC_ID, 1).find(item => item.path === 'stats');
    const s5 = rowsFor(LC_ID, 5).find(item => item.path === 'stats');
    assert.equal(s1.value, 8);
    assert.equal(s5.value, 12);
});

test('hooks の advanceAction は定数なら値つき、変数なら値なしで拾う', () => {
    const lcRow = rowsFor(LC_ID).find(item => item.origin === 'hook');
    assert.ok(lcRow, '光円錐の動的フックを検出する');
    assert.equal(lcRow.value, null);
    assert.match(lcRow.note, /動的/);

    const setRow = rowsFor(SET_ID).find(item => item.origin === 'hook');
    assert.ok(setRow, 'セットの定数フックを検出する');
    assert.equal(setRow.value, 25, '0.25 → 25% へ変換される');
});

test('セットの 2pc 速度ステと 4pc 説明文の両方を拾う', () => {
    const rows = rowsFor(SET_ID);
    const pc2 = rows.find(row => row.path === 'pc2.stats');
    assert.equal(pc2.kind, ACTION_EFFECT_KINDS.SPEED_PCT);
    assert.equal(pc2.value, 6);
    assert.ok(rows.some(row => row.origin === 'description' && row.value === 25));
});

test('searchActionEffects: 名前で絞り込める', () => {
    const found = searchActionEffects({ queries: ['テスト行動順キャラ'] });
    assert.ok(found.total > 0);
    assert.ok(found.effects.every(row => row.sourceId === CHAR_ID));
});

test('searchActionEffects: 種類と由来で絞り込める', () => {
    const speedOnly = searchActionEffects({
        queries: [CHAR_ID], kinds: [ACTION_EFFECT_KINDS.SPEED_PCT],
    });
    assert.ok(speedOnly.effects.every(row => row.kind === ACTION_EFFECT_KINDS.SPEED_PCT));

    const statsOnly = searchActionEffects({ queries: [CHAR_ID], origins: ['stats'] });
    assert.ok(statsOnly.effects.every(row => row.origin === 'stats'));
});

test('searchActionEffects: limit を超えると truncated が立つ', () => {
    const found = searchActionEffects({ queries: [CHAR_ID], limit: 1 });
    assert.equal(found.effects.length, 1);
    assert.equal(found.truncated, true);
});

test('searchActionEffects: 検索語が無ければ全件を対象にする', () => {
    const all = searchActionEffects({ limit: 5 });
    assert.equal(all.effects.length, 5);
    assert.ok(all.total >= 5);
});

// ---- パネルイベントへの変換 ----

test('toPanelEvent: 速度%効果をそのままイベント化する', () => {
    const row = rowsFor(CHAR_ID).find(item => item.path === 'party.party_spd');
    assert.deepEqual(toPanelEvent(row), {
        type: 'speedPct', value: 12, name: '味方速度+12%', timing: 'turn', offset: 0, atAV: 0,
    });
});

test('toPanelEvent: 遅延は advance の負値になる', () => {
    const row = rowsFor(CHAR_ID).find(item => item.kind === ACTION_EFFECT_KINDS.DELAY);
    const event = toPanelEvent(row);
    assert.equal(event.type, 'advance');
    assert.equal(event.value, -30);
});

test('toPanelEvent: レベル依存の値は level 指定で確定する', () => {
    const row = rowsFor(CHAR_ID).find(item => item.origin === 'skillLevels');
    assert.equal(toPanelEvent(row), null, 'レベル未指定なら変換できない');
    assert.equal(toPanelEvent(row, { level: 3 }).value, 18);
});

test('toPanelEvent: 累計AV発動を指定できる', () => {
    const row = rowsFor(CHAR_ID).find(item => item.path === 'party.party_spd');
    const event = toPanelEvent(row, { timing: 'cum', atAV: 150 });
    assert.equal(event.timing, 'cum');
    assert.equal(event.atAV, 150);
    assert.equal(event.offset, 0);
});

test('toPanelEvent: turn 指定では offset を保持する', () => {
    const row = rowsFor(CHAR_ID).find(item => item.path === 'party.party_spd');
    const event = toPanelEvent(row, { timing: 'turn', offset: 40 });
    assert.equal(event.offset, 40);
    assert.equal(event.atAV, 0);
});
