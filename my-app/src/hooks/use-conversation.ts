"use client";

import { supabase } from "@/lib/supabase/supabase";
import { Conversation } from "@/models";
import { useServerByServerId } from "./use-server-by-id";

export const useConversation = (serverId :string) => {
  const { mutate } = useServerByServerId(serverId);
  const getConversationByMembers = async (
    member_one_id: string,
    member_two_id: string
  ): Promise<Conversation | null> => {
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
      return null;
    }

    return data;
  };

  const createConversation = async (
    member_one_id: string,
    member_two_id: string
  ): Promise<Conversation | null> => {
    const { data, error } = await supabase
      .from("conversations")
      .insert({
        member_one_id,
        member_two_id,
      })
      .select("*")
      .single();
      await mutate()
    if (error) {
      console.error("Error creating conversation:", error.message);
      return null;
    }

    return data;
  };

  return {
    getConversationByMembers,
    createConversation,
  };
};
