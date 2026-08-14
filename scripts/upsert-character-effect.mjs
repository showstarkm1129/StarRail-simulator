#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

import {
    REPO_ROOT,
    findGeneratedCharacterDef,
    isFireDebuffEffect,
    makeFireDebuffMirror,
    upsertEffect,
    writeGeneratedCharacterFile,
} from './character-effect-utils.mjs';

function parseArgs(argv) {
    const options = {
        characterId: null,
        group: null,
        effectJson: null,
        effectFile: null,
        dryRun: false,
        mirrorFireDebuff: false,
        help: false,
    };

    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        if (arg === '--character') {
            options.characterId = argv[++index];
        } else if (arg === '--group') {
            options.group = argv[++index];
        } else if (arg === '--effect') {
            options.effectJson = argv[++index];
        } else if (arg === '--effect-file') {
            options.effectFile = argv[++index];
        } else if (arg === '--dry-run') {
            options.dryRun = true;
        } else if (arg === '--mirror-fire-debuff') {
            options.mirrorFireDebuff = true;
        } else if (arg === '--help' || arg === '-h') {
            options.help = true;
        } else {
            throw new Error(`unknown argument: ${arg}`);
        }
    }

    return options;
}

function printHelp() {
    console.log(`Usage:
  node scripts/upsert-character-effect.mjs --character <id> --group <group> --effect '<json>'
  node scripts/upsert-character-effect.mjs --character <id> --group <group> --effect-file effect.json

Options:
  --character <id>        対象キャラID
  --group <group>         partyEffects / selfEffects / enemyEffects
  --effect <json>         追加・差し替えする効果
  --effect-file <path>    効果JSONをファイルから読む
  --mirror-fire-debuff    enemyEffectsの火力デバフをpartyEffectsにもミラーする
  --dry-run               ファイルを書き換えず結果だけ確認する`);
}

function requireOption(value, name) {
    if (!value) throw new Error(`${name} is required`);
}

function parseEffect(options) {
    if (options.effectJson && options.effectFile) {
        throw new Error('use only one of --effect or --effect-file');
    }
    if (!options.effectJson && !options.effectFile) {
        throw new Error('one of --effect or --effect-file is required');
    }

    const source = options.effectJson
        || fs.readFileSync(path.resolve(REPO_ROOT, options.effectFile), 'utf8');

    try {
        return JSON.parse(source);
    } catch (error) {
        throw new Error(`effect JSON is invalid: ${error.message}`);
    }
}

function relativePath(filePath) {
    return path.relative(REPO_ROOT, filePath);
}

function buildActions(def, group, effect, options) {
    const actions = [upsertEffect(def, group, effect)];

    if (!options.mirrorFireDebuff) return actions;
    if (group !== 'enemyEffects') {
        throw new Error('--mirror-fire-debuff can only be used with --group enemyEffects');
    }
    if (!isFireDebuffEffect(effect)) {
        actions.push({ action: 'skipped', group: 'partyEffects', id: effect.id, reason: 'not a supported fire debuff stat' });
        return actions;
    }

    const mirror = makeFireDebuffMirror(effect);
    actions.push(upsertEffect(def, 'partyEffects', mirror));
    return actions;
}

try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) {
        printHelp();
        process.exit(0);
    }

    requireOption(options.characterId, '--character');
    requireOption(options.group, '--group');

    const effect = parseEffect(options);
    const { filePath, def } = findGeneratedCharacterDef(options.characterId);
    const actions = buildActions(def, options.group, effect, options);

    if (!options.dryRun) writeGeneratedCharacterFile(filePath, def);

    console.log(`${options.dryRun ? 'dry-run' : 'updated'}: ${relativePath(filePath)}`);
    for (const action of actions) {
        const detail = action.reason ? ` (${action.reason})` : '';
        console.log(`  ${action.action}: ${action.group}.${action.id}${detail}`);
    }
} catch (error) {
    console.error(error.message);
    process.exitCode = 1;
}
