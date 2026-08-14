import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Sunday",
    "id": "sunday",
    "name": "サンデー",
    "element": "Imaginary",
    "elementLabel": "虚数",
    "path": "Harmony",
    "rarity": 5,
    "base": {
        "hp": 1241,
        "atk": 640,
        "def": 533,
        "spd": 96
    },
    "maxEnergy": 130,
    "traceBonuses": [
        {
            "label": "会心ダメージ",
            "value": 0.373
        },
        {
            "label": "効果抵抗",
            "value": 0.18
        },
        {
            "label": "防御力",
            "value": 0.125
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%82%B5%E3%83%B3%E3%83%87%E3%83%BC",
        "version": "2.7"
    },
    "skills": {
        "basic": {
            "name": "光を纏う告諭",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にサンデーの攻撃力X%分の虚数属性ダメージを与える。",
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
            "name": "紙と式典の賜物",
            "sourceHeader": "戦闘スキル",
            "type": "heal",
            "target": "single_ally",
            "description": "[サポート]指定した味方キャラ単体とその召喚物を即座に行動させ、与ダメージ+X%。ターゲットが召喚物をすでに召喚していた場合、与ダメージアップ効果がさらに+Y%、2ターン継続。「祝福されし者」状態の味方に戦闘スキルを発動した後、SPを1回復する。なお、「調和」の運命を歩むキャラをターゲットにした場合、即座に行動させる効果は発動しない。",
            "levelColumns": [
                "与ダメージアップ(X%)",
                "追加・与ダメージアップ(Y%)"
            ],
            "levels": [
                {
                    "dmgBuff": 0.15,
                    "dmgBuff2": 0.25
                },
                {
                    "dmgBuff": 0.16,
                    "dmgBuff2": 0.27
                },
                {
                    "dmgBuff": 0.18,
                    "dmgBuff2": 0.3
                },
                {
                    "dmgBuff": 0.19,
                    "dmgBuff2": 0.32
                },
                {
                    "dmgBuff": 0.21,
                    "dmgBuff2": 0.35
                },
                {
                    "dmgBuff": 0.22,
                    "dmgBuff2": 0.37
                },
                {
                    "dmgBuff": 0.24,
                    "dmgBuff2": 0.4
                },
                {
                    "dmgBuff": 0.26,
                    "dmgBuff2": 0.43
                },
                {
                    "dmgBuff": 0.28,
                    "dmgBuff2": 0.46
                },
                {
                    "dmgBuff": 0.3,
                    "dmgBuff2": 0.5
                },
                {
                    "dmgBuff": 0.315,
                    "dmgBuff2": 0.525
                },
                {
                    "dmgBuff": 0.33,
                    "dmgBuff2": 0.55
                }
            ],
            "inferredNotes": [
                "Lv.11 dmgBuff は前後Lvから線形補完",
                "Lv.11 dmgBuff2 は前後Lvから線形補完"
            ]
        },
        "ult": {
            "name": "抱擁と傷痕の賛歌",
            "sourceHeader": "必殺技",
            "type": "heal",
            "target": "single_ally",
            "description": "[サポート]指定した味方キャラ単体の最大EP20.0%分のEPを回復させ、ターゲットとその召喚物に「祝福されし者」状態を付与する。「祝福されし者」状態の味方の会心ダメージが、サンデーの会心ダメージX%分+Y%アップする。「祝福されし者」状態は3ターン継続。サンデー自身のターンが回ってくるたびに「祝福されし者」状態の継続時間-1ターン。また、スキルの効果は必殺技で最後に指定したサンデー以外のターゲットにのみ発揮される。サンデーが戦闘不能状態になる時、「祝福されし者」状態も解除される。",
            "levelColumns": [
                "会心ダメージアップ(X%分+Y%)",
                "消費EP"
            ],
            "levels": [
                {
                    "cdRatio": 0.12,
                    "cdFlat": 0.08,
                    "energyCost": 130
                },
                {
                    "cdRatio": 0.138,
                    "cdFlat": 0.084
                },
                {
                    "cdRatio": 0.156,
                    "cdFlat": 0.088
                },
                {
                    "cdRatio": 0.174,
                    "cdFlat": 0.092
                },
                {
                    "cdRatio": 0.192,
                    "cdFlat": 0.096
                },
                {
                    "cdRatio": 0.21,
                    "cdFlat": 0.1
                },
                {
                    "cdRatio": 0.232,
                    "cdFlat": 0.105
                },
                {
                    "cdRatio": 0.255,
                    "cdFlat": 0.11
                },
                {
                    "cdRatio": 0.278,
                    "cdFlat": 0.115
                },
                {
                    "cdRatio": 0.3,
                    "cdFlat": 0.12
                },
                {
                    "cdRatio": 0.318,
                    "cdFlat": 0.124
                },
                {
                    "cdRatio": 0.336,
                    "cdFlat": 0.128
                }
            ]
        },
        "talent": {
            "name": "肉体の告解",
            "sourceHeader": "天賦",
            "type": "buff",
            "target": "single",
            "description": "[サポート]戦闘スキルを発動する時、ターゲットの会心率+X%、3ターン継続。",
            "levelColumns": [
                "会心率アップ(X%)"
            ],
            "levels": [
                {
                    "critRateBuff": 0.1
                },
                {
                    "critRateBuff": 0.11
                },
                {
                    "critRateBuff": 0.12
                },
                {
                    "critRateBuff": 0.13
                },
                {
                    "critRateBuff": 0.14
                },
                {
                    "critRateBuff": 0.15
                },
                {
                    "critRateBuff": 0.162
                },
                {
                    "critRateBuff": 0.175
                },
                {
                    "critRateBuff": 0.188
                },
                {
                    "critRateBuff": 0.2
                },
                {
                    "critRateBuff": 0.21
                },
                {
                    "critRateBuff": 0.22
                }
            ],
            "inferredNotes": [
                "Lv.11 critRateBuff は前後Lvから線形補完"
            ]
        },
        "technique": {
            "name": "栄光の秘儀",
            "sourceHeader": "秘技",
            "type": "buff",
            "target": "single",
            "description": "[サポート]秘技を使用した後、次の戦闘でサンデーが初めて味方にスキルを発動する時、ターゲットの与ダメージ+50%、2ターン継続。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "主日の渇望必殺技を発動する時、ターゲットが回復するEPが40未満の場合、回復するEPを40までアップさせる。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "崇高なる浄化戦闘開始時、サンデーのEPを25回復する。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "掌上の安息戦闘スキルを発動した時、ターゲットのデバフを1つ解除する。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "千年の静寂の果て",
            "description": "サンデーが戦闘スキルを発動する時、スキルターゲットに以下の効果を付与する。キャラがダメージを与える時、敵の防御力を16%無視する。召喚物がダメージを与える時、敵の防御力を40%無視する。2ターン継続。"
        },
        "2": {
            "name": "瑕瑾を補う信仰",
            "description": "初めて必殺技を発動した後、SPを2回復する。「祝福されし者」状態の味方の与ダメージ+30%。"
        },
        "3": {
            "name": "静謐な茨の隠れ家",
            "description": "必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "彫像の序言",
            "description": "ターンが回ってきたとき、EPを8回復する。"
        },
        "5": {
            "name": "銀湾に漂う紙の船",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "群星喧騒の黎明",
            "description": "天賦の会心率アップ効果が累積可能になる。最大で3層。また、天賦効果の継続時間+1ターン。サンデーが必殺技を発動する時、ターゲットに天賦による会心率アップ効果を付与する。また、天賦による会心率アップ効果が発動する時、ターゲットの会心率が100%を超えている場合、1%超過するごとに会心ダメージが2%アップする。"
        }
    },
    "partyEffects": [
        {
            "id": "skill_dmg",
            "source": "skill",
            "name": "紙と式典の賜物",
            "description": "[サポート]指定した味方キャラ単体とその召喚物を即座に行動させ、与ダメージ+X%。ターゲットが召喚物をすでに召喚していた場合、与ダメージアップ効果がさらに+Y%、2ターン継続。「祝福されし者」状態の味方に戦闘スキルを発動した後、SPを1回復する。なお、「調和」の運命を歩むキャラをターゲットにした場合、即座に行動させる効果は発動しない。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "fromLevel": "skill",
            "stat": "DMG_ALL",
            "statField": "dmgBuff"
        },
        {
            "id": "skill_dmg_extra",
            "source": "skill",
            "name": "紙と式典の賜物",
            "description": "[サポート]指定した味方キャラ単体とその召喚物を即座に行動させ、与ダメージ+X%。ターゲットが召喚物をすでに召喚していた場合、与ダメージアップ効果がさらに+Y%、2ターン継続。「祝福されし者」状態の味方に戦闘スキルを発動した後、SPを1回復する。なお、「調和」の運命を歩むキャラをターゲットにした場合、即座に行動させる効果は発動しない。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "fromLevel": "skill",
            "stat": "DMG_ALL",
            "statField": "dmgBuff2"
        },
        {
            "id": "ult_crit_dmg_caster",
            "source": "ult",
            "name": "抱擁と傷痕の賛歌",
            "description": "[サポート]指定した味方キャラ単体の最大EP20.0%分のEPを回復させ、ターゲットとその召喚物に「祝福されし者」状態を付与する。「祝福されし者」状態の味方の会心ダメージが、サンデーの会心ダメージX%分+Y%アップする。「祝福されし者」状態は3ターン継続。サンデー自身のターンが回ってくるたびに「祝福されし者」状態の継続時間-1ターン。また、スキルの効果は必殺技で最後に指定したサンデー以外のターゲットにのみ発揮される。サンデーが戦闘不能状態になる時、「祝福されし者」状態も解除される。",
            "defaultActive": false,
            "target": "single",
            "duration": 3,
            "fromLevel": "ult",
            "stat": "CRIT_DMG",
            "compute": "casterDerivedRatio",
            "sourceStat": "critDmg",
            "ratioField": "cdRatio",
            "flatField": "cdFlat"
        },
        {
            "id": "talent_crit_rate",
            "source": "talent",
            "name": "肉体の告解",
            "description": "[サポート]戦闘スキルを発動する時、ターゲットの会心率+X%、3ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 3,
            "fromLevel": "talent",
            "stat": "CRIT_RATE",
            "statField": "critRateBuff"
        },
        {
            "id": "e1_def_ignore",
            "source": "eidolon",
            "name": "千年の静寂の果て",
            "description": "サンデーが戦闘スキルを発動する時、スキルターゲットに以下の効果を付与する。キャラがダメージを与える時、敵の防御力を16%無視する。召喚物がダメージを与える時、敵の防御力を40%無視する。2ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "minEidolon": 1,
            "stat": "DEF_IGNORE",
            "value": 0.4
        },
        {
            "id": "technique_dmg",
            "source": "technique",
            "name": "栄光の秘儀",
            "description": "次の戦闘でサンデーが初めて味方にスキルを発動する時、ターゲットの与ダメージ+50%、2ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "stat": "DMG_ALL",
            "value": 0.5
        },
        {
            "id": "e2_benediction_dmg",
            "source": "eidolon",
            "name": "瑕瑾を補う信仰",
            "description": "「祝福されし者」状態の味方の与ダメージ+30%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 2,
            "stat": "DMG_ALL",
            "value": 0.3
        },
        {
            "id": "e6_talent_crit_rate_extra_stacks",
            "source": "eidolon",
            "name": "群星喧騒の黎明",
            "description": "天賦の会心率アップ効果が累積可能になる。既存の天賦効果1層に加え、追加2層分を手動で加算する枠。",
            "defaultActive": false,
            "target": "single",
            "duration": 3,
            "minEidolon": 6,
            "fromLevel": "talent",
            "stat": "CRIT_RATE",
            "statField": "critRateBuff",
            "stackable": {
                "max": 2,
                "default": 2
            }
        },
        {
            "id": "e6_overcrit_to_crit_dmg",
            "source": "eidolon",
            "name": "群星喧騒の黎明",
            "description": "天賦による会心率アップ効果が発動する時、ターゲットの会心率が100%を超えている場合、1%超過するごとに会心ダメージ+2%。1スタック=会心率超過1%として手動調整。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 6,
            "stat": "CRIT_DMG",
            "value": 0.02,
            "stackable": {
                "min": 0,
                "max": 100,
                "default": 0
            }
        }
    ],
    "enemyEffects": [],
    "selfEffects": []
});
