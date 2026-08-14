import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Misha",
    "id": "misha",
    "name": "ミーシャ",
    "element": "Ice",
    "elementLabel": "氷",
    "path": "Destruction",
    "rarity": 4,
    "base": {
        "hp": 1270,
        "atk": 599,
        "def": 396,
        "spd": 96
    },
    "maxEnergy": 100,
    "traceBonuses": [
        {
            "label": "氷ダメージ",
            "value": 0.224
        },
        {
            "label": "防御力",
            "value": 0.225
        },
        {
            "label": "会心率",
            "value": 0.067
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%83%9F%E3%83%BC%E3%82%B7%E3%83%A3",
        "version": "2.0"
    },
    "skills": {
        "basic": {
            "name": "ど…退いてくださーい！",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にミーシャの攻撃力X%分の氷属性ダメージを与える。",
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
            "name": "ル…ルームサービスです！",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "blast",
            "description": "[拡散攻撃]ミーシャの次の必殺技の攻撃段数+1。指定した敵単体にミーシャの攻撃力X%分の氷属性ダメージを与え、隣接する敵にミーシャの攻撃力Y%分の氷属性ダメージを与える。",
            "levelColumns": [
                "単体ダメージ倍率(X％)",
                "隣接ダメージ倍率(Y％)"
            ],
            "levels": [
                {
                    "atk": 1,
                    "atkAdjacent": 0.4
                },
                {
                    "atk": 1.1,
                    "atkAdjacent": 0.44
                },
                {
                    "atk": 1.2,
                    "atkAdjacent": 0.48
                },
                {
                    "atk": 1.3,
                    "atkAdjacent": 0.52
                },
                {
                    "atk": 1.4,
                    "atkAdjacent": 0.56
                },
                {
                    "atk": 1.5,
                    "atkAdjacent": 0.6
                },
                {
                    "atk": 1.62,
                    "atkAdjacent": 0.65
                },
                {
                    "atk": 1.75,
                    "atkAdjacent": 0.7
                },
                {
                    "atk": 1.87,
                    "atkAdjacent": 0.75
                },
                {
                    "atk": 2,
                    "atkAdjacent": 0.8
                },
                {
                    "atk": 2.1,
                    "atkAdjacent": 0.84
                },
                {
                    "atk": 2.2,
                    "atkAdjacent": 0.88
                }
            ]
        },
        "ult": {
            "name": "ち…遅刻する！",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "bounce",
            "description": "[バウンド]初期状態の攻撃段数は3。最初に1段の攻撃を行い、指定した敵単体にミーシャの攻撃力X%分の氷属性ダメージを与え、以降の各段攻撃は、ランダムな敵単体にミーシャの攻撃力X%分の氷属性ダメージを与える。各段攻撃の前に、Y%の基礎確率で敵を凍結状態にする、1ターン継続。凍結状態の敵は行動できず、ターンが回ってくるたびにミーシャの攻撃力Z%分の氷属性付加ダメージを受ける。必殺技の最大攻撃段数は10。必殺技を発動した後、攻撃段数が初期状態にリセットされる。",
            "levelColumns": [
                "ダメージ倍率(X％/1段)",
                "凍結基礎確率(Y%)",
                "凍結付加ダメージ倍率(Z%)",
                "消費EP"
            ],
            "levels": [
                {
                    "atk": 0.36,
                    "atkAlt2": 0.12,
                    "atk2": 0.18,
                    "energyCost": 100
                },
                {
                    "atk": 0.38,
                    "atkAlt2": 0.128,
                    "atk2": 0.19
                },
                {
                    "atk": 0.4,
                    "atkAlt2": 0.136,
                    "atk2": 0.2
                },
                {
                    "atk": 0.43,
                    "atkAlt2": 0.144,
                    "atk2": 0.21
                },
                {
                    "atk": 0.45,
                    "atkAlt2": 0.152,
                    "atk2": 0.22
                },
                {
                    "atk": 0.48,
                    "atkAlt2": 0.16,
                    "atk2": 0.24
                },
                {
                    "atk": 0.51,
                    "atkAlt2": 0.17,
                    "atk2": 0.25
                },
                {
                    "atk": 0.54,
                    "atkAlt2": 0.18,
                    "atk2": 0.27
                },
                {
                    "atk": 0.57,
                    "atkAlt2": 0.19,
                    "atk2": 0.28
                },
                {
                    "atk": 0.6,
                    "atkAlt2": 0.2,
                    "atk2": 0.3
                },
                {
                    "atk": 0.62,
                    "atkAlt2": 0.208,
                    "atk2": 0.31
                },
                {
                    "atk": 0.64,
                    "atkAlt2": 0.216,
                    "atk2": 0.32
                }
            ]
        },
        "talent": {
            "name": "脱進機",
            "sourceHeader": "天賦",
            "type": "heal",
            "target": "single",
            "description": "[強化]味方がSPを1消費するたびに、ミーシャの次の必殺技の攻撃段数+1、ミーシャのEPをX回復する。",
            "levelColumns": [
                "EP回復(X)"
            ],
            "levels": [
                {
                    "energyGain": 1
                },
                {
                    "energyGain": 1.1
                },
                {
                    "energyGain": 1.2
                },
                {
                    "energyGain": 1.3
                },
                {
                    "energyGain": 1.4
                },
                {
                    "energyGain": 1.5
                },
                {
                    "energyGain": 1.6
                },
                {
                    "energyGain": 1.8
                },
                {
                    "energyGain": 1.9
                },
                {
                    "energyGain": 2
                },
                {
                    "energyGain": 2.1
                },
                {
                    "energyGain": 2.2
                }
            ]
        },
        "technique": {
            "name": "時よ止まれ、アナタは美しい",
            "sourceHeader": "秘技",
            "type": "debuff",
            "target": "single",
            "description": "[妨害]秘技を使用した後、15秒間継続する特殊領域を作り出す。特殊領域内にいる敵は「夢の牢屋」を付与される。「夢の牢屋」状態の敵は行動を停止する。「夢の牢屋」状態の敵と戦闘に入った後、ミーシャの次の必殺技の攻撃段数+2。味方が作り出した領域は1つまで存在できる。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "リリース必殺技の1段目の攻撃の前に、敵を凍結状態にする基礎確率+80%。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "インターロック必殺技を発動する時、効果命中+60%、その回の必殺技が終了するまで継続。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "トランスミッション凍結状態の敵に対する会心ダメージ+30%。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "揺らめく幻影",
            "description": "必殺技を発動する時、フィールド上にいる敵1体につき、この回の必殺技の攻撃段数+1、最大で+5。"
        },
        "2": {
            "name": "青春の悲しい眺望",
            "description": "必殺技の各段攻撃の前に、24%の基礎確率で敵の防御力-16%、3ターン継続。"
        },
        "3": {
            "name": "忘れられない時代の名残",
            "description": "必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "よく知る面影",
            "description": "必殺技の各段攻撃のダメージ倍率+6%。"
        },
        "5": {
            "name": "初めての愛情と友情",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "久しく忘れていた憧れ",
            "description": "必殺技を発動する時、自身の与ダメージ+30%、自身の次のターンが終了するまで継続。次の戦闘スキルを発動した後、SPを1回復する。"
        }
    },
    "partyEffects": [
        {
            "id": "e2_def_down_mirror",
            "source": "eidolon",
            "name": "青春の悲しい眺望 (火力計算用)",
            "description": "必殺技の各段攻撃の前に、24%の基礎確率で敵の防御力-16%、3ターン継続。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "single",
            "duration": 3,
            "minEidolon": 2,
            "stat": "DEF_DOWN",
            "value": 0.16
        }
    ],
    "enemyEffects": [
        {
            "id": "e2_def_down",
            "source": "eidolon",
            "name": "青春の悲しい眺望",
            "description": "必殺技の各段攻撃の前に、24%の基礎確率で敵の防御力-16%、3ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 3,
            "minEidolon": 2,
            "stat": "DEF_DOWN",
            "value": 0.16
        }
    ],
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "e6_dmg",
            "source": "eidolon",
            "name": "久しく忘れていた憧れ",
            "description": "必殺技を発動する時、自身の与ダメージ+30%、自身の次のターンが終了するまで継続。次の戦闘スキルを発動した後、SPを1回復する。",
            "stat": "DMG_ALL",
            "value": 0.3,
            "minEidolon": 6
        },
        {
            "id": "extra4_ult_ehr",
            "source": "extra",
            "name": "昇格4",
            "description": "必殺技を発動する時、効果命中+60%、その回の必殺技が終了するまで継続。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "stat": "EFFECT_HIT_RATE",
            "value": 0.6
        },
        {
            "id": "extra6_frozen_crit_dmg",
            "source": "extra",
            "name": "昇格6",
            "description": "凍結状態の敵に対する会心ダメージ+30%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "stat": "CRIT_DMG",
            "value": 0.3
        }
    ]
});
