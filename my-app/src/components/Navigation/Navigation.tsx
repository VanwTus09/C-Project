"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { supabase } from "@/lib/supabase/supabase";
import { AvatarOptions } from "@/components/avatar-options";
import { ModeToggle } from "./Mode-toggle";
import { NavigationAction, NavigationItem } from "@/components/Navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { useAuth } from "@/hooks";
import { Server } from "@/models";
type PartialServer = Pick<Server, 'id' | 'name' | 'imageUrl'>;

export const Navigation = () => {
  const router = useRouter();
  const { profile, isLoading: profileLoading } = useAuth();

  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!profile) {
        setLoading(false);
        return router.replace("/");
      }

      const { data, error } = await supabase
        .from("servers")
        .select("id, name, image_url, profile_id")
        .eq("profile_id", profile.id);

      if (error) {
        console.error("Error fetching servers:", error.message);
        setServers([]);
      } else {
        const formatted :PartialServer[]= (data).map((server) => ({
          id: server.id,
          name: server.name,
          imageUrl: server.image_url, 
        }));
        setServers(formatted as Server[]);
      }

      setLoading(false);
    };

    if (!profileLoading) {
      loadData();
    }
  }, [profile, profileLoading, router]);

  if (profileLoading || loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="text-primary flex h-full w-full flex-col items-center space-y-4 bg-[#E3E5E8] py-3 dark:bg-[#1E1F22]">
      <NavigationAction />

      <Separator className="mx-auto h-[2px] w-10 rounded-md bg-zinc-300 dark:bg-zinc-700" />

      <ScrollArea className="scrollbar-none w-full flex-1 overflow-y-auto">
        {servers.map((server, index) => (
          <div key={server.id} className="mb-4">
            <NavigationItem
              id={server.id}
              name={server.name}
              imageUrl={server?.imageUrl}
              priorityImageUrl={index === 0 ? server.imageUrl : ""}
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
