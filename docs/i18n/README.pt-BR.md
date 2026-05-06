# Command Catalog

Gere um relatório dos slash commands que você **realmente** pode usar no seu ambiente atual (projeto + plugins + MCP), para escapar da “crise de descobribilidade” causada por ferramentas demais. Na prática, isso vira um **manifesto de capacidades** que um agente pode ler sem adivinhar.

###### Languages

English | [简体中文](docs/i18n/README.zh-CN.md) | [繁體中文](docs/i18n/README.zh-TW.md) | [日本語](docs/i18n/README.ja.md) | [Español](docs/i18n/README.es.md) | [Français](docs/i18n/README.fr.md) | [Deutsch](docs/i18n/README.de.md) | [Português(BR)](docs/i18n/README.pt-BR.md) | [Italiano](docs/i18n/README.it.md) | [Türkçe](docs/i18n/README.tr.md) | [Bahasa Indonesia](docs/i18n/README.id.md) | [Tiếng Việt](docs/i18n/README.vi.md) | [ไทย](docs/i18n/README.th.md) | [Polski](docs/i18n/README.pl.md) | [Nederlands](docs/i18n/README.nl.md) | [Svenska](docs/i18n/README.sv.md) | [Русский](docs/i18n/README.ru.md) | [Українська](docs/i18n/README.uk.md) | [한국어](docs/i18n/README.ko.md) | [العربية](docs/i18n/README.ar.md) | [עברית](docs/i18n/README.he.md) | [हिन्दी](docs/i18n/README.hi.md)

## Outputs

Por padrão, o comando escreve estes arquivos no **diretório atual**:

- **Human-friendly**: `./CommandCatalog.html` (uma única página pesquisável)
- **Agent-friendly**: `./llms.txt` e `./llms-full.txt` (sem precisar fazer parse de HTML)

Opcional (se habilitado pelo seu ambiente/configuração de plugins):

- **Human-friendly (expanded)**: `./llm-full.html`

## Quickstart (Claude Code plugin)

Execute estes comandos **no input de chat do Claude Code** (cole e envie).

Adicionar este repositório como marketplace de plugins:

```text
/plugin marketplace add PJH720/slash-command-catalog
```

Instalar o plugin a partir desse marketplace:

```text
/plugin install command-catalog@pjh720-slash-command-catalog
```

```text
/reload-plugins
```

Depois, rode:

```text
/command-catalog
```

## When to use it

- Você vive esquecendo quais `/commands` existem em um projeto.
- Você quer um “manifesto de capacidades” rápido que um agente consiga ler sem adivinhar.
- Você suspeita de shadowing/duplicação (mesmo nome definido em vários lugares).

## What it scans

- `.claude/skills/` (SKILL.md)
- `.claude/commands/` (arquivos de comandos em Markdown)
- `.claude/plugins/` (configs de plugins, se existirem)
- `.mcp.json` (resumo dos servidores MCP, se existir)

## Notes

- O runner é **zero-install** (Node.js ESM puro) e também pode ser executado diretamente:
  - `node /absolute/path/to/scripts/scan_and_report.js`
- Se o seu ambiente do Claude Code bloquear a execução de comandos, talvez você precise aprovar `node .../scan_and_report.js` quando for solicitado.
