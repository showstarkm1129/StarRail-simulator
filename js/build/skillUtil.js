// skillUtil.js — スキルレベル解決ヘルパ
//
// キャラの skills[<key>].maxLevel = { default, withEidolon }
// キャラの eidolonsDetail[<n>].levelBoost = { <skillKey>: n }
// を元に、現在の星魂段階での最大Lvを算出する。
//
// 例) ブローニャ:
//   skill.basic.maxLevel = { default: 6, withEidolon: 7 }
//   eidolonsDetail.5.levelBoost = { basic: 1 } → E5解放で basic Lv上限+1
//   eidolonsDetail.3.levelBoost = { ult: 2, talent: 2 } → E3解放で ult/talent +2
//   eidolonsDetail.5.levelBoost.skill = 2 → E5解放で skill +2
//
// 凸進行と Lv 上限が自然連動するよう設計。

export function getSkillMaxLevel(character, skillKey, eidolon) {
    const skill = character?.skills?.[skillKey];
    if (!skill) return null;

    // levels テーブルの長さが絶対上限
    const arrayCap = skill.levels?.length || null;
    if (!skill.maxLevel) return arrayCap;

    let max = skill.maxLevel.default;
    const e = Math.max(0, Math.min(6, eidolon || 0));
    for (let lv = 1; lv <= e; lv++) {
        const boost = character.eidolonsDetail?.[lv]?.levelBoost?.[skillKey];
        if (typeof boost === 'number') max += boost;
    }
    if (arrayCap) max = Math.min(max, arrayCap);
    return max;
}

// 「凸後MAX」= 全星魂解放時の最大Lv
export function getSkillMaxLevelWithEidolon(character, skillKey) {
    return getSkillMaxLevel(character, skillKey, 6);
}

// 「無凸MAX」= 凸進行による Lv 上限拡張前
export function getSkillDefaultMaxLevel(character, skillKey) {
    const skill = character?.skills?.[skillKey];
    return skill?.maxLevel?.default || skill?.levels?.length || null;
}

// 指定 Lv の倍率オブジェクトを返す(範囲外は端にクランプ)
export function getSkillMultAt(skill, level) {
    if (!skill?.levels?.length) return null;
    const idx = Math.max(0, Math.min(skill.levels.length - 1, (level || 1) - 1));
    return skill.levels[idx];
}

// Lv を [1, maxLevel] にクランプ
export function clampLevel(level, maxLevel) {
    if (!maxLevel) return 1;
    return Math.max(1, Math.min(maxLevel, level || 1));
}

// サイト内で入力する軌跡レベルの共通仕様。
// 星魂数とは切り離し、通常攻撃系は Lv7、その他は Lv12 まで許可する。
export function getTraceLevelCap(skillKey) {
    const key = String(skillKey || '').toLowerCase();
    return key.includes('basic') || key.includes('memoryskill') || key.includes('memorytalent')
        ? 7
        : 12;
}

export function getTraceLevelDefault(skillKey) {
    return getTraceLevelCap(skillKey) === 7 ? 6 : 10;
}

export function presetTraceLevels(character) {
    const out = {};
    for (const key of Object.keys(character?.skills || {})) {
        const lowerKey = key.toLowerCase();
        if (lowerKey.includes('basic') || lowerKey.includes('skill')
            || lowerKey.includes('ult') || lowerKey.includes('talent')) {
            out[key] = getTraceLevelDefault(key);
        }
    }
    return out;
}

// すべてのスキルキーで「無凸MAX」を返す { basic, skill, ult, talent }
export function presetDefaultMaxLevels(character) {
    const out = {};
    for (const key of Object.keys(character?.skills || {})) {
        const m = getSkillDefaultMaxLevel(character, key);
        if (m) out[key] = m;
    }
    return out;
}

// すべてのスキルキーで「凸後MAX」を返す
export function presetEidolonMaxLevels(character) {
    const out = {};
    for (const key of Object.keys(character?.skills || {})) {
        const m = getSkillMaxLevelWithEidolon(character, key);
        if (m) out[key] = m;
    }
    return out;
}
