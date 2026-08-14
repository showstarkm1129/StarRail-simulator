import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Topaz & Numby",
    "id": "topaz_numby",
    "name": "トパーズ＆カブ",
    "element": "Fire",
    "elementLabel": "炎",
    "path": "The Hunt",
    "rarity": 5,
    "base": {
        "hp": 931,
        "atk": 620,
        "def": 412,
        "spd": 110
    },
    "maxEnergy": 130,
    "traceBonuses": [
        {
            "label": "炎ダメージ",
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
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%83%88%E3%83%91%E3%83%BC%E3%82%BA%EF%BC%86%E3%82%AB%E3%83%96",
        "version": "1.4"
    },
    "skills": {
        "basic": {
            "name": "赤字…",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にトパーズの攻撃力X%分の炎属性ダメージを与える。",
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
            "name": "支払困難？",
            "sourceHeader": "戦闘スキル",
            "type": "follow_up",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に「負債証明」状態を付与し、その敵が受ける追加攻撃のダメージをX%アップする。「負債証明」は最後に付与されたターゲットに対してのみ効果を発揮する。味方のターンが回ってきた時、または味方が行動する時、フィールド上に「負債証明」状態の敵が存在しない場合、トパーズはランダムな敵を「負債証明」状態にする。カブがその敵にトパーズの攻撃力Y%分の炎属性ダメージを与える。この戦闘スキルでダメージを与えた時、追加攻撃を発動したものと見なされる。",
            "levelColumns": [
                "追加攻撃ダメージアップ(X%)",
                "ダメージ倍率(Y%)"
            ],
            "levels": [
                {
                    "atkExtra": 0.25,
                    "atk": 0.75
                },
                {
                    "atkExtra": 0.27,
                    "atk": 0.82
                },
                {
                    "atkExtra": 0.3,
                    "atk": 0.9
                },
                {
                    "atkExtra": 0.32,
                    "atk": 0.97
                },
                {
                    "atkExtra": 0.35,
                    "atk": 1.05
                },
                {
                    "atkExtra": 0.37,
                    "atk": 1.12
                },
                {
                    "atkExtra": 0.4,
                    "atk": 1.21
                },
                {
                    "atkExtra": 0.43,
                    "atk": 1.31
                },
                {
                    "atkExtra": 0.46,
                    "atk": 1.4
                },
                {
                    "atkExtra": 0.5,
                    "atk": 1.5
                },
                {
                    "atkExtra": 0.52,
                    "atk": 1.57
                },
                {
                    "atkExtra": 0.55,
                    "atk": 1.65
                }
            ]
        },
        "ult": {
            "name": "赤字を黒字に！",
            "sourceHeader": "必殺技",
            "type": "buff",
            "target": "single",
            "description": "[強化]カブが「心躍る上昇幅！」状態に入り、ダメージ倍率+X%、会心ダメージ+Y%。「負債証明」状態の敵が味方の通常攻撃、戦闘スキル、または必殺技を受けた時、カブの行動順が50%早まる。カブが攻撃を2回行った後、「心躍る上昇幅！」状態は終了する。",
            "levelColumns": [
                "ダメージ倍率アップ(X%)",
                "会心ダメージアップ(Y%)",
                "消費EP"
            ],
            "levels": [
                {
                    "atk": 0.75,
                    "cdBuff": 0.12,
                    "energyCost": 130
                },
                {
                    "atk": 0.82,
                    "cdBuff": 0.13
                },
                {
                    "atk": 0.9,
                    "cdBuff": 0.15
                },
                {
                    "atk": 0.97,
                    "cdBuff": 0.16
                },
                {
                    "atk": 1.05,
                    "cdBuff": 0.17
                },
                {
                    "atk": 1.12,
                    "cdBuff": 0.18
                },
                {
                    "atk": 1.21,
                    "cdBuff": 0.2
                },
                {
                    "atk": 1.31,
                    "cdBuff": 0.21
                },
                {
                    "atk": 1.4,
                    "cdBuff": 0.23
                },
                {
                    "atk": 1.5,
                    "cdBuff": 0.25
                },
                {
                    "atk": 1.57,
                    "cdBuff": 0.26
                },
                {
                    "atk": 1.65,
                    "cdBuff": 0.27
                }
            ]
        },
        "talent": {
            "name": "ピッグ・マーケット！？",
            "sourceHeader": "天賦",
            "type": "follow_up",
            "target": "single",
            "description": "[単体攻撃]戦闘開始時にカブを召喚する。カブの初期速度は80。カブが行動すると追加攻撃を行い、「負債証明」状態の敵単体にトパーズの攻撃力X%分の炎属性ダメージを与える。「負債証明」状態の敵が味方の追加攻撃を受けた時、カブの行動順が50%早まる。カブ自身のターンでは、行動順を早める効果は発動しない。トパーズが戦闘不能状態になるとカブは消える。",
            "levelColumns": [
                "ダメージ倍率(X%)"
            ],
            "levels": [
                {
                    "atk": 0.75
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
                    "atk": 1.58
                },
                {
                    "atk": 1.65
                }
            ]
        },
        "technique": {
            "name": "公的支援金",
            "sourceHeader": "秘技",
            "type": "heal",
            "target": "single",
            "description": "[強化]操作キャラクターをトパーズに切り替えた時、カブを召喚する。カブは一定範囲内の普通の戦利品とプーマンを自動的に捜索する。秘技を使用すると、次の戦闘でカブが初めて攻撃を行った後、トパーズのEPを60回復する。秘技を使用してマップ内の敵との戦闘に勝利した後、トパーズがパーティに編入されている場合、信用ポイントを獲得する時に追加で少量の信用ポイントを獲得する。この方法を通して、1日に最大で10,000信用ポイントを追加獲得できる。秘技を使用して模擬宇宙の敵との戦闘に勝利した後、追加で少量の宇宙の欠片を獲得し、低確率でランダムな奇物を1つ獲得できる。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "貸越トパーズが通常攻撃でダメージを与えた時、追加攻撃を行ったものと見なされる。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "金融不安トパーズとカブの、炎属性が弱点の敵に対する与ダメージ+15%。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "技術的調整「心躍る上昇幅！」状態のカブが攻撃を行った後、さらにトパーズのEPを10回復する。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "フューチャーズマーケット",
            "description": "「負債証明」状態の敵が追加攻撃を受けた時、「強制執行」状態を付与される。この効果は1回の攻撃で1回まで付与できる。「強制執行」状態の敵が受ける追加攻撃の会心ダメージ+25%、最大で2層累積できる。「負債証明」が解除された時、「強制執行」も解除される。"
        },
        "2": {
            "name": "友好的買収",
            "description": "カブ自身が行動し、攻撃を行った後、トパーズのEPを5回復する。"
        },
        "3": {
            "name": "大を掴み小を放つ",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "迅速処理",
            "description": "カブ自身のターンが回ってきた時、トパーズの行動順が20%早まる。"
        },
        "5": {
            "name": "需要インフレ",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "インセンティブ",
            "description": "「心躍る上昇幅！」状態のカブの攻撃回数+1、攻撃時の炎属性耐性貫通+10%。"
        }
    },
    "partyEffects": [
        {
            "id": "skill_followup_taken_mirror",
            "source": "skill",
            "name": "支払困難？ (火力計算用)",
            "description": "[単体攻撃]指定した敵単体に「負債証明」状態を付与し、その敵が受ける追加攻撃のダメージをX%アップする。「負債証明」は最後に付与されたターゲットに対してのみ効果を発揮する。味方のターンが回ってきた時、または味方が行動する時、フィールド上に「負債証明」状態の敵が存在しない場合、トパーズはランダムな敵を「負債証明」状態にする。カブがその敵にトパーズの攻撃力Y%分の炎属性ダメージを与える。この戦闘スキルでダメージを与えた時、追加攻撃を発動したものと見なされる。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "single",
            "fromLevel": "skill",
            "stat": "DMG_TAKEN_FOLLOWUP",
            "statField": "atkExtra"
        },
        {
            "id": "e1_followup_crit_dmg",
            "source": "eidolon",
            "name": "フューチャーズマーケット",
            "description": "「強制執行」状態の敵が受ける追加攻撃の会心ダメージ+25%、最大2層。",
            "defaultActive": false,
            "target": "single",
            "minEidolon": 1,
            "stat": "CRIT_DMG_FOLLOWUP",
            "value": 0.25,
            "stackable": {
                "max": 2,
                "default": 2
            }
        }
    ],
    "enemyEffects": [
        {
            "id": "skill_followup_taken",
            "source": "skill",
            "name": "支払困難？",
            "description": "[単体攻撃]指定した敵単体に「負債証明」状態を付与し、その敵が受ける追加攻撃のダメージをX%アップする。「負債証明」は最後に付与されたターゲットに対してのみ効果を発揮する。味方のターンが回ってきた時、または味方が行動する時、フィールド上に「負債証明」状態の敵が存在しない場合、トパーズはランダムな敵を「負債証明」状態にする。カブがその敵にトパーズの攻撃力Y%分の炎属性ダメージを与える。この戦闘スキルでダメージを与えた時、追加攻撃を発動したものと見なされる。",
            "defaultActive": false,
            "target": "single",
            "fromLevel": "skill",
            "stat": "DMG_TAKEN_FOLLOWUP",
            "statField": "atkExtra"
        }
    ],
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "extra4_fire_weak_dmg",
            "source": "extra",
            "name": "昇格4",
            "description": "金融不安トパーズとカブの、炎属性が弱点の敵に対する与ダメージ+15%。",
            "stat": "DMG_ALL",
            "value": 0.15
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "ult_crit_dmg",
            "source": "ult",
            "name": "赤字を黒字に！",
            "description": "[強化]カブが「心躍る上昇幅！」状態に入り、ダメージ倍率+X%、会心ダメージ+Y%。「負債証明」状態の敵が味方の通常攻撃、戦闘スキル、または必殺技を受けた時、カブの行動順が50%早まる。カブが攻撃を2回行った後、「心躍る上昇幅！」状態は終了する。",
            "fromLevel": "ult",
            "stat": "CRIT_DMG",
            "statField": "cdBuff"
        },
        {
            "id": "e6_numby_res_pen_followup",
            "source": "eidolon",
            "name": "インセンティブ",
            "description": "「心躍る上昇幅！」状態のカブの攻撃時の炎属性耐性貫通+10%。",
            "defaultActive": false,
            "target": "single",
            "minEidolon": 6,
            "stat": "RES_PEN_FOLLOWUP",
            "value": 0.1
        }
    ]
});
