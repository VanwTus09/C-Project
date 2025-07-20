import axios from "axios";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SUPABASE_URL}`,
});

axiosInstance.interceptors.request.use(
  async function (config) {
    const supabase = createClientComponentClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
      config.headers.apikey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);
