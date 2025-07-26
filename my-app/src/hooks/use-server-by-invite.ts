"use client";

import { Server } from "@/models";
import useSWR from "swr";
import { SWRConfiguration } from "swr/_internal";

export const useServerByInviteCodeIfMember = (
  inviteCode: string,
  options?: Partial<SWRConfiguration<Server>>,
) => {
  const {
    data: server,
    error,
    isLoading,
  } = useSWR<Server>(`/rest/v1/servers/invite-code/${inviteCode}`, {
    ...options,
  });

  return {
    server,
    error,
    isLoading,
  };
};