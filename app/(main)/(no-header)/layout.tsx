'use client';

import PageTransition from '@/components/layout/PageTransition';

export default function NoHeaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      id="main-content"
      role="main"
      className="no-scrollbar flex-1 overflow-y-auto pb-[calc(88px+env(safe-area-inset-bottom))]"
    >
      <PageTransition>{children}</PageTransition>
    </main>
  );
}
