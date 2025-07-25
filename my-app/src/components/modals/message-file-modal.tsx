"use client";

import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useDirectMessage, useMessage, useModal } from "@/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  image: z.union([
    z.instanceof(File, { message: "A valid image file is required" }),
    z.literal("").refine(() => false, {
      message: "Image is required",
    }),
  ]),
});

export function MessageFileModal() {
  const router = useRouter();
  const { isOpen, onClose, type, data } = useModal();
  const { createMessage } = useMessage();
  const { createDirectMessage } = useDirectMessage();

  const isModalOpen = isOpen && type === "messageFile";
  const { body } = data;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: ""  ,
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };
  
  const isLoading = form.formState.isSubmitting;
  const isDirectMessage = !!body?.conversationId
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    
    if (!body) return;

    if (!isDirectMessage) {
      await createMessage({
        fileUrl: values.image,
        channelId: body.channelId,
        serverId: body.serverId,
      });
    } else{
      await createDirectMessage({
        fileUrl: values.image,
        conversationId: body.conversationId,
      });
    }

    form.reset();
    router.refresh();
    handleClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Add an attachment
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Send an image as a message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button
                className="cursor-pointer"
                variant={"default"}
                disabled={isLoading}
              >
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};