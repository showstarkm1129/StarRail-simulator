import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Trailblazer (Preservation)",
    "id": "trailblazer_preservation",
    "name": "開拓者-存護",
    "element": "Fire",
    "elementLabel": "炎",
    "path": "Preservation",
    "rarity": 5,
    "base": {
        "hp": 1241,
        "atk": 601,
        "def": 606,
        "spd": 95
    },
    "maxEnergy": 120,
    "traceBonuses": [
        {
            "label": "防御力",
            "value": 0.35
        },
        {
            "label": "攻撃力",
            "value": 0.18
        },
        {
            "label": "最大HP",
            "value": 0.1
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E9%96%8B%E6%8B%93%E8%80%85-%E5%AD%98%E8%AD%B7",
        "version": "1.0"
    },
    "skills": {
        "basic": {
            "name": "堅氷を貫く烈火",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "blast",
            "damageComponents": [
                {
                    "id": "basic-normal",
                    "label": "通常攻撃",
                    "scalingStat": "atk",
                    "multiplierKey": "atk",
                    "target": "single"
                },
                {
                    "id": "basic-enhanced",
                    "label": "強化通常攻撃",
                    "scalingStat": "atk",
                    "multiplierKey": "atkAlt2",
                    "target": "blast"
                }
            ],
            "description": "[単体攻撃]指定した敵単体に開拓者の攻撃力X%分の炎属性ダメージを与え、「灼熱意志」を1層獲得する。[拡散攻撃]「灼熱意志」を4層消費して、通常攻撃を強化。指定した敵単体に開拓者の攻撃力Y%分の炎属性ダメージを与え、隣接する敵に開拓者の攻撃力Z%分の炎属性ダメージを与える。",
            "levelColumns": [
                "単体攻撃",
                "拡散攻撃"
            ],
            "levels": [
                {
                    "atk": 0.5,
                    "atkAlt2": 0.9
                },
                {
                    "atk": 0.6,
                    "atkAlt2": 0.99
                },
                {
                    "atk": 0.7,
                    "atkAlt2": 1.08
                },
                {
                    "atk": 0.8,
                    "atkAlt2": 1.17
                },
                {
                    "atk": 0.9,
                    "atkAlt2": 1.26
                },
                {
                    "atk": 1,
                    "atkAlt2": 1.35
                },
                {
                    "atk": 1.1,
                    "atkAlt2": 1.46
                }
            ]
        },
        "skill": {
            "name": "不滅のアンバー",
            "sourceHeader": "戦闘スキル",
            "type": "shield",
            "target": "all",
            "description": "[防御]戦闘スキルを発動した後、開拓者の被ダメージ-X%、「灼熱意志」を1層獲得、さらに100%の基礎確率で敵全体を挑発状態にする、1ターン継続。",
            "levelColumns": [
                "被ダメージダウン(X％)"
            ],
            "levels": [
                {
                    "dmgTaken": 0.4
                },
                {
                    "dmgTaken": 0.41
                },
                {
                    "dmgTaken": 0.42
                },
                {
                    "dmgTaken": 0.43
                },
                {
                    "dmgTaken": 0.44
                },
                {
                    "dmgTaken": 0.45
                },
                {
                    "dmgTaken": 0.46
                },
                {
                    "dmgTaken": 0.48
                },
                {
                    "dmgTaken": 0.49
                },
                {
                    "dmgTaken": 0.5
                },
                {
                    "dmgTaken": 0.51
                },
                {
                    "dmgTaken": 0.52
                }
            ]
        },
        "ult": {
            "name": "陥陣無帰の炎槍",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "all",
            "damageComponents": [
                {
                    "id": "ult-atk",
                    "label": "攻撃力分",
                    "scalingStat": "atk",
                    "multiplierKey": "defPct",
                    "target": "all"
                },
                {
                    "id": "ult-def",
                    "label": "防御力分",
                    "scalingStat": "def",
                    "multiplierKey": "defPct2",
                    "target": "all"
                }
            ],
            "description": "[全体攻撃]敵全体に開拓者の攻撃力X%+防御力Y%分の炎属性ダメージを与える。次の通常攻撃を強化、その強化通常攻撃は「灼熱意志」を消費しない。",
            "levelColumns": [
                "攻撃力倍率(X％)",
                "防御力倍率(Y％)",
                "消費EP"
            ],
            "levels": [
                {
                    "defPct": 0.5,
                    "defPct2": 0.75,
                    "energyCost": 120
                },
                {
                    "defPct": 0.55,
                    "defPct2": 0.82
                },
                {
                    "defPct": 0.6,
                    "defPct2": 0.9
                },
                {
                    "defPct": 0.65,
                    "defPct2": 0.97
                },
                {
                    "defPct": 0.7,
                    "defPct2": 1.05
                },
                {
                    "defPct": 0.75,
                    "defPct2": 1.12
                },
                {
                    "defPct": 0.81,
                    "defPct2": 1.21
                },
                {
                    "defPct": 0.88,
                    "defPct2": 1.31
                },
                {
                    "defPct": 0.94,
                    "defPct2": 1.41
                },
                {
                    "defPct": 1,
                    "defPct2": 1.5
                },
                {
                    "defPct": 1.05,
                    "defPct2": 1.58
                },
                {
                    "defPct": 1.1,
                    "defPct2": 1.65
                }
            ]
        },
        "talent": {
            "name": "建創者の失われし宝",
            "sourceHeader": "天賦",
            "type": "support",
            "target": "all_ally",
            "description": "[強化]攻撃を1回受けるごとに、「灼熱意志」を1層獲得、最大で8層累積できる。「灼熱意志」の層数が4以上である場合は通常攻撃が強化され、指定した敵単体および隣接する敵にダメージを与える。開拓者が通常攻撃、戦闘スキル、必殺技を発動した後、味方全体に開拓者の防御力X%+Yの耐久値を持つバリアを付与する。バリアは2ターン継続。",
            "levelColumns": [
                "バリア耐久値(X%+Y)"
            ],
            "levels": [
                {
                    "shieldPct": 0.04,
                    "shieldFlat": 20
                },
                {
                    "shieldPct": 0.042,
                    "shieldFlat": 32
                },
                {
                    "shieldPct": 0.045,
                    "shieldFlat": 41
                },
                {
                    "shieldPct": 0.047,
                    "shieldFlat": 50
                },
                {
                    "shieldPct": 0.05,
                    "shieldFlat": 56
                },
                {
                    "shieldPct": 0.052,
                    "shieldFlat": 62
                },
                {
                    "shieldPct": 0.054,
                    "shieldFlat": 67
                },
                {
                    "shieldPct": 0.056,
                    "shieldFlat": 71
                },
                {
                    "shieldPct": 0.058,
                    "shieldFlat": 76
                },
                {
                    "shieldPct": 0.06,
                    "shieldFlat": 80
                },
                {
                    "shieldPct": 0.062,
                    "shieldFlat": 85
                },
                {
                    "shieldPct": 0.064,
                    "shieldFlat": 89
                }
            ]
        },
        "technique": {
            "name": "守護者命令",
            "sourceHeader": "秘技",
            "type": "shield",
            "target": "single",
            "description": "[防御]秘技を使用した後、次の戦闘開始時、自身に開拓者の防御力30%+384の耐久値を持つバリアを付与する、1ターン継続。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "弱きを助け戦闘スキルを発動した後、味方全体の被ダメージ-15%、1ターン継続。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "死の前に生を開拓者が強化通常攻撃を行った後、HPを最大HP5%回復する。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "考えるより行動ターンが回ってきた時、開拓者がバリアを持つ場合、攻撃力+15%、EPを5回復する、効果は行動終了まで継続。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "大地芯髄の鳴動",
            "description": "通常攻撃を行った時、さらに開拓者の防御力25%分の炎属性ダメージを与える。強化通常攻撃を行った時、さらに開拓者の防御力50%分の炎属性ダメージを与える。"
        },
        "2": {
            "name": "古き寒鉄の堅守",
            "description": "天賦発動時、味方全体に付与するバリアの耐久値が、開拓者の防御力2%+27アップする。"
        },
        "3": {
            "name": "未来を築く青図",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "4": {
            "name": "文明に留まる誓い",
            "description": "戦闘開始時、「灼熱意志」を4層獲得する。"
        },
        "5": {
            "name": "光焔を燃やす勇気",
            "description": "必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "6": {
            "name": "永世に聳える壁塁",
            "description": "強化通常攻撃または必殺技を発動した後、開拓者の防御力+10%、最大で3層累積できる。"
        }
    },
    "partyEffects": [],
    "enemyEffects": [],
    "selfEffects": [
        {
            "id": "extra6_shield_atk",
            "source": "extra",
            "name": "昇格6",
            "description": "ターンが回ってきた時、開拓者がバリアを持つ場合、攻撃力+15%、効果は行動終了まで継続。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "stat": "ATK_PERCENT",
            "value": 0.15
        },
        {
            "id": "e6_def_percent",
            "source": "eidolon",
            "name": "永世に聳える壁塁",
            "description": "強化通常攻撃または必殺技を発動した後、開拓者の防御力+10%、最大3層。",
            "defaultActive": false,
            "target": "single",
            "minEidolon": 6,
            "stat": "DEF_PERCENT",
            "value": 0.1,
            "stackable": {
                "max": 3,
                "default": 3
            }
        }
    ]
});
