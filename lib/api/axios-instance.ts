import axios, { AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';

import { supabase } from '@/lib/supabase/client';

const DEFAULT_TIMEOUT = 10000;

export const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3001'
      : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (error) {
      console.error('Failed to get session for axios request:', error);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.error('Authentication required. Session may have expired.');

      // 클라이언트 측에서 세션 만료 시 로그아웃 처리 및 리다이렉트
      if (typeof window !== 'undefined') {
        const { supabase } = await import('@/lib/supabase/client');
        await supabase.auth.signOut();
        window.location.href = `/login?returnTo=${encodeURIComponent(window.location.pathname)}&expired=true`;
      }
    }
    return Promise.reject(error);
  },
);

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  return axiosInstance(config).then((response) => response.data);
};

export default axiosInstance;
