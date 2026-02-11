'use client';

import Logo from '@/public/images/foot-logo.svg';

export default function Header() {
  return (
    <header className="fixed top-0 left-1/2 z-50 flex w-full max-w-120 -translate-x-1/2 flex-col border-b-[0.5px] border-[#F3F4F6]/50 bg-white/90 backdrop-blur-xl">
      <div className="h-[env(safe-area-inset-top)] w-full" />

      <div className="flex h-16 items-center gap-2 px-5 sm:h-20">
        <div className="flex h-7.5 w-7.5 items-center justify-center rounded-[10px] bg-[#3182F6]/10">
          <Logo width={18} height={18} className="text-[#3182F6]" />
        </div>
        <h1 className="text-[18px] font-bold tracking-tight text-[#1D293D]">Walkavel</h1>
      </div>
    </header>
  );
}
