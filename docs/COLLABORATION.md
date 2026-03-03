# 🤝 협업 가이드 (Collaboration Guide)

> **"지속 가능한 코드 품질과 효율적인 협업을 위해 다음 규칙을 준수합니다."**
> 팀 내에서 논의된 상세한 협업 프로세스와 가이드는 [팀 노션](https://www.notion.so/hayeonbaek/2fdf2cf9d94180f488aef3da85e6e993?source=copy_link)에서 확인하실 수 있습니다.

## 📑 목차 <!-- omit in toc -->

- [🤝 협업 가이드 (Collaboration Guide)](#-협업-가이드-collaboration-guide)
  - [1. 브랜치 전략 (Git Flow)](#1-브랜치-전략-git-flow)
    - [브랜치 종류](#브랜치-종류)
  - [2. 커밋 컨벤션 (Conventional Commits)](#2-커밋-컨벤션-conventional-commits)
    - [커밋 메시지 형식](#커밋-메시지-형식)
  - [3. PR(Pull Request) 전략](#3-prpull-request-전략)
    - [PR 작성 및 리뷰 규칙](#pr-작성-및-리뷰-규칙)
  - [4. 코딩 \& 스타일 컨벤션](#4-코딩--스타일-컨벤션)
    - [네이밍 컨벤션](#네이밍-컨벤션)
    - [코드 작성 원칙](#코드-작성-원칙)
  - [5. CI/CD (Github Actions)](#5-cicd-github-actions)
  - [6. 스프린트 및 통합 주기 (Sprint \& Integration)](#6-스프린트-및-통합-주기-sprint--integration)

---

## 1. 브랜치 전략 (Git Flow)

> **Git Flow** 전략을 기반으로 운영합니다.

### 브랜치 종류

| 브랜치                  | 용도                         | 직접 Push           |
| :---------------------- | :--------------------------- | :------------------ |
| **`main`**              | 배포 가능한 프로덕션 코드    | ❌ 금지             |
| **`develop`**           | 다음 배포를 위한 개발 브랜치 | ❌ 금지 (PR만 가능) |
| **`feat/#이슈번호-기능명`** | 기능 개발                    | ✅ 가능             |
| **`fix/#이슈번호-버그명`**  | 버그 수정                    | ✅ 가능             |

---

## 2. 커밋 컨벤션 (Conventional Commits)

> **⚠️ 중요**: `commitlint`, `husky`에 의해 커밋 메시지 규칙이 강제됩니다.  
> 상세한 작성 가이드와 예시는 [팀 노션](https://www.notion.so/hayeonbaek/2fdf2cf9d94180f488aef3da85e6e993?source=copy_link)에서 확인해 주세요.

### 커밋 메시지 형식

`type: subject` (예: `feat: implement login api`)

| Type       | 설명                          | 예시                                  |
| :--------- | :---------------------------- | :------------------------------------ |
| `feat`     | 새로운 기능 추가              | `feat: add user login component`      |
| `fix`      | 버그 수정                     | `fix: resolve api timeout error`      |
| `docs`     | 문서 수정 (README 등)         | `docs: update readme guide`           |
| `style`    | 코드 포맷팅 (로직 변경 없음)  | `style: format code with prettier`    |
| `refactor` | 코드 리팩토링                 | `refactor: simplify validation logic` |
| `test`     | 테스트 코드 추가/수정         | `test: add unit tests for services`   |
| `chore`    | 빌드 업무, 패키지 업데이트 등 | `chore: update dependencies`          |

---

## 3. PR(Pull Request) 전략

### PR 작성 및 리뷰 규칙

- **Feature 작업 (Solo & AI Review)**:
  - 프론트엔드 단독 개발로 인해 `feat` 혹은 `fix` 브랜치 작업 시 **Gemini AI**를 통한 1차 코드 리뷰와 **셀프 리뷰**를 필수로 진행합니다.
- **Develop → Main 병합 (Team Review)**:
  - 최종 배포를 위한 병합 시에는 팀원 전체를 리뷰어로 지정하여 코드 공유 및 최종 승인을 거칩니다.
- **승인 조건**: 최소 **1명 이상**의 팀원 승인(Approve)이 있어야 병합이 가능합니다.
- **병합 방식**: 커밋 히스토리 관리를 위해 `Squash and Merge`를 권장합니다.

---

## 4. 코딩 & 스타일 컨벤션

### 네이밍 컨벤션

- **컴포넌트**: PascalCase (`LoginButton.tsx`)
- **함수/변수**: camelCase (`getUserData`)
- **상수**: UPPER_SNAKE_CASE (`API_BASE_URL`)

### 코드 작성 원칙

1. **명확한 변수명**: 축약어보다는 의미 있는 이름을 사용합니다.
2. **단일 책임**: 하나의 함수는 하나의 역할만 수행합니다.
3. **Early Return**: 중첩된 if문보다는 조기 반환 패턴을 사용합니다.

---

## 5. CI/CD (Github Actions)

PR 생성 및 푸시 시 자동으로 다음 작업이 실행됩니다:

- ✅ **Build**: 프로젝트 빌드 성공 여부 확인
- ✅ **Lint**: ESLint, Stylelint 검사
- ✅ **Test**: Jest 및 Playwright 테스트 통과 여부

---

## 6. 스프린트 및 통합 주기 (Sprint & Integration)

> **1주 단위 스프린트**로 개발이 진행됩니다.

- **상시 통합 (CI)**: 기능 구현 완료 시 즉시 PR을 통해 `develop` 브랜치에 병합합니다. 스케줄 마지막에 몰아서 병합하는 '머지 헬'을 방지합니다.
- **정기 배포**: 스프린트 종료 시 QA 과정을 거쳐 `main` 브랜치에 최종 병합 및 배포합니다.
