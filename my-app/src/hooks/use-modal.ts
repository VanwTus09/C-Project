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
      .from("servers")
      .select("id, name, image_url, profile_id, invite_code, created_at , updated_at")
      .eq("profile_id", profile_id);

    if (!error && data) {
      set({ servers: data.map(s => ({ id: s.id, name: s.name, imageUrl: s.image_url, invite_code:s.invite_code , updated_at:s.updated_at, created_at:s.created_at, profile_id:s.profile_id})) });
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