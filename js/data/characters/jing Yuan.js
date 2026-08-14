import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Jing Yuan",
    "id": "jing_yuan",
    "name": "景元",
    "element": "Lightning",
    "elementLabel": "雷",
    "path": "Erudition",
    "rarity": 5,
    "base": {
        "hp": 1164,
        "atk": 698,
        "def": 485,
        "spd": 99
    },
    "maxEnergy": 130,
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
        "pageUrl": "https://wikiwiki.jp/star-rail/%E6%99%AF%E5%85%83",
        "version": "1.0"
    },
    "skills": {
        "basic": {
            "name": "電光石火",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に景元の攻撃力X%分の雷属性ダメージを与える。",
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
            "name": "紫霄の雷鳴",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]敵全体に景元の攻撃力X%分の雷属性ダメージを与え、「神君」の次ターンの攻撃段数+2。",
            "levelColumns": [
                "全体ダメージ倍率(X%)"
            ],
            "levels": [
                {
                    "atk": 0.5
                },
                {
                    "atk": 0.55
                },
                {
                    "atk": 0.6
                },
                {
                    "atk": 0.65
                },
                {
                    "atk": 0.7
                },
                {
                    "atk": 0.75
                },
                {
                    "atk": 0.81
                },
                {
                    "atk": 0.87
                },
                {
                    "atk": 0.93
                },
                {
                    "atk": 1
                },
                {
                    "atk": 1.05
                },
                {
                    "atk": 1.1
                }
            ]
        },
        "ult": {
            "name": "我が身の輝き",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]敵全体に景元の攻撃力X%分の雷属性ダメージを与え、「神君」の次ターンの攻撃段数+3。",
            "levelColumns": [
                "全体ダメージ倍率(X%)",
                "消費EP"
            ],
            "levels": [
                {
                    "atk": 1.2,
                    "energyCost": 130
                },
                {
                    "atk": 1.28
                },
                {
                    "atk": 1.36
                },
                {
                    "atk": 1.44
                },
                {
                    "atk": 1.52
                },
                {
                    "atk": 1.6
                },
                {
                    "atk": 1.7
                },
                {
                    "atk": 1.8
                },
                {
                    "atk": 1.9
                },
                {
                    "atk": 2
                },
                {
                    "atk": 2.1
                },
                {
                    "atk": 2.2
                }
            ]
        },
        "talent": {
            "name": "退魔の形神",
            "sourceHeader": "天賦",
            "type": "follow_up",
            "target": "bounce",
            "description": "[バウンド]戦闘開始時に「神君」を召喚する。「神君」の初期速度は60、初期攻撃段数は3。「神君」が行動すると追加攻撃を行い、1段の攻撃でランダムな敵単体に景元の攻撃力X%分の雷属性ダメージを与え、隣接する敵にメインターゲットに対する25%分の雷属性ダメージを与える。「神君」の攻撃段数は最大で10段。攻撃段数が1増えるごとに速度+10。「神君」の行動終了後、速度と攻撃段数は初期状態に戻る。景元が戦闘不能状態になると「神君」は消える。景元が行動制限系デバフを受けている間、「神君」も行動できない。",
            "levelColumns": [
                "「神君」のダメージ倍率(X%)"
            ],
            "levels": [
                {
                    "atk": 0.33
                },
                {
                    "atk": 0.36
                },
                {
                    "atk": 0.39
                },
                {
                    "atk": 0.42
                },
                {
                    "atk": 0.46
                },
                {
                    "atk": 0.49
                },
                {
                    "atk": 0.53
                },
                {
                    "atk": 0.57
                },
                {
                    "atk": 0.61
                },
                {
                    "atk": 0.66
                },
                {
                    "atk": 0.69
                },
                {
                    "atk": 0.72
                }
            ]
        },
        "technique": {
            "name": "摂召威霊",
            "sourceHeader": "秘技",
            "type": "buff",
            "target": "single",
            "description": "[強化]秘技を使用した後、次の戦闘開始時、「神君」の1ターン目の攻撃段数+3。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "破陣「神君」の次のターンの攻撃段数が6以上の場合、「神君」の次のターンの会心ダメージ+25%。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "先見戦闘開始時、EPを15回復する。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "遣将戦闘スキルを発動した後、会心率+10%、2ターン継続。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "流星雷霆 山をも砕く",
            "description": "「神君」が攻撃を行う時、指定した敵単体に隣接する敵に対するダメージ倍率が、メインターゲットに対するダメージ倍率25%分アップする。"
        },
        "2": {
            "name": "振るいし矛 地動かし天開く",
            "description": "「神君」が行動した後、景元の通常攻撃、戦闘スキル、必殺技の与ダメージ+20%、2ターン継続。"
        },
        "3": {
            "name": "峰を移りし激雷 天穿つ",
            "description": "必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "刃、雲を巻き 玉沙に落ちる",
            "description": "「神君」の1段の攻撃を行うたび、景元はEPを2回復する。"
        },
        "5": {
            "name": "百戦経て捨てし躯 生死軽んず",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "威光纏う神霊 敵屠る",
            "description": "「神君」が1段の攻撃を行うたび、メインターゲットを被ダメージアップ状態にする。被ダメージアップ状態の敵の被ダメージ+12%、「神君」のその回の攻撃が終了するまで継続、最大で3回累積できる。"
        }
    },
    "partyEffects": [
        {
            "id": "e6_dmg_taken_mirror",
            "source": "eidolon",
            "name": "威光纏う神霊 敵屠る (火力計算用)",
            "description": "「神君」が1段の攻撃を行うたび、メインターゲットを被ダメージアップ状態にする。被ダメージアップ状態の敵の被ダメージ+12%、「神君」のその回の攻撃が終了するまで継続、最大で3回累積できる。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 6,
            "stat": "DMG_TAKEN",
            "value": 0.12,
            "stackable": {
                "max": 3,
                "default": 3
            }
        }
    ],
    "enemyEffects": [
        {
            "id": "e6_dmg_taken",
            "source": "eidolon",
            "name": "威光纏う神霊 敵屠る",
            "description": "「神君」が1段の攻撃を行うたび、メインターゲットを被ダメージアップ状態にする。被ダメージアップ状態の敵の被ダメージ+12%、「神君」のその回の攻撃が終了するまで継続、最大で3回累積できる。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 6,
            "stat": "DMG_TAKEN",
            "value": 0.12,
            "stackable": {
                "max": 3,
                "default": 3
            }
        }
    ],
    "selfEffects": [
        {
            "id": "extra2_lightning_lord_crit_dmg",
            "source": "extra",
            "name": "昇格2",
            "description": "「神君」の次のターンの攻撃段数が6以上の場合、「神君」の次のターンの会心ダメージ+25%。",
            "defaultActive": false,
            "target": "single",
            "stat": "CRIT_DMG_FOLLOWUP",
            "value": 0.25
        },
        {
            "id": "extra6_skill_crit_rate",
            "source": "extra",
            "name": "昇格6",
            "description": "戦闘スキルを発動した後、会心率+10%、2ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "stat": "CRIT_RATE",
            "value": 0.1
        },
        {
            "id": "e2_after_ll_dmg",
            "source": "eidolon",
            "name": "振るいし矛 地動かし天開く",
            "description": "「神君」が行動した後、景元の通常攻撃、戦闘スキル、必殺技の与ダメージ+20%、2ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "minEidolon": 2,
            "stats": {
                "DMG_BASIC": 0.2,
                "DMG_SKILL": 0.2,
                "DMG_ULT": 0.2
            }
        }
    ]
});
