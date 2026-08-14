import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Ruan Mei",
    "id": "ruan_mei",
    "name": "ルアン・メェイ",
    "element": "Ice",
    "elementLabel": "氷",
    "path": "Harmony",
    "rarity": 5,
    "base": {
        "hp": 1086,
        "atk": 659,
        "def": 485,
        "spd": 104
    },
    "maxEnergy": 130,
    "traceBonuses": [
        {
            "label": "撃破特効",
            "value": 0.373
        },
        {
            "label": "防御力",
            "value": 0.225
        },
        {
            "label": "速度",
            "value": 5
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%83%AB%E3%82%A2%E3%83%B3%E3%83%BB%E3%83%A1%E3%82%A7%E3%82%A4",
        "version": "1.6"
    },
    "skills": {
        "basic": {
            "name": "幽蘭の調べ",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にルアン・メェイの攻撃力X%分の氷属性ダメージを与える。",
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
            "name": "緩く捻りて",
            "sourceHeader": "戦闘スキル",
            "type": "buff",
            "target": "all_ally",
            "description": "[サポート]戦闘スキルを発動した後、ルアン・メェイは3ターン継続する「弦外の音」を獲得する。ルアン・メェイのターンが回ってくるたびに、「弦外の音」の継続時間-1ターン。ルアン・メェイに「弦外の音」がある時、味方全体の与ダメージ+X%、弱点撃破効率+50%。",
            "levelColumns": [
                "与ダメージアップ(X%)"
            ],
            "levels": [
                {
                    "dmgBuff": 0.16
                },
                {
                    "dmgBuff": 0.176
                },
                {
                    "dmgBuff": 0.192
                },
                {
                    "dmgBuff": 0.208
                },
                {
                    "dmgBuff": 0.224
                },
                {
                    "dmgBuff": 0.24
                },
                {
                    "dmgBuff": 0.26
                },
                {
                    "dmgBuff": 0.28
                },
                {
                    "dmgBuff": 0.3
                },
                {
                    "dmgBuff": 0.32
                },
                {
                    "dmgBuff": 0.336
                },
                {
                    "dmgBuff": 0.352
                }
            ]
        },
        "ult": {
            "name": "花に濡れても雫は払わず",
            "sourceHeader": "必殺技",
            "type": "support",
            "target": "all_ally",
            "description": "[サポート]ルアン・メェイが結界を展開する、2ターン継続。ルアン・メェイのターンが回ってくるたびに結界の継続時間-1ターン。結界が存在する時、味方全体の全属性耐性貫通+X%、かつ味方が攻撃を行った後、敵に「残梅」を付与する。敵が弱点撃破状態から回復しようとする時に「残梅」が発動する。敵の弱点撃破状態を延長し、行動順をルアン・メェイの撃破特効20%+10%遅延させ、ルアン・メェイの氷属性弱点撃破ダメージY%分の弱点撃破ダメージを与える。敵が弱点撃破状態から回復するまで、再度「残梅」を付与することはできない。",
            "levelColumns": [
                "全属性耐性貫通(X%)",
                "撃破ダメージ(Y%)",
                "消費EP"
            ],
            "levels": [
                {
                    "resPen": 0.15,
                    "atk": 0.3,
                    "energyCost": 130
                },
                {
                    "resPen": 0.16,
                    "atk": 0.32
                },
                {
                    "resPen": 0.17,
                    "atk": 0.34
                },
                {
                    "resPen": 0.18,
                    "atk": 0.36
                },
                {
                    "resPen": 0.19,
                    "atk": 0.38
                },
                {
                    "resPen": 0.2,
                    "atk": 0.4
                },
                {
                    "resPen": 0.212,
                    "atk": 0.42
                },
                {
                    "resPen": 0.225,
                    "atk": 0.45
                },
                {
                    "resPen": 0.238,
                    "atk": 0.47
                },
                {
                    "resPen": 0.25,
                    "atk": 0.5
                },
                {
                    "resPen": 0.26,
                    "atk": 0.52
                },
                {
                    "resPen": 0.27,
                    "atk": 0.54
                }
            ]
        },
        "talent": {
            "name": "フラクタルの螺旋",
            "sourceHeader": "天賦",
            "type": "support",
            "target": "all_ally",
            "description": "[サポート]自身を除く味方全体の速度+X%。敵を弱点撃破した後、その敵にルアン・メェイの氷属性弱点撃破ダメージY%分の弱点撃破ダメージを与える。",
            "levelColumns": [
                "速度(X%)",
                "撃破ダメージ(Y%)"
            ],
            "levels": [
                {
                    "spdBuff": 0.08,
                    "atk": 0.6
                },
                {
                    "spdBuff": 0.082,
                    "atk": 0.66
                },
                {
                    "spdBuff": 0.084,
                    "atk": 0.72
                },
                {
                    "spdBuff": 0.086,
                    "atk": 0.78
                },
                {
                    "spdBuff": 0.088,
                    "atk": 0.84
                },
                {
                    "spdBuff": 0.09,
                    "atk": 0.9
                },
                {
                    "spdBuff": 0.092,
                    "atk": 0.975
                },
                {
                    "spdBuff": 0.095,
                    "atk": 1.05
                },
                {
                    "spdBuff": 0.098,
                    "atk": 1.125
                },
                {
                    "spdBuff": 0.1,
                    "atk": 1.2
                },
                {
                    "spdBuff": 0.102,
                    "atk": 1.26
                },
                {
                    "spdBuff": 0.104,
                    "atk": 1.32
                }
            ]
        },
        "technique": {
            "name": "琴拭い、霓裳撫でる",
            "sourceHeader": "秘技",
            "type": "attack",
            "target": "all",
            "description": "[強化]秘技を使用した後、「琴拭い、霓裳撫でる」を獲得する。「琴拭い、霓裳撫でる」がある時、次の戦闘開始時に自動で戦闘スキルを1回発動する。この効果発動はSPを消費しない。模擬宇宙の中で、ルアン・メェイに「琴拭い、霓裳撫でる」がある場合、味方が敵を先制攻撃して戦闘に入る時、弱点属性を攻撃して戦闘に入ったと見なされる。また、その回の攻撃は弱点属性を無視して敵全体の靭性を削る。敵を弱点撃破した場合、攻撃者の属性に対応する弱点撃破効果を発動する。所持する祝福1つにつき、さらにその回の攻撃の削靭ダメージ+100%、敵を弱点撃破した後、さらにルアン・メェイの氷属性弱点撃破ダメージ100%分の弱点撃破ダメージを与える。祝福は最大20個までカウントされる。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "呼吸の中味方全体の撃破特効+20%。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "広がる想像ルアン・メェイのターンが回ってきた時、自身のEPを5回復する。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "水面を照らす燭火戦闘中、ルアン・メェイの撃破特効が120%を超えた時、10%超過するにつき、戦闘スキルによる味方全体の与ダメージアップ効果+6%、最大で+36%。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "神経刺繍図",
            "description": "必殺技の結界が発動している間、味方全体がダメージを与えた時、敵の防御力を20%無視する。"
        },
        "2": {
            "name": "通りし芒の道",
            "description": "ルアン・メェイがフィールド上にいる場合、弱点撃破状態の敵に対する味方全体の攻撃力+40%。"
        },
        "3": {
            "name": "煙衫を綾取る緑意",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "4": {
            "name": "銅鏡前にて神を探す",
            "description": "敵が弱点撃破された時、ルアン・メェイの撃破特効+100%、3ターン継続。"
        },
        "5": {
            "name": "気怠く弄る玲瓏釵",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "6": {
            "name": "紗巾脱ぎかけ団扇に落ちる",
            "description": "必殺技を発動して展開する結界の継続時間+1ターン。天賦による弱点撃破ダメージ倍率+200%。"
        }
    },
    "partyEffects": [
        {
            "id": "skill_dmg",
            "source": "skill",
            "name": "緩く捻りて",
            "description": "[サポート]戦闘スキルを発動した後、ルアン・メェイは3ターン継続する「弦外の音」を獲得する。ルアン・メェイのターンが回ってくるたびに、「弦外の音」の継続時間-1ターン。ルアン・メェイに「弦外の音」がある時、味方全体の与ダメージ+X%、弱点撃破効率+50%。",
            "defaultActive": false,
            "target": "all",
            "duration": 3,
            "fromLevel": "skill",
            "stat": "DMG_ALL",
            "statField": "dmgBuff"
        },
        {
            "id": "ult_res_pen",
            "source": "ult",
            "name": "花に濡れても雫は払わず",
            "description": "[サポート]ルアン・メェイが結界を展開する、2ターン継続。ルアン・メェイのターンが回ってくるたびに結界の継続時間-1ターン。結界が存在する時、味方全体の全属性耐性貫通+X%、かつ味方が攻撃を行った後、敵に「残梅」を付与する。敵が弱点撃破状態から回復しようとする時に「残梅」が発動する。敵の弱点撃破状態を延長し、行動順をルアン・メェイの撃破特効20%+10%遅延させ、ルアン・メェイの氷属性弱点撃破ダメージY%分の弱点撃破ダメージを与える。敵が弱点撃破状態から回復するまで、再度「残梅」を付与することはできない。",
            "defaultActive": false,
            "target": "all",
            "duration": 2,
            "fromLevel": "ult",
            "stat": "RES_PEN",
            "statField": "resPen"
        },
        {
            "id": "talent_spd_percent",
            "source": "talent",
            "name": "フラクタルの螺旋",
            "description": "[サポート]自身を除く味方全体の速度+X%。敵を弱点撃破した後、その敵にルアン・メェイの氷属性弱点撃破ダメージY%分の弱点撃破ダメージを与える。",
            "defaultActive": false,
            "target": "all",
            "fromLevel": "talent",
            "stat": "SPD_PERCENT",
            "statField": "spdBuff"
        },
        {
            "id": "e1_def_ignore",
            "source": "eidolon",
            "name": "神経刺繍図",
            "description": "必殺技の結界が発動している間、味方全体がダメージを与えた時、敵の防御力を20%無視する。",
            "defaultActive": false,
            "target": "all",
            "duration": "conditional",
            "minEidolon": 1,
            "stat": "DEF_IGNORE",
            "value": 0.2
        },
        {
            "id": "e2_atk_percent",
            "source": "eidolon",
            "name": "通りし芒の道",
            "description": "ルアン・メェイがフィールド上にいる場合、弱点撃破状態の敵に対する味方全体の攻撃力+40%。",
            "defaultActive": false,
            "target": "all",
            "duration": "conditional",
            "minEidolon": 2,
            "stat": "ATK_PERCENT",
            "value": 0.4
        },
        {
            "id": "extra2_break_effect",
            "source": "extra",
            "name": "昇格2",
            "description": "呼吸の中味方全体の撃破特効+20%。",
            "defaultActive": true,
            "target": "all",
            "duration": "permanent",
            "stat": "BREAK_EFFECT",
            "value": 0.2
        },
        {
            "id": "extra6_break_to_skill_dmg_extra",
            "source": "extra",
            "name": "昇格6",
            "description": "ルアン・メェイの撃破特効が120%を超えた時、10%超過するにつき、戦闘スキルによる味方全体の与ダメージアップ効果+6%、最大+36%。",
            "defaultActive": false,
            "target": "all",
            "stat": "DMG_ALL",
            "compute": "casterDerivedExcessStepCap",
            "sourceStat": "breakEffect",
            "threshold": 1.2,
            "step": 0.1,
            "valuePerStep": 0.06,
            "cap": 0.36
        }
    ],
    "enemyEffects": [],
    "selfEffects": [
        {
            "id": "e4_break_effect",
            "source": "eidolon",
            "name": "銅鏡前にて神を探す",
            "description": "敵が弱点撃破された時、ルアン・メェイの撃破特効+100%、3ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 3,
            "minEidolon": 4,
            "stat": "BREAK_EFFECT",
            "value": 1
        }
    ]
});
