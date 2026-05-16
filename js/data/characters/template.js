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
