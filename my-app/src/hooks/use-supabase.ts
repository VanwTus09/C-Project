"use client"

import { useContext } from "react";
import { SupabaseContext } from "@/components/providers";

// Hook chính để truy cập Supabase context
export function useSupabase() {
  const context = useContext(SupabaseContext);

  if (!context) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }

  const { supabase } = context;

  // Hàm lấy thông tin người dùng hiện tại kèm profile từ DB
  const getCurrentUser = async () => {
    // Bước 1: Lấy user từ auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("Error fetching auth user:", authError);
      return null;
    }

    if (!user) return null;

    // Bước 2: Lấy profile từ bảng profiles theo ID user
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      return null;
    }

    return {
      ...user,
      ...profile, // bao gồm avatar_url, username, v.v.
    };
  };

  return {
    getCurrentUser,
    ...context, // để giữ lại mọi thứ khác trong context (nếu có)
  };
}
