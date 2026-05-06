# SummarizeCommand

現在の環境（プロジェクト + プラグイン + MCP）で実際に使えるスラッシュコマンドをスキャンし、レポートを生成します。

## Install & run (Claude Code plugin)

Claude Code のチャット入力で以下を実行します。

Install:

```text
/plugin marketplace add PJH720/slash-command-catalog
```

Run:

```text
/command-catalog
```

Outputs (written to the current working directory):

- `./summarize-report.html`
- `./llms.txt`
- `./llms-full.txt`

## Notes

- Zero-install (pure Node.js ESM). You can also run:
  - `node /absolute/path/to/scripts/scan_and_report.js`
