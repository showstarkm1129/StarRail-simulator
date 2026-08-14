import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Pela",
    "id": "pela",
    "name": "ペラ",
    "element": "Ice",
    "elementLabel": "氷",
    "path": "Nihility",
    "rarity": 4,
    "base": {
        "hp": 987,
        "atk": 546,
        "def": 463,
        "spd": 105
    },
    "maxEnergy": 110,
    "traceBonuses": [
        {
            "label": "氷ダメージ",
            "value": 0.224
        },
        {
            "label": "攻撃力",
            "value": 0.18
        },
        {
            "label": "効果命中",
            "value": 0.1
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%83%9A%E3%83%A9",
        "version": "1.0"
    },
    "skills": {
        "basic": {
            "name": "氷点狙撃",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にペラの攻撃力X%分の氷属性ダメージを与える。",
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
            "name": "低温妨害",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体のバフを1つ解除し、ペラの攻撃力X%分の氷属性ダメージを与える。",
            "levelColumns": [
                "ダメージ倍率(X％)"
            ],
            "levels": [
                {
                    "atk": 1.05
                },
                {
                    "atk": 1.15
                },
                {
                    "atk": 1.26
                },
                {
                    "atk": 1.36
                },
                {
                    "atk": 1.47
                },
                {
                    "atk": 1.57
                },
                {
                    "atk": 1.7
                },
                {
                    "atk": 1.83
                },
                {
                    "atk": 1.96
                },
                {
                    "atk": 2.1
                },
                {
                    "atk": 2.2
                },
                {
                    "atk": 2.31
                }
            ]
        },
        "ult": {
            "name": "領域制圧",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]100%の基礎確率で敵単体それぞれを「一般解」状態にし、敵全体にペラの攻撃力X%分の氷属性ダメージを与える。「一般解」状態の敵の防御力-Y%、2ターン継続。",
            "levelColumns": [
                "全体ダメージ倍率(X%)",
                "防御力デバフ(Y%)",
                "消費EP"
            ],
            "levels": [
                {
                    "defPct": 0.6,
                    "defBuff": 0.3,
                    "energyCost": 110
                },
                {
                    "defPct": 0.64,
                    "defBuff": 0.31
                },
                {
                    "defPct": 0.68,
                    "defBuff": 0.32
                },
                {
                    "defPct": 0.72,
                    "defBuff": 0.33
                },
                {
                    "defPct": 0.76,
                    "defBuff": 0.34
                },
                {
                    "defPct": 0.8,
                    "defBuff": 0.35
                },
                {
                    "defPct": 0.85,
                    "defBuff": 0.36
                },
                {
                    "defPct": 0.9,
                    "defBuff": 0.37
                },
                {
                    "defPct": 0.95,
                    "defBuff": 0.38
                },
                {
                    "defPct": 1,
                    "defBuff": 0.4
                },
                {
                    "defPct": 1.04,
                    "defBuff": 0.41
                },
                {
                    "defPct": 1.08,
                    "defBuff": 0.42
                }
            ]
        },
        "talent": {
            "name": "データ採取",
            "sourceHeader": "天賦",
            "type": "debuff",
            "target": "single",
            "description": "[サポート]攻撃を行った後、敵にデバフがある場合、ペラはさらにEPをX回復する。この効果は1回の攻撃で1回まで発動できる。",
            "levelColumns": [
                "EP回復量(X)"
            ],
            "levels": [
                {
                    "energyGain": 5
                },
                {
                    "energyGain": 5.5
                },
                {
                    "energyGain": 6
                },
                {
                    "energyGain": 6.5
                },
                {
                    "energyGain": 7
                },
                {
                    "energyGain": 7.5
                },
                {
                    "energyGain": 8.1
                },
                {
                    "energyGain": 8.8
                },
                {
                    "energyGain": 9.4
                },
                {
                    "energyGain": 10
                },
                {
                    "energyGain": 10.5
                },
                {
                    "energyGain": 11
                }
            ]
        },
        "technique": {
            "name": "先手必勝",
            "sourceHeader": "秘技",
            "type": "support",
            "target": "single",
            "description": "敵を攻撃。戦闘に入った後、ランダムな敵単体にペラの攻撃力80%分の氷属性ダメージを与え、100%の基礎確率で敵単体それぞれの防御力-20%、2ターン継続。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "痛撃デバフ状態の敵に対して与ダメージ+20%。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "秘策ペラがフィールド上にいる時、味方全体の効果命中+10%。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "追撃殲滅戦闘スキルを発動してバフを解除した時、次の攻撃の与ダメージ+20%。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "勝利のフィードバック",
            "description": "敵が倒された時、ペラはEPを5回復する。"
        },
        "2": {
            "name": "止まぬ行進",
            "description": "戦闘スキルを発動してバフを解除する時、速度+10%、2ターン継続。"
        },
        "3": {
            "name": "制圧エスカレート",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "完全解析",
            "description": "戦闘スキルを発動した時、100%の基礎確率で敵の氷属性耐性-12%、2ターン継続。"
        },
        "5": {
            "name": "零度妨害",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "疲弱追撃",
            "description": "攻撃を行った後、敵がデバフ状態の場合、ペラの攻撃力40%分の氷属性付加ダメージを与える。"
        }
    },
    "partyEffects": [
        {
            "id": "ult_def_down_mirror",
            "source": "ult",
            "name": "領域制圧 (火力計算用)",
            "description": "[全体攻撃]100%の基礎確率で敵単体それぞれを「一般解」状態にし、敵全体にペラの攻撃力X%分の氷属性ダメージを与える。「一般解」状態の敵の防御力-Y%、2ターン継続。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "all",
            "duration": 2,
            "fromLevel": "ult",
            "stat": "DEF_DOWN",
            "statField": "defBuff"
        },
        {
            "id": "technique_def_down_mirror",
            "source": "technique",
            "name": "先手必勝 (火力計算用)",
            "description": "敵を攻撃。戦闘に入った後、ランダムな敵単体にペラの攻撃力80%分の氷属性ダメージを与え、100%の基礎確率で敵単体それぞれの防御力-20%、2ターン継続。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "stat": "DEF_DOWN",
            "value": 0.2
        },
        {
            "id": "e4_res_down_mirror",
            "source": "eidolon",
            "name": "完全解析 (火力計算用)",
            "description": "戦闘スキルを発動した時、100%の基礎確率で敵の氷属性耐性-12%、2ターン継続。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "minEidolon": 4,
            "stat": "RES_PEN",
            "value": 0.12
        },
        {
            "id": "extra4_party_ehr",
            "source": "extra",
            "name": "昇格4",
            "description": "ペラがフィールド上にいる時、味方全体の効果命中+10%。",
            "defaultActive": false,
            "target": "all",
            "duration": "conditional",
            "stat": "EFFECT_HIT_RATE",
            "value": 0.1
        }
    ],
    "enemyEffects": [
        {
            "id": "ult_def_down",
            "source": "ult",
            "name": "領域制圧",
            "description": "[全体攻撃]100%の基礎確率で敵単体それぞれを「一般解」状態にし、敵全体にペラの攻撃力X%分の氷属性ダメージを与える。「一般解」状態の敵の防御力-Y%、2ターン継続。",
            "defaultActive": false,
            "target": "all",
            "duration": 2,
            "fromLevel": "ult",
            "stat": "DEF_DOWN",
            "statField": "defBuff"
        },
        {
            "id": "technique_def_down",
            "source": "technique",
            "name": "先手必勝",
            "description": "敵を攻撃。戦闘に入った後、ランダムな敵単体にペラの攻撃力80%分の氷属性ダメージを与え、100%の基礎確率で敵単体それぞれの防御力-20%、2ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "stat": "DEF_DOWN",
            "value": 0.2
        },
        {
            "id": "e4_res_down",
            "source": "eidolon",
            "name": "完全解析",
            "description": "戦闘スキルを発動した時、100%の基礎確率で敵の氷属性耐性-12%、2ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "minEidolon": 4,
            "stat": "RES_PEN",
            "value": 0.12
        }
    ],
    "selfEffects": [
        {
            "id": "extra2_debuff_dmg",
            "source": "extra",
            "name": "昇格2",
            "description": "デバフ状態の敵に対して与ダメージ+20%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "stat": "DMG_ALL",
            "value": 0.2
        },
        {
            "id": "extra6_after_dispel_dmg",
            "source": "extra",
            "name": "昇格6",
            "description": "戦闘スキルを発動してバフを解除した時、次の攻撃の与ダメージ+20%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "stat": "DMG_ALL",
            "value": 0.2
        },
        {
            "id": "e2_dispel_spd",
            "source": "eidolon",
            "name": "止まぬ行進",
            "description": "戦闘スキルを発動してバフを解除する時、速度+10%、2ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "minEidolon": 2,
            "stat": "SPD_PERCENT",
            "value": 0.1
        }
    ]
});
