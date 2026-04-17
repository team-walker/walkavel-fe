# E2E 테스트 코드 자동 생성

인자로 전달된 페이지 또는 플로우에 대한 Playwright E2E 테스트를 생성합니다.

## 사용법
```
/generate-e2e [페이지경로 또는 플로우 설명]
```

예시:
- `/generate-e2e app/(main)/(no-header)/bookmark/page.tsx`
- `/generate-e2e 북마크 추가/제거 플로우`
- `/generate-e2e 랜드마크 상세 페이지`

## 지시사항

**대상:** $ARGUMENTS

### 1. 분석
- 대상 페이지/컴포넌트 파일을 읽어 주요 UI 요소와 인터랙션을 파악
- 관련 API 엔드포인트 확인 (`app/api/` 또는 백엔드 호출 패턴)

### 2. 출력 경로
`e2e/[feature-name].spec.ts`

### 3. 테스트 구조 (기존 home-flow.spec.ts 패턴 준수)

```typescript
import { expect, test } from '@playwright/test';

// Mock 데이터를 파일 상단에 상수로 선언
const MOCK_XXX = { ... };

test.describe('[기능명] E2E', () => {
  test.beforeEach(async ({ page }) => {
    // API 모킹: page.route() 사용
    await page.route('**/api/xxx*', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_XXX) });
    });
    await page.goto('/경로');
  });

  test('[시나리오 설명]', async ({ page }) => {
    // Arrange: 로케이터 선언
    // Act & Assert: waitFor → interact → assert 순서
  });
});
```

### 4. 테스트 케이스 목록
각 페이지에서 반드시 포함할 항목:
- 페이지 초기 렌더링 (스플래시 대기 포함)
- 주요 인터랙션 (버튼 클릭, 폼 입력)
- API 응답 후 UI 업데이트 확인
- 에러 상태 (API 실패 시 UI)
- 빈 상태 (데이터 없을 때)

### 5. 로케이터 우선순위
1. `getByTestId('...')` — data-testid 속성 (가장 안정적)
2. `getByRole('button', { name: '...' })` — 접근성 기반
3. `getByText('...')` — 텍스트 기반
4. `locator('...')` — CSS 선택자 (최후 수단)

data-testid가 없는 요소는 컴포넌트에 추가해주세요.

### 6. 인증이 필요한 페이지
`test.use({ storageState: 'playwright/.auth/user.json' });`를 `describe` 블록 안에 추가하세요.

### 7. 최종 확인
```bash
pnpm test:e2e [생성된파일] --project=chromium
```
로 실행 확인 후 실패 시 수정하세요.
