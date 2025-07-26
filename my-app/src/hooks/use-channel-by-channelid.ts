import useSWR from "swr";

export const useChannelByChannelId = (
  channelId?: string,
  serverId?: string
) => {
  const shouldFetch = !!channelId && !!serverId;

  const { data, error, isLoading } = useSWR(
    shouldFetch ? `/rest/v1/channels?id=eq.${channelId}&server_id=eq.${serverId}&select=*` : null,
  );
  
  return {
    channel:data,
    isLoading,
    error,
  };
};
