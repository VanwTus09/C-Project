"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useModal, useOrigin } from "@/hooks";
import { supabase } from "@/lib/supabase/supabase";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
export const InviteModal = () => {
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const origin = useOrigin();
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isModalOpen = isOpen && type === "invite";
  const { server } = data;

  const inviteUrl = `${origin}/invite/${server?.invite_code}`;
  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const handleGenerateNewLink = async () => {
    if (!server) return;

    try {
      setIsLoading(true);
      const newinvite_code = uuidv4(); // hoặc mày có thể tự gen theo format riêng

      const { data, error } = await supabase
        .from("servers")
        .update({ invite_code: newinvite_code })
        .eq("id", server.id)
        .select()
        .single();

      if (error) throw error;

      onOpen("invite", { server: data }); // cập nhật lại invite modal
    } catch (error) {
      console.error("Failed to generate new invite code:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="text-sx dark:text-secondary/70 font-bold text-zinc-500 uppercase">
            Server invite link
          </Label>
          <div className="mt-2 flex items-center gap-x-2">
            <Input
              disabled={isLoading}
              className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
              value={inviteUrl}
              readOnly
            />
            <Button
              disabled={isLoading}
              className="cursor-pointer"
              size="icon"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Button
            onClick={handleGenerateNewLink}
            disabled={isLoading}
            variant="link"
            size="sm"
            className="mt-4 cursor-pointer text-xs text-zinc-500"
          >
            Generate a new link
            <RefreshCw className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
