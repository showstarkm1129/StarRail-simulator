import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "March 7th (The Hunt)",
    "id": "march_7th_the_hunt",
    "name": "三月なのか-巡狩",
    "element": "Imaginary",
    "elementLabel": "虚数",
    "path": "The Hunt",
    "rarity": 4,
    "base": {
        "hp": 1058,
        "atk": 564,
        "def": 441,
        "spd": 102
    },
    "maxEnergy": 110,
    "traceBonuses": [
        {
            "label": "攻撃力",
            "value": 0.28
        },
        {
            "label": "会心ダメージ",
            "value": 0.24
        },
        {
            "label": "防御力",
            "value": 0.125
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E4%B8%89%E6%9C%88%E3%81%AA%E3%81%AE%E3%81%8B-%E5%B7%A1%E7%8B%A9",
        "version": "2.4"
    },
    "skills": {
        "basic": {
            "name": "妖魔を祓う瑠璃剣",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に三月なのかの攻撃力X%分の虚数属性ダメージを与え、チャージを1獲得する。",
            "levelColumns": [
                "ダメージ倍率(X％)",
                "ダメージ倍率(Y％)"
            ],
            "levels": [
                {
                    "atk": 0.5,
                    "atk2": 0.4
                },
                {
                    "atk": 0.6,
                    "atk2": 0.48
                },
                {
                    "atk": 0.7,
                    "atk2": 0.56
                },
                {
                    "atk": 0.8,
                    "atk2": 0.64
                },
                {
                    "atk": 0.9,
                    "atk2": 0.72
                },
                {
                    "atk": 1,
                    "atk2": 0.8
                },
                {
                    "atk": 1.1,
                    "atk2": 0.88
                }
            ]
        },
        "skill": {
            "name": "師匠、お茶をどうぞ！",
            "sourceHeader": "戦闘スキル",
            "type": "support",
            "target": "single_ally",
            "description": "[強化]指定した自身以外の味方単体を「師匠」にする。「師匠」の速度+X％。戦闘スキルで最後に指定したターゲットのみ、三月なのかの「師匠」と見なされる。通常攻撃を行う、または強化通常攻撃「一に眉間、二に心臓」によるダメージを1段与える時、フィールド上に特定の運命を歩む「師匠」が存在する場合、「師匠」の歩む運命に応じて特定の効果を発動する。「師匠」の歩む運命が「知恵」、「壊滅」、「巡狩」または「記憶」の場合:三月なのかの攻撃力Y％分の、「師匠」の属性に応じた付加ダメージを与える。「師匠」の歩む運命が「調和」、「虚無」、「存護」または「豊穣」の場合:その回の攻撃の削靭値+100％。",
            "levelColumns": [
                "速度アップ(X％)",
                "ダメージ倍率(Y％)"
            ],
            "levels": [
                {
                    "spdBuff": 0.06,
                    "atk": 0.1
                },
                {
                    "spdBuff": 0.064,
                    "atk": 0.11
                },
                {
                    "spdBuff": 0.068,
                    "atk": 0.12
                },
                {
                    "spdBuff": 0.072,
                    "atk": 0.13
                },
                {
                    "spdBuff": 0.076,
                    "atk": 0.14
                },
                {
                    "spdBuff": 0.08,
                    "atk": 0.15
                },
                {
                    "spdBuff": 0.085,
                    "atk": 0.16
                },
                {
                    "spdBuff": 0.09,
                    "atk": 0.17
                },
                {
                    "spdBuff": 0.095,
                    "atk": 0.18
                },
                {
                    "spdBuff": 0.1,
                    "atk": 0.2
                },
                {
                    "spdBuff": 0.104,
                    "atk": 0.21
                },
                {
                    "spdBuff": 0.108,
                    "atk": 0.22
                }
            ]
        },
        "ult": {
            "name": "蓋世の傑物、三月なのか",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に三月なのかの攻撃力X％の虚数属性ダメージ を与える。次の強化通常攻撃「一に眉間、二に心臓」の初期攻撃段数+2。また、攻撃段数が増加する固定確率+20％。",
            "levelColumns": [
                "ダメージ倍率(X％)",
                "消費EP"
            ],
            "levels": [
                {
                    "atk": 1.44,
                    "energyCost": 110
                },
                {
                    "atk": 1.53
                },
                {
                    "atk": 1.63
                },
                {
                    "atk": 1.72
                },
                {
                    "atk": 1.82
                },
                {
                    "atk": 1.92
                },
                {
                    "atk": 2.04
                },
                {
                    "atk": 2.16
                },
                {
                    "atk": 2.28
                },
                {
                    "atk": 2.4
                },
                {
                    "atk": 2.49
                },
                {
                    "atk": 2.59
                }
            ]
        },
        "talent": {
            "name": "師匠、わかりました！",
            "sourceHeader": "天賦",
            "type": "buff",
            "target": "single",
            "description": "[強化]「師匠」が攻撃を行う、または必殺技を発動した後、三月なのかは一度に最大でチャージを1獲得する。チャージが7以上の時、三月なのかは即座に行動し、与ダメージ+X%。通常攻撃が「一に眉間、二に心臓」に強化され、戦闘スキルが発動できなくなる。強化通常攻撃を行った後、チャージを7消費する。チャージの上限は10。",
            "levelColumns": [
                "与ダメージアップ(X%)"
            ],
            "levels": [
                {
                    "dmgBuff": 0.4
                },
                {
                    "dmgBuff": 0.44
                },
                {
                    "dmgBuff": 0.48
                },
                {
                    "dmgBuff": 0.52
                },
                {
                    "dmgBuff": 0.56
                },
                {
                    "dmgBuff": 0.6
                },
                {
                    "dmgBuff": 0.65
                },
                {
                    "dmgBuff": 0.7
                },
                {
                    "dmgBuff": 0.75
                },
                {
                    "dmgBuff": 0.8
                },
                {
                    "dmgBuff": 0.84
                },
                {
                    "dmgBuff": 0.88
                }
            ]
        },
        "technique": {
            "name": "一気に三食",
            "sourceHeader": "秘技",
            "type": "heal",
            "target": "single",
            "description": "[強化]三月なのかがパーティに編成されている場合、三月なのか以外の味方が秘技を使用した回数1回につき、次の戦闘開始時、三月なのかはチャージを1獲得する、最大で3獲得できる。三月なのかが秘技を使用した後、次の戦闘開始時、三月なのかはEPを30回復する。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "驚鴻戦闘開始時、三月なのかの行動順が25%早まる。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "玲瓏三月なのかは「師匠」の属性に応じる弱点属性を持つ敵の靭性を削れる。敵を弱点撃破する時、虚数属性の弱点撃破効果が触発される。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "破浪強化通常攻撃を行った後、「師匠」の会心ダメージ+60%、撃破特効+36%、2ターン継続。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "流星を振るう春花",
            "description": "フィールド上に「師匠」が存在する時、三月なのかの速度+10%。"
        },
        "2": {
            "name": "雪白の刃は怒涛の如く",
            "description": "「師匠」が通常攻撃または戦闘スキルを発動して敵に攻撃を行った後、三月なのかは追加攻撃を行い、その回の攻撃のメインターゲットに三月なのかの攻撃力60%分の虚数属性ダメージを与え、「師匠」の運命に応じた戦闘スキルの効果を発動し、チャージを1獲得する。攻撃できるメインターゲットが存在しない場合、ランダムな敵単体に攻撃を行う。この効果はターンが回ってくるたびに1回まで発動できる。"
        },
        "3": {
            "name": "冴えた頭と優れた腕前",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "竜章鳳姿",
            "description": "ターンが回ってきた時、EPを5回復する。"
        },
        "5": {
            "name": "稽古を増やして 甘味は控える",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "ウチが世界一!",
            "description": "必殺技を発動した後、次の強化通常攻撃「一に眉間、二に心臓」によるダメージの会心ダメージ+50%。"
        }
    },
    "partyEffects": [
        {
            "id": "extra6_master_buff",
            "source": "extra",
            "name": "昇格6",
            "description": "破浪強化通常攻撃を行った後、「師匠」の会心ダメージ+60%、撃破特効+36%、2ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "stats": {
                "CRIT_DMG": 0.6,
                "BREAK_EFFECT": 0.36
            }
        },
        {
            "id": "skill_master_spd_percent",
            "source": "skill",
            "name": "師匠、お茶をどうぞ！",
            "description": "指定した自身以外の味方単体を「師匠」にし、「師匠」の速度+X%。",
            "defaultActive": false,
            "target": "single",
            "fromLevel": "skill",
            "stat": "SPD_PERCENT",
            "statField": "spdBuff"
        }
    ],
    "enemyEffects": [],
    "selfEffects": [
        {
            "id": "e1_master_spd_percent",
            "source": "eidolon",
            "name": "流星を振るう春花",
            "description": "フィールド上に「師匠」が存在する時、三月なのかの速度+10%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 1,
            "stat": "SPD_PERCENT",
            "value": 0.1
        },
        {
            "id": "e6_enhanced_basic_crit_dmg",
            "source": "eidolon",
            "name": "ウチが世界一!",
            "description": "必殺技を発動した後、次の強化通常攻撃によるダメージの会心ダメージ+50%。",
            "defaultActive": false,
            "target": "single",
            "minEidolon": 6,
            "stat": "CRIT_DMG_BASIC",
            "value": 0.5
        },
        {
            "id": "talent_charged_dmg",
            "source": "talent",
            "name": "師匠、わかりました！",
            "description": "チャージが7以上の時、三月なのかは即座に行動し、与ダメージ+X%。",
            "defaultActive": false,
            "target": "single",
            "fromLevel": "talent",
            "stat": "DMG_ALL",
            "statField": "dmgBuff"
        }
    ]
});
