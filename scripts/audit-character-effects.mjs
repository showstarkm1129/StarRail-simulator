#!/usr/bin/env node

import path from 'node:path';

import {
    EFFECT_RULE_SUPPORT,
    classifyEffectText,
    isUnsupportedRule,
    normalizeRuleText,
} from '../js/data/characters/effectRules.js';
import {
    REPO_ROOT,
    collectCharacterEffects,
    collectCharacterSections,
    effectStatNames,
    effectTextSignature,
    loadGeneratedCharacterDefs,
} from './character-effect-utils.mjs';

const BLOCKING_UNSUPPORTED_RULE_IDS = new Set([
    'elation_degree',
    'super_break',
    'break_efficiency',
    'break_damage_taken',
    'dot_only',
    'fixed_damage',
    'field_movement',
    'summon_only',
]);

function parseArgs(argv) {
    const options = {
        characterId: null,
        includeSkipped: false,
        json: false,
        failOnCandidates: false,
        showCovered: false,
        max: 80,
        help: false,
    };

    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        if (arg === '--character') {
            options.characterId = argv[++index];
        } else if (arg === '--include-skipped') {
            options.includeSkipped = true;
        } else if (arg === '--json') {
            options.json = true;
        } else if (arg === '--fail-on-candidates') {
            options.failOnCandidates = true;
        } else if (arg === '--show-covered') {
            options.showCovered = true;
        } else if (arg === '--max') {
            options.max = Number(argv[++index]);
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
  node scripts/audit-character-effects.mjs [--character <id>] [--json]

Options:
  --character <id>       指定キャラだけ点検する
  --include-skipped      手書き/テスト用キャラも対象に含める
  --show-covered         既に効果棚で拾えている項目も表示する
  --fail-on-candidates   未実装候補がある時に失敗扱いにする
  --max <n>              通常表示する候補/メモの最大件数 (default: 80)
  --json                 機械読み取り用にJSONで出力する`);
}

function compact(text, limit = 140) {
    const oneLine = String(text || '').replace(/\s+/g, ' ').trim();
    return oneLine.length > limit ? `${oneLine.slice(0, limit - 1)}...` : oneLine;
}

function relativePath(filePath) {
    return path.relative(REPO_ROOT, filePath);
}

function inferPreferredGroup(ruleDef, section) {
    if (ruleDef.preferredGroup === 'partyEffects') return 'partyEffects';

    const text = normalizeRuleText(section.description);
    if (/味方全体|味方キャラ|味方の|指定した味方|味方単体|そのキャラ|所持しているキャラ|共に舞う者/.test(text)) {
        return 'partyEffects';
    }

    return 'selfEffects';
}

function nameMatches(section, effect) {
    const effectName = normalizeRuleText(effect.name);
    const sectionName = normalizeRuleText(section.name);
    if (!effectName || !sectionName) return false;
    return effectName.includes(sectionName) || sectionName.includes(effectName);
}

function descriptionOverlaps(section, effect) {
    const sectionText = normalizeRuleText(section.description);
    const effectText = normalizeRuleText(effect.description);
    if (!sectionText || !effectText) return false;

    const sectionSig = effectTextSignature(sectionText, 24);
    const effectSig = effectTextSignature(effectText, 24);
    return sectionText.includes(effectSig) || effectText.includes(sectionSig);
}

function sourceMatches(section, effect) {
    if (section.kind === 'eidolon') {
        return effect.source === 'eidolon'
            && (
                effect.minEidolon === section.minEidolon
                || String(effect.id || '').startsWith(`e${section.minEidolon}_`)
            );
    }

    if (section.kind === 'extra') {
        return effect.source === 'extra'
            && (
                effect.name === section.name
                || String(effect.id || '').includes(`extra${section.tier}`)
            );
    }

    return effect.source === section.source
        || effect.fromLevel === section.source
        || String(effect.id || '').startsWith(`${section.source}_`);
}

function effectCoversRule(groupedEffect, section, ruleDef, preferredGroup) {
    if (groupedEffect.group !== preferredGroup) return false;

    const statNames = effectStatNames(groupedEffect.effect);
    if (!statNames.some(statName => ruleDef.stats.includes(statName))) return false;

    return sourceMatches(section, groupedEffect.effect)
        || nameMatches(section, groupedEffect.effect)
        || descriptionOverlaps(section, groupedEffect.effect);
}

function hasBlockingUnsupportedRule(matchedRules) {
    return matchedRules.some(ruleDef => BLOCKING_UNSUPPORTED_RULE_IDS.has(ruleDef.id));
}

function auditCharacter(entry) {
    const { def, filePath } = entry;
    const effects = collectCharacterEffects(def);
    const candidates = [];
    const unsupported = [];
    const covered = [];

    for (const section of collectCharacterSections(def)) {
        const matchedRules = classifyEffectText(section.description);
        const unsupportedRules = matchedRules.filter(isUnsupportedRule);
        const supportedRules = matchedRules.filter(ruleDef => ruleDef.support === EFFECT_RULE_SUPPORT.SUPPORTED);
        const blocksSupportedRules = hasBlockingUnsupportedRule(unsupportedRules);

        for (const ruleDef of unsupportedRules) {
            unsupported.push({
                characterId: def.id,
                characterName: def.name,
                file: relativePath(filePath),
                section: section.label,
                rule: ruleDef.id,
                label: ruleDef.label,
                reason: ruleDef.reason,
                futureShape: ruleDef.futureShape,
                text: section.description,
            });
        }

        if (blocksSupportedRules) continue;

        for (const ruleDef of supportedRules) {
            const preferredGroup = inferPreferredGroup(ruleDef, section);
            const implemented = effects.some(effect => effectCoversRule(effect, section, ruleDef, preferredGroup));
            const item = {
                characterId: def.id,
                characterName: def.name,
                file: relativePath(filePath),
                section: section.label,
                rule: ruleDef.id,
                label: ruleDef.label,
                stats: ruleDef.stats,
                preferredGroup,
                text: section.description,
            };

            if (implemented) covered.push(item);
            else candidates.push(item);
        }
    }

    return { candidates, unsupported, covered };
}

function buildReport(options) {
    const { entries, skipped, parseErrors } = loadGeneratedCharacterDefs({
        characterId: options.characterId,
        includeSkipped: options.includeSkipped,
    });
    const report = {
        checkedCharacters: entries.length,
        skippedFiles: skipped.length,
        parseErrors: parseErrors.map(entry => ({
            file: relativePath(entry.filePath),
            id: entry.id,
            message: entry.error.message,
        })),
        candidates: [],
        unsupported: [],
        covered: [],
    };

    for (const entry of entries) {
        const characterReport = auditCharacter(entry);
        report.candidates.push(...characterReport.candidates);
        report.unsupported.push(...characterReport.unsupported);
        report.covered.push(...characterReport.covered);
    }

    return report;
}

function printTextReport(report, options) {
    console.log('Character effect audit');
    console.log(`characters: ${report.checkedCharacters}`);
    console.log(`supported candidates: ${report.candidates.length}`);
    console.log(`unsupported notes: ${report.unsupported.length}`);
    if (report.parseErrors.length > 0) console.log(`parse errors: ${report.parseErrors.length}`);
    console.log('');

    for (const item of report.candidates.slice(0, options.max)) {
        console.log(`[candidate] ${item.characterName} (${item.characterId}) ${item.section}`);
        console.log(`  group: ${item.preferredGroup}`);
        console.log(`  rule: ${item.label} (${item.rule})`);
        console.log(`  stats: ${item.stats.join(', ')}`);
        console.log(`  text: ${compact(item.text)}`);
    }

    if (report.candidates.length > options.max) {
        console.log(`... ${report.candidates.length - options.max} more candidates`);
    }

    for (const item of report.unsupported.slice(0, options.max)) {
        console.log(`[unsupported] ${item.characterName} (${item.characterId}) ${item.section}`);
        console.log(`  rule: ${item.label} (${item.rule})`);
        console.log(`  reason: ${item.reason}`);
        console.log(`  future: ${item.futureShape}`);
        console.log(`  text: ${compact(item.text)}`);
    }

    if (report.unsupported.length > options.max) {
        console.log(`... ${report.unsupported.length - options.max} more unsupported notes`);
    }

    if (options.showCovered) {
        for (const item of report.covered.slice(0, options.max)) {
            console.log(`[covered] ${item.characterName} (${item.characterId}) ${item.section}`);
            console.log(`  group: ${item.preferredGroup}`);
            console.log(`  rule: ${item.label} (${item.rule})`);
        }
    }
}

try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) {
        printHelp();
        process.exit(0);
    }

    const report = buildReport(options);
    if (options.json) console.log(JSON.stringify(report, null, 2));
    else printTextReport(report, options);

    if (options.failOnCandidates && report.candidates.length > 0) process.exitCode = 1;
} catch (error) {
    console.error(error.message);
    process.exitCode = 1;
}
