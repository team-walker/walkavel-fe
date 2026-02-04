'use client';

import { motion } from 'framer-motion';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} // 시작 상태 (살짝 아래에서 투명하게)
      animate={{ opacity: 1, y: 0 }} // 도착 상태 (제자리로 오면서 선명하게)
      exit={{ opacity: 0, y: -10 }} // 나갈 때 상태 (선택 사항)
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1], // 부드러운 Apple 스타일 가속도
      }}
    >
      {children}
    </motion.div>
  );
}
