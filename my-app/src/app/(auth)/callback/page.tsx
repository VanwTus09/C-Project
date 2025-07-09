"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      const { data } = await supabase.auth.getSession();

      if (data?.session) {
        const insertUserIfNotExists = async () => {
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();

          if (userError || !user) {
            console.error("❌ Lỗi khi lấy user:", userError?.message);
            return;
          }

          // Kiểm tra user trong bảng profiles
          const { data: existingUser, error: checkError } = await supabase
            .from("profiles")
            .select("*")
            .eq("email", user.email)
            .maybeSingle();

          if (checkError) {
            console.error("❌ Lỗi khi kiểm tra user:", checkError.message);
            return;
          }

          // Nếu chưa có thì thêm vào
          if (!existingUser) {
            const { error: insertError } = await supabase.from("profiles").insert({
              name: user.user_metadata.full_name,
              email: user.email,
              avatar_url: user.user_metadata.avatar_url,
              id: user.id, // optional: insert luôn id của supabase auth
            });

            if (insertError) {
              console.error("❌ Lỗi khi insert user:", insertError.message);
            } else {
              console.log("✅ User mới đã được thêm vào profiles");
            }
          }
        };

        await insertUserIfNotExists();
        router.push("/request");
      } else {
        router.push("/");
      }
    };

    checkLogin();
  }, [router]);

  return null; // Không cần children nếu chỉ xử lý logic
}
