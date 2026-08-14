import assert from 'node:assert/strict';
import { test } from 'node:test';

import { renderBasicMarkdown } from '../js/ui/basicMarkdown.js';

test('基本Markdownは見出し・表・リスト・強調・コードを描画する', () => {
    const html = renderBasicMarkdown(`## 計算結果

| ケース | 攻撃力 |
| --- | ---: |
| **A** | 3,000 |

- 通常攻撃
- \`必殺技\``);

    assert.match(html, /<h2>計算結果<\/h2>/);
    assert.match(html, /<table>/);
    assert.match(html, /<strong>A<\/strong>/);
    assert.match(html, /<ul><li>通常攻撃<\/li><li><code>必殺技<\/code><\/li><\/ul>/);
});

test('基本Markdownは生HTMLと危険なリンクを実行可能なHTMLにしない', () => {
    const html = renderBasicMarkdown('<img src=x onerror=alert(1)> [危険](javascript:alert(1)) [安全](https://example.com)');
    assert.doesNotMatch(html, /<img/);
    assert.doesNotMatch(html, /href="javascript:/);
    assert.match(html, /&lt;img/);
    assert.match(html, /href="https:\/\/example\.com"/);
});

