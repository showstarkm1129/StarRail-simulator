import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Robin",
    "id": "robin",
    "name": "ロビン",
    "element": "Physical",
    "elementLabel": "物理",
    "path": "Harmony",
    "rarity": 5,
    "base": {
        "hp": 1281,
        "atk": 640,
        "def": 485,
        "spd": 102
    },
    "maxEnergy": 160,
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
            "label": "速度",
            "value": 5
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%83%AD%E3%83%93%E3%83%B3",
        "version": "2.2"
    },
    "skills": {
        "basic": {
            "name": "羽ばたくホワイトノイズ",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にロビンの攻撃力X%分の物理ダメージを与える。",
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
            "name": "飛翔のアリア",
            "sourceHeader": "戦闘スキル",
            "type": "buff",
            "target": "all_ally",
            "description": "[サポート]味方全体の与ダメージ+X%、3ターン継続。ロビンのターンが回ってくるたびに継続時間-1ターン。",
            "levelColumns": [
                "与ダメージアップ(X%)"
            ],
            "levels": [
                {
                    "dmgBuff": 0.25
                },
                {
                    "dmgBuff": 0.27
                },
                {
                    "dmgBuff": 0.3
                },
                {
                    "dmgBuff": 0.32
                },
                {
                    "dmgBuff": 0.35
                },
                {
                    "dmgBuff": 0.38
                },
                {
                    "dmgBuff": 0.41
                },
                {
                    "dmgBuff": 0.44
                },
                {
                    "dmgBuff": 0.47
                },
                {
                    "dmgBuff": 0.5
                },
                {
                    "dmgBuff": 0.52
                },
                {
                    "dmgBuff": 0.55
                }
            ]
        },
        "ult": {
            "name": "千の音で、群星にフーガを",
            "sourceHeader": "必殺技",
            "type": "debuff",
            "target": "all_ally",
            "description": "[サポート]ロビンが「協奏」状態に入り、自分以外の味方を即座に行動させる。「協奏」状態の時、味方全体の攻撃力を、ロビンの攻撃力X%分+Yアップする。また、味方が攻撃を行った後、ロビンは自身の攻撃力Z%分の物理付加ダメージを敵に1回与える、このダメージの会心率は100%、会心ダメージは150%に固定される。「協奏」状態の時、ロビンは行動制限系デバフに抵抗できる。ロビンは「協奏」状態が終了するまで自身のターンに入らず、行動できない。アクションバーに「協奏」のカウントダウンが出現する。カウントダウンのターンが回ってきた時、ロビンは「協奏」状態を解除し、即座に行動する。カウントダウンの速度は90に固定される。",
            "levelColumns": [
                "攻撃力アップ(X%＋Y)",
                "付加ダメージ倍率(Z%)",
                "消費EP"
            ],
            "levels": [
                {
                    "atkBuff1": 0.152,
                    "atkBuff2": 50,
                    "atk": 0.72,
                    "energyCost": 160
                },
                {
                    "atkBuff1": 0.16,
                    "atkBuff2": 65,
                    "atk": 0.77
                },
                {
                    "atkBuff1": 0.167,
                    "atkBuff2": 80,
                    "atk": 0.82
                },
                {
                    "atkBuff1": 0.175,
                    "atkBuff2": 95,
                    "atk": 0.86
                },
                {
                    "atkBuff1": 0.182,
                    "atkBuff2": 110,
                    "atk": 0.91
                },
                {
                    "atkBuff1": 0.19,
                    "atkBuff2": 125,
                    "atk": 0.96
                },
                {
                    "atkBuff1": 0.199,
                    "atkBuff2": 144,
                    "atk": 1.02
                },
                {
                    "atkBuff1": 0.209,
                    "atkBuff2": 163,
                    "atk": 1.08
                },
                {
                    "atkBuff1": 0.218,
                    "atkBuff2": 181,
                    "atk": 1.14
                },
                {
                    "atkBuff1": 0.228,
                    "atkBuff2": 200,
                    "atk": 1.2
                },
                {
                    "atkBuff1": 0.235,
                    "atkBuff2": 215,
                    "atk": 1.24
                },
                {
                    "atkBuff1": 0.243,
                    "atkBuff2": 230,
                    "atk": 1.3
                }
            ]
        },
        "talent": {
            "name": "調和の純正律",
            "sourceHeader": "天賦",
            "type": "heal",
            "target": "all_ally",
            "description": "[サポート]味方全体の会心ダメージ+X%。味方が敵に攻撃を行った後、ロビンは自身のEPを2回復する。",
            "levelColumns": [
                "会心ダメージアップ(X％)"
            ],
            "levels": [
                {
                    "cdBuff": 0.05
                },
                {
                    "cdBuff": 0.065
                },
                {
                    "cdBuff": 0.08
                },
                {
                    "cdBuff": 0.095
                },
                {
                    "cdBuff": 0.11
                },
                {
                    "cdBuff": 0.125
                },
                {
                    "cdBuff": 0.144
                },
                {
                    "cdBuff": 0.163
                },
                {
                    "cdBuff": 0.181
                },
                {
                    "cdBuff": 0.2
                },
                {
                    "cdBuff": 0.215
                },
                {
                    "cdBuff": 0.23
                }
            ]
        },
        "technique": {
            "name": "酩酊のオーバーチュア",
            "sourceHeader": "秘技",
            "type": "heal",
            "target": "single",
            "description": "[サポート]秘技を発動した後、自身の周囲に15秒間持続する特殊領域を作り出す。特殊領域内の敵はロビンを攻撃せず、領域が存在する間はロビンに追随する。領域展開中に戦闘に入った後、各ウェーブ開始時にロビンはEPを5回復する。味方が作り出した領域は1つまで存在できる。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "華彩のコロラトゥーラ戦闘開始時、自身の行動順が25%早まる。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "アドリブの装飾曲「協奏」状態の時、味方全体の追加攻撃が与える会心ダメージ+25%。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "反復するピリオド戦闘スキルを発動する時、さらにEPを5回復する。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "微笑みの国",
            "description": "「協奏」状態の時、味方全体の全耐性貫通+24%。"
        },
        "2": {
            "name": "2人のアフタヌーンティー",
            "description": "「協奏」状態の時、味方全体の速度+16%、天賦のEP回復効果がさらに1アップする。"
        },
        "3": {
            "name": "逆さまの主音",
            "description": "戦闘スキルのLv+2、最大Lv.15まで。必殺技のLv+2、最大Lv.15まで。"
        },
        "4": {
            "name": "雨粒のカギ",
            "description": "必殺技を発動する時、味方全体の行動制限系デバフを解除する。ロビンが「協奏」状態の時、味方全体の効果抵抗+50%。"
        },
        "5": {
            "name": "孤独な星の涙",
            "description": "通常攻撃のLv+1、最大Lv.10まで。天賦のLv+2、最大Lv.15まで。"
        },
        "6": {
            "name": "月隠りの真夜中",
            "description": "「協奏」状態の時、必殺技による物理付加ダメージの会心ダメージ+450%。「月隠りの真夜中」の効果は8回まで発動できる。必殺技を発動すると、この効果の発動可能回数がリセットされる。"
        }
    },
    "partyEffects": [
        {
            "id": "skill_dmg",
            "source": "skill",
            "name": "飛翔のアリア",
            "description": "[サポート]味方全体の与ダメージ+X%、3ターン継続。ロビンのターンが回ってくるたびに継続時間-1ターン。",
            "defaultActive": false,
            "target": "all",
            "duration": 3,
            "fromLevel": "skill",
            "stat": "DMG_ALL",
            "statField": "dmgBuff"
        },
        {
            "id": "ult_atk_flat",
            "source": "ult",
            "name": "千の音で、群星にフーガを",
            "description": "[サポート]ロビンが「協奏」状態に入り、自分以外の味方を即座に行動させる。「協奏」状態の時、味方全体の攻撃力を、ロビンの攻撃力X%分+Yアップする。また、味方が攻撃を行った後、ロビンは自身の攻撃力Z%分の物理付加ダメージを敵に1回与える、このダメージの会心率は100%、会心ダメージは150%に固定される。「協奏」状態の時、ロビンは行動制限系デバフに抵抗できる。ロビンは「協奏」状態が終了するまで自身のターンに入らず、行動できない。アクションバーに「協奏」のカウントダウンが出現する。カウントダウンのターンが回ってきた時、ロビンは「協奏」状態を解除し、即座に行動する。カウントダウンの速度は90に固定される。",
            "defaultActive": false,
            "target": "all",
            "fromLevel": "ult",
            "stat": "ATK_FLAT",
            "compute": "casterDerivedRatio",
            "sourceStat": "atk",
            "ratioField": "atkBuff1",
            "flatField": "atkBuff2"
        },
        {
            "id": "talent_crit_dmg",
            "source": "talent",
            "name": "調和の純正律",
            "description": "[サポート]味方全体の会心ダメージ+X%。味方が敵に攻撃を行った後、ロビンは自身のEPを2回復する。",
            "defaultActive": false,
            "target": "all",
            "fromLevel": "talent",
            "stat": "CRIT_DMG",
            "statField": "cdBuff"
        },
        {
            "id": "e2_spd_percent",
            "source": "eidolon",
            "name": "2人のアフタヌーンティー",
            "description": "「協奏」状態の時、味方全体の速度+16%、天賦のEP回復効果がさらに1アップする。",
            "defaultActive": false,
            "target": "all",
            "duration": "conditional",
            "minEidolon": 2,
            "stat": "SPD_PERCENT",
            "value": 0.16
        },
        {
            "id": "extra4_followup_crit_dmg",
            "source": "extra",
            "name": "昇格4",
            "description": "「協奏」状態の時、味方全体の追加攻撃が与える会心ダメージ+25%。",
            "defaultActive": false,
            "target": "all",
            "duration": "conditional",
            "stat": "CRIT_DMG_FOLLOWUP",
            "value": 0.25
        },
        {
            "id": "e1_res_pen",
            "source": "eidolon",
            "name": "微笑みの国",
            "description": "「協奏」状態の時、味方全体の全耐性貫通+24%。",
            "defaultActive": false,
            "target": "all",
            "duration": "conditional",
            "minEidolon": 1,
            "stat": "RES_PEN",
            "value": 0.24
        },
        {
            "id": "e4_effect_res",
            "source": "eidolon",
            "name": "雨粒のカギ",
            "description": "ロビンが「協奏」状態の時、味方全体の効果抵抗+50%。",
            "defaultActive": false,
            "target": "all",
            "duration": "conditional",
            "minEidolon": 4,
            "stat": "EFFECT_RES",
            "value": 0.5
        }
    ],
    "enemyEffects": [],
    "selfEffects": []
});
