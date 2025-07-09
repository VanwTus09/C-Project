'use client' 
import { SWRConfig } from 'swr';
import { axiosInstance } from '@/api';


export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: (url) => axiosInstance.get(url).then((res) => res.data),
        revalidateOnFocus: false,
        shouldRetryOnError: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}