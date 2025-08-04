"use client";

import { Conversation } from "@/models";
import useSWR, { SWRConfiguration } from "swr";

export const useConversation = (
  member_one_id: string , // đây là thằng chính (sender)
  options?: Partial<SWRConfiguration<Conversation>>,
) => {
  const shouldFetch = !!member_one_id ;

  const {
    data: conversation,
    error,
    isLoading,
    mutate,
  } = useSWR<Conversation>(
    shouldFetch
      ? `/rest/v1/conversations?member_one_id=eq.${member_one_id}`
      : null,
    {
      ...options,
    },
  );

  return {
    conversation,
    isLoading,
    error,
    mutate,
  };
};