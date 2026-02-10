'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
    if (!user) {
      router.replace('/login?returnTo=/mypage/edit');
      return;
    }

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

      toast.error('이미지 업로드에 실패했습니다.', {
        description: '네트워크 연결을 확인하거나 나중에 다시 시도해주세요.',
        icon: <AlertCircle className="h-5 w-5 text-[#FF3B30]" />,
        className: 'bg-white border-2 border-[#F2F2F7] rounded-2xl p-4 shadow-lg',
      });
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

      toast.success('프로필이 성공적으로 저장되었습니다.', {
        icon: <CheckCircle2 className="h-5 w-5 text-[#34C759]" />,
        className: 'bg-white border-2 border-[#F2F2F7] rounded-2xl p-4 shadow-lg',
      });
      router.back();
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('저장에 실패했습니다.', {
        description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        icon: <AlertCircle className="h-5 w-5 text-[#FF3B30]" />,
        className: 'bg-white border-2 border-[#F2F2F7] rounded-2xl p-4 shadow-lg',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b-[0.5px] border-[#F3F4F6] bg-white px-6 pt-8 pb-3">
        <div className="flex h-10 items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="-ml-2 h-10 w-10 cursor-pointer rounded-2xl p-0 transition-colors hover:bg-gray-50 active:bg-gray-100"
          >
            <ArrowLeftIcon width={24} height={24} className="stroke-2 text-[#101828]" />
          </Button>
          <h1 className="text-[20px] font-bold tracking-tight text-[#101828]">프로필 수정</h1>
          <Button
            variant="ghost"
            onClick={form.handleSubmit(onSubmit)}
            disabled={loading || uploading || !form.formState.isDirty}
            className="h-9 min-w-13 rounded-[10px] px-3 text-[16px] font-bold text-[#3182F6] hover:bg-[#F8FAFF] active:bg-[#EBF3FF] disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : '완료'}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-y-auto pb-24">
          <div className="px-6 pt-8 pb-7">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-linear-to-b from-[#3182F6] to-[#1B64DA] p-0.75 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]">
                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt="Profile"
                        className="h-full w-full object-cover"
                        width={90}
                        height={90}
                        unoptimized={avatarUrl.startsWith('http') || avatarUrl.startsWith('blob:')}
                      />
                    ) : (
                      <ProfileIcon width={40} height={40} className="text-gray-300" />
                    )}
                  </div>
                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-white/40 backdrop-blur-[1px]">
                      <Loader2 className="h-6 w-6 animate-spin text-[#3182F6]" />
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={handleAvatarClick}
                  disabled={uploading}
                  className="absolute right-0 bottom-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#3182F6] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] transition-all hover:bg-[#1B64DA] active:scale-95 disabled:bg-gray-400"
                >
                  <CameraIcon width={18} height={18} className="text-white" />
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <p className="mt-5 text-[13px] tracking-tight text-[#6A7282]">
                프로필 이미지를 변경하려면 카메라 아이콘을 클릭하세요
              </p>
            </div>
          </div>

          <div className="mt-2 space-y-5 px-6">
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[14px] font-bold tracking-tight text-[#101828]">
                    닉네임
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="h-13 w-full border-none bg-[#F8F9FA] px-4 py-3.5 text-[16px] text-[#101828] transition-all placeholder:text-[#99A1AF] focus:bg-white focus:ring-2 focus:ring-[#3182F6] focus:outline-none"
                      style={{ borderRadius: '14px' }}
                      placeholder="닉네임을 입력하세요"
                      maxLength={20}
                    />
                  </FormControl>
                  <div className="flex justify-between px-1">
                    <FormMessage className="text-[12px] text-red-500" />
                    <p className="ml-auto text-[12px] tracking-tight text-[#99A1AF]">
                      {field.value.length} / 20
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label className="text-[14px] font-bold tracking-tight text-[#101828]">이메일</Label>
              <div
                className="flex h-13 w-full items-center bg-[#F9FAFB] px-4 text-[16px] tracking-tight text-[#6A7282]"
                style={{ borderRadius: '14px' }}
              >
                {user?.email || '이메일 정보 없음'}
              </div>
              <p className="px-1 text-[12px] tracking-tight text-[#99A1AF]">
                이메일은 변경할 수 없습니다
              </p>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
