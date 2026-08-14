import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Luka",
    "id": "luka",
    "name": "ルカ",
    "element": "Physical",
    "elementLabel": "物理",
    "path": "Nihility",
    "rarity": 4,
    "base": {
        "hp": 917,
        "atk": 582,
        "def": 485,
        "spd": 103
    },
    "maxEnergy": 130,
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
            "label": "防御力",
            "value": 0.125
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%83%AB%E3%82%AB",
        "version": "1.2"
    },
    "skills": {
        "basic": {
            "name": "裂地拳",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にルカの攻撃力X%分の物理ダメージを与える。",
            "levelColumns": [
                "裂地拳",
                "裂地砕天拳"
            ],
            "levels": [
                {
                    "atk": 0.5,
                    "atkAlt2": 0.1
                },
                {
                    "atk": 0.6,
                    "atkAlt2": 0.12
                },
                {
                    "atk": 0.7,
                    "atkAlt2": 0.14
                },
                {
                    "atk": 0.8,
                    "atkAlt2": 0.16
                },
                {
                    "atk": 0.9,
                    "atkAlt2": 0.18
                },
                {
                    "atk": 1,
                    "atkAlt2": 0.2
                },
                {
                    "atk": 1.1,
                    "atkAlt2": 0.22
                }
            ]
        },
        "skill": {
            "name": "裂創拳",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にルカの攻撃力X%分の物理ダメージを与え、100%の基礎確率で敵を裂創状態にする、3ターン継続。裂創状態の敵はターンが回ってくるたびに、自身の最大HP24.0%分の物理持続ダメージを受ける。このダメージは最大でルカの攻撃力Y%を超えない。",
            "levelColumns": [
                "単体ダメージ倍率(X%)",
                "裂創ダメージ上限(Y%)"
            ],
            "levels": [
                {
                    "hpPct": 0.6,
                    "hpPct2": 1.3
                },
                {
                    "hpPct": 0.66,
                    "hpPct2": 1.43
                },
                {
                    "hpPct": 0.72,
                    "hpPct2": 1.56
                },
                {
                    "hpPct": 0.78,
                    "hpPct2": 1.69
                },
                {
                    "hpPct": 0.84,
                    "hpPct2": 1.82
                },
                {
                    "hpPct": 0.9,
                    "hpPct2": 2.01
                },
                {
                    "hpPct": 0.97,
                    "hpPct2": 2.27
                },
                {
                    "hpPct": 1.05,
                    "hpPct2": 2.6
                },
                {
                    "hpPct": 1.12,
                    "hpPct2": 2.99
                },
                {
                    "hpPct": 1.2,
                    "hpPct2": 3.38
                },
                {
                    "hpPct": 1.26,
                    "hpPct2": 3.54
                },
                {
                    "hpPct": 1.32,
                    "hpPct2": 3.71
                }
            ]
        },
        "ult": {
            "name": "勝利の一撃",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]「闘志」を2層獲得し、100％の基礎確率で指定した敵単体の被ダメージ+X%、3ターン継続。その後、指定した敵単体にルカの攻撃力Y%分の物理ダメージを与える。",
            "levelColumns": [
                "被ダメージアップ(X%)",
                "単体ダメージ倍率(Y%)",
                "消費EP"
            ],
            "levels": [
                {
                    "dmgTaken": 0.12,
                    "atk": 1.98,
                    "energyCost": 130
                },
                {
                    "dmgTaken": 0.128,
                    "atk": 2.11
                },
                {
                    "dmgTaken": 0.136,
                    "atk": 2.24
                },
                {
                    "dmgTaken": 0.144,
                    "atk": 2.37
                },
                {
                    "dmgTaken": 0.152,
                    "atk": 2.5
                },
                {
                    "dmgTaken": 0.16,
                    "atk": 2.64
                },
                {
                    "dmgTaken": 0.17,
                    "atk": 2.8
                },
                {
                    "dmgTaken": 0.18,
                    "atk": 2.97
                },
                {
                    "dmgTaken": 0.19,
                    "atk": 3.13
                },
                {
                    "dmgTaken": 0.2,
                    "atk": 3.3
                },
                {
                    "dmgTaken": 0.208,
                    "atk": 3.43
                },
                {
                    "dmgTaken": 0.216,
                    "atk": 3.56
                }
            ]
        },
        "talent": {
            "name": "飛び散る火花",
            "sourceHeader": "天賦",
            "type": "buff",
            "target": "single",
            "description": "[強化]ルカが通常攻撃「裂地拳」または戦闘スキル「裂創拳」を発動した後、「闘志」を1層獲得する。「闘志」は最大で4層累積できる。「闘志」が2層以上の時、通常攻撃「裂地拳」が「裂地砕天拳」に強化される。強化通常攻撃の「砕天拳」が裂創状態の敵に命中した後、その敵に付与された裂創状態が、本来のダメージX%分のダメージを発生する。戦闘開始時、ルカは「闘志」を1層獲得する。",
            "levelColumns": [
                "触発ダメージ倍率(X%)"
            ],
            "levels": [
                {
                    "atk": 0.68
                },
                {
                    "atk": 0.69
                },
                {
                    "atk": 0.71
                },
                {
                    "atk": 0.73
                },
                {
                    "atk": 0.74
                },
                {
                    "atk": 0.76
                },
                {
                    "atk": 0.78
                },
                {
                    "atk": 0.8
                },
                {
                    "atk": 0.82
                },
                {
                    "atk": 0.85
                },
                {
                    "atk": 0.86
                },
                {
                    "atk": 0.88
                }
            ]
        },
        "technique": {
            "name": "先を行く者",
            "sourceHeader": "秘技",
            "type": "support",
            "target": "single",
            "description": "敵を攻撃。戦闘に入った後、ランダムな敵単体にルカの攻撃力50%分の物理ダメージを与え、100%の基礎確率でその敵を、戦闘スキルが与えるものと同じ裂創状態にする。その後、ルカは「闘志」をさらに1層獲得する。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "オーバーロード戦闘スキルを発動した時、敵のバフを1つ解除する。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "循環制動「闘志」を1層獲得するたび、さらにEPを3回復する。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "闘志粉砕強化通常攻撃を行った時、1段の「裂地拳」ごとに、50%の固定確率でルカが「裂地拳」をさらに1段行う。追加能力「闘志粉砕」によって行われた「裂地拳」では、この効果は発動しない。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "止まぬ争い",
            "description": "ルカが行動する時、指定した敵が裂創状態の場合、ルカの与ダメージ+15%、2ターン継続。"
        },
        "2": {
            "name": "オレが強い",
            "description": "物理の弱点がある敵に戦闘スキルが命中した場合、「闘志」を1層獲得する。"
        },
        "3": {
            "name": "リングに立つために生まれた男",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "4": {
            "name": "不撓不屈",
            "description": "「闘志」を1層獲得するごとに、攻撃力+5%。この効果は最大で4層累積できる。"
        },
        "5": {
            "name": "地炎魂",
            "description": "必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "6": {
            "name": "チャンピオンに相応しい喝采",
            "description": "強化通常攻撃の「砕天拳」が裂創状態の敵に命中した後、その回の攻撃で「裂地拳」を1段行ったごとに、敵に付与された裂創状態が、さらに本来のダメージ8%分のダメージを1回発生する。"
        }
    },
    "partyEffects": [
        {
            "id": "ult_dmg_taken_mirror",
            "source": "ult",
            "name": "勝利の一撃 (火力計算用)",
            "description": "[単体攻撃]「闘志」を2層獲得し、100％の基礎確率で指定した敵単体の被ダメージ+X%、3ターン継続。その後、指定した敵単体にルカの攻撃力Y%分の物理ダメージを与える。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "single",
            "duration": 3,
            "fromLevel": "ult",
            "stat": "DMG_TAKEN",
            "statField": "dmgTaken"
        }
    ],
    "enemyEffects": [
        {
            "id": "ult_dmg_taken",
            "source": "ult",
            "name": "勝利の一撃",
            "description": "[単体攻撃]「闘志」を2層獲得し、100％の基礎確率で指定した敵単体の被ダメージ+X%、3ターン継続。その後、指定した敵単体にルカの攻撃力Y%分の物理ダメージを与える。",
            "defaultActive": false,
            "target": "single",
            "duration": 3,
            "fromLevel": "ult",
            "stat": "DMG_TAKEN",
            "statField": "dmgTaken"
        }
    ],
    "selfEffects": [
        {
            "id": "e1_bleed_target_dmg",
            "source": "eidolon",
            "name": "止まぬ争い",
            "description": "ルカが行動する時、指定した敵が裂創状態の場合、ルカの与ダメージ+15%、2ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "minEidolon": 1,
            "stat": "DMG_ALL",
            "value": 0.15
        },
        {
            "id": "e4_fighting_will_atk",
            "source": "eidolon",
            "name": "不撓不屈",
            "description": "「闘志」を1層獲得するごとに、攻撃力+5%。最大4層。",
            "defaultActive": false,
            "target": "single",
            "minEidolon": 4,
            "stat": "ATK_PERCENT",
            "value": 0.05,
            "stackable": {
                "max": 4,
                "default": 4
            }
        }
    ]
});
