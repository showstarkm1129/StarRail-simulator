// ultimateCycle.js — 編成の行動順を使った必殺技回転の最短見積もり。
//
// 敵からの被弾・撃破・確率効果は再現性がないため扱わない。キャラ定義に明示した
// energyEffects と、各ターンで選ぶ行動の EP 獲得量だけを根拠にする。

const DEFAULT_MAX_EVENTS = 10000;
const ACTION_KEYS = Object.freeze(['basic', 'skill', 'enhancedBasic']);

function finite(value, fallback = 0) {
    return Number.isFinite(value) ? value : fallback;
}

function positive(value, fallback = 1) {
    return Math.max(Number.EPSILON, finite(value, fallback));
}

function actionEnergy(character, action) {
    return Math.max(0, finite(character?.skills?.[action]?.energyGain));
}

function fastestAction(character) {
    const available = ACTION_KEYS
        .filter(key => character?.skills?.[key])
        .map(key => ({ key, energy: actionEnergy(character, key) }));
    if (!available.length) return null;
    available.sort((left, right) => right.energy - left.energy || (left.key === 'skill' ? -1 : 1));
    return available[0].key;
}

function normalizeRotation(character, rotation) {
    const requested = Array.isArray(rotation)
        ? rotation.filter(key => ACTION_KEYS.includes(key) && character?.skills?.[key])
        : [];
    if (requested.length) return requested;
    const action = fastestAction(character);
    return action ? [action] : [];
}

function effectAmount(effect, recipient) {
    if (effect?.amount?.kind === 'percentMax') {
        return Math.max(0, finite(effect.amount.value) * finite(recipient.character.maxEnergy));
    }
    return Math.max(0, finite(effect?.amount?.value));
}

function activeEffects(member) {
    return (member.character.energyEffects || []).filter(effect => (
        effect?.trigger === 'ult'
        && (!Number.isInteger(effect.minEidolon) || member.eidolon >= effect.minEidolon)
    ));
}

function recipientsFor(effect, source, members) {
    if (effect.target === 'allOtherAllies') return members.filter(member => member.id !== source.id);
    if (effect.target === 'selectedAllies') {
        const targets = new Set(source.energyTargetIds || []);
        return members.filter(member => member.id !== source.id && targets.has(member.id));
    }
    return [];
}

function gainEnergy(member, amount) {
    const scaled = amount * member.energyRegen;
    member.energy = Math.min(member.maxEnergy, member.energy + scaled);
    return scaled;
}

function castAvailableUlts(member, members, atAV, grants) {
    const cost = positive(member.character.skills?.ult?.energyCost, member.character.maxEnergy);
    while (member.energy + Number.EPSILON >= cost) {
        member.energy -= cost;
        member.ultCount += 1;
        member.ultEvents.push({ atAV, ownTurn: member.turnCount });
        gainEnergy(member, actionEnergy(member.character, 'ult'));
        for (const effect of activeEffects(member)) {
            for (const recipient of recipientsFor(effect, member, members)) {
                const amount = effectAmount(effect, recipient);
                const applied = gainEnergy(recipient, amount);
                grants.push({
                    atAV,
                    sourceId: member.id,
                    sourceName: member.character.name,
                    effectId: effect.id,
                    effectName: effect.name,
                    targetId: recipient.id,
                    amount: Number(applied.toFixed(3)),
                });
            }
        }
    }
}

function publicMember(member) {
    return {
        id: member.id,
        characterId: member.character.id,
        characterName: member.character.name,
        speed: Number(member.speed.toFixed(3)),
        energyRegen: Number(member.energyRegen.toFixed(4)),
        rotation: [...member.rotation],
        eidolon: member.eidolon,
    };
}

/**
 * 指定された編成で、焦点キャラが必殺技を何自身ターンごとに撃てるかを最短条件で計算する。
 * members は Registry 非依存のため、テストでもキャラ定義だけで利用できる。
 *
 * @param {{ focusId: string, members: any[], requiredUltimates?: number, maxEvents?: number }} input
 */
export function estimateUltimateCycle(input) {
    const rawMembers = Array.isArray(input?.members) ? input.members : [];
    if (!rawMembers.length || rawMembers.length > 4) throw new Error('編成は1〜4人で指定してください。');
    const ids = new Set();
    const members = rawMembers.map((raw, index) => {
        const id = String(raw?.id || raw?.character?.id || `member_${index}`);
        if (ids.has(id)) throw new Error(`編成メンバーIDが重複しています: ${id}`);
        ids.add(id);
        if (!raw?.character?.id || !Number.isFinite(raw.character.maxEnergy)) {
            throw new Error(`メンバー ${id} のキャラ定義または最大EPが不足しています。`);
        }
        const rotation = normalizeRotation(raw.character, raw.rotation);
        if (!rotation.length) throw new Error(`${raw.character.name || id} の通常攻撃/戦闘スキルが見つかりません。`);
        return {
            id,
            character: raw.character,
            maxEnergy: raw.character.maxEnergy,
            speed: positive(raw.speed, raw.character.base?.spd || 100),
            energyRegen: positive(raw.energyRegen, 1),
            eidolon: Math.max(0, Math.min(6, Math.floor(finite(raw.eidolon)))),
            energyTargetIds: Array.isArray(raw.energyTargetIds) ? raw.energyTargetIds : [],
            rotation,
            rotationIndex: 0,
            energy: Math.max(0, Math.min(finite(raw.initialEnergy), raw.character.maxEnergy)),
            nextAV: 10000 / positive(raw.speed, raw.character.base?.spd || 100),
            turnCount: 0,
            ultCount: 0,
            ultEvents: [],
        };
    });
    const focus = members.find(member => member.id === input?.focusId);
    if (!focus) throw new Error('focusId が編成メンバーにありません。');

    const requiredUltimates = Math.max(3, Math.min(12, Math.floor(finite(input?.requiredUltimates, 4))));
    const maxEvents = Math.max(requiredUltimates, Math.floor(finite(input?.maxEvents, DEFAULT_MAX_EVENTS)));
    const grants = [];
    let eventCount = 0;
    while (focus.ultEvents.length < requiredUltimates && eventCount < maxEvents) {
        members.sort((left, right) => left.nextAV - right.nextAV || left.id.localeCompare(right.id));
        const actor = members[0];
        const atAV = actor.nextAV;
        actor.turnCount += 1;
        const action = actor.rotation[actor.rotationIndex % actor.rotation.length];
        actor.rotationIndex += 1;
        gainEnergy(actor, actionEnergy(actor.character, action));
        castAvailableUlts(actor, members, atAV, grants);
        actor.nextAV += 10000 / actor.speed;
        eventCount += 1;
    }
    if (focus.ultEvents.length < 2) throw new Error('上限回数内に必殺技サイクルを確定できませんでした。');

    const intervals = focus.ultEvents.slice(1).map((event, index) => ({
        fromUltimate: index + 1,
        toUltimate: index + 2,
        turns: event.ownTurn - focus.ultEvents[index].ownTurn,
        av: Number((event.atAV - focus.ultEvents[index].atAV).toFixed(3)),
    }));
    const turnIntervals = intervals.map(interval => interval.turns);
    return {
        focus: publicMember(focus),
        members: members.map(publicMember),
        assumptions: [
            '各キャラは指定したローテーションを毎ターン実行する。未指定時はEP獲得量が最大の通常攻撃または戦闘スキルを選ぶ。',
            '敵からの被弾、撃破、秘技、確率発動、未登録の固有EP回復は含めない。',
            '登録済みの味方EP供給は、供給者の必殺技が溜まり次第ただちに焦点キャラへ使う。',
            'レベル依存のEP供給は、登録済みの最大レベル値を使用する。',
        ],
        firstUltimate: {
            turns: focus.ultEvents[0].ownTurn,
            atAV: Number(focus.ultEvents[0].atAV.toFixed(3)),
        },
        intervals,
        shortestTurnsPerUltimate: Math.min(...turnIntervals),
        reliableTurnsPerUltimate: Math.max(...turnIntervals),
        averageTurnsPerUltimate: Number((turnIntervals.reduce((sum, value) => sum + value, 0) / turnIntervals.length).toFixed(3)),
        energyGrants: grants.filter(grant => grant.targetId === focus.id),
        simulatedEvents: eventCount,
    };
}
