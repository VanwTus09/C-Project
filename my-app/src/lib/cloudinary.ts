import axios from "axios";

export const uploadToCloudinaryFromUrl = async (imageUrl: string): Promise<string | null> => {
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  const formData = new FormData();
  formData.append("file", imageUrl); // upload từ URL ảnh
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData
    );
    return response.data.secure_url;
  } catch (err) {
    console.error("❌ Lỗi khi upload ảnh lên Cloudinary:", err);
    return null;
  }
};