# Command Catalog

Erzeuge einen Report der Slash-Commands, die du in deiner aktuellen Umgebung (Projekt + Plugins + MCP) **tatsächlich** verwenden kannst – so entkommst du der “Discoverability-Krise”, die durch zu viele Tools entsteht. Praktisch ist das ein **Capabilities-Manifest**, das ein Agent ohne Rätselraten lesen kann.

###### Languages

English | [简体中文](docs/i18n/README.zh-CN.md) | [繁體中文](docs/i18n/README.zh-TW.md) | [日本語](docs/i18n/README.ja.md) | [Español](docs/i18n/README.es.md) | [Français](docs/i18n/README.fr.md) | [Deutsch](docs/i18n/README.de.md) | [Português(BR)](docs/i18n/README.pt-BR.md) | [Italiano](docs/i18n/README.it.md) | [Türkçe](docs/i18n/README.tr.md) | [Bahasa Indonesia](docs/i18n/README.id.md) | [Tiếng Việt](docs/i18n/README.vi.md) | [ไทย](docs/i18n/README.th.md) | [Polski](docs/i18n/README.pl.md) | [Nederlands](docs/i18n/README.nl.md) | [Svenska](docs/i18n/README.sv.md) | [Русский](docs/i18n/README.ru.md) | [Українська](docs/i18n/README.uk.md) | [한국어](docs/i18n/README.ko.md) | [العربية](docs/i18n/README.ar.md) | [עברית](docs/i18n/README.he.md) | [हिन्दी](docs/i18n/README.hi.md)

## Outputs

Standardmäßig schreibt der Command diese Dateien in das **aktuelle Arbeitsverzeichnis**:

- **Human-friendly**: `./CommandCatalog.html` (eine durchsuchbare Einzelseite)
- **Agent-friendly**: `./llms.txt` und `./llms-full.txt` (kein HTML-Parsing nötig)

Optional (wenn durch deine Umgebung/Plugin-Konfiguration aktiviert):

- **Human-friendly (expanded)**: `./llm-full.html`

## Quickstart (Claude Code plugin)

Führe diese Befehle **im Claude Code Chat-Input** aus (einfügen + senden).

Dieses Repository als Plugin-Marktplatz hinzufügen:

```text
/plugin marketplace add PJH720/slash-command-catalog
```

Plugin aus diesem Marktplatz installieren:

```text
/plugin install command-catalog@pjh720-slash-command-catalog
```

```text
/reload-plugins
```

Dann ausführen:

```text
/command-catalog
```

## When to use it

- Du vergisst ständig, welche `/commands` es in einem Projekt gibt.
- Du willst ein schnelles “Capabilities-Manifest”, das ein Agent ohne Raten lesen kann.
- Du vermutest Shadowing/Duplikate (derselbe Name ist mehrfach definiert).

## What it scans

- `.claude/skills/` (SKILL.md)
- `.claude/commands/` (Markdown-Command-Dateien)
- `.claude/plugins/` (Plugin-Konfigurationen, falls vorhanden)
- `.mcp.json` (MCP-Server-Übersicht, falls vorhanden)

## Notes

- Der Runner ist **zero-install** (reines Node.js ESM) und kann auch direkt ausgeführt werden:
  - `node /absolute/path/to/scripts/scan_and_report.js`
- Falls deine Claude-Code-Umgebung das Ausführen von Commands blockiert, musst du eventuell die Ausführung von `node .../scan_and_report.js` bestätigen, wenn du dazu aufgefordert wirst.
