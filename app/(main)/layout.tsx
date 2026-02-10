'use client';

import BottomNav from '@/components/layout/BottomNav';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="h-dvh overflow-hidden bg-gray-100">
      <div className="relative mx-auto flex h-full max-w-120 flex-col bg-white shadow-lg">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:bg-white focus:p-4"
        >
          본문 바로가기
        </a>
        {children}
        <BottomNav />
      </div>
    </div>
  );
}
