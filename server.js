// 依存ゼロの静的ファイルサーバー。ES Modules を HTTP 配信するため使用。
// 起動: npm run dev   (環境変数 PORT で待受ポート、SRSIM_HOST で待受先変更可)
import { createServer } from 'node:http';
import { mkdir, readFile, stat, unlink, writeFile } from 'node:fs/promises';
import { basename, extname, join, normalize, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServerAiController } from './js/ai/serverGateway.js';

// 末尾区切り文字を除いた正規化済みルート (トラバーサル判定で二重区切りを防ぐ)
const ROOT = normalize(fileURLToPath(new URL('.', import.meta.url))).replace(/[\\/]+$/, '');
const PORT = Number(process.env.PORT) || 8080;
// 初期状態は同じPCからだけアクセス可能。LAN公開時は SRSIM_HOST=0.0.0.0 を明示する。
const HOST = String(process.env.SRSIM_HOST || '127.0.0.1').trim() || '127.0.0.1';
const LOCAL_DIR = normalize(resolve(ROOT, process.env.SRSIM_LOCAL_DIR || 'local'));
const ACTION_ORDER_STATE_FILE = normalize(join(LOCAL_DIR, 'action-order-state.json'));
const LOCAL_SAVE_INDEX_SCHEMA = 'srsim.localSaveIndex.v1';
const AUTOSAVE_ID = '_autosave';
const MAX_BODY_BYTES = 2 * 1024 * 1024;
const MIHOMO_API_BASE = 'https://api.mihomo.me/sr_info_parsed';
const MIHOMO_TIMEOUT_MS = 15_000;
// 公開APIは混雑時に「Queue timeout」の500を返すことがあるが、大抵は数秒後の再試行で成功する一時的な事象。
const MIHOMO_MAX_ATTEMPTS = 3;
const MIHOMO_RETRY_DELAY_MS = 1500;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/** upstream の HTTPステータス/応答本文から、専門用語を避けたユーザー向けの原因説明を作る。 */
function describeMihomoFailure(status, detail, attempts) {
    if (status === 404) {
        return 'このUIDの公開データが見つかりませんでした。UIDが正しいか、ゲーム内の「その他のプレイヤーに公開」設定がオンになっているか確認してください。';
    }
    if (status >= 500) {
        const retriedNote = attempts > 1 ? `（自動で${attempts}回試しましたが失敗しました）` : '';
        if (/queue timeout/i.test(detail || '')) {
            return `データを配信している外部サービスが混雑していて、順番待ちがタイムアウトしました${retriedNote}。少し時間をおいてから、もう一度お試しください。`;
        }
        return `データを配信している外部サービスで一時的なエラーが発生しています${retriedNote}。少し時間をおいてから、もう一度お試しください。`;
    }
    return `公開データの取得に失敗しました（エラーコード ${status}）。`;
}

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

function isPathInsideRoot(filePath) {
    return filePath === ROOT || filePath.startsWith(ROOT + sep);
}

if (!isPathInsideRoot(LOCAL_DIR)) {
    throw new Error(`SRSIM_LOCAL_DIR はプロジェクト配下を指定してください: ${LOCAL_DIR}`);
}

function sanitizeTab(raw) {
    const value = String(raw || '').trim();
    if (!/^[a-z0-9-]+$/i.test(value)) {
        throw new Error('タブ名が不正です。');
    }
    return value;
}

function sanitizeEntryId(raw, fallback) {
    const base = String(raw || fallback || '')
        .normalize('NFKC')
        .trim()
        .split('')
        .map(ch => (ch.charCodeAt(0) < 32 || '\\/:*?"<>|'.includes(ch)) ? '_' : ch)
        .join('')
        .replace(/\s+/g, '_')
        .replace(/^\.+/, '')
        .slice(0, 80);
    return base || `entry-${Date.now()}`;
}

function getTabDir(tab) {
    return normalize(join(LOCAL_DIR, sanitizeTab(tab)));
}

function getIndexPath(tab) {
    return normalize(join(getTabDir(tab), 'index.json'));
}

function getEntryPath(tab, id) {
    const safeId = sanitizeEntryId(id, AUTOSAVE_ID);
    const filePath = normalize(join(getTabDir(tab), `${safeId}.json`));
    if (!isPathInsideRoot(filePath)) throw new Error('保存先パスが不正です。');
    return filePath;
}

function getEntryPaths(tab, id) {
    const entryPath = getEntryPath(tab, id);
    return { statePath: entryPath, stateFile: relative(ROOT, entryPath) };
}

function getActionOrderPaths() {
    return { statePath: ACTION_ORDER_STATE_FILE, stateFile: relative(ROOT, ACTION_ORDER_STATE_FILE) };
}

async function readLocalIndex(tab) {
    const safeTab = sanitizeTab(tab);
    try {
        const parsed = JSON.parse(await readFile(getIndexPath(safeTab), 'utf8'));
        const entries = Array.isArray(parsed.entries) ? parsed.entries : [];
        return {
            schema: LOCAL_SAVE_INDEX_SCHEMA,
            tab: safeTab,
            activeId: typeof parsed.activeId === 'string' ? parsed.activeId : AUTOSAVE_ID,
            entries,
        };
    } catch (err) {
        if (err.code !== 'ENOENT') throw err;
        return {
            schema: LOCAL_SAVE_INDEX_SCHEMA,
            tab: safeTab,
            activeId: AUTOSAVE_ID,
            entries: [],
        };
    }
}

async function writeLocalIndex(tab, index) {
    await mkdir(getTabDir(tab), { recursive: true });
    await writeFile(getIndexPath(tab), JSON.stringify(index, null, 2) + '\n', 'utf8');
}

async function upsertLocalIndexEntry(tab, entry, active) {
    const index = await readLocalIndex(tab);
    const entries = index.entries.filter(item => item.id !== entry.id);
    entries.unshift(entry);
    index.entries = entries.sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')));
    if (active) index.activeId = entry.id;
    await writeLocalIndex(tab, index);
    return index;
}

async function removeLocalIndexEntry(tab, id) {
    const index = await readLocalIndex(tab);
    index.entries = index.entries.filter(item => item.id !== id);
    if (index.activeId === id) index.activeId = index.entries[0]?.id || AUTOSAVE_ID;
    await writeLocalIndex(tab, index);
    return index;
}

async function makeUniqueEntryId(tab, name) {
    const index = await readLocalIndex(tab);
    const used = new Set(index.entries.map(item => item.id));
    let id = sanitizeEntryId(name, `entry-${Date.now()}`);
    if (id === 'index' || id === 'entry') id = `save-${id}`;
    if (!used.has(id)) return id;
    const base = id;
    for (let i = 2; i < 1000; i++) {
        id = `${base}-${i}`;
        if (!used.has(id)) return id;
    }
    return `${base}-${Date.now()}`;
}

async function writeLocalSave(tab, opts) {
    const safeTab = sanitizeTab(tab);
    const state = opts && opts.state;
    if (!state || typeof state !== 'object') {
        throw new Error('保存できるJSONオブジェクトが見つかりません。');
    }
    const id = opts.id
        ? sanitizeEntryId(opts.id, AUTOSAVE_ID)
        : await makeUniqueEntryId(safeTab, opts.name || `entry-${Date.now()}`);
    const name = String(opts.name || (id === AUTOSAVE_ID ? '自動保存' : id)).trim() || id;
    const filePath = getEntryPath(safeTab, id);
    await mkdir(getTabDir(safeTab), { recursive: true });
    await writeFile(filePath, JSON.stringify(state, null, 2) + '\n', 'utf8');
    const info = await stat(filePath);
    let existingCreatedAt = '';
    try {
        const index = await readLocalIndex(safeTab);
        existingCreatedAt = index.entries.find(item => item.id === id)?.createdAt || '';
    } catch {
        existingCreatedAt = '';
    }
    const entry = {
        id,
        name,
        file: relative(ROOT, filePath),
        updatedAt: info.mtime.toISOString(),
        createdAt: existingCreatedAt || info.birthtime.toISOString(),
        bytes: info.size,
    };
    const index = await upsertLocalIndexEntry(safeTab, entry, opts.active !== false);
    return {
        ok: true,
        tab: safeTab,
        entry,
        index,
        ...getEntryPaths(safeTab, id),
    };
}

async function readLocalSave(tab, id) {
    const safeTab = sanitizeTab(tab);
    const safeId = sanitizeEntryId(id, AUTOSAVE_ID);
    const filePath = getEntryPath(safeTab, safeId);
    try {
        const text = await readFile(filePath, 'utf8');
        const info = await stat(filePath);
        const index = await readLocalIndex(safeTab);
        const entry = index.entries.find(item => item.id === safeId) || {
            id: safeId,
            name: safeId === AUTOSAVE_ID ? '自動保存' : basename(filePath, '.json'),
            file: relative(ROOT, filePath),
            updatedAt: info.mtime.toISOString(),
            createdAt: info.birthtime.toISOString(),
            bytes: info.size,
        };
        return {
            exists: true,
            tab: safeTab,
            entry,
            state: JSON.parse(text),
            ...getEntryPaths(safeTab, safeId),
        };
    } catch (err) {
        if (err.code === 'ENOENT') {
            return {
                exists: false,
                tab: safeTab,
                entry: { id: safeId, name: safeId === AUTOSAVE_ID ? '自動保存' : safeId },
                ...getEntryPaths(safeTab, safeId),
            };
        }
        throw err;
    }
}

async function deleteLocalSave(tab, id) {
    const safeTab = sanitizeTab(tab);
    const safeId = sanitizeEntryId(id, AUTOSAVE_ID);
    if (safeId === AUTOSAVE_ID) {
        throw new Error('自動保存は削除できません。');
    }
    try {
        await unlink(getEntryPath(safeTab, safeId));
    } catch (err) {
        if (err.code !== 'ENOENT') throw err;
    }
    const index = await removeLocalIndexEntry(safeTab, safeId);
    return { ok: true, exists: false, tab: safeTab, id: safeId, index };
}

function sendJson(res, status, data) {
    res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
    });
    res.end(JSON.stringify(data));
}

function sendText(res, status, text) {
    res.writeHead(status, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
    });
    res.end(text);
}

async function readJsonBody(req) {
    const chunks = [];
    let total = 0;
    for await (const chunk of req) {
        total += chunk.length;
        if (total > MAX_BODY_BYTES) {
            throw new Error('JSONが大きすぎます。');
        }
        chunks.push(chunk);
    }
    const raw = Buffer.concat(chunks).toString('utf8');
    if (!raw.trim()) return {};
    return JSON.parse(raw);
}

function getStatePayload(body) {
    if (body && typeof body === 'object' && body.state !== undefined) return body.state;
    return body;
}

async function writeActionOrderState(state) {
    if (!state || typeof state !== 'object') {
        throw new Error('保存できるJSONオブジェクトが見つかりません。');
    }
    await mkdir(LOCAL_DIR, { recursive: true });
    await writeFile(ACTION_ORDER_STATE_FILE, JSON.stringify(state, null, 2) + '\n', 'utf8');
    const info = await stat(ACTION_ORDER_STATE_FILE);
    return {
        ...getActionOrderPaths(),
        updatedAt: info.mtime.toISOString(),
        bytes: info.size,
    };
}

async function readActionOrderState() {
    try {
        const text = await readFile(ACTION_ORDER_STATE_FILE, 'utf8');
        const info = await stat(ACTION_ORDER_STATE_FILE);
        return {
            ...getActionOrderPaths(),
            exists: true,
            updatedAt: info.mtime.toISOString(),
            bytes: info.size,
            state: JSON.parse(text),
        };
    } catch (err) {
        if (err.code === 'ENOENT') {
            return {
                ...getActionOrderPaths(),
                exists: false,
            };
        }
        throw err;
    }
}

async function deleteActionOrderState() {
    try {
        await unlink(ACTION_ORDER_STATE_FILE);
    } catch (err) {
        if (err.code !== 'ENOENT') throw err;
    }
    return {
        ...getActionOrderPaths(),
        exists: false,
    };
}

function isLoopbackRequest(req) {
    const address = req.socket.remoteAddress || '';
    return (
        address === '127.0.0.1' ||
        address === '::1' ||
        address === '::ffff:127.0.0.1' ||
        address.startsWith('::ffff:127.')
    );
}

async function handleActionOrderState(req, res) {
    if (req.method === 'GET') {
        sendJson(res, 200, await readActionOrderState());
        return true;
    }
    if (req.method === 'PUT' || req.method === 'POST') {
        const body = await readJsonBody(req);
        const result = await writeActionOrderState(getStatePayload(body));
        sendJson(res, 200, { ok: true, ...result });
        return true;
    }
    if (req.method === 'DELETE') {
        sendJson(res, 200, await deleteActionOrderState());
        return true;
    }
    sendText(res, 405, 'Method Not Allowed');
    return true;
}

/** 公開プロフィールAPIは CORS ヘッダーを返さないため、ローカルサーバーで限定的に中継する。 */
async function handleMihomoProfile(req, res, pathname) {
    if (req.method !== 'GET') {
        sendText(res, 405, 'Method Not Allowed');
        return true;
    }
    const uid = decodeURIComponent(pathname.slice('/api/mihomo/'.length));
    if (!/^\d{5,15}$/.test(uid)) {
        sendJson(res, 400, { ok: false, error: { code: 'INVALID_UID', message: 'UIDは数字で入力してください。' } });
        return true;
    }
    const attemptLogs = [];
    for (let attempt = 1; attempt <= MIHOMO_MAX_ATTEMPTS; attempt++) {
        try {
            const upstream = await fetch(`${MIHOMO_API_BASE}/${encodeURIComponent(uid)}?l=jp`, {
                headers: { 'User-Agent': 'StarRail-simulator/1.0' },
                signal: AbortSignal.timeout(MIHOMO_TIMEOUT_MS),
            });
            if (!upstream.ok) {
                const detail = (await upstream.text()).replace(/\s+/g, ' ').slice(0, 500);
                attemptLogs.push(`試行${attempt}/${MIHOMO_MAX_ATTEMPTS}: upstream status ${upstream.status} — ${detail || '(応答本文なし)'}`);
                // 5xx は混雑時の一時的な失敗（Queue timeout 等）のことが多いので短い待機を挟んで再試行する。
                if (upstream.status >= 500 && attempt < MIHOMO_MAX_ATTEMPTS) {
                    await sleep(MIHOMO_RETRY_DELAY_MS * attempt);
                    continue;
                }
                sendJson(res, upstream.status, {
                    ok: false,
                    error: { code: 'MIHOMO_REQUEST_FAILED', message: describeMihomoFailure(upstream.status, detail, attempt) },
                    diagnosticLogs: attemptLogs,
                });
                return true;
            }
            sendJson(res, 200, await upstream.json());
            return true;
        } catch (error) {
            const detail = error?.cause?.message || error?.message || String(error);
            attemptLogs.push(`試行${attempt}/${MIHOMO_MAX_ATTEMPTS}: network error — ${detail}`);
            if (attempt < MIHOMO_MAX_ATTEMPTS) {
                await sleep(MIHOMO_RETRY_DELAY_MS * attempt);
                continue;
            }
            console.error('[mihomo] 公開プロフィール取得に失敗しました:', detail);
            const retriedNote = attempt > 1 ? `（自動で${attempt}回試しましたが失敗しました）` : '';
            sendJson(res, 502, {
                ok: false,
                error: { code: 'MIHOMO_NETWORK_FAILED', message: `データを配信している外部サービスに接続できませんでした${retriedNote}。ネットワーク状況を確認するか、少し時間をおいてから再試行してください。` },
                diagnosticLogs: attemptLogs,
            });
            return true;
        }
    }
    return true;
}

async function handleLocalSave(req, res, segments) {
    const tab = sanitizeTab(segments[0]);
    const action = segments[1] || '';
    if (!action) {
        if (req.method === 'GET') {
            sendJson(res, 200, await readLocalIndex(tab));
            return true;
        }
        if (req.method === 'POST') {
            const body = await readJsonBody(req);
            const result = await writeLocalSave(tab, {
                id: body.id,
                name: body.name,
                state: getStatePayload(body),
                active: body.active,
            });
            sendJson(res, 200, result);
            return true;
        }
        sendText(res, 405, 'Method Not Allowed');
        return true;
    }

    if (action === 'entry') {
        const id = decodeURIComponent(segments.slice(2).join('/'));
        if (!id) {
            sendJson(res, 400, { error: '保存IDが未指定です。' });
            return true;
        }
        if (req.method === 'GET') {
            sendJson(res, 200, await readLocalSave(tab, id));
            return true;
        }
        if (req.method === 'PUT' || req.method === 'POST') {
            const body = await readJsonBody(req);
            const result = await writeLocalSave(tab, {
                id,
                name: body.name,
                state: getStatePayload(body),
                active: body.active,
            });
            sendJson(res, 200, result);
            return true;
        }
        if (req.method === 'DELETE') {
            sendJson(res, 200, await deleteLocalSave(tab, id));
            return true;
        }
        sendText(res, 405, 'Method Not Allowed');
        return true;
    }


    sendText(res, 404, 'Not Found');
    return true;
}

const aiController = createServerAiController({ root: ROOT, localDir: LOCAL_DIR });

async function handleAiRequest(req, res, pathname) {
    if (!isLoopbackRequest(req)) {
        sendJson(res, 403, { ok: false, error: { code: 'LOOPBACK_ONLY', message: 'AI連携はローカル接続だけで使用できます。' } });
        return true;
    }
    if (req.method !== 'POST') {
        sendText(res, 405, 'Method Not Allowed');
        return true;
    }
    const body = await readJsonBody(req);
    // scope はどのタブのAIかを示す。未指定なら従来どおり限界効用。
    if (pathname === '/api/ai/connect') {
        sendJson(res, 200, await aiController.connect({
            provider: body.provider,
            state: getStatePayload(body),
            scope: body.scope,
        }));
        return true;
    }
    if (pathname === '/api/ai/chat') {
        sendJson(res, 200, await aiController.chat({
            provider: body.provider,
            state: getStatePayload(body),
            message: body.message,
            sessionId: body.sessionId,
            providerSessionId: body.providerSessionId,
            scope: body.scope,
        }));
        return true;
    }
    if (pathname === '/api/ai/cancel') {
        sendJson(res, 200, { ok: true, cancelled: aiController.cancel(body.sessionId) });
        return true;
    }
    sendText(res, 404, 'Not Found');
    return true;
}

async function handleApiRequest(req, res, pathname) {
    if (pathname.startsWith('/api/mihomo/')) return handleMihomoProfile(req, res, pathname);
    if (pathname.startsWith('/api/local-save/')) {
        const segments = pathname.slice('/api/local-save/'.length).split('/').filter(Boolean).map(decodeURIComponent);
        if (segments.length === 0) {
            sendJson(res, 400, { error: 'タブ名が未指定です。' });
            return true;
        }
        return handleLocalSave(req, res, segments);
    }
    if (pathname === '/api/action-order/state') return handleActionOrderState(req, res);
    if (pathname.startsWith('/api/ai/')) return handleAiRequest(req, res, pathname);
    return false;
}

const server = createServer(async (req, res) => {
    try {
        const url = new URL(req.url || '/', `http://${req.headers.host}`);
        if (await handleApiRequest(req, res, url.pathname)) return;

        let pathname = decodeURIComponent(url.pathname);
        if (pathname === '/') pathname = '/index.html';

        // ディレクトリトラバーサル防止: ROOT 配下に正規化
        const filePath = normalize(join(ROOT, pathname));
        if (!isPathInsideRoot(filePath)) {
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
        } else if (err instanceof SyntaxError) {
            sendJson(res, 400, { error: 'JSONを読み取れませんでした。' });
        } else if (String(req.url || '').startsWith('/api/')) {
            sendJson(res, 500, {
                ok: false,
                error: { code: err.code || 'API_FAILED', message: err.message || 'API処理に失敗しました。' },
                diagnosticLogs: Array.isArray(err.diagnosticLogs) ? err.diagnosticLogs : [],
            });
            console.error(err);
        } else {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }).end('500 Internal Server Error');
            console.error(err);
        }
    }
});

server.listen(PORT, HOST, () => {
    console.log(`\n  崩壊スターレイル シミュレーター 起動中`);
    console.log(`  → http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}/\n`);
    console.log(`  ローカルJSON保存先: ${LOCAL_DIR}`);
    console.log(`  旧行動順JSON: ${ACTION_ORDER_STATE_FILE}`);
    console.log(`  停止: Ctrl+C\n`);
});
