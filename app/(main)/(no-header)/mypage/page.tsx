'use client';

import { motion } from 'framer-motion';
import { Star, Trophy } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useLoginLogic } from '@/hooks/useLoginLogic';
import { supabase } from '@/lib/supabase/client';
import ChevronRightIcon from '@/public/images/chevron-right.svg';
import LogoutIcon from '@/public/images/logout.svg';
import ProfileIcon from '@/public/images/profile.svg';
import { useAuthStore } from '@/store/authStore';
import { useStampStore } from '@/store/stampStore';

export default function MyPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const { handleLogout } = useLoginLogic();
  const { summary, fetchStamps } = useStampStore();

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

  // 최근 획득한 스탬프 (기본 9개, 펼치면 전체)
  const allStamps = summary?.landmarks || [];
  const displayStamps = isExpanded ? allStamps : allStamps.slice(0, 9);
  const totalCollected = summary?.totalCount || 0;
  const hasMore = allStamps.length > 9;

  return (
    <div className="w-full flex-1 overflow-y-auto bg-[#FAFBFC] pb-24">
      {/* 상단 프로필 및 스탬프 활동 영역 (통합 블록) */}
      <div className="bg-white px-6 pt-12 pb-10">
        <h1 className="mb-6 text-[28px] font-bold tracking-tight text-[#101828]">마이페이지</h1>

        {/* 유저 프로필 카드 */}
        <Button
          variant="ghost"
          onClick={() => router.push('/mypage/edit')}
          className="-mx-2 mb-8 flex h-18 w-full cursor-pointer items-center space-x-3 rounded-2xl px-2 py-2 transition-colors hover:bg-gray-50 active:bg-gray-100"
        >
          <div className="h-14 w-14 shrink-0 rounded-full bg-linear-to-b from-[#3182F6] to-[#1B64DA] p-0.5 shadow-sm">
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                  width={52}
                  height={52}
                />
              ) : (
                <ProfileIcon width={28} height={28} className="text-gray-400" />
              )}
            </div>
          </div>
          <div className="min-w-0 flex-1 text-left">
            <h2 className="text-[18px] leading-tight font-bold text-[#101828]">{nickname}</h2>
            <p className="mt-0.5 truncate text-[13px] font-medium text-[#6a7282]">{email}</p>
          </div>
          <ChevronRightIcon width={20} height={20} className="shrink-0 text-gray-400" />
        </Button>

        {/* 스탬프 요약 카드 */}
        <div className="relative mb-10 h-48.5 w-full overflow-hidden rounded-[24px] bg-linear-to-b from-[#3182F6] to-[#1B64DA] shadow-[0_10px_15px_-3px_rgba(49,130,246,0.2)]">
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

        {/* 최근 획득한 스탬프 그리드 */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[18px] font-bold tracking-tight text-[#101828]">
            최근 획득한 스탬프
          </h3>
          <div className="flex h-8 items-center justify-center rounded-full bg-[#EBF3FF] px-3 py-1 text-[13px] font-bold text-[#3182F6]">
            {totalCollected} / 784
          </div>
        </div>

        {displayStamps.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {displayStamps.map((stamp) => (
              <motion.div
                key={stamp.contentid}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(`/landmark/${stamp.contentid}`)}
                className="aspect-square cursor-pointer overflow-hidden rounded-[18px] bg-[#f3f4f6] shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
              >
                {stamp.firstimage ? (
                  <Image
                    src={stamp.firstimage}
                    alt={stamp.title}
                    width={122}
                    height={122}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200">
                    <Star className="text-gray-400" size={24} />
                  </div>
                )}
              </motion.div>
            ))}
            {!isExpanded &&
              displayStamps.length < 9 &&
              Array.from({ length: 9 - displayStamps.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="aspect-square rounded-[18px] border-2 border-dashed border-gray-100 bg-[#f3f4f6]/50"
                />
              ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[24px] bg-gray-50 py-12 text-center">
            <Trophy className="mb-3 text-gray-300" size={32} />
            <p className="text-[14px] text-gray-500">아직 획득한 스탬프가 없어요.</p>
          </div>
        )}

        {hasMore && (
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-6 flex h-14.75 w-full cursor-pointer items-center justify-center rounded-3xl border-[1.5px] border-[#e5e7eb] bg-white text-[16px] font-bold text-[#101828] transition-all hover:bg-gray-50"
          >
            {isExpanded ? '접기' : '스탬프 전체보기'}
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronRightIcon className="ml-1 rotate-90 text-gray-400" width={20} height={20} />
            </motion.div>
          </Button>
        )}
      </div>

      {/* 회색 분리 영역 1 (스탬프와 설정 사이) */}
      <div className="h-2 border-y border-gray-50 bg-[#FAFBFC]" />

      {/* 설정 영역 */}
      <div className="bg-white px-6 pt-8 pb-8">
        <h2 className="mb-4 text-[15px] font-bold tracking-tight text-[#6a7282]">설정</h2>

        <Button
          variant="ghost"
          className="flex h-13.5 w-full cursor-pointer items-center justify-center rounded-3xl px-5 py-4 text-[15px] font-medium text-[#6a7282] transition-colors hover:bg-gray-100 active:bg-gray-200"
          onClick={handleLogout}
        >
          <LogoutIcon width={18} height={18} className="mr-2 opacity-70" />
          로그아웃
        </Button>

        <div className="mt-8 text-center">
          <p className="text-[13px] text-[#99a1af]">
            버전 {process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'}
          </p>
        </div>
      </div>

      {/* 회색 분리 영역 2 (설정 영역 하단) */}
      <div className="h-2 border-t border-gray-50 bg-[#FAFBFC]" />
    </div>
  );
}
