import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Sushang",
    "id": "sushang",
    "name": "素裳",
    "element": "Physical",
    "elementLabel": "物理",
    "path": "The Hunt",
    "rarity": 4,
    "base": {
        "hp": 917,
        "atk": 564,
        "def": 418,
        "spd": 107
    },
    "maxEnergy": 120,
    "traceBonuses": [
        {
            "label": "攻撃力",
            "value": 0.28
        },
        {
            "label": "最大HP",
            "value": 0.18
        },
        {
            "label": "防御力",
            "value": 0.125
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E7%B4%A0%E8%A3%B3",
        "version": "1.0"
    },
    "skills": {
        "basic": {
            "name": "雲騎剣経・月虹",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に素裳の攻撃力X%分の物理ダメージを与える。",
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
            "name": "雲騎剣経・山傾",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に素裳の攻撃力X%分の物理ダメージを与える。最後の1ヒットの後に33%の確率で「剣勢」を発動し、敵に素裳の攻撃力Y%分の物理付加ダメージを与える。敵が弱点撃破状態である場合、「剣勢」は必ず発動する。",
            "levelColumns": [
                "単体ダメージ倍率(X%)",
                "付加ダメージ倍率(Y%)"
            ],
            "levels": [
                {
                    "atk": 1.05,
                    "atk2": 0.5
                },
                {
                    "atk": 1.15,
                    "atk2": 0.55
                },
                {
                    "atk": 1.26,
                    "atk2": 0.6
                },
                {
                    "atk": 1.36,
                    "atk2": 0.65
                },
                {
                    "atk": 1.47,
                    "atk2": 0.7
                },
                {
                    "atk": 1.57,
                    "atk2": 0.75
                },
                {
                    "atk": 1.7,
                    "atk2": 0.81
                },
                {
                    "atk": 1.83,
                    "atk2": 0.87
                },
                {
                    "atk": 1.96,
                    "atk2": 0.93
                },
                {
                    "atk": 2.1,
                    "atk2": 1
                },
                {
                    "atk": 2.2,
                    "atk2": 1.05
                },
                {
                    "atk": 2.31,
                    "atk2": 1.1
                }
            ]
        },
        "ult": {
            "name": "太虚形蘊・燭夜",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に素裳の攻撃力X%分の物理ダメージを与え、素裳が即座に行動する。素裳の攻撃力+Y%、戦闘スキルを発動した時に「剣勢」発動の判定回数+2、2ターン継続。追加の判定で発動した「剣勢」のダメージは本来の50%。",
            "levelColumns": [
                "単体ダメージ倍率(X%)",
                "攻撃力アップ(Y%)",
                "消費EP"
            ],
            "levels": [
                {
                    "atk": 1.92,
                    "atkBuff": 0.18,
                    "energyCost": 120
                },
                {
                    "atk": 2.04,
                    "atkBuff": 0.19
                },
                {
                    "atk": 2.17,
                    "atkBuff": 0.2
                },
                {
                    "atk": 2.3,
                    "atkBuff": 0.21
                },
                {
                    "atk": 2.43,
                    "atkBuff": 0.22
                },
                {
                    "atk": 2.56,
                    "atkBuff": 0.24
                },
                {
                    "atk": 2.72,
                    "atkBuff": 0.25
                },
                {
                    "atk": 2.88,
                    "atkBuff": 0.27
                },
                {
                    "atk": 3.04,
                    "atkBuff": 0.28
                },
                {
                    "atk": 3.2,
                    "atkBuff": 0.3
                },
                {
                    "atk": 3.32,
                    "atkBuff": 0.31
                },
                {
                    "atk": 3.45,
                    "atkBuff": 0.32
                }
            ]
        },
        "talent": {
            "name": "游刃若水",
            "sourceHeader": "天賦",
            "type": "buff",
            "target": "single",
            "description": "[強化]フィールド上の敵が弱点撃破された時、素裳の速度+X%、2ターン継続。",
            "levelColumns": [
                "速度アップ(X%)"
            ],
            "levels": [
                {
                    "spdBuff": 0.15
                },
                {
                    "spdBuff": 0.155
                },
                {
                    "spdBuff": 0.16
                },
                {
                    "spdBuff": 0.165
                },
                {
                    "spdBuff": 0.17
                },
                {
                    "spdBuff": 0.175
                },
                {
                    "spdBuff": 0.1812
                },
                {
                    "spdBuff": 0.1875
                },
                {
                    "spdBuff": 0.1938
                },
                {
                    "spdBuff": 0.2
                },
                {
                    "spdBuff": 0.205
                },
                {
                    "spdBuff": 0.21
                }
            ]
        },
        "technique": {
            "name": "雲騎剣経・叩陣",
            "sourceHeader": "秘技",
            "type": "attack",
            "target": "all",
            "description": "敵を攻撃。戦闘に入った後、敵全体に素裳の攻撃力80%分の物理ダメージを与える。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "純真残りHPが50%以下の場合、敵に攻撃される確率がダウンする。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "逐寇「剣勢」を発動するたび、「剣勢」の与ダメージ+2%、最大で10回累積できる。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "破敵通常攻撃または戦闘スキルを発動した後、フィールドに弱点撃破状態の敵が存在する場合、素裳の行動順が15%早まる。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "游刃有余",
            "description": "弱点撃破状態の敵に対して戦闘スキルを発動した後、SPを1回復する。"
        },
        "2": {
            "name": "其の身、百煉",
            "description": "「剣勢」発動後、素裳の被ダメージ-20%、1ターン継続。"
        },
        "3": {
            "name": "伝古剣流",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "4": {
            "name": "其の心、百辟",
            "description": "素裳の撃破特効+40%。"
        },
        "5": {
            "name": "太虚神意",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "6": {
            "name": "上善若水",
            "description": "天賦の加速効果が累積できるようになる、最大で2層累積できる。戦闘に入った後、素裳は天賦の加速効果を1層獲得する。"
        }
    },
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "ult_atk_percent",
            "source": "ult",
            "name": "太虚形蘊・燭夜",
            "description": "[単体攻撃]指定した敵単体に素裳の攻撃力X%分の物理ダメージを与え、素裳が即座に行動する。素裳の攻撃力+Y%、戦闘スキルを発動した時に「剣勢」発動の判定回数+2、2ターン継続。追加の判定で発動した「剣勢」のダメージは本来の50%。",
            "fromLevel": "ult",
            "stat": "ATK_PERCENT",
            "statField": "atkBuff",
            "duration": 2
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "talent_spd_percent",
            "source": "talent",
            "name": "游刃若水",
            "description": "[強化]フィールド上の敵が弱点撃破された時、素裳の速度+X%、2ターン継続。",
            "fromLevel": "talent",
            "stat": "SPD_PERCENT",
            "statField": "spdBuff",
            "duration": 2
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e4_break_effect",
            "source": "eidolon",
            "name": "其の心、百辟",
            "description": "素裳の撃破特効+40%。",
            "stat": "BREAK_EFFECT",
            "value": 0.4,
            "minEidolon": 4
        },
        {
            "id": "extra4_sword_stance_dmg",
            "source": "extra",
            "name": "昇格4",
            "description": "「剣勢」を発動するたび、「剣勢」の与ダメージ+2%、最大10層。専用ダメージ枠がないため戦闘スキル枠で近似。",
            "defaultActive": false,
            "target": "single",
            "stat": "DMG_SKILL",
            "value": 0.02,
            "stackable": {
                "max": 10,
                "default": 10
            }
        }
    ],
    "partyEffects": [],
    "enemyEffects": []
});
