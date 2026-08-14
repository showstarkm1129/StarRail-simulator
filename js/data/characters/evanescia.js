import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Evanescia",
    "id": "evanescia",
    "name": "緋英",
    "element": "Physical",
    "elementLabel": "物理",
    "path": "Elation",
    "rarity": 5,
    "base": {
        "hp": 1047,
        "atk": 737,
        "def": 460,
        "spd": 104
    },
    "maxEnergy": 240,
    "traceBonuses": [
        {
            "label": "会心率",
            "value": 0.187
        },
        {
            "label": "愉悦度",
            "value": 0.18
        },
        {
            "label": "速度",
            "value": 5
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E7%B7%8B%E8%8B%B1",
        "version": "4.2"
    },
    "skills": {
        "basic": {
            "name": "指導・抜き打ち検査",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に緋英の攻撃力X%分の物理属性ダメージを与える。",
            "levelColumns": [
                "ダメージ倍率(X％)"
            ],
            "levels": [
                {
                    "atk": 0.5
                },
                {
                    "atk": 0.6
                },
                {
                    "atk": 0.7
                },
                {
                    "atk": 0.8
                },
                {
                    "atk": 0.9
                },
                {
                    "atk": 1
                },
                {
                    "atk": 1.1
                }
            ]
        },
        "skill": {
            "name": "風紀・量刀にて裁かん",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "blast",
            "description": "[拡散攻撃]指定した敵単体に緋英の攻撃力X%分の物理属性ダメージを与え、隣接する敵に緋英の攻撃力Y%分の物理属性ダメージを与える。さらに爆笑ネタを10個獲得する。",
            "levelColumns": [
                "単体ダメージ倍率(X%)",
                "隣接ダメージ倍率(Y%)"
            ],
            "levels": [
                {
                    "atk": 1.5,
                    "atkAdjacent": 0.75
                },
                {
                    "atk": 1.65,
                    "atkAdjacent": 0.83
                },
                {
                    "atk": 1.8,
                    "atkAdjacent": 0.9
                },
                {
                    "atk": 1.95,
                    "atkAdjacent": 0.98
                },
                {
                    "atk": 2.1,
                    "atkAdjacent": 1.05
                },
                {
                    "atk": 2.25,
                    "atkAdjacent": 1.12
                },
                {
                    "atk": 2.44,
                    "atkAdjacent": 1.22
                },
                {
                    "atk": 2.63,
                    "atkAdjacent": 1.31
                },
                {
                    "atk": 2.81,
                    "atkAdjacent": 1.41
                },
                {
                    "atk": 3,
                    "atkAdjacent": 1.5
                },
                {
                    "atk": 3.15,
                    "atkAdjacent": 1.575
                },
                {
                    "atk": 3.3,
                    "atkAdjacent": 1.65
                }
            ],
            "inferredNotes": [
                "Lv.11 atk は前後Lvから線形補完",
                "Lv.11 atkAdjacent は前後Lvから線形補完"
            ]
        },
        "ult": {
            "name": "剣歌・神鬼無赦",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]敵全体に緋英の攻撃力X%分の物理属性ダメージを与え、追加で5ヒットする。1ヒットごとに、ランダムな敵単体に緋英の攻撃力Y%分の物理属性ダメージを与える。",
            "levelColumns": [
                "全体ダメージ倍率(X%)",
                "バウンドダメージ倍率(Y%)",
                "消費EP"
            ],
            "levels": [
                {
                    "atkAll": 0.8,
                    "atk": 0.72,
                    "energyCost": 240
                },
                {
                    "atkAll": 0.88,
                    "atk": 0.77
                },
                {
                    "atkAll": 0.96,
                    "atk": 0.82
                },
                {
                    "atkAll": 1.04,
                    "atk": 0.86
                },
                {
                    "atkAll": 1.12,
                    "atk": 0.91
                },
                {
                    "atkAll": 1.2,
                    "atk": 0.96
                },
                {
                    "atkAll": 1.3,
                    "atk": 1.02
                },
                {
                    "atkAll": 1.4,
                    "atk": 1.08
                },
                {
                    "atkAll": 1.5,
                    "atk": 1.14
                },
                {
                    "atkAll": 1.6,
                    "atk": 1.2
                },
                {
                    "atkAll": 1.68,
                    "atk": 1.25
                },
                {
                    "atkAll": 1.76,
                    "atk": 1.3
                }
            ]
        },
        "愉悦スキル": {
            "name": "薄紅・不興なれば斬る",
            "sourceHeader": "愉悦スキル",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]敵全体にX%分の物理属性の愉悦ダメージを与え、追加で「爆笑の褒美」を5個獲得する。",
            "levelColumns": [
                "全体愉悦ダメージ倍率(X%)"
            ],
            "levels": [
                {
                    "atk": 0.55
                },
                {
                    "atk": 0.61
                },
                {
                    "atk": 0.66
                },
                {
                    "atk": 0.72
                },
                {
                    "atk": 0.77
                },
                {
                    "atk": 0.83
                },
                {
                    "atk": 0.89
                },
                {
                    "atk": 0.96
                },
                {
                    "atk": 1.03
                },
                {
                    "atk": 1.1
                },
                {
                    "atk": 1.15
                },
                {
                    "atk": 1.21
                }
            ]
        },
        "talent": {
            "name": "青春・果てなき春の光",
            "sourceHeader": "天賦",
            "type": "follow_up",
            "target": "all",
            "description": "[強化]緋英は会心ダメージ20%分の愉悦度を獲得する。緋英がEPを獲得する時、同量の「爆笑の褒美」を獲得する。緋英が「爆笑の褒美」を獲得する時、同量のEPを獲得する。なお、この方法でEPを獲得する際、1度にカウントされる「爆笑の褒美」は最大100まで。累計でEPを240獲得した時、累計値を240消費し、「キツネ先生」が追加攻撃を発動し、敵全体に緋英の攻撃力X%分の物理属性ダメージを与え、緋英のEPを10回復する。EPを獲得する時、1度に獲得できる累計値は最大240まで。緋英が「爆笑の褒美」を持つ時、以下の効果が発動する。戦闘スキルを発動すると、攻撃を受けた敵にY%分の物理属性の愉悦ダメージを与える。必殺技を発動すると、敵全体にZ%分の物理属性の愉悦ダメージを与え、必殺技の追加ヒットでダメージを受けたランダムな敵にW%分の物理属性の愉悦ダメージを与える。必殺技で愉悦ダメージを与える時、カウントされる「爆笑の褒美」は少なくとも最大EPと同量となる。「キツネ先生」の追加攻撃は、敵全体にS％分の物理属性の愉悦ダメージを与える。",
            "levelColumns": [
                "追加攻撃ダメージ倍率(X%)",
                "戦闘スキルの愉悦ダメージ倍率(Y%)",
                "必殺技の愉悦ダメージ倍率",
                "追加攻撃の愉悦ダメージ倍率(S%)"
            ],
            "levels": [
                {
                    "atkExtra": 0.5,
                    "atk": 0.08,
                    "atk2": 0.12,
                    "atkExtra2": 0.14
                },
                {
                    "atkExtra": 0.55,
                    "atk": 0.088,
                    "atk2": 0.13,
                    "atkExtra2": 0.15
                },
                {
                    "atkExtra": 0.6,
                    "atk": 0.096,
                    "atk2": 0.14,
                    "atkExtra2": 0.17
                },
                {
                    "atkExtra": 0.65,
                    "atk": 0.104,
                    "atk2": 0.16,
                    "atkExtra2": 0.18
                },
                {
                    "atkExtra": 0.7,
                    "atk": 0.112,
                    "atk2": 0.17,
                    "atkExtra2": 0.2
                },
                {
                    "atkExtra": 0.75,
                    "atk": 0.12,
                    "atk2": 0.18,
                    "atkExtra2": 0.21
                },
                {
                    "atkExtra": 0.81,
                    "atk": 0.13,
                    "atk2": 0.19,
                    "atkExtra2": 0.23
                },
                {
                    "atkExtra": 0.88,
                    "atk": 0.14,
                    "atk2": 0.21,
                    "atkExtra2": 0.24
                },
                {
                    "atkExtra": 0.94,
                    "atk": 0.15,
                    "atk2": 0.22,
                    "atkExtra2": 0.26
                },
                {
                    "atkExtra": 1,
                    "atk": 0.16,
                    "atk2": 0.24,
                    "atkExtra2": 0.28
                },
                {
                    "atkExtra": 1.05,
                    "atk": 0.168,
                    "atk2": 0.25,
                    "atkExtra2": 0.295
                },
                {
                    "atkExtra": 1.1,
                    "atk": 0.176,
                    "atk2": 0.26,
                    "atkExtra2": 0.31
                }
            ],
            "inferredNotes": [
                "Lv.11 atkExtra は前後Lvから線形補完",
                "Lv.11 atk は前後Lvから線形補完",
                "Lv.11 atk2 は前後Lvから線形補完",
                "Lv.11 atkExtra2 は前後Lvから線形補完"
            ]
        },
        "technique": {
            "name": "落英・思い出も散りて",
            "sourceHeader": "秘技",
            "type": "support",
            "target": "all",
            "description": "即座に一定範囲内のすべての敵を攻撃する。戦闘に入った後、敵全体に緋英の攻撃力100%分の物理属性ダメージを与え、「爆笑の褒美」を20個獲得する。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "楽しむ大衆を眺めて緋英の会心率+30%。フィールド上の敵の数が3体以上/2体/1体の時、必殺技のバウンド回数+1/2/4。愉悦スキルの出席番号が緋英より小さい味方が「爆笑の褒美」を獲得した時、緋英はその50%分を自身の「爆笑の褒美」にする。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "裁きを下す「キツネ先生」が攻撃する時、敵に追加で被ダメージアップ効果を付与し、その敵の受けるダメージ+12%、3ターン継続。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "咲きても散らず緋英以外の味方が所持している「爆笑の褒美」が終了する時、緋英はその50%分を自身の「爆笑の褒美」に転換する。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "故郷、祈りを込めた舞",
            "description": "全属性耐性貫通+20%。「キツネ先生」が攻撃を行った後、追加で愉悦スキルを1回発動する。また、愉悦スキルは追加で自身に「爆笑の褒美」を10付与できるようになる。"
        },
        "2": {
            "name": "遠路、永遠に咲きたし",
            "description": "会心ダメージ+36%。追加能力「楽しむ大衆を眺めて」の効果を発動して爆笑の褒美を獲得した時、追加でその回に獲得した「爆笑の褒美」50%分の「爆笑の褒美」を獲得する。また、追加能力「咲きても散らず」を発動して爆笑の褒美を獲得した時、追加でその回に獲得した「爆笑の褒美」100%分の「爆笑の褒美」を獲得する。"
        },
        "3": {
            "name": "量刀、紅月の魔を呑む",
            "description": "必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。愉悦スキルのLv.+1、最大Lv.15まで。"
        },
        "4": {
            "name": "花園、悪党に拐されて",
            "description": "緋英が与えるダメージは、敵の防御力を15%無視する。"
        },
        "5": {
            "name": "楽園、悲喜苦楽を見る",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。愉悦スキルのLv.+1、最大Lv.15まで。"
        },
        "6": {
            "name": "乙女、浮世は夢の如し",
            "description": "緋英の「爆笑の褒美」の継続時間+1ターン。緋英が与える愉悦ダメージが15%上笑する。「爆笑の褒美」を100所持しているごとに、さらに2.0%上笑する。「爆笑の褒美」は最大1000までカウントされる。戦闘に入って初めて必殺技を発動した後、緋英はEPを固定で120回復する。この効果は必殺技を4回発動するたびに1回発動できる。"
        }
    },
    "partyEffects": [
        {
            "id": "extra4_dmg_taken_mirror",
            "source": "extra",
            "name": "昇格4 (火力計算用)",
            "description": "裁きを下す「キツネ先生」が攻撃する時、敵に追加で被ダメージアップ効果を付与し、その敵の受けるダメージ+12%、3ターン継続。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "single",
            "duration": 3,
            "stat": "DMG_TAKEN",
            "value": 0.12
        }
    ],
    "enemyEffects": [
        {
            "id": "extra4_dmg_taken",
            "source": "extra",
            "name": "昇格4",
            "description": "裁きを下す「キツネ先生」が攻撃する時、敵に追加で被ダメージアップ効果を付与し、その敵の受けるダメージ+12%、3ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 3,
            "stat": "DMG_TAKEN",
            "value": 0.12
        }
    ],
    "selfEffects": [
        {
            "id": "extra2_crit_rate",
            "source": "extra",
            "name": "昇格2",
            "description": "緋英の会心率+30%。",
            "defaultActive": false,
            "target": "single",
            "stat": "CRIT_RATE",
            "value": 0.3
        },
        {
            "id": "e1_res_pen",
            "source": "eidolon",
            "name": "故郷、祈りを込めた舞",
            "description": "全属性耐性貫通+20%。",
            "defaultActive": false,
            "target": "single",
            "minEidolon": 1,
            "stat": "RES_PEN",
            "value": 0.2
        },
        {
            "id": "e2_crit_dmg",
            "source": "eidolon",
            "name": "遠路、永遠に咲きたし",
            "description": "会心ダメージ+36%。",
            "defaultActive": false,
            "target": "single",
            "minEidolon": 2,
            "stat": "CRIT_DMG",
            "value": 0.36
        },
        {
            "id": "e4_def_ignore",
            "source": "eidolon",
            "name": "花園、悪党に拐されて",
            "description": "緋英が与えるダメージは、敵の防御力を15%無視する。",
            "defaultActive": false,
            "target": "single",
            "minEidolon": 4,
            "stat": "DEF_IGNORE",
            "value": 0.15
        }
    ]
});
