import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Fugue",
    "id": "fugue",
    "name": "帰忘の流離人",
    "element": "Fire",
    "elementLabel": "炎",
    "path": "Nihility",
    "rarity": 5,
    "base": {
        "hp": 1125,
        "atk": 582,
        "def": 557,
        "spd": 102
    },
    "maxEnergy": 130,
    "traceBonuses": [
        {
            "label": "速度",
            "value": 14
        },
        {
            "label": "撃破特効",
            "value": 0.24
        },
        {
            "label": "最大HP",
            "value": 0.1
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E5%B8%B0%E5%BF%98%E3%81%AE%E6%B5%81%E9%9B%A2%E4%BA%BA",
        "version": "2.7"
    },
    "skills": {
        "basic": {
            "name": "燦然たる日月の尾",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に帰忘の流離人の攻撃力X%分の炎属性ダメージを与える。",
            "levelColumns": [
                "燦然たる日月の尾",
                "緩緩たる熾炎"
            ],
            "levels": [
                {
                    "atk": 0.5,
                    "atkAlt2": 0.5
                },
                {
                    "atk": 0.6,
                    "atkAlt2": 0.6
                },
                {
                    "atk": 0.7,
                    "atkAlt2": 0.7
                },
                {
                    "atk": 0.8,
                    "atkAlt2": 0.8
                },
                {
                    "atk": 0.9,
                    "atkAlt2": 0.9
                },
                {
                    "atk": 1,
                    "atkAlt2": 1
                },
                {
                    "atk": 1.1,
                    "atkAlt2": 1.1
                }
            ]
        },
        "skill": {
            "name": "義を有せば吉兆を招く",
            "sourceHeader": "戦闘スキル",
            "type": "debuff",
            "target": "single_ally",
            "description": "[サポート]指定した味方単体に「狐の祈り」を付与し、自身は「灼熱」状態になる、3ターン継続。帰忘の流離人のターンが回ってくるたびに継続時間-1ターン。「狐の祈り」は最後に指定したスキルターゲットにのみ効果を発揮する。「狐の祈り」が付与されている味方の撃破特効+X%、かつ攻撃を行う際、対応する弱点属性を持たない敵の靭性値を、本来の削靭値50%分削る。この効果は、他の弱点属性を無視して靭性を削る効果を重ね掛けできない。帰忘の流離人が「灼熱」状態の時、通常攻撃「燦然たる日月の尾」が「緩緩たる熾炎」に強化される。「狐の祈り」が付与されている味方が攻撃を行う時、100%の基礎確率で攻撃を受ける敵の防御力-Y%、2ターン継続。なお、防御力ダウンの付与は帰忘の流離人が行ったものとして扱う。",
            "levelColumns": [
                "撃破特効アップ(X%)",
                "防御力ダウン(Y%)"
            ],
            "levels": [
                {
                    "value1": 0.15,
                    "defDown": 0.08
                },
                {
                    "value1": 0.16,
                    "defDown": 0.09
                },
                {
                    "value1": 0.18,
                    "defDown": 0.1
                },
                {
                    "value1": 0.19,
                    "defDown": 0.11
                },
                {
                    "value1": 0.21,
                    "defDown": 0.12
                },
                {
                    "value1": 0.22,
                    "defDown": 0.13
                },
                {
                    "value1": 0.24,
                    "defDown": 0.14
                },
                {
                    "value1": 0.26,
                    "defDown": 0.15
                },
                {
                    "value1": 0.28,
                    "defDown": 0.16
                },
                {
                    "value1": 0.3,
                    "defDown": 0.18
                },
                {
                    "value1": 0.315,
                    "defDown": 0.19
                },
                {
                    "value1": 0.33,
                    "defDown": 0.2
                }
            ],
            "inferredNotes": [
                "Lv.11 value1 は前後Lvから線形補完",
                "Lv.11 defDown は前後Lvから線形補完"
            ]
        },
        "ult": {
            "name": "極陽は遍く世を照らす",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "all",
            "description": "[全体攻撃]敵全体に帰忘の流離人の攻撃力X%分の炎属性ダメージを与え、弱点属性を無視して敵全体の靭性を削る。敵を弱点撃破する時、炎属性の弱点撃破効果を発動する。",
            "levelColumns": [
                "ダメージ倍率(X％)",
                "消費EP"
            ],
            "levels": [
                {
                    "atk": 1,
                    "energyCost": 130
                },
                {
                    "atk": 1.1
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
                    "atk": 1.62
                },
                {
                    "atk": 1.75
                },
                {
                    "atk": 1.87
                },
                {
                    "atk": 2
                },
                {
                    "atk": 2.1
                },
                {
                    "atk": 2.2
                }
            ],
            "inferredNotes": [
                "Lv.11 atk は前後Lvから線形補完"
            ]
        },
        "talent": {
            "name": "善満ちる所福来たる",
            "sourceHeader": "天賦",
            "type": "debuff",
            "target": "single",
            "description": "[妨害]帰忘の流離人がフィールドにいる時、敵は自身の最大靭性値40%分の「雲火昭瑞」を付与される。初期靭性が0まで削られた後、引き続き「雲火昭瑞」が削られる。「雲火昭瑞」が0まで削られた時、敵は再度弱点撃破ダメージを受ける。帰忘の流離人がフィールドにいる時、味方が弱点撃破状態の敵に攻撃を行った時、その回の攻撃の削靭値を1回のX%分の超撃破ダメージに転換する。",
            "levelColumns": [
                "超撃破ダメージ倍率(X%)"
            ],
            "levels": [
                {
                    "atk": 0.5
                },
                {
                    "atk": 0.55
                },
                {
                    "atk": 0.6
                },
                {
                    "atk": 0.65
                },
                {
                    "atk": 0.7
                },
                {
                    "atk": 0.75
                },
                {
                    "atk": 0.81
                },
                {
                    "atk": 0.87
                },
                {
                    "atk": 0.93
                },
                {
                    "atk": 1
                },
                {
                    "atk": 1.05
                },
                {
                    "atk": 1.1
                }
            ],
            "inferredNotes": [
                "Lv.11 atk は前後Lvから線形補完"
            ]
        },
        "technique": {
            "name": "照照たる光輝",
            "sourceHeader": "秘技",
            "type": "debuff",
            "target": "single",
            "description": "[妨害]秘技を使用した後、一定範囲内の敵を10秒間の目眩状態にする。目眩状態の敵は味方を攻撃しない。目眩状態の敵を先制攻撃して戦闘に入った後、帰忘の流離人は行動順が40%早まる。また、100%の基礎確率で敵それぞれに帰忘の流離人の戦闘スキルと同じ防御力ダウン状態を付与する。2ターン継続。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "青丘の重光味方が敵を弱点撃破した後、さらに敵の行動順を15%遅延させる。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "塗山の玄設自身の撃破特効+30%、初めて戦闘スキルを発動した後、SPを1回復する。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "璣星の太素敵が弱点撃破される時、自身以外の味方キャラの撃破特効+6%。帰忘の流離人の撃破特効が220%以上の場合、撃破特効アップの効果がさらに+12%。この効果は2ターン継続、最大で2層累積できる。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "狐塵とうに散り、雲を駕とすればその期あり",
            "description": "「狐の祈り」状態の味方の弱点撃破効率+50％。"
        },
        "2": {
            "name": "瑞応来れば、必ず有徳を明かす",
            "description": "敵が弱点撃破された時、帰忘の流離人はEPを3回復する。必殺技を発動した後、味方全体の行動順が24%早まる。"
        },
        "3": {
            "name": "正色の鴻寿、神思は化して伐つ",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "自我形を離れ、今や数多の姓となる",
            "description": "「狐の祈り」状態の味方の弱点撃破ダメージ+20%。"
        },
        "5": {
            "name": "五色の雲、蒼穹は後を施す",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "肇めて未来を悟り、明暗の興亡を知る",
            "description": "帰忘の流離人の弱点撃破効率+50%。帰忘の流離人が「灼熱」状態の時、「狐の祈り」が味方全体に効果を発揮するようになる。"
        }
    },
    "partyEffects": [
        {
            "id": "skill_break_effect",
            "source": "skill",
            "name": "義を有せば吉兆を招く",
            "description": "[サポート]指定した味方単体に「狐の祈り」を付与し、自身は「灼熱」状態になる、3ターン継続。帰忘の流離人のターンが回ってくるたびに継続時間-1ターン。「狐の祈り」は最後に指定したスキルターゲットにのみ効果を発揮する。「狐の祈り」が付与されている味方の撃破特効+X%、かつ攻撃を行う際、対応する弱点属性を持たない敵の靭性値を、本来の削靭値50%分削る。この効果は、他の弱点属性を無視して靭性を削る効果を重ね掛けできない。帰忘の流離人が「灼熱」状態の時、通常攻撃「燦然たる日月の尾」が「緩緩たる熾炎」に強化される。「狐の祈り」が付与されている味方が攻撃を行う時、100%の基礎確率で攻撃を受ける敵の防御力-Y%、2ターン継続。なお、防御力ダウンの付与は帰忘の流離人が行ったものとして扱う。",
            "defaultActive": false,
            "target": "single",
            "duration": 3,
            "fromLevel": "skill",
            "stat": "BREAK_EFFECT",
            "statField": "value1"
        },
        {
            "id": "skill_def_down_mirror",
            "source": "skill",
            "name": "義を有せば吉兆を招く (火力計算用)",
            "description": "[サポート]指定した味方単体に「狐の祈り」を付与し、自身は「灼熱」状態になる、3ターン継続。帰忘の流離人のターンが回ってくるたびに継続時間-1ターン。「狐の祈り」は最後に指定したスキルターゲットにのみ効果を発揮する。「狐の祈り」が付与されている味方の撃破特効+X%、かつ攻撃を行う際、対応する弱点属性を持たない敵の靭性値を、本来の削靭値50%分削る。この効果は、他の弱点属性を無視して靭性を削る効果を重ね掛けできない。帰忘の流離人が「灼熱」状態の時、通常攻撃「燦然たる日月の尾」が「緩緩たる熾炎」に強化される。「狐の祈り」が付与されている味方が攻撃を行う時、100%の基礎確率で攻撃を受ける敵の防御力-Y%、2ターン継続。なお、防御力ダウンの付与は帰忘の流離人が行ったものとして扱う。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "single",
            "duration": 3,
            "fromLevel": "skill",
            "stat": "DEF_DOWN",
            "statField": "defDown"
        },
        {
            "id": "extra6_break_effect_base",
            "source": "extra",
            "name": "昇格6",
            "description": "敵が弱点撃破される時、自身以外の味方キャラの撃破特効+6%。2ターン継続、最大2層。",
            "defaultActive": false,
            "target": "all",
            "duration": 2,
            "stat": "BREAK_EFFECT",
            "value": 0.06,
            "stackable": {
                "max": 2,
                "default": 2
            }
        },
        {
            "id": "extra6_break_effect_high_be",
            "source": "extra",
            "name": "昇格6",
            "description": "帰忘の流離人の撃破特効が220%以上の場合、撃破特効アップの効果がさらに+12%。2ターン継続、最大2層。",
            "defaultActive": false,
            "target": "all",
            "duration": 2,
            "stat": "BREAK_EFFECT",
            "value": 0.12,
            "stackable": {
                "max": 2,
                "default": 2
            }
        }
    ],
    "enemyEffects": [
        {
            "id": "skill_def_down",
            "source": "skill",
            "name": "義を有せば吉兆を招く",
            "description": "[サポート]指定した味方単体に「狐の祈り」を付与し、自身は「灼熱」状態になる、3ターン継続。帰忘の流離人のターンが回ってくるたびに継続時間-1ターン。「狐の祈り」は最後に指定したスキルターゲットにのみ効果を発揮する。「狐の祈り」が付与されている味方の撃破特効+X%、かつ攻撃を行う際、対応する弱点属性を持たない敵の靭性値を、本来の削靭値50%分削る。この効果は、他の弱点属性を無視して靭性を削る効果を重ね掛けできない。帰忘の流離人が「灼熱」状態の時、通常攻撃「燦然たる日月の尾」が「緩緩たる熾炎」に強化される。「狐の祈り」が付与されている味方が攻撃を行う時、100%の基礎確率で攻撃を受ける敵の防御力-Y%、2ターン継続。なお、防御力ダウンの付与は帰忘の流離人が行ったものとして扱う。",
            "defaultActive": false,
            "target": "single",
            "duration": 3,
            "fromLevel": "skill",
            "stat": "DEF_DOWN",
            "statField": "defDown"
        }
    ],
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "extra4_break_effect",
            "source": "extra",
            "name": "昇格4",
            "description": "塗山の玄設自身の撃破特効+30%、初めて戦闘スキルを発動した後、SPを1回復する。",
            "stat": "BREAK_EFFECT",
            "value": 0.3
        }
    ]
});
