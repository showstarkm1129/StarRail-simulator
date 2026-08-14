import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Bailu",
    "id": "bailu",
    "name": "白露",
    "element": "Lightning",
    "elementLabel": "雷",
    "path": "Abundance",
    "rarity": 5,
    "base": {
        "hp": 1319,
        "atk": 562,
        "def": 485,
        "spd": 98
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
        "pageUrl": "https://wikiwiki.jp/star-rail/%E7%99%BD%E9%9C%B2",
        "version": "1.0"
    },
    "skills": {
        "basic": {
            "name": "望・聞・問…蹴！",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に白露の攻撃力X%分の雷属性ダメージを与える。",
            "levelColumns": [
                "単体ダメージ(攻撃力)"
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
            "name": "雲吟乍然、零れる珠露",
            "sourceHeader": "戦闘スキル",
            "type": "heal",
            "target": "single_ally",
            "description": "[回復]指定した味方単体のHPを白露の最大HPX%+Y回復し、さらに2回、ランダムに味方単体を治癒する。治癒するたびに、次の治癒で回復するHP-15%。",
            "levelColumns": [
                "回復量(X%+Y)"
            ],
            "levels": [
                {
                    "healPct": 0.078,
                    "healFlat": 78
                },
                {
                    "healPct": 0.082,
                    "healFlat": 124
                },
                {
                    "healPct": 0.087,
                    "healFlat": 159
                },
                {
                    "healPct": 0.093,
                    "healFlat": 195
                },
                {
                    "healPct": 0.098,
                    "healFlat": 218
                },
                {
                    "healPct": 0.101,
                    "healFlat": 241
                },
                {
                    "healPct": 0.105,
                    "healFlat": 259
                },
                {
                    "healPct": 0.109,
                    "healFlat": 276
                },
                {
                    "healPct": 0.113,
                    "healFlat": 294
                },
                {
                    "healPct": 0.117,
                    "healFlat": 312
                },
                {
                    "healPct": 0.121,
                    "healFlat": 329
                },
                {
                    "healPct": 0.125,
                    "healFlat": 347
                }
            ]
        },
        "ult": {
            "name": "雷鳴率いる躍渊の蛟龍",
            "sourceHeader": "必殺技",
            "type": "heal",
            "target": "all_ally",
            "description": "[回復]味方全体のHPを白露の最大HPX%+Y回復する。「生生」が付与されていない味方に「生生」を付与する。「生生」が付与されている味方の「生生」の継続時間+1ターン。「生生」は2ターン継続でき、効果は累積できない。",
            "levelColumns": [
                "回復量(X%+Y)",
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
                    "healPct": 0.1395,
                    "healFlat": 380
                },
                {
                    "healPct": 0.144,
                    "healFlat": 400
                }
            ],
            "inferredNotes": [
                "Lv.11 healPct は前後Lvから線形補完",
                "Lv.11 healFlat は前後Lvから線形補完"
            ]
        },
        "talent": {
            "name": "懸壺済世",
            "sourceHeader": "天賦",
            "type": "heal",
            "target": "single",
            "description": "[回復]「生生」を持つ味方が攻撃を受けた後、HPを白露の最大HPX%+Y回復する、この効果は2回発動できる。白露以外の味方は、HPが0になる攻撃を受けても戦闘不能状態にならず、白露がその味方を治癒し、白露の最大HPV%+WのHPを回復させる。この効果は一度の戦闘で1回発動できる。",
            "levelColumns": [
                "「生生」回復量(X％＋Y)",
                "復活時の回復量(V%+W)"
            ],
            "levels": [
                {
                    "healPct": 0.036,
                    "healFlat": 36,
                    "healPct2": 0.12,
                    "healFlat2": 120
                },
                {
                    "healPct": 0.038,
                    "healFlat": 57,
                    "healPct2": 0.128,
                    "healFlat2": 192
                },
                {
                    "healPct": 0.04,
                    "healFlat": 73,
                    "healPct2": 0.135,
                    "healFlat2": 246
                },
                {
                    "healPct": 0.043,
                    "healFlat": 90,
                    "healPct2": 0.142,
                    "healFlat2": 300
                },
                {
                    "healPct": 0.045,
                    "healFlat": 100,
                    "healPct2": 0.15,
                    "healFlat2": 336
                },
                {
                    "healPct": 0.047,
                    "healFlat": 111,
                    "healPct2": 0.156,
                    "healFlat2": 372
                },
                {
                    "healPct": 0.049,
                    "healFlat": 119,
                    "healPct2": 0.162,
                    "healFlat2": 399
                },
                {
                    "healPct": 0.05,
                    "healFlat": 127,
                    "healPct2": 0.168,
                    "healFlat2": 426
                },
                {
                    "healPct": 0.052,
                    "healFlat": 135,
                    "healPct2": 0.174,
                    "healFlat2": 453
                },
                {
                    "healPct": 0.054,
                    "healFlat": 144,
                    "healPct2": 0.18,
                    "healFlat2": 480
                },
                {
                    "healPct": 0.056,
                    "healFlat": 152,
                    "healPct2": 0.186,
                    "healFlat2": 507
                },
                {
                    "healPct": 0.058,
                    "healFlat": 160,
                    "healPct2": 0.192,
                    "healFlat2": 534
                }
            ]
        },
        "technique": {
            "name": "恙病を払拭せし、徜徉する霊澤",
            "sourceHeader": "秘技",
            "type": "heal",
            "target": "all_ally",
            "description": "[回復]秘技を使用した後、次の戦闘開始時、味方全体に「生生」を付与、2ターン継続。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "岐黄精義白露が味方に最大HPを超える治癒を行った時、その味方の最大HP+10%、2ターン継続。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "持明の龍脈「生生」効果の発動可能回数+1。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "鱗淵の恩沢「生生」を付与されたキャラの被ダメージ-10%。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "百脈静める甘露",
            "description": "「生生」効果が終了する時、味方のHPが満タンの場合、さらにEPを8回復させる。"
        },
        "2": {
            "name": "壺中の天には雲龍眠る",
            "description": "必殺技を発動した後、白露の治癒量+15%、2ターン継続。"
        },
        "3": {
            "name": "心地安らぐ回春の妙手",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "4": {
            "name": "外傷癒す肘後の備急",
            "description": "戦闘スキルによる治癒を受けるたび、その味方の与ダメージ+10%、最大で3層累積できる、2ターン継続。"
        },
        "5": {
            "name": "俗塵濯ぐ慈雨",
            "description": "必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "6": {
            "name": "龍涎仙薬、金丹に勝る",
            "description": "一度の戦闘で、白露がHPが0になる攻撃を受けた味方を治癒する効果の発動可能回数+1。"
        }
    },
    "partyEffects": [
        {
            "id": "extra2_overheal_hp",
            "source": "extra",
            "name": "昇格2",
            "description": "白露が味方に最大HPを超える治癒を行った時、その味方の最大HP+10%、2ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "stat": "HP_PERCENT",
            "value": 0.1
        },
        {
            "id": "e4_heal_dmg",
            "source": "eidolon",
            "name": "外傷癒す肘後の備急",
            "description": "戦闘スキルによる治癒を受けるたび、その味方の与ダメージ+10%、最大3層、2ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "minEidolon": 4,
            "stat": "DMG_ALL",
            "value": 0.1,
            "stackable": {
                "max": 3,
                "default": 3
            }
        }
    ],
    "enemyEffects": [],
    "selfEffects": []
});
