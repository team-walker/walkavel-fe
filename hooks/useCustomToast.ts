import { useCallback } from 'react';
import React from 'react';
import { toast } from 'sonner';

import { PushNotificationToast } from '@/components/common/CustomToast';

interface ToastOptions {
  title?: string;
  icon?: string;
  variant?: 'success' | 'error' | 'info';
}

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
