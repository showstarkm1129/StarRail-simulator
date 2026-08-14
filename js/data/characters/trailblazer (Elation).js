import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Trailblazer (Elation)",
    "id": "trailblazer_elation",
    "name": "開拓者-愉悦",
    "element": "Lightning",
    "elementLabel": "雷",
    "path": "Elation",
    "rarity": 5,
    "base": {
        "hp": 1086,
        "atk": 465,
        "def": 630,
        "spd": 106
    },
    "maxEnergy": 160,
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
            "label": "会心ダメージ",
            "value": 0.133
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E9%96%8B%E6%8B%93%E8%80%85-%E6%84%89%E6%82%A6",
        "version": "4.2"
    },
    "skills": {
        "basic": {
            "name": "これぞ応援",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に開拓者の攻撃力X%分の雷属性ダメージを与える。",
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
            "name": "風が騒がしい",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]敵全体に開拓者の攻撃力X%分の雷属性ダメージを与え、「爆笑の褒美」を20獲得する。",
            "levelColumns": [
                "ダメージ倍率(X%)"
            ],
            "levels": [
                {
                    "atk": 0.3
                },
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
                    "atk": 0.45
                },
                {
                    "atk": 0.49
                },
                {
                    "atk": 0.53
                },
                {
                    "atk": 0.56
                },
                {
                    "atk": 0.6
                },
                {
                    "atk": 0.63
                },
                {
                    "atk": 0.66
                }
            ]
        },
        "ult": {
            "name": "飛べ、開拓と共に！",
            "sourceHeader": "必殺技",
            "type": "debuff",
            "target": "single_ally",
            "description": "[サポート]爆笑ネタを5個獲得し、指定した味方単体の会心ダメージ+X%、3ターン継続。さらに、その味方の行動制限系デバフを解除する。愉悦スキルを持っている場合、その味方は追加で「爆笑の褒美」を10獲得し、爆笑ネタが固定で20個カウントされる愉悦スキルを即座に1回発動する。愉悦スキルの発動前に敵が倒れた場合、新たにフィールドに登場した敵に対して愉悦スキルを発動する。愉悦スキルを持っていない場合、その味方の行動順を50%早める。",
            "levelColumns": [
                "会心ダメージアップ(X%)",
                "消費EP"
            ],
            "levels": [
                {
                    "cdBuff": 0.3,
                    "energyCost": 160
                },
                {
                    "cdBuff": 0.32
                },
                {
                    "cdBuff": 0.34
                },
                {
                    "cdBuff": 0.36
                },
                {
                    "cdBuff": 0.38
                },
                {
                    "cdBuff": 0.4
                },
                {
                    "cdBuff": 0.43
                },
                {
                    "cdBuff": 0.45
                },
                {
                    "cdBuff": 0.48
                },
                {
                    "cdBuff": 0.5
                },
                {
                    "cdBuff": 0.52
                },
                {
                    "cdBuff": 0.54
                }
            ]
        },
        "愉悦スキル": {
            "name": "愉悦って言ったの聞こえなかった？",
            "sourceHeader": "愉悦スキル",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]8回ダメージを与える。1回につきランダムな敵単体にX%分の雷属性の愉悦ダメージを与える。最後にY%分の雷属性の愉悦ダメージを敵全体に均等に分けて与える。",
            "levelColumns": [
                "全体ダメージ倍率(X%)",
                "最終段ダメージ倍率(Y%)"
            ],
            "levels": [
                {
                    "atkAll": 0.1,
                    "atk": 0.3
                },
                {
                    "atkAll": 0.11,
                    "atk": 0.33
                },
                {
                    "atkAll": 0.12,
                    "atk": 0.36
                },
                {
                    "atkAll": 0.13,
                    "atk": 0.39
                },
                {
                    "atkAll": 0.14,
                    "atk": 0.42
                },
                {
                    "atkAll": 0.15,
                    "atk": 0.45
                },
                {
                    "atkAll": 0.16,
                    "atk": 0.49
                },
                {
                    "atkAll": 0.17,
                    "atk": 0.53
                },
                {
                    "atkAll": 0.19,
                    "atk": 0.56
                },
                {
                    "atkAll": 0.2,
                    "atk": 0.6
                },
                {
                    "atkAll": 0.21,
                    "atk": 0.63
                },
                {
                    "atkAll": 0.22,
                    "atk": 0.66
                }
            ]
        },
        "talent": {
            "name": "見ろ、ヒーローが笑ってる",
            "sourceHeader": "天賦",
            "type": "heal",
            "target": "all",
            "description": "[サポート]攻撃を行った後、EPを10回復し、爆笑ネタを3個獲得する。開拓者が「爆笑の褒美」を持つ時、戦闘スキルは敵全体に追加でX%分の雷属性の愉悦ダメージをを与える。このダメージは味方の最も高い「爆笑の褒美」の数値を参照する。",
            "levelColumns": [
                "追加愉悦ダメージ倍率(X%)"
            ],
            "levels": [
                {
                    "atkExtra": 0.15
                },
                {
                    "atkExtra": 0.16
                },
                {
                    "atkExtra": 0.18
                },
                {
                    "atkExtra": 0.19
                },
                {
                    "atkExtra": 0.21
                },
                {
                    "atkExtra": 0.22
                },
                {
                    "atkExtra": 0.24
                },
                {
                    "atkExtra": 0.26
                },
                {
                    "atkExtra": 0.28
                },
                {
                    "atkExtra": 0.3
                },
                {
                    "atkExtra": 0.31
                },
                {
                    "atkExtra": 0.33
                }
            ]
        },
        "technique": {
            "name": "燃えてきた！",
            "sourceHeader": "秘技",
            "type": "buff",
            "target": "all_ally",
            "description": "[強化]秘技を使用すると、以下の効果からランダムで1つ獲得する。低確率で「心からの大笑い」を獲得し、愉悦度+30%。高確率で「禁じ得ない笑い」を獲得し、愉悦度+20%。次の戦闘開始時、味方全体の愉悦度を対応する数値分アップさせる。2ターン継続。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "愉快痛快開拓者の攻撃力が1000を超えた場合、超過した攻撃力200につき、自身の愉悦度+10.0%、最大で+60.0%。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "はじけよう！自身の会心率+15%。必殺技を発動した後、味方のSPを1回復する。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "噛みつけ、アッハ！味方が愉悦スキルを発動した後、開拓者が次に戦闘スキルを発動する時、追加で「爆笑の褒美」を2獲得する。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "光を信じる時間",
            "description": "戦闘スキルを発動した後、次の必殺技で味方が獲得する「爆笑の褒美」+2。この効果は最大で3層累積できる。"
        },
        "2": {
            "name": "名シーン準備中……",
            "description": "必殺技は追加で指定した味方の愉悦度+12%、2ターン継続。"
        },
        "3": {
            "name": "スポットライトをこっちへ",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。愉悦スキルのLv.+1、最大Lv.15まで。"
        },
        "4": {
            "name": "世界を救うのに理由はいらない",
            "description": "愉悦スキルを発動する時、敵の受けるダメージ+10%、2ターン継続。"
        },
        "5": {
            "name": "愛と勇気は永遠の王道",
            "description": "必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。愉悦スキルのLv.+1、最大Lv.15まで。"
        },
        "6": {
            "name": "銀河の伝説、参上！",
            "description": "愉悦スキルを発動する時、自身の会心ダメージ+100%、3ターン継続。"
        }
    },
    "partyEffects": [
        {
            "id": "ult_crit_dmg",
            "source": "ult",
            "name": "飛べ、開拓と共に！",
            "description": "[サポート]爆笑ネタを5個獲得し、指定した味方単体の会心ダメージ+X%、3ターン継続。さらに、その味方の行動制限系デバフを解除する。愉悦スキルを持っている場合、その味方は追加で「爆笑の褒美」を10獲得し、爆笑ネタが固定で20個カウントされる愉悦スキルを即座に1回発動する。愉悦スキルの発動前に敵が倒れた場合、新たにフィールドに登場した敵に対して愉悦スキルを発動する。愉悦スキルを持っていない場合、その味方の行動順を50%早める。",
            "defaultActive": false,
            "target": "single",
            "duration": 3,
            "fromLevel": "ult",
            "stat": "CRIT_DMG",
            "statField": "cdBuff"
        },
        {
            "id": "e4_dmg_taken_mirror",
            "source": "eidolon",
            "name": "世界を救うのに理由はいらない (火力計算用)",
            "description": "愉悦スキルを発動する時、敵の受けるダメージ+10%、2ターン継続。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "minEidolon": 4,
            "stat": "DMG_TAKEN",
            "value": 0.1
        }
    ],
    "enemyEffects": [
        {
            "id": "e4_dmg_taken",
            "source": "eidolon",
            "name": "世界を救うのに理由はいらない",
            "description": "愉悦スキルを発動する時、敵の受けるダメージ+10%、2ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "minEidolon": 4,
            "stat": "DMG_TAKEN",
            "value": 0.1
        }
    ],
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "extra4_crit_rate",
            "source": "extra",
            "name": "昇格4",
            "description": "はじけよう！自身の会心率+15%。必殺技を発動した後、味方のSPを1回復する。",
            "stat": "CRIT_RATE",
            "value": 0.15
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e6_crit_dmg",
            "source": "eidolon",
            "name": "銀河の伝説、参上！",
            "description": "愉悦スキルを発動する時、自身の会心ダメージ+100%、3ターン継続。",
            "stat": "CRIT_DMG",
            "value": 1,
            "minEidolon": 6,
            "duration": 3
        }
    ]
});
