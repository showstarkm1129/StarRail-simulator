import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Dan Heng • Permansor Terrae",
    "id": "dan_heng_permansor_terrae",
    "name": "丹恒・騰荒",
    "element": "Physical",
    "elementLabel": "物理",
    "path": "Preservation",
    "rarity": 5,
    "base": {
        "hp": 1047,
        "atk": 582,
        "def": 776,
        "spd": 97
    },
    "maxEnergy": 135,
    "traceBonuses": [
        {
            "label": "攻撃力",
            "value": 0.28
        },
        {
            "label": "防御力",
            "value": 0.225
        },
        {
            "label": "速度",
            "value": 5
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E4%B8%B9%E6%81%92%E3%83%BB%E9%A8%B0%E8%8D%92",
        "version": "3.6"
    },
    "skills": {
        "basic": {
            "name": "悪を鎮め、生を護る",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に丹恒・騰荒の攻撃力X%分の物理属性ダメージを与える。",
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
            "name": "屹立する山岳、八荒を支える大地",
            "sourceHeader": "戦闘スキル",
            "type": "shield",
            "target": "all_ally",
            "description": "[防御]指定した味方キャラ単体を「同袍」にし、味方全体に丹恒・騰荒の攻撃力X%+Yの耐久値を持つバリアを付与する、3ターン継続。丹恒・騰荒のバリアを重複して獲得する時、バリア耐久値は累積される。このバリアの耐久値は、戦闘スキルが付与できるバリアの300%を超えない。「同袍」は丹恒・騰荒が最後に戦闘スキルを使用した対象にのみ有効。",
            "levelColumns": [
                "バリア耐久値(X%+Y)"
            ],
            "levels": [
                {
                    "shieldPct": 0.14,
                    "shieldFlat": 100
                },
                {
                    "shieldPct": 0.148,
                    "shieldFlat": 160
                },
                {
                    "shieldPct": 0.155,
                    "shieldFlat": 205
                },
                {
                    "shieldPct": 0.162,
                    "shieldFlat": 250
                },
                {
                    "shieldPct": 0.17,
                    "shieldFlat": 280
                },
                {
                    "shieldPct": 0.176,
                    "shieldFlat": 310
                },
                {
                    "shieldPct": 0.182,
                    "shieldFlat": 332
                },
                {
                    "shieldPct": 0.188,
                    "shieldFlat": 355
                },
                {
                    "shieldPct": 0.194,
                    "shieldFlat": 377
                },
                {
                    "shieldPct": 0.2,
                    "shieldFlat": 400
                },
                {
                    "shieldPct": 0.21,
                    "shieldFlat": 422
                },
                {
                    "shieldPct": 0.22,
                    "shieldFlat": 445
                }
            ]
        },
        "ult": {
            "name": "悔いなき亢龍、天地を拓く",
            "sourceHeader": "必殺技",
            "type": "follow_up",
            "target": "all",
            "description": "[全体攻撃]敵全体に丹恒・騰荒の攻撃力X%分の物理属性ダメージを与え、味方全体に丹恒・騰荒の攻撃力Y%+Zの耐久値を持つバリアを付与する、3ターン継続。丹恒・騰荒のバリアを重複して獲得する時、このバリア耐久値は累積される。このバリアの耐久値は、戦闘スキルが付与できるバリア耐久値300%を超えない。「龍霊」を強化する。「龍霊」は行動する時、追加攻撃を行い、敵全体に丹恒・騰荒の攻撃力W%分の物理属性ダメージと、「同袍」の攻撃力S%分、かつ対応する属性の付加ダメージを与える。この強化は「龍霊」が2回行動するまで継続される。",
            "levelColumns": [
                "全体ダメージ倍率(X％)",
                "バリア耐久値(Y%+Z)",
                "追加攻撃ダメージ倍率(W%)",
                "付加ダメージ(S%)",
                "消費EP"
            ],
            "levels": [
                {
                    "atkAll": 1.5,
                    "shieldPct": 0.14,
                    "shieldFlat": 100,
                    "atkExtra": 0.4,
                    "atk": 0.4,
                    "energyCost": 135
                },
                {
                    "atkAll": 1.65,
                    "shieldPct": 0.148,
                    "shieldFlat": 160,
                    "atkExtra": 0.44,
                    "atk": 0.44
                },
                {
                    "atkAll": 1.8,
                    "shieldPct": 0.155,
                    "shieldFlat": 205,
                    "atkExtra": 0.48,
                    "atk": 0.48
                },
                {
                    "atkAll": 1.95,
                    "shieldPct": 0.162,
                    "shieldFlat": 250,
                    "atkExtra": 0.52,
                    "atk": 0.52
                },
                {
                    "atkAll": 2.1,
                    "shieldPct": 0.17,
                    "shieldFlat": 280,
                    "atkExtra": 0.56,
                    "atk": 0.56
                },
                {
                    "atkAll": 2.25,
                    "shieldPct": 0.176,
                    "shieldFlat": 310,
                    "atkExtra": 0.6,
                    "atk": 0.6
                },
                {
                    "atkAll": 2.43,
                    "shieldPct": 0.182,
                    "shieldFlat": 332,
                    "atkExtra": 0.65,
                    "atk": 0.65
                },
                {
                    "atkAll": 2.62,
                    "shieldPct": 0.188,
                    "shieldFlat": 355,
                    "atkExtra": 0.7,
                    "atk": 0.7
                },
                {
                    "atkAll": 2.81,
                    "shieldPct": 0.194,
                    "shieldFlat": 377,
                    "atkExtra": 0.75,
                    "atk": 0.75
                },
                {
                    "atkAll": 3,
                    "shieldPct": 0.2,
                    "shieldFlat": 400,
                    "atkExtra": 0.8,
                    "atk": 0.8
                },
                {
                    "atkAll": 3.15,
                    "shieldPct": 0.21,
                    "shieldFlat": 422,
                    "atkExtra": 0.84,
                    "atk": 0.84
                },
                {
                    "atkAll": 3.3,
                    "shieldPct": 0.22,
                    "shieldFlat": 445,
                    "atkExtra": 0.88,
                    "atk": 0.88
                }
            ]
        },
        "talent": {
            "name": "生は尊く、万物は流転す",
            "sourceHeader": "天賦",
            "type": "debuff",
            "target": "single",
            "description": "[防御]味方キャラが「同袍」になった時、丹恒・騰荒はその味方に「龍霊」を召喚する。「龍霊」の初期速度は165。「龍霊」が行動する時、味方それぞれのデバフを1つ解除し、丹恒・騰荒の攻撃力X%+Yの耐久値を持つバリアを付与する、3ターン継続。丹恒・騰荒と「龍霊」が付与するバリアの耐久値は累積できるが、丹恒・騰荒の戦闘スキルが付与できるバリア耐久値の300%を超えない。丹恒・騰荒または「同袍」が戦闘不能状態になった時「龍霊」は退場する。",
            "levelColumns": [
                "バリア耐久値(X%+Y)"
            ],
            "levels": [
                {
                    "shieldPct": 0.07,
                    "shieldFlat": 50
                },
                {
                    "shieldPct": 0.074,
                    "shieldFlat": 80
                },
                {
                    "shieldPct": 0.078,
                    "shieldFlat": 102
                },
                {
                    "shieldPct": 0.081,
                    "shieldFlat": 125
                },
                {
                    "shieldPct": 0.085,
                    "shieldFlat": 140
                },
                {
                    "shieldPct": 0.088,
                    "shieldFlat": 155
                },
                {
                    "shieldPct": 0.091,
                    "shieldFlat": 166
                },
                {
                    "shieldPct": 0.094,
                    "shieldFlat": 177
                },
                {
                    "shieldPct": 0.097,
                    "shieldFlat": 188
                },
                {
                    "shieldPct": 0.1,
                    "shieldFlat": 200
                },
                {
                    "shieldPct": 0.105,
                    "shieldFlat": 211
                },
                {
                    "shieldPct": 0.11,
                    "shieldFlat": 223
                }
            ]
        },
        "technique": {
            "name": "地割れ",
            "sourceHeader": "秘技",
            "type": "debuff",
            "target": "single",
            "description": "[妨害]秘技を使用すると「同袍」を獲得し、一定範囲内の敵を10秒間目眩状態にする。目眩状態の敵は味方を攻撃しない。キャラを切り替えると「同袍」は現在行動中のキャラに移る。次の戦闘開始時、「同袍」を所持しているキャラに戦闘スキルを自動で1回発動する。この発動ではSPを消費しない。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "偉観戦闘スキルを発動する時、「同袍」になったターゲットの攻撃力は丹恒・騰荒の攻撃力15%分アップする。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "百花戦闘開始時、丹恒・騰荒の行動順が40%早まる。「同袍」が攻撃を行う時、丹恒・騰荒がEPを6回復し、「龍霊」の行動順が15%早まる。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "屹立「龍霊」は行動時、バリア耐久値が最も低い味方に丹恒・騰荒の攻撃力5%+100の耐久値を持つバリアを追加で付与する。丹恒・騰荒のバリアを重複して獲得した時、バリア耐久値は累積される。このバリアの耐久値は、戦闘スキルが付与できるバリア耐久値の300%を超えない。強化後の「龍霊」は行動時、残りHPが最も高い敵単体に「同袍」の攻撃力40%分、かつ対応する属性付加ダメージを追加で1回与える。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "旧き鱗を捨てた荒龍",
            "description": "丹恒・騰荒が必殺技を発動する時、SPを1回復し、「同袍」の全属性耐性貫通+18%、3ターン継続。"
        },
        "2": {
            "name": "開拓を見守る純真",
            "description": "必殺技による龍霊強化において、効果が継続する行動可能回数+2回。丹恒・騰荒が必殺技を発動した後、「龍霊」の行動順が100%早まる。強化後の「龍霊」が行動する時、「同袍」による付加ダメージは本来の200%分になり、その回で付与するバリア耐久値は本来の200%分になる。"
        },
        "3": {
            "name": "山河より託されしもの",
            "description": "必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "金石に誓いて身を船に",
            "description": "「同袍」の受けるダメージ-20%。"
        },
        "5": {
            "name": "不朽の道は連綿たり",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "草木も塵も夢に入れ",
            "description": "フィールド上に「同袍」がいる場合、敵全体の受けるダメージ+20%。「同袍」がダメージを与える時、敵の防御力を12%分無視する。丹恒・騰荒が必殺技を発動した時、「同袍」は敵全体に自身の攻撃力330%分、かつ対応する属性の付加ダメージを与える。"
        }
    },
    "partyEffects": [
        {
            "id": "e6_dmg_taken_mirror",
            "source": "eidolon",
            "name": "草木も塵も夢に入れ (火力計算用)",
            "description": "フィールド上に「同袍」がいる場合、敵全体の受けるダメージ+20%。「同袍」がダメージを与える時、敵の防御力を12%分無視する。丹恒・騰荒が必殺技を発動した時、「同袍」は敵全体に自身の攻撃力330%分、かつ対応する属性の付加ダメージを与える。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "all",
            "duration": "conditional",
            "minEidolon": 6,
            "stat": "DMG_TAKEN",
            "value": 0.2
        },
        {
            "id": "e1_ally_res_pen",
            "source": "eidolon",
            "name": "旧き鱗を捨てた荒龍",
            "description": "丹恒・騰荒が必殺技を発動する時、「同袍」の全属性耐性貫通+18%、3ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 3,
            "minEidolon": 1,
            "stat": "RES_PEN",
            "value": 0.18
        }
    ],
    "enemyEffects": [
        {
            "id": "e6_dmg_taken",
            "source": "eidolon",
            "name": "草木も塵も夢に入れ",
            "description": "フィールド上に「同袍」がいる場合、敵全体の受けるダメージ+20%。「同袍」がダメージを与える時、敵の防御力を12%分無視する。丹恒・騰荒が必殺技を発動した時、「同袍」は敵全体に自身の攻撃力330%分、かつ対応する属性の付加ダメージを与える。",
            "defaultActive": false,
            "target": "all",
            "duration": "conditional",
            "minEidolon": 6,
            "stat": "DMG_TAKEN",
            "value": 0.2
        }
    ],
    "selfEffects": []
});
