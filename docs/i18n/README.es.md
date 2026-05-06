# Command Catalog

Genera un informe con los slash commands que **realmente** puedes usar en tu entorno actual (proyecto + plugins + MCP), para salir de la “crisis de descubribilidad” causada por demasiadas herramientas. Es, en la práctica, un **manifiesto de capacidades** que un agente puede leer sin adivinar.

###### Languages

English | [简体中文](docs/i18n/README.zh-CN.md) | [繁體中文](docs/i18n/README.zh-TW.md) | [日本語](docs/i18n/README.ja.md) | [Español](docs/i18n/README.es.md) | [Français](docs/i18n/README.fr.md) | [Deutsch](docs/i18n/README.de.md) | [Português(BR)](docs/i18n/README.pt-BR.md) | [Italiano](docs/i18n/README.it.md) | [Türkçe](docs/i18n/README.tr.md) | [Bahasa Indonesia](docs/i18n/README.id.md) | [Tiếng Việt](docs/i18n/README.vi.md) | [ไทย](docs/i18n/README.th.md) | [Polski](docs/i18n/README.pl.md) | [Nederlands](docs/i18n/README.nl.md) | [Svenska](docs/i18n/README.sv.md) | [Русский](docs/i18n/README.ru.md) | [Українська](docs/i18n/README.uk.md) | [한국어](docs/i18n/README.ko.md) | [العربية](docs/i18n/README.ar.md) | [עברית](docs/i18n/README.he.md) | [हिन्दी](docs/i18n/README.hi.md)

## Outputs

Por defecto, escribe estos archivos en el **directorio actual**:

- **Human-friendly**: `./CommandCatalog.html` (una sola página buscable)
- **Agent-friendly**: `./llms.txt` y `./llms-full.txt` (sin necesidad de parsear HTML)

Opcional (si está habilitado por tu entorno/configuración de plugins):

- **Human-friendly (expanded)**: `./llm-full.html`

## Quickstart (Claude Code plugin)

Ejecuta estos comandos **en el input del chat de Claude Code** (pega y envía).

Añade este repositorio como marketplace de plugins:

```text
/plugin marketplace add PJH720/slash-command-catalog
```

Instala el plugin desde ese marketplace:

```text
/plugin install command-catalog@pjh720-slash-command-catalog
```

```text
/reload-plugins
```

Luego ejecútalo:

```text
/command-catalog
```

## When to use it

- Te olvidas continuamente de qué `/commands` existen en un proyecto.
- Quieres un “manifiesto de capacidades” rápido que un agente pueda leer sin adivinar.
- Sospechas de shadowing/duplicación (el mismo nombre definido en varios lugares).

## What it scans

- `.claude/skills/` (SKILL.md)
- `.claude/commands/` (archivos de comandos en Markdown)
- `.claude/plugins/` (configuración de plugins, si existe)
- `.mcp.json` (resumen de servidores MCP, si existe)

## Notes

- El runner es **zero-install** (Node.js ESM puro) y también se puede ejecutar directamente:
  - `node /absolute/path/to/scripts/scan_and_report.js`
- Si tu entorno de Claude Code bloquea la ejecución de comandos, puede que debas aprobar `node .../scan_and_report.js` cuando aparezca el aviso.
