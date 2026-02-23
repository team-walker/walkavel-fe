'use client';

import { AnimatePresence } from 'framer-motion';

import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import { useSplashStore } from '@/store/splash';

export default function WithHeaderLayout({ children }: { children: React.ReactNode }) {
  const { isVisible } = useSplashStore();

  return (
    <div className="relative flex flex-1 flex-col bg-white">
      <AnimatePresence>{!isVisible && <Header />}</AnimatePresence>
      <main
        id="main-content"
        role="main"
        className="no-scrollbar flex flex-1 flex-col overflow-y-auto max-sm:pt-16 sm:pt-22"
      >
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
