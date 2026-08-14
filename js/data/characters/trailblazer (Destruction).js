import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Trailblazer (Destruction)",
    "id": "trailblazer_destruction",
    "name": "開拓者-壊滅",
    "element": "Physical",
    "elementLabel": "物理",
    "path": "Destruction",
    "rarity": 5,
    "base": {
        "hp": 1203,
        "atk": 620,
        "def": 460,
        "spd": 100
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
        "pageUrl": "https://wikiwiki.jp/star-rail/%E9%96%8B%E6%8B%93%E8%80%85-%E5%A3%8A%E6%BB%85",
        "version": "1.0"
    },
    "skills": {
        "basic": {
            "name": "サヨナラ安打",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に開拓者の攻撃力X%分の物理ダメージを与える。",
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
            "name": "安息ホームラン",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "blast",
            "description": "[拡散攻撃]指定した敵単体および隣接する敵に開拓者の攻撃力X%分の物理ダメージを与える。",
            "levelColumns": [
                "ダメージ倍率(X％)"
            ],
            "levels": [
                {
                    "atk": 0.62
                },
                {
                    "atk": 0.68
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
                    "atk": 1.01
                },
                {
                    "atk": 1.09
                },
                {
                    "atk": 1.17
                },
                {
                    "atk": 1.25
                },
                {
                    "atk": 1.31
                },
                {
                    "atk": 1.38
                }
            ]
        },
        "ult": {
            "name": "スターダストエース",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "single",
            "description": "[強化]2つの攻撃モードの内の1つを選択し全力のバッティングをお見舞いする。「全勝・サヨナラ安打」：指定した敵単体に開拓者の攻撃力X%分の物理ダメージを与える。「全勝・安息ホームラン」：指定した敵単体に開拓者の攻撃力Y%分の物理ダメージを与え、隣接する敵に開拓者の攻撃力Z%分の物理ダメージを与える。",
            "levelColumns": [
                "全勝・サヨナラ安打",
                "全勝・安息ホームラン",
                "消費EP"
            ],
            "levels": [
                {
                    "atk": 3,
                    "atkAlt2": 1.8,
                    "energyCost": 1.08
                },
                {
                    "atk": 3.15,
                    "atkAlt2": 1.89,
                    "energyCost": 1.13
                },
                {
                    "atk": 3.3,
                    "atkAlt2": 1.98,
                    "energyCost": 1.18
                },
                {
                    "atk": 3.45,
                    "atkAlt2": 2.07,
                    "energyCost": 1.24
                },
                {
                    "atk": 3.6,
                    "atkAlt2": 2.16,
                    "energyCost": 1.29
                },
                {
                    "atk": 3.75,
                    "atkAlt2": 2.25,
                    "energyCost": 1.35
                },
                {
                    "atk": 3.94,
                    "atkAlt2": 2.36,
                    "energyCost": 1.42
                },
                {
                    "atk": 4.12,
                    "atkAlt2": 2.48,
                    "energyCost": 1.49
                },
                {
                    "atk": 4.31,
                    "atkAlt2": 2.59,
                    "energyCost": 1.55
                },
                {
                    "atk": 4.5,
                    "atkAlt2": 2.7,
                    "energyCost": 1.62
                },
                {
                    "atk": 4.65,
                    "atkAlt2": 2.79,
                    "energyCost": 1.67
                },
                {
                    "atk": 4.8,
                    "atkAlt2": 2.88,
                    "energyCost": 1.73
                }
            ]
        },
        "talent": {
            "name": "盗塁牽制",
            "sourceHeader": "天賦",
            "type": "buff",
            "target": "single",
            "description": "[強化]敵を弱点撃破した後、攻撃力+X%、最大で2回累積できる。",
            "levelColumns": [
                "攻撃力アップ(X%)"
            ],
            "levels": [
                {
                    "atkBuff": 0.1
                },
                {
                    "atkBuff": 0.11
                },
                {
                    "atkBuff": 0.12
                },
                {
                    "atkBuff": 0.13
                },
                {
                    "atkBuff": 0.14
                },
                {
                    "atkBuff": 0.15
                },
                {
                    "atkBuff": 0.16
                },
                {
                    "atkBuff": 0.17
                },
                {
                    "atkBuff": 0.19
                },
                {
                    "atkBuff": 0.2
                },
                {
                    "atkBuff": 0.21
                },
                {
                    "atkBuff": 0.22
                }
            ]
        },
        "technique": {
            "name": "不滅三振",
            "sourceHeader": "秘技",
            "type": "heal",
            "target": "all_ally",
            "description": "[回復]秘技を使用した後、味方全体のHPをそれぞれの最大HP15%分回復する。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "力溜め戦闘開始時、EPを15回復する。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "堅靭天賦効果1層につき、開拓者の防御力+10%。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "闘志戦闘スキルまたは必殺技「全勝・安息ホームラン」を発動した時、指定した敵に対して与ダメージ+25%。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "万界に墜臨した星芒",
            "description": "必殺技で敵を倒した時、さらに開拓者のEPを10回復する。この効果は1回の攻撃で1回まで発動できる。"
        },
        "2": {
            "name": "縁の下假合した人身",
            "description": "攻撃を行った後、攻撃が命中した敵の弱点が物理の場合、開拓者の攻撃力5%分のHPを回復する。"
        },
        "3": {
            "name": "前路を示す言霊",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "4": {
            "name": "毀滅の瞬間を凝視する瞳",
            "description": "弱点撃破状態の敵に攻撃が命中した時、会心率+25%。"
        },
        "5": {
            "name": "災劫に燃える再生の希望",
            "description": "必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "6": {
            "name": "拓宇行天の意志",
            "description": "開拓者が敵を倒した時も、天賦が発動する。"
        }
    },
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "talent_atk_percent",
            "source": "talent",
            "name": "盗塁牽制",
            "description": "[強化]敵を弱点撃破した後、攻撃力+X%、最大で2回累積できる。",
            "fromLevel": "talent",
            "stat": "ATK_PERCENT",
            "statField": "atkBuff",
            "stackable": {
                "max": 2,
                "default": 2
            }
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "extra4_def_percent",
            "source": "extra",
            "name": "昇格4",
            "description": "堅靭天賦効果1層につき、開拓者の防御力+10%。",
            "stat": "DEF_PERCENT",
            "value": 0.1,
            "stackable": {
                "max": 2,
                "default": 2
            }
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e4_broken_crit_rate",
            "source": "eidolon",
            "name": "毀滅の瞬間を凝視する瞳",
            "description": "弱点撃破状態の敵に攻撃が命中した時、会心率+25%。",
            "stat": "CRIT_RATE",
            "value": 0.25,
            "minEidolon": 4
        },
        {
            "id": "extra6_skill_ult_dmg",
            "source": "extra",
            "name": "昇格6",
            "description": "戦闘スキルまたは必殺技「全勝・安息ホームラン」を発動した時、指定した敵に対して与ダメージ+25%。",
            "defaultActive": false,
            "target": "single",
            "stats": {
                "DMG_SKILL": 0.25,
                "DMG_ULT": 0.25
            }
        }
    ],
    "partyEffects": [],
    "enemyEffects": []
});
