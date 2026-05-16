// データ定義レジストリ
// data/characters/xxx.js などの各データファイルが import 時に自身を登録する。
// 計算層・UI 層は Registry.character.get(id) 等で参照する。
//
// 設計方針:
//   - 登録は ID 必須・重複は警告
//   - 取得後は freeze 済みで返す(誤改変防止)
//   - 簡易な Map ラッパ。依存ゼロ。

function makeStore(label) {
    const map = new Map();
    return {
        add(def) {
            if (!def || !def.id) {
                console.warn(`[Registry.${label}] id を持たない定義は登録できません`, def);
                return;
            }
            if (map.has(def.id)) {
                console.warn(`[Registry.${label}] id "${def.id}" は既に登録済みです。上書きします。`);
            }
            map.set(def.id, Object.freeze(def));
        },
        get(id) {
            return map.get(id) || null;
        },
        has(id) {
            return map.has(id);
        },
        list() {
            return [...map.values()];
        },
        ids() {
            return [...map.keys()];
        },
        size() {
            return map.size;
        },
    };
}

export const Registry = Object.freeze({
    character: makeStore('character'),
    lightcone: makeStore('lightcone'),
    relicSet:  makeStore('relicSet'),
    ornament:  makeStore('ornament'),
});
