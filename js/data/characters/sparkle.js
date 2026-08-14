import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Sparkle",
    "id": "sparkle",
    "name": "花火",
    "element": "Quantum",
    "elementLabel": "量子",
    "path": "Harmony",
    "rarity": 5,
    "base": {
        "hp": 1397,
        "atk": 523,
        "def": 485,
        "spd": 101
    },
    "maxEnergy": 110,
    "traceBonuses": [
        {
            "label": "最大HP",
            "value": 0.28
        },
        {
            "label": "会心ダメージ",
            "value": 0.24
        },
        {
            "label": "効果抵抗",
            "value": 0.1
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E8%8A%B1%E7%81%AB",
        "version": "2.0"
    },
    "skills": {
        "basic": {
            "name": "独り芝居",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に花火の攻撃力X%分の量子属性ダメージを与える。",
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
            "name": "夢を泳ぐ魚",
            "sourceHeader": "戦闘スキル",
            "type": "buff",
            "target": "single_ally",
            "description": "[サポート]指定した味方の会心ダメージを、花火の会心ダメージX%+Y%分アップする、2ターン継続。その味方の行動順を50%早める。自身に対してこのスキルを発動した時、行動順を早める効果は発動しない。",
            "levelColumns": [
                "会心ダメージアップ(割合,X%)",
                "会心ダメージアップ(固定,Y%)"
            ],
            "levels": [
                {
                    "cdBuff": 0.12,
                    "cdBuff2": 0.27
                },
                {
                    "cdBuff": 0.132,
                    "cdBuff2": 0.288
                },
                {
                    "cdBuff": 0.144,
                    "cdBuff2": 0.306
                },
                {
                    "cdBuff": 0.156,
                    "cdBuff2": 0.324
                },
                {
                    "cdBuff": 0.168,
                    "cdBuff2": 0.342
                },
                {
                    "cdBuff": 0.18,
                    "cdBuff2": 0.36
                },
                {
                    "cdBuff": 0.195,
                    "cdBuff2": 0.382
                },
                {
                    "cdBuff": 0.21,
                    "cdBuff2": 0.405
                },
                {
                    "cdBuff": 0.225,
                    "cdBuff2": 0.428
                },
                {
                    "cdBuff": 0.24,
                    "cdBuff2": 0.45
                },
                {
                    "cdBuff": 0.252,
                    "cdBuff2": 0.468
                },
                {
                    "cdBuff": 0.264,
                    "cdBuff2": 0.486
                }
            ],
            "inferredNotes": [
                "Lv.11 cdBuff は前後Lvから線形補完",
                "Lv.11 cdBuff2 は前後Lvから線形補完"
            ]
        },
        "ult": {
            "name": "一人千役",
            "sourceHeader": "必殺技",
            "type": "heal",
            "target": "all_ally",
            "description": "[サポート]SPを6回復し、回復時にSPが上限を超えた場合、超過分のSPを記録し、最大で10まで記録できる。味方キャラのターン終了後、SPが上限未満の場合、花火は記録値を消費してSPを回復する。なお、この効果はSPが上限に回復するまで繰り返される。味方全体に「奇怪な謎」を付与する。「奇怪な謎」を持つ味方が触発する花火の天賦による敵の受けるダメージアップ効果は、さらに各層X%アップする。3ターン継続。",
            "levelColumns": [
                "被ダメージアップ(X%)",
                "消費EP"
            ],
            "levels": [
                {
                    "dmgTaken": 0.036,
                    "energyCost": 110
                },
                {
                    "dmgTaken": 0.0384
                },
                {
                    "dmgTaken": 0.0408
                },
                {
                    "dmgTaken": 0.0432
                },
                {
                    "dmgTaken": 0.0456
                },
                {
                    "dmgTaken": 0.048
                },
                {
                    "dmgTaken": 0.051
                },
                {
                    "dmgTaken": 0.054
                },
                {
                    "dmgTaken": 0.057
                },
                {
                    "dmgTaken": 0.06
                },
                {
                    "dmgTaken": 0.0624
                },
                {
                    "dmgTaken": 0.0648
                }
            ],
            "inferredNotes": [
                "Lv.11 dmgTaken は前後Lvから線形補完"
            ]
        },
        "talent": {
            "name": "叙述トリック",
            "sourceHeader": "天賦",
            "type": "buff",
            "target": "all",
            "description": "[サポート]花火がフィールド上にいる時、最大SP+2。味方がSPを1消費するたびに、花火は「幻相」を1層獲得する。「幻相」1層につき敵全体の受けるダメージ+X%、2ターン継続、最大で3層累積できる。",
            "levelColumns": [
                "被ダメージアップ(X%)"
            ],
            "levels": [
                {
                    "dmgTaken": 0.02
                },
                {
                    "dmgTaken": 0.022
                },
                {
                    "dmgTaken": 0.024
                },
                {
                    "dmgTaken": 0.026
                },
                {
                    "dmgTaken": 0.028
                },
                {
                    "dmgTaken": 0.03
                },
                {
                    "dmgTaken": 0.032
                },
                {
                    "dmgTaken": 0.035
                },
                {
                    "dmgTaken": 0.038
                },
                {
                    "dmgTaken": 0.04
                },
                {
                    "dmgTaken": 0.042
                },
                {
                    "dmgTaken": 0.044
                }
            ],
            "inferredNotes": [
                "Lv.11 dmgTaken は前後Lvから線形補完"
            ]
        },
        "technique": {
            "name": "信用できない語り手",
            "sourceHeader": "秘技",
            "type": "heal",
            "target": "all_ally",
            "description": "[サポート]秘技を使用した後、味方全体は20秒間継続する「ミスリード」状態になる。「ミスリード」状態になると、敵に発見されなくなり、敵を先制攻撃して戦闘に入る時、SPを3回復し、花火のEPを20回復する。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "歳時記通常攻撃を行う時、EPを10回復する。戦闘スキルの会心ダメ―ジアップ効果を持つ味方キャラがSPを消費する時、花火がさらにEPを1回復する。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "人造の花味方キャラが1ターンの行動でSPを3以上消費した場合、花火が次に戦闘スキルを発動する時、SPを消費しない。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "夜想曲味方全体の攻撃力+45%。味方キャラが戦闘スキルの会心ダメージアップ効果を持つ時、全属性耐性貫通+10％。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "捨て置かれた疑念",
            "description": "「奇怪な謎」を持つ味方の攻撃力+40%。戦闘開始時または戦闘スキルを発動する時、花火の速度+15%、2ターン継続。"
        },
        "2": {
            "name": "謂れなき虚構",
            "description": "天賦の効果1層につき、さらに敵の防御力-10%。"
        },
        "3": {
            "name": "夢幻泡影",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "俗世遊興",
            "description": "必殺技がさらにSPを1回復する。天賦の最大SPアップ効果がさらに1アップする。"
        },
        "5": {
            "name": "裏表の真相",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "重なる解答",
            "description": "戦闘スキルの会心ダメージアップ効果が、さらに花火の会心ダメージ30%分アップする。花火が戦闘スキルを発動する時、戦闘スキルの会心ダメージアップ効果が、「奇怪な謎」を持つすべての味方に対して有効になる。花火が必殺技を発動する時、花火の戦闘スキルによる会心ダメージアップ効果を持つ味方が存在する場合、「奇怪な謎」を持つ味方にその効果を拡散する。"
        }
    },
    "partyEffects": [
        {
            "id": "skill_crit_dmg_caster",
            "source": "skill",
            "name": "夢を泳ぐ魚",
            "description": "[サポート]指定した味方の会心ダメージを、花火の会心ダメージX%+Y%分アップする、2ターン継続。その味方の行動順を50%早める。自身に対してこのスキルを発動した時、行動順を早める効果は発動しない。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "fromLevel": "skill",
            "stat": "CRIT_DMG",
            "compute": "casterDerivedRatio",
            "sourceStat": "critDmg",
            "ratioField": "cdBuff",
            "flatField": "cdBuff2"
        },
        {
            "id": "ult_dmg_taken_mirror",
            "source": "ult",
            "name": "一人千役 (火力計算用)",
            "description": "[サポート]SPを6回復し、回復時にSPが上限を超えた場合、超過分のSPを記録し、最大で10まで記録できる。味方キャラのターン終了後、SPが上限未満の場合、花火は記録値を消費してSPを回復する。なお、この効果はSPが上限に回復するまで繰り返される。味方全体に「奇怪な謎」を付与する。「奇怪な謎」を持つ味方が触発する花火の天賦による敵の受けるダメージアップ効果は、さらに各層X%アップする。3ターン継続。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "all",
            "duration": 3,
            "fromLevel": "ult",
            "stat": "DMG_TAKEN",
            "statField": "dmgTaken",
            "stackable": {
                "max": 3,
                "default": 3
            }
        },
        {
            "id": "talent_dmg_taken_mirror",
            "source": "talent",
            "name": "叙述トリック (火力計算用)",
            "description": "[サポート]花火がフィールド上にいる時、最大SP+2。味方がSPを1消費するたびに、花火は「幻相」を1層獲得する。「幻相」1層につき敵全体の受けるダメージ+X%、2ターン継続、最大で3層累積できる。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "all",
            "duration": 2,
            "fromLevel": "talent",
            "stat": "DMG_TAKEN",
            "statField": "dmgTaken",
            "stackable": {
                "max": 3,
                "default": 3
            }
        },
        {
            "id": "extra6_atk_percent",
            "source": "extra",
            "name": "昇格6",
            "description": "夜想曲味方全体の攻撃力+45%。味方キャラが戦闘スキルの会心ダメージアップ効果を持つ時、全属性耐性貫通+10％。",
            "defaultActive": false,
            "target": "all",
            "duration": "conditional",
            "stat": "ATK_PERCENT",
            "value": 0.45
        },
        {
            "id": "e1_atk_percent",
            "source": "eidolon",
            "name": "捨て置かれた疑念",
            "description": "「奇怪な謎」を持つ味方の攻撃力+40%。戦闘開始時または戦闘スキルを発動する時、花火の速度+15%、2ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "minEidolon": 1,
            "stat": "ATK_PERCENT",
            "value": 0.4
        },
        {
            "id": "e2_def_down_mirror",
            "source": "eidolon",
            "name": "謂れなき虚構 (火力計算用)",
            "description": "天賦の効果1層につき、さらに敵の防御力-10%。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "all",
            "duration": "conditional",
            "minEidolon": 2,
            "stat": "DEF_DOWN",
            "value": 0.1,
            "stackable": {
                "max": 3,
                "default": 3
            }
        },
        {
            "id": "e6_skill_crit_dmg_extra",
            "source": "eidolon",
            "name": "重なる解答",
            "description": "戦闘スキルの会心ダメージアップ効果が、さらに花火の会心ダメージ30%分アップする。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 6,
            "stat": "CRIT_DMG",
            "compute": "casterDerivedFixedRatio",
            "sourceStat": "critDmg",
            "ratio": 0.3
        }
    ],
    "enemyEffects": [
        {
            "id": "ult_dmg_taken",
            "source": "ult",
            "name": "一人千役",
            "description": "[サポート]SPを6回復し、回復時にSPが上限を超えた場合、超過分のSPを記録し、最大で10まで記録できる。味方キャラのターン終了後、SPが上限未満の場合、花火は記録値を消費してSPを回復する。なお、この効果はSPが上限に回復するまで繰り返される。味方全体に「奇怪な謎」を付与する。「奇怪な謎」を持つ味方が触発する花火の天賦による敵の受けるダメージアップ効果は、さらに各層X%アップする。3ターン継続。",
            "defaultActive": false,
            "target": "all",
            "duration": 3,
            "fromLevel": "ult",
            "stat": "DMG_TAKEN",
            "statField": "dmgTaken",
            "stackable": {
                "max": 3,
                "default": 3
            }
        },
        {
            "id": "talent_dmg_taken",
            "source": "talent",
            "name": "叙述トリック",
            "description": "[サポート]花火がフィールド上にいる時、最大SP+2。味方がSPを1消費するたびに、花火は「幻相」を1層獲得する。「幻相」1層につき敵全体の受けるダメージ+X%、2ターン継続、最大で3層累積できる。",
            "defaultActive": false,
            "target": "all",
            "duration": 2,
            "fromLevel": "talent",
            "stat": "DMG_TAKEN",
            "statField": "dmgTaken",
            "stackable": {
                "max": 3,
                "default": 3
            }
        },
        {
            "id": "e2_def_down",
            "source": "eidolon",
            "name": "謂れなき虚構",
            "description": "天賦の効果1層につき、さらに敵の防御力-10%。",
            "defaultActive": false,
            "target": "all",
            "duration": "conditional",
            "minEidolon": 2,
            "stat": "DEF_DOWN",
            "value": 0.1,
            "stackable": {
                "max": 3,
                "default": 3
            }
        }
    ],
    "selfEffects": []
});
