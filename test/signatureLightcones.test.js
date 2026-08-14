import assert from 'node:assert/strict';
import { test } from 'node:test';

import '../js/data/characters/_index.js';
import '../js/data/lightcones/_index.js';

import { Registry } from '../js/build/registry.js';
import {
    SIGNATURE_CHARACTERS_BY_LIGHTCONE,
    signatureCharacterIdsForLightcone,
    signatureLightconeIdForCharacter,
} from '../js/data/lightcones/signatureRelations.js';

test('signature lightcone relations reference registered characters with the same path', () => {
    const seenCharacters = new Map();

    for (const [lightconeId, characterIds] of Object.entries(SIGNATURE_CHARACTERS_BY_LIGHTCONE)) {
        const lightcone = Registry.lightcone.get(lightconeId);
        assert.ok(lightcone, `unknown signature lightcone: ${lightconeId}`);
        assert.ok(characterIds.length > 0, `signature relation has no character: ${lightconeId}`);

        for (const characterId of characterIds) {
            const character = Registry.character.get(characterId);
            assert.ok(character, `unknown signature character: ${characterId}`);
            assert.equal(
                character.path,
                lightcone.path,
                `signature path mismatch: ${characterId} / ${lightconeId}`,
            );
            assert.equal(
                seenCharacters.has(characterId),
                false,
                `character has multiple signature lightcones: ${characterId}`,
            );
            seenCharacters.set(characterId, lightconeId);
        }
    }
});

test('signature lightcone relations can be resolved in both directions', () => {
    assert.equal(signatureLightconeIdForCharacter('archer'), 'The Hell Where Ideals Burn');
    assert.equal(signatureLightconeIdForCharacter('sparkle'), 'Earthly Escapade');
    assert.equal(signatureLightconeIdForCharacter('trailblazer_elation'), null);
    assert.deepEqual(signatureCharacterIdsForLightcone('The Hell Where Ideals Burn'), ['archer']);
    assert.deepEqual(signatureCharacterIdsForLightcone('Elation Brimming With Blessings'), []);
});
