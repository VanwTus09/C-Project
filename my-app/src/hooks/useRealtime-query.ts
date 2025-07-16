import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Message } from "@/models";

export function useRealtimeMessages(channelId: string) {
  const [newMessage, setNewMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (!channelId) return;

    const channel = supabase
      .channel(`channel-messages-${channelId}`)
      .on<Message>(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channelId}`,
        },
        (payload) => {
          setNewMessage(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelId]);

  return { newMessage };
}
