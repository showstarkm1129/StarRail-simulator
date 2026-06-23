import { ELEMENT, PATH } from '../../build/constants.js';
import { STAT, ELEMENT_DMG_KEYS } from '../../build/statKeys.js';
import { Registry } from '../../build/registry.js';

Registry.character.add({
    id: 'cipher',
    name: 'サフェル',
    element: ELEMENT.QUANTUM,
    path: PATH.NIHILITY,
    rarity: 5,

    base: {
        atk: 640,
        hp: 931,
        def: 509,
        spd: 106,
        aggro: 100, // 虚無の標準ヘイト値
    },
    maxEnergy: 130,

    traces: {
        stats: {
            [STAT.SPD_FLAT]: 14,
            [ELEMENT_DMG_KEYS.quantum]: 0.144,
            [STAT.EFFECT_HIT_RATE]: 0.10,
        },
        breakdown: [
            { node: '速度1', stat: STAT.SPD_FLAT, value: 2 },
            { node: '速度2', stat: STAT.SPD_FLAT, value: 2 },
            { node: '速度3', stat: STAT.SPD_FLAT, value: 3 },
            { node: '速度4', stat: STAT.SPD_FLAT, value: 3 },
            { node: '速度5', stat: STAT.SPD_FLAT, value: 4 },
            { node: '量子ダメ1', stat: ELEMENT_DMG_KEYS.quantum, value: 0.032 },
            { node: '量子ダメ2', stat: ELEMENT_DMG_KEYS.quantum, value: 0.048 },
            { node: '量子ダメ3', stat: ELEMENT_DMG_KEYS.quantum, value: 0.064 },
            { node: '命中1', stat: STAT.EFFECT_HIT_RATE, value: 0.040 },
            { node: '命中2', stat: STAT.EFFECT_HIT_RATE, value: 0.060 },
        ],
    },

    eidolons: {}, // 条件付きステータスは partyEffects / selfEffects 等で管理

    eidolonsDetail: {
        1: {
            name: '観察、機会を伺う',
            description: 'サフェルが記録するダメージ記録値が本来の150%になる。天賦による追加攻撃を発動する時、サフェルの攻撃力+80%、2ターン継続。',
        },
        2: {
            name: '焦燥、慌てる盗賊の手',
            description: 'サフェルの攻撃が敵に命中する時、120%の基礎確率でその敵が受けるダメージ+30%、2ターン継続。',
        },
        3: {
            name: '歪曲、無から有を生む',
            description: '必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。',
            levelBoost: { ult: 2, basic: 1 },
        },
        4: {
            name: '秘密、露わになれば煙の如く',
            description: '「お得意様」が味方の攻撃を受けた後、サフェルはその敵にサフェルの攻撃力50%分の量子属性付加ダメージを与える。',
        },
        5: {
            name: '狡知、逃げ足軽く飛ぶように',
            description: '戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。',
            levelBoost: { skill: 2, talent: 2 },
        },
        6: {
            name: '大盗、名も無き天地の間',
            description: 'サフェルの天賦による追加攻撃ダメージ+350%。なお、このダメージを記録する際、非超過ダメージの16%分を追加で記録する。必殺技を発動してダメージ記録値がクリアされた後、その回でクリアされたダメージ記録値の20%分が返還される。',
        },
    },

    skills: {
        basic: {
            name: 'おっと！魚は逃がさないよ',
            type: 'attack', target: 'single',
            element: ELEMENT.QUANTUM,
            spGain: 1, energyGain: 20, toughness: 10, hitSplit: [1.0],
            description: '指定した敵単体にサフェルの攻撃力X%分の量子属性ダメージを与える。',
            maxLevel: { default: 6, withEidolon: 7 }, // E3で+1されるが、実装はLv7まで
            levels: [
                { atk: 0.50 }, { atk: 0.60 }, { atk: 0.70 },
                { atk: 0.80 }, { atk: 0.90 }, { atk: 1.00 },
                { atk: 1.10 },
            ],
        },
        skill: {
            name: 'へへっ！お宝いただき～！',
            type: 'attack', target: 'blast',
            element: ELEMENT.QUANTUM,
            spCost: 1, energyGain: 30, toughness: 20, hitSplit: [1.0],
            description: '120%の基礎確率で指定した敵単体及び隣接する敵を虚弱状態にする。虚弱状態の敵の与ダメージ-10%、2ターン継続。同時に、サフェルの攻撃力+30%、2ターン継続。さらに、指定した敵単体にサフェルの攻撃力X%分の量子属性ダメージを与え、隣接する敵にサフェルの攻撃力Y%分の量子属性ダメージを与える。',
            maxLevel: { default: 10, withEidolon: 12 },
            // atk: メインターゲットへの倍率, adj: 隣接ターゲットへの倍率
            levels: [
                { atk: 1.00, adj: 0.50 }, { atk: 1.10, adj: 0.55 }, { atk: 1.20, adj: 0.60 },
                { atk: 1.30, adj: 0.65 }, { atk: 1.40, adj: 0.70 }, { atk: 1.50, adj: 0.75 },
                { atk: 1.62, adj: 0.81 }, { atk: 1.75, adj: 0.87 }, { atk: 1.87, adj: 0.93 },
                { atk: 2.00, adj: 1.00 }, { atk: 2.10, adj: 1.05 }, { atk: 2.20, adj: 1.10 },
            ],
        },
        ult: {
            name: '怪盗ニャンコ、参上！',
            type: 'attack', target: 'blast',
            element: ELEMENT.QUANTUM,
            energyCost: 130, energyGain: 5, spCost: 0, toughness: 60, hitSplit: [1.0],
            description: '指定した敵単体にサフェルの攻撃力X%分の量子属性ダメージを与える。その後、指定した敵単体に現在の天賦ダメージ記録値25%分の確定ダメージを与える。さらに、指定した敵単体および隣接する敵にサフェルの攻撃力Y%分の量子属性ダメージと現在の天賦ダメージ記録値75%分の確定ダメージを与える（この確定ダメージはすべてのスキルターゲットに均等に分けられる）。',
            maxLevel: { default: 10, withEidolon: 12 },
            // 限界効用逓減タブ用に、メインへの量子属性ダメージを atk (X + Y), 隣接へのダメージを adj (Y) とする
            // 確定ダメージ分は partyEffects 側で表現されているため含めない。
            levels: [
                { atk: 0.60 + 0.20, adj: 0.20 }, { atk: 0.66 + 0.22, adj: 0.22 }, { atk: 0.72 + 0.24, adj: 0.24 },
                { atk: 0.78 + 0.26, adj: 0.26 }, { atk: 0.84 + 0.28, adj: 0.28 }, { atk: 0.90 + 0.30, adj: 0.30 },
                { atk: 0.97 + 0.32, adj: 0.32 }, { atk: 1.05 + 0.35, adj: 0.35 }, { atk: 1.12 + 0.37, adj: 0.37 },
                { atk: 1.20 + 0.40, adj: 0.40 }, { atk: 1.26 + 0.42, adj: 0.42 }, { atk: 1.32 + 0.44, adj: 0.44 },
            ],
        },
        talent: {
            name: '親切なドロス人',
            type: 'passive',
            description: 'フィールド上に「お得意様」が存在しない場合、最大HPが最も高い敵単体を「お得意様」にする。戦闘スキルまたは必殺技発動時、メインターゲットを「お得意様」にする。「お得意様」が他の味方の攻撃を受けた後、即座に追加攻撃を行い、自身の攻撃力X%分の量子属性ダメージを与える(ターン1回まで)。味方が「お得意様」に与えた確定ダメージ以外のダメージの12%分を記録する(超過ダメージ除く)。必殺技発動後、記録値クリア。',
            maxLevel: { default: 10, withEidolon: 12 },
            levels: [
                { atk: 0.75 }, { atk: 0.82 }, { atk: 0.90 },
                { atk: 0.97 }, { atk: 1.05 }, { atk: 1.12 },
                { atk: 1.21 }, { atk: 1.31 }, { atk: 1.40 },
                { atk: 1.50 }, { atk: 1.57 }, { atk: 1.65 },
            ],
        },
        technique: {
            name: '長靴をはいた猫',
            type: 'support',
            description: '秘技を使用した後、15秒間継続する「ザグレウスの祝福」を獲得。移動速度+50%、敵に発見されない。戦闘に入ると、敵全体にサフェルの攻撃力100%分の量子属性ダメージを与える。また、この開幕ダメージで獲得するダメージ記録値+200%（限界効用逓減では考慮外）。',
        },
    },

    partyEffects: [
        {
            // enemyEffects.a6_vulnerability (敵全体 被ダメ+40% 常時オーラ) の火力計算用ミラー。
            // 火力計算は enemyEffects を読まないため、ここ partyEffects に DMG_TAKEN で載せる。
            // enemyEffects 側はシミュ用データとして別途保持 (命中率・継続等を含む)。
            id: 'cipher_a6_vulnerability_party',
            source: 'extra',
            name: '昇格6 被ダメージアップ (常時オーラ)',
            description: 'サフェルがフィールド上にいる場合、敵全体の受けるダメージ+40%。',
            stats: { [STAT.DMG_TAKEN]: 0.40 },
            defaultActive: true, target: 'all', duration: 'permanent', tickRule: 'none', dispellable: false,
        },
        {
            id: 'cipher_true_dmg_vip',
            source: 'talent',
            name: 'サフェル 記録解放 (お得意様 対象)',
            description: '限界効用逓減用。お得意様へのダメージ記録(天賦12%)と必殺による解放を別枠乗算として扱う。速度170以上なら24% (1凸なら36%)。完凸(E6)時は無限等比級数の和としてさらに1.25倍。',
            computeStats: (lv, mult, caster) => {
                let rate = 0.12;
                if (caster.derived.spd >= 170) rate += 0.12;
                else if (caster.derived.spd >= 140) rate += 0.06;

                const eidolon = caster.meta?.eidolon || 0;
                if (eidolon >= 1) rate *= 1.5;
                if (eidolon >= 6) rate *= 1.25;
                return { [STAT.SEP_MULT]: rate };
            },
            defaultActive: true, target: 'all', duration: 'permanent', dispellable: false,
        },
        {
            id: 'cipher_true_dmg_non_vip',
            source: 'extra',
            name: 'サフェル 記録解放 (お得意様以外 対象)',
            description: '限界効用逓減用。お得意様以外へのダメージ記録(昇格4: 8%)と必殺による解放を別枠乗算として扱う。速度170以上なら16% (1凸なら24%)。完凸(E6)時はさらに1.25倍。',
            computeStats: (lv, mult, caster) => {
                let rate = 0.08;
                if (caster.derived.spd >= 170) rate += 0.08;
                else if (caster.derived.spd >= 140) rate += 0.04;

                const eidolon = caster.meta?.eidolon || 0;
                if (eidolon >= 1) rate *= 1.5;
                if (eidolon >= 6) rate *= 1.25;
                return { [STAT.SEP_MULT]: rate };
            },
            defaultActive: false, target: 'all', duration: 'permanent', dispellable: false,
        },
    ],

    selfEffects: [
        {
            id: 'skill_atk_up',
            source: 'skill',
            name: '戦闘スキル 攻撃力アップ',
            description: '戦闘スキル発動時、サフェルの攻撃力+30%、2ターン継続。',
            stats: { [STAT.ATK_PERCENT]: 0.30 },
            defaultActive: true, target: 'single', duration: 2, tickRule: 'caster_turn_end', dispellable: true,
        },
        {
            id: 'a2_crit_rate',
            source: 'extra',
            name: '昇格2 会心率アップ',
            description: '速度140/170以上の時、会心率+25%/50%。',
            computeStats: (lv, mult, caster) => {
                let crit = 0;
                if (caster.derived.spd >= 170) crit = 0.50;
                else if (caster.derived.spd >= 140) crit = 0.25;
                return { [STAT.CRIT_RATE]: crit };
            },
            defaultActive: true, target: 'single', duration: 'permanent', dispellable: false,
        },
        {
            id: 'a6_fua_cdmg_up',
            source: 'extra',
            name: '昇格6 追加攻撃 会心ダメージアップ',
            description: '天賦による追加攻撃の会心ダメージ+100%。(ステータス画面には反映されず、追加攻撃の計算時のみ考慮するため、追加攻撃計算時に手動でONにしてください)',
            stats: { [STAT.CRIT_DMG]: 1.00 },
            defaultActive: false, target: 'single', duration: 'permanent', dispellable: false,
        },
        {
            id: 'e1_fua_atk_up',
            source: 'eidolon',
            name: 'E1 追加攻撃時 攻撃力アップ',
            description: '天賦による追加攻撃を発動する時、サフェルの攻撃力+80%、2ターン継続。',
            stats: { [STAT.ATK_PERCENT]: 0.80 },
            minEidolon: 1, defaultActive: false, target: 'single', duration: 2, tickRule: 'caster_turn_end', dispellable: true,
        },
        {
            id: 'e6_fua_dmg_up',
            source: 'eidolon',
            name: 'E6 追加攻撃ダメージアップ',
            description: 'サフェルの天賦による追加攻撃ダメージ+350%。',
            stats: { [STAT.DMG_FOLLOWUP]: 3.50 },
            minEidolon: 6, defaultActive: true, target: 'single', duration: 'permanent', dispellable: false,
        },
    ],

    enemyEffects: [
        {
            id: 'skill_weakness',
            source: 'skill',
            name: '戦闘スキル 虚弱',
            description: '虚弱状態の敵の与ダメージ-10%、2ターン継続。(基礎確率120%)',
            debuffType: 'stat_down',
            baseChance: 1.20,
            stats: {}, // 敵の与ダメージ低下はシミュレータに未実装のステータスキーのため空
            defaultActive: false, target: 'single', duration: 2, tickRule: 'target_turn_end', dispellable: true,
        },
        {
            id: 'a6_vulnerability',
            source: 'extra',
            name: '昇格6 被ダメージアップ (常時)',
            description: 'サフェルがフィールド上にいる場合、敵全体の受けるダメージ+40%。',
            debuffType: 'stat_down', baseChance: 2.0, // 必中オーラ
            stats: { [STAT.DMG_TAKEN]: 0.40 },
            defaultActive: true, target: 'all', duration: 'permanent', dispellable: false,
        },
        {
            id: 'e2_dmg_taken_up',
            source: 'eidolon',
            name: 'E2 攻撃命中時 被ダメージアップ',
            description: 'サフェルの攻撃が敵に命中する時、120%の基礎確率でその敵が受けるダメージ+30%、2ターン継続。',
            debuffType: 'stat_down', baseChance: 1.20,
            stats: { [STAT.DMG_TAKEN]: 0.30 },
            minEidolon: 2, defaultActive: false, target: 'single', duration: 2, tickRule: 'target_turn_end', dispellable: true,
        },
    ],

    extras: [
        {
            tier: 2, name: '金のボテス',
            description: 'サフェルの速度が140/170以上の時、会心率+25%/50%、獲得するダメージ記録値+50%/100%。',
        },
        {
            tier: 4, name: '三百の義賊',
            description: 'サフェルは味方が「お得意様」以外の敵に与えた確定ダメージ以外のダメージの8%分を記録する。超過ダメージは記録しない。',
        },
        {
            tier: 6, name: '世を欺く嘘',
            description: '天賦による追加攻撃の会心ダメージ+100%。サフェルがフィールド上にいる場合、敵全体の受けるダメージ+40%。',
        },
    ],

    hooks: {
        // シミュレータの内部ロジック用（限界効用逓減では使われない）
        onHit: [
            {
                source: 'cipher_talent_record',
                fn: (ctx) => {
                    // ダメージ記録や追加攻撃のトリガー枠組み
                }
            }
        ],
        onUltUse: [
            {
                source: 'cipher_ult_clear',
                fn: (ctx) => {
                    // 必殺技発動時の記録値クリア＆E6返還処理の枠組み
                }
            }
        ]
    },
});
