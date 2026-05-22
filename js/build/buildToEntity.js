// buildToEntity.js — Build → 既存 simulator.js の Entity への橋渡し
//
// 既存 Entity のシグネチャ:
//   new Entity(id, name, isEnemy, baseSpd, bonusSpd, maxEP, err, equipment)
// equipment は { lc, relic1, relic2, ornament } の文字列フラグ。
// これに加えて build / finalStats / hooks / setCounts を後付けする。

import { Registry } from './registry.js';
import { StatComputer, countAllSets, countSetsByType } from './statComputer.js';
import { SET_TYPE } from './constants.js';

// 既存 simulator.js が見ているフラグ群を Build から逆算して埋める。
// これにより既存「速度・行動順」「戦闘シミュ」タブの挙動を破壊しない。
function legacyEquipmentFromBuild(build) {
    // cavern セット ID 列(2pc 以上のものを優先列挙)
    const cavernCounts = countSetsByType(build.relics, SET_TYPE.CAVERN);
    const planarCounts = countSetsByType(build.relics, SET_TYPE.PLANAR);

    const cavernIds = Object.entries(cavernCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([id]) => id);

    // 既存 simulator は relic1/relic2 の2枠しか見ていないので
    // 4セットなら同じ ID を両方に、2+2 なら2つ並べる
    let relic1 = 'none', relic2 = 'none';
    if (cavernIds.length === 1) {
        relic1 = cavernIds[0];
        relic2 = cavernCounts[cavernIds[0]] >= 4 ? cavernIds[0] : 'none';
    } else if (cavernIds.length >= 2) {
        relic1 = cavernIds[0];
        relic2 = cavernIds[1];
    }

    const planarId = Object.keys(planarCounts)[0];

    return {
        lc: build.lightcone?.id ?? 'none',
        relic1,
        relic2,
        ornament: planarId ?? 'none',
    };
}

// Build から Entity を構築する。
//   opts.id        — 任意の Entity ID(未指定なら build.id ベース)
//   opts.EntityCls — Entity クラス(simulator.js は非モジュールなので
//                    呼び出し側で window.Entity を渡すことを想定)
export function buildToEntity(build, opts = {}) {
    const EntityCls = opts.EntityCls || (typeof window !== 'undefined' ? window.Entity : null);
    if (typeof EntityCls !== 'function') {
        throw new Error('[buildToEntity] Entity クラスが見つかりません。opts.EntityCls を渡してください。');
    }

    const final = StatComputer.compute(build);
    const ch = Registry.character.get(build.characterId);

    const baseSpd = final.raw.spdBase;
    const bonusSpd = final.derived.spd - baseSpd;       // 基礎以外の SPD 寄与を全部 bonusSpd に寄せる
    const errPercent = final.derived.energyRegenPct * 100;

    const entity = new EntityCls(
        opts.id ?? `c_${build.id}`,
        build.name || ch.name,
        false,
        baseSpd,
        bonusSpd,
        ch.maxEnergy,
        errPercent,
        legacyEquipmentFromBuild(build),
    );

    // 拡張プロパティ(既存ロジックには無い情報を後付け)
    entity.build = build;
    entity.finalStats = final;
    entity.maxHP = final.derived.hp || 1000;
    entity.currentHP = entity.maxHP;
    entity.hooks = StatComputer.collectHooks(build);
    entity.setCounts = countAllSets(build.relics);

    // hasEagle4 等のフラグは Entity constructor で計算済みだが、
    // setCounts 由来の判定で上書きする(simulator.js 側のフォールバックと同等の動作)。
    entity.hasEagle4    = (entity.setCounts.eagle    || 0) >= 4 || entity.hasEagle4;
    entity.hasMessenger4 = (entity.setCounts.messenger || 0) >= 4 || entity.hasMessenger4;
    entity.hasVonwacq   = (entity.setCounts.vonwacq  || 0) >= 2 || entity.hasVonwacq;

    return entity;
}
