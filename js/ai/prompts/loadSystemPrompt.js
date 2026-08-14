import { readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';

/** Markdownで管理するシステムプロンプトを、サーバー起動時に文字列として読み込む。 */
export function loadSystemPrompt(fileName) {
    return readFileSync(fileURLToPath(new URL(`./${fileName}`, import.meta.url)), 'utf8').trim();
}
