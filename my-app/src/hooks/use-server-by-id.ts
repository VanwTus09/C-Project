"use client";

import { ServerWithChannelWithMember } from "@/models";
import useSWR from "swr";
import { SWRConfiguration } from "swr/_internal";
import { useMemo } from "react";
export const useServerByServerId = (
  serverId?: string,
  options?: Partial<SWRConfiguration<ServerWithChannelWithMember>>,
) => {
  // Tránh tạo key mới mỗi render
   const key = useMemo(() => {
    return serverId
      ? `/rest/v1/servers?id=eq.${serverId}&select=*,channels(*),members(*,profile:profiles(*))`
      : null;
  }, [serverId]);
  const {
    data :server ,
    error,
    isLoading,
    mutate,
  } = useSWR<ServerWithChannelWithMember>(key, {      
    ...options,                     
  });
  
  return {
    server,
    error,
    isLoading,
    mutate,
  };
};
