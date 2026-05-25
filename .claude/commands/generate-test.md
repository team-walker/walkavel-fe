# 테스트 코드 자동 생성

현재 선택된 파일 또는 인자로 전달된 파일 경로에 대한 Jest 테스트를 생성합니다.

## 사용법
```
/generate-test [파일경로]
```

예시:
- `/generate-test hooks/useBookmark.ts`
- `/generate-test store/bookmarkStore.ts`
- `/generate-test components/bookmark/BookmarkCard.tsx`

## 지시사항

**대상:** $ARGUMENTS
(인자가 없으면 현재 IDE에서 열려 있는 파일 또는 가장 최근에 수정된 소스 파일을 대상으로 하세요.)

아래 규칙을 **반드시** 따라 테스트를 생성하세요.

### 1. 파일 분석
대상 파일을 읽어 다음을 파악하세요:
- export된 함수/클래스/컴포넌트 목록
- 의존성 (import 목록)
- 핵심 로직과 분기점 (if/else, try/catch, 조건 렌더링)

### 2. 출력 경로 결정
| 원본 파일 위치 | 테스트 파일 위치 |
|---|---|
| `hooks/useXxx.ts` | `__tests__/hooks/useXxx.test.tsx` |
| `store/xxxStore.ts` | `__tests__/store/xxxStore.test.ts` |
| `lib/repositories/xxx.repository.ts` | `__tests__/lib/repositories/xxx.repository.test.ts` |
| `lib/utils/xxx.ts` | `__tests__/lib/utils/xxx.test.ts` |
| `components/ui/Xxx.tsx` | `__tests__/components/ui/Xxx.test.tsx` |
| `app/api/xxx/route.ts` | `__tests__/app/api/xxx/route.test.ts` |

이미 테스트 파일이 존재하면 **덮어쓰지 말고** 누락된 케이스만 추가하세요.

### 3. 테스트 작성 규칙

#### 공통
- `describe` 블록으로 파일/함수 단위 그룹화
- 테스트 설명은 **한국어**로 작성 (`it('xxx해야 한다', ...)`)
- `beforeEach`에서 store 초기화 및 `jest.clearAllMocks()` 호출
- 모든 외부 의존성은 `jest.mock()`으로 모킹

#### Hook 테스트 (`hooks/`)

훅이 **Zustand 스토어**를 사용하는 경우:
```typescript
import { act, renderHook, waitFor } from '@testing-library/react';
import { useXxx } from '@/hooks/useXxx';
jest.mock('@/lib/repositories/xxx.repository', () => ({ ... }));

describe('useXxx Hook', () => {
  beforeEach(() => {
    act(() => { useXxxStore.setState({ /* 초기값 */ }); });
    jest.clearAllMocks();
  });
  // 성공/실패/엣지케이스 테스트
});
```

훅이 **TanStack Query**(`useQuery`/`useMutation`)를 사용하는 경우:
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useXxx } from '@/hooks/useXxx';
jest.mock('@/lib/repositories/xxx.repository', () => ({ ... }));

const createTestQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });

describe('useXxx Hook', () => {
  let queryClient: QueryClient;
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  beforeEach(() => {
    queryClient = createTestQueryClient();
    jest.clearAllMocks();
  });
  // 성공/실패/엣지케이스 테스트
});
```

#### Store 테스트 (`store/`)
```typescript
import { act } from '@testing-library/react';
import { useXxxStore } from '@/store/xxxStore';

describe('xxxStore', () => {
  beforeEach(() => {
    act(() => { useXxxStore.setState(초기상태); });
  });
  // 각 액션별 테스트
});
```

#### 컴포넌트 테스트 (`components/`)
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Xxx } from '@/components/xxx/Xxx';

describe('Xxx 컴포넌트', () => {
  // 렌더링, 인터랙션, 접근성 테스트
});
```

### 4. 커버해야 할 케이스
- **Happy path**: 정상 동작
- **Error path**: 에러 발생 시 처리 (에러 토스트, 롤백 등)
- **Edge cases**: 빈 배열, null/undefined, 경계값
- **낙관적 업데이트**: add/remove 시 즉시 반영 + 실패 시 롤백

### 5. Mock 데이터
`__tests__/utils/factory.ts`의 `createMockLandmark`, `createMockAddress`를 우선 사용하세요.
부족하면 인라인으로 정의하되, 여러 테스트에서 재사용된다면 factory.ts에 추가하세요.

### 6. 최종 확인
테스트 파일 생성 후 반드시:
```bash
pnpm test -- [생성된파일경로] --no-coverage
```
를 실행해서 테스트가 통과하는지 확인하고, 실패하면 수정하세요.
(`--`는 pnpm이 이후 인자를 jest에 그대로 전달하도록 하는 구분자입니다.)
