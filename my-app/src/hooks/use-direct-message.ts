"use client";

import { axiosInstance } from "@/api/axiosIntance";
import { supabase } from "@/lib/supabase/supabase";

export const useDirectMessage = () => {
  const createDirectMessage = async ({
    content,
    fileUrl,
    conversationId,
    memberId,
  }: {
    content?: string;
    fileUrl?: File | "";
    conversationId?: string;
    memberId?: string;
  }) => {
    try {
      if (!conversationId) return;

      await supabase.from("direct_messages").insert({ 
      content: content || "",
      conversation_id: conversationId,
      file_url: fileUrl || "",
      member_id: memberId || "",
    });

    } catch (error) {
      console.log(error);
    }
  };

  const editDirectMessage = async ({
    directMessageId,
    content,
    conversationId,
    memberId,
  }: {
    directMessageId: string;
    content: string;
    conversationId?: string;
    memberId?: string;
  }) => {
    if (content === "" || !conversationId) return;
    try {
      await axiosInstance.patch(
        `/rest/v1/direct_messages/${directMessageId}`,
        {
          content,
          conversationId,
          memberId
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  const deleteDirectMessage = async ({
    apiUrl,
    conversationId,
  }: {
    apiUrl: string;
    conversationId?: string;
  }) => {
    if (!conversationId) return;

    try {
      await axiosInstance.delete(`${apiUrl}`, {
        params: {
          conversationId,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    createDirectMessage,
    editDirectMessage,
    deleteDirectMessage,
  };
};