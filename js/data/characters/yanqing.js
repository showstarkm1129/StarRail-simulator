import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Yanqing",
    "id": "yanqing",
    "name": "彦卿",
    "element": "Ice",
    "elementLabel": "氷",
    "path": "The Hunt",
    "rarity": 5,
    "base": {
        "hp": 892,
        "atk": 679,
        "def": 412,
        "spd": 109
    },
    "maxEnergy": 140,
    "traceBonuses": [
        {
            "label": "攻撃力",
            "value": 0.28
        },
        {
            "label": "氷ダメージ",
            "value": 0.144
        },
        {
            "label": "最大HP",
            "value": 0.1
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E5%BD%A6%E5%8D%BF",
        "version": "1.0"
    },
    "skills": {
        "basic": {
            "name": "寒光刺す霜鋒",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に彦卿の攻撃力X%分の氷属性ダメージを与える。",
            "levelColumns": [
                "ダメージ倍率(X%)"
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
            "name": "三尺秋水",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に彦卿の攻撃力X%分の氷属性ダメージを与え、彦卿に「智剣連心」を付与する、1ターン継続。",
            "levelColumns": [
                "ダメージ倍率(X%)"
            ],
            "levels": [
                {
                    "atk": 1.1
                },
                {
                    "atk": 1.21
                },
                {
                    "atk": 1.32
                },
                {
                    "atk": 1.43
                },
                {
                    "atk": 1.54
                },
                {
                    "atk": 1.65
                },
                {
                    "atk": 1.78
                },
                {
                    "atk": 1.92
                },
                {
                    "atk": 2.06
                },
                {
                    "atk": 2.2
                },
                {
                    "atk": 2.31
                },
                {
                    "atk": 2.42
                }
            ]
        },
        "ult": {
            "name": "快雨に戯れる燕",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]自身の会心率+60%、彦卿に「智剣連心」がある場合、さらに会心ダメージ+X%、バフは1ターン継続。その後、指定した敵単体に彦卿の攻撃力Y%分の氷属性ダメージを与える。",
            "levelColumns": [
                "会心ダメージアップ(X%)",
                "ダメージ倍率(Y%)",
                "消費EP"
            ],
            "levels": [
                {
                    "cdBuff": 0.3,
                    "atk": 2.1,
                    "energyCost": 140
                },
                {
                    "cdBuff": 0.32,
                    "atk": 2.24
                },
                {
                    "cdBuff": 0.34,
                    "atk": 2.38
                },
                {
                    "cdBuff": 0.36,
                    "atk": 2.52
                },
                {
                    "cdBuff": 0.38,
                    "atk": 2.66
                },
                {
                    "cdBuff": 0.4,
                    "atk": 2.8
                },
                {
                    "cdBuff": 0.42,
                    "atk": 2.97
                },
                {
                    "cdBuff": 0.45,
                    "atk": 3.15
                },
                {
                    "cdBuff": 0.47,
                    "atk": 3.32
                },
                {
                    "cdBuff": 0.5,
                    "atk": 3.5
                },
                {
                    "cdBuff": 0.53,
                    "atk": 3.675
                },
                {
                    "cdBuff": 0.55,
                    "atk": 3.85
                }
            ]
        },
        "talent": {
            "name": "呼影剣",
            "sourceHeader": "天賦",
            "type": "follow_up",
            "target": "single",
            "description": "[単体攻撃]彦卿に「智剣連心」がある場合、攻撃を受ける確率ダウン、自身の会心率+X%、会心ダメージ+Y%。敵に攻撃を行った後、P%の固定確率で追加攻撃を行い、敵に彦卿の攻撃力Q%分の氷属性ダメージを与え、65%の基礎確率で凍結状態にする、1ターン継続。凍結状態の敵は行動できず、ターンが回ってきるたびに彦卿の攻撃力R%分の氷属性付加ダメージを受ける。彦卿がダメージを受けると「智剣連心」が解除される。",
            "levelColumns": [
                "会心率アップ(X%)",
                "会心ダメージ(Y%)",
                "追加攻撃確率(P%)",
                "追加攻撃ダメージ(Q%)",
                "凍結ダメージ(R%)"
            ],
            "levels": [
                {
                    "critRateBuff": 0.15,
                    "cdBuff": 0.15,
                    "atkExtra": 0.5,
                    "atkExtra2": 0.25,
                    "atk": 0.25
                },
                {
                    "critRateBuff": 0.155,
                    "cdBuff": 0.16,
                    "atkExtra": 0.51,
                    "atkExtra2": 0.27,
                    "atk": 0.27
                },
                {
                    "critRateBuff": 0.16,
                    "cdBuff": 0.18,
                    "atkExtra": 0.52,
                    "atkExtra2": 0.3,
                    "atk": 0.3
                },
                {
                    "critRateBuff": 0.165,
                    "cdBuff": 0.19,
                    "atkExtra": 0.53,
                    "atkExtra2": 0.32,
                    "atk": 0.32
                },
                {
                    "critRateBuff": 0.17,
                    "cdBuff": 0.21,
                    "atkExtra": 0.54,
                    "atkExtra2": 0.35,
                    "atk": 0.35
                },
                {
                    "critRateBuff": 0.175,
                    "cdBuff": 0.22,
                    "atkExtra": 0.55,
                    "atkExtra2": 0.37,
                    "atk": 0.37
                },
                {
                    "critRateBuff": 0.181,
                    "cdBuff": 0.24,
                    "atkExtra": 0.56,
                    "atkExtra2": 0.4,
                    "atk": 0.4
                },
                {
                    "critRateBuff": 0.187,
                    "cdBuff": 0.26,
                    "atkExtra": 0.57,
                    "atkExtra2": 0.43,
                    "atk": 0.43
                },
                {
                    "critRateBuff": 0.193,
                    "cdBuff": 0.28,
                    "atkExtra": 0.58,
                    "atkExtra2": 0.46,
                    "atk": 0.46
                },
                {
                    "critRateBuff": 0.2,
                    "cdBuff": 0.3,
                    "atkExtra": 0.6,
                    "atkExtra2": 0.5,
                    "atk": 0.5
                },
                {
                    "critRateBuff": 0.21,
                    "cdBuff": 0.31,
                    "atkExtra": 0.63,
                    "atkExtra2": 0.525,
                    "atk": 0.525
                },
                {
                    "critRateBuff": 0.22,
                    "cdBuff": 0.33,
                    "atkExtra": 0.66,
                    "atkExtra2": 0.55,
                    "atk": 0.55
                }
            ]
        },
        "technique": {
            "name": "御剣真訣",
            "sourceHeader": "秘技",
            "type": "buff",
            "target": "single",
            "description": "[強化]秘技を使用した後、次の戦闘開始時、残りHPが50%以上の敵に対して、彦卿の与ダメージ+30%、2ターン継続。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "頒氷攻撃を行った後、氷属性の弱点がある敵に、彦卿の攻撃力の30%の氷属性付加ダメージを与える。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "凌霜「智剣連心」がある場合、効果抵抗+20%。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "軽呂会心が発生した時、速度+10%、2ターン継続。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "素刃",
            "description": "彦卿が敵に攻撃を行う時、その敵が凍結状態の場合、敵に彦卿の攻撃力60%分の氷属性付加ダメージを与える。"
        },
        "2": {
            "name": "空明",
            "description": "彦卿に「智剣連心」がある場合、さらにEP回復効率+10%。"
        },
        "3": {
            "name": "剣胎",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "霜厲",
            "description": "残りHPが80%以上の時、自身の氷属性耐性貫通+12%。"
        },
        "5": {
            "name": "武骨",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "自在",
            "description": "敵を倒した時、必殺技のバフがある場合、それらの継続時間+1ターン。"
        }
    },
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "ult_crit_rate",
            "source": "ult",
            "name": "快雨に戯れる燕",
            "description": "[単体攻撃]自身の会心率+60%、彦卿に「智剣連心」がある場合、さらに会心ダメージ+X%、バフは1ターン継続。その後、指定した敵単体に彦卿の攻撃力Y%分の氷属性ダメージを与える。",
            "stat": "CRIT_RATE",
            "value": 0.6,
            "duration": 1
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "ult_crit_dmg",
            "source": "ult",
            "name": "快雨に戯れる燕",
            "description": "[単体攻撃]自身の会心率+60%、彦卿に「智剣連心」がある場合、さらに会心ダメージ+X%、バフは1ターン継続。その後、指定した敵単体に彦卿の攻撃力Y%分の氷属性ダメージを与える。",
            "fromLevel": "ult",
            "stat": "CRIT_DMG",
            "statField": "cdBuff",
            "duration": 1
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "talent_crit_rate",
            "source": "talent",
            "name": "呼影剣",
            "description": "[単体攻撃]彦卿に「智剣連心」がある場合、攻撃を受ける確率ダウン、自身の会心率+X%、会心ダメージ+Y%。敵に攻撃を行った後、P%の固定確率で追加攻撃を行い、敵に彦卿の攻撃力Q%分の氷属性ダメージを与え、65%の基礎確率で凍結状態にする、1ターン継続。凍結状態の敵は行動できず、ターンが回ってきるたびに彦卿の攻撃力R%分の氷属性付加ダメージを受ける。彦卿がダメージを受けると「智剣連心」が解除される。",
            "fromLevel": "talent",
            "stat": "CRIT_RATE",
            "statField": "critRateBuff"
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "talent_crit_dmg",
            "source": "talent",
            "name": "呼影剣",
            "description": "[単体攻撃]彦卿に「智剣連心」がある場合、攻撃を受ける確率ダウン、自身の会心率+X%、会心ダメージ+Y%。敵に攻撃を行った後、P%の固定確率で追加攻撃を行い、敵に彦卿の攻撃力Q%分の氷属性ダメージを与え、65%の基礎確率で凍結状態にする、1ターン継続。凍結状態の敵は行動できず、ターンが回ってきるたびに彦卿の攻撃力R%分の氷属性付加ダメージを受ける。彦卿がダメージを受けると「智剣連心」が解除される。",
            "fromLevel": "talent",
            "stat": "CRIT_DMG",
            "statField": "cdBuff"
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "technique_high_hp_dmg",
            "source": "technique",
            "name": "御剣真訣",
            "description": "[強化]秘技を使用した後、次の戦闘開始時、残りHPが50%以上の敵に対して、彦卿の与ダメージ+30%、2ターン継続。",
            "stat": "DMG_ALL",
            "value": 0.3,
            "duration": 2
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e4_ice_res_pen",
            "source": "eidolon",
            "name": "霜厲",
            "description": "残りHPが80%以上の時、自身の氷属性耐性貫通+12%。",
            "stat": "RES_PEN",
            "value": 0.12,
            "minEidolon": 4
        },
        {
            "id": "extra4_effect_res",
            "source": "extra",
            "name": "昇格4",
            "description": "「智剣連心」がある場合、効果抵抗+20%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "stat": "EFFECT_RES",
            "value": 0.2
        },
        {
            "id": "extra6_crit_spd",
            "source": "extra",
            "name": "昇格6",
            "description": "会心が発生した時、速度+10%、2ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "stat": "SPD_PERCENT",
            "value": 0.1
        }
    ],
    "partyEffects": [],
    "enemyEffects": []
});
