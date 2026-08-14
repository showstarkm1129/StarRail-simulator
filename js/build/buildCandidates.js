// buildCandidates.js — 保存ビルドに紐づく差し替え候補の共通形式
//
// 候補は「何を変えるか」ではなく、ビルドへ適用する変更として保存する。
// そのため、光円錐・星魂・遺物・将来追加する候補を同じ仕組みで扱える。
//
// 正式形式:
//   build.candidates.items = [{
//       id: '...',
//       type: 'lightcone' | 'eidolon' | 'relicMain' | 'relic' | '...',
//       label: '表示名',
//       changes: { build: { ...ビルドへの差分... } },
//   }]
//
// 旧形式の candidates.lightcone は読み込み時に items へ取り込み、
// 保存時は互換用の lightcone 配列も残す。既存のJSONを失わないための措置。

function isPlainObject(value) {
    return Boolean(value) && typeof value === 'object'
        && !Array.isArray(value) && !(value instanceof Set);
}

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function stableCandidateSignature(type, buildPatch) {
    return `${type}:${JSON.stringify(buildPatch)}`;
}

function candidateId(type, buildPatch) {
    return `candidate:${stableCandidateSignature(type, buildPatch)}`;
}

function normalizeOneCandidate(raw) {
    if (!isPlainObject(raw)) return null;

    const type = typeof raw.type === 'string' && raw.type.trim()
        ? raw.type.trim()
        : 'custom';
    const rawChanges = isPlainObject(raw.changes)
        ? raw.changes
        : isPlainObject(raw.patch) ? raw.patch : null;
    if (!rawChanges) return null;

    // 共通形式は changes.build。旧式/簡略式で changes 直下にビルド項目が
    // 置かれていても受け入れ、正規化後は必ず同じ形に揃える。
    const buildPatch = isPlainObject(rawChanges.build)
        ? rawChanges.build
        : rawChanges;
    if (!isPlainObject(buildPatch)) return null;

    const id = typeof raw.id === 'string' && raw.id.trim()
        ? raw.id.trim()
        : candidateId(type, buildPatch);
    const normalized = {
        id,
        type,
        changes: { build: clone(buildPatch) },
    };
    if (typeof raw.label === 'string' && raw.label.trim()) normalized.label = raw.label.trim();
    if (typeof raw.description === 'string' && raw.description.trim()) {
        normalized.description = raw.description.trim();
    }
    return normalized;
}

function legacyLightconeCandidate(raw) {
    if (!isPlainObject(raw) || typeof raw.id !== 'string' || !raw.id.trim()) return null;
    const superimpose = Math.max(1, Math.min(5, Number(raw.superimpose) || 1));
    return normalizeOneCandidate({
        id: `lightcone:${raw.id}::${superimpose}`,
        type: 'lightcone',
        label: `${raw.id} S${superimpose}`,
        changes: { build: { lightcone: { id: raw.id, superimpose } } },
    });
}

function lightconeValueOf(candidate) {
    const lightcone = candidate?.changes?.build?.lightcone;
    if (!isPlainObject(lightcone) || typeof lightcone.id !== 'string' || !lightcone.id) return null;
    return {
        id: lightcone.id,
        superimpose: Math.max(1, Math.min(5, Number(lightcone.superimpose) || 1)),
    };
}

/**
 * @param {any} raw
 * @returns {{items: any[], lightcone: any[]}}
 */
export function normalizeCandidateCollection(raw = {}) {
    const source = isPlainObject(raw) ? raw : {};
    const rawItems = [];
    if (Array.isArray(source.items)) rawItems.push(...source.items);
    // variants は試験的に存在した形式も受け入れる。今後の移行余地を残す。
    if (Array.isArray(source.variants)) rawItems.push(...source.variants);
    if (Array.isArray(source.lightcone)) {
        rawItems.push(...source.lightcone.map(legacyLightconeCandidate).filter(Boolean));
    }

    const items = [];
    const seenIds = new Set();
    const seenSignatures = new Set();
    for (const rawItem of rawItems) {
        const item = normalizeOneCandidate(rawItem);
        if (!item) continue;
        const signature = stableCandidateSignature(item.type, item.changes.build);
        if (seenIds.has(item.id) || seenSignatures.has(signature)) continue;
        seenIds.add(item.id);
        seenSignatures.add(signature);
        items.push(item);
    }

    const lightcone = [];
    const seenLightcones = new Set();
    for (const item of items) {
        const value = lightconeValueOf(item);
        if (!value) continue;
        const key = `${value.id}::${value.superimpose}`;
        if (seenLightcones.has(key)) continue;
        seenLightcones.add(key);
        lightcone.push(value);
    }
    return { items, lightcone };
}

/**
 * ビルド全体を候補保存形式へ正規化する。
 * 候補が一件もない旧ビルドは candidates.lightcone だけを残し、
 * 既存JSONとの完全一致をできるだけ保つ。
 */
export function normalizeBuildCandidates(build) {
    if (!isPlainObject(build)) return build;
    const source = isPlainObject(build.candidates) ? build.candidates : {};
    const normalized = normalizeCandidateCollection(source);
    const hadGenericField = Array.isArray(source.items) || Array.isArray(source.variants);
    const hadLegacyCandidates = Array.isArray(source.lightcone) && source.lightcone.length > 0;

    if (normalized.items.length === 0 && !hadGenericField && !hadLegacyCandidates) {
        return { ...build, candidates: { lightcone: [] } };
    }
    return {
        ...build,
        candidates: {
            items: normalized.items,
            lightcone: normalized.lightcone,
        },
    };
}

/** @param {any} build */
export function getBuildCandidates(build) {
    return normalizeCandidateCollection(build?.candidates).items;
}

/**
 * 候補をビルドへ追加する。重複時は既存候補を返し、入力ビルドを直接更新する。
 * @param {any} build
 * @param {{id?: string, type?: string, label?: string, description?: string, changes?: any, patch?: any}} raw
 */
export function addBuildCandidate(build, raw) {
    if (!build || typeof build !== 'object') throw new Error('候補を追加するビルドがありません。');
    const current = normalizeCandidateCollection(build.candidates);
    const candidate = normalizeOneCandidate(raw);
    if (!candidate) throw new Error('差分候補の形式が不正です。');
    const signature = stableCandidateSignature(candidate.type, candidate.changes.build);
    const existing = current.items.find(item => item.id === candidate.id
        || stableCandidateSignature(item.type, item.changes.build) === signature);
    if (existing) {
        build.candidates = { items: current.items, lightcone: current.lightcone };
        return existing;
    }
    const items = [...current.items, candidate];
    build.candidates = {
        items,
        lightcone: items.map(lightconeValueOf).filter(Boolean).filter((value, index, values) =>
            values.findIndex(item => item.id === value.id && item.superimpose === value.superimpose) === index),
    };
    return candidate;
}

/** @param {any} build @param {string} id */
export function removeBuildCandidate(build, id) {
    if (!build || typeof build !== 'object') return false;
    const current = normalizeCandidateCollection(build.candidates);
    const items = current.items.filter(item => item.id !== id);
    if (items.length === current.items.length) return false;
    build.candidates = {
        items,
        lightcone: items.map(lightconeValueOf).filter(Boolean).filter((value, index, values) =>
            values.findIndex(item => item.id === value.id && item.superimpose === value.superimpose) === index),
    };
    return true;
}

/**
 * 候補を「同時に選べる単位」へ分類する。
 *
 * 同じ部位のメインステ候補と遺物候補は同時に適用できないため、
 * 同じグループにまとめる。一方、光円錐と重畳、頭部と胴体などは
 * 別グループとして組み合わせられるようにする。
 * @param {any} candidate
 * @returns {string}
 */
export function candidateGroupKey(candidate) {
    const patch = candidate?.changes?.build || candidate?.changes || {};
    if (isEidolonCandidate(candidate)) return 'eidolon';
    if (candidate?.type === 'traceLevel' || patch.traceLevel) return 'traceLevel';
    if (candidate?.type === 'substats' || patch.subsInput) return 'substats';
    if (candidate?.type === 'superimpose'
        || (patch.lightcone && patch.lightcone.superimpose !== undefined
            && patch.lightcone.id === undefined)) return 'superimpose';
    if (candidate?.type === 'lightcone' || patch.lightcone?.id !== undefined) return 'lightcone';

    const relicSlots = Object.keys(patch.relics || {});
    if (relicSlots.length === 1) return `relic:${relicSlots[0]}`;
    if (relicSlots.length > 1) return `relic:${relicSlots.sort().join(',')}`;
    return `type:${candidate?.type || 'custom'}`;
}

/**
 * 候補の changes.build を深く適用したビルドを返す。元ビルドは変更しない。
 * @param {any} build
 * @param {any} candidate
 */
export function applyBuildCandidate(build, candidate) {
    const next = clone(build);
    const patch = candidate?.changes?.build || candidate?.changes || {};
    const merge = (target, source) => {
        for (const [key, value] of Object.entries(source || {})) {
            if (isPlainObject(value)) {
                const base = isPlainObject(target[key]) ? target[key] : {};
                target[key] = merge(base, value);
            } else {
                target[key] = clone(value);
            }
        }
        return target;
    };
    return merge(next, patch);
}

/**
 * 星魂を変更する候補は、単一の火力増加率ランキングから除外する。
 * 星魂は能力改変・追加・行動変化などを含み、1つの係数にまとめると
 * 実際の価値を誤って表現するため。候補の選択・適用自体は引き続き可能。
 * @param {any} candidate
 */
export function isEidolonCandidate(candidate) {
    if (!candidate || typeof candidate !== 'object') return false;
    if (candidate.type === 'eidolon' || candidate.eidolon !== undefined) return true;
    return Object.prototype.hasOwnProperty.call(candidate.changes?.build || {}, 'eidolon');
}

/** @param {any} candidate */
export function candidateLabel(candidate) {
    if (isEidolonCandidate(candidate)) {
        const eidolon = Number(candidate?.eidolon ?? candidate?.changes?.build?.eidolon);
        if (Number.isInteger(eidolon) && eidolon >= 0 && eidolon <= 6) return `E${eidolon}`;
    }
    return candidate?.label || candidate?.description || candidate?.id || '差分候補';
}
