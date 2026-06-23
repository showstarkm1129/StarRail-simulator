// データ定義の「書式ゆれ」回帰ゲート。
//   全カテゴリ (キャラ / 光円錐 / 遺物 / オーナメント) の全効果 (partyEffects /
//   selfEffects / enemyEffects) を走査し、語彙が許可セットに収まっているか検証する。
//
// この検証スタックは元々「読み込めるか (dataLoad.test.js)」は見ていたが、効果の
//   tickRule / duration / target / source / stat キーの「値」までは見ていなかった。
//   そのため 'turnStart' や 'conditional' のような表記ゆれ、stat キーのタイポが素通り
//   していた。本テストでそれらを npm run verify で赤くする。
//
// 限界:
//   - 「定数を使わず文字列直書きした」こと自体は実行時には検出不可 (値が定数と一致する
//     ため区別できない)。検出できるのは「無効な (= ALL_STAT_KEYS に無い) キー」のみ。
//   - 'conditional' は「条件成立中のみ有効・ターン継続管理なし」を表す正式な語彙として
//     許可している (野良の新表記だけを弾く)。

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STAT, ALL_STAT_KEYS } from '../js/build/statKeys.js';
import { Registry } from '../js/build/registry.js';

import '../js/data/characters/_index.js';
import '../js/data/lightcones/_index.js';
import '../js/data/cavern relics/_index.js';
import '../js/data/planar ornaments/_index.js';

// --- 許可語彙 ---------------------------------------------------------------
const TICK_RULES = new Set(['target_turn_start', 'target_turn_end', 'caster_turn_end', 'none']);
const DURATION_STRINGS = new Set(['permanent', 'conditional']);
const TARGETS = new Set(['all', 'single']);
const SOURCES = new Set(['extra', 'ult', 'skill', 'talent', 'technique', 'eidolon', 'lc', 'set']);
const VALID_STAT_KEYS = new Set(ALL_STAT_KEYS);

// 火力計算 (限界効用逓減) が参照する「敵デバフ枠」。これらが enemyEffects だけにあると
// 火力に反映されないため、partyEffects にもミラーされている必要がある。
/** @type {Set<string>} */
const FIRE_DEBUFF_KEYS = new Set([STAT.DMG_TAKEN, STAT.RES_PEN, STAT.DEF_DOWN, STAT.DEF_IGNORE]);

// --- 効果の収集 -------------------------------------------------------------
// 光円錐は (superimpose) => [] の関数形があるため評価する。重畳は代表値 5 で展開。
function asEffectArray(group, si = 5) {
    if (typeof group === 'function') return group(si) || [];
    if (Array.isArray(group)) return group;
    return [];
}

// 数値チェック用: number か null のみ許容。
//   null は「値は不明だが枠だけ用意している」プレースホルダとして通す。
//   undefined / NaN / 文字列 / オブジェクトは弾く (写し間違い・キー参照ミスの検知)。
function isNumOrNull(v) {
    return v === null || (typeof v === 'number' && !Number.isNaN(v));
}

// effect 内の全 stat キーを集める (stats + stackable.stepValues)。
function statKeysOf(effect) {
    const keys = [];
    if (effect.stats && typeof effect.stats === 'object') {
        keys.push(...Object.keys(effect.stats));
    }
    if (effect.stackable && effect.stackable.stepValues) {
        for (const step of Object.values(effect.stackable.stepValues)) {
            if (step && typeof step === 'object') keys.push(...Object.keys(step));
        }
    }
    return keys;
}

// 全 owner の効果を { ownerLabel, group, effect } 形式で平坦化。
function collectEffects() {
    const out = [];
    const push = (ownerLabel, group, effects) => {
        for (const ef of effects) out.push({ ownerLabel, group, effect: ef });
    };

    // キャラ: partyEffects/selfEffects/enemyEffects は配列。
    for (const ch of Registry.character.list()) {
        for (const g of ['partyEffects', 'selfEffects', 'enemyEffects']) {
            push(`character:${ch.id}`, g, ch[g] || []);
        }
    }
    // 光円錐: 関数 or 配列。
    for (const lc of Registry.lightcone.list()) {
        for (const g of ['partyEffects', 'selfEffects', 'enemyEffects']) {
            push(`lightcone:${lc.id}`, g, asEffectArray(lc[g]));
        }
    }
    // 遺物 / オーナメント: { pc2:[], pc4:[] } 形式。
    const pieceGroups = [...Registry.relicSet.list().map(s => ['relicSet', s]),
        ...Registry.ornament.list().map(o => ['ornament', o])];
    for (const [kind, def] of pieceGroups) {
        for (const g of ['partyEffects', 'selfEffects']) {
            const grp = def[g];
            if (!grp) continue;
            for (const pc of ['pc2', 'pc4']) {
                push(`${kind}:${def.id}`, `${g}.${pc}`, grp[pc] || []);
            }
        }
    }
    return out;
}

const ALL_EFFECTS = collectEffects();

// --- 検証テスト -------------------------------------------------------------
test('収集した効果が1件以上ある (収集ロジックの健全性)', () => {
    assert.ok(ALL_EFFECTS.length > 0, '効果が1件も集まっていない');
});

test('tickRule は許可語彙のみ', () => {
    for (const { ownerLabel, group, effect } of ALL_EFFECTS) {
        if (!('tickRule' in effect)) continue;
        assert.ok(
            TICK_RULES.has(effect.tickRule),
            `${ownerLabel} ${group} [${effect.id}] tickRule='${effect.tickRule}' は許可外 (許可: ${[...TICK_RULES].join(', ')})`
        );
    }
});

test('duration は数値 or 許可文字列のみ', () => {
    for (const { ownerLabel, group, effect } of ALL_EFFECTS) {
        if (!('duration' in effect)) continue;
        const d = effect.duration;
        const ok = typeof d === 'number' || DURATION_STRINGS.has(d);
        assert.ok(
            ok,
            `${ownerLabel} ${group} [${effect.id}] duration='${d}' は許可外 (数値 / ${[...DURATION_STRINGS].join(' / ')})`
        );
    }
});

test('target は all / single のみ', () => {
    for (const { ownerLabel, group, effect } of ALL_EFFECTS) {
        if (!('target' in effect)) continue;
        assert.ok(
            TARGETS.has(effect.target),
            `${ownerLabel} ${group} [${effect.id}] target='${effect.target}' は許可外`
        );
    }
});

test('source は許可語彙のみ', () => {
    for (const { ownerLabel, group, effect } of ALL_EFFECTS) {
        if (!('source' in effect)) continue;
        assert.ok(
            SOURCES.has(effect.source),
            `${ownerLabel} ${group} [${effect.id}] source='${effect.source}' は許可外 (許可: ${[...SOURCES].join(', ')})`
        );
    }
});

test('stat キーはすべて ALL_STAT_KEYS に存在する (タイポ検知)', () => {
    for (const { ownerLabel, group, effect } of ALL_EFFECTS) {
        for (const key of statKeysOf(effect)) {
            assert.ok(
                VALID_STAT_KEYS.has(key),
                `${ownerLabel} ${group} [${effect.id}] stat キー '${key}' は STAT/ELEMENT_DMG_KEYS に存在しない`
            );
        }
    }
});

test('火力枠デバフ (DMG_TAKEN/RES_PEN/DEF_DOWN/DEF_IGNORE) は enemyEffects だけに置かない', () => {
    // owner ごとに、enemyEffects にある火力枠キーが partyEffects 側にもあるか検証。
    // 無いと「火力計算に反映されない敵デバフ」になる (旧 Cipper / 光円錐3件の不具合)。
    /** @type {Map<string, { enemy: Set<string>, party: Set<string> }>} */
    const byOwner = new Map();
    for (const { ownerLabel, group, effect } of ALL_EFFECTS) {
        const bucket = byOwner.get(ownerLabel) || { enemy: new Set(), party: new Set() };
        const fireKeys = statKeysOf(effect).filter(k => FIRE_DEBUFF_KEYS.has(k));
        if (group.startsWith('enemyEffects')) fireKeys.forEach(k => bucket.enemy.add(k));
        if (group.startsWith('partyEffects')) fireKeys.forEach(k => bucket.party.add(k));
        byOwner.set(ownerLabel, bucket);
    }
    for (const [ownerLabel, { enemy, party }] of byOwner) {
        for (const key of enemy) {
            assert.ok(
                party.has(key),
                `${ownerLabel} は火力枠 '${key}' を enemyEffects のみに持つ。partyEffects にミラーしないと火力計算に反映されない`
            );
        }
    }
});

// --- 数値・構造チェック -----------------------------------------------------
// 外部情報源とは照合しない (プロジェクト内の構造整合のみ)。
// 「写し間違いで1段抜けた」「値の型がおかしい」を検知する。

test('スキルの levels 段数が maxLevel.withEidolon 以上ある (段抜け検知)', () => {
    for (const ch of Registry.character.list()) {
        for (const [skillKey, def] of Object.entries(ch.skills || {})) {
            if (!Array.isArray(def.levels)) continue;
            const need = def.maxLevel?.withEidolon;
            if (typeof need !== 'number') continue;
            assert.ok(
                def.levels.length >= need,
                `character:${ch.id} skills.${skillKey} の levels が ${need} 段に満たない (${def.levels.length} 段)。段抜けの可能性`
            );
        }
    }
});

test('スキル levels の各値は数値 (null=値未定の枠は許容)', () => {
    for (const ch of Registry.character.list()) {
        for (const [skillKey, def] of Object.entries(ch.skills || {})) {
            if (!Array.isArray(def.levels)) continue;
            for (const [i, lv] of def.levels.entries()) {
                if (lv === null) continue; // 値不明だが枠だけ用意しているケース
                assert.ok(
                    lv && typeof lv === 'object',
                    `character:${ch.id} skills.${skillKey} levels[${i}] は object か null であるべき (実際: ${typeof lv})`
                );
                for (const [k, v] of Object.entries(lv)) {
                    assert.ok(
                        isNumOrNull(v),
                        `character:${ch.id} skills.${skillKey} levels[${i}].${k}='${v}' が数値でない (number / null のみ)`
                    );
                }
            }
        }
    }
});

test('光円錐の stats は S1〜S5 の5件で各値は数値', () => {
    for (const lc of Registry.lightcone.list()) {
        assert.ok(
            Array.isArray(lc.stats) && lc.stats.length === 5,
            `lightcone:${lc.id} stats は5件(S1〜S5)であるべき (実際: ${Array.isArray(lc.stats) ? lc.stats.length + '件' : typeof lc.stats})`
        );
        for (const [i, s] of (lc.stats || []).entries()) {
            assert.ok(
                s && typeof s === 'object',
                `lightcone:${lc.id} stats[${i}] は object であるべき`
            );
            for (const [k, v] of Object.entries(s)) {
                assert.ok(
                    isNumOrNull(v),
                    `lightcone:${lc.id} stats[${i}].${k}='${v}' が数値でない`
                );
            }
        }
    }
});

// --- 静的ステ枠の stat キー検査 (効果以外も網羅) -----------------------------
// 効果 (partyEffects 等) の stats だけでなく、キャラの traces.stats / eidolons.stats /
// breakdown、光円錐 stats、遺物・オーナメントの pc2/pc4.stats まで stat キーを検査する。
// Castorice の 'dmgQuantum' 直書きはこの traces.stats / breakdown にあったが、従来の
// 効果限定検査では捕捉できなかった穴。
function staticStatKeyBlocks() {
    const out = [];
    const add = (label, statsObj) => {
        if (statsObj && typeof statsObj === 'object') out.push({ label, keys: Object.keys(statsObj) });
    };
    for (const ch of Registry.character.list()) {
        add(`character:${ch.id} traces.stats`, ch.traces?.stats);
        for (const [i, b] of (ch.traces?.breakdown || []).entries()) {
            if (b && 'stat' in b) out.push({ label: `character:${ch.id} traces.breakdown[${i}].stat`, keys: [b.stat] });
        }
        for (const [lv, e] of Object.entries(ch.eidolons || {})) {
            add(`character:${ch.id} eidolons.${lv}.stats`, e?.stats);
        }
    }
    for (const lc of Registry.lightcone.list()) {
        for (const [i, s] of (lc.stats || []).entries()) add(`lightcone:${lc.id} stats[${i}]`, s);
    }
    for (const set of Registry.relicSet.list()) {
        add(`relicSet:${set.id} pc2.stats`, set.pc2?.stats);
        add(`relicSet:${set.id} pc4.stats`, set.pc4?.stats);
    }
    for (const orn of Registry.ornament.list()) {
        add(`ornament:${orn.id} pc2.stats`, orn.pc2?.stats);
        add(`ornament:${orn.id} pc4.stats`, orn.pc4?.stats);
    }
    return out;
}

test('静的ステ枠 (traces/eidolons/breakdown/光円錐/遺物pc) の stat キーが ALL_STAT_KEYS に存在する', () => {
    for (const { label, keys } of staticStatKeyBlocks()) {
        for (const k of keys) {
            assert.ok(
                VALID_STAT_KEYS.has(k),
                `${label}: stat キー '${k}' は STAT/ELEMENT_DMG_KEYS に存在しない (文字列直書き or タイポ)`
            );
        }
    }
});

test('キャラの base は atk/hp/def/spd が数値', () => {
    for (const ch of Registry.character.list()) {
        for (const f of ['atk', 'hp', 'def', 'spd']) {
            assert.ok(
                typeof ch.base?.[f] === 'number',
                `character:${ch.id} base.${f} が数値でない`
            );
        }
    }
});
