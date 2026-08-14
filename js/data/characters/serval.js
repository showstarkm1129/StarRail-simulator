import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Serval",
    "id": "serval",
    "name": "セーバル",
    "element": "Lightning",
    "elementLabel": "雷",
    "path": "Erudition",
    "rarity": 4,
    "base": {
        "hp": 917,
        "atk": 652,
        "def": 374,
        "spd": 104
    },
    "maxEnergy": 100,
    "traceBonuses": [
        {
            "label": "会心率",
            "value": 0.187
        },
        {
            "label": "効果命中",
            "value": 0.18
        },
        {
            "label": "効果抵抗",
            "value": 0.1
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%82%BB%E3%83%BC%E3%83%90%E3%83%AB",
        "version": "1.0"
    },
    "skills": {
        "basic": {
            "name": "雷鳴音階",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にセーバルの攻撃力X%分の雷属性ダメージを与える。",
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
            "name": "スパーク",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "blast",
            "description": "[拡散攻撃]指定した敵単体にセーバルの攻撃力X%分の雷属性ダメージを与え、隣接する敵にセーバルの攻撃力Y%分の雷属性ダメージを与える。さらに80%の基礎確率で攻撃を受けた敵を感電状態にする、2ターン継続。感電状態の敵はターンが回ってくるたびに、セーバルの攻撃力Z%分の雷属性持続ダメージを受ける。",
            "levelColumns": [
                "単体ダメージ倍率(X%)",
                "隣接ダメージ倍率(Y%)",
                "持続ダメージ倍率(Z%)"
            ],
            "levels": [
                {
                    "atk": 0.7,
                    "atkAdjacent": 0.3,
                    "dotAtk": 0.4
                },
                {
                    "atk": 0.77,
                    "atkAdjacent": 0.33,
                    "dotAtk": 0.44
                },
                {
                    "atk": 0.84,
                    "atkAdjacent": 0.36,
                    "dotAtk": 0.48
                },
                {
                    "atk": 0.91,
                    "atkAdjacent": 0.39,
                    "dotAtk": 0.52
                },
                {
                    "atk": 0.98,
                    "atkAdjacent": 0.42,
                    "dotAtk": 0.56
                },
                {
                    "atk": 1.05,
                    "atkAdjacent": 0.45,
                    "dotAtk": 0.62
                },
                {
                    "atk": 1.13,
                    "atkAdjacent": 0.48,
                    "dotAtk": 0.7
                },
                {
                    "atk": 1.22,
                    "atkAdjacent": 0.52,
                    "dotAtk": 0.8
                },
                {
                    "atk": 1.31,
                    "atkAdjacent": 0.56,
                    "dotAtk": 0.92
                },
                {
                    "atk": 1.4,
                    "atkAdjacent": 0.6,
                    "dotAtk": 1.04
                },
                {
                    "atk": 1.47,
                    "atkAdjacent": 0.63,
                    "dotAtk": 1.09
                },
                {
                    "atk": 1.54,
                    "atkAdjacent": 0.66,
                    "dotAtk": 1.14
                }
            ]
        },
        "ult": {
            "name": "機械ブーム登場！",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]敵全体にセーバルの攻撃力X%分の雷属性ダメージを与え、敵の感電状態+2ターン。",
            "levelColumns": [
                "全体ダメージ倍率(X%)",
                "消費EP"
            ],
            "levels": [
                {
                    "atk": 1.08,
                    "energyCost": 100
                },
                {
                    "atk": 1.15
                },
                {
                    "atk": 1.22
                },
                {
                    "atk": 1.29
                },
                {
                    "atk": 1.36
                },
                {
                    "atk": 1.44
                },
                {
                    "atk": 1.53
                },
                {
                    "atk": 1.62
                },
                {
                    "atk": 1.71
                },
                {
                    "atk": 1.8
                },
                {
                    "atk": 1.87
                },
                {
                    "atk": 1.94
                }
            ]
        },
        "talent": {
            "name": "情熱コード",
            "sourceHeader": "天賦",
            "type": "attack",
            "target": "single",
            "description": "[強化]攻撃を行った後、すべての感電状態の敵にセーバルの攻撃力X%分の雷属性付加ダメージを与える。",
            "levelColumns": [
                "付加ダメージ倍率(X%)"
            ],
            "levels": [
                {
                    "atk": 0.36
                },
                {
                    "atk": 0.39
                },
                {
                    "atk": 0.43
                },
                {
                    "atk": 0.46
                },
                {
                    "atk": 0.5
                },
                {
                    "atk": 0.54
                },
                {
                    "atk": 0.58
                },
                {
                    "atk": 0.63
                },
                {
                    "atk": 0.67
                },
                {
                    "atk": 0.72
                },
                {
                    "atk": 0.75
                },
                {
                    "atk": 0.79
                }
            ]
        },
        "technique": {
            "name": "おやすみ、ベロブルグ",
            "sourceHeader": "秘技",
            "type": "support",
            "target": "single",
            "description": "敵を攻撃。戦闘に入った後、ランダムな敵単体にセーバルの攻撃力50%分の雷属性ダメージを与え、100%の基礎確率で敵単体それぞれに感電状態を付与する、3ターン継続。感電状態の敵はターンが回ってくるたびに、セーバルの攻撃力50%分の雷属性持続ダメージを受ける。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "ロック戦闘スキルを発動した時、攻撃を受けた敵が感電状態になる基礎確率+20%。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "電子音戦闘開始時、EPを15回復する。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "狂熱敵を倒した後、攻撃力+20%、2ターン継続。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "いつまでも鳴り響け",
            "description": "通常攻撃は指定した敵に隣接するランダムな敵に、通常攻撃のダメージ60%分の雷属性ダメージを与える。"
        },
        "2": {
            "name": "アンコール！",
            "description": "天賦の付加ダメージを1回発動するたびに、セーバルはEPを4回復する。"
        },
        "3": {
            "name": "聞け、歯車の鼓動を",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "噪音を鳴らせ！",
            "description": "必殺技を発動した時、100%の基礎確率で感電状態でない敵を、戦闘スキルが与えるものと同じ感電状態にする。"
        },
        "5": {
            "name": "ベロブルグ最強音！",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "この一曲、 天穹を貫く！",
            "description": "感電状態の敵に対するセーバルの与ダメージ+30%。"
        }
    },
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "e6_shocked_dmg",
            "source": "eidolon",
            "name": "この一曲、 天穹を貫く！",
            "description": "感電状態の敵に対するセーバルの与ダメージ+30%。",
            "stat": "DMG_ALL",
            "value": 0.3,
            "minEidolon": 6
        },
        {
            "id": "extra6_kill_atk",
            "source": "extra",
            "name": "昇格6",
            "description": "敵を倒した後、攻撃力+20%、2ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "stat": "ATK_PERCENT",
            "value": 0.2
        }
    ],
    "partyEffects": [],
    "enemyEffects": []
});
