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
    <nav
      aria-label="하단 네비게이션"
      className="border-walkavel-gray-100 fixed bottom-0 left-1/2 z-50 w-full max-w-120 -translate-x-1/2 border-t-[0.5px] bg-white pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="flex h-22 items-center justify-between px-5">
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
                'relative flex flex-1 flex-col items-center justify-center py-1 transition-colors duration-200',
                isActive ? 'text-brand-blue' : 'text-walkavel-gray-400 hover:text-brand-blue/50',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <motion.div
                className="relative flex flex-col items-center"
                initial={false}
                animate={{
                  scale: isActive ? 1.05 : 1,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <div className="z-10">
                  {IconComponent && (
                    <IconComponent
                      width={24}
                      height={24}
                      className="h-6 w-6 transition-all duration-200"
                    />
                  )}
                </div>
                <span
                  className={cn(
                    'mt-1 text-[10px] transition-all duration-200',
                    isActive ? 'font-semibold' : 'font-normal',
                  )}
                >
                  {label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
