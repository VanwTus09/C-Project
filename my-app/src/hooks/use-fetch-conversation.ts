"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabase";
import { Conversation } from "@/models";

export const useFetchConversation = (
  member_one_id?: string,
  member_two_id?: string
) => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!member_one_id || !member_two_id) return;

    const fetchConversation = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("conversations")
        .select(`
    *,
    memberOne:member_one_id (*, profile:profile_id (*)),
    memberTwo:member_two_id (*, profile:profile_id (*))
  `)
        .or(
          `and(member_one_id.eq.${member_one_id},member_two_id.eq.${member_two_id}),and(member_one_id.eq.${member_two_id},member_two_id.eq.${member_one_id})`
        )
        .maybeSingle();
      if (error) {
        console.error("Error fetching conversation:", error.message);
        setConversation(null);
      } else {
        setConversation(data);
      }

      setIsLoading(false);
    };

    fetchConversation();
  }, [member_one_id, member_two_id]);

  return {
    conversation,
    isLoading,
  };
};
