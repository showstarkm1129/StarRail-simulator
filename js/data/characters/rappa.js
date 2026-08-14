import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Rappa",
    "id": "rappa",
    "name": "乱破",
    "element": "Imaginary",
    "elementLabel": "虚数",
    "path": "Erudition",
    "rarity": 5,
    "base": {
        "hp": 1087,
        "atk": 718,
        "def": 461,
        "spd": 96
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
            "label": "撃破特効",
            "value": 0.133
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E4%B9%B1%E7%A0%B4",
        "version": "2.6"
    },
    "skills": {
        "basic": {
            "name": "忍法・七転八起",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に乱破の攻撃力X%分の虚数属性ダメージを与える。",
            "levelColumns": [
                "ダメージ倍率(X％)",
                "ダメージ倍率(Y％)",
                "ダメージ倍率(Z％)",
                "ダメージ倍率(W％)"
            ],
            "levels": [
                {
                    "atk": 0.5,
                    "atk2": 0.6,
                    "atk3": 0.3,
                    "atk4": 0.6
                },
                {
                    "atk": 0.6,
                    "atk2": 0.68,
                    "atk3": 0.34,
                    "atk4": 0.68
                },
                {
                    "atk": 0.7,
                    "atk2": 0.76,
                    "atk3": 0.38,
                    "atk4": 0.76
                },
                {
                    "atk": 0.8,
                    "atk2": 0.84,
                    "atk3": 0.42,
                    "atk4": 0.84
                },
                {
                    "atk": 0.9,
                    "atk2": 0.92,
                    "atk3": 0.46,
                    "atk4": 0.92
                },
                {
                    "atk": 1,
                    "atk2": 1,
                    "atk3": 0.5,
                    "atk4": 1
                },
                {
                    "atk": 1.1,
                    "atk2": 1.08,
                    "atk3": 0.54,
                    "atk4": 1.08
                }
            ]
        },
        "skill": {
            "name": "忍切・初志貫徹",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]敵全体に乱破の攻撃力X%分の虚数属性ダメージを与える。",
            "levelColumns": [
                "ダメージ倍率(X%)"
            ],
            "levels": [
                {
                    "atk": 0.6
                },
                {
                    "atk": 0.66
                },
                {
                    "atk": 0.72
                },
                {
                    "atk": 0.78
                },
                {
                    "atk": 0.84
                },
                {
                    "atk": 0.9
                },
                {
                    "atk": 0.97
                },
                {
                    "atk": 1.05
                },
                {
                    "atk": 1.12
                },
                {
                    "atk": 1.2
                },
                {
                    "atk": 1.26
                },
                {
                    "atk": 1.32
                }
            ],
            "inferredNotes": [
                "Lv.11 atk は前後Lvから線形補完"
            ]
        },
        "ult": {
            "name": "忍道・極・愛死天流",
            "sourceHeader": "必殺技",
            "type": "buff",
            "target": "single",
            "description": "[強化]「結印」状態に入り、即座に追加ターンを1ターン、「彩墨」を3層獲得する。同時に弱点撃破効率+50%、撃破特効+X%。「結印」状態の時、通常攻撃が強化されるが、戦闘スキルおよび必殺技は発動できない。強化通常攻撃を行うと「彩墨」が1消費され、0になると「結印」状態が終了する。",
            "levelColumns": [
                "撃破特効アップ(X%)",
                "消費EP"
            ],
            "levels": [
                {
                    "value1": 0.1,
                    "energyCost": 140
                },
                {
                    "value1": 0.12
                },
                {
                    "value1": 0.14
                },
                {
                    "value1": 0.16
                },
                {
                    "value1": 0.18
                },
                {
                    "value1": 0.2
                },
                {
                    "value1": 0.22
                },
                {
                    "value1": 0.25
                },
                {
                    "value1": 0.27
                },
                {
                    "value1": 0.3
                },
                {
                    "value1": 0.32
                },
                {
                    "value1": 0.34
                }
            ],
            "inferredNotes": [
                "Lv.11 value1 は前後Lvから線形補完"
            ]
        },
        "talent": {
            "name": "シノビ・サイエンス・堪忍袋",
            "sourceHeader": "天賦",
            "type": "buff",
            "target": "all",
            "description": "[強化]敵が弱点撃破される時、乱破はチャージを1獲得する。最大で10まで獲得可能。乱破が次の「忍具・降魔の花弁」による3段目の攻撃を行う時、すべてのチャージを消費し、敵全体に乱破の虚数属性弱点撃破ダメージX%分の弱点撃破ダメージを与え、弱点属性を無視して靭性を2削る。この3段目の攻撃は消費したチャージ1につき、弱点撃破ダメージの倍率+Y%、削靭値+1。敵を弱点撃破する時、虚数属性の弱点撃破効果が発動する。",
            "levelColumns": [
                "弱点撃破ダメージ(X%)",
                "弱点撃破ダメージアップ(Y%)"
            ],
            "levels": [
                {
                    "atk": 0.3,
                    "atk2": 0.25
                },
                {
                    "atk": 0.33,
                    "atk2": 0.27
                },
                {
                    "atk": 0.36,
                    "atk2": 0.3
                },
                {
                    "atk": 0.39,
                    "atk2": 0.32
                },
                {
                    "atk": 0.42,
                    "atk2": 0.35
                },
                {
                    "atk": 0.45,
                    "atk2": 0.37
                },
                {
                    "atk": 0.48,
                    "atk2": 0.4
                },
                {
                    "atk": 0.52,
                    "atk2": 0.43
                },
                {
                    "atk": 0.56,
                    "atk2": 0.46
                },
                {
                    "atk": 0.6,
                    "atk2": 0.5
                },
                {
                    "atk": 0.63,
                    "atk2": 0.525
                },
                {
                    "atk": 0.66,
                    "atk2": 0.55
                }
            ],
            "inferredNotes": [
                "Lv.11 atk は前後Lvから線形補完",
                "Lv.11 atk2 は前後Lvから線形補完"
            ]
        },
        "technique": {
            "name": "シノビ・歩血義理",
            "sourceHeader": "秘技",
            "type": "heal",
            "target": "single",
            "description": "[強化]秘技を使用した後、20秒間継続する「スプラッシュ」状態に入る。「スプラッシュ」状態の間、前方に素早く一定距離移動し、触れた敵を攻撃する。移動中は敵からの攻撃をすべて防ぐことができるが、この状態で攻撃を行うと「スプラッシュ」状態は終了する。敵を先制攻撃して戦闘に入った後、弱点属性を無視して敵それぞれの靭性を30削り、乱破の虚数属性弱点撃破ダメージ200%分の弱点撃破ダメージを与え、隣接する敵に乱破の虚数属性弱点撃破ダメージ180%分の弱点撃破ダメージを与え、自身のEPを10回復する。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "忍法帖・魔天精鋭エネミー以上の敵が弱点撃破される時、乱破はさらにチャージを1獲得し、EPを10回復する。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "忍法帖・海鳴「結印」状態の間、乱破が強化通常攻撃を発動し、弱点撃破状態の敵にダメージを与えた後、その回の攻撃の削靭値を60%分の超撃破ダメージに転換する。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "忍法帖・枯葉敵が弱点撃破される時に受ける弱点撃破ダメージ+2%。その際、乱破の攻撃力が2,400を超えている場合、超過した攻撃力100につき、敵が受ける弱点撃破ダメージが+1%、最大で+8%まで。この効果は2ターン継続する。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "常世ノ道、三途ニ六文銭無シ",
            "description": "必殺技を発動し「結印」状態となっている間、乱破が与えるダメージは敵の防御力を15%無視する。また、「結印」状態が終了した後、EPを20回復する。"
        },
        "2": {
            "name": "俳句ノ暗記、有識ニ罣礙無シ",
            "description": "指定した敵単体に対する、強化通常攻撃の1、2段目の削靭値+50%。"
        },
        "3": {
            "name": "伽藍ノ堂、無間獄ニ正法無シ",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "4": {
            "name": "経年劣化、任侠ニ忍義無シ",
            "description": "「結印」状態の間、味方全体の速度+12%。"
        },
        "5": {
            "name": "一心不乱、鳴弦ニ徒矢無シ",
            "description": "必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "6": {
            "name": "破邪顕正、悪徒ニ慈悲無シ",
            "description": "天賦の効果で獲得できるチャージを戦闘開始時に5獲得し、さらに上限を、+5する。また、「忍具・降魔の花弁」の3段目の攻撃を行った後、チャージ+5。"
        }
    },
    "partyEffects": [
        {
            "id": "e4_spd_percent",
            "source": "eidolon",
            "name": "経年劣化、任侠ニ忍義無シ",
            "description": "「結印」状態の間、味方全体の速度+12%。",
            "defaultActive": false,
            "target": "all",
            "duration": "conditional",
            "minEidolon": 4,
            "stat": "SPD_PERCENT",
            "value": 0.12
        }
    ],
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "ult_break_effect",
            "source": "ult",
            "name": "忍道・極・愛死天流",
            "description": "[強化]「結印」状態に入り、即座に追加ターンを1ターン、「彩墨」を3層獲得する。同時に弱点撃破効率+50%、撃破特効+X%。「結印」状態の時、通常攻撃が強化されるが、戦闘スキルおよび必殺技は発動できない。強化通常攻撃を行うと「彩墨」が1消費され、0になると「結印」状態が終了する。",
            "fromLevel": "ult",
            "stat": "BREAK_EFFECT",
            "statField": "value1"
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e1_def_ignore",
            "source": "eidolon",
            "name": "常世ノ道、三途ニ六文銭無シ",
            "description": "必殺技を発動し「結印」状態となっている間、乱破が与えるダメージは敵の防御力を15%無視する。また、「結印」状態が終了した後、EPを20回復する。",
            "stat": "DEF_IGNORE",
            "value": 0.15,
            "minEidolon": 1
        }
    ]
});
