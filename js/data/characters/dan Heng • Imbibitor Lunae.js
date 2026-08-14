import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Dan Heng • Imbibitor Lunae",
    "id": "dan_heng_imbibitor_lunae",
    "name": "丹恒・飲月",
    "element": "Imaginary",
    "elementLabel": "虚数",
    "path": "Destruction",
    "rarity": 5,
    "base": {
        "hp": 1241,
        "atk": 698,
        "def": 363,
        "spd": 102
    },
    "maxEnergy": 140,
    "traceBonuses": [
        {
            "label": "虚数ダメージ",
            "value": 0.224
        },
        {
            "label": "会心率",
            "value": 0.12
        },
        {
            "label": "最大HP",
            "value": 0.1
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E4%B8%B9%E6%81%92%E3%83%BB%E9%A3%B2%E6%9C%88",
        "version": "1.3"
    },
    "skills": {
        "basic": {
            "name": "水華",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]2段の攻撃を行い、指定した敵単体に丹恒・飲月の攻撃力X%分の虚数属性ダメージを与える。",
            "levelColumns": [
                "ダメージ倍率(X％)",
                "ダメージ倍率(Y％)",
                "単体ダメージ(V％)",
                "隣接ダメージ(W％)",
                "単体ダメージ(S％)",
                "隣接ダメージ(T％)"
            ],
            "levels": [
                {
                    "atk": 0.5,
                    "atk2": 1.3,
                    "atk3": 1.9,
                    "atkAdjacent": 0.3,
                    "atk4": 2.5,
                    "atkAdjacent2": 0.9
                },
                {
                    "atk": 0.6,
                    "atk2": 1.56,
                    "atk3": 2.28,
                    "atkAdjacent": 0.36,
                    "atk4": 3,
                    "atkAdjacent2": 1.08
                },
                {
                    "atk": 0.7,
                    "atk2": 1.82,
                    "atk3": 2.66,
                    "atkAdjacent": 0.42,
                    "atk4": 3.5,
                    "atkAdjacent2": 1.26
                },
                {
                    "atk": 0.8,
                    "atk2": 2.08,
                    "atk3": 3.04,
                    "atkAdjacent": 0.48,
                    "atk4": 4,
                    "atkAdjacent2": 1.44
                },
                {
                    "atk": 0.9,
                    "atk2": 2.34,
                    "atk3": 3.42,
                    "atkAdjacent": 0.54,
                    "atk4": 4.5,
                    "atkAdjacent2": 1.62
                },
                {
                    "atk": 1,
                    "atk2": 2.6,
                    "atk3": 3.8,
                    "atkAdjacent": 0.6,
                    "atk4": 5,
                    "atkAdjacent2": 1.8
                },
                {
                    "atk": 1.1,
                    "atk2": 2.86,
                    "atk3": 4.18,
                    "atkAdjacent": 0.66,
                    "atk4": 5.5,
                    "atkAdjacent2": 1.98
                }
            ]
        },
        "skill": {
            "name": "龍力自在",
            "sourceHeader": "戦闘スキル",
            "type": "buff",
            "target": "single",
            "description": "[強化]このスキルは通常攻撃を強化できる。このスキルを使用してもSPは消費されず、戦闘スキルを発動したとも見なされない。強化通常攻撃を行った後に、SPが消費される。通常攻撃は最大で3回まで強化できる。1回強化、「水華」が「瞬華」に強化される。2回強化、「水華」が「天矢陰」に強化される。3回強化、「水華」が「躍動せし耀鱗」に強化される。「天矢陰」または「躍動せし耀鱗」を発動した時、4段目以降の攻撃の前に、それぞれ「叱咤」を1層獲得し、丹恒・飲月の会心ダメージ+X%。この効果は最大で4層累積でき、自身のターンが終了するまで継続。",
            "levelColumns": [
                "会心ダメージアップ(X%)"
            ],
            "levels": [
                {
                    "cdBuff": 0.06
                },
                {
                    "cdBuff": 0.066
                },
                {
                    "cdBuff": 0.072
                },
                {
                    "cdBuff": 0.078
                },
                {
                    "cdBuff": 0.084
                },
                {
                    "cdBuff": 0.09
                },
                {
                    "cdBuff": 0.097
                },
                {
                    "cdBuff": 0.105
                },
                {
                    "cdBuff": 0.112
                },
                {
                    "cdBuff": 0.12
                },
                {
                    "cdBuff": 0.126
                },
                {
                    "cdBuff": 0.132
                }
            ]
        },
        "ult": {
            "name": "傲睨せし蒼龍、世を濯ぐ劫水",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "blast",
            "description": "[拡散攻撃]3段の攻撃を行い、指定した敵単体に丹恒・飲月の攻撃力X%分の虚数属性ダメージを与え、隣接する敵に丹恒・飲月の攻撃力Y%分の虚数属性ダメージを与える。自身は「逆鱗」を2層獲得する。「逆鱗」は最大で3まで所持でき、丹恒・飲月のSPの代わりとして消費できる。また、「逆鱗」の消費はSP消費と見なされる。",
            "levelColumns": [
                "単体ダメージ倍率(X％)",
                "隣接ダメージ倍率(Y％)",
                "消費EP"
            ],
            "levels": [
                {
                    "atk": 1.8,
                    "atkAdjacent": 0.84,
                    "energyCost": 140
                },
                {
                    "atk": 1.92,
                    "atkAdjacent": 0.89
                },
                {
                    "atk": 2.04,
                    "atkAdjacent": 0.95
                },
                {
                    "atk": 2.16,
                    "atkAdjacent": 1
                },
                {
                    "atk": 2.28,
                    "atkAdjacent": 1.06
                },
                {
                    "atk": 2.4,
                    "atkAdjacent": 1.12
                },
                {
                    "atk": 2.55,
                    "atkAdjacent": 1.19
                },
                {
                    "atk": 2.7,
                    "atkAdjacent": 1.26
                },
                {
                    "atk": 2.85,
                    "atkAdjacent": 1.33
                },
                {
                    "atk": 3,
                    "atkAdjacent": 1.4
                },
                {
                    "atk": 3.12,
                    "atkAdjacent": 1.45
                },
                {
                    "atk": 3.24,
                    "atkAdjacent": 1.51
                }
            ]
        },
        "talent": {
            "name": "亢心",
            "sourceHeader": "天賦",
            "type": "buff",
            "target": "single",
            "description": "[強化]丹恒・飲月は1段の攻撃を行うたびに「亢心」を1層獲得する。「亢心」1層につき自身の与ダメージ+X%、この効果は最大で6層獲得できる。「亢心」の効果は自身のターンが終了するまで継続。",
            "levelColumns": [
                "与ダメージアップ(X％)"
            ],
            "levels": [
                {
                    "dmgBuff": 0.05
                },
                {
                    "dmgBuff": 0.055
                },
                {
                    "dmgBuff": 0.06
                },
                {
                    "dmgBuff": 0.065
                },
                {
                    "dmgBuff": 0.07
                },
                {
                    "dmgBuff": 0.075
                },
                {
                    "dmgBuff": 0.081
                },
                {
                    "dmgBuff": 0.087
                },
                {
                    "dmgBuff": 0.093
                },
                {
                    "dmgBuff": 0.1
                },
                {
                    "dmgBuff": 0.105
                },
                {
                    "dmgBuff": 0.11
                }
            ]
        },
        "technique": {
            "name": "掣空、虹の如し",
            "sourceHeader": "秘技",
            "type": "buff",
            "target": "all",
            "description": "[強化]秘技を使用した後、20秒間継続する「遊龍」状態に入る。「遊龍」状態で攻撃すると、素早く前方に一定距離移動し、触れた敵を攻撃する。その間、敵のすべての攻撃を防げる。「遊龍」状態で敵を先制攻撃して戦闘に入った後、敵全体に丹恒・飲月の攻撃力120%分の虚数属性ダメージを与え、自身は「逆鱗」を1獲得する。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "伏辰戦闘開始時、EPを15回復する。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "修禹行動制限系デバフを抵抗する確率+35%。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "啓蟄虚数属性が弱点の敵にダメージを与える時、会心ダメージ+24%。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "九天",
            "description": "「亢心」の累積可能層数+4。1段の攻撃を行うたび、さらに「亢心」を1層獲得する。"
        },
        "2": {
            "name": "九旒",
            "description": "必殺技を発動した後、丹恒・飲月の行動順が100%早まり、さらに「逆鱗」を1獲得する。"
        },
        "3": {
            "name": "雲旗",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "4": {
            "name": "嘲風",
            "description": "「叱咤」のバフ効果が、自身の次のターンが終了するまで継続するようになる。"
        },
        "5": {
            "name": "凌雲",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "6": {
            "name": "黄龍",
            "description": "丹恒・飲月以外の味方が必殺技を発動した後、丹恒・飲月が発動する次の「躍動せし耀鱗」の虚数属性耐性貫通+20%。この効果は最大で3層累積できる。"
        }
    },
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "skill_crit_dmg",
            "source": "skill",
            "name": "龍力自在",
            "description": "[強化]このスキルは通常攻撃を強化できる。このスキルを使用してもSPは消費されず、戦闘スキルを発動したとも見なされない。強化通常攻撃を行った後に、SPが消費される。通常攻撃は最大で3回まで強化できる。1回強化、「水華」が「瞬華」に強化される。2回強化、「水華」が「天矢陰」に強化される。3回強化、「水華」が「躍動せし耀鱗」に強化される。「天矢陰」または「躍動せし耀鱗」を発動した時、4段目以降の攻撃の前に、それぞれ「叱咤」を1層獲得し、丹恒・飲月の会心ダメージ+X%。この効果は最大で4層累積でき、自身のターンが終了するまで継続。",
            "fromLevel": "skill",
            "stat": "CRIT_DMG",
            "statField": "cdBuff",
            "stackable": {
                "max": 4,
                "default": 4
            }
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "talent_dmg",
            "source": "talent",
            "name": "亢心",
            "description": "[強化]丹恒・飲月は1段の攻撃を行うたびに「亢心」を1層獲得する。「亢心」1層につき自身の与ダメージ+X%、この効果は最大で6層獲得できる。「亢心」の効果は自身のターンが終了するまで継続。",
            "fromLevel": "talent",
            "stat": "DMG_ALL",
            "statField": "dmgBuff",
            "stackable": {
                "max": 6,
                "default": 6
            }
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "e6_imaginary_res_pen",
            "source": "eidolon",
            "name": "黄龍",
            "description": "丹恒・飲月以外の味方が必殺技を発動した後、丹恒・飲月が発動する次の「躍動せし耀鱗」の虚数属性耐性貫通+20%。この効果は最大で3層累積できる。",
            "stat": "RES_PEN",
            "value": 0.2,
            "minEidolon": 6,
            "stackable": {
                "max": 3,
                "default": 3
            }
        },
        {
            "id": "extra6_imaginary_weak_crit_dmg",
            "source": "extra",
            "name": "昇格6",
            "description": "虚数属性が弱点の敵にダメージを与える時、会心ダメージ+24%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "stat": "CRIT_DMG",
            "value": 0.24
        }
    ],
    "partyEffects": [],
    "enemyEffects": []
});
