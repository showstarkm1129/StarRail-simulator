import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Guinaifen",
    "id": "guinaifen",
    "name": "桂乃芬",
    "element": "Fire",
    "elementLabel": "炎",
    "path": "Nihility",
    "rarity": 4,
    "base": {
        "hp": 882,
        "atk": 582,
        "def": 441,
        "spd": 106
    },
    "maxEnergy": 120,
    "traceBonuses": [
        {
            "label": "炎ダメージ",
            "value": 0.224
        },
        {
            "label": "撃破特効",
            "value": 0.24
        },
        {
            "label": "効果命中",
            "value": 0.1
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E6%A1%82%E4%B9%83%E8%8A%AC",
        "version": "1.4"
    },
    "skills": {
        "basic": {
            "name": "喝采満場",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に桂乃芬の攻撃力X%分の炎属性ダメージを与える。",
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
            "name": "出だし好調",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "blast",
            "description": "[拡散攻撃]指定した敵単体に桂乃芬の攻撃力X%分の炎属性ダメージを与え、隣接する敵に桂乃芬の攻撃力Y%分の炎属性ダメージを与える。100%の基礎確率で指定した敵とその隣接する敵に燃焼状態を付与する。燃焼状態を付与された敵は、ターンが回ってくるたびに桂乃芬の攻撃力Z%分の炎属性持続ダメージを受ける。2ターン継続。",
            "levelColumns": [
                "単体ダメージ倍率(X%)",
                "隣接ダメージ倍率(Y%)",
                "燃焼ダメージ倍率(Z%)"
            ],
            "levels": [
                {
                    "atk": 0.6,
                    "atkAdjacent": 0.2,
                    "atk2": 0.83
                },
                {
                    "atk": 0.66,
                    "atkAdjacent": 0.22,
                    "atk2": 0.92
                },
                {
                    "atk": 0.72,
                    "atkAdjacent": 0.24,
                    "atk2": 1
                },
                {
                    "atk": 0.78,
                    "atkAdjacent": 0.26,
                    "atk2": 1.09
                },
                {
                    "atk": 0.84,
                    "atkAdjacent": 0.28,
                    "atk2": 1.17
                },
                {
                    "atk": 0.9,
                    "atkAdjacent": 0.3,
                    "atk2": 1.3
                },
                {
                    "atk": 0.97,
                    "atkAdjacent": 0.32,
                    "atk2": 1.46
                },
                {
                    "atk": 1.05,
                    "atkAdjacent": 0.35,
                    "atk2": 1.67
                },
                {
                    "atk": 1.12,
                    "atkAdjacent": 0.37,
                    "atk2": 1.93
                },
                {
                    "atk": 1.2,
                    "atkAdjacent": 0.4,
                    "atk2": 2.18
                },
                {
                    "atk": 1.26,
                    "atkAdjacent": 0.42,
                    "atk2": 2.29
                },
                {
                    "atk": 1.32,
                    "atkAdjacent": 0.44,
                    "atk2": 2.4
                }
            ]
        },
        "ult": {
            "name": "十八番を披露するね",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]敵全体に桂乃芬の攻撃力X%分の炎属性ダメージを与える。敵が燃焼状態の場合、付与された燃焼状態が本来のダメージY%分のダメージを発生する。",
            "levelColumns": [
                "全体ダメージ倍率(X%)",
                "誘発ダメージ倍率(Y%)",
                "消費EP"
            ],
            "levels": [
                {
                    "atkAll": 0.72,
                    "atk": 0.72,
                    "energyCost": 120
                },
                {
                    "atkAll": 0.768,
                    "atk": 0.74
                },
                {
                    "atkAll": 0.816,
                    "atk": 0.76
                },
                {
                    "atkAll": 0.864,
                    "atk": 0.78
                },
                {
                    "atkAll": 0.912,
                    "atk": 0.8
                },
                {
                    "atkAll": 0.96,
                    "atk": 0.82
                },
                {
                    "atkAll": 1.02,
                    "atk": 0.84
                },
                {
                    "atkAll": 1.08,
                    "atk": 0.87
                },
                {
                    "atkAll": 1.14,
                    "atk": 0.89
                },
                {
                    "atkAll": 1.2,
                    "atk": 0.92
                },
                {
                    "atkAll": 1.248,
                    "atk": 0.94
                },
                {
                    "atkAll": 1.296,
                    "atk": 0.96
                }
            ]
        },
        "talent": {
            "name": "古来、芸人は君子に頼る",
            "sourceHeader": "天賦",
            "type": "debuff",
            "target": "single",
            "description": "[妨害]桂乃芬がフィールド上にいる時、敵が燃焼状態によるダメージを受けた後、100%の基礎確率で「火喰い」状態になる。「火喰い」状態の敵の被ダメージ+X%。3ターン継続。最大で3層累積できる。",
            "levelColumns": [
                "被ダメージアップ(X%)"
            ],
            "levels": [
                {
                    "dmgTaken": 0.04
                },
                {
                    "dmgTaken": 0.043
                },
                {
                    "dmgTaken": 0.046
                },
                {
                    "dmgTaken": 0.049
                },
                {
                    "dmgTaken": 0.052
                },
                {
                    "dmgTaken": 0.055
                },
                {
                    "dmgTaken": 0.059
                },
                {
                    "dmgTaken": 0.062
                },
                {
                    "dmgTaken": 0.066
                },
                {
                    "dmgTaken": 0.07
                },
                {
                    "dmgTaken": 0.073
                },
                {
                    "dmgTaken": 0.076
                }
            ]
        },
        "technique": {
            "name": "大道芸",
            "sourceHeader": "秘技",
            "type": "support",
            "target": "single",
            "description": "敵を攻撃。戦闘に入った後、敵にダメージを4回与える。1ヒットごとにランダムな敵単体に桂乃芬の攻撃力50%分の炎属性ダメージを与え、100%の基礎確率でその敵を「火喰い」状態にする。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "縁竿通常攻撃は80%の基礎確率で敵に戦闘スキルが与えるものと同じ燃焼状態を付与する。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "刃の輪くぐり戦闘開始時、桂乃芬の行動順が25%早まる。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "裸足踏刀燃焼状態の敵に対する与ダメージ+20%。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "逆立ち麺食い",
            "description": "戦闘スキルを発動した時、100%の基礎確率で攻撃を受けた敵の効果抵抗-10%、2ターン継続。"
        },
        "2": {
            "name": "歯を磨きながら口笛を吹く",
            "description": "敵が燃焼状態の時、桂乃芬の通常攻撃と戦闘スキルがその敵に付与する燃焼状態のダメージ倍率+40%。"
        },
        "3": {
            "name": "胸元で岩砕き",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "喉元で槍先受け止め",
            "description": "桂乃芬が付与した燃焼状態がダメージを与えるたびに、桂乃芬のEPを2回復する。"
        },
        "5": {
            "name": "剣呑み",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "素手で銃弾つかみ",
            "description": "「火喰い」の累積可能層数+1。"
        }
    },
    "partyEffects": [
        {
            "id": "talent_dmg_taken_mirror",
            "source": "talent",
            "name": "古来、芸人は君子に頼る (火力計算用)",
            "description": "[妨害]桂乃芬がフィールド上にいる時、敵が燃焼状態によるダメージを受けた後、100%の基礎確率で「火喰い」状態になる。「火喰い」状態の敵の被ダメージ+X%。3ターン継続。最大で3層累積できる。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "single",
            "duration": 3,
            "fromLevel": "talent",
            "stat": "DMG_TAKEN",
            "statField": "dmgTaken",
            "stackable": {
                "max": 3,
                "default": 3
            }
        }
    ],
    "enemyEffects": [
        {
            "id": "talent_dmg_taken",
            "source": "talent",
            "name": "古来、芸人は君子に頼る",
            "description": "[妨害]桂乃芬がフィールド上にいる時、敵が燃焼状態によるダメージを受けた後、100%の基礎確率で「火喰い」状態になる。「火喰い」状態の敵の被ダメージ+X%。3ターン継続。最大で3層累積できる。",
            "defaultActive": false,
            "target": "single",
            "duration": 3,
            "fromLevel": "talent",
            "stat": "DMG_TAKEN",
            "statField": "dmgTaken",
            "stackable": {
                "max": 3,
                "default": 3
            }
        },
        {
            "id": "e1_effect_res_down",
            "source": "eidolon",
            "name": "逆立ち麺食い",
            "description": "戦闘スキルを発動した時、100%の基礎確率で攻撃を受けた敵の効果抵抗-10%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 1,
            "stat": "EFFECT_RES",
            "value": -0.1
        }
    ],
    "selfEffects": [
        {
            "id": "extra6_burn_dmg",
            "source": "extra",
            "name": "昇格6",
            "description": "燃焼状態の敵に対する与ダメージ+20%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "stat": "DMG_ALL",
            "value": 0.2
        }
    ]
});
