import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabase";
import { MemberWithProfile } from "@/models";

interface UseMembersResult {
  members: MemberWithProfile[];
  membersByProfileId: Record<string, MemberWithProfile>;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

export const useMembersByServerIdIfMember = (
  serverId?: string
): UseMembersResult => {
  const [members, setMembers] = useState<MemberWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchMembers = useCallback(async () => {
    if (!serverId) return;

    setIsLoading(true);
    const { data, error } = await supabase
      .from("members")
      .select("*, profile:profiles(*)")
      .eq("server_id", serverId);

    if (!error && data) {
      setMembers(data as MemberWithProfile[]);
    }

    setIsLoading(false);
  }, [serverId]);

  useEffect(() => {
    if (serverId) {
      fetchMembers();
    }
  }, [serverId, fetchMembers]);

  const membersByProfileId = members.reduce<Record<string, MemberWithProfile>>(
    (acc, member) => {
      acc[member.profile_id] = member;
      return acc;
    },
    {}
  );

  return {
    members,
    membersByProfileId,
    isLoading,
    refetch: fetchMembers,
  };
};
