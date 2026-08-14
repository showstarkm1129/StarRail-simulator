import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Qingque",
    "id": "qingque",
    "name": "青雀",
    "element": "Quantum",
    "elementLabel": "量子",
    "path": "Erudition",
    "rarity": 4,
    "base": {
        "hp": 1023,
        "atk": 652,
        "def": 441,
        "spd": 98
    },
    "maxEnergy": 140,
    "traceBonuses": [
        {
            "label": "攻撃力",
            "value": 0.28
        },
        {
            "label": "量子ダメージ",
            "value": 0.144
        },
        {
            "label": "防御力",
            "value": 0.125
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E9%9D%92%E9%9B%80",
        "version": "1.0"
    },
    "skills": {
        "basic": {
            "name": "門前清",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]数が一番少ない絵柄の美玉牌を1枚使用し、指定した敵単体に青雀の攻撃力X％分の量子属性ダメージを与える。",
            "levelColumns": [
                "門前清",
                "嶺上開花！"
            ],
            "levels": [
                {
                    "atk": 0.5,
                    "atkAlt2": 1.2
                },
                {
                    "atk": 0.6,
                    "atkAlt2": 1.44
                },
                {
                    "atk": 0.7,
                    "atkAlt2": 1.68
                },
                {
                    "atk": 0.8,
                    "atkAlt2": 1.92
                },
                {
                    "atk": 0.9,
                    "atkAlt2": 2.16
                },
                {
                    "atk": 1,
                    "atkAlt2": 2.4
                },
                {
                    "atk": 1.1,
                    "atkAlt2": 2.64
                }
            ]
        },
        "skill": {
            "name": "海底撈月",
            "sourceHeader": "戦闘スキル",
            "type": "buff",
            "target": "single",
            "description": "[強化]牌を2枚取り、自身の与ダメージ+X%、このターンが終了するまで継続。この効果は最大で4層累積できる。この戦闘スキルを発動した後、ターンは終了しない。",
            "levelColumns": [
                "与ダメージアップ(X%)"
            ],
            "levels": [
                {
                    "dmgBuff": 0.14
                },
                {
                    "dmgBuff": 0.15
                },
                {
                    "dmgBuff": 0.16
                },
                {
                    "dmgBuff": 0.18
                },
                {
                    "dmgBuff": 0.19
                },
                {
                    "dmgBuff": 0.21
                },
                {
                    "dmgBuff": 0.22
                },
                {
                    "dmgBuff": 0.24
                },
                {
                    "dmgBuff": 0.26
                },
                {
                    "dmgBuff": 0.28
                },
                {
                    "dmgBuff": 0.29
                },
                {
                    "dmgBuff": 0.3
                }
            ]
        },
        "ult": {
            "name": "幺魚暗カン？アガリ！",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]敵全体に青雀の攻撃力X％分の量子属性ダメージを与え、同じ絵柄の美玉牌を4枚獲得する。",
            "levelColumns": [
                "全体ダメージ倍率(X％)",
                "消費EP"
            ],
            "levels": [
                {
                    "atk": 1.2,
                    "energyCost": 140
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
            "name": "帝垣美玉",
            "sourceHeader": "天賦",
            "type": "buff",
            "target": "single",
            "description": "[強化]味方のターンが回ってきた時、青雀は3つの絵柄の美玉牌の中からランダムに1枚取る、手持ちの美玉牌は最大で4枚まで。青雀のターンが回ってきた時、手持ちに同じ絵柄の美玉牌が4枚ある場合、青雀は全ての美玉牌を消費して「暗カン」状態に入る。「暗カン」状態の時は戦闘スキルを発動できず、自身の攻撃力+X%、通常攻撃「門前清」が「嶺上開花！」に強化される。「暗カン」状態は「嶺上開花！」を発動した後に終了する。",
            "levelColumns": [
                "攻撃力アップ(X%)"
            ],
            "levels": [
                {
                    "atkBuff": 0.36
                },
                {
                    "atkBuff": 0.39
                },
                {
                    "atkBuff": 0.43
                },
                {
                    "atkBuff": 0.46
                },
                {
                    "atkBuff": 0.5
                },
                {
                    "atkBuff": 0.54
                },
                {
                    "atkBuff": 0.58
                },
                {
                    "atkBuff": 0.63
                },
                {
                    "atkBuff": 0.67
                },
                {
                    "atkBuff": 0.72
                },
                {
                    "atkBuff": 0.75
                },
                {
                    "atkBuff": 0.79
                }
            ]
        },
        "technique": {
            "name": "独奕の楽しみ",
            "sourceHeader": "秘技",
            "type": "buff",
            "target": "single",
            "description": "[強化]秘技を使用した後、戦闘に入る時、青雀は美玉牌を2枚取る。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "争番戦闘スキルを発動した時、SPを1回復する。この効果は一度の戦闘で1回まで発動できる。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "聴牌戦闘スキルによる、自身の与ダメージアップ効果がさらに10%アップする。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "チャンカン強化通常攻撃を行った後、青雀の速度+10%、1ターン継続。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "幺魚と戯れる孤兵",
            "description": "必殺技の与ダメージ+10%。"
        },
        "2": {
            "name": "碁盤は枕、快眠の助け",
            "description": "青雀は牌を取るたびにEPを1回復する。"
        },
        "3": {
            "name": "無我夢中に門前清",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "4": {
            "name": "地獄待ちも穏やかに",
            "description": "戦闘スキルを発動した後、24%の固定確率「門前ツモ」状態に入る、このターンが終了するまで継続。「門前ツモ」状態では、通常攻撃または強化通常攻撃を行った後に追加攻撃を1回行い、敵にその通常攻撃または強化通常攻撃のダメージ100％分の量子属性ダメージを与える。"
        },
        "5": {
            "name": "世渡りは豪運任せ",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "6": {
            "name": "悠長に構えて流れを待つ",
            "description": "強化通常攻撃を行った後、SPを1回復する。"
        }
    },
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "skill_dmg",
            "source": "skill",
            "name": "海底撈月",
            "description": "[強化]牌を2枚取り、自身の与ダメージ+X%、このターンが終了するまで継続。この効果は最大で4層累積できる。この戦闘スキルを発動した後、ターンは終了しない。",
            "fromLevel": "skill",
            "stat": "DMG_ALL",
            "statField": "dmgBuff",
            "stackable": {
                "max": 4,
                "default": 4
            }
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "talent_atk_percent",
            "source": "talent",
            "name": "帝垣美玉",
            "description": "[強化]味方のターンが回ってきた時、青雀は3つの絵柄の美玉牌の中からランダムに1枚取る、手持ちの美玉牌は最大で4枚まで。青雀のターンが回ってきた時、手持ちに同じ絵柄の美玉牌が4枚ある場合、青雀は全ての美玉牌を消費して「暗カン」状態に入る。「暗カン」状態の時は戦闘スキルを発動できず、自身の攻撃力+X%、通常攻撃「門前清」が「嶺上開花！」に強化される。「暗カン」状態は「嶺上開花！」を発動した後に終了する。",
            "fromLevel": "talent",
            "stat": "ATK_PERCENT",
            "statField": "atkBuff"
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "extra6_spd_percent",
            "source": "extra",
            "name": "昇格6",
            "description": "チャンカン強化通常攻撃を行った後、青雀の速度+10%、1ターン継続。",
            "stat": "SPD_PERCENT",
            "value": 0.1,
            "duration": 1
        },
        {
            "id": "extra4_skill_dmg_extra",
            "source": "extra",
            "name": "昇格4",
            "description": "戦闘スキルによる自身の与ダメージアップ効果がさらに10%アップする。層数に合わせて手動調整できるよう1層10%で登録。",
            "defaultActive": false,
            "target": "single",
            "stat": "DMG_ALL",
            "value": 0.1,
            "stackable": {
                "max": 4,
                "default": 4
            }
        },
        {
            "id": "e1_ult_dmg",
            "source": "eidolon",
            "name": "幺魚と戯れる孤兵",
            "description": "必殺技の与ダメージ+10%。",
            "defaultActive": false,
            "target": "single",
            "minEidolon": 1,
            "stat": "DMG_ULT",
            "value": 0.1
        }
    ],
    "partyEffects": [],
    "enemyEffects": []
});
