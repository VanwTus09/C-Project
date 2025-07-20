// app/_providers/swr-provider.tsx hoặc tương đương
"use client";
import { supabase } from "@/lib/supabase/supabase";
import { SWRConfig } from "swr";

export function SWRProvider({ children }: { children: React.ReactNode }) {
  const fetcher = async (url: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const token = session?.access_token;

    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      },
    });
    if (!res.ok) throw new Error("Request failed");

    const data = await res.json();
    return data;
  };

  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateIfStale: false,
        revalidateOnFocus: false,
        shouldRetryOnError: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}
