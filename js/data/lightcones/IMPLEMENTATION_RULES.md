# 光円錐実装ルール (Lightcone Implementation Rules)

このドキュメントは、`js/data/lightcones` 以下の光円錐データ実装における現在の定型ルールをまとめたものです。
今後のアップデートや新たな仕様（特殊なバフや新システムなど）が追加された際は、このファイルを拡張・更新していくことを前提としています。

## 1. 基本ファイル構成と登録

- **ファイル作成**: `js/data/lightcones/<先頭小文字のHSR公式英名>.js` としてファイルを作成します（例: `but the Battle Isn't Over.js`）。
- **インポート**: 新たに作成したファイルは `js/data/lightcones/_index.js` に `import './<先頭小文字のHSR公式英名>.js';` を追加して読み込ませます。
- **登録**: `Registry.lightcone.add({ ... })` を用いて光円錐オブジェクトを登録します。
- **インポート元の統一**: 
  - `PATH` は `import { PATH } from '../../build/constants.js';`
  - `STAT` は `import { STAT } from '../../build/statKeys.js';`
  - `Registry` は `import { Registry } from '../../build/registry.js';`

## 2. 基礎ステータス (Base Info & Stats)

- **基本情報**:
  - `id`: 一意の識別子
  - `name`: 表示名 (例: `'だが戦争は終わらない'`)
  - `path`: `PATH` 定数を使用 (例: `PATH.HARMONY`)
  - `rarity`: レアリティ (例: `5` または `4`)
- **基礎値 (`base`)**:
  - **Lv80時** の固定ステータスとして `atk`, `hp`, `def` を定義します。

## 3. 常時ステータス上昇 (Stats Array)

- **`stats`**:
  - 重畳(Superimpose) 1〜5（S1〜S5）における**常時加算されるステータス**を要素数5の配列として定義します。
  - 例: 
    ```javascript
    stats: [
        { [STAT.ENERGY_REGEN]: 0.10 },
        { [STAT.ENERGY_REGEN]: 0.12 },
        // ... S5まで
    ]
    ```
  - 条件付きバフ（「攻撃後〜」など）や味方へのバフはこの配列には含めません。
  - 常時加算されるステータスがない場合は、空のオブジェクトを5つ入れた配列 `[{}, {}, {}, {}, {}]` を定義します。

## 4. バフ効果の定義 (selfEffects, partyEffects, enemyEffects)

条件付きで発動し、ステータス計算（限界効用逓減やシミュレータ）に影響するバフ効果は `selfEffects` (自身へのバフ), `partyEffects` (味方へのバフ), `enemyEffects` (敵へのデバフや状態異常) の配列関数として定義します。

- **`partyEffects: (superimpose) => { ... }`** (他と同様に `selfEffects`, `enemyEffects` も定義):
  - 引数として重畳レベル（`superimpose`）を受け取り、効果オブジェクトの配列を返します。
  - 重畳レベルによる値の変動は、ファイル上部に定数配列（例: `DMG_BY_SI = [0.30, 0.35, 0.40, 0.45, 0.50]`）を用意し、`superimpose - 1` をインデックスとして参照するパターンが推奨されます。※Wikiなどで重畳2~4の値が不明な場合は線形補間で算出します。
- **共通プロパティ**:
  - `id`: 一意の識別子（例: `'dagaSensou_skill_next_dmg'`）
  - `source`: 常に `'lc'` を指定します。
  - `name`: UIでの表示名。どの重畳レベルでの効果量なのかが分かりやすいように、算出した値を含めることが推奨されます。（例: `` `戦闘スキル後 次行動の他味方 与ダメ+${(dmg*100).toFixed(0)}% (1T)` ``）
  - `description`: ツールチップ用の詳しいテキスト。
  - `defaultActive`: 初期状態でONにするかどうか (`true` / `false`)。
  - `target`: `partyEffects` では `'all'` (味方全体) または `'single'` (対象単体)。装備キャラの特定行動後に自身以外の味方に付与される場合も `'single'` などを適切に設定します。
  - `duration`: 効果時間（表示用。計算には使用されない）。
- **シミュレータ向けプロパティ (必須)**:
  - `tickRule`: 効果の消費タイミング。`duration` が設定されている場合は基本的に `'target_turn_start'`（対象のターン開始時）や `'caster_turn_end'`（付与者のターン終了時）などを指定します。永続効果 (permanent) の場合は `'none'` を指定します。
  - `dispellable`: 解除可能かどうか。光円錐による効果は基本的に `false` です。
- **敵へのデバフ (enemyEffects)**:
  - 敵へのデバフや状態異常効果は `partyEffects` や `selfEffects` ではなく `enemyEffects` 配列に定義します。
  - `debuffType`: デバフの種類（`'stat_down'`, `'control'`, `'dot'`）。
  - `baseChance`: 基礎確率（例: `1.0`）。
  - `dotType` / `dotMultiplier`: `debuffType: 'dot'` の場合は属性(`'shock'`等)とダメージ倍率(`{ atk: 1.20 }`等)を指定します。
- **特殊なバフ設定**:
  - `stackable`: 層数が変動する効果（例: 「聖なる詠唱」）には `{ max, default }` を指定します。`stats` には**1層あたりの値**を指定し、UI側で「値 × 層数」の計算を行えるようにします。
  - `shield`: シールドを付与する効果の場合、`shield: { stat: STAT.HP_BASE, ratio: 0.16, flat: 100 }` などのように耐久値の計算定義を含めます。

## 5. 特殊効果フック (Hooks)

- **`hooks: (superimpose) => ({})`**:
  - 複雑な条件判定や、戦闘中の特定トリガー（例: 攻撃時EP回復など）が必要な場合に備えた戦闘イベントフックです。
  - 全ての js ファイルにおいて、エクスポートするオブジェクトのプロパティとして空の `hooks` オブジェクトを必ず追加してください。
  - コメントとしてフックの候補（`// onTurnStart(ctx) {}`, `// onHit(ctx) {}`, `// onSkillUse(ctx) {}` など）を記述しておくことが推奨されます。
  - 現状のシミュレーションシステム（本ツール）の対象外となる自己EP回復などのフック系処理は、バフとして計算せず、コメントとしてドキュメント化しつつ、空のオブジェクトを返す状態にしておくのが一般的です。
