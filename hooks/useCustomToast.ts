import { useCallback } from 'react';
import React from 'react';
import { toast } from 'sonner';

import { PushNotificationToast } from '@/components/common/CustomToast';

interface ToastOptions {
  title?: string;
  icon?: string;
  variant?: 'success' | 'error' | 'info';
}

/**
 * 선언적인 토스트 호출을 위한 커스텀 훅입니다.
 * UI 컴포넌트와의 결합도가 높은 로직을 hooks 레이어로 이동시켰습니다.
 */
export const useCustomToast = () => {
  const showCustomToast = useCallback((message: string, options?: ToastOptions) => {
    const { variant = 'success' } = options || {};
    toast.custom((t) =>
      React.createElement(PushNotificationToast, { t, description: message, variant }),
    );
  }, []);

  const success = useCallback(
    (message: string, options?: ToastOptions) =>
      showCustomToast(message, { ...options, variant: 'success' }),
    [showCustomToast],
  );

  const error = useCallback(
    (message: string, options?: ToastOptions) =>
      showCustomToast(message, { ...options, variant: 'error' }),
    [showCustomToast],
  );

  const info = useCallback(
    (message: string, options?: ToastOptions) =>
      showCustomToast(message, { ...options, variant: 'info' }),
    [showCustomToast],
  );

  return { success, error, info };
};
