'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        router.push('/chat'); // ✅ Chuyển tới trang chat
      } else {
        router.push('/');
      }
    };

    checkLogin();
  }, [router]);

  return <p className="text-center mt-10">Đang đăng nhập...</p>;
}
