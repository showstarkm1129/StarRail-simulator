// 依存ゼロの静的ファイルサーバー。ES Modules を HTTP 配信するため使用。
// 起動: npm run dev   (環境変数 PORT で待受ポート変更可)
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

// 末尾区切り文字を除いた正規化済みルート (トラバーサル判定で二重区切りを防ぐ)
const ROOT = normalize(fileURLToPath(new URL('.', import.meta.url))).replace(/[\\/]+$/, '');
const PORT = Number(process.env.PORT) || 8080;

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.map': 'application/json; charset=utf-8',
};

const server = createServer(async (req, res) => {
    try {
        const url = new URL(req.url, `http://${req.headers.host}`);
        let pathname = decodeURIComponent(url.pathname);
        if (pathname === '/') pathname = '/index.html';

        // ディレクトリトラバーサル防止: ROOT 配下に正規化
        const filePath = normalize(join(ROOT, pathname));
        if (filePath !== ROOT && !filePath.startsWith(ROOT + sep)) {
            res.writeHead(403).end('Forbidden');
            return;
        }

        const data = await readFile(filePath);
        const type = MIME[extname(filePath).toLowerCase()] || 'application/octet-stream';
        res.writeHead(200, {
            'Content-Type': type,
            'Cache-Control': 'no-store, no-cache, must-revalidate',
        });
        res.end(data);
    } catch (err) {
        if (err.code === 'ENOENT' || err.code === 'EISDIR') {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('404 Not Found');
        } else {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }).end('500 Internal Server Error');
            console.error(err);
        }
    }
});

server.listen(PORT, () => {
    console.log(`\n  崩壊スターレイル シミュレーター 起動中`);
    console.log(`  → http://localhost:${PORT}/\n`);
    console.log(`  停止: Ctrl+C\n`);
});
