/**
 * @jest-environment node
 */
import {
  Headers as EdgeHeaders,
  Request as EdgeRequest,
  Response as EdgeResponse,
} from 'next/dist/compiled/@edge-runtime/primitives';

import { GET } from '@/app/(auth)/callback/route';
import { createClient } from '@/lib/supabase/server';

// Request/Response API Polyfill (Node 18+ 전역 API가 없는 환경 대응)
if (typeof global.Request === 'undefined') {
  global.Request = EdgeRequest as unknown as typeof Request;
  global.Response = EdgeResponse as unknown as typeof Response;
  global.Headers = EdgeHeaders as unknown as typeof Headers;
}

// 1. 모킹 설정
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}));

jest.mock('next/server', () => ({
  NextResponse: {
    redirect: jest.fn((url) => ({ url, status: 307 })),
  },
}));

describe('Auth Callback Route Handler', () => {
  const baseUrl = 'https://example.com';

  beforeEach(() => {
    jest.clearAllMocks();
    // 테스트 터미널 가독성을 위해 의도된 에러 로그 마스킹
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  // 시나리오 1: code 파라미터가 누락된 경우
  it('"code" 파라미터가 없으면 로그인 페이지로 리다이렉트해야 한다', async () => {
    const request = new Request(`${baseUrl}/callback?returnTo=/mypage`);
    const response = await GET(request);

    expect(response.url.toString()).toContain('/login?error=no_code');
    expect(createClient).not.toHaveBeenCalled();
  });

  // 시나리오 2: 인증 에러가 발생한 경우
  it('인증 실패 시 에러 상세 정보와 함께 로그인 페이지로 리다이렉트해야 한다', async () => {
    const mockExchange = jest.fn().mockResolvedValue({ error: { message: 'Invalid code' } });
    (createClient as jest.Mock).mockResolvedValue({
      auth: { exchangeCodeForSession: mockExchange },
    });

    const request = new Request(`${baseUrl}/callback?code=wrong-code`);
    const response = await GET(request);

    expect(response.url.toString()).toContain('error=auth_failed');
    expect(response.url.toString()).toContain('error_description=Invalid%20code');
  });

  // 시나리오 3: 예상치 못한 런타임 예외 발생 시
  it('예상치 못한 에러를 안전하게 처리하고 로그인 페이지로 리다이렉트해야 한다', async () => {
    (createClient as jest.Mock).mockRejectedValue(new Error('Database connection failed'));

    const request = new Request(`${baseUrl}/callback?code=valid-code`);
    const response = await GET(request);

    expect(response.url.toString()).toContain('/login?error=internal_error');
  });

  // 시나리오 4: Open Redirect 방어 및 보안 검증
  describe('오픈 리다이렉트 보호', () => {
    const testCases = [
      { input: 'https://malicious.com', expected: '/' },
      { input: '//evil.com', expected: '/' },
      { input: '/\\google.com', expected: '/' },
      { input: '/%0d%0a/evil.com', expected: '/' },
      { input: '/%invalid', expected: '/' }, // decodeURIComponent 에러 케이스 (Branch Coverage)
    ];

    testCases.forEach(({ input, expected }) => {
      it(`returnTo가 안전하지 않은 경우 루트로 리다이렉트해야 한다: ${input}`, async () => {
        const mockExchange = jest.fn().mockResolvedValue({ error: null });
        (createClient as jest.Mock).mockResolvedValue({
          auth: { exchangeCodeForSession: mockExchange },
        });

        const request = new Request(
          `${baseUrl}/callback?code=valid&returnTo=${encodeURIComponent(input)}`,
        );
        const response = await GET(request);

        const redirectUrl = new URL(response.url);
        expect(redirectUrl.pathname).toBe(expected);
      });
    });

    it('안전한 상대 경로는 허용해야 한다', async () => {
      const mockExchange = jest.fn().mockResolvedValue({ error: null });
      (createClient as jest.Mock).mockResolvedValue({
        auth: { exchangeCodeForSession: mockExchange },
      });

      const request = new Request(`${baseUrl}/callback?code=valid&returnTo=/bookmark`);
      const response = await GET(request);

      const redirectUrl = new URL(response.url);
      expect(redirectUrl.pathname).toBe('/bookmark');
    });
  });
});
