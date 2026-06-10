// statIcons.js — ステータスアイコンの単一ソース (自作インラインSVG)。
//
// 方針:
//   - 公式(HoYoverse)のアイコン画像は著作権物なので複製しない。すべて自作の線画/図形。
//   - 画像ファイルを使わずSVGをコードに直接埋め込む (ゼロ依存を維持)。
//   - ステータスキー → アイコンID を正規化し、全画面でここを参照する単一の真実とする。
//
// 使い方:
//   import { statIcon, statLabel } from './statIcons.js';
//   statIcon('critRate')            → <svg ...> 文字列
//   statLabel('critRate', '会心率') → <span class="stat-iconed">[icon]会心率</span>

// 属性カラー (色そのものは著作権対象外。HSR の一般的な色言語に合わせる)
const EL_COLORS = {
    physical:  '#D6D6D6',
    fire:      '#F2683C',
    ice:       '#7BD6F0',
    lightning: '#B08CF0',
    wind:      '#5FD09A',
    quantum:   '#6C5CE0',
    imaginary: '#F0CE4E',
};

// 攻撃力の剣。会心率/会心ダメも同じ剣を使い回して見た目を統一する。
const SWORD = `<polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/>`;

// 各アイコン = <svg> の内側 markup。基本は stroke=currentColor の線画。
// 塗りが必要な箇所は path 側で fill/stroke を上書きする。
const ICONS = {
    // 攻撃力: 剣
    atk: SWORD,
    // HP: ハート
    hp: `<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/>`,
    // 防御力: 盾
    def: `<path d="M12 3l7 3v5c0 4.2-3 6.4-7 7.5-4-1.1-7-3.3-7-7.5V6z"/>`,
    // 速度: 靴 (ブーツ) ※塗り。かかと・つま先を出して靴らしい輪郭に。
    spd: `<path d="M7 3H12V11H15a4 4 0 0 1 4 4V17H4V14a3 3 0 0 1 3-3H7Z" fill="currentColor" stroke="none"/>`,

    // 会心率: 剣(攻撃力と共通) + ⚡
    crit_rate: SWORD + `<path d="M18.5 2 16.3 6h2.2L16 10"/>`,
    // 会心ダメ: 剣(攻撃力と共通) + 刃先の衝撃フラッシュ(剣に被らない外側)
    crit_dmg: SWORD + `<path d="M1.3 1.3 2.4 2.4M1 3.4h1.4M3.4 1v1.4" stroke-width="1.6"/>`,

    // 効果命中: 人 + ⚡
    ehr: `<circle cx="9.5" cy="7.5" r="3"/><path d="M4.5 19c0-3.2 2.2-5 5-5s5 1.8 5 5"/><path d="M18.5 3 16 7.2h2.6L16 11.5"/>`,
    // 効果抵抗: 盾 + 人
    eres: `<path d="M12 3l7 3v5c0 4.2-3 6.4-7 7.5-4-1.1-7-3.3-7-7.5V6z"/><circle cx="12" cy="9" r="1.8"/><path d="M8.8 15.2c0-2 1.4-3.2 3.2-3.2s3.2 1.2 3.2 3.2"/>`,

    // 撃破特効: トゲのある爆発(シャード) ※塗り
    break: `<path d="M12 1.5l2.6 6.9 6.9-2.6-4.9 5.7 4.9 5.7-6.9-2.6L12 22.5l-2.6-6.9-6.9 2.6 4.9-5.7-4.9-5.7 6.9 2.6z" fill="currentColor" stroke="none"/>`,
    // EP回復: 円 + 稲妻
    energy: `<circle cx="12" cy="12" r="8.5"/><path d="M12.5 7 9 13h3l-.5 4 3.5-6h-3z" fill="currentColor" stroke="none"/>`,

    // 与ダメ(共通): 爆発バースト
    dmg: `<circle cx="12" cy="12" r="3"/><path d="M12 2v3.4M12 18.6V22M2 12h3.4M18.6 12H22M5 5l2.4 2.4M16.6 16.6 19 19M19 5l-2.4 2.4M7.4 16.6 5 19"/>`,
    // 火力総合(結果): 棒グラフ
    total: `<path d="M5 19V11M10 19V6M15 19V9M20 19V13"/><path d="M3 21h18"/>`,

    // 確定ダメージ: 上矢印 + キラキラ
    fixed_dmg: `<path d="M10 20V7"/><path d="M5 12l5-5 5 5"/><path d="M18.5 3l.8 2.3 2.3.8-2.3.8-.8 2.3-.8-2.3L15.4 6l2.3-.8z" fill="currentColor" stroke="none"/>`,
    // 別枠乗算: 剣が分身(2本・つば付き) + 右上にプラス
    sep_mult: `<path d="M4 17 12 9"/><path d="M4 14 7 17"/><path d="M9 17 17 9"/><path d="M9 14 12 17"/><path d="M19 3v4M17 5h4"/>`,

    // 防御ダウン: 盾 + 下矢印
    def_down: `<path d="M12 3l7 3v5c0 4.2-3 6.4-7 7.5-4-1.1-7-3.3-7-7.5V6z"/><path d="M12 8v5"/><path d="M9.5 11l2.5 2.5 2.5-2.5"/>`,
    // 防御無視/貫通: 盾を砕く
    def_ignore: `<path d="M12 3l7 3v5c0 4.2-3 6.4-7 7.5-4-1.1-7-3.3-7-7.5V6z"/><path d="M13 4l-2.5 5.5L14 11l-2.5 6" stroke-width="1.6"/>`,
    // 耐性貫通: 六角(耐性)を矢印が貫く
    res_pen: `<path d="M12 3l7 4v8l-7 4-7-4V7z"/><path d="M4 12h15"/><path d="M15 8l4 4-4 4"/>`,
    // 被ダメ増: 四方からの矢印 (被弾)
    dmg_taken: `<circle cx="12" cy="12" r="2.5"/><path d="M4 4l2.5 2.5M3.5 7V4h3M20 4l-2.5 2.5M20.5 7V4h-3M4 20l2.5-2.5M3.5 17v3h3M20 20l-2.5-2.5M20.5 17v3h-3"/>`,

    // 治癒量: 十字 + 上, 被治癒量: 十字 + 下
    heal_up: `<path d="M12 9v7M8.5 12.5h7"/><path d="M9 6l3-3 3 3"/>`,
    heal_down: `<path d="M12 8v7M8.5 11.5h7"/><path d="M9 17l3 3 3-3"/>`,

    _fallback: `<circle cx="12" cy="12" r="7"/>`,
};

const DIRECT = {
    atk: 'atk', atkBase: 'atk', atkPercent: 'atk', atkFlat: 'atk',
    hp: 'hp', hpBase: 'hp', hpPercent: 'hp', hpFlat: 'hp',
    def: 'def', defBase: 'def', defPercent: 'def', defFlat: 'def',
    spd: 'spd', spdBase: 'spd', spdPercent: 'spd', spdFlat: 'spd',
    critRate: 'crit_rate', crit: 'crit_rate', critExpected: 'crit_rate',
    critDmg: 'crit_dmg',
    ehr: 'ehr', eres: 'eres',
    breakEffect: 'break', break: 'break',
    energyRegen: 'energy',
    dmgAll: 'dmg', dmgOwnElement: 'dmg',
    dmgBasic: 'dmg', dmgSkill: 'dmg', dmgUlt: 'dmg', dmgFollowup: 'dmg',
    dmgTotalBasic: 'dmg', dmgTotalSkill: 'dmg', dmgTotalUlt: 'dmg', dmgTotalFollowup: 'dmg',
    fixedDmg: 'fixed_dmg',
    sepMult: 'sep_mult',
    defDown: 'def_down', defReductionTotal: 'def_down',
    defIgnore: 'def_ignore',
    resPen: 'res_pen', res: 'res_pen',
    dmgTaken: 'dmg_taken', taken: 'dmg_taken',
    healBonus: 'heal_up', healTaken: 'heal_down',
};

// ステータスキー → アイコンID。属性別ダメ枠(dmgFire 等)と比較表の行キー(dmg.base 等)も解決。
function iconIdFor(rawKey) {
    if (!rawKey) return '_fallback';
    const k = String(rawKey);
    if (k.startsWith('dmg.')) return 'dmg';
    if (k.startsWith('total.')) return 'total';
    const el = k.match(/^dmg(Physical|Fire|Ice|Lightning|Wind|Quantum|Imaginary)$/);
    if (el) return 'el_' + el[1].toLowerCase();
    return DIRECT[k] || '_fallback';
}

// 属性アイコン(色付きの菱形ジェム)を生成。
function elementGem(elName, size) {
    const color = EL_COLORS[elName] || '#888';
    return `<svg class="stat-icon stat-icon-el" viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true">`
        + `<path d="M12 2.5 19.5 11 12 21.5 4.5 11z" fill="${color}" stroke="rgba(0,0,0,0.35)" stroke-width="1"/>`
        + `<path d="M12 2.5 19.5 11 12 21.5 4.5 11z" fill="rgba(255,255,255,0.18)" stroke="none" transform="scale(0.55) translate(9.8 4)"/>`
        + `</svg>`;
}

/**
 * ステータスアイコンの SVG 文字列を返す。
 * @param {string} key  ステータスキー (STAT.* の値 / STATS_ROWS の key / 比較表の行key)
 * @param {{size?:number, cls?:string}} [opts]
 */
export function statIcon(key, opts = {}) {
    const size = opts.size || 16;
    const cls = opts.cls || '';
    const id = iconIdFor(key);
    if (id.startsWith('el_')) return elementGem(id.slice(3), size);
    const inner = ICONS[id] || ICONS._fallback;
    return `<svg class="stat-icon ${cls}" viewBox="0 0 24 24" width="${size}" height="${size}" `
        + `fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">`
        + `${inner}</svg>`;
}

/** アイコン + テキストラベル をまとめた span を返す。 */
export function statLabel(key, text, opts = {}) {
    return `<span class="stat-iconed">${statIcon(key, opts)}<span>${text ?? ''}</span></span>`;
}

// 確認用: ギャラリーに並べる代表キーと表示名。
export const ICON_GALLERY_ITEMS = [
    ['atkPercent', '攻撃力'], ['hpPercent', 'HP'], ['defPercent', '防御力'], ['spdFlat', '速度'],
    ['critRate', '会心率'], ['critDmg', '会心ダメ'],
    ['ehr', '効果命中'], ['eres', '効果抵抗'],
    ['breakEffect', '撃破特効'], ['energyRegen', 'EP回復'],
    ['dmgAll', '共通与ダメ'], ['fixedDmg', '確定ダメージ'], ['sepMult', '別枠乗算'],
    ['defDown', '防御ダウン'], ['defIgnore', '防御無視/貫通'], ['resPen', '耐性貫通'], ['dmgTaken', '被ダメ増'],
    ['healBonus', '治癒量'], ['healTaken', '被治癒量'],
    ['dmgPhysical', '物理'], ['dmgFire', '炎'], ['dmgIce', '氷'], ['dmgLightning', '雷'],
    ['dmgWind', '風'], ['dmgQuantum', '量子'], ['dmgImaginary', '虚数'],
];
