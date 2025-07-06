'use client';

import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc'; // Google icon

export default function AuthWithGoogle() {
  const handleLoginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
       options: {
      redirectTo: `${window.location.origin}/auth/callback`, // 👈 Redirect về callback
    },
    });
    
    if (error) {
      console.error('Lỗi đăng nhập:', error.message);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: "url('/login.jpg')", // 👉 thay bằng ảnh của bạn (đặt trong /public)
      }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-xl shadow-xl text-center w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Đăng nhập bằng Google</h2>
        <Button
          onClick={handleLoginWithGoogle}
          variant="outline"
          className="gap-2 w-full text-lg"
        >
          <FcGoogle className="text-2xl" />
          Tiếp tục với Google
        </Button>
      </div>
    </div>
  );
}
