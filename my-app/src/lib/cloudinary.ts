// /lib/cloudinary.ts
import axios from "axios";

export async function uploadToCloudinaryFromUrl(imageUrl: string): Promise<string | null> {
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
  const formData = new FormData();
    formData.append("file", imageUrl);
    formData.append("upload_preset", UPLOAD_PRESET);

  try {
    // Bước 2: Upload lên Cloudinary
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData
    );

    return response.data.secure_url;
  } catch (err) {
    console.error(" Upload thất bại:", err);
    return null;
  }
}
