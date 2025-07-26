"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/supabase";
import { uploadToCloudinaryFromUrl } from "@/lib/cloudinary";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (!session) {
        router.replace("/");
        return;
      }

      const { data: userData, error: userError } = await supabase.auth.getUser();
      const user = userData?.user;

      if (userError ||  !user?.email) {
        console.error("Lỗi lấy user:", userError?.message);
        router.replace("/");
        return;
      }

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

        const { error: insertError } = await supabase.from("profiles").insert({
          id: user.id,
          user_id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || "",
          image_url: uploadedAvatar,
        });

        if (insertError) {
          console.error("Lỗi tạo profile:", insertError.message);
          return;
        }

        // Sau khi tạo profile, chuyển đến tạo server
        router.replace("/request");
        return;
      }

      // Kiểm tra server đã tham gia
      const { data: servers, error: serverError } = await supabase
        .from("servers")
        .select("id") 
        .eq("profile_id", user.id)
        .limit(1);

      if (serverError) {
        console.error("Lỗi lấy server:", serverError.message);
        return;
      }

      // if (!servers || servers.length === 0) {
      //   router.replace("/servers");
      //   return;
      // }

      const serverId = servers[0]?.id;

      // Lấy channel đầu tiên trong server
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

      if (channelId) {
        router.replace(`/servers/${serverId}/channels/${channelId}`);
      } else {
        router.replace(`/servers/${serverId}/channels/${channelId}`);
      }
    };

    handleAuthRedirect();
  }, [router]);

  return null;
}
