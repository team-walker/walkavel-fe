'use client';

import BottomNav from './BottomNav';
import PageTransition from './PageTransition';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative mx-auto flex min-h-screen max-w-[480px] flex-col bg-white shadow-lg">
        {/* 웹 접근성을 위한 본문 바로가기(Skip Navigation) 링크 추가 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:p-4"
        >
          본문 바로가기
        </a>
        <main
          id="main-content"
          role="main"
          className="flex-1 px-4 pt-[env(safe-area-inset-top)] pb-[calc(88px+env(safe-area-inset-bottom))]"
        >
          <PageTransition>{children}</PageTransition>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
