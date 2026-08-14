import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Sampo",
    "id": "sampo",
    "name": "サンポ",
    "element": "Wind",
    "elementLabel": "風",
    "path": "Nihility",
    "rarity": 4,
    "base": {
        "hp": 1023,
        "atk": 617,
        "def": 396,
        "spd": 102
    },
    "maxEnergy": 120,
    "traceBonuses": [
        {
            "label": "攻撃力",
            "value": 0.28
        },
        {
            "label": "効果命中",
            "value": 0.18
        },
        {
            "label": "効果抵抗",
            "value": 0.1
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%82%B5%E3%83%B3%E3%83%9D",
        "version": "1.0"
    },
    "skills": {
        "basic": {
            "name": "眩い刃紋",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にサンポの攻撃力X%分の風属性ダメージを与える。",
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
            "name": "反復横跳びの愛",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "bounce",
            "description": "[バウンド]指定した敵単体にサンポの攻撃力X%分の風属性ダメージを与え、さらに4ヒットする。1ヒットごとにランダムな敵単体にサンポの攻撃力Y%分の風属性ダメージを与える。",
            "levelColumns": [
                "単体ダメージ倍率(X％)",
                "バウンドダメージ倍率(Y%)"
            ],
            "levels": [
                {
                    "atk": 0.28,
                    "atk2": 0.28
                },
                {
                    "atk": 0.3,
                    "atk2": 0.3
                },
                {
                    "atk": 0.33,
                    "atk2": 0.33
                },
                {
                    "atk": 0.36,
                    "atk2": 0.36
                },
                {
                    "atk": 0.39,
                    "atk2": 0.39
                },
                {
                    "atk": 0.42,
                    "atk2": 0.42
                },
                {
                    "atk": 0.45,
                    "atk2": 0.45
                },
                {
                    "atk": 0.49,
                    "atk2": 0.49
                },
                {
                    "atk": 0.52,
                    "atk2": 0.52
                },
                {
                    "atk": 0.56,
                    "atk2": 0.56
                },
                {
                    "atk": 0.58,
                    "atk2": 0.58
                },
                {
                    "atk": 0.61,
                    "atk2": 0.61
                }
            ]
        },
        "ult": {
            "name": "サプライズボックス",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]敵全体にサンポの攻撃力X%分の風属性ダメージを与え、100%の基礎確率で攻撃を受けた敵の持続被ダメージ+Y%、2ターン継続。",
            "levelColumns": [
                "ダメージ倍率(X%)",
                "持続被ダメージアップ(Y%)",
                "消費EP"
            ],
            "levels": [
                {
                    "atk": 0.96,
                    "dmgTaken": 0.2,
                    "energyCost": 120
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
                    "atk": 1.15,
                    "dmgTaken": 0.23
                },
                {
                    "atk": 1.21,
                    "dmgTaken": 0.24
                },
                {
                    "atk": 1.28,
                    "dmgTaken": 0.25
                },
                {
                    "atk": 1.36,
                    "dmgTaken": 0.26
                },
                {
                    "atk": 1.44,
                    "dmgTaken": 0.27
                },
                {
                    "atk": 1.52,
                    "dmgTaken": 0.28
                },
                {
                    "atk": 1.6,
                    "dmgTaken": 0.3
                },
                {
                    "atk": 1.66,
                    "dmgTaken": 0.31
                },
                {
                    "atk": 1.72,
                    "dmgTaken": 0.32
                }
            ]
        },
        "talent": {
            "name": "風を切り裂く匕首",
            "sourceHeader": "天賦",
            "type": "buff",
            "target": "single",
            "description": "[強化]サンポの攻撃が敵に命中した後、65%の基礎確率で敵を風化状態にする、3ターン継続。風化状態の敵はターンが回ってくるたびに、サンポの攻撃力X%分の風属性持続ダメージを受ける。風化状態は最大で5層累積できる。",
            "levelColumns": [
                "持続ダメージ倍率(X%)"
            ],
            "levels": [
                {
                    "dotAtk": 0.2
                },
                {
                    "dotAtk": 0.22
                },
                {
                    "dotAtk": 0.24
                },
                {
                    "dotAtk": 0.26
                },
                {
                    "dotAtk": 0.28
                },
                {
                    "dotAtk": 0.31
                },
                {
                    "dotAtk": 0.35
                },
                {
                    "dotAtk": 0.4
                },
                {
                    "dotAtk": 0.46
                },
                {
                    "dotAtk": 0.52
                },
                {
                    "dotAtk": 0.54
                },
                {
                    "dotAtk": 0.57
                }
            ]
        },
        "technique": {
            "name": "一番の輝きをあなたへ",
            "sourceHeader": "秘技",
            "type": "debuff",
            "target": "single",
            "description": "[妨害]秘技を使用した後、一定区域内の敵を10秒間のブラインド状態にする。ブラインド状態の敵は味方を発見できない。ブラインド状態の敵を先制攻撃して戦闘に入った時、100%の固定確率で、敵単体それぞれの行動順を25%遅延させる。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "ワナ天賦による敵の風化状態の継続時間+1ターン。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "予備プラン必殺技を発動した時、さらにEPを10回復する。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "火に油風化状態の敵に対する、サンポの被ダメージ-15%。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "値上げする愛",
            "description": "戦闘スキルを発動した時、さらにランダムな敵単体にダメージを1回与える。"
        },
        "2": {
            "name": "熱情はうつる",
            "description": "風化状態の敵が倒された時、100%の基礎確率で敵全体に、天賦と同じ風化状態を1層付与する。"
        },
        "3": {
            "name": "大儲け！",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "愛する程恨む",
            "description": "戦闘スキルが風化状態5層以上の敵に命中した時、その敵が受けている風化状態が本来のダメージ8%分のダメージを発生する。"
        },
        "5": {
            "name": "超大儲け！",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "消費のアップグレード",
            "description": "天賦が付与した風化状態の持続ダメージ倍率+15%。"
        }
    },
    "partyEffects": [],
    "enemyEffects": []
});
