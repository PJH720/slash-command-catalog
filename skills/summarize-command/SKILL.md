---
name: summarize-command
description: 시스템의 사용 가능한 명령어를 스캔하여 요약 리포트를 생성합니다.
disable-model-invocation: true
---

현재 프로젝트 디렉터리를 기준으로 아래 소스들을 스캔해 리포트를 생성합니다:

- `.claude/skills/` (SKILL.md)
- `.claude/commands/` (markdown command files)
- `.github/agents/`, `.github/prompts/` (repo-local command/prompt assets)
- `.mcp.json` (MCP 서버 설정 요약)

출력물은 **현재 디렉터리**에 생성됩니다:

- `summarize-report.html`
- `llms.txt`
- `llms-full.txt`

!command node "${CLAUDE_PLUGIN_ROOT}/scripts/scan_and_report.js"

