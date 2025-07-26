"use client";

import { useAuth, useServerByServerId } from "@/hooks";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const ServerIdPage = () => {
  const params = useParams<{ serverId: string }>();
  const router = useRouter();
  const { profile, isLoading: profileLoading } = useAuth();
  const { server, isLoading: serverLoading } = useServerByServerId(
    params.serverId
  );

  const initialChannel = server?.channels?.[0] ?? null;
  console.log(params.serverId, "params serverId");
  useEffect(() => {
    if (profileLoading || serverLoading) return;
    if (!profile) return router.replace("/");
    if (initialChannel)
      return router.replace(
        `/servers/${params.serverId}/channels/${initialChannel.id}`
      );
  }, [
    profileLoading,
    serverLoading,
    profile,
    router,
    initialChannel,
    params.serverId,
  ]);

  if (initialChannel?.name !== "general") return null;
};

export default ServerIdPage;
