"use client";

import { Server } from "@/models";
import useSWR from "swr";

export const useServerByInviteCodeIfMember = (
  invite_code: string,
  profile_id?: string
) => {
  const { data: server, error: serverError } = useSWR<Server | null>(
    invite_code ? `/rest/v1/servers?invite_code=eq.${invite_code}&select=id,name&limit=1` : null
  );

  const { data: member, error: memberError } = useSWR(
    server?.id && profile_id
      ? `/rest/v1/members?server_id=eq.${server.id}&profile_id=eq.${profile_id}&select=*,server(*)&limit=1`
      : null
  );

  return {
    server: member?.server ?? null, // nếu đã là member thì có server
    isLoading: !server && !member,
    error: serverError || memberError,
  };
};
