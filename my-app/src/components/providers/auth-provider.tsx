'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createContext, useState, ReactNode } from 'react';

type SupabaseContextType = {
  supabase: SupabaseClient;
};

export const SupabaseContext = createContext<SupabaseContextType | null>(null);

// 2. AuthProvider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState(() =>
    createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
}


