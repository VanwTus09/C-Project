"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/supabase";
import { uploadToCloudinaryFromUrl } from "@/lib/cloudinary";
import { useLoading } from "@/components/providers";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      try {
        showLoading("Đang xác thực, chờ chút nhé...");
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData?.session;
        if (!session) return;

        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError || !userData?.user?.email) {
          console.error("Lỗi lấy user:", userError?.message);
          return router.replace("/");
        }

        const user = userData.user;

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Lỗi lấy profile:", profileError.message);
          return;
        }

        if (!profile) {
          let uploadedAvatar = null;
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

          return router.replace("/request");
        }

        const { data: servers, error: serverError } = await supabase
          .from("servers")
          .select("id")
          .eq("profile_id", user.id)
          .limit(1);

        if (serverError) {
          console.error("Lỗi lấy server:", serverError.message);
          return;
        }

        if (!servers?.length) return router.replace("/request");

        const serverId = servers[0].id;

        const { data: channels, error: channelError } = await supabase
          .from("channels")
          .select("id")
          .eq("server_id", serverId)
          .order("created_at", { ascending: true })
          .limit(1);

        hideLoading();
        if (channelError) {
          console.error("Lỗi lấy channel:", channelError.message);
          return router.replace(`/servers/${serverId}`);
        }

        const channelId = channels?.[0]?.id;

        startTransition(() => {
          router.replace(
            channelId
              ? `/servers/${serverId}/channels/${channelId}`
              : `/servers/${serverId}`
          );
        });
      } catch (err) {
        console.error("Lỗi auth callback:", err);
      }
    };

    handleAuthRedirect();
  }, [router,showLoading,hideLoading]);

  return null;
}
