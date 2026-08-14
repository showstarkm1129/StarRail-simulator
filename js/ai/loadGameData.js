// Node.js用。_index.js のファイル名変更中でも、登録可能なゲームデータを直接読み込む。
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

let loading = null;

export function loadRegisteredGameData(root) {
    if (loading) return loading;
    loading = (async () => {
        const directories = [
            'js/data/characters',
            'js/data/lightcones',
            'js/data/cavern relics',
            'js/data/planar ornaments',
        ];
        for (const relativeDir of directories) {
            const directory = join(root, relativeDir);
            const names = (await readdir(directory))
                .filter(name => name.endsWith('.js') && !name.startsWith('_') && name !== 'template.js')
                .sort((a, b) => a.localeCompare(b, 'en'));
            for (const name of names) await import(pathToFileURL(join(directory, name)).href);
        }
    })();
    return loading;
}
