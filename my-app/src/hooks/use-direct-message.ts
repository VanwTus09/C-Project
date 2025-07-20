"use client";

import { axiosInstance } from "@/api/axiosIntance";

export const useDirectMessage = () => {
  const createDirectMessage = async ({
    content,
    fileUrl,
    conversationId,
    memberId,
  }: {
    content?: string;
    fileUrl?: string | "";
    conversationId?: string;
    memberId?: string;
  }) => {
    try {
      if (!conversationId) return;

      const formData = new FormData();
      formData.append("content", content || "");
      formData.append("conversation_id", conversationId);
      formData.append("file_url", fileUrl || "");
      formData.append("member_id", memberId || "");

      await axiosInstance.post("/rest/v1/direct-messages", formData);
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
        `/rest/v1/direct-messages/${directMessageId}`,
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