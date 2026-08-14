import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Yunli",
    "id": "yunli",
    "name": "雲璃",
    "element": "Physical",
    "elementLabel": "物理",
    "path": "Destruction",
    "rarity": 5,
    "base": {
        "hp": 1358,
        "atk": 679,
        "def": 460,
        "spd": 94
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
            "label": "会心率",
            "value": 0.067
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E9%9B%B2%E7%92%83",
        "version": "2.4"
    },
    "skills": {
        "basic": {
            "name": "震天動地",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に雲璃の攻撃力X%分の物理属性ダメージを与える。",
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
            "name": "天威煌々",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "blast",
            "description": "[拡散攻撃]雲璃の攻撃力X%+YのHPを回復し、指定した敵単体に雲璃の攻撃力Z%分の物理属性ダメージを与え、隣接する敵に雲璃の攻撃力W%分の物理属性ダメージを与える。",
            "levelColumns": [
                "HP回復(攻撃力X%+Y)",
                "単体ダメージ倍率(Z%)",
                "隣接ダメージ倍率(W%)"
            ],
            "levels": [
                {
                    "healPct": 0.2,
                    "healFlat": 50,
                    "hpPct": 0.6,
                    "hpPctAdjacent": 0.3
                },
                {
                    "healPct": 0.212,
                    "healFlat": 80,
                    "hpPct": 0.66,
                    "hpPctAdjacent": 0.33
                },
                {
                    "healPct": 0.225,
                    "healFlat": 102,
                    "hpPct": 0.72,
                    "hpPctAdjacent": 0.36
                },
                {
                    "healPct": 0.237,
                    "healFlat": 125,
                    "hpPct": 0.78,
                    "hpPctAdjacent": 0.39
                },
                {
                    "healPct": 0.25,
                    "healFlat": 140,
                    "hpPct": 0.84,
                    "hpPctAdjacent": 0.42
                },
                {
                    "healPct": 0.26,
                    "healFlat": 155,
                    "hpPct": 0.9,
                    "hpPctAdjacent": 0.45
                },
                {
                    "healPct": 0.27,
                    "healFlat": 166,
                    "hpPct": 0.97,
                    "hpPctAdjacent": 0.48
                },
                {
                    "healPct": 0.28,
                    "healFlat": 177,
                    "hpPct": 1.05,
                    "hpPctAdjacent": 0.52
                },
                {
                    "healPct": 0.29,
                    "healFlat": 188,
                    "hpPct": 1.12,
                    "hpPctAdjacent": 0.56
                },
                {
                    "healPct": 0.3,
                    "healFlat": 200,
                    "hpPct": 1.2,
                    "hpPctAdjacent": 0.6
                },
                {
                    "healPct": 0.31,
                    "healFlat": 211,
                    "hpPct": 1.26,
                    "hpPctAdjacent": 0.63
                },
                {
                    "healPct": 0.32,
                    "healFlat": 222,
                    "hpPct": 1.32,
                    "hpPctAdjacent": 0.66
                }
            ]
        },
        "ult": {
            "name": "天を揺るがす大地の剣",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "all",
            "description": "[強化]EPを120消費し、雲璃が「構え」状態に入り、敵全体を挑発状態にする。次に行動する味方または敵のターンが終了するときまで継続。雲璃の次のカウンターダメージの会心ダメージ+X%。天賦によるカウンターを発動する時、代わりにカウンター「看破・滅」を発動し、「構え」状態を解除する。「構え」状態の間、カウンターを発動しなかった場合、「構え」状態が解除される時、雲璃はランダムな敵にカウンター「看破・斬」を発動する。「看破・斬」：敵に雲璃の攻撃力Y%分の物理属性ダメージを与え、隣接する敵に雲璃の攻撃力Z%分の物理属性ダメージを与える。「看破・滅」：敵に雲璃の攻撃力Y%分の物理属性ダメージを与え、隣接する敵に雲璃の攻撃力Z%分の物理属性ダメージを与える。その後、追加で6ヒットする。1ヒットにつき、ランダムな敵単体に雲璃の攻撃力W%分の物理属性ダメージを与える。雲璃がこのスキルでダメージを与える時、必殺技ダメージを与えたとみなされる。",
            "levelColumns": [
                "会心ダメージアップ(+X%)",
                "強化カウンター倍率",
                "「看破・滅」追加ヒット",
                "消費EP"
            ],
            "levels": [
                {
                    "cdRatio": 0.6,
                    "atk": 1.32,
                    "atkExtra": 0.66,
                    "energyCost": 0.43
                },
                {
                    "cdRatio": 0.64,
                    "atk": 1.4,
                    "atkExtra": 0.7,
                    "energyCost": 0.46
                },
                {
                    "cdRatio": 0.68,
                    "atk": 1.49,
                    "atkExtra": 0.74,
                    "energyCost": 0.49
                },
                {
                    "cdRatio": 0.72,
                    "atk": 1.58,
                    "atkExtra": 0.79,
                    "energyCost": 0.51
                },
                {
                    "cdRatio": 0.76,
                    "atk": 1.67,
                    "atkExtra": 0.83,
                    "energyCost": 0.54
                },
                {
                    "cdRatio": 0.8,
                    "atk": 1.76,
                    "atkExtra": 0.88,
                    "energyCost": 0.57
                },
                {
                    "cdRatio": 0.85,
                    "atk": 1.87,
                    "atkExtra": 0.93,
                    "energyCost": 0.61
                },
                {
                    "cdRatio": 0.9,
                    "atk": 1.98,
                    "atkExtra": 0.99,
                    "energyCost": 0.64
                },
                {
                    "cdRatio": 0.95,
                    "atk": 2.09,
                    "atkExtra": 1.04,
                    "energyCost": 0.68
                },
                {
                    "cdRatio": 1,
                    "atk": 2.2,
                    "atkExtra": 1.1,
                    "energyCost": 0.72
                },
                {
                    "cdRatio": 1.04,
                    "atk": 2.29,
                    "atkExtra": 1.14,
                    "energyCost": 0.74
                },
                {
                    "cdRatio": 1.08,
                    "atk": 2.37,
                    "atkExtra": 1.18,
                    "energyCost": 0.77
                }
            ]
        },
        "talent": {
            "name": "閃溶",
            "sourceHeader": "天賦",
            "type": "attack",
            "target": "blast",
            "description": "[拡散攻撃]雲璃が敵の攻撃を受けた後、さらにEPを15回復し、即座に攻撃者にカウンターを発動し、雲璃の攻撃力X%分の物理属性ダメージを与え、隣接する敵に雲璃の攻撃力Y%分の物理属性ダメージを与える。カウンターの対象となるはずの敵がすでにいない場合、ランダムな敵にカウンターを発動する。",
            "levelColumns": [
                "単体ダメージ倍率(X%)",
                "隣接ダメージ倍率(Y%)"
            ],
            "levels": [
                {
                    "atk": 0.6,
                    "atkAdjacent": 0.3
                },
                {
                    "atk": 0.66,
                    "atkAdjacent": 0.33
                },
                {
                    "atk": 0.72,
                    "atkAdjacent": 0.36
                },
                {
                    "atk": 0.78,
                    "atkAdjacent": 0.39
                },
                {
                    "atk": 0.84,
                    "atkAdjacent": 0.42
                },
                {
                    "atk": 0.9,
                    "atkAdjacent": 0.45
                },
                {
                    "atk": 0.97,
                    "atkAdjacent": 0.48
                },
                {
                    "atk": 1.05,
                    "atkAdjacent": 0.52
                },
                {
                    "atk": 1.12,
                    "atkAdjacent": 0.56
                },
                {
                    "atk": 1.2,
                    "atkAdjacent": 0.6
                },
                {
                    "atk": 1.26,
                    "atkAdjacent": 0.63
                },
                {
                    "atk": 1.32,
                    "atkAdjacent": 0.66
                }
            ]
        },
        "technique": {
            "name": "後の先",
            "sourceHeader": "秘技",
            "type": "buff",
            "target": "single",
            "description": "[強化]自身に「迎撃」状態を付与する、20秒継続。効果期間中、敵を先制攻撃、または攻撃を受けて戦闘に入った後、即座にランダムな敵単体に「看破・滅」を発動する。その回の攻撃の与ダメージ+80%。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "炎輪「看破・斬」を1回発動した後、次の「看破・斬」は「看破・滅」に変わる。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "劫邪「構え」状態の時、行動制限系デバフに抵抗し、受けるダメージ-20%。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "真鋼カウンターを発動する時、雲璃の攻撃力+30%、1ターン継続。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "無垢なる歴刃",
            "description": "「看破・斬」の与ダメージと「看破・滅」の与ダメージ+20%。「看破・滅」の追加のヒット数+3。"
        },
        "2": {
            "name": "新たに生まれた光",
            "description": "カウンターを発動してダメージを与える時、敵の防御力を20%無視する。"
        },
        "3": {
            "name": "九尺運斤",
            "description": "必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "大匠撃砧",
            "description": "「看破・斬」または「看破・滅」を発動した後、自身の効果抵抗+50%、1ターン継続。"
        },
        "5": {
            "name": "我が剣、石に匪ず",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "琴心剣胆",
            "description": "「構え」状態の間、敵が能動的にスキルを発動する時、雲璃を攻撃していなくても雲璃は「看破・滅」を発動し、「構え」状態を解除する。「看破・斬」または「看破・滅」を発動してダメージを与える時、会心率+15%、物理属性耐性貫通+20%。"
        }
    },
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "technique_dmg",
            "source": "technique",
            "name": "後の先",
            "description": "[強化]自身に「迎撃」状態を付与する、20秒継続。効果期間中、敵を先制攻撃、または攻撃を受けて戦闘に入った後、即座にランダムな敵単体に「看破・滅」を発動する。その回の攻撃の与ダメージ+80%。",
            "stat": "DMG_ALL",
            "value": 0.8
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "extra6_atk_percent",
            "source": "extra",
            "name": "昇格6",
            "description": "真鋼カウンターを発動する時、雲璃の攻撃力+30%、1ターン継続。",
            "stat": "ATK_PERCENT",
            "value": 0.3,
            "duration": 1
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e6_counter_buff",
            "source": "eidolon",
            "name": "琴心剣胆",
            "description": "「構え」状態の間、敵が能動的にスキルを発動する時、雲璃を攻撃していなくても雲璃は「看破・滅」を発動し、「構え」状態を解除する。「看破・斬」または「看破・滅」を発動してダメージを与える時、会心率+15%、物理属性耐性貫通+20%。",
            "stats": {
                "CRIT_RATE": 0.15,
                "RES_PEN": 0.2
            },
            "minEidolon": 6
        },
        {
            "id": "ult_counter_crit_dmg",
            "source": "ult",
            "name": "天を揺るがす大地の剣",
            "description": "雲璃の次のカウンターダメージの会心ダメージ+X%。このダメージは必殺技ダメージとみなされるため、必殺会心ダメ枠で扱う。",
            "defaultActive": false,
            "target": "single",
            "fromLevel": "ult",
            "stat": "CRIT_DMG_ULT",
            "statField": "cdRatio"
        },
        {
            "id": "e1_parry_dmg",
            "source": "eidolon",
            "name": "無垢なる歴刃",
            "description": "「看破・斬」の与ダメージと「看破・滅」の与ダメージ+20%。",
            "defaultActive": false,
            "target": "single",
            "minEidolon": 1,
            "stat": "DMG_ULT",
            "value": 0.2
        },
        {
            "id": "e2_counter_def_ignore",
            "source": "eidolon",
            "name": "新たに生まれた光",
            "description": "カウンターを発動してダメージを与える時、敵の防御力を20%無視する。",
            "defaultActive": false,
            "target": "single",
            "minEidolon": 2,
            "stat": "DEF_IGNORE_FOLLOWUP",
            "value": 0.2
        },
        {
            "id": "e4_parry_effect_res",
            "source": "eidolon",
            "name": "大匠撃砧",
            "description": "「看破・斬」または「看破・滅」を発動した後、自身の効果抵抗+50%、1ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 1,
            "minEidolon": 4,
            "stat": "EFFECT_RES",
            "value": 0.5
        }
    ],
    "partyEffects": [],
    "enemyEffects": []
});
