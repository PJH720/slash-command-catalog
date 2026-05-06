## SummarizeCommand

현재 내 환경(프로젝트 + 플러그인 + MCP 등)에서 **실제로 사용 가능한 슬래시 명령어(/)** 들을 한 번에 “카탈로그/리포트”로 만들어, 너무 많은 도구 때문에 발생하는 **발견성 위기(Discoverability Crisis)** 를 줄이기 위한 프로젝트입니다.

이 레포의 첫 번째 결과물은 다음 두 관점 모두를 만족하는 “명령어 인벤토리 리포트”입니다.

- **사용자(사람) 친화적**: 한 장짜리 HTML 리포트로 빠르게 훑고 결정할 수 있음
- **에이전트(AI) 친화적**: HTML 파싱 없이 읽을 수 있는 `llms.txt` / `llms-full.txt` 생성

## 생성되는 산출물

CLI 실행 시 지정한 출력 디렉터리에 아래 파일들이 생성됩니다.

- `summarize-report.html`: 발견된 명령어/메타데이터를 표로 정리한 HTML
- `llms.txt`: “한 줄 = 한 명령어” 형태의 초경량 카탈로그
- `llms-full.txt`: 구조화된 상세 카탈로그(에이전트가 읽기 좋음)

## 빠른 시작(로컬 개발)

```bash
npm install
npm run dev -- --out ./summarize-report
```

출력:

- `./summarize-report/summarize-report.html`
- `./summarize-report/llms.txt`
- `./summarize-report/llms-full.txt`

## CLI 사용법

이 프로젝트는 Node.js CLI를 제공합니다.

- **개발 실행**: `npm run dev -- --out <dir>`
- **빌드**: `npm run build`
- **빌드 결과 실행**: `npm run start -- --out <dir>`

옵션:

- `--out <dir>`: 출력 디렉터리 (기본값: `./summarize-report`)
- `--pdf`: v1 예약 옵션 (현재는 **미구현**이며 HTML/LLMS만 생성)

## v1의 “발견(Discovery)” 방식

CLI는 레포 루트를 스캔하고, 특정 위치에 있는 “명령어 형태의 마크다운”을 찾아 기록으로 변환합니다.

현재 스캔 패턴(v1):

- `.github/agents/`
- `.github/prompts/`

발견된 각 파일은 `name`, `summary`, `kind`, `source`, `path` 같은 레코드로 파싱됩니다. 동일한 이름의 명령어 정의가 여러 곳에 존재하면, 리포트에 **충돌(Conflict) 경로**를 함께 출력하여 섀도잉/중복을 파악할 수 있게 합니다.

## 왜 필요한가

Claude Code 같은 에이전틱 워크플로우는 플러그인/스킬/후크/MCP 서버를 추가할수록 강력해지지만, 확장 요소가 기하급수적으로 늘면 다음 문제가 생깁니다.

- 내가 어떤 `/command`를 쓸 수 있는지 기억하기 어렵다
- 그 명령어가 어디서 온 건지(플러그인/MCP/로컬) 파악하기 어렵다
- 에이전트가 추측/탐색에 토큰을 낭비한다

SummarizeCommand는 이 환경을 “자가 문서화(Self-Documenting)”에 가깝게 만들려는 도구입니다.

## 레포 메모

- `.cursor/`: Cursor IDE 프로젝트 설정/플랜
- `.claude/`: 로컬 에이전트 워크플로우 메모(프로젝트 스코프)

## 안전 수칙

- 시크릿 커밋 금지: `.env`, 토큰/키, 인증서, 개인정보 등
- 재현 가능한 실행: 의존성은 `package.json`에 명시

## License

MIT

