'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import SplashScreen from '@/components/common/SplashScreen';
import AddressSearch from '@/components/home/AddressSearch';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import BookmarkIcon from '@/public/icons/bookmark.svg';
import { useSplashStore } from '@/store/splash';
import { AddressResult } from '@/types/address';

const CardSection = ({ onComplete }: { onComplete: () => void }) => (
  <div className="flex h-full flex-col py-4">
    <Card className="relative flex h-full w-full flex-col overflow-hidden rounded-[32px] border-none shadow-none">
      <Image
        src="http://tong.visitkorea.or.kr/cms/resource/61/3077661_image2_1.JPG"
        alt="Event cover"
        fill
        className="object-cover"
        priority
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />

      {/* Heart Icon placeholder */}
      <div className="absolute top-6 right-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
          <BookmarkIcon className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Bottom Content */}
      <div className="relative z-10 mt-auto p-8 text-white">
        <h2 className="mb-2 text-3xl font-bold">경복궁</h2>
        <div className="mb-4 flex items-center gap-2 text-white/80">
          <span className="text-sm">서울 종로구</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className="rounded-full border-none bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md hover:bg-white/30">
            #역사
          </Badge>
          <Badge className="rounded-full border-none bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md hover:bg-white/30">
            #한복체험
          </Badge>
          <Badge className="rounded-full border-none bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md hover:bg-white/30">
            #고궁
          </Badge>
        </div>
      </div>
    </Card>
  </div>
);

const FinishSection = ({
  onReset,
  onReselect,
}: {
  onReset: () => void;
  onReselect: () => void;
}) => (
  <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
    <h2 className="text-2xl font-bold">탐색을 마쳤어요!</h2>
    <div className="flex w-full max-w-xs flex-col gap-2">
      <button onClick={onReset} className="rounded-xl bg-zinc-900 px-6 py-3 font-bold text-white">
        이 지역 다시 찾아보기
      </button>
      <button
        onClick={onReselect}
        className="rounded-xl bg-zinc-100 px-6 py-3 font-bold text-zinc-900"
      >
        다른 지역 선택하기
      </button>
    </div>
  </div>
);

type STEP = 'SEARCH' | 'SWIPE' | 'FINISH';

export default function RootPage() {
  const { isVisible, hideSplash } = useSplashStore();
  const [isAppReady, setIsAppReady] = useState(false);
  const [step, setStep] = useState<STEP>('SEARCH');
  const [selectedAddress, setSelectedAddress] = useState<AddressResult | null>(null);

  useEffect(() => {
    // 스플래시가 이미 보였다면(false) 앱이 준비된 것으로 간주
    if (!isVisible) {
      setTimeout(() => {
        setIsAppReady(true);
      }, 0);
      return;
    }

    // 초기화 로직
    const initApp = async () => {
      // 시뮬레이션을 위해 약간의 지연 추가
      await new Promise((resolve) => setTimeout(resolve, 100));
      setIsAppReady(true);
    };
    initApp();
  }, [isVisible]);

  const handleAddressSelect = (address: AddressResult) => {
    setSelectedAddress(address);
    setStep('SWIPE');
  };

  return (
    <>
      {isVisible && <SplashScreen isAppReady={isAppReady} onComplete={hideSplash} />}
      {step === 'SEARCH' && <AddressSearch onSelectAddress={handleAddressSelect} />}
      {step === 'SWIPE' && <CardSection onComplete={() => setStep('FINISH')} />}
      {step === 'FINISH' && (
        <FinishSection onReset={() => setStep('SEARCH')} onReselect={() => setStep('SEARCH')} />
      )}
    </>
  );
}
