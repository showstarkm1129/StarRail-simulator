import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Hanya",
    "id": "hanya",
    "name": "寒鴉",
    "element": "Physical",
    "elementLabel": "物理",
    "path": "Harmony",
    "rarity": 4,
    "base": {
        "hp": 917,
        "atk": 564,
        "def": 352,
        "spd": 110
    },
    "maxEnergy": 140,
    "traceBonuses": [
        {
            "label": "攻撃力",
            "value": 0.28
        },
        {
            "label": "速度",
            "value": 9
        },
        {
            "label": "最大HP",
            "value": 0.1
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E5%AF%92%E9%B4%89",
        "version": "1.5"
    },
    "skills": {
        "basic": {
            "name": "冥兆天筆",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に寒鴉の攻撃力X%分の物理ダメージを与える。",
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
            "name": "生滅捕縛",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]敵単体に「承負」状態を付与して、寒鴉の攻撃力X%分の物理ダメージを与える。味方が「承負」状態の敵に通常攻撃、戦闘スキル、または必殺技のうち任意のスキルを合わせて2回発動するたびに、SPを1回復する。「承負」は最後に付与されたターゲットにのみ効果を発揮し、SP回復効果を2発動した後に自動で解除される。",
            "levelColumns": [
                "ダメージ倍率(X%)"
            ],
            "levels": [
                {
                    "atk": 1.2
                },
                {
                    "atk": 1.32
                },
                {
                    "atk": 1.44
                },
                {
                    "atk": 1.56
                },
                {
                    "atk": 1.68
                },
                {
                    "atk": 1.8
                },
                {
                    "atk": 1.95
                },
                {
                    "atk": 2.1
                },
                {
                    "atk": 2.25
                },
                {
                    "atk": 2.4
                },
                {
                    "atk": 2.52
                },
                {
                    "atk": 2.64
                }
            ]
        },
        "ult": {
            "name": "十王の勅令、遍く遵行せよ",
            "sourceHeader": "必殺技",
            "type": "buff",
            "target": "single_ally",
            "description": "[強化]指定した味方の速度を、寒鴉の速度のX%分アップし、その味方の攻撃力+Y%、2ターン継続。",
            "levelColumns": [
                "速度アップ(X%)",
                "攻撃力アップ(Y%)",
                "消費EP"
            ],
            "levels": [
                {
                    "spdBuff": 0.15,
                    "atkBuff": 0.36,
                    "energyCost": 140
                },
                {
                    "spdBuff": 0.155,
                    "atkBuff": 0.38
                },
                {
                    "spdBuff": 0.16,
                    "atkBuff": 0.4
                },
                {
                    "spdBuff": 0.165,
                    "atkBuff": 0.43
                },
                {
                    "spdBuff": 0.17,
                    "atkBuff": 0.45
                },
                {
                    "spdBuff": 0.175,
                    "atkBuff": 0.48
                },
                {
                    "spdBuff": 0.181,
                    "atkBuff": 0.51
                },
                {
                    "spdBuff": 0.188,
                    "atkBuff": 0.54
                },
                {
                    "spdBuff": 0.194,
                    "atkBuff": 0.57
                },
                {
                    "spdBuff": 0.2,
                    "atkBuff": 0.6
                },
                {
                    "spdBuff": 0.205,
                    "atkBuff": 0.62
                },
                {
                    "spdBuff": 0.21,
                    "atkBuff": 0.64
                }
            ]
        },
        "talent": {
            "name": "懲悪",
            "sourceHeader": "天賦",
            "type": "buff",
            "target": "single",
            "description": "[サポート]味方が「承負」状態の敵に通常攻撃、戦闘スキル、または必殺技を発動した時、与ダメージ+X%、2ターン継続。",
            "levelColumns": [
                "与ダメージアップ(X%)"
            ],
            "levels": [
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
                    "dmgBuff": 0.3
                },
                {
                    "dmgBuff": 0.31
                },
                {
                    "dmgBuff": 0.33
                }
            ]
        },
        "technique": {
            "name": "判冥",
            "sourceHeader": "秘技",
            "type": "support",
            "target": "single",
            "description": "敵を攻撃。戦闘に入った後、ランダムな敵単体に戦闘スキルが与えるものと同じ「承負」状態を付与する。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "録事「承負」によるSP回復効果を発動させた味方の攻撃力+10%、1ターン継続。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "幽府「承負」を持つ敵が倒された時、その敵が持つ「承負」によるSP回復効果の発動回数が1回以下の場合、さらにSPを1回復する。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "還陽「承負」によるSP回復効果が発動された時、自身のEPを2回復する。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "一心",
            "description": "必殺技のバフを持つ味方が敵を倒した時、寒鴉の行動順が15%早まる。この効果はターンが回ってくるたびに1回まで発動できる。"
        },
        "2": {
            "name": "二観",
            "description": "戦闘スキルを発動した後、速度+20%、1ターン継続。"
        },
        "3": {
            "name": "三塵",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "四諦",
            "description": "必殺技の継続時間+1ターン。"
        },
        "5": {
            "name": "五陰",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "六正",
            "description": "天賦のダメージアップ効果がさらに10%アップ。"
        }
    },
    "partyEffects": [
        {
            "id": "ult_spd_flat_caster",
            "source": "ult",
            "name": "十王の勅令、遍く遵行せよ",
            "description": "[強化]指定した味方の速度を、寒鴉の速度のX%分アップし、その味方の攻撃力+Y%、2ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "fromLevel": "ult",
            "stat": "SPD_FLAT",
            "compute": "casterDerivedRatio",
            "sourceStat": "spd",
            "ratioField": "spdBuff"
        },
        {
            "id": "ult_atk_percent",
            "source": "ult",
            "name": "十王の勅令、遍く遵行せよ",
            "description": "[強化]指定した味方の速度を、寒鴉の速度のX%分アップし、その味方の攻撃力+Y%、2ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "fromLevel": "ult",
            "stat": "ATK_PERCENT",
            "statField": "atkBuff"
        },
        {
            "id": "talent_dmg",
            "source": "talent",
            "name": "懲悪",
            "description": "[サポート]味方が「承負」状態の敵に通常攻撃、戦闘スキル、または必殺技を発動した時、与ダメージ+X%、2ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "fromLevel": "talent",
            "stat": "DMG_ALL",
            "statField": "dmgBuff"
        },
        {
            "id": "extra2_atk_percent",
            "source": "extra",
            "name": "昇格2",
            "description": "録事「承負」によるSP回復効果を発動させた味方の攻撃力+10%、1ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 1,
            "stat": "ATK_PERCENT",
            "value": 0.1
        },
        {
            "id": "e6_talent_dmg_bonus",
            "source": "eidolon",
            "name": "六正",
            "description": "天賦のダメージアップ効果がさらに10%アップ。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 6,
            "stat": "DMG_ALL",
            "value": 0.1
        }
    ],
    "enemyEffects": [],
    "selfEffects": [
        {
            "id": "e2_spd_flat",
            "source": "eidolon",
            "name": "二観",
            "description": "戦闘スキルを発動した後、速度+20、1ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 1,
            "minEidolon": 2,
            "stat": "SPD_FLAT",
            "value": 20
        }
    ]
});
