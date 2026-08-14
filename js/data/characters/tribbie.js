import { ELEMENT, PATH } from '../../build/constants.js';
import { STAT } from '../../build/statKeys.js';
import { Registry } from '../../build/registry.js';

Registry.character.add({
    id: 'tribbie',
    name: 'トリビー',
    element: ELEMENT.QUANTUM,
    path: PATH.HARMONY,
    rarity: 5,

    base: {
        atk: 524,
        hp: 1047,
        def: 728,
        spd: 96,
        aggro: 100, // 調和
    },
    maxEnergy: 120,

    traces: {
        stats: {
            [STAT.CRIT_DMG]: 0.373,
            [STAT.CRIT_RATE]: 0.120,
            [STAT.HP_PERCENT]: 0.100,
        },
        passives: [],
    },

    eidolons: {
        6: {
            // E6: 天賦による追加攻撃ダメージ+729%
            // ※ 追加攻撃の倍率加算等については hooks やダメージ計算側で対応
        }
    },

    skills: {
        basic:  { type: 'attack', target: 'single', mult: { hp: 0.33, hpY: 0.16 }, spGain: 1, energyGain: 20, toughness: 10, hitSplit: [1.0] },
        skill:  { 
            type: 'buff', target: 'all_ally', spCost: 1, energyGain: 30, toughness: 0, hitSplit: [],
            levels: [
                { resPen: 0.120 }, { resPen: 0.132 }, { resPen: 0.144 }, { resPen: 0.156 }, { resPen: 0.168 },
                { resPen: 0.180 }, { resPen: 0.195 }, { resPen: 0.210 }, { resPen: 0.225 }, { resPen: 0.240 },
                { resPen: 0.252 }, { resPen: 0.264 }, { resPen: 0.276 }
            ]
        },
        ult:    { 
            type: 'attack', target: 'all', mult: { hp: 0.30, hpZ: 0.12 }, energyCost: 120, energyGain: 5, toughness: 20, hitSplit: [1.0],
            levels: [
                { dmgTaken: 0.150 }, { dmgTaken: 0.165 }, { dmgTaken: 0.180 }, { dmgTaken: 0.195 }, { dmgTaken: 0.210 },
                { dmgTaken: 0.225 }, { dmgTaken: 0.243 }, { dmgTaken: 0.262 }, { dmgTaken: 0.281 }, { dmgTaken: 0.300 },
                { dmgTaken: 0.315 }, { dmgTaken: 0.330 }
            ]
        },
        talent: { type: 'passive' },
    },

    partyEffects: [
        {
            id: 'skill_res_pen',
            source: 'skill',
            name: '神の啓示 (戦闘スキル)',
            description: 'トリビーに「神の啓示」がある時、味方全体の全属性耐性貫通アップ',
            fromLevel: 'skill',
            computeStats: (lv, mult, caster) => ({
                [STAT.RES_PEN]: mult.resPen
            }),
            defaultActive: true,
            target: 'all',
            duration: 3,
            tickRule: 'caster_turn_end',
            dispellable: false,
        },
        {
            id: 'ult_dmg_taken',
            source: 'ult',
            name: '結界 (必殺技)',
            description: '結界が展開されている間、敵の受けるダメージアップ',
            fromLevel: 'ult',
            computeStats: (lv, mult, caster) => ({
                [STAT.DMG_TAKEN]: mult.dmgTaken
            }),
            defaultActive: true,
            target: 'all',
            duration: 2,
            tickRule: 'caster_turn_end',
            dispellable: false,
        },
        {
            id: 'e4_def_pen',
            source: 'eidolon',
            name: '心通い合う安らぎ',
            description: '「神の啓示」が継続している間、味方全体がダメージを与える時、敵の防御力を18%無視する。',
            stats: { [STAT.DEF_IGNORE]: 0.18 },
            minEidolon: 4,
            defaultActive: true,
            target: 'all',
            duration: 3,
            tickRule: 'caster_turn_end',
            dispellable: false,
        }
    ],

    selfEffects: [
        {
            id: 'a2_dmg_up',
            source: 'extra',
            name: '昇格2 壁の外の子羊…',
            description: '天賦の追加攻撃を行った後、トリビーの与ダメージ+72%。最大3層累積。',
            stats: { [STAT.DMG_ALL]: 0.72 },
            stackable: { max: 3, default: 3 },
            defaultActive: false,
            target: 'single',
            duration: 3,
            tickRule: 'caster_turn_end',
            dispellable: false,
        },
        {
            id: 'a4_max_hp_up',
            source: 'extra',
            name: '昇格4 羽の生えたガラス玉！',
            description: '結界が展開されている間、トリビーの最大HPが味方全体の最大HP合計値9%分アップする。',
            stats: {},
            defaultActive: true,
            target: 'single',
            duration: 2,
            tickRule: 'caster_turn_end',
            dispellable: false,
        }
    ],

    enemyEffects: [],

    hooks: {
    }
});
