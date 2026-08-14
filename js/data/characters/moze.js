import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Moze",
    "id": "moze",
    "name": "モゼ",
    "element": "Lightning",
    "elementLabel": "雷",
    "path": "The Hunt",
    "rarity": 4,
    "base": {
        "hp": 812,
        "atk": 599,
        "def": 352,
        "spd": 111
    },
    "maxEnergy": 120,
    "traceBonuses": [
        {
            "label": "会心ダメージ",
            "value": 0.373
        },
        {
            "label": "攻撃力",
            "value": 0.18
        },
        {
            "label": "最大HP",
            "value": 0.1
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%83%A2%E3%82%BC",
        "version": "2.5"
    },
    "skills": {
        "basic": {
            "name": "暗器",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にモゼの攻撃力X%分の雷属性ダメージを与える。",
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
            "name": "急襲する迅羽",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体を「獲物」状態にし、モゼの攻撃力X%分の雷属性ダメージを与え、チャージを9層獲得する。フィールド上に戦闘可能な他の味方キャラがいない時、モゼは戦闘スキルを発動できず、敵の「獲物」状態も解除される。",
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
                    "atk": 1.57
                },
                {
                    "atk": 1.65
                }
            ]
        },
        "ult": {
            "name": "潜む刃、鋭い影",
            "sourceHeader": "必殺技",
            "type": "follow_up",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にモゼの攻撃力X%分の雷属性ダメージを与え、天賦による追加攻撃を行う。この回の追加攻撃を行う前にターゲットが倒された場合、ランダムな敵単体に追加攻撃を行う。",
            "levelColumns": [
                "説明(ステータス)",
                "消費EP"
            ],
            "levels": [
                {
                    "value1": 1.62,
                    "energyCost": 120
                },
                {
                    "value1": 1.72
                },
                {
                    "value1": 1.83
                },
                {
                    "value1": 1.94
                },
                {
                    "value1": 2.05
                },
                {
                    "value1": 2.16
                },
                {
                    "value1": 2.29
                },
                {
                    "value1": 2.43
                },
                {
                    "value1": 2.56
                },
                {
                    "value1": 2.7
                },
                {
                    "value1": 2.8
                },
                {
                    "value1": 2.91
                }
            ]
        },
        "talent": {
            "name": "翼を折りて鋒鋩とす",
            "sourceHeader": "天賦",
            "type": "follow_up",
            "target": "single",
            "description": "[単体攻撃]フィールド上に「獲物」状態の敵がいる時、モゼは一時離脱状態に入る。味方が「獲物」状態の敵を攻撃した後、モゼはその敵に自身の攻撃力X%分の雷属性付加ダメージを与え、チャージを1消費する。チャージを3消費するたびに、モゼは「獲物」状態の敵に対して追加攻撃を1回行い、自身の攻撃力Y%分の雷属性ダメージを与える。チャージが0になると敵の「獲物」状態が解除され、追加攻撃発動に必要なチャージ数がリセットされる。なお、天賦による追加攻撃はチャージを消費しない。",
            "levelColumns": [
                "ダメージ倍率(X%)",
                "ダメージ倍率(Y%)"
            ],
            "levels": [
                {
                    "atk": 0.15,
                    "atk2": 0.8
                },
                {
                    "atk": 0.16,
                    "atk2": 0.88
                },
                {
                    "atk": 0.18,
                    "atk2": 0.96
                },
                {
                    "atk": 0.19,
                    "atk2": 1.04
                },
                {
                    "atk": 0.21,
                    "atk2": 1.12
                },
                {
                    "atk": 0.22,
                    "atk2": 1.2
                },
                {
                    "atk": 0.24,
                    "atk2": 1.3
                },
                {
                    "atk": 0.26,
                    "atk2": 1.4
                },
                {
                    "atk": 0.28,
                    "atk2": 1.5
                },
                {
                    "atk": 0.3,
                    "atk2": 1.6
                },
                {
                    "atk": 0.31,
                    "atk2": 1.68
                },
                {
                    "atk": 0.33,
                    "atk2": 1.76
                }
            ]
        },
        "technique": {
            "name": "見えざる脅威",
            "sourceHeader": "秘技",
            "type": "buff",
            "target": "single",
            "description": "[強化]秘技を使用した後、20秒間継続するステルス状態に入る。ステルス状態の間は敵に発見されない。ステルス状態のモゼが敵を先制攻撃して戦闘に入った時、与ダメージ+30%、2ターン継続。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "烏羽の衣天賦による追加攻撃を行った後、SPを1回復する。この効果は1ターン後に再度発動できる。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "忍び寄る匕首モゼの一時離脱状態が解除される時、行動順+20%。各ウェーブ開始時、モゼの行動順+30%。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "その影、宝剣と共に在り必殺技を発動してダメージを与える時、追加攻撃を行うと見なされる。「獲物」状態の敵が受ける追加攻撃ダメージ+25%。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "立志",
            "description": "戦闘に入った後、モゼはEPを20回復する。天賦による付加ダメージを1回発動するたびに、EPを2回復する。"
        },
        "2": {
            "name": "懲罰",
            "description": "味方が「獲物」状態の敵にダメージを与える時、会心ダメージ+40%。"
        },
        "3": {
            "name": "追撃",
            "description": "必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "隠密",
            "description": "必殺技を発動する時、モゼの与ダメージ+30.0%、2ターン持続。"
        },
        "5": {
            "name": "欺瞞",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "忠誠",
            "description": "天賦による追加攻撃のダメージ倍率+25%。"
        }
    },
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "technique_dmg",
            "source": "technique",
            "name": "見えざる脅威",
            "description": "[強化]秘技を使用した後、20秒間継続するステルス状態に入る。ステルス状態の間は敵に発見されない。ステルス状態のモゼが敵を先制攻撃して戦闘に入った時、与ダメージ+30%、2ターン継続。",
            "stat": "DMG_ALL",
            "value": 0.3,
            "duration": 2
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e4_dmg",
            "source": "eidolon",
            "name": "隠密",
            "description": "必殺技を発動する時、モゼの与ダメージ+30.0%、2ターン持続。",
            "stat": "DMG_ALL",
            "value": 0.3,
            "minEidolon": 4,
            "duration": 2
        },
        {
            "id": "e6_followup_dmg",
            "source": "eidolon",
            "name": "忠誠",
            "description": "天賦による追加攻撃のダメージ倍率+25%。火力比較用に追加攻撃与ダメ枠として近似。",
            "defaultActive": false,
            "target": "single",
            "minEidolon": 6,
            "stat": "DMG_FOLLOWUP",
            "value": 0.25
        }
    ],
    "partyEffects": [
        {
            "id": "extra6_prey_followup_taken_mirror",
            "source": "extra",
            "name": "昇格6 (火力計算用)",
            "description": "「獲物」状態の敵が受ける追加攻撃ダメージ+25%。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "stat": "DMG_TAKEN_FOLLOWUP",
            "value": 0.25
        },
        {
            "id": "e2_prey_crit_dmg",
            "source": "eidolon",
            "name": "懲罰",
            "description": "味方が「獲物」状態の敵にダメージを与える時、会心ダメージ+40%。",
            "defaultActive": false,
            "target": "all",
            "duration": "conditional",
            "minEidolon": 2,
            "stat": "CRIT_DMG",
            "value": 0.4
        }
    ],
    "enemyEffects": [
        {
            "id": "extra6_prey_followup_taken",
            "source": "extra",
            "name": "昇格6",
            "description": "「獲物」状態の敵が受ける追加攻撃ダメージ+25%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "stat": "DMG_TAKEN_FOLLOWUP",
            "value": 0.25
        }
    ]
});
