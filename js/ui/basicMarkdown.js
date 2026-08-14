// basicMarkdown.js — AI回答用の小さな安全Markdownレンダラー。
// 生HTMLは許可せず、チャットで必要な見出し・表・箇条書き・強調・コード・リンクだけを扱う。

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function safeLink(url) {
    const value = String(url || '').trim();
    return /^(?:https?:\/\/|#)/i.test(value) ? value : null;
}

function inlineMarkdown(source) {
    const tokens = [];
    const token = html => {
        const key = `\uE000${tokens.length}\uE001`;
        tokens.push(html);
        return key;
    };
    let value = String(source ?? '');
    value = value.replace(/`([^`\n]+)`/g, (_match, code) => token(`<code>${escapeHtml(code)}</code>`));
    value = value.replace(/\[([^\]\n]+)\]\(([^)\s]+)\)/g, (match, label, href) => {
        const safe = safeLink(href);
        return safe
            ? token(`<a href="${escapeHtml(safe)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`)
            : match;
    });
    value = escapeHtml(value)
        .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
        .replace(/__([^_\n]+)__/g, '<strong>$1</strong>')
        .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
        .replace(/(^|[^_])_([^_\n]+)_/g, '$1<em>$2</em>');
    return value.replace(/\uE000(\d+)\uE001/g, (_match, index) => tokens[Number(index)] || '');
}

function splitTableRow(line) {
    let value = line.trim();
    if (value.startsWith('|')) value = value.slice(1);
    if (value.endsWith('|')) value = value.slice(0, -1);
    return value.split(/(?<!\\)\|/).map(cell => cell.trim().replaceAll('\\|', '|'));
}

function isTableSeparator(line) {
    const cells = splitTableRow(line);
    return cells.length > 0 && cells.every(cell => /^:?-{3,}:?$/.test(cell));
}

function renderTable(lines, index) {
    const headers = splitTableRow(lines[index]);
    const alignments = splitTableRow(lines[index + 1]).map(cell => (
        cell.startsWith(':') && cell.endsWith(':') ? 'center' : cell.endsWith(':') ? 'right' : 'left'
    ));
    const rows = [];
    let cursor = index + 2;
    while (cursor < lines.length && lines[cursor].includes('|') && lines[cursor].trim()) {
        rows.push(splitTableRow(lines[cursor]));
        cursor++;
    }
    const head = headers.map((cell, cellIndex) => `<th style="text-align:${alignments[cellIndex] || 'left'}">${inlineMarkdown(cell)}</th>`).join('');
    const body = rows.map(row => `<tr>${headers.map((_cell, cellIndex) => `<td style="text-align:${alignments[cellIndex] || 'left'}">${inlineMarkdown(row[cellIndex] || '')}</td>`).join('')}</tr>`).join('');
    return { html: `<div class="dim-ai-table-scroll"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`, next: cursor };
}

function isBlockStart(lines, index) {
    const line = lines[index] || '';
    return !line.trim() || /^#{1,4}\s/.test(line) || /^```/.test(line.trim())
        || /^\s*[-*+]\s+/.test(line) || /^\s*\d+[.)]\s+/.test(line)
        || /^>\s?/.test(line) || /^\s*(?:---+|\*\*\*+)\s*$/.test(line)
        || (line.includes('|') && isTableSeparator(lines[index + 1] || ''));
}

export function renderBasicMarkdown(markdown) {
    const lines = String(markdown ?? '').replaceAll('\r\n', '\n').replaceAll('\r', '\n').split('\n');
    const output = [];
    let index = 0;
    while (index < lines.length) {
        const line = lines[index];
        if (!line.trim()) { index++; continue; }

        const fence = line.trim().match(/^```([\w-]*)\s*$/);
        if (fence) {
            const code = [];
            index++;
            while (index < lines.length && !/^```\s*$/.test(lines[index].trim())) code.push(lines[index++]);
            if (index < lines.length) index++;
            const language = fence[1] ? ` class="language-${escapeHtml(fence[1])}"` : '';
            output.push(`<pre><code${language}>${escapeHtml(code.join('\n'))}</code></pre>`);
            continue;
        }

        if (line.includes('|') && isTableSeparator(lines[index + 1] || '')) {
            const table = renderTable(lines, index);
            output.push(table.html);
            index = table.next;
            continue;
        }

        const heading = line.match(/^(#{1,4})\s+(.+)$/);
        if (heading) {
            const level = heading[1].length;
            output.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
            index++;
            continue;
        }

        const unordered = line.match(/^\s*[-*+]\s+(.+)$/);
        const ordered = line.match(/^\s*\d+[.)]\s+(.+)$/);
        if (unordered || ordered) {
            const tag = ordered ? 'ol' : 'ul';
            const items = [];
            while (index < lines.length) {
                const match = tag === 'ol'
                    ? lines[index].match(/^\s*\d+[.)]\s+(.+)$/)
                    : lines[index].match(/^\s*[-*+]\s+(.+)$/);
                if (!match) break;
                items.push(`<li>${inlineMarkdown(match[1])}</li>`);
                index++;
            }
            output.push(`<${tag}>${items.join('')}</${tag}>`);
            continue;
        }

        if (/^>\s?/.test(line)) {
            const quote = [];
            while (index < lines.length && /^>\s?/.test(lines[index])) quote.push(lines[index++].replace(/^>\s?/, ''));
            output.push(`<blockquote>${quote.map(inlineMarkdown).join('<br>')}</blockquote>`);
            continue;
        }

        if (/^\s*(?:---+|\*\*\*+)\s*$/.test(line)) {
            output.push('<hr>');
            index++;
            continue;
        }

        const paragraph = [];
        while (index < lines.length && !isBlockStart(lines, index)) paragraph.push(lines[index++]);
        if (!paragraph.length) paragraph.push(lines[index++]);
        output.push(`<p>${paragraph.map(inlineMarkdown).join('<br>')}</p>`);
    }
    return output.join('');
}
