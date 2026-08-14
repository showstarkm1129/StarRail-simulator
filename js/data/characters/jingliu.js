import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Jingliu",
    "id": "jingliu",
    "name": "鏡流",
    "element": "Ice",
    "elementLabel": "氷",
    "path": "Destruction",
    "rarity": 5,
    "base": {
        "hp": 1435,
        "atk": 679,
        "def": 485,
        "spd": 96
    },
    "maxEnergy": 140,
    "traceBonuses": [
        {
            "label": "会心ダメージ",
            "value": 0.373
        },
        {
            "label": "速度",
            "value": 9
        },
        {
            "label": "最大HP",
            "value": 0.1
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E9%8F%A1%E6%B5%81",
        "version": "1.4"
    },
    "skills": {
        "basic": {
            "name": "流影穿",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に鏡流の最大HPX%分の氷属性ダメージを与える。",
            "levelColumns": [
                "ダメージ倍率(X％)"
            ],
            "levels": [
                {
                    "hpPct": 0.25
                },
                {
                    "hpPct": 0.3
                },
                {
                    "hpPct": 0.35
                },
                {
                    "hpPct": 0.4
                },
                {
                    "hpPct": 0.45
                },
                {
                    "hpPct": 0.5
                },
                {
                    "hpPct": 0.55
                }
            ]
        },
        "skill": {
            "name": "無罅の飛光",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体に鏡流の最大HPX%分の氷属性ダメージを与え、「朔望」を1層獲得する。",
            "levelColumns": [
                "ダメージ倍率(X％)",
                "単体ダメージ倍率(Y%)",
                "隣接ダメージ倍率(Z%)"
            ],
            "levels": [
                {
                    "hpPct": 0.75,
                    "hpPct2": 0.75,
                    "hpPctAdjacent": 0.37
                },
                {
                    "hpPct": 0.82,
                    "hpPct2": 0.82,
                    "hpPctAdjacent": 0.41
                },
                {
                    "hpPct": 0.9,
                    "hpPct2": 0.9,
                    "hpPctAdjacent": 0.45
                },
                {
                    "hpPct": 0.97,
                    "hpPct2": 0.97,
                    "hpPctAdjacent": 0.48
                },
                {
                    "hpPct": 1.05,
                    "hpPct2": 1.05,
                    "hpPctAdjacent": 0.52
                },
                {
                    "hpPct": 1.14,
                    "hpPct2": 1.14,
                    "hpPctAdjacent": 0.57
                },
                {
                    "hpPct": 1.23,
                    "hpPct2": 1.23,
                    "hpPctAdjacent": 0.61
                },
                {
                    "hpPct": 1.32,
                    "hpPct2": 1.32,
                    "hpPctAdjacent": 0.66
                },
                {
                    "hpPct": 1.41,
                    "hpPct2": 1.41,
                    "hpPctAdjacent": 0.7
                },
                {
                    "hpPct": 1.5,
                    "hpPct2": 1.5,
                    "hpPctAdjacent": 0.75
                },
                {
                    "hpPct": 1.57,
                    "hpPct2": 1.57,
                    "hpPctAdjacent": 0.78
                },
                {
                    "hpPct": 1.65,
                    "hpPct2": 1.65,
                    "hpPctAdjacent": 0.82
                }
            ]
        },
        "ult": {
            "name": "曇華生滅、夢瀉す天河",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "blast",
            "description": "[拡散攻撃]指定した敵単体に鏡流の最大HPX%分の氷属性ダメージを与え、隣接する敵に鏡流の最大HPY%分の氷属性ダメージを与える。攻撃を行った後に「朔望」を1層獲得する。",
            "levelColumns": [
                "単体ダメージ倍率(X%)",
                "隣接ダメージ倍率(Y%)",
                "消費EP"
            ],
            "levels": [
                {
                    "hpPct": 0.9,
                    "hpPctAdjacent": 0.45,
                    "energyCost": 140
                },
                {
                    "hpPct": 0.99,
                    "hpPctAdjacent": 0.49
                },
                {
                    "hpPct": 1.08,
                    "hpPctAdjacent": 0.54
                },
                {
                    "hpPct": 1.17,
                    "hpPctAdjacent": 0.58
                },
                {
                    "hpPct": 1.26,
                    "hpPctAdjacent": 0.63
                },
                {
                    "hpPct": 1.36,
                    "hpPctAdjacent": 0.68
                },
                {
                    "hpPct": 1.47,
                    "hpPctAdjacent": 0.73
                },
                {
                    "hpPct": 1.58,
                    "hpPctAdjacent": 0.79
                },
                {
                    "hpPct": 1.69,
                    "hpPctAdjacent": 0.84
                },
                {
                    "hpPct": 1.8,
                    "hpPctAdjacent": 0.9
                },
                {
                    "hpPct": 1.89,
                    "hpPctAdjacent": 0.94
                },
                {
                    "hpPct": 1.98,
                    "hpPctAdjacent": 0.99
                }
            ]
        },
        "talent": {
            "name": "淡月転魄",
            "sourceHeader": "天賦",
            "type": "buff",
            "target": "single",
            "description": "[強化]「朔望」を2層所持する時、鏡流は「転魄」状態に入り、追加で｢朔望｣を1層獲得し、会心率+X%。同時に行動順を100%早め、戦闘スキル「無罅の飛光」が「寒川映月」に強化される。「転魄」状態の鏡流はこの強化戦闘スキルのみを使用できる。「転魄」状態で攻撃を行った時、自身以外の味方のHPをそれぞれの最大HP5%分消費し（残りHPが足りない場合、攻撃を行った時、自身以外の味方の残りHPが1になる）。「転魄」状態中、味方がダメージを受ける、またはHPを消費するたびに、鏡流は「月光」を1層獲得する。獲得した「月光」1層につき、鏡流の会心ダメージ+Y%、最大で5層まで所持することが可能。「転魄」状態が終了するまで、再度「転魄」状態に入ることはできない。「朔望」は最大で4層累積できる。「朔望」が0層になると、「転魄」状態が解除され、「月光」をすべて失う。味方が累計で20回ダメージを受けた、またはHPを消費した後、鏡流は「朔望」を1層獲得する。味方それぞれが攻撃を受けるたびにカウントされる被撃回数は最大1回まで。",
            "levelColumns": [
                "会心率アップ(X%)",
                "会心ダメージアップ(Y%)"
            ],
            "levels": [
                {
                    "critRateBuff": 0.4,
                    "cdBuff": 0.22
                },
                {
                    "critRateBuff": 0.41,
                    "cdBuff": 0.242
                },
                {
                    "critRateBuff": 0.42,
                    "cdBuff": 0.264
                },
                {
                    "critRateBuff": 0.43,
                    "cdBuff": 0.286
                },
                {
                    "critRateBuff": 0.44,
                    "cdBuff": 0.308
                },
                {
                    "critRateBuff": 0.45,
                    "cdBuff": 0.334
                },
                {
                    "critRateBuff": 0.46,
                    "cdBuff": 0.361
                },
                {
                    "critRateBuff": 0.47,
                    "cdBuff": 0.387
                },
                {
                    "critRateBuff": 0.48,
                    "cdBuff": 0.413
                },
                {
                    "critRateBuff": 0.5,
                    "cdBuff": 0.44
                },
                {
                    "critRateBuff": 0.51,
                    "cdBuff": 0.462
                },
                {
                    "critRateBuff": 0.52,
                    "cdBuff": 0.484
                }
            ]
        },
        "technique": {
            "name": "神識照らす月影",
            "sourceHeader": "秘技",
            "type": "debuff",
            "target": "single",
            "description": "[妨害]秘技を使用した後、自身の周囲に20秒間継続する特殊領域を作り出す。特殊領域内の敵は凍結状態になる。特殊領域内の敵と戦闘に入った後、自身のEPを15回復し、「朔望」を1層獲得して100%の基礎確率で敵を凍結状態にする、1ターン継続。凍結状態の敵は行動できず、ターンが回ってくるたびに鏡流の最大HP80%分の氷属性付加ダメージを受ける。味方が作り出した領域は1つまで存在できる。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "死境「転魄」状態の時、効果抵抗+35%、必殺技ダメージ+20%。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "剣首「無罅の飛光」を発動した後、さらにEPが15回復する。「寒川映月」を発動した後、さらにEPが8回復する。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "霜魄「朔望」を獲得する時、「朔望」がすでに上限に達している場合、鏡流の次の攻撃はターゲットの防御力を25%無視する。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "天関を犯す月",
            "description": "必殺技または強化戦闘スキルを発動した時、鏡流の会心ダメージ+36%、1ターン継続。さらにメインターゲットに鏡流の最大HP80%分の氷属性ダメージを1回与える。"
        },
        "2": {
            "name": "月暈に七星",
            "description": "必殺技を発動した後、次の強化戦闘スキルの与ダメージ+80%。"
        },
        "3": {
            "name": "望月に迫る半璧",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "4": {
            "name": "掌の月光",
            "description": "「転魄」状態の時、「月光」1層につき、さらに会心ダメージ+20%。"
        },
        "5": {
            "name": "三台を蝕む玉鏡",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "6": {
            "name": "婁宿を蝕む氷輪",
            "description": "鏡流が「転魄」状態に入った時、「朔望」を上限+1層、鏡流がさらに「朔望」を2層獲得する。「転魄」状態の時、氷属性耐性貫通+30%。"
        }
    },
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "talent_crit_rate",
            "source": "talent",
            "name": "淡月転魄",
            "description": "[強化]「朔望」を2層所持する時、鏡流は「転魄」状態に入り、追加で｢朔望｣を1層獲得し、会心率+X%。同時に行動順を100%早め、戦闘スキル「無罅の飛光」が「寒川映月」に強化される。「転魄」状態の鏡流はこの強化戦闘スキルのみを使用できる。「転魄」状態で攻撃を行った時、自身以外の味方のHPをそれぞれの最大HP5%分消費し（残りHPが足りない場合、攻撃を行った時、自身以外の味方の残りHPが1になる）。「転魄」状態中、味方がダメージを受ける、またはHPを消費するたびに、鏡流は「月光」を1層獲得する。獲得した「月光」1層につき、鏡流の会心ダメージ+Y%、最大で5層まで所持することが可能。「転魄」状態が終了するまで、再度「転魄」状態に入ることはできない。「朔望」は最大で4層累積できる。「朔望」が0層になると、「転魄」状態が解除され、「月光」をすべて失う。味方が累計で20回ダメージを受けた、またはHPを消費した後、鏡流は「朔望」を1層獲得する。味方それぞれが攻撃を受けるたびにカウントされる被撃回数は最大1回まで。",
            "fromLevel": "talent",
            "stat": "CRIT_RATE",
            "statField": "critRateBuff"
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "talent_crit_dmg",
            "source": "talent",
            "name": "淡月転魄",
            "description": "[強化]「朔望」を2層所持する時、鏡流は「転魄」状態に入り、追加で｢朔望｣を1層獲得し、会心率+X%。同時に行動順を100%早め、戦闘スキル「無罅の飛光」が「寒川映月」に強化される。「転魄」状態の鏡流はこの強化戦闘スキルのみを使用できる。「転魄」状態で攻撃を行った時、自身以外の味方のHPをそれぞれの最大HP5%分消費し（残りHPが足りない場合、攻撃を行った時、自身以外の味方の残りHPが1になる）。「転魄」状態中、味方がダメージを受ける、またはHPを消費するたびに、鏡流は「月光」を1層獲得する。獲得した「月光」1層につき、鏡流の会心ダメージ+Y%、最大で5層まで所持することが可能。「転魄」状態が終了するまで、再度「転魄」状態に入ることはできない。「朔望」は最大で4層累積できる。「朔望」が0層になると、「転魄」状態が解除され、「月光」をすべて失う。味方が累計で20回ダメージを受けた、またはHPを消費した後、鏡流は「朔望」を1層獲得する。味方それぞれが攻撃を受けるたびにカウントされる被撃回数は最大1回まで。",
            "fromLevel": "talent",
            "stat": "CRIT_DMG",
            "statField": "cdBuff",
            "stackable": {
                "max": 5,
                "default": 5
            }
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e2_ult_dmg",
            "source": "eidolon",
            "name": "月暈に七星",
            "description": "必殺技を発動した後、次の強化戦闘スキルの与ダメージ+80%。",
            "stat": "DMG_ULT",
            "value": 0.8,
            "minEidolon": 2
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e6_crit_dmg",
            "source": "eidolon",
            "name": "婁宿を蝕む氷輪",
            "description": "鏡流が「転魄」状態に入った時、「朔望」を上限+1層、鏡流がさらに「朔望」を2層獲得する。「転魄」状態の時、氷属性耐性貫通+30%。",
            "stat": "CRIT_DMG",
            "value": 0.5,
            "minEidolon": 6
        },
        {
            "id": "extra2_state_res_and_ult_dmg",
            "source": "extra",
            "name": "昇格2",
            "description": "「転魄」状態の時、効果抵抗+35%、必殺技ダメージ+20%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "stats": {
                "EFFECT_RES": 0.35,
                "DMG_ULT": 0.2
            }
        },
        {
            "id": "extra6_next_hit_def_ignore",
            "source": "extra",
            "name": "昇格6",
            "description": "「朔望」が上限に達している状態で「朔望」を獲得した場合、鏡流の次の攻撃はターゲットの防御力を25%無視する。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "stat": "DEF_IGNORE",
            "value": 0.25
        },
        {
            "id": "e1_ult_enhanced_skill_crit_dmg",
            "source": "eidolon",
            "name": "天関を犯す月",
            "description": "必殺技または強化戦闘スキルを発動した時、鏡流の会心ダメージ+36%、1ターン継続。",
            "defaultActive": false,
            "target": "single",
            "duration": 1,
            "minEidolon": 1,
            "stat": "CRIT_DMG",
            "value": 0.36
        },
        {
            "id": "e4_moonlight_crit_dmg",
            "source": "eidolon",
            "name": "掌の月光",
            "description": "「転魄」状態の時、「月光」1層につき、さらに会心ダメージ+20%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 4,
            "stat": "CRIT_DMG",
            "value": 0.2,
            "stackable": {
                "max": 3,
                "default": 3
            }
        }
    ],
    "partyEffects": [],
    "enemyEffects": []
});
