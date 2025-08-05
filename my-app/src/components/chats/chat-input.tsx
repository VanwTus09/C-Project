"use client";

import EmojiPicker from "@/components/emoji-picker";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useDirectMessage, useMessage, useModal } from "@/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface ChatInputProps {
  type: "conversation" | "channel";
  name: string;
  apiUrl: string;
  body: {
    channelId?: string;
    conversationId?: string;
    memberId?: string;
    serverId?: string;
  };
}

const formSchema = z.object({
  content: z.string().trim().min(1, "message cannot be empty"),
});

export const ChatInput = ({ type, name, apiUrl, body }: ChatInputProps) => {
  const { onOpen } = useModal();
  const { createMessage } = useMessage();
  const { createDirectMessage } = useDirectMessage();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      if (apiUrl === `/rest/v1/messages`) {
        await createMessage({
          content: value.content,
          channelId: body.channelId,
          memberId: body.memberId,
        });
      } else if (apiUrl === `/rest/v1/direct_messages`) {
        await createDirectMessage({
          content: value.content,
          memberId: body.memberId,
          conversationId: body.conversationId,
        });
      }

      form.reset({ content: "" });
    } catch (error) {
      console.log ("Failed to send messages",error);
    }
    console.log("chatinput", value )
    console.log("body của chatinput ", body)
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    className="absolute top-7 left-8 flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded-full bg-zinc-500 p-1 transition hover:bg-zinc-600 dark:bg-zinc-400 dark:hover:bg-zinc-300"
                    onClick={() => onOpen("messageFile", { body, apiUrl })}
                  >
                    <Plus className="text-white dark:text-[#313338] hover:scale-115" />
                  </button>
                  <Input
                    {...field}
                    disabled={isLoading}
                    placeholder={`Send message to ${
                      type === "conversation" ? name : "#" + name
                    }`}
                    className="border-0  bg-zinc-200/90 px-14 py-6 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
                  />
                  <div className="absolute top-7 right-8">
                    <EmojiPicker
                      onChange={(emoji: string) =>
                        field.onChange(`${field.value}${emoji}`)
                      }
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        ></FormField>
      </form>
    </Form>
  );
};
