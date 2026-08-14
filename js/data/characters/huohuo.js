import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Huohuo",
    "id": "huohuo",
    "name": "フォフォ",
    "element": "Wind",
    "elementLabel": "風",
    "path": "Abundance",
    "rarity": 5,
    "base": {
        "hp": 1358,
        "atk": 601,
        "def": 509,
        "spd": 98
    },
    "maxEnergy": 140,
    "energyEffects": [
        {
            "id": "huohuo_ult_party_energy",
            "name": "必殺技: 味方EP回復",
            "trigger": "ult",
            "target": "allOtherAllies",
            "amount": { "kind": "percentMax", "value": 0.2 }
        }
    ],
    "traceBonuses": [
        {
            "label": "最大HP",
            "value": 0.28
        },
        {
            "label": "効果抵抗",
            "value": 0.18
        },
        {
            "label": "速度",
            "value": 5
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%83%95%E3%82%A9%E3%83%95%E3%82%A9",
        "version": "1.5"
    },
    "skills": {
        "basic": {
            "name": "令旗・風雨招来",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にフォフォの最大HP X%分の風属性ダメージを与える。",
            "levelColumns": [
                "ダメージ倍率(X%)"
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
            "name": "霊符・護身",
            "sourceHeader": "戦闘スキル",
            "type": "debuff",
            "target": "single_ally",
            "description": "[回復]指定した味方単体のデバフを1つ解除し、フォフォの最大HP X%+YのHPを回復する。同時にターゲットに隣接する味方のHPをフォフォの最大HP Z%+V回復する。",
            "levelColumns": [
                "単体回復量(X%+Y)",
                "隣接回復量(Z%+V)"
            ],
            "levels": [
                {
                    "healPct": 0.16,
                    "healFlat": 160,
                    "healPct2": 0.128,
                    "healFlat2": 128
                },
                {
                    "healPct": 0.17,
                    "healFlat": 256,
                    "healPct2": 0.136,
                    "healFlat2": 204
                },
                {
                    "healPct": 0.18,
                    "healFlat": 328,
                    "healPct2": 0.144,
                    "healFlat2": 262
                },
                {
                    "healPct": 0.19,
                    "healFlat": 400,
                    "healPct2": 0.152,
                    "healFlat2": 320
                },
                {
                    "healPct": 0.2,
                    "healFlat": 448,
                    "healPct2": 0.16,
                    "healFlat2": 358
                },
                {
                    "healPct": 0.208,
                    "healFlat": 496,
                    "healPct2": 0.166,
                    "healFlat2": 396
                },
                {
                    "healPct": 0.216,
                    "healFlat": 532,
                    "healPct2": 0.173,
                    "healFlat2": 425
                },
                {
                    "healPct": 0.224,
                    "healFlat": 568,
                    "healPct2": 0.179,
                    "healFlat2": 454
                },
                {
                    "healPct": 0.232,
                    "healFlat": 604,
                    "healPct2": 0.186,
                    "healFlat2": 483
                },
                {
                    "healPct": 0.24,
                    "healFlat": 640,
                    "healPct2": 0.192,
                    "healFlat2": 512
                },
                {
                    "healPct": 0.248,
                    "healFlat": 676,
                    "healPct2": 0.198,
                    "healFlat2": 540
                },
                {
                    "healPct": 0.256,
                    "healFlat": 712,
                    "healPct2": 0.205,
                    "healFlat2": 569
                }
            ]
        },
        "ult": {
            "name": "シッポ・神鬼使役",
            "sourceHeader": "必殺技",
            "type": "heal",
            "target": "single",
            "description": "[サポート]自身以外の味方のEPをそれぞれの最大EP X%分回復し、それらの味方の攻撃力+Y%、2ターン継続。",
            "levelColumns": [
                "EP回復(X%)",
                "攻撃力アップ(Y%)",
                "消費EP"
            ],
            "levels": [
                {
                    "energyGain": 0.15,
                    "atkBuff": 0.24,
                    "energyCost": 140
                },
                {
                    "energyGain": 0.155,
                    "atkBuff": 0.24
                },
                {
                    "energyGain": 0.16,
                    "atkBuff": 0.272
                },
                {
                    "energyGain": 0.165,
                    "atkBuff": 0.288
                },
                {
                    "energyGain": 0.17,
                    "atkBuff": 0.304
                },
                {
                    "energyGain": 0.175,
                    "atkBuff": 0.32
                },
                {
                    "energyGain": 0.181,
                    "atkBuff": 0.34
                },
                {
                    "energyGain": 0.187,
                    "atkBuff": 0.36
                },
                {
                    "energyGain": 0.193,
                    "atkBuff": 0.38
                },
                {
                    "energyGain": 0.2,
                    "atkBuff": 0.4
                },
                {
                    "energyGain": 0.205,
                    "atkBuff": 0.416
                },
                {
                    "energyGain": 0.21,
                    "atkBuff": 0.432
                }
            ]
        },
        "talent": {
            "name": "憑依・真気通天",
            "sourceHeader": "天賦",
            "type": "debuff",
            "target": "single",
            "description": "[回復]戦闘スキルまたは必殺技を発動した後、フォフォは3ターン継続する「厄払い」を獲得する。フォフォのターンが回ってくるたびに「厄払い」の継続時間-1ターン。フォフォに「厄払い」がある場合、味方のターンが回ってきた時、または味方が必殺技を発動した時に、その味方と残りHPの割合が最も低い味方のHPをフォフォの最大HP X%+Y回復する。その後、残りHPが50%以下の味方それぞれのHPをフォフォの最大HP X%+Y回復する。「厄払い」が発動して、味方を治癒した時、その味方のデバフを1つ解除する。この効果は6回発動できる。再度「厄払い」を獲得した後、発動可能回数がリセットされる。",
            "levelColumns": [
                "回復量(X%+Y)"
            ],
            "levels": [
                {
                    "healPct": 0.03,
                    "healFlat": 30
                },
                {
                    "healPct": 0.031,
                    "healFlat": 48
                },
                {
                    "healPct": 0.033,
                    "healFlat": 61
                },
                {
                    "healPct": 0.035,
                    "healFlat": 75
                },
                {
                    "healPct": 0.037,
                    "healFlat": 84
                },
                {
                    "healPct": 0.039,
                    "healFlat": 93
                },
                {
                    "healPct": 0.04,
                    "healFlat": 99
                },
                {
                    "healPct": 0.042,
                    "healFlat": 106
                },
                {
                    "healPct": 0.043,
                    "healFlat": 113
                },
                {
                    "healPct": 0.045,
                    "healFlat": 120
                },
                {
                    "healPct": 0.046,
                    "healFlat": 126
                },
                {
                    "healPct": 0.048,
                    "healFlat": 133
                }
            ]
        },
        "technique": {
            "name": "凶相・鬼物圧伏",
            "sourceHeader": "秘技",
            "type": "debuff",
            "target": "single",
            "description": "[妨害]フォフォが周囲の敵を威嚇し、敵を「魂魄飛散」状態にする。「魂魄飛散」状態の敵はフォフォの反対方向に向けて逃げる、10秒継続。「魂魄飛散」状態の敵と戦闘に入った後、100%の基礎確率で敵それぞれの攻撃力-25%、2ターン継続。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "一存では動けない戦闘開始時、フォフォはEPを30回復し、2ターン継続する「厄払い」を獲得する。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "貞凶の命行動制限系デバフを抵抗する確率+35%。必殺技を発動する時、味方の最大EPが160以上の場合、その味方の攻撃力がさらに+24%。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "臆病者のストレス反応天賦を発動して味方に治癒を行った時、フォフォのEPを1回復する。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "歳陽の拠り所",
            "description": "天賦による「厄払い」の継続時間+1ターン。フォフォに「厄払い」がある時、自身の治癒量+20%、さらに味方全体の速度+12%。"
        },
        "2": {
            "name": "邪霊を宿した尻尾",
            "description": "フォフォに「厄払い」がある時、味方はHPが0になるダメージを受けても戦闘不能状態にならず、自身の最大HP50%分のHPを回復する。この効果を発動した後、「厄払い」の継続時間-1ターン。この効果は一度の戦闘で2回まで発動できる。"
        },
        "3": {
            "name": "貞凶の燭火",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "4": {
            "name": "離れぬ悪鬼、絶えぬ揉め事",
            "description": "戦闘スキルまたは天賦を発動し、味方に治癒を行った時、その味方の残りHPが少ないほど治癒量がアップする、最大でフォフォの治癒量+80%。"
        },
        "5": {
            "name": "勅令のままに妖魔退治",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "6": {
            "name": "苦楽を共にする仲間",
            "description": "味方に治癒を行った時、その味方の与ダメージ+50%、2ターン継続。"
        }
    },
    "partyEffects": [
        {
            "id": "e1_spd_percent",
            "source": "eidolon",
            "name": "歳陽の拠り所",
            "description": "天賦による「厄払い」の継続時間+1ターン。フォフォに「厄払い」がある時、自身の治癒量+20%、さらに味方全体の速度+12%。",
            "defaultActive": false,
            "target": "all",
            "duration": "conditional",
            "minEidolon": 1,
            "stat": "SPD_PERCENT",
            "value": 0.12
        },
        {
            "id": "ult_atk_percent",
            "source": "ult",
            "name": "シッポ・神鬼使役",
            "description": "[サポート]自身以外の味方のEPをそれぞれの最大EP X%分回復し、それらの味方の攻撃力+Y%、2ターン継続。",
            "defaultActive": false,
            "target": "all",
            "duration": 2,
            "fromLevel": "ult",
            "stat": "ATK_PERCENT",
            "statField": "atkBuff"
        },
        {
            "id": "extra4_atk_percent",
            "source": "extra",
            "name": "昇格4",
            "description": "貞凶の命行動制限系デバフを抵抗する確率+35%。必殺技を発動する時、味方の最大EPが160以上の場合、その味方の攻撃力がさらに+24%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "stat": "ATK_PERCENT",
            "value": 0.24
        },
        {
            "id": "e6_dmg",
            "source": "eidolon",
            "name": "苦楽を共にする仲間",
            "description": "味方に治癒を行った時、その味方の与ダメージ+50%、2ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "minEidolon": 6,
            "stat": "DMG_ALL",
            "value": 0.5
        }
    ],
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "e1_heal_bonus",
            "source": "eidolon",
            "name": "歳陽の拠り所",
            "description": "天賦による「厄払い」の継続時間+1ターン。フォフォに「厄払い」がある時、自身の治癒量+20%、さらに味方全体の速度+12%。",
            "stat": "HEAL_BONUS",
            "value": 0.2,
            "minEidolon": 1
        }
    ]
});
