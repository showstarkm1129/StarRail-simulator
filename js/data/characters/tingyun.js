import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Tingyun",
    "id": "tingyun",
    "name": "停雲",
    "element": "Lightning",
    "elementLabel": "雷",
    "path": "Harmony",
    "rarity": 4,
    "base": {
        "hp": 846,
        "atk": 529,
        "def": 396,
        "spd": 112
    },
    "maxEnergy": 130,
    "energyEffects": [
        {
            "id": "tingyun_ult_target_energy",
            "name": "必殺技: 指定味方EP回復",
            "trigger": "ult",
            "target": "selectedAllies",
            "amount": { "kind": "flat", "value": 50 }
        },
        {
            "id": "tingyun_e6_ult_target_energy",
            "name": "星魂6: 必殺技の追加EP回復",
            "trigger": "ult",
            "target": "selectedAllies",
            "minEidolon": 6,
            "amount": { "kind": "flat", "value": 10 }
        }
    ],
    "traceBonuses": [
        {
            "label": "攻撃力",
            "value": 0.28
        },
        {
            "label": "防御力",
            "value": 0.225
        },
        {
            "label": "雷ダメージ",
            "value": 0.08
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E5%81%9C%E9%9B%B2",
        "version": "1.0"
    },
    "skills": {
        "basic": {
            "name": "逐客令",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に停雲の攻撃力X%分の雷属性ダメージを与える。",
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
            "name": "祥音和韻",
            "sourceHeader": "戦闘スキル",
            "type": "buff",
            "target": "single_ally",
            "description": "[サポート]指定した味方単体に「賜福」を付与し、その味方の攻撃力+X%、攻撃力アップ量は停雲の現在の攻撃力のY％を超えない。「賜福」を付与された味方が攻撃を行った後、敵にその味方の攻撃力Z%分の雷属性付加ダメージを1回与える。「賜福」は3ターン継続し、停雲の戦闘スキルの最後のターゲットにのみ効果を発揮する。",
            "levelColumns": [
                "攻撃力アップ(X%)",
                "攻撃力アップ上限(Y%)",
                "付加ダメージ倍率(Z%)"
            ],
            "levels": [
                {
                    "atkBuff": 0.25,
                    "atkBuff2": 0.15,
                    "atk": 0.2
                },
                {
                    "atkBuff": 0.27,
                    "atkBuff2": 0.16,
                    "atk": 0.22
                },
                {
                    "atkBuff": 0.3,
                    "atkBuff2": 0.17,
                    "atk": 0.24
                },
                {
                    "atkBuff": 0.32,
                    "atkBuff2": 0.18,
                    "atk": 0.26
                },
                {
                    "atkBuff": 0.35,
                    "atkBuff2": 0.19,
                    "atk": 0.28
                },
                {
                    "atkBuff": 0.37,
                    "atkBuff2": 0.2,
                    "atk": 0.3
                },
                {
                    "atkBuff": 0.4,
                    "atkBuff2": 0.21,
                    "atk": 0.32
                },
                {
                    "atkBuff": 0.43,
                    "atkBuff2": 0.22,
                    "atk": 0.35
                },
                {
                    "atkBuff": 0.46,
                    "atkBuff2": 0.23,
                    "atk": 0.37
                },
                {
                    "atkBuff": 0.5,
                    "atkBuff2": 0.25,
                    "atk": 0.4
                },
                {
                    "atkBuff": 0.52,
                    "atkBuff2": 0.26,
                    "atk": 0.42
                },
                {
                    "atkBuff": 0.55,
                    "atkBuff2": 0.27,
                    "atk": 0.44
                }
            ]
        },
        "ult": {
            "name": "慶雲光覆儀祷",
            "sourceHeader": "必殺技",
            "type": "heal",
            "target": "single_ally",
            "description": "[サポート]指定した味方単体のEPを50回復し、その味方の与ダメージ+X%、2ターン継続。",
            "levelColumns": [
                "与ダメージアップ(X%)",
                "消費EP"
            ],
            "levels": [
                {
                    "dmgBuff": 0.2,
                    "energyCost": 130
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
                    "dmgBuff": 0.32
                },
                {
                    "dmgBuff": 0.35
                },
                {
                    "dmgBuff": 0.38
                },
                {
                    "dmgBuff": 0.42
                },
                {
                    "dmgBuff": 0.46
                },
                {
                    "dmgBuff": 0.5
                },
                {
                    "dmgBuff": 0.53
                },
                {
                    "dmgBuff": 0.56
                }
            ]
        },
        "talent": {
            "name": "揺れる紫電",
            "sourceHeader": "天賦",
            "type": "attack",
            "target": "single",
            "description": "[強化]敵が停雲の攻撃を受けた後、「賜福」を付与された味方が、その敵に自身の攻撃力X%分の雷属性付加ダメージを与える。",
            "levelColumns": [
                "付加ダメージ倍率(X%)"
            ],
            "levels": [
                {
                    "atk": 0.3
                },
                {
                    "atk": 0.33
                },
                {
                    "atk": 0.36
                },
                {
                    "atk": 0.39
                },
                {
                    "atk": 0.42
                },
                {
                    "atk": 0.45
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
                    "atk": 0.63
                },
                {
                    "atk": 0.66
                }
            ]
        },
        "technique": {
            "name": "恵風和暢",
            "sourceHeader": "秘技",
            "type": "heal",
            "target": "single",
            "description": "[サポート]秘技を使用した後、自身のEPを50回復する。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "留晴戦闘スキルを発動した時、停雲の速度+20%、1ターン継続。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "除災通常攻撃の与ダメージ+40%。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "亨通停雲はターンが回ってきた時、EPを5回復する。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "春風吹きて時運巡る",
            "description": "「賜福」を与えられた味方単体は、必殺技を発動した後に速度+20%、1ターン継続。"
        },
        "2": {
            "name": "君子の恩恵 微笑みを以て承るべき",
            "description": "「賜福」を与えられた味方単体は、敵を倒した時にEPを5回復する、この効果はターンが回ってくるたびに1回まで発動できる。"
        },
        "3": {
            "name": "青丘の遺恩",
            "description": "必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "情勢を読み 変化せし鳴火",
            "description": "「賜福」の付加ダメージ倍率+20%。"
        },
        "5": {
            "name": "綏んずる狐魅",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+1、最大Lv.15まで。"
        },
        "6": {
            "name": "和気生財",
            "description": "必殺技で味方のEPをさらに10回復する。"
        }
    },
    "partyEffects": [
        {
            "id": "skill_atk_percent",
            "source": "skill",
            "name": "祥音和韻",
            "description": "[サポート]指定した味方単体に「賜福」を付与し、その味方の攻撃力+X%、攻撃力アップ量は停雲の現在の攻撃力のY％を超えない。「賜福」を付与された味方が攻撃を行った後、敵にその味方の攻撃力Z%分の雷属性付加ダメージを1回与える。「賜福」は3ターン継続し、停雲の戦闘スキルの最後のターゲットにのみ効果を発揮する。",
            "defaultActive": false,
            "target": "single",
            "duration": 3,
            "fromLevel": "skill",
            "stat": "ATK_PERCENT",
            "statField": "atkBuff"
        },
        {
            "id": "ult_dmg",
            "source": "ult",
            "name": "慶雲光覆儀祷",
            "description": "[サポート]指定した味方単体のEPを50回復し、その味方の与ダメージ+X%、2ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "fromLevel": "ult",
            "stat": "DMG_ALL",
            "statField": "dmgBuff"
        },
        {
            "id": "e1_spd_percent",
            "source": "eidolon",
            "name": "春風吹きて時運巡る",
            "description": "「賜福」を与えられた味方単体は、必殺技を発動した後に速度+20%、1ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 1,
            "minEidolon": 1,
            "stat": "SPD_PERCENT",
            "value": 0.2
        }
    ],
    "enemyEffects": [],
    "selfEffects": [
        {
            "id": "extra2_skill_spd",
            "source": "extra",
            "name": "昇格2",
            "description": "戦闘スキルを発動した時、停雲の速度+20、1ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 1,
            "stat": "SPD_FLAT",
            "value": 20
        },
        {
            "id": "extra4_basic_dmg",
            "source": "extra",
            "name": "昇格4",
            "description": "通常攻撃の与ダメージ+40%。",
            "defaultActive": false,
            "target": "single",
            "stat": "DMG_BASIC",
            "value": 0.4
        }
    ]
});
