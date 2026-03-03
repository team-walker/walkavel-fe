<div align="center">
  <h1 style="display: flex; align-items: center; justify-content: center; gap: 12px;">
    <img src="public/icons/apple-touch-icon.png" width="40" height="40" alt="Walkavel Icon" />
    <span style="color: #3182F6">Walkavel (워커블)</span>
  </h1>
  <p><b>일상이 여행이 되는 순간, 발걸음이 즐거운 여행을 제안합니다.</b></p>
  <p>걷기 좋은 여행지를 발견하고 스탬프 미션을 통해 재미를 더해주는 모바일 최적화 웹 서비스</p>

  <p>
    <a href="https://walkavel.vercel.app/"><img src="https://img.shields.io/badge/Live_Demo-3182F6?style=for-the-badge&logo=vercel&logoColor=white" /></a>
    <a href="docs/assets/presentation.pdf"><img src="https://img.shields.io/badge/Presentation-FF5722?style=for-the-badge&logo=adobe-acrobat-reader&logoColor=white" /></a>
    <a href="https://youtu.be/BHgrptiKOFI"><img src="https://img.shields.io/badge/Demo_Video-FF0000?style=for-the-badge&logo=youtube&logoColor=white" /></a>
    <a href="https://teamwalkerbackend.fly.dev/docs"><img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" /></a>
  </p>

<br/>

![Next.js](https://img.shields.io/badge/Next.js_16-App_Router-black?style=flat&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Supported-orange?style=flat&logo=pwa&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-State_Management-blue?style=flat)
![Supabase](https://img.shields.io/badge/Supabase-Auth-green?style=flat&logo=supabase&logoColor=white)

</div>

---

## 📑 목차 <!-- omit in toc -->

- [✨ 서비스 소개](#-서비스-소개)
- [📌 Key Highlights](#-key-highlights)
- [🛠️ 기술 스택](#️-기술-스택)
- [📂 프로젝트 구조](#-프로젝트-구조)
- [🚀 시작하기](#-시작하기)
- [🤝 협업 가이드](#-협업-가이드)
- [👥 팀원 구성](#-팀원-구성)

---

## ✨ 서비스 소개

<img src="public/images/walkavel-intro.png" width="100%" alt="Walkavel Service Introduction" />

### 📲 모바일 웹앱 (PWA) 지원 <!-- omit in toc -->

Walkavel은 **Progressive Web App(PWA)** 기술을 적용하여 네트워크 제약을 넘어선 사용자 경험을 설계했습니다.

- **홈 화면 추가(A2HS)**: 별도의 앱 스토어 거치 없이 홈 화면 추가를 통해 즉각적인 서비스 진입 유도
- **오프라인 라이브러리 지원**: 서비스 워커 캐싱 전략을 통해 오프라인 환경에서도 핵심 데이터 접근 가능

### 💡 주요 기능 (Features) <!-- omit in toc -->

#### 📍 걷기 좋은 여행지 추천 (Explore) <!-- omit in toc -->

- 사용자 위치 기반의 실시간 명소 추천 및 네이버 지도 API 커스터마이징을 통한 직관적 인터페이스 제공
- **확장성 고려**: 현재 서울 중심의 서비스를 전국 단위 및 테마별 랜드마크로 확장 가능한 데이터 구조 설계

#### 🎫 스탬프 획득 미션 (Stamp) <!-- omit in toc -->

- Geolocation API를 활용한 방문 인증 시스템과 **게이미피케이션** 요소를 결합하여 사용자 체류 시간 증대 및 재방문 유도

#### 🔖 나만의 여행 보관함 (Bookmark) <!-- omit in toc -->

- 관심 장소의 효율적 관리를 위한 서버 사이드 데이터 동기화 및 즉각적인 UI 반영(Optimistic Update) 구현

#### 🎨 모바일 최적화 UI/UX <!-- omit in toc -->

- iOS/Android Safe Area 완벽 대응 및 480px 고정 레이아웃으로 모바일 웹뷰 최상의 안정성 확보

---

## 📌 Key Highlights

- **PWA(Progressive Web App) 기반 오프라인 접근성**: 도보 여행 중 발생할 수 있는 네트워크 불안정 환경에 대응하고, 설치 없이도 앱 라이크한 사용자 경험(UX)을 제공합니다.
- **Next.js Middleware를 활용한 API Security**: Edge Proxy 구축을 통해 브라우저 CORS 문제를 근본적으로 해결하고, API 키 노출 방지 등 보안성을 강화했습니다.
- **Framer Motion 기반 고성능 UI/UX**: 60fps의 부드러운 페이지 전환 애니메이션과 직관적인 Swipe UI를 구현하여 모바일 최적화 인터랙션을 완성했습니다.
- **AI-Driven Code Quality Control**: Gemini AI를 활용한 1차 코드 리뷰 파이프라인을 도입하여 컨벤션 준수율을 높이고 비즈니스 로직 검증에 집중할 수 있는 환경을 구축했습니다.

---

## 🛠️ 기술 스택

| Category       | Technology                  | Decision (기술적 의사결정 배경)                                           |
| :------------- | :-------------------------- | :------------------------------------------------------------------------ |
| **Framework**  | Next.js 16, React 19        | App Router를 통한 성능 최적화 및 최신 리액트 기능(Server Actions 등) 활용 |
| **Auth**       | Supabase Auth               | 서버리스 환경에서 관리가 용이하고 보안이 검증된 인증 시스템 구축          |
| **State**      | Zustand 5                   | Boilerplate가 적고 가벼워 런타임 오버헤드를 최소화하며 개발 생산성 향상   |
| **Styling**    | Tailwind CSS 4              | Utility-first 방식을 통한 디자인 시스템의 일관성 유지 및 빠른 스타일 전개 |
| **PWA**        | @ducanh2912/next-pwa        | 도보 여행 중 네트워크 단절 상황에 대응하고 설치 없는 앱 경험 제공         |
| **API & Data** | Orval, TanStack Query v4    | API 코드 자동 생성을 통한 타입 안정성 확보 및 효율적 서버 상태 관리       |
| **Testing**    | Jest, Playwright, Storybook | 단위/E2E 테스트 및 UI 컴포넌트 문서화를 통한 안정적인 제품 품질 유지      |

---

## 📂 프로젝트 구조

```bash
├── app/                  # Next.js App Router
│   ├── (auth)/           # 인증 도메인 (Login, Callback) 라우트 그룹핑
│   ├── (main)/           # 메인 서비스 비즈니스 레이어 (Home, Explore 등)
│   ├── actions/          # Server Actions: 클라이언트-서버 간 타입 안전한 데이터 통신
│   └── api/              # BFF(Backend for Frontend): 외부 API 통신을 위한 프록시 및 보안 레이어
├── components/           # Atomic Design Pattern 기반 컴포넌트 분리
│   ├── common/           # 도메인 의존성 없이 재사용 가능한 비즈니스 공통 컴포넌트
│   ├── layout/           # 전역 레이아웃 및 페이지 전환(Transition) 관리
│   └── ui/               # Shadcn UI 기반의 순수 디자인 컴포넌트 (Button, Input 등)
├── hooks/                # 비즈니스 로직(View Model)과 UI 뷰의 관심사 분리를 위한 커스텀 훅
├── lib/                  # 핵심 인프라 및 유틸리티
│   └── repositories/     # Repository Pattern: 데이터 소스 교체가 용이하도록 데이터 접근 로직 캡슐화
├── store/                # Zustand: 전역 클라이언트 상태 관리 (Auth, Map 등)
├── types/                # Orval을 통해 자동 생성된 API 모델 및 공통 타입 정의
├── __tests__/            # Jest: 비즈니스 로직 및 유틸리티 함수 단위 테스트
└── e2e/                  # Playwright: 핵심 사용자 시나리오(Happy Path) 검증
```

---

## 🚀 시작하기

### 1. 패키지 설치 <!-- omit in toc -->

Node.js 20.0.0 이상의 버전이 필요합니다.

```bash
pnpm install
```

### 2. 환경 변수 설정 <!-- omit in toc -->

`.env.example` 파일을 `.env`로 복사하여 알맞은 값을 설정합니다.

```bash
cp .env.example .env.local
```

### 3. 개발 서버 실행 <!-- omit in toc -->

```bash
pnpm dev
```

---

## 🤝 협업 가이드

팀의 협업 문화와 코드 작성 규칙에 대한 상세 내용은 [COLLABORATION.md](docs/COLLABORATION.md) 문서 및 [💻 Team Notion](https://www.notion.so/hayeonbaek/2fdf2cf9d94180f488aef3da85e6e993?source=copy_link)에서 확인하실 수 있습니다.

단순한 구현을 넘어 효율적인 프로세스를 통해 팀 전체의 퍼포먼스를 높이는 데 집중합니다.

- **브랜치 전략**: Git Flow 기반의 엄격한 형상 관리
- **커밋 컨벤션**: Conventional Commits 준수를 통한 히스토리 가시성 확보
- **코드 리뷰**: Gemini AI 1차 리뷰 도입을 통해 단순 컨벤션 오류 수정 시간을 단축하고, 팀원 간에는 비즈니스 로직 및 아키텍처 개선 논의에 집중
- **품질 관리**: Github Actions 기반 CI/CD 구축으로 모든 PR에 대한 빌드 및 테스트 자동 검증

---

## 👥 팀원 구성

<table width="100%">
  <thead>
    <tr>
      <td align="center">
        <a href="https://github.com/bhy304">
          <img src="https://avatars.githubusercontent.com/u/43948313?v=4" width="100" alt="백하연"/>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/jsyoon27">
          <img src="https://avatars.githubusercontent.com/u/220376998?v=4" width="100" alt="정성윤"/>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/JHParrrk">
          <img src="https://avatars.githubusercontent.com/u/112451800?v=4" width="100" alt="박준하"/>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/YOJIN003">
          <img src="https://avatars.githubusercontent.com/u/151131391?v=4" width="100" alt="정여진"/>
        </a>
      </td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">
        <b>백하연</b><br />
        😎 팀장 / FE
      </td>
      <td align="center">
        <b>정성윤</b><br />
        🛠️ 부팀장 / BE
      </td>
      <td align="center">
        <b>박준하</b><br />
        🛠️ 팀원 / BE
      </td>
      <td align="center">
        <b>정여진</b><br />
        🛠️ 팀원 / BE
      </td>
    </tr>
    <tr>
      <td valign="top">
        • 서비스 아키텍처 설계 및 UI/UX 총괄<br />
        • PWA 최적화 및 인프라 CI/CD 파이프라인 구축<br />
        • Framer Motion 기반 고도화된 인터랙션 구현
      </td>
      <td valign="top">
        • 핵심 비즈니스 로직 단위/통합 테스트 설계<br />
        • 마이크로서비스 지향 API 아키텍처 설계<br />
        • 인프라 자동화 및 시스템 품질 관리 총괄
      </td>
      <td valign="top">
        • Geolocation 기반 위치 서비스 최적화<br />
        • 검색 성능 개선 및 북마크 도메인 로직 구현<br />
        • 백엔드 비즈니스 레이어 확장성 강화
      </td>
      <td valign="top">
        • 사용자 인증 기반 데이터 정합성 검증<br />
        • Supabase 기반 인증/인가 시스템 고도화<br />
        • 스탬프 미션 데이터 모델링 및 가공
      </td>
    </tr>
  </tbody>
</table>
