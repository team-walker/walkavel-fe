'use client';

import { User } from '@supabase/supabase-js';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase/client';

export default function MyPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [nickname, setNickname] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace('/auth/login');
        return;
      }
      const currentUser = data.session.user;
      setUser(currentUser);
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (profile) {
        setNickname(profile.nickname || '');
        setAvatarUrl(profile.avatar_url || '');
      }
    };
    load();
  }, [router]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      setLoading(true);
      let newAvatar = avatarUrl;
      if (file) {
        const path = `${user.id}/avatar_${Date.now()}.png`;
        const { error } = await supabase.storage
          .from('avatars')
          .upload(path, file, { upsert: true });
        if (error) throw error;
        const { data } = supabase.storage.from('avatars').getPublicUrl(path);
        newAvatar = data.publicUrl;
      }
      const { error } = await supabase
        .from('users')
        .update({ nickname, avatar_url: newAvatar })
        .eq('id', user.id);
      if (error) throw error;
      alert('저장 완료');
      router.replace('/auth/login');
    } catch (err) {
      alert('저장 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-black">
      <div className="w-[420px] rounded border p-6 shadow">
        <h1 className="mb-4 text-xl font-bold">마이페이지</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              value={user?.email || ''}
              disabled
              className="w-full rounded border bg-gray-100 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="nickname">
              Nickname
            </label>
            <input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full rounded border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Avatar</label>
            <div className="mt-2 mb-2">
              {!preview && avatarUrl && (
                <Image
                  src={avatarUrl}
                  alt="Current profile"
                  width={80}
                  height={80}
                  className="h-20 w-20 rounded-full border object-cover"
                />
              )}
              {preview && (
                <Image
                  src={preview}
                  alt="New preview"
                  width={80}
                  height={80}
                  className="h-20 w-20 rounded-full border object-cover"
                />
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleFile} className="text-sm" />
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full rounded bg-blue-500 py-2 font-bold text-white"
          >
            {loading ? '저장 중...' : '변경 사항 저장'}
          </button>
        </div>
      </div>
    </div>
  );
}
