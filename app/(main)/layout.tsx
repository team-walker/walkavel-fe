'use client';

import { AnimatePresence } from 'framer-motion';

import BottomNav from '@/components/layout/BottomNav';
import { useSplashStore } from '@/store/splash';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { isVisible } = useSplashStore();

  return (
    <div className="flex flex-1 flex-col overflow-hidden max-sm:pb-[calc(4rem+env(safe-area-inset-bottom,0px))] sm:pb-22">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:bg-white focus:p-4"
      >
        본문 바로가기
      </a>
      {children}
      <AnimatePresence>{!isVisible && <BottomNav />}</AnimatePresence>
    </div>
  );
}
