# Cavern Relics 実装ガイドライン

このドキュメントは、トンネル遺物（Cavern Relics）データの実装において現在定まっているルールを定型化したものです。
今後新しい仕様や特殊な遺物セットが追加された場合は、本ドキュメントの該当セクションを拡張・更新してください。

## 1. ファイルとディレクトリ構成

* **ファイル命名規則:** HSR公式の英名を使用します（例: `Messenger Traversing Hackerspace.js`）。
* **エントリーポイント:** 新しい遺物セットを追加した際は、必ず同ディレクトリの `_index.js` に `import` 文を追記してください。

## 2. インポートと基本定義

遺物セットの定義ファイルでは、主に以下のモジュールをインポートします。

```javascript
import { STAT, ELEMENT_DMG_KEYS } from '../../build/statKeys.js';
import { SET_TYPE } from '../../build/constants.js';
import { Registry } from '../../build/registry.js';
```

`Registry.relicSet.add()` を使用して遺物セットを登録します。

### 2.1. 基本プロパティ

* `id`: **日本語ローマ字、または短い英略称**（例: `'messenger'`, `'kunanShisai'`, `'eagle'`）を使用します。ファイル名とは異なりますので注意してください。
* `name`: ゲーム内の日本語公式名称（例: `'仮想空間を漫遊するメッセンジャー'`）。
* `type`: `SET_TYPE.CAVERN` で固定です。

## 3. セット効果の定義

トンネル遺物は2セット効果（`pc2`）と4セット効果（`pc4`）を持ちます。これらは自身のステータスや特定アクション時のフック、味方へのバフ（`partyEffects`）に分けて実装されます。

実装の冒頭には、どのように設計・マッピングしたかを示す `// 設計判断:` のコメントブロックを記述することが推奨されます。

### 3.1. 自己ステータス（stats）

無条件で装備者自身に付与されるステータスは `stats` オブジェクト内に定義します。

* **2セット効果 (`pc2.stats`)**: 基本的にここに2セットの常時ステータス上昇を記述します。
* **4セット効果 (`pc4.stats`)**: 4セット効果による常時ステータス上昇がある場合はここに記述します。

```javascript
pc2: {
    stats: { [STAT.SPD_PERCENT]: 0.06 },
},
pc4: {
    stats: {}, // 常時ステータスがない場合は空オブジェクトを置く
},
```

※ 本シミュレータで計算対象外のステータス（例：バリア耐久など）については、`stats` を空にし、コメントで未対応であることを明記します。

### 3.2. 戦闘イベントフック（hooks）

装備者自身のアクション（攻撃、必殺技など）をトリガーに発動する効果や行動順の前倒しなどは、`hooks` オブジェクト内に実装します。セット効果（`pc2`, `pc4`）の中で定義するか、ルートに定義することができます。

```javascript
// 例: 4セット効果のフック
pc4: {
    stats: {},
    hooks: {
        onUltUse(ctx) {
            // 例: 必殺技発動時に自身の行動値を25%短縮
            ctx.self?.advanceAction?.(0.25);
        },
    },
},
// ルートレベルでの定義例
hooks: {
    // onAttack(ctx) {}
},
```

### 3.3. 味方・パーティ全体への効果（partyEffects）

4セット効果が「味方全体」や「特定の味方」に対するバフとして機能する場合は、`partyEffects` オブジェクトの `pc4` 配列に定義します。サポートキャラが装備し、フォーカスキャラ（シミュレーション対象）にバフを与える際に用いられます。

```javascript
partyEffects: {
    pc4: [
        {
            id: 'set_unique_effect_id',
            source: 'set',
            name: 'UI表示用の短い名前（例: 必殺後 味方 SPD+12% (1T)）',
            description: '効果の詳細な説明文、及びONにする前提条件',
            stats: { [STAT.SPD_PERCENT]: 0.12 },
            defaultActive: false, // 基本はfalse
            target: 'all',        // 'all' (全体), 'single' (単体)
            duration: 1,          // ターン数、または 'permanent'
            // stackable: { max: 2, default: 2 }, // 累積可能な場合
        },
    ],
},
```

* `target`: 
  * 全体効果の場合は `'all'` を指定します。
  * 装備者が単体を対象とする効果（例: 苦難司祭）の場合は `'single'` を指定します。
* `stackable`: 重ねがけが可能なバフの場合に定義します。複数キャラが同じ遺物セットを装備して重複発動するケースなどを考慮し、上限（`max`）や初期値（`default`）を設定します。
* `tickRule`: バフのターン消費ルール（`'turnStart'` など）。永続の場合は `'none'`。
* `dispellable`: バフ・デバフが解除可能かどうか（通常、遺物効果は `false`）。
* `shield`: シールドを付与する効果の場合、`shield: { stat: STAT.HP_BASE, ratio: 0.16, flat: 100 }` などのように耐久値の計算定義を含めます。

### 3.4. 敵へのデバフ効果（enemyEffects）

遺物セット効果によって敵にデバフを付与する場合は、`enemyEffects` オブジェクトの `pc4` 配列などに定義します。敵に対して適用される効果であり、`baseChance` (基礎確率) などを指定できます。

```javascript
enemyEffects: {
    pc4: [
        {
            id: 'set_debuff_id',
            source: 'set',
            name: 'UI表示用のデバフ名',
            description: 'デバフの詳細な説明文',
            debuffType: 'stat_down',
            stats: { [STAT.DEF_PEN]: 0.10 },
            defaultActive: false,
            duration: 1,
            tickRule: 'turnStart',
            dispellable: false,
            baseChance: 1.0, // 基礎確率 (100%)
            // dotType: 'shock', // 持続ダメージの場合は追加
            // dotMultiplier: { atk: 1.20 }, // 持続ダメージの場合は追加
        },
    ],
},
```

## 4. 特殊なケース・設計判断の指針

* **装備者のみにかかる条件付き自己バフ:** 
  現在のシミュレータ構造上、装備者本人（フォーカス対象ではない味方）にかかるステータスバフ（例: 天地再創の「装備者HP+24%」）は、フォーカスキャラに影響を与えないため、あえて実装を省略することがあります。その際は「装備者自身のみ (focus には伝わらない)」とコメントに残します。
* **特定の前提条件があるバフ:**
  「ヒーラーが回復をした後」「バリアが付与されている前提」などのバフは、通常の運用で満たされる場合、UI上で手動トグルできるよう `partyEffects` として提供し、説明文に「～の前提でON」と記述します。

---
**拡張時の注意:** 新しいステータスタイプ（撃破特効や特定の属性耐性貫通など）や新しいトリガー条件が登場した場合は、`statKeys.js` や `hooks` の引数仕様を確認し、必要に応じて本ガイドラインのセクションを追加してください。
