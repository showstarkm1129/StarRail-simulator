import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Hysilens",
    "id": "hysilens",
    "name": "セイレンス",
    "element": "Physical",
    "elementLabel": "物理",
    "path": "Nihility",
    "rarity": 5,
    "base": {
        "hp": 1203,
        "atk": 601,
        "def": 485,
        "spd": 102
    },
    "maxEnergy": 110,
    "traceBonuses": [
        {
            "label": "速度",
            "value": 14
        },
        {
            "label": "攻撃力",
            "value": 0.18
        },
        {
            "label": "効果命中",
            "value": 0.1
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%82%BB%E3%82%A4%E3%83%AC%E3%83%B3%E3%82%B9",
        "version": "3.5"
    },
    "skills": {
        "basic": {
            "name": "短調、止水に響く",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にセイレンスの攻撃力X%分の物理属性ダメージを与える。",
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
            "name": "倍音、暗流の先の斉唱",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]100%の基礎確率で敵全体の受けるダメージ+X%、3ターン継続。同時に敵全体にセイレンスの攻撃力+Y%分の物理属性ダメージを与える。",
            "levelColumns": [
                "被ダメージアップ(X%)",
                "全体ダメージ倍率(Y%)"
            ],
            "levels": [
                {
                    "dmgTaken": 0.1,
                    "atkAll": 0.7
                },
                {
                    "dmgTaken": 0.11,
                    "atkAll": 0.77
                },
                {
                    "dmgTaken": 0.12,
                    "atkAll": 0.84
                },
                {
                    "dmgTaken": 0.13,
                    "atkAll": 0.91
                },
                {
                    "dmgTaken": 0.14,
                    "atkAll": 0.98
                },
                {
                    "dmgTaken": 0.15,
                    "atkAll": 1.05
                },
                {
                    "dmgTaken": 0.16,
                    "atkAll": 1.13
                },
                {
                    "dmgTaken": 0.17,
                    "atkAll": 1.22
                },
                {
                    "dmgTaken": 0.18,
                    "atkAll": 1.31
                },
                {
                    "dmgTaken": 0.2,
                    "atkAll": 1.4
                },
                {
                    "dmgTaken": 0.21,
                    "atkAll": 1.47
                },
                {
                    "dmgTaken": 0.22,
                    "atkAll": 1.54
                }
            ],
            "inferredNotes": [
                "Lv.11 dmgTaken は前後Lvから線形補完",
                "Lv.11 atkAll は前後Lvから線形補完"
            ]
        },
        "ult": {
            "name": "絶海の渦潮、呑魂の舞曲",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]セイレンスが結界を展開し、敵の攻撃力-15%、防御力-X%。敵全体にセイレンスの攻撃力Y%分の物理属性ダメージを与える。結界の中にいる敵が持続ダメージを受けるたびに、セイレンスはその敵に自身の攻撃力Z%分の物理属性持続ダメージを与える。このダメージは、敵のターンが回ってきた時に、または味方が攻撃を1回行った後に、最大8回発動できる。なお、この効果で発動したセイレンスの物理属性持続ダメージが、さらにこの効果を発動させることはない。結界は3ターン持続する。セイレンスのターンが回ってくるたび、結界の継続時間-1ターン。セイレンスが戦闘不能状態になった時、結界は解除される。",
            "levelColumns": [
                "防御力ダウン(X%)",
                "全体ダメージ倍率(Y%)",
                "持続ダメージ倍率(Z%)",
                "消費EP"
            ],
            "levels": [
                {
                    "defDown": 0.15,
                    "defPctAll": 1.2,
                    "dotDefPct": 0.32,
                    "energyCost": 110
                },
                {
                    "defDown": 0.16,
                    "defPctAll": 1.28,
                    "dotDefPct": 0.373
                },
                {
                    "defDown": 0.17,
                    "defPctAll": 1.36,
                    "dotDefPct": 0.426
                },
                {
                    "defDown": 0.18,
                    "defPctAll": 1.44,
                    "dotDefPct": 0.478
                },
                {
                    "defDown": 0.19,
                    "defPctAll": 1.52,
                    "dotDefPct": 0.531
                },
                {
                    "defDown": 0.2,
                    "defPctAll": 1.6,
                    "dotDefPct": 0.584
                },
                {
                    "defDown": 0.212,
                    "defPctAll": 1.7,
                    "dotDefPct": 0.632
                },
                {
                    "defDown": 0.225,
                    "defPctAll": 1.8,
                    "dotDefPct": 0.68
                },
                {
                    "defDown": 0.238,
                    "defPctAll": 1.9,
                    "dotDefPct": 0.74
                },
                {
                    "defDown": 0.25,
                    "defPctAll": 2,
                    "dotDefPct": 0.8
                },
                {
                    "defDown": 0.26,
                    "defPctAll": 2.08,
                    "dotDefPct": 0.84
                },
                {
                    "defDown": 0.27,
                    "defPctAll": 2.16,
                    "dotDefPct": 0.88
                }
            ],
            "inferredNotes": [
                "Lv.11 defDown は前後Lvから線形補完",
                "Lv.11 defPctAll は前後Lvから線形補完",
                "Lv.11 dotDefPct は前後Lvから線形補完"
            ]
        },
        "talent": {
            "name": "セイレーンの歓歌",
            "sourceHeader": "天賦",
            "type": "debuff",
            "target": "single",
            "description": "[妨害]味方が攻撃する時、セイレンスは100%の基礎確率でその味方が攻撃を受けた敵に風化/裂創/燃焼/感電状態のいずれか1種類を付与する。なお、まだ付与されていない状態を優先する。風化/裂創/燃焼/感電状態の敵は、ターンが回ってくるたびに、セイレンスの攻撃力X%分の風/炎/雷属性持続ダメージを受ける。2ターン継続。裂創状態の敵は、ターンが回ってくるたびに自身の最大HP20%分の物理属性持続ダメージを受ける。このダメージの最大値はセイレンスの攻撃力のX%を超えない。2ターン継続。",
            "levelColumns": [
                "持続ダメージ倍率とダメージ最大値(X%)"
            ],
            "levels": [
                {
                    "dotHpPct": 0.1
                },
                {
                    "dotHpPct": 0.116
                },
                {
                    "dotHpPct": 0.133
                },
                {
                    "dotHpPct": 0.15
                },
                {
                    "dotHpPct": 0.166
                },
                {
                    "dotHpPct": 0.182
                },
                {
                    "dotHpPct": 0.198
                },
                {
                    "dotHpPct": 0.212
                },
                {
                    "dotHpPct": 0.231
                },
                {
                    "dotHpPct": 0.25
                },
                {
                    "dotHpPct": 0.2625
                },
                {
                    "dotHpPct": 0.275
                }
            ],
            "inferredNotes": [
                "Lv.11 dotHpPct は前後Lvから線形補完"
            ]
        },
        "technique": {
            "name": "棲まう海にて",
            "sourceHeader": "秘技",
            "type": "debuff",
            "target": "single",
            "description": "[妨害]秘技を使用した後、前方で移動する特殊領域を20秒間作り出す。特殊領域内に入った敵は「酔心」状態を付与される。「酔心」状態の敵は味方を攻撃せず、領域継続中は領域に追随する。「酔心」状態の敵と戦闘に入った後、100%の基礎確率で、敵単体それぞれにセイレンスの天賦と同じ効果を持つ風化/裂創/燃焼/感電状態の中から、2種類の状態を付与する。味方が作り出した領域は1つまで存在できる。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "征服の剣旗戦闘開始時、セイレンスは必殺技の結界と同じ効果を持つ結界を展開する。結界は3ターン継続する。セイレンスが結界を展開するたびに、SPを1回復する。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "盛宴の泡沫セイレンスが必殺技を発動した時、敵に持続ダメージ系デバフがある場合、付与されている全持続ダメージ系デバフが、本来のダメージ150%分のダメージを発生させる。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "真珠の琴線セイレンスの効果命中が60%を超えた時、超過した効果命中10%につき、自身の与ダメージ+15%、最大で+90%。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "何故、心は悲しむか",
            "description": "セイレンスがフィールド上にいる時、味方が与える持続ダメージは本来の116%になる。セイレンスが天賦で敵に風化/裂創/燃焼/感電状態を付与する時、100%の基礎確率で、元の天賦効果と同じ、かつ同時に存在可能な風化/裂創/燃焼/感電状態を追加で1つ付与する。"
        },
        "2": {
            "name": "何故、潮はさんざめく",
            "description": "結界が展開されている間、軌跡「真珠の琴線」による与ダメージアップ効果が味方全体に適用される。"
        },
        "3": {
            "name": "何故、灯は忘らるる",
            "description": "必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "何故、時は流れるか",
            "description": "結界が展開されている間、敵全体の全属性耐性-20%。"
        },
        "5": {
            "name": "髪を梳き、口ずさむ",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "沈みし君、いずれ帰郷せん",
            "description": "結界が展開されている間、敵のターンが回ってきた時に、または味方が攻撃を1回行った後に発動する、セイレンスの物理属性持続ダメージの発動可能回数の上限が12回になる。またそのダメージ倍率+20%。"
        }
    },
    "partyEffects": [
        {
            "id": "skill_dmg_taken_mirror",
            "source": "skill",
            "name": "倍音、暗流の先の斉唱 (火力計算用)",
            "description": "[全体攻撃]100%の基礎確率で敵全体の受けるダメージ+X%、3ターン継続。同時に敵全体にセイレンスの攻撃力+Y%分の物理属性ダメージを与える。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "all",
            "duration": 3,
            "fromLevel": "skill",
            "stat": "DMG_TAKEN",
            "statField": "dmgTaken"
        },
        {
            "id": "ult_def_down_mirror",
            "source": "ult",
            "name": "絶海の渦潮、呑魂の舞曲 (火力計算用)",
            "description": "[全体攻撃]セイレンスが結界を展開し、敵の攻撃力-15%、防御力-X%。敵全体にセイレンスの攻撃力Y%分の物理属性ダメージを与える。結界の中にいる敵が持続ダメージを受けるたびに、セイレンスはその敵に自身の攻撃力Z%分の物理属性持続ダメージを与える。このダメージは、敵のターンが回ってきた時に、または味方が攻撃を1回行った後に、最大8回発動できる。なお、この効果で発動したセイレンスの物理属性持続ダメージが、さらにこの効果を発動させることはない。結界は3ターン持続する。セイレンスのターンが回ってくるたび、結界の継続時間-1ターン。セイレンスが戦闘不能状態になった時、結界は解除される。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "all",
            "fromLevel": "ult",
            "stat": "DEF_DOWN",
            "statField": "defDown"
        },
        {
            "id": "e4_res_down_mirror",
            "source": "eidolon",
            "name": "何故、時は流れるか (火力計算用)",
            "description": "結界が展開されている間、敵全体の全属性耐性-20%。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "all",
            "duration": "conditional",
            "minEidolon": 4,
            "stat": "RES_PEN",
            "value": 0.2
        },
        {
            "id": "e2_party_ehr_to_dmg",
            "source": "eidolon",
            "name": "何故、潮はさんざめく",
            "description": "結界が展開されている間、軌跡「真珠の琴線」による与ダメージアップ効果が味方全体に適用される。セイレンスの効果命中超過分に応じるため、付与者の効果命中から計算。",
            "defaultActive": false,
            "target": "all",
            "duration": "conditional",
            "minEidolon": 2,
            "stat": "DMG_ALL",
            "compute": "casterDerivedExcessStepCap",
            "sourceStat": "ehr",
            "threshold": 0.6,
            "step": 0.1,
            "valuePerStep": 0.15,
            "cap": 0.9
        }
    ],
    "enemyEffects": [
        {
            "id": "skill_dmg_taken",
            "source": "skill",
            "name": "倍音、暗流の先の斉唱",
            "description": "[全体攻撃]100%の基礎確率で敵全体の受けるダメージ+X%、3ターン継続。同時に敵全体にセイレンスの攻撃力+Y%分の物理属性ダメージを与える。",
            "defaultActive": false,
            "target": "all",
            "duration": 3,
            "fromLevel": "skill",
            "stat": "DMG_TAKEN",
            "statField": "dmgTaken"
        },
        {
            "id": "ult_def_down",
            "source": "ult",
            "name": "絶海の渦潮、呑魂の舞曲",
            "description": "[全体攻撃]セイレンスが結界を展開し、敵の攻撃力-15%、防御力-X%。敵全体にセイレンスの攻撃力Y%分の物理属性ダメージを与える。結界の中にいる敵が持続ダメージを受けるたびに、セイレンスはその敵に自身の攻撃力Z%分の物理属性持続ダメージを与える。このダメージは、敵のターンが回ってきた時に、または味方が攻撃を1回行った後に、最大8回発動できる。なお、この効果で発動したセイレンスの物理属性持続ダメージが、さらにこの効果を発動させることはない。結界は3ターン持続する。セイレンスのターンが回ってくるたび、結界の継続時間-1ターン。セイレンスが戦闘不能状態になった時、結界は解除される。",
            "defaultActive": false,
            "target": "all",
            "fromLevel": "ult",
            "stat": "DEF_DOWN",
            "statField": "defDown"
        },
        {
            "id": "e4_res_down",
            "source": "eidolon",
            "name": "何故、時は流れるか",
            "description": "結界が展開されている間、敵全体の全属性耐性-20%。",
            "defaultActive": false,
            "target": "all",
            "duration": "conditional",
            "minEidolon": 4,
            "stat": "RES_PEN",
            "value": 0.2
        }
    ],
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "extra6_ehr_to_dmg",
            "source": "extra",
            "name": "昇格6",
            "description": "真珠の琴線セイレンスの効果命中が60%を超えた時、超過した効果命中10%につき、自身の与ダメージ+15%、最大で+90%。",
            "stat": "DMG_ALL",
            "compute": "casterDerivedExcessStepCap",
            "sourceStat": "ehr",
            "threshold": 0.6,
            "step": 0.1,
            "valuePerStep": 0.15,
            "cap": 0.9
        }
    ]
});
