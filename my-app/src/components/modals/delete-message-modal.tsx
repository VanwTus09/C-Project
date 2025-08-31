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
import { useDirectMessage, useMessage, useModal } from "@/hooks";
// import { useParams } from "next/navigation";
import { useState } from "react";

export const DeleteMessageModal = () => {
  // const params = useParams()
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onClose, type, data } = useModal();
  const socketBody = data?.body;
  const paramValue = data?.apiUrl?.split("/").pop();

  const { deleteMessage } = useMessage();
  const { deleteDirectMessage } = useDirectMessage();

  const isModalOpen = isOpen && type === "deleteMessage";
  const isDirectMessage = !!socketBody?.conversationId;
  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      if (!paramValue) {
        console.warn("pramvalue null", paramValue);
        return; // check id hợp lệ
      }
      if (!isDirectMessage) {
        await deleteMessage({
          messageId: paramValue,
          channelId: socketBody?.channelId,
        });
      } else {
        await deleteDirectMessage({
          directMessageId: paramValue,
          conversationId: socketBody?.conversationId,
        });
      }

      onClose();
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
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure to do this? <br />
            The message will be permanently deleted
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <Button
              disabled={isLoading}
              variant="ghost"
              className="cursor-pointer border shadow-2xl"
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
