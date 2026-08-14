import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Silver Wolf",
    "id": "silver_wolf",
    "name": "銀狼",
    "element": "Quantum",
    "elementLabel": "量子",
    "path": "Nihility",
    "rarity": 5,
    "base": {
        "hp": 1047,
        "atk": 640,
        "def": 460,
        "spd": 107
    },
    "maxEnergy": 110,
    "traceBonuses": [
        {
            "label": "攻撃力",
            "value": 0.28
        },
        {
            "label": "効果命中",
            "value": 0.18
        },
        {
            "label": "量子ダメージ",
            "value": 0.08
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E9%8A%80%E7%8B%BC",
        "version": "1.1"
    },
    "skills": {
        "basic": {
            "name": "|システム警告|",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に銀狼の攻撃力X%分の量子属性ダメージを与える。",
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
            "name": "変更を許可しますか？",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]X%の基礎確率で指定した敵単体に、フィールド上の味方が有する属性の内1つを弱点として埋め込む（パーティの1枠目のキャラの属性を優先的に埋め込む）。さらにその弱点属性の属性耐性-20%、3ターン継続。元からあった弱点を埋め込んだ場合、対応属性の属性耐性がダウンする効果は発動されない。1体の敵に対し、銀狼が埋め込める弱点は1つまで。銀狼が同じ敵に対して再度弱点を埋め込む時、最後に埋め込んだ弱点のみが残される。100%の基礎確率でさらにその敵の全属性耐性-Y%、2ターン継続。その敵に銀狼の攻撃力Z%分の量子属性ダメージを与える。",
            "levelColumns": [
                "基礎確率(X%)",
                "耐性ダウン(Y%)",
                "ダメージ倍率(Z％)"
            ],
            "levels": [
                {
                    "atk": 0.8,
                    "atkAlt2": 0.105,
                    "atk2": 0.98
                },
                {
                    "atk": 0.84,
                    "atkAlt2": 0.107,
                    "atk2": 1.07
                },
                {
                    "atk": 0.88,
                    "atkAlt2": 0.11,
                    "atk2": 1.17
                },
                {
                    "atk": 0.92,
                    "atkAlt2": 0.112,
                    "atk2": 1.27
                },
                {
                    "atk": 0.96,
                    "atkAlt2": 0.115,
                    "atk2": 1.37
                },
                {
                    "atk": 1,
                    "atkAlt2": 0.117,
                    "atk2": 1.47
                },
                {
                    "atk": 1.05,
                    "atkAlt2": 0.12,
                    "atk2": 1.59
                },
                {
                    "atk": 1.1,
                    "atkAlt2": 0.123,
                    "atk2": 1.71
                },
                {
                    "atk": 1.15,
                    "atkAlt2": 0.126,
                    "atk2": 1.83
                },
                {
                    "atk": 1.2,
                    "atkAlt2": 0.13,
                    "atk2": 1.96
                },
                {
                    "atk": 1.24,
                    "atkAlt2": 0.132,
                    "atk2": 2.05
                },
                {
                    "atk": 1.28,
                    "atkAlt2": 0.135,
                    "atk2": 2.15
                }
            ]
        },
        "ult": {
            "name": "|アカウントがBANされた|",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]X%の基礎確率で敵全体の防御力-Y%、3ターン継続。敵全体に銀狼の攻撃力Z%分の量子属性ダメージを与える。",
            "levelColumns": [
                "基礎確率(X%)",
                "防御力ダウン(Y％)",
                "ダメージ倍率(Z％)",
                "消費EP"
            ],
            "levels": [
                {
                    "defPct": 0.8,
                    "defDown": 0.36,
                    "defPct2": 2.28,
                    "energyCost": 110
                },
                {
                    "defPct": 0.84,
                    "defDown": 0.369,
                    "defPct2": 2.43
                },
                {
                    "defPct": 0.88,
                    "defDown": 0.378,
                    "defPct2": 2.58
                },
                {
                    "defPct": 0.92,
                    "defDown": 0.387,
                    "defPct2": 2.73
                },
                {
                    "defPct": 0.96,
                    "defDown": 0.396,
                    "defPct2": 2.88
                },
                {
                    "defPct": 1,
                    "defDown": 0.405,
                    "defPct2": 3.04
                },
                {
                    "defPct": 1.05,
                    "defDown": 0.416,
                    "defPct2": 3.23
                },
                {
                    "defPct": 1.1,
                    "defDown": 0.427,
                    "defPct2": 3.42
                },
                {
                    "defPct": 1.15,
                    "defDown": 0.438,
                    "defPct2": 3.61
                },
                {
                    "defPct": 1.2,
                    "defDown": 0.45,
                    "defPct2": 3.8
                },
                {
                    "defPct": 1.24,
                    "defDown": 0.459,
                    "defPct2": 3.95
                },
                {
                    "defPct": 1.28,
                    "defDown": 0.468,
                    "defPct2": 4.1
                }
            ]
        },
        "talent": {
            "name": "プログラム応答なし…",
            "sourceHeader": "天賦",
            "type": "debuff",
            "target": "single",
            "description": "[妨害]銀狼は以下の3つの「欠陥」を作成できる：攻撃力-X%、防御力-Y%、速度-Z%。銀狼が攻撃を行った後、W%の基礎確率で攻撃を受けた敵にランダムな「欠陥」を1つ埋め込む、3ターン継続。敵が倒された時、銀狼がその敵に付与した弱点は、銀狼が弱点を付与していないフィールド上の敵に移る。なお、優先的に精鋭エネミー以上の敵に移る。",
            "levelColumns": [
                "攻撃力ダウン(X%)",
                "防御力ダウン(Y%)",
                "速度ダウン(Z%)",
                "基礎確率(W%)"
            ],
            "levels": [
                {
                    "value1": 0.05,
                    "defDown": 0.06,
                    "spdBuff": 0.03,
                    "value4": 0.6
                },
                {
                    "value1": 0.055,
                    "defDown": 0.066,
                    "spdBuff": 0.033,
                    "value4": 0.64
                },
                {
                    "value1": 0.06,
                    "defDown": 0.072,
                    "spdBuff": 0.036,
                    "value4": 0.68
                },
                {
                    "value1": 0.065,
                    "defDown": 0.078,
                    "spdBuff": 0.039,
                    "value4": 0.72
                },
                {
                    "value1": 0.07,
                    "defDown": 0.084,
                    "spdBuff": 0.042,
                    "value4": 0.76
                },
                {
                    "value1": 0.075,
                    "defDown": 0.09,
                    "spdBuff": 0.045,
                    "value4": 0.8
                },
                {
                    "value1": 0.081,
                    "defDown": 0.097,
                    "spdBuff": 0.048,
                    "value4": 0.85
                },
                {
                    "value1": 0.087,
                    "defDown": 0.105,
                    "spdBuff": 0.052,
                    "value4": 0.9
                },
                {
                    "value1": 0.093,
                    "defDown": 0.112,
                    "spdBuff": 0.056,
                    "value4": 0.95
                },
                {
                    "value1": 0.1,
                    "defDown": 0.12,
                    "spdBuff": 0.06,
                    "value4": 1
                },
                {
                    "value1": 0.105,
                    "defDown": 0.126,
                    "spdBuff": 0.063,
                    "value4": 1.04
                },
                {
                    "value1": 0.11,
                    "defDown": 0.132,
                    "spdBuff": 0.066,
                    "value4": 1.08
                }
            ]
        },
        "technique": {
            "name": "|プロセス強制終了|",
            "sourceHeader": "秘技",
            "type": "support",
            "target": "all",
            "description": "敵を攻撃。戦闘に入った後、敵全体に銀狼の攻撃力80%分の量子属性ダメージを与え、弱点属性を無視して敵全体の靭性を削る。この秘技で弱点撃破した時、量子属性の弱点撃破効果を発動する。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "作成「欠陥」の継続時間+1ターン。敵が弱点撃破された時、銀狼は100%の基礎確率でその敵にランダムな「欠陥」を1つ埋め込む。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "注入戦闘開始時、EPを20回復する。銀狼のターンが回ってきた時、自身のEPを5回復する。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "アノテーション銀狼は効果命中10%につき、攻撃力+10%、最大で50%。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "社会工学",
            "description": "必殺技で敵を攻撃した後、敵にデバフが1つあるごとに、銀狼はEPを7回復する。この効果は一回の必殺技発動につき、最大で5回発動できる。"
        },
        "2": {
            "name": "ボットネット",
            "description": "敵が戦闘に入る時、受けるダメージ+20%。敵が味方の攻撃を受ける時、銀狼は100%の基礎確率でその敵にランダムな「欠陥」を1つ埋め込む。"
        },
        "3": {
            "name": "ペイロード",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "4": {
            "name": "バウンス攻撃",
            "description": "必殺技で敵を攻撃した後、その敵にあるデバフ1つにつき、さらに銀狼の攻撃力20%分の量子属性付加ダメージを与える。この効果は1回の必殺技で、敵それぞれに最大で5回発動できる。"
        },
        "5": {
            "name": "総当たり攻撃",
            "description": "必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "6": {
            "name": "オーバーレイ ネットワーク",
            "description": "敵にあるデバフ1つにつき、その敵に対する銀狼の与ダメージ+20%、最大で+100%。"
        }
    },
    "partyEffects": [
        {
            "id": "ult_def_down_mirror",
            "source": "ult",
            "name": "|アカウントがBANされた| (火力計算用)",
            "description": "[全体攻撃]X%の基礎確率で敵全体の防御力-Y%、3ターン継続。敵全体に銀狼の攻撃力Z%分の量子属性ダメージを与える。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "all",
            "duration": 3,
            "fromLevel": "ult",
            "stat": "DEF_DOWN",
            "statField": "defDown"
        },
        {
            "id": "talent_def_down_mirror",
            "source": "talent",
            "name": "プログラム応答なし… (火力計算用)",
            "description": "[妨害]銀狼は以下の3つの「欠陥」を作成できる：攻撃力-X%、防御力-Y%、速度-Z%。銀狼が攻撃を行った後、W%の基礎確率で攻撃を受けた敵にランダムな「欠陥」を1つ埋め込む、3ターン継続。敵が倒された時、銀狼がその敵に付与した弱点は、銀狼が弱点を付与していないフィールド上の敵に移る。なお、優先的に精鋭エネミー以上の敵に移る。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "single",
            "duration": 3,
            "fromLevel": "talent",
            "stat": "DEF_DOWN",
            "statField": "defDown"
        },
        {
            "id": "e2_dmg_taken_mirror",
            "source": "eidolon",
            "name": "ボットネット (火力計算用)",
            "description": "敵が戦闘に入る時、受けるダメージ+20%。敵が味方の攻撃を受ける時、銀狼は100%の基礎確率でその敵にランダムな「欠陥」を1つ埋め込む。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 2,
            "stat": "DMG_TAKEN",
            "value": 0.2
        },
        {
            "id": "skill_res_down_mirror",
            "source": "skill",
            "name": "変更を許可しますか？ (火力計算用)",
            "description": "戦闘スキルで100%の基礎確率で敵の全属性耐性-Y%、2ターン継続。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "fromLevel": "skill",
            "stat": "RES_PEN",
            "statField": "atkAlt2"
        },
        {
            "id": "skill_implant_res_down_mirror",
            "source": "skill",
            "name": "変更を許可しますか？ (火力計算用)",
            "description": "弱点埋め込み時、さらにその弱点属性の属性耐性-20%、3ターン継続。該当属性の攻撃時に手動ONする近似枠。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "single",
            "duration": 3,
            "stat": "RES_PEN",
            "value": 0.2
        }
    ],
    "enemyEffects": [
        {
            "id": "ult_def_down",
            "source": "ult",
            "name": "|アカウントがBANされた|",
            "description": "[全体攻撃]X%の基礎確率で敵全体の防御力-Y%、3ターン継続。敵全体に銀狼の攻撃力Z%分の量子属性ダメージを与える。",
            "defaultActive": false,
            "target": "all",
            "duration": 3,
            "fromLevel": "ult",
            "stat": "DEF_DOWN",
            "statField": "defDown"
        },
        {
            "id": "talent_def_down",
            "source": "talent",
            "name": "プログラム応答なし…",
            "description": "[妨害]銀狼は以下の3つの「欠陥」を作成できる：攻撃力-X%、防御力-Y%、速度-Z%。銀狼が攻撃を行った後、W%の基礎確率で攻撃を受けた敵にランダムな「欠陥」を1つ埋め込む、3ターン継続。敵が倒された時、銀狼がその敵に付与した弱点は、銀狼が弱点を付与していないフィールド上の敵に移る。なお、優先的に精鋭エネミー以上の敵に移る。",
            "defaultActive": false,
            "target": "single",
            "duration": 3,
            "fromLevel": "talent",
            "stat": "DEF_DOWN",
            "statField": "defDown"
        },
        {
            "id": "e2_dmg_taken",
            "source": "eidolon",
            "name": "ボットネット",
            "description": "敵が戦闘に入る時、受けるダメージ+20%。敵が味方の攻撃を受ける時、銀狼は100%の基礎確率でその敵にランダムな「欠陥」を1つ埋め込む。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 2,
            "stat": "DMG_TAKEN",
            "value": 0.2
        },
        {
            "id": "skill_res_down",
            "source": "skill",
            "name": "変更を許可しますか？",
            "description": "戦闘スキルで100%の基礎確率で敵の全属性耐性-Y%、2ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "fromLevel": "skill",
            "stat": "RES_PEN",
            "statField": "atkAlt2"
        },
        {
            "id": "skill_implant_res_down",
            "source": "skill",
            "name": "変更を許可しますか？",
            "description": "弱点埋め込み時、さらにその弱点属性の属性耐性-20%、3ターン継続。該当属性の攻撃時に手動ONする近似枠。",
            "defaultActive": false,
            "target": "single",
            "duration": 3,
            "stat": "RES_PEN",
            "value": 0.2
        }
    ],
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "extra6_ehr_to_atk",
            "source": "extra",
            "name": "昇格6",
            "description": "アノテーション銀狼は効果命中10%につき、攻撃力+10%、最大で50%。",
            "stat": "ATK_PERCENT",
            "compute": "casterDerivedExcessStepCap",
            "sourceStat": "ehr",
            "threshold": 0,
            "step": 0.1,
            "valuePerStep": 0.1,
            "cap": 0.5
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e6_debuff_dmg",
            "source": "eidolon",
            "name": "オーバーレイ ネットワーク",
            "description": "敵にあるデバフ1つにつき、その敵に対する銀狼の与ダメージ+20%、最大で+100%。",
            "stat": "DMG_ALL",
            "value": 0.2,
            "minEidolon": 6,
            "stackable": {
                "max": 5,
                "default": 5
            }
        }
    ]
});
