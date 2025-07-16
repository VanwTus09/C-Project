"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  Form,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileUpload } from "../ui/file-upload";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { uploadImageToSupabase } from "@/lib/bucket_supabase";

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

export const CreateServer = () => {
  const router = useRouter();

  const Customform = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      image: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const uploadedUrl = await uploadImageToSupabase(
      values.image as File,
      user.id
    );

    // 1. Cập nhật tên user trong bảng profiles
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        server_name: values.name,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Lỗi cập nhật profile:", updateError.message);
      return;
    }

    // 2. Tạo server với ảnh vừa upload
    const { error: insertServerError } = await supabase.from("servers").insert({
      name: `${values.name}'s Server`,
      image_url: uploadedUrl,
      owner_id: user.id,
    });

    if (insertServerError) {
      console.error("Lỗi tạo server:", insertServerError.message);
      return;
    }

    router.push("/Home");
  };

  const [, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Dialog open>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Customize your server</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and an image. You can
            always change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...Customform}>
          <form
            className="space-y-8"
            onSubmit={Customform.handleSubmit(onSubmit)}
          >
            <FormField
              control={Customform.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload server image</FormLabel>
                  <FormControl>
                    <FileUpload value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormDescription>
                    This is the image for your personal server.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={Customform.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your name</FormLabel>
                  <FormControl>
                    <Input placeholder="@yourname" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public profile name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
