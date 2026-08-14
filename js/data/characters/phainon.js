import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Phainon",
    "id": "phainon",
    "name": "ファイノン",
    "element": "Physical",
    "elementLabel": "物理",
    "path": "Destruction",
    "rarity": 5,
    "base": {
        "hp": 1435,
        "atk": 582,
        "def": 703,
        "spd": 94
    },
    "maxEnergy": null,
    "traceBonuses": [
        {
            "label": "会心ダメージ",
            "value": 0.373
        },
        {
            "label": "会心率",
            "value": 0.12
        },
        {
            "label": "速度",
            "value": 5
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%83%95%E3%82%A1%E3%82%A4%E3%83%8E%E3%83%B3",
        "version": "3.4"
    },
    "skills": {
        "basic": {
            "name": "火追いの救世、必ずや果たさん",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にファイノンの攻撃力X%分の物理属性ダメージを与える。",
            "levelColumns": [
                "火追いの救世、必ずや果たさん",
                "創生・血荊の葬送"
            ],
            "levels": [
                {
                    "atk": 0.5,
                    "atkAlt2": 1.25
                },
                {
                    "atk": 0.6,
                    "atkAlt2": 1.5
                },
                {
                    "atk": 0.7,
                    "atkAlt2": 1.75
                },
                {
                    "atk": 0.8,
                    "atkAlt2": 2
                },
                {
                    "atk": 0.9,
                    "atkAlt2": 2.25
                },
                {
                    "atk": 1,
                    "atkAlt2": 2.5
                },
                {
                    "atk": 1.1,
                    "atkAlt2": 2.75
                }
            ]
        },
        "skill": {
            "name": "黎明の創世、天地を開闢す",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "blast",
            "description": "[拡散攻撃]「火種」を2個獲得し、指定した敵単体にファイノンの攻撃力X%分の物理属性ダメージを与え、隣接する敵にファイノンの攻撃力Y%分の物理属性ダメージを与える。",
            "levelColumns": [
                "黎明の創世、天地を開闢す",
                "災厄・魂命の滅却",
                "支柱・死星の天裁"
            ],
            "levels": [
                {
                    "atk": 1.5,
                    "atkAlt2": 0.6,
                    "atkAlt3": 0.2
                },
                {
                    "atk": 1.65,
                    "atkAlt2": 0.66,
                    "atkAlt3": 0.22
                },
                {
                    "atk": 1.8,
                    "atkAlt2": 0.72,
                    "atkAlt3": 0.24
                },
                {
                    "atk": 1.95,
                    "atkAlt2": 0.78,
                    "atkAlt3": 0.26
                },
                {
                    "atk": 2.1,
                    "atkAlt2": 0.84,
                    "atkAlt3": 0.28
                },
                {
                    "atk": 2.25,
                    "atkAlt2": 0.9,
                    "atkAlt3": 0.3
                },
                {
                    "atk": 2.43,
                    "atkAlt2": 0.97,
                    "atkAlt3": 0.32
                },
                {
                    "atk": 2.62,
                    "atkAlt2": 1.05,
                    "atkAlt3": 0.35
                },
                {
                    "atk": 2.81,
                    "atkAlt2": 1.12,
                    "atkAlt3": 0.37
                },
                {
                    "atk": 3,
                    "atkAlt2": 1.2,
                    "atkAlt3": 0.4
                },
                {
                    "atk": 3.15,
                    "atkAlt2": 1.26,
                    "atkAlt3": 0.42
                },
                {
                    "atk": 3.3,
                    "atkAlt2": 1.32,
                    "atkAlt3": 0.44
                }
            ],
            "inferredNotes": [
                "Lv.11 atk は前後Lvから線形補完",
                "Lv.11 atkAlt2 は前後Lvから線形補完",
                "Lv.11 atkAlt3 は前後Lvから線形補完"
            ]
        },
        "ult": {
            "name": "永劫の焼世、背負うべき未来",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]カスライナに変身する。変身している間、境界「時墟鉄墓」を展開する。境界内では、自身以外の味方が一時離脱となり、行動できなくなる。境界継続中、敵全体は物理属性弱点を持つ。カスライナは自身のターンには入らず、その代わりにカスライナの追加ターンを8ターン持つ。速度はカスライナの基礎速度の60%に固定される。最後のカスライナの追加ターンが回ってきた時、即座にラストアタックを発動し、カスライナの攻撃力X%分の物理属性ダメージを与える。なお、このダメージは敵全体で均等に分担される。",
            "levelColumns": [
                "ダメージ倍率(X%)",
                "スキル消費"
            ],
            "levels": [
                {
                    "atk": 4.8,
                    "atkAlt2": 12
                },
                {
                    "atk": 5.28
                },
                {
                    "atk": 5.76
                },
                {
                    "atk": 6.24
                },
                {
                    "atk": 6.72
                },
                {
                    "atk": 7.2
                },
                {
                    "atk": 7.8
                },
                {
                    "atk": 8.4
                },
                {
                    "atk": 9
                },
                {
                    "atk": 9.6
                },
                {
                    "atk": 10.08
                },
                {
                    "atk": 10.56
                }
            ]
        },
        "talent": {
            "name": "この身を炬火とす",
            "sourceHeader": "天賦",
            "type": "buff",
            "target": "single",
            "description": "[強化]ファイノンの天賦。「火種」が12個に達すると必殺技を発動できる。「火種」の数が上限を超えた時、最大3個まで保存でき、変身終了後に保存された数を基に「火種」を獲得できる。ファイノンが自身以外の任意のユニットのスキルターゲットになった時、「火種」を1個獲得する。さらに、味方のスキルターゲットになった場合、会心ダメージ+X%、3ターン持続。",
            "levelColumns": [
                "この身を炬火とす",
                "運命・この身は神なり"
            ],
            "levels": [
                {
                    "value1": 0.15,
                    "value2": 0.4
                },
                {
                    "value1": 0.16,
                    "value2": 0.44
                },
                {
                    "value1": 0.18,
                    "value2": 0.48
                },
                {
                    "value1": 0.19,
                    "value2": 0.52
                },
                {
                    "value1": 0.21,
                    "value2": 0.56
                },
                {
                    "value1": 0.22,
                    "value2": 0.6
                },
                {
                    "value1": 0.24,
                    "value2": 0.65
                },
                {
                    "value1": 0.26,
                    "value2": 0.7
                },
                {
                    "value1": 0.28,
                    "value2": 0.75
                },
                {
                    "value1": 0.3,
                    "value2": 0.8
                },
                {
                    "value1": 0.315,
                    "value2": 0.84
                },
                {
                    "value1": 0.33,
                    "value2": 0.88
                }
            ],
            "inferredNotes": [
                "Lv.11 value1 は前後Lvから線形補完",
                "Lv.11 value2 は前後Lvから線形補完"
            ]
        },
        "technique": {
            "name": "終わりの始まり",
            "sourceHeader": "秘技",
            "type": "attack",
            "target": "all",
            "description": "ファイノンがパーティにいる時、秘技PT上限+3。秘技を使用すると、秘技PTを2消費し、即座に一定範囲内にいるすべての敵を攻撃する。戦闘に入った後、自身以外の味方のEPを25回復し、「壊傷」を2層、SPを1獲得する。さらに各ウェーブ開始時、敵全体にファイノンの攻撃力200%分の物理属性ダメージを与える。通常エネミーを攻撃するとターゲットはその場で倒れ、戦闘に入らない。敵に命中しなかった場合、秘技PTは消費されない。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "世界の終点へ赴く戦闘開始時、「火種」を1個獲得する。変身終了時、「火種」を3個獲得する。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "幾千万の炎を携えて自身以外の味方による治癒効果またはバリアを得た時、与ダメージ+45%、4ターン継続。この効果は1ターンに1回まで発動できる。自身以外の味方のスキルによるEP回復効果を受けた時、「火種」を1個獲得する。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "映し出されし英雄の本質戦闘に入る、または変身終了後に、攻撃力+50%。この効果は最大で2層まで累積できる。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "炎と光、善と悪の化身",
            "description": "カスライナの追加ターンの基礎速度継承率が66%まで上がる。一度の戦闘で、敵が1体倒されるたびに、さらに1.5%、最大84%まで。必殺技を発動する時、会心ダメージ+50%、3ターン継続。"
        },
        "2": {
            "name": "天と地、すべては泡影",
            "description": "カスライナの物理属性耐性貫通+20%。1回の「支柱・死星の天裁」の発動で、消費した「壊傷」が4層に達した場合、追加ターンを1獲得する。"
        },
        "3": {
            "name": "深淵に埋もれし幾重もの静寂",
            "description": "必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "霞みゆくタイタンたちの面影",
            "description": "「災厄・魂命の滅却」を発動する時、追加で「魂を殺す熾炎」を4層獲得する。"
        },
        "5": {
            "name": "三千万の回帰と永劫の時計",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "永遠を照らす不滅の残照",
            "description": "保存できる超過分の「火種」の上限がなくなる。戦闘開始時、「火種」を6獲得する。「支柱・死星の天裁」を発動後、残りHPが最も高い敵に、その回の攻撃の合計ダメージ36%分の確定ダメージを与える。"
        }
    },
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "talent_crit_dmg",
            "source": "talent",
            "name": "この身を炬火とす",
            "description": "[強化]ファイノンの天賦。「火種」が12個に達すると必殺技を発動できる。「火種」の数が上限を超えた時、最大3個まで保存でき、変身終了後に保存された数を基に「火種」を獲得できる。ファイノンが自身以外の任意のユニットのスキルターゲットになった時、「火種」を1個獲得する。さらに、味方のスキルターゲットになった場合、会心ダメージ+X%、3ターン持続。",
            "fromLevel": "talent",
            "stat": "CRIT_DMG",
            "statField": "value1",
            "duration": 3
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "extra4_dmg",
            "source": "extra",
            "name": "昇格4",
            "description": "幾千万の炎を携えて自身以外の味方による治癒効果またはバリアを得た時、与ダメージ+45%、4ターン継続。この効果は1ターンに1回まで発動できる。自身以外の味方のスキルによるEP回復効果を受けた時、「火種」を1個獲得する。",
            "stat": "DMG_ALL",
            "value": 0.45,
            "duration": 4
        },
        {
            "id": "extra6_atk_percent",
            "source": "extra",
            "name": "昇格6",
            "description": "戦闘に入る、または変身終了後に、攻撃力+50%。最大2層。",
            "defaultActive": false,
            "target": "single",
            "stat": "ATK_PERCENT",
            "value": 0.5,
            "stackable": {
                "max": 2,
                "default": 2
            }
        },
        {
            "id": "e1_ult_crit_dmg",
            "source": "eidolon",
            "name": "炎と光、善と悪の化身",
            "description": "必殺技を発動する時、会心ダメージ+50%、3ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 3,
            "minEidolon": 1,
            "stat": "CRIT_DMG",
            "value": 0.5
        },
        {
            "id": "e2_physical_res_pen",
            "source": "eidolon",
            "name": "天と地、すべては泡影",
            "description": "カスライナの物理属性耐性貫通+20%。物理攻撃時に手動ONする近似枠。",
            "defaultActive": false,
            "target": "single",
            "minEidolon": 2,
            "stat": "RES_PEN",
            "value": 0.2
        }
    ],
    "partyEffects": [],
    "enemyEffects": []
});
