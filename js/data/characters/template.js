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
        aggro: 125,               // 狙われやすさ(運命による基準値)
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
        basic:  { type: 'attack', target: 'single', mult: { atk: 1.00 }, spGain: 1, energyGain: 20, toughness: 10, hitSplit: [1.0] },
        skill:  { type: 'attack', target: 'single', mult: { atk: 2.50 }, spCost: 1, energyGain: 30, toughness: 20, hitSplit: [1.0] },
        ult:    { type: 'attack', target: 'all',    mult: { atk: 3.00 }, energyCost: 120, energyGain: 5, toughness: 30, hitSplit: [1.0] },
        // bounce: { type: 'attack', target: 'bounce', bounceCount: 5, mult: { atk: 0.50 }, spCost: 1, energyGain: 30, toughness: 10, hitSplit: [1.0] },
        // shield: { type: 'buff', target: 'all_ally', shieldStat: STAT.DEF_BASE, spCost: 1, energyGain: 30, toughness: 0, hitSplit: [], levels: [ { shieldPct: 0.16, shieldFlat: 100 } ] },
        talent: { type: 'passive' },
    },

    // パーティに居る時、メイン火力キャラへ寄与する効果一覧(限界効用逓減タブの「パーティ枠」で参照)
    //
    // 共通フィールド:
    //   id            : 一意 (キャラ内で)
    //   source        : 'extra'|'ult'|'skill'|'talent'|'technique'|'eidolon' (UI表示分類)
    //   name          : UI 表示名。命名規約は「効果名 (発動条件)」例: "必殺 攻撃力バフ"、
    //                    "昇格6 軍勢 (常時発動)"、"昇格4 陣地 (戦闘開始2T)"。
    //                    星魂条件付き効果は name に "E<n> " プレフィックスを付けない —
    //                    UI 側で minEidolon バッジが自動表示される。
    //                    分かりにくい用語(caster/teammate/オーラ 等)は使わない。
    //   description   : ツールチップ。日本語の自然な文で書く。
    //   defaultActive : 初期 ON / OFF
    //   target        : 'all' (味方全体) / 'single' (メイン火力キャラが対象になった想定でのみ適用)
    //   duration      : 表示用、およびシミュレータ上での生存ターン数
    //   tickRule      : ターン減少基準 ('caster_turn_end', 'target_turn_end', 'target_turn_start' 等)
    //   dispellable   : 解除可能か (true/false)
    //   minEidolon?   : 星魂条件 (E1〜E6)。指定時は teammate.eidolon >= minEidolon の場合のみ
    //                    パーティ枠UIに表示される。UI 上では E<n>+ バッジが表示される。
    //   stackable?    : { max, default } 累積系効果。
    //                    stats (or computeStats の結果) は「1層あたり」の値として登録し、
    //                    UI 側で × 現在層数 した最終値が envBuffs に渡る。
    //                    max: 最大層数 (UI input の上限)、default: 初期層数 (defaultActive 時)
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
        //     dispellable: false,
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
        // 例) 累積系 (stats は1層あたり、UI で層数を 1〜max で選択)
        // {
        //     id: 'aura_stack',
        //     source: 'talent',
        //     name: '○○層 1層あたり 与ダメ+15%',
        //     description: '装備キャラの○○が「印」を獲得した時に+1層、max3層',
        //     stats: { [STAT.DMG_ALL]: 0.15 },
        //     stackable: { max: 3, default: 3 },
        //     defaultActive: false, target: 'single', duration: 3,
        // },
        // 例) 星魂条件付き (name には E<n> プレフィックス不要 — minEidolon バッジが自動表示される)
        // {
        //     id: 'e2_skill_spd',
        //     source: 'eidolon',
        //     name: '急行軍 (戦闘スキル後 1T)',
        //     description: '戦闘スキル発動時、指定された味方は行動後に速度+30%、1T',
        //     stats: { [STAT.SPD_PERCENT]: 0.30 },
        //     minEidolon: 2,
        //     defaultActive: false, target: 'single', duration: 1,
        // },
    ],
    selfEffects: [
        // 自身へのバフなどをここに記述
    ],
    enemyEffects: [
        // 例) 敵へのデバフや状態異常
        // {
        //     id: 'ult_def_down',
        //     source: 'ult',
        //     name: '必殺 防御力ダウン',
        //     description: '必殺発動時、敵全体の防御力-X%、2T。',
        //     debuffType: 'stat_down',
        //     baseChance: 1.0,
        //     stats: { [STAT.DEF_DOWN]: 0.20 }, // 必要なデバフステータスを適宜使用
        //     defaultActive: false,
        //     target: 'all',
        //     duration: 2, tickRule: 'target_turn_start', dispellable: true,
        // },
        // 例) 持続ダメージ (DoT)
        // {
        //     id: 'talent_shock',
        //     source: 'talent',
        //     name: '感電 (天賦)',
        //     description: '敵に感電状態を付与。ターン開始時に攻撃力の120%の雷属性持続ダメージ、2T。',
        //     debuffType: 'dot',
        //     dotType: 'shock',
        //     dotMultiplier: { atk: 1.20 },
        //     baseChance: 1.0,
        //     defaultActive: false, target: 'single', duration: 2, tickRule: 'target_turn_start', dispellable: true,
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
        // onTurnStart(ctx)   { /* ターン開始時 */ },
        // onTurnEnd(ctx)     { /* ターン終了時 */ },
        // onUltUse(ctx)      { /* 必殺技使用時 */ },
        // onCombatStart(ctx) { /* 戦闘開始時 */ },
        // onSkillUse(ctx)    { /* 戦闘スキル使用時 */ },
        // onAttack(ctx)      { /* 攻撃直前 */ },
        // onHit(ctx)         { /* 攻撃命中時 */ },
    },
});
