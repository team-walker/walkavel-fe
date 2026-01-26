# Team Walker Frontend

![Next.js](https://img.shields.io/badge/Next.js_14-App_Router-black?style=flat&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-8.0-orange?style=flat&logo=pnpm&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat&logo=github-actions&logoColor=white)
![Husky](https://img.shields.io/badge/Husky-Git_Hooks-brown?style=flat&logo=git&logoColor=white)

> Team Walker 프로젝트의 프론트엔드 리포지토리입니다.

## 📑 목차

- [🛠 기술 스택](#-기술-스택)
- [📂 프로젝트 구조](#-프로젝트-구조)
- [🚀 시작하기](#-시작하기)
- [📝 협업 가이드](#-협업-가이드)
  - [1. 브랜치 전략](#1-브랜치-전략-git-flow)
  - [2. 커밋 컨벤션](#2-커밋-컨벤션-conventional-commits)
  - [3. PR 전략](#3-prpull-request-전략)
  - [4. 코딩 컨벤션](#4-코딩--스타일-컨벤션)
  - [5. CI/CD](#5-cicd-github-actions)
  - [6. 스프린트 운영](#6-스프린트-및-통합-주기-sprint--integration)
- [⚡️ 빠른 참조](#️-빠른-참조)

---

## 🛠 기술 스택

| Category                 | Technology                     |
| ------------------------ | ------------------------------ |
| **Framework**            | Next.js 14 (App Router)        |
| **Language**             | TypeScript                     |
| **Styling**              | Tailwind CSS 3.4, PostCSS      |
| **Package Manager**      | pnpm                           |
| **Linting & Formatting** | ESLint, Prettier, Stylelint    |
| **Git Hooks**            | Husky, Commitlint, lint-staged |

## 📂 프로젝트 구조

```bash
├── .github/          # Github Actions & Templates
├── app/              # Next.js App Router Pages
├── components/       # Reusable UI components
├── lib/              # Utility functions
├── public/           # Static assets
└── ...
```

## 🚀 시작하기

### 1. 패키지 설치

```bash
pnpm install
```

### 2. 환경 변수 설정

`.env.example` 파일을 `.env.local`로 복사하고, 필요한 환경 변수 값을 설정합니다.

```bash
cp .env.example .env.local
```

### 3. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속해 확인하세요.

### 4. 테스트 실행

```bash
pnpm test
```

---

## 📝 협업 가이드

팀원들과 함께 사용할 협업 규칙 및 컨벤션입니다.

### 1. 브랜치 전략 (Git Flow)

> **Git Flow** 전략을 기반으로 운영합니다.

| 브랜치                      | 용도                         | 직접 Push           |
| --------------------------- | ---------------------------- | ------------------- |
| **`main`**                  | 배포 가능한 프로덕션 코드    | ❌ 금지             |
| **`develop`**               | 다음 배포를 위한 개발 브랜치 | ❌ 금지 (PR만 가능) |
| **`feat/#이슈번호-기능명`** | 기능 개발                    | ✅ 가능             |
| **`fix/#이슈번호-버그명`**  | 버그 수정                    | ✅ 가능             |

#### 📌 작업 프로세스

1. 이슈(Issue) 생성 (작업 내용 정의)
2. `develop` 브랜치 최신화 (`git pull origin develop`)
3. 작업 브랜치 생성 (`git checkout -b feat/#이슈번호-기능명`)
4. 작업 및 커밋
5. 원격 저장소 푸시 (`git push origin feat/#이슈번호-기능명`)
6. PR 생성 (`작업 브랜치` → `develop`)

### 2. 커밋 컨벤션 (Conventional Commits)

> **⚠️ 중요**: 자동화 도구(`commitlint`, `husky`)에 의해 커밋 메시지 규칙이 강제됩니다.

**형식**: `type: subject`

- **모두 소문자로 작성**해야 합니다. (대문자 사용 불가)
- `type`과 `subject` 사이에 콜론(`:`)과 공백 한 칸 필수

| Type       | 설명                                           | 예시                                  |
| ---------- | ---------------------------------------------- | ------------------------------------- |
| `feat`     | 새로운 기능 추가                               | `feat: add login button`              |
| `fix`      | 버그 수정                                      | `fix: resolve header alignment issue` |
| `docs`     | 문서 수정 (README, 주석 등)                    | `docs: update readme guide`           |
| `style`    | 코드 포맷팅, 세미콜론 누락 등 (로직 변경 없음) | `style: format code with prettier`    |
| `refactor` | 코드 리팩토링 (기능 변경 없음)                 | `refactor: simplify validation logic` |
| `test`     | 테스트 코드 추가/수정                          | `test: add unit tests for login`      |
| `chore`    | 빌드 업무, 패키지 매니저 설정 등               | `chore: update dependencies`          |

### 3. PR(Pull Request) 전략

PR 템플릿이 설정되어 있습니다. 내용을 충실히 작성해주세요.

- **제목**: `type: 요약 #이슈번호` (예: `feat: 메인 배너 구현 #23`)
- **Reviewers**: 팀원 전체 + AI reviewer (자동 지정)
- **Assignees**: 자동으로 본인이 지정됨 (Github Actions)
- **Labels**: 작업 성격에 맞는 라벨(`feat`, `fix` 등) 추가
- **Linked Issues**: `Close #이슈번호`를 본문에 작성하여 이슈 자동 닫기 연결

#### 리뷰 & 병합 규칙

- 최소 **1명 이상의 승인(Approve)**이 있어야 병합 가능
- **AI 코드 리뷰(Gemini Code Assist)**가 자동으로 1차 리뷰 진행
- `Squash and Merge` 전략 사용 권장 (커밋 히스토리 깔끔하게 유지)

### 4. 코딩 & 스타일 컨벤션

- **ESLint & Prettier**: `husky`에 의해 커밋 전 자동 검증.
- **Tailwind CSS**: 클래스 순서가 자동으로 정렬됩니다.
- **네이밍**:
  - **컴포넌트**: PascalCase (예: `LoginButton.tsx`)
  - **함수/변수**: camelCase (예: `getUserData`)
  - **상수**: UPPER_SNAKE_CASE (예: `API_BASE_URL`)
  - **파일/폴더**: Next.js 규칙 준수 (`page.tsx`, `layout.tsx`).

### 5. CI/CD (Github Actions)

- PR 생성 및 푸시 시 자동으로 **Build**, **Lint**, **Test** 작업이 실행됩니다 (`ci.yml`).
- 테스트를 통과하지 못하면 Merge가 제한됩니다.

### 6. 스프린트 및 통합 주기 (Sprint & Integration)

**1주 단위 스프린트**로 개발 및 배포를 진행합니다.

- **상시 통합 (CI)**: 기능 완료 시 즉시 PR을 통해 `develop`에 병합. (스프린트 마지막 날 몰아치기 금지)
- **정기 배포**: 스프린트 종료 시 `develop` → `main` 병합 및 배포.

---

## ⚡️ 빠른 참조

### 자주 사용하는 명령어

```bash
# develop 브랜치 최신화
git pull origin develop

# 작업 브랜치 생성
git checkout -b feat/#이슈번호-기능명

# 빌드 및 린트 체크
pnpm build
pnpm lint
```

### 💡 Gemini AI Bot 활용 팁

- **자동 리뷰**: PR 생성 시 Gemini 봇이 자동으로 1차 리뷰를 남깁니다.
- **추가 질문**: 봇의 댓글에 답글을 달거나 `@gemini-code-assist`를 태그하여 질문 가능.
- **명령어**:
  - `/gemini review` - 새로운 리뷰 요청
  - `/gemini summary` - 변경 사항 요약 요청

---

> _위 가이드라인은 프로젝트 상황에 따라 유연하게 변경될 수 있습니다._
