"use client";

import { useAuth, useServerByInviteCodeIfMember, useServers } from "@/hooks";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Params = {
  invite_code: string;
};

const InviteCodePage = () => {
  const router = useRouter();
  const params = useParams<Params>();
  const hasJoinedRef = useRef(false);
  const { profile, isLoading } = useAuth();
  const { joinServer } = useServers();
  console.log("invite_code:", params.invite_code);
console.log("profile.id:", profile?.id);
console.log("params:", params);
console.log("invite_code:", params?.invite_code);


  // Tạo biến để giữ server sau khi profile sẵn sàng
  const [inviteCodeReady, setInviteCodeReady] = useState(false);

  const {
    server: existingServer,
    isLoading: existingServerLoading,
  } = useServerByInviteCodeIfMember(
    inviteCodeReady ? params.invite_code : "",
    inviteCodeReady ? profile?.id : ""
  );

  // Chờ profile và invite_code sẵn sàng rồi mới cho phép gọi API
  useEffect(() => {
    if (!isLoading && profile && params.invite_code) {
      setInviteCodeReady(true);
    }
  }, [isLoading, profile, params.invite_code]);

  // Logic xử lý tham gia server
  useEffect(() => {
    if (isLoading || existingServerLoading || !inviteCodeReady) return;
    if (!profile) return router.replace("/");
    if (!params.invite_code) return router.replace("/");

    if (existingServer) {
      return router.replace(`/servers/${existingServer.id}`);
    }

    if (existingServer !== undefined && !hasJoinedRef.current) {
      hasJoinedRef.current = true;
      (async () => {
        const server = await joinServer({
          invite_code: params.invite_code,
          profile_id: profile.id,
        });
        if (server) router.replace(`/servers/${server.id}`);
      })();
    }
  }, [
    isLoading,
    existingServerLoading,
    profile,
    router,
    params.invite_code,
    existingServer,
    joinServer,
    inviteCodeReady,
  ]);

  return null;
};

export default InviteCodePage;
