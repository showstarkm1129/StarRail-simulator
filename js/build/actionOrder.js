// actionOrder.js — 行動順シミュの DOM 非依存な計算・正規化層
//
// 行動順タブ (speed.js) と AI ツール (ai/actionOrderTools.js) の双方から同じ計算を使うため、
// 画面描画から切り離して純関数だけをここに集約する。
// 火力計算は一切扱わない (速度・行動値のみ)。

export const ACTION_ORDER_STATE_SCHEMA = 'srsim.speedAdvanced.v1';

/** バフイベントの種類定義 (ラベルと既定値を一元管理) */
export const EVENT_TYPES = Object.freeze({
    advance:   { label: '行動値短縮 (%)',   def: 25 },
    speedFlat: { label: '速度増加 (固定)',  def: 20 },
    speedPct:  { label: '速度増加 (%基礎)', def: 12 },
});

export const EVENT_TYPE_KEYS = Object.freeze(Object.keys(EVENT_TYPES));

/** 発動タイミング: turn = そのターン開始からの経過AV / cum = 戦闘開始からの累計AV / panel = 他パネルの指定ターン到達AVに追従 */
export const EVENT_TIMINGS = Object.freeze(['turn', 'cum', 'panel']);

export const PANEL_DEFAULTS = Object.freeze({
    baseSpeed: 100,
    preSpeed: 134,
    threshold: 150,
});

/** AI へ渡す量を含め、クイック追加の保存件数を現実的な範囲に抑える。 */
export const MAX_QUICK_PRESETS = 100;
const MAX_QUICK_PRESET_TEXT_LENGTH = 2000;

/** タイムラインが閾値超過後に追加で表示するターン数 */
const TURNS_AFTER_THRESHOLD = 3;
/** 無限ループ防止 */
const MAX_TURNS = 200;
const MAX_EVENT_STEPS = 2000;
const EPS = 1e-9;

export function normalizeNumber(value, fallback, minValue) {
    const n = parseFloat(value);
    if (!Number.isFinite(n)) return fallback;
    return minValue === undefined ? n : Math.max(minValue, n);
}

export function normalizeEvent(raw) {
    const source = raw && typeof raw === 'object' ? raw : {};
    const type = EVENT_TYPES[source.type] ? source.type : 'advance';
    const timing = (source.timing === 'cum' || source.timing === 'panel') ? source.timing : 'turn';
    return {
        type,
        value: normalizeNumber(source.value, EVENT_TYPES[type].def),
        name: typeof source.name === 'string' ? source.name : '',
        timing,
        offset: normalizeNumber(source.offset, 0, 0),
        atAV: normalizeNumber(source.atAV, 100, 0),
        refPanel: Math.max(0, Math.round(normalizeNumber(source.refPanel, 0, 0))),
        refTurn: Math.max(1, Math.round(normalizeNumber(source.refTurn, 1, 1))),
    };
}

/**
 * ユーザー登録のクイック追加。計算イベントと同じ値の正規化を行うが、
 * memo は計算には使わず、AI へ渡す利用者の前提情報としてだけ保持する。
 */
export function normalizeQuickPreset(raw) {
    const source = raw && typeof raw === 'object' ? raw : {};
    const id = typeof source.id === 'string' ? source.id.trim() : '';
    if (!id) return null;
    const type = EVENT_TYPES[source.type] ? source.type : 'advance';
    const name = typeof source.name === 'string' ? source.name.slice(0, MAX_QUICK_PRESET_TEXT_LENGTH) : '';
    const label = typeof source.label === 'string' && source.label.trim()
        ? source.label.slice(0, MAX_QUICK_PRESET_TEXT_LENGTH)
        : name.trim() || evAutoLabel({ type, value: normalizeNumber(source.value, EVENT_TYPES[type].def) });
    return {
        id,
        type,
        value: normalizeNumber(source.value, EVENT_TYPES[type].def),
        name,
        label,
        memo: typeof source.memo === 'string' ? source.memo.slice(0, MAX_QUICK_PRESET_TEXT_LENGTH) : '',
    };
}

export function normalizeQuickPresets(presets) {
    if (!Array.isArray(presets)) return [];
    const seen = new Set();
    return presets
        .map(normalizeQuickPreset)
        .filter((preset) => {
            if (!preset || seen.has(preset.id)) return false;
            seen.add(preset.id);
            return true;
        })
        .slice(0, MAX_QUICK_PRESETS);
}

export function normalizeTurns(turns) {
    if (!Array.isArray(turns)) return [];
    return turns.map((turn) => ({
        events: Array.isArray(turn && turn.events)
            ? turn.events.map(normalizeEvent)
            : [],
    }));
}

/** 末尾の空ターンを落とす (保存時に無駄なターンを残さない) */
export function trimEmptyTrailingTurns(turns) {
    const trimmed = normalizeTurns(turns);
    while (trimmed.length > 0 && trimmed[trimmed.length - 1].events.length === 0) {
        trimmed.pop();
    }
    return trimmed;
}

/** 保存・計算で使うパネル形へ整える。名前が空なら index から既定名を付ける。 */
export function normalizePanel(raw, index = 0) {
    const source = raw && typeof raw === 'object' ? raw : {};
    const name = typeof source.name === 'string' && source.name.trim()
        ? source.name
        : `キャラ${index + 1}`;
    return {
        name,
        baseSpeed: normalizeNumber(source.baseSpeed, PANEL_DEFAULTS.baseSpeed, 1),
        preSpeed: normalizeNumber(source.preSpeed, PANEL_DEFAULTS.preSpeed, 1),
        threshold: normalizeNumber(source.threshold, PANEL_DEFAULTS.threshold, 1),
        turns: normalizeTurns(source.turns),
    };
}

/** 画面パネル (DOM 参照込み) を保存用の素データへ落とす */
export function serializePanel(panel) {
    const source = panel && typeof panel === 'object' ? panel : {};
    return {
        name: source.name || '',
        baseSpeed: normalizeNumber(source.baseSpeed, PANEL_DEFAULTS.baseSpeed, 1),
        preSpeed: normalizeNumber(source.preSpeed, PANEL_DEFAULTS.preSpeed, 1),
        threshold: normalizeNumber(source.threshold, PANEL_DEFAULTS.threshold, 1),
        turns: trimEmptyTrailingTurns(source.turns),
    };
}

export function buildStatePayload(panels, mode) {
    return {
        schema: ACTION_ORDER_STATE_SCHEMA,
        mode: mode === 'panel' ? 'panel' : 'all',
        exportedAt: new Date().toISOString(),
        panels: (Array.isArray(panels) ? panels : []).map(serializePanel),
    };
}

/**
 * 保存形式を受け取り {mode, panels} へ正規化する。
 * 配列直書き / {panels:[...]} / {panel:{...}} の3形式を受け付ける (旧データ互換)。
 */
export function normalizeState(parsed) {
    const root = parsed && typeof parsed === 'object' ? parsed : {};
    const panelsRaw = Array.isArray(parsed)
        ? parsed
        : Array.isArray(root.panels)
            ? root.panels
            : root.panel
                ? [root.panel]
                : null;
    if (!panelsRaw || panelsRaw.length === 0) {
        throw new Error('panels が見つかりません。');
    }
    return {
        mode: root.mode === 'panel' || root.panel ? 'panel' : 'all',
        panels: panelsRaw.map((raw, index) => normalizePanel(raw, index)),
    };
}

export function parseStateText(text) {
    return normalizeState(JSON.parse(text));
}

// ---- イベント参照ヘルパ (旧データへの後方互換デフォルト込み) ----
export function evTiming(ev) {
    if (ev.timing === 'cum') return 'cum';
    if (ev.timing === 'panel') return 'panel';
    return 'turn';
}
export function evOffset(ev) { return Number.isFinite(ev.offset) ? ev.offset : 0; }
export function evAtAV(ev)   { return Number.isFinite(ev.atAV) ? ev.atAV : 0; }
/** timing=panel のとき、参照先パネルの index (0始まり) */
export function evRefPanel(ev) { return Number.isFinite(ev.refPanel) ? Math.max(0, Math.round(ev.refPanel)) : 0; }
/** timing=panel のとき、参照先パネルのターン番号 (1始まり) */
export function evRefTurn(ev)  { return Number.isFinite(ev.refTurn) && ev.refTurn >= 1 ? Math.round(ev.refTurn) : 1; }

export function evAutoLabel(ev) {
    if (ev.type === 'advance') return `短縮${ev.value}%`;
    if (ev.type === 'speedFlat') return `速度+${ev.value}`;
    return `速度+${ev.value}%`;
}

/** 表示名: カスタム名があればそれ、無ければ自動ラベル */
export function evLabel(ev) {
    return (ev.name && ev.name.trim()) ? ev.name.trim() : evAutoLabel(ev);
}

// ---- シミュレーション本体 ----
// 1ターン分の行動を「ゲージ充填」で計算する。
//   ゲージ 0→10000 を speed (AV毎の充填量) で満たす。
//   行動値短縮 = ゲージへ即時加算 (value% × 10000)。
//   速度増加   = それ以降の充填速度を上げる。
//   各イベントは offset(発動AV: ターン開始からの経過AV) の時点で適用。
//   ※ offset=0 なら「ターン最初に全適用」と一致する。
//   effective: [{ ev, offset }] (各効果を「このターン開始からの発動AV(offset)」へ正規化済み)
//   返り値: { actualAV(実消費AV), endSpeed, startSpeed, fired[](各イベントが発動したか) }
export function simulateTurn(panel, effective) {
    const base = panel.baseSpeed > 0 ? panel.baseSpeed : 1;
    const startSpeed = panel.preSpeed > 0 ? panel.preSpeed : 1;

    // offset昇順に処理。元のindexを保持して発動有無を返す。
    const indexed = effective.map((e, i) => ({ e, i }));
    indexed.sort((a, b) => a.e.offset - b.e.offset);
    const fired = new Array(effective.length).fill(false);

    let speed = startSpeed;
    let gauge = 0;
    let elapsed = 0;
    let k = 0;
    let guard = 0;

    while (guard++ < MAX_EVENT_STEPS) {
        const remaining = 10000 - gauge;
        if (remaining <= EPS) break; // 行動値短縮でゲージが満タンに達した

        const avToComplete = remaining / speed;
        const completionElapsed = elapsed + avToComplete;
        const nextOffset = k < indexed.length ? indexed[k].e.offset : Infinity;

        if (completionElapsed <= nextOffset + EPS) {
            // 次イベントより先に行動が完了
            elapsed = completionElapsed;
            break;
        }

        // 次イベントの発動AVまでゲージを進める
        gauge += speed * (nextOffset - elapsed);
        elapsed = nextOffset;

        // 同じ offset のイベントをまとめて適用
        while (k < indexed.length && indexed[k].e.offset <= nextOffset + EPS) {
            const { e, i } = indexed[k];
            const ev = e.ev;
            fired[i] = true;
            if (ev.type === 'advance')        gauge += (ev.value / 100) * 10000;
            else if (ev.type === 'speedFlat') speed += ev.value;
            else if (ev.type === 'speedPct')  speed += base * (ev.value / 100);
            speed = Math.max(1, speed);
            k++;
        }
    }

    return { actualAV: elapsed, endSpeed: speed, startSpeed, fired };
}

/**
 * 各ターンの計算結果を行データの配列として返す。DOM/テキストは呼び出し側で組み立てる。
 * 入力の panel は変更しない (足りないターンは空ターン扱いで読む)。
 *   返り値: { threshold, turnCount, rows: [{ turn, chips:[{ev,kind,notFired}], sim, actualAV,
 *             cumulativeAV, speedChanged, pastThreshold, drawWallBefore }], unresolvedRefs }
 *   turnCount は「表示に必要なターン数」。画面側で panel.turns を伸ばす判断に使う。
 *   options.resolvePanelRef: timing=panel のイベントを渡すと、発動基準となる累計AV(数値)を返す関数。
 *     省略時 (単体パネル計算) は timing=panel のイベントは発動しない。複数パネルをまたぐ解決は computeAllTimelines を使う。
 */
export function computeTimeline(panel, options) {
    const resolvePanelRef = options && typeof options.resolvePanelRef === 'function' ? options.resolvePanelRef : null;
    const threshold = panel.threshold > 0 ? panel.threshold : PANEL_DEFAULTS.threshold;
    const panelTurns = Array.isArray(panel.turns) ? panel.turns : [];

    // パネル全体で「特定の累計AVに発動する」バフを収集 (累計AV直接指定 / 他パネル参照の両方をまとめて扱う)。
    // panel参照は resolvePanelRef で解決できなければ atAV=undefined のまま残り、発動しない。
    const avPool = [];
    panelTurns.forEach((td) => {
        (td?.events || []).forEach((ev) => {
            const timing = evTiming(ev);
            if (timing === 'cum') {
                avPool.push({ ev, kind: 'cum', fired: false, atAV: evAtAV(ev) });
            } else if (timing === 'panel') {
                avPool.push({ ev, kind: 'panel', fired: false, atAV: resolvePanelRef ? resolvePanelRef(ev) : undefined });
            }
        });
    });

    const rows = [];
    let cumulativeAV = 0;
    let turn = 0;
    let turnsPastThreshold = 0;
    let hasDrawnWall = false;

    while (turnsPastThreshold < TURNS_AFTER_THRESHOLD) {
        const turnData = panelTurns[turn] || { events: [] };
        const cumStart = cumulativeAV;

        // このターンに効く効果を effective list へ正規化
        //   turn効果: offset そのまま / avPool効果: offset = atAV - cumStart (未発動かつ atAV>=cumStart のもの)
        const effective = [];
        (turnData.events || []).forEach((ev) => {
            if (evTiming(ev) === 'turn') effective.push({ ev, offset: evOffset(ev), kind: 'turn' });
        });
        avPool.forEach((c) => {
            if (!c.fired && c.atAV !== undefined && c.atAV >= cumStart - EPS) {
                effective.push({ ev: c.ev, offset: Math.max(0, c.atAV - cumStart), kind: c.kind, cumRef: c });
            }
        });

        const sim = simulateTurn(panel, effective);
        const actualAV = sim.actualAV;

        // 発動した avPool 効果をプール側に記録 (以降のターンで再適用しない)
        effective.forEach((e, idx) => { if (e.cumRef && sim.fired[idx]) e.cumRef.fired = true; });

        // サマリ: turn効果(不発含む) + このターンで発動した avPool効果(cum/panel)のみ
        const chips = [];
        effective.forEach((e, idx) => {
            if (e.kind === 'turn') chips.push({ ev: e.ev, kind: 'turn', notFired: !sim.fired[idx] });
            else if (e.cumRef && sim.fired[idx]) chips.push({ ev: e.ev, kind: e.kind, notFired: false });
        });

        let drawWallBefore = false;
        if (!hasDrawnWall && (cumulativeAV + actualAV) > threshold) {
            drawWallBefore = true;
            hasDrawnWall = true;
        }
        cumulativeAV += actualAV;
        if (cumulativeAV > threshold) turnsPastThreshold++;

        rows.push({
            turn: turn + 1,
            chips,
            sim,
            actualAV,
            cumulativeAV,
            speedChanged: Math.abs(sim.endSpeed - sim.startSpeed) > 1e-6,
            pastThreshold: cumulativeAV > threshold,
            drawWallBefore,
        });

        turn++;
        if (turn > MAX_TURNS) break;
    }

    // 最後まで解決できなかった panel参照 (循環参照 / 参照先ターン未到達など)
    const unresolvedRefs = avPool
        .filter((c) => c.kind === 'panel' && c.atAV === undefined)
        .map((c) => c.ev);

    return { threshold, turnCount: rows.length, rows, unresolvedRefs };
}

/**
 * 複数パネルを一括計算する。timing=panel のイベントは他パネルの指定ターン到達AVを参照するため、
 * 単体の computeTimeline だけでは解決できず、パネル同士の依存関係を辿って解決する必要がある。
 * 循環参照 (AがBを参照し、BもAを参照する等) はどちらの経路も解決不能として扱う (発動しない)。
 *   返り値: panels と同じ長さの配列。各要素は computeTimeline と同じ形。
 */
export function computeAllTimelines(panels) {
    const list = Array.isArray(panels) ? panels : [];
    const n = list.length;

    // パネル参照の依存グラフ (i → 参照先パネル) を先に構築し、循環になる辺を洗い出す。
    // 計算しながら「先に解決を試みた側が勝つ」方式だと循環の一方だけが解決してしまい非対称になるため、
    // 実際に解決を試みる前にグラフ上で判定する。
    const edges = list.map((p) => {
        const targets = new Set();
        (Array.isArray(p.turns) ? p.turns : []).forEach((td) => {
            (td?.events || []).forEach((ev) => {
                if (evTiming(ev) === 'panel') {
                    const t = evRefPanel(ev);
                    if (t >= 0 && t < n) targets.add(t);
                }
            });
        });
        return targets;
    });

    // from から to へ有向辺を辿って到達できるか (静的なグラフ全体で判定する)
    function canReach(from, to) {
        const seen = new Set([from]);
        const stack = [from];
        while (stack.length) {
            const cur = stack.pop();
            for (const next of edges[cur] || []) {
                if (next === to) return true;
                if (!seen.has(next)) { seen.add(next); stack.push(next); }
            }
        }
        return false;
    }

    const memo = new Map();
    function resolve(index) {
        if (index < 0 || index >= n) return null;
        if (memo.has(index)) return memo.get(index);
        const timeline = computeTimeline(list[index], {
            resolvePanelRef: (ev) => {
                const target = evRefPanel(ev);
                // target → index の経路があるなら、この辺を解決すると循環になる
                if (target === index || canReach(target, index)) return undefined;
                const refTimeline = resolve(target);
                const row = refTimeline && refTimeline.rows[evRefTurn(ev) - 1];
                return row ? row.cumulativeAV : undefined;
            },
        });
        memo.set(index, timeline);
        return timeline;
    }

    return list.map((_, index) => resolve(index));
}

/**
 * AI・テキスト出力向けの軽量サマリ。DOM 由来の情報を含まない素の値だけを返す。
 * turnsWithinThreshold = 閾値までに何回行動できたか (火力の「行動回数」に相当)。
 *   timeline: 他パネル参照を解決済みの computeTimeline 結果を渡せる (省略時はこのパネル単体で計算し、panel参照は発動しない扱いになる)。
 */
export function summarizeTimeline(panel, timeline) {
    const normalized = normalizePanel(panel);
    const { threshold, rows } = timeline || computeTimeline(normalized);
    const withinThreshold = rows.filter(row => !row.pastThreshold);
    return {
        name: normalized.name,
        baseSpeed: normalized.baseSpeed,
        preSpeed: normalized.preSpeed,
        threshold,
        turnsWithinThreshold: withinThreshold.length,
        finalCumulativeAV: withinThreshold.length
            ? withinThreshold[withinThreshold.length - 1].cumulativeAV
            : 0,
        turns: rows.map(row => ({
            turn: row.turn,
            speedStart: row.sim.startSpeed,
            speedEnd: row.sim.endSpeed,
            actualAV: row.actualAV,
            cumulativeAV: row.cumulativeAV,
            pastThreshold: row.pastThreshold,
            effects: row.chips.map(chip => ({
                label: evLabel(chip.ev),
                type: chip.ev.type,
                value: chip.ev.value,
                timing: chip.kind,
                at: chip.kind === 'cum' ? evAtAV(chip.ev)
                    : chip.kind === 'panel' ? `panel${evRefPanel(chip.ev)}#turn${evRefTurn(chip.ev)}`
                    : evOffset(chip.ev),
                fired: !chip.notFired,
            })),
        })),
    };
}
