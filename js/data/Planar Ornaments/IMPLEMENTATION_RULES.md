# 次元界オーナメント実装ルール・ガイドライン

このドキュメントでは、`js/data/Planar Ornaments/` ディレクトリ配下における次元界オーナメントの実装において、現在定まっているルールや設計パターンを定型化して記載します。
今後、新しい効果やシステムが追加された際には、このドキュメントを拡張してルールを更新してください。

## 1. ファイルと登録の基本ルール

*   **ファイル名:** 公式の英語名を使用する。（例: `Broken Keel.js`）
*   **登録方法:** `Registry.ornament.add({...})` を使用する。
*   **ID定義:** `id` プロパティには、日本語名のローマ字表記を使用する。（例: `oretaRyukotsu`, `rusaka`）
*   **タイプ:** `type: SET_TYPE.PLANAR` を指定する。
*   **インデックス:** 新しいオーナメントを追加した場合は、必ず `_index.js` に `import` 文を追記する。

## 2. 設計判断とコメントの記述

ファイル先頭には、以下の形式でオーナメントの効果と「設計判断（実装上の解釈）」を必ずコメントとして記述する。
これにより、なぜそのように実装されたのか（または未実装なのか）を明確にする。

```javascript
// 次元界オーナメント: [日本語名]
//   2pc: [ゲーム内テキストの効果説明]
//
// 設計判断:
//   - 「自己 ステータス+X%」は自己ステ → pc2.stats
//   - 「[条件]で味方全体 ステータス+Y%」は teammate→focus partyEffect。
//     [ON/OFFのデフォルト状態や、誰をターゲットにするかの判断理由]
```

## 3. ステータス上昇効果の実装方針

### 3.1. 無条件の自己ステータス上昇
常に発動している装備者自身へのステータスバフは、`pc2.stats` に直接記述する。

```javascript
pc2: {
    stats: { [STAT.CRIT_RATE]: 0.08 },
}
```

### 3.2. 条件付きの自己ステータス上昇
特定の行動（追加攻撃時など）をトリガーとする装備者自身へのステータスバフは、現状のシミュレータの静的計算の枠組み（自己バフのトグル未実装）においては、**`pc2.stats` にも含めず、`partyEffects` にも登録しない**（将来のフック領域等での実装を待つ方針とする）。設計判断コメントにその旨を記載する。

### 3.3. 味方へのバフ（Party Effects）
装備者以外（またはパーティ全体）へ影響を与えるバフは、`partyEffects.pc2` 配下に配列として定義する。

*   **id:** `[オーナメントID]_[効果略称]` の形式。（例: `oretaRyukotsu_crit_dmg`）
*   **source:** `'set'` とする。
*   **name:** 短く分かりやすい名前。条件を含むと良い。（例: `効果抵抗≧30% 条件 味方CD+10% (常時発動)`）
*   **description:** 効果の詳しい説明と、シミュレータ上でのON/OFF運用方法を記載。
*   **stats:** 付与するステータス。（例: `{ [STAT.CRIT_DMG]: 0.10 }`）
*   **defaultActive:** 
    *   `false`: ステータス条件（効果抵抗≧30%など）や戦闘中の特定イベント（敵撃破など）を満たした時のみ発動する場合は `false` にし、ユーザーがUIで手動トグルさせる。
    *   `true`: シミュレータの前提（装備 teammate はサポート枠であり、1枠目ではない等）により常に条件が成立する場合は `true` にする。
*   **target:** パーティ全体へのバフなら `'all'`、特定枠（1枠目のアタッカーなど）へのバフなら `'single'`。
*   **duration:** 基本的に `'permanent'`（常時または戦闘中持続）。

#### 実装例（partyEffects）
```javascript
partyEffects: {
    pc2: [
        {
            id: 'oretaRyukotsu_crit_dmg',
            source: 'set',
            name: '効果抵抗≧30% 条件 味方CD+10% (常時発動)',
            description: '装備キャラの効果抵抗が30%以上の場合、パーティ全体の会心ダメージ+10%。装備 teammate の効果抵抗が条件を満たしていればONにする。',
            stats: { [STAT.CRIT_DMG]: 0.10 },
            defaultActive: false,
            target: 'all',
            duration: 'permanent',
        },
    ],
}

## 4. シミュレータ向けプロパティ (tickRule, dispellable, baseChance)

バフ・デバフの詳細な挙動をシミュレータ上で正しく扱うため、全てのエフェクト（`partyEffects` や `enemyEffects` の各要素）には以下のプロパティを記述します。

*   **tickRule:** バフ/デバフのターン消費タイミングを指定します。一般的なオーナメントによるバフ・デバフ（戦闘中永続や常時発動のもの）であっても、将来的な戦闘シミュレーションとの互換性のため明記します。永続効果の場合は通常ターンの概念がありませんが、システム的なデフォルトとして `'none'` などを指定します（実装に合わせて適切なものを選択）。
*   **dispellable:** バフ・デバフが解除可能かどうか。オーナメントセット効果によるものは基本的に解除不可のため `false` とします。
*   **baseChance:** デバフ（`enemyEffects`）を付与する際の基礎確率。必中の場合は未指定で構いませんが、確率が設定されている場合は（例: 1.0 = 100%）などを指定します。
*   **debuffType:** 敵に付与するデバフの種類。`'stat_down'`, `'control'`, `'dot'` のいずれかを指定します。`'dot'` の場合は `dotType` と `dotMultiplier` を追加で指定します。
*   **shield:** 味方にシールドを付与する効果の場合は、`shield: { stat: STAT.DEF_BASE, ratio: 0.20, flat: 100 }` のように耐久値の計算定義を含めます。

## 5. 敵へのデバフ (Enemy Effects)

敵への影響（被ダメージアップ、属性耐性ダウンなど）を与える効果は、`partyEffects` ではなく `enemyEffects.pc2` 配下に定義します。プロパティの書き方は `partyEffects` に準じますが、`tickRule` や `dispellable`、必要であれば `baseChance` を付与します。

#### 実装例（enemyEffects）
```javascript
enemyEffects: {
    pc2: [
        {
            id: 'example_debuff',
            source: 'set',
            name: '例: 防御力ダウン',
            description: '敵の防御力-10%',
            stats: { [STAT.DEF_REDUCTION]: 0.10 },
            defaultActive: false,
            target: 'all', // または 'single'
            duration: 'permanent',
            tickRule: 'none',
            dispellable: false,
        }
    ]
}
```

## 6. 戦闘イベントフック (Hooks)

将来的な動的シミュレーション機能のために、各ファイルで `Registry.ornament.add` に渡すオブジェクトのトップレベルには、必ず `hooks: {}` という空のオブジェクトを定義します（将来的に `onTurnStart`, `onAttack` などを実装するためのプレースホルダー）。

```javascript
export default Registry.ornament.add({
    id: 'example_id',
    // ...
    pc2: { ... },
    hooks: {
        // 例: onAttack: (state, action) => { ... }
    }
});
```
```
