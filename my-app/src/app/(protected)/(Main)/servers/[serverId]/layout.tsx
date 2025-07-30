"use client";
import { ServerSidebar } from "@/components/Sidebar";
import { useAuth , useServers } from "@/hooks";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

type Params = {
  serverId: string;
};

const ServerIdLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { serverId } = useParams<Params>();
  const { profile, isLoading: profileLoading } = useAuth();
  const { servers, isLoading: serverLoading } = useServers();

  useEffect(() => {
    if (profileLoading || serverLoading) return;
  }, [profile, servers, profileLoading, serverLoading, router]);

  if (profileLoading || serverLoading)
    return <div>...Loading </div>;
  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-20 h-full w-60 flex-col flex">
        <ServerSidebar serverId={serverId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerIdLayout;
