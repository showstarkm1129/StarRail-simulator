import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Boothill",
    "id": "boothill",
    "name": "ブートヒル",
    "element": "Physical",
    "elementLabel": "物理",
    "path": "The Hunt",
    "rarity": 5,
    "base": {
        "hp": 1203,
        "atk": 620,
        "def": 436,
        "spd": 107
    },
    "maxEnergy": 115,
    "traceBonuses": [
        {
            "label": "撃破特効",
            "value": 0.373
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
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%83%96%E3%83%BC%E3%83%88%E3%83%92%E3%83%AB",
        "version": "2.2"
    },
    "skills": {
        "basic": {
            "name": "スパーズ・クラッシュ",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にブートヒルの攻撃力X%の物理ダメージを与える。",
            "levelColumns": [
                "スパーズ・クラッシュ",
                "ファニング"
            ],
            "levels": [
                {
                    "atk": 0.5,
                    "atkAlt2": 1.1
                },
                {
                    "atk": 0.6,
                    "atkAlt2": 1.32
                },
                {
                    "atk": 0.7,
                    "atkAlt2": 1.54
                },
                {
                    "atk": 0.8,
                    "atkAlt2": 1.76
                },
                {
                    "atk": 0.9,
                    "atkAlt2": 1.98
                },
                {
                    "atk": 1,
                    "atkAlt2": 2.2
                },
                {
                    "atk": 1.1,
                    "atkAlt2": 2.42
                }
            ]
        },
        "skill": {
            "name": "熱砂のタンゴ",
            "sourceHeader": "戦闘スキル",
            "type": "debuff",
            "target": "single",
            "description": "[妨害]指定した敵単体と自身を「九死の決闘」状態にする。この状態のブートヒルは戦闘スキルを発動できず、通常攻撃が「ファニング」に強化される、2ターン継続。ブートヒルのターンが回ってくるたびに、「九死の決闘」の継続時間-1ターン。「九死の決闘」状態にある敵は、挑発状態と見なされる。その敵がブートヒルの攻撃を受ける時、被ダメージ+X%。また、ブートヒルがその敵の攻撃を受ける時、被ダメージ+15%。その敵が倒される、または弱点撃破された後、ブートヒルは「ポケットアドバンテージ」を1層獲得し、「九死の決闘」状態を解除する。この戦闘スキルはEPを回復できない。また、この戦闘スキルを発動した後、ターンは終了しない。",
            "levelColumns": [
                "敵の被ダメージアップ(X%)"
            ],
            "levels": [
                {
                    "dmgTaken": 0.15
                },
                {
                    "dmgTaken": 0.16
                },
                {
                    "dmgTaken": 0.18
                },
                {
                    "dmgTaken": 0.19
                },
                {
                    "dmgTaken": 0.21
                },
                {
                    "dmgTaken": 0.22
                },
                {
                    "dmgTaken": 0.24
                },
                {
                    "dmgTaken": 0.26
                },
                {
                    "dmgTaken": 0.28
                },
                {
                    "dmgTaken": 0.3
                },
                {
                    "dmgTaken": 0.31
                },
                {
                    "dmgTaken": 0.33
                }
            ]
        },
        "ult": {
            "name": "ダストデビル・ダンサー",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に物理弱点を付与する、2ターン継続。その敵にブートヒルの攻撃力X%分の物理ダメージを与え、行動順をY%遅延させる。",
            "levelColumns": [
                "ダメージ倍率(X%)",
                "行動順遅延(Y%)",
                "消費EP"
            ],
            "levels": [
                {
                    "atk": 2.4,
                    "value2": 0.3,
                    "energyCost": 115
                },
                {
                    "atk": 2.56,
                    "value2": 0.31
                },
                {
                    "atk": 2.72,
                    "value2": 0.32
                },
                {
                    "atk": 2.88,
                    "value2": 0.33
                },
                {
                    "atk": 3.04,
                    "value2": 0.34
                },
                {
                    "atk": 3.2,
                    "value2": 0.35
                },
                {
                    "atk": 3.4,
                    "value2": 0.36
                },
                {
                    "atk": 3.6,
                    "value2": 0.37
                },
                {
                    "atk": 3.8,
                    "value2": 0.38
                },
                {
                    "atk": 4,
                    "value2": 0.4
                },
                {
                    "atk": 4.16,
                    "value2": 0.41
                },
                {
                    "atk": 4.32,
                    "value2": 0.42
                }
            ]
        },
        "talent": {
            "name": "5発の銃弾",
            "sourceHeader": "天賦",
            "type": "attack",
            "target": "single",
            "description": "[強化]「ポケットアドバンテージ」1層につき、「ファニング」の削靭値+50%、最大で3累積できる。強化通常攻撃の間、敵が弱点撃破状態の場合、「ポケットアドバンテージ」の層数に応じて、その敵にブートヒルの物理弱点撃破ダメージX%/Y%/Z%分の弱点撃破ダメージを与える。この弱点撃破ダメージにカウントされる靭性は、通常攻撃「スパーズ・クラッシュ」の基礎削靭値の16倍を超えない。戦闘に勝利した後、ブートヒルは「ポケットアドバンテージ」を次の戦闘に持ち越せる。",
            "levelColumns": [
                "1層(X%)",
                "2層(Y%)",
                "3層(Z%)"
            ],
            "levels": [
                {
                    "atk": 0.35,
                    "atkAlt2": 0.6,
                    "atkAlt3": 0.85
                },
                {
                    "atk": 0.38,
                    "atkAlt2": 0.66,
                    "atkAlt3": 0.93
                },
                {
                    "atk": 0.42,
                    "atkAlt2": 0.72,
                    "atkAlt3": 1.02
                },
                {
                    "atk": 0.45,
                    "atkAlt2": 0.78,
                    "atkAlt3": 1.1
                },
                {
                    "atk": 0.49,
                    "atkAlt2": 0.84,
                    "atkAlt3": 1.19
                },
                {
                    "atk": 0.52,
                    "atkAlt2": 0.9,
                    "atkAlt3": 1.27
                },
                {
                    "atk": 0.56,
                    "atkAlt2": 0.97,
                    "atkAlt3": 1.38
                },
                {
                    "atk": 0.61,
                    "atkAlt2": 1.05,
                    "atkAlt3": 1.48
                },
                {
                    "atk": 0.65,
                    "atkAlt2": 1.12,
                    "atkAlt3": 1.59
                },
                {
                    "atk": 0.7,
                    "atkAlt2": 1.2,
                    "atkAlt3": 1.7
                },
                {
                    "atk": 0.73,
                    "atkAlt2": 1.26,
                    "atkAlt3": 1.78
                },
                {
                    "atk": 0.77,
                    "atkAlt2": 1.32,
                    "atkAlt3": 1.87
                }
            ]
        },
        "technique": {
            "name": "ビッグ・スマイル",
            "sourceHeader": "秘技",
            "type": "buff",
            "target": "single",
            "description": "[強化]秘技を使用した後、次の戦闘で初めて戦闘スキルを発動する時、敵に必殺技が与えるものと同じ物理弱点を付与する、2ターン継続。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "ゴーストロード自身の会心率を、撃破特効の10%分アップする。最大で会心率+30%。自身の会心ダメージを、撃破特効の50%分アップする。最大で会心ダメージ+150%。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "死地からの脱出ブートヒルが「九死の決闘」状態の場合、「九死の決闘」状態でない敵の攻撃を受ける時、被ダメージ-30%。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "ポイントブランク「九死の決闘」の状態で「ポケットアドバンテージ」を獲得する時、EPを10回復する。この効果は獲得する「ポケットアドバンテージ」が上限を超える時にも発動する。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "砂塵の中の一等星",
            "description": "戦闘開始時、「ポケットアドバンテージ」を1層獲得する。ブートヒルがダメージを与える時、敵の防御力を16%無視する。"
        },
        "2": {
            "name": "マイルストーン・マンガー",
            "description": "「九死の決闘」状態で「ポケットアドバンテージ」を獲得する時、SPを1回復する。同時に撃破特効+30%、2ターン継続。この効果はターンが回ってくるたびに1回まで発動でき、獲得する「ポケットアドバンテージ」が上限を超える時にも触発される。"
        },
        "3": {
            "name": "墓守",
            "description": "必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "冷めた肉の料理人",
            "description": "「九死の決闘」状態の敵がブートヒルの攻撃を受ける時、被ダメージアップ効果さらに+12%。ブートヒルが「九死の決闘」状態の敵の攻撃を受ける時、被ダメージアップ効果-12%。"
        },
        "5": {
            "name": "切り株の演説家",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "鉄格子ホテルの常連",
            "description": "天賦を触発して弱点撃破ダメージを与える時、ターゲットに対してさらに本来のダメージ倍率40%分の弱点撃破ダメージを与え、隣接する敵に本来のダメージ倍率70%分の弱点撃破ダメージを与える。"
        }
    },
    "partyEffects": [
        {
            "id": "skill_dmg_taken_mirror",
            "source": "skill",
            "name": "熱砂のタンゴ (火力計算用)",
            "description": "[妨害]指定した敵単体と自身を「九死の決闘」状態にする。この状態のブートヒルは戦闘スキルを発動できず、通常攻撃が「ファニング」に強化される、2ターン継続。ブートヒルのターンが回ってくるたびに、「九死の決闘」の継続時間-1ターン。「九死の決闘」状態にある敵は、挑発状態と見なされる。その敵がブートヒルの攻撃を受ける時、被ダメージ+X%。また、ブートヒルがその敵の攻撃を受ける時、被ダメージ+15%。その敵が倒される、または弱点撃破された後、ブートヒルは「ポケットアドバンテージ」を1層獲得し、「九死の決闘」状態を解除する。この戦闘スキルはEPを回復できない。また、この戦闘スキルを発動した後、ターンは終了しない。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "fromLevel": "skill",
            "stat": "DMG_TAKEN",
            "statField": "dmgTaken"
        },
        {
            "id": "e4_duel_taken_extra_mirror",
            "source": "eidolon",
            "name": "冷めた肉の料理人 (火力計算用)",
            "description": "「九死の決闘」状態の敵がブートヒルの攻撃を受ける時、被ダメージアップ効果さらに+12%。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 4,
            "stat": "DMG_TAKEN",
            "value": 0.12
        }
    ],
    "enemyEffects": [
        {
            "id": "skill_dmg_taken",
            "source": "skill",
            "name": "熱砂のタンゴ",
            "description": "[妨害]指定した敵単体と自身を「九死の決闘」状態にする。この状態のブートヒルは戦闘スキルを発動できず、通常攻撃が「ファニング」に強化される、2ターン継続。ブートヒルのターンが回ってくるたびに、「九死の決闘」の継続時間-1ターン。「九死の決闘」状態にある敵は、挑発状態と見なされる。その敵がブートヒルの攻撃を受ける時、被ダメージ+X%。また、ブートヒルがその敵の攻撃を受ける時、被ダメージ+15%。その敵が倒される、または弱点撃破された後、ブートヒルは「ポケットアドバンテージ」を1層獲得し、「九死の決闘」状態を解除する。この戦闘スキルはEPを回復できない。また、この戦闘スキルを発動した後、ターンは終了しない。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "fromLevel": "skill",
            "stat": "DMG_TAKEN",
            "statField": "dmgTaken"
        },
        {
            "id": "e4_duel_taken_extra",
            "source": "eidolon",
            "name": "冷めた肉の料理人",
            "description": "「九死の決闘」状態の敵がブートヒルの攻撃を受ける時、被ダメージアップ効果さらに+12%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 4,
            "stat": "DMG_TAKEN",
            "value": 0.12
        }
    ],
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "extra2_break_to_crit_rate",
            "source": "extra",
            "name": "昇格2",
            "description": "ゴーストロード自身の会心率を、撃破特効の10%分アップする。最大で会心率+30%。自身の会心ダメージを、撃破特効の50%分アップする。最大で会心ダメージ+150%。",
            "stat": "CRIT_RATE",
            "compute": "casterRawRatioCap",
            "sourceStat": "breakEffect",
            "ratio": 0.1,
            "cap": 0.3
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "extra2_break_to_crit_dmg",
            "source": "extra",
            "name": "昇格2",
            "description": "ゴーストロード自身の会心率を、撃破特効の10%分アップする。最大で会心率+30%。自身の会心ダメージを、撃破特効の50%分アップする。最大で会心ダメージ+150%。",
            "stat": "CRIT_DMG",
            "compute": "casterRawRatioCap",
            "sourceStat": "breakEffect",
            "ratio": 0.5,
            "cap": 1.5
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e1_def_ignore",
            "source": "eidolon",
            "name": "砂塵の中の一等星",
            "description": "戦闘開始時、「ポケットアドバンテージ」を1層獲得する。ブートヒルがダメージを与える時、敵の防御力を16%無視する。",
            "stat": "DEF_IGNORE",
            "value": 0.16,
            "minEidolon": 1
        },
        {
            "id": "e2_break_effect",
            "source": "eidolon",
            "name": "マイルストーン・マンガー",
            "description": "「ポケットアドバンテージ」を獲得する時、撃破特効+30%、2ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "minEidolon": 2,
            "stat": "BREAK_EFFECT",
            "value": 0.3
        }
    ]
});
