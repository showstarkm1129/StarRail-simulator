import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Firefly",
    "id": "firefly",
    "name": "ホタル",
    "element": "Fire",
    "elementLabel": "炎",
    "path": "Destruction",
    "rarity": 5,
    "base": {
        "hp": 814,
        "atk": 523,
        "def": 776,
        "spd": 104
    },
    "maxEnergy": 240,
    "traceBonuses": [
        {
            "label": "撃破特効",
            "value": 0.373
        },
        {
            "label": "効果抵抗",
            "value": 0.18
        },
        {
            "label": "速度",
            "value": 5
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%83%9B%E3%82%BF%E3%83%AB",
        "version": "2.3"
    },
    "skills": {
        "basic": {
            "name": "コマンド-フラッシュオーバー推進",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に装甲「サム」の攻撃力X%分の炎属性ダメージを与える。",
            "levelColumns": [
                "コマンド-フラッシュオーバー推進",
                "ファイアフライ-Ⅳ-底火斬撃"
            ],
            "levels": [
                {
                    "atk": 0.5,
                    "atkAlt2": 1
                },
                {
                    "atk": 0.6,
                    "atkAlt2": 1.2
                },
                {
                    "atk": 0.7,
                    "atkAlt2": 1.4
                },
                {
                    "atk": 0.8,
                    "atkAlt2": 1.6
                },
                {
                    "atk": 0.9,
                    "atkAlt2": 1.8
                },
                {
                    "atk": 1,
                    "atkAlt2": 2
                },
                {
                    "atk": 1.1,
                    "atkAlt2": 2.2
                }
            ]
        },
        "skill": {
            "name": "コマンド-天火轟撃",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]自身の最大HP40%分のHPを消費し、自身の最大EPX%分のEPを固定で回復する。指定した敵単体に装甲「サム」の攻撃力Y%分の炎属性ダメージを与える。残りHPが足りない場合、戦闘スキルを発動する時、装甲「サム」の残りHPが1になる。自身の次の行動順を25%早める。",
            "levelColumns": [
                "コマンド-天火轟撃",
                "ファイアフライ-Ⅳ-死星オーバーロード"
            ],
            "levels": [
                {
                    "hpPct": 0.5,
                    "hpPctAlt2": 1
                },
                {
                    "hpPct": 0.51,
                    "hpPctAlt2": 1.1
                },
                {
                    "hpPct": 0.52,
                    "hpPctAlt2": 1.2
                },
                {
                    "hpPct": 0.53,
                    "hpPctAlt2": 1.3
                },
                {
                    "hpPct": 0.54,
                    "hpPctAlt2": 1.4
                },
                {
                    "hpPct": 0.55,
                    "hpPctAlt2": 1.5
                },
                {
                    "hpPct": 0.56,
                    "hpPctAlt2": 1.62
                },
                {
                    "hpPct": 0.57,
                    "hpPctAlt2": 1.75
                },
                {
                    "hpPct": 0.58,
                    "hpPctAlt2": 1.87
                },
                {
                    "hpPct": 0.6,
                    "hpPctAlt2": 2
                },
                {
                    "hpPct": 0.61,
                    "hpPctAlt2": 2.1
                },
                {
                    "hpPct": 0.62,
                    "hpPctAlt2": 2.2
                }
            ]
        },
        "ult": {
            "name": "ファイアフライ-Ⅳ-完全燃焼",
            "sourceHeader": "必殺技",
            "type": "debuff",
            "target": "single",
            "description": "[強化]「完全燃焼」状態に入り、自身の行動順を100%早める。また、通常攻撃が「ファイアフライ-IV-底火斬撃」に、戦闘スキルが「ファイアフライ-IV-死星オーバーロード」に強化される。「完全燃焼」状態の時、速度+X。さらに、強化通常攻撃または強化戦闘スキルを発動する時、自身の弱点撃破効率+50%、敵が装甲「サム」から受ける弱点撃破ダメージ+Y%、その回の攻撃が終了するまで継続。アクションバーに「完全燃焼」のカウントダウンが出現する。カウントダウンのターンが回ってきた時、装甲「サム」は「完全燃焼」状態を解除する。カウントダウンの速度は70に固定される。「完全燃焼」状態の装甲「サム」は必殺技を発動できない。",
            "levelColumns": [
                "速度アップ(X)",
                "敵の弱点撃破被ダメージアップ(Y％)",
                "消費EP"
            ],
            "levels": [
                {
                    "spdFlat": 30,
                    "dmgTaken": 0.1,
                    "energyCost": 240
                },
                {
                    "spdFlat": 33,
                    "dmgTaken": 0.11
                },
                {
                    "spdFlat": 36,
                    "dmgTaken": 0.12
                },
                {
                    "spdFlat": 39,
                    "dmgTaken": 0.13
                },
                {
                    "spdFlat": 42,
                    "dmgTaken": 0.14
                },
                {
                    "spdFlat": 45,
                    "dmgTaken": 0.15
                },
                {
                    "spdFlat": 48,
                    "dmgTaken": 0.162
                },
                {
                    "spdFlat": 52,
                    "dmgTaken": 0.175
                },
                {
                    "spdFlat": 56,
                    "dmgTaken": 0.187
                },
                {
                    "spdFlat": 60,
                    "dmgTaken": 0.2
                },
                {
                    "spdFlat": 63,
                    "dmgTaken": 0.21
                },
                {
                    "spdFlat": 66,
                    "dmgTaken": 0.22
                }
            ]
        },
        "talent": {
            "name": "ホタル式源火中枢",
            "sourceHeader": "天賦",
            "type": "debuff",
            "target": "single",
            "description": "[防御]残りHPが少ないほど受けるダメージがダウンする。残りHPが20%以下の時、ダメージ軽減効果が最大値に達する、最大で受けるダメージ-X%。「完全燃焼」状態の時、ダメージ軽減効果は最大値を維持し、効果抵抗+Y%。戦闘開始時、EPが50%未満の場合、EPを50%まで回復する。EPが満タンになる時、自身にあるデバフをすべて解除する。",
            "levelColumns": [
                "ダメージ軽減(X%)",
                "効果抵抗アップ(Y%)"
            ],
            "levels": [
                {
                    "dmgReduction": 0.2,
                    "effectResBuff": 0.1
                },
                {
                    "dmgReduction": 0.22,
                    "effectResBuff": 0.12
                },
                {
                    "dmgReduction": 0.24,
                    "effectResBuff": 0.14
                },
                {
                    "dmgReduction": 0.26,
                    "effectResBuff": 0.16
                },
                {
                    "dmgReduction": 0.28,
                    "effectResBuff": 0.18
                },
                {
                    "dmgReduction": 0.3,
                    "effectResBuff": 0.2
                },
                {
                    "dmgReduction": 0.32,
                    "effectResBuff": 0.22
                },
                {
                    "dmgReduction": 0.35,
                    "effectResBuff": 0.25
                },
                {
                    "dmgReduction": 0.37,
                    "effectResBuff": 0.27
                },
                {
                    "dmgReduction": 0.4,
                    "effectResBuff": 0.3
                },
                {
                    "dmgReduction": 0.42,
                    "effectResBuff": 0.32
                },
                {
                    "dmgReduction": 0.44,
                    "effectResBuff": 0.34
                }
            ]
        },
        "technique": {
            "name": "Δコマンド-焦土隕撃",
            "sourceHeader": "秘技",
            "type": "attack",
            "target": "all",
            "description": "空中に跳び上がり、自由に移動する、5秒間継続。継続時間終了後、落下攻撃を行い、一定範囲内のすべての敵を攻撃する。継続時間中に攻撃を行うと、直ちに落下攻撃を行うことができる。各ウェーブ開始時、敵全体に炎属性弱点を付与する、2ターン継続。その後、敵全体に装甲「サム」の攻撃力200%分の炎属性ダメージを与える。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "αモジュール-アンチラグバースト「完全燃焼」状態の時、装甲「サム」の撃破特効+25%。強化通常攻撃「ファイアフライ-IV-底火斬撃」または強化戦闘スキル「ファイアフライ-IV-死星オーバーロード」を発動して敵を弱点撃破状態にした時、「完全燃焼」のカウントダウンの行動順を10%遅延させる。この効果は1度の「完全燃焼」状態で、最大3回まで発動できる。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "βモジュール-自己制限装甲「完全燃焼」状態の時、装甲「サム」の撃破特効が150%/300%以上の場合、弱点撃破状態の敵に攻撃を行った後、その回の攻撃の削靭値を100%/150%分の超撃破ダメージに転換する。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "γモジュール-過負荷コア装甲「サム」の攻撃力が1,800を超えた時、超過した攻撃力10につき、自身の撃破特効+0.8%。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "かつて安眠せし赤染の繭",
            "description": "強化戦闘スキル「ファイアフライ-IV-死星オーバーロード」を発動する時、ターゲットの防御力を15%無視し、SPを消費しない。"
        },
        "2": {
            "name": "砕かれし空からの墜落",
            "description": "「完全燃焼」状態で強化通常攻撃「ファイアフライ-IV-底火斬撃」か強化戦闘スキル「ファイアフライ-IV-死星オーバーロード」を発動して敵を倒す、または敵を弱点撃破状態にする時、装甲「サム」が追加ターンを1獲得する。この効果は1ターン後に再度発動できる。"
        },
        "3": {
            "name": "静かな星の川で眠る",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "いつか蛍火をこの目に",
            "description": "「完全燃焼」状態の時、装甲「サム」の効果抵抗+50%。"
        },
        "5": {
            "name": "夢のない長い夜から明ける",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "終わりの明日に咲き誇る",
            "description": "「完全燃焼」状態の時、装甲「サム」の炎属性耐性貫通+20%。強化通常攻撃「ファイアフライ-IV-底火斬撃」または強化戦闘スキル「ファイアフライ-IV-死星オーバーロード」を発動する時、弱点撃破効率+50%。"
        }
    },
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "ult_spd_flat",
            "source": "ult",
            "name": "ファイアフライ-Ⅳ-完全燃焼",
            "description": "[強化]「完全燃焼」状態に入り、自身の行動順を100%早める。また、通常攻撃が「ファイアフライ-IV-底火斬撃」に、戦闘スキルが「ファイアフライ-IV-死星オーバーロード」に強化される。「完全燃焼」状態の時、速度+X。さらに、強化通常攻撃または強化戦闘スキルを発動する時、自身の弱点撃破効率+50%、敵が装甲「サム」から受ける弱点撃破ダメージ+Y%、その回の攻撃が終了するまで継続。アクションバーに「完全燃焼」のカウントダウンが出現する。カウントダウンのターンが回ってきた時、装甲「サム」は「完全燃焼」状態を解除する。カウントダウンの速度は70に固定される。「完全燃焼」状態の装甲「サム」は必殺技を発動できない。",
            "fromLevel": "ult",
            "stat": "SPD_FLAT",
            "statField": "spdFlat"
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "extra6_atk_to_break_effect",
            "source": "extra",
            "name": "昇格6",
            "description": "γモジュール-過負荷コア装甲「サム」の攻撃力が1,800を超えた時、超過した攻撃力10につき、自身の撃破特効+0.8%。",
            "stat": "BREAK_EFFECT",
            "compute": "casterDerivedExcessStepCap",
            "sourceStat": "atk",
            "threshold": 1800,
            "step": 10,
            "valuePerStep": 0.008
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e1_def_ignore",
            "source": "eidolon",
            "name": "かつて安眠せし赤染の繭",
            "description": "強化戦闘スキル「ファイアフライ-IV-死星オーバーロード」を発動する時、ターゲットの防御力を15%無視し、SPを消費しない。",
            "stat": "DEF_IGNORE",
            "value": 0.15,
            "minEidolon": 1
        },
        {
            "id": "extra2_complete_combustion_break",
            "source": "extra",
            "name": "昇格2",
            "description": "「完全燃焼」状態の時、装甲「サム」の撃破特効+25%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "stat": "BREAK_EFFECT",
            "value": 0.25
        },
        {
            "id": "e4_effect_res",
            "source": "eidolon",
            "name": "いつか蛍火をこの目に",
            "description": "「完全燃焼」状態の時、装甲「サム」の効果抵抗+50%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 4,
            "stat": "EFFECT_RES",
            "value": 0.5
        },
        {
            "id": "e6_fire_res_pen",
            "source": "eidolon",
            "name": "終わりの明日に咲き誇る",
            "description": "「完全燃焼」状態の時、装甲「サム」の炎属性耐性貫通+20%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 6,
            "stat": "RES_PEN",
            "value": 0.2
        }
    ],
    "partyEffects": [],
    "enemyEffects": []
});
