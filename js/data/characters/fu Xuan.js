import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Fu Xuan",
    "id": "fu_xuan",
    "name": "符玄",
    "element": "Quantum",
    "elementLabel": "量子",
    "path": "Preservation",
    "rarity": 5,
    "base": {
        "hp": 1474,
        "atk": 465,
        "def": 606,
        "spd": 100
    },
    "maxEnergy": 135,
    "traceBonuses": [
        {
            "label": "会心率",
            "value": 0.187
        },
        {
            "label": "最大HP",
            "value": 0.18
        },
        {
            "label": "効果抵抗",
            "value": 0.1
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E7%AC%A6%E7%8E%84",
        "version": "1.3"
    },
    "skills": {
        "basic": {
            "name": "始撃歳星",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に符玄の最大HPX%分の量子属性ダメージを与える。",
            "levelColumns": [
                "ダメージ倍率(X％)"
            ],
            "levels": [
                {
                    "hpPct": 0.25
                },
                {
                    "hpPct": 0.3
                },
                {
                    "hpPct": 0.35
                },
                {
                    "hpPct": 0.4
                },
                {
                    "hpPct": 0.45
                },
                {
                    "hpPct": 0.5
                },
                {
                    "hpPct": 0.55
                }
            ]
        },
        "skill": {
            "name": "太微の行棋、影示す霊台",
            "sourceHeader": "戦闘スキル",
            "type": "shield",
            "target": "all_ally",
            "description": "[防御]「窮観の陣」を起動し、符玄以外の味方が受ける、バリアに防がれる前のダメージの65％を符玄が分担する、3ターン継続。「窮観の陣」の中にいる味方全体は「鑑知」を得る。「鑑知」状態の味方の最大HPが、符玄の最大HPのX％分アップし、会心率+Y%。符玄が戦闘不能状態になった時、「窮観の陣」は解除される。",
            "levelColumns": [
                "最大HPアップ(X%)",
                "会心率アップ(Y％)"
            ],
            "levels": [
                {
                    "hpPct": 0.03,
                    "critRateBuff": 0.06
                },
                {
                    "hpPct": 0.033,
                    "critRateBuff": 0.066
                },
                {
                    "hpPct": 0.036,
                    "critRateBuff": 0.072
                },
                {
                    "hpPct": 0.039,
                    "critRateBuff": 0.078
                },
                {
                    "hpPct": 0.042,
                    "critRateBuff": 0.084
                },
                {
                    "hpPct": 0.045,
                    "critRateBuff": 0.09
                },
                {
                    "hpPct": 0.048,
                    "critRateBuff": 0.097
                },
                {
                    "hpPct": 0.052,
                    "critRateBuff": 0.105
                },
                {
                    "hpPct": 0.056,
                    "critRateBuff": 0.112
                },
                {
                    "hpPct": 0.06,
                    "critRateBuff": 0.12
                },
                {
                    "hpPct": 0.063,
                    "critRateBuff": 0.126
                },
                {
                    "hpPct": 0.066,
                    "critRateBuff": 0.132
                }
            ]
        },
        "ult": {
            "name": "天律大衍、歴劫帰一",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]敵全体に符玄の最大HPのX%分の量子属性ダメージを与え、天賦によるHP回復の発動回数+1。",
            "levelColumns": [
                "ダメージ倍率(X%)",
                "消費EP"
            ],
            "levels": [
                {
                    "hpPct": 0.6,
                    "energyCost": 135
                },
                {
                    "hpPct": 0.64
                },
                {
                    "hpPct": 0.68
                },
                {
                    "hpPct": 0.72
                },
                {
                    "hpPct": 0.76
                },
                {
                    "hpPct": 0.8
                },
                {
                    "hpPct": 0.85
                },
                {
                    "hpPct": 0.9
                },
                {
                    "hpPct": 0.95
                },
                {
                    "hpPct": 1
                },
                {
                    "hpPct": 1.04
                },
                {
                    "hpPct": 1.08
                }
            ]
        },
        "talent": {
            "name": "乾坤清夷、一陽来復",
            "sourceHeader": "天賦",
            "type": "heal",
            "target": "all_ally",
            "description": "[回復]符玄が戦闘可能状態の時、味方全体に「避邪」を付与する。「避邪」状態の味方の被ダメージ-X%。符玄の残りHP割合が50%以下になった時、自身の失ったHPY%分のHPを回復する。HPが0になる攻撃を受けた時、この効果は発動できない。この効果の初期の発動可能回数は1回、最大で2回まで累積できる。",
            "levelColumns": [
                "被ダメージダウン(X%)",
                "HP回復(失ったHPY%)"
            ],
            "levels": [
                {
                    "dmgTaken": 0.1,
                    "healPct": 0.8
                },
                {
                    "dmgTaken": 0.108,
                    "healPct": 0.81
                },
                {
                    "dmgTaken": 0.116,
                    "healPct": 0.82
                },
                {
                    "dmgTaken": 0.124,
                    "healPct": 0.83
                },
                {
                    "dmgTaken": 0.132,
                    "healPct": 0.84
                },
                {
                    "dmgTaken": 0.14,
                    "healPct": 0.85
                },
                {
                    "dmgTaken": 0.15,
                    "healPct": 0.86
                },
                {
                    "dmgTaken": 0.16,
                    "healPct": 0.87
                },
                {
                    "dmgTaken": 0.17,
                    "healPct": 0.88
                },
                {
                    "dmgTaken": 0.18,
                    "healPct": 0.9
                },
                {
                    "dmgTaken": 0.188,
                    "healPct": 0.91
                },
                {
                    "dmgTaken": 0.196,
                    "healPct": 0.92
                }
            ]
        },
        "technique": {
            "name": "否泰記す四郭固",
            "sourceHeader": "秘技",
            "type": "shield",
            "target": "all_ally",
            "description": "[防御]秘技を使用した後、味方全体は20秒間継続するバリアを獲得する。このバリアは敵のすべての攻撃を防ぎ、敵の攻撃を受けても戦闘に入らない。バリア継続期間中、戦闘に入る時、符玄は自動で「窮観の陣」を起動する、2ターン継続。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "太乙神数「窮観の陣」が起動している時、符玄が戦闘スキルを発動すると、さらにEPを20回復する。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "奇門遁甲必殺技を発動した時、符玄以外の味方のHPを、符玄の最大HPの5%分+133回復する。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "六壬神課「窮観の陣」が起動している時、敵が味方に行動制限系デバフを付与する場合、味方全体がその行動中に付与されるすべての行動制限系デバフを抵抗する。この効果は1回まで発動できる。再度「窮観の陣」を起動すると、発動可能回数がリセットされる。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "司危",
            "description": "「鑑知」状態の味方の会心ダメージ+30%。"
        },
        "2": {
            "name": "柔兆",
            "description": "「窮観の陣」が起動している時、味方がHPが0になるダメージを受けても、今回の行動でHPが0になるダメージを受けたすべての味方は戦闘不能にならず、自身の最大HP70%分のHPを回復する。この効果は一度の戦闘で1回まで発動できる。"
        },
        "3": {
            "name": "直符",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "4": {
            "name": "格澤",
            "description": "「窮観の陣」の中にいる符玄以外の味方が攻撃を受けた後、符玄はEPを5回復する。"
        },
        "5": {
            "name": "計神",
            "description": "必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "6": {
            "name": "種陵",
            "description": "「窮観の陣」が起動している時、味方全体が戦闘中失った累計HPをカウントする。符玄の必殺技の与ダメージが、戦闘中失った累計HP200%分アップする。戦闘中失った累計HPのカウントは、符玄の最大HPの120%を超えず、必殺技を発動した後にリセットされる。"
        }
    },
    "partyEffects": [
        {
            "id": "skill_hp_percent",
            "source": "skill",
            "name": "太微の行棋、影示す霊台",
            "description": "[防御]「窮観の陣」を起動し、符玄以外の味方が受ける、バリアに防がれる前のダメージの65％を符玄が分担する、3ターン継続。「窮観の陣」の中にいる味方全体は「鑑知」を得る。「鑑知」状態の味方の最大HPが、符玄の最大HPのX％分アップし、会心率+Y%。符玄が戦闘不能状態になった時、「窮観の陣」は解除される。",
            "defaultActive": false,
            "target": "all",
            "duration": 3,
            "fromLevel": "skill",
            "stat": "HP_PERCENT",
            "statField": "hpPct"
        },
        {
            "id": "skill_crit_rate",
            "source": "skill",
            "name": "太微の行棋、影示す霊台",
            "description": "[防御]「窮観の陣」を起動し、符玄以外の味方が受ける、バリアに防がれる前のダメージの65％を符玄が分担する、3ターン継続。「窮観の陣」の中にいる味方全体は「鑑知」を得る。「鑑知」状態の味方の最大HPが、符玄の最大HPのX％分アップし、会心率+Y%。符玄が戦闘不能状態になった時、「窮観の陣」は解除される。",
            "defaultActive": false,
            "target": "all",
            "duration": 3,
            "fromLevel": "skill",
            "stat": "CRIT_RATE",
            "statField": "critRateBuff"
        },
        {
            "id": "e1_crit_dmg",
            "source": "eidolon",
            "name": "司危",
            "description": "「鑑知」状態の味方の会心ダメージ+30%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 1,
            "stat": "CRIT_DMG",
            "value": 0.3
        }
    ]
});
