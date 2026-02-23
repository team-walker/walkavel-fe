'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { useLoginLogic } from '@/hooks/useLoginLogic';
import FootLogoIcon from '@/public/images/foot-logo.svg';
import GoogleIcon from '@/public/images/google.svg';
import KakaoIcon from '@/public/images/kakao.svg';
import { useAuthStore } from '@/store/authStore';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';

  const urlError = searchParams.get('error');
  const urlErrorDescription = searchParams.get('error_description');

  const { user, isInitialized, setReturnTo } = useAuthStore();
  const { handleOAuthLogin, loading, error: loginError } = useLoginLogic();

  const displayError =
    urlError === 'auth_failed' ? urlErrorDescription || '로그인에 실패했습니다.' : loginError;

  useEffect(() => {
    if (isInitialized && user) {
      router.replace(returnTo);
    }
  }, [isInitialized, user, router, returnTo]);

  useEffect(() => {
    if (returnTo) {
      setReturnTo(returnTo);
    }
  }, [returnTo, setReturnTo]);

  const handleGuestContinue = () => {
    const protectedPaths = ['/bookmark', '/mypage'];
    const target = protectedPaths.some((path) => returnTo.startsWith(path)) ? '/' : returnTo;
    router.replace(target);
  };

  return (
    <div className="text-walkavel-gray-900 flex flex-1 flex-col items-center justify-center bg-white">
      <div className="mx-auto flex w-full max-w-96 flex-col items-center px-7">
        <div className="bg-brand-blue shadow-brand-blue/15 mb-14 flex h-25 w-25 items-center justify-center rounded-4xl shadow-xl">
          <FootLogoIcon className="h-12 w-12 text-white" />
        </div>

        <div className="mb-4 text-center">
          <h1 className="text-walkavel-gray-900 text-3xl leading-tight font-bold tracking-tight">
            걷고 싶은 장소,
            <br />
            카드로 발견하세요
          </h1>
        </div>

        <p className="text-walkavel-gray-600 mb-12 text-center text-base font-medium">
          마음에 드는 곳은 북마크로 저장할 수 있어요
        </p>

        {displayError && (
          <div className="mb-4 w-full rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
            {displayError}
          </div>
        )}

        <div className="flex w-full flex-col gap-3">
          <Button
            onClick={() => handleOAuthLogin('google')}
            disabled={loading}
            className="border-walkavel-gray-200 text-walkavel-gray-900 hover:bg-walkavel-gray-50 flex h-14 w-full cursor-pointer items-center justify-center gap-2.5 rounded-3xl border bg-white text-base font-semibold shadow-none active:scale-[0.98] disabled:opacity-50"
          >
            <GoogleIcon className="pointer-events-none h-5 w-5" />
            Google로 시작하기
          </Button>

          <Button
            onClick={() => handleOAuthLogin('kakao')}
            disabled={loading}
            className="flex h-14 w-full cursor-pointer items-center justify-center gap-2.5 rounded-3xl bg-[#FEE500] text-base font-semibold text-[#181600] shadow-none hover:bg-[#FDD000] active:scale-[0.98] disabled:opacity-50"
          >
            <KakaoIcon className="pointer-events-none h-5 w-5" />
            카카오로 시작하기
          </Button>
        </div>

        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={handleGuestContinue}
            className="text-walkavel-gray-400 hover:text-walkavel-gray-500 h-auto p-0 text-sm font-medium underline underline-offset-4 hover:bg-transparent"
          >
            로그인 없이 둘러보기
          </Button>
        </div>

        <div className="text-walkavel-gray-300 mt-14 text-center text-xs leading-relaxed">
          로그인하면{' '}
          <a href="/terms" className="underline underline-offset-2 hover:text-[#9CA3AF]">
            서비스 약관
          </a>
          과{' '}
          <a href="/privacy" className="underline underline-offset-2 hover:text-[#9CA3AF]">
            개인정보 처리방침
          </a>
          에
          <br />
          동의하는 것으로 간주돼요
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-dvh items-center justify-center bg-white" />}>
      <LoginContent />
    </Suspense>
  );
}
