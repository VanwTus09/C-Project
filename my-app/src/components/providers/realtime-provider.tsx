"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/supabase";
import { useParams } from "next/navigation";

type RealtimeContextType = {
  channel: RealtimeChannel | null;
  isConnected: boolean;
};

const RealtimeContext = createContext<RealtimeContextType>({
  channel: null,
  isConnected: false,
});

export const useRealtime = () => useContext(RealtimeContext);

export const RealtimeProvider = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();
  const channelId = params?.channelId;
  const conversationId = params?.conversationId;

  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const name = channelId
      ? `realtime:messages:channel:${channelId}`
      : conversationId
      ? `realtime:messages:conversation:${conversationId}`
      : null;

    if (!name) return;

    const _channel = supabase.channel(name, {
      config: {
        broadcast: {
          self: true, // nhận lại cả tin chính mình gửi
        },
      },
    });

    setChannel(_channel);

    _channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        setIsConnected(true);
      }
    });

    return () => {
      _channel.unsubscribe();
      setIsConnected(false);
    };
  }, [channelId, conversationId]);

  return (
    <RealtimeContext.Provider value={{ channel, isConnected }}>
      {children}
    </RealtimeContext.Provider>
  );
};
