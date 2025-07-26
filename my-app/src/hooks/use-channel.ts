
"use client";
import { axiosInstance } from "@/api/axiosIntance";
import { Channel, Server } from "@/models";
import { useServerByServerId } from "./use-server-by-id";
import { supabase } from "@/lib/supabase/supabase";

export const useChannel = (serverId: string) => {
  const { mutate } = useServerByServerId(serverId);

  const createChannel = async (
    serverId: string,
    values: { name: string; type: string },
  ) => {
    await supabase.from("channels")
    .insert({...values,server_id : serverId})
    .single();

    await mutate();
  };

  const editChannel = async (
    server: Server,
    channel: Channel,
    values: { name: string; type: string },
  ) => {
    await axiosInstance.patch(
      `/rest/v1/servers/${server.id}/channels/${channel.id}`,
      values,
    );

    await mutate();
  };

  const deleteChannel = async (server: Server, channel: Channel) => {
    await axiosInstance.delete(
      `/rest/v1/servers/${server.id}/channels/${channel.id}`,
    );

    await mutate();
  };

  return {
    createChannel,
    editChannel,
    deleteChannel,
  };
};