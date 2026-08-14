import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Blade",
    "id": "blade",
    "name": "刃",
    "element": "Wind",
    "elementLabel": "風",
    "path": "Destruction",
    "rarity": 5,
    "base": {
        "hp": 1358,
        "atk": 543,
        "def": 485,
        "spd": 97
    },
    "maxEnergy": 130,
    "traceBonuses": [
        {
            "label": "最大HP",
            "value": 0.28
        },
        {
            "label": "会心率",
            "value": 0.12
        },
        {
            "label": "効果抵抗",
            "value": 0.1
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E5%88%83",
        "version": "1.2"
    },
    "skills": {
        "basic": {
            "name": "支離剣",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に刃の最大HPX%分の風属性ダメージを与える。",
            "levelColumns": [
                "支離剣",
                "無間剣樹"
            ],
            "levels": [
                {
                    "hpPct": 0.25,
                    "hpPctAlt2": 0.65
                },
                {
                    "hpPct": 0.3,
                    "hpPctAlt2": 0.78
                },
                {
                    "hpPct": 0.35,
                    "hpPctAlt2": 0.91
                },
                {
                    "hpPct": 0.4,
                    "hpPctAlt2": 1.04
                },
                {
                    "hpPct": 0.45,
                    "hpPctAlt2": 1.17
                },
                {
                    "hpPct": 0.5,
                    "hpPctAlt2": 1.3
                },
                {
                    "hpPct": 0.55,
                    "hpPctAlt2": 1.43
                }
            ]
        },
        "skill": {
            "name": "地獄変",
            "sourceHeader": "戦闘スキル",
            "type": "heal",
            "target": "single",
            "description": "[強化]刃のHPを最大HP30%分消費して「地獄変」状態に入る。「地獄変」状態では戦闘スキルを発動できず、自身の与ダメージ+X%、敵に攻撃される確率が大幅に上がり、通常攻撃「支離剣」が「無間剣樹」に強化される、3ターン継続。残りHPが足りない場合、戦闘スキルを発動した時、刃の残りHPが1になる。この戦闘スキルはEPを回復できない。この戦闘スキルを発動した後、ターンは終了しない。",
            "levelColumns": [
                "与ダメージアップ(X%)"
            ],
            "levels": [
                {
                    "dmgBuff": 0.12
                },
                {
                    "dmgBuff": 0.14
                },
                {
                    "dmgBuff": 0.17
                },
                {
                    "dmgBuff": 0.2
                },
                {
                    "dmgBuff": 0.23
                },
                {
                    "dmgBuff": 0.26
                },
                {
                    "dmgBuff": 0.29
                },
                {
                    "dmgBuff": 0.33
                },
                {
                    "dmgBuff": 0.36
                },
                {
                    "dmgBuff": 0.4
                },
                {
                    "dmgBuff": 0.42
                },
                {
                    "dmgBuff": 0.45
                }
            ]
        },
        "ult": {
            "name": "大辟万死",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "blast",
            "description": "[拡散攻撃]刃の残りHPを最大HPの50%にし、敵単体に刃の最大HPX%+戦闘中失ったHPの累計Y%分の風属性ダメージを与え、隣接する敵に刃の最大HPx%+戦闘中失ったHPの累計y%分の風属性ダメージを与える。戦闘中失ったHPの累計のカウントは刃の最大HPの90%を超えず、必殺技を発動した後にリセットされる。",
            "levelColumns": [
                "単体ダメージ倍率(最大HPX％+失ったHPY％)",
                "隣接ダメージ倍率(最大HPx％+失ったHPy％)",
                "消費EP"
            ],
            "levels": [
                {
                    "hpPct": 0.9,
                    "hpPct2": 0.72,
                    "hpPctAdjacent1": 0.36,
                    "hpPctAdjacent2": 0.36,
                    "energyCost": 130
                },
                {
                    "hpPct": 0.96,
                    "hpPct2": 0.76,
                    "hpPctAdjacent1": 0.384,
                    "hpPctAdjacent2": 0.38
                },
                {
                    "hpPct": 1.02,
                    "hpPct2": 0.81,
                    "hpPctAdjacent1": 0.408,
                    "hpPctAdjacent2": 0.4
                },
                {
                    "hpPct": 1.08,
                    "hpPct2": 0.86,
                    "hpPctAdjacent1": 0.432,
                    "hpPctAdjacent2": 0.43
                },
                {
                    "hpPct": 1.14,
                    "hpPct2": 0.91,
                    "hpPctAdjacent1": 0.456,
                    "hpPctAdjacent2": 0.45
                },
                {
                    "hpPct": 1.2,
                    "hpPct2": 0.96,
                    "hpPctAdjacent1": 0.48,
                    "hpPctAdjacent2": 0.48
                },
                {
                    "hpPct": 1.27,
                    "hpPct2": 1.02,
                    "hpPctAdjacent1": 0.51,
                    "hpPctAdjacent2": 0.51
                },
                {
                    "hpPct": 1.35,
                    "hpPct2": 1.08,
                    "hpPctAdjacent1": 0.54,
                    "hpPctAdjacent2": 0.54
                },
                {
                    "hpPct": 1.42,
                    "hpPct2": 1.14,
                    "hpPctAdjacent1": 0.57,
                    "hpPctAdjacent2": 0.57
                },
                {
                    "hpPct": 1.5,
                    "hpPct2": 1.2,
                    "hpPctAdjacent1": 0.6,
                    "hpPctAdjacent2": 0.6
                },
                {
                    "hpPct": 1.56,
                    "hpPct2": 1.24,
                    "hpPctAdjacent1": 0.624,
                    "hpPctAdjacent2": 0.62
                },
                {
                    "hpPct": 1.62,
                    "hpPct2": 1.29,
                    "hpPctAdjacent1": 0.648,
                    "hpPctAdjacent2": 0.64
                }
            ]
        },
        "talent": {
            "name": "倏忽の恩賜",
            "sourceHeader": "天賦",
            "type": "follow_up",
            "target": "all",
            "description": "[全体攻撃]刃がダメージを受ける、またはHPを消費した時、チャージを1層獲得する。チャージは最大で5層累積できる。この効果は攻撃を1回受ける度に1層まで累積できる。チャージが上限に達した時、敵全体に追加攻撃を1回行い、刃の最大HPX%分の風属性ダメージを与え、刃の最大HP25%分のHPを回復する。追加攻撃を行った後、すべてのチャージを消費する。",
            "levelColumns": [
                "全体ダメージ倍率(最大HPX%)"
            ],
            "levels": [
                {
                    "hpPct": 0.65
                },
                {
                    "hpPct": 0.71
                },
                {
                    "hpPct": 0.78
                },
                {
                    "hpPct": 0.84
                },
                {
                    "hpPct": 0.91
                },
                {
                    "hpPct": 0.97
                },
                {
                    "hpPct": 1.05
                },
                {
                    "hpPct": 1.13
                },
                {
                    "hpPct": 1.21
                },
                {
                    "hpPct": 1.3
                },
                {
                    "hpPct": 1.36
                },
                {
                    "hpPct": 1.43
                }
            ]
        },
        "technique": {
            "name": "業途風",
            "sourceHeader": "秘技",
            "type": "attack",
            "target": "all",
            "description": "敵を攻撃。戦闘に入った後、刃の最大HP20%分のHPを消費し、敵全体に刃の最大HP40%分の風属性ダメージを与える。残りHPが足りない場合、秘技を発動した時、刃の残りHPが1になる。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "無尽形寿刃が必殺技を発動する時、クリアされる失ったHPの累計値が50%になる。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "百死耐忍治癒を受ける時の回復量+20%。治癒を受けた後、治癒量の25％分が必殺技で参照する失ったHPの累計値に加算される。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "壊劫滅亡天賦による追加攻撃の与ダメージ+20%、さらにEPを15回復する。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "形寿記せし剣身 地獄変の如く",
            "description": "指定した敵単体に対する強化通常攻撃と必殺技の与ダメージの数値が、必殺技で参照する失ったHPの累計値150％分アップする。"
        },
        "2": {
            "name": "支離の旧夢 万事が遺恨",
            "description": "刃が「地獄変」状態の時、会心率+15%。"
        },
        "3": {
            "name": "鍛造されし玄鋼 寒光放つ",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "4": {
            "name": "冥府の岐路越え 回生せし骸",
            "description": "残りHPが50%を超える状態から、50%以下になった時、最大HP+20%、この効果は最大で2層累積できる。"
        },
        "5": {
            "name": "十王の大辟 懸かり照らす業鏡",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "6": {
            "name": "涸れし魂魄留まりて 此の身に戻る",
            "description": "チャージ層数の上限が4層になる。天賦による追加攻撃の与ダメージが、さらに刃の最大HP50%分アップする。"
        }
    },
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "skill_dmg",
            "source": "skill",
            "name": "地獄変",
            "description": "[強化]刃のHPを最大HP30%分消費して「地獄変」状態に入る。「地獄変」状態では戦闘スキルを発動できず、自身の与ダメージ+X%、敵に攻撃される確率が大幅に上がり、通常攻撃「支離剣」が「無間剣樹」に強化される、3ターン継続。残りHPが足りない場合、戦闘スキルを発動した時、刃の残りHPが1になる。この戦闘スキルはEPを回復できない。この戦闘スキルを発動した後、ターンは終了しない。",
            "fromLevel": "skill",
            "stat": "DMG_ALL",
            "statField": "dmgBuff",
            "duration": 3
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e2_crit_rate",
            "source": "eidolon",
            "name": "支離の旧夢 万事が遺恨",
            "description": "刃が「地獄変」状態の時、会心率+15%。",
            "stat": "CRIT_RATE",
            "value": 0.15,
            "minEidolon": 2
        },
        {
            "id": "extra6_followup_dmg",
            "source": "extra",
            "name": "昇格6",
            "description": "天賦による追加攻撃の与ダメージ+20%。",
            "defaultActive": false,
            "target": "single",
            "stat": "DMG_FOLLOWUP",
            "value": 0.2
        },
        {
            "id": "e4_hp_percent",
            "source": "eidolon",
            "name": "冥府の岐路越え 回生せし骸",
            "description": "残りHPが50%を超える状態から50%以下になった時、最大HP+20%。最大2層。",
            "defaultActive": false,
            "target": "single",
            "minEidolon": 4,
            "stat": "HP_PERCENT",
            "value": 0.2,
            "stackable": {
                "max": 2,
                "default": 2
            }
        }
    ],
    "partyEffects": [],
    "enemyEffects": []
});
