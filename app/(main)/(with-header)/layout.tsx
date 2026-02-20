'use client';

import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';

export default function WithHeaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-white">
      <Header />
      <main
        id="main-content"
        role="main"
        className="no-scrollbar flex flex-1 flex-col pt-[calc(4rem+env(safe-area-inset-top,0px))] pb-[calc(88px+env(safe-area-inset-bottom,0px))] sm:pt-[calc(5rem+env(safe-area-inset-top,0px))]"
      >
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
