import { SupabaseContext } from "@/components/providers";
import { useContext } from "react";

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabase must be used within an AuthProvider");
  }

  const { supabase } = context;

  const getCurrentUser = async () => {
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;
  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return data; // chứa avatar_url từ DB
};
  return {
    ...context,
    getCurrentUser,
    
  };
}
