import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Himeko",
    "id": "himeko",
    "name": "姫子",
    "element": "Fire",
    "elementLabel": "炎",
    "path": "Erudition",
    "rarity": 5,
    "base": {
        "hp": 1047,
        "atk": 756,
        "def": 436,
        "spd": 96
    },
    "maxEnergy": 120,
    "traceBonuses": [
        {
            "label": "炎ダメージ",
            "value": 0.224
        },
        {
            "label": "攻撃力",
            "value": 0.18
        },
        {
            "label": "効果抵抗",
            "value": 0.1
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E5%A7%AB%E5%AD%90",
        "version": "1.0"
    },
    "skills": {
        "basic": {
            "name": "武装調律",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に姫子の攻撃力X%分の炎属性ダメージを与える。",
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
            "name": "溶核爆裂",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "blast",
            "description": "[拡散攻撃]指定した敵単体に姫子の攻撃力X%分の炎属性ダメージを与え、隣接する敵に姫子の攻撃力Y%分の炎属性ダメージを与える。",
            "levelColumns": [
                "単体ダメージ倍率(X％)",
                "隣接ダメージ倍率(Y%)"
            ],
            "levels": [
                {
                    "atk": 1,
                    "atkAdjacent": 0.4
                },
                {
                    "atk": 1.1,
                    "atkAdjacent": 0.44
                },
                {
                    "atk": 1.2,
                    "atkAdjacent": 0.48
                },
                {
                    "atk": 1.3,
                    "atkAdjacent": 0.52
                },
                {
                    "atk": 1.4,
                    "atkAdjacent": 0.56
                },
                {
                    "atk": 1.5,
                    "atkAdjacent": 0.6
                },
                {
                    "atk": 1.62,
                    "atkAdjacent": 0.65
                },
                {
                    "atk": 1.75,
                    "atkAdjacent": 0.7
                },
                {
                    "atk": 1.87,
                    "atkAdjacent": 0.75
                },
                {
                    "atk": 2,
                    "atkAdjacent": 0.8
                },
                {
                    "atk": 2.1,
                    "atkAdjacent": 0.84
                },
                {
                    "atk": 2.2,
                    "atkAdjacent": 0.88
                }
            ],
            "inferredNotes": [
                "Lv.11 atk は前後Lvから線形補完",
                "Lv.11 atkAdjacent は前後Lvから線形補完"
            ]
        },
        "ult": {
            "name": "天墜の火",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]敵全体に姫子の攻撃力X%分の炎属性ダメージを与える。敵を1体倒すごとに、さらに姫子のEPを5回復する。",
            "levelColumns": [
                "全体ダメージ倍率(X%)",
                "消費EP"
            ],
            "levels": [
                {
                    "atk": 1.38,
                    "energyCost": 120
                },
                {
                    "atk": 1.47
                },
                {
                    "atk": 1.56
                },
                {
                    "atk": 1.65
                },
                {
                    "atk": 1.74
                },
                {
                    "atk": 1.84
                },
                {
                    "atk": 1.95
                },
                {
                    "atk": 2.07
                },
                {
                    "atk": 2.18
                },
                {
                    "atk": 2.3
                },
                {
                    "atk": 2.39
                },
                {
                    "atk": 2.48
                }
            ]
        },
        "talent": {
            "name": "乗勝追撃",
            "sourceHeader": "天賦",
            "type": "follow_up",
            "target": "all",
            "description": "[全体攻撃]敵が弱点撃破された時、姫子はチャージを獲得する、最大で3層まで。味方が攻撃を行った後、姫子のチャージが最大に達した場合、チャージを全部消費して追加攻撃を1回発動し、敵全体に姫子の攻撃力X%分の炎属性ダメージを与える。戦闘開始時にチャージを1層獲得。",
            "levelColumns": [
                "全体ダメージ倍率(X%)"
            ],
            "levels": [
                {
                    "atk": 0.7
                },
                {
                    "atk": 0.77
                },
                {
                    "atk": 0.84
                },
                {
                    "atk": 0.91
                },
                {
                    "atk": 0.98
                },
                {
                    "atk": 1.05
                },
                {
                    "atk": 1.13
                },
                {
                    "atk": 1.22
                },
                {
                    "atk": 1.31
                },
                {
                    "atk": 1.4
                },
                {
                    "atk": 1.47
                },
                {
                    "atk": 1.54
                }
            ],
            "inferredNotes": [
                "Lv.11 atk は前後Lvから線形補完"
            ]
        },
        "technique": {
            "name": "不完全燃焼",
            "sourceHeader": "秘技",
            "type": "debuff",
            "target": "single",
            "description": "[妨害]秘技を使用した後、15秒間持続する特殊領域を作り出す。特殊領域内にいる敵と戦闘に入った後、100%の基礎確率で敵の炎属性被ダメージ+10%、2ターン継続。味方が作り出した領域は1つまで存在できる。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "星火攻撃を行った時*1、50%の基礎確率で敵を燃焼状態にする、2ターン継続。燃焼状態の敵はターンが回ってくるたびに、姫子の攻撃力30%分の炎属性持続ダメージを受ける。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "灼熱燃焼状態の敵に対する戦闘スキルの与ダメージ+20%。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "道標残りHPが80%以上の場合、会心率+15%。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "子供時代",
            "description": "「乗勝追撃」発動後、姫子の速度+20%、2ターン継続。"
        },
        "2": {
            "name": "邂逅",
            "description": "残りHPが50%以下の敵に対して与ダメージ+15%。"
        },
        "3": {
            "name": "自我",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "没頭",
            "description": "戦闘スキルで敵を弱点撃破した時、姫子はさらにチャージを1獲得する。"
        },
        "5": {
            "name": "夢",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "開拓！",
            "description": "必殺技を発動した時、さらに2ヒットし、1ヒットごとにランダムな敵単体に本来のダメージ40%分の炎属性ダメージを与える。"
        }
    },
    "partyEffects": [
        {
            "id": "technique_dmg_taken_mirror",
            "source": "technique",
            "name": "不完全燃焼 (火力計算用)",
            "description": "[妨害]秘技を使用した後、15秒間持続する特殊領域を作り出す。特殊領域内にいる敵と戦闘に入った後、100%の基礎確率で敵の炎属性被ダメージ+10%、2ターン継続。味方が作り出した領域は1つまで存在できる。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "stat": "DMG_FIRE",
            "value": 0.1
        }
    ],
    "enemyEffects": [
        {
            "id": "technique_dmg_taken",
            "source": "technique",
            "name": "不完全燃焼",
            "description": "[妨害]秘技を使用した後、15秒間持続する特殊領域を作り出す。特殊領域内にいる敵と戦闘に入った後、100%の基礎確率で敵の炎属性被ダメージ+10%、2ターン継続。味方が作り出した領域は1つまで存在できる。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "stat": "DMG_FIRE",
            "value": 0.1
        }
    ],
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "e1_spd_percent",
            "source": "eidolon",
            "name": "子供時代",
            "description": "「乗勝追撃」発動後、姫子の速度+20%、2ターン継続。",
            "stat": "SPD_PERCENT",
            "value": 0.2,
            "minEidolon": 1,
            "duration": 2
        },
        {
            "id": "extra4_skill_burn_dmg",
            "source": "extra",
            "name": "昇格4",
            "description": "燃焼状態の敵に対する戦闘スキルの与ダメージ+20%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "stat": "DMG_SKILL",
            "value": 0.2
        },
        {
            "id": "extra6_high_hp_crit_rate",
            "source": "extra",
            "name": "昇格6",
            "description": "残りHPが80%以上の場合、会心率+15%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "stat": "CRIT_RATE",
            "value": 0.15
        },
        {
            "id": "e2_low_hp_dmg",
            "source": "eidolon",
            "name": "邂逅",
            "description": "残りHPが50%以下の敵に対して与ダメージ+15%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 2,
            "stat": "DMG_ALL",
            "value": 0.15
        }
    ]
});
