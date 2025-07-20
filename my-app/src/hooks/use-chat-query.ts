'use client';
import { axiosInstance } from "@/api/axiosIntance";
import { useRealtimeMessages } from "./useRealtime-query";
import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabase";
interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "channels" | "conversations";
  paramValue: string;
}
export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramValue,
}: ChatQueryProps) => {
  const { newMessage } = useRealtimeMessages(paramValue);
  const lastMessageIdRef = useRef<string | null>(null);
  const fetchMessages = async ({ pageParam = undefined }) => {
    const {
          data: { session },
        } = await supabase.auth.getSession();
        const token = session?.access_token;
    const response = await axiosInstance.get(
      `${apiUrl}/${paramValue}`,
      {
        params: {
          cursor: pageParam,
        },
         headers: {
        Authorization: `Bearer ${token}`,
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      },
      }
    );
    return response.data;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchMessages,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage?.nextCursor || undefined,
  });

  // Khi có message mới thì refetch lại
  useEffect(() => {
    if (newMessage && newMessage.id !== lastMessageIdRef.current) {
    lastMessageIdRef.current = newMessage.id;
    refetch();
  }
  }, [newMessage, refetch]);

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};
