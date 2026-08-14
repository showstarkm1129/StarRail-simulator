import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Sparxie",
    "id": "sparxie",
    "name": "火花",
    "element": "Fire",
    "elementLabel": "炎",
    "path": "Elation",
    "rarity": 5,
    "base": {
        "hp": 1047,
        "atk": 640,
        "def": 460,
        "spd": 107
    },
    "maxEnergy": 160,
    "traceBonuses": [
        {
            "label": "愉悦度",
            "value": 0.28
        },
        {
            "label": "会心率",
            "value": 0.12
        },
        {
            "label": "会心ダメージ",
            "value": 0.133
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E7%81%AB%E8%8A%B1",
        "version": "4.0"
    },
    "skills": {
        "basic": {
            "name": "不発だった？",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に火花の攻撃力X%分の炎属性ダメージを与える。",
            "levelColumns": [
                "ダメージ倍率(X％)",
                "ダメージ倍率(Y％)"
            ],
            "levels": [
                {
                    "atk": 0.5,
                    "atk2": 0.25
                },
                {
                    "atk": 0.6,
                    "atk2": 0.3
                },
                {
                    "atk": 0.7,
                    "atk2": 0.35
                },
                {
                    "atk": 0.8,
                    "atk2": 0.4
                },
                {
                    "atk": 0.9,
                    "atk2": 0.45
                },
                {
                    "atk": 1,
                    "atk2": 0.5
                },
                {
                    "atk": 1.1,
                    "atk2": 0.55
                }
            ]
        },
        "skill": {
            "name": "キャー！火花配信中",
            "sourceHeader": "戦闘スキル",
            "type": "buff",
            "target": "single",
            "description": "[強化]コラボ配信を開始し、通常攻撃が「百花繚乱、ひとり勝ち！」となり、「インタラクティブ・トラップ」を1回発動する。今回のスキル発動中、「インタラクティブ・トラップ」を重複して発動できる。最大20回発動可能。このスキルの発動は戦闘スキルを発動したと見なされない。",
            "levelColumns": [
                "ダメージ倍率(X%)",
                "ダメージ倍率(Y%)"
            ],
            "levels": [
                {
                    "atk": 0.1,
                    "atk2": 0.05
                },
                {
                    "atk": 0.11,
                    "atk2": 0.055
                },
                {
                    "atk": 0.12,
                    "atk2": 0.06
                },
                {
                    "atk": 0.13,
                    "atk2": 0.065
                },
                {
                    "atk": 0.14,
                    "atk2": 0.07
                },
                {
                    "atk": 0.15,
                    "atk2": 0.075
                },
                {
                    "atk": 0.162,
                    "atk2": 0.081
                },
                {
                    "atk": 0.175,
                    "atk2": 0.088
                },
                {
                    "atk": 0.188,
                    "atk2": 0.094
                },
                {
                    "atk": 0.2,
                    "atk2": 0.1
                },
                {
                    "atk": 0.21,
                    "atk2": 0.105
                },
                {
                    "atk": 0.22,
                    "atk2": 0.11
                }
            ],
            "inferredNotes": [
                "Lv.11 atk は前後Lvから線形補完",
                "Lv.11 atk2 は前後Lvから線形補完"
            ]
        },
        "ult": {
            "name": "火花で盛り上がろう！カメラは止めないで",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]爆笑ネタを2個獲得する。敵全体に火花の攻撃力（0.6×愉悦度+X%）分の炎属性ダメージを与える。",
            "levelColumns": [
                "説明(ステータス)",
                "消費EP"
            ],
            "levels": [
                {
                    "atk": 0.3,
                    "energyCost": 160
                },
                {
                    "atk": 0.32
                },
                {
                    "atk": 0.34
                },
                {
                    "atk": 0.36
                },
                {
                    "atk": 0.38
                },
                {
                    "atk": 0.4
                },
                {
                    "atk": 0.425
                },
                {
                    "atk": 0.45
                },
                {
                    "atk": 0.475
                },
                {
                    "atk": 0.5
                },
                {
                    "atk": 0.52
                },
                {
                    "atk": 0.54
                }
            ],
            "inferredNotes": [
                "Lv.11 atk は前後Lvから線形補完"
            ]
        },
        "愉悦スキル": {
            "name": "電波最強：アンコール！",
            "sourceHeader": "愉悦スキル",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]敵全体にX%分の炎属性の愉悦ダメージを与え、さらに20ヒットする。1ヒットごとにランダムな敵単体に、Y%分の炎属性の愉悦ダメージを与える。火花はSPの代わりとして消費できる「衝撃ネタ」を2個獲得する。「衝撃ネタ」の消費はSP消費と見なされる。",
            "levelColumns": [
                "ダメージ倍率(X%)",
                "ダメージ倍率(Y%)"
            ],
            "levels": [
                {
                    "atk": 0.25,
                    "atk2": 0.125
                },
                {
                    "atk": 0.275,
                    "atk2": 0.138
                },
                {
                    "atk": 0.3,
                    "atk2": 0.15
                },
                {
                    "atk": 0.325,
                    "atk2": 0.162
                },
                {
                    "atk": 0.35,
                    "atk2": 0.175
                },
                {
                    "atk": 0.375,
                    "atk2": 0.188
                },
                {
                    "atk": 0.406,
                    "atk2": 0.203
                },
                {
                    "atk": 0.438,
                    "atk2": 0.219
                },
                {
                    "atk": 0.469,
                    "atk2": 0.234
                },
                {
                    "atk": 0.5,
                    "atk2": 0.25
                },
                {
                    "atk": 0.525,
                    "atk2": 0.2625
                },
                {
                    "atk": 0.55,
                    "atk2": 0.275
                }
            ],
            "inferredNotes": [
                "Lv.11 atk は前後Lvから線形補完",
                "Lv.11 atk2 は前後Lvから線形補完"
            ]
        },
        "talent": {
            "name": "裏でタネを仕掛ける花",
            "sourceHeader": "天賦",
            "type": "attack",
            "target": "all",
            "description": "[強化]火花が「爆笑の褒美」を持つ時、以下の効果が発動する。強化通常攻撃を発動すると、指定した敵単体にX%分の炎属性の愉悦ダメージを与え、隣接する敵にY%分の炎属性の愉悦ダメージを与える。「インタラクティブ・トラップ」の発動回数1回につき、強化通常攻撃で攻撃を行った時、攻撃を受けたランダムな敵1体に追加でY%分の炎属性の愉悦ダメージを1回与える。必殺技を発動すると、敵全体にZ%分の炎属性の愉悦ダメージを与える。",
            "levelColumns": [
                "ダメージ倍率(X%)",
                "ダメージ倍率(Y%)",
                "ダメージ倍率(Z%)"
            ],
            "levels": [
                {
                    "atk": 0.2,
                    "atk2": 0.1,
                    "atk3": 0.24
                },
                {
                    "atk": 0.22,
                    "atk2": 0.11,
                    "atk3": 0.26
                },
                {
                    "atk": 0.24,
                    "atk2": 0.12,
                    "atk3": 0.28
                },
                {
                    "atk": 0.26,
                    "atk2": 0.13,
                    "atk3": 0.31
                },
                {
                    "atk": 0.28,
                    "atk2": 0.14,
                    "atk3": 0.33
                },
                {
                    "atk": 0.3,
                    "atk2": 0.15,
                    "atk3": 0.36
                },
                {
                    "atk": 0.32,
                    "atk2": 0.162,
                    "atk3": 0.39
                },
                {
                    "atk": 0.35,
                    "atk2": 0.175,
                    "atk3": 0.42
                },
                {
                    "atk": 0.37,
                    "atk2": 0.188,
                    "atk3": 0.45
                },
                {
                    "atk": 0.4,
                    "atk2": 0.2,
                    "atk3": 0.48
                },
                {
                    "atk": 0.42,
                    "atk2": 0.21,
                    "atk3": 0.5
                },
                {
                    "atk": 0.44,
                    "atk2": 0.22,
                    "atk3": 0.52
                }
            ],
            "inferredNotes": [
                "Lv.11 atk は前後Lvから線形補完",
                "Lv.11 atk2 は前後Lvから線形補完",
                "Lv.11 atk3 は前後Lvから線形補完"
            ]
        },
        "technique": {
            "name": "収益化",
            "sourceHeader": "秘技",
            "type": "debuff",
            "target": "all",
            "description": "[妨害]秘技を使用した後、一定範囲内の敵を10秒間の「ブロック」状態にする。「ブロック」状態の敵は味方を発見できない。「ブロック」状態の敵を先制攻撃して戦闘に入った時、敵全体に火花の攻撃力50%分の炎属性ダメージを与え、SPを2回復する。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "スイート！爆笑ネタのサイン会火花の攻撃力が2,000を超えた場合、超過した攻撃力100につき、自身の愉悦度+5.0%、最大で+80.0%。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "キラキラ！人格の万華鏡パーティに「愉悦」の運命を歩むキャラが1/2/3名またはそれ以上いる場合、火花が必殺技を発動すると、追加で爆笑ネタを2/4/8個と「衝撃ネタ」を1/1/4個獲得する。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "エキサイト！真偽のパレット所持している爆笑ネタ1個につき、味方全体の会心ダメージ+8%、最大で+80%。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "#急上昇ワード：彼女は誰？",
            "description": "アッハタイム終了時、爆笑ネタを5個獲得する。所持している爆笑ネタ1個につき、味方全体の全属性耐性貫通+1.5%、最大で15%。"
        },
        "2": {
            "name": "#みんなの目は誤魔化せない",
            "description": "アッハタイム終了時、火花が追加ターンを1獲得し、「衝撃ネタ」を2個獲得する。「衝撃ネタ」を1個消費するたびに、自身の会心ダメージ+10%、2ターン継続。この効果は最大で4層まで累積できる。"
        },
        "3": {
            "name": "#クリック：ときめくハイパーリンク",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。愉悦スキルのLv.+1、最大Lv.15まで。"
        },
        "4": {
            "name": "#みんな釘付け！最高レベルの表情管理",
            "description": "必殺技を発動すると追加で爆笑ネタを5個獲得し、自身の愉悦度+36%、3ターン継続。"
        },
        "5": {
            "name": "#壊れた世界は、火花が直してあげる",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。愉悦スキルのLv.+1、最大Lv.15まで。"
        },
        "6": {
            "name": "#じゃーん！絶版が近い火花だよ",
            "description": "全属性耐性貫通+20%。カウントされる爆笑ネタ1個につき、愉悦スキルの追加ヒット数+1。なお、愉悦スキルの追加ヒット数は最大で40まで増加できる。"
        }
    },
    "partyEffects": [
        {
            "id": "extra6_crit_dmg",
            "source": "extra",
            "name": "昇格6",
            "description": "エキサイト！真偽のパレット所持している爆笑ネタ1個につき、味方全体の会心ダメージ+8%、最大で+80%。",
            "defaultActive": false,
            "target": "all",
            "duration": "conditional",
            "stat": "CRIT_DMG",
            "value": 0.08
        },
        {
            "id": "e1_res_pen",
            "source": "eidolon",
            "name": "#急上昇ワード：彼女は誰？",
            "description": "アッハタイム終了時、爆笑ネタを5個獲得する。所持している爆笑ネタ1個につき、味方全体の全属性耐性貫通+1.5%、最大で15%。",
            "defaultActive": false,
            "target": "all",
            "duration": "conditional",
            "minEidolon": 1,
            "stat": "RES_PEN",
            "value": 0.015
        }
    ],
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "e2_crit_dmg",
            "source": "eidolon",
            "name": "#みんなの目は誤魔化せない",
            "description": "アッハタイム終了時、火花が追加ターンを1獲得し、「衝撃ネタ」を2個獲得する。「衝撃ネタ」を1個消費するたびに、自身の会心ダメージ+10%、2ターン継続。この効果は最大で4層まで累積できる。",
            "stat": "CRIT_DMG",
            "value": 0.1,
            "minEidolon": 2,
            "stackable": {
                "max": 4,
                "default": 4
            },
            "duration": 2
        },
        {
            "id": "e6_res_pen",
            "source": "eidolon",
            "name": "#じゃーん！絶版が近い火花だよ",
            "description": "全属性耐性貫通+20%。",
            "defaultActive": false,
            "target": "single",
            "minEidolon": 6,
            "stat": "RES_PEN",
            "value": 0.2
        }
    ],
    "enemyEffects": []
});
