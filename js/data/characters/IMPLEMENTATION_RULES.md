# キャラクター実装ルール (Character Implementation Rules)

このドキュメントは、`js/data/characters` 以下のキャラクターデータ実装における現在の定型ルールをまとめたものです。
今後のアップデートや新たな仕様（特殊なバフや新システムなど）が追加された際は、このファイルを拡張・更新していくことを前提としています。

## 1. 基本ファイル構成と登録

- **ファイル作成**: `data/characters/<id>.js` としてファイルを作成します。
- **インポート**: 新たに作成したキャラファイルは `data/characters/_index.js` に `import` を追加して読み込ませます。
- **登録**: 通常形式は `_defineCharacter.js` の `addCharacter()`、詳細データの直接形式は `_characterRegistry.js` の `addCharacterDefinition()` を使います。どちらも最終的には `Registry.character` へ登録されます。
- **火力分類**: `damageScale` は原則 `js/data/characters/damageScaling.js` の分類表で管理します。個別定義で明示した値は分類表より優先されます。値は `DAMAGE_SCALE.ATK` / `HP` / `BREAK` / `ELATION` のいずれかです。

## 2. 基礎ステータス (Base Info & Stats)

- **基本情報**:
  - `id`: 一意の英小文字+数字推奨 (例: `'bronya'`)
  - `name`: 表示名 (例: `'ブローニャ'`)
  - `element`: `ELEMENT` 定数を使用 (例: `ELEMENT.WIND`)
  - `path`: `PATH` 定数を使用 (例: `PATH.HARMONY`)
  - `rarity`: レアリティ (例: `5`)
- **基礎値 (`base`)**:
  - **Lv80時** の固有値として `atk`, `hp`, `def`, `spd` を定義します。
  - 戦闘シミュレーターにおける基礎ヘイト値（狙われやすさ）として `aggro` (例: 巡狩なら `75`、壊滅なら `125`等) を追加定義します。
- **最大EP (`maxEnergy`)**: 必殺技の発動に必要なEP上限値を定義します。

## 3. 軌跡 (Traces) と 常時ステータス

- **`traces`**:
  - **常時加算されるステータス**のみを `traces.stats` に定義します。（例: 攻撃力+28%など）
  - 条件付きのバフ効果（例: 「戦闘開始時〜」や「フィールドにいる時〜」）はここには含めず、後述の `partyEffects` や `selfEffects` に記述します。
  - 参考表示用の内訳として、`breakdown` 配列に各ノード単位のステータス増加量（`node`, `stat`, `value`）を記述することが推奨されます。

## 4. 星魂 (Eidolons) の扱い

- **`eidolons`**:
  - 各凸数（1〜6）における**常時加算ステータス**（耐性貫通など）が存在する場合のみ、`eidolons.<n>.stats` に記述します。
  - 条件付きのバフや挙動変更はここには書かず、`partyEffects` に記述します。
- **`eidolonsDetail`**:
  - 各星魂のテキスト説明やスキルレベル上限突破を定義します。
  - `levelBoost`: `{ ult: 2, basic: 1 }` などのように、どのスキルのレベル上限がいくつ上がるかを指定します。

## 5. スキル定義 (Skills)

`skills` オブジェクトには `basic`, `skill`, `ult`, `talent`, `technique` などの各スキルを定義します。
（※特殊なキャラの場合は `memorySkill` のような独自キーを追加することもあります）

- **必須項目**:
  - `name`, `type` (`'attack'`, `'buff'`, `'passive'`, `'follow_up'`(追加攻撃) 等), `description`
  - `target`: `'single'`, `'all'`, `'single_ally'`, `'all_ally'`, `'blast'`(拡散), `'bounce'`(バウンド) など。
  - `bounceCount`: `target: 'bounce'` の場合、ランダムに跳ねる回数（例: `5`）。
  - `spCost`: 発動時に消費するSP（スキルポイント）。通常はスキルに `1` を指定。
  - `spGain`: 発動時に回復するSP。通常は基本攻撃に `1` を指定。
  - `energyCost`: スキルや必殺技発動時に消費するEP（例: `120`）。
  - `energyGain`: スキルや必殺技発動時に回復するEP（例: 通常攻撃なら `20`、スキルなら `30`）。
  - `toughness`: 敵の靱性（シールド）を削る値（例: 通常攻撃なら `10`、スキルなら `20`）。
  - `hitSplit`: 多段ヒット時の各ヒットごとのダメージ割合の配列（例: 合計1.0となる `[0.3, 0.3, 0.4]` 等）。
- **レベルと倍率 (`levels` と `maxLevel`)**:
  - `maxLevel`: `{ default: 無凸時の上限, withEidolon: 凸時の上限 }` を指定します。
  - `levels`: Lv1 から最大Lv までの倍率値の配列。各要素は `{ atk: 0.50 }` や `{ dmgBuff: 0.33 }` のようなオブジェクトになります。
  - シールドを付与するスキルの場合は、`shieldStat` (参照するステータスキー、通常 `STAT.DEF_BASE` 等) をスキルに指定し、`levels` 配列の要素内に `{ shieldPct: 0.24, shieldFlat: 150 }` などを記述します。

## 6. バフ・デバフ効果の定義 (partyEffects / selfEffects / enemyEffects)

条件付きで発動し、ステータス計算（限界効用逓減やシミュレータ）に影響する効果は以下の配列として定義します。
- `partyEffects`: 味方全体または対象単体へのバフ
- `selfEffects`: 自身へのバフ
- `enemyEffects`: 敵に対するデバフや状態異常（防御力ダウン、持続ダメージなど）

- **共通プロパティ**:
  - `id`: 一意の識別子
  - `source`: `'extra'`(昇格能力), `'ult'`, `'skill'`, `'talent'`, `'technique'`, `'eidolon'` などの発生源分類。
  - `name`: UI表示名。命名規約は「効果名 (発動条件)」。※星魂による効果の場合、名前に「E2」などのプレフィックスは不要（UI側でバッジが自動付与されます）。
  - `description`: ツールチップ用テキスト。
  - `defaultActive`: 初期状態でONにするかどうか (`true` / `false`)。
  - `target`: `'all'` (味方全体) または `'single'` (対象単体)。
  - `duration`: 効果の持続ターン数。
  - `tickRule`: ターン経過（duration減少）の基準。`'caster_turn_end'`（付与者のターン終了時）、`'target_turn_end'`（対象のターン終了時）、`'target_turn_start'` など。
  - `dispellable`: デバフ解除効果などによって解除可能かどうか (`true` / `false`)。
- **デバフ専用プロパティ (`enemyEffects` のみ)**:
  - `debuffType`: デバフの種類分類。`'stat_down'`(ステータス低下), `'control'`(行動制限系), `'dot'`(持続ダメージ) のいずれか。
  - `baseChance`: デバフや状態異常の基礎確率（例: `1.0` で100%）。効果命中と効果抵抗の計算に使用。
  - `dotType` / `dotMultiplier`: `debuffType: 'dot'` の場合に必須。属性(`'shock'`等)と、ダメージ計算の基準となるステータス倍率(`{ atk: 1.20 }`等)。
- **効果量の指定方法 (以下のいずれかを使用)**:
  1. **固定値**: `stats: { [STAT.DMG_ALL]: 0.10 }` （スキルLvに依存しない場合）
  2. **レベル連動**: `fromLevel` (参照するスキルキー) と `computeStats(lv, mult, caster)` 関数を組み合わせて動的に算出します。
  3. **シールド付与**: バフとしてシールドを付与する場合は `shield: { stat: STAT.DEF_BASE, ratio: 0.24, flat: 150 }` の形式で定義します。
- **特殊なバフ設定**:
  - `minEidolon`: 星魂条件付き効果の場合、必要な凸数（例: `2`）を指定。
  - `stackable`: `{ max, default }` を指定し、累積系バフを定義。`stats` には1層あたりの値を指定します。

## 7. 追加能力テキスト (Extras)

- **`extras`**:
  - 昇格2, 4, 6の追加能力のテキスト説明を配列として管理します。
  - `tier`, `name`, `description` を定義。
  - （実際のステータス影響は前述の `traces` や `partyEffects` / `selfEffects` 側で制御します）

## 8. 特殊効果フック (Hooks)

型にはまらない複雑な条件のバフ（例: 会心率の超過分を会心ダメージに変換するなど）や、戦闘開始・攻撃時のトリガー処理は `hooks` オブジェクト内に記述します。
- `onBuildResolved(ctx)`: ステータス確定直後に呼ばれる処理。
- **戦闘シミュレーター用フック**:
  - `onCombatStart(ctx)`: 戦闘開始時の処理。
  - `onTurnStart(ctx)`: ターン開始時の処理。
  - `onTurnEnd(ctx)`: ターン終了時の処理。
  - `onAttack(ctx)`: 攻撃（ダメージ発生）の直前処理。
  - `onHit(ctx)`: 攻撃命中時（ヒットごとの処理や追加効果など）。
  - `onSkillUse(ctx)`: スキルや必殺技の発動時処理。
