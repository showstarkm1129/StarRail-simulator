// キャラクター効果の監査・一括更新で使う分類辞書。
//
// 目的:
// - Wiki本文から見つかる効果を「今の数値実験場に載せられるもの」と「後で専用実装するもの」に分ける。
// - 新キャラ追加時は、まずここへルールを足すと監査スクリプトと upsert 補助が同じ判断を使える。
//
// 未対応カテゴリはコメントだけで残す。
// 例: 愉悦度、超撃破、弱点撃破効率、行動順、SP/EP、回復処理、バリア、被ダメ軽減など。

export const GENERATED_CHARACTER_SKIP_IDS = Object.freeze([
    'acheron',
    'aventurine',
    'ashveil',
    'bronya',
    'castorice',
    'cipher',
    'evernight',
    'hyacine',
    'mortenax_blade',
    'tribbie',
    'template',
    'testAll',
    'testAllS1',
]);

export const EFFECT_GROUPS = Object.freeze(['partyEffects', 'selfEffects', 'enemyEffects']);

export const FIRE_DEBUFF_STAT_NAMES = Object.freeze([
    'DMG_TAKEN',
    'DMG_TAKEN_BASIC',
    'DMG_TAKEN_SKILL',
    'DMG_TAKEN_ULT',
    'DMG_TAKEN_FOLLOWUP',
    'RES_PEN',
    'RES_PEN_BASIC',
    'RES_PEN_SKILL',
    'RES_PEN_ULT',
    'RES_PEN_FOLLOWUP',
    'DEF_DOWN',
    'DEF_IGNORE',
    'DEF_IGNORE_BASIC',
    'DEF_IGNORE_SKILL',
    'DEF_IGNORE_ULT',
    'DEF_IGNORE_FOLLOWUP',
]);

export const EFFECT_RULE_SUPPORT = Object.freeze({
    SUPPORTED: 'supported',
    UNSUPPORTED: 'unsupported',
});

function rule(id, label, patterns, stats, options = {}) {
    return Object.freeze({
        id,
        label,
        patterns,
        stats: Array.isArray(stats) ? stats : [stats],
        support: EFFECT_RULE_SUPPORT.SUPPORTED,
        preferredGroup: options.preferredGroup || 'selfEffects',
        note: options.note || '',
    });
}

function unsupportedRule(id, label, patterns, reason, futureShape) {
    return Object.freeze({
        id,
        label,
        patterns,
        stats: [],
        support: EFFECT_RULE_SUPPORT.UNSUPPORTED,
        reason,
        futureShape,
    });
}

export const SUPPORTED_EFFECT_RULES = Object.freeze([
    rule('crit_dmg_followup', '追加攻撃会心ダメージ', [/追加攻撃.{0,24}会心ダメージ\+/], 'CRIT_DMG_FOLLOWUP'),
    rule('crit_dmg_skill', '戦闘スキル会心ダメージ', [/戦闘スキル.{0,24}会心ダメージ\+/], 'CRIT_DMG_SKILL'),
    rule('crit_dmg_ult', '必殺技会心ダメージ', [/必殺技.{0,24}会心ダメージ\+/], 'CRIT_DMG_ULT'),
    rule('crit_dmg_basic', '通常攻撃会心ダメージ', [/通常攻撃.{0,24}会心ダメージ\+/, /強化通常攻撃.{0,24}会心ダメージ\+/], 'CRIT_DMG_BASIC'),
    rule('crit_dmg_all', '会心ダメージ', [/会心ダメージ\+/, /会心ダメージが.*アップ/], 'CRIT_DMG'),

    rule('crit_rate_skill', '戦闘スキル会心率', [/戦闘スキル.{0,24}会心率\+/], 'CRIT_RATE_SKILL'),
    rule('crit_rate_ult', '必殺技会心率', [/必殺技.{0,24}会心率\+/], 'CRIT_RATE_ULT'),
    rule('crit_rate_followup', '追加攻撃会心率', [/追加攻撃.{0,24}会心率\+/], 'CRIT_RATE_FOLLOWUP'),
    rule('crit_rate_basic', '通常攻撃会心率', [/通常攻撃.{0,24}会心率\+/, /強化通常攻撃.{0,24}会心率\+/], 'CRIT_RATE_BASIC'),
    rule('crit_rate_all', '会心率', [/会心率\+/, /会心率が.*アップ/], 'CRIT_RATE'),

    rule('dmg_followup', '追加攻撃与ダメージ', [/追加攻撃与ダメージ\+/, /追加攻撃の与ダメージ\+/, /追加攻撃による与ダメージアップ/, /追加攻撃のダメージ倍率\+/, /追加攻撃ダメージ\+/], 'DMG_FOLLOWUP'),
    rule('dmg_skill', '戦闘スキル与ダメージ', [/戦闘スキル与ダメージ\+/, /戦闘スキルの与ダメージ\+/, /戦闘スキルによる与ダメージアップ/, /戦闘スキルのダメージ倍率\+/, /戦闘スキルダメージ\+/], 'DMG_SKILL'),
    rule('dmg_ult', '必殺技与ダメージ', [/必殺技与ダメージ\+/, /必殺技の与ダメージ\+/, /必殺技による与ダメージアップ/, /必殺技のダメージ倍率\+/, /必殺技ダメージ\+/], 'DMG_ULT'),
    rule('dmg_basic', '通常攻撃与ダメージ', [/通常攻撃与ダメージ\+/, /通常攻撃の与ダメージ\+/, /強化通常攻撃与ダメージ\+/, /強化通常攻撃の与ダメージ\+/, /通常攻撃のダメージ倍率\+/, /強化通常攻撃のダメージ倍率\+/, /通常攻撃ダメージ\+/, /強化通常攻撃ダメージ\+/], 'DMG_BASIC'),
    rule('dmg_all', '与ダメージ', [/与ダメージ\+/, /与えるダメージ\+/, /ダメージアップ効果/], 'DMG_ALL'),

    rule('dmg_taken_followup', '追加攻撃被ダメージ', [/受ける追加攻撃.{0,16}(ダメージ|会心ダメージ)\+/, /追加攻撃.{0,16}被ダメージ\+/], ['DMG_TAKEN_FOLLOWUP', 'CRIT_DMG_FOLLOWUP'], { preferredGroup: 'partyEffects' }),
    rule('dmg_taken_ult', '必殺技被ダメージ', [/受ける必殺技ダメージ\+/, /必殺技被ダメージ/], 'DMG_TAKEN_ULT', { preferredGroup: 'partyEffects' }),
    rule('dmg_taken_all', '被ダメージ', [/受けるダメージ\+/, /被ダメージ\+/, /被ダメージアップ/], 'DMG_TAKEN', { preferredGroup: 'partyEffects' }),

    rule('def_down', '防御力ダウン', [/防御力-[XYZ0-9.]+[%％]/, /防御力ダウン/], 'DEF_DOWN', { preferredGroup: 'partyEffects' }),
    rule('def_ignore_followup', '追加攻撃防御無視', [/追加攻撃.{0,24}防御力を.*無視/], 'DEF_IGNORE_FOLLOWUP'),
    rule('def_ignore_skill', '戦闘スキル防御無視', [/戦闘スキル.{0,24}防御力を.*無視/], 'DEF_IGNORE_SKILL'),
    rule('def_ignore_ult', '必殺技防御無視', [/必殺技.{0,24}防御力を.*無視/], 'DEF_IGNORE_ULT'),
    rule('def_ignore_all', '防御無視', [/防御力を.*無視/, /防御力.*無視/], 'DEF_IGNORE'),

    rule('res_pen_followup', '追加攻撃耐性貫通', [/追加攻撃(ダメージ|のダメージ|によるダメージ).{0,24}耐性貫通\+/], 'RES_PEN_FOLLOWUP'),
    rule('res_pen_skill', '戦闘スキル耐性貫通', [/戦闘スキル(ダメージ|のダメージ|によるダメージ).{0,24}耐性貫通\+/], 'RES_PEN_SKILL'),
    rule('res_pen_ult', '必殺技耐性貫通', [/必殺技(ダメージ|のダメージ|によるダメージ).{0,24}耐性貫通\+/], 'RES_PEN_ULT'),
    rule('res_pen_all', '耐性貫通/耐性Down', [/耐性貫通\+/, /耐性-[XYZ0-9.]+[%％]/, /全耐性-[XYZ0-9.]+[%％]/], 'RES_PEN', { preferredGroup: 'partyEffects' }),

    rule('atk_percent', '攻撃力%', [/攻撃力\+[XYZ0-9.]+[%％](?!分)/, /攻撃力が.*アップ/], 'ATK_PERCENT'),
    rule('hp_percent', '最大HP%', [/最大HP\+/, /HP上限/], 'HP_PERCENT'),
    rule('def_percent', '防御力%', [/防御力\+/, /防御力が.*アップ/], 'DEF_PERCENT'),
    rule('spd_percent', '速度%', [/(?<!移動)速度\+.*[%％]/, /(?<!移動)速度アップ/], 'SPD_PERCENT'),
    rule('spd_flat', '速度固定', [/(?<!移動)速度\+[0-9]+(?:\.[0-9]+)?(?![0-9.%％])/, /速度が[0-9]+(?:\.[0-9]+)?アップ/], 'SPD_FLAT'),
    rule('break_effect', '撃破特効', [/撃破特効\+/], 'BREAK_EFFECT'),
    rule('effect_hit_rate', '効果命中', [/効果命中\+/], 'EFFECT_HIT_RATE'),
    rule('effect_res', '効果抵抗', [/効果抵抗\+/], 'EFFECT_RES'),
]);

export const UNSUPPORTED_EFFECT_RULES = Object.freeze([
    unsupportedRule(
        'elation_degree',
        '愉悦度/爆笑ネタ/愉悦スキル',
        [/愉悦度/, /爆笑ネタ/, /愉悦スキル/, /愉悦ダメージ/],
        '愉悦専用リソースと専用ダメージ式がまだ無い。',
        '将来: elationResource / elationDamage / elationSkill の専用枠を追加する。'
    ),
    unsupportedRule(
        'super_break',
        '超撃破',
        [/超撃破/, /削靭値.*ダメージに転換/],
        '削靭値、敵靭性、撃破中判定が必要で、通常火力枠に入れると過大評価になる。',
        '将来: toughnessDamage と breakState を使う専用計算へ分離する。'
    ),
    unsupportedRule(
        'break_efficiency',
        '弱点撃破効率',
        [/弱点撃破効率\+/],
        '弱点撃破効率はダメージ係数ではなく削靭量に効く。',
        '将来: toughnessEfficiency の表示・比較枠を追加する。'
    ),
    unsupportedRule(
        'break_damage_taken',
        '弱点撃破ダメージ専用',
        [/弱点撃破ダメージ\+/, /受ける弱点撃破ダメージ/],
        '通常ダメージと別式。DMG_TAKEN へ入れると通常攻撃まで増える。',
        '将来: breakDmgTaken / breakDamageBonus を追加する。'
    ),
    unsupportedRule(
        'dot_only',
        '持続ダメージ専用',
        [/持続被ダメージ\+/, /持続ダメージ\+/, /持続ダメージ.*本来の/],
        '通常ダメージと別系統。全被ダメージとして入れると過大評価になる。',
        '将来: dotDmg / dotTaken / dotDetonate を追加する。'
    ),
    unsupportedRule(
        'fixed_damage',
        '確定ダメージ',
        [/確定ダメージ/],
        '確定ダメージは参照値・倍率・発生条件が通常ダメージと異なる。',
        '将来: fixedDamageSource と fixedDamageMultiplier を追加する。'
    ),
    unsupportedRule(
        'action_advance_delay',
        '行動順操作',
        [/行動順/, /即座に行動/, /追加ターン/, /遅延/],
        '火力係数ではなく行動回数・ローテーションに効く。',
        '将来: speed/action simulator 側のイベントとして扱う。'
    ),
    unsupportedRule(
        'sp_ep',
        'SP/EP操作',
        [/SPを/, /EPを/, /EP回復/, /最大EP/],
        '火力係数ではなくローテーション資源。',
        '将来: rotationResourceEffects として別管理する。'
    ),
    unsupportedRule(
        'healing_shield',
        '回復/治癒/バリア',
        [/治癒/, /回復量/, /HPを.*回復/, /バリア/, /耐久値/],
        '回復量やバリア耐久は火力比較の主式に入らない。',
        '将来: sustainStats として回復量・シールド量の比較枠を作る。'
    ),
    unsupportedRule(
        'damage_reduction',
        '被ダメージ軽減',
        [/ダメージ軽減/, /受けるダメージがダウン/, /被ダメージ-[0-9XYZ.]+[%％]/],
        '敵に与える火力ではなく耐久側の係数。',
        '将来: takenReduction / effectiveHp の比較枠を作る。'
    ),
    unsupportedRule(
        'field_movement',
        'フィールド移動速度',
        [/移動速度\+/],
        '探索中の移動速度で、戦闘中の速度ステータスではない。',
        '将来: battleStats ではなく fieldUtilityEffects として分ける。'
    ),
    unsupportedRule(
        'summon_only',
        '召喚物/記憶の精霊専用ステータス',
        [/神君/, /ラフトラ/, /デミウルゴス/, /カブ/, /浮元/],
        '召喚物を装備者本人とは別ステータスで持っていない。',
        '将来: summonStats と summonAction の別枠を作る。'
    ),
]);

export const EFFECT_RULES = Object.freeze([
    ...SUPPORTED_EFFECT_RULES,
    ...UNSUPPORTED_EFFECT_RULES,
]);

export function normalizeRuleText(text) {
    return String(text || '').replace(/\s+/g, '');
}

function hasAnyRuleId(ruleIds, pattern) {
    return [...ruleIds].some(ruleId => pattern.test(ruleId));
}

export function classifyEffectText(text) {
    const normalized = normalizeRuleText(text);
    const matched = EFFECT_RULES.filter(ruleDef => ruleDef.patterns.some(pattern => pattern.test(normalized)));
    const matchedIds = new Set(matched.map(ruleDef => ruleDef.id));

    return matched.filter(ruleDef => {
        if (ruleDef.id === 'crit_dmg_all') return !hasAnyRuleId(matchedIds, /^crit_dmg_(basic|skill|ult|followup)$/);
        if (ruleDef.id === 'crit_rate_all') return !hasAnyRuleId(matchedIds, /^crit_rate_(basic|skill|ult|followup)$/);
        if (ruleDef.id === 'dmg_all') return !hasAnyRuleId(matchedIds, /^dmg_(basic|skill|ult|followup)$/);
        if (ruleDef.id === 'dmg_taken_all') return !hasAnyRuleId(matchedIds, /^dmg_taken_(basic|skill|ult|followup)$/);
        if (ruleDef.id === 'def_ignore_all') return !hasAnyRuleId(matchedIds, /^def_ignore_(basic|skill|ult|followup)$/);
        if (ruleDef.id === 'res_pen_all') return !hasAnyRuleId(matchedIds, /^res_pen_(basic|skill|ult|followup)$/);
        return true;
    });
}

export function isUnsupportedRule(ruleDef) {
    return ruleDef.support === EFFECT_RULE_SUPPORT.UNSUPPORTED;
}
