import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Kafka",
    "id": "kafka",
    "name": "カフカ",
    "element": "Lightning",
    "elementLabel": "雷",
    "path": "Nihility",
    "rarity": 5,
    "base": {
        "hp": 1086,
        "atk": 679,
        "def": 485,
        "spd": 100
    },
    "maxEnergy": 120,
    "traceBonuses": [
        {
            "label": "攻撃力",
            "value": 0.28
        },
        {
            "label": "効果命中",
            "value": 0.18
        },
        {
            "label": "最大HP",
            "value": 0.1
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%82%AB%E3%83%95%E3%82%AB",
        "version": "1.2"
    },
    "skills": {
        "basic": {
            "name": "止まない夜の喧騒",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にカフカの攻撃力X%分の雷属性ダメージを与える。",
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
            "name": "月明かりが撫でる連綿",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "blast",
            "description": "[拡散攻撃]指定した敵単体にカフカの攻撃力X%分の雷属性ダメージを与え、隣接する敵にカフカの攻撃力Y%分の雷属性ダメージを与える。指定した敵単体または隣接する敵が持続ダメージ系デバフ状態である場合、付与された全持続ダメージ系デバフが、即座に本来のダメージZ%分またはW%分のダメージを発生させる。",
            "levelColumns": [
                "単体ダメージ倍率(X%)",
                "隣接ダメージ倍率(Y%)",
                "単体誘発ダメージ倍率(Z%)",
                "隣接誘発ダメージ倍率(W%)"
            ],
            "levels": [
                {
                    "atk": 0.8,
                    "atkAdjacent": 0.3,
                    "atk2": 0.6,
                    "atkAdjacent2": 0.4
                },
                {
                    "atk": 0.88,
                    "atkAdjacent": 0.33,
                    "atk2": 0.61,
                    "atkAdjacent2": 0.41
                },
                {
                    "atk": 0.96,
                    "atkAdjacent": 0.36,
                    "atk2": 0.63,
                    "atkAdjacent2": 0.42
                },
                {
                    "atk": 1.04,
                    "atkAdjacent": 0.39,
                    "atk2": 0.64,
                    "atkAdjacent2": 0.43
                },
                {
                    "atk": 1.12,
                    "atkAdjacent": 0.42,
                    "atk2": 0.66,
                    "atkAdjacent2": 0.44
                },
                {
                    "atk": 1.2,
                    "atkAdjacent": 0.45,
                    "atk2": 0.67,
                    "atkAdjacent2": 0.45
                },
                {
                    "atk": 1.3,
                    "atkAdjacent": 0.48,
                    "atk2": 0.69,
                    "atkAdjacent2": 0.46
                },
                {
                    "atk": 1.4,
                    "atkAdjacent": 0.52,
                    "atk2": 0.71,
                    "atkAdjacent2": 0.47
                },
                {
                    "atk": 1.5,
                    "atkAdjacent": 0.56,
                    "atk2": 0.73,
                    "atkAdjacent2": 0.49
                },
                {
                    "atk": 1.6,
                    "atkAdjacent": 0.6,
                    "atk2": 0.75,
                    "atkAdjacent2": 0.5
                },
                {
                    "atk": 1.68,
                    "atkAdjacent": 0.63,
                    "atk2": 0.76,
                    "atkAdjacent2": 0.51
                },
                {
                    "atk": 1.76,
                    "atkAdjacent": 0.66,
                    "atk2": 0.78,
                    "atkAdjacent2": 0.52
                }
            ]
        },
        "ult": {
            "name": "悲劇最果ての顫音",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]敵全体にカフカの攻撃力X%分の雷属性ダメージを与え、100%の基礎確率で攻撃を受けた敵を感電状態にし、付与された持続ダメージ系デバフが即座に本来のダメージY%分のダメージを発生させる。感電状態は2ターン継続。感電状態の敵はターンが回ってくるたびに、カフカの攻撃力Z%分の雷属性持続ダメージを受ける。",
            "levelColumns": [
                "全体ダメージ倍率(X%)",
                "誘発ダメージ倍率(Y%)",
                "感電ダメージ倍率(Z%)",
                "消費EP"
            ],
            "levels": [
                {
                    "atkAll": 0.48,
                    "atk": 1,
                    "atk2": 1.16,
                    "energyCost": 120
                },
                {
                    "atkAll": 0.51,
                    "atk": 1.02,
                    "atk2": 1.26
                },
                {
                    "atkAll": 0.54,
                    "atk": 1.04,
                    "atk2": 1.37
                },
                {
                    "atkAll": 0.57,
                    "atk": 1.06,
                    "atk2": 1.48
                },
                {
                    "atkAll": 0.6,
                    "atk": 1.08,
                    "atk2": 1.59
                },
                {
                    "atkAll": 0.64,
                    "atk": 1.1,
                    "atk2": 1.75
                },
                {
                    "atkAll": 0.68,
                    "atk": 1.12,
                    "atk2": 1.97
                },
                {
                    "atkAll": 0.72,
                    "atk": 1.15,
                    "atk2": 2.24
                },
                {
                    "atkAll": 0.76,
                    "atk": 1.17,
                    "atk2": 2.57
                },
                {
                    "atkAll": 0.8,
                    "atk": 1.2,
                    "atk2": 2.9
                },
                {
                    "atkAll": 0.83,
                    "atk": 1.22,
                    "atk2": 3.04
                },
                {
                    "atkAll": 0.86,
                    "atk": 1.24,
                    "atk2": 3.18
                }
            ]
        },
        "talent": {
            "name": "優しさもまた残酷",
            "sourceHeader": "天賦",
            "type": "follow_up",
            "target": "single",
            "description": "[単体攻撃]カフカ以外の味方が敵に攻撃を行った後、カフカは即座に追加攻撃を行い、メインターゲットにカフカの攻撃力X%分の雷属性ダメージを与え、100%の基礎確率で攻撃を受けた敵を必殺技が与えるものと同じ感電状態にする、2ターン継続。この効果は最大2回まで発動でき、カフカのターン終了時、発動可能回数が1回復する。",
            "levelColumns": [
                "追加攻撃ダメージ倍率(X%)"
            ],
            "levels": [
                {
                    "atkExtra": 0.42
                },
                {
                    "atkExtra": 0.51
                },
                {
                    "atkExtra": 0.61
                },
                {
                    "atkExtra": 0.71
                },
                {
                    "atkExtra": 0.81
                },
                {
                    "atkExtra": 0.91
                },
                {
                    "atkExtra": 1.03
                },
                {
                    "atkExtra": 1.15
                },
                {
                    "atkExtra": 1.28
                },
                {
                    "atkExtra": 1.4
                },
                {
                    "atkExtra": 1.49
                },
                {
                    "atkExtra": 1.59
                }
            ]
        },
        "technique": {
            "name": "許しは慈悲に非ず",
            "sourceHeader": "秘技",
            "type": "support",
            "target": "all",
            "description": "一定範囲内のすべての敵を攻撃。戦闘に入った後、敵全体にカフカの攻撃力50%分の雷属性ダメージを与え、100%の基礎確率で敵単体それぞれを、必殺技が付与するものと同じ感電状態にする、2ターン継続。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "苛み味方の効果命中が75%以上の場合、カフカはその味方の攻撃力を100%アップさせる。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "略奪感電状態の敵が倒された時、カフカはさらにEPを5回復する。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "いばら必殺技を発動した後、天賦による追加攻撃の発動可能回数を1回復する。天賦による追加攻撃を行うと、ターゲット付与されたすべての持続ダメージ系デバフが、即座に本来のダメージ80%分のダメージを発生させる。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "無窮に動く！無窮に",
            "description": "攻撃を行う時、100%の基礎確率でターゲットの受ける持続ダメージ+30%、2ターン継続。"
        },
        "2": {
            "name": "狂想者の嗚咽",
            "description": "カフカがフィールド上にいる時、味方全体の持続ダメージ+33%。"
        },
        "3": {
            "name": "即興の賛美",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "この叙唱を",
            "description": "カフカが敵に付与した感電状態がダメージが発生する時、カフカのEPをさらに2回復する。"
        },
        "5": {
            "name": "今晩だけの奏鳴",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "回る、静かに",
            "description": "必殺技、秘技、天賦による追加攻撃が敵に付与する感電状態のダメージ倍率+156%、感電状態の継続時間+1ターン。"
        }
    }
});
