import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Anaxa",
    "id": "anaxa",
    "name": "アナイクス",
    "element": "Wind",
    "elementLabel": "風",
    "path": "Erudition",
    "rarity": 5,
    "base": {
        "hp": 970,
        "atk": 756,
        "def": 557,
        "spd": 97
    },
    "maxEnergy": 140,
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
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%82%A2%E3%83%8A%E3%82%A4%E3%82%AF%E3%82%B9",
        "version": "3.2"
    },
    "skills": {
        "basic": {
            "name": "苦痛、認識の造成",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にアナイクスの攻撃力X%分の風属性ダメージを与える。",
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
            "name": "分形、誤謬の駆逐",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "bounce",
            "description": "[バウンド]指定した敵単体にアナイクスの攻撃力X%分の風属性ダメージを与え、さらに4ヒットする。1ヒットごとに、ランダムな敵単体に敵単体にアナイクスの攻撃力Y%分の風属性ダメージを与える。バウンドはその回の戦闘スキルの攻撃を受けていない敵が優先される。発動時、フィールド上に攻撃可能な敵が1体いるごとに、その回の戦闘スキルによるダメージ+20%。",
            "levelColumns": [
                "単体ダメージ倍率(X%)",
                "バウンドダメージ倍率(Y%)"
            ],
            "levels": [
                {
                    "atk": 0.35,
                    "atk2": 0.35
                },
                {
                    "atk": 0.38,
                    "atk2": 0.38
                },
                {
                    "atk": 0.42,
                    "atk2": 0.42
                },
                {
                    "atk": 0.45,
                    "atk2": 0.45
                },
                {
                    "atk": 0.49,
                    "atk2": 0.49
                },
                {
                    "atk": 0.52,
                    "atk2": 0.52
                },
                {
                    "atk": 0.56,
                    "atk2": 0.56
                },
                {
                    "atk": 0.61,
                    "atk2": 0.61
                },
                {
                    "atk": 0.65,
                    "atk2": 0.65
                },
                {
                    "atk": 0.7,
                    "atk2": 0.7
                },
                {
                    "atk": 0.73,
                    "atk2": 0.73
                },
                {
                    "atk": 0.77,
                    "atk2": 0.77
                }
            ]
        },
        "ult": {
            "name": "化育、世界の創造",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]敵全体を「昇華」状態にした後、アナイクスの攻撃力X%分の風属性ダメージを与える。「昇華」状態の敵は、物理、炎、氷、雷、風、量子、虚数属性を弱点として付与される。この効果はその敵のターンが回ってくるまで継続。敵が行動制限抵抗を持たない場合、「昇華」状態での行動はできない。",
            "levelColumns": [
                "ダメージ倍率(X%)",
                "消費EP"
            ],
            "levels": [
                {
                    "atk": 0.8,
                    "energyCost": 140
                },
                {
                    "atk": 0.88
                },
                {
                    "atk": 0.96
                },
                {
                    "atk": 1.04
                },
                {
                    "atk": 1.12
                },
                {
                    "atk": 1.2
                },
                {
                    "atk": 1.3
                },
                {
                    "atk": 1.4
                },
                {
                    "atk": 1.5
                },
                {
                    "atk": 1.6
                },
                {
                    "atk": 1.68
                },
                {
                    "atk": 1.76
                }
            ]
        },
        "talent": {
            "name": "四智、三重の無上",
            "sourceHeader": "天賦",
            "type": "debuff",
            "target": "single",
            "description": "[妨害]アナイクスの攻撃が敵に1回命中するたびに、ターゲットに弱点属性をランダムで1つ付与する。3ターン継続。この時ターゲットが持っていない弱点属性を優先的に付与する。アナイクスがフィールドにいる時、異なる弱点属性を5つ以上持つ敵は「本質暴露」状態になる。「本質暴露」状態の敵に対して、アナイクスの与ダメージ+X%。さらにアナイクスが「本質暴露」状態の敵に通常攻撃または戦闘スキルを発動した時、ターゲットに戦闘スキルを追加で1回発動する。なお、追加の戦闘スキルはSPが消費されず、この効果も再度発動されない。追加の戦闘スキルを発動する前にターゲットが倒された場合、ランダムな敵単体に対して発動する。",
            "levelColumns": [
                "与ダメージアップ(X%)"
            ],
            "levels": [
                {
                    "dmgBuff": 0.18
                },
                {
                    "dmgBuff": 0.19
                },
                {
                    "dmgBuff": 0.2
                },
                {
                    "dmgBuff": 0.21
                },
                {
                    "dmgBuff": 0.22
                },
                {
                    "dmgBuff": 0.24
                },
                {
                    "dmgBuff": 0.25
                },
                {
                    "dmgBuff": 0.27
                },
                {
                    "dmgBuff": 0.28
                },
                {
                    "dmgBuff": 0.3
                },
                {
                    "dmgBuff": 0.315
                },
                {
                    "dmgBuff": 0.33
                }
            ]
        },
        "technique": {
            "name": "瞳の中の色彩",
            "sourceHeader": "秘技",
            "type": "debuff",
            "target": "single",
            "description": "[妨害]秘技を使用した後、一定範囲内の敵を恐怖状態にする。恐怖状態の敵はアナイクスから離れていく。10秒間継続。味方が恐怖状態の敵を攻撃した時、敵の弱点を攻撃して戦闘に入ったものと見なされる。戦闘に入った後、アナイクスは敵それぞれに攻撃者の属性弱点属性として1つ付与する、3ターン継続。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "流浪の記号通常攻撃を行う時、さらにEPを10回復する。ターンが回ってきた時、フィールド上に「本質暴露」状態の敵がいない場合、EPを30回復する。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "必要な空白パーティー内の「知恵」の運命を歩むキャラクターの数に応じて、今回の戦闘で以下どちらかの効果を発動する。1名の場合、アナイクスの会心ダメージ+140%。2名以上の場合、味方全体の与ダメージ+50%。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "定性の変遷敵が持つ異なる弱点属性1つにつき、アナイクスが与えるダメージはその敵の防御力を4%無視する。弱点属性は最大7つまでカウントされる。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "掩蔽の魔術師",
            "description": "戦闘スキルを初めて発動した後、SPを1回復する。戦闘スキルが敵に命中する時、敵の防御力-16%、2ターン継続。"
        },
        "2": {
            "name": "史実の自然人",
            "description": "敵が戦闘に入る時、天賦の弱点付与効果を1回発動し、その敵の全属性耐性を20%ダウンさせる。"
        },
        "3": {
            "name": "深宇宙に刻まれた瞳",
            "description": "必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "峡谷に落ちる灼熱",
            "description": "戦闘スキルを発動する時、攻撃力+30%、2ターン継続。この効果は最大で2層獲得できる。"
        },
        "5": {
            "name": "渦状腕外の胚種",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "万物は万物の中",
            "description": "アナイクスの与ダメージは本来の130%になる。軌跡「必要な余白」の2つの効果は同時に直接発動するようになり、パーティ内の「知恵」の運命を歩むキャラクターの数に依存しなくなる。"
        }
    },
    "partyEffects": [
        {
            "id": "extra4_party_dmg",
            "source": "extra",
            "name": "昇格4",
            "description": "必要な空白パーティー内の「知恵」の運命を歩むキャラクターの数に応じて、今回の戦闘で以下どちらかの効果を発動する。1名の場合、アナイクスの会心ダメージ+140%。2名以上の場合、味方全体の与ダメージ+50%。",
            "defaultActive": true,
            "target": "all",
            "duration": "conditional",
            "stat": "DMG_ALL",
            "value": 0.5
        },
        {
            "id": "e1_def_down_mirror",
            "source": "eidolon",
            "name": "掩蔽の魔術師 (火力計算用)",
            "description": "戦闘スキルを初めて発動した後、SPを1回復する。戦闘スキルが敵に命中する時、敵の防御力-16%、2ターン継続。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "minEidolon": 1,
            "stat": "DEF_DOWN",
            "value": 0.16
        },
        {
            "id": "e2_res_down_mirror",
            "source": "eidolon",
            "name": "史実の自然人 (火力計算用)",
            "description": "敵が戦闘に入る時、天賦の弱点付与効果を1回発動し、その敵の全属性耐性を20%ダウンさせる。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 2,
            "stat": "RES_PEN",
            "value": 0.2
        }
    ],
    "enemyEffects": [
        {
            "id": "e1_def_down",
            "source": "eidolon",
            "name": "掩蔽の魔術師",
            "description": "戦闘スキルを初めて発動した後、SPを1回復する。戦闘スキルが敵に命中する時、敵の防御力-16%、2ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "minEidolon": 1,
            "stat": "DEF_DOWN",
            "value": 0.16
        },
        {
            "id": "e2_res_down",
            "source": "eidolon",
            "name": "史実の自然人",
            "description": "敵が戦闘に入る時、天賦の弱点付与効果を1回発動し、その敵の全属性耐性を20%ダウンさせる。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 2,
            "stat": "RES_PEN",
            "value": 0.2
        }
    ],
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "talent_dmg",
            "source": "talent",
            "name": "四智、三重の無上",
            "description": "[妨害]アナイクスの攻撃が敵に1回命中するたびに、ターゲットに弱点属性をランダムで1つ付与する。3ターン継続。この時ターゲットが持っていない弱点属性を優先的に付与する。アナイクスがフィールドにいる時、異なる弱点属性を5つ以上持つ敵は「本質暴露」状態になる。「本質暴露」状態の敵に対して、アナイクスの与ダメージ+X%。さらにアナイクスが「本質暴露」状態の敵に通常攻撃または戦闘スキルを発動した時、ターゲットに戦闘スキルを追加で1回発動する。なお、追加の戦闘スキルはSPが消費されず、この効果も再度発動されない。追加の戦闘スキルを発動する前にターゲットが倒された場合、ランダムな敵単体に対して発動する。",
            "fromLevel": "talent",
            "stat": "DMG_ALL",
            "statField": "dmgBuff"
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "extra4_crit_dmg",
            "source": "extra",
            "name": "昇格4",
            "description": "必要な空白パーティー内の「知恵」の運命を歩むキャラクターの数に応じて、今回の戦闘で以下どちらかの効果を発動する。1名の場合、アナイクスの会心ダメージ+140%。2名以上の場合、味方全体の与ダメージ+50%。",
            "stat": "CRIT_DMG",
            "value": 1.4
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "extra6_def_ignore",
            "source": "extra",
            "name": "昇格6",
            "description": "定性の変遷敵が持つ異なる弱点属性1つにつき、アナイクスが与えるダメージはその敵の防御力を4%無視する。弱点属性は最大7つまでカウントされる。",
            "stat": "DEF_IGNORE",
            "value": 0.04,
            "stackable": {
                "max": 7,
                "default": 7
            }
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e4_atk_percent",
            "source": "eidolon",
            "name": "峡谷に落ちる灼熱",
            "description": "戦闘スキルを発動する時、攻撃力+30%、2ターン継続。この効果は最大で2層獲得できる。",
            "stat": "ATK_PERCENT",
            "value": 0.3,
            "minEidolon": 4,
            "stackable": {
                "max": 2,
                "default": 2
            },
            "duration": 2
        },
        {
            "id": "skill_enemy_count_dmg",
            "source": "skill",
            "name": "分形、誤謬の駆逐",
            "description": "フィールド上に攻撃可能な敵が1体いるごとに、その回の戦闘スキルによるダメージ+20%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "stat": "DMG_SKILL",
            "value": 0.2,
            "stackable": {
                "max": 5,
                "default": 1
            }
        }
    ]
});
