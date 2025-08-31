"use client";

import { supabase } from "@/lib/supabase/supabase";
import { toast } from "sonner";

export const useDirectMessage = () => {
  const createDirectMessage = async ({
    content,
    fileUrl,
    memberId,
    conversationId,
  }: {
    content?: string;
    fileUrl?: File | "";
    memberId?: string;
    conversationId?: string;
  }) => {
    try {
      if (!memberId || !conversationId) return;

      await supabase.from("direct_messages").insert({
        content: content,
        file_url: fileUrl || "",
        member_id: memberId,
        conversation_id: conversationId,
      });

      toast("Insert thành công");
    } catch (error) {
      console.error("Create DM error:", error);
      toast.error("Insert thất bại");
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
    if (!directMessageId || !memberId ||!conversationId) return;

    try {
      const { data, error } = await supabase
        .from("direct_messages") // sửa đúng tên bảng
        .update({ content, updated_at: new Date().toISOString() })
        .eq("id", directMessageId)
        .single();

      if (error) throw error;
      toast("Update thành công");
      return data;
    } catch (error) {
      console.error("Edit DM error:", error);
      toast.error("Update thất bại");
    }
  };

const deleteDirectMessage = async ({
    directMessageId,
    conversationId,
  }: {
    directMessageId: string;
    conversationId?: string;
  }) => {
    if (!conversationId ){
      console.warn("không tìm thấy",conversationId)
      return;
    } 

    try {
      await supabase.from("messages").delete().eq("id", directMessageId).select()
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
