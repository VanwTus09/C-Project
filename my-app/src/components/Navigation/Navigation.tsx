"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth, useServerStore } from "@/hooks";
import { NavigationAction } from "./Navigation-action";
import { ScrollArea } from "../ui/scroll-area";
import { NavigationItem } from "./nav-items";
import { Server } from "@/models";
import { AvatarOptions } from "../avatar-options";
import { ModeToggle } from "./Mode-toggle";

export const Navigation = () => {
  const params = useParams();
  const { profile, isLoading: profileLoading } = useAuth();

  const servers = useServerStore((state) => state.servers);
  const fetchServers = useServerStore((state) => state.fetchServers);

  useEffect(() => {
    if (!profileLoading && profile?.id) {
      fetchServers(profile.id);
    }
  }, [profileLoading, profile?.id, fetchServers]);

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary bg-gray-300 dark:bg-[#1e1f22] py-3">
      <NavigationAction />
      <ScrollArea className="flex-1 w-full">
        {servers.map((server: Server) => (
          <div key={server.id} className="mb-4">
            <NavigationItem
              id={server.id}
              image_url={server.image_url}
              name={server.name}
              priorityImageUrl={params?.serverId?.toString() === server.id}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="mt-auto flex flex-col items-center gap-y-4 pb-3">
        {profile && <AvatarOptions profile={profile} />}
        <ModeToggle />
      </div>
    </div>
  );
};
