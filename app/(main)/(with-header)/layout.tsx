'use client';

import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';

export default function WithHeaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main
        id="main-content"
        role="main"
        className="no-scrollbar flex flex-1 flex-col overflow-y-auto pt-20 pb-[calc(88px+env(safe-area-inset-bottom))]"
      >
        <PageTransition>{children}</PageTransition>
      </main>
    </>
  );
}
