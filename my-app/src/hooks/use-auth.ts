"use client";

import { Profile } from "@/models";
import { supabase } from "@/lib/supabase/supabase";
import useSWR, { SWRConfiguration } from "swr";

/**
 * Fetch profile of current logged-in user
 */
const fetchProfile = async (): Promise<Profile | null> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) throw userError ?? new Error("No user");

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single(); // lấy một profile duy nhất nghe tú

  if (error) throw error;

  return data;
};

/**
 * Custom hook to get the current user's profile
 */
export const useAuth = (
  options?: SWRConfiguration<Profile | null>
) => {
  const {
    data: profile,
    error,
    isLoading,
  } = useSWR<Profile | null>("/profile", fetchProfile, {
    revalidateOnFocus: false,
    ...options,
  });

  return { profile, error, isLoading };
};
