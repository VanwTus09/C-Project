import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useSupabase } from "@/hooks";
import type { MessageWithMemberWithProfile } from "@/models";

interface ChatSocketProps {
  queryKey: string;
  channelId: string;
  
}

interface MessagePage {
  items: MessageWithMemberWithProfile[];
}

interface InfiniteMessages {
  pages: MessagePage[];
}

export const useChatRealtime = ({ queryKey, channelId }: ChatSocketProps) => {
  const { supabase } = useSupabase();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!supabase || !channelId) return;

    const channel: RealtimeChannel = supabase.channel(`room:${channelId}`);

    // Handle INSERT
    channel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `channel_id=eq.${channelId}`,
      },
      (payload) => {
        const newMessage = payload.new as MessageWithMemberWithProfile;

        queryClient.setQueryData<InfiniteMessages>([queryKey], (oldData) => {
          if (!oldData || oldData.pages.length === 0) {
            return {
              pages: [
                {
                  items: [newMessage],
                },
              ],
            };
          }

          const newPages = [...oldData.pages];
          newPages[0] = {
            ...newPages[0],
            items: [newMessage, ...newPages[0].items],
          };

          return {
            ...oldData,
            pages: newPages,
          };
        });
      }
    );

    // Handle UPDATE
    channel.on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "messages",
        filter: `channel_id=eq.${channelId}`,
      },
      (payload) => {
        const updatedMessage = payload.new as MessageWithMemberWithProfile;

        queryClient.setQueryData<InfiniteMessages>([queryKey], (oldData) => {
          if (!oldData || oldData.pages.length === 0) return oldData;

          const updatedPages = oldData.pages.map((page) => ({
            ...page,
            items: page.items.map((msg) =>
              msg.id === updatedMessage.id ? updatedMessage : msg
            ),
          }));

          return {
            ...oldData,
            pages: updatedPages,
          };
        });
      }
    );

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, queryClient, channelId, queryKey]);
};
