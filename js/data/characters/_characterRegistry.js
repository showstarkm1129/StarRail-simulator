import { DAMAGE_SCALE, DAMAGE_SCALE_LIST, PATH } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';
import { CHARACTER_DAMAGE_SCALING } from './damageScaling.js';

// 旧形式のキャラクターデータも、通常形式と同じ分類ルールで登録する。
// 新しいデータは可能なら _defineCharacter.js の addCharacter() を使う。
export function addCharacterDefinition(definition) {
    const damageScale = definition.damageScale
        || CHARACTER_DAMAGE_SCALING[definition.id]
        || (definition.path === PATH.ELATION ? DAMAGE_SCALE.ELATION : DAMAGE_SCALE.ATK);

    if (!DAMAGE_SCALE_LIST.includes(damageScale)) {
        throw new Error(`[character] unknown damageScale "${damageScale}" for "${definition.id}"`);
    }

    Registry.character.add({
        ...definition,
        damageScale,
    });
}
