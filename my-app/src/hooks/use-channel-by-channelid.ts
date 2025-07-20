"use client";
import { supabase } from "@/lib/supabase/supabase";
import useSWR from "swr";

export const useChannelByChannelId = (
  channelId?: string,
  serverId?: string
) => {
  const shouldFetch = !!channelId && !!serverId;

  const { data, error, isLoading } = useSWR(
    shouldFetch ? [`channel-${channelId}`, channelId, serverId] : null,
    async ([, channelId, serverId]) => {
      const { data, error } = await supabase
        .from("channels")
        .select("*")
        .eq("id", channelId)
        .eq("server_id", serverId)
        .single();

      if (error) throw error;
      return data;
    }
  );

  return {
    channel: data,
    isLoading,
    error,
  };
};
