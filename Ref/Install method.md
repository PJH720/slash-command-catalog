## Install

**Option A: Claude Code Plugin (recommended)**

From within Claude Code:

1) Install from this repo (git URL):
```
/plugin marketplace add PJH720/slash-command-catalog
```

2) Run:
```
/summarize-command
```

This generates the artifacts in the current directory:

- `summarize-report.html`
- `llms.txt`
- `llms-full.txt`

**Option B: CLAUDE.md (per-project)**

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