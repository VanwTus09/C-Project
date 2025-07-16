'use client';
import { axiosInstance } from "@/api/axiosIntance";
import { useRealtimeMessages } from "./useRealtime-query";
import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "channels" | "conversations";
  paramValue: string;
}
export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: ChatQueryProps) => {
  const { newMessage } = useRealtimeMessages(paramValue);

  const fetchMessages = async ({ pageParam = undefined }) => {
    const response = await axiosInstance.get(
      `${apiUrl}/${paramKey}/${paramValue}`,
      {
        params: {
          cursor: pageParam,
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
    if (newMessage) {
      refetch(); // hoặc push newMessage vào cache nếu muốn tối ưu
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
