# Command Catalog

현재 환경(프로젝트 + 플러그인 + MCP)에서 **실제로 사용할 수 있는** 슬래시 커맨드들을 스캔해 리포트를 생성합니다. 너무 많은 도구 때문에 생기는 “발견 가능성 위기(discoverability crisis)”에서 벗어나기 위한 **사용 가능 기능 목록(capabilities manifest)**에 가깝습니다.

###### Languages

English | [简体中文](docs/i18n/README.zh-CN.md) | [繁體中文](docs/i18n/README.zh-TW.md) | [日本語](docs/i18n/README.ja.md) | [Español](docs/i18n/README.es.md) | [Français](docs/i18n/README.fr.md) | [Deutsch](docs/i18n/README.de.md) | [Português(BR)](docs/i18n/README.pt-BR.md) | [Italiano](docs/i18n/README.it.md) | [Türkçe](docs/i18n/README.tr.md) | [Bahasa Indonesia](docs/i18n/README.id.md) | [Tiếng Việt](docs/i18n/README.vi.md) | [ไทย](docs/i18n/README.th.md) | [Polski](docs/i18n/README.pl.md) | [Nederlands](docs/i18n/README.nl.md) | [Svenska](docs/i18n/README.sv.md) | [Русский](docs/i18n/README.ru.md) | [Українська](docs/i18n/README.uk.md) | [한국어](docs/i18n/README.ko.md) | [العربية](docs/i18n/README.ar.md) | [עברית](docs/i18n/README.he.md) | [हिन्दी](docs/i18n/README.hi.md)

## Outputs

기본적으로 아래 파일들을 **현재 작업 디렉터리**에 생성합니다.

- **사람 친화적(Human-friendly)**: `./CommandCatalog.html` (검색 가능한 단일 페이지)
- **에이전트 친화적(Agent-friendly)**: `./llms.txt` 와 `./llms-full.txt` (HTML 파싱 불필요)

선택 사항(환경/플러그인 설정에서 활성화된 경우):

- **사람 친화적(확장 버전)**: `./llm-full.html`

## Quickstart (Claude Code plugin)

아래 커맨드들을 **Claude Code 채팅 입력창**에서 실행하세요(붙여넣기 + 전송).

이 저장소를 플러그인 마켓플레이스로 추가:

```text
/plugin marketplace add PJH720/slash-command-catalog
```

해당 마켓플레이스에서 플러그인 설치:

```text
/plugin install command-catalog@pjh720-slash-command-catalog
```

```text
/reload-plugins
```

그리고 실행:

```text
/command-catalog
```

## When to use it

- 프로젝트에서 어떤 `/commands` 가 있는지 자꾸 까먹는다.
- 에이전트가 “추측”하지 않고 읽을 수 있는 빠른 capabilities manifest가 필요하다.
- 같은 이름의 커맨드가 여러 곳에 정의되어 **섀도잉/중복**이 의심된다.

## What it scans

- `.claude/skills/` (SKILL.md)
- `.claude/commands/` (마크다운 커맨드 파일)
- `.claude/plugins/` (플러그인 설정, 존재하는 경우)
- `.mcp.json` (MCP 서버 요약, 존재하는 경우)

## Notes

- 러너는 **zero-install**(순수 Node.js ESM)이며, 아래처럼 직접 실행할 수도 있습니다:
  - `node /absolute/path/to/scripts/scan_and_report.js`
- Claude Code 환경에서 커맨드 실행이 막혀 있다면, 프롬프트가 뜰 때 `node .../scan_and_report.js` 실행을 승인해야 할 수 있습니다.
