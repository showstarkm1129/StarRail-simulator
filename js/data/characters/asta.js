import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Asta",
    "id": "asta",
    "name": "アスター",
    "element": "Fire",
    "elementLabel": "炎",
    "path": "Harmony",
    "rarity": 4,
    "base": {
        "hp": 1023,
        "atk": 511,
        "def": 463,
        "spd": 106
    },
    "maxEnergy": 120,
    "traceBonuses": [
        {
            "label": "炎ダメージ",
            "value": 0.224
        },
        {
            "label": "防御力",
            "value": 0.225
        },
        {
            "label": "会心率",
            "value": 0.067
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%82%A2%E3%82%B9%E3%82%BF%E3%83%BC",
        "version": "1.0"
    },
    "skills": {
        "basic": {
            "name": "スペクトル光線",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にアスターの攻撃力X%分の炎属性ダメージを与える。",
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
            "name": "スターフォール",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "bounce",
            "description": "[バウンド]指定した敵単体にアスターの攻撃力X%分の炎属性ダメージを与え、さらに4ヒットする。1ヒットごとに、ランダムな敵単体にアスターの攻撃力Y%分の炎属性ダメージを与える。",
            "levelColumns": [
                "単体ダメージ倍率(X%)",
                "ランダムダメージ倍率(Y%)"
            ],
            "levels": [
                {
                    "atk": 0.25,
                    "atk2": 0.25
                },
                {
                    "atk": 0.27,
                    "atk2": 0.27
                },
                {
                    "atk": 0.3,
                    "atk2": 0.3
                },
                {
                    "atk": 0.32,
                    "atk2": 0.32
                },
                {
                    "atk": 0.35,
                    "atk2": 0.35
                },
                {
                    "atk": 0.37,
                    "atk2": 0.37
                },
                {
                    "atk": 0.4,
                    "atk2": 0.4
                },
                {
                    "atk": 0.43,
                    "atk2": 0.43
                },
                {
                    "atk": 0.46,
                    "atk2": 0.46
                },
                {
                    "atk": 0.5,
                    "atk2": 0.5
                },
                {
                    "atk": 0.53,
                    "atk2": 0.53
                },
                {
                    "atk": 0.55,
                    "atk2": 0.55
                }
            ]
        },
        "ult": {
            "name": "星空祝言",
            "sourceHeader": "必殺技",
            "type": "buff",
            "target": "all_ally",
            "description": "[サポート]味方全体の速度+X、2ターン継続。",
            "levelColumns": [
                "速度バフ(X)",
                "消費EP"
            ],
            "levels": [
                {
                    "spdFlat": 36,
                    "energyCost": 120
                },
                {
                    "spdFlat": 37
                },
                {
                    "spdFlat": 38
                },
                {
                    "spdFlat": 40
                },
                {
                    "spdFlat": 41
                },
                {
                    "spdFlat": 43
                },
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
                    "spdFlat": 51
                },
                {
                    "spdFlat": 52
                }
            ]
        },
        "talent": {
            "name": "天象学",
            "sourceHeader": "天賦",
            "type": "buff",
            "target": "all_ally",
            "description": "[サポート]異なる敵に攻撃が命中するごとに蓄エネを1層獲得する。攻撃を受けた敵の弱点が炎属性だった場合、さらに蓄エネを1層獲得する。アスターが持つ蓄エネが1層につき、味方全体の攻撃力+X%、最大で5回累積できる。自身の2ターン目から、アスターのターンが回ってくるたびに蓄エネ層数-3。",
            "levelColumns": [
                "攻撃力バフ(X%)"
            ],
            "levels": [
                {
                    "atkBuff": 0.07
                },
                {
                    "atkBuff": 0.077
                },
                {
                    "atkBuff": 0.084
                },
                {
                    "atkBuff": 0.091
                },
                {
                    "atkBuff": 0.098
                },
                {
                    "atkBuff": 0.105
                },
                {
                    "atkBuff": 0.114
                },
                {
                    "atkBuff": 0.122
                },
                {
                    "atkBuff": 0.131
                },
                {
                    "atkBuff": 0.14
                },
                {
                    "atkBuff": 0.147
                },
                {
                    "atkBuff": 0.154
                }
            ]
        },
        "technique": {
            "name": "着想の一閃",
            "sourceHeader": "秘技",
            "type": "attack",
            "target": "all",
            "description": "敵を攻撃。戦闘に入った後、敵全体にアスターの攻撃力50%分の炎属性ダメージを与える。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "火花通常攻撃を行った時、80%の基礎確率で敵を燃焼状態にする、3ターン継続。燃焼状態の敵はターンが回ってくるたびに、アスターの通常攻撃ダメージ50%分の炎属性持続ダメージを受ける。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "点火アスターがフィールド上にいる時、味方全体の炎属性の与ダメージ+18%。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "星座アスターが持つ蓄エネを1層につき、自身の防御力+6%。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "星に無言の歌あり",
            "description": "戦闘スキルを発動した時、さらにランダムな敵単体にダメージを1回与える。"
        },
        "2": {
            "name": "月に盈虚の意を現す",
            "description": "必殺技を発動した時、アスターの次のターンの蓄エネ層数が減少しなくなる。"
        },
        "3": {
            "name": "黄道隕石の変",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+1、最大Lv.15まで。"
        },
        "4": {
            "name": "極光が顕現する時",
            "description": "天賦の蓄エネが2層以上の時、アスターのEP回復効率+15%。"
        },
        "5": {
            "name": "深空座す天体の謎",
            "description": "必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "6": {
            "name": "銀河の下に眠る",
            "description": "ターンが回ってきた時、天賦の蓄エネ層数減少値-1。"
        }
    },
    "partyEffects": [
        {
            "id": "ult_spd_flat",
            "source": "ult",
            "name": "星空祝言",
            "description": "[サポート]味方全体の速度+X、2ターン継続。",
            "defaultActive": false,
            "target": "all",
            "duration": 2,
            "fromLevel": "ult",
            "stat": "SPD_FLAT",
            "statField": "spdFlat"
        },
        {
            "id": "talent_atk_percent",
            "source": "talent",
            "name": "天象学",
            "description": "[サポート]異なる敵に攻撃が命中するごとに蓄エネを1層獲得する。攻撃を受けた敵の弱点が炎属性だった場合、さらに蓄エネを1層獲得する。アスターが持つ蓄エネが1層につき、味方全体の攻撃力+X%、最大で5回累積できる。自身の2ターン目から、アスターのターンが回ってくるたびに蓄エネ層数-3。",
            "defaultActive": false,
            "target": "all",
            "fromLevel": "talent",
            "stat": "ATK_PERCENT",
            "statField": "atkBuff",
            "stackable": {
                "max": 5,
                "default": 5
            }
        },
        {
            "id": "extra4_element_dmg",
            "source": "extra",
            "name": "昇格4",
            "description": "点火アスターがフィールド上にいる時、味方全体の炎属性の与ダメージ+18%。",
            "defaultActive": true,
            "target": "all",
            "duration": "permanent",
            "stat": "DMG_FIRE",
            "value": 0.18
        }
    ],
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "extra6_def_percent",
            "source": "extra",
            "name": "昇格6",
            "description": "星座アスターが持つ蓄エネを1層につき、自身の防御力+6%。",
            "stat": "DEF_PERCENT",
            "value": 0.06,
            "stackable": {
                "max": 5,
                "default": 5
            }
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e4_energy_regen",
            "source": "eidolon",
            "name": "極光が顕現する時",
            "description": "天賦の蓄エネが2層以上の時、アスターのEP回復効率+15%。",
            "stat": "ENERGY_REGEN",
            "value": 0.15,
            "minEidolon": 4
        }
    ]
});
