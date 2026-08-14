import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Dan Heng",
    "id": "dan_heng",
    "name": "丹恒",
    "element": "Wind",
    "elementLabel": "風",
    "path": "The Hunt",
    "rarity": 4,
    "base": {
        "hp": 882,
        "atk": 547,
        "def": 396,
        "spd": 110
    },
    "maxEnergy": 100,
    "traceBonuses": [
        {
            "label": "風ダメージ",
            "value": 0.224
        },
        {
            "label": "攻撃力",
            "value": 0.18
        },
        {
            "label": "防御力",
            "value": 0.125
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E4%B8%B9%E6%81%92",
        "version": "1.0"
    },
    "skills": {
        "basic": {
            "name": "雲騎槍術・朔風",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に丹恒の攻撃力X%分の風属性ダメージを与える。",
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
            "name": "雲騎槍術・疾雨",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に丹恒の攻撃力X%分の風属性ダメージを与える。戦闘スキルで会心が発生した時、100%の基礎確率で攻撃された敵の速度-12%、2ターン継続。",
            "levelColumns": [
                "ダメージ倍率(X%)"
            ],
            "levels": [
                {
                    "atk": 1.3
                },
                {
                    "atk": 1.43
                },
                {
                    "atk": 1.56
                },
                {
                    "atk": 1.69
                },
                {
                    "atk": 1.82
                },
                {
                    "atk": 1.95
                },
                {
                    "atk": 2.11
                },
                {
                    "atk": 2.27
                },
                {
                    "atk": 2.43
                },
                {
                    "atk": 2.6
                },
                {
                    "atk": 2.73
                },
                {
                    "atk": 2.86
                }
            ]
        },
        "ult": {
            "name": "洞天幻化、長夢一覚",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に丹恒の攻撃力X%分の風属性ダメージを与える。攻撃を受けた敵が減速状態の場合、必殺技のダメージ倍率+Y%。",
            "levelColumns": [
                "ダメージ倍率(X%)",
                "ダメージ倍率加算(Y%)",
                "消費EP"
            ],
            "levels": [
                {
                    "atk": 2.4,
                    "atk2": 0.72,
                    "energyCost": 100
                },
                {
                    "atk": 2.56,
                    "atk2": 0.76
                },
                {
                    "atk": 2.72,
                    "atk2": 0.81
                },
                {
                    "atk": 2.88,
                    "atk2": 0.86
                },
                {
                    "atk": 3.04,
                    "atk2": 0.91
                },
                {
                    "atk": 3.2,
                    "atk2": 0.96
                },
                {
                    "atk": 3.4,
                    "atk2": 1.02
                },
                {
                    "atk": 3.6,
                    "atk2": 1.08
                },
                {
                    "atk": 3.8,
                    "atk2": 1.14
                },
                {
                    "atk": 4,
                    "atk2": 1.2
                },
                {
                    "atk": 4.16,
                    "atk2": 1.24
                },
                {
                    "atk": 4.32,
                    "atk2": 1.29
                }
            ]
        },
        "talent": {
            "name": "寸長寸強",
            "sourceHeader": "天賦",
            "type": "buff",
            "target": "single",
            "description": "[強化]丹恒が味方スキルのターゲットになった時、次の攻撃の風属性耐性貫通+X%。この効果は2ターン後に再度発動できる。",
            "levelColumns": [
                "風属性耐性貫通(X%)"
            ],
            "levels": [
                {
                    "resPen": 0.18
                },
                {
                    "resPen": 0.19
                },
                {
                    "resPen": 0.21
                },
                {
                    "resPen": 0.23
                },
                {
                    "resPen": 0.25
                },
                {
                    "resPen": 0.27
                },
                {
                    "resPen": 0.29
                },
                {
                    "resPen": 0.31
                },
                {
                    "resPen": 0.33
                },
                {
                    "resPen": 0.36
                },
                {
                    "resPen": 0.37
                },
                {
                    "resPen": 0.39
                }
            ]
        },
        "technique": {
            "name": "破敵の矛先",
            "sourceHeader": "秘技",
            "type": "buff",
            "target": "single",
            "description": "[強化]秘技を使用した後、次の戦闘開始時、丹恒の攻撃力+40%、3ターン継続。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "潜龍残りHPが50%以下の場合、敵に攻撃される確率ダウン。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "絶影攻撃を行った後、50%の固定確率で自身の速度+20%、2ターン継続。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "剛風減速状態の敵に対する通常攻撃の与ダメージ+40%。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "極天窮尽するも 昂り保てず",
            "description": "攻撃した敵の残りHPが50%以上の場合、会心率+12%。"
        },
        "2": {
            "name": "八毒圧倒 炎煙滅却",
            "description": "天賦のクールタイム-1ターン。"
        },
        "3": {
            "name": "幽明の変化 遊龍の如く自在にあり",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "奮迅三昧 日輪の如く",
            "description": "必殺技で敵を倒した時、丹恒が即座に行動する。"
        },
        "5": {
            "name": "天水分かつ一槍 六虚の洪流振り起こす",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "今生縄縛 解く時急く勿れ",
            "description": "戦闘スキルによって減速状態を付与された敵は、さらに速度-8%。"
        }
    },
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "talent_wind_res_pen",
            "source": "talent",
            "name": "寸長寸強",
            "description": "[強化]丹恒が味方スキルのターゲットになった時、次の攻撃の風属性耐性貫通+X%。この効果は2ターン後に再度発動できる。",
            "fromLevel": "talent",
            "stat": "RES_PEN",
            "statField": "resPen",
            "duration": 2
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "technique_atk_percent",
            "source": "technique",
            "name": "破敵の矛先",
            "description": "[強化]秘技を使用した後、次の戦闘開始時、丹恒の攻撃力+40%、3ターン継続。",
            "stat": "ATK_PERCENT",
            "value": 0.4,
            "duration": 3
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "extra4_spd_percent",
            "source": "extra",
            "name": "昇格4",
            "description": "絶影攻撃を行った後、50%の固定確率で自身の速度+20%、2ターン継続。",
            "stat": "SPD_PERCENT",
            "value": 0.2,
            "duration": 2
        },
        {
            "id": "extra6_basic_slow_dmg",
            "source": "extra",
            "name": "昇格6",
            "description": "減速状態の敵に対する通常攻撃の与ダメージ+40%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "stat": "DMG_BASIC",
            "value": 0.4
        },
        {
            "id": "e1_high_hp_crit_rate",
            "source": "eidolon",
            "name": "極天窮尽するも 昂り保てず",
            "description": "攻撃した敵の残りHPが50%以上の場合、会心率+12%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 1,
            "stat": "CRIT_RATE",
            "value": 0.12
        }
    ],
    "partyEffects": [],
    "enemyEffects": []
});
