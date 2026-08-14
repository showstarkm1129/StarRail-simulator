import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Jade",
    "id": "jade",
    "name": "ジェイド",
    "element": "Quantum",
    "elementLabel": "量子",
    "path": "Erudition",
    "rarity": 5,
    "base": {
        "hp": 1086,
        "atk": 659,
        "def": 509,
        "spd": 103
    },
    "maxEnergy": 140,
    "traceBonuses": [
        {
            "label": "量子ダメージ",
            "value": 0.224
        },
        {
            "label": "攻撃力",
            "value": 0.18
        },
        {
            "label": "効果抵抗",
            "value": 0.1
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%82%B8%E3%82%A7%E3%82%A4%E3%83%89",
        "version": "2.3"
    },
    "skills": {
        "basic": {
            "name": "むしり取る鞭打ち",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "blast",
            "description": "[拡散攻撃]指定した敵単体にジェイドの攻撃力X%分の量子属性ダメージを与え、隣接する敵にジェイドの攻撃力Y%分の量子属性ダメージを与える。",
            "levelColumns": [
                "ダメージ倍率(X％)",
                "ダメージ倍率(Y％)"
            ],
            "levels": [
                {
                    "atk": 0.45,
                    "atk2": 0.15
                },
                {
                    "atk": 0.54,
                    "atk2": 0.18
                },
                {
                    "atk": 0.63,
                    "atk2": 0.21
                },
                {
                    "atk": 0.72,
                    "atk2": 0.24
                },
                {
                    "atk": 0.81,
                    "atk2": 0.27
                },
                {
                    "atk": 0.9,
                    "atk2": 0.3
                },
                {
                    "atk": 0.99,
                    "atk2": 0.33
                }
            ]
        },
        "skill": {
            "name": "ほしいままに飲み込む買収",
            "sourceHeader": "戦闘スキル",
            "type": "buff",
            "target": "single_ally",
            "description": "[サポート]指定した味方単体を「債権回収者」状態にし、その味方の速度+30、3ターン継続。「債権回収者」状態の味方単体が攻撃を行った後、命中した敵にジェイドの攻撃力X%分の量子属性付加ダメージを1回与え、その味方のHPを最大HP2%分消費する。残りHPが足りない場合、その味方の残りHPが1になる。ジェイドが「債権回収者」の時、ジェイドは速度アップ効果を獲得せず、攻撃を行った後にHPを消費しない。フィールド上に「債権回収者」状態の味方が存在する時、ジェイドは戦闘スキルを発動できない。ジェイドのターンが回ってくるたびに、「債権回収者」状態の継続時間-1ターン。",
            "levelColumns": [
                "ダメージ倍率(X%)"
            ],
            "levels": [
                {
                    "hpPct": 0.15
                },
                {
                    "hpPct": 0.16
                },
                {
                    "hpPct": 0.17
                },
                {
                    "hpPct": 0.18
                },
                {
                    "hpPct": 0.19
                },
                {
                    "hpPct": 0.2
                },
                {
                    "hpPct": 0.21
                },
                {
                    "hpPct": 0.22
                },
                {
                    "hpPct": 0.23
                },
                {
                    "hpPct": 0.25
                },
                {
                    "hpPct": 0.26
                },
                {
                    "hpPct": 0.27
                }
            ],
            "inferredNotes": [
                "Lv.11 hpPct は前後Lvから線形補完"
            ]
        },
        "ult": {
            "name": "欲望の淵での地獄の契り",
            "sourceHeader": "必殺技",
            "type": "follow_up",
            "target": "all",
            "description": "[全体攻撃]敵全体にジェイドの攻撃力X%分の量子属性ダメージを与える。ジェイドの天賦の追加攻撃を強化し、追加攻撃のダメージ倍率+Y%、この強化追加攻撃は2回まで発動できる。",
            "levelColumns": [
                "ダメージ倍率(X%)",
                "ダメージ倍率アップ(Y%)",
                "消費EP"
            ],
            "levels": [
                {
                    "atk": 1.2,
                    "atk2": 0.4,
                    "energyCost": 140
                },
                {
                    "atk": 1.32,
                    "atk2": 0.44
                },
                {
                    "atk": 1.44,
                    "atk2": 0.48
                },
                {
                    "atk": 1.56,
                    "atk2": 0.52
                },
                {
                    "atk": 1.68,
                    "atk2": 0.56
                },
                {
                    "atk": 1.8,
                    "atk2": 0.6
                },
                {
                    "atk": 1.95,
                    "atk2": 0.65
                },
                {
                    "atk": 2.1,
                    "atk2": 0.7
                },
                {
                    "atk": 2.25,
                    "atk2": 0.75
                },
                {
                    "atk": 2.4,
                    "atk2": 0.8
                },
                {
                    "atk": 2.52,
                    "atk2": 0.84
                },
                {
                    "atk": 2.64,
                    "atk2": 0.88
                }
            ],
            "inferredNotes": [
                "Lv.11 atk は前後Lvから線形補完",
                "Lv.11 atk2 は前後Lvから線形補完"
            ]
        },
        "talent": {
            "name": "富を削ぐ毒牙",
            "sourceHeader": "天賦",
            "type": "follow_up",
            "target": "all",
            "description": "[全体攻撃]ジェイドまたは「債権回収者」状態の味方が攻撃を行った後、命中した敵1体につき、チャージを1獲得する。チャージが8に到達した後、チャージを8消費して追加攻撃を1回行い、敵全体にジェイドの攻撃力X%分の量子属性ダメージを与える。この追加攻撃はチャージを獲得しない。ジェイドが天賦の追加攻撃を行う時、即座に「質草」を5層獲得する。「質草」1層につき、会心ダメージ+Y%、最大で50層累積できる。",
            "levelColumns": [
                "ダメージ倍率(X%)",
                "会心ダメージアップ(Y%)"
            ],
            "levels": [
                {
                    "atk": 0.6,
                    "cdBuff": 0.012
                },
                {
                    "atk": 0.66,
                    "cdBuff": 0.013
                },
                {
                    "atk": 0.72,
                    "cdBuff": 0.014
                },
                {
                    "atk": 0.78,
                    "cdBuff": 0.015
                },
                {
                    "atk": 0.84,
                    "cdBuff": 0.016
                },
                {
                    "atk": 0.9,
                    "cdBuff": 0.018
                },
                {
                    "atk": 0.97,
                    "cdBuff": 0.019
                },
                {
                    "atk": 1.05,
                    "cdBuff": 0.021
                },
                {
                    "atk": 1.12,
                    "cdBuff": 0.022
                },
                {
                    "atk": 1.2,
                    "cdBuff": 0.024
                },
                {
                    "atk": 1.26,
                    "cdBuff": 0.025
                },
                {
                    "atk": 1.32,
                    "cdBuff": 0.026
                }
            ],
            "inferredNotes": [
                "Lv.11 atk は前後Lvから線形補完",
                "Lv.11 cdBuff は前後Lvから線形補完"
            ]
        },
        "technique": {
            "name": "ハンターの視界",
            "sourceHeader": "秘技",
            "type": "debuff",
            "target": "all",
            "description": "[妨害]秘技を使用した後、一定範囲内の敵を10秒間の「盲従」状態にする。「盲従」状態の敵は味方を攻撃しない。「盲従」状態の敵を先制攻撃すると、すべての「盲従」状態の敵と戦闘に入る。戦闘開始後、敵全体にジェイドの攻撃力50%分の量子属性ダメージを与え、「質草」を15層獲得する。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "リバースレポ敵が戦闘に入るとき、ジェイドは「質草」を1層獲得する。「債権回収者」状態の味方のターンが回ってくるとき、ジェイドは「質草」を3層獲得する。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "質札戦闘開始時、ジェイドの行動順が50%早まる。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "流れ者「質草」1層につき、ジェイドの攻撃力+0.5%。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "無私？それは交渉次第",
            "description": "ジェイドの天賦による追加攻撃ダメージ+32%。「債権回収者」状態の味方キャラが攻撃を行い、命中した敵の数が2体/1体の時、ジェイドはチャージを追加で1/2獲得する。"
        },
        "2": {
            "name": "道徳？謹んで捺印",
            "description": "「質草」が15層以上の時、ジェイドの会心率+18%。"
        },
        "3": {
            "name": "率直？質入れを待つのみ",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "4": {
            "name": "誠実？契約に従っただけ",
            "description": "必殺技を発動する時、ジェイドの与えるダメージが敵の防御力を12%無視する、3ターン継続。"
        },
        "5": {
            "name": "希望？すでに売り渡し済み",
            "description": "必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "6": {
            "name": "公平？なおも担保が必須",
            "description": "フィールド上に「債権回収者」状態のキャラがいる時、ジェイドの量子属性耐性貫通+20％。同時にジェイドも「債権回収者」状態を獲得する。"
        }
    },
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "talent_crit_dmg",
            "source": "talent",
            "name": "富を削ぐ毒牙",
            "description": "[全体攻撃]ジェイドまたは「債権回収者」状態の味方が攻撃を行った後、命中した敵1体につき、チャージを1獲得する。チャージが8に到達した後、チャージを8消費して追加攻撃を1回行い、敵全体にジェイドの攻撃力X%分の量子属性ダメージを与える。この追加攻撃はチャージを獲得しない。ジェイドが天賦の追加攻撃を行う時、即座に「質草」を5層獲得する。「質草」1層につき、会心ダメージ+Y%、最大で50層累積できる。",
            "fromLevel": "talent",
            "stat": "CRIT_DMG",
            "statField": "cdBuff",
            "stackable": {
                "max": 50,
                "default": 50
            }
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "extra6_atk_percent",
            "source": "extra",
            "name": "昇格6",
            "description": "流れ者「質草」1層につき、ジェイドの攻撃力+0.5%。",
            "stat": "ATK_PERCENT",
            "value": 0.005,
            "stackable": {
                "max": 50,
                "default": 50
            }
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e2_crit_rate",
            "source": "eidolon",
            "name": "道徳？謹んで捺印",
            "description": "「質草」が15層以上の時、ジェイドの会心率+18%。",
            "stat": "CRIT_RATE",
            "value": 0.18,
            "minEidolon": 2
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e4_def_ignore",
            "source": "eidolon",
            "name": "誠実？契約に従っただけ",
            "description": "必殺技を発動する時、ジェイドの与えるダメージが敵の防御力を12%無視する、3ターン継続。",
            "stat": "DEF_IGNORE",
            "value": 0.12,
            "minEidolon": 4,
            "duration": 3
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e6_quantum_res_pen",
            "source": "eidolon",
            "name": "公平？なおも担保が必須",
            "description": "フィールド上に「債権回収者」状態のキャラがいる時、ジェイドの量子属性耐性貫通+20％。同時にジェイドも「債権回収者」状態を獲得する。",
            "stat": "RES_PEN",
            "value": 0.2,
            "minEidolon": 6
        },
        {
            "id": "e1_followup_dmg",
            "source": "eidolon",
            "name": "無私？それは交渉次第",
            "description": "ジェイドの天賦による追加攻撃ダメージ+32%。",
            "defaultActive": false,
            "target": "single",
            "minEidolon": 1,
            "stat": "DMG_FOLLOWUP",
            "value": 0.32
        }
    ],
    "partyEffects": [
        {
            "id": "skill_debt_collector_spd",
            "source": "skill",
            "name": "ほしいままに飲み込む買収",
            "description": "指定した味方単体を「債権回収者」状態にし、その味方の速度+30、3ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 3,
            "stat": "SPD_FLAT",
            "value": 30
        }
    ],
    "enemyEffects": []
});
