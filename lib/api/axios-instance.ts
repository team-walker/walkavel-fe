import axios, { AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';

import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/authStore';

const DEFAULT_TIMEOUT = 10000;

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Supabase에서 최신 세션(토큰) 가져오기
    // getSession()은 만료된 경우 내부적으로 자동 리프레시를 시도합니다.
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // 401 에러는 세션이 완전히 만료되었거나 로그아웃된 상태를 의미합니다.
      // Supabase 로그아웃 처리 및 전역 상태 초기화
      await supabase.auth.signOut();
      useAuthStore.getState().clearAuth();

      if (typeof window !== 'undefined') {
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  },
);

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  return axiosInstance(config).then((response) => response.data);
};

export default axiosInstance;
