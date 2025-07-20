"use client";

import useSWR, { SWRConfiguration } from "swr";
import { Server, Member, Profile } from "@/models";

export interface MemberWithProfile extends Member {
  profile: Profile;
}

interface ServerWithMember {
  server: Server;
  member: MemberWithProfile;
}

export const useServerByServerIdIfMember = (
  serverId: string,
  options?: Partial<SWRConfiguration<ServerWithMember[]>>, // ✅ Đúng kiểu
) => {
  const key = serverId
    ? `/rest/v1/members?server_id=eq.${serverId}&select=*,profile:profiles(*),server:servers(*)`
    : null;

  const { data, error, isLoading } = useSWR<ServerWithMember[]>(key, {
    ...options,
  });

  const member = data?.[0];

  return {
    server: member?.server || null,
    member: member || null,
    error,
    isLoading,
  };
};
