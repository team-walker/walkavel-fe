'use client';

import BottomNav from '@/components/layout/BottomNav';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';

interface MainLayoutProps {
  children: React.ReactNode;
  hidePadding?: boolean;
  scrollable?: boolean;
}

export default function MainLayout({
  children,
  hidePadding = false,
  scrollable = true,
}: MainLayoutProps) {
  return (
    <div className="h-dvh overflow-hidden bg-gray-100">
      <div className="relative mx-auto flex h-full max-w-[480px] flex-col bg-white shadow-lg">
        {/* 웹 접근성을 위한 본문 바로가기(Skip Navigation) 링크 추가 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:p-4"
        >
          본문 바로가기
        </a>
        <Header />
        <main
          id="main-content"
          role="main"
          className={`no-scrollbar flex-1 ${scrollable ? 'overflow-y-auto' : 'overflow-hidden'} ${hidePadding ? '' : 'px-6'} pb-[calc(88px+env(safe-area-inset-bottom))]`}
        >
          <PageTransition>{children}</PageTransition>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
