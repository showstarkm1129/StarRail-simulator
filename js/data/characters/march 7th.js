import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "March 7th",
    "id": "march_7th",
    "name": "三月なのか",
    "element": "Ice",
    "elementLabel": "氷",
    "path": "Preservation",
    "rarity": 4,
    "base": {
        "hp": 1058,
        "atk": 511,
        "def": 573,
        "spd": 101
    },
    "maxEnergy": 120,
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
            "label": "効果抵抗",
            "value": 0.1
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E4%B8%89%E6%9C%88%E3%81%AA%E3%81%AE%E3%81%8B",
        "version": "1.0"
    },
    "skills": {
        "basic": {
            "name": "極寒の弓矢",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に三月なのかの攻撃力X%分の氷属性ダメージを与える。",
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
            "name": "可愛いは正義",
            "sourceHeader": "戦闘スキル",
            "type": "shield",
            "target": "single_ally",
            "description": "[防御]指定した味方単体に三月なのかの防御力X%＋Yの耐久値を持つバリアを与える、3ターン継続。その味方の残りHPが30%以上の場合、敵に攻撃される確率が大幅にアップする。",
            "levelColumns": [
                "バリア耐久値(X%+Y)"
            ],
            "levels": [
                {
                    "shieldPct": 0.38,
                    "shieldFlat": 190
                },
                {
                    "shieldPct": 0.4,
                    "shieldFlat": 304
                },
                {
                    "shieldPct": 0.42,
                    "shieldFlat": 389
                },
                {
                    "shieldPct": 0.45,
                    "shieldFlat": 475
                },
                {
                    "shieldPct": 0.47,
                    "shieldFlat": 532
                },
                {
                    "shieldPct": 0.49,
                    "shieldFlat": 589
                },
                {
                    "shieldPct": 0.51,
                    "shieldFlat": 631
                },
                {
                    "shieldPct": 0.53,
                    "shieldFlat": 674
                },
                {
                    "shieldPct": 0.55,
                    "shieldFlat": 717
                },
                {
                    "shieldPct": 0.57,
                    "shieldFlat": 760
                },
                {
                    "shieldPct": 0.58,
                    "shieldFlat": 802
                },
                {
                    "shieldPct": 0.6,
                    "shieldFlat": 845
                }
            ]
        },
        "ult": {
            "name": "氷刻矢雨の時",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]敵全体に三月なのかの攻撃力X%分の氷属性ダメージを与える。攻撃を受けた敵は50%の基礎確率で凍結状態になる、1ターン継続。凍結状態の敵は行動できなくなり、ターンが回ってくるたびに三月なのかの攻撃力Y%分の氷属性付加ダメージを受ける。",
            "levelColumns": [
                "全体ダメージ倍率(X%)",
                "付加ダメージ倍率(Y%)",
                "消費EP"
            ],
            "levels": [
                {
                    "atkAll": 0.9,
                    "atk": 0.3,
                    "energyCost": 120
                },
                {
                    "atkAll": 0.96,
                    "atk": 0.33
                },
                {
                    "atkAll": 1.02,
                    "atk": 0.36
                },
                {
                    "atkAll": 1.08,
                    "atk": 0.39
                },
                {
                    "atkAll": 1.14,
                    "atk": 0.42
                },
                {
                    "atkAll": 1.2,
                    "atk": 0.45
                },
                {
                    "atkAll": 1.27,
                    "atk": 0.48
                },
                {
                    "atkAll": 1.35,
                    "atk": 0.52
                },
                {
                    "atkAll": 1.42,
                    "atk": 0.56
                },
                {
                    "atkAll": 1.5,
                    "atk": 0.6
                },
                {
                    "atkAll": 1.56,
                    "atk": 0.63
                },
                {
                    "atkAll": 1.62,
                    "atk": 0.66
                }
            ]
        },
        "talent": {
            "name": "少女の特権",
            "sourceHeader": "天賦",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]バリアを持つ味方が敵に攻撃された後、三月なのかは攻撃者にカウンターを発動し、三月なのかの攻撃力X%分の氷属性ダメージを与える。この効果はターンが回ってくるたびに2回発動できる。",
            "levelColumns": [
                "ダメージ倍率(X%)"
            ],
            "levels": [
                {
                    "atk": 0.5
                },
                {
                    "atk": 0.55
                },
                {
                    "atk": 0.6
                },
                {
                    "atk": 0.65
                },
                {
                    "atk": 0.7
                },
                {
                    "atk": 0.75
                },
                {
                    "atk": 0.81
                },
                {
                    "atk": 0.87
                },
                {
                    "atk": 0.93
                },
                {
                    "atk": 1
                },
                {
                    "atk": 1.05
                },
                {
                    "atk": 1.1
                }
            ]
        },
        "technique": {
            "name": "凍る瞬間",
            "sourceHeader": "秘技",
            "type": "support",
            "target": "single",
            "description": "敵を攻撃。戦闘に入った後、100%の基礎確率でランダムな敵単体を凍結状態にする、1ターン継続。凍結状態の敵は行動できなくなり、ターンが回ってくるたびに三月なのかの攻撃力50%分の氷属性付加ダメージを受ける。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "純潔戦闘スキルを発動した時、指定した味方単体のデバフを1つ解除する。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "加護戦闘スキルで付与したバリアの継続時間+1ターン。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "氷呪必殺技を発動した時、敵を凍結状態にする基礎確率+15%。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "記憶の中の君",
            "description": "必殺技が敵1体を凍結状態にするたび、三月なのかはEPを6回復する。"
        },
        "2": {
            "name": "記憶の中のあの子",
            "description": "戦闘に入る時、残りHP割合が最も低い味方に、三月なのかの防御力24%+320の耐久値を持つバリアを付与する、3ターン継続。"
        },
        "3": {
            "name": "記憶の中の全て",
            "description": "必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "もう失いたくない",
            "description": "ターンが回ってくるたび、天賦のカウンター効果を発動できる回数+1。カウンターのダメージ基礎値が、三月なのかの防御力30%分アップする。"
        },
        "5": {
            "name": "もう忘れたくない",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "このまま、ずっと…",
            "description": "戦闘スキルによるバリアで守られている味方は、ターンが回ってくるたびにHPをそれぞれの最大HP4%+106回復する。"
        }
    }
});
