// ESLint flat config — Lint (ルール + 軽い見た目)
//   npm run lint      → 検査のみ
//   npm run lint:fix  → 自動修正可能な指摘を修正
//
// 2 つのファイル群を区別する:
//   1. ES Modules  (js/build, js/data, js/ui, bootstrap, server, test)
//        → import/export 前提。モジュールはグローバルを共有しないので
//          no-undef を有効にし、未定義参照を「実バグ」として検出する。
//   2. 非モジュール (js/simulator.js, js/speed.js, js/ui.js)
//        → script スコープ。window 経由で互いの関数を参照し合うため
//          no-undef では追えない。構文・未使用・等価演算子などに絞る。

import js from '@eslint/js';

// --- 共有グローバル (globals パッケージを足さず最小列挙) ---------------
const BROWSER_GLOBALS = {
    window: 'readonly',
    document: 'readonly',
    navigator: 'readonly',
    localStorage: 'readonly',
    location: 'readonly',
    console: 'readonly',
    alert: 'readonly',
    confirm: 'readonly',
    prompt: 'readonly',
    fetch: 'readonly',
    URL: 'readonly',
    Event: 'readonly',
    CustomEvent: 'readonly',
    HTMLElement: 'readonly',
    HTMLInputElement: 'readonly',
    HTMLSelectElement: 'readonly',
    setTimeout: 'readonly',
    clearTimeout: 'readonly',
    setInterval: 'readonly',
    clearInterval: 'readonly',
    requestAnimationFrame: 'readonly',
    structuredClone: 'readonly',
};

const NODE_GLOBALS = {
    process: 'readonly',
    Buffer: 'readonly',
    console: 'readonly',
    URL: 'readonly',
    setTimeout: 'readonly',
    clearTimeout: 'readonly',
};

// 共通の品質ルール (見た目より「壊れ検知」寄り)
const COMMON_RULES = {
    'no-unused-vars': ['warn', { args: 'none', ignoreRestSiblings: true }],
    'no-var': 'error',
    'prefer-const': 'warn',
    'eqeqeq': ['warn', 'smart'],
    'no-console': 'off',
    'no-constant-condition': ['error', { checkLoops: false }],
};

export default [
    js.configs.recommended,

    // グローバル無視
    {
        ignores: ['node_modules/**', 'coverage/**'],
    },

    // 1. ES Modules (アプリ計算層 / データ層 / UI モジュール)
    {
        files: ['js/build/**/*.js', 'js/data/**/*.js', 'js/ui/**/*.js', 'js/bootstrap.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: BROWSER_GLOBALS,
        },
        rules: COMMON_RULES,
    },

    // 2. Node スクリプト (静的サーバー / 設定 / ルート直下の単発 .mjs)
    {
        files: ['server.js', 'eslint.config.js', '*.mjs'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: NODE_GLOBALS,
        },
        rules: COMMON_RULES,
    },
    {
        files: ['test/**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: { ...NODE_GLOBALS, ...BROWSER_GLOBALS },
        },
        rules: COMMON_RULES,
    },

    // 3. 非モジュール (window グローバル共有スクリプト)
    //    互いの関数をグローバル経由で参照するため no-undef は無効化。
    {
        files: ['js/simulator.js', 'js/speed.js', 'js/ui.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'script',
            globals: { ...BROWSER_GLOBALS, SRSIM: 'readonly' },
        },
        rules: {
            ...COMMON_RULES,
            'no-undef': 'off',
            'no-unused-vars': 'off',
        },
    },
];
