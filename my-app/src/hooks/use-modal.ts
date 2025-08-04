"use client"

import { supabase } from "@/lib/supabase/supabase";
import {
  Channel,
  ChannelTypeEnum,
  Server,
  ServerWithChannelWithMember,
} from "@/models";
import { KeyedMutator } from "swr";
import { create } from "zustand";

export type ModalType =
  | "createServer"
  | "invite"
  | "editServer"
  | "members"
  | "createChannel"
  | "leaveServer"
  | "deleteServer"
  | "deleteChannel"
  | "editChannel"
  | "messageFile"
  | "deleteMessage";

interface ModalData {
  server?: Server;
  channel?: Channel;
  channelType?: ChannelTypeEnum | string;
  apiUrl?: string;
  query?: {
    channelId?: string;
    serverId?: string;
    conversationId?: string;
  };
  body?: {
    channelId?: string;
    serverId?: string;
    conversationId?: string;
  };
  mutateServerByServerId?: KeyedMutator<ServerWithChannelWithMember>;
}
interface ServerStore {
  servers: Server[];
  setServers: (servers: Server[]) => void;
  fetchServers: (profile_id: string) => Promise<void>;
}

export const useServerStore = create<ServerStore>((set) => ({
  servers: [],
  setServers: (servers) => set({ servers }),
  fetchServers: async (profile_id: string) => {
  const { data, error } = await supabase
    .from("members")
    .select(`
      server:server_id (
        id, name, image_url, profile_id, invite_code, created_at, updated_at
      )
    `)
    .eq("profile_id", profile_id);

  if (!error && data) {
    const servers = data.map((e) => e.server
      // id: e.server.id,
      // name: e.server.name,
      // image_url: e.server.image_url,
      // profile_id: e.server.profile_id,
      // invite_code: e.server.invite_code,
      // created_at: e.server.created_at,
      // updated_at: e.server.updated_at,
    ).flat();
    set({ servers });
  }
}

}));
interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));