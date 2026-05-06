# Command Catalog

Générez un rapport des slash commands que vous pouvez **réellement** utiliser dans votre environnement actuel (projet + plugins + MCP), afin d’échapper à la “crise de découvrabilité” causée par trop d’outils. En pratique, c’est un **manifeste de capacités** qu’un agent peut lire sans deviner.

###### Languages

English | [简体中文](docs/i18n/README.zh-CN.md) | [繁體中文](docs/i18n/README.zh-TW.md) | [日本語](docs/i18n/README.ja.md) | [Español](docs/i18n/README.es.md) | [Français](docs/i18n/README.fr.md) | [Deutsch](docs/i18n/README.de.md) | [Português(BR)](docs/i18n/README.pt-BR.md) | [Italiano](docs/i18n/README.it.md) | [Türkçe](docs/i18n/README.tr.md) | [Bahasa Indonesia](docs/i18n/README.id.md) | [Tiếng Việt](docs/i18n/README.vi.md) | [ไทย](docs/i18n/README.th.md) | [Polski](docs/i18n/README.pl.md) | [Nederlands](docs/i18n/README.nl.md) | [Svenska](docs/i18n/README.sv.md) | [Русский](docs/i18n/README.ru.md) | [Українська](docs/i18n/README.uk.md) | [한국어](docs/i18n/README.ko.md) | [العربية](docs/i18n/README.ar.md) | [עברית](docs/i18n/README.he.md) | [हिन्दी](docs/i18n/README.hi.md)

## Outputs

Par défaut, la commande écrit ces fichiers dans le **répertoire courant** :

- **Human-friendly** : `./CommandCatalog.html` (une page unique, consultable)
- **Agent-friendly** : `./llms.txt` et `./llms-full.txt` (pas besoin de parser du HTML)

Optionnel (si activé par votre environnement/configuration de plugin) :

- **Human-friendly (expanded)** : `./llm-full.html`

## Quickstart (Claude Code plugin)

Exécutez ces commandes **dans le champ de chat de Claude Code** (coller + envoyer).

Ajouter ce dépôt comme marketplace de plugins :

```text
/plugin marketplace add PJH720/slash-command-catalog
```

Installer le plugin depuis ce marketplace :

```text
/plugin install command-catalog@pjh720-slash-command-catalog
```

```text
/reload-plugins
```

Puis lancez-le :

```text
/command-catalog
```

## When to use it

- Vous oubliez sans cesse quels `/commands` existent dans un projet.
- Vous voulez un “manifeste de capacités” rapide qu’un agent peut lire sans deviner.
- Vous suspectez du shadowing/de la duplication (même nom défini à plusieurs endroits).

## What it scans

- `.claude/skills/` (SKILL.md)
- `.claude/commands/` (fichiers de commandes Markdown)
- `.claude/plugins/` (configurations de plugins, si présentes)
- `.mcp.json` (résumé des serveurs MCP, si présent)

## Notes

- Le runner est **zero-install** (Node.js ESM pur) et peut aussi être exécuté directement :
  - `node /absolute/path/to/scripts/scan_and_report.js`
- Si votre environnement Claude Code bloque l’exécution de commandes, il peut être nécessaire d’approuver `node .../scan_and_report.js` lorsque cela est demandé.
