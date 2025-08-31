
"use client";
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
    
    await supabase.from("channels").update({...values},).eq("id", channel.id)

    await mutate();
  };

  const deleteChannel = async (server: Server, channel: Channel) => {
    await supabase.from("channels").delete().eq("id",channel.id).select();

    await mutate();
  };

  return {
    createChannel,
    editChannel,
    deleteChannel,
  };
};