"use client";

import { axiosInstance } from "@/api/axiosIntance";
import { supabase } from "@/lib/supabase/supabase";

export const useMessage = () => {
  const createMessage = async ({
  content,
  fileUrl,
  channelId,
  memberId,
}: {
  content?: string;
  fileUrl?: File | "";
  channelId?: string;
  memberId?: string;
  serverId?: string,
}) => {
  try {
    if (!channelId || !memberId) return;

    const payload = {
      content: content || "",
      channel_id: channelId,
      member_id: memberId,
      file_url: fileUrl || "",
    };
     await supabase.from("messages").insert(payload).single();
  } catch (error) {
    console.log("Create error:", error);
  }
};
  const editMessage = async ({
    messageId,
    content,
    channelId,
    memberId,
    serverId
  }: {
    messageId: string;
    content: string;
    channelId?: string;
    memberId?: string;
    serverId?: string
  }) => {
    if (content === "" || !channelId || !memberId) return;
    try {
      await axiosInstance.patch(`/rest/v1/messages/${messageId}`, {
        content,
        channelId,
        memberId,
        serverId
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