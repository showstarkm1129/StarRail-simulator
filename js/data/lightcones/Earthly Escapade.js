// 光円錐: 人生は遊び / 調和
//
// 効果 (気まぐれ):
//   装備キャラの会心ダメージ +32%~60% (S1~S5: 32/39/46/53/60)
//   戦闘開始時、装備キャラは「仮面」獲得 3T。
//   「仮面」がある時、装備キャラ以外の味方の会心率 +10%~14% (10/11/12/13/14)、
//     会心ダメージ +28%~56% (28/35/42/49/56)
//   装備キャラが SP を1回復するたび「虹色の炎」+1層。4層で仮面を獲得 4T (hook 系)
//
// 設計判断:
//   - 「自己 CD+%」は常時系 → stats[]
//   - 「仮面中 他味方 CR/CD バフ」は teammate→focus partyEffect (装備者以外の味方 = focus を含む)
//     「仮面」は戦闘開始3T + 4SP毎の獲得 ≒ ほぼ常時保持できる前提でトグル可

import { PATH } from '../../build/constants.js';
import { STAT } from '../../build/statKeys.js';
import { Registry } from '../../build/registry.js';

const CR_BY_SI = [0.10, 0.11, 0.12, 0.13, 0.14];   // S1~S5
const CD_BY_SI = [0.28, 0.35, 0.42, 0.49, 0.56];   // S1~S5

Registry.lightcone.add({
    id: 'jinseiAsobi',
    name: '人生は遊び',
    path: PATH.HARMONY,
    rarity: 5,

    base: { atk: 529, hp: 1164, def: 463 },

    // 重畳1〜5: 自己 CD +32/39/46/53/60%
    stats: [
        { [STAT.CRIT_DMG]: 0.32 },
        { [STAT.CRIT_DMG]: 0.39 },
        { [STAT.CRIT_DMG]: 0.46 },
        { [STAT.CRIT_DMG]: 0.53 },
        { [STAT.CRIT_DMG]: 0.60 },
    ],

    hooks: (superimpose) => ({}),

    partyEffects: (superimpose) => {
        const idx = Math.max(0, Math.min(4, superimpose - 1));
        const cr = CR_BY_SI[idx];
        const cd = CD_BY_SI[idx];
        return [
            {
                id: 'jinsei_mask_cr_cd',
                source: 'lc',
                name: `仮面中 味方CR+${(cr*100).toFixed(0)}%・CD+${(cd*100).toFixed(0)}%`,
                description: `装備キャラが「仮面」を持っている時、装備キャラ以外の味方の会心率+${(cr*100).toFixed(0)}%・会心ダメージ+${(cd*100).toFixed(0)}%。仮面は戦闘開始時 3T 自動付与 + 虹色の炎4層で再付与 4T。`,
                stats: {
                    [STAT.CRIT_RATE]: cr,
                    [STAT.CRIT_DMG]:  cd,
                },
                defaultActive: false,
                target: 'all',
                duration: 'permanent',
            },
        ];
    },
});
