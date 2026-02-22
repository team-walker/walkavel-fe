'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { NAV_ITEMS } from '@/constants/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();

  return (
    <motion.nav
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 10, opacity: 0 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      aria-label="하단 네비게이션"
      className="fixed bottom-0 left-1/2 z-9999 w-full max-w-120 -translate-x-1/2 rounded-t-3xl border-x border-t border-gray-100 bg-white/80 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-4px_20px_0_rgba(0,0,0,0.05)] backdrop-blur-md will-change-transform sm:border-gray-50"
    >
      <div className="flex items-center justify-between px-10 max-sm:h-16 sm:h-22">
        {NAV_ITEMS.map(({ href, label, icon: IconComponent }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              onClick={(e) => {
                if ((href === '/bookmark' || href === '/mypage') && !user) {
                  e.preventDefault();
                  router.push(`/login?returnTo=${encodeURIComponent(href)}`);
                }
              }}
              className={cn(
                'flex w-16 flex-col items-center justify-center gap-1 transition-colors duration-200',
                isActive ? 'text-brand-blue' : 'text-walkavel-gray-400',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {IconComponent && <IconComponent className="h-6 w-6 transition-all duration-200" />}
              <span
                className={cn(
                  'text-[0.625rem] leading-3.75 tracking-wide transition-all duration-200',
                  isActive ? 'font-medium' : 'font-normal',
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
