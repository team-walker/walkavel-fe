'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase/client';
import { showErrorToast, showSuccessToast } from '@/lib/utils/toast';
import ArrowLeftIcon from '@/public/images/arrow-left.svg';
import CameraIcon from '@/public/images/camera.svg';
import ProfileIcon from '@/public/images/profile.svg';
import { useAuthStore } from '@/store/authStore';

const profileSchema = z.object({
  nickname: z
    .string()
    .min(2, '닉네임은 2자 이상이어야 합니다.')
    .max(20, '닉네임은 20자 이하이어야 합니다.'),
  avatar_url: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nickname: '',
      avatar_url: '',
    },
  });

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (previewUrlRef.current && avatarUrl !== previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  }, [avatarUrl]);

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('nickname, avatar_url')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        const initialNickname =
          data?.nickname || user.user_metadata?.full_name || user.user_metadata?.name || '';
        const initialAvatar =
          data?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture || '';

        form.reset({
          nickname: initialNickname,
          avatar_url: initialAvatar,
        });
        setAvatarUrl(initialAvatar);
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();
  }, [user, router, form]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    const objectUrl = URL.createObjectURL(file);
    previewUrlRef.current = objectUrl;
    setAvatarUrl(objectUrl);

    try {
      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      setAvatarUrl(publicUrl);
      form.setValue('avatar_url', publicUrl, { shouldDirty: true, shouldValidate: true });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      const fallbackAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || '';
      setAvatarUrl(fallbackAvatar);

      showErrorToast(
        '이미지 업로드에 실패했습니다. 네트워크 연결을 확인하거나 나중에 다시 시도해주세요.',
      );
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;

    try {
      setLoading(true);

      const { error: updateError } = await supabase
        .from('users')
        .update({
          nickname: values.nickname,
          avatar_url: values.avatar_url,
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Users table update error:', updateError);
        throw new Error(`프로필 저장 실패: ${updateError.message}`);
      }

      const { data: authData, error: authError } = await supabase.auth.updateUser({
        data: {
          nickname: values.nickname,
          full_name: values.nickname,
          avatar_url: values.avatar_url,
        },
      });

      if (authError) {
        console.error('Auth metadata update error:', authError);
      }

      if (authData?.user) {
        setUser(authData.user);
      }

      showSuccessToast('프로필이 성공적으로 저장되었습니다.');

      router.back();
    } catch (error) {
      console.error('Profile update error:', error);
      showErrorToast('저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-white">
      <div className="border-walkavel-gray-100 sticky top-0 z-50 border-b bg-white/95 px-4 pt-[env(safe-area-inset-top,0px)] backdrop-blur-sm sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-walkavel-gray-50 active:bg-walkavel-gray-100 -ml-2 h-11 w-11 cursor-pointer rounded-2xl p-0 transition-colors"
            aria-label="뒤로 가기"
          >
            <ArrowLeftIcon width={24} height={24} className="text-walkavel-gray-900 stroke-2" />
          </Button>
          <h1 className="text-walkavel-gray-900 truncate text-lg font-bold tracking-tight">
            프로필 수정
          </h1>
          <Button
            variant="ghost"
            onClick={form.handleSubmit(onSubmit)}
            disabled={loading || uploading || !form.formState.isDirty}
            className="text-brand-blue active:bg-brand-blue-light hover:bg-brand-blue-light h-11 min-w-14 rounded-xl px-2 text-sm font-bold transition-colors disabled:opacity-50 sm:px-3 sm:text-base"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : '완료'}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 pb-24">
          <div className="px-5 pt-7 pb-6 sm:px-6 sm:pt-8 sm:pb-7">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="from-brand-blue to-brand-blue-dark h-24 w-24 rounded-full bg-linear-to-b p-1 shadow-lg sm:h-28 sm:w-28">
                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt="Profile"
                        className="h-full w-full object-cover"
                        width={112}
                        height={112}
                        unoptimized={avatarUrl.startsWith('http') || avatarUrl.startsWith('blob:')}
                      />
                    ) : (
                      <ProfileIcon
                        width={48}
                        height={48}
                        className="text-walkavel-gray-300 sm:h-14 sm:w-14"
                      />
                    )}
                  </div>
                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-white/40 backdrop-blur-sm">
                      <Loader2 className="text-brand-blue h-7 w-7 animate-spin" />
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={handleAvatarClick}
                  disabled={uploading}
                  className="bg-brand-blue hover:bg-brand-blue-dark disabled:bg-walkavel-gray-400 absolute right-0 bottom-0 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full shadow-lg transition-all active:scale-95 sm:h-12 sm:w-12"
                  aria-label="프로필 이미지 변경"
                >
                  <CameraIcon width={22} height={22} className="text-white sm:h-6 sm:w-6" />
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <p className="text-walkavel-gray-600 mt-5 text-xs tracking-tight sm:text-sm">
                프로필 이미지를 변경하려면 카메라 아이콘을 클릭하세요
              </p>
            </div>
          </div>

          <div className="mt-2 space-y-6 px-5 sm:space-y-7 sm:px-6">
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-walkavel-gray-900 text-sm font-bold tracking-tight sm:text-base">
                    닉네임
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-walkavel-gray-50 text-walkavel-gray-900 placeholder:text-walkavel-gray-400 focus:ring-brand-blue flex h-14 w-full items-center rounded-2xl border-none px-4 py-3 text-base transition-all focus:bg-white focus:ring-2 focus:outline-none sm:h-15 sm:text-lg md:text-base"
                      placeholder="닉네임을 입력하세요"
                      maxLength={20}
                    />
                  </FormControl>
                  <div className="flex justify-between px-1">
                    <FormMessage className="text-xs text-red-500" />
                    <p className="text-walkavel-gray-400 ml-auto text-xs tracking-tight">
                      {field.value.length} / 20
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label className="text-walkavel-gray-900 text-sm font-bold tracking-tight sm:text-base">
                이메일
              </Label>
              <div className="bg-walkavel-gray-50 flex h-14 w-full items-center rounded-2xl px-4 text-base text-slate-500 sm:h-15 sm:text-lg">
                {user?.email || '이메일 정보 없음'}
              </div>
              <p className="px-1 text-xs tracking-tight text-slate-400">
                이메일은 변경할 수 없습니다
              </p>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
