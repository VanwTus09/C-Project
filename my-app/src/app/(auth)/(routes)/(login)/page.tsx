'use client';
import { supabase } from "@/lib/supabase/supabase";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const handleLoginWithGoogle = async () => {
    const SiteUrl = "http://localhost:3000";
    // const RedirectURL = "https://realtime-chat-app-dis-mess.vercel.app"
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:   `${SiteUrl}/callback`,
      },
    });
    if (error) {
      console.error("Lỗi đăng nhập:", error.message);
    }
  };
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: "url('/login.jpg')",
      }}
    >
      <div className="bg-opacity-90 p-8 rounded-xl shadow-xl text-center w-full max-w-md bg-zinc-500">
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
