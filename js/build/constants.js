// 列挙的定数 — 属性・運命・遺物部位
// 各データ定義(キャラ/光円錐/遺物)はここに依存して名前を引く。

export const ELEMENT = Object.freeze({
    PHYSICAL: 'physical',
    FIRE: 'fire',
    ICE: 'ice',
    LIGHTNING: 'lightning',
    WIND: 'wind',
    QUANTUM: 'quantum',
    IMAGINARY: 'imaginary',
});

export const ELEMENT_LIST = Object.freeze([
    ELEMENT.PHYSICAL, ELEMENT.FIRE, ELEMENT.ICE, ELEMENT.LIGHTNING,
    ELEMENT.WIND, ELEMENT.QUANTUM, ELEMENT.IMAGINARY,
]);

export const PATH = Object.freeze({
    DESTRUCTION: 'destruction',
    HUNT: 'hunt',
    ERUDITION: 'erudition',
    HARMONY: 'harmony',
    NIHILITY: 'nihility',
    PRESERVATION: 'preservation',
    ABUNDANCE: 'abundance',
    REMEMBRANCE: 'remembrance',
    ELATION: 'elation',
});

export const SLOT = Object.freeze({
    HEAD: 'head',
    HANDS: 'hands',
    BODY: 'body',
    FEET: 'feet',
    SPHERE: 'sphere',
    ROPE: 'rope',
});

// 4部位セット(トンネル遺物) と 2部位セット(次元界オーナメント) の分類
export const RELIC_SLOTS = Object.freeze([SLOT.HEAD, SLOT.HANDS, SLOT.BODY, SLOT.FEET]);
export const ORNAMENT_SLOTS = Object.freeze([SLOT.SPHERE, SLOT.ROPE]);
export const ALL_SLOTS = Object.freeze([...RELIC_SLOTS, ...ORNAMENT_SLOTS]);

export const SET_TYPE = Object.freeze({
    CAVERN: 'cavern',   // トンネル遺物 = 4部位セット (2pc/4pc) ※内部キーは cavern のまま (互換性維持)
    PLANAR: 'planar',   // 次元界オーナメント = 2部位セット (2pcのみ)
});

// スロット → どちらのセット種別か
export const SLOT_TO_SET_TYPE = Object.freeze({
    [SLOT.HEAD]: SET_TYPE.CAVERN,
    [SLOT.HANDS]: SET_TYPE.CAVERN,
    [SLOT.BODY]: SET_TYPE.CAVERN,
    [SLOT.FEET]: SET_TYPE.CAVERN,
    [SLOT.SPHERE]: SET_TYPE.PLANAR,
    [SLOT.ROPE]: SET_TYPE.PLANAR,
});
