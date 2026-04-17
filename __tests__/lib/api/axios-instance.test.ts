import { axiosInstance } from '@/lib/api/axios-instance';
import { supabase } from '@/lib/supabase/client';

jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));

describe('AxiosInstance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (window.location as any).href = 'http://localhost/';
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('요청 인터셉터', () => {
    it('세션이 있으면 Authorization 헤더를 추가해야 한다', async () => {
      const mockSession = { access_token: 'fake-token' };
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: mockSession },
      });

      const config = { headers: {} } as any;
      const interceptedConfig = await (
        axiosInstance.interceptors.request as any
      ).handlers[0].fulfilled(config);

      expect(interceptedConfig.headers.Authorization).toBe('Bearer fake-token');
    });

    it('세션이 없으면 Authorization 헤더를 추가하지 않아야 한다', async () => {
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
      });

      const config = { headers: {} } as any;
      const interceptedConfig = await (
        axiosInstance.interceptors.request as any
      ).handlers[0].fulfilled(config);

      expect(interceptedConfig.headers.Authorization).toBeUndefined();
    });

    it('세션을 가져오는 데 실패하면 에러를 기록해야 한다', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (supabase.auth.getSession as jest.Mock).mockRejectedValue(new Error('Session Error'));

      const config = { headers: {} } as any;
      await (axiosInstance.interceptors.request as any).handlers[0].fulfilled(config);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to get session for axios request:',
        expect.any(Error),
      );
      consoleSpy.mockRestore();
    });
  });

  describe('응답 인터셉터', () => {
    it('401 에러는 Promise.reject로 반환되어야 한다', async () => {
      const error = {
        response: { status: 401 },
        isAxiosError: true,
      };

      let rejectedError;
      try {
        await (axiosInstance.interceptors.response as any).handlers[0].rejected(error);
      } catch (err) {
        rejectedError = err;
      }

      expect(rejectedError).toEqual(error);
    });

    it('일반 에러는 그대로 반환해야 한다', async () => {
      const error = {
        response: { status: 500 },
        isAxiosError: true,
      };

      let caughtError;
      try {
        await (axiosInstance.interceptors.response as any).handlers[0].rejected(error);
      } catch (_err) {
        caughtError = _err;
      }

      expect(caughtError).toEqual(error);
      expect(supabase.auth.signOut).not.toHaveBeenCalled();
    });
  });
});
