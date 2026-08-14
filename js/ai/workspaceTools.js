// workspaceTools.js — AI が必要なサイト内情報だけを取得するための統合ツール群

import { Registry } from '../build/registry.js';
import { createDiminishingSession } from '../build/diminishingSession.js';
import { createActionOrderSession } from '../build/actionOrderSession.js';
import { createDiminishingTools, DIMINISHING_TOOL_DEFINITIONS } from './diminishingTools.js';
import { createActionOrderTools, ACTION_ORDER_TOOL_DEFINITIONS } from './actionOrderTools.js';
import { validateToolSchema } from './toolSchema.js';

const WORKSPACE_CONTEXT_DEFINITION = Object.freeze({
    name: 'get_workspace_context',
    description: 'AI画面で明示されたシミュレーション対象と保存ビルドの索引を返す。必要なsectionだけ指定し、詳細値が必要な場合だけdetailを上げる。',
    inputSchema: {
        type: 'object',
        properties: {
            sections: {
                type: 'array',
                items: { type: 'string', enum: ['diminishing', 'actionOrder', 'savedBuilds'] },
                description: '取得する情報。省略時は選択中の対象と保存ビルドの短い要約を返す。選択外の対象は返さない。',
            },
            detail: {
                type: 'string',
                enum: ['summary', 'comparison', 'full'],
                description: 'summary=索引、comparison=比較条件、full=画面状態を含む。',
            },
        },
        additionalProperties: false,
    },
});

const READ_SAVED_BUILDS_DEFINITION = Object.freeze({
    name: 'read_saved_builds',
    description: '利用者が保存したビルドをIDまたは名前でまとめて取得する。referencesを省略すると一覧だけを返す。比較対象に必要なビルドだけ指定する。',
    inputSchema: {
        type: 'object',
        properties: {
            references: {
                type: 'array',
                items: { type: 'string' },
                description: '取得する保存ビルドのIDまたは名前。最大8件。',
            },
            detail: {
                type: 'string',
                enum: ['summary', 'full'],
                description: 'summary=装備と主要条件、full=保存JSON全体。',
            },
        },
        additionalProperties: false,
    },
});

const INCLUDED_DIMINISHING_TOOLS = Object.freeze([
    'search_game_data',
    'run_diminishing_comparison',
    'propose_diminishing_changes',
]);

const INCLUDED_ACTION_ORDER_TOOLS = Object.freeze([
    'list_action_order_quick_presets',
    'search_speed_data',
    'list_equippable_lightcones',
    'validate_lightcone_assignment',
    'estimate_ultimate_cycle',
    'search_action_effects',
    'read_build_speed',
    'run_action_order_simulation',
    'propose_action_order_changes',
]);

function definitionsByName(definitions) {
    return new Map(definitions.map(definition => [definition.name, definition]));
}

const DIMINISHING_DEFINITIONS = definitionsByName(DIMINISHING_TOOL_DEFINITIONS);
const ACTION_ORDER_DEFINITIONS = definitionsByName(ACTION_ORDER_TOOL_DEFINITIONS);

export const WORKSPACE_TOOL_DEFINITIONS = Object.freeze([
    WORKSPACE_CONTEXT_DEFINITION,
    READ_SAVED_BUILDS_DEFINITION,
    ...INCLUDED_DIMINISHING_TOOLS.map(name => DIMINISHING_DEFINITIONS.get(name)),
    ...INCLUDED_ACTION_ORDER_TOOLS.map(name => ACTION_ORDER_DEFINITIONS.get(name)),
]);

function normalizeSimulationTarget(value) {
    return value === 'actionOrder' ? 'actionOrder' : 'diminishing';
}

function normalizeAssumptions(source) {
    return {
        objective: String(source?.objective || '').slice(0, 1000),
        battleConditions: Array.isArray(source?.battleConditions) ? source.battleConditions.slice(0, 20) : [],
        effectUptimes: Array.isArray(source?.effectUptimes) ? source.effectUptimes
            .filter(item => item && typeof item.key === 'string')
            .slice(0, 100)
            .map(item => ({
                key: item.key,
                name: String(item.name || '効果'),
                source: String(item.source || ''),
                durationTurns: Math.max(0, Math.min(99, Number(item.durationTurns) || 0)),
            })) : [],
        actionOrderGoal: String(source?.actionOrderGoal || '').slice(0, 1000),
    };
}

function definitionsForTarget(target) {
    const names = target === 'actionOrder' ? INCLUDED_ACTION_ORDER_TOOLS : INCLUDED_DIMINISHING_TOOLS;
    const source = target === 'actionOrder' ? ACTION_ORDER_DEFINITIONS : DIMINISHING_DEFINITIONS;
    return Object.freeze([
        WORKSPACE_CONTEXT_DEFINITION,
        READ_SAVED_BUILDS_DEFINITION,
        ...names.map(name => source.get(name)),
    ]);
}

function availableBuilds(source) {
    const builds = typeof source === 'function' ? source() : source;
    return Array.isArray(builds)
        ? builds.filter(build => build && typeof build === 'object' && build.id && build.characterId)
        : [];
}

function buildSummary(build) {
    const character = Registry.character.get(build.characterId);
    const lightcone = build.lightcone?.id ? Registry.lightcone.get(build.lightcone.id) : null;
    return {
        id: build.id,
        name: build.name || '(無名)',
        characterId: build.characterId,
        characterName: character?.name || build.characterId,
        eidolon: Number(build.eidolon || 0),
        lightcone: lightcone ? {
            id: lightcone.id,
            name: lightcone.name,
            superimpose: Number(build.lightcone?.superimpose || 1),
        } : null,
        traceLevel: build.traceLevel || {},
        relics: Object.fromEntries(Object.entries(build.relics || {}).map(([slot, relic]) => [slot, {
            setId: relic?.setId || null,
            mainStat: relic?.mainStat || null,
            subs: relic?.subs || {},
        }])),
        candidates: {
            lightcone: Array.isArray(build.candidates?.lightcone) ? build.candidates.lightcone : [],
        },
    };
}

function resolveBuild(builds, reference) {
    const normalized = String(reference || '').normalize('NFKC').trim().toLocaleLowerCase('ja');
    const exact = builds.filter(build => [build.id, build.name]
        .some(value => String(value || '').normalize('NFKC').trim().toLocaleLowerCase('ja') === normalized));
    if (exact.length === 1) return { value: exact[0] };
    if (exact.length > 1) return { error: { code: 'AMBIGUOUS_BUILD', message: `保存ビルド「${reference}」を1件に絞れません。IDで指定してください。` } };
    return { error: { code: 'BUILD_NOT_FOUND', message: `保存ビルド「${reference}」が見つかりません。` } };
}

export function createWorkspaceSession(initial = {}) {
    const diminishing = createDiminishingSession(initial.diminishing || {});
    const actionOrder = createActionOrderSession(initial.actionOrder || {});
    let assumptions = normalizeAssumptions(initial.assumptions);
    return Object.freeze({
        diminishing,
        actionOrder,
        restore(payload = {}) {
            diminishing.restore(payload.diminishing || {});
            actionOrder.restore(payload.actionOrder || {});
            assumptions = normalizeAssumptions(payload.assumptions);
        },
        serialize() {
            return {
                diminishing: diminishing.serialize(),
                actionOrder: actionOrder.serialize(),
                assumptions: normalizeAssumptions(assumptions),
            };
        },
    });
}

/**
 * @param {{
 *   session: ReturnType<typeof createWorkspaceSession>,
 *   savedBuilds?: any[] | (() => any[]),
 *   selectedBuildIds?: string[] | (() => string[]),
 *   simulationTarget?: 'diminishing' | 'actionOrder',
 *   allowApply?: boolean,
 * }} options
 */
export function createWorkspaceTools({
    session,
    savedBuilds = [],
    selectedBuildIds = [],
    simulationTarget = 'diminishing',
    allowApply = false,
}) {
    if (!session?.diminishing || !session?.actionOrder) throw new Error('workspace session が必要です。');
    const target = normalizeSimulationTarget(simulationTarget);
    const definitions = definitionsForTarget(target);
    const availableDefinitions = definitionsByName(definitions);
    const getBuilds = () => availableBuilds(savedBuilds);
    const diminishingTools = createDiminishingTools({
        session: session.diminishing,
        savedBuilds: getBuilds,
        allowApply,
    });
    const actionOrderTools = createActionOrderTools({
        session: session.actionOrder,
        savedBuilds: getBuilds,
        allowApply,
    });
    const executionHistory = [];

    const handlers = {
        /** @param {{ sections?: string[], detail?: string }} [args] */
        get_workspace_context({ sections, detail = 'summary' } = {}) {
            const requested = new Set(Array.isArray(sections) && sections.length
                ? sections
                : [target, 'savedBuilds']);
            const output = { ok: true, detail, simulationTarget: target, assumptions: session.serialize().assumptions };
            if (target === 'diminishing' && requested.has('diminishing')) {
                output.diminishing = diminishingTools.execute('get_diminishing_context', {
                    detail: detail === 'summary' ? 'summary' : detail === 'full' ? 'full' : 'comparison',
                });
            }
            if (target === 'actionOrder' && requested.has('actionOrder')) {
                output.actionOrder = actionOrderTools.execute('get_action_order_context', {
                    detail: detail === 'full' ? 'full' : 'summary',
                });
            }
            if (requested.has('savedBuilds')) {
                const builds = getBuilds();
                const selected = new Set((typeof selectedBuildIds === 'function' ? selectedBuildIds() : selectedBuildIds) || []);
                output.savedBuilds = {
                    total: builds.length,
                    selected: builds.filter(build => selected.has(build.id)).map(buildSummary),
                    available: builds.map(build => ({
                        id: build.id,
                        name: build.name || '(無名)',
                        characterId: build.characterId,
                        characterName: Registry.character.get(build.characterId)?.name || build.characterId,
                    })),
                };
            }
            return output;
        },
        read_saved_builds({ references = [], detail = 'summary' } = {}) {
            const builds = getBuilds();
            if (references.length > 8) {
                return { ok: false, error: { code: 'TOO_MANY_BUILDS', message: '一度に取得できる保存ビルドは8件までです。' } };
            }
            if (!references.length) {
                return { ok: true, total: builds.length, builds: builds.map(buildSummary) };
            }
            const resolved = [];
            for (const reference of references) {
                const result = resolveBuild(builds, reference);
                if (result.error) return { ok: false, error: result.error };
                resolved.push(detail === 'full' ? result.value : buildSummary(result.value));
            }
            return { ok: true, total: resolved.length, builds: resolved };
        },
    };

    return Object.freeze({
        definitions,
        execute(name, args = {}) {
            const normalizedArgs = args === undefined ? {} : args;
            const definition = availableDefinitions.get(name);
            if (!definition) return { ok: false, error: { code: 'UNKNOWN_TOOL', message: `未登録のツールです: ${name}` } };
            const errors = validateToolSchema(normalizedArgs, definition.inputSchema);
            if (errors.length) {
                const output = { ok: false, error: { code: 'INVALID_TOOL_ARGUMENTS', message: 'ツール引数が不正です。', details: errors } };
                executionHistory.push({ name, args: normalizedArgs, output, at: new Date().toISOString() });
                return output;
            }
            let output;
            if (handlers[name]) output = handlers[name](normalizedArgs);
            else if (target === 'diminishing') output = diminishingTools.execute(name, normalizedArgs);
            else output = actionOrderTools.execute(name, normalizedArgs);
            executionHistory.push({ name, args: normalizedArgs, output, at: new Date().toISOString() });
            return output;
        },
        getHistory: () => executionHistory.map(item => ({ ...item })),
    });
}
