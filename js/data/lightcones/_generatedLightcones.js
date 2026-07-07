import { STAT } from '../../build/statKeys.js';
import { addLightcone } from './_defineLightcone.js';

const DEFINITIONS = Object.freeze({
    "Reforged in Hellfire": {
        id: "Reforged in Hellfire",
        name: "煉獄に焼かれし新身",
        path: "Nihility",
        rarity: 5,
        base: { atk: 423, hp: 1375, def: 463 },
        stats: [
            { key: STAT.HP_PERCENT, values: [0.3, 0.375, 0.45, 0.525, 0.6] },
        ],
        selfEffects: [
        ],
        partyEffects: [
            {
                id: "reforged_in_hellfire_party_effect_1",
                name: "会心ダメ+与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.CRIT_DMG, values: [0.3, 0.375, 0.45, 0.525, 0.6] },
                ],
                defaultActive: false,
                target: "single",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
            {
                id: "reforged_in_hellfire_party_effect_2",
                name: "会心ダメ+与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.CRIT_DMG, values: [0.3, 0.375, 0.45, 0.525, 0.6] },
                ],
                defaultActive: false,
                target: "single",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        enemyEffects: [
            {
                id: "reforged_in_hellfire_enemy_effect_1",
                name: "会心ダメ+与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.CRIT_DMG, values: [0.3, 0.375, 0.45, 0.525, 0.6] },
                ],
                defaultActive: false,
                target: "single",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
                baseChance: 1.0,
                debuffType: "stat_down",
            },
            {
                id: "reforged_in_hellfire_enemy_effect_2",
                name: "会心ダメ+与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.CRIT_DMG, values: [0.3, 0.375, 0.45, 0.525, 0.6] },
                ],
                defaultActive: false,
                target: "single",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
                baseChance: 1.0,
                debuffType: "stat_down",
            },
        ],
    },
    "Welcome to the Cosmic City": {
        id: "Welcome to the Cosmic City",
        name: "銀河シティへようこそ",
        path: "Elation",
        rarity: 5,
        base: { atk: 476, hp: 1164, def: 529 },
        stats: [
            { key: STAT.SPD_PERCENT, values: [0.18, 0.21, 0.24, 0.27, 0.3] },
            { key: STAT.DEF_IGNORE, values: [0.2, 0.24, 0.28, 0.32, 0.36] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Until the Flowers Bloom Again": {
        id: "Until the Flowers Bloom Again",
        name: "再び花が咲く季節に",
        path: "Elation",
        rarity: 5,
        base: { atk: 635, hp: 952, def: 463 },
        stats: [
            { key: STAT.CRIT_DMG, values: [0.6, 0.75, 0.9, 1.05, 1.2] },
            { key: STAT.ENERGY_REGEN, values: [0.1, 0.115, 0.13, 0.145, 0.16] },
        ],
        selfEffects: [
        ],
        partyEffects: [
            {
                id: "until_the_flowers_bloom_again_party_effect_1",
                name: "敵被ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_TAKEN, values: [0.15, 0.1875, 0.225, 0.2625, 0.3] },
                ],
                defaultActive: false,
                target: "all",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        enemyEffects: [
            {
                id: "until_the_flowers_bloom_again_enemy_effect_1",
                name: "敵被ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_TAKEN, values: [0.15, 0.1875, 0.225, 0.2625, 0.3] },
                ],
                defaultActive: false,
                target: "all",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
                baseChance: 1.0,
                debuffType: "stat_down",
            },
        ],
    },
    "Tomorrow, Together": {
        id: "Tomorrow, Together",
        name: "みんなで一緒に未来へ",
        path: "Elation",
        rarity: 4,
        base: { atk: 476, hp: 952, def: 330 },
        stats: [
            { key: STAT.CRIT_DMG, values: [0.12, 0.15, 0.18, 0.21, 0.24] },
        ],
        selfEffects: [
        ],
        partyEffects: [
            {
                id: "tomorrow_together_party_effect_1",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.08, 0.09, 0.1, 0.11, 0.12] },
                ],
                defaultActive: false,
                target: "all",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        enemyEffects: [
        ],
    },
    "Elation Brimming With Blessings": {
        id: "Elation Brimming With Blessings",
        name: "愉悦溢れる祝福",
        path: "Elation",
        rarity: 5,
        base: { atk: 529, hp: 952, def: 463 },
        stats: [
            { key: STAT.ATK_PERCENT, values: [0.2, 0.25, 0.3, 0.35, 0.4] },
        ],
        selfEffects: [
            {
                id: "elation_brimming_with_blessings_self_effect_1",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.12, 0.15, 0.18, 0.21, 0.24] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "When She Decided To See": {
        id: "When She Decided To See",
        name: "彼女が視ると決めた時",
        path: "Elation",
        rarity: 5,
        base: { atk: 529, hp: 1058, def: 529 },
        stats: [
            { key: STAT.SPD_PERCENT, values: [0.18, 0.21, 0.24, 0.27, 0.3] },
        ],
        selfEffects: [
        ],
        partyEffects: [
            {
                id: "when_she_decided_to_see_party_effect_1",
                name: "会心率",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.CRIT_RATE, values: [0.1, 0.11, 0.12, 0.13, 0.14] },
                ],
                defaultActive: false,
                target: "all",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
            {
                id: "when_she_decided_to_see_party_effect_2",
                name: "会心ダメ+与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.CRIT_DMG, values: [0.3, 0.38, 0.45, 0.53, 0.6] },
                ],
                defaultActive: false,
                target: "all",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
            {
                id: "when_she_decided_to_see_party_ep_3",
                name: "EP回復効率",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.ENERGY_REGEN, values: [0.12, 0.14, 0.16, 0.18, 0.2] },
                ],
                defaultActive: false,
                target: "all",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        enemyEffects: [
        ],
    },
    "Dazzled by a Flowery World": {
        id: "Dazzled by a Flowery World",
        name: "きらびやかな世界",
        path: "Elation",
        rarity: 5,
        base: { atk: 582, hp: 1058, def: 463 },
        stats: [
            { key: STAT.CRIT_DMG, values: [0.48, 0.56, 0.64, 0.72, 0.8] },
        ],
        selfEffects: [
            {
                id: "dazzled_by_a_flowery_world_self_effect_1",
                name: "防御無視",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DEF_IGNORE, values: [0.05, 0.06, 0.07, 0.08, 0.09] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
                stackable: { max: 4, default: 4 },
            },
        ],
        partyEffects: [
            {
                id: "dazzled_by_a_flowery_world_party_effect_2",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.2, 0.24, 0.28, 0.32, 0.36] },
                ],
                defaultActive: false,
                target: "all",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        enemyEffects: [
        ],
    },
    "Today's Good Luck": {
        id: "Today's Good Luck",
        name: "今日は好運",
        path: "Elation",
        rarity: 4,
        base: { atk: 529, hp: 952, def: 396 },
        stats: [
            { key: STAT.CRIT_RATE, values: [0.12, 0.14, 0.16, 0.18, 0.2] },
        ],
        selfEffects: [
            {
                id: "todays_good_luck_self_effect_1",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.12, 0.14, 0.16, 0.18, 0.2] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
                stackable: { max: 2, default: 2 },
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Mushy Shroomy's Adventures": {
        id: "Mushy Shroomy's Adventures",
        name: "タケタケ冒険記",
        path: "Elation",
        rarity: 4,
        base: { atk: 476, hp: 846, def: 396 },
        stats: [
            { key: STAT.DMG_ALL, values: [0.12, 0.14, 0.16, 0.2, 0.2] },
        ],
        selfEffects: [
        ],
        partyEffects: [
            {
                id: "mushy_shroomys_adventures_party_effect_1",
                name: "敵被ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_TAKEN, values: [0.06, 0.07, 0.08, 0.09, 0.1] },
                ],
                defaultActive: false,
                target: "all",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        enemyEffects: [
            {
                id: "mushy_shroomys_adventures_enemy_effect_1",
                name: "敵被ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_TAKEN, values: [0.06, 0.07, 0.08, 0.09, 0.1] },
                ],
                defaultActive: false,
                target: "all",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
                baseChance: 1.0,
                debuffType: "stat_down",
            },
        ],
    },
    "Lingering Tear": {
        id: "Lingering Tear",
        name: "残涙",
        path: "Elation",
        rarity: 3,
        base: { atk: 317, hp: 846, def: 264 },
        stats: [
        ],
        selfEffects: [
            {
                id: "lingering_tear_self_effect_1",
                name: "会心ダメ+与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.CRIT_DMG, values: [0.2, 0.25, 0.3, 0.35, 0.4] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Sneering": {
        id: "Sneering",
        name: "嗤笑",
        path: "Elation",
        rarity: 3,
        base: { atk: 370, hp: 740, def: 264 },
        stats: [
        ],
        selfEffects: [
            {
                id: "sneering_self_effect_1",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.16, 0.2, 0.24, 0.28, 0.32] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Never Forget Her Flame": {
        id: "Never Forget Her Flame",
        name: "彼女の炎を忘れずに",
        path: "Nihility",
        rarity: 5,
        base: { atk: 529, hp: 1164, def: 463 },
        stats: [
            { key: STAT.BREAK_EFFECT, values: [0.6, 0.75, 0.9, 1.05, 1.2] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Fly Into a Pink Tomorrow": {
        id: "Fly Into a Pink Tomorrow",
        name: "ピンク色の明日へ",
        path: "Remembrance",
        rarity: 4,
        base: { atk: 476, hp: 846, def: 396 },
        stats: [
            { key: STAT.CRIT_DMG, values: [0.12, 0.15, 0.18, 0.21, 0.24] },
        ],
        selfEffects: [
        ],
        partyEffects: [
            {
                id: "fly_into_a_pink_tomorrow_party_effect_1",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.08, 0.1, 0.12, 0.14, 0.16] },
                ],
                defaultActive: false,
                target: "all",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        enemyEffects: [
        ],
    },
    "Why Does the Ocean Sing": {
        id: "Why Does the Ocean Sing",
        name: "海の歌は何がため",
        path: "Nihility",
        rarity: 5,
        base: { atk: 635, hp: 952, def: 463 },
        stats: [
            { key: STAT.EFFECT_HIT_RATE, values: [0.4, 0.45, 0.5, 0.55, 0.6] },
        ],
        selfEffects: [
            {
                id: "why_does_the_ocean_sing_self_effect_1",
                name: "別枠",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.SEP_MULT, values: [0.05, 0.0625, 0.075, 0.0875, 0.1] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
                stackable: { max: 6, default: 6 },
            },
            {
                id: "why_does_the_ocean_sing_self_spd_2",
                name: "SPD",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.SPD_PERCENT, values: [0.1, 0.125, 0.15, 0.175, 0.2] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "The Forever Victual": {
        id: "The Forever Victual",
        name: "永遠の迷境ごはん",
        path: "Harmony",
        rarity: 4,
        base: { atk: 476, hp: 952, def: 330 },
        stats: [
            { key: STAT.ATK_PERCENT, values: [0.16, 0.2, 0.24, 0.28, 0.32] },
        ],
        selfEffects: [
            {
                id: "the_forever_victual_self_atk_1",
                name: "ATK",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.ATK_PERCENT, values: [0.08, 0.1, 0.12, 0.14, 0.16] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
                stackable: { max: 3, default: 3 },
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Thus Burns the Dawn": {
        id: "Thus Burns the Dawn",
        name: "燃え盛る黎明のように",
        path: "Destruction",
        rarity: 5,
        base: { atk: 687, hp: 952, def: 396 },
        stats: [
            { key: STAT.SPD_FLAT, values: [12, 14, 16, 18, 20] },
        ],
        selfEffects: [
            {
                id: "thus_burns_the_dawn_self_effect_1",
                name: "防御無視",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DEF_IGNORE, values: [0.18, 0.225, 0.27, 0.315, 0.36] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
            {
                id: "thus_burns_the_dawn_self_effect_2",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.6, 0.78, 0.96, 1.14, 1.32] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "A Thankless Coronation": {
        id: "A Thankless Coronation",
        name: "報われぬ戴冠",
        path: "Destruction",
        rarity: 5,
        base: { atk: 582, hp: 952, def: 529 },
        stats: [
            { key: STAT.CRIT_DMG, values: [0.36, 0.45, 0.54, 0.63, 0.72] },
        ],
        selfEffects: [
            {
                id: "a_thankless_coronation_self_atk_1",
                name: "ATK",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.ATK_PERCENT, values: [0.4, 0.5, 0.6, 0.7, 0.8] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
            {
                id: "a_thankless_coronation_self_atk_2",
                name: "ATK",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.ATK_PERCENT, values: [0.4, 0.5, 0.6, 0.7, 0.8] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "The Hell Where Ideals Burn": {
        id: "The Hell Where Ideals Burn",
        name: "理想を焼く奈落で",
        path: "The Hunt",
        rarity: 5,
        base: { atk: 582, hp: 952, def: 529 },
        stats: [
            { key: STAT.CRIT_RATE, values: [0.16, 0.2, 0.24, 0.28, 0.32] },
        ],
        selfEffects: [
            {
                id: "the_hell_where_ideals_burn_self_atk_1",
                name: "ATK",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.ATK_PERCENT, values: [0.4, 0.5, 0.6, 0.7, 0.8] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
            {
                id: "the_hell_where_ideals_burn_self_atk_2",
                name: "ATK",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.ATK_PERCENT, values: [0.1, 0.125, 0.15, 0.175, 0.2] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
                stackable: { max: 4, default: 4 },
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "A Dream Scented in Wheat": {
        id: "A Dream Scented in Wheat",
        name: "麦の香り漂う夢",
        path: "Erudition",
        rarity: 4,
        base: { atk: 529, hp: 952, def: 396 },
        stats: [
            { key: STAT.CRIT_RATE, values: [0.12, 0.14, 0.16, 0.18, 0.2] },
            { key: STAT.DMG_FOLLOWUP, values: [0.24, 0.28, 0.32, 0.36, 0.4] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "A Trail of Bygone Blood": {
        id: "A Trail of Bygone Blood",
        name: "古より受け継がれる血",
        path: "Destruction",
        rarity: 4,
        base: { atk: 529, hp: 1058, def: 330 },
        stats: [
            { key: STAT.CRIT_RATE, values: [0.12, 0.14, 0.16, 0.18, 0.2] },
            { key: STAT.DMG_ULT, values: [0.24, 0.28, 0.32, 0.36, 0.4] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Holiday Thermae Escapade": {
        id: "Holiday Thermae Escapade",
        name: "休日のバルネア大冒険",
        path: "Nihility",
        rarity: 4,
        base: { atk: 529, hp: 1058, def: 330 },
        stats: [
            { key: STAT.DMG_ALL, values: [0.16, 0.2, 0.24, 0.28, 0.32] },
        ],
        selfEffects: [
            {
                id: "holiday_thermae_escapade_self_effect_1",
                name: "敵被ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_TAKEN, values: [0.1, 0.115, 0.13, 0.145, 0.16] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "In Pursuit of the Wind": {
        id: "In Pursuit of the Wind",
        name: "風を追う時",
        path: "Harmony",
        rarity: 4,
        base: { atk: 476, hp: 1058, def: 396 },
        stats: [
        ],
        selfEffects: [
        ],
        partyEffects: [
            {
                id: "in_pursuit_of_the_wind_party_effect_1",
                name: "別枠",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.SEP_MULT, values: [0.16, 0.18, 0.2, 0.22, 0.24] },
                ],
                defaultActive: false,
                target: "all",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        enemyEffects: [
        ],
    },
    "Journey, Forever Peaceful": {
        id: "Journey, Forever Peaceful",
        name: "旅が平穏であるように",
        path: "Preservation",
        rarity: 4,
        base: { atk: 370, hp: 1058, def: 529 },
        stats: [
        ],
        selfEffects: [
        ],
        partyEffects: [
            {
                id: "journey_forever_peaceful_party_effect_1",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.12, 0.14, 0.16, 0.18, 0.2] },
                ],
                defaultActive: false,
                target: "single",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        enemyEffects: [
        ],
    },
    "See You at the End": {
        id: "See You at the End",
        name: "終点でまた会おう",
        path: "The Hunt",
        rarity: 4,
        base: { atk: 529, hp: 952, def: 396 },
        stats: [
            { key: STAT.CRIT_DMG, values: [0.24, 0.28, 0.32, 0.36, 0.4] },
            { key: STAT.DMG_FOLLOWUP, values: [0.24, 0.28, 0.32, 0.36, 0.4] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "The Flower Remembers": {
        id: "The Flower Remembers",
        name: "花は忘れない",
        path: "Remembrance",
        rarity: 4,
        base: { atk: 529, hp: 1058, def: 330 },
        stats: [
            { key: STAT.CRIT_DMG, values: [0.24, 0.28, 0.32, 0.36, 0.4] },
            { key: STAT.CRIT_DMG, values: [0.24, 0.28, 0.32, 0.36, 0.4] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "The Story's Next Page": {
        id: "The Story's Next Page",
        name: "物語をめくって",
        path: "Remembrance",
        rarity: 4,
        base: { atk: 370, hp: 1058, def: 396 },
        stats: [
            { key: STAT.HP_PERCENT, values: [0.16, 0.2, 0.24, 0.28, 0.32] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Unto Tomorrow's Morrow": {
        id: "Unto Tomorrow's Morrow",
        name: "明日の明日まで",
        path: "Abundance",
        rarity: 4,
        base: { atk: 476, hp: 1058, def: 396 },
        stats: [
            { key: STAT.HEAL_BONUS, values: [0.12, 0.15, 0.18, 0.21, 0.24] },
        ],
        selfEffects: [
        ],
        partyEffects: [
            {
                id: "unto_tomorrows_morrow_party_effect_1",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.12, 0.14, 0.16, 0.18, 0.2] },
                ],
                defaultActive: false,
                target: "single",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        enemyEffects: [
        ],
    },
    "Life Should Be Cast to Flames": {
        id: "Life Should Be Cast to Flames",
        name: "生命、焼滅すべし",
        path: "Erudition",
        rarity: 5,
        base: { atk: 582, hp: 952, def: 529 },
        stats: [
        ],
        selfEffects: [
            {
                id: "life_should_be_cast_to_flames_self_effect_1",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.6, 0.7, 0.8, 0.9, 1] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
            {
                id: "life_should_be_cast_to_flames_party_effect_2",
                name: "防御ダウン",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DEF_DOWN, values: [0.12, 0.15, 0.18, 0.21, 0.24] },
                ],
                defaultActive: false,
                target: "single",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        enemyEffects: [
            {
                id: "life_should_be_cast_to_flames_enemy_effect_2",
                name: "防御ダウン",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DEF_DOWN, values: [0.12, 0.15, 0.18, 0.21, 0.24] },
                ],
                defaultActive: false,
                target: "single",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
                baseChance: 1.0,
                debuffType: "stat_down",
            },
        ],
    },
    "Flame of Blood, Blaze My Path": {
        id: "Flame of Blood, Blaze My Path",
        name: "前途燃やす血の如き炎",
        path: "Destruction",
        rarity: 5,
        base: { atk: 476, hp: 1375, def: 396 },
        stats: [
            { key: STAT.HP_PERCENT, values: [0.18, 0.21, 0.24, 0.27, 0.3] },
            { key: STAT.HEAL_TAKEN, values: [0.2, 0.25, 0.3, 0.35, 0.4] },
        ],
        selfEffects: [
            {
                id: "flame_of_blood_blaze_my_path_self_hp_1",
                name: "HP",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.HP_PERCENT, values: [0.06, 0.065, 0.07, 0.075, 0.08] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
            {
                id: "flame_of_blood_blaze_my_path_self_effect_2",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.3, 0.35, 0.4, 0.45, 0.5] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
            {
                id: "flame_of_blood_blaze_my_path_self_effect_3",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.3, 0.35, 0.4, 0.45, 0.5] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Memory's Curtain Never Falls": {
        id: "Memory's Curtain Never Falls",
        name: "尽きぬ追憶",
        path: "Remembrance",
        rarity: 5,
        base: { atk: 529, hp: 1058, def: 396 },
        stats: [
            { key: STAT.SPD_PERCENT, values: [0.06, 0.075, 0.09, 0.105, 0.12] },
        ],
        selfEffects: [
        ],
        partyEffects: [
            {
                id: "memorys_curtain_never_falls_party_effect_1",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.08, 0.1, 0.12, 0.14, 0.16] },
                ],
                defaultActive: false,
                target: "all",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        enemyEffects: [
        ],
    },
    "Into the Unreachable Veil": {
        id: "Into the Unreachable Veil",
        name: "触れてはならぬ領域へ",
        path: "Erudition",
        rarity: 5,
        base: { atk: 635, hp: 952, def: 463 },
        stats: [
            { key: STAT.CRIT_RATE, values: [0.12, 0.14, 0.16, 0.18, 0.2] },
        ],
        selfEffects: [
            {
                id: "into_the_unreachable_veil_self_effect_1",
                name: "必殺与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ULT, values: [0.6, 0.7, 0.8, 0.9, 1] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Time Woven Into Gold": {
        id: "Time Woven Into Gold",
        name: "光陰を織り黄金と成す",
        path: "Remembrance",
        rarity: 5,
        base: { atk: 635, hp: 1058, def: 396 },
        stats: [
            { key: STAT.SPD_FLAT, values: [12, 14, 16, 18, 20] },
        ],
        selfEffects: [
            {
                id: "time_woven_into_gold_self_effect_1",
                name: "会心ダメ+与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.CRIT_DMG, values: [0.09, 0.105, 0.12, 0.135, 0.15] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
                stackable: { max: 6, default: 6 },
            },
            {
                id: "time_woven_into_gold_self_effect_2",
                name: "通常与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_BASIC, values: [0.09, 0.105, 0.12, 0.135, 0.15] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Geniuses' Greetings": {
        id: "Geniuses' Greetings",
        name: "天才たちの「挨拶」",
        path: "Remembrance",
        rarity: 4,
        base: { atk: 476, hp: 952, def: 330 },
        stats: [
            { key: STAT.ATK_PERCENT, values: [0.16, 0.2, 0.24, 0.28, 0.32] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Sweat Now, Cry Less": {
        id: "Sweat Now, Cry Less",
        name: "流すなら涙より汗",
        path: "Remembrance",
        rarity: 4,
        base: { atk: 529, hp: 1058, def: 198 },
        stats: [
            { key: STAT.CRIT_RATE, values: [0.12, 0.14, 0.16, 0.18, 0.2] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Ninjutsu Inscription: Dazzling Evilbreaker": {
        id: "Ninjutsu Inscription: Dazzling Evilbreaker",
        name: "忍法帖・繚乱破魔",
        path: "Erudition",
        rarity: 5,
        base: { atk: 582, hp: 952, def: 529 },
        stats: [
            { key: STAT.BREAK_EFFECT, values: [0.6, 0.7, 0.8, 0.9, 1] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Reminiscence": {
        id: "Reminiscence",
        name: "辿る記憶",
        path: "Remembrance",
        rarity: 3,
        base: { atk: 423, hp: 635, def: 264 },
        stats: [
        ],
        selfEffects: [
            {
                id: "reminiscence_self_effect_1",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.08, 0.09, 0.1, 0.11, 0.12] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
                stackable: { max: 4, default: 4 },
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Victory In a Blink": {
        id: "Victory In a Blink",
        name: "瞬刻の勝機",
        path: "Remembrance",
        rarity: 4,
        base: { atk: 476, hp: 846, def: 396 },
        stats: [
            { key: STAT.CRIT_DMG, values: [0.12, 0.15, 0.18, 0.21, 0.24] },
        ],
        selfEffects: [
        ],
        partyEffects: [
            {
                id: "victory_in_a_blink_party_effect_1",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.08, 0.1, 0.12, 0.14, 0.16] },
                ],
                defaultActive: false,
                target: "all",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        enemyEffects: [
        ],
    },
    "Shadowburn": {
        id: "Shadowburn",
        name: "燃ゆる影",
        path: "Remembrance",
        rarity: 3,
        base: { atk: 317, hp: 846, def: 264 },
        stats: [
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Dream's Montage": {
        id: "Dream's Montage",
        name: "夢のモンタージュ",
        path: "Abundance",
        rarity: 4,
        base: { atk: 423, hp: 952, def: 396 },
        stats: [
            { key: STAT.SPD_PERCENT, values: [0.08, 0.09, 0.1, 0.11, 0.12] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Scent Alone Stays True": {
        id: "Scent Alone Stays True",
        name: "昔日の香りは今も猶",
        path: "Abundance",
        rarity: 5,
        base: { atk: 529, hp: 1058, def: 529 },
        stats: [
            { key: STAT.BREAK_EFFECT, values: [0.6, 0.7, 0.8, 0.9, 1] },
            { key: STAT.BREAK_EFFECT, values: [0.08, 0.1, 0.12, 0.14, 0.16] },
            { key: STAT.DMG_ALL, values: [0.08, 0.1, 0.12, 0.14, 0.16] },
        ],
        selfEffects: [
            {
                id: "scent_alone_stays_true_self_effect_1",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.1, 0.12, 0.14, 0.16, 0.18] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "I Venture Forth to Hunt": {
        id: "I Venture Forth to Hunt",
        name: "我が征く巡狩の道",
        path: "The Hunt",
        rarity: 5,
        base: { atk: 635, hp: 952, def: 463 },
        stats: [
            { key: STAT.CRIT_RATE, values: [0.15, 0.175, 0.2, 0.225, 0.25] },
        ],
        selfEffects: [
            {
                id: "i_venture_forth_to_hunt_self_effect_1",
                name: "防御無視",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DEF_IGNORE, values: [0.27, 0.3, 0.33, 0.36, 0.39] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Ninja Record: Sound Hunt": {
        id: "Ninja Record: Sound Hunt",
        name: "忍事録・音律狩猟",
        path: "Destruction",
        rarity: 4,
        base: { atk: 476, hp: 1058, def: 264 },
        stats: [
            { key: STAT.HP_PERCENT, values: [0.12, 0.15, 0.18, 0.21, 0.24] },
        ],
        selfEffects: [
            {
                id: "ninja_record_sound_hunt_self_effect_1",
                name: "会心ダメ+与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.CRIT_DMG, values: [0.18, 0.225, 0.27, 0.315, 0.36] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Long Road Leads Home": {
        id: "Long Road Leads Home",
        name: "長途はやがて帰途へと続く",
        path: "Nihility",
        rarity: 5,
        base: { atk: 476, hp: 952, def: 661 },
        stats: [
            { key: STAT.BREAK_EFFECT, values: [0.6, 0.7, 0.8, 0.9, 1] },
        ],
        selfEffects: [
        ],
        partyEffects: [
            {
                id: "long_road_leads_home_party_effect_1",
                name: "敵被ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_TAKEN, values: [0.18, 0.21, 0.24, 0.27, 0.3] },
                ],
                defaultActive: false,
                target: "single",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        enemyEffects: [
            {
                id: "long_road_leads_home_enemy_effect_1",
                name: "敵被ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_TAKEN, values: [0.18, 0.21, 0.24, 0.27, 0.3] },
                ],
                defaultActive: false,
                target: "single",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
                baseChance: 1.0,
                debuffType: "stat_down",
            },
        ],
    },
    "Shadowed by Night": {
        id: "Shadowed by Night",
        name: "夜は影のように付き纏う",
        path: "The Hunt",
        rarity: 4,
        base: { atk: 476, hp: 846, def: 396 },
        stats: [
            { key: STAT.BREAK_EFFECT, values: [0.28, 0.35, 0.42, 0.49, 0.56] },
        ],
        selfEffects: [
            {
                id: "shadowed_by_night_self_spd_1",
                name: "SPD",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.SPD_PERCENT, values: [0.08, 0.09, 0.1, 0.11, 0.12] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Sailing Towards a Second Life": {
        id: "Sailing Towards a Second Life",
        name: "二度目の生に向かって",
        path: "The Hunt",
        rarity: 5,
        base: { atk: 582, hp: 1058, def: 463 },
        stats: [
            { key: STAT.BREAK_EFFECT, values: [0.6, 0.7, 0.8, 0.9, 1] },
            { key: STAT.DEF_IGNORE, values: [0.2, 0.23, 0.26, 0.29, 0.32] },
        ],
        selfEffects: [
            {
                id: "sailing_towards_a_second_life_self_spd_1",
                name: "SPD",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.SPD_PERCENT, values: [0.12, 0.14, 0.16, 0.18, 0.2] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Dance at Sunset": {
        id: "Dance at Sunset",
        name: "夕日に舞う",
        path: "Destruction",
        rarity: 5,
        base: { atk: 582, hp: 1058, def: 463 },
        stats: [
            { key: STAT.CRIT_DMG, values: [0.36, 0.42, 0.48, 0.54, 0.6] },
        ],
        selfEffects: [
            {
                id: "dance_at_sunset_self_effect_1",
                name: "追加攻撃与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_FOLLOWUP, values: [0.36, 0.42, 0.48, 0.54, 0.6] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Eternal Calculus": {
        id: "Eternal Calculus",
        name: "絶え間ない演算",
        path: "Erudition",
        rarity: 5,
        base: { atk: 529, hp: 1058, def: 396 },
        stats: [
            { key: STAT.ATK_PERCENT, values: [0.08, 0.09, 0.1, 0.11, 0.12] },
        ],
        selfEffects: [
            {
                id: "eternal_calculus_self_atk_1",
                name: "ATK",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.ATK_PERCENT, values: [0.04, 0.05, 0.06, 0.07, 0.08] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
            {
                id: "eternal_calculus_self_spd_2",
                name: "SPD",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.SPD_PERCENT, values: [0.08, 0.1, 0.12, 0.14, 0.16] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Those Many Springs": {
        id: "Those Many Springs",
        name: "幾度目かの春",
        path: "Nihility",
        rarity: 5,
        base: { atk: 582, hp: 952, def: 529 },
        stats: [
            { key: STAT.EFFECT_HIT_RATE, values: [0.6, 0.7, 0.8, 0.9, 1] },
        ],
        selfEffects: [
        ],
        partyEffects: [
            {
                id: "those_many_springs_party_effect_1",
                name: "敵被ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_TAKEN, values: [0.1, 0.12, 0.14, 0.16, 0.18] },
                ],
                defaultActive: false,
                target: "single",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
            {
                id: "those_many_springs_party_effect_2",
                name: "敵被ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_TAKEN, values: [0.14, 0.16, 0.18, 0.2, 0.22] },
                ],
                defaultActive: false,
                target: "single",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        enemyEffects: [
            {
                id: "those_many_springs_enemy_effect_1",
                name: "敵被ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_TAKEN, values: [0.1, 0.12, 0.14, 0.16, 0.18] },
                ],
                defaultActive: false,
                target: "single",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
                baseChance: 1.0,
                debuffType: "stat_down",
            },
            {
                id: "those_many_springs_enemy_effect_2",
                name: "敵被ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_TAKEN, values: [0.14, 0.16, 0.18, 0.2, 0.22] },
                ],
                defaultActive: false,
                target: "single",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
                baseChance: 1.0,
                debuffType: "stat_down",
            },
        ],
    },
    "Yet Hope Is Priceless": {
        id: "Yet Hope Is Priceless",
        name: "されど希望の銘は無価",
        path: "Erudition",
        rarity: 5,
        base: { atk: 582, hp: 952, def: 529 },
        stats: [
            { key: STAT.CRIT_RATE, values: [0.16, 0.19, 0.22, 0.25, 0.28] },
        ],
        selfEffects: [
            {
                id: "yet_hope_is_priceless_self_effect_1",
                name: "追加攻撃与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_FOLLOWUP, values: [0.12, 0.14, 0.16, 0.18, 0.2] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
            {
                id: "yet_hope_is_priceless_self_effect_2",
                name: "防御無視",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DEF_IGNORE, values: [0.2, 0.24, 0.28, 0.32, 0.36] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Poised to Bloom": {
        id: "Poised to Bloom",
        name: "美しき華よ今咲かん",
        path: "Harmony",
        rarity: 4,
        base: { atk: 423, hp: 952, def: 396 },
        stats: [
            { key: STAT.ATK_PERCENT, values: [0.16, 0.2, 0.24, 0.28, 0.32] },
        ],
        selfEffects: [
            {
                id: "poised_to_bloom_self_effect_1",
                name: "会心ダメ+与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.CRIT_DMG, values: [0.16, 0.2, 0.24, 0.28, 0.32] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Whereabouts Should Dreams Rest": {
        id: "Whereabouts Should Dreams Rest",
        name: "夢が帰り着く場所",
        path: "Destruction",
        rarity: 5,
        base: { atk: 476, hp: 1164, def: 529 },
        stats: [
            { key: STAT.BREAK_EFFECT, values: [0.6, 0.7, 0.8, 0.9, 1] },
            { key: STAT.DMG_TAKEN, values: [0.24, 0.28, 0.32, 0.36, 0.4] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "After the Charmony Fall": {
        id: "After the Charmony Fall",
        name: "調和が沈黙した後",
        path: "Erudition",
        rarity: 4,
        base: { atk: 476, hp: 846, def: 396 },
        stats: [
            { key: STAT.BREAK_EFFECT, values: [0.28, 0.35, 0.42, 0.49, 0.56] },
        ],
        selfEffects: [
            {
                id: "after_the_charmony_fall_self_spd_1",
                name: "SPD",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.SPD_PERCENT, values: [0.08, 0.1, 0.12, 0.14, 0.16] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "For Tomorrow's Journey": {
        id: "For Tomorrow's Journey",
        name: "明日のための旅",
        path: "Harmony",
        rarity: 4,
        base: { atk: 476, hp: 952, def: 330 },
        stats: [
            { key: STAT.ATK_PERCENT, values: [0.16, 0.2, 0.24, 0.28, 0.32] },
        ],
        selfEffects: [
            {
                id: "for_tomorrows_journey_self_effect_1",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.18, 0.21, 0.24, 0.27, 0.3] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Destiny's Threads Forewoven": {
        id: "Destiny's Threads Forewoven",
        name: "運命を紡ぐ糸",
        path: "Preservation",
        rarity: 4,
        base: { atk: 370, hp: 952, def: 463 },
        stats: [
            { key: STAT.EFFECT_RES, values: [0.12, 0.14, 0.16, 0.18, 0.2] },
        ],
        selfEffects: [
            {
                id: "destinys_threads_forewoven_self_effect_1",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.008, 0.009, 0.01, 0.011, 0.012] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
            {
                id: "destinys_threads_forewoven_self_effect_2",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.32, 0.36, 0.4, 0.44, 0.48] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Along the Passing Shore": {
        id: "Along the Passing Shore",
        name: "流れ逝く岸を歩いて",
        path: "Nihility",
        rarity: 5,
        base: { atk: 635, hp: 1058, def: 396 },
        stats: [
            { key: STAT.CRIT_DMG, values: [0.36, 0.42, 0.48, 0.54, 0.6] },
            { key: STAT.DMG_ALL, values: [0.24, 0.28, 0.32, 0.36, 0.4] },
            { key: STAT.DMG_ULT, values: [0.24, 0.28, 0.32, 0.36, 0.4] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Boundless Choreo": {
        id: "Boundless Choreo",
        name: "終わりなき舞踏",
        path: "Nihility",
        rarity: 4,
        base: { atk: 476, hp: 952, def: 330 },
        stats: [
            { key: STAT.CRIT_RATE, values: [0.08, 0.1, 0.12, 0.14, 0.16] },
            { key: STAT.CRIT_DMG, values: [0.24, 0.3, 0.36, 0.42, 0.48] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Concert for Two": {
        id: "Concert for Two",
        name: "二人だけのコンサート",
        path: "Preservation",
        rarity: 4,
        base: { atk: 370, hp: 952, def: 463 },
        stats: [
            { key: STAT.DEF_PERCENT, values: [0.16, 0.2, 0.24, 0.28, 0.32] },
        ],
        selfEffects: [
            {
                id: "concert_for_two_self_effect_1",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.04, 0.05, 0.06, 0.07, 0.08] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Reforged Remembrance": {
        id: "Reforged Remembrance",
        name: "時間の記憶を再構築して",
        path: "Nihility",
        rarity: 5,
        base: { atk: 582, hp: 1058, def: 463 },
        stats: [
            { key: STAT.EFFECT_HIT_RATE, values: [0.4, 0.45, 0.5, 0.55, 0.6] },
            { key: STAT.ATK_PERCENT, values: [0.05, 0.06, 0.07, 0.08, 0.09] },
            { key: STAT.DEF_IGNORE, values: [0.072, 0.079, 0.086, 0.093, 0.1] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Dreamville Adventure": {
        id: "Dreamville Adventure",
        name: "ドリームタウンの大冒険",
        path: "Harmony",
        rarity: 4,
        base: { atk: 423, hp: 952, def: 396 },
        stats: [
        ],
        selfEffects: [
        ],
        partyEffects: [
            {
                id: "dreamville_adventure_party_effect_1",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.12, 0.14, 0.16, 0.18, 0.2] },
                ],
                defaultActive: false,
                target: "all",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        enemyEffects: [
        ],
    },
    "Final Victor": {
        id: "Final Victor",
        name: "最後の勝者",
        path: "The Hunt",
        rarity: 4,
        base: { atk: 476, hp: 952, def: 330 },
        stats: [
            { key: STAT.ATK_PERCENT, values: [0.12, 0.14, 0.16, 0.18, 0.2] },
            { key: STAT.CRIT_DMG, values: [0.08, 0.09, 0.1, 0.11, 0.12] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "It's Showtime": {
        id: "It's Showtime",
        name: "ショーの始まり",
        path: "Nihility",
        rarity: 4,
        base: { atk: 476, hp: 1058, def: 264 },
        stats: [
        ],
        selfEffects: [
            {
                id: "its_showtime_self_effect_1",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.06, 0.07, 0.08, 0.09, 0.1] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
                stackable: { max: 3, default: 3 },
            },
            {
                id: "its_showtime_self_atk_2",
                name: "ATK",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.ATK_PERCENT, values: [0.2, 0.24, 0.28, 0.32, 0.36] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Flames Afar": {
        id: "Flames Afar",
        name: "烈火の彼方",
        path: "Destruction",
        rarity: 4,
        base: { atk: 476, hp: 1058, def: 264 },
        stats: [
        ],
        selfEffects: [
            {
                id: "flames_afar_self_effect_1",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.25, 0.3125, 0.375, 0.4375, 0.5] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Indelible Promise": {
        id: "Indelible Promise",
        name: "心に刻まれた約束",
        path: "Destruction",
        rarity: 4,
        base: { atk: 476, hp: 952, def: 330 },
        stats: [
            { key: STAT.BREAK_EFFECT, values: [0.28, 0.35, 0.42, 0.49, 0.56] },
        ],
        selfEffects: [
            {
                id: "indelible_promise_self_effect_1",
                name: "会心率",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.CRIT_RATE, values: [0.15, 0.1875, 0.225, 0.2625, 0.3] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "The Day The Cosmos Fell": {
        id: "The Day The Cosmos Fell",
        name: "銀河が陥落した日",
        path: "Erudition",
        rarity: 4,
        base: { atk: 476, hp: 952, def: 330 },
        stats: [
            { key: STAT.ATK_PERCENT, values: [0.16, 0.18, 0.2, 0.22, 0.24] },
        ],
        selfEffects: [
            {
                id: "the_day_the_cosmos_fell_self_effect_1",
                name: "会心ダメ+与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.CRIT_DMG, values: [0.2, 0.25, 0.3, 0.35, 0.4] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Baptism of Pure Thought": {
        id: "Baptism of Pure Thought",
        name: "純粋なる思惟の洗礼",
        path: "The Hunt",
        rarity: 5,
        base: { atk: 582, hp: 952, def: 529 },
        stats: [
            { key: STAT.CRIT_DMG, values: [0.2, 0.23, 0.26, 0.29, 0.32] },
        ],
        selfEffects: [
            {
                id: "baptism_of_pure_thought_self_effect_2",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.36, 0.42, 0.48, 0.54, 0.6] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
            {
                id: "baptism_of_pure_thought_self_effect_3",
                name: "防御無視",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DEF_IGNORE, values: [0.24, 0.28, 0.32, 0.36, 0.4] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
            {
                id: "baptism_of_pure_thought_party_effect_1",
                name: "会心ダメ+与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.CRIT_DMG, values: [0.08, 0.09, 0.1, 0.11, 0.12] },
                ],
                defaultActive: false,
                target: "single",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
                stackable: { max: 3, default: 3 },
            },
        ],
        enemyEffects: [
            {
                id: "baptism_of_pure_thought_enemy_effect_1",
                name: "会心ダメ+与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.CRIT_DMG, values: [0.08, 0.09, 0.1, 0.11, 0.12] },
                ],
                defaultActive: false,
                target: "single",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
                baseChance: 1.0,
                debuffType: "stat_down",
                stackable: { max: 3, default: 3 },
            },
        ],
    },
    "What Is Real?": {
        id: "What Is Real?",
        name: "何が真か",
        path: "Abundance",
        rarity: 4,
        base: { atk: 423, hp: 1058, def: 330 },
        stats: [
            { key: STAT.BREAK_EFFECT, values: [0.24, 0.3, 0.36, 0.42, 0.48] },
        ],
        selfEffects: [
            {
                id: "what_is_real_self_hp_1",
                name: "HP",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.HP_PERCENT, values: [0.02, 0.025, 0.03, 0.035, 0.04] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Worrisome, Blissful": {
        id: "Worrisome, Blissful",
        name: "悩んで笑って",
        path: "The Hunt",
        rarity: 5,
        base: { atk: 582, hp: 1058, def: 463 },
        stats: [
            { key: STAT.CRIT_RATE, values: [0.18, 0.21, 0.24, 0.27, 0.3] },
            { key: STAT.DMG_FOLLOWUP, values: [0.3, 0.35, 0.4, 0.45, 0.5] },
        ],
        selfEffects: [
        ],
        partyEffects: [
            {
                id: "worrisome_blissful_party_effect_1",
                name: "会心ダメ+与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.CRIT_DMG, values: [0.12, 0.14, 0.16, 0.18, 0.2] },
                ],
                defaultActive: false,
                target: "single",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        enemyEffects: [
            {
                id: "worrisome_blissful_enemy_effect_1",
                name: "会心ダメ+与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.CRIT_DMG, values: [0.12, 0.14, 0.16, 0.18, 0.2] },
                ],
                defaultActive: false,
                target: "single",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
                baseChance: 1.0,
                debuffType: "stat_down",
            },
        ],
    },
    "An Instant Before A Gaze": {
        id: "An Instant Before A Gaze",
        name: "その一刻、目に焼き付けて",
        path: "Erudition",
        rarity: 5,
        base: { atk: 582, hp: 1058, def: 463 },
        stats: [
            { key: STAT.CRIT_DMG, values: [0.36, 0.42, 0.48, 0.54, 0.6] },
            { key: STAT.DMG_ULT, values: [0.648, 0.756, 0.864, 0.972, 1.08] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Hey, Over Here": {
        id: "Hey, Over Here",
        name: "「よぉ、ここにいるぜ」",
        path: "Abundance",
        rarity: 4,
        base: { atk: 423, hp: 952, def: 396 },
        stats: [
            { key: STAT.HP_PERCENT, values: [0.08, 0.09, 0.1, 0.11, 0.12] },
        ],
        selfEffects: [
            {
                id: "hey_over_here_self_effect_1",
                name: "治癒量",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.HEAL_BONUS, values: [0.16, 0.19, 0.22, 0.25, 0.28] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "I Shall Be My Own Sword": {
        id: "I Shall Be My Own Sword",
        name: "この身は剣なり",
        path: "Destruction",
        rarity: 5,
        base: { atk: 582, hp: 1164, def: 396 },
        stats: [
            { key: STAT.CRIT_DMG, values: [0.2, 0.23, 0.26, 0.29, 0.32] },
        ],
        selfEffects: [
            {
                id: "i_shall_be_my_own_sword_self_effect_1",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.14, 0.165, 0.19, 0.215, 0.24] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
            {
                id: "i_shall_be_my_own_sword_self_effect_2",
                name: "防御無視",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DEF_IGNORE, values: [0.12, 0.14, 0.16, 0.18, 0.2] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Patience Is All You Need": {
        id: "Patience Is All You Need",
        name: "待つのみ",
        path: "Nihility",
        rarity: 5,
        base: { atk: 582, hp: 1058, def: 463 },
        stats: [
            { key: STAT.DMG_ALL, values: [0.24, 0.28, 0.32, 0.36, 0.4] },
        ],
        selfEffects: [
            {
                id: "patience_is_all_you_need_self_spd_1",
                name: "SPD",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.SPD_PERCENT, values: [0.048, 0.056, 0.064, 0.072, 0.08] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
                stackable: { max: 3, default: 3 },
            },
            {
                id: "patience_is_all_you_need_self_atk_2",
                name: "別枠+ATK",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.SEP_MULT, values: [0.6, 0.7, 0.8, 0.9, 1] },
                    { key: STAT.ATK_PERCENT, values: [0.6, 0.7, 0.8, 0.9, 1] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Brighter Than the Sun": {
        id: "Brighter Than the Sun",
        name: "陽光より輝くもの",
        path: "Destruction",
        rarity: 5,
        base: { atk: 635, hp: 1058, def: 396 },
        stats: [
            { key: STAT.CRIT_RATE, values: [0.18, 0.21, 0.24, 0.27, 0.3] },
        ],
        selfEffects: [
            {
                id: "brighter_than_the_sun_self_atk_1",
                name: "ATK",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.ATK_PERCENT, values: [0.18, 0.21, 0.24, 0.27, 0.3] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
            {
                id: "brighter_than_the_sun_self_ep_2",
                name: "EP回復効率",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.ENERGY_REGEN, values: [0.06, 0.07, 0.08, 0.09, 0.1] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Solitary Healing": {
        id: "Solitary Healing",
        name: "孤独の癒し",
        path: "Nihility",
        rarity: 5,
        base: { atk: 529, hp: 1058, def: 396 },
        stats: [
            { key: STAT.BREAK_EFFECT, values: [0.2, 0.25, 0.3, 0.35, 0.4] },
        ],
        selfEffects: [
            {
                id: "solitary_healing_self_effect_1",
                name: "別枠",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.SEP_MULT, values: [0.24, 0.3, 0.36, 0.42, 0.48] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "The Unreachable Side": {
        id: "The Unreachable Side",
        name: "着かない彼岸",
        path: "Destruction",
        rarity: 5,
        base: { atk: 582, hp: 1270, def: 330 },
        stats: [
            { key: STAT.CRIT_RATE, values: [0.18, 0.21, 0.24, 0.27, 0.3] },
            { key: STAT.HP_PERCENT, values: [0.18, 0.21, 0.24, 0.27, 0.3] },
        ],
        selfEffects: [
            {
                id: "the_unreachable_side_self_effect_1",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.24, 0.28, 0.32, 0.36, 0.4] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Incessant Rain": {
        id: "Incessant Rain",
        name: "降りやまぬ雨",
        path: "Nihility",
        rarity: 5,
        base: { atk: 582, hp: 1058, def: 463 },
        stats: [
            { key: STAT.EFFECT_HIT_RATE, values: [0.24, 0.28, 0.32, 0.36, 0.4] },
            { key: STAT.DMG_TAKEN, values: [0.12, 0.14, 0.16, 0.18, 0.2] },
        ],
        selfEffects: [
            {
                id: "incessant_rain_self_effect_1",
                name: "会心率",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.CRIT_RATE, values: [0.12, 0.14, 0.16, 0.18, 0.2] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Before the Tutorial Mission Starts": {
        id: "Before the Tutorial Mission Starts",
        name: "初めてのクエストの前に",
        path: "Nihility",
        rarity: 4,
        base: { atk: 476, hp: 952, def: 330 },
        stats: [
            { key: STAT.EFFECT_HIT_RATE, values: [0.2, 0.25, 0.3, 0.35, 0.4] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Echoes of the Coffin": {
        id: "Echoes of the Coffin",
        name: "棺のこだま",
        path: "Abundance",
        rarity: 5,
        base: { atk: 582, hp: 1164, def: 396 },
        stats: [
            { key: STAT.ATK_PERCENT, values: [0.24, 0.28, 0.32, 0.36, 0.4] },
        ],
        selfEffects: [
        ],
        partyEffects: [
            {
                id: "echoes_of_the_coffin_party_spd_1",
                name: "SPD固定",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.SPD_FLAT, values: [12, 14, 16, 18, 20] },
                ],
                defaultActive: false,
                target: "all",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        enemyEffects: [
        ],
    },
    "Before Dawn": {
        id: "Before Dawn",
        name: "夜明け前",
        path: "Erudition",
        rarity: 5,
        base: { atk: 582, hp: 1058, def: 463 },
        stats: [
            { key: STAT.CRIT_DMG, values: [0.36, 0.42, 0.48, 0.54, 0.6] },
        ],
        selfEffects: [
            {
                id: "before_dawn_self_effect_1",
                name: "追加攻撃与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_FOLLOWUP, values: [0.48, 0.56, 0.64, 0.72, 0.8] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "In the Name of the World": {
        id: "In the Name of the World",
        name: "世界の名を以て",
        path: "Nihility",
        rarity: 5,
        base: { atk: 582, hp: 1058, def: 463 },
        stats: [
            { key: STAT.DMG_ALL, values: [0.24, 0.28, 0.32, 0.36, 0.4] },
        ],
        selfEffects: [
            {
                id: "in_the_name_of_the_world_self_effect_1",
                name: "効果命中",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.EFFECT_HIT_RATE, values: [0.18, 0.21, 0.24, 0.27, 0.3] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
            {
                id: "in_the_name_of_the_world_self_atk_2",
                name: "ATK",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.ATK_PERCENT, values: [0.24, 0.28, 0.32, 0.36, 0.4] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Moment of Victory": {
        id: "Moment of Victory",
        name: "勝利の刹那",
        path: "Preservation",
        rarity: 5,
        base: { atk: 476, hp: 1058, def: 595 },
        stats: [
            { key: STAT.DEF_PERCENT, values: [0.24, 0.28, 0.32, 0.36, 0.4] },
            { key: STAT.EFFECT_HIT_RATE, values: [0.24, 0.28, 0.32, 0.36, 0.4] },
        ],
        selfEffects: [
            {
                id: "moment_of_victory_self_def_1",
                name: "DEF",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DEF_PERCENT, values: [0.24, 0.28, 0.32, 0.36, 0.4] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "On the Fall of an Aeon": {
        id: "On the Fall of an Aeon",
        name: "とある星神の殞落を記す",
        path: "Destruction",
        rarity: 5,
        base: { atk: 529, hp: 1058, def: 396 },
        stats: [
        ],
        selfEffects: [
            {
                id: "on_the_fall_of_an_aeon_self_atk_1",
                name: "ATK",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.ATK_PERCENT, values: [0.08, 0.1, 0.12, 0.14, 0.16] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
            {
                id: "on_the_fall_of_an_aeon_self_effect_2",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.12, 0.15, 0.18, 0.21, 0.24] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Night on the Milky Way": {
        id: "Night on the Milky Way",
        name: "銀河鉄道の夜",
        path: "Erudition",
        rarity: 5,
        base: { atk: 582, hp: 1164, def: 396 },
        stats: [
        ],
        selfEffects: [
            {
                id: "night_on_the_milky_way_self_atk_1",
                name: "ATK",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.ATK_PERCENT, values: [0.09, 0.105, 0.12, 0.135, 0.15] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
                stackable: { max: 5, default: 5 },
            },
            {
                id: "night_on_the_milky_way_self_effect_2",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.3, 0.35, 0.4, 0.45, 0.5] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Cruising in the Stellar Sea": {
        id: "Cruising in the Stellar Sea",
        name: "星海巡航",
        path: "The Hunt",
        rarity: 5,
        base: { atk: 529, hp: 952, def: 463 },
        stats: [
            { key: STAT.CRIT_RATE, values: [0.08, 0.1, 0.12, 0.14, 0.16] },
        ],
        selfEffects: [
            {
                id: "cruising_in_the_stellar_sea_self_atk_1",
                name: "ATK",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.ATK_PERCENT, values: [0.2, 0.25, 0.3, 0.35, 0.4] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "In the Night": {
        id: "In the Night",
        name: "夜の帳の中で",
        path: "The Hunt",
        rarity: 5,
        base: { atk: 582, hp: 1058, def: 463 },
        stats: [
            { key: STAT.CRIT_RATE, values: [0.18, 0.21, 0.24, 0.27, 0.3] },
            { key: STAT.CRIT_DMG, values: [0.12, 0.14, 0.16, 0.18, 0.2] },
            { key: STAT.DMG_ULT, values: [0.12, 0.14, 0.16, 0.18, 0.2] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Sleep Like the Dead": {
        id: "Sleep Like the Dead",
        name: "泥の如き眠り",
        path: "The Hunt",
        rarity: 5,
        base: { atk: 582, hp: 1058, def: 463 },
        stats: [
            { key: STAT.CRIT_DMG, values: [0.3, 0.35, 0.4, 0.45, 0.5] },
        ],
        selfEffects: [
            {
                id: "sleep_like_the_dead_self_effect_1",
                name: "会心率",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.CRIT_RATE, values: [0.36, 0.42, 0.48, 0.54, 0.6] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Something Irreplaceable": {
        id: "Something Irreplaceable",
        name: "かけがえのないもの",
        path: "Destruction",
        rarity: 5,
        base: { atk: 582, hp: 1164, def: 396 },
        stats: [
            { key: STAT.ATK_PERCENT, values: [0.24, 0.28, 0.32, 0.36, 0.4] },
            { key: STAT.DMG_ALL, values: [0.24, 0.28, 0.32, 0.36, 0.4] },
        ],
        selfEffects: [
            {
                id: "something_irreplaceable_self_atk_1",
                name: "ATK",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.ATK_PERCENT, values: [0.08, 0.09, 0.1, 0.11, 0.12] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Fermata": {
        id: "Fermata",
        name: "フェルマータ",
        path: "Nihility",
        rarity: 4,
        base: { atk: 476, hp: 952, def: 330 },
        stats: [
            { key: STAT.BREAK_EFFECT, values: [0.16, 0.2, 0.24, 0.28, 0.32] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Texture of Memories": {
        id: "Texture of Memories",
        name: "記憶の素材",
        path: "Preservation",
        rarity: 5,
        base: { atk: 423, hp: 1058, def: 529 },
        stats: [
            { key: STAT.EFFECT_RES, values: [0.08, 0.1, 0.12, 0.14, 0.16] },
        ],
        selfEffects: [
            {
                id: "texture_of_memories_self_effect_1",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.12, 0.15, 0.18, 0.21, 0.24] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Carve the Moon, Weave the Clouds": {
        id: "Carve the Moon, Weave the Clouds",
        name: "彫月裁雲の意",
        path: "Harmony",
        rarity: 4,
        base: { atk: 476, hp: 952, def: 330 },
        stats: [
        ],
        selfEffects: [
        ],
        partyEffects: [
            {
                id: "carve_the_moon_weave_the_clouds_party_atk_1",
                name: "ATK",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.ATK_PERCENT, values: [0.1, 0.125, 0.15, 0.175, 0.2] },
                ],
                defaultActive: false,
                target: "all",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
            {
                id: "carve_the_moon_weave_the_clouds_party_effect_2",
                name: "会心ダメ+与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.CRIT_DMG, values: [0.12, 0.15, 0.18, 0.21, 0.24] },
                ],
                defaultActive: false,
                target: "all",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
            {
                id: "carve_the_moon_weave_the_clouds_party_ep_3",
                name: "EP回復効率",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.ENERGY_REGEN, values: [0.06, 0.075, 0.09, 0.105, 0.12] },
                ],
                defaultActive: false,
                target: "all",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        enemyEffects: [
        ],
    },
    "Time Waits for No One": {
        id: "Time Waits for No One",
        name: "時節は居らず",
        path: "Abundance",
        rarity: 5,
        base: { atk: 476, hp: 1270, def: 463 },
        stats: [
            { key: STAT.HP_PERCENT, values: [0.18, 0.21, 0.24, 0.27, 0.3] },
            { key: STAT.HEAL_BONUS, values: [0.12, 0.14, 0.16, 0.18, 0.2] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "A Secret Vow": {
        id: "A Secret Vow",
        name: "秘密の誓い",
        path: "Destruction",
        rarity: 4,
        base: { atk: 476, hp: 1058, def: 264 },
        stats: [
            { key: STAT.DMG_ALL, values: [0.2, 0.25, 0.3, 0.35, 0.4] },
            { key: STAT.DMG_ALL, values: [0.2, 0.25, 0.3, 0.35, 0.4] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Day One of My New Life": {
        id: "Day One of My New Life",
        name: "余生の初日",
        path: "Preservation",
        rarity: 4,
        base: { atk: 370, hp: 952, def: 463 },
        stats: [
            { key: STAT.DEF_PERCENT, values: [0.16, 0.18, 0.2, 0.22, 0.24] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Eyes of the Prey": {
        id: "Eyes of the Prey",
        name: "獲物の視線",
        path: "Nihility",
        rarity: 4,
        base: { atk: 476, hp: 952, def: 330 },
        stats: [
            { key: STAT.EFFECT_HIT_RATE, values: [0.2, 0.25, 0.3, 0.35, 0.4] },
            { key: STAT.SEP_MULT, values: [0.24, 0.3, 0.36, 0.42, 0.48] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Geniuses' Repose": {
        id: "Geniuses' Repose",
        name: "天才たちの休息",
        path: "Erudition",
        rarity: 4,
        base: { atk: 476, hp: 846, def: 396 },
        stats: [
            { key: STAT.ATK_PERCENT, values: [0.16, 0.2, 0.24, 0.28, 0.32] },
        ],
        selfEffects: [
            {
                id: "geniuses_repose_self_effect_1",
                name: "会心ダメ+与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.CRIT_DMG, values: [0.24, 0.3, 0.36, 0.42, 0.48] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Nowhere to Run": {
        id: "Nowhere to Run",
        name: "逃げ場なし",
        path: "Destruction",
        rarity: 4,
        base: { atk: 529, hp: 952, def: 264 },
        stats: [
            { key: STAT.ATK_PERCENT, values: [0.24, 0.3, 0.36, 0.42, 0.48] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Good Night and Sleep Well": {
        id: "Good Night and Sleep Well",
        name: "おやすみなさいと寝顔",
        path: "Nihility",
        rarity: 4,
        base: { atk: 476, hp: 952, def: 330 },
        stats: [
        ],
        selfEffects: [
            {
                id: "good_night_and_sleep_well_self_effect_1",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.12, 0.15, 0.18, 0.21, 0.24] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
                stackable: { max: 3, default: 3 },
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Make the World Clamor": {
        id: "Make the World Clamor",
        name: "この世界に喧噪を",
        path: "Erudition",
        rarity: 4,
        base: { atk: 476, hp: 846, def: 396 },
        stats: [
        ],
        selfEffects: [
            {
                id: "make_the_world_clamor_self_effect_1",
                name: "必殺与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ULT, values: [0.32, 0.4, 0.48, 0.56, 0.64] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Landau's Choice": {
        id: "Landau's Choice",
        name: "ランドゥーの選択",
        path: "Preservation",
        rarity: 4,
        base: { atk: 423, hp: 952, def: 396 },
        stats: [
            { key: STAT.DMG_ALL, values: [0.16, 0.18, 0.2, 0.22, 0.24] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Memories of the Past": {
        id: "Memories of the Past",
        name: "記憶の中の姿",
        path: "Harmony",
        rarity: 4,
        base: { atk: 423, hp: 952, def: 396 },
        stats: [
            { key: STAT.BREAK_EFFECT, values: [0.28, 0.35, 0.42, 0.49, 0.56] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Only Silence Remains": {
        id: "Only Silence Remains",
        name: "沈黙のみ",
        path: "The Hunt",
        rarity: 4,
        base: { atk: 476, hp: 952, def: 330 },
        stats: [
            { key: STAT.ATK_PERCENT, values: [0.16, 0.2, 0.24, 0.28, 0.32] },
        ],
        selfEffects: [
            {
                id: "only_silence_remains_self_effect_1",
                name: "会心率",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.CRIT_RATE, values: [0.12, 0.15, 0.18, 0.21, 0.24] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Perfect Timing": {
        id: "Perfect Timing",
        name: "今が丁度",
        path: "Abundance",
        rarity: 4,
        base: { atk: 423, hp: 952, def: 396 },
        stats: [
            { key: STAT.EFFECT_RES, values: [0.16, 0.2, 0.24, 0.28, 0.32] },
            { key: STAT.HEAL_BONUS, values: [0.15, 0.18, 0.21, 0.24, 0.27] },
        ],
        selfEffects: [
            {
                id: "perfect_timing_self_effect_1",
                name: "効果抵抗+治癒量",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.EFFECT_RES, values: [0.33, 0.36, 0.39, 0.42, 0.45] },
                    { key: STAT.HEAL_BONUS, values: [0.33, 0.36, 0.39, 0.42, 0.45] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Past and Future": {
        id: "Past and Future",
        name: "過去と未来",
        path: "Harmony",
        rarity: 4,
        base: { atk: 423, hp: 952, def: 396 },
        stats: [
        ],
        selfEffects: [
        ],
        partyEffects: [
            {
                id: "past_and_future_party_effect_1",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.16, 0.2, 0.24, 0.28, 0.32] },
                ],
                defaultActive: false,
                target: "single",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        enemyEffects: [
        ],
    },
    "Quid Pro Quo": {
        id: "Quid Pro Quo",
        name: "等価交換",
        path: "Abundance",
        rarity: 4,
        base: { atk: 423, hp: 952, def: 396 },
        stats: [
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Planetary Rendezvous": {
        id: "Planetary Rendezvous",
        name: "惑星との出会い",
        path: "Harmony",
        rarity: 4,
        base: { atk: 423, hp: 1058, def: 330 },
        stats: [
        ],
        selfEffects: [
        ],
        partyEffects: [
            {
                id: "planetary_rendezvous_party_effect_1",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.12, 0.15, 0.18, 0.21, 0.24] },
                ],
                defaultActive: false,
                target: "single",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        enemyEffects: [
        ],
    },
    "Post-Op Conversation": {
        id: "Post-Op Conversation",
        name: "手術後の会話",
        path: "Abundance",
        rarity: 4,
        base: { atk: 423, hp: 1058, def: 330 },
        stats: [
            { key: STAT.ENERGY_REGEN, values: [0.08, 0.1, 0.12, 0.14, 0.16] },
        ],
        selfEffects: [
            {
                id: "post_op_conversation_self_effect_1",
                name: "治癒量",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.HEAL_BONUS, values: [0.12, 0.15, 0.18, 0.21, 0.24] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Return to Darkness": {
        id: "Return to Darkness",
        name: "幽冥に帰す",
        path: "The Hunt",
        rarity: 4,
        base: { atk: 529, hp: 846, def: 330 },
        stats: [
            { key: STAT.CRIT_RATE, values: [0.12, 0.15, 0.18, 0.21, 0.24] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "River Flows in Spring": {
        id: "River Flows in Spring",
        name: "春水に初生する",
        path: "The Hunt",
        rarity: 4,
        base: { atk: 476, hp: 846, def: 396 },
        stats: [
        ],
        selfEffects: [
            {
                id: "river_flows_in_spring_self_spd_1",
                name: "SPD",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.SPD_PERCENT, values: [0.08, 0.09, 0.1, 0.11, 0.12] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
            {
                id: "river_flows_in_spring_self_effect_2",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.12, 0.15, 0.18, 0.21, 0.24] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Resolution Shines As Pearls of Sweat": {
        id: "Resolution Shines As Pearls of Sweat",
        name: "決意は汗のように輝く",
        path: "Nihility",
        rarity: 4,
        base: { atk: 476, hp: 952, def: 330 },
        stats: [
        ],
        selfEffects: [
        ],
        partyEffects: [
            {
                id: "resolution_shines_as_pearls_of_sweat_party_effect_1",
                name: "防御ダウン",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DEF_DOWN, values: [0.12, 0.13, 0.14, 0.15, 0.16] },
                ],
                defaultActive: false,
                target: "single",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        enemyEffects: [
            {
                id: "resolution_shines_as_pearls_of_sweat_enemy_effect_1",
                name: "防御ダウン",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DEF_DOWN, values: [0.12, 0.13, 0.14, 0.15, 0.16] },
                ],
                defaultActive: false,
                target: "single",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
                baseChance: 1.0,
                debuffType: "stat_down",
            },
        ],
    },
    "The Moles Welcome You": {
        id: "The Moles Welcome You",
        name: "モグラ党へようこそ",
        path: "Destruction",
        rarity: 4,
        base: { atk: 476, hp: 1058, def: 264 },
        stats: [
        ],
        selfEffects: [
            {
                id: "the_moles_welcome_you_self_atk_1",
                name: "ATK",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.ATK_PERCENT, values: [0.12, 0.15, 0.18, 0.21, 0.24] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Subscribe for More!": {
        id: "Subscribe for More!",
        name: "フォローして！",
        path: "The Hunt",
        rarity: 4,
        base: { atk: 476, hp: 952, def: 330 },
        stats: [
            { key: STAT.DMG_SKILL, values: [0.24, 0.3, 0.36, 0.42, 0.48] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Shared Feeling": {
        id: "Shared Feeling",
        name: "同じ気持ち",
        path: "Abundance",
        rarity: 4,
        base: { atk: 423, hp: 952, def: 396 },
        stats: [
            { key: STAT.HEAL_BONUS, values: [0.1, 0.125, 0.15, 0.175, 0.2] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Today Is Another Peaceful Day": {
        id: "Today Is Another Peaceful Day",
        name: "今日も平和な一日",
        path: "Erudition",
        rarity: 4,
        base: { atk: 529, hp: 846, def: 330 },
        stats: [
            { key: STAT.DMG_ALL, values: [0.32, 0.4, 0.48, 0.56, 0.64] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Swordplay": {
        id: "Swordplay",
        name: "論剣",
        path: "The Hunt",
        rarity: 4,
        base: { atk: 476, hp: 952, def: 330 },
        stats: [
        ],
        selfEffects: [
            {
                id: "swordplay_self_effect_1",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.08, 0.1, 0.12, 0.14, 0.16] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
                stackable: { max: 5, default: 5 },
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "This Is Me!": {
        id: "This Is Me!",
        name: "これがウチだよ！",
        path: "Preservation",
        rarity: 4,
        base: { atk: 370, hp: 846, def: 529 },
        stats: [
            { key: STAT.DEF_PERCENT, values: [0.16, 0.2, 0.24, 0.28, 0.32] },
        ],
        selfEffects: [
            {
                id: "this_is_me_self_def_1",
                name: "DEF+必殺与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DEF_PERCENT, values: [0.6, 0.75, 0.9, 1.05, 1.2] },
                    { key: STAT.DMG_ULT, values: [0.6, 0.75, 0.9, 1.05, 1.2] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "The Birth of the Self": {
        id: "The Birth of the Self",
        name: "「私」の誕生",
        path: "Erudition",
        rarity: 4,
        base: { atk: 476, hp: 952, def: 330 },
        stats: [
            { key: STAT.DMG_FOLLOWUP, values: [0.24, 0.3, 0.36, 0.42, 0.48] },
        ],
        selfEffects: [
            {
                id: "the_birth_of_the_self_self_effect_1",
                name: "追加攻撃与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_FOLLOWUP, values: [0.24, 0.3, 0.36, 0.42, 0.48] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "The Seriousness of Breakfast": {
        id: "The Seriousness of Breakfast",
        name: "朝食の儀式感",
        path: "Erudition",
        rarity: 4,
        base: { atk: 476, hp: 846, def: 396 },
        stats: [
            { key: STAT.DMG_ALL, values: [0.12, 0.15, 0.18, 0.21, 0.24] },
        ],
        selfEffects: [
            {
                id: "the_seriousness_of_breakfast_self_atk_1",
                name: "ATK",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.ATK_PERCENT, values: [0.04, 0.05, 0.06, 0.07, 0.08] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
                stackable: { max: 3, default: 3 },
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Trend of the Universal Market": {
        id: "Trend of the Universal Market",
        name: "星間市場のトレンド",
        path: "Preservation",
        rarity: 4,
        base: { atk: 370, hp: 1058, def: 396 },
        stats: [
            { key: STAT.DEF_PERCENT, values: [0.16, 0.2, 0.24, 0.28, 0.32] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Under the Blue Sky": {
        id: "Under the Blue Sky",
        name: "青空の下で",
        path: "Destruction",
        rarity: 4,
        base: { atk: 476, hp: 952, def: 330 },
        stats: [
            { key: STAT.ATK_PERCENT, values: [0.16, 0.2, 0.24, 0.28, 0.32] },
        ],
        selfEffects: [
            {
                id: "under_the_blue_sky_self_effect_1",
                name: "会心率",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.CRIT_RATE, values: [0.12, 0.15, 0.18, 0.21, 0.24] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Warmth Shortens Cold Nights": {
        id: "Warmth Shortens Cold Nights",
        name: "暖かい夜は長くない",
        path: "Abundance",
        rarity: 4,
        base: { atk: 370, hp: 1058, def: 396 },
        stats: [
            { key: STAT.HP_PERCENT, values: [0.16, 0.2, 0.24, 0.28, 0.32] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "We Are Wildfire": {
        id: "We Are Wildfire",
        name: "我ら地炎",
        path: "Preservation",
        rarity: 4,
        base: { atk: 476, hp: 740, def: 463 },
        stats: [
        ],
        selfEffects: [
        ],
        partyEffects: [
            {
                id: "we_are_wildfire_party_effect_1",
                name: "与ダメ",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DMG_ALL, values: [0.08, 0.1, 0.12, 0.14, 0.16] },
                ],
                defaultActive: false,
                target: "all",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
            {
                id: "we_are_wildfire_party_hp_2",
                name: "HP",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.HP_PERCENT, values: [0.3, 0.35, 0.4, 0.45, 0.5] },
                ],
                defaultActive: false,
                target: "all",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        enemyEffects: [
        ],
    },
    "Woof! Walk Time!": {
        id: "Woof! Walk Time!",
        name: "ワン！散歩の時間！",
        path: "Destruction",
        rarity: 4,
        base: { atk: 476, hp: 952, def: 330 },
        stats: [
            { key: STAT.ATK_PERCENT, values: [0.1, 0.125, 0.15, 0.175, 0.2] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "We Will Meet Again": {
        id: "We Will Meet Again",
        name: "またお会いしましょう",
        path: "Nihility",
        rarity: 4,
        base: { atk: 529, hp: 846, def: 330 },
        stats: [
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Adversarial": {
        id: "Adversarial",
        name: "相抗",
        path: "The Hunt",
        rarity: 3,
        base: { atk: 370, hp: 740, def: 264 },
        stats: [
        ],
        selfEffects: [
            {
                id: "adversarial_self_spd_1",
                name: "SPD",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.SPD_PERCENT, values: [0.1, 0.12, 0.14, 0.16, 0.18] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Amber": {
        id: "Amber",
        name: "琥珀",
        path: "Preservation",
        rarity: 3,
        base: { atk: 264, hp: 846, def: 330 },
        stats: [
            { key: STAT.DEF_PERCENT, values: [0.16, 0.2, 0.24, 0.28, 0.32] },
        ],
        selfEffects: [
            {
                id: "amber_self_def_1",
                name: "DEF",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.DEF_PERCENT, values: [0.16, 0.2, 0.24, 0.28, 0.32] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Arrows": {
        id: "Arrows",
        name: "矢じり",
        path: "The Hunt",
        rarity: 3,
        base: { atk: 317, hp: 846, def: 264 },
        stats: [
        ],
        selfEffects: [
            {
                id: "arrows_self_effect_1",
                name: "会心率",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.CRIT_RATE, values: [0.12, 0.15, 0.18, 0.21, 0.24] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Chorus": {
        id: "Chorus",
        name: "斉頌",
        path: "Harmony",
        rarity: 3,
        base: { atk: 317, hp: 846, def: 264 },
        stats: [
        ],
        selfEffects: [
        ],
        partyEffects: [
            {
                id: "chorus_party_atk_1",
                name: "ATK",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.ATK_PERCENT, values: [0.08, 0.09, 0.1, 0.11, 0.12] },
                ],
                defaultActive: false,
                target: "all",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        enemyEffects: [
        ],
    },
    "Cornucopia": {
        id: "Cornucopia",
        name: "物穣",
        path: "Abundance",
        rarity: 3,
        base: { atk: 264, hp: 952, def: 264 },
        stats: [
        ],
        selfEffects: [
            {
                id: "cornucopia_self_effect_1",
                name: "治癒量",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.HEAL_BONUS, values: [0.12, 0.15, 0.18, 0.21, 0.24] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Collapsing Sky": {
        id: "Collapsing Sky",
        name: "天傾",
        path: "Destruction",
        rarity: 3,
        base: { atk: 370, hp: 846, def: 198 },
        stats: [
            { key: STAT.DMG_SKILL, values: [0.2, 0.25, 0.3, 0.35, 0.4] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Darting Arrow": {
        id: "Darting Arrow",
        name: "離弦",
        path: "The Hunt",
        rarity: 3,
        base: { atk: 370, hp: 740, def: 264 },
        stats: [
        ],
        selfEffects: [
            {
                id: "darting_arrow_self_atk_1",
                name: "ATK",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.ATK_PERCENT, values: [0.24, 0.3, 0.36, 0.42, 0.48] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Data Bank": {
        id: "Data Bank",
        name: "アーカイブ",
        path: "Erudition",
        rarity: 3,
        base: { atk: 370, hp: 740, def: 264 },
        stats: [
            { key: STAT.DMG_ULT, values: [0.28, 0.35, 0.42, 0.49, 0.56] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Defense": {
        id: "Defense",
        name: "防衛",
        path: "Preservation",
        rarity: 3,
        base: { atk: 264, hp: 952, def: 264 },
        stats: [
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Fine Fruit": {
        id: "Fine Fruit",
        name: "嘉果",
        path: "Abundance",
        rarity: 3,
        base: { atk: 317, hp: 952, def: 198 },
        stats: [
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Mediation": {
        id: "Mediation",
        name: "同調",
        path: "Harmony",
        rarity: 3,
        base: { atk: 317, hp: 846, def: 264 },
        stats: [
        ],
        selfEffects: [
        ],
        partyEffects: [
            {
                id: "mediation_party_spd_1",
                name: "SPD固定",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.SPD_FLAT, values: [12, 14, 16, 18, 20] },
                ],
                defaultActive: false,
                target: "all",
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        enemyEffects: [
        ],
    },
    "Meshing Cogs": {
        id: "Meshing Cogs",
        name: "輪契",
        path: "Harmony",
        rarity: 3,
        base: { atk: 317, hp: 846, def: 264 },
        stats: [
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Hidden Shadow": {
        id: "Hidden Shadow",
        name: "匿影",
        path: "Nihility",
        rarity: 3,
        base: { atk: 317, hp: 846, def: 264 },
        stats: [
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Loop": {
        id: "Loop",
        name: "淵環",
        path: "Nihility",
        rarity: 3,
        base: { atk: 317, hp: 846, def: 264 },
        stats: [
            { key: STAT.DMG_ALL, values: [0.24, 0.3, 0.36, 0.42, 0.48] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Sagacity": {
        id: "Sagacity",
        name: "見識",
        path: "Erudition",
        rarity: 3,
        base: { atk: 370, hp: 740, def: 264 },
        stats: [
        ],
        selfEffects: [
            {
                id: "sagacity_self_atk_1",
                name: "ATK",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.ATK_PERCENT, values: [0.24, 0.3, 0.36, 0.42, 0.48] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Pioneering": {
        id: "Pioneering",
        name: "新天地",
        path: "Preservation",
        rarity: 3,
        base: { atk: 264, hp: 952, def: 264 },
        stats: [
        ],
        selfEffects: [
            {
                id: "pioneering_self_hp_1",
                name: "HP",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.HP_PERCENT, values: [0.12, 0.14, 0.16, 0.18, 0.2] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Shattered Home": {
        id: "Shattered Home",
        name: "楽壊",
        path: "Destruction",
        rarity: 3,
        base: { atk: 370, hp: 846, def: 198 },
        stats: [
            { key: STAT.DMG_ALL, values: [0.2, 0.25, 0.3, 0.35, 0.4] },
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Void": {
        id: "Void",
        name: "幽邃",
        path: "Nihility",
        rarity: 3,
        base: { atk: 317, hp: 846, def: 264 },
        stats: [
        ],
        selfEffects: [
            {
                id: "void_self_effect_1",
                name: "効果命中",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.EFFECT_HIT_RATE, values: [0.2, 0.25, 0.3, 0.35, 0.4] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Multiplication": {
        id: "Multiplication",
        name: "蕃殖",
        path: "Abundance",
        rarity: 3,
        base: { atk: 317, hp: 952, def: 198 },
        stats: [
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Mutual Demise": {
        id: "Mutual Demise",
        name: "倶歿",
        path: "Destruction",
        rarity: 3,
        base: { atk: 370, hp: 846, def: 198 },
        stats: [
        ],
        selfEffects: [
            {
                id: "mutual_demise_self_effect_1",
                name: "会心率",
                description: "Wiki数値から変換した条件付き効果。必要に応じてONにしてください。",
                stats: [
                    { key: STAT.CRIT_RATE, values: [0.12, 0.15, 0.18, 0.21, 0.24] },
                ],
                defaultActive: false,
                duration: "conditional",
                tickRule: "none",
                dispellable: false,
            },
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
    "Passkey": {
        id: "Passkey",
        name: "霊鍵",
        path: "Erudition",
        rarity: 3,
        base: { atk: 370, hp: 740, def: 264 },
        stats: [
        ],
        selfEffects: [
        ],
        partyEffects: [
        ],
        enemyEffects: [
        ],
    },
});

export function registerGeneratedLightcone(id) {
    const def = DEFINITIONS[id];
    if (!def) throw new Error(`[lightcone] generated definition not found: ${id}`);
    addLightcone(def);
}
