"use client"

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabase";

export function useSupabaseConnection() {
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const channel = supabase
      .channel("connection-check")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages", // có thể thay bằng bất kỳ bảng nào có bật Realtime
        },(payload) => {
          console.log("realtime status",payload)
        
        
          // Nếu nhận được sự kiện, tức là realtime đang hoạt động
          setIsConnected(true);
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          // Kết nối WebSocket thành công, nhưng chưa có dữ liệu → tạm coi là true
          setIsConnected(true);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { isConnected };
}
