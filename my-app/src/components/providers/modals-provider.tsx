"use client";

import {
  CreateServerModal,
  DeleteChannelModal,
  DeleteMessageModal,
  MembersModal,
  MessageFileModal,
} from "@/components/modals";
import { useEffect, useState } from "react";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateServerModal />
      <MembersModal />
      <DeleteChannelModal />
      <MessageFileModal />
      <DeleteMessageModal />
    </>
  );
};