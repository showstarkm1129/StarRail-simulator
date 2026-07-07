// シミュレータが実行時に注入するグローバル関数の型宣言。
// キャラクターデータの hook (Acheron / Castorice 等) が window 経由で呼び出す。
// 実体は simulator.js 側が提供する。ここでは型チェックを通すためのシグネチャのみ。

export {};

declare global {
    interface Window {
        /** 敵にマークを付与する (Acheron 集真赤など) */
        applyMark?: (enemyId: string, markId: string, count: number, opts?: Record<string, unknown>) => void;
        /** 指定マークを消費する */
        consumeMarks?: (enemyId: string, markId: string, count?: number) => number;
        /** 召喚体を生成する (Castorice 死竜など) */
        summonEntity?: (name: string, baseSpeed?: number) => unknown;
        /** 味方の HP を消費する */
        consumeAlliesHP?: (ratio: number, opts?: Record<string, unknown>) => number;
        /** 戦闘シミュの Entity クラス (simulator.js が定義) */
        Entity?: new (...args: any[]) => any;
        /** bootstrap.js が公開するアプリ共通 API */
        SRSIM?: {
            Registry: {
                character: { list: () => unknown[] };
                lightcone: { list: () => unknown[] };
            };
            [key: string]: unknown;
        };
    }
}
