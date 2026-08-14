# データ層 実装ガイド(全カテゴリ共通)

`js/data/` 配下のデータ定義(キャラクター / 光円錐 / トンネル遺物 / 次元界オーナメント)を
追加・編集するときの統一ルール。**カテゴリごとに別の手引きを作らないこと** —
本ファイルが唯一の手引きで、語彙の正は検証テストが持つ。

> 旧 `cavern relics/IMPLEMENTATION_GUIDE.md` と `planar ornaments/IMPLEMENTATION_RULES.md` は
> 本ファイルへ統合・削除済み。

---

## 0. 大原則

1. **語彙の正は [`test/dataSchema.test.js`](../../test/dataSchema.test.js)**。
   `tickRule` / `duration` / `source` / `target` の許可値はそこで定義され、`npm run verify`
   で機械チェックされる。**本書には許可値を再掲しない**(再掲すると古くなるため)。
   迷ったらテストの許可セット(`TICK_RULES` / `DURATION_STRINGS` / `TARGETS` / `SOURCES`)を見る。
2. **スタットキーは必ず `STAT` / `ELEMENT_DMG_KEYS` 定数経由**。文字列直書き禁止
   (例 `'dmgQuantum'` ではなく `[ELEMENT_DMG_KEYS.quantum]`)。
   存在しないキーは検証テストが弾く(`STAT.DEF_PEN` 等は存在しない → `DEF_DOWN` / `DEF_IGNORE` を使う)。
3. 実装の冒頭に `// 設計判断:` コメントで「どの効果をどの枠にマッピングしたか・なぜ未実装か」を残す。

---

## 1. 効果オブジェクト共通スキーマ

`partyEffects` / `selfEffects` / `enemyEffects` の各要素は共通の形を取る。
全フィールドの詳細は [`characters/template.js`](characters/template.js) のコメントを参照(=雛形)。

| フィールド | 意味 |
|---|---|
| `id` | 一意なID |
| `source` | UI分類(キャラ: `extra`/`ult`/`skill`/`talent`/`technique`/`eidolon`、装備: `lc`/`set`) |
| `name` / `description` | UI表示名 / ツールチップ(条件やON前提を明記) |
| `stats` | 加算ステ。キーは定数経由。Lv連動は `fromLevel` + `computeStats` |
| `defaultActive` | 初期 ON/OFF |
| `target` | `all`(味方全体) / `single`(主役対象想定) |
| `duration` | 数値ターン / `permanent` / `conditional` |
| `tickRule` | ターン減少基準(許可値はテスト参照) |
| `dispellable` | 解除可能か(装備効果は通常 `false`) |
| `stackable` | `{ max, default }`。`type:'step'` + `stepValues` で段階値 |
| `minEidolon` | 星魂下限(キャラのみ) |

---

## 2. 置き場所の判断ルール(全カテゴリ共通・最重要)

効果を**1か所だけ**に書く。二重計上・反映漏れはここで防ぐ。

| 効果の性質 | 置き場所 |
|---|---|
| **自分(と自分の召喚物)だけ**に乗る常時ステ | キャラ: `eidolons.<n>.stats` / 装備: 装備者自己枠(`stats` / `pc2.stats`) |
| **味方全体に配る**常時ステ・オーラ | `partyEffects`(eidolons や自己枠には書かない) |
| **火力に効かせたい敵デバフ**(`DMG_TAKEN` / `RES_PEN` / `DEF_DOWN` / `DEF_IGNORE` とその種別別枠) | ★ `partyEffects`(`target:'all'`)に書く |

### 攻撃種類ごとの枠

通常 / 戦闘スキル / 必殺 / 追加攻撃だけに効く補正は、全攻撃へ乗る汎用枠に入れず、種別別キーを使う。

| 種類 | キー例 |
|---|---|
| 与ダメージ | `DMG_BASIC` / `DMG_SKILL` / `DMG_ULT` / `DMG_FOLLOWUP` |
| 会心率 | `CRIT_RATE_BASIC` / `CRIT_RATE_SKILL` / `CRIT_RATE_ULT` / `CRIT_RATE_FOLLOWUP` |
| 会心ダメージ | `CRIT_DMG_BASIC` / `CRIT_DMG_SKILL` / `CRIT_DMG_ULT` / `CRIT_DMG_FOLLOWUP` |
| 防御無視 | `DEF_IGNORE_BASIC` / `DEF_IGNORE_SKILL` / `DEF_IGNORE_ULT` / `DEF_IGNORE_FOLLOWUP` |
| 耐性貫通/耐性Down | `RES_PEN_BASIC` / `RES_PEN_SKILL` / `RES_PEN_ULT` / `RES_PEN_FOLLOWUP` |
| 被ダメージアップ | `DMG_TAKEN_BASIC` / `DMG_TAKEN_SKILL` / `DMG_TAKEN_ULT` / `DMG_TAKEN_FOLLOWUP` |

例: 「追加攻撃の会心ダメージ+25%」は `CRIT_DMG_FOLLOWUP`、「敵が受ける必殺技ダメージ+15%」は `DMG_TAKEN_ULT`。

### enemyEffects の位置づけ(重要)
- **火力計算(限界効用逓減)も戦闘シミュも、現状 `enemyEffects` は読まない**(未配線)。
- `enemyEffects` は「将来の戦闘シミュ用データ保管庫」。`baseChance` / `debuffType` 等の
  詳細フィールドはシミュ実装時に確定させる暫定スキーマで、今は厳密でなくてよい。
- **火力に効かせたい敵デバフは必ず `partyEffects` にミラーする**。
  `enemyEffects` だけに書くと火力計算に反映されない。
  ミラー漏れは `dataSchema.test.js` の「火力枠デバフは enemyEffects だけに置かない」が検知する。

### キャラクター効果の棚卸し補助

- `npm run audit:characters -- --character robin` で、Wiki説明文から数値化できそうな未登録効果と、現状未対応の能力メモを確認できる。
- `npm run upsert:character-effect -- --character robin --group selfEffects --effect '{...}'` で、生成キャラファイルの効果をID基準で追加/差し替えできる。
- 判定ルールは [`characters/effectRules.js`](characters/effectRules.js) に集約する。愉悦度・超撃破・移動速度など、まだ専用形式がないものはここに未対応ルールとして残す。

---

## 3. カテゴリ別の構造差分

| | 登録 | 効果の入れ物 | 自己ステ | 備考 |
|---|---|---|---|---|
| **キャラクター** | `Registry.character.add` | `partyEffects` / `selfEffects` / `enemyEffects` = **配列** | `traces.stats` / `eidolons.<n>.stats` | `skills`(`levels` + `maxLevel`) / `extras` / `eidolonsDetail`。雛形: `characters/template.js` |
| **光円錐** | `Registry.lightcone.add` | `(superimpose) => []` の**関数** or 配列 | `stats`(S1〜S5 の**5件配列**) | `base { atk, hp, def }`。`hooks` も `(superimpose) => ({})` |
| **トンネル遺物** | `Registry.relicSet.add` | `partyEffects` / `selfEffects` = **`{ pc2:[], pc4:[] }`** | `pc2.stats` / `pc4.stats` | `type: SET_TYPE.CAVERN`。`hooks` は `pc4` 内 or ルート |
| **次元界オーナメント** | `Registry.ornament.add` | `partyEffects` / `selfEffects` = **`{ pc2:[] }`** (pc2のみ) | `pc2.stats` | `type: SET_TYPE.PLANAR` |

---

## 4. ファイル・登録の作法

1. ファイル名は **HSR 公式英名の先頭だけ小文字**(例 `messenger Traversing Hackerspace.js`)。
2. `id` は **HSR 公式英名**。UI表示用の `name` は日本語表記にする。
3. 追加したら同カテゴリの `_index.js` に `import './<新ファイル>.js';` を1行追記。
4. 計算対象外のステ(バリア耐久など専用枠が無いもの)は `stats` を空にし、コメントで未対応を明記。
5. 装備者本人のみに効く条件付き自己バフ(focus に伝わらないもの)は省略可。その旨をコメントに残す。

---

## 5. 検証

実装後は `npm run verify`(型チェック / Lint / テスト+カバレッジ)を緑にする。
データ書式は [`test/dataSchema.test.js`](../../test/dataSchema.test.js) が自動検査する:

- `tickRule` / `duration` / `target` / `source` の語彙
- stat キーが `ALL_STAT_KEYS` に実在するか(効果 + `traces` / `eidolons` / `breakdown` / 光円錐 `stats` / 遺物 `pc2/pc4`)
- スキル `levels` の段数(`maxLevel.withEidolon` 以上)と各値の型(`null` = 値未定の枠は許容)
- 火力枠デバフの `enemyEffects` のみ配置(=ミラー漏れ)

語彙を増やしたいときは、**まず `dataSchema.test.js` の許可セットを更新**してから使うこと
(テストが唯一の正なので、ここを変えれば全カテゴリに一貫して効く)。
