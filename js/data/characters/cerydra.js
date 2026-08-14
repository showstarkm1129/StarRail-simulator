import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Cerydra",
    "id": "cerydra",
    "name": "ケリュドラ",
    "element": "Wind",
    "elementLabel": "風",
    "path": "Harmony",
    "rarity": 5,
    "base": {
        "hp": 1358,
        "atk": 620,
        "def": 485,
        "spd": 99
    },
    "maxEnergy": 130,
    "traceBonuses": [
        {
            "label": "風ダメージ",
            "value": 0.224
        },
        {
            "label": "攻撃力",
            "value": 0.18
        },
        {
            "label": "最大HP",
            "value": 0.1
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%82%B1%E3%83%AA%E3%83%A5%E3%83%89%E3%83%A9",
        "version": "3.5"
    },
    "skills": {
        "basic": {
            "name": "征け、兵は神速を尊ぶ",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にケリュドラの攻撃力X%分の風属性ダメージを与える。",
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
            "name": "名を馳せよ、歩兵も将の器",
            "sourceHeader": "戦闘スキル",
            "type": "debuff",
            "target": "single_ally",
            "description": "[サポート]指定した味方単体キャラに「軍功」を付与し、ケリュドラはチャージを1獲得する。チャージの最大値は8。チャージが6に達した時、味方キャラの「軍功」は自動で「爵位」へと昇格し、その状態を所持しているキャラの行動制限系デバフを解除する。「爵位」を所持しているキャラは「軍功」も同時に所持しているものとみなし、戦闘スキルの会心ダメージ+X%、全属性耐性貫通+Y%。敵ターゲットに戦闘スキルを発動する時、奇襲が発動する。奇襲終了後、チャージを6消費し、「爵位」を「軍功」に戻す。",
            "levelColumns": [
                "戦闘スキルの会心ダメージアップ(X%)",
                "全属性耐性貫通アップ(Y%)"
            ],
            "levels": [
                {
                    "cdBuff": 0.36,
                    "resPen": 0.08
                },
                {
                    "cdBuff": 0.39,
                    "resPen": 0.082
                },
                {
                    "cdBuff": 0.43,
                    "resPen": 0.084
                },
                {
                    "cdBuff": 0.46,
                    "resPen": 0.086
                },
                {
                    "cdBuff": 0.5,
                    "resPen": 0.088
                },
                {
                    "cdBuff": 0.54,
                    "resPen": 0.09
                },
                {
                    "cdBuff": 0.58,
                    "resPen": 0.092
                },
                {
                    "cdBuff": 0.63,
                    "resPen": 0.095
                },
                {
                    "cdBuff": 0.67,
                    "resPen": 0.098
                },
                {
                    "cdBuff": 0.72,
                    "resPen": 0.1
                },
                {
                    "cdBuff": 0.755,
                    "resPen": 0.102
                },
                {
                    "cdBuff": 0.79,
                    "resPen": 0.104
                }
            ],
            "inferredNotes": [
                "Lv.11 cdBuff は前後Lvから線形補完",
                "Lv.11 resPen は前後Lvから線形補完"
            ]
        },
        "ult": {
            "name": "世は盤上、チェックメイト",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]チャージを2獲得する。敵全体にケリュドラの攻撃力X%分の風属性ダメージを与える。フィールド上に「軍功」を所持しているキャラがいない場合、現在1枠目にいるキャラに優先して「軍功」を付与する。",
            "levelColumns": [
                "全体ダメージ倍率(X%)",
                "消費EP"
            ],
            "levels": [
                {
                    "atk": 1.44,
                    "energyCost": 130
                },
                {
                    "atk": 1.53
                },
                {
                    "atk": 1.63
                },
                {
                    "atk": 1.72
                },
                {
                    "atk": 1.82
                },
                {
                    "atk": 1.92
                },
                {
                    "atk": 2.04
                },
                {
                    "atk": 2.16
                },
                {
                    "atk": 2.28
                },
                {
                    "atk": 2.4
                },
                {
                    "atk": 2.495
                },
                {
                    "atk": 2.59
                }
            ],
            "inferredNotes": [
                "Lv.11 atk は前後Lvから線形補完"
            ]
        },
        "talent": {
            "name": "栄光をカイザーに",
            "sourceHeader": "天賦",
            "type": "buff",
            "target": "single",
            "description": "[サポート]「軍功」を所持しているキャラの攻撃力が、ケリュドラの攻撃力X%分アップする。そのキャラが通常攻撃または戦闘スキルを発動する時、ケリュドラはチャージを1獲得する。なお、奇襲期間中の場合、ケリュドラはこの方法でチャージを獲得できない。「軍功」を所持しているキャラが攻撃を行った後、ケリュドラは追加で自身の攻撃力Y%分の風属性付加ダメージを1回与える。この効果は最大で20回発動でき、ケリュドラが必殺技を発動するたびに、効果の発動可能回数をリセットする。「軍功」は最後に付与したターゲットにのみ有効。ターゲットが変更された時、ケリュドラのチャージは0にリセットされる。",
            "levelColumns": [
                "攻撃力アップ(X%)",
                "付加ダメージ倍率(Y%)"
            ],
            "levels": [
                {
                    "atkBuff": 0.18,
                    "atk": 0.3
                },
                {
                    "atkBuff": 0.186,
                    "atk": 0.33
                },
                {
                    "atkBuff": 0.192,
                    "atk": 0.36
                },
                {
                    "atkBuff": 0.198,
                    "atk": 0.39
                },
                {
                    "atkBuff": 0.204,
                    "atk": 0.42
                },
                {
                    "atkBuff": 0.21,
                    "atk": 0.45
                },
                {
                    "atkBuff": 0.218,
                    "atk": 0.48
                },
                {
                    "atkBuff": 0.225,
                    "atk": 0.52
                },
                {
                    "atkBuff": 0.2325,
                    "atk": 0.56
                },
                {
                    "atkBuff": 0.24,
                    "atk": 0.6
                },
                {
                    "atkBuff": 0.246,
                    "atk": 0.63
                },
                {
                    "atkBuff": 0.252,
                    "atk": 0.66
                }
            ],
            "inferredNotes": [
                "Lv.9 atkBuff は前後Lvから線形補完",
                "Lv.11 atkBuff は前後Lvから線形補完",
                "Lv.9 atk は前後Lvから線形補完",
                "Lv.11 atk は前後Lvから線形補完"
            ]
        },
        "technique": {
            "name": "先手有利",
            "sourceHeader": "秘技",
            "type": "buff",
            "target": "single",
            "description": "[サポート]秘技を使用した後、「軍功」を獲得する。キャラを切り替えると「軍功」は現在行動中のキャラに移る。次の戦闘開始時、「軍功」を所持しているキャラに戦闘スキルを自動で1回発動する。この発動はSPを消費しない。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "来た者ケリュドラの攻撃力が2,000を超えた時、超過した攻撃力100につき、自身の会心ダメージ+18%、最大で+360%。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "見た者ケリュドラの会心率+100%。ケリュドラのチャージが上限に達していない場合、「軍功」を所持しているキャラが必殺技を発動する時、ケリュドラはチャージを1獲得する。この効果は一度の戦闘で1回まで発動できる。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "征した者戦闘スキルを発動する時、自身および「軍功」を所持している他の味方の速度+20、3ターン継続。「軍功」を所持しているキャラが通常攻撃または戦闘スキルを発動する時、ケリュドラはEPを5回復する。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "全ての王冠を奪え",
            "description": "「軍功」を所持しているキャラが敵にダメージを与える時、ターゲットの防御力を16%無視する。「軍功」が「爵位」に昇格している間、そのキャラが敵に戦闘スキルダメージを与える時、さらにターゲットの防御力を20%無視する。ケリュドラが戦闘スキルを発動する時、指定した味方のEPを2回復する。"
        },
        "2": {
            "name": "万民の願いをここに",
            "description": "「軍功」を所持しているキャラの与ダメージ+40%。フィールド上に、ケリュドラ以外に「軍功」を所持している味方がいる場合、ケリュドラの与ダメージ+160%。"
        },
        "3": {
            "name": "旧き律法を焼き払え",
            "description": "戦闘スキルのLv.+2、最大Lv.+15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "天地も人界も改めよう",
            "description": "必殺技のダメージ倍率+240%。"
        },
        "5": {
            "name": "恩も仇も等しく返そう",
            "description": "必殺技のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "我は征く、星の大海へ",
            "description": "「軍功」を所持しているキャラの全属性耐性貫通+20%、「軍功」による付加ダメージの倍率+300%。フィールド上に、ケリュドラ以外に「軍功」を所持している味方がいる場合、ケリュドラの全属性耐性貫通+20%。"
        }
    },
    "partyEffects": [
        {
            "id": "skill_res_pen",
            "source": "skill",
            "name": "名を馳せよ、歩兵も将の器",
            "description": "[サポート]指定した味方単体キャラに「軍功」を付与し、ケリュドラはチャージを1獲得する。チャージの最大値は8。チャージが6に達した時、味方キャラの「軍功」は自動で「爵位」へと昇格し、その状態を所持しているキャラの行動制限系デバフを解除する。「爵位」を所持しているキャラは「軍功」も同時に所持しているものとみなし、戦闘スキルの会心ダメージ+X%、全属性耐性貫通+Y%。敵ターゲットに戦闘スキルを発動する時、奇襲が発動する。奇襲終了後、チャージを6消費し、「爵位」を「軍功」に戻す。",
            "defaultActive": false,
            "target": "single",
            "fromLevel": "skill",
            "stat": "RES_PEN",
            "statField": "resPen"
        },
        {
            "id": "talent_atk_flat",
            "source": "talent",
            "name": "栄光をカイザーに",
            "description": "[サポート]「軍功」を所持しているキャラの攻撃力が、ケリュドラの攻撃力X%分アップする。そのキャラが通常攻撃または戦闘スキルを発動する時、ケリュドラはチャージを1獲得する。なお、奇襲期間中の場合、ケリュドラはこの方法でチャージを獲得できない。「軍功」を所持しているキャラが攻撃を行った後、ケリュドラは追加で自身の攻撃力Y%分の風属性付加ダメージを1回与える。この効果は最大で20回発動でき、ケリュドラが必殺技を発動するたびに、効果の発動可能回数をリセットする。「軍功」は最後に付与したターゲットにのみ有効。ターゲットが変更された時、ケリュドラのチャージは0にリセットされる。",
            "defaultActive": false,
            "target": "single",
            "fromLevel": "talent",
            "stat": "ATK_FLAT",
            "compute": "casterDerivedRatio",
            "sourceStat": "atk",
            "ratioField": "atkBuff"
        },
        {
            "id": "e1_def_ignore",
            "source": "eidolon",
            "name": "全ての王冠を奪え",
            "description": "「軍功」を所持しているキャラが敵にダメージを与える時、ターゲットの防御力を16%無視する。「軍功」が「爵位」に昇格している間、そのキャラが敵に戦闘スキルダメージを与える時、さらにターゲットの防御力を20%無視する。ケリュドラが戦闘スキルを発動する時、指定した味方のEPを2回復する。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 1,
            "stat": "DEF_IGNORE",
            "value": 0.16
        },
        {
            "id": "e2_dmg",
            "source": "eidolon",
            "name": "万民の願いをここに",
            "description": "「軍功」を所持しているキャラの与ダメージ+40%。フィールド上に、ケリュドラ以外に「軍功」を所持している味方がいる場合、ケリュドラの与ダメージ+160%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 2,
            "stat": "DMG_ALL",
            "value": 0.4
        },
        {
            "id": "e6_res_pen",
            "source": "eidolon",
            "name": "我は征く、星の大海へ",
            "description": "「軍功」を所持しているキャラの全属性耐性貫通+20%、「軍功」による付加ダメージの倍率+300%。フィールド上に、ケリュドラ以外に「軍功」を所持している味方がいる場合、ケリュドラの全属性耐性貫通+20%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 6,
            "stat": "RES_PEN",
            "value": 0.2
        },
        {
            "id": "skill_crit_dmg_skill",
            "source": "skill",
            "name": "名を馳せよ、歩兵も将の器",
            "description": "「爵位」を所持しているキャラの戦闘スキルの会心ダメージ+X%。",
            "defaultActive": false,
            "target": "single",
            "fromLevel": "skill",
            "stat": "CRIT_DMG_SKILL",
            "statField": "cdBuff"
        },
        {
            "id": "extra6_target_spd_flat",
            "source": "extra",
            "name": "昇格6",
            "description": "戦闘スキルを発動する時、「軍功」を所持している他の味方の速度+20、3ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 3,
            "stat": "SPD_FLAT",
            "value": 20
        },
        {
            "id": "e1_skill_def_ignore_extra",
            "source": "eidolon",
            "name": "全ての王冠を奪え",
            "description": "「軍功」が「爵位」に昇格している間、そのキャラが敵に戦闘スキルダメージを与える時、さらにターゲットの防御力を20%無視する。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 1,
            "stat": "DEF_IGNORE_SKILL",
            "value": 0.2
        }
    ],
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "extra2_atk_to_crit_dmg",
            "source": "extra",
            "name": "昇格2",
            "description": "来た者ケリュドラの攻撃力が2,000を超えた時、超過した攻撃力100につき、自身の会心ダメージ+18%、最大で+360%。",
            "stat": "CRIT_DMG",
            "compute": "casterDerivedExcessStepCap",
            "sourceStat": "atk",
            "threshold": 2000,
            "step": 100,
            "valuePerStep": 0.18,
            "cap": 3.6
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "extra6_spd_flat",
            "source": "extra",
            "name": "昇格6",
            "description": "征した者戦闘スキルを発動する時、自身および「軍功」を所持している他の味方の速度+20、3ターン継続。「軍功」を所持しているキャラが通常攻撃または戦闘スキルを発動する時、ケリュドラはEPを5回復する。",
            "stat": "SPD_FLAT",
            "value": 20,
            "duration": 3
        },
        {
            "id": "extra4_crit_rate",
            "source": "extra",
            "name": "昇格4",
            "description": "ケリュドラの会心率+100%。",
            "defaultActive": false,
            "target": "single",
            "stat": "CRIT_RATE",
            "value": 1
        },
        {
            "id": "e2_self_dmg",
            "source": "eidolon",
            "name": "万民の願いをここに",
            "description": "フィールド上に、ケリュドラ以外に「軍功」を所持している味方がいる場合、ケリュドラの与ダメージ+160%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 2,
            "stat": "DMG_ALL",
            "value": 1.6
        },
        {
            "id": "e4_ult_dmg",
            "source": "eidolon",
            "name": "天地も人界も改めよう",
            "description": "必殺技のダメージ倍率+240%。火力比較用に必殺与ダメ枠として近似。",
            "defaultActive": false,
            "target": "single",
            "minEidolon": 4,
            "stat": "DMG_ULT",
            "value": 2.4
        },
        {
            "id": "e6_self_res_pen",
            "source": "eidolon",
            "name": "我は征く、星の大海へ",
            "description": "フィールド上に、ケリュドラ以外に「軍功」を所持している味方がいる場合、ケリュドラの全属性耐性貫通+20%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 6,
            "stat": "RES_PEN",
            "value": 0.2
        }
    ],
    "enemyEffects": []
});
