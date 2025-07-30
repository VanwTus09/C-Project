"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/supabase";
import { uploadToCloudinaryFromUrl } from "@/lib/cloudinary";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      const code = new URLSearchParams(window.location.search).get("code");

      if (!code) {
        console.error("Không tìm thấy mã xác thực (code) trong URL.");
        router.replace("/login");
        return;
      }

      // 1. Đổi mã `code` lấy từ URL thành session
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        console.error("Lỗi xác thực:", exchangeError.message);
        router.replace("/login");
        return;
      }

      // 2. Lấy session mới
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (!session) {
        router.replace("/login");
        return;
      }

      // 3. Lấy thông tin user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      const user = userData?.user;

      if (userError || !user?.email) {
        console.error("Lỗi lấy user:", userError?.message);
        router.replace("/login");
        return;
      }

      // 4. Kiểm tra profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Lỗi lấy profile:", profileError.message);
        return;
      }

      if (!profile) {
        let uploadedAvatar: string | null = null;
        const avatarUrl = user.user_metadata?.avatar_url;

        if (avatarUrl) {
          try {
            uploadedAvatar = await uploadToCloudinaryFromUrl(avatarUrl);
          } catch (error) {
            console.error("Lỗi upload avatar:", error);
          }
        }

        const { error: insertError } = await supabase.from("profiles").upsert(
          {
            id: user.id,
            user_id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || "",
            image_url: uploadedAvatar,
          },
          { onConflict: "id" }
        );

        if (insertError) {
          console.error("Lỗi tạo profile:", insertError.message);
          return;
        }

        // Tạo profile mới → chuyển sang request server
        router.replace("/request");
        return;
      }

      // 5. Tìm server
      const { data: servers, error: serverError } = await supabase
        .from("servers")
        .select("id")
        .eq("profile_id", user.id)
        .limit(1);

      if (serverError) {
        console.error("Lỗi lấy server:", serverError.message);
        return;
      }

      if (!servers || servers.length === 0) {
        router.replace("/request");
        return;
      }

      const serverId = servers[0]?.id;

      // 6. Tìm channel đầu tiên
      const { data: channels, error: channelError } = await supabase
        .from("channels")
        .select("id")
        .eq("server_id", serverId)
        .order("created_at", { ascending: true })
        .limit(1);

      if (channelError) {
        console.error("Lỗi lấy channel:", channelError.message);
        router.replace(`/servers/${serverId}`);
        return;
      }

      const channelId = channels?.[0]?.id;

      router.replace(
        channelId
          ? `/servers/${serverId}/channels/${channelId}`
          : `/servers/${serverId}`
      );
    };

    handleAuthRedirect();
  }, [router]);

  return null;
}
