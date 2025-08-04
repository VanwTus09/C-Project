"use client"
import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabase";

interface ChatQueryProps {
  queryKey: string;
  paramKey: "channel" | "conversation";
  paramValue?: string;
}

const PAGE_SIZE = 10; // 

export const useChatQuery = ({
  queryKey,
  paramKey,
  paramValue,
}: ChatQueryProps) => {
  
  const fetchMessages = async ({ pageParam = 0 }) => {
    const from = pageParam;
    const to = pageParam + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from("messages")
      .select("*, member:member_id(*, profile:profile_id(*))")
      .eq(`${paramKey}_id`, paramValue)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw new Error(error.message);
    console.log(queryKey, 'hâhaa')
    return {
      messages: data ,
      nextCursor: (data?.length === PAGE_SIZE) ? to + 1 : undefined,
    };
    
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({ // fetch error
    queryKey:[queryKey],

    queryFn: fetchMessages,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    
  });
  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};
