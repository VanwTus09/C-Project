"use client";

import { supabase } from "@/lib/supabase/supabase";
import { axiosInstance } from "@/api/axiosIntance";

export const useDirectMessage = () => {
  const createDirectMessage = async ({
    content,
    fileUrl,
    memberId,
    conversationId,
  }: {
    content?: string;
    fileUrl?: File | "";
    memberId?: string;         // sender
    conversationId?: string;
  }) => {
    try {
      if (!memberId || !conversationId) return;

      await supabase.from("direct_messages").insert({
        content: content || "",
        file_url: fileUrl || "",
        member_id: memberId,
        conversation_id: conversationId,
      });
    } catch (error) {
      console.error("Create DM error:", error);
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
    memberId: string;
  }) => {
    if (!content || !conversationId || !memberId) return;

    try {
      await axiosInstance.patch(`/rest/v1/direct_messages/${directMessageId}`, {
        content,
        conversationId,
        memberId,
      });
    } catch (error) {
      console.log("Edit DM error:", error);
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
      await axiosInstance.delete(apiUrl, {
        params: { conversationId },
      });
    } catch (error) {
      console.log("Delete DM error:", error);
    }
  };

  return {
    createDirectMessage,
    editDirectMessage,
    deleteDirectMessage,
  };
};
