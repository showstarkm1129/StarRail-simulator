import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Argenti",
    "id": "argenti",
    "name": "アルジェンティ",
    "element": "Physical",
    "elementLabel": "物理",
    "path": "Erudition",
    "rarity": 5,
    "base": {
        "hp": 1047,
        "atk": 737,
        "def": 363,
        "spd": 103
    },
    "maxEnergy": 180,
    "traceBonuses": [
        {
            "label": "攻撃力",
            "value": 0.28
        },
        {
            "label": "物理ダメージ",
            "value": 0.144
        },
        {
            "label": "最大HP",
            "value": 0.1
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%82%A2%E3%83%AB%E3%82%B8%E3%82%A7%E3%83%B3%E3%83%86%E3%82%A3",
        "version": "1.5"
    },
    "skills": {
        "basic": {
            "name": "刹那の芬芳",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にアルジェンティの攻撃力X%分の物理ダメージを与える。",
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
            "name": "公正、ここに咲き誇る",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]敵全体にアルジェンティの攻撃力X%分の物理ダメージを与える。",
            "levelColumns": [
                "ダメージ倍率(X％)"
            ],
            "levels": [
                {
                    "atk": 0.6
                },
                {
                    "atk": 0.66
                },
                {
                    "atk": 0.72
                },
                {
                    "atk": 0.78
                },
                {
                    "atk": 0.84
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
                    "atk": 1.2
                },
                {
                    "atk": 1.26
                },
                {
                    "atk": 1.32
                }
            ]
        },
        "ult": {
            "name": "花園にて捧げる美の際限",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]EPを90消費し、敵全体にアルジェンティの攻撃力X%分の物理ダメージを与える。",
            "levelColumns": [
                "ダメージ倍率(X％)",
                "消費EP",
                "全体ダメージ倍率(Y％)",
                "ランダムダメージ倍率(Z％)",
                "消費EP"
            ],
            "levels": [
                {
                    "atk": 0.96,
                    "energyCost": 90,
                    "atkAll": 1.68,
                    "atk2": 0.57,
                    "energyCost2": 180
                },
                {
                    "atk": 1.02,
                    "energyCost": 1.79,
                    "atkAll": 0.6
                },
                {
                    "atk": 1.08,
                    "energyCost": 1.9,
                    "atkAll": 0.64
                },
                {
                    "atk": 1.15,
                    "energyCost": 2.01,
                    "atkAll": 0.68
                },
                {
                    "atk": 1.21,
                    "energyCost": 2.12,
                    "atkAll": 0.72
                },
                {
                    "atk": 1.28,
                    "energyCost": 2.24,
                    "atkAll": 0.76
                },
                {
                    "atk": 1.36,
                    "energyCost": 2.38,
                    "atkAll": 0.8
                },
                {
                    "atk": 1.44,
                    "energyCost": 2.52,
                    "atkAll": 0.85
                },
                {
                    "atk": 1.52,
                    "energyCost": 2.66,
                    "atkAll": 0.9
                },
                {
                    "atk": 1.6,
                    "energyCost": 2.8,
                    "atkAll": 0.95
                },
                {
                    "atk": 1.66,
                    "energyCost": 2.91,
                    "atkAll": 0.98
                },
                {
                    "atk": 1.72,
                    "energyCost": 3.02,
                    "atkAll": 1.02
                }
            ]
        },
        "talent": {
            "name": "崇高なる客体",
            "sourceHeader": "天賦",
            "type": "heal",
            "target": "single",
            "description": "[強化]通常攻撃、戦闘スキル、または必殺技を発動した時、攻撃が敵1体に命中するごとにアルジェンティのEPを3回復し、「栄達」を1層獲得する。「栄達」1層につき、アルジェンティの会心率+X%、この効果は最大で10層累積できる。",
            "levelColumns": [
                "会心率アップ(X%)"
            ],
            "levels": [
                {
                    "critRateBuff": 0.01
                },
                {
                    "critRateBuff": 0.011
                },
                {
                    "critRateBuff": 0.013
                },
                {
                    "critRateBuff": 0.014
                },
                {
                    "critRateBuff": 0.016
                },
                {
                    "critRateBuff": 0.017
                },
                {
                    "critRateBuff": 0.019
                },
                {
                    "critRateBuff": 0.021
                },
                {
                    "critRateBuff": 0.023
                },
                {
                    "critRateBuff": 0.025
                },
                {
                    "critRateBuff": 0.026
                },
                {
                    "critRateBuff": 0.028
                }
            ]
        },
        "technique": {
            "name": "純粋で高潔なる宣言",
            "sourceHeader": "秘技",
            "type": "debuff",
            "target": "all",
            "description": "[妨害]秘技を使用した後、一定区域内の敵を10秒間の目眩状態にする。目眩状態の敵は味方を攻撃しない。目眩状態の敵を先制攻撃して戦闘に入った時、敵全体にアルジェンティの攻撃力80%分の物理ダメージを与え、アルジェンティのEPを15回復する。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "敬虔ターンが回ってきた時、「栄達」を1層獲得する。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "慷慨敵が戦闘に入った時、自身のEPを2回復する。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "勇気残りHPが50%以下の敵に対して与ダメージ+15%。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "審美王国の欠陥",
            "description": "「栄達」1層につき、さらに会心ダメージ+4%。"
        },
        "2": {
            "name": "メノウの謙遜",
            "description": "必殺技を発動した時、フィールド上の敵が3体以上の場合、攻撃力+40%、1ターン継続。"
        },
        "3": {
            "name": "荊棘の道の栄光",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "4": {
            "name": "トランペットの奉献戦",
            "description": "戦闘開始時、「栄達」を2層獲得し、天賦の累積可能層数+2。"
        },
        "5": {
            "name": "宇宙のどこかで降る雪",
            "description": "必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "6": {
            "name": "「貴女」の輝き",
            "description": "必殺技を発動した時、敵の防御力を30%無視する。"
        }
    },
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "talent_crit_rate",
            "source": "talent",
            "name": "崇高なる客体",
            "description": "[強化]通常攻撃、戦闘スキル、または必殺技を発動した時、攻撃が敵1体に命中するごとにアルジェンティのEPを3回復し、「栄達」を1層獲得する。「栄達」1層につき、アルジェンティの会心率+X%、この効果は最大で10層累積できる。",
            "fromLevel": "talent",
            "stat": "CRIT_RATE",
            "statField": "critRateBuff",
            "stackable": {
                "max": 10,
                "default": 10
            }
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "extra6_low_hp_dmg",
            "source": "extra",
            "name": "昇格6",
            "description": "勇気残りHPが50%以下の敵に対して与ダメージ+15%。",
            "stat": "DMG_ALL",
            "value": 0.15
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e1_crit_dmg",
            "source": "eidolon",
            "name": "審美王国の欠陥",
            "description": "「栄達」1層につき、さらに会心ダメージ+4%。",
            "stat": "CRIT_DMG",
            "value": 0.04,
            "minEidolon": 1,
            "stackable": {
                "max": 12,
                "default": 10
            }
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e2_atk_percent",
            "source": "eidolon",
            "name": "メノウの謙遜",
            "description": "必殺技を発動した時、フィールド上の敵が3体以上の場合、攻撃力+40%、1ターン継続。",
            "stat": "ATK_PERCENT",
            "value": 0.4,
            "minEidolon": 2,
            "duration": 1
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e6_ult_def_ignore",
            "source": "eidolon",
            "name": "「貴女」の輝き",
            "description": "必殺技を発動した時、敵の防御力を30%無視する。",
            "stat": "DEF_IGNORE",
            "value": 0.3,
            "minEidolon": 6
        }
    ]
});
