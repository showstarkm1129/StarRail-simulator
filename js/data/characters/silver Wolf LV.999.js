import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Silver Wolf LV.999",
    "id": "silver_wolf_lv_999",
    "name": "銀狼LV.999",
    "element": "Imaginary",
    "elementLabel": "虚数",
    "path": "Elation",
    "rarity": 5,
    "base": {
        "hp": 1047,
        "atk": 388,
        "def": 654,
        "spd": 110
    },
    "maxEnergy": null,
    "traceBonuses": [
        {
            "label": "会心率",
            "value": 0.187
        },
        {
            "label": "速度",
            "value": 9
        },
        {
            "label": "愉悦度",
            "value": 0.1
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E9%8A%80%E7%8B%BCLV.999",
        "version": "4.2"
    },
    "skills": {
        "basic": {
            "name": "鉄拳制裁！",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に「銀狼LV.999」の攻撃力X%分の虚数属性ダメージを与える。",
            "levelColumns": [
                "鉄拳制裁！",
                "ボーナスステージ「ウルフロードタイム」"
            ],
            "levels": [
                {
                    "atk": 0.5,
                    "atkAlt2": 1.2
                },
                {
                    "atk": 0.6,
                    "atkAlt2": 1.44
                },
                {
                    "atk": 0.7,
                    "atkAlt2": 1.68
                },
                {
                    "atk": 0.8,
                    "atkAlt2": 1.92
                },
                {
                    "atk": 0.9,
                    "atkAlt2": 2.16
                },
                {
                    "atk": 1,
                    "atkAlt2": 2.4
                },
                {
                    "atk": 1.1,
                    "atkAlt2": 2.64
                }
            ]
        },
        "skill": {
            "name": "Shootモードオン",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]爆笑ネタを5個獲得し、敵全体に「銀狼LV.999」の攻撃力X%分の虚数属性ダメージを与える。",
            "levelColumns": [
                "全体ダメージ倍率(X%)"
            ],
            "levels": [
                {
                    "atk": 0.8
                },
                {
                    "atk": 0.88
                },
                {
                    "atk": 0.96
                },
                {
                    "atk": 1.04
                },
                {
                    "atk": 1.12
                },
                {
                    "atk": 1.2
                },
                {
                    "atk": 1.3
                },
                {
                    "atk": 1.4
                },
                {
                    "atk": 1.5
                },
                {
                    "atk": 1.6
                },
                {
                    "atk": 1.68
                },
                {
                    "atk": 1.76
                }
            ],
            "inferredNotes": [
                "Lv.11 atk は前後Lvから線形補完"
            ]
        },
        "ult": {
            "name": "無敵プレイヤー、ゲームスタート！",
            "sourceHeader": "必殺技",
            "type": "heal",
            "target": "all",
            "description": "[強化]「無敵プレイヤー」状態となり、行動順が100%早まる。「無敵プレイヤー」状態中、結界を展開する。「銀狼LV.999」が「爆笑の褒美」を持つ時、結界内にいる味方がSPを1消費するごとに、確率で「銀狼LV.999」の「SSSサプライボックス」が1回発動する。発動時、X%分の虚数属性の愉悦ダメージを敵全体に均等に分けて与える。さらにランダムで以下の効果を1つ発動する。・「スーパー・グレートソード」：残りHPが最も高い敵に、今回の総ダメージ20%分の確定ダメージを追加で与える。・「ウルトラ・エッグボンバー」：SPを2回復する。・「ストレンジ・ビーン」：爆笑ネタを3個獲得する。この効果が発動する初期の固定確率は100%。発動するたび、次に発動する際の固定確率が現在の固定確率の20%になる。発動前にターゲットが倒れた場合、新たに登場した敵に対して発動する。",
            "levelColumns": [
                "全体愉悦ダメージ倍率(X%)",
                "スキル消費"
            ],
            "levels": [
                {
                    "hpPct": 0.45,
                    "value2": 60
                },
                {
                    "hpPct": 0.5
                },
                {
                    "hpPct": 0.54
                },
                {
                    "hpPct": 0.59
                },
                {
                    "hpPct": 0.63
                },
                {
                    "hpPct": 0.68
                },
                {
                    "hpPct": 0.73
                },
                {
                    "hpPct": 0.79
                },
                {
                    "hpPct": 0.84
                },
                {
                    "hpPct": 0.9
                },
                {
                    "hpPct": 0.945
                },
                {
                    "hpPct": 0.99
                }
            ],
            "inferredNotes": [
                "Lv.11 hpPct は前後Lvから線形補完"
            ]
        },
        "愉悦スキル": {
            "name": "殿堂入り操作リプレイ",
            "sourceHeader": "愉悦スキル",
            "type": "buff",
            "target": "single",
            "description": "[強化]「シークレットスコア」を15獲得する。",
            "levelColumns": [
                "崩壊級ダメージ実演"
            ],
            "levels": [
                {
                    "atk": 0.45
                },
                {
                    "atk": 0.5
                },
                {
                    "atk": 0.54
                },
                {
                    "atk": 0.59
                },
                {
                    "atk": 0.63
                },
                {
                    "atk": 0.68
                },
                {
                    "atk": 0.73
                },
                {
                    "atk": 0.79
                },
                {
                    "atk": 0.84
                },
                {
                    "atk": 0.9
                },
                {
                    "atk": 0.945
                },
                {
                    "atk": 0.99
                }
            ],
            "inferredNotes": [
                "Lv.11 atk は前後Lvから線形補完"
            ]
        },
        "talent": {
            "name": "私がいればヌルゲー",
            "sourceHeader": "天賦",
            "type": "attack",
            "target": "single",
            "description": "[強化]「シークレットスコア」が60に達した後、必殺技を発動できる。「シークレットスコア」は上限を超えても、最大240まで累積できる。爆笑ネタを獲得した時、「銀狼LV.999」は同量の「シークレットスコア」を獲得する。「シークレットスコア」が1につき、会心率+X%。会心率が100%に達した後、残りの「シークレットスコア」が1につき、代わりに会心ダメージ+Y%。「無敵プレイヤー」状態の時、「銀狼LV.999」は行動制限系デバフに抵抗でき、必殺技を発動できなくなる代わりに、強化通常攻撃「ボーナスステージ『ウルフタイムロード』」と強化愉悦スキル「崩壊級ダメージ実演」を発動できる。強化通常攻撃を3回最後まで発動した後、「無敵プレイヤー」状態は解除される。「無敵プレイヤー」状態が解除される時、「シークレットスコア」はクリアされる。「爆笑の褒美」を持つ時、通常攻撃、戦闘スキルを発動すると、攻撃を受けた敵にZ%分の虚数属性の愉悦ダメージを与える。また、強化通常攻撃のスキルダメージは同じ倍率の愉悦ダメージに変わる。",
            "levelColumns": [
                "会心率アップ(X%)",
                "会心ダメージアップ(Y%)",
                "愉悦ダメージ倍率(Z%)"
            ],
            "levels": [
                {
                    "critRateBuff": 0.002,
                    "cdBuff": 0.004,
                    "atk": 0.2
                },
                {
                    "critRateBuff": 0.0022,
                    "cdBuff": 0.0044,
                    "atk": 0.22
                },
                {
                    "critRateBuff": 0.0024,
                    "cdBuff": 0.0048,
                    "atk": 0.24
                },
                {
                    "critRateBuff": 0.0026,
                    "cdBuff": 0.0052,
                    "atk": 0.26
                },
                {
                    "critRateBuff": 0.0028,
                    "cdBuff": 0.0056,
                    "atk": 0.28
                },
                {
                    "critRateBuff": 0.003,
                    "cdBuff": 0.006,
                    "atk": 0.3
                },
                {
                    "critRateBuff": 0.0033,
                    "cdBuff": 0.0065,
                    "atk": 0.32
                },
                {
                    "critRateBuff": 0.0035,
                    "cdBuff": 0.007,
                    "atk": 0.35
                },
                {
                    "critRateBuff": 0.0038,
                    "cdBuff": 0.0075,
                    "atk": 0.38
                },
                {
                    "critRateBuff": 0.004,
                    "cdBuff": 0.008,
                    "atk": 0.4
                },
                {
                    "critRateBuff": 0.0042,
                    "cdBuff": 0.0084,
                    "atk": 0.42
                },
                {
                    "critRateBuff": 0.0044,
                    "cdBuff": 0.0088,
                    "atk": 0.44
                }
            ],
            "inferredNotes": [
                "Lv.11 critRateBuff は前後Lvから線形補完",
                "Lv.11 cdBuff は前後Lvから線形補完",
                "Lv.11 atk は前後Lvから線形補完"
            ]
        },
        "technique": {
            "name": "これがTier0の秘技だよ",
            "sourceHeader": "秘技",
            "type": "summon",
            "target": "single",
            "description": "[召喚]「ストレンジ・ビーン」を召喚する。再度秘技を使用すると召喚が解除される。秘技を使用しても秘技PTは消費されず、秘技PTが0になると召喚を解除し、秘技を使用できなくなる。「ストレンジ・ビーン」は一定範囲内の通常エネミーを恐怖状態にする。同時に、自動で通常エネミーを索敵および攻撃し、秘技PTを1消費して戦闘に入ることなく即座に倒す。「ストレンジ・ビーン」がマップにいる場合、戦闘に入った後、各ウェーブ開始時に「ストレンジ・ビーン」に対応する「SSSサプライボックス」を1回発動する。なお、この効果による愉悦ダメージは「爆笑の褒美」を固定で99カウントする。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "偽エンディングのRTA攻略速度が160以上の時、自身の愉悦度+50%。なお、超過した速度1につき、さらに自身の愉悦度+2%。超過した速度は最大100までカウントされる。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "トゥルーエンドの解放条件愉悦スキル発動時にカウントされた爆笑ネタが20個以上の場合、追加で「シークレットスコア」を20獲得する。また、カウントされた爆笑ネタが40個以上の場合、さらに追加で「シークレットスコア」を20獲得する。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "隠しステージ実績全収集「無敵プレイヤー」状態になった後、「シークレットスコア」を20獲得する。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "エーテル編集：星魂+1",
            "description": "結界内にいる敵の受けるダメージ+20%。「無敵プレイヤー」状態を解除する時、「シークレットスコア」はクリアされず、20%の「シークレットスコア」が維持される。"
        },
        "2": {
            "name": "バグじゃなくて仕様",
            "description": "「無敵プレイヤー」状態になった後、自身のすべてのバフを1ターン延長する。この回の「無敵プレイヤー」状態で「シークレットスコア」（初期の「シークレットスコア」を含む）が120増えるごとに、「銀狼LV.999」は追加ターンを1つ獲得し、強化通常攻撃の発動可能回数を1回復する。"
        },
        "3": {
            "name": "LV.15でMAX？設計者だれ？",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。愉悦スキルのLv.+1、最大Lv.15まで。"
        },
        "4": {
            "name": "来た、見た、そして…瞬殺した",
            "description": "「崩壊級ダメージ実演」が与える愉悦ダメージに、追加で5倍の爆笑ネタがカウントされる。"
        },
        "5": {
            "name": "通常攻撃でも必殺技レベル",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。愉悦スキルのLv.+1、最大Lv.15まで。"
        },
        "6": {
            "name": "私だけカンストな件！",
            "description": "強化通常攻撃の間、与える愉悦ダメージが50%上笑する。敵が戦闘に入る時、「禁忌の弱点」状態が付与される。この状態の敵は全属性の弱点を持ち、かつ全属性の基礎耐性が0まで下がる（すでに基礎耐性が0の場合、代わりにその属性耐性-20%）。"
        }
    },
    "partyEffects": [
        {
            "id": "e1_dmg_taken_mirror",
            "source": "eidolon",
            "name": "エーテル編集：星魂+1 (火力計算用)",
            "description": "結界内にいる敵の受けるダメージ+20%。「無敵プレイヤー」状態を解除する時、「シークレットスコア」はクリアされず、20%の「シークレットスコア」が維持される。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 1,
            "stat": "DMG_TAKEN",
            "value": 0.2
        },
        {
            "id": "e6_res_down_mirror",
            "source": "eidolon",
            "name": "私だけカンストな件！ (火力計算用)",
            "description": "強化通常攻撃の間、与える愉悦ダメージが50%上笑する。敵が戦闘に入る時、「禁忌の弱点」状態が付与される。この状態の敵は全属性の弱点を持ち、かつ全属性の基礎耐性が0まで下がる（すでに基礎耐性が0の場合、代わりにその属性耐性-20%）。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 6,
            "stat": "RES_PEN",
            "value": 0.2
        }
    ],
    "enemyEffects": [
        {
            "id": "e1_dmg_taken",
            "source": "eidolon",
            "name": "エーテル編集：星魂+1",
            "description": "結界内にいる敵の受けるダメージ+20%。「無敵プレイヤー」状態を解除する時、「シークレットスコア」はクリアされず、20%の「シークレットスコア」が維持される。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 1,
            "stat": "DMG_TAKEN",
            "value": 0.2
        },
        {
            "id": "e6_res_down",
            "source": "eidolon",
            "name": "私だけカンストな件！",
            "description": "強化通常攻撃の間、与える愉悦ダメージが50%上笑する。敵が戦闘に入る時、「禁忌の弱点」状態が付与される。この状態の敵は全属性の弱点を持ち、かつ全属性の基礎耐性が0まで下がる（すでに基礎耐性が0の場合、代わりにその属性耐性-20%）。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 6,
            "stat": "RES_PEN",
            "value": 0.2
        }
    ]
});
