- 実装、編集後、該当箇所に禀質チェックを実施。論理的な破綻や保守性を確認し、問題があれば修正。
- **新たに実装する新機能**に関しては、今後使いまわしやすい形式を意識する。
- ユーザーへの解説は専門用語を極力避け理解しやすく伝えること。

## コンセプト（思考時の最重要原則 / 詳細は `コンセプト.md`）

- **このツールの正体**: 崩壊スターレイルの「数値の実験場」。育てる前に火力・速度・ステ配分を自由にいじって即確認できる場所。
- **ペルソナ**: 理論値を詰めたい上級者。初心者向けの手厚い解説・入門ガイドは主目的ではない。
- **存在意義の芯**: 「すぐに・簡単に・効率的に」数値検証できること。高機能な計算機ではなく、速く自由に試せる実験場。
- **判断基準**: **計算の正確さ・機能の網羅を最優先**。UIの綺麗さ・初心者向け解説・配信向け演出は後回しでよい。
- → 機能追加・UI・優先順位で迷ったら、上記とペルソナに照らして判断する。

---

# ファイル構造

崩壊スターレイル (HSR) のビルド/火力シミュレーター。Vanilla HTML/CSS/JS (ES Modules) で動作、ビルドツール不要。

## ルート

| パス | 役割 |
|---|---|
| `index.html` | エントリ HTML。3 タブ構成 (速度・行動値 / 戦闘シミュ / 限界効用逓減) |
| `css/style.css` | 全 UI スタイル |
| `最初の計画.md` | 初期設計メモ (履歴) |
| `検証スタック.md` | **検証スタックの説明**。実装後は `npm run verify` (型/Lint/テスト/カバレッジ) を緑にする |
| `server.js` | 依存ゼロの静的ファイルサーバー (`npm run dev`) |
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
| `statKeys.js` | `STAT` 枠キー定数 (ATK/HP/DEF/CRIT/DMG_ALL/DMG_BASIC/SKILL/ULT/FOLLOWUP/DMG_TAKEN/DEF_DOWN/RES_PEN 等)。**文字列リテラルでステータスキーを書かないこと** |
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
├── characters/
│   ├── _index.js          ← 全キャラを集約 import
│   ├── template.js        ← 新規キャラ用テンプレート
│   ├── bronya.js / hyacine.js  ← 実装済みキャラ
│   └── testAll.js / testAllS1.js  ← 全装備 partyEffect 検証用テストキャラ
├── Lightcones/            ← 光円錐 (HSR 公式英名)
│   ├── _index.js
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

---

# 規約・運用メモ

## サブエージェント運用ルール (トークン節約)

**原則**: 「大量のファイルを読むが、最終的に欲しいのは少量の結論」というタスクだけサブエージェントに出す。サブエージェント内の検索結果・全文はメイン会話に残らず、要約だけ返るため節約になる。逆にサブエージェントは毎回ゼロ起動で本プロジェクトの規約を再把握するコストがかかるので、小タスクや密な往復作業ではメイン直処理の方が安い。

**呼ぶ (読み取りは `Explore` / 書き込み伴う独立タスクは `general-purpose`)**

- `js/data/` 配下の横断調査 (例: `partyEffect` を持つ光円錐の列挙、特定 `STAT` 使用箇所の洗い出し)
- 規約違反の一括チェック (例: 文字列リテラルでステキー直書きしている箇所の全データ走査)
- 既存実装パターンの調査 (例: 既存キャラの `computeStats` の典型的書き方の把握)
- 「どこにあるか分からない」探索 (grep 数回で当たりが付かないもの)

**呼ばない (メインで直接やる方が安い)**

- 場所が分かっている 1〜数ファイルの編集 (新キャラ/光円錐の追加など)
- 計算ロジックの修正 (`diminishing.js` 等。コンセプト・既存文脈を密に使う)
- grep 1回で済む小さな確認
- preview ツールによる UI 検証 (メイン側専用)

**依頼時の注意**: サブエージェントは文脈を引き継がない。依頼文に対象パスと関連規約 (STAT 定数経由・`_index.js` は触らない 等) を毎回明記し、返答は「結論＋該当ファイルパス」だけに絞らせる (全文を返させると節約効果が消える)。

## データファイル追加フロー

1. `js/data/<カテゴリ>/<HSR 公式英名>.js` を作成
2. `Registry.lightcone.add({ ... })` 等で登録 (ファイル冒頭で `import { Registry } from '../../build/registry.js';`)
3. 同じカテゴリの `_index.js` に `import './<新ファイル>.js';` を1行追加

## 命名規則

- データフォルダ名は **HSR 公式英名** (`Lightcones` / `Cavern Relics` / `Planar Ornaments`)
- データファイル名は HSR 公式英名 (例: `Epoch Etched in Golden Blood.js`)
- ユーザーが手動で正規英名にリネーム中の段階では `_index.js` と既存ファイル名を勝手に変更しない (作業衝突防止)

## スタットキーの扱い

- `STAT.ATK_PERCENT` のように **必ず定数経由** で参照 (タイポ検知のため)
- スキル種別ダメ枠は `DMG_BASIC` / `DMG_SKILL` / `DMG_ULT` / `DMG_FOLLOWUP` で独立、共通枠は `DMG_ALL`
- 属性別ダメ枠は `makeElementDmgKey(element)` (`dmgFire` 等) で動的生成

## partyEffect スキーマ (キャラ/光円錐/セットに搭載可能)

```js
{
    id: 'unique_id',
    source: 'character' | 'lc' | 'relic' | 'ornament',
    name: '表示名',
    description: '効果説明',
    stats: { [STAT.ATK_PERCENT]: 0.20 },  // 加算対象スタット
    defaultActive: true,                   // 初期 ON/OFF
    target: 'all' | 'single',              // 全体 / 単体
    duration: 3,                           // ターン継続 (任意)
    minEidolon: 1,                         // 星魂下限 (任意)
    stackable: { max: 3, default: 1 },     // 累積層 (任意)
    fromLevel: 1,                          // S1〜S5 で値が変わる場合
    computeStats: (superimpose) => ({ ... }),
}
```
