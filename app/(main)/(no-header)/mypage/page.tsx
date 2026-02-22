'use client';

import { motion } from 'framer-motion';
import { Star, Trophy } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useLoginLogic } from '@/hooks/useLoginLogic';
import { useStamp } from '@/hooks/useStamp';
import { supabase } from '@/lib/supabase/client';
import ChevronRightIcon from '@/public/images/chevron-right.svg';
import LogoutIcon from '@/public/images/logout.svg';
import ProfileIcon from '@/public/images/profile.svg';
import { useAuthStore } from '@/store/authStore';

export default function MyPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const { handleLogout } = useLoginLogic();
  const { summary, fetchStamps } = useStamp();

  const userMetadata = user?.user_metadata;
  const initialNickname = userMetadata?.full_name || userMetadata?.name || '사용자';
  const initialAvatar = userMetadata?.avatar_url || userMetadata?.picture || '';

  const [profile, setProfile] = useState<{ nickname: string; avatar_url: string }>({
    nickname: initialNickname,
    avatar_url: initialAvatar,
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchStamps();
  }, [fetchStamps]);

  useEffect(() => {
    if (!user) return;

    const fetchLatestProfile = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('nickname, avatar_url')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        const metadata = user.user_metadata;
        const nicknameFallback = metadata?.full_name || metadata?.name || '사용자';
        const avatarFallback = metadata?.avatar_url || metadata?.picture || '';

        const latestProfile = {
          nickname: data.nickname || nicknameFallback,
          avatar_url: data.avatar_url || avatarFallback,
        };
        setProfile(latestProfile);

        if (data.nickname !== metadata?.full_name || data.avatar_url !== metadata?.avatar_url) {
          const { data: authData } = await supabase.auth.updateUser({
            data: {
              nickname: data.nickname,
              full_name: data.nickname,
              avatar_url: data.avatar_url,
            },
          });
          if (authData?.user) setUser(authData.user);
        }
      }
    };

    fetchLatestProfile();
  }, [user, setUser]);

  const nickname = profile.nickname;
  const avatarUrl = profile.avatar_url;
  const email = user?.email || '';

  const allStamps = summary?.landmarks || [];
  const displayStamps = isExpanded ? allStamps : allStamps.slice(0, 9);
  const totalCollected = summary?.totalCount || 0;
  const hasMore = allStamps.length > 9;

  return (
    <div className="bg-walkavel-gray-50 w-full flex-1 overflow-y-auto pb-24">
      <div className="bg-white px-6 pt-12 pb-10">
        <h1 className="text-walkavel-gray-900 mb-6 text-[28px] font-bold tracking-tight">
          마이페이지
        </h1>

        <Button
          variant="ghost"
          onClick={() => router.push('/mypage/edit')}
          className="hover:bg-walkavel-gray-50 active:bg-walkavel-gray-100 -mx-2 mb-8 flex h-18 w-full cursor-pointer items-center space-x-3 rounded-2xl px-2 py-2 transition-colors"
        >
          <div className="from-brand-blue to-brand-blue-dark h-14 w-14 shrink-0 rounded-full bg-linear-to-b p-0.5 shadow-sm">
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                  width={52}
                  height={52}
                  priority
                />
              ) : (
                <ProfileIcon width={28} height={28} className="text-walkavel-gray-400" />
              )}
            </div>
          </div>
          <div className="min-w-0 flex-1 text-left">
            <h2 className="text-walkavel-gray-900 text-[18px] leading-tight font-bold">
              {nickname}
            </h2>
            <p className="text-walkavel-gray-500 mt-0.5 truncate text-[13px] font-medium">
              {email}
            </p>
          </div>
          <ChevronRightIcon width={20} height={20} className="text-walkavel-gray-400 shrink-0" />
        </Button>

        <div className="from-brand-blue to-brand-blue-dark relative mb-10 h-48.5 w-full overflow-hidden rounded-[24px] bg-linear-to-b shadow-xl">
          <div className="pointer-events-none absolute inset-0 opacity-12">
            <Trophy className="absolute top-4 right-8 -rotate-12 text-white/80" size={40} />
            <Star className="absolute top-16 right-16 rotate-12 text-white/60" size={32} />
            <Trophy className="absolute right-6 bottom-10 rotate-6 text-white/70" size={44} />
            <Star className="absolute top-12 left-24 -rotate-3 text-white/50" size={28} />
            <Star className="absolute bottom-6 left-12 rotate-6 text-white/90" size={36} />
          </div>

          <div className="absolute -top-4 -right-8 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-4 left-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />

          <div className="relative z-10 flex h-full flex-col justify-between p-8 text-white">
            <div className="flex items-center space-x-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                <Trophy size={14} className="text-white" />
              </div>
              <span className="text-[15px] font-medium text-white/90">지금까지 모은 스탬프</span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-baseline space-x-1">
                <span className="text-[64px] leading-tight font-bold tracking-[-1.38px]">
                  {totalCollected}
                </span>
                <span className="text-[22px] font-medium text-white/90">개</span>
              </div>
              <p className="text-[15px] font-normal tracking-[-0.23px] text-white/85">
                새로운 장소를 발견해보세요!
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-walkavel-gray-900 text-[18px] font-bold tracking-tight">
            최근 획득한 스탬프
          </h3>
          <div className="bg-brand-blue-light text-brand-blue flex h-8 items-center justify-center rounded-full px-3 py-1 text-[13px] font-bold">
            {totalCollected} / 784
          </div>
        </div>

        {displayStamps.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {displayStamps.map((stamp, index) => (
              <motion.div
                key={`${stamp.landmarkId}-${index}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(`/landmark/${stamp.landmarkId}`)}
                className="bg-walkavel-gray-100 aspect-square cursor-pointer overflow-hidden rounded-[18px] shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
              >
                {stamp.image ? (
                  <Image
                    src={stamp.image}
                    alt={stamp.title}
                    width={122}
                    height={122}
                    className="h-full w-full object-cover"
                    priority={index === 0}
                    unoptimized={stamp.image?.includes('visitkorea.or.kr')}
                  />
                ) : (
                  <div className="bg-walkavel-gray-200 flex h-full w-full items-center justify-center">
                    <Star className="text-walkavel-gray-400" size={24} />
                  </div>
                )}
              </motion.div>
            ))}
            {!isExpanded &&
              displayStamps.length < 9 &&
              Array.from({ length: 9 - displayStamps.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="border-walkavel-gray-100 bg-walkavel-gray-100/50 aspect-square rounded-[18px] border-2 border-dashed"
                />
              ))}
          </div>
        ) : (
          <div className="bg-walkavel-gray-50 flex flex-col items-center justify-center rounded-[24px] py-12 text-center">
            <Trophy className="text-walkavel-gray-300 mb-3" size={32} />
            <p className="text-walkavel-gray-500 text-[14px]">아직 획득한 스탬프가 없어요.</p>
          </div>
        )}

        {hasMore && (
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="border-walkavel-gray-200 text-walkavel-gray-900 hover:bg-walkavel-gray-50 mt-6 flex h-14.75 w-full cursor-pointer items-center justify-center rounded-3xl border-[1.5px] bg-white text-[16px] font-bold transition-all"
          >
            {isExpanded ? '접기' : '스탬프 전체보기'}
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronRightIcon
                className="text-walkavel-gray-400 ml-1 rotate-90"
                width={20}
                height={20}
              />
            </motion.div>
          </Button>
        )}
      </div>

      <div className="border-walkavel-gray-50 bg-walkavel-gray-50 h-2 border-y" />

      <div className="bg-white px-6 pt-8 pb-8">
        <h2 className="text-walkavel-gray-600 mb-4 text-[15px] font-bold tracking-tight">설정</h2>

        <Button
          variant="ghost"
          className="text-walkavel-gray-600 hover:bg-walkavel-gray-100 active:bg-walkavel-gray-200 flex h-13.5 w-full cursor-pointer items-center justify-center rounded-3xl px-5 py-4 text-[15px] font-medium transition-colors"
          onClick={handleLogout}
        >
          <LogoutIcon width={18} height={18} className="mr-2 opacity-70" />
          로그아웃
        </Button>

        <div className="mt-8 text-center">
          <p className="text-walkavel-gray-400 text-[13px]">
            버전 {process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'}
          </p>
        </div>
      </div>

      <div className="border-walkavel-gray-50 bg-walkavel-gray-50 h-2 border-t" />
    </div>
  );
}
