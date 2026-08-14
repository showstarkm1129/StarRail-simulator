// 実データ層の読み込みスモークテスト (回帰ゲート)。
//   全 _index.js を import → 1 ファイルでも構文/登録エラーがあれば即失敗。
//   フィクスチャではなく本物のデータを通すことで、データ追加時のデグレを検出する。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Registry } from '../js/build/registry.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('全データ _index.js が例外なく import できる', async () => {
    await assert.doesNotReject(async () => {
        await import('../js/data/characters/_index.js');
        await import('../js/data/lightcones/_index.js');
        await import('../js/data/cavern relics/_index.js');
        await import('../js/data/planar ornaments/_index.js');
    });
});

test('bootstrap.js の静的 import 先が実ファイルとして存在する', () => {
    const bootstrapPath = path.join(ROOT, 'js/bootstrap.js');
    const source = fs.readFileSync(bootstrapPath, 'utf8');
    const importPaths = [...source.matchAll(/^\s*import\s+(?:[^'"]+\s+from\s+)?['"](\.[^'"]+)['"];?/gm)]
        .map(match => match[1]);

    assert.ok(importPaths.length > 0, 'bootstrap.js の import が見つからない');
    for (const importPath of importPaths) {
        const resolved = path.resolve(path.dirname(bootstrapPath), importPath);
        assert.ok(fs.existsSync(resolved), `bootstrap.js import 先が存在しない: ${importPath}`);
    }
});

test('import 後に各カテゴリが 1 件以上登録されている', async () => {
    await import('../js/data/characters/_index.js');
    await import('../js/data/lightcones/_index.js');
    await import('../js/data/cavern relics/_index.js');
    await import('../js/data/planar ornaments/_index.js');
    assert.ok(Registry.character.size() > 0, 'character 未登録');
    assert.ok(Registry.lightcone.size() > 0, 'lightcone 未登録');
    assert.ok(Registry.relicSet.size() > 0, 'relicSet 未登録');
    assert.ok(Registry.ornament.size() > 0, 'ornament 未登録');
});

test('登録キャラは必須フィールド (id/base) を持つ', async () => {
    await import('../js/data/characters/_index.js');
    for (const ch of Registry.character.list()) {
        assert.ok(ch.id, 'id 欠落');
        assert.ok(ch.base && typeof ch.base.atk === 'number', `${ch.id}: base.atk が数値でない`);
    }
});
