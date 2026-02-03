'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `flex flex-1 flex-col items-center py-2 transition-colors ${
      isActive ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-blue-500'
    }`;
  };

  return (
    <nav
      aria-label="하단 네비게이션"
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t bg-white/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-md"
    >
      <div className="flex h-[60px] items-center justify-around px-2">
        <Link
          href="/"
          className={getLinkClass('/')}
          aria-current={pathname === '/' ? 'page' : undefined}
        >
          <span className="text-[10px] font-medium">홈</span>
        </Link>
        <Link
          href="/bookmark"
          className={getLinkClass('/bookmark')}
          aria-current={pathname === '/bookmark' ? 'page' : undefined}
        >
          <span className="text-[10px] font-medium">북마크</span>
        </Link>
        <Link
          href="/profile"
          className={getLinkClass('/profile')}
          aria-current={pathname === '/profile' ? 'page' : undefined}
        >
          <span className="text-[10px] font-medium">마이페이지</span>
        </Link>
      </div>
    </nav>
  );
}
