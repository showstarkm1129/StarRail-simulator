import { addCharacter } from './_defineCharacter.js';

addCharacter({
    "englishName": "Seele",
    "id": "seele",
    "name": "ゼーレ",
    "element": "Quantum",
    "elementLabel": "量子",
    "path": "The Hunt",
    "rarity": 5,
    "base": {
        "hp": 931,
        "atk": 640,
        "def": 363,
        "spd": 115
    },
    "maxEnergy": 120,
    "traceBonuses": [
        {
            "label": "攻撃力",
            "value": 0.28
        },
        {
            "label": "会心ダメージ",
            "value": 0.24
        },
        {
            "label": "防御力",
            "value": 0.125
        }
    ],
    "wiki": {
        "listUrl": "https://wikiwiki.jp/star-rail/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
        "pageUrl": "https://wikiwiki.jp/star-rail/%E3%82%BC%E3%83%BC%E3%83%AC",
        "version": "1.0"
    },
    "skills": {
        "basic": {
            "name": "強襲",
            "sourceHeader": "通常攻撃",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]指定した敵単体にゼーレの攻撃力X％分の量子属性ダメージを与える。",
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
            "name": "還刃",
            "sourceHeader": "戦闘スキル",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]ゼーレの速度+25%、3ターン継続。指定した敵単体にゼーレの攻撃力X%分の量子属性ダメージを与える。味方が攻撃した後、攻撃を受けた敵の残りHPが50%以下の場合、ゼーレは自動的にその敵に戦闘スキルを1回発動する。この発動ではSPを消費せず、EPも回収しない。この効果は1ターンにつき1回のみ発動でき、ゼーレのターンが回ってくるたびに発動可能回数がリセットされる。攻撃できる敵が存在しない場合、残りHPが最も低い敵単体を攻撃する。",
            "levelColumns": [
                "ダメージ倍率(X％)"
            ],
            "levels": [
                { "atk": 1.8 },
                { "atk": 2 },
                { "atk": 2.2 },
                { "atk": 2.4 },
                { "atk": 2.6 },
                { "atk": 2.8 },
                { "atk": 3 },
                { "atk": 3.2 },
                { "atk": 3.4 },
                { "atk": 3.6 },
                { "atk": 3.8 },
                { "atk": 4 }
            ]
        },
        "ult": {
            "name": "乱れ蝶",
            "sourceHeader": "必殺技",
            "type": "attack",
            "target": "single",
            "description": "[単体攻撃]増幅状態に入り、指定した敵単体にゼーレの攻撃力X％分の量子属性ダメージを与える。",
            "levelColumns": [
                "ダメージ倍率(X％)",
                "消費EP"
            ],
            "levels": [
                { "atk": 3.6, "energyCost": 120 },
                { "atk": 4 },
                { "atk": 4.4 },
                { "atk": 4.8 },
                { "atk": 5.2 },
                { "atk": 5.6 },
                { "atk": 6 },
                { "atk": 6.4 },
                { "atk": 6.8 },
                { "atk": 7.2 },
                { "atk": 7.6 },
                { "atk": 8 }
            ]
        },
        "talent": {
            "name": "再現",
            "sourceHeader": "天賦",
            "type": "buff",
            "target": "single",
            "description": "[強化]通常攻撃、戦闘スキル、必殺技で敵を倒すと追加ターンを1獲得し、増幅状態に入る。増幅状態のゼーレの与ダメージ+X%、3ターン継続。ゼーレの天賦「再現」で獲得した追加ターンの間に敵を倒した場合、この天賦は発動しない。",
            "levelColumns": [
                "与ダメージアップ(X％)"
            ],
            "levels": [
                {
                    "dmgBuff": 0.4
                },
                {
                    "dmgBuff": 0.44
                },
                {
                    "dmgBuff": 0.48
                },
                {
                    "dmgBuff": 0.52
                },
                {
                    "dmgBuff": 0.56
                },
                {
                    "dmgBuff": 0.6
                },
                {
                    "dmgBuff": 0.65
                },
                {
                    "dmgBuff": 0.7
                },
                {
                    "dmgBuff": 0.75
                },
                {
                    "dmgBuff": 0.8
                },
                {
                    "dmgBuff": 0.84
                },
                {
                    "dmgBuff": 0.88
                }
            ]
        },
        "technique": {
            "name": "幻身",
            "sourceHeader": "秘技",
            "type": "buff",
            "target": "single",
            "description": "[強化]秘技を使用した後、20秒のステルス状態になる。ステルス状態になると敵に発見されず、敵を先制攻撃して戦闘に入る時、ゼーレが増幅状態になる。"
        }
    },
    "extras": [
        {
            "tier": 2,
            "name": "昇格2",
            "description": "夜行敵を倒した時、自身の与ダメージ+50%、この効果は最大で3層累積可能で、3ターン継続する。"
        },
        {
            "tier": 4,
            "name": "昇格4",
            "description": "斬裂増幅状態の時、ゼーレの量子属性耐性貫通+25%。"
        },
        {
            "tier": 6,
            "name": "昇格6",
            "description": "さざ波通常攻撃を行った後、ゼーレの次の行動順が20%早まる。"
        }
    ],
    "eidolonsDetail": {
        "1": {
            "name": "斬尽",
            "description": "残りHPが80%以下の敵にダメージを与える時、会心率+15% 、さらにターゲットの防御力を20%無視する。"
        },
        "2": {
            "name": "蝶舞",
            "description": "戦闘スキルの加速効果が累積できるようになる、最大で2層累積できる。"
        },
        "3": {
            "name": "繚乱",
            "description": "戦闘スキルのLv.+2、最大Lv.15まで。天賦のLv.+2、最大Lv.15まで。"
        },
        "4": {
            "name": "掠影",
            "description": "ゼーレが敵を倒した時、EPを15回復する。"
        },
        "5": {
            "name": "鋒鋭",
            "description": "必殺技のLv.+2、最大Lv.15まで。通常攻撃のLv.+1、最大Lv.10まで。"
        },
        "6": {
            "name": "離析",
            "description": "必殺技を発動した後、ターゲットを3ターン「乱れ蝶」状態にする。乱れ蝶状態の敵は攻撃を受けた後、ゼーレのこの回の必殺技ダメージ30%分の確定ダメージを1回受ける。乱れ蝶状態の敵がいずれかの対象によって倒された時にも、ゼーレの天賦が発動する。ゼーレが戦闘不能状態になった時、敵の乱れ蝶状態が解除される。"
        }
    },
    "selfEffects": [
        {
            "defaultActive": false,
            "target": "single",
            "id": "skill_spd_percent",
            "source": "skill",
            "name": "還刃",
            "description": "[単体攻撃]ゼーレの速度+25%、3ターン継続。指定した敵単体にゼーレの攻撃力X%分の量子属性ダメージを与える。味方が攻撃した後、攻撃を受けた敵の残りHPが50%以下の場合、ゼーレは自動的にその敵に戦闘スキルを1回発動する。この発動ではSPを消費せず、EPも回収しない。この効果は1ターンにつき1回のみ発動でき、ゼーレのターンが回ってくるたびに発動可能回数がリセットされる。攻撃できる敵が存在しない場合、残りHPが最も低い敵単体を攻撃する。",
            "stat": "SPD_PERCENT",
            "value": 0.25,
            "duration": 3
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "talent_dmg",
            "source": "talent",
            "name": "再現",
            "description": "[強化]通常攻撃、戦闘スキル、必殺技で敵を倒すと追加ターンを1獲得し、増幅状態に入る。増幅状態のゼーレの与ダメージ+X%、3ターン継続。ゼーレの天賦「再現」で獲得した追加ターンの間に敵を倒した場合、この天賦は発動しない。",
            "fromLevel": "talent",
            "stat": "DMG_ALL",
            "statField": "dmgBuff",
            "duration": 3
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "extra2_dmg",
            "source": "extra",
            "name": "昇格2",
            "description": "夜行敵を倒した時、自身の与ダメージ+50%、この効果は最大で3層累積可能で、3ターン継続する。",
            "stat": "DMG_ALL",
            "value": 0.5,
            "duration": 3,
            "stackable": {
                "max": 3,
                "default": 3
            }
        },
        {
            "defaultActive": false,
            "target": "single",
            "id": "extra4_quantum_res_pen",
            "source": "extra",
            "name": "昇格4",
            "description": "斬裂増幅状態の時、ゼーレの量子属性耐性貫通+25%。",
            "stat": "RES_PEN",
            "value": 0.25
        },
        {
            "id": "e1_low_hp_crit_rate",
            "source": "eidolon",
            "name": "斬尽",
            "description": "残りHPが80%以下の敵にダメージを与える時、会心率+15%。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 1,
            "stat": "CRIT_RATE",
            "value": 0.15
        },
        {
            "id": "e1_low_hp_def_ignore",
            "source": "eidolon",
            "name": "斬尽",
            "description": "残りHPが80%以下の敵にダメージを与える時、ターゲットの防御力を20%無視する。",
            "defaultActive": false,
            "target": "single",
            "duration": "conditional",
            "minEidolon": 1,
            "stat": "DEF_IGNORE",
            "value": 0.2
        }
    ],
    "partyEffects": [],
    "enemyEffects": []
});
