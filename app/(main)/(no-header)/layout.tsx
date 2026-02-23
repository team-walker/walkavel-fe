'use client';

import PageTransition from '@/components/layout/PageTransition';

export default function NoHeaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      id="main-content"
      role="main"
      className="no-scrollbar flex flex-1 flex-col overflow-y-auto"
    >
      <PageTransition>{children}</PageTransition>
    </main>
  );
}
