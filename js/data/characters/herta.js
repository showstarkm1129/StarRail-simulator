import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Herta",
    "id": "herta",
    "name": "ヘルタ",
    "element": "Ice",
    "elementLabel": "氷",
    "path": "Erudition",
    "rarity": 4,
    "base": {
        "hp": 952,
        "atk": 582,
        "def": 396,
        "spd": 100
    },
    "maxEnergy": 110,
    "traceBonuses": [
        {
            "label": "氷ダメージ",
            "value": 0.224
        },
        {
            "label": "防御力",
            "value": 0.225
        },
        {
            "label": "会心率",
            "value": 0.067
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%83%98%E3%83%AB%E3%82%BF",
        "version": "1.0"
    },
    "skills": {
        "basic": {
            "name": "何見てるの？",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にヘルタの攻撃力X%分の氷属性ダメージを与える。",
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
            "name": "一度限りの取引",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]敵全体にヘルタの攻撃力X%分の氷属性ダメージを与える。敵の残りHPが50%以上の場合、その敵に対して与ダメージ+20%。",
            "levelColumns": [
                "ダメージ倍率(X％)"
            ],
            "levels": [
                {
                    "hpPct": 0.5
                },
                {
                    "hpPct": 0.55
                },
                {
                    "hpPct": 0.6
                },
                {
                    "hpPct": 0.65
                },
                {
                    "hpPct": 0.7
                },
                {
                    "hpPct": 0.75
                },
                {
                    "hpPct": 0.81
                },
                {
                    "hpPct": 0.87
                },
                {
                    "hpPct": 0.93
                },
                {
                    "hpPct": 1
                },
                {
                    "hpPct": 1.05
                },
                {
                    "hpPct": 1.1
                }
            ]
        },
        "ult": {
            "name": "私がかけた魔法だよ",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]敵全体にヘルタの攻撃力X%分の氷属性ダメージを与える。",
            "levelColumns": [
                "ダメージ倍率(X％)",
                "消費EP"
            ],
            "levels": [
                {
                    "atk": 1.2,
                    "energyCost": 110
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
                    "atk": 2.08
                },
                {
                    "atk": 2.16
                }
            ]
        },
        "talent": {
            "name": "やっぱり私がやる",
            "sourceHeader": "天賦",
            "type": "follow_up",
            "target": "all",
            "description": "[全体攻撃]味方の攻撃が敵の残りHPを50%以下にした時、ヘルタは追加攻撃を発動し、敵全体にヘルタの攻撃力X%分の氷属性ダメージを与える。",
            "levelColumns": [
                "ダメージ倍率(X％)"
            ],
            "levels": [
                {
                    "hpPct": 0.25
                },
                {
                    "hpPct": 0.26
                },
                {
                    "hpPct": 0.28
                },
                {
                    "hpPct": 0.29
                },
                {
                    "hpPct": 0.31
                },
                {
                    "hpPct": 0.32
                },
                {
                    "hpPct": 0.34
                },
                {
                    "hpPct": 0.36
                },
                {
                    "hpPct": 0.38
                },
                {
                    "hpPct": 0.4
                },
                {
                    "hpPct": 0.41
                },
                {
                    "hpPct": 0.43
                }
            ]
        },
        "technique": {
            "name": "改善すべきだよ",
            "sourceHeader": "秘技",
            "type": "buff",
            "target": "single",
            "description": "[強化]秘技を使用した後、次の戦闘開始時、ヘルタの攻撃力+40%、3ターン継続。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "効率戦闘スキルを発動した時、さらに与ダメージ+25%。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "人形行動制限系デバフを抵抗する確率+35%。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "氷結必殺技を発動した時、凍結状態の敵に対する与ダメージ+20%。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "弱みは付け込み",
            "description": "通常攻撃を行った時、指定した敵単体の残りHPが50%以下の場合、さらにヘルタの攻撃力40%分の氷属性付加ダメージを与える。"
        },
        "2": {
            "name": "勝てば追い打ち",
            "description": "天賦が1回発動するごとに、自身の会心率+3%、この効果は最大で5回累積できる。"
        },
        "3": {
            "name": "私はこういう女なの",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "面子は徹底的に潰す",
            "description": "天賦発動時の与ダメージ+10%。"
        },
        "5": {
            "name": "欠点掴んで罵り倒す",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "誰も私を裏切れない",
            "description": "必殺技を発動した後、攻撃力+25%、1ターン継続。"
        }
    },
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "technique_atk_percent",
            "source": "technique",
            "name": "改善すべきだよ",
            "description": "[強化]秘技を使用した後、次の戦闘開始時、ヘルタの攻撃力+40%、3ターン継続。",
            "stat": "ATK_PERCENT",
            "value": 0.4,
            "duration": 3
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e2_crit_rate",
            "source": "eidolon",
            "name": "勝てば追い打ち",
            "description": "天賦が1回発動するごとに、自身の会心率+3%、この効果は最大で5回累積できる。",
            "stat": "CRIT_RATE",
            "value": 0.03,
            "minEidolon": 2,
            "stackable": {
                "max": 5,
                "default": 5
            }
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "skill_high_hp_dmg",
            "source": "skill",
            "name": "一度限りの取引",
            "description": "[全体攻撃]敵全体にヘルタの攻撃力X%分の氷属性ダメージを与える。敵の残りHPが50%以上の場合、その敵に対して与ダメージ+20%。",
            "stat": "DMG_ALL",
            "value": 0.2
        },
        {
            "id": "extra2_skill_dmg",
            "source": "extra",
            "name": "昇格2",
            "description": "戦闘スキルを発動した時、さらに与ダメージ+25%。",
            "defaultActive": false,
            "target": "single",
            "stat": "DMG_SKILL",
            "value": 0.25
        },
        {
            "id": "extra6_frozen_dmg",
            "source": "extra",
            "name": "昇格6",
            "description": "必殺技を発動した時、凍結状態の敵に対する与ダメージ+20%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "stat": "DMG_ALL",
            "value": 0.2
        },
        {
            "id": "e4_talent_dmg",
            "source": "eidolon",
            "name": "面子は徹底的に潰す",
            "description": "天賦発動時の与ダメージ+10%。",
            "defaultActive": false,
            "target": "single",
            "minEidolon": 4,
            "stat": "DMG_FOLLOWUP",
            "value": 0.1
        },
        {
            "id": "e6_ult_atk",
            "source": "eidolon",
            "name": "誰も私を裏切れない",
            "description": "必殺技を発動した後、攻撃力+25%、1ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 1,
            "minEidolon": 6,
            "stat": "ATK_PERCENT",
            "value": 0.25
        }
    ],
    "partyEffects": [],
    "enemyEffects": []
});
