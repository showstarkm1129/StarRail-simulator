import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Aglaea",
    "id": "aglaea",
    "name": "アグライア",
    "element": "Lightning",
    "elementLabel": "雷",
    "path": "Remembrance",
    "rarity": 5,
    "base": {
        "hp": 1241,
        "atk": 698,
        "def": 485,
        "spd": 102
    },
    "maxEnergy": 350,
    "traceBonuses": [
        {
            "label": "雷ダメージ",
            "value": 0.224
        },
        {
            "label": "会心率",
            "value": 0.12
        },
        {
            "label": "防御力",
            "value": 0.125
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%82%A2%E3%82%B0%E3%83%A9%E3%82%A4%E3%82%A2",
        "version": "3.0"
    },
    "skills": {
        "basic": {
            "name": "サイフォスの蜜",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にアグライアの攻撃力X%分の雷属性ダメージを与える。",
            "levelColumns": [
                "サイフォスの蜜",
                "剣先より千の口付けを"
            ],
            "levels": [
                {
                    "atk": 0.5,
                    "atkAlt2": 1
                },
                {
                    "atk": 0.6,
                    "atkAlt2": 1.2
                },
                {
                    "atk": 0.7,
                    "atkAlt2": 1.4
                },
                {
                    "atk": 0.8,
                    "atkAlt2": 1.6
                },
                {
                    "atk": 0.9,
                    "atkAlt2": 1.8
                },
                {
                    "atk": 1,
                    "atkAlt2": 2
                },
                {
                    "atk": 1.1,
                    "atkAlt2": 2.2
                }
            ]
        },
        "skill": {
            "name": "掲げよ、昇華せし名を",
            "sourceHeader": "戦闘スキル",
            "type": "heal",
            "target": "single",
            "description": "[召喚]「ラフトラ」のHPを最大HPX%分回復する。ラフトラがフィールド上にいない場合、記憶の精霊ラフトラを召喚し、自身が即座に行動する。",
            "levelColumns": [
                "HP回復(X%)"
            ],
            "levels": [
                {
                    "healPct": 0.25
                },
                {
                    "healPct": 0.273333
                },
                {
                    "healPct": 0.296666
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
                "Lv.2 healPct は前後Lvから線形補完",
                "Lv.3 healPct は前後Lvから線形補完",
                "Lv.11 healPct は前後Lvから線形補完"
            ]
        },
        "ult": {
            "name": "共に舞え、運命のラフトラ",
            "sourceHeader": "必殺技",
            "type": "debuff",
            "target": "single",
            "description": "[強化]記憶の精霊「ラフトラ」を召喚する。なお、ラフトラがすでにフィールド上にいる場合、そのHPを最大値まで回復する。アグライアは「至高の姿」状態に入り、即座に行動する。「至高の姿」状態のアグライアは速度アップ効果を獲得する。この速度アップ効果の層数は、ラフトラの精霊天賦による速度アップ効果の層数と同数になる。1層につき、自身の速度+X%。通常攻撃「サイフォスの蜜」が「剣先より千の口付けを」に強化され、戦闘スキルが発動できなくなる。また、ラフトラが行動制限系デバフに抵抗するようになる。アクションバーにカウントダウンが出現する。カウントダウンの速度は100に固定される。カウントダウンの間に必殺技を発動すると、カウントダウンがリセットされる。カウントダウンのターンが回ってきた時、ラフトラは退場し、アグライアは「至高の姿」状態を解除する。",
            "levelColumns": [
                "速度アップ(X%)",
                "消費EP"
            ],
            "levels": [
                {
                    "spdBuff": 0.1,
                    "energyCost": 350
                },
                {
                    "spdBuff": 0.105
                },
                {
                    "spdBuff": 0.11
                },
                {
                    "spdBuff": 0.115
                },
                {
                    "spdBuff": 0.12
                },
                {
                    "spdBuff": 0.125
                },
                {
                    "spdBuff": 0.131
                },
                {
                    "spdBuff": 0.138
                },
                {
                    "spdBuff": 0.144
                },
                {
                    "spdBuff": 0.15
                },
                {
                    "spdBuff": 0.155
                },
                {
                    "spdBuff": 0.16
                }
            ],
            "inferredNotes": [
                "Lv.11 spdBuff は前後Lvから線形補完"
            ]
        },
        "talent": {
            "name": "薔薇色の指先",
            "sourceHeader": "天賦",
            "type": "attack",
            "target": "single",
            "description": "[強化]記憶の精霊「ラフトラ」の初期速度は、アグライアの速度の35%分となり、初期最大HPは、アグライアの最大HPX%分+Yとなる。ラフトラがフィールド上にいる場合、アグライアが攻撃を行う時、敵に「隙を縫う糸」状態を付与する。また、「隙を縫う糸」状態の敵を攻撃した後、追加でアグライアの攻撃力Z%分の雷属性付加ダメージを与える。「隙を縫う糸」状態は最後に付与されたターゲットにのみ効果を発揮する。",
            "levelColumns": [
                "初期最大HP(X%+Y)",
                "付加ダメージ(Z%)"
            ],
            "levels": [
                {
                    "hpPct": 0.44,
                    "hpFlat": 180,
                    "hpPct2": 0.12
                },
                {
                    "hpPct": 0.46,
                    "hpFlat": 247,
                    "hpPct2": 0.13
                },
                {
                    "hpPct": 0.49,
                    "hpFlat": 315,
                    "hpPct2": 0.15
                },
                {
                    "hpPct": 0.52,
                    "hpFlat": 382,
                    "hpPct2": 0.17
                },
                {
                    "hpPct": 0.55,
                    "hpFlat": 450,
                    "hpPct2": 0.19
                },
                {
                    "hpPct": 0.57,
                    "hpFlat": 504,
                    "hpPct2": 0.21
                },
                {
                    "hpPct": 0.59,
                    "hpFlat": 558,
                    "hpPct2": 0.23
                },
                {
                    "hpPct": 0.61,
                    "hpFlat": 612,
                    "hpPct2": 0.25
                },
                {
                    "hpPct": 0.63,
                    "hpFlat": 666,
                    "hpPct2": 0.27
                },
                {
                    "hpPct": 0.66,
                    "hpFlat": 720,
                    "hpPct2": 0.3
                },
                {
                    "hpPct": 0.68,
                    "hpFlat": 774,
                    "hpPct2": 0.315
                },
                {
                    "hpPct": 0.7,
                    "hpFlat": 828,
                    "hpPct2": 0.33
                }
            ],
            "inferredNotes": [
                "Lv.11 hpPct は前後Lvから線形補完",
                "Lv.11 hpFlat は前後Lvから線形補完",
                "Lv.11 hpPct2 は前後Lvから線形補完"
            ]
        },
        "memorySkill": {
            "name": "サイフォスの罠",
            "sourceHeader": "精霊スキル",
            "type": "attack",
            "target": "blast",
            "description": "[拡散攻撃]敵単体に攻撃力X%分の雷属性ダメージを与え、隣接する敵に攻撃力Y%分の雷属性ダメージを与える。",
            "levelColumns": [
                "単体ダメージ倍率(X%)",
                "隣接ダメージ倍率(Y%)"
            ],
            "levels": [
                {
                    "atk": 0.55,
                    "atkAdjacent": 0.33
                },
                {
                    "atk": 0.66,
                    "atkAdjacent": 0.39
                },
                {
                    "atk": 0.77,
                    "atkAdjacent": 0.46
                },
                {
                    "atk": 0.88,
                    "atkAdjacent": 0.52
                },
                {
                    "atk": 0.99,
                    "atkAdjacent": 0.59
                },
                {
                    "atk": 1.1,
                    "atkAdjacent": 0.66
                },
                {
                    "atk": 1.21,
                    "atkAdjacent": 0.72
                }
            ]
        },
        "memoryTalent": {
            "name": "涙で鍛えし匠の躯",
            "sourceHeader": "精霊天賦",
            "type": "buff",
            "target": "single",
            "description": "[強化]「隙を縫う糸」状態の敵を攻撃した後、自身の速度+X。この効果は最大で6層累積できる。「ラフトラ」は行動時に自動で「サイフォスの罠」を発動し、「隙を縫う糸」状態の敵を優先的に攻撃する。",
            "levelColumns": [
                "速度(X)"
            ],
            "levels": [
                {
                    "spdFlat": 44
                },
                {
                    "spdFlat": 46
                },
                {
                    "spdFlat": 48
                },
                {
                    "spdFlat": 50
                },
                {
                    "spdFlat": 52
                },
                {
                    "spdFlat": 55
                },
                {
                    "spdFlat": 57
                }
            ]
        },
        "technique": {
            "name": "星を纏いし烈剣",
            "sourceHeader": "秘技",
            "type": "heal",
            "target": "all",
            "description": "記憶の精霊「ラフトラ」を召喚し、共に攻撃する。戦闘に入った後、EPを30回復し、敵全体にアグライアの攻撃力100%分の雷属性ダメージを与え、ランダムな敵に「隙を縫う糸」状態を付与する。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "短見への裁き「至高の姿」状態の時、アグライアおよび「ラフトラ」の攻撃力が、アグライアの速度720%分+ラフトラの速度360%分アップする。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "最後の織運「ラフトラ」が退場する時、精霊天賦の速度アップ効果の層数を最大で1層まで保持する。ラフトラが再度召喚された時、保持していた層数分の速度アップ効果を獲得する。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "刹那の陽光戦闘開始時、自身のEPが50%未満の場合、EPを50%まで回復する。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "金の星の軌道を漂って",
            "description": "「隙を縫う糸」状態の敵の受けるダメージ+15%。アグライアまたは「ラフトラ」が「隙を縫う糸」状態の敵を攻撃した後、さらにEPを20回復する。"
        },
        "2": {
            "name": "運命の瞼を行く舟",
            "description": "アグライアまたは「ラフトラ」が行動する時、アグライアとラフトラの与えるダメージが敵の防御力を14%無視する。この効果は最大で3層累積でき、アグライアとラフトラ以外の任意のユニットがスキルを発動する時まで継続する。"
        },
        "3": {
            "name": "華麗な露の賜物",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。精霊天賦のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "大理石の内なる輝き",
            "description": "精霊天賦の速度アップ効果の累積上限+1層。「ラフトラ」はアグライアが攻撃を行った後にも、精霊天賦の速度アップ効果を獲得できる。"
        },
        "5": {
            "name": "漆黒の苦難の織り手",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。精霊スキルのLv.+1、最大Lv.10まで。"
        },
        "6": {
            "name": "空虚で無常なる金糸",
            "description": "アグライアが「至高の姿」状態の時、自身と「ラフトラ」の雷属性耐性貫通+20%。この状態中、アグライアの速度が160/240/320を超える時、自身の連携攻撃ダメージ+10%/30%/60%。さらに、ラフトラの速度が160/240/320を超える時、自身の連携攻撃ダメージ+10%/30%/60%。"
        }
    },
    "partyEffects": [
        {
            "id": "e1_dmg_taken_mirror",
            "source": "eidolon",
            "name": "金の星の軌道を漂って (火力計算用)",
            "description": "「隙を縫う糸」状態の敵の受けるダメージ+15%。アグライアまたは「ラフトラ」が「隙を縫う糸」状態の敵を攻撃した後、さらにEPを20回復する。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 1,
            "stat": "DMG_TAKEN",
            "value": 0.15
        }
    ],
    "enemyEffects": [
        {
            "id": "e1_dmg_taken",
            "source": "eidolon",
            "name": "金の星の軌道を漂って",
            "description": "「隙を縫う糸」状態の敵の受けるダメージ+15%。アグライアまたは「ラフトラ」が「隙を縫う糸」状態の敵を攻撃した後、さらにEPを20回復する。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 1,
            "stat": "DMG_TAKEN",
            "value": 0.15
        }
    ],
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "ult_spd_percent",
            "source": "ult",
            "name": "共に舞え、運命のラフトラ",
            "description": "[強化]記憶の精霊「ラフトラ」を召喚する。なお、ラフトラがすでにフィールド上にいる場合、そのHPを最大値まで回復する。アグライアは「至高の姿」状態に入り、即座に行動する。「至高の姿」状態のアグライアは速度アップ効果を獲得する。この速度アップ効果の層数は、ラフトラの精霊天賦による速度アップ効果の層数と同数になる。1層につき、自身の速度+X%。通常攻撃「サイフォスの蜜」が「剣先より千の口付けを」に強化され、戦闘スキルが発動できなくなる。また、ラフトラが行動制限系デバフに抵抗するようになる。アクションバーにカウントダウンが出現する。カウントダウンの速度は100に固定される。カウントダウンの間に必殺技を発動すると、カウントダウンがリセットされる。カウントダウンのターンが回ってきた時、ラフトラは退場し、アグライアは「至高の姿」状態を解除する。",
            "fromLevel": "ult",
            "stat": "SPD_PERCENT",
            "statField": "spdBuff",
            "stackable": {
                "max": 6,
                "default": 6
            }
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "memorytalent_spd_flat",
            "source": "talent",
            "name": "涙で鍛えし匠の躯",
            "description": "[強化]「隙を縫う糸」状態の敵を攻撃した後、自身の速度+X。この効果は最大で6層累積できる。「ラフトラ」は行動時に自動で「サイフォスの罠」を発動し、「隙を縫う糸」状態の敵を優先的に攻撃する。",
            "fromLevel": "memoryTalent",
            "stat": "SPD_FLAT",
            "statField": "spdFlat",
            "stackable": {
                "max": 6,
                "default": 6
            }
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e2_def_ignore",
            "source": "eidolon",
            "name": "運命の瞼を行く舟",
            "description": "アグライアまたは「ラフトラ」が行動する時、アグライアとラフトラの与えるダメージが敵の防御力を14%無視する。この効果は最大で3層累積でき、アグライアとラフトラ以外の任意のユニットがスキルを発動する時まで継続する。",
            "stat": "DEF_IGNORE",
            "value": 0.14,
            "minEidolon": 2,
            "stackable": {
                "max": 3,
                "default": 3
            }
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e6_res_pen",
            "source": "eidolon",
            "name": "空虚で無常なる金糸",
            "description": "アグライアが「至高の姿」状態の時、自身と「ラフトラ」の雷属性耐性貫通+20%。この状態中、アグライアの速度が160/240/320を超える時、自身の連携攻撃ダメージ+10%/30%/60%。さらに、ラフトラの速度が160/240/320を超える時、自身の連携攻撃ダメージ+10%/30%/60%。",
            "stat": "RES_PEN",
            "value": 0.2,
            "minEidolon": 6
        },
        {
            "id": "extra2_self_spd_to_atk",
            "source": "extra",
            "name": "昇格2",
            "description": "「至高の姿」状態の時、アグライアの攻撃力がアグライアの速度720%分アップする。ラフトラ速度360%分は精霊ステータス未分離のため別途メモ扱い。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "stat": "ATK_FLAT",
            "compute": "casterDerivedFixedRatio",
            "sourceStat": "spd",
            "ratio": 7.2
        },
        {
            "id": "e4_memorytalent_spd_extra_stack",
            "source": "eidolon",
            "name": "大理石の内なる輝き",
            "description": "精霊天賦の速度アップ効果の累積上限+1層。追加の1層分を手動で加算する枠。",
            "defaultActive": false,
            "target": "single",
            "minEidolon": 4,
            "fromLevel": "memoryTalent",
            "stat": "SPD_FLAT",
            "statField": "spdFlat"
        }
    ]
});
