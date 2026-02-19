'use client';

import Logo from '@/public/images/foot-logo.svg';

export default function Header() {
  return (
    <header className="border-walkavel-gray-100/50 fixed top-0 left-1/2 z-50 flex w-full max-w-120 -translate-x-1/2 flex-col border-b-[0.5px] bg-white/90 pt-[env(safe-area-inset-top,0px)] backdrop-blur-xl">
      <div className="flex h-16 items-center gap-2 px-5 sm:h-20">
        <div className="bg-brand-blue/10 flex h-7.5 w-7.5 items-center justify-center rounded-[10px]">
          <Logo width={18} height={18} className="text-brand-blue" />
        </div>
        <h1 className="text-walkavel-gray-900 text-[18px] font-bold tracking-tight">Walkavel</h1>
      </div>
    </header>
  );
}
