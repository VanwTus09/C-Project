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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useModal, useServers, useServerStore } from "@/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/lib/supabase/supabase";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required",
  }),
  image: z.union([
    z.instanceof(File, { message: "A valid image file is required" }),
    z.literal("").refine(() => false, {
      message: "Image is required",
    }),
  ]),
});

export const CreateServerModal = () => {
  const { isOpen, onClose, type } = useModal();
  const { createServer } = useServers();
  const router = useRouter();
  const uploadImage = async (file: File, userId: string) => {
    const path = `${userId}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("server.images")
      .upload(path, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from("server.images")
      .getPublicUrl(path);

    if (!urlData?.publicUrl) {
      throw new Error("Cannot get public URL of uploaded image");
    }

    return urlData.publicUrl;
  };
  const isModalOpen = isOpen && type === "createServer";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      image: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createServer({ name: values.name, image: values.image });
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("You are not authenticated");

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();
      if (profileError || !profileData) throw new Error("Profile not found");
      const { fetchServers } = useServerStore.getState();
      const profileId = profileData.id;
      const file = values.image as File;
      const image_url = await uploadImage(file, user.id);
      const invite_code = uuidv4();

      const { data: server, error: serverError } = await supabase
        .from("servers")
        .insert({
          name: values.name,
          image_url: image_url,
          invite_code: invite_code,
          profile_id: profileId,
        })
        .select("id")
        .single();
      if (serverError) throw serverError;

      await supabase.from("members").insert({
        role: "ADMIN",
        profile_id: profileId,
        server_id: server.id,
      });

      const { data: channel, error: channelError } = await supabase
        .from("channels")
        .insert({
          name: "general",
          type: "TEXT",
          profile_id: profileId,
          server_id: server.id,
        })
        .select("id")
        .single();
      if (channelError) throw channelError;

      toast.success("Server created!");

      router.replace(`/servers/${server.id}/channels/${channel.id}`);
      fetchServers(profileData.id);
      form.reset();
      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and an image. You can
            always change it later
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

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-secondary/70 text-xs font-bold text-zinc-500 uppercase">
                      Server Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter a server name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button
                className="cursor-pointer"
                variant={"default"}
                disabled={isLoading}
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
