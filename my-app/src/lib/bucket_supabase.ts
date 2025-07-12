import { supabase } from "@/lib/supabase";

export const uploadImageToSupabase = async (file: File, userId: string) => {
  const fileExt = file.name.split(".").pop();
  const filePath = `avatars/${userId}-${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    console.error("❌ Lỗi khi upload ảnh lên Supabase:", error.message);
    return null;
  }

  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
  return data.publicUrl;
};
