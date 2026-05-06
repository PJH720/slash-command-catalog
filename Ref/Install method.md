# Install

## OptionA_ClaudeCodePlugin

From within Claude Code:

Install:

```text
/plugin marketplace add PJH720/slash-command-catalog
```

Run:

```text
/plugin install command-catalog@pjh720-slash-command-catalog
/command-catalog
```

Or, after installing, run:

```text
/command-catalog
```

This generates the artifacts in the current directory:

- `summarize-report.html`
- `llms.txt`
- `llms-full.txt`

## OptionB_CLAUDEmd_perProject

New project:

```bash
curl -o CLAUDE.md https://raw.githubusercontent.com/PJH720/slash-command-catalog/main/CLAUDE.md
```

Existing project (append):

```bash
echo "" >> CLAUDE.md
curl https://raw.githubusercontent.com/PJH720/slash-command-catalog/main/CLAUDE.md >> CLAUDE.md
```

## Using with Cursor

This repository includes a committed Cursor project rule ([`.cursor/rules/catalog-guidelines.mdc`](.cursor/rules/catalog-guidelines.mdc)) so the same guidelines apply when you open the project in Cursor. See **[CURSOR.md](CURSOR.md)** for setup, using the rule in other projects, and how this relates to Claude Code.

## Cursor (manual run)

Cursor does not need Claude Code plugin installation to run the generator. You can run it directly from the integrated terminal:

```bash
node scripts/scan_and_report.js
```
