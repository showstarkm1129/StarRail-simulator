import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Mydei",
    "id": "mydei",
    "name": "モーディス",
    "element": "Imaginary",
    "elementLabel": "虚数",
    "path": "Destruction",
    "rarity": 5,
    "base": {
        "hp": 1553,
        "atk": 427,
        "def": 194,
        "spd": 95
    },
    "maxEnergy": 160,
    "traceBonuses": [
        {
            "label": "会心ダメージ",
            "value": 0.373
        },
        {
            "label": "最大HP",
            "value": 0.18
        },
        {
            "label": "速度",
            "value": 5
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%83%A2%E3%83%BC%E3%83%87%E3%82%A3%E3%82%B9",
        "version": "3.1"
    },
    "skills": {
        "basic": {
            "name": "往途踏破の誓い",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にモーディスの最大HPX%分の虚数属性ダメージを与える。",
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
            "name": "万死に悔いなし",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "blast",
            "description": "[拡散攻撃]モーディスの残りHP50%分のHPを消費し、指定した敵単体にモーディスの最大HPX%分の虚数属性ダメージを与え、隣接する敵にモーディスの最大HPY%分の虚数属性ダメージを与える。残りHPが足りない場合、戦闘スキルを発動した時、モーディスの残りHPが1になる。",
            "levelColumns": [
                "万死に悔いなし",
                "王を殺め王となる",
                "神を殺め神となる"
            ],
            "levels": [
                {
                    "hpPct": 0.45,
                    "hpPctAlt2": 0.25,
                    "hpPctAlt3": 0.55
                },
                {
                    "hpPct": 0.49,
                    "hpPctAlt2": 0.27,
                    "hpPctAlt3": 0.6
                },
                {
                    "hpPct": 0.54,
                    "hpPctAlt2": 0.3,
                    "hpPctAlt3": 0.66
                },
                {
                    "hpPct": 0.58,
                    "hpPctAlt2": 0.32,
                    "hpPctAlt3": 0.71
                },
                {
                    "hpPct": 0.63,
                    "hpPctAlt2": 0.35,
                    "hpPctAlt3": 0.77
                },
                {
                    "hpPct": 0.67,
                    "hpPctAlt2": 0.37,
                    "hpPctAlt3": 0.82
                },
                {
                    "hpPct": 0.73,
                    "hpPctAlt2": 0.4,
                    "hpPctAlt3": 0.89
                },
                {
                    "hpPct": 0.78,
                    "hpPctAlt2": 0.43,
                    "hpPctAlt3": 0.96
                },
                {
                    "hpPct": 0.84,
                    "hpPctAlt2": 0.46,
                    "hpPctAlt3": 1.03
                },
                {
                    "hpPct": 0.9,
                    "hpPctAlt2": 0.5,
                    "hpPctAlt3": 1.1
                },
                {
                    "hpPct": 0.94,
                    "hpPctAlt2": 0.52,
                    "hpPctAlt3": 1.15
                },
                {
                    "hpPct": 0.99,
                    "hpPctAlt2": 0.55,
                    "hpPctAlt3": 1.21
                }
            ]
        },
        "ult": {
            "name": "天を滅す炎骨の王座",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "blast",
            "description": "[拡散攻撃]モーディスの最大HPX%分のHPを回復し、天賦のチャージを20獲得する。指定した敵単体にモーディスの最大HPY%分の虚数属性ダメージを与え、隣接する敵にモーディスの最大HPZ%分の虚数属性ダメージを与える。さらに、ターゲットおよび隣接する敵を挑発状態にする、2ターン継続。なお、次の「神を殺め神となる」はこの攻撃で指定した敵単体を優先的に攻撃する。この効果は最後のターゲットにのみ有効。",
            "levelColumns": [
                "HP回復(X%)",
                "単体ダメージ倍率(Y%)",
                "隣接ダメージ倍率(Z%)",
                "消費EP"
            ],
            "levels": [
                {
                    "healPct": 0.15,
                    "hpPct": 0.96,
                    "hpPctAdjacent": 0.6,
                    "energyCost": 160
                },
                {
                    "healPct": 0.155,
                    "hpPct": 1.02,
                    "hpPctAdjacent": 0.64
                },
                {
                    "healPct": 0.16,
                    "hpPct": 1.08,
                    "hpPctAdjacent": 0.68
                },
                {
                    "healPct": 0.165,
                    "hpPct": 1.15,
                    "hpPctAdjacent": 0.72
                },
                {
                    "healPct": 0.17,
                    "hpPct": 1.21,
                    "hpPctAdjacent": 0.76
                },
                {
                    "healPct": 0.175,
                    "hpPct": 1.28,
                    "hpPctAdjacent": 0.8
                },
                {
                    "healPct": 0.181,
                    "hpPct": 1.36,
                    "hpPctAdjacent": 0.9
                },
                {
                    "healPct": 0.187,
                    "hpPct": 1.44,
                    "hpPctAdjacent": 0.9
                },
                {
                    "healPct": 0.193,
                    "hpPct": 1.52,
                    "hpPctAdjacent": 0.95
                },
                {
                    "healPct": 0.2,
                    "hpPct": 1.6,
                    "hpPctAdjacent": 1
                },
                {
                    "healPct": 0.205,
                    "hpPct": 1.66,
                    "hpPctAdjacent": 1.04
                },
                {
                    "healPct": 0.21,
                    "hpPct": 1.72,
                    "hpPctAdjacent": 1.08
                }
            ]
        },
        "talent": {
            "name": "血を以って血を制す",
            "sourceHeader": "天賦",
            "type": "heal",
            "target": "single",
            "description": "[強化]HPを1%失うごとにチャージを1獲得する。最大200までチャージ可能。チャージが100になると、チャージを100消費して「血の報復」状態に入り、モーディスの最大HPX%分のHPを回復し、行動順が100%早まる。「血の報復」状態の間、最大HPが現在の最大HPの50%分アップし、防御力が0に固定される。自身のターンが回ってきた時、自動で「王を殺め王となる」を発動する。「血の報復」状態の間、チャージが150に達した時、モーディスは追加ターンを1獲得し、「神を殺め神となる」を発動する。「血の報復」状態の間、HPが0になる攻撃を受けた時、戦闘不能状態にならない代わりにチャージをクリアし、「血の報復」状態を解除、最大HPの50%分を回復する。",
            "levelColumns": [
                "HP回復(X%)"
            ],
            "levels": [
                {
                    "healPct": 0.15
                },
                {
                    "healPct": 0.16
                },
                {
                    "healPct": 0.17
                },
                {
                    "healPct": 0.18
                },
                {
                    "healPct": 0.19
                },
                {
                    "healPct": 0.2
                },
                {
                    "healPct": 0.21
                },
                {
                    "healPct": 0.22
                },
                {
                    "healPct": 0.23
                },
                {
                    "healPct": 0.25
                },
                {
                    "healPct": 0.26
                },
                {
                    "healPct": 0.27
                }
            ]
        },
        "technique": {
            "name": "砕折の矛、臣服の牢獄",
            "sourceHeader": "秘技",
            "type": "debuff",
            "target": "all",
            "description": "[妨害]秘技を使用した後、一定範囲内の敵を引き寄せ、10秒間の目眩状態にする。目眩状態の敵は味方を攻撃しない。目眩状態の敵を先制攻撃して戦闘に入った後、敵全体にモーディスの最大HP80%の虚数属性ダメージを与え、敵を挑発状態にする。1ターン継続。また、自身は天賦のチャージを50獲得する。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "土と水「血の報復」状態のモーディスがHPが0になる攻撃を受けても、「血の報復」状態を解除しない。この効果は一度の戦闘で3回まで発動できる。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "三十の僭主「血の報復」状態のモーディスは行動制限系デバフに抵抗できる。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "血染めの衣戦闘開始時、モーディスの最大HPが4000を超えた場合、超過したHP100につき、自身の会心率+1.2%。モーディスが敵からの攻撃でダメージを受けた際に得られるチャージ割合+2.5%、治療を受けた時の回復量+0.75%。超過したHPは最大で4,000までカウントされる。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "寒風に磨かれし不屈の脊柱",
            "description": "「神を殺め神となる」のメインターゲットに対するダメージ倍率+30%、また、「神を殺め神となる」はメインターゲットに対するダメージ倍率で敵全体に虚数属性ダメージを与えるようになる。"
        },
        "2": {
            "name": "紛争が見届けし屍の歔欷",
            "description": "「血の報復」状態の間、モーディスが与えるダメージは敵の防御力を15%無視する。治癒を受けた後、治癒量の40%分がチャージに変換され、累計で40まで変換できる。任意のユニットが行動した後、変換できるチャージのカウントはリセットされる。"
        },
        "3": {
            "name": "栄光を称えし万劫の饗宴",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "角笛で目覚めし沈黙の獅子",
            "description": "「血の報復」状態の間、会心ダメージ+30%。敵から攻撃を受けた後、自身の最大HP10%分のHPを回復する。"
        },
        "5": {
            "name": "兵戈で刻まれし身躯の列炎",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "往日に登攀せし紅血の山",
            "description": "戦闘に入る時、「血の報復」状態に入り、「神を殺め神となる」に必要なチャージが100になる。"
        }
    },
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "extra6_hp_to_crit_rate",
            "source": "extra",
            "name": "昇格6",
            "description": "血染めの衣戦闘開始時、モーディスの最大HPが4000を超えた場合、超過したHP100につき、自身の会心率+1.2%。モーディスが敵からの攻撃でダメージを受けた際に得られるチャージ割合+2.5%、治療を受けた時の回復量+0.75%。超過したHPは最大で4,000までカウントされる。",
            "stat": "CRIT_RATE",
            "compute": "casterDerivedExcessStepCap",
            "sourceStat": "hp",
            "threshold": 4000,
            "step": 100,
            "valuePerStep": 0.012,
            "cap": 0.48
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e2_def_ignore",
            "source": "eidolon",
            "name": "紛争が見届けし屍の歔欷",
            "description": "「血の報復」状態の間、モーディスが与えるダメージは敵の防御力を15%無視する。治癒を受けた後、治癒量の40%分がチャージに変換され、累計で40まで変換できる。任意のユニットが行動した後、変換できるチャージのカウントはリセットされる。",
            "stat": "DEF_IGNORE",
            "value": 0.15,
            "minEidolon": 2
        },
        {
            "id": "e4_blood_vengeance_crit_dmg",
            "source": "eidolon",
            "name": "角笛で目覚めし沈黙の獅子",
            "description": "「血の報復」状態の間、会心ダメージ+30%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 4,
            "stat": "CRIT_DMG",
            "value": 0.3
        }
    ],
    "partyEffects": [],
    "enemyEffects": []
});
