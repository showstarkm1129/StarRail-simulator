export const AHA_BASE_SPEED = 80;
export const AHA_SPEED_WEIGHTS = Object.freeze([0.2, 0.1, 0.05, 0.025]);
export const AHA_CHARACTER_SLOTS = AHA_SPEED_WEIGHTS.length;

function normalizeSpeed(value) {
    const speed = Number(value);
    return Number.isFinite(speed) && speed > 0 ? speed : 0;
}

/**
 * 愉悦キャラ4枠を速度順に並べ、アッハの速度と基本行動値を返す。
 * 空欄・不正値・0以下は未設定枠（速度0）として扱う。
 */
export function computeAhaSpeed(characterSpeeds) {
    if (!Array.isArray(characterSpeeds)) {
        throw new TypeError('characterSpeeds must be an array');
    }

    const ranked = Array.from({ length: AHA_CHARACTER_SLOTS }, (_, slotIndex) => ({
        slotIndex,
        speed: normalizeSpeed(characterSpeeds[slotIndex]),
    }))
        .sort((a, b) => (b.speed - a.speed) || (a.slotIndex - b.slotIndex))
        .map((entry, rankIndex) => {
            const weight = AHA_SPEED_WEIGHTS[rankIndex];
            return {
                ...entry,
                rankIndex,
                weight,
                contribution: entry.speed * weight,
            };
        });

    const speed = ranked.reduce(
        (total, entry) => total + entry.contribution,
        AHA_BASE_SPEED,
    );

    return {
        baseSpeed: AHA_BASE_SPEED,
        speed,
        actionValue: 10000 / speed,
        ranked,
    };
}
