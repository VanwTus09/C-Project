"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { supabase } from "@/lib/supabase/supabase";

const formSchema = z.object({
  name: z.string().min(1, "Server name is required"),
  image: z.union([
    z.instanceof(File),
    z.literal("").refine(() => false, { message: "Image is required" }),
  ]),
});

type FormValues = z.infer<typeof formSchema>;

interface InitialModalProps {
  onServerCreated?: (serverId: string, channelId: string) => void;
}

export const InitialModal = ({ onServerCreated }: InitialModalProps) => {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      image: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

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

  const onSubmit = async (values: FormValues) => {
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

      const profileId = profileData.id;
      const file = values.image as File;
      const imageUrl = await uploadImage(file, user.id);
      const inviteCode = uuidv4();

      const { data: server, error: serverError } = await supabase
        .from("servers")
        .insert({
          name: values.name,
          image_url: imageUrl,
          invite_code: inviteCode,
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

      // 👉 Gọi callback nếu có
      if (onServerCreated) {
        onServerCreated(server.id, channel.id);
      } else {
        router.replace(`/servers/${server.id}/channels/${channel.id}`);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    }
  };

  return (
    <Dialog open>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a name and image. You can change it later.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 px-6 pb-6"
          >
            <div className="flex justify-center">
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
                  <FormLabel className="text-xs font-bold text-zinc-500 uppercase">
                    Server Name
                  </FormLabel>
                  <div className="flex">
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Enter a server name"
                        className="bg-zinc-300/50 text-black border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="ml-2"
                    >
                      {isLoading ? "Creating..." : "Create"}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
