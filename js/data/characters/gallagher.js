import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Gallagher",
    "id": "gallagher",
    "name": "ギャラガー",
    "element": "Fire",
    "elementLabel": "炎",
    "path": "Abundance",
    "rarity": 4,
    "base": {
        "hp": 1305,
        "atk": 529,
        "def": 441,
        "spd": 98
    },
    "maxEnergy": 110,
    "traceBonuses": [
        {
            "label": "効果抵抗",
            "value": 0.28
        },
        {
            "label": "最大HP",
            "value": 0.18
        },
        {
            "label": "撃破特効",
            "value": 0.133
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%82%AE%E3%83%A3%E3%83%A9%E3%82%AC%E3%83%BC",
        "version": "2.1"
    },
    "skills": {
        "basic": {
            "name": "持ち込み料",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にギャラガーの攻撃力X%分の炎属性ダメージを与える。",
            "levelColumns": [
                "持ち込み料",
                "極上の泡立ち"
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
            "name": "特製ドリンク",
            "sourceHeader": "戦闘スキル",
            "type": "heal",
            "target": "single_ally",
            "description": "[回復]指定した味方単体のHPをX回復する。",
            "levelColumns": [
                "回復量(X)"
            ],
            "levels": [
                {
                    "healPct": 200
                },
                {
                    "healPct": 340
                },
                {
                    "healPct": 480
                },
                {
                    "healPct": 676
                },
                {
                    "healPct": 830
                },
                {
                    "healPct": 984
                },
                {
                    "healPct": 1138
                },
                {
                    "healPct": 1292
                },
                {
                    "healPct": 1446
                },
                {
                    "healPct": 1600
                },
                {
                    "healPct": 1684
                },
                {
                    "healPct": 1768
                }
            ]
        },
        "ult": {
            "name": "シャンパン・マナー",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]敵全体を「酩酊」状態にする、2ターン継続。敵全体にギャラガーの攻撃力X%分の炎属性ダメージを与え、次の通常攻撃を「極上の泡立ち」に強化する。",
            "levelColumns": [
                "全体ダメージ倍率(X%)",
                "消費EP"
            ],
            "levels": [
                {
                    "atk": 0.75,
                    "energyCost": 110
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
        "talent": {
            "name": "飲み比べ",
            "sourceHeader": "天賦",
            "type": "heal",
            "target": "single",
            "description": "[回復]「酩酊」状態の敵が受ける弱点撃破ダメージ+X%。「酩酊」状態の敵が味方の攻撃を受けるたびに、攻撃者のHPをY回復する。",
            "levelColumns": [
                "弱点撃破ダメージアップ(X%)",
                "回復量(Y)"
            ],
            "levels": [
                {
                    "hpPct": 0.06,
                    "healPct": 80
                },
                {
                    "hpPct": 0.066,
                    "healPct": 136
                },
                {
                    "hpPct": 0.072,
                    "healPct": 192
                },
                {
                    "hpPct": 0.078,
                    "healPct": 270
                },
                {
                    "hpPct": 0.084,
                    "healPct": 332
                },
                {
                    "hpPct": 0.09,
                    "healPct": 393
                },
                {
                    "hpPct": 0.097,
                    "healPct": 455
                },
                {
                    "hpPct": 0.105,
                    "healPct": 516
                },
                {
                    "hpPct": 0.112,
                    "healPct": 578
                },
                {
                    "hpPct": 0.12,
                    "healPct": 640
                },
                {
                    "hpPct": 0.126,
                    "healPct": 673
                },
                {
                    "hpPct": 0.132,
                    "healPct": 707
                }
            ]
        },
        "technique": {
            "name": "ヴィンテージ開封",
            "sourceHeader": "秘技",
            "type": "attack",
            "target": "all",
            "description": "敵を攻撃。戦闘に入った後、敵全体を「酩酊」状態にする、2ターン継続。敵全体にギャラガーの攻撃力50%分の炎属性ダメージを与える。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "新レシピ自身の治癒量が、撃破特効の50%分アップする。最大で治癒量+75%。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "天然酵母必殺技を発動した後、自身の行動順を100%早める。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "乾杯！ギャラガーが「極上の泡立ち」で「酩酊」状態の敵を攻撃する時、その回の天賦によるHP回復効果は自身以外の味方にも有効になる。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "ソルティ・ドッグ",
            "description": "戦闘に入った後、ギャラガーはEPを20回復する。同時にギャラガーの効果抵抗+50%。"
        },
        "2": {
            "name": "レオ・ザ・ライオン",
            "description": "戦闘スキルを発動した時、指定した味方単体のデバフを1つ解除し、その味方の効果抵抗+30%、2ターン継続。"
        },
        "3": {
            "name": "コープス・リバイバー",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "ラスト・ワード",
            "description": "ギャラガーの必殺技が付与する「酩酊」状態の継続時間+1ターン。"
        },
        "5": {
            "name": "デス・イン・ジ・アフタヌーン",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "ブラッド・アンド・サンド",
            "description": "ギャラガーの撃破特効+20%、弱点撃破効率+20%。"
        }
    },
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "e6_break_effect",
            "source": "eidolon",
            "name": "ブラッド・アンド・サンド",
            "description": "ギャラガーの撃破特効+20%、弱点撃破効率+20%。",
            "stat": "BREAK_EFFECT",
            "value": 0.2,
            "minEidolon": 6
        },
        {
            "id": "e1_effect_res",
            "source": "eidolon",
            "name": "ソルティ・ドッグ",
            "description": "戦闘に入った後、ギャラガーの効果抵抗+50%。",
            "defaultActive": false,
            "target": "single",
            "minEidolon": 1,
            "stat": "EFFECT_RES",
            "value": 0.5
        }
    ],
    "partyEffects": [
        {
            "id": "e2_ally_effect_res",
            "source": "eidolon",
            "name": "レオ・ザ・ライオン",
            "description": "戦闘スキルを発動した時、指定した味方単体の効果抵抗+30%、2ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "minEidolon": 2,
            "stat": "EFFECT_RES",
            "value": 0.3
        }
    ],
    "enemyEffects": []
});
