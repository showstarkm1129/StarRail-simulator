import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Lingsha",
    "id": "lingsha",
    "name": "霊砂",
    "element": "Fire",
    "elementLabel": "炎",
    "path": "Abundance",
    "rarity": 5,
    "base": {
        "hp": 1358,
        "atk": 679,
        "def": 436,
        "spd": 98
    },
    "maxEnergy": 110,
    "traceBonuses": [
        {
            "label": "撃破特効",
            "value": 0.373
        },
        {
            "label": "最大HP",
            "value": 0.18
        },
        {
            "label": "攻撃力",
            "value": 0.1
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E9%9C%8A%E7%A0%82",
        "version": "2.5"
    },
    "skills": {
        "basic": {
            "name": "供香",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に霊砂の攻撃力X%分の炎属性ダメージを与える。",
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
            "name": "彩煙",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]敵全体に霊砂の攻撃力X%分の炎属性ダメージを与え、味方全体のHPを霊砂の攻撃力Y%+Z回復する。また、「浮元」の行動順を20%早める。",
            "levelColumns": [
                "ダメージ(X%)",
                "HP回復(Y%+Z)"
            ],
            "levels": [
                {
                    "hpPct": 0.4,
                    "healPct": 0.1,
                    "healFlat": 105
                },
                {
                    "hpPct": 0.44,
                    "healPct": 0.105,
                    "healFlat": 168
                },
                {
                    "hpPct": 0.48,
                    "healPct": 0.11,
                    "healFlat": 215
                },
                {
                    "hpPct": 0.52,
                    "healPct": 0.115,
                    "healFlat": 262
                },
                {
                    "hpPct": 0.56,
                    "healPct": 0.12,
                    "healFlat": 294
                },
                {
                    "hpPct": 0.6,
                    "healPct": 0.124,
                    "healFlat": 325
                },
                {
                    "hpPct": 0.65,
                    "healPct": 0.128,
                    "healFlat": 349
                },
                {
                    "hpPct": 0.7,
                    "healPct": 0.132,
                    "healFlat": 372
                },
                {
                    "hpPct": 0.75,
                    "healPct": 0.136,
                    "healFlat": 396
                },
                {
                    "hpPct": 0.8,
                    "healPct": 0.14,
                    "healFlat": 420
                },
                {
                    "hpPct": 0.84,
                    "healPct": 0.147,
                    "healFlat": 441
                },
                {
                    "hpPct": 0.88,
                    "healPct": 0.154,
                    "healFlat": 462
                }
            ]
        },
        "ult": {
            "name": "彩雲の如く巡る霞",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]敵全体を「芳酔」状態にする。「芳酔」状態の敵が受ける弱点撃破ダメージ+X%、2ターン継続。敵全体に霊砂の攻撃力Y%分の炎属性ダメージを与え、同時に味方全体のHPを霊砂の攻撃力Z%+W回復する。また、「浮元」の行動順を100%早める。",
            "levelColumns": [
                "弱点撃破ダメージアップ(X%)",
                "ダメージ(Y%)",
                "HP回復(Z%+W)",
                "消費EP"
            ],
            "levels": [
                {
                    "hpPct": 0.15,
                    "hpPct2": 0.9,
                    "healPct": 0.08,
                    "healFlat": 90,
                    "energyCost": 110
                },
                {
                    "hpPct": 0.16,
                    "hpPct2": 0.96,
                    "healPct": 0.085,
                    "healFlat": 144
                },
                {
                    "hpPct": 0.17,
                    "hpPct2": 1.02,
                    "healPct": 0.09,
                    "healFlat": 184
                },
                {
                    "hpPct": 0.18,
                    "hpPct2": 1.08,
                    "healPct": 0.095,
                    "healFlat": 225
                },
                {
                    "hpPct": 0.19,
                    "hpPct2": 1.14,
                    "healPct": 0.1,
                    "healFlat": 252
                },
                {
                    "hpPct": 0.2,
                    "hpPct2": 1.2,
                    "healPct": 0.104,
                    "healFlat": 279
                },
                {
                    "hpPct": 0.21,
                    "hpPct2": 1.27,
                    "healPct": 0.108,
                    "healFlat": 299
                },
                {
                    "hpPct": 0.22,
                    "hpPct2": 1.35,
                    "healPct": 0.112,
                    "healFlat": 319
                },
                {
                    "hpPct": 0.23,
                    "hpPct2": 1.42,
                    "healPct": 0.116,
                    "healFlat": 339
                },
                {
                    "hpPct": 0.25,
                    "hpPct2": 1.5,
                    "healPct": 0.12,
                    "healFlat": 360
                },
                {
                    "hpPct": 0.26,
                    "hpPct2": 1.58,
                    "healPct": 0.126,
                    "healFlat": 380
                },
                {
                    "hpPct": 0.27,
                    "hpPct2": 1.65,
                    "healPct": 0.132,
                    "healFlat": 400
                }
            ]
        },
        "talent": {
            "name": "紅霧より出づる煙獣",
            "sourceHeader": "天賦",
            "type": "follow_up",
            "target": "all",
            "description": "[全体攻撃]戦闘スキルを発動する時、「浮元」を召喚する。「浮元」の初期速度は90、初期行動可能回数は3回。行動時、「浮元」は敵全体に追加攻撃を行い、霊砂の攻撃力X%分の炎属性ダメージを与える。さらに、ランダムな敵単体に霊砂の攻撃力X%分の炎属性ダメージを与える。この時、「浮元」は炎属性弱点を持ち、かつ残り靭性値が0より大きいいずれかの敵を優先的にターゲットにする。また、味方それぞれのデバフを1つ解除すると同時に、霊砂の攻撃力Y%+ZのHPを回復する。「浮元」の行動可能回数は最大で5回まで累積できる。行動可能回数が0になると、「浮元」は消える。「浮元」がフィールド上にいる時に戦闘スキルを発動すると、「浮元」の行動可能回数+3回。",
            "levelColumns": [
                "ダメージ(X%)",
                "HP回復(Y%+Z)"
            ],
            "levels": [
                {
                    "hpPct": 0.37,
                    "healPct": 0.08,
                    "healFlat": 90
                },
                {
                    "hpPct": 0.41,
                    "healPct": 0.085,
                    "healFlat": 144
                },
                {
                    "hpPct": 0.45,
                    "healPct": 0.09,
                    "healFlat": 184
                },
                {
                    "hpPct": 0.48,
                    "healPct": 0.095,
                    "healFlat": 225
                },
                {
                    "hpPct": 0.52,
                    "healPct": 0.1,
                    "healFlat": 252
                },
                {
                    "hpPct": 0.56,
                    "healPct": 0.104,
                    "healFlat": 279
                },
                {
                    "hpPct": 0.6,
                    "healPct": 0.108,
                    "healFlat": 299
                },
                {
                    "hpPct": 0.65,
                    "healPct": 0.112,
                    "healFlat": 319
                },
                {
                    "hpPct": 0.7,
                    "healPct": 0.116,
                    "healFlat": 339
                },
                {
                    "hpPct": 0.75,
                    "healPct": 0.12,
                    "healFlat": 360
                },
                {
                    "hpPct": 0.79,
                    "healPct": 0.126,
                    "healFlat": 380
                },
                {
                    "hpPct": 0.83,
                    "healPct": 0.132,
                    "healFlat": 400
                }
            ]
        },
        "technique": {
            "name": "流翠散雲",
            "sourceHeader": "秘技",
            "type": "buff",
            "target": "all",
            "description": "[サポート]秘技を使用した後、次の戦闘開始時に即座に「浮元」を召喚し、敵全体を「芳酔」状態にする、2ターン継続。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "朱炎自身の攻撃力を撃破特効25%分アップする、最大で攻撃力+50%。また、自身の治癒量を撃破特効10%分アップする、最大で治癒量+20%。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "幽香通常攻撃を行う時、さらにEPを10回復する。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "余香「浮元」がフィールド上に存在する時、任意の味方キャラがダメージを受ける、またはHPを消費する時、パーティに残りHP割合が60%以下のキャラがいる場合、「浮元」が即座に天賦による追加攻撃を行う。この追加攻撃は「浮元」の行動可能回数を消費せず、2ターン後に再度発動できる。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "破邪の香り",
            "description": "霊砂の弱点撃破効率+50%。敵が弱点撃破される時、その敵の防御力-20%。"
        },
        "2": {
            "name": "垂れ雲に紅香炉",
            "description": "必殺技を発動する時、味方全体の撃破特効+40%、3ターン継続。"
        },
        "3": {
            "name": "一縷の新芽",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "4": {
            "name": "帳を撫でる朱煙",
            "description": "「浮元」が行動する時、残りHPが最も低い味方のHPを、霊砂の攻撃力40%分回復する。"
        },
        "5": {
            "name": "揺るがぬ規矩",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "6": {
            "name": "春蘭の宿香",
            "description": "「浮元」がフィールド上に存在する時、敵全体の全属性耐性-20%。「浮元」が攻撃を行う時、さらに4ヒットする。1ヒットにつき、ランダムな敵単体に霊砂の攻撃力50%分の炎属性ダメージを与える。この時、「浮元」は炎属性弱点を持ち、かつ残り靭性値が0より大きい敵を優先的にターゲットにする。なお、このダメージの削靭値は1ヒットにつき5。"
        }
    },
    "partyEffects": [
        {
            "id": "e1_def_down_mirror",
            "source": "eidolon",
            "name": "破邪の香り (火力計算用)",
            "description": "霊砂の弱点撃破効率+50%。敵が弱点撃破される時、その敵の防御力-20%。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 1,
            "stat": "DEF_DOWN",
            "value": 0.2
        },
        {
            "id": "e6_res_down_mirror",
            "source": "eidolon",
            "name": "春蘭の宿香 (火力計算用)",
            "description": "「浮元」がフィールド上に存在する時、敵全体の全属性耐性-20%。「浮元」が攻撃を行う時、さらに4ヒットする。1ヒットにつき、ランダムな敵単体に霊砂の攻撃力50%分の炎属性ダメージを与える。この時、「浮元」は炎属性弱点を持ち、かつ残り靭性値が0より大きい敵を優先的にターゲットにする。なお、このダメージの削靭値は1ヒットにつき5。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "all",
            "duration": "conditional",
            "minEidolon": 6,
            "stat": "RES_PEN",
            "value": 0.2
        },
        {
            "id": "e2_break_effect",
            "source": "eidolon",
            "name": "垂れ雲に紅香炉",
            "description": "必殺技を発動する時、味方全体の撃破特効+40%、3ターン継続。",
            "defaultActive": false,
            "target": "all",
            "duration": 3,
            "minEidolon": 2,
            "stat": "BREAK_EFFECT",
            "value": 0.4
        }
    ],
    "enemyEffects": [
        {
            "id": "e1_def_down",
            "source": "eidolon",
            "name": "破邪の香り",
            "description": "霊砂の弱点撃破効率+50%。敵が弱点撃破される時、その敵の防御力-20%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 1,
            "stat": "DEF_DOWN",
            "value": 0.2
        },
        {
            "id": "e6_res_down",
            "source": "eidolon",
            "name": "春蘭の宿香",
            "description": "「浮元」がフィールド上に存在する時、敵全体の全属性耐性-20%。「浮元」が攻撃を行う時、さらに4ヒットする。1ヒットにつき、ランダムな敵単体に霊砂の攻撃力50%分の炎属性ダメージを与える。この時、「浮元」は炎属性弱点を持ち、かつ残り靭性値が0より大きい敵を優先的にターゲットにする。なお、このダメージの削靭値は1ヒットにつき5。",
            "defaultActive": false,
            "target": "all",
            "duration": "conditional",
            "minEidolon": 6,
            "stat": "RES_PEN",
            "value": 0.2
        }
    ],
    "selfEffects": [
        {
            "id": "extra2_break_to_atk",
            "source": "extra",
            "name": "昇格2",
            "description": "自身の攻撃力を撃破特効25%分アップする、最大で攻撃力+50%。",
            "defaultActive": false,
            "target": "single",
            "stat": "ATK_PERCENT",
            "compute": "casterRawRatioCap",
            "sourceStat": "breakEffect",
            "ratio": 0.25,
            "cap": 0.5
        }
    ]
});
