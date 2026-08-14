// 次元界オーナメント: 海に沈んだルサカ
//   2pc: 装備キャラのEP回復効率+5% / 装備キャラがパーティ1枠目でない場合、1枠目のキャラの ATK+12%
//
// 設計判断:
//   - 「EP回復+5%」は自己ステ → pc2.stats
//   - 「1枠目への ATK+12%」は装備キャラが非1枠目時 (=サポート枠時) に発動
//     パーティ枠UIでは teammate は常にサポート枠扱い (focus が1枠目想定) なので、
//     条件は常に成立 → partyEffects に登録 (デフォルト ON)。target: 'single' (focus指定)

import { STAT } from '../../build/statKeys.js';
import { SET_TYPE, RELIC_USAGE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';

Registry.ornament.add({
    id: 'Lushaka, the Sunken Seas',
    name: '海に沈んだルサカ',
    type: SET_TYPE.PLANAR,

    tags: {
        usage: [RELIC_USAGE.SUPPORT],
        attribute: [],
    },

    pc2: {
        stats: { [STAT.ENERGY_REGEN]: 0.05 },
    },

    partyEffects: {
        pc2: [
            {
                id: 'rusaka_first_slot_atk',
                source: 'set',
                name: '1枠目キャラ 攻撃力+12% (サポート装備時 常時発動)',
                description: '装備キャラがパーティの1枠目のキャラでない場合、1枠目のキャラの攻撃力+12%。装備している味方がサポート枠なら条件成立として扱う。',
                stats: { [STAT.ATK_PERCENT]: 0.12 },
                defaultActive: true,
                target: 'single',
                duration: 'permanent',
                tickRule: 'none',
                dispellable: false,
            },
        ],
    },
    hooks: {},
});
