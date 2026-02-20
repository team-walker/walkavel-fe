'use client';

import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global Application Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center p-6 text-center">
      <h2 className="text-walkavel-gray-900 mb-4 text-2xl font-bold">
        알 수 없는 오류가 발생했습니다
      </h2>
      <p className="text-walkavel-gray-500 mb-8">
        앱을 이용하는 중에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} className="bg-brand-blue font-bold">
          다시 시도
        </Button>
        <Button variant="outline" onClick={() => (location.href = '/')}>
          홈으로 이동
        </Button>
      </div>
    </div>
  );
}
