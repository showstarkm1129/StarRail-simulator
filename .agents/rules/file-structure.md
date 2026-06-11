---
activation: Always On
---
# ファイル構造

崩壊スターレイル (HSR) のビルド/火力シミュレーター。Vanilla HTML/CSS/JS (ES Modules) で動作、ビルドツール不要。
アプリ実行時はゼロ依存。`tsconfig.json` / `eslint.config.js` / `types/` / `test/` は開発時の検証スタック専用。

## ルート

| パス | 役割 |
|---|---|
| `index.html` | エントリ HTML。3 タブ構成 (速度・行動値 / 戦闘シミュ / 限界効用逓減) |
| `css/style.css` | 全 UI スタイル |
| `Timer_plus_icon.png` | アプリ用アイコン画像 |
| `server.js` | 依存ゼロの静的ファイルサーバー (`npm run dev`) |
| `package.json` | 開発スクリプト (`dev` / `verify`) と開発依存 |
| `CLAUDE.md` | 開発用ドキュメント・コーディング規約 |
| `コンセプト.md` | ツールのコンセプト・設計思想 (数値の実験場) |
| `検証スタック.md` | 検証スタックの説明。実装後は `npm run verify` (型/Lint/テスト/カバレッジ) を緑にする |
| `Antigravity.md` | Antigravity 基本方針 (開発規約) |
| `tsconfig.json` / `eslint.config.js` / `types/` / `test/` | 検証スタック (開発時のみ。アプリ実行時はゼロ依存) |

## js/

### トップレベル

| ファイル | 役割 |
|---|---|
| `bootstrap.js` | ES Modules エントリ。データ層を import (副作用で Registry 登録) → 計算/橋渡しを `window.SRSIM` に公開 |
| `simulator.js` | 戦闘シミュタブ (非モジュール、`window.SRSIM` 経由でアクセス) |
| `speed.js` | 速度・行動回数タブ (非モジュール) |
| `ui.js` | 既存 3 タブ共通の DOM 操作 (非モジュール) |

### js/build/ — 計算 & スキーマ層

| ファイル | 役割 |
|---|---|
| `registry.js` | `Registry.character` / `lightcone` / `relic` / `ornament` の登録庫 |
| `constants.js` | `ELEMENT` / `PATH` / `SLOT` / `SET_TYPE` 等の列挙 |
| `statKeys.js` | `STAT` 枠キー定数。**文字列リテラルでステータスキーを書かないこと** |
| `relicMainTable.js` | 遺物メインステ ID → STAT 枠キー マッピング |
| `substatTable.js` / `substatRoller.js` | サブステ確定値テーブル / ロール処理 |
| `statComputer.js` | Build → FinalStats (`raw` / `derived`) 算出 |
| `buildStore.js` | ビルド永続化 (localStorage) |
| `buildToEntity.js` | Build → 戦闘シミュ用 Entity 変換 |
| `diminishing.js` | 火力貢献率 (限界効用逓減) 計算。`compareBuilds(before, after)` / `computeDamageFactors(stats)` |
| `skillUtil.js` | スキル種別判定など共通ユーティリティ |

### js/data/ — データ層 (import 時の副作用で Registry に登録)

```
js/data/
├── IMPLEMENTATION.md      ← データ追加の実装ルール (全カテゴリ共通)
├── characters/
│   ├── _index.js          ← 全キャラを集約 import
│   ├── template.js        ← 新規キャラ用テンプレート
│   ├── IMPLEMENTATION_RULES.md  ← キャラ実装ルール
│   ├── Acheron.js / Aventurine.js / Castorice.js / Cipher.js / Evernight.js / bronya.js / hyacine.js  ← 実装済みキャラ
│   └── testAll.js / testAllS1.js  ← 全装備 partyEffect 検証用テストキャラ
├── lightcones/            ← 光円錐 (HSR 公式英名)
│   ├── _index.js
│   ├── IMPLEMENTATION_RULES.md  ← 光円錐実装ルール
│   └── 各光円錐 .js
├── Cavern Relics/         ← 4 部位遺物セット (HSR 公式英名)
│   ├── _index.js
│   └── 各セット .js
└── Planar Ornaments/      ← 2 部位オーナメント (HSR 公式英名)
    ├── _index.js
    └── 各セット .js
```

### js/ui/

| ファイル | 役割 |
|---|---|
| `diminishingUI.js` | 限界効用逓減タブの UI (比較表 / 表示項目フィルタ / パーティバフ管理 / スナップショット前後表示) |
| `statIcons.js` | ステータスアイコン (自作インライン SVG) の単一ソース。ステータスキー → アイコンを正規化し全画面から参照 |

## .claude/ ・ .agents/ — AI エージェント設定

| パス | 役割 |
|---|---|
| `.claude/AGENTS.md` | プロジェクト規約・ファイル構造・partyEffect スキーマ等のリファレンス |
| `.claude/settings.json` | Claude Code 設定。Stop フックで `npm run verify` を自動実行 |
| `.claude/launch.json` | dev サーバー起動設定 (port 8080) |
| `.agents/rules/antigravity-trigger.md` | `Antigravity.md` の規約を最優先で遵守させるトリガー |
| `.agents/rules/file-structure.md` | 本ファイル (ファイル構造リファレンス) |
