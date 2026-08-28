import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Registry } from '../js/build/registry.js';
import { DAMAGE_SCALE, DAMAGE_SCALE_LIST } from '../js/build/constants.js';
import { idFromEnglishName } from '../js/data/characters/_defineCharacter.js';

import '../js/data/characters/_index.js';

const EXPECTED_CHARACTER_ENGLISH_NAMES = Object.freeze([
    'Acheron',
    'Aglaea',
    'Anaxa',
    'Archer',
    'Argenti',
    'Arlan',
    'Ashveil',
    'Asta',
    'Aventurine',
    'Bailu',
    'Black Swan',
    'Blade',
    'Boothill',
    'Bronya',
    'Castorice',
    'Cerydra',
    'Cipher',
    'Clara',
    'Cyrene',
    'Dan Heng',
    'Dan Heng • Imbibitor Lunae',
    'Dan Heng • Permansor Terrae',
    'Dr. Ratio',
    'Evanescia',
    'Evernight',
    'Feixiao',
    'Firefly',
    'Fu Xuan',
    'Fugue',
    'Gallagher',
    'Gepard',
    'Gilgamesh',
    'Guinaifen',
    'Hanya',
    'Herta',
    'Himeko',
    'Himeko • Nova',
    'Hook',
    'Huohuo',
    'Hyacine',
    'Hysilens',
    'Jade',
    'Jiaoqiu',
    'Jing Yuan',
    'Jingliu',
    'Kafka',
    'Lingsha',
    'Luka',
    'Luocha',
    'Lynx',
    'March 7th',
    'March 7th (The Hunt)',
    'Misha',
    'Mortenax Blade',
    'Moze',
    'Mydei',
    'Natasha',
    'Pela',
    'Phainon',
    'Qingque',
    'Rappa',
    'Rin Tohsaka',
    'Robin',
    'Ruan Mei',
    'Saber',
    'Sampo',
    'Seele',
    'Serval',
    'Silver Wolf',
    'Silver Wolf LV.999',
    'Sparkle',
    'Sparxie',
    'Sunday',
    'Sushang',
    'The Dahlia',
    'The Herta',
    'Tingyun',
    'Topaz & Numby',
    'Trailblazer (Destruction)',
    'Trailblazer (Preservation)',
    'Trailblazer (Harmony)',
    'Trailblazer (Remembrance)',
    'Trailblazer (Elation)',
    'Tribbie',
    'Welt',
    'Xueyi',
    'Yanqing',
    'Yao Guang',
    'Yukong',
    'Yunli',
]);

test('ver4.4までのキャラクター英名リストがすべて登録されている', () => {
    const expectedIds = EXPECTED_CHARACTER_ENGLISH_NAMES.map(idFromEnglishName);
    assert.equal(new Set(expectedIds).size, expectedIds.length, 'expected id list has duplicates');

    for (const id of expectedIds) {
        assert.ok(Registry.character.has(id), `character id "${id}" is missing`);
    }
});

test('全キャラクターに火力スケール分類があり、代表キャラの分類が固定されている', () => {
    for (const character of Registry.character.list()) {
        assert.ok(
            DAMAGE_SCALE_LIST.includes(character.damageScale),
            `${character.id}: damageScale が未分類または不正です`,
        );
    }

    const expected = {
        archer: DAMAGE_SCALE.ATK,
        ashveil: DAMAGE_SCALE.ATK,
        blade: DAMAGE_SCALE.HP,
        castorice: DAMAGE_SCALE.HP,
        tribbie: DAMAGE_SCALE.HP,
        firefly: DAMAGE_SCALE.BREAK,
        'trailblazer_harmony': DAMAGE_SCALE.BREAK,
        evanescia: DAMAGE_SCALE.ELATION,
        'trailblazer_elation': DAMAGE_SCALE.ELATION,
    };
    for (const [id, damageScale] of Object.entries(expected)) {
        assert.equal(Registry.character.get(id)?.damageScale, damageScale, `${id}: 分類が想定と異なります`);
    }
});
