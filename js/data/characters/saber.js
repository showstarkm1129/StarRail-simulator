import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Saber",
    "id": "saber",
    "name": "セイバー",
    "element": "Wind",
    "elementLabel": "風",
    "path": "Destruction",
    "rarity": 5,
    "base": {
        "hp": 1241,
        "atk": 601,
        "def": 654,
        "spd": 101
    },
    "maxEnergy": 360,
    "traceBonuses": [
        {
            "label": "風ダメージ",
            "value": 0.224
        },
        {
            "label": "会心率",
            "value": 0.12
        },
        {
            "label": "最大HP",
            "value": 0.1
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%82%BB%E3%82%A4%E3%83%90%E3%83%BC",
        "version": "3.4"
    },
    "skills": {
        "basic": {
            "name": "風王結界(インビジブル・エア)",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にセイバーの攻撃力X%分の風属性ダメージを与える。",
            "levelColumns": [
                "風王結界(インビジブル・エア)",
                "解放されし黄金の王権"
            ],
            "levels": [
                {
                    "atk": 0.5,
                    "atkAlt2": 0.75
                },
                {
                    "atk": 0.6,
                    "atkAlt2": 0.9
                },
                {
                    "atk": 0.7,
                    "atkAlt2": 1.05
                },
                {
                    "atk": 0.8,
                    "atkAlt2": 1.2
                },
                {
                    "atk": 0.9,
                    "atkAlt2": 1.35
                },
                {
                    "atk": 1,
                    "atkAlt2": 1.5
                },
                {
                    "atk": 1.1,
                    "atkAlt2": 1.65
                }
            ]
        },
        "skill": {
            "name": "風王鉄槌(ストライク・エア)",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "blast",
            "description": "[拡散攻撃]指定した敵単体にセイバーの攻撃力X%分の風属性ダメージを与え、隣接する敵にセイバーの攻撃力Y%分の風属性ダメージを与える。「炉心共鳴」を所持し、かつその回の戦闘スキルで「炉心共鳴」を消費してセイバーのEPを満タンまで回復できる場合、所持している「炉心共鳴」1層につき、その回の戦闘スキルのダメージ倍率+Z%。そして、攻撃を行った後に「炉心共鳴」を消費し、セイバーのEPを回復する。「炉心共鳴」を所持していない、または所持しているすべての「炉心共鳴」を消費してもEPを満タンまで回復できない場合、即座に「炉心共鳴」を3層獲得する。",
            "levelColumns": [
                "単体ダメージ倍率(X%)",
                "隣接ダメージ倍率(Y%)",
                "「炉心共鳴」1層ごとのダメージ倍率アップ(Z%)"
            ],
            "levels": [
                {
                    "atk": 0.75,
                    "atkAdjacent": 0.37,
                    "atk2": 0.07
                },
                {
                    "atk": 0.82,
                    "atkAdjacent": 0.41,
                    "atk2": 0.077
                },
                {
                    "atk": 0.9,
                    "atkAdjacent": 0.45,
                    "atk2": 0.084
                },
                {
                    "atk": 0.97,
                    "atkAdjacent": 0.48,
                    "atk2": 0.091
                },
                {
                    "atk": 1.05,
                    "atkAdjacent": 0.52,
                    "atk2": 0.098
                },
                {
                    "atk": 1.12,
                    "atkAdjacent": 0.56,
                    "atk2": 0.105
                },
                {
                    "atk": 1.2,
                    "atkAdjacent": 0.6,
                    "atk2": 0.114
                },
                {
                    "atk": 1.31,
                    "atkAdjacent": 0.65,
                    "atk2": 0.122
                },
                {
                    "atk": 1.4,
                    "atkAdjacent": 0.7,
                    "atk2": 0.131
                },
                {
                    "atk": 1.5,
                    "atkAdjacent": 0.75,
                    "atk2": 0.14
                },
                {
                    "atk": 1.6,
                    "atkAdjacent": 0.8,
                    "atk2": 0.15
                },
                {
                    "atk": 1.7,
                    "atkAdjacent": 0.85,
                    "atk2": 0.16
                }
            ]
        },
        "ult": {
            "name": "約束された勝利の剣(エクスカリバー)",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]敵全体にセイバーの攻撃力X%分の風属性ダメージを与える。さらに10ヒットする。1ヒットごとにランダムな敵単体にセイバーの攻撃力Y%分の風属性ダメージを与える。必殺技を発動した後、次の通常攻撃が「解放されし黄金の王権」に強化され、「解放されし黄金の王権」のみ発動できるようになる。",
            "levelColumns": [
                "全体ダメージ倍率(X％)",
                "1ヒットごとのダメージ倍率(Y％)",
                "消費EP"
            ],
            "levels": [
                {
                    "atkAll": 1.4,
                    "atk": 0.55,
                    "energyCost": 360
                },
                {
                    "atkAll": 1.54,
                    "atk": 0.6
                },
                {
                    "atkAll": 1.68,
                    "atk": 0.66
                },
                {
                    "atkAll": 1.82,
                    "atk": 0.71
                },
                {
                    "atkAll": 1.96,
                    "atk": 0.77
                },
                {
                    "atkAll": 2.1,
                    "atk": 0.82
                },
                {
                    "atkAll": 2.27,
                    "atk": 0.89
                },
                {
                    "atkAll": 2.45,
                    "atk": 0.96
                },
                {
                    "atkAll": 2.62,
                    "atk": 1.03
                },
                {
                    "atkAll": 2.8,
                    "atk": 1.1
                },
                {
                    "atkAll": 2.94,
                    "atk": 1.15
                },
                {
                    "atkAll": 3.08,
                    "atk": 1.21
                }
            ]
        },
        "talent": {
            "name": "竜の炉心(ドラゴンハート)",
            "sourceHeader": "天賦",
            "type": "heal",
            "target": "single",
            "description": "[強化]戦闘に入る時、「炉心共鳴」を1層獲得する。任意の味方が必殺技を発動する時、セイバーの与ダメージX%、2ターン継続。同時に「炉心共鳴」を3層獲得する。「炉心共鳴」を1層消費するたび、セイバーはEPを固定で8.0回復する。",
            "levelColumns": [
                "与ダメージアップ(X%)"
            ],
            "levels": [
                {
                    "dmgBuff": 0.3
                },
                {
                    "dmgBuff": 0.33
                },
                {
                    "dmgBuff": 0.36
                },
                {
                    "dmgBuff": 0.39
                },
                {
                    "dmgBuff": 0.42
                },
                {
                    "dmgBuff": 0.45
                },
                {
                    "dmgBuff": 0.48
                },
                {
                    "dmgBuff": 0.52
                },
                {
                    "dmgBuff": 0.56
                },
                {
                    "dmgBuff": 0.6
                },
                {
                    "dmgBuff": 0.63
                },
                {
                    "dmgBuff": 0.66
                }
            ]
        },
        "technique": {
            "name": "騎士王の出陣",
            "sourceHeader": "秘技",
            "type": "buff",
            "target": "single",
            "description": "[強化]秘技を使用した後、次の戦闘開始時、セイバーの攻撃力+35%、2ターン継続。「炉心共鳴」を2層獲得する。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "竜の騎士セイバーの会心率+20%。戦闘に入る時、または強化通常攻撃を発動する時、「魔力放出」を獲得する。「魔力放出」を持つ時にセイバーが「炉心共鳴」を持ち、かつ戦闘スキルの発動で「炉心共鳴」を消費してセイバーのEPを満タンに回復できる場合、「魔力放出」を消費してSPを1回復し、セイバーを即座に行動させる。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "湖の祝福セイバーは最大EPを超えた分のEPを120まで蓄積できる。必殺技を発動した後、上限を超えて蓄積された分のEPを回復し、蓄積した超過分はクリアする。戦闘開始時、EPが60%未満の場合、60%まで回復する。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "星の冠戦闘スキルを発動する時、セイバーの会心ダメージ+50%、2ターン継続。今回の戦闘で「炉心共鳴」を1層獲得するごとに、セイバーの会心ダメージ+4%、この効果は最大で8層累積できる。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "失われた白亜の城",
            "description": "セイバーの必殺技ダメージ+60%。セイバーが通常攻撃または戦闘スキルを発動した後、「炉心共鳴」を1層獲得する。"
        },
        "2": {
            "name": "塵に埋もれた円卓の誓い",
            "description": "今回の戦闘で「炉心共鳴」を1層獲得するたびに、セイバーの与ダメージが敵の防御力を1.0%無視する。この効果は最大で15層累積できる。「炉心共鳴」による戦闘スキルのダメージ倍率アップ効果が発動する時、「炉心共鳴」1層につき、その回の戦闘スキルのダメージ倍率がさらに7%アップする。"
        },
        "3": {
            "name": "十五世紀を越えた願い",
            "description": "必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "十六の夜にわたる冬の邂逅",
            "description": "セイバーの風属性耐性貫通+8%。必殺技を発動した後、セイバーの風属性耐性貫通+4%、この効果は最大で3層累積できる。"
        },
        "5": {
            "name": "理想に辿り着いた暁に",
            "description": "戦闘スキルのLv.+2、最大Lｖ.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "運命の夜を護る者",
            "description": "セイバーの必殺技ダメージの風属性耐性貫通+20%。軌跡「湖の祝福」で蓄積できる超過分のEPが200になる。戦闘中に初めて必殺技を発動した後、固定でセイバーのEPを300回復する。その後、EP回復効果は必殺技を3回発動するごとに1回発動する。"
        }
    },
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "technique_atk_percent",
            "source": "technique",
            "name": "騎士王の出陣",
            "description": "[強化]秘技を使用した後、次の戦闘開始時、セイバーの攻撃力+35%、2ターン継続。「炉心共鳴」を2層獲得する。",
            "stat": "ATK_PERCENT",
            "value": 0.35,
            "duration": 2
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "extra2_crit_rate",
            "source": "extra",
            "name": "昇格2",
            "description": "竜の騎士セイバーの会心率+20%。戦闘に入る時、または強化通常攻撃を発動する時、「魔力放出」を獲得する。「魔力放出」を持つ時にセイバーが「炉心共鳴」を持ち、かつ戦闘スキルの発動で「炉心共鳴」を消費してセイバーのEPを満タンに回復できる場合、「魔力放出」を消費してSPを1回復し、セイバーを即座に行動させる。",
            "stat": "CRIT_RATE",
            "value": 0.2
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "extra6_crit_dmg",
            "source": "extra",
            "name": "昇格6",
            "description": "星の冠戦闘スキルを発動する時、セイバーの会心ダメージ+50%、2ターン継続。今回の戦闘で「炉心共鳴」を1層獲得するごとに、セイバーの会心ダメージ+4%、この効果は最大で8層累積できる。",
            "stat": "CRIT_DMG",
            "value": 0.5,
            "duration": 2
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "extra6_core_crit_dmg",
            "source": "extra",
            "name": "昇格6",
            "description": "星の冠戦闘スキルを発動する時、セイバーの会心ダメージ+50%、2ターン継続。今回の戦闘で「炉心共鳴」を1層獲得するごとに、セイバーの会心ダメージ+4%、この効果は最大で8層累積できる。",
            "stat": "CRIT_DMG",
            "value": 0.04,
            "stackable": {
                "max": 8,
                "default": 8
            }
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e2_def_ignore",
            "source": "eidolon",
            "name": "塵に埋もれた円卓の誓い",
            "description": "今回の戦闘で「炉心共鳴」を1層獲得するたびに、セイバーの与ダメージが敵の防御力を1.0%無視する。この効果は最大で15層累積できる。「炉心共鳴」による戦闘スキルのダメージ倍率アップ効果が発動する時、「炉心共鳴」1層につき、その回の戦闘スキルのダメージ倍率がさらに7%アップする。",
            "stat": "DEF_IGNORE",
            "value": 0.01,
            "minEidolon": 2,
            "stackable": {
                "max": 15,
                "default": 15
            }
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e4_wind_res_pen_base",
            "source": "eidolon",
            "name": "十六の夜にわたる冬の邂逅",
            "description": "セイバーの風属性耐性貫通+8%。必殺技を発動した後、セイバーの風属性耐性貫通+4%、この効果は最大で3層累積できる。",
            "stat": "RES_PEN",
            "value": 0.08,
            "minEidolon": 4
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e4_wind_res_pen_stack",
            "source": "eidolon",
            "name": "十六の夜にわたる冬の邂逅",
            "description": "セイバーの風属性耐性貫通+8%。必殺技を発動した後、セイバーの風属性耐性貫通+4%、この効果は最大で3層累積できる。",
            "stat": "RES_PEN",
            "value": 0.04,
            "minEidolon": 4,
            "stackable": {
                "max": 3,
                "default": 3
            }
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e6_ult_res_pen",
            "source": "eidolon",
            "name": "運命の夜を護る者",
            "description": "セイバーの必殺技ダメージの風属性耐性貫通+20%。",
            "stat": "RES_PEN_ULT",
            "value": 0.2,
            "minEidolon": 6
        },
        {
            "id": "e1_ult_dmg",
            "source": "eidolon",
            "name": "失われた白亜の城",
            "description": "セイバーの必殺技ダメージ+60%。",
            "defaultActive": false,
            "target": "single",
            "minEidolon": 1,
            "stat": "DMG_ULT",
            "value": 0.6
        }
    ],
    "partyEffects": [],
    "enemyEffects": []
});
