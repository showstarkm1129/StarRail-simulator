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

// 属性アイコンの形。公式の図像言語(炎/雪結晶/渦/稲妻/粒子球/樹/金属十字)に寄せた
// 自作シルエット。公式アートの複製ではない。{C} は属性色に置換される。
const EL_SHAPES = {
    // 物理: 金属的な十字バースト (公式シルエットに寄せる)
    physical: `<path d="M12 9L17 4L17 7L20 7L15 12L20 17L17 17L17 20L12 15L7 20L7 17L4 17L9 12L4 7L7 7L7 4Z M12 10.5L10.5 12L12 13.5L13.5 12Z" fill="{C}" stroke="none"/>`,
    // 炎: 炎
    fire: `<path d="M12 2.5c2 3 4.3 5 4.3 8.8A4.3 4.3 0 0 1 7.7 11c0-2 1-3.2 2-4.4.5 1 .3 1.9 1 2.7.9-1.4-.1-3.6 1.3-6.8z" fill="{C}" stroke="none"/>`,
    // 氷: 雪の結晶
    ice: `<g fill="none" stroke="{C}" stroke-width="1.7" stroke-linecap="round"><path d="M12 3v18M4.2 7.5 19.8 16.5M19.8 7.5 4.2 16.5"/><path d="M12 6.2 9.8 4.8M12 6.2 14.2 4.8M12 17.8 9.8 19.2M12 17.8 14.2 19.2"/><path d="M6.6 9 6 6.4M6.6 9 4 9.5M17.4 15 18 17.6M17.4 15 20 14.5M17.4 9 18 6.4M17.4 9 20 9.5M6.6 15 6 17.6M6.6 15 4 14.5"/></g>`,
    // 風: 3枚羽の渦
    wind: `<g fill="{C}" stroke="none"><path d="M12 12C9 9 9.5 4.5 12.5 2.5 12 6 14 9 12 12Z"/><path d="M12 12C9 9 9.5 4.5 12.5 2.5 12 6 14 9 12 12Z" transform="rotate(120 12 12)"/><path d="M12 12C9 9 9.5 4.5 12.5 2.5 12 6 14 9 12 12Z" transform="rotate(240 12 12)"/></g>`,
    // 雷: 稲妻
    lightning: `<path d="M13 2 5 13h5l-2 9 9-12h-5l3-8z" fill="{C}" stroke="none"/>`,
    // 量子: 瞳/三日月型 (公式シルエットに寄せる)
    quantum: `<g fill="{C}" stroke="none"><path d="M12 1C16 7 16 17 12 23C8 17 8 7 12 1Z"/><path d="M9 4C0 6 0 18 9 20C6 16 6 8 9 4Z"/><path d="M15 4C24 6 24 18 15 20C18 16 18 8 15 4Z"/></g>`,
    // 虚数: 黄金の樹冠と台座 (公式シルエットに寄せる)
    imaginary: `<g fill="{C}" stroke="none"><path d="M12 2L13.5 6.5L17 5L15 9L21 11L16 12.5L18.5 16.5L14.5 14.5L12 11.5L9.5 14.5L5.5 16.5L8 12.5L3 11L9 9L7 5L10.5 6.5Z"/><path d="M7.5 21L16.5 21L16.5 19.5L14 19.5L13.5 14L10.5 14L10 19.5L7.5 19.5Z"/></g>`,
};

// 攻撃力の剣。会心率/会心ダメも同じ剣を使い回して見た目を統一する。
const SWORD = `<polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/>`;

// 防御力の盾。効果抵抗や防御ダウンなどでも使い回す。内側にリム(縁)を追加して盾感を強調。
const SHIELD = `<path d="M12 3l7 3v5c0 4.2-3 6.4-7 7.5-4-1.1-7-3.3-7-7.5V6z"/><path d="M12 6l4 1.7v3.3c0 2.8-2 4.4-4 5c-2-.6-4-2.2-4-5V7.7z"/>`;

// 各アイコン = <svg> の内側 markup。基本は stroke=currentColor の線画。
// 塗りが必要な箇所は path 側で fill/stroke を上書きする。
const ICONS = {
    // 攻撃力: 剣
    atk: SWORD,
    // HP: ハート
    hp: `<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/>`,
    // 防御力: 盾
    def: SHIELD,
    // 速度: 靴(スニーカー)と風切り線
    spd: `<path d="M19 18c1.5 0 3-1 3-2.5c0-1.5-1.5-3-3-3.5L16 10c-1-1-2-2-3-2h-3c-1 0-2 .5-2.5 1.5L6 14c-1 0-2 1-2 2.5V18h15z"/><path d="M2 11h3M1 14h3M2 17h2"/>`,

    // 会心率: 剣(攻撃力と共通) + ⚡
    crit_rate: SWORD + `<path d="M18.5 2 16.3 6h2.2L16 10"/>`,
    // 会心ダメ: 剣(攻撃力と共通) + 右上に「叩いた」衝撃フラッシュ(尖ったスター+放射線)
    crit_dmg: SWORD + `<path d="M19 1 19.6 4.4 23 5 19.6 5.6 19 9 18.4 5.6 15 5 18.4 4.4Z" fill="currentColor" stroke="none"/><path d="M16.7 2.7 17.7 3.7M20.3 6.3 21.3 7.3M21.3 2.7 20.3 3.7M17.7 6.3 16.7 7.3" stroke-width="1.4"/>`,

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

    // 確定ダメージ: キラキラエフェクトの群れ
    fixed_dmg: `<path d="M12 4Q12 12 20 12Q12 12 12 20Q12 12 4 12Q12 12 12 4ZM19 1Q19 5 23 5Q19 5 19 9Q19 5 15 5Q19 5 19 1ZM5 15Q5 19 9 19Q5 19 5 23Q5 19 1 19Q5 19 5 15ZM6 3Q6 6 9 6Q6 6 6 9Q6 6 3 6Q6 6 6 3ZM18 15Q18 18 21 18Q18 18 18 21Q18 18 15 18Q18 18 18 15ZM12 0Q12 2 14 2Q12 2 12 4Q12 2 10 2Q12 2 12 0ZM12 20Q12 22 14 22Q12 22 12 24Q12 22 10 22Q12 22 12 20ZM2 10Q2 12 4 12Q2 12 2 14Q2 12 0 12Q2 12 2 10ZM22 10Q22 12 24 12Q22 12 22 14Q22 12 20 12Q22 12 22 10Z" fill="currentColor" stroke="none"/>`,
    // 別枠乗算: 独立枠(フレーム)と、干渉しないよう内側に収めた乗算クロスと4つの星
    sep_mult: `<path d="M12 2L22 12L12 22L2 12Z"/><path d="M12 9.5L14.5 7L17 9.5L14.5 12L17 14.5L14.5 17L12 14.5L9.5 17L7 14.5L9.5 12L7 9.5L9.5 7ZM12 11L11 12L12 13L13 12ZM12 0L13.5 1.5L12 3L10.5 1.5ZM12 21L13.5 22.5L12 24L10.5 22.5ZM0 12L1.5 10.5L3 12L1.5 13.5ZM21 12L22.5 10.5L24 12L22.5 13.5Z" fill="currentColor" stroke="none"/>`,

    // 防御ダウン: 盾 + 下矢印
    def_down: `<path d="M12 3l7 3v5c0 4.2-3 6.4-7 7.5-4-1.1-7-3.3-7-7.5V6z"/><path d="M12 8v5"/><path d="M9.5 11l2.5 2.5 2.5-2.5"/>`,
    // 防御無視/貫通: 盾を砕く
    def_ignore: `<path d="M12 3l7 3v5c0 4.2-3 6.4-7 7.5-4-1.1-7-3.3-7-7.5V6z"/><path d="M13 4l-2.5 5.5L14 11l-2.5 6" stroke-width="1.6"/>`,
    // 耐性貫通: 六角(耐性)を砕く
    res_pen: `<path d="M12 3l6 3.5v7L12 18 6 14.5v-7z"/><path d="M13 4l-2.5 5.5L14 11l-2.5 6" stroke-width="1.6"/>`,
    // 属性耐性デバフ(耐性Down): 六角(耐性) + 下矢印
    res_down: `<path d="M12 3l6 3.5v7L12 18 6 14.5v-7z"/><path d="M12 8v6"/><path d="M9.5 11.5l2.5 2.5 2.5-2.5"/>`,
    // 被ダメ増: 四方からの矢印 (被弾)
    dmg_taken: `<circle cx="12" cy="12" r="2.5"/><path d="M4 4l2.5 2.5M3.5 7V4h3M20 4l-2.5 2.5M20.5 7V4h-3M4 20l2.5-2.5M3.5 17v3h3M20 20l-2.5-2.5M20.5 17v3h-3"/>`,

    // 治癒量 / 被治癒量: +の中に+が入ったデザイン
    heal_up: `<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/><path d="M12 7v10M7 12h10"/>`,
    heal_down: `<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/><path d="M12 7v10M7 12h10"/>`,

    _fallback: `<circle cx="12" cy="12" r="7"/>`,
};

const DIRECT = {
    atk: 'atk', atkBase: 'atk', atkPercent: 'atk', atkFlat: 'atk',
    hp: 'hp', hpBase: 'hp', hpPercent: 'hp', hpFlat: 'hp',
    def: 'def', defBase: 'def', defPercent: 'def', defFlat: 'def',
    spd: 'spd', spdBase: 'spd', spdPercent: 'spd', spdFlat: 'spd',
    critRate: 'crit_rate', crit: 'crit_rate', critExpected: 'crit_rate',
    critRateBasic: 'crit_rate', critRateSkill: 'crit_rate', critRateUlt: 'crit_rate', critRateFollowup: 'crit_rate',
    critDmg: 'crit_dmg',
    critDmgBasic: 'crit_dmg', critDmgSkill: 'crit_dmg', critDmgUlt: 'crit_dmg', critDmgFollowup: 'crit_dmg',
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
    defIgnoreBasic: 'def_ignore', defIgnoreSkill: 'def_ignore', defIgnoreUlt: 'def_ignore', defIgnoreFollowup: 'def_ignore',
    resPen: 'res_pen', res: 'res_pen', resDown: 'res_down',
    resPenBasic: 'res_pen', resPenSkill: 'res_pen', resPenUlt: 'res_pen', resPenFollowup: 'res_pen',
    dmgTaken: 'dmg_taken', taken: 'dmg_taken',
    dmgTakenBasic: 'dmg_taken', dmgTakenSkill: 'dmg_taken', dmgTakenUlt: 'dmg_taken', dmgTakenFollowup: 'dmg_taken',
    healBonus: 'heal_up', healTaken: 'heal_down',
};

// ステータスキー → アイコンID。属性別ダメ枠(dmgFire 等)と比較表の行キー(dmg.base 等)も解決。
function iconIdFor(rawKey) {
    if (!rawKey) return '_fallback';
    const k = String(rawKey);
    if (k.startsWith('crit.')) return 'crit_rate';
    if (k.startsWith('def.')) return 'def_ignore';
    if (k.startsWith('res.')) return 'res_pen';
    if (k.startsWith('taken.')) return 'dmg_taken';
    if (k.startsWith('dmg.')) return 'dmg';
    if (k.startsWith('total.')) return 'total';
    const el = k.match(/^dmg(Physical|Fire|Ice|Lightning|Wind|Quantum|Imaginary)$/);
    if (el) return 'el_' + el[1].toLowerCase();
    return DIRECT[k] || '_fallback';
}

// 属性アイコン(属性ごとの固有シルエット)を生成。
function elementSvg(elName, size) {
    const color = EL_COLORS[elName] || '#888';
    const shape = (EL_SHAPES[elName] || '').replace(/\{C\}/g, color);
    return `<svg class="stat-icon stat-icon-el" viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true">${shape}</svg>`;
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
    if (id.startsWith('el_')) return elementSvg(id.slice(3), size);
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
    ['defDown', '防御ダウン'], ['defIgnore', '防御無視/貫通'], ['resPen', '耐性貫通'], ['resDown', '属性耐性デバフ'], ['dmgTaken', '被ダメ増'],
    ['healBonus', '治癒量'], ['healTaken', '被治癒量'],
    ['dmgPhysical', '物理'], ['dmgFire', '炎'], ['dmgIce', '氷'], ['dmgLightning', '雷'],
    ['dmgWind', '風'], ['dmgQuantum', '量子'], ['dmgImaginary', '虚数'],
];
