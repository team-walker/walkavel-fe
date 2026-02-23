'use client';

import { ReactNode } from 'react';

interface GlobalLayoutProps {
  children: ReactNode;
}

export default function GlobalLayout({ children }: GlobalLayoutProps) {
  return (
    <div className="bg-walkavel-gray-100 flex min-h-dvh w-full justify-center overflow-hidden">
      <div className="relative flex h-dvh w-full max-w-120 flex-col bg-white shadow-xl">
        {children}
      </div>
    </div>
  );
}
