"use client";

import { Server } from "@/models";
import useSWR from "swr";
import { SWRConfiguration } from "swr/_internal";

export const useServerByProfileId = (
  profile_id: string,
  options?: Partial<SWRConfiguration<Server>>,
) => {
  const {
    data: server,
    error,
    isLoading,
  } = useSWR<Server>(`/rest/v1/servers/${profile_id}`, {
    ...options,
  });

  return {
    server,
    error,
    isLoading,
  };
};