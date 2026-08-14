import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Arlan",
    "id": "arlan",
    "name": "アーラン",
    "element": "Lightning",
    "elementLabel": "雷",
    "path": "Destruction",
    "rarity": 4,
    "base": {
        "hp": 1199,
        "atk": 599,
        "def": 330,
        "spd": 102
    },
    "maxEnergy": 110,
    "traceBonuses": [
        {
            "label": "攻撃力",
            "value": 0.28
        },
        {
            "label": "効果抵抗",
            "value": 0.18
        },
        {
            "label": "最大HP",
            "value": 0.1
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%82%A2%E3%83%BC%E3%83%A9%E3%83%B3",
        "version": "1.0"
    },
    "skills": {
        "basic": {
            "name": "疾行する雷の如し",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にアーランの攻撃力X%分の雷属性ダメージを与える。",
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
            "name": "禁錮解除",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]アーランのHPを最大HP15%分消費して、指定した敵単体にアーランの攻撃力X%分の雷属性ダメージを与える。残りHPが足りない場合、戦闘スキルを発動する時、アーランの残りHPが1になる。（原文のみの記述だとわかりにくいが、アーランの戦闘スキルは自分のHPを削る代わりにSPを消費しない）",
            "levelColumns": [
                "ダメージ倍率(X％)"
            ],
            "levels": [
                {
                    "hpPct": 1.2
                },
                {
                    "hpPct": 1.32
                },
                {
                    "hpPct": 1.44
                },
                {
                    "hpPct": 1.56
                },
                {
                    "hpPct": 1.68
                },
                {
                    "hpPct": 1.8
                },
                {
                    "hpPct": 1.95
                },
                {
                    "hpPct": 2.1
                },
                {
                    "hpPct": 2.25
                },
                {
                    "hpPct": 2.4
                },
                {
                    "hpPct": 2.52
                },
                {
                    "hpPct": 2.64
                }
            ]
        },
        "ult": {
            "name": "狂者の制裁",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "blast",
            "description": "[拡散攻撃]指定した敵単体にアーランの攻撃力X%分の雷属性ダメージを与え、隣接する敵にアーランの攻撃力Y%分の雷属性ダメージを与える。",
            "levelColumns": [
                "単体ダメージ倍率(X%)",
                "隣接ダメージ倍率(Y%)",
                "消費EP"
            ],
            "levels": [
                {
                    "atk": 1.92,
                    "atkAdjacent": 0.96,
                    "energyCost": 110
                },
                {
                    "atk": 2.04,
                    "atkAdjacent": 1.02
                },
                {
                    "atk": 2.17,
                    "atkAdjacent": 1.08
                },
                {
                    "atk": 2.3,
                    "atkAdjacent": 1.15
                },
                {
                    "atk": 2.43,
                    "atkAdjacent": 1.21
                },
                {
                    "atk": 2.56,
                    "atkAdjacent": 1.28
                },
                {
                    "atk": 2.72,
                    "atkAdjacent": 1.36
                },
                {
                    "atk": 2.88,
                    "atkAdjacent": 1.44
                },
                {
                    "atk": 3.04,
                    "atkAdjacent": 1.52
                },
                {
                    "atk": 3.2,
                    "atkAdjacent": 1.6
                },
                {
                    "atk": 3.32,
                    "atkAdjacent": 1.66
                },
                {
                    "atk": 3.45,
                    "atkAdjacent": 1.72
                }
            ]
        },
        "talent": {
            "name": "痛みと怒りの極み",
            "sourceHeader": "天賦",
            "type": "buff",
            "target": "single",
            "description": "[強化]アーランの失ったHPの割合に応じて与ダメージアップ、最大でアーランの与ダメージ+X%。",
            "levelColumns": [
                "与ダメージアップ(X%)"
            ],
            "levels": [
                {
                    "dmgBuff": 0.36
                },
                {
                    "dmgBuff": 0.39
                },
                {
                    "dmgBuff": 0.43
                },
                {
                    "dmgBuff": 0.46
                },
                {
                    "dmgBuff": 0.5
                },
                {
                    "dmgBuff": 0.54
                },
                {
                    "dmgBuff": 0.58
                },
                {
                    "dmgBuff": 0.63
                },
                {
                    "dmgBuff": 0.67
                },
                {
                    "dmgBuff": 0.72
                },
                {
                    "dmgBuff": 0.75
                },
                {
                    "dmgBuff": 0.79
                }
            ]
        },
        "technique": {
            "name": "特急ハーベスト",
            "sourceHeader": "秘技",
            "type": "attack",
            "target": "all",
            "description": "敵を攻撃。戦闘に入った後、敵全体にアーランの攻撃力80%分の雷属性ダメージを与える。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "蘇生敵を倒した時、残りHPが30%以下の場合、自身の最大HP20%分のHPを回復する。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "堅忍持続ダメージ系デバフを抵抗する確率+50%。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "抗拒戦闘に入る時、残りHPが50%以下の場合、アーランは持続ダメージ以外のすべてのダメージを防ぐ。アーランが攻撃を受けた後、この効果は解除される。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "万死も辞さぬ決意",
            "description": "残りHPが50%以下の時、戦闘スキルによるダメージ+10%。"
        },
        "2": {
            "name": "縛りより放たれし心",
            "description": "戦闘スキルまたは必殺技を発動した時、自身のデバフを1つ解除する。"
        },
        "3": {
            "name": "重剣強攻",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "絶境の反撃",
            "description": "戦闘に入った後、アーランはHPが0になる攻撃を受けても戦闘不能状態にならず、HPを25%まで回復する。この効果は1回発動した後、または2ターン以降に自動解除される。"
        },
        "5": {
            "name": "全力傾注",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "献身的な先導",
            "description": "残りHPが50%以下の時、必殺技の与ダメージ+20%、隣接する敵に対するダメージ倍率がメインターゲットと同じになる。"
        }
    },
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "talent_dmg",
            "source": "talent",
            "name": "痛みと怒りの極み",
            "description": "[強化]アーランの失ったHPの割合に応じて与ダメージアップ、最大でアーランの与ダメージ+X%。",
            "fromLevel": "talent",
            "stat": "DMG_ALL",
            "statField": "dmgBuff"
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e1_skill_dmg",
            "source": "eidolon",
            "name": "万死も辞さぬ決意",
            "description": "残りHPが50%以下の時、戦闘スキルによるダメージ+10%。",
            "stat": "DMG_SKILL",
            "value": 0.1,
            "minEidolon": 1
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e6_ult_dmg",
            "source": "eidolon",
            "name": "献身的な先導",
            "description": "残りHPが50%以下の時、必殺技の与ダメージ+20%、隣接する敵に対するダメージ倍率がメインターゲットと同じになる。",
            "stat": "DMG_ULT",
            "value": 0.2,
            "minEidolon": 6
        }
    ]
});
