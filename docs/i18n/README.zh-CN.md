# Command Catalog

生成一份报告，列出你在当前环境（项目 + 插件 + MCP）中 **实际可以使用的** 斜杠命令，帮助你摆脱工具太多导致的 “discoverability crisis”。你可以把它当作一份无需猜测的 **能力清单（capabilities manifest）**。

###### Languages

English | [简体中文](docs/i18n/README.zh-CN.md) | [繁體中文](docs/i18n/README.zh-TW.md) | [日本語](docs/i18n/README.ja.md) | [Español](docs/i18n/README.es.md) | [Français](docs/i18n/README.fr.md) | [Deutsch](docs/i18n/README.de.md) | [Português(BR)](docs/i18n/README.pt-BR.md) | [Italiano](docs/i18n/README.it.md) | [Türkçe](docs/i18n/README.tr.md) | [Bahasa Indonesia](docs/i18n/README.id.md) | [Tiếng Việt](docs/i18n/README.vi.md) | [ไทย](docs/i18n/README.th.md) | [Polski](docs/i18n/README.pl.md) | [Nederlands](docs/i18n/README.nl.md) | [Svenska](docs/i18n/README.sv.md) | [Русский](docs/i18n/README.ru.md) | [Українська](docs/i18n/README.uk.md) | [한국어](docs/i18n/README.ko.md) | [العربية](docs/i18n/README.ar.md) | [עברית](docs/i18n/README.he.md) | [हिन्दी](docs/i18n/README.hi.md)

## Outputs

默认会把以下文件写入 **当前工作目录**：

- **面向人类（Human-friendly）**：`./CommandCatalog.html`（单页可搜索）
- **面向 Agent（Agent-friendly）**：`./llms.txt` 和 `./llms-full.txt`（无需解析 HTML）

可选（取决于你的环境/插件设置是否启用）：

- **面向人类（扩展版）**：`./llm-full.html`

## Quickstart (Claude Code plugin)

在 **Claude Code 聊天输入框** 中运行这些命令（复制粘贴后发送）。

把本仓库添加为插件市场：

```text
/plugin marketplace add PJH720/slash-command-catalog
```

从该市场安装插件：

```text
/plugin install command-catalog@pjh720-slash-command-catalog
```

```text
/reload-plugins
```

然后运行：

```text
/command-catalog
```

## When to use it

- 你总是忘记一个项目里有哪些 `/commands`。
- 你想要一份 Agent 能直接读、无需猜测的能力清单（capabilities manifest）。
- 你怀疑存在遮蔽/重复（同名命令在多个位置定义）。

## What it scans

- `.claude/skills/`（SKILL.md）
- `.claude/commands/`（Markdown 命令文件）
- `.claude/plugins/`（插件配置（如存在））
- `.mcp.json`（MCP 服务器摘要（如存在））

## Notes

- 运行器是 **zero-install**（纯 Node.js ESM），也可以直接运行：
  - `node /absolute/path/to/scripts/scan_and_report.js`
- 如果你的 Claude Code 环境阻止执行命令，可能需要在提示时批准执行 `node .../scan_and_report.js`。
