"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { uploadToCloudinaryFromUrl } from "@/lib/cloudinary";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      const { data } = await supabase.auth.getSession();

      if (data?.session) {
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

        if (existingUser) {
          router.push("/Home");
        } else {
          // 👉 Chưa có thì thêm user
          const avatarUrlFromGoogle = user.user_metadata?.avatar_url;
          let finalAvatarUrl = null;

          if (avatarUrlFromGoogle) {
            finalAvatarUrl = await uploadToCloudinaryFromUrl(
              avatarUrlFromGoogle
            );
          }

          const { error: insertError } = await supabase
            .from("profiles")
            .insert({
              name: user.user_metadata.full_name,
              email: user.email,
              avatar_url: finalAvatarUrl ?? "",
              id: user.id,
            });

          if (insertError) {
            console.error(" Lỗi khi insert user:", insertError.message);
          } else {
            console.log(" User mới đã được thêm vào profiles");
          }

          // 👉 Sau khi thêm thì điều hướng đến request
          router.push("/request");
        }
      } else {
        //
        router.push("/");
      }
    };

    checkLogin();
  }, [router]);

  return null;
}
