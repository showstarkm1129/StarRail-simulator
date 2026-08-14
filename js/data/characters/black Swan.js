import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Black Swan",
    "id": "black_swan",
    "name": "ブラックスワン",
    "element": "Wind",
    "elementLabel": "風",
    "path": "Nihility",
    "rarity": 5,
    "base": {
        "hp": 1086,
        "atk": 659,
        "def": 485,
        "spd": 102
    },
    "maxEnergy": 120,
    "traceBonuses": [
        {
            "label": "攻撃力",
            "value": 0.28
        },
        {
            "label": "風ダメージ",
            "value": 0.144
        },
        {
            "label": "効果命中",
            "value": 0.1
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%83%96%E3%83%A9%E3%83%83%E3%82%AF%E3%82%B9%E3%83%AF%E3%83%B3",
        "version": "2.0"
    },
    "skills": {
        "basic": {
            "name": "洞察、緘黙の黎明",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にブラックスワンの攻撃力X%分の風属性ダメージを与える。",
            "levelColumns": [
                "ダメージ倍率(X％)"
            ],
            "levels": [
                { "atk": 0.5 },
                { "atk": 0.6 },
                { "atk": 0.7 },
                { "atk": 0.8 },
                { "atk": 0.9 },
                { "atk": 1 },
                { "atk": 1.1 }
            ]
        },
        "skill": {
            "name": "失墜、偽神の黄昏",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "blast",
            "description": "[拡散攻撃]指定した敵単体、および隣接する敵にブラックスワンの攻撃力X%分の風属性ダメージを与え、100%の基礎確率でターゲット、および隣接する敵の防御力-Y%、3ターン継続。",
            "levelColumns": [
                "ダメージ倍率(X%)",
                "防御力ダウン(Y%)"
            ],
            "levels": [
                {
                    "defPct": 0.45,
                    "defDown": 0.148
                },
                {
                    "defPct": 0.49,
                    "defDown": 0.154
                },
                {
                    "defPct": 0.54,
                    "defDown": 0.16
                },
                {
                    "defPct": 0.58,
                    "defDown": 0.166
                },
                {
                    "defPct": 0.63,
                    "defDown": 0.172
                },
                {
                    "defPct": 0.67,
                    "defDown": 0.178
                },
                {
                    "defPct": 0.73,
                    "defDown": 0.185
                },
                {
                    "defPct": 0.78,
                    "defDown": 0.193
                },
                {
                    "defPct": 0.84,
                    "defDown": 0.2
                },
                {
                    "defPct": 0.9,
                    "defDown": 0.208
                },
                {
                    "defPct": 0.94,
                    "defDown": 0.214
                },
                {
                    "defPct": 0.99,
                    "defDown": 0.22
                }
            ]
        },
        "ult": {
            "name": "彼方の抱擁に酔いしれて",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]敵全体に「開示」状態を付与し、2ターン継続する。その後、敵全体にブラックスワンの攻撃力X%分の風属性ダメージを与える。「開示」状態の敵の受けるダメージ+Y%。「アルカナ」が1層付与されるたびに、50%の固定確率で今回付与される層数+1。また、敵のターンが回ってきて「アルカナ」がダメージを発生した後、層数が半減しない。",
            "levelColumns": [
                "ダメージ倍率(X%)",
                "被ダメージアップ(Y%)",
                "消費EP"
            ],
            "levels": [
                {
                    "atk": 0.72,
                    "dmgTaken": 0.15,
                    "energyCost": 120
                },
                {
                    "atk": 0.76,
                    "dmgTaken": 0.16
                },
                {
                    "atk": 0.81,
                    "dmgTaken": 0.17
                },
                {
                    "atk": 0.86,
                    "dmgTaken": 0.18
                },
                {
                    "atk": 0.91,
                    "dmgTaken": 0.19
                },
                {
                    "atk": 0.96,
                    "dmgTaken": 0.2
                },
                {
                    "atk": 1.02,
                    "dmgTaken": 0.21
                },
                {
                    "atk": 1.08,
                    "dmgTaken": 0.22
                },
                {
                    "atk": 1.14,
                    "dmgTaken": 0.23
                },
                {
                    "atk": 1.2,
                    "dmgTaken": 0.25
                },
                {
                    "atk": 1.24,
                    "dmgTaken": 0.26
                },
                {
                    "atk": 1.29,
                    "dmgTaken": 0.27
                }
            ]
        },
        "talent": {
            "name": "果てなき運命の機織り",
            "sourceHeader": "天賦",
            "type": "attack",
            "target": "single",
            "description": "[妨害]敵が持続ダメージを1回受けるたびに、X%の基礎確率で「アルカナ」を1層付与される。「アルカナ」状態の敵は風化、裂創、燃焼、感電状態と見なされ、ターンが回ってくるたびにブラックスワンの攻撃力Y%分の風属性持続ダメージを受ける。その後、層数が半減する。「アルカナ」1層につき、このダメージ倍率+Z%。「アルカナ」は50層累積できる。なお、上限に達した後も累積される。「アルカナ」がダメージを発生した後、上限を超えた分の層数がクリアされる。「アルカナ」によるダメージはターゲットの防御力を20％無視する。敵のターンが回ってきて「アルカナ」がダメージを発生した時にのみ、追加で隣接する敵にブラックスワンの攻撃力V%分の風属性持続ダメージを与える。",
            "levelColumns": [
                "基礎確率(X%)",
                "ダメージ倍率(Y%)",
                "ダメージ倍率アップ(Z%/1層)",
                "隣接ダメージ倍率(V%)"
            ],
            "levels": [
                {
                    "defPct": 0.5,
                    "defPct2": 0.96,
                    "defPct3": 0.048,
                    "defPctAdjacent": 0.72
                },
                {
                    "defPct": 0.51,
                    "defPct2": 1.11,
                    "defPct3": 0.055,
                    "defPctAdjacent": 0.83
                },
                {
                    "defPct": 0.53,
                    "defPct2": 1.27,
                    "defPct3": 0.063,
                    "defPctAdjacent": 0.93
                },
                {
                    "defPct": 0.54,
                    "defPct2": 1.43,
                    "defPct3": 0.071,
                    "defPctAdjacent": 1.07
                },
                {
                    "defPct": 0.56,
                    "defPct2": 1.59,
                    "defPct3": 0.079,
                    "defPctAdjacent": 1.19
                },
                {
                    "defPct": 0.57,
                    "defPct2": 1.75,
                    "defPct3": 0.087,
                    "defPctAdjacent": 1.31
                },
                {
                    "defPct": 0.59,
                    "defPct2": 1.89,
                    "defPct3": 0.094,
                    "defPctAdjacent": 1.42
                },
                {
                    "defPct": 0.61,
                    "defPct2": 2.04,
                    "defPct3": 0.102,
                    "defPctAdjacent": 1.53
                },
                {
                    "defPct": 0.63,
                    "defPct2": 2.22,
                    "defPct3": 0.111,
                    "defPctAdjacent": 1.66
                },
                {
                    "defPct": 0.65,
                    "defPct2": 2.4,
                    "defPct3": 0.12,
                    "defPctAdjacent": 1.8
                },
                {
                    "defPct": 0.66,
                    "defPct2": 2.52,
                    "defPct3": 0.126,
                    "defPctAdjacent": 1.89
                },
                {
                    "defPct": 0.68,
                    "defPct2": 2.64,
                    "defPct3": 0.132,
                    "defPctAdjacent": 1.98
                }
            ]
        },
        "technique": {
            "name": "真相を取り、表象を捨てる",
            "sourceHeader": "秘技",
            "type": "buff",
            "target": "single",
            "description": "[強化]秘技を使用した後、次の戦闘開始時、150%の基礎確率で敵それぞれに「アルカナ」を1層付与する。また、「アルカナ」の付与が成功した敵に、さらに「アルカナ」を1層付与する。その敵への「アルカナ」の付与は、失敗するまで繰り返される。付与が成功するたび、次に「アルカナ」を付与する基礎確率が前回の50%になる（敵それぞれで分けて計算される）。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "蠢く内臓敵はブラックスワンの攻撃を受けた後、65%の基礎確率で「アルカナ」を5層付与される。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "チャリスの底の顛末敵が戦闘に入った時、65%の基礎確率で「アルカナ」を1層付与され、さらに100%の基礎確率で戦闘スキルによる防御力ダウン効果を付与される、3ターン継続。ブラックスワンが通常攻撃または必殺技を発動した後、攻撃を受けた敵は100%の基礎確率で戦闘スキルによる防御力ダウン効果を付与される、3ターン継続。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "ロウソクの影が示す予兆味方全体の与ダメージが、ブラックスワンの効果命中の60%分アップする、最大で与ダメージ+72%。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "知恵の七柱",
            "description": "ブラックスワンが戦闘可能状態の時、風化、裂創、燃焼、感電状態の敵の対応する風、物理、炎、雷属性の耐性がそれぞれ25%ダウンする。"
        },
        "2": {
            "name": "子羊よ、私のために泣くなかれ",
            "description": "敵が戦闘に入った時、100%の基礎確率で「アルカナ」を30層付与される。"
        },
        "3": {
            "name": "下界は上界に倣う",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "4": {
            "name": "涙もまた贈り物",
            "description": "「開示」状態の敵の受けるダメージがさらに+20%。「開示」状態の敵のターンが回ってきた時、または倒された時、ブラックスワンのEPを8回復する。"
        },
        "5": {
            "name": "渡り鳥の道",
            "description": "必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "6": {
            "name": "神は善、苦役者は未だ知らず",
            "description": "「アルカナの累積可能層数＋30層。ブラックスワン以外の味方が敵に攻撃を行った後、ブラックスワンは65%の基礎確率でその敵に「アルカナ」を1層付与する。ブラックスワンが敵に「アルカナ」を1層付与するたびに、さらにその回の累積層数+1層。"
        }
    },
    "partyEffects": [
        {
            "id": "skill_def_down_mirror",
            "source": "skill",
            "name": "失墜、偽神の黄昏 (火力計算用)",
            "description": "[拡散攻撃]指定した敵単体、および隣接する敵にブラックスワンの攻撃力X%分の風属性ダメージを与え、100%の基礎確率でターゲット、および隣接する敵の防御力-Y%、3ターン継続。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "single",
            "duration": 3,
            "fromLevel": "skill",
            "stat": "DEF_DOWN",
            "statField": "defDown"
        },
        {
            "id": "ult_dmg_taken_mirror",
            "source": "ult",
            "name": "彼方の抱擁に酔いしれて (火力計算用)",
            "description": "[全体攻撃]敵全体に「開示」状態を付与し、2ターン継続する。その後、敵全体にブラックスワンの攻撃力X%分の風属性ダメージを与える。「開示」状態の敵の受けるダメージ+Y%。「アルカナ」が1層付与されるたびに、50%の固定確率で今回付与される層数+1。また、敵のターンが回ってきて「アルカナ」がダメージを発生した後、層数が半減しない。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "all",
            "duration": 2,
            "fromLevel": "ult",
            "stat": "DMG_TAKEN",
            "statField": "dmgTaken"
        },
        {
            "id": "extra6_ehr_to_party_dmg",
            "source": "extra",
            "name": "昇格6",
            "description": "味方全体の与ダメージが、ブラックスワンの効果命中の60%分アップする。最大+72%。",
            "defaultActive": false,
            "target": "all",
            "stat": "DMG_ALL",
            "compute": "casterRawRatioCap",
            "sourceStat": "ehr",
            "ratio": 0.6,
            "cap": 0.72
        },
        {
            "id": "e1_dot_element_res_down_mirror",
            "source": "eidolon",
            "name": "知恵の七柱 (火力計算用)",
            "description": "ブラックスワンが戦闘可能状態の時、風化、裂創、燃焼、感電状態の敵の対応する風/物理/炎/雷属性耐性-25%。該当属性の攻撃時に手動ONする近似枠。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 1,
            "stat": "RES_PEN",
            "value": 0.25
        },
        {
            "id": "e4_epiphany_taken_extra_mirror",
            "source": "eidolon",
            "name": "涙もまた贈り物 (火力計算用)",
            "description": "「開示」状態の敵の受けるダメージがさらに+20%。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 4,
            "stat": "DMG_TAKEN",
            "value": 0.2
        }
    ],
    "enemyEffects": [
        {
            "id": "skill_def_down",
            "source": "skill",
            "name": "失墜、偽神の黄昏",
            "description": "[拡散攻撃]指定した敵単体、および隣接する敵にブラックスワンの攻撃力X%分の風属性ダメージを与え、100%の基礎確率でターゲット、および隣接する敵の防御力-Y%、3ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 3,
            "fromLevel": "skill",
            "stat": "DEF_DOWN",
            "statField": "defDown"
        },
        {
            "id": "ult_dmg_taken",
            "source": "ult",
            "name": "彼方の抱擁に酔いしれて",
            "description": "[全体攻撃]敵全体に「開示」状態を付与し、2ターン継続する。その後、敵全体にブラックスワンの攻撃力X%分の風属性ダメージを与える。「開示」状態の敵の受けるダメージ+Y%。「アルカナ」が1層付与されるたびに、50%の固定確率で今回付与される層数+1。また、敵のターンが回ってきて「アルカナ」がダメージを発生した後、層数が半減しない。",
            "defaultActive": false,
            "target": "all",
            "duration": 2,
            "fromLevel": "ult",
            "stat": "DMG_TAKEN",
            "statField": "dmgTaken"
        },
        {
            "id": "e1_dot_element_res_down",
            "source": "eidolon",
            "name": "知恵の七柱",
            "description": "ブラックスワンが戦闘可能状態の時、風化、裂創、燃焼、感電状態の敵の対応する風/物理/炎/雷属性耐性-25%。該当属性の攻撃時に手動ONする近似枠。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 1,
            "stat": "RES_PEN",
            "value": 0.25
        },
        {
            "id": "e4_epiphany_taken_extra",
            "source": "eidolon",
            "name": "涙もまた贈り物",
            "description": "「開示」状態の敵の受けるダメージがさらに+20%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 4,
            "stat": "DMG_TAKEN",
            "value": 0.2
        }
    ],
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "e4_revealed_dmg_taken_bonus",
            "source": "eidolon",
            "name": "涙もまた贈り物",
            "description": "「開示」状態の敵の受けるダメージがさらに+20%。「開示」状態の敵のターンが回ってきた時、または倒された時、ブラックスワンのEPを8回復する。",
            "stat": "DMG_TAKEN",
            "value": 0.2,
            "minEidolon": 4
        }
    ]
});
