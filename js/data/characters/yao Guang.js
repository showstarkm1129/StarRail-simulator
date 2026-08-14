import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Yao Guang",
    "id": "yao_guang",
    "name": "爻光",
    "element": "Physical",
    "elementLabel": "物理",
    "path": "Elation",
    "rarity": 5,
    "base": {
        "hp": 1241,
        "atk": 465,
        "def": 654,
        "spd": 101
    },
    "maxEnergy": 180,
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
        "pageUrl": "https://wikiwiki.jp/star-rail/%E7%88%BB%E5%85%89",
        "version": "4.0"
    },
    "skills": {
        "basic": {
            "name": "孔雀の矢羽根、幸いを招く嚆矢",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "blast",
            "description": "[拡散攻撃]指定した敵単体に爻光の攻撃力X%分の物理属性ダメージを与え、隣接する敵に爻光の攻撃力Y%分の物理属性ダメージを与える。通常攻撃のEPの回復量が30までアップする。",
            "levelColumns": [
                "単体ダメージ倍率(X％)",
                "隣接ダメージ倍率(Y％)"
            ],
            "levels": [
                {
                    "atk": 0.45,
                    "atkAdjacent": 0.15
                },
                {
                    "atk": 0.54,
                    "atkAdjacent": 0.18
                },
                {
                    "atk": 0.63,
                    "atkAdjacent": 0.21
                },
                {
                    "atk": 0.72,
                    "atkAdjacent": 0.24
                },
                {
                    "atk": 0.81,
                    "atkAdjacent": 0.27
                },
                {
                    "atk": 0.9,
                    "atkAdjacent": 0.3
                },
                {
                    "atk": 0.99,
                    "atkAdjacent": 0.33
                }
            ]
        },
        "skill": {
            "name": "十方に光映ゆ、万法を明かさん",
            "sourceHeader": "戦闘スキル",
            "type": "buff",
            "target": "all_ally",
            "description": "[サポート]3ターン継続する結界を展開する。爻光のターンが回ってくるたびに結界の継続時間-1ターン。結界が展開されている間、味方全体の愉悦度を、爻光の愉悦度のX%分アップさせる。爻光が通常攻撃、戦闘スキルを発動した後、爆笑ネタを3個獲得する。",
            "levelColumns": [
                "愉悦度アップ(X%)"
            ],
            "levels": [
                {
                    "value1": 0.1
                },
                {
                    "value1": 0.11
                },
                {
                    "value1": 0.12
                },
                {
                    "value1": 0.13
                },
                {
                    "value1": 0.14
                },
                {
                    "value1": 0.15
                },
                {
                    "value1": 0.162
                },
                {
                    "value1": 0.175
                },
                {
                    "value1": 0.188
                },
                {
                    "value1": 0.2
                },
                {
                    "value1": 0.21
                },
                {
                    "value1": 0.22
                }
            ]
        },
        "ult": {
            "name": "霓裳に鉄の羽、六爻はすべて吉",
            "sourceHeader": "必殺技",
            "type": "buff",
            "target": "all_ally",
            "description": "[サポート]爆笑ネタを5個獲得する。アッハは爆笑ネタが固定で20個カウントされる追加ターンを即座に1ターン獲得する。なお、このターンでは爆笑ネタが消費されない。また、味方全体の全属性耐性貫通+X%、3ターン継続。",
            "levelColumns": [
                "全属性耐性貫通アップ",
                "消費EP"
            ],
            "levels": [
                {
                    "resPen": 0.1,
                    "energyCost": 180
                },
                {
                    "resPen": 0.11
                },
                {
                    "resPen": 0.12
                },
                {
                    "resPen": 0.13
                },
                {
                    "resPen": 0.14
                },
                {
                    "resPen": 0.15
                },
                {
                    "resPen": 0.162
                },
                {
                    "resPen": 0.175
                },
                {
                    "resPen": 0.188
                },
                {
                    "resPen": 0.2
                },
                {
                    "resPen": 0.21
                },
                {
                    "resPen": 0.22
                }
            ]
        },
        "愉悦スキル": {
            "name": "君に卦を贈る、天を染める銀花",
            "sourceHeader": "愉悦スキル",
            "type": "attack",
            "target": "all",
            "damageComponents": [
                {
                    "id": "joy-all",
                    "label": "敵全体",
                    "scalingStat": "atk",
                    "multiplierKey": "value1",
                    "target": "all"
                },
                {
                    "id": "joy-random",
                    "label": "ランダム単体（5回）",
                    "scalingStat": "atk",
                    "multiplierKey": "value2",
                    "target": "single",
                    "hits": 5
                }
            ],
            "description": "[全体攻撃]敵全体に「凶星の囁き」状態を付与し、3ターン継続。「凶星の囁き」状態の敵の受けるダメージ+16.0%。敵全体にX%分の物理属性の愉悦ダメージを与えた後、ランダムな敵単体にY%分の物理属性の愉悦ダメージを5回与える。",
            "levelColumns": [
                "説明(ステータス)",
                "説明(ステータス)"
            ],
            "levels": [
                {
                    "value1": 0.5,
                    "value2": 0.1
                },
                {
                    "value1": 0.55,
                    "value2": 0.11
                },
                {
                    "value1": 0.6,
                    "value2": 0.12
                },
                {
                    "value1": 0.65,
                    "value2": 0.13
                },
                {
                    "value1": 0.7,
                    "value2": 0.14
                },
                {
                    "value1": 0.75,
                    "value2": 0.15
                },
                {
                    "value1": 0.81,
                    "value2": 0.16
                },
                {
                    "value1": 0.87,
                    "value2": 0.17
                },
                {
                    "value1": 0.93,
                    "value2": 0.18
                },
                {
                    "value1": 1,
                    "value2": 0.2
                },
                {
                    "value1": 1.05,
                    "value2": 0.21
                },
                {
                    "value1": 1.1,
                    "value2": 0.22
                }
            ]
        },
        "talent": {
            "name": "千の光を開き、遍く観自在なり",
            "sourceHeader": "天賦",
            "type": "buff",
            "target": "single",
            "description": "[サポート]爻光が「爆笑の褒美」を持つ時、以下の効果を獲得する。味方が攻撃を行った後「大吉大利」効果を発動する。「大吉大利」：攻撃が命中したランダムな敵単体に追加でX%分の対応する属性の愉悦ダメージを1回与える。また、その回の攻撃でSPを消費した場合、さらに「大吉大利」の効果を1回発動する。「大吉大利」の効果を発動する時、攻撃者の愉悦度が爻光より低い場合、その回の愉悦ダメージは爻光の愉悦度で計算される。「大吉大利」の効果は攻撃を1回発動したと見なされない。",
            "levelColumns": [
                "ダメージ倍率(X%)"
            ],
            "levels": [
                {
                    "atk": 0.1
                },
                {
                    "atk": 0.11
                },
                {
                    "atk": 0.12
                },
                {
                    "atk": 0.13
                },
                {
                    "atk": 0.14
                },
                {
                    "atk": 0.15
                },
                {
                    "atk": 0.162
                },
                {
                    "atk": 0.175
                },
                {
                    "atk": 0.188
                },
                {
                    "atk": 0.2
                },
                {
                    "atk": 0.21
                },
                {
                    "atk": 0.22
                }
            ]
        },
        "technique": {
            "name": "移りゆく時光、何をか忌むべき",
            "sourceHeader": "秘技",
            "type": "buff",
            "target": "single",
            "description": "[サポート]秘技を使用した後、次の戦闘開始時に戦闘スキルを自動で1回発動する。この発動ではSPを消費しない。爻光がパーティーにいる場合、オブジェクトを破壊すると即座に「吉運一封」獲得する。1週間ごとに最大で8個獲得できる。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "羽開きの礼爻光の速度が120以上の時、自身の愉悦度+30%。なお、超過した速度1につき、さらに自身の愉悦度+1%。超過した速度は最大200までカウントされる。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "満ち足りたひと時自身の会心ダメージ+60%。愉悦スキルを発動した後、SPを1回復する。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "集う好運爻光が「爆笑の褒美」を獲得する時、その継続時間+1ターン。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "玉落つる処、満ち満ちる笑み",
            "description": "必殺技で発生するアッハの追加ターンに固定でカウントされる爆笑ネタの数が40個までアップする。味方が愉悦ダメージを与える時、敵の防御力を20%無視する。"
        },
        "2": {
            "name": "目無き飛箭、青き羽を瞳とす",
            "description": "結界が展開されている間、味方全体の速度+12%、愉悦度がさらに+16%。"
        },
        "3": {
            "name": "十方の世界、光は符中に映ゆ",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。愉悦スキルのLv.+1、最大Lv.15まで。"
        },
        "4": {
            "name": "絹糸の如き命数、拈みて羽で彩る",
            "description": "爻光の必殺技で発動するアッハの追加ターンで、味方が与える愉悦スキルダメージは本来のダメージの150%分になる。"
        },
        "5": {
            "name": "瓔珞で飾る、瑠璃の如き身",
            "description": "必殺技のLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。愉悦スキルのLv.+1、最大Lv.15まで。"
        },
        "6": {
            "name": "手繰り寄せる糸、天星が架くる虹",
            "description": "味方全体の愉悦ダメージが25%上笑する。爻光の愉悦スキルのダメージ倍率が本来の100%分アップする。"
        }
    },
    "partyEffects": [
        {
            "id": "ult_res_pen",
            "source": "ult",
            "name": "霓裳に鉄の羽、六爻はすべて吉",
            "description": "[サポート]爆笑ネタを5個獲得する。アッハは爆笑ネタが固定で20個カウントされる追加ターンを即座に1ターン獲得する。なお、このターンでは爆笑ネタが消費されない。また、味方全体の全属性耐性貫通+X%、3ターン継続。",
            "defaultActive": false,
            "target": "all",
            "duration": 3,
            "fromLevel": "ult",
            "stat": "RES_PEN",
            "statField": "resPen"
        },
        {
            "id": "e1_def_ignore",
            "source": "eidolon",
            "name": "玉落つる処、満ち満ちる笑み",
            "description": "必殺技で発生するアッハの追加ターンに固定でカウントされる爆笑ネタの数が40個までアップする。味方が愉悦ダメージを与える時、敵の防御力を20%無視する。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 1,
            "stat": "DEF_IGNORE",
            "value": 0.2
        },
        {
            "id": "e2_spd_percent",
            "source": "eidolon",
            "name": "目無き飛箭、青き羽を瞳とす",
            "description": "結界が展開されている間、味方全体の速度+12%、愉悦度がさらに+16%。",
            "defaultActive": false,
            "target": "all",
            "duration": "conditional",
            "minEidolon": 2,
            "stat": "SPD_PERCENT",
            "value": 0.12
        }
    ],
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "extra4_crit_dmg",
            "source": "extra",
            "name": "昇格4",
            "description": "満ち足りたひと時自身の会心ダメージ+60%。愉悦スキルを発動した後、SPを1回復する。",
            "stat": "CRIT_DMG",
            "value": 0.6
        }
    ]
});
