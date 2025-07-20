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

    const channelName = `room:${channelId}`;
    const channel: RealtimeChannel = supabase
      .channel(channelName)
      .on<MessageWithMemberWithProfile>(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `channel_id=eq.${channelId}`,
        },
        (payload) => {
          const newMessage = payload.new;

          queryClient.setQueryData<InfiniteMessages>([queryKey], (oldData) => {
            if (!oldData || oldData.pages.length === 0) {
              return {
                pages: [{ items: [newMessage] }],
              };
            }

            const [firstPage, ...rest] = oldData.pages;

            return {
              pages: [
                {
                  ...firstPage,
                  items: [newMessage, ...firstPage.items],
                },
                ...rest,
              ],
            };
          });
        }
      )
      .on<MessageWithMemberWithProfile>(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `channel_id=eq.${channelId}`,
        },
        (payload) => {
          const updatedMessage = payload.new;

          queryClient.setQueryData<InfiniteMessages>([queryKey], (oldData) => {
            if (!oldData) return oldData;

            return {
              pages: oldData.pages.map((page) => ({
                ...page,
                items: page.items.map((msg) =>
                  msg.id === updatedMessage.id ? updatedMessage : msg
                ),
              })),
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
