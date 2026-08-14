import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Gepard",
    "id": "gepard",
    "name": "ジェパード",
    "element": "Ice",
    "elementLabel": "氷",
    "path": "Preservation",
    "rarity": 5,
    "base": {
        "hp": 1397,
        "atk": 543,
        "def": 654,
        "spd": 92
    },
    "maxEnergy": 100,
    "traceBonuses": [
        {
            "label": "氷ダメージ",
            "value": 0.224
        },
        {
            "label": "効果抵抗",
            "value": 0.18
        },
        {
            "label": "防御力",
            "value": 0.125
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%82%B8%E3%82%A7%E3%83%91%E3%83%BC%E3%83%89",
        "version": "1.0"
    },
    "skills": {
        "basic": {
            "name": "一意の拳",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にジェパードの攻撃力X%分の氷属性ダメージを与える。",
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
            "name": "震撼の一撃",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にジェパードの攻撃力X%分の氷属性ダメージを与え、65%の基礎確率で攻撃を受けた敵を凍結状態にする、1ターン継続。凍結状態の敵は行動できず、ターンが回ってくるたびにジェパードの攻撃力Y%分の氷属性付加ダメージを受ける。",
            "levelColumns": [
                "ダメージ倍率(X％)",
                "付加ダメージ倍率(Y%)"
            ],
            "levels": [
                {
                    "atk": 1,
                    "atk2": 0.3
                },
                {
                    "atk": 1.1,
                    "atk2": 0.33
                },
                {
                    "atk": 1.2,
                    "atk2": 0.36
                },
                {
                    "atk": 1.3,
                    "atk2": 0.39
                },
                {
                    "atk": 1.4,
                    "atk2": 0.42
                },
                {
                    "atk": 1.5,
                    "atk2": 0.45
                },
                {
                    "atk": 1.62,
                    "atk2": 0.48
                },
                {
                    "atk": 1.75,
                    "atk2": 0.52
                },
                {
                    "atk": 1.87,
                    "atk2": 0.56
                },
                {
                    "atk": 2,
                    "atk2": 0.6
                },
                {
                    "atk": 2.1,
                    "atk2": 0.63
                },
                {
                    "atk": 2.2,
                    "atk2": 0.66
                }
            ]
        },
        "ult": {
            "name": "永屹の壁",
            "sourceHeader": "必殺技",
            "type": "shield",
            "target": "all_ally",
            "description": "[防御]味方全体にジェパードの防御力X%+Yの耐久値を持つバリアを付与する、3ターン継続。",
            "levelColumns": [
                "バリア耐久値(X%+Y)",
                "消費EP"
            ],
            "levels": [
                {
                    "shieldPct": 0.3,
                    "shieldFlat": 150,
                    "energyCost": 100
                },
                {
                    "shieldPct": 0.31,
                    "shieldFlat": 240
                },
                {
                    "shieldPct": 0.33,
                    "shieldFlat": 307
                },
                {
                    "shieldPct": 0.35,
                    "shieldFlat": 375
                },
                {
                    "shieldPct": 0.37,
                    "shieldFlat": 420
                },
                {
                    "shieldPct": 0.39,
                    "shieldFlat": 465
                },
                {
                    "shieldPct": 0.4,
                    "shieldFlat": 498
                },
                {
                    "shieldPct": 0.42,
                    "shieldFlat": 532
                },
                {
                    "shieldPct": 0.43,
                    "shieldFlat": 566
                },
                {
                    "shieldPct": 0.45,
                    "shieldFlat": 600
                },
                {
                    "shieldPct": 0.46,
                    "shieldFlat": 633
                },
                {
                    "shieldPct": 0.48,
                    "shieldFlat": 668
                }
            ]
        },
        "talent": {
            "name": "不屈の体躯",
            "sourceHeader": "天賦",
            "type": "heal",
            "target": "single",
            "description": "[回復]ジェパードはHPが0になる攻撃を受けても戦闘不能状態にならず、HPを最大HP X%分回復する。この効果は一度の戦闘で1回まで発動できる。",
            "levelColumns": [
                "HP治癒量(X%)"
            ],
            "levels": [
                {
                    "healPct": 0.25
                },
                {
                    "healPct": 0.27
                },
                {
                    "healPct": 0.3
                },
                {
                    "healPct": 0.32
                },
                {
                    "healPct": 0.35
                },
                {
                    "healPct": 0.37
                },
                {
                    "healPct": 0.4
                },
                {
                    "healPct": 0.43
                },
                {
                    "healPct": 0.46
                },
                {
                    "healPct": 0.5
                },
                {
                    "healPct": 0.525
                },
                {
                    "healPct": 0.55
                }
            ],
            "inferredNotes": [
                "Lv.11 healPct は前後Lvから線形補完"
            ]
        },
        "technique": {
            "name": "仁心の証",
            "sourceHeader": "秘技",
            "type": "shield",
            "target": "all_ally",
            "description": "秘技を使用した後、次の戦闘開始時、味方全体にジェパードの防御力24%+150の耐久値を持つバリアを付与する、2ターン継続。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "剛直ジェパードが敵に攻撃される確率がアップする。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "統率「不屈の体躯」を発動した後、ジェパードのEPを100％まで回復する。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "戦意ジェパードの攻撃力が自身の防御力35%分アップ、ターンが回ってくるたびに更新される。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "忠実篤厚",
            "description": "戦闘スキルを発動した時、攻撃を受けた敵が凍結状態になる基礎確率＋35%。"
        },
        "2": {
            "name": "余寒",
            "description": "戦闘スキルで敵に与えた凍結状態が解除された後、敵の速度-20%、1ターン継続。"
        },
        "3": {
            "name": "永劫不落",
            "description": "必殺技のLv＋2、最大Lv15まで。天賦のLv＋2、最大Lv15まで。"
        },
        "4": {
            "name": "確固たる意志",
            "description": "ジェパードがフィールド上にいる時、味方全体の効果抵抗＋20%。"
        },
        "5": {
            "name": "寒鉄の如く拳",
            "description": "戦闘スキルのLv＋2、最大Lv15まで。通常攻撃のLv＋1、最大Lv10まで。"
        },
        "6": {
            "name": "不屈の決意",
            "description": "天賦発動時、ジェパードが即座に行動し、HPの回復量がさらに自身の最大HP50%分アップする。"
        }
    },
    "partyEffects": [
        {
            "id": "e4_party_effect_res",
            "source": "eidolon",
            "name": "不退転の決意",
            "description": "ジェパードがフィールドにいる時、味方全体の効果抵抗+20%。",
            "defaultActive": false,
            "target": "all",
            "minEidolon": 4,
            "stat": "EFFECT_RES",
            "value": 0.2
        }
    ],
    "enemyEffects": [],
    "selfEffects": [
        {
            "id": "extra6_def_to_atk",
            "source": "extra",
            "name": "昇格6",
            "description": "ジェパードの攻撃力が自身の防御力35%分アップ、ターンが回ってくるたびに更新される。",
            "defaultActive": false,
            "target": "single",
            "stat": "ATK_FLAT",
            "compute": "casterDerivedFixedRatio",
            "sourceStat": "def",
            "ratio": 0.35
        }
    ]
});
