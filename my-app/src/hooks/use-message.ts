"use client";
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
  serverId,
}: {
  messageId: string;
  content: string;
  channelId?: string;
  serverId?: string;
}) => {
  if (!channelId ){
     console.warn("⚠️ Missing channelId or serverId", { channelId, serverId });return;
  }
  try {
    const { data, error } = await supabase
      .from("messages")
      .update({ content, updated_at: new Date().toISOString() })
      .eq("id", messageId)
      .select()
    if (error) {
     
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
};


  const deleteMessage = async ({
    messageId,
    channelId,
  }: {
    messageId: string;
    channelId?: string;
  }) => {
    if (!channelId ){
      console.warn("không tìm thấy",channelId)
      return;
    } 

    try {
      await supabase.from("messages").delete().eq("id", messageId).select()
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