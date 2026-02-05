'use client';

import { createClient, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

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
      console.error(err);
      alert('저장 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-black">
      <div className="w-[420px] rounded border p-6 shadow">
        <h1 className="mb-4 text-xl font-bold">마이페이지</h1>
        <div className="mb-3">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            value={user?.email || ''}
            disabled
            className="w-full border bg-gray-100 p-2"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="nickname">Nickname</label>
          <input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full border p-2"
          />
        </div>
        <div className="mb-3">
          <label>Avatar</label>
          {!preview && avatarUrl && (
            <img src={avatarUrl} alt="기존 프로필" className="mb-2 h-20 w-20 rounded-full" />
          )}
          {preview && (
            <img
              src={preview}
              alt="새 프로필 미리보기"
              className="mb-2 h-20 w-20 rounded-full border"
            />
          )}
          <input type="file" accept="image/*" onChange={handleFile} />
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full rounded bg-blue-500 py-2 text-white"
        >
          {loading ? '저장중...' : '저장'}
        </button>
      </div>
    </div>
  );
}
