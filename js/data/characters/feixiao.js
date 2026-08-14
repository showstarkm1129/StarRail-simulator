import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Feixiao",
    "id": "feixiao",
    "name": "飛霄",
    "element": "Wind",
    "elementLabel": "風",
    "path": "The Hunt",
    "rarity": 5,
    "base": {
        "hp": 1047,
        "atk": 601,
        "def": 388,
        "spd": 112
    },
    "maxEnergy": null,
    "traceBonuses": [
        {
            "label": "攻撃力",
            "value": 0.28
        },
        {
            "label": "会心率",
            "value": 0.12
        },
        {
            "label": "防御力",
            "value": 0.125
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E9%A3%9B%E9%9C%84",
        "version": "2.5"
    },
    "skills": {
        "basic": {
            "name": "閃裂",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に飛霄の攻撃力X%分の風属性ダメージを与える。",
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
            "name": "斧貫",
            "sourceHeader": "戦闘スキル",
            "type": "follow_up",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に飛霄の攻撃力X%分の風属性ダメージを与え、その後、その敵に天賦による追加攻撃を即座に1回発動する。",
            "levelColumns": [
                "ダメージ倍率(X%)"
            ],
            "levels": [
                {
                    "atk": 1
                },
                {
                    "atk": 1.1
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
                    "atk": 1.62
                },
                {
                    "atk": 1.75
                },
                {
                    "atk": 1.87
                },
                {
                    "atk": 2
                },
                {
                    "atk": 2.1
                },
                {
                    "atk": 2.2
                }
            ]
        },
        "ult": {
            "name": "大荒滅破砕",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に最大で飛霄の攻撃力X%分の風属性ダメージを与える。必殺技発動中は弱点属性を無視して敵の靭性を削る。敵が弱点撃破状態にない時、飛霄の弱点撃破効率+100%。飛霄はターゲットの敵に「閃裂刃舞」または「斧貫衝天」を合計で6回発動し、最後に飛霄の攻撃力Y%分の風属性ダメージを与える。",
            "levelColumns": [
                "最大合計ダメージ倍率(X%)",
                "大荒滅破砕",
                "「閃裂刃舞」/「斧貫衝天」",
                "スキル消費"
            ],
            "levels": [
                {
                    "atk": 4.02,
                    "atkAlt2": 0.96,
                    "atkAlt3": 0.36,
                    "atkAlt4": 0.15
                },
                {
                    "atk": 4.31,
                    "atkAlt2": 1.02,
                    "atkAlt3": 0.38,
                    "atkAlt4": 0.16
                },
                {
                    "atk": 4.61,
                    "atkAlt2": 1.08,
                    "atkAlt3": 0.4,
                    "atkAlt4": 0.18
                },
                {
                    "atk": 4.91,
                    "atkAlt2": 1.15,
                    "atkAlt3": 0.43,
                    "atkAlt4": 0.19
                },
                {
                    "atk": 5.21,
                    "atkAlt2": 1.21,
                    "atkAlt3": 0.45,
                    "atkAlt4": 0.21
                },
                {
                    "atk": 5.51,
                    "atkAlt2": 1.28,
                    "atkAlt3": 0.48,
                    "atkAlt4": 0.22
                },
                {
                    "atk": 5.88,
                    "atkAlt2": 1.36,
                    "atkAlt3": 0.51,
                    "atkAlt4": 0.24
                },
                {
                    "atk": 6.25,
                    "atkAlt2": 1.44,
                    "atkAlt3": 0.54,
                    "atkAlt4": 0.26
                },
                {
                    "atk": 6.62,
                    "atkAlt2": 1.52,
                    "atkAlt3": 0.57,
                    "atkAlt4": 0.28
                },
                {
                    "atk": 7,
                    "atkAlt2": 1.6,
                    "atkAlt3": 0.6,
                    "atkAlt4": 0.3
                },
                {
                    "atk": 7.29,
                    "atkAlt2": 1.66,
                    "atkAlt3": 0.62,
                    "atkAlt4": 0.31
                },
                {
                    "atk": 7.59,
                    "atkAlt2": 1.72,
                    "atkAlt3": 0.64,
                    "atkAlt4": 0.33
                }
            ]
        },
        "talent": {
            "name": "雷狩",
            "sourceHeader": "天賦",
            "type": "follow_up",
            "target": "single",
            "description": "[単体攻撃]「飛黄」が6層に達すると必殺技が発動可能になる。「飛黄」は最大で12層累積できる。味方が2回攻撃を行うたびに、飛霄は「飛黄」を1層獲得する。なお、飛霄の必殺技での攻撃は回数にカウントされない。飛霄以外の味方が敵に攻撃を行った後、味方のメインターゲットとなった敵に飛霄が追加攻撃を行い、飛霄の攻撃力X%分の風属性ダメージを与える。攻撃可能なメインターゲットがいない場合、ランダムな敵単体を攻撃する。この効果はターンが回ってくるたびに1回まで発動でき、飛霄のターンが回ってくるたびに発動可能回数がリセットされる。この攻撃を行う時、自身の与ダメージ+Y%、2ターン継続。",
            "levelColumns": [
                "ダメージ倍率(X%)",
                "与ダメージアップ(Y%)"
            ],
            "levels": [
                {
                    "atk": 0.55,
                    "dmgBuff": 0.3
                },
                {
                    "atk": 0.6,
                    "dmgBuff": 0.33
                },
                {
                    "atk": 0.66,
                    "dmgBuff": 0.36
                },
                {
                    "atk": 0.71,
                    "dmgBuff": 0.39
                },
                {
                    "atk": 0.77,
                    "dmgBuff": 0.42
                },
                {
                    "atk": 0.82,
                    "dmgBuff": 0.45
                },
                {
                    "atk": 0.89,
                    "dmgBuff": 0.48
                },
                {
                    "atk": 0.96,
                    "dmgBuff": 0.52
                },
                {
                    "atk": 1.03,
                    "dmgBuff": 0.56
                },
                {
                    "atk": 1.1,
                    "dmgBuff": 0.6
                },
                {
                    "atk": 1.15,
                    "dmgBuff": 0.63
                },
                {
                    "atk": 1.21,
                    "dmgBuff": 0.66
                }
            ]
        },
        "technique": {
            "name": "嵐身",
            "sourceHeader": "秘技",
            "type": "attack",
            "target": "all",
            "description": "[強化]秘技を使用した後、20秒間継続する「陥陣」状態に入る。「陥陣」状態の間は一定範囲内の敵を引き寄せられるほか、自身の移動速度+50%。戦闘に入った後、「飛黄」を1層獲得する。「陥陣」状態の時に敵を攻撃すると、引き寄せたすべての敵と戦闘に入る。戦闘開始後、各ウェーブ開始時に敵全体に飛霄の攻撃力200%分の風属性ダメージを与える。なお、このダメージは必ず会心が発生する。引き寄せた敵の数が1体以上の場合、超過分1体につき、このダメージの倍率+100%。このダメージ倍率の上限は1000%。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "通天戦闘開始時に「飛黄」を3層獲得する。ターンが回ってきた時、飛霄が1つ前の自身のターンから天賦による追加攻撃を発動していなかった場合、「飛黄」を獲得するのに必要な攻撃回数が1加算される。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "解形必殺技を発動して敵にダメージを与える時、追加攻撃を行うと見なされる。追加攻撃の会心ダメージ+36%。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "神速戦闘スキルを発動する時、攻撃力+48%、3ターン継続。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "極地鎮定",
            "description": "「閃裂刃舞」または「斧貫衝天」を発動した後、飛霄の与える必殺技ダメージがさらに本来のダメージの10%分アップする。最大5層累積でき、必殺技の行動終了まで継続する。"
        },
        "2": {
            "name": "月桂礼賛",
            "description": "天賦効果が強化される。味方の行った攻撃が追加攻撃だった場合、飛霄は直接「飛黄」を1層獲得する。この効果はターンが回ってくるたびに6回まで発動できる。"
        },
        "3": {
            "name": "移ろいゆく景星",
            "description": "必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "胆大心小",
            "description": "天賦による追加攻撃の削靭値+100%。天賦による追加攻撃を行う時、自身の速度+8%。2ターン継続。"
        },
        "5": {
            "name": "星天踏破",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "狐死首丘",
            "description": "飛霄が与える必殺技ダメージの全属性耐性貫通+20%。天賦による追加攻撃ダメージが同時に必殺技ダメージと見なされ、ダメージ倍率+140%。"
        }
    },
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "talent_dmg",
            "source": "talent",
            "name": "雷狩",
            "description": "[単体攻撃]「飛黄」が6層に達すると必殺技が発動可能になる。「飛黄」は最大で12層累積できる。味方が2回攻撃を行うたびに、飛霄は「飛黄」を1層獲得する。なお、飛霄の必殺技での攻撃は回数にカウントされない。飛霄以外の味方が敵に攻撃を行った後、味方のメインターゲットとなった敵に飛霄が追加攻撃を行い、飛霄の攻撃力X%分の風属性ダメージを与える。攻撃可能なメインターゲットがいない場合、ランダムな敵単体を攻撃する。この効果はターンが回ってくるたびに1回まで発動でき、飛霄のターンが回ってくるたびに発動可能回数がリセットされる。この攻撃を行う時、自身の与ダメージ+Y%、2ターン継続。",
            "fromLevel": "talent",
            "stat": "DMG_ALL",
            "statField": "dmgBuff",
            "duration": 2
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e4_spd_percent",
            "source": "eidolon",
            "name": "胆大心小",
            "description": "天賦による追加攻撃の削靭値+100%。天賦による追加攻撃を行う時、自身の速度+8%。2ターン継続。",
            "stat": "SPD_PERCENT",
            "value": 0.08,
            "minEidolon": 4,
            "duration": 2
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e6_ult_res_pen",
            "source": "eidolon",
            "name": "狐死首丘",
            "description": "飛霄が与える必殺技ダメージの全属性耐性貫通+20%。天賦による追加攻撃ダメージが同時に必殺技ダメージと見なされ、ダメージ倍率+140%。",
            "stat": "RES_PEN",
            "value": 0.2,
            "minEidolon": 6
        },
        {
            "id": "extra4_followup_crit_dmg",
            "source": "extra",
            "name": "昇格4",
            "description": "必殺技を発動して敵にダメージを与える時、追加攻撃を行うと見なされる。追加攻撃の会心ダメージ+36%。",
            "defaultActive": false,
            "target": "single",
            "stat": "CRIT_DMG_FOLLOWUP",
            "value": 0.36
        },
        {
            "id": "extra6_skill_atk",
            "source": "extra",
            "name": "昇格6",
            "description": "戦闘スキルを発動する時、攻撃力+48%、3ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 3,
            "stat": "ATK_PERCENT",
            "value": 0.48
        }
    ],
    "partyEffects": [],
    "enemyEffects": []
});
