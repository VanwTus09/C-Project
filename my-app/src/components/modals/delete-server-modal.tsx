"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal, useServers } from "@/hooks";
import { supabase } from "@/lib/supabase/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const DeleteServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isModalOpen = isOpen && type === "deleteServer";
  console.log("Modal state:", isOpen, type, data);

  const { server } = data;
  const { servers } = useServers();
  console.log(
    "isOpen:",
    isOpen,
    "type:",
    type,
    "isModalOpen:",
    isModalOpen,
    "server:",
    server
  );

  const handleConfirm = async () => {
    if (!server) return;
    setIsLoading(true);
    try {
      await supabase.from("servers").delete().eq("id", server.id);

      onClose();
      const remainingServers = servers?.filter((s) => s.id !== server.id) ?? [];
      if (remainingServers.length > 0) {
        router.push(`/servers/${remainingServers[0].id}`);
      } else {
        router.push("/"); // nếu không còn server nào
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Delete Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure to do this? <br />
            Server{" "}
            <span className="font-semibold text-indigo-500">
              #{server?.name}
            </span>{" "}
            will be permanently deleted
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <Button
              disabled={isLoading}
              variant="ghost"
              className="cursor-pointer border-none"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              variant="default"
              className="cursor-pointer"
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
