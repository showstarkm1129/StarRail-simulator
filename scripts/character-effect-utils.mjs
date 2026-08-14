import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
    EFFECT_GROUPS,
    FIRE_DEBUFF_STAT_NAMES,
    GENERATED_CHARACTER_SKIP_IDS,
    normalizeRuleText,
} from '../js/data/characters/effectRules.js';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));

export const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
export const CHARACTER_DIR = path.join(REPO_ROOT, 'js/data/characters');
export const GENERATED_CHARACTER_HEADER = "import { addCharacter } from './_defineCharacter.js';\n\n";

const INTERNAL_CHARACTER_FILES = new Set([
    '_defineCharacter.js',
    '_index.js',
    'effectRules.js',
]);

const SKILL_SOURCE_BY_KEY = Object.freeze({
    basic: 'basic',
    enhancedBasic: 'basic',
    skill: 'skill',
    enhancedSkill: 'skill',
    ult: 'ult',
    ultimate: 'ult',
    talent: 'talent',
    technique: 'technique',
    memorySkill: 'memorySkill',
    memoryTalent: 'memoryTalent',
});

function relativePath(filePath) {
    return path.relative(REPO_ROOT, filePath);
}

function cloneJson(value) {
    return JSON.parse(JSON.stringify(value));
}

export function readCharacterIdFromText(text) {
    const match = /["']?id["']?\s*:\s*["']([^"']+)["']/.exec(text);
    return match?.[1] || null;
}

export function extractAddCharacterBody(text, filePath = 'character file') {
    const marker = 'addCharacter(';
    const start = text.indexOf(marker);
    if (start < 0) {
        throw new Error(`${relativePath(filePath)} does not call addCharacter(...)`);
    }

    const bodyStart = start + marker.length;
    const bodyEnd = text.lastIndexOf(');');
    if (bodyEnd <= bodyStart) {
        throw new Error(`${relativePath(filePath)} has an unsupported addCharacter(...) shape`);
    }

    return text.slice(bodyStart, bodyEnd).trim();
}

export function parseGeneratedCharacterFile(filePath) {
    const text = fs.readFileSync(filePath, 'utf8');
    const body = extractAddCharacterBody(text, filePath);

    try {
        return JSON.parse(body);
    } catch (error) {
        throw new Error(
            `${relativePath(filePath)} is not a generated addCharacter(JSON) file: ${error.message}`
        );
    }
}

export function writeGeneratedCharacterFile(filePath, def) {
    fs.writeFileSync(
        filePath,
        `${GENERATED_CHARACTER_HEADER}addCharacter(${JSON.stringify(def, null, 4)});\n`
    );
}

export function findCharacterFiles(characterDir = CHARACTER_DIR) {
    return fs
        .readdirSync(characterDir, { withFileTypes: true })
        .filter(entry => entry.isFile())
        .map(entry => entry.name)
        .filter(fileName => fileName.endsWith('.js') && !INTERNAL_CHARACTER_FILES.has(fileName))
        .map(fileName => path.join(characterDir, fileName))
        .sort((a, b) => a.localeCompare(b));
}

export function loadGeneratedCharacterDefs(options = {}) {
    const {
        characterDir = CHARACTER_DIR,
        characterId = null,
        includeSkipped = false,
        failOnParseError = false,
    } = options;
    const entries = [];
    const skipped = [];
    const parseErrors = [];
    const skipIds = new Set(GENERATED_CHARACTER_SKIP_IDS);

    for (const filePath of findCharacterFiles(characterDir)) {
        const text = fs.readFileSync(filePath, 'utf8');
        const textId = readCharacterIdFromText(text);
        const shouldSkip = !includeSkipped && textId && skipIds.has(textId);
        if (shouldSkip && characterId !== textId) {
            skipped.push({ filePath, id: textId, reason: 'configured skip id' });
            continue;
        }
        if (characterId && textId && textId !== characterId) continue;

        try {
            const def = parseGeneratedCharacterFile(filePath);
            if (characterId && def.id !== characterId) continue;
            if (!includeSkipped && skipIds.has(def.id) && characterId !== def.id) {
                skipped.push({ filePath, id: def.id, reason: 'configured skip id' });
                continue;
            }
            entries.push({ filePath, def });
        } catch (error) {
            const parseError = { filePath, id: textId, error };
            parseErrors.push(parseError);
            if (failOnParseError || characterId === textId) throw error;
        }
    }

    return { entries, skipped, parseErrors };
}

export function findGeneratedCharacterDef(characterId, options = {}) {
    const { entries, parseErrors } = loadGeneratedCharacterDefs({
        ...options,
        characterId,
        includeSkipped: true,
    });

    if (entries.length > 0) return entries[0];

    const matchingParseError = parseErrors.find(entry => entry.id === characterId);
    if (matchingParseError) throw matchingParseError.error;

    throw new Error(`generated character id "${characterId}" was not found`);
}

export function collectCharacterSections(def) {
    const sections = [];

    for (const [skillKey, skill] of Object.entries(def.skills || {})) {
        if (!skill?.description) continue;
        const source = SKILL_SOURCE_BY_KEY[skillKey] || skillKey;
        sections.push({
            kind: 'skill',
            source,
            key: skillKey,
            label: `${skill.sourceHeader || skillKey}: ${skill.name || skillKey}`,
            name: skill.name || skillKey,
            description: skill.description,
        });
    }

    for (const extra of def.extras || []) {
        if (!extra?.description) continue;
        sections.push({
            kind: 'extra',
            source: 'extra',
            key: `extra${extra.tier || ''}`,
            tier: extra.tier,
            label: `${extra.name || '追加能力'}`,
            name: extra.name || '追加能力',
            description: extra.description,
        });
    }

    for (const [eidolon, detail] of Object.entries(def.eidolonsDetail || {})) {
        if (!detail?.description) continue;
        sections.push({
            kind: 'eidolon',
            source: 'eidolon',
            key: `e${eidolon}`,
            minEidolon: Number(eidolon),
            label: `E${eidolon}: ${detail.name || ''}`.trim(),
            name: detail.name || `E${eidolon}`,
            description: detail.description,
        });
    }

    return sections;
}

export function collectCharacterEffects(def) {
    const effects = [];
    for (const group of EFFECT_GROUPS) {
        for (const effect of def[group] || []) {
            effects.push({ group, effect });
        }
    }
    return effects;
}

export function effectStatNames(effect) {
    const statNames = new Set();
    if (typeof effect?.stat === 'string') statNames.add(effect.stat);

    for (const statName of Object.keys(effect?.stats || {})) statNames.add(statName);
    for (const statName of Object.keys(effect?.statFields || {})) statNames.add(statName);

    for (const stepStats of Object.values(effect?.stackable?.stepValues || {})) {
        for (const statName of Object.keys(stepStats || {})) statNames.add(statName);
    }

    return [...statNames].sort();
}

export function upsertEffect(def, group, effect) {
    if (!EFFECT_GROUPS.includes(group)) {
        throw new Error(`unknown effect group "${group}". Use one of: ${EFFECT_GROUPS.join(', ')}`);
    }
    if (!effect || typeof effect !== 'object') throw new Error('effect must be an object');
    if (!effect.id) throw new Error('effect.id is required');

    if (!Array.isArray(def[group])) def[group] = [];

    const nextEffect = cloneJson(effect);
    const index = def[group].findIndex(existing => existing?.id === nextEffect.id);
    if (index >= 0) {
        def[group][index] = nextEffect;
        return { action: 'replaced', group, id: nextEffect.id };
    }

    def[group].push(nextEffect);
    return { action: 'inserted', group, id: nextEffect.id };
}

export function isFireDebuffEffect(effect) {
    const fireDebuffStats = new Set(FIRE_DEBUFF_STAT_NAMES);
    return effectStatNames(effect).some(statName => fireDebuffStats.has(statName));
}

export function makeFireDebuffMirror(effect) {
    const mirror = cloneJson(effect);
    mirror.id = effect.id.endsWith('_mirror') ? effect.id : `${effect.id}_mirror`;
    mirror.name = String(effect.name || effect.id).includes('火力計算用')
        ? effect.name
        : `${effect.name || effect.id} (火力計算用)`;
    mirror.target = 'all';

    const description = String(effect.description || '');
    const note = ' / enemyEffects の火力計算用ミラー。';
    mirror.description = description.includes('火力計算用ミラー')
        ? description
        : `${description}${note}`;

    return mirror;
}

export function effectTextSignature(text, minLength = 24) {
    const normalized = normalizeRuleText(text);
    return normalized.slice(0, Math.min(minLength, normalized.length));
}
