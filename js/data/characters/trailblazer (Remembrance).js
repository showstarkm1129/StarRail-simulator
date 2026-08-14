import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Trailblazer (Remembrance)",
    "id": "trailblazer_remembrance",
    "name": "開拓者-記憶",
    "aliases": ["記憶主人公", "記憶開拓者"],
    "element": "Ice",
    "elementLabel": "氷",
    "path": "Remembrance",
    "rarity": 5,
    "base": {
        "hp": 1047,
        "atk": 543,
        "def": 630,
        "spd": 103
    },
    "maxEnergy": 160,
    "traceBonuses": [
        {
            "label": "会心ダメージ",
            "value": 0.373
        },
        {
            "label": "攻撃力",
            "value": 0.14
        },
        {
            "label": "最大HP",
            "value": 0.14
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E9%96%8B%E6%8B%93%E8%80%85-%E8%A8%98%E6%86%B6",
        "version": "3.0"
    },
    "skills": {
        "basic": {
            "name": "お任せあれ！",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に開拓者の攻撃力X%分の氷属性ダメージを与える。",
            "levelColumns": [
                "ダメージ倍率(X％)",
                "全体ダメージ倍率(Y%)"
            ],
            "levels": [
                {
                    "atk": 0.5,
                    "atkAll": 0.6
                },
                {
                    "atk": 0.6,
                    "atkAll": 0.72
                },
                {
                    "atk": 0.7,
                    "atkAll": 0.84
                },
                {
                    "atk": 0.8,
                    "atkAll": 0.96
                },
                {
                    "atk": 0.9,
                    "atkAll": 1.08
                },
                {
                    "atk": 1,
                    "atkAll": 1.2
                },
                {
                    "atk": 1.1,
                    "atkAll": 1.32
                }
            ]
        },
        "skill": {
            "name": "ミュリオンに決めた！",
            "sourceHeader": "戦闘スキル",
            "type": "heal",
            "target": "single",
            "description": "[召喚]記憶の精霊「ミュリオン」を召喚する。ミュリオンがすでにフィールド上にいる場合、ミュリオンはHPを最大HPX%分回復し、チャージを10%獲得する。",
            "levelColumns": [
                "回復量(X%)"
            ],
            "levels": [
                {
                    "healPct": 0.3
                },
                {
                    "healPct": 0.33
                },
                {
                    "healPct": 0.36
                },
                {
                    "healPct": 0.39
                },
                {
                    "healPct": 0.42
                },
                {
                    "healPct": 0.45
                },
                {
                    "healPct": 0.48
                },
                {
                    "healPct": 0.52
                },
                {
                    "healPct": 0.56
                },
                {
                    "healPct": 0.6
                },
                {
                    "healPct": 0.63
                },
                {
                    "healPct": 0.66
                }
            ]
        },
        "ult": {
            "name": "やっちゃえミュリオン！",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]記憶の精霊「ミュリオン」を召喚する。ミュリオンがチャージを40%獲得し、敵全体に自身攻撃力X%分の氷属性ダメージを与える。",
            "levelColumns": [
                "全体ダメージ倍率(X%)",
                "消費EP"
            ],
            "levels": [
                {
                    "atk": 1.2,
                    "energyCost": 160
                },
                {
                    "atk": 1.32
                },
                {
                    "atk": 1.44
                },
                {
                    "atk": 1.56
                },
                {
                    "atk": 1.68
                },
                {
                    "atk": 1.8
                },
                {
                    "atk": 1.95
                },
                {
                    "atk": 2.1
                },
                {
                    "atk": 2.25
                },
                {
                    "atk": 2.4
                },
                {
                    "atk": 2.52
                },
                {
                    "atk": 2.64
                }
            ]
        },
        "talent": {
            "name": "なんでもできる仲間",
            "sourceHeader": "天賦",
            "type": "heal",
            "target": "all_ally",
            "description": "[強化]記憶の精霊「ミュリオン」の初期速度は130となり、初期最大HPは、開拓者の最大HPX%分+Yとなる。味方全体でEPを10回復するたびに、ミュリオンがチャージを1%獲得する。",
            "levelColumns": [
                "初期最大HP(X%+Y)"
            ],
            "levels": [
                {
                    "hpPct": 0.5,
                    "hpFlat": 400
                },
                {
                    "hpPct": 0.53,
                    "hpFlat": 424
                },
                {
                    "hpPct": 0.56,
                    "hpFlat": 448
                },
                {
                    "hpPct": 0.59,
                    "hpFlat": 472
                },
                {
                    "hpPct": 0.62,
                    "hpFlat": 496
                },
                {
                    "hpPct": 0.65,
                    "hpFlat": 520
                },
                {
                    "hpPct": 0.68,
                    "hpFlat": 550
                },
                {
                    "hpPct": 0.72,
                    "hpFlat": 580
                },
                {
                    "hpPct": 0.76,
                    "hpFlat": 610
                },
                {
                    "hpPct": 0.8,
                    "hpFlat": 640
                },
                {
                    "hpPct": 0.83,
                    "hpFlat": 664
                },
                {
                    "hpPct": 0.86,
                    "hpFlat": 688
                }
            ]
        },
        "memorySkill": {
            "name": "厄介な悪者さん！",
            "sourceHeader": "精霊スキル",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]4回ダメージを与える。毎回ランダムな敵単体に「ミュリオン」の攻撃力X%分の氷属性ダメージを与え、最後に敵全体にミュリオンの攻撃力Y%分の氷属性ダメージを与える。",
            "levelColumns": [
                "バウンドダメージ倍率(X%)",
                "全体ダメージ倍率(Y%)",
                "確定ダメージ(Z%)"
            ],
            "levels": [
                {
                    "atk": 0.18,
                    "atkAll": 0.45,
                    "atk2": 0.18
                },
                {
                    "atk": 0.216,
                    "atkAll": 0.54,
                    "atk2": 0.2
                },
                {
                    "atk": 0.252,
                    "atkAll": 0.63,
                    "atk2": 0.22
                },
                {
                    "atk": 0.288,
                    "atkAll": 0.72,
                    "atk2": 0.24
                },
                {
                    "atk": 0.324,
                    "atkAll": 0.81,
                    "atk2": 0.26
                },
                {
                    "atk": 0.36,
                    "atkAll": 0.9,
                    "atk2": 0.28
                },
                {
                    "atk": 0.396,
                    "atkAll": 0.99,
                    "atk2": 0.3
                }
            ]
        },
        "memoryTalent": {
            "name": "仲間と一緒に！",
            "sourceHeader": "精霊天賦",
            "type": "buff",
            "target": "all_ally",
            "description": "[サポート]味方全体の会心ダメージを、「ミュリオン」の会心ダメージX%分+Y%アップする。チャージが100%未満の場合、ミュリオンは行動する時に自動で「厄介な悪者さん！」を発動する。チャージが100%に達した時、ミュリオンは即座に行動し、指定した味方単体に「あたしが助ける！」を発動できるようになる。",
            "levelColumns": [
                "会心ダメージバフ量(X%+Y%)"
            ],
            "levels": [
                {
                    "cdRatio": 0.06,
                    "cdFlat": 0.12
                },
                {
                    "cdRatio": 0.072,
                    "cdFlat": 0.144
                },
                {
                    "cdRatio": 0.084,
                    "cdFlat": 0.168
                },
                {
                    "cdRatio": 0.096,
                    "cdFlat": 0.192
                },
                {
                    "cdRatio": 0.108,
                    "cdFlat": 0.216
                },
                {
                    "cdRatio": 0.12,
                    "cdFlat": 0.24
                },
                {
                    "cdRatio": 0.132,
                    "cdFlat": 0.264
                }
            ]
        },
        "technique": {
            "name": "こだまする記憶",
            "sourceHeader": "秘技",
            "type": "attack",
            "target": "all",
            "description": "[妨害]秘技を使用した後、10秒間継続する特殊領域を作り出す。特殊領域内にいる敵はタイムストップ状態を付与され、タイムストップ状態の敵は行動を停止する。タイムストップ状態の敵と戦闘に入った後、敵全体の行動順を50%遅延させ、敵全体に開拓者の攻撃力100%分の氷属性ダメージを与える。味方が作り出した領域は1つまで存在できる。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "追憶の杖戦闘開始時、開拓者の行動順が30%早まる。「ミュリオン」を初めて召喚した時、ミュリオンがチャージを40%獲得する。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "掌上の叙事詩「ミュリオン」が「厄介な悪者さん！」を発動する時、即座にチャージを5%獲得する。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "磁石と長鎖「ミュリオンの応援」を持つ味方の最大EPが100を超えている場合、超過分10につき、「ミュリオンの応援」による確定ダメージの倍率がさらに+2%、最大で20%アップできる。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "現在を記録する者",
            "description": "「ミュリオンの応援」を持つ味方の会心率+10%。味方が「ミュリオンの応援」を持つ時、その効果はその味方の記憶の精霊/召喚者、両方に適用される。なお、この効果は累積できない。"
        },
        "2": {
            "name": "過去を拾う者",
            "description": "「ミュリオン」以外の味方の記憶の精霊が行動する時、開拓者のEPを8回復する。この効果はターンが回ってくるたびに1回まで発動でき、開拓者のターンが回ってきた時に発動可能回数がリセットされる。"
        },
        "3": {
            "name": "未来を詠う者",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。精霊天賦のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "ミューズの新たな踊り手",
            "description": "最大EPが0の味方がスキルを発動する時、「ミュリオン」はチャージを3%獲得し、その味方が「ミュリオンの応援」による確定ダメージのダメージ倍率がさらに+6%。"
        },
        "5": {
            "name": "詩篇の紡ぎ手",
            "description": "必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。精霊スキルのLv.+1、最大Lv.10まで。"
        },
        "6": {
            "name": "啓示の語り手",
            "description": "必殺技の会心率が100%に固定される。"
        }
    },
    "partyEffects": [
        {
            "id": "memorytalent_crit_dmg_caster",
            "source": "talent",
            "name": "仲間と一緒に！",
            "description": "[サポート]味方全体の会心ダメージを、「ミュリオン」の会心ダメージX%分+Y%アップする。チャージが100%未満の場合、ミュリオンは行動する時に自動で「厄介な悪者さん！」を発動する。チャージが100%に達した時、ミュリオンは即座に行動し、指定した味方単体に「あたしが助ける！」を発動できるようになる。",
            "defaultActive": false,
            "target": "all",
            "fromLevel": "memoryTalent",
            "stat": "CRIT_DMG",
            "compute": "casterDerivedRatio",
            "sourceStat": "critDmg",
            "ratioField": "cdRatio",
            "flatField": "cdFlat"
        },
        {
            "id": "e1_crit_rate",
            "source": "eidolon",
            "name": "現在を記録する者",
            "description": "「ミュリオンの応援」を持つ味方の会心率+10%。味方が「ミュリオンの応援」を持つ時、その効果はその味方の記憶の精霊/召喚者、両方に適用される。なお、この効果は累積できない。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 1,
            "stat": "CRIT_RATE",
            "value": 0.1
        }
    ],
    "enemyEffects": [],
    "selfEffects": [
        {
            "id": "e6_ult_fixed_crit_rate",
            "source": "eidolon",
            "name": "啓示の語り手",
            "description": "必殺技の会心率が100%に固定される。基礎5%を前提に必殺会心率+95%として近似。",
            "defaultActive": false,
            "target": "single",
            "minEidolon": 6,
            "stat": "CRIT_RATE_ULT",
            "value": 0.95
        }
    ]
});
