// 3. Hook để dùng context
'use client'

import { SupabaseContext } from "@/components/providers";
import { useContext } from "react";

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within an AuthProvider');
  }
  return context;
}