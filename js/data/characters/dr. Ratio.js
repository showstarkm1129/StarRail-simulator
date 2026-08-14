import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Dr. Ratio",
    "id": "dr_ratio",
    "name": "Dr.レイシオ",
    "element": "Imaginary",
    "elementLabel": "虚数",
    "path": "The Hunt",
    "rarity": 5,
    "base": {
        "hp": 1047,
        "atk": 776,
        "def": 460,
        "spd": 103
    },
    "maxEnergy": 140,
    "traceBonuses": [
        {
            "label": "攻撃力",
            "value": 0.28
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
        "pageUrl": "https://wikiwiki.jp/star-rail/Dr.%E3%83%AC%E3%82%A4%E3%82%B7%E3%82%AA",
        "version": "1.6"
    },
    "skills": {
        "basic": {
            "name": "知識は力なり",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にDr.レイシオの攻撃力X%分の虚数属性ダメージを与える。",
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
            "name": "産婆術",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にDr.レイシオの攻撃力X%分の虚数属性ダメージを与える。",
            "levelColumns": [
                "ダメージ倍率(X%)"
            ],
            "levels": [
                {
                    "atk": 0.75
                },
                {
                    "atk": 0.82
                },
                {
                    "atk": 0.9
                },
                {
                    "atk": 0.97
                },
                {
                    "atk": 1.05
                },
                {
                    "atk": 1.12
                },
                {
                    "atk": 1.21
                },
                {
                    "atk": 1.31
                },
                {
                    "atk": 1.4
                },
                {
                    "atk": 1.5
                },
                {
                    "atk": 1.57
                },
                {
                    "atk": 1.65
                }
            ]
        },
        "ult": {
            "name": "三段階のパラドックス",
            "sourceHeader": "必殺技",
            "type": "follow_up",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にDr.レイシオの攻撃力X%分の虚数属性ダメージを与え、「智者の短慮」を付与する。Dr.レイシオ以外の味方が「智者の短慮」を持つ敵に攻撃を行う時、Dr.レイシオはその敵に天賦の追加攻撃を1回行う。「智者の短慮」の効果は2回まで発動でき、Dr.レイシオの必殺技の最後のターゲットのみに効果を発揮する。必殺技を発動した後にこの効果の発動可能回数がリセットされる。",
            "levelColumns": [
                "ダメージ倍率(X%)",
                "消費EP"
            ],
            "levels": [
                {
                    "atk": 1.44,
                    "energyCost": 140
                },
                {
                    "atk": 1.53
                },
                {
                    "atk": 1.63
                },
                {
                    "atk": 1.72
                },
                {
                    "atk": 1.82
                },
                {
                    "atk": 1.92
                },
                {
                    "atk": 2.04
                },
                {
                    "atk": 2.16
                },
                {
                    "atk": 2.28
                },
                {
                    "atk": 2.4
                },
                {
                    "atk": 2.49
                },
                {
                    "atk": 2.59
                }
            ]
        },
        "talent": {
            "name": "我思う、故に我あり",
            "sourceHeader": "天賦",
            "type": "follow_up",
            "target": "single",
            "description": "[単体攻撃]戦闘スキルを発動する時、40%の固定確率でターゲットに追加攻撃を1回行い、Dr.レイシオの攻撃力X%分の虚数属性ダメージを与える。敵にあるデバフ1つにつき追加攻撃を行う固定確率+20%。追加攻撃を行う前にターゲットが倒された場合、ランダムな敵単体に追加攻撃を行う。",
            "levelColumns": [
                "ダメージ倍率(X%)"
            ],
            "levels": [
                {
                    "atk": 1.35
                },
                {
                    "atk": 1.48
                },
                {
                    "atk": 1.62
                },
                {
                    "atk": 1.75
                },
                {
                    "atk": 1.89
                },
                {
                    "atk": 2.02
                },
                {
                    "atk": 2.19
                },
                {
                    "atk": 2.36
                },
                {
                    "atk": 2.53
                },
                {
                    "atk": 2.7
                },
                {
                    "atk": 2.83
                },
                {
                    "atk": 2.97
                }
            ]
        },
        "technique": {
            "name": "偶像の誕生",
            "sourceHeader": "秘技",
            "type": "debuff",
            "target": "single",
            "description": "[妨害]秘技を使用した後、10秒間継続する敵を挑発する特殊領域を作り出す。特殊領域内の敵と戦闘に入った後、100%の基礎確率で敵それぞれの速度-15%、2ターン継続。味方が作り出した領域は1つまで存在できる。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "帰納戦闘スキルを発動する時、敵にあるデバフ1つにつき、Dr.レイシオの会心率+2.5%、会心ダメージ+5%、最大で6層まで累積できる。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "演繹戦闘スキルを発動した後、100%の基礎確率で攻撃を受けた敵の効果抵抗-10%、2ターン継続。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "推論ダメージを与える時、敵にあるデバフが3つ以上の場合、デバフ1つにつき、Dr.レイシオの与ダメージ+10%、最大で+50%"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "傲慢は災いを生む",
            "description": "軌跡「帰納」の累積可能層数+4。戦闘開始時、「帰納」を4層獲得する。先に軌跡「帰納」を覚醒する必要あり。"
        },
        "2": {
            "name": "微を顕にして幽を闡く",
            "description": "天賦の追加攻撃が命中した時、敵にあるデバフ1つにつき、さらにDr.レイシオの攻撃力20%の虚数属性付加ダメージを与える。この効果は1回の追加攻撃で4回まで発動できる。"
        },
        "3": {
            "name": "己を知れ",
            "description": "必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで"
        },
        "4": {
            "name": "無知は愚者を造る",
            "description": "天賦を発動する時、さらにDr.レイシオのEPを15回復する。"
        },
        "5": {
            "name": "櫂なき舟に海は渡れず",
            "description": "戦闘スキルのLv.+2、最大Lv.+15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "ただ真理のみが永遠",
            "description": "「智者の短慮」の発動可能回数+1。天賦の追加攻撃の与ダメージ+50%。"
        }
    },
    "partyEffects": [],
    "enemyEffects": [
        {
            "id": "extra4_effect_res_down",
            "source": "extra",
            "name": "昇格4",
            "description": "戦闘スキルを発動して敵を攻撃した後、100%の基礎確率で攻撃を受けた敵の効果抵抗-10%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "stat": "EFFECT_RES",
            "value": -0.1
        }
    ],
    "selfEffects": [
        {
            "id": "extra2_debuff_crit_rate",
            "source": "extra",
            "name": "昇格2",
            "description": "戦闘スキルを発動する時、敵にあるデバフ1つにつき会心率+2.5%。最大6層。",
            "defaultActive": false,
            "target": "single",
            "stat": "CRIT_RATE",
            "value": 0.025,
            "stackable": {
                "max": 6,
                "default": 6
            }
        },
        {
            "id": "extra2_debuff_crit_dmg",
            "source": "extra",
            "name": "昇格2",
            "description": "戦闘スキルを発動する時、敵にあるデバフ1つにつき会心ダメージ+5%。最大6層。",
            "defaultActive": false,
            "target": "single",
            "stat": "CRIT_DMG",
            "value": 0.05,
            "stackable": {
                "max": 6,
                "default": 6
            }
        },
        {
            "id": "extra6_debuff_dmg",
            "source": "extra",
            "name": "昇格6",
            "description": "ダメージを与える時、敵にあるデバフが3つ以上の場合、デバフ1つにつき与ダメージ+10%、最大+50%。",
            "defaultActive": false,
            "target": "single",
            "stat": "DMG_ALL",
            "value": 0.1,
            "stackable": {
                "max": 5,
                "default": 5
            }
        },
        {
            "id": "e6_followup_dmg",
            "source": "eidolon",
            "name": "ただ真理のみが永遠",
            "description": "天賦の追加攻撃の与ダメージ+50%。",
            "defaultActive": false,
            "target": "single",
            "minEidolon": 6,
            "stat": "DMG_FOLLOWUP",
            "value": 0.5
        }
    ]
});
