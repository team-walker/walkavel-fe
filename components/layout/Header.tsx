'use client';

import Logo from '@/public/images/logo.svg';

export default function Header() {
  return (
    <header className="w-full border-b border-gray-100 bg-white pt-[env(safe-area-inset-top)]">
      <div className="flex h-20 items-center gap-3 px-4 py-4">
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-blue-500/10">
          <Logo width={30} height={30} className="h-full w-full" />
        </div>
        <h1 className="font-outfit text-2xl font-bold tracking-tight text-slate-900">walkavel</h1>
      </div>
    </header>
  );
}
