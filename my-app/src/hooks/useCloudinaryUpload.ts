// src/hooks/useCloudinaryUpload.ts
"use client"

import axios from "axios";

export const useCloudinaryUpload = () => {
    
  const upload = async (fileOrUrl: File): Promise<string | null> => {
    const formData = new FormData();
    const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
    // Trường hợp là File upload trực tiếp
    formData.append("file", fileOrUrl);
    formData.append("upload_preset", UPLOAD_PRESET); // 

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      );console.log(response)
      return response.data.secure_url;
      
    } catch (error) {
      console.error(" Cloudinary Upload Error:", error);
      return null;
    }
    
  };

  return { upload };
};
