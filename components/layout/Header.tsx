'use client';

import { motion } from 'framer-motion';

import Logo from '@/public/images/foot-logo.svg';

export default function Header() {
  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      className="fixed top-0 left-1/2 z-50 flex w-full max-w-120 -translate-x-1/2 flex-col border-b border-gray-100/50 bg-white/80 pt-[env(safe-area-inset-top,0px)] backdrop-blur-md will-change-transform sm:border-x"
    >
      <div className="flex items-center gap-2 px-5 max-sm:h-16 sm:h-22">
        <div className="bg-brand-blue/10 flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg">
          <Logo width={18} height={18} className="text-brand-blue" />
        </div>
        <h1 className="truncate text-lg leading-7 font-bold tracking-tighter text-slate-800">
          Walkavel
        </h1>
      </div>
    </motion.header>
  );
}
