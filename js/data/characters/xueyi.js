import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Xueyi",
    "id": "xueyi",
    "name": "雪衣",
    "element": "Quantum",
    "elementLabel": "量子",
    "path": "Destruction",
    "rarity": 4,
    "base": {
        "hp": 1058,
        "atk": 599,
        "def": 396,
        "spd": 103
    },
    "maxEnergy": 120,
    "traceBonuses": [
        {
            "label": "撃破特効",
            "value": 0.373
        },
        {
            "label": "最大HP",
            "value": 0.18
        },
        {
            "label": "量子ダメージ",
            "value": 0.08
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E9%9B%AA%E8%A1%A3",
        "version": "1.6"
    },
    "skills": {
        "basic": {
            "name": "破魔錐",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に雪衣の攻撃力X%分の量子属性ダメージを与える。",
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
            "name": "諸悪摂伏",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "blast",
            "description": "[拡散攻撃]指定した敵単体に雪衣の攻撃力X%分の量子属性ダメージを与え、隣接する敵に雪衣の攻撃力Y%分の量子属性ダメージを与える。",
            "levelColumns": [
                "単体ダメージ倍率(X%)",
                "隣接ダメージ倍率(Y%)"
            ],
            "levels": [
                {
                    "atk": 0.7,
                    "atkAdjacent": 0.35
                },
                {
                    "atk": 0.77,
                    "atkAdjacent": 0.38
                },
                {
                    "atk": 0.84,
                    "atkAdjacent": 0.42
                },
                {
                    "atk": 0.91,
                    "atkAdjacent": 0.45
                },
                {
                    "atk": 0.98,
                    "atkAdjacent": 0.49
                },
                {
                    "atk": 1.05,
                    "atkAdjacent": 0.52
                },
                {
                    "atk": 1.13,
                    "atkAdjacent": 0.56
                },
                {
                    "atk": 1.22,
                    "atkAdjacent": 0.61
                },
                {
                    "atk": 1.31,
                    "atkAdjacent": 0.65
                },
                {
                    "atk": 1.4,
                    "atkAdjacent": 0.7
                },
                {
                    "atk": 1.47,
                    "atkAdjacent": 0.74
                },
                {
                    "atk": 1.54,
                    "atkAdjacent": 0.77
                }
            ]
        },
        "ult": {
            "name": "身を貫く天罰",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に雪衣の攻撃力X%分の量子属性ダメージを与え、弱点属性を無視して敵の靭性を削る。敵を弱点撃破した時、量子属性の弱点撃破効果を触発する。削った靭性が多いほど、その回の攻撃の与ダメージがアップする、最大で与ダメージ+Y%。",
            "levelColumns": [
                "ダメージ倍率(X%)",
                "与ダメージアップ(Y%)",
                "消費EP"
            ],
            "levels": [
                {
                    "atk": 1.5,
                    "dmgBuff": 0.36,
                    "energyCost": 120
                },
                {
                    "atk": 1.6,
                    "dmgBuff": 0.384
                },
                {
                    "atk": 1.7,
                    "dmgBuff": 0.408
                },
                {
                    "atk": 1.8,
                    "dmgBuff": 0.432
                },
                {
                    "atk": 1.9,
                    "dmgBuff": 0.456
                },
                {
                    "atk": 2,
                    "dmgBuff": 0.48
                },
                {
                    "atk": 2.12,
                    "dmgBuff": 0.51
                },
                {
                    "atk": 2.25,
                    "dmgBuff": 0.54
                },
                {
                    "atk": 2.37,
                    "dmgBuff": 0.57
                },
                {
                    "atk": 2.5,
                    "dmgBuff": 0.6
                },
                {
                    "atk": 2.6,
                    "dmgBuff": 0.624
                },
                {
                    "atk": 2.7,
                    "dmgBuff": 0.648
                }
            ]
        },
        "talent": {
            "name": "十王の聖裁、業報は常に在り",
            "sourceHeader": "天賦",
            "type": "follow_up",
            "target": "bounce",
            "description": "[バウンド]雪衣が攻撃を行って敵の靭性を削った時、「悪業」を獲得する。削った靭性が多いほど、獲得する「悪業」層数がアップする、最大で8層獲得できる。雪衣以外の味方が攻撃を行って敵の靭性を削った後、雪衣は「悪業」を1層獲得する。「悪業」が上限に達した時、すべての「悪業」を消費して敵に追加攻撃を行い、3ヒットする。1ヒットごとにランダムな敵単体に雪衣の攻撃力X%分の量子属性ダメージを与える。この追加攻撃で「悪業」を獲得することはできない。",
            "levelColumns": [
                "ランダムダメージ倍率(X%)"
            ],
            "levels": [
                {
                    "atk": 0.45
                },
                {
                    "atk": 0.49
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
                    "atk": 0.73
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
                    "atk": 0.95
                },
                {
                    "atk": 0.99
                }
            ]
        },
        "technique": {
            "name": "斬、即決",
            "sourceHeader": "秘技",
            "type": "attack",
            "target": "all",
            "description": "敵を攻撃。戦闘開始後、敵全体に雪衣の攻撃力80%分の量子属性ダメージを与える。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "予兆の絡繰り自身の与ダメージを、撃破特効の100%分アップする、最大で与ダメージ+240%。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "砕鋒の軸受必殺技を発動した時、残り靭性が最大靭性50%以上の敵への与ダメージ+10%。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "機会を伺う中枢雪衣は累積上限を超えた「悪業」層数をカウントする、最大で6層カウントできる。雪衣が天賦を発動した後、超過分の「悪業」層数を獲得する。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "心魔縛り",
            "description": "天賦の追加攻撃の与ダメージ+40%。"
        },
        "2": {
            "name": "五塵破り",
            "description": "天賦の追加攻撃は敵の弱点属性を無視して靭性を削り、自身の最大HP5%分のHPを回復する。敵を弱点撃破した時、量子属性の弱点撃破効果を発動する。"
        },
        "3": {
            "name": "苦諦止め",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "業根断ち",
            "description": "必殺技を発動した時、撃破特効+40%、2ターン継続。"
        },
        "5": {
            "name": "霊神囚え",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "生死司る",
            "description": "「悪業」の累積上限が6層になる。"
        }
    },
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "ult_toughness_dmg",
            "source": "ult",
            "name": "身を貫く天罰",
            "description": "[単体攻撃]指定した敵単体に雪衣の攻撃力X%分の量子属性ダメージを与え、弱点属性を無視して敵の靭性を削る。敵を弱点撃破した時、量子属性の弱点撃破効果を触発する。削った靭性が多いほど、その回の攻撃の与ダメージがアップする、最大で与ダメージ+Y%。",
            "fromLevel": "ult",
            "stat": "DMG_ALL",
            "statField": "dmgBuff"
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "extra2_break_to_dmg",
            "source": "extra",
            "name": "昇格2",
            "description": "予兆の絡繰り自身の与ダメージを、撃破特効の100%分アップする、最大で与ダメージ+240%。",
            "stat": "DMG_ALL",
            "compute": "casterRawRatioCap",
            "sourceStat": "breakEffect",
            "ratio": 1,
            "cap": 2.4
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e4_break_effect",
            "source": "eidolon",
            "name": "業根断ち",
            "description": "必殺技を発動した時、撃破特効+40%、2ターン継続。",
            "stat": "BREAK_EFFECT",
            "value": 0.4,
            "minEidolon": 4,
            "duration": 2
        },
        {
            "id": "extra4_ult_toughness_dmg",
            "source": "extra",
            "name": "昇格4",
            "description": "必殺技を発動した時、残り靭性が最大靭性50%以上の敵への与ダメージ+10%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "stat": "DMG_ULT",
            "value": 0.1
        },
        {
            "id": "e1_followup_dmg",
            "source": "eidolon",
            "name": "心魔縛り",
            "description": "天賦の追加攻撃の与ダメージ+40%。",
            "defaultActive": false,
            "target": "single",
            "minEidolon": 1,
            "stat": "DMG_FOLLOWUP",
            "value": 0.4
        }
    ],
    "partyEffects": [],
    "enemyEffects": []
});
