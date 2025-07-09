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
// import { useRouter } from "next/router";
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
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
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

export const InitialModals = () => {
  const { upload } = useCloudinaryUpload();
  const router = useRouter();
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    let finalImageUrl = "";
    const uploaded = await upload(values.image);
    if (uploaded) {
      finalImageUrl = uploaded;
    } else {
      console.error("Upload thất bại");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        name: values.name,
        avatar_url: finalImageUrl,
      })
      .eq("id", user.id);

    if (!error) {
      router.push("/");
    }
  };

  const [, setIsMounted] = useState(false);
  // const router = useRouter();
  const Customform = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      image: "",
    },
  });
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
                  <FormLabel>Upload image here</FormLabel>
                  <FormControl>
                    <FileUpload value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
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
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="@abc" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
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
