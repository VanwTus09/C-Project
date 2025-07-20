"use client";

import { axiosInstance } from "@/api/axiosIntance";

export const useMessage = () => {
  const createMessage = async ({
    content,
    fileUrl,
    channelId,
    memberId,
  }: {
    content?: string;
    fileUrl?: string | "";
    channelId?: string;
    memberId?: string;
  }) => {
    try {
      if (!channelId || !memberId) return;

      const formData = new FormData();
      formData.append("content", content || "");
      formData.append("channel_id", channelId);
      formData.append("server_id", memberId);
      formData.append("image", fileUrl || "");

      await axiosInstance.post("/rest/v1/messages", formData);
    } catch (error) {
      console.log(error);
    }
  };

  const editMessage = async ({
    messageId,
    content,
    channelId,
    memberId,
  }: {
    messageId: string;
    content: string;
    channelId?: string;
    memberId?: string;
  }) => {
    if (content === "" || !channelId || !memberId) return;
    try {
      await axiosInstance.patch(`/api/messages/${messageId}`, {
        content,
        channelId,
        memberId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteMessage = async ({
    apiUrl,
    channelId,
    memberId,
  }: {
    apiUrl: string;
    channelId?: string;
    memberId?: string;
  }) => {
    if (!channelId || !memberId) return;

    try {
      await axiosInstance.delete(`${apiUrl}`, {
        params: {
          channelId,
          memberId,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    createMessage,
    editMessage,
    deleteMessage,
  };
};