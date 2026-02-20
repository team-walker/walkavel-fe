import { toast } from 'sonner';

import { PushNotificationToast } from '@/components/common/CustomToast';

interface ToastOptions {
  title?: string;
  icon?: string;
  variant?: 'success' | 'error' | 'info';
}

const showCustomToast = (message: string, options?: ToastOptions) => {
  const { variant = 'success' } = options || {};

  toast.custom((t) => <PushNotificationToast t={t} description={message} variant={variant} />);
};

export const showSuccessToast = (message: string, options?: ToastOptions) =>
  showCustomToast(message, { ...options, variant: 'success' });

export const showErrorToast = (message: string, options?: ToastOptions) =>
  showCustomToast(message, { ...options, variant: 'error' });

export const showInfoToast = (message: string, options?: ToastOptions) =>
  showCustomToast(message, { ...options, variant: 'info' });
