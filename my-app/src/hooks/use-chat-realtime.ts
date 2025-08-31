  'use client'

  import { useCallback, useEffect } from "react";
  import { useQueryClient } from "@tanstack/react-query";
  import { supabase } from "@/lib/supabase/supabase";
  import { MessageWithMemberWithProfile } from "@/models";

  interface ChatRealtimeProps {
    channelId: string,
    conversationId: string,
    queryKey: unknown[];
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
    conversationId,
    paramValue,
    queryKey,
    paramKey
  }: ChatRealtimeProps): void => {
    const queryClient = useQueryClient();
    const table = paramKey === "channel" ? "messages" : "direct_messages";
    const fetchFullMessage = useCallback(async (messageId: string) => {
      const { data, error } = await supabase
        .from(table)
        .select(`
    *,
    member:member_id (
      *,
      profile:profile_id (*)
    )
  `)

        .eq("id", messageId)
        .maybeSingle();

      if (error || !data) return null;
      return data as MessageWithMemberWithProfile;
    }, [table]);

    useEffect(() => {
      if (!queryKey || !paramKey || !channelId){
        console.log(queryKey,paramKey,channelId, conversationId)
        return; 
      }
      
      const channelName = `realtime:${table}:${paramKey}:${paramValue}`;
      const channel = supabase
        .channel(channelName)
        .on<MessageWithMemberWithProfile>(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: table,
            filter: `${paramKey}_id=eq.${paramValue}`,
          },
          async (payload) => {

            const message = await fetchFullMessage(payload.new.id);
            if (!message) return;
            


            queryClient.setQueryData<PaginatedMessages>(queryKey, (oldData) => {
              if (!oldData) return oldData;

              const newPages = [...oldData.pages];
              if (!newPages[0]) return oldData;
              if (newPages[0].messages.some(m => m.id === message.id)) return oldData; // tránh trùng
              newPages[0] = {
                ...newPages[0],
                messages: [message, ...newPages[0].messages],
              };

              return { ...oldData, pages: newPages };
            });
          }
        )
        .on<MessageWithMemberWithProfile>(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: table,
            filter: `${paramKey}_id=eq.${paramValue}`,
          },
          async (payload) => {
            const message = await fetchFullMessage(payload.new.id);
            if (!message) return;

            queryClient.setQueryData<PaginatedMessages>(queryKey, (oldData) => {
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
    .on<MessageWithMemberWithProfile>(
  "postgres_changes",
  {
    event: "DELETE",
    schema: "public",
    table: table,
    },
  async (payload) => {
    const deletedId = payload.old.id; 
    console.log("deleteid", deletedId)
    queryClient.setQueryData<PaginatedMessages>(queryKey, (oldData) => {
      if (!oldData) return oldData;

      const updatedPages = oldData.pages.map((page) => ({
        ...page,
        messages: page.messages.filter((item) => item.id !== deletedId),
      }));

      return { ...oldData, pages: updatedPages };
    });
   }
  )


        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            console.log("✅ Subscribed to", channelName);
          }
        });

      return () => {
        console.log("❌ Unsubscribed from", channelName);
        supabase.removeChannel(channel);
      };
    }, [paramKey, queryClient, queryKey, paramValue, channelId, fetchFullMessage, table,conversationId]);
  };
