import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Yukong",
    "id": "yukong",
    "name": "御空",
    "element": "Imaginary",
    "elementLabel": "虚数",
    "path": "Harmony",
    "rarity": 4,
    "base": {
        "hp": 917,
        "atk": 599,
        "def": 374,
        "spd": 107
    },
    "maxEnergy": 130,
    "traceBonuses": [
        {
            "label": "虚数ダメージ",
            "value": 0.224
        },
        {
            "label": "最大HP",
            "value": 0.18
        },
        {
            "label": "攻撃力",
            "value": 0.1
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E5%BE%A1%E7%A9%BA",
        "version": "1.1"
    },
    "skills": {
        "basic": {
            "name": "流鏑",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に御空の攻撃力X%分の虚数属性ダメージを与える。",
            "levelColumns": [
                "ダメージ倍率(X%)"
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
            "name": "天宮に鳴り響む弦",
            "sourceHeader": "戦闘スキル",
            "type": "buff",
            "target": "all_ally",
            "description": "[サポート]「鳴弦号令」を2層獲得する。「鳴弦号令」は最大で2層累積できる。御空に「鳴弦号令」がある時、味方全体の攻撃力+X%。味方のターンが終了するたびに、御空の「鳴弦号令」が1層減る。御空が戦闘スキルで「鳴弦号令」を獲得したターン、「鳴弦号令」は減らない。",
            "levelColumns": [
                "攻撃力アップ(X%)"
            ],
            "levels": [
                {
                    "atkBuff": 0.4
                },
                {
                    "atkBuff": 0.44
                },
                {
                    "atkBuff": 0.48
                },
                {
                    "atkBuff": 0.52
                },
                {
                    "atkBuff": 0.56
                },
                {
                    "atkBuff": 0.6
                },
                {
                    "atkBuff": 0.65
                },
                {
                    "atkBuff": 0.7
                },
                {
                    "atkBuff": 0.75
                },
                {
                    "atkBuff": 0.8
                },
                {
                    "atkBuff": 0.84
                },
                {
                    "atkBuff": 0.88
                }
            ]
        },
        "ult": {
            "name": "貫雲箭",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "all_ally",
            "damageComponents": [
                {
                    "id": "ult-single-target",
                    "label": "指定した敵単体",
                    "scalingStat": "atk",
                    "multiplierKey": "atk",
                    "target": "single"
                }
            ],
            "description": "[単体攻撃]必殺技を発動した時、御空に「鳴弦号令」がある場合、さらに味方全体の会心率+X%、会心ダメージ+Y%。指定した敵単体に御空の攻撃力Z%分の虚数属性ダメージを与える。",
            "levelColumns": [
                "会心率アップ(X％)",
                "会心ダメージアップ(Y%)",
                "ダメージ倍率(Z%)",
                "消費EP"
            ],
            "levels": [
                {
                    "critRateBuff": 0.21,
                    "cdBuff": 0.39,
                    "atk": 2.28,
                    "energyCost": 130
                },
                {
                    "critRateBuff": 0.217,
                    "cdBuff": 0.41,
                    "atk": 2.43
                },
                {
                    "critRateBuff": 0.224,
                    "cdBuff": 0.44,
                    "atk": 2.58
                },
                {
                    "critRateBuff": 0.231,
                    "cdBuff": 0.46,
                    "atk": 2.73
                },
                {
                    "critRateBuff": 0.238,
                    "cdBuff": 0.49,
                    "atk": 2.88
                },
                {
                    "critRateBuff": 0.245,
                    "cdBuff": 0.52,
                    "atk": 3.04
                },
                {
                    "critRateBuff": 0.254,
                    "cdBuff": 0.55,
                    "atk": 3.23
                },
                {
                    "critRateBuff": 0.262,
                    "cdBuff": 0.58,
                    "atk": 3.42
                },
                {
                    "critRateBuff": 0.271,
                    "cdBuff": 0.61,
                    "atk": 3.61
                },
                {
                    "critRateBuff": 0.28,
                    "cdBuff": 0.65,
                    "atk": 3.8
                },
                {
                    "critRateBuff": 0.28,
                    "cdBuff": 0.67,
                    "atk": 3.95
                },
                {
                    "critRateBuff": 0.294,
                    "cdBuff": 0.7,
                    "atk": 4.1
                }
            ]
        },
        "talent": {
            "name": "徹札矢",
            "sourceHeader": "天賦",
            "type": "buff",
            "target": "single",
            "description": "[強化]通常攻撃を行うと、さらに御空の攻撃力X%分の虚数属性ダメージを与え、その回の攻撃の削靭ダメージ+100%、この効果は1ターン後に再度発動できる。",
            "levelColumns": [
                "ダメージ倍率(X％)"
            ],
            "levels": [
                {
                    "atk": 0.4
                },
                {
                    "atk": 0.44
                },
                {
                    "atk": 0.48
                },
                {
                    "atk": 0.52
                },
                {
                    "atk": 0.56
                },
                {
                    "atk": 0.6
                },
                {
                    "atk": 0.65
                },
                {
                    "atk": 0.7
                },
                {
                    "atk": 0.75
                },
                {
                    "atk": 0.8
                },
                {
                    "atk": 0.84
                },
                {
                    "atk": 0.88
                }
            ]
        },
        "technique": {
            "name": "風追う雲鳶",
            "sourceHeader": "秘技",
            "type": "buff",
            "target": "single",
            "description": "[強化]秘技を使用した後、20秒間の疾走状態に入る。疾走状態では、自身の移動速度+35%。敵を先制攻撃して戦闘に入る時、御空は「鳴弦号令」を2層獲得する。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "襄尺デバフを付与された時、御空はそれを1回抵抗できる。この効果は2ターン後に再度発動できる。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "遅彝御空がフィールド上にいる時、味方全体の虚数属性与ダメージ+12%。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "気壮「鳴弦号令」がある時、味方が行動した後、御空はEPを2回復する。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "天舟の飛将 弓枕き戦を待つ",
            "description": "戦闘に入る時、味方全体の速度+10%、2ターン継続。"
        },
        "2": {
            "name": "青霄を駆け 蒼穹を御す",
            "description": "任意の味方のEPが満タンの時、御空はさらにEPを5回復する。この効果は味方1名につき1回まで発動できる。御空が必殺技を発動した後、この効果の発動可能回数がリセットされる。"
        },
        "3": {
            "name": "断絶せぬ危弓 止まぬ飛矢",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "百里の風拾い 九曲の鏑鳴らす",
            "description": "「鳴弦号令」がある時、御空の与ダメージ+30%。"
        },
        "5": {
            "name": "井儀の四矢 参連の疾羽",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "雷の如き弓弦 激動する銑弓",
            "description": "御空が必殺技を発動した時、先に「鳴弦号令」を1層獲得する。"
        }
    },
    "partyEffects": [
        {
            "id": "skill_atk_percent",
            "source": "skill",
            "name": "天宮に鳴り響む弦",
            "description": "[サポート]「鳴弦号令」を2層獲得する。「鳴弦号令」は最大で2層累積できる。御空に「鳴弦号令」がある時、味方全体の攻撃力+X%。味方のターンが終了するたびに、御空の「鳴弦号令」が1層減る。御空が戦闘スキルで「鳴弦号令」を獲得したターン、「鳴弦号令」は減らない。",
            "defaultActive": false,
            "target": "all",
            "fromLevel": "skill",
            "stat": "ATK_PERCENT",
            "statField": "atkBuff"
        },
        {
            "id": "ult_crit_rate",
            "source": "ult",
            "name": "貫雲箭",
            "description": "[単体攻撃]必殺技を発動した時、御空に「鳴弦号令」がある場合、さらに味方全体の会心率+X%、会心ダメージ+Y%。指定した敵単体に御空の攻撃力Z%分の虚数属性ダメージを与える。",
            "defaultActive": false,
            "target": "all",
            "fromLevel": "ult",
            "stat": "CRIT_RATE",
            "statField": "critRateBuff"
        },
        {
            "id": "e1_spd_percent",
            "source": "eidolon",
            "name": "天舟の飛将 弓枕き戦を待つ",
            "description": "戦闘に入る時、味方全体の速度+10%、2ターン継続。",
            "defaultActive": false,
            "target": "all",
            "duration": 2,
            "minEidolon": 1,
            "stat": "SPD_PERCENT",
            "value": 0.1
        },
        {
            "id": "ult_crit_dmg",
            "source": "ult",
            "name": "貫雲箭",
            "description": "[単体攻撃]必殺技を発動した時、御空に「鳴弦号令」がある場合、さらに味方全体の会心率+X%、会心ダメージ+Y%。指定した敵単体に御空の攻撃力Z%分の虚数属性ダメージを与える。",
            "defaultActive": false,
            "target": "all",
            "fromLevel": "ult",
            "stat": "CRIT_DMG",
            "statField": "cdBuff"
        },
        {
            "id": "extra4_imaginary_dmg",
            "source": "extra",
            "name": "昇格4",
            "description": "遅彝御空がフィールド上にいる時、味方全体の虚数属性与ダメージ+12%。",
            "defaultActive": true,
            "target": "all",
            "duration": "permanent",
            "stat": "DMG_IMAGINARY",
            "value": 0.12
        }
    ],
    "enemyEffects": [],
    "selfEffects": [
        {
            "id": "e4_roaring_bowstrings_dmg",
            "source": "eidolon",
            "name": "百里の風拾い 九曲の鏑鳴らす",
            "description": "「鳴弦号令」がある時、御空の与ダメージ+30%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 4,
            "stat": "DMG_ALL",
            "value": 0.3
        }
    ]
});
