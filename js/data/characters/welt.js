import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Welt",
    "id": "welt",
    "name": "ヴェルト",
    "element": "Imaginary",
    "elementLabel": "虚数",
    "path": "Nihility",
    "rarity": 5,
    "base": {
        "hp": 1125,
        "atk": 620,
        "def": 509,
        "spd": 102
    },
    "maxEnergy": 120,
    "traceBonuses": [
        {
            "label": "攻撃力",
            "value": 0.28
        },
        {
            "label": "虚数ダメージ",
            "value": 0.144
        },
        {
            "label": "効果抵抗",
            "value": 0.1
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%83%B4%E3%82%A7%E3%83%AB%E3%83%88",
        "version": "1.0"
    },
    "skills": {
        "basic": {
            "name": "重力制圧",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にヴェルトの攻撃力X%分の虚数属性ダメージを与える。",
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
            "name": "虚空断界",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "bounce",
            "description": "[バウンド]指定した敵単体にヴェルトの攻撃力X%分の虚数属性ダメージを与え、さらに4ヒットする。1ヒットごとに、ランダムな敵単体にヴェルトの攻撃力Y%分の虚数属性ダメージを与える。攻撃が命中すると、Z%の基礎確率で攻撃を受けた敵の速度-10%、2ターン継続。",
            "levelColumns": [
                "単体ダメージ倍率(X％)",
                "ランダムダメージ倍率(Y％)",
                "基礎確率(Z%)"
            ],
            "levels": [
                {
                    "atk": 0.36,
                    "atk2": 0.36,
                    "atkAlt3": 0.65
                },
                {
                    "atk": 0.39,
                    "atk2": 0.39,
                    "atkAlt3": 0.66
                },
                {
                    "atk": 0.43,
                    "atk2": 0.43,
                    "atkAlt3": 0.67
                },
                {
                    "atk": 0.47,
                    "atk2": 0.47,
                    "atkAlt3": 0.68
                },
                {
                    "atk": 0.5,
                    "atk2": 0.5,
                    "atkAlt3": 0.69
                },
                {
                    "atk": 0.54,
                    "atk2": 0.54,
                    "atkAlt3": 0.7
                },
                {
                    "atk": 0.59,
                    "atk2": 0.59,
                    "atkAlt3": 0.71
                },
                {
                    "atk": 0.63,
                    "atk2": 0.63,
                    "atkAlt3": 0.73
                },
                {
                    "atk": 0.68,
                    "atk2": 0.68,
                    "atkAlt3": 0.74
                },
                {
                    "atk": 0.72,
                    "atk2": 0.72,
                    "atkAlt3": 0.75
                },
                {
                    "atk": 0.76,
                    "atk2": 0.76,
                    "atkAlt3": 0.76
                },
                {
                    "atk": 0.79,
                    "atk2": 0.79,
                    "atkAlt3": 0.77
                }
            ]
        },
        "ult": {
            "name": "疑似ブラックホール",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]敵全体にヴェルトの攻撃力X%分の虚数属性ダメージを与え、100%の基礎確率で攻撃を受けた敵を禁錮状態にする、1ターン継続。禁錮状態の敵の行動順はY%遅延され、速度-10%。必殺技を発動した後、敵全体に「無重力」状態を付与する。「無重力」状態の敵は攻撃を受ける時に行動順が4.0%遅延する。この効果は各ターゲットごとに1ターンで最大8回発動可能。「無重力」状態は2ターン継続する。",
            "levelColumns": [
                "全体ダメージ倍率(X%)",
                "行動遅延(Y%)",
                "消費EP"
            ],
            "levels": [
                {
                    "atk": 0.9,
                    "value2": 0.06,
                    "energyCost": 120
                },
                {
                    "atk": 0.96,
                    "value2": 0.066
                },
                {
                    "atk": 1.02,
                    "value2": 0.072
                },
                {
                    "atk": 1.08,
                    "value2": 0.078
                },
                {
                    "atk": 1.14,
                    "value2": 0.084
                },
                {
                    "atk": 1.2,
                    "value2": 0.09
                },
                {
                    "atk": 1.27,
                    "value2": 0.097
                },
                {
                    "atk": 1.35,
                    "value2": 0.105
                },
                {
                    "atk": 1.43,
                    "value2": 0.113
                },
                {
                    "atk": 1.5,
                    "value2": 0.12
                },
                {
                    "atk": 1.56,
                    "value2": 0.126
                },
                {
                    "atk": 1.62,
                    "value2": 0.132
                }
            ]
        },
        "talent": {
            "name": "時空の歪み",
            "sourceHeader": "天賦",
            "type": "buff",
            "target": "single",
            "description": "[強化]「無重力」状態の敵の防御力-40%、速度-5%攻撃が減速状態の敵に命中した時、さらにヴェルトの攻撃力X%分の虚数属性付加ダメージを1回与える。",
            "levelColumns": [
                "付加ダメージ倍率(X%)"
            ],
            "levels": [
                {
                    "defPct": 0.5
                },
                {
                    "defPct": 0.55
                },
                {
                    "defPct": 0.6
                },
                {
                    "defPct": 0.65
                },
                {
                    "defPct": 0.7
                },
                {
                    "defPct": 0.75
                },
                {
                    "defPct": 0.81
                },
                {
                    "defPct": 0.88
                },
                {
                    "defPct": 0.94
                },
                {
                    "defPct": 1
                },
                {
                    "defPct": 1.05
                },
                {
                    "defPct": 1.1
                }
            ]
        },
        "technique": {
            "name": "画地為牢",
            "sourceHeader": "秘技",
            "type": "debuff",
            "target": "single",
            "description": "[妨害]秘技を使用した後、15秒間継続する特殊領域を作り出す、特殊領域内にいる敵の移動速度-50%。特殊領域内にいる敵と戦闘に入った後、100%の基礎確率で敵を禁錮状態にする、1ターン継続。禁錮状態の敵は行動順が20%遅延され、速度-10%。味方が作り出した領域は1つまで存在できる。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "懲戒味方が「無重力」状態のターゲットを攻撃する時、与ダメージ+10%。この効果は最大10層まで累積できる。2ターン継続する。戦闘開始時にヴェルトはEPを30回復する。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "審判通常攻撃または戦闘スキルを発動する時、追加でターゲットに付加ダメージを1回与える。通常攻撃による付加ダメージは通常攻撃のダメージ倍率の80%、戦闘スキルによる付加ダメージは戦闘スキルのダメージ倍率の120%となる。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "裁決ヴェルトの効果命中が40%を越えた時、超過した効果命中10%につき、攻撃力+20%、最大+80%。必殺技を発動する時、さらにEPを5回復する。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "名の継承",
            "description": "戦闘スキルまたは必殺技が「無重力」状態のターゲットに命中した後、必殺技のダメージ倍率40%分の虚数属性の付加ダメージを追加で1回与えるこの効果は各ターゲットが1回の攻撃を受けるたび、最大1回まで発動できる。"
        },
        "2": {
            "name": "星の凝集",
            "description": "天賦発動時、ヴェルトはEPを3回復する。"
        },
        "3": {
            "name": "平和の願い",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "義の旗標",
            "description": "「無重力」状態の敵の全属性耐性-30%。"
        },
        "5": {
            "name": "善の力",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "光ある未来",
            "description": "戦闘スキルまたは必殺技が「無重力」状態の敵に命中する時、与えるダメージの会心率+30%、会心ダメージ+60%。"
        }
    },
    "partyEffects": [
        {
            "id": "e4_res_down_mirror",
            "source": "eidolon",
            "name": "義の旗標 (火力計算用)",
            "description": "「無重力」状態の敵の全属性耐性-30%。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 4,
            "stat": "RES_PEN",
            "value": 0.3
        },
        {
            "id": "extra2_dmg",
            "source": "extra",
            "name": "昇格2",
            "description": "懲戒味方が「無重力」状態のターゲットを攻撃する時、与ダメージ+10%。この効果は最大10層まで累積できる。2ターン継続する。戦闘開始時にヴェルトはEPを30回復する。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "stat": "DMG_ALL",
            "value": 0.1,
            "stackable": {
                "max": 10,
                "default": 10
            }
        },
        {
            "id": "talent_gravity_def_down_mirror",
            "source": "talent",
            "name": "時空の歪み (火力計算用)",
            "description": "「無重力」状態の敵の防御力-40%。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "stat": "DEF_DOWN",
            "value": 0.4
        }
    ],
    "enemyEffects": [
        {
            "id": "e4_res_down",
            "source": "eidolon",
            "name": "義の旗標",
            "description": "「無重力」状態の敵の全属性耐性-30%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 4,
            "stat": "RES_PEN",
            "value": 0.3
        },
        {
            "id": "talent_gravity_def_down",
            "source": "talent",
            "name": "時空の歪み",
            "description": "「無重力」状態の敵の防御力-40%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "stat": "DEF_DOWN",
            "value": 0.4
        }
    ],
    "selfEffects": [
        {
            "id": "extra6_ehr_to_atk",
            "source": "extra",
            "name": "昇格6",
            "description": "ヴェルトの効果命中が40%を越えた時、超過した効果命中10%につき、攻撃力+20%、最大+80%。",
            "defaultActive": false,
            "target": "single",
            "stat": "ATK_PERCENT",
            "compute": "casterDerivedExcessStepCap",
            "sourceStat": "ehr",
            "threshold": 0.4,
            "step": 0.1,
            "valuePerStep": 0.2,
            "cap": 0.8
        },
        {
            "id": "e6_gravity_skill_ult_crit",
            "source": "eidolon",
            "name": "光ある未来",
            "description": "戦闘スキルまたは必殺技が「無重力」状態の敵に命中する時、与えるダメージの会心率+30%、会心ダメージ+60%。",
            "defaultActive": false,
            "target": "single",
            "minEidolon": 6,
            "stats": {
                "CRIT_RATE_SKILL": 0.3,
                "CRIT_RATE_ULT": 0.3,
                "CRIT_DMG_SKILL": 0.6,
                "CRIT_DMG_ULT": 0.6
            }
        }
    ]
});
