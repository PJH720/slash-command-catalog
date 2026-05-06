# Command Catalog

現在の環境（プロジェクト + プラグイン + MCP）で **実際に使える** スラッシュコマンドをレポート化します。ツールが多すぎて起きる “discoverability crisis” から抜け出すための、**使える機能一覧（capabilities manifest）** を生成します。

###### Languages

English | [简体中文](docs/i18n/README.zh-CN.md) | [繁體中文](docs/i18n/README.zh-TW.md) | [日本語](docs/i18n/README.ja.md) | [Español](docs/i18n/README.es.md) | [Français](docs/i18n/README.fr.md) | [Deutsch](docs/i18n/README.de.md) | [Português(BR)](docs/i18n/README.pt-BR.md) | [Italiano](docs/i18n/README.it.md) | [Türkçe](docs/i18n/README.tr.md) | [Bahasa Indonesia](docs/i18n/README.id.md) | [Tiếng Việt](docs/i18n/README.vi.md) | [ไทย](docs/i18n/README.th.md) | [Polski](docs/i18n/README.pl.md) | [Nederlands](docs/i18n/README.nl.md) | [Svenska](docs/i18n/README.sv.md) | [Русский](docs/i18n/README.ru.md) | [Українська](docs/i18n/README.uk.md) | [한국어](docs/i18n/README.ko.md) | [العربية](docs/i18n/README.ar.md) | [עברית](docs/i18n/README.he.md) | [हिन्दी](docs/i18n/README.hi.md)

## Outputs

デフォルトでは、以下のファイルを **カレントディレクトリ** に書き出します。

- **Human-friendly**: `./CommandCatalog.html`（検索可能な単一ページ）
- **Agent-friendly**: `./llms.txt` と `./llms-full.txt`（HTML パース不要）

オプション（環境/プラグイン設定で有効な場合）:

- **Human-friendly (expanded)**: `./llm-full.html`

## Quickstart (Claude Code plugin)

以下のコマンドを **Claude Code のチャット入力** で実行します（貼り付けて送信）。

このリポジトリをプラグイン・マーケットプレイスとして追加:

```text
/plugin marketplace add PJH720/slash-command-catalog
```

そのマーケットプレイスからプラグインをインストール:

```text
/plugin install command-catalog@pjh720-slash-command-catalog
```

```text
/reload-plugins
```

実行:

```text
/command-catalog
```

## When to use it

- プロジェクトにどんな `/commands` があるか、いつも忘れてしまう。
- エージェントが推測せずに読める、素早い capabilities manifest が欲しい。
- 同名コマンドが複数箇所に定義されているなど、シャドーイング/重複を疑っている。

## What it scans

- `.claude/skills/`（SKILL.md）
- `.claude/commands/`（Markdown のコマンドファイル）
- `.claude/plugins/`（プラグイン設定。存在する場合）
- `.mcp.json`（MCP サーバー概要。存在する場合）

## Notes

- ランナーは **zero-install**（pure Node.js ESM）で、次のように直接実行することもできます:
  - `node /absolute/path/to/scripts/scan_and_report.js`
- Claude Code 側でコマンド実行がブロックされる場合、プロンプトが出たら `node .../scan_and_report.js` の実行許可が必要になることがあります。
