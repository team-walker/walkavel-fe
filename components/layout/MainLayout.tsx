'use client';

import BottomNav from './BottomNav';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto flex min-h-screen max-w-[480px] flex-col bg-white shadow-lg">
      {/* 보이지 않지만 포커스 시 나타나는 바로가기 링크 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:p-4"
      >
        본문 바로가기
      </a>
      <main
        id="main-content"
        role="main"
        className="flex-1 px-4 pt-[env(safe-area-inset-top)] pb-[calc(60px+env(safe-area-inset-bottom))]"
      >
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
