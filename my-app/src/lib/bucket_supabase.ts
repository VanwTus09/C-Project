import { supabase } from "@/lib/supabase/supabase";

export const uploadImageToSupabase = async (file: File, userId: string) => {
  if (!file.type.startsWith("image/")) {
    console.error("File không phải là ảnh.");
    return null;
  }

  if (file.size > 5 * 1024 * 1024) {
    console.error("Ảnh quá lớn (tối đa 5MB).");
    return null;
  }

  const fileExt = file.name.split(".").pop();
  const filePath = `${userId}-${Date.now()}.${fileExt}`; // ✅ CHỈ file name, KHÔNG prefix bucket

  const { error } = await supabase.storage
    .from("server.images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type, // ✅ thêm MIME type
    });

  if (error) {
    console.error("Lỗi khi upload ảnh lên Supabase:", error.message);
    return null;
  }

  const { data } = supabase.storage
    .from("server.images")
    .getPublicUrl(filePath);

  return data?.publicUrl ?? null;
};
