import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Luocha",
    "id": "luocha",
    "name": "羅刹",
    "element": "Imaginary",
    "elementLabel": "虚数",
    "path": "Abundance",
    "rarity": 5,
    "base": {
        "hp": 1280,
        "atk": 756,
        "def": 363,
        "spd": 101
    },
    "maxEnergy": 100,
    "traceBonuses": [
        {
            "label": "攻撃力",
            "value": 0.28
        },
        {
            "label": "最大HP",
            "value": 0.18
        },
        {
            "label": "防御力",
            "value": 0.125
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E7%BE%85%E5%88%B9",
        "version": "1.1"
    },
    "skills": {
        "basic": {
            "name": "黒淵の棘",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "指定した敵単体に羅刹の攻撃力X%分の虚数属性ダメージを与える。",
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
            "name": "白花の祈望",
            "sourceHeader": "戦闘スキル",
            "type": "heal",
            "target": "single_ally",
            "description": "戦闘スキルを発動した後、指定した味方単体のHPを、羅刹の攻撃力X%+Y回復し、羅刹は「白花の刻」を1層獲得する。任意の味方単体の残りHPが50%以下の時、その味方をターゲットとして、羅刹の戦闘スキルと同等の効果が1回触発される、この行動はSPを消費しない。この効果は2ターン後に再度触発できる。",
            "levelColumns": [
                "治癒量(攻撃力X%+Y)"
            ],
            "levels": [
                {
                    "healPct": 0.4,
                    "healFlat": 200
                },
                {
                    "healPct": 0.42,
                    "healFlat": 320
                },
                {
                    "healPct": 0.45,
                    "healFlat": 410
                },
                {
                    "healPct": 0.47,
                    "healFlat": 500
                },
                {
                    "healPct": 0.5,
                    "healFlat": 560
                },
                {
                    "healPct": 0.52,
                    "healFlat": 620
                },
                {
                    "healPct": 0.54,
                    "healFlat": 665
                },
                {
                    "healPct": 0.56,
                    "healFlat": 710
                },
                {
                    "healPct": 0.58,
                    "healFlat": 755
                },
                {
                    "healPct": 0.6,
                    "healFlat": 800
                },
                {
                    "healPct": 0.62,
                    "healFlat": 845
                },
                {
                    "healPct": 0.64,
                    "healFlat": 890
                }
            ]
        },
        "ult": {
            "name": "帰葬の成就",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "all",
            "description": "敵全体のバフを1つ解除し、敵全体に羅刹の攻撃力X%分の虚数属性ダメージを与える。羅刹は「白花の刻」を1層獲得する。",
            "levelColumns": [
                "ダメージ倍率(X%)",
                "消費EP"
            ],
            "levels": [
                {
                    "atk": 1.2,
                    "energyCost": 100
                },
                {
                    "atk": 1.28
                },
                {
                    "atk": 1.36
                },
                {
                    "atk": 1.44
                },
                {
                    "atk": 1.52
                },
                {
                    "atk": 1.6
                },
                {
                    "atk": 1.7
                },
                {
                    "atk": 1.8
                },
                {
                    "atk": 1.9
                },
                {
                    "atk": 2
                },
                {
                    "atk": 2.08
                },
                {
                    "atk": 2.16
                }
            ]
        },
        "talent": {
            "name": "生命の輪廻",
            "sourceHeader": "天賦",
            "type": "heal",
            "target": "single",
            "description": "「白花の刻」が2層に達した時、羅刹が「白花の刻」をすべて消費し、結界を張る。結界内の任意の敵が攻撃を受けた後、攻撃を行った味方は羅刹の攻撃力X%+YのHPを回復する。結界は2ターン継続する。羅刹が戦闘不能状態になった時、結界は解除される。",
            "levelColumns": [
                "治癒量(攻撃力X%+Y)"
            ],
            "levels": [
                {
                    "healPct": 0.12,
                    "healFlat": 60
                },
                {
                    "healPct": 0.127,
                    "healFlat": 96
                },
                {
                    "healPct": 0.135,
                    "healFlat": 123
                },
                {
                    "healPct": 0.142,
                    "healFlat": 150
                },
                {
                    "healPct": 0.15,
                    "healFlat": 168
                },
                {
                    "healPct": 0.156,
                    "healFlat": 186
                },
                {
                    "healPct": 0.162,
                    "healFlat": 199
                },
                {
                    "healPct": 0.168,
                    "healFlat": 213
                },
                {
                    "healPct": 0.174,
                    "healFlat": 226
                },
                {
                    "healPct": 0.18,
                    "healFlat": 240
                },
                {
                    "healPct": 0.186,
                    "healFlat": 253
                },
                {
                    "healPct": 0.192,
                    "healFlat": 267
                }
            ]
        },
        "technique": {
            "name": "愚者の悲哀",
            "sourceHeader": "秘技",
            "type": "support",
            "target": "single",
            "description": "秘技を使用した後、次の戦闘開始時、天賦を発動する。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "滴水蘇生戦闘スキルの効果が触発された時、ターゲットとなった味方単体のデバフを1つ解除する。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "清めし塵の身結界内の任意の敵が味方の攻撃を受けた後、攻撃者以外の味方も羅刹の攻撃力7.0%+93のHPを回復する。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "幽谷を越え行動制限系デバフを抵抗する確率+70%。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "生者の浄化",
            "description": "結界が発動している間、味方全体の攻撃力+20%。"
        },
        "2": {
            "name": "純庭の礼賜",
            "description": "戦闘スキルの効果が触発された時、指定した味方の残りHPが50%未満の場合、羅刹の治癒量+30%。指定した味方の残りHPが50%以上の場合、その味方に羅刹の攻撃力18%+240の耐久値を持つバリアを付与する、2ターン継続。"
        },
        "3": {
            "name": "愚者の模索",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "荊の審判",
            "description": "結界が存在する間、敵を虚弱状態にし、敵の与ダメージ-12%。"
        },
        "5": {
            "name": "受難の痕",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "皆灰燼に帰す",
            "description": "必殺技を発動した時、100%の固定確率で敵全体の全耐性-20%、2ターン継続。"
        }
    },
    "partyEffects": [
        {
            "id": "e1_atk_percent",
            "source": "eidolon",
            "name": "生者の浄化",
            "description": "結界が発動している間、味方全体の攻撃力+20%。",
            "defaultActive": false,
            "target": "all",
            "duration": "conditional",
            "minEidolon": 1,
            "stat": "ATK_PERCENT",
            "value": 0.2
        },
        {
            "id": "e6_all_res_down_mirror",
            "source": "eidolon",
            "name": "皆灰燼に帰す (火力計算用)",
            "description": "必殺技を発動した時、100%の固定確率で敵全体の全耐性-20%、2ターン継続。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "all",
            "duration": 2,
            "minEidolon": 6,
            "stat": "RES_PEN",
            "value": 0.2
        }
    ],
    "enemyEffects": [
        {
            "id": "e6_all_res_down",
            "source": "eidolon",
            "name": "皆灰燼に帰す",
            "description": "必殺技を発動した時、100%の固定確率で敵全体の全耐性-20%、2ターン継続。",
            "defaultActive": false,
            "target": "all",
            "duration": 2,
            "minEidolon": 6,
            "stat": "RES_PEN",
            "value": 0.2
        }
    ],
    "selfEffects": []
});
