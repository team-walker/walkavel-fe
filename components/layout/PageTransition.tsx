'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.25,
          ease: [0.33, 1, 0.68, 1],
        }}
        className="flex h-full w-full flex-col will-change-[opacity]"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
