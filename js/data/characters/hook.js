import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Hook",
    "id": "hook",
    "name": "フック",
    "element": "Fire",
    "elementLabel": "炎",
    "path": "Destruction",
    "rarity": 4,
    "base": {
        "hp": 1340,
        "atk": 617,
        "def": 352,
        "spd": 94
    },
    "maxEnergy": 120,
    "traceBonuses": [
        {
            "label": "攻撃力",
            "value": 0.28
        },
        {
            "label": "最大HP",
            "value": 0.18
        },
        {
            "label": "会心ダメージ",
            "value": 0.133
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%83%95%E3%83%83%E3%82%AF",
        "version": "1.0"
    },
    "skills": {
        "basic": {
            "name": "おい！火の元に気をつけな",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にフックの攻撃力X%分の炎属性ダメージを与える。",
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
            "name": "おい！フックを覚えてるか？",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "blast",
            "description": "[単体攻撃]指定した敵単体にフックの攻撃力X%分炎属性ダメージを与え、100%の基礎確率で敵を燃焼状態にする、2ターン継続。燃焼状態の敵はターンが回ってくるたびに、フックの攻撃力Y%分炎属性持続ダメージを受ける。[拡散攻撃]指定した敵単体にフックの攻撃力Z%分炎属性ダメージを与え、100%の基礎確率で敵を燃焼状態にする、2ターン継続。さらに、その敵に隣接する敵にフックの攻撃力V%分炎属性ダメージを与える。燃焼状態の敵はターンが回ってくるたびに、フックの攻撃力W%分炎属性持続ダメージを受ける。",
            "levelColumns": [
                "単体攻撃",
                "拡散攻撃"
            ],
            "levels": [
                {
                    "atk": 1.2,
                    "atkAlt2": 0.25
                },
                {
                    "atk": 1.32,
                    "atkAlt2": 0.27
                },
                {
                    "atk": 1.44,
                    "atkAlt2": 0.3
                },
                {
                    "atk": 1.56,
                    "atkAlt2": 0.32
                },
                {
                    "atk": 1.68,
                    "atkAlt2": 0.35
                },
                {
                    "atk": 1.8,
                    "atkAlt2": 0.38
                },
                {
                    "atk": 1.95,
                    "atkAlt2": 0.43
                },
                {
                    "atk": 2.1,
                    "atkAlt2": 0.5
                },
                {
                    "atk": 2.25,
                    "atkAlt2": 0.57
                },
                {
                    "atk": 2.4,
                    "atkAlt2": 0.65
                },
                {
                    "atk": 2.52,
                    "atkAlt2": 0.68
                },
                {
                    "atk": 2.64,
                    "atkAlt2": 0.71
                }
            ]
        },
        "ult": {
            "name": "ドカン！飛んでけ花火！",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にフックの攻撃力X%分炎属性ダメージを与える。必殺技を発動した後、次に発動する戦闘スキルを強化、強化後の戦闘スキルは指定した敵単体および隣接する敵にダメージを与える。",
            "levelColumns": [
                "ダメージ倍率(X%)",
                "消費EP"
            ],
            "levels": [
                {
                    "atk": 2.4,
                    "energyCost": 120
                },
                {
                    "atk": 2.56
                },
                {
                    "atk": 2.72
                },
                {
                    "atk": 2.88
                },
                {
                    "atk": 3.04
                },
                {
                    "atk": 3.2
                },
                {
                    "atk": 3.4
                },
                {
                    "atk": 3.6
                },
                {
                    "atk": 3.8
                },
                {
                    "atk": 4
                },
                {
                    "atk": 4.16
                },
                {
                    "atk": 4.32
                }
            ]
        },
        "talent": {
            "name": "はっ！火に油を注ぐ",
            "sourceHeader": "天賦",
            "type": "heal",
            "target": "single",
            "description": "[強化]燃焼状態の敵を攻撃する時、さらにフックの攻撃力X%分の炎属性付加ダメージを1回与え、さらにEPを5回復する。",
            "levelColumns": [
                "付加ダメージ倍率(X%)"
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
            "name": "ほら！滅茶苦茶になってる",
            "sourceHeader": "秘技",
            "type": "support",
            "target": "single",
            "description": "敵を攻撃。戦闘に入った後、ランダムな敵単体にフックの攻撃力50%分の炎属性ダメージを与え、100%の基礎確率で敵単体それぞれに燃焼状態を付与する、3ターン継続。燃焼状態の敵はターンが回ってくるたびに、フックの攻撃力50%分の炎属性持続ダメージを受ける。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "子供心天賦発動時、フックの最大HP5%分のHPを回復する。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "無邪気行動制限系デバフを抵抗する確率+35%。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "火遊び必殺技を発動した後、フックの行動順が20%早まり、さらにEPを5回復する。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "早寝早起きは健康的",
            "description": "強化後の戦闘スキルの与ダメージ+20%。"
        },
        "2": {
            "name": "よく食べて成長する",
            "description": "戦闘スキルが付与する燃焼状態の継続時間+1ターン。"
        },
        "3": {
            "name": "好き嫌いはしない",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "うっかりしても大丈夫",
            "description": "天賦発動時、100%の基礎確率で指定した敵に隣接する敵を、戦闘スキルが与えるものと同じ燃焼状態にする。"
        },
        "5": {
            "name": "モグラ党は名を遺す",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "悪い奴らはお仕置きだ",
            "description": "燃焼状態の敵に対するフックの与ダメージ+20%。"
        }
    },
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "e6_burn_dmg",
            "source": "eidolon",
            "name": "悪い奴らはお仕置きだ",
            "description": "燃焼状態の敵に対するフックの与ダメージ+20%。",
            "stat": "DMG_ALL",
            "value": 0.2,
            "minEidolon": 6
        },
        {
            "id": "e1_enhanced_skill_dmg",
            "source": "eidolon",
            "name": "早寝早起きは健康的",
            "description": "強化後の戦闘スキルの与ダメージ+20%。",
            "defaultActive": false,
            "target": "single",
            "minEidolon": 1,
            "stat": "DMG_SKILL",
            "value": 0.2
        }
    ],
    "partyEffects": [],
    "enemyEffects": []
});
