import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Jiaoqiu",
    "id": "jiaoqiu",
    "name": "椒丘",
    "element": "Fire",
    "elementLabel": "炎",
    "path": "Nihility",
    "rarity": 5,
    "base": {
        "hp": 1358,
        "atk": 601,
        "def": 509,
        "spd": 98
    },
    "maxEnergy": 100,
    "traceBonuses": [
        {
            "label": "効果命中",
            "value": 0.28
        },
        {
            "label": "炎ダメージ",
            "value": 0.144
        },
        {
            "label": "速度",
            "value": 5
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E6%A4%92%E4%B8%98",
        "version": "2.4"
    },
    "skills": {
        "basic": {
            "name": "心火計",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に椒丘の攻撃力X%分の炎属性ダメージを与える。",
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
            "name": "燎原奔襲",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "blast",
            "description": "[拡散攻撃]指定した敵単体に椒丘の攻撃力X%分の炎属性ダメージを与え、隣接する敵に椒丘の攻撃力Y%分の炎属性ダメージを与える。100%の基礎確率で指定した敵単体に「焼尽」を1層付与する。",
            "levelColumns": [
                "単体ダメージ倍率(X%)",
                "隣接ダメージ倍率(Y%)"
            ],
            "levels": [
                {
                    "atk": 0.75,
                    "atkAdjacent": 0.45
                },
                {
                    "atk": 0.82,
                    "atkAdjacent": 0.49
                },
                {
                    "atk": 0.9,
                    "atkAdjacent": 0.54
                },
                {
                    "atk": 0.97,
                    "atkAdjacent": 0.58
                },
                {
                    "atk": 1.05,
                    "atkAdjacent": 0.63
                },
                {
                    "atk": 1.12,
                    "atkAdjacent": 0.67
                },
                {
                    "atk": 1.21,
                    "atkAdjacent": 0.73
                },
                {
                    "atk": 1.306667,
                    "atkAdjacent": 0.786667
                },
                {
                    "atk": 1.403334,
                    "atkAdjacent": 0.843333
                },
                {
                    "atk": 1.5,
                    "atkAdjacent": 0.9
                },
                {
                    "atk": 1.6,
                    "atkAdjacent": 0.96
                },
                {
                    "atk": 1.7,
                    "atkAdjacent": 1.02
                }
            ],
            "inferredNotes": [
                "Lv.8 atk は前後Lvから線形補完",
                "Lv.9 atk は前後Lvから線形補完",
                "Lv.8 atkAdjacent は前後Lvから線形補完",
                "Lv.9 atkAdjacent は前後Lvから線形補完"
            ]
        },
        "ult": {
            "name": "炊陣妙法、詭正相生",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]敵それぞれにある「焼尽」状態の層数を、フィールド上で最高層数の「焼尽」状態の層数と同じにする。その後、結界を展開し、敵全体に椒丘の攻撃力X%分の炎属性ダメージを与える。結界が展開されている間、敵の受ける必殺技ダメージ+Y%。敵が行動する時、Z%の基礎確率で「焼尽」状態を1層付与される。この効果は結界が展開されている間、6回まで発動でき、敵それぞれにつき、その敵のターンが回ってくるたびに1回まで発動できる。椒丘が必殺技を発動するたびに、この効果の発動可能回数がリセットされる。結界は3ターン継続する。椒丘のターンが回ってくるたびに結界の継続時間-1ターン。椒丘が戦闘不能状態になった時、結界は解除される。",
            "levelColumns": [
                "全体ダメージ倍率(X%)",
                "敵の受ける必殺技ダメージアップ(Y%)",
                "基礎確率(Z%)",
                "消費EP"
            ],
            "levels": [
                {
                    "atkAll": 0.6,
                    "atk": 0.09,
                    "atkAlt3": 0.5,
                    "energyCost": 100
                },
                {
                    "atkAll": 0.64,
                    "atk": 0.096,
                    "atkAlt3": 0.51
                },
                {
                    "atkAll": 0.68,
                    "atk": 0.102,
                    "atkAlt3": 0.52
                },
                {
                    "atkAll": 0.72,
                    "atk": 0.108,
                    "atkAlt3": 0.53
                },
                {
                    "atkAll": 0.76,
                    "atk": 0.114,
                    "atkAlt3": 0.54
                },
                {
                    "atkAll": 0.8,
                    "atk": 0.12,
                    "atkAlt3": 0.55
                },
                {
                    "atkAll": 0.85,
                    "atk": 0.127,
                    "atkAlt3": 0.56
                },
                {
                    "atkAll": 0.9,
                    "atk": 0.135,
                    "atkAlt3": 0.57
                },
                {
                    "atkAll": 0.95,
                    "atk": 0.142,
                    "atkAlt3": 0.58
                },
                {
                    "atkAll": 1,
                    "atk": 0.15,
                    "atkAlt3": 0.6
                },
                {
                    "atkAll": 1.05,
                    "atk": 0.158,
                    "atkAlt3": 0.62
                },
                {
                    "atkAll": 1.1,
                    "atk": 0.165,
                    "atkAlt3": 0.64
                }
            ]
        },
        "talent": {
            "name": "詭正転変、至微精妙",
            "sourceHeader": "天賦",
            "type": "debuff",
            "target": "single",
            "description": "[妨害]椒丘の通常攻撃、戦闘スキルまたは必殺技が敵に命中した時、100%の基礎確率でその敵に「焼尽」状態を1層付与する。「焼尽」状態は最大で5層蓄積でき、2ターン継続する。「焼尽」状態が1層の時、敵の受けるダメージ+X%。2層目から、「焼尽」状態1層につき、敵の受けるダメージ+Y%。「焼尽」状態にある敵は、燃焼状態と見なされ、ターンが回ってくるたびに、椒丘の攻撃力Z%分の炎属性持続ダメージを受ける。",
            "levelColumns": [
                "敵の受けるダメージ",
                "炎属性持続ダメージ(Z%)"
            ],
            "levels": [
                {
                    "atk": 0.075,
                    "dotAtk": 0.025
                },
                {
                    "atk": 0.082,
                    "dotAtk": 0.027
                },
                {
                    "atk": 0.09,
                    "dotAtk": 0.03
                },
                {
                    "atk": 0.097,
                    "dotAtk": 0.032
                },
                {
                    "atk": 0.105,
                    "dotAtk": 0.035
                },
                {
                    "atk": 0.112,
                    "dotAtk": 0.037
                },
                {
                    "atk": 0.121,
                    "dotAtk": 0.04
                },
                {
                    "atk": 0.131,
                    "dotAtk": 0.043
                },
                {
                    "atk": 0.14,
                    "dotAtk": 0.046
                },
                {
                    "atk": 0.15,
                    "dotAtk": 0.05
                },
                {
                    "atk": 0.158,
                    "dotAtk": 0.053
                },
                {
                    "atk": 0.165,
                    "dotAtk": 0.055
                }
            ]
        },
        "technique": {
            "name": "旺火却乱",
            "sourceHeader": "秘技",
            "type": "debuff",
            "target": "all",
            "description": "[妨害]秘技を使用した後、15秒間継続する特殊領域を作り出す。特殊領域内にいる敵と戦闘に入った後、敵全体に椒丘の攻撃力100%分の炎属性ダメージを与え、100%の基礎確率で「焼尽」を1層付与する。味方が作り出した領域は1つまで存在できる。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "火祓い戦闘開始時、EPを15回復する。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "炊事椒丘の効果命中が80%を超えた時、超過した効果命中15%につき、攻撃力+60%、最大で+240%。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "炙香結界が展開されている間、敵が戦闘に入る際に「焼尽」状態が付与される。付与される「焼尽」状態の層数は、結界展開中に最高層数の「焼尽」状態の敵の層数と同じ。最低で1層付与される。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "五味五臓",
            "description": "「焼尽」状態の敵に対する味方の与ダメージ+40%。天賦を発動して敵に「焼尽」状態を付与する時、さらにその回に付与する「焼尽」状態層数+1層。"
        },
        "2": {
            "name": "厚味、万病の元",
            "description": "敵が「焼尽」状態にある時、「焼尽」状態による炎属性持続ダメージの倍率+300%。"
        },
        "3": {
            "name": "和合の神髄",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "気血充溢",
            "description": "結界が展開されている間、敵の攻撃力-15%。"
        },
        "5": {
            "name": "巡らせる奇策",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv,15まで。"
        },
        "6": {
            "name": "九沸九変",
            "description": "敵が倒される時、その敵にある「焼尽」状態の層数が、フィールド上の「焼尽」状態層数が最も低い敵に移る。「焼尽」状態の累積上限が9層にアップする。「焼尽」1層につき、敵の全属性耐性-3%。"
        }
    },
    "partyEffects": [
        {
            "id": "e6_res_down_mirror",
            "source": "eidolon",
            "name": "九沸九変 (火力計算用)",
            "description": "敵が倒される時、その敵にある「焼尽」状態の層数が、フィールド上の「焼尽」状態層数が最も低い敵に移る。「焼尽」状態の累積上限が9層にアップする。「焼尽」1層につき、敵の全属性耐性-3%。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 6,
            "stat": "RES_PEN",
            "value": 0.03
        },
        {
            "id": "talent_ashen_roast_taken_mirror",
            "source": "talent",
            "name": "詭正転変、至微精妙 (火力計算用)",
            "description": "「焼尽」状態1層の時、敵の受けるダメージ+X%。2層目から1層につきさらに+Y%。現在はLv表のXを1層分として、追加層は同じ枠を重ねて手動調整する。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "fromLevel": "talent",
            "stat": "DMG_TAKEN",
            "statField": "atk",
            "stackable": {
                "max": 5,
                "default": 1
            }
        },
        {
            "id": "ult_ult_taken_mirror",
            "source": "ult",
            "name": "炊陣妙法、詭正相生 (火力計算用)",
            "description": "結界が展開されている間、敵の受ける必殺技ダメージ+Y%。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "all",
            "duration": 3,
            "fromLevel": "ult",
            "stat": "DMG_TAKEN_ULT",
            "statField": "atk"
        },
        {
            "id": "e1_ashen_roast_party_dmg",
            "source": "eidolon",
            "name": "五味五臓",
            "description": "「焼尽」状態の敵に対する味方の与ダメージ+40%。",
            "defaultActive": false,
            "target": "all",
            "duration": "conditional",
            "minEidolon": 1,
            "stat": "DMG_ALL",
            "value": 0.4
        }
    ],
    "enemyEffects": [
        {
            "id": "e6_res_down",
            "source": "eidolon",
            "name": "九沸九変",
            "description": "敵が倒される時、その敵にある「焼尽」状態の層数が、フィールド上の「焼尽」状態層数が最も低い敵に移る。「焼尽」状態の累積上限が9層にアップする。「焼尽」1層につき、敵の全属性耐性-3%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 6,
            "stat": "RES_PEN",
            "value": 0.03
        },
        {
            "id": "talent_ashen_roast_taken",
            "source": "talent",
            "name": "詭正転変、至微精妙",
            "description": "「焼尽」状態1層の時、敵の受けるダメージ+X%。2層目から1層につきさらに+Y%。現在はLv表のXを1層分として、追加層は同じ枠を重ねて手動調整する。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "fromLevel": "talent",
            "stat": "DMG_TAKEN",
            "statField": "atk",
            "stackable": {
                "max": 5,
                "default": 1
            }
        },
        {
            "id": "ult_ult_taken",
            "source": "ult",
            "name": "炊陣妙法、詭正相生",
            "description": "結界が展開されている間、敵の受ける必殺技ダメージ+Y%。",
            "defaultActive": false,
            "target": "all",
            "duration": 3,
            "fromLevel": "ult",
            "stat": "DMG_TAKEN_ULT",
            "statField": "atk"
        }
    ],
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "extra4_ehr_to_atk",
            "source": "extra",
            "name": "昇格4",
            "description": "炊事椒丘の効果命中が80%を超えた時、超過した効果命中15%につき、攻撃力+60%、最大で+240%。",
            "stat": "ATK_PERCENT",
            "compute": "casterDerivedExcessStepCap",
            "sourceStat": "ehr",
            "threshold": 0.8,
            "step": 0.15,
            "valuePerStep": 0.6,
            "cap": 2.4
        }
    ]
});
