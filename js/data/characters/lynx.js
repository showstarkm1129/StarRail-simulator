import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Lynx",
    "id": "lynx",
    "name": "リンクス",
    "element": "Quantum",
    "elementLabel": "量子",
    "path": "Abundance",
    "rarity": 4,
    "base": {
        "hp": 1058,
        "atk": 494,
        "def": 552,
        "spd": 100
    },
    "maxEnergy": 100,
    "traceBonuses": [
        {
            "label": "最大HP",
            "value": 0.28
        },
        {
            "label": "防御力",
            "value": 0.225
        },
        {
            "label": "効果抵抗",
            "value": 0.1
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%B9",
        "version": "1.3"
    },
    "skills": {
        "basic": {
            "name": "アイスクライミングテクニック",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にリンクスの最大HPX%分の量子属性ダメージを与える。",
            "levelColumns": [
                "ダメージ倍率(X％)"
            ],
            "levels": [
                {
                    "hpPct": 0.25
                },
                {
                    "hpPct": 0.3
                },
                {
                    "hpPct": 0.35
                },
                {
                    "hpPct": 0.4
                },
                {
                    "hpPct": 0.45
                },
                {
                    "hpPct": 0.5
                },
                {
                    "hpPct": 0.55
                }
            ]
        },
        "skill": {
            "name": "塩漬け野営缶詰",
            "sourceHeader": "戦闘スキル",
            "type": "heal",
            "target": "single_ally",
            "description": "[回復]指定した味方単体に「サバイバル反応」を付与し、最大HPをリンクスの最大HPX%+Y分アップさせる。その味方が「壊滅」または「存護」の運命にある場合、敵に攻撃される確率が大幅アップ。「サバイバル反応」は2ターン継続。「サバイバル反応」を付与された味方は、HPをリンクスの最大HPZ%+W回復する。",
            "levelColumns": [
                "最大HPアップ(X%+Y)",
                "治癒量(Z%+W)"
            ],
            "levels": [
                {
                    "hpPct": 0.05,
                    "hpFlat": 50,
                    "healPct": 0.08,
                    "healFlat": 80
                },
                {
                    "hpPct": 0.052,
                    "hpFlat": 80,
                    "healPct": 0.085,
                    "healFlat": 128
                },
                {
                    "hpPct": 0.055,
                    "hpFlat": 102,
                    "healPct": 0.09,
                    "healFlat": 164
                },
                {
                    "hpPct": 0.058,
                    "hpFlat": 125,
                    "healPct": 0.095,
                    "healFlat": 200
                },
                {
                    "hpPct": 0.06,
                    "hpFlat": 140,
                    "healPct": 0.1,
                    "healFlat": 224
                },
                {
                    "hpPct": 0.062,
                    "hpFlat": 155,
                    "healPct": 0.104,
                    "healFlat": 248
                },
                {
                    "hpPct": 0.066,
                    "hpFlat": 166,
                    "healPct": 0.108,
                    "healFlat": 266
                },
                {
                    "hpPct": 0.069,
                    "hpFlat": 177,
                    "healPct": 0.112,
                    "healFlat": 284
                },
                {
                    "hpPct": 0.072,
                    "hpFlat": 188,
                    "healPct": 0.116,
                    "healFlat": 302
                },
                {
                    "hpPct": 0.075,
                    "hpFlat": 200,
                    "healPct": 0.12,
                    "healFlat": 320
                },
                {
                    "hpPct": 0.078,
                    "hpFlat": 211,
                    "healPct": 0.124,
                    "healFlat": 338
                },
                {
                    "hpPct": 0.08,
                    "hpFlat": 222,
                    "healPct": 0.128,
                    "healFlat": 356
                }
            ]
        },
        "ult": {
            "name": "雪原救急処置",
            "sourceHeader": "必殺技",
            "type": "debuff",
            "target": "all_ally",
            "description": "[回復]味方全体のデバフを1つ解除し、味方全体のHPをリンクスの最大HP X%+Y回復する。",
            "levelColumns": [
                "治癒量(X%+Y)",
                "消費EP"
            ],
            "levels": [
                {
                    "healPct": 0.09,
                    "healFlat": 90,
                    "energyCost": 100
                },
                {
                    "healPct": 0.096,
                    "healFlat": 144
                },
                {
                    "healPct": 0.101,
                    "healFlat": 184
                },
                {
                    "healPct": 0.107,
                    "healFlat": 225
                },
                {
                    "healPct": 0.112,
                    "healFlat": 252
                },
                {
                    "healPct": 0.117,
                    "healFlat": 279
                },
                {
                    "healPct": 0.122,
                    "healFlat": 299
                },
                {
                    "healPct": 0.126,
                    "healFlat": 319
                },
                {
                    "healPct": 0.13,
                    "healFlat": 339
                },
                {
                    "healPct": 0.135,
                    "healFlat": 360
                },
                {
                    "healPct": 0.14,
                    "healFlat": 380
                },
                {
                    "healPct": 0.144,
                    "healFlat": 400
                }
            ]
        },
        "talent": {
            "name": "野外サバイバル経験",
            "sourceHeader": "天賦",
            "type": "heal",
            "target": "single",
            "description": "[回復]戦闘スキルまたは必殺技を発動した時、ターゲットに2ターン継続する持続治癒効果を付与する。その味方のターンが回ってくるたびに、リンクスの最大HP X%+YのHPを回復する。味方が「サバイバル反応」を持つ場合、持続治癒効果がさらにリンクスの最大HP Z%+Wアップする。",
            "levelColumns": [
                "持続治癒量(X%+Y)",
                "持続治癒量アップ(Z%+W)"
            ],
            "levels": [
                {
                    "healPct": 0.024,
                    "healFlat": 24,
                    "healPct2": 0.03,
                    "healFlat2": 30
                },
                {
                    "healPct": 0.026,
                    "healFlat": 38,
                    "healPct2": 0.032,
                    "healFlat2": 48
                },
                {
                    "healPct": 0.027,
                    "healFlat": 49,
                    "healPct2": 0.034,
                    "healFlat2": 61
                },
                {
                    "healPct": 0.028,
                    "healFlat": 60,
                    "healPct2": 0.036,
                    "healFlat2": 75
                },
                {
                    "healPct": 0.03,
                    "healFlat": 67,
                    "healPct2": 0.038,
                    "healFlat2": 84
                },
                {
                    "healPct": 0.031,
                    "healFlat": 74,
                    "healPct2": 0.039,
                    "healFlat2": 93
                },
                {
                    "healPct": 0.032,
                    "healFlat": 79,
                    "healPct2": 0.04,
                    "healFlat2": 99
                },
                {
                    "healPct": 0.034,
                    "healFlat": 85,
                    "healPct2": 0.042,
                    "healFlat2": 106
                },
                {
                    "healPct": 0.035,
                    "healFlat": 90,
                    "healPct2": 0.044,
                    "healFlat2": 113
                },
                {
                    "healPct": 0.036,
                    "healFlat": 96,
                    "healPct2": 0.045,
                    "healFlat2": 120
                },
                {
                    "healPct": 0.037,
                    "healFlat": 101,
                    "healPct2": 0.046,
                    "healFlat2": 126
                },
                {
                    "healPct": 0.038,
                    "healFlat": 106,
                    "healPct2": 0.048,
                    "healFlat2": 133
                }
            ]
        },
        "technique": {
            "name": "チョコエネルギーバー",
            "sourceHeader": "秘技",
            "type": "heal",
            "target": "all_ally",
            "description": "[回復]秘技を使用した後、次の戦闘開始時、味方全体にリンクスの天賦による持続治癒効果を付与する、2ターン継続。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "事前調査「サバイバル反応」を持つターゲットが攻撃を受けた後、リンクスはEPを2回復する。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "探検テクニック行動制限系デバフを抵抗する確率35%。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "エクストリームサバイバル天賦による持続治癒効果の継続時間+1ターン。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "杖を手に雪道を行く早朝",
            "description": "残りHPが50%以下の味方に治癒を行う時、リンクスの治癒量+20%。この効果は持続治癒効果にも有効。"
        },
        "2": {
            "name": "ストーブの傍で過ごす正午",
            "description": "「サバイバル反応」を持つターゲットはデバフを付与された時、それを1回抵抗できる。"
        },
        "3": {
            "name": "雪崩ビーコンの鳴る午後",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "野外で篝火を焚く夕暮れ",
            "description": "「サバイバル反応」を獲得した時、ターゲットの攻撃力がリンクスの最大HPの3%分アップする。1ターン継続。"
        },
        "5": {
            "name": "紅茶とオーロラを楽しむ夜",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "製図中に迎える夜明け",
            "description": "「サバイバル反応」の最大HPアップ効果が、さらにリンクスの最大HPの6%分アップする。「サバイバル反応」を持つ味方の効果抵抗+30%。"
        }
    },
    "partyEffects": [
        {
            "id": "skill_hp_percent",
            "source": "skill",
            "name": "塩漬け野営缶詰",
            "description": "[回復]指定した味方単体に「サバイバル反応」を付与し、最大HPをリンクスの最大HPX%+Y分アップさせる。その味方が「壊滅」または「存護」の運命にある場合、敵に攻撃される確率が大幅アップ。「サバイバル反応」は2ターン継続。「サバイバル反応」を付与された味方は、HPをリンクスの最大HPZ%+W回復する。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "fromLevel": "skill",
            "stat": "HP_PERCENT",
            "statField": "hpPct"
        },
        {
            "id": "e4_survival_atk_flat",
            "source": "eidolon",
            "name": "野外で篝火を焚く夕暮れ",
            "description": "「サバイバル反応」を獲得した時、ターゲットの攻撃力がリンクスの最大HPの3%分アップする、1ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 1,
            "minEidolon": 4,
            "stat": "ATK_FLAT",
            "compute": "casterDerivedFixedRatio",
            "sourceStat": "hp",
            "ratio": 0.03
        },
        {
            "id": "e6_survival_extra_hp_flat",
            "source": "eidolon",
            "name": "製図中に迎える夜明け",
            "description": "「サバイバル反応」の最大HPアップ効果が、さらにリンクスの最大HPの6%分アップする。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 6,
            "stat": "HP_FLAT",
            "compute": "casterDerivedFixedRatio",
            "sourceStat": "hp",
            "ratio": 0.06
        },
        {
            "id": "e6_survival_effect_res",
            "source": "eidolon",
            "name": "製図中に迎える夜明け",
            "description": "「サバイバル反応」を持つ味方の効果抵抗+30%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 6,
            "stat": "EFFECT_RES",
            "value": 0.3
        }
    ],
    "enemyEffects": [],
    "selfEffects": []
});
