// 新キャラ実装テンプレ
// このファイルをコピーして data/characters/<id>.js を作り、
// data/characters/_index.js に import を1行追加する。
//
// 値はすべて Lv80 / 軌跡完凸を前提に「常時加算される量」を入れる。
// 条件付きの効果は hooks (onBuildResolved 等) かトリガー型 hook で扱う。

import { ELEMENT, PATH } from '../../build/constants.js';
import { STAT } from '../../build/statKeys.js';
import { Registry } from '../../build/registry.js';

Registry.character.add({
    id: 'template',                   // 一意な ID(英小文字+数字推奨)
    name: 'テンプレ',                  // 表示名
    element: ELEMENT.PHYSICAL,        // 属性
    path: PATH.DESTRUCTION,           // 運命
    rarity: 5,

    // Lv80 基礎値(キャラ固有値)
    base: {
        atk: 600,
        hp: 1000,
        def: 400,
        spd: 100,
    },
    maxEnergy: 100,

    // 軌跡: 常時加算される量だけ書く
    traces: {
        stats: {
            // [STAT.ATK_PERCENT]: 0.28,
            // [STAT.CRIT_DMG]:   0.24,
            // [STAT.DMG_ALL]:    0.08,
        },
        passives: [],   // 条件付きトレース用(将来)
    },

    // 星魂段階別の常時加算ステ。hooks も書ける。
    eidolons: {
        // 1: { stats: {} },
        // 2: { stats: { [STAT.SPD_PERCENT]: 0.10 } },
        // 4: { stats: { [STAT.ENERGY_REGEN]: 0.05 } },
        // 6: { stats: { [STAT.CRIT_DMG]: 0.10 } },
    },

    // スキル定義(現フェーズでは枠だけ。将来 damage.js が読む)
    skills: {
        basic:  { type: 'attack', target: 'single', mult: { atk: 1.00 }, energy: 20 },
        skill:  { type: 'attack', target: 'single', mult: { atk: 2.50 }, energy: 30 },
        ult:    { type: 'attack', target: 'all',    mult: { atk: 3.00 }, energy: 120 },
        talent: { type: 'passive' },
    },

    // パーティに居る時、メイン火力キャラへ寄与する効果一覧(限界効用逓減タブの「パーティ枠」で参照)
    //
    // 共通フィールド:
    //   id            : 一意 (キャラ内で)
    //   source        : 'extra'|'ult'|'skill'|'talent'|'technique' (UI表示分類)
    //   name          : UI 表示名。命名規約は「効果名 (発動条件)」例: "必殺 攻撃力バフ"、
    //                    "昇格6 軍勢 (常時発動)"、"昇格4 陣地 (戦闘開始2T)"
    //                    分かりにくい用語(caster/teammate/オーラ 等)は使わない。
    //   description   : ツールチップ。日本語の自然な文で書く。
    //   defaultActive : 初期 ON / OFF
    //   target        : 'all' (味方全体) / 'single' (メイン火力キャラが対象になった想定でのみ適用)
    //   duration      : 表示用 (計算には不使用)
    //
    // 値の指定方法 (どちらか1つ):
    //   stats: { [STAT.KEY]: number }   固定値 (Lv 非依存)
    //   fromLevel + computeStats        Lv 連動 (発動者の天賦Lv に依存)
    //     fromLevel: 'ult'|'skill'|'basic'|'talent'
    //                → サポート枠キャラ自身の skills[fromLevel].levels[lv-1] が mult に渡る
    //     computeStats: (lv, mult, caster) => ({ [STAT.KEY]: number, ... })
    //       lv     : サポート枠キャラの該当スキルLv (1-始まり)
    //       mult   : levels[lv-1] のオブジェクト (例: { atkBuff: 0.55 })
    //       caster : サポート枠キャラ自身の FinalStats (.derived / .raw 利用可)
    //                発動者自身のステに連動するバフ用 (例: 会心ダメ = caster.CD × Y% + Z%)
    partyEffects: [
        // 例) 固定値
        // {
        //     id: 'aura_xxx',
        //     source: 'extra',
        //     name: '昇格6 ○○ (常時発動)',
        //     description: 'このキャラがフィールド上にいる時、味方全体に与ダメ+10%',
        //     stats: { [STAT.DMG_ALL]: 0.10 },
        //     defaultActive: true,
        //     target: 'all',
        //     duration: 'permanent',
        // },
        // 例) Lv 連動
        // {
        //     id: 'ult_atk',
        //     source: 'ult',
        //     name: '必殺 攻撃力バフ',
        //     description: '必殺発動時、味方全体の攻撃力+X%、2T',
        //     fromLevel: 'ult',
        //     computeStats: (lv, mult, caster) => ({ [STAT.ATK_PERCENT]: mult.atkBuff }),
        //     defaultActive: false, target: 'all', duration: 2,
        // },
        // 例) 発動者ステ依存
        // {
        //     id: 'ult_cd',
        //     source: 'ult',
        //     name: '必殺 会心ダメ (発動者CDに連動)',
        //     description: '必殺発動時、味方全体の会心ダメ = (発動者の会心ダメ × Y%) + Z%、2T',
        //     fromLevel: 'ult',
        //     computeStats: (lv, mult, caster) => ({
        //         [STAT.CRIT_DMG]: caster.derived.critDmg * mult.cdRatio + mult.cdFlat,
        //     }),
        //     defaultActive: false, target: 'all', duration: 2,
        // },
    ],

    // 特殊効果フック(計画書18節「型に収まらないバフはコードで書く」)
    hooks: {
        // onBuildResolved(ctx): FinalStats 確定直後に1回だけ呼ばれる。
        //   ctx = { build, stats, registry }
        //   stats.add(key, value, source) で追加調整可能。
        //   例) サンデーE6: 会心率超過分を会心ダメに変換
        // onBuildResolved(ctx) {
        //     const overflow = Math.max(0, ctx.stats.raw.critRate + 0.05 - 1.0);
        //     if (overflow > 0) {
        //         ctx.stats.add('critRate', -overflow, 'self.E6.convert');
        //         ctx.stats.add('critDmg',  overflow * 2, 'self.E6.convert');
        //     }
        // },

        // 以下はトリガー型(StatComputer.collectHooks() で集められる)。
        // 本フェーズでは登録のみ。発火配線は次フェーズで simulator から行う。
        // onUltUse(ctx)      { /* 必殺技使用時 */ },
        // onCombatStart(ctx) { /* 戦闘開始時 */ },
        // onSkillUse(ctx)    { /* 戦闘スキル使用時 */ },
        // onAttack(ctx)      { /* 攻撃時 */ },
    },
});
