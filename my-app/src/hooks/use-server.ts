"use client";

import { axiosInstance } from "@/api/axiosIntance";
import { supabase } from "@/lib/supabase/supabase";
import { Server  } from "@/models";
import useSWR from "swr";
import { SWRConfiguration } from "swr/_internal";

export const useServers = (options?: Partial<SWRConfiguration<Server[]>>) => {
  const {
    data: servers,
    error,
    isLoading,
    mutate,
  } = useSWR<Server[]>(`/rest/v1/servers`, {
    ...options,
  });

  const createServer = async ({
    name,
    image,
  }: {
    name: string;
    image: File | "";
  }) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", image || "");

      await supabase.from("servers").insert(formData).single();

      await mutate();
    } catch (error) {
      console.log(error);
    }
  };

  const joinServer = async ({
    invite_code,
    profile_id,
  }: {
    invite_code: string;
    profile_id: string;
  }): Promise<Server | undefined> => {
    try {
      const { data: server, error: findError } = await supabase
      .from("servers")
      .select("*")
      .eq("invite_code", invite_code)
      .single();

    if (findError || !server) {
      console.error("Không tìm thấy server từ invite_code:", findError);
      return;
    
    } 
     // Kiểm tra xem đã là thành viên chưa
    const { data: existingMember } = await supabase
      .from("members")
      .select("*")
      .eq("profile_id", profile_id)
      .eq("server_id", server.id)
      .single();

    if (existingMember) {
      console.warn("Đã là thành viên server");
      return server;
    }
    const {  error: insertError } = await supabase
      .from("members")
      .insert({
        profile_id: profile_id,
        server_id: server.id,
        role:"GUEST",
      })
    

    if (insertError) {
      console.error("Lỗi khi thêm thành viên:", insertError);
      return;
    }

      await mutate();

      return server;
    } catch (error) {
      console.log(error);
    }
  };

  const editServer = async ({
    serverId,
    name,
    image,
  }: {
    serverId: string;
    name: string;
    image: File;
  }) => {
    try {
      console.log({ name, image });
      const formData = new FormData();
      formData.append("name", name);
      if (image) formData.append("image", image);

      await axiosInstance.patch(`/rest/v1/servers/${serverId}`, formData);

      await mutate();
    } catch (error) {
      console.log(error);
    }
  };

  return {
    servers,
    error,
    isLoading,
    createServer,
    joinServer,
    editServer,
  };
};