'use client';

import { AlertCircle, RotateCcw } from 'lucide-react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

export default function LandmarkError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Landmark Detail Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center bg-white px-6 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
        <AlertCircle size={32} />
      </div>
      <h2 className="text-walkavel-gray-900 mb-2 text-xl font-bold break-keep">
        도착 정보를 불러오지 못했어요
      </h2>
      <p className="text-walkavel-gray-500 mb-8 text-sm break-keep">
        네트워크 연결 상태를 확인하거나
        <br />
        잠시 후 다시 시도해 주세요.
      </p>
      <Button
        onClick={() => reset()}
        className="bg-brand-blue hover:bg-brand-blue-dark flex h-12 w-full max-w-50 items-center justify-center space-x-2 rounded-xl font-semibold text-white transition-opacity active:opacity-80"
      >
        <RotateCcw size={18} />
        <span>다시 시도하기</span>
      </Button>
    </div>
  );
}
