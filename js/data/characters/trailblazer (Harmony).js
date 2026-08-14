import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Trailblazer (Harmony)",
    "id": "trailblazer_harmony",
    "name": "開拓者-調和",
    "element": "Imaginary",
    "elementLabel": "虚数",
    "path": "Harmony",
    "rarity": 5,
    "base": {
        "hp": 1086,
        "atk": 446,
        "def": 679,
        "spd": 105
    },
    "maxEnergy": 140,
    "traceBonuses": [
        {
            "label": "撃破特効",
            "value": 0.373
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
        "pageUrl": "https://wikiwiki.jp/star-rail/%E9%96%8B%E6%8B%93%E8%80%85-%E8%AA%BF%E5%92%8C",
        "version": "2.2"
    },
    "skills": {
        "basic": {
            "name": "揺らめく礼儀",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に開拓者の攻撃力X%分の虚数属性ダメージを与える。",
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
            "name": "間奏曲が降らす雨",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "bounce",
            "description": "[バウンド]指定した敵単体に開拓者の攻撃力X％分の虚数属性ダメージを与え、さらに4ヒットする。1ヒット毎に、ランダムな敵単体に開拓者の攻撃力X％分の虚数属性ダメージを与える。",
            "levelColumns": [
                "バウンドダメージ倍率(X％/ヒット)"
            ],
            "levels": [
                {
                    "atk": 0.25
                },
                {
                    "atk": 0.27
                },
                {
                    "atk": 0.3
                },
                {
                    "atk": 0.32
                },
                {
                    "atk": 0.35
                },
                {
                    "atk": 0.37
                },
                {
                    "atk": 0.4
                },
                {
                    "atk": 0.43
                },
                {
                    "atk": 0.46
                },
                {
                    "atk": 0.5
                },
                {
                    "atk": 0.52
                },
                {
                    "atk": 0.55
                }
            ]
        },
        "ult": {
            "name": "賑やかなパレード",
            "sourceHeader": "必殺技",
            "type": "buff",
            "target": "all_ally",
            "description": "[サポート]味方全体に「バックダンス」を付与する、3ターン継続。開拓者のターンが回ってくるたびに、「バックダンス」の継続ターン-1ターン。「バックダンス」を持つ味方の撃破特効+X％、弱点撃破状態の敵に攻撃を行った後、その回の攻撃の靭性値を1回の超撃破ダメージに転換する。",
            "levelColumns": [
                "撃破特効アップ(X%)",
                "消費EP"
            ],
            "levels": [
                {
                    "value1": 0.15,
                    "energyCost": 140
                },
                {
                    "value1": 0.16
                },
                {
                    "value1": 0.18
                },
                {
                    "value1": 0.19
                },
                {
                    "value1": 0.21
                },
                {
                    "value1": 0.22
                },
                {
                    "value1": 0.24
                },
                {
                    "value1": 0.26
                },
                {
                    "value1": 0.28
                },
                {
                    "value1": 0.3
                },
                {
                    "value1": 0.31
                },
                {
                    "value1": 0.33
                }
            ]
        },
        "talent": {
            "name": "エアリアルステップ",
            "sourceHeader": "天賦",
            "type": "debuff",
            "target": "single",
            "description": "[妨害]敵が弱点撃破された時、開拓者はEPをX回復する。",
            "levelColumns": [
                "EP回復量(X)"
            ],
            "levels": [
                {
                    "energyGain": 5
                },
                {
                    "energyGain": 5.5
                },
                {
                    "energyGain": 6
                },
                {
                    "energyGain": 6.5
                },
                {
                    "energyGain": 7
                },
                {
                    "energyGain": 7.5
                },
                {
                    "energyGain": 8.1
                },
                {
                    "energyGain": 8.7
                },
                {
                    "energyGain": 9.4
                },
                {
                    "energyGain": 10
                },
                {
                    "energyGain": 10.5
                },
                {
                    "energyGain": 11
                }
            ]
        },
        "technique": {
            "name": "即興！独奏団",
            "sourceHeader": "秘技",
            "type": "buff",
            "target": "all_ally",
            "description": "[サポート]秘技を使用した後、次の戦闘開始時、味方全体の撃破特効+30％、2ターン継続。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "ダンス・フォー・ミーフィールド上の敵の数が5以上/4/3/2/1の場合、「バックダンス」が触発する超撃破ダメージ+20%/30%/40%/50%/60%。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "流れに身を任せて戦闘スキルを発動する時、1ヒット目の削靭値+100%。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "シアターハット味方が敵を弱点撃破した後、さらに敵の行動順を30%遅延させる。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "最高の観客席",
            "description": "初めて戦闘スキルを発動した後、SPを1回復する。"
        },
        "2": {
            "name": "牢を打ち破る虹",
            "description": "戦闘開始時、開拓者のEP回復効率+25%、3ターン継続。"
        },
        "3": {
            "name": "休止符の療養院",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "4": {
            "name": "ハトを隠す冠",
            "description": "開拓者がフィールド上にいる時、自身以外の味方の撃破特効を、開拓者の撃破特効15%分アップする。"
        },
        "5": {
            "name": "古き旋律を抱く詩篇",
            "description": "必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "6": {
            "name": "明日スポットライトの下で",
            "description": "戦闘スキルのヒット数+2。"
        }
    },
    "partyEffects": [
        {
            "id": "ult_break_effect",
            "source": "ult",
            "name": "賑やかなパレード",
            "description": "[サポート]味方全体に「バックダンス」を付与する、3ターン継続。開拓者のターンが回ってくるたびに、「バックダンス」の継続ターン-1ターン。「バックダンス」を持つ味方の撃破特効+X％、弱点撃破状態の敵に攻撃を行った後、その回の攻撃の靭性値を1回の超撃破ダメージに転換する。",
            "defaultActive": false,
            "target": "all",
            "duration": 3,
            "fromLevel": "ult",
            "stat": "BREAK_EFFECT",
            "statField": "value1"
        },
        {
            "id": "technique_break_effect",
            "source": "technique",
            "name": "即興！独奏団",
            "description": "[サポート]秘技を使用した後、次の戦闘開始時、味方全体の撃破特効+30％、2ターン継続。",
            "defaultActive": false,
            "target": "all",
            "duration": 2,
            "stat": "BREAK_EFFECT",
            "value": 0.3
        }
    ]
});
