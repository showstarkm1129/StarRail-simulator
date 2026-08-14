import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Archer",
    "id": "archer",
    "name": "アーチャー",
    "element": "Quantum",
    "elementLabel": "量子",
    "path": "The Hunt",
    "rarity": 5,
    "base": {
        "hp": 1164,
        "atk": 620,
        "def": 485,
        "spd": 105
    },
    "maxEnergy": 220,
    "traceBonuses": [
        {
            "label": "量子ダメージ",
            "value": 0.224
        },
        {
            "label": "攻撃力",
            "value": 0.18
        },
        {
            "label": "会心率",
            "value": 0.067
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%82%A2%E3%83%BC%E3%83%81%E3%83%A3%E3%83%BC",
        "version": "3.4"
    },
    "skills": {
        "basic": {
            "name": "干将・莫耶",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にアーチャーの攻撃力X%分の量子属性ダメージを与える。",
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
            "name": "偽・螺旋剣(カラドボルグⅡ)",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]「回路接続」状態に入る。指定した敵単体にアーチャーの攻撃力X%分の量子属性ダメージを与える。「回路接続」状態の時、戦闘スキルを発動してもターンは終了しない。また、アーチャーの戦闘スキルによるダメージ+Y%、この効果は「回路接続」状態が解除されるまで最大で2層累積できる。戦闘スキルを5回発動した後、またはSPが不足し、再度戦闘スキルを発動できなくなった時、「回路接続」状態は解除される。また、各ウェーブの敵がすべて倒された後も、「回路接続」状態は解除される。",
            "levelColumns": [
                "ダメージ倍率(X％)",
                "ダメージアップ(Y%)"
            ],
            "levels": [
                {
                    "atk": 1.8,
                    "atk2": 0.6
                },
                {
                    "atk": 1.98,
                    "atk2": 0.64
                },
                {
                    "atk": 2.16,
                    "atk2": 0.68
                },
                {
                    "atk": 2.34,
                    "atk2": 0.72
                },
                {
                    "atk": 2.52,
                    "atk2": 0.76
                },
                {
                    "atk": 2.7,
                    "atk2": 0.8
                },
                {
                    "atk": 2.92,
                    "atk2": 0.85
                },
                {
                    "atk": 3.15,
                    "atk2": 0.9
                },
                {
                    "atk": 3.37,
                    "atk2": 0.95
                },
                {
                    "atk": 3.6,
                    "atk2": 1
                },
                {
                    "atk": 3.78,
                    "atk2": 1.04
                },
                {
                    "atk": 3.96,
                    "atk2": 1.08
                }
            ]
        },
        "ult": {
            "name": "無限の剣製(Unlimited Blade Works)",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にアーチャーの攻撃力X%分の量子属性ダメージを与え、チャージを2獲得する。チャージは最大で4累積できる。",
            "levelColumns": [
                "ダメージ倍率(X%)",
                "消費EP"
            ],
            "levels": [
                {
                    "atk": 6,
                    "energyCost": 220
                },
                {
                    "atk": 6.4
                },
                {
                    "atk": 6.8
                },
                {
                    "atk": 7.2
                },
                {
                    "atk": 7.6
                },
                {
                    "atk": 8
                },
                {
                    "atk": 8.5
                },
                {
                    "atk": 9
                },
                {
                    "atk": 9.5
                },
                {
                    "atk": 10
                },
                {
                    "atk": 10.4
                },
                {
                    "atk": 10.8
                }
            ]
        },
        "talent": {
            "name": "心眼(真)",
            "sourceHeader": "天賦",
            "type": "follow_up",
            "target": "single",
            "description": "[単体攻撃]アーチャー以外の味方が敵に攻撃を行った後、アーチャーが即座にチャージを1消費してメインターゲットに追加攻撃を行い、アーチャーの攻撃力X%分の量子属性ダメージを与える。この時SPを1回復する。この追加攻撃を行う前にターゲットが倒された場合、ランダムな敵単体に追加攻撃を行う。",
            "levelColumns": [
                "ダメージ倍率(X%)"
            ],
            "levels": [
                {
                    "atk": 1
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
            ]
        },
        "technique": {
            "name": "千里眼",
            "sourceHeader": "秘技",
            "type": "attack",
            "target": "all",
            "description": "敵を攻撃。戦闘に入った後、敵全体にアーチャーの攻撃力200%分の量子属性ダメージを与える、チャージを1獲得する。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "投影魔術アーチャーがフィールド上にいる時、最大SP+2。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "正義の味方アーチャーが戦闘に入る時、チャージを1獲得する。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "守護者味方がSPを獲得した後、SPが4以上の場合、アーチャーの会心ダメージ+120%、1ターン継続。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "触れられなかった理想",
            "description": "戦闘スキルを1ターンに3回発動した後、SPを2回復する。"
        },
        "2": {
            "name": "叶えられなかった幸福",
            "description": "必殺技を発動する時、ターゲットの量子属性耐性-20%、さらに量子属性弱点を付与する、2ターン継続。"
        },
        "3": {
            "name": "凡庸に甘んじない気概",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "英雄とは程遠い生涯",
            "description": "必殺技ダメージ+150%。"
        },
        "5": {
            "name": "無銘なる孤影の守護",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "果てなきを彷徨う巡礼",
            "description": "ターンが回ってきた時、SPを1回復する。自身の戦闘スキルで累積できるダメージアップ効果+1層。戦闘スキルダメージは防御力を20%無視する。"
        }
    },
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "extra6_crit_dmg",
            "source": "extra",
            "name": "昇格6",
            "description": "守護者味方がSPを獲得した後、SPが4以上の場合、アーチャーの会心ダメージ+120%、1ターン継続。",
            "stat": "CRIT_DMG",
            "value": 1.2,
            "duration": 1
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e6_skill_def_ignore",
            "source": "eidolon",
            "name": "果てなきを彷徨う巡礼",
            "description": "ターンが回ってきた時、SPを1回復する。自身の戦闘スキルで累積できるダメージアップ効果+1層。戦闘スキルダメージは防御力を20%無視する。",
            "stat": "DEF_IGNORE_SKILL",
            "value": 0.2,
            "minEidolon": 6
        },
        {
            "id": "skill_loop_dmg",
            "source": "skill",
            "name": "偽・螺旋剣(回路接続)",
            "description": "「回路接続」状態の時、アーチャーの戦闘スキルによるダメージ+Y%。最大2層。",
            "defaultActive": false,
            "target": "single",
            "fromLevel": "skill",
            "stat": "DMG_SKILL",
            "statField": "atk2",
            "stackable": {
                "max": 2,
                "default": 2
            }
        },
        {
            "id": "e6_skill_dmg_extra_stack",
            "source": "eidolon",
            "name": "果てなきを彷徨う巡礼",
            "description": "自身の戦闘スキルで累積できるダメージアップ効果+1層。3層目を手動で加算するための枠。",
            "defaultActive": false,
            "target": "single",
            "minEidolon": 6,
            "fromLevel": "skill",
            "stat": "DMG_SKILL",
            "statField": "atk2"
        },
        {
            "id": "e4_ult_dmg",
            "source": "eidolon",
            "name": "英雄とは程遠い生涯",
            "description": "必殺技ダメージ+150%。",
            "defaultActive": false,
            "target": "single",
            "minEidolon": 4,
            "stat": "DMG_ULT",
            "value": 1.5
        }
    ],
    "partyEffects": [
        {
            "id": "e2_quantum_res_down_mirror",
            "source": "eidolon",
            "name": "叶えられなかった幸福 (火力計算用)",
            "description": "必殺技を発動する時、ターゲットの量子属性耐性-20%、さらに量子属性弱点を付与する、2ターン継続。量子攻撃時に手動ONする近似枠。 / enemyEffects の火力計算用ミラー。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "minEidolon": 2,
            "stat": "RES_PEN",
            "value": 0.2
        }
    ],
    "enemyEffects": [
        {
            "id": "e2_quantum_res_down",
            "source": "eidolon",
            "name": "叶えられなかった幸福",
            "description": "必殺技を発動する時、ターゲットの量子属性耐性-20%、さらに量子属性弱点を付与する、2ターン継続。量子攻撃時に手動ONする近似枠。",
            "defaultActive": false,
            "target": "single",
            "duration": 2,
            "minEidolon": 2,
            "stat": "RES_PEN",
            "value": 0.2
        }
    ]
});
