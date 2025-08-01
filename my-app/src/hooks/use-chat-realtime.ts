'use client'
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabase";
import { MessageWithMemberWithProfile } from "@/models";

interface ChatRealtimeProps {
  channelId: string,
  queryKey?: string;
  paramValue?: string;
  paramKey : "channel" | "conversation";
}

interface PaginatedMessages {
  pages: {
    messages: MessageWithMemberWithProfile[];
  }[];
}

export const useChatRealtime = ({
  channelId,
  paramValue,
  queryKey,
  paramKey
}: ChatRealtimeProps): void => {
  const queryClient = useQueryClient();
  const fetchFullMessage = async (messageId:string) => {
  const { data, error } = await supabase
    .from("messages")
    .select("*, member:member_id(*, profile:profile_id(*))")
    .eq("id",messageId)
    .maybeSingle();

  if (error || !data) return null;
  return data as MessageWithMemberWithProfile;
  
};
  useEffect(() => {
    if (!paramKey || !channelId) return;
    if (!queryKey || !paramKey || !channelId) return;
    const channelName = `realtime:messages:${paramKey}:${paramValue}`;
    const channel = supabase
      .channel(channelName)
      .on<MessageWithMemberWithProfile>(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `${paramKey}_id=eq.${paramValue}`,
        },
        async (payload) => {
          const message = await fetchFullMessage(payload.new.id) ;
          if(!message) return
          queryClient.setQueryData<PaginatedMessages>(([queryKey]), (oldData) => {
            if (!oldData) return oldData;
            const newPages = [...oldData.pages];
            newPages[0] = {
              ...newPages[0],
              messages: [message, ...newPages[0].messages],
            };
            return { ...oldData, pages: newPages};
          });
        }
      )
      .on<MessageWithMemberWithProfile>(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `${paramKey}_id=eq.${paramValue}`,
        },
        (payload) => {
          const message = payload.new;

          queryClient.setQueryData<PaginatedMessages>([queryKey], (oldData) => {
            if (!oldData) return oldData;

            const updatedPages = oldData.pages.map((page) => ({
              ...page,
              messages: page.messages.map((item) =>
                item.id === message.id ? message : item
              ),
            }));

            return { ...oldData, pages: updatedPages };
          });
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log(" Subscribed to realtime:messages:", channelName);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [paramKey, queryClient, queryKey, paramValue , channelId]);
};
