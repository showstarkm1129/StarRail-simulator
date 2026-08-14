import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Clara",
    "id": "clara",
    "name": "クラーラ",
    "element": "Physical",
    "elementLabel": "物理",
    "path": "Destruction",
    "rarity": 5,
    "base": {
        "hp": 1241,
        "atk": 737,
        "def": 485,
        "spd": 90
    },
    "maxEnergy": 110,
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
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%82%AF%E3%83%A9%E3%83%BC%E3%83%A9",
        "version": "1.0"
    },
    "skills": {
        "basic": {
            "name": "クラーラもお手伝いします",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にクラーラの攻撃力のX％の物理ダメージを与える。",
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
            "name": "スヴァローグが見てる",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]敵全体にクラーラの攻撃力X%分の物理ダメージを与える。スヴァローグに「反撃の印」を付与された敵に対し、さらにクラーラの攻撃力Y%分の物理ダメージを与える。戦闘スキルを発動した後、すべての「反撃の印」が失効する。",
            "levelColumns": [
                "ダメージ倍率(X%)",
                "追加ダメージ倍率(Y%)"
            ],
            "levels": [
                {
                    "atk": 0.6,
                    "atkExtra": 0.6
                },
                {
                    "atk": 0.66,
                    "atkExtra": 0.66
                },
                {
                    "atk": 0.72,
                    "atkExtra": 0.72
                },
                {
                    "atk": 0.78,
                    "atkExtra": 0.78
                },
                {
                    "atk": 0.84,
                    "atkExtra": 0.84
                },
                {
                    "atk": 0.9,
                    "atkExtra": 0.9
                },
                {
                    "atk": 0.97,
                    "atkExtra": 0.97
                },
                {
                    "atk": 1.05,
                    "atkExtra": 1.05
                },
                {
                    "atk": 1.12,
                    "atkExtra": 1.12
                },
                {
                    "atk": 1.2,
                    "atkExtra": 1.2
                },
                {
                    "atk": 1.26,
                    "atkExtra": 1.26
                },
                {
                    "atk": 1.32,
                    "atkExtra": 1.32
                }
            ]
        },
        "ult": {
            "name": "命令じゃなくて約束",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "single",
            "description": "[強化]必殺技を発動した後、さらにクラーラの被ダメージ-X%、敵に攻撃される確率が大幅アップ、2ターン継続。スヴァローグのカウンターを強化。任意の味方が攻撃を受けた後、スヴァローグが攻撃者にカウンターを行い、カウンターのダメージ倍率+Y%、隣接する敵にメインターゲットに対する50%分のダメージを与える。強化効果は2回発動できる。",
            "levelColumns": [
                "被ダメージダウン(X%)",
                "ダメージ倍率アップ(Y%)",
                "消費EP"
            ],
            "levels": [
                {
                    "dmgTaken": 0.15,
                    "atk": 0.96,
                    "energyCost": 110
                },
                {
                    "dmgTaken": 0.16,
                    "atk": 1.02
                },
                {
                    "dmgTaken": 0.17,
                    "atk": 1.08
                },
                {
                    "dmgTaken": 0.18,
                    "atk": 1.15
                },
                {
                    "dmgTaken": 0.19,
                    "atk": 1.21
                },
                {
                    "dmgTaken": 0.2,
                    "atk": 1.28
                },
                {
                    "dmgTaken": 0.21,
                    "atk": 1.36
                },
                {
                    "dmgTaken": 0.22,
                    "atk": 1.44
                },
                {
                    "dmgTaken": 0.23,
                    "atk": 1.52
                },
                {
                    "dmgTaken": 0.25,
                    "atk": 1.6
                },
                {
                    "dmgTaken": 0.26,
                    "atk": 1.68
                },
                {
                    "dmgTaken": 0.27,
                    "atk": 1.76
                }
            ]
        },
        "talent": {
            "name": "家族なんだから",
            "sourceHeader": "天賦",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]クラーラはスヴァローグの保護により被ダメージ-10%。クラーラを攻撃した敵に対し、スヴァローグが「反撃の印」を付与してカウンターし、クラーラの攻撃力X%分の物理ダメージを与える。",
            "levelColumns": [
                "ダメージ倍率(X%)"
            ],
            "levels": [
                {
                    "atk": 0.8
                },
                {
                    "atk": 0.88
                },
                {
                    "atk": 0.96
                },
                {
                    "atk": 1.04
                },
                {
                    "atk": 1.12
                },
                {
                    "atk": 1.2
                },
                {
                    "atk": 1.3
                },
                {
                    "atk": 1.4
                },
                {
                    "atk": 1.5
                },
                {
                    "atk": 1.6
                },
                {
                    "atk": 1.68
                },
                {
                    "atk": 1.76
                }
            ]
        },
        "technique": {
            "name": "勝利の小さな対価",
            "sourceHeader": "秘技",
            "type": "buff",
            "target": "single",
            "description": "敵を攻撃。戦闘に入った後、クラーラが敵に攻撃される確率がアップする、2ターン継続。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "家族攻撃を受けた時、35%の固定確率で自身のデバフを1つ解除する。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "守護行動制限系デバフを抵抗する確率+35%。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "復讐スヴァローグのカウンターの与ダメージ+30%。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "大きな後ろ姿",
            "description": "戦闘スキルを発動した後、敵に付与した「反撃の印」が失効しなくなる。"
        },
        "2": {
            "name": "ぎゅっとした抱擁",
            "description": "必殺技を発動した後、攻撃力+30%、2ターン継続。"
        },
        "3": {
            "name": "冷徹な鉄甲",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "家族の温かさ",
            "description": "攻撃を受けた後、クラーラの被ダメージ-30%、次のターンが回ってくるまで継続。"
        },
        "5": {
            "name": "小さな約束",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "長い間の付き添い",
            "description": "他の味方が攻撃された後も、スヴァローグは50%の固定確率で攻撃者にカウンターを行い、その敵に「反撃の印」を付与する。必殺技を発動した時、さらに強化反撃の回数+1。"
        }
    },
    "partyEffects": [],
    "enemyEffects": [],
    "selfEffects": [
        {
            "id": "extra6_counter_dmg",
            "source": "extra",
            "name": "昇格6",
            "description": "スヴァローグのカウンターの与ダメージ+30%。",
            "defaultActive": false,
            "target": "single",
            "stat": "DMG_FOLLOWUP",
            "value": 0.3
        },
        {
            "id": "e2_atk_percent",
            "source": "eidolon",
            "name": "ぎゅっとした抱擁",
            "description": "必殺技を発動した後、攻撃力+30%、2ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "minEidolon": 2,
            "stat": "ATK_PERCENT",
            "value": 0.3
        }
    ]
});
