'use client';

import { toast } from 'sonner';

import Logo from '@/public/images/foot-logo.svg';

interface PushNotificationToastProps {
  t: string | number;
  description: string;
  icon?: string;
  variant?: 'success' | 'error' | 'info';
}

export const PushNotificationToast = ({
  t,
  description,
  variant = 'success',
}: PushNotificationToastProps) => {
  return (
    <div
      className="group relative mx-auto flex h-15 w-[calc(100vw-32px)] max-w-100 cursor-pointer items-center gap-3.5 overflow-hidden rounded-2xl border border-white/40 bg-white/95 px-4 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)] backdrop-blur-xl transition-all active:scale-[0.98] dark:border-zinc-800/50 dark:bg-zinc-900/90"
      onClick={() => toast.dismiss(t)}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          variant === 'error' ? 'bg-red-50' : 'bg-[#3182F6]/10'
        }`}
      >
        <Logo
          width={24}
          height={24}
          className={variant === 'error' ? 'text-red-500' : 'text-[#3182F6]'}
        />
      </div>

      <div className="flex flex-1 flex-col justify-center overflow-hidden">
        <p className="line-clamp-1 text-[14.5px] font-bold tracking-[-0.02em] text-[#1D293D] dark:text-zinc-200">
          {description}
        </p>
      </div>
    </div>
  );
};
