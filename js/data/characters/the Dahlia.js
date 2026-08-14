import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "The Dahlia",
    "id": "the_dahlia",
    "name": "ダリア",
    "element": "Fire",
    "elementLabel": "炎",
    "path": "Nihility",
    "rarity": 5,
    "base": {
        "hp": 1086,
        "atk": 679,
        "def": 606,
        "spd": 96
    },
    "maxEnergy": 130,
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
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%83%80%E3%83%AA%E3%82%A2",
        "version": "3.8"
    },
    "skills": {
        "basic": {
            "name": "翻弄…綻びを引き裂く記憶",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にダリアの攻撃力X%分の炎属性ダメージを与える。",
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
            "name": "舐る…炎の舌を伸ばす背叛",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "blast",
            "description": "[拡散攻撃]結界を展開する。3ターン継続。ダリアのターンが回ってくるたびに継続時間-1ターン。指定した敵単体および隣接するに、ダリアの攻撃力X%分の炎属性ダメージを与える。結界が展開されている間、味方全体の弱点撃破効率+50%。さらに、敵が弱点撃破状態でない場合でも、実際に削った靭性値に応じて超撃破ダメージを与えられる。",
            "levelColumns": [
                "ダメージ倍率(X%)"
            ],
            "levels": [
                {
                    "atk": 0.8
                },
                {
                    "atk": 0.88
                },
                {
                    "atk": 0.96
                },
                {
                    "atk": 1.04
                },
                {
                    "atk": 1.12
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
                    "atk": 1.6
                },
                {
                    "atk": 1.68
                },
                {
                    "atk": 1.76
                }
            ],
            "inferredNotes": [
                "Lv.11 atk は前後Lvから線形補完"
            ]
        },
        "ult": {
            "name": "耽溺…墓場に舞い込む灰燼",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]敵全体を「凋落」状態にする。4ターン継続。その後、ダリアの攻撃力X%分の炎属性ダメージを与える。このダメージは敵全体で均等に分担される。「凋落」状態の敵の防御力-Y%、すべての「共に舞う者」の属性を弱点として付与する。",
            "levelColumns": [
                "ダメージ倍率(X%)",
                "防御力ダウン(Y%)",
                "消費EP"
            ],
            "levels": [
                {
                    "defPct": 1.8,
                    "defDown": 0.08,
                    "energyCost": 130
                },
                {
                    "defPct": 1.92,
                    "defDown": 0.09
                },
                {
                    "defPct": 2.04,
                    "defDown": 0.1
                },
                {
                    "defPct": 2.16,
                    "defDown": 0.11
                },
                {
                    "defPct": 2.28,
                    "defDown": 0.12
                },
                {
                    "defPct": 2.4,
                    "defDown": 0.13
                },
                {
                    "defPct": 2.55,
                    "defDown": 0.142
                },
                {
                    "defPct": 2.7,
                    "defDown": 0.155
                },
                {
                    "defPct": 2.85,
                    "defDown": 0.168
                },
                {
                    "defPct": 3,
                    "defDown": 0.18
                },
                {
                    "defPct": 3.12,
                    "defDown": 0.19
                },
                {
                    "defPct": 3.24,
                    "defDown": 0.2
                }
            ],
            "inferredNotes": [
                "Lv.11 defPct は前後Lvから線形補完",
                "Lv.11 defDown は前後Lvから線形補完"
            ]
        },
        "talent": {
            "name": "コンスタンスを恐れる者は？",
            "sourceHeader": "天賦",
            "type": "follow_up",
            "target": "bounce",
            "description": "[バウンド]戦闘に入る時、ダリアはEPを35回復し、自身と戦闘を開始した自身以外の味方を「共に舞う者」にする。フィールド上にダリア以外の「共に舞う者」がいない場合、自身と最も撃破特効が高い自身以外の味方を「共に舞う者」にする。「共に舞う者」が弱点撃破状態の敵を攻撃した後、その回のダメージの削靭値をX%分の超撃破ダメージに転換する。ダリア以外の「共に舞う者」が敵を攻撃した場合、ダリアは5ヒットする追加攻撃を行う。1ヒットごとにランダムな敵単体にダリアの攻撃力Y%分の炎属性ダメージを与える。なお、この追加攻撃が弱点撃破状態の敵にダメージを与えた場合、その回のダメージの削靭値をZ%分の超撃破ダメージに転換する。この効果はターンが回ってくるたびに1回まで発動できる。追加攻撃を発動する前に敵が倒れた場合、ランダムな敵単体に発動する。",
            "levelColumns": [
                "超撃破ダメージ(X%)",
                "ダメージ倍率(Y%)",
                "超撃破ダメージ(Z%)"
            ],
            "levels": [
                {
                    "atk": 0.3,
                    "atk2": 0.15,
                    "atk3": 1
                },
                {
                    "atk": 0.33,
                    "atk2": 0.16,
                    "atk3": 1.1
                },
                {
                    "atk": 0.36,
                    "atk2": 0.18,
                    "atk3": 1.2
                },
                {
                    "atk": 0.39,
                    "atk2": 0.19,
                    "atk3": 1.3
                },
                {
                    "atk": 0.42,
                    "atk2": 0.21,
                    "atk3": 1.4
                },
                {
                    "atk": 0.45,
                    "atk2": 0.22,
                    "atk3": 1.5
                },
                {
                    "atk": 0.48,
                    "atk2": 0.24,
                    "atk3": 1.62
                },
                {
                    "atk": 0.52,
                    "atk2": 0.26,
                    "atk3": 1.75
                },
                {
                    "atk": 0.56,
                    "atk2": 0.28,
                    "atk3": 1.87
                },
                {
                    "atk": 0.6,
                    "atk2": 0.3,
                    "atk3": 2
                },
                {
                    "atk": 0.63,
                    "atk2": 0.315,
                    "atk3": 2.1
                },
                {
                    "atk": 0.66,
                    "atk2": 0.33,
                    "atk3": 2.2
                }
            ],
            "inferredNotes": [
                "Lv.11 atk は前後Lvから線形補完",
                "Lv.11 atk2 は前後Lvから線形補完",
                "Lv.11 atk3 は前後Lvから線形補完"
            ]
        },
        "technique": {
            "name": "心こそ至高の墓場",
            "sourceHeader": "秘技",
            "type": "debuff",
            "target": "single",
            "description": "[妨害]秘技を使用した後、20秒間継続する特殊領域を作り出す。特殊領域内にいる敵は味方を攻撃しない。特殊領域内にいる敵と戦闘に入った後、ダリアは即座に戦闘スキルの結界を展開し、戦闘開始時に与えた削靭値を60%分の超撃破ダメージに転換して、弱点撃破状態の敵に与える。味方が作り出した領域は1つまで存在できる。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "葬礼またひとつ戦闘に入る時、自分以外の味方の撃破特効をダリアの撃破特効24%分+50%アップさせる。1ターン継続。ダリアが自身以外の味方による治癒効果またはバリアを得た時、この効果をもう1度発動する。3ターン継続。1ターンに1回まで発動できる。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "故人に哀悼を天賦による追加攻撃が発動する時、味方のSPを1回復する。この効果は天賦による追加攻撃が2回発動するたびに、1回発動する。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "古きを捨て、新しきに恋する味方が敵に弱点を付与した時、速度+30%、2ターン継続。味方の炎属性キャラが攻撃中に弱点を付与した場合、攻撃後に追加で、弱点を付与したターゲットの靭性値を20削る。なお、この削靭は炎属性となる。同時に、最大EP10%分のEPを回復する。この効果で回復できるEPは、最大EPの50%までとなる。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "咲く時を待つ蕾",
            "description": "天賦による「共に舞う者」の超撃破ダメージ倍率が味方全体に適用され、「共に舞う者」の倍率がさらに40%アップする。「共に舞う者」が攻撃を行った後、追加で攻撃を受けた敵の最大靭性値25%分の靭性を削る（最小は10、最大は300）。この効果は敵1体につき1回しか発動できず、敵がHPが0になる攻撃を受けた後、その敵への発動可能回数がリセットされる。"
        },
        "2": {
            "name": "新生、鮮麗、愛憐",
            "description": "ダリアがフィールド上にいる場合、敵全体の全属性耐性-20%。敵が戦闘に入る時、即座に「凋落」状態となり、3ターン継続する。"
        },
        "3": {
            "name": "蝉の羽の如く儚い花弁",
            "description": "必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "虫に蝕まれた花蕊",
            "description": "天賦による追加攻撃のバウンド回数+5。命中するたびにターゲットが受けるダメージ+12%、2ターン継続。"
        },
        "5": {
            "name": "凋落、腐敗、憎悪",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "されど危うく美しい",
            "description": "「共に舞う者」の撃破特効+150%。天賦による追加攻撃が発動する時、すべての「共に舞う者」の次の行動順を20%早める。"
        }
    },
    "partyEffects": [
        {
            "id": "ult_def_down_mirror",
            "source": "ult",
            "name": "耽溺…墓場に舞い込む灰燼 (火力計算用)",
            "description": "[全体攻撃]敵全体を「凋落」状態にする。4ターン継続。その後、ダリアの攻撃力X%分の炎属性ダメージを与える。このダメージは敵全体で均等に分担される。「凋落」状態の敵の防御力-Y%、すべての「共に舞う者」の属性を弱点として付与する。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "all",
            "duration": 4,
            "fromLevel": "ult",
            "stat": "DEF_DOWN",
            "statField": "defDown"
        },
        {
            "id": "e2_res_down_mirror",
            "source": "eidolon",
            "name": "新生、鮮麗、愛憐 (火力計算用)",
            "description": "ダリアがフィールド上にいる場合、敵全体の全属性耐性-20%。敵が戦闘に入る時、即座に「凋落」状態となり、3ターン継続する。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "all",
            "duration": 3,
            "minEidolon": 2,
            "stat": "RES_PEN",
            "value": 0.2
        },
        {
            "id": "extra6_party_spd",
            "source": "extra",
            "name": "昇格6",
            "description": "味方が敵に弱点を付与した時、速度+30、2ターン継続。",
            "defaultActive": false,
            "target": "all",
            "duration": 2,
            "stat": "SPD_FLAT",
            "value": 30
        },
        {
            "id": "e4_followup_hit_taken_mirror",
            "source": "eidolon",
            "name": "虫に蝕まれた花蕊 (火力計算用)",
            "description": "天賦による追加攻撃が命中するたびにターゲットが受けるダメージ+12%、2ターン継続。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "minEidolon": 4,
            "stat": "DMG_TAKEN",
            "value": 0.12,
            "stackable": {
                "max": 5,
                "default": 1
            }
        }
    ],
    "enemyEffects": [
        {
            "id": "ult_def_down",
            "source": "ult",
            "name": "耽溺…墓場に舞い込む灰燼",
            "description": "[全体攻撃]敵全体を「凋落」状態にする。4ターン継続。その後、ダリアの攻撃力X%分の炎属性ダメージを与える。このダメージは敵全体で均等に分担される。「凋落」状態の敵の防御力-Y%、すべての「共に舞う者」の属性を弱点として付与する。",
            "defaultActive": false,
            "target": "all",
            "duration": 4,
            "fromLevel": "ult",
            "stat": "DEF_DOWN",
            "statField": "defDown"
        },
        {
            "id": "e2_res_down",
            "source": "eidolon",
            "name": "新生、鮮麗、愛憐",
            "description": "ダリアがフィールド上にいる場合、敵全体の全属性耐性-20%。敵が戦闘に入る時、即座に「凋落」状態となり、3ターン継続する。",
            "defaultActive": false,
            "target": "all",
            "duration": 3,
            "minEidolon": 2,
            "stat": "RES_PEN",
            "value": 0.2
        },
        {
            "id": "e4_followup_hit_taken",
            "source": "eidolon",
            "name": "虫に蝕まれた花蕊",
            "description": "天賦による追加攻撃が命中するたびにターゲットが受けるダメージ+12%、2ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "minEidolon": 4,
            "stat": "DMG_TAKEN",
            "value": 0.12,
            "stackable": {
                "max": 5,
                "default": 1
            }
        }
    ],
    "selfEffects": []
});
