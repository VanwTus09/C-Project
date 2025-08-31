"use client";

import {
  CreateChannelModal,
  CreateServerModal,
  DeleteChannelModal,
  DeleteMessageModal,
  InviteModal,
  LeaveServerModal,
  MembersModal,
  MessageFileModal,
} from "@/components/modals";
import { useEffect, useState } from "react";
import { DeleteServerModal } from "../modals/delete-server-modal";

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {children}
      <CreateServerModal />
      <MembersModal />
      <DeleteChannelModal />
      <InviteModal/>
      <MessageFileModal />
      <DeleteMessageModal />
      <CreateChannelModal/>
      <LeaveServerModal/>
      <DeleteServerModal/>
    </>
  );
};
