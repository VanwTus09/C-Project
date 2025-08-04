// _providers/swr-provider.tsx
"use client";
import { axiosInstance } from "@/api";
import { supabase } from "@/lib/supabase/supabase";
import { useEffect, useState } from "react";
import {  SWRConfig } from "swr";

export function SWRProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const MILISECOND_PER_HOUR = 60 * 60 * 1000;
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setToken(data.session?.access_token ?? null);
      setIsReady(true);
    });
  }, []);

  const fetcher = async (url: string) => {
    if (!token) throw new Error("No token");

    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}${url}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
      }
      
    );
    return res.data[0];
  };

  if (!isReady) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground text-sm">
        Đang tải...
      </div>
    );
  }
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        dedupingInterval: MILISECOND_PER_HOUR,
        shouldRetryOnError: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}
