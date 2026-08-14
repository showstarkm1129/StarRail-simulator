# memo

## 2026-08-10 AIアシスタント(Claude Code CLI)の接続不具合

`js/ai/serverGateway.js` の `runClaude()` は `claude` CLIをサブプロセス起動する際、`--bare` も `--safe-mode` も**付けない**。

- `--bare`: OAuth・keychain読み込みを一切行わず `ANTHROPIC_API_KEY` が必須になる。サブスクで `/login` 済みでも「Not logged in」を返す。AIアシスタントタブの接続テストが常に失敗していた不具合の原因だった。
- `--safe-mode`: 認証は通るが、`--mcp-config` で明示指定したMCPサーバーごと無効化される(実機確認: `tools:[], mcp_servers:[]`)。この状態でツール呼び出しを指示すると、モデルが実行不能な `<function_calls>` 風のテキストを生成して「成功しました」と自称する誤動作が起きた(アプリ側の `result.executions` チェックで実行記録なしとして正しく弾かれ実害はなかった)。
- フラグなし(素の状態)なら認証・MCP呼び出しとも正常動作を実機確認済み(`mcp__srsim__get_workspace_context` が `outcome:"ok"` で完了)。

このCLI起動処理に隔離用フラグを足したくなったら、認証だけでなくMCPツールが実際に呼べるかも必ず実機検証すること。フラグなしの代償として、グローバル設定 (`~/.claude/settings.json`) で有効なプラグインがサブプロセスに混入し得る点は許容済みのトレードオフ。

## npm run verifyの既知の失敗(対応保留)

`tsc` チェックで以下のエラーが出るが、上記の接続修正とは無関係。Git未追跡の別作業(並行作業中の可能性)によるもので、2026-08-10時点では対応保留。

```
js/ai/serverGateway.js(246,15): error TS2339: Property 'requireToolForChat' does not exist on type ...
js/ai/workspaceTools.js(154,33): error TS2339: Property 'sections' does not exist on type ...
js/ai/workspaceTools.js(171,84): error TS2349: This expression is not callable.
```

`npm run verify` が失敗しても、まずこれがまだ残っているか確認してから対応要否を判断する。
