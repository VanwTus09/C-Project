"use client";

import { ActionTooltip } from "@/components/action-tooltip";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

interface NavigationItemProps {
  id: string;
  image_url: string;
  name: string;
  priorityImageUrl: boolean;
}

export const NavigationItem = ({
  id,
  image_url,
  name,
  priorityImageUrl,
}: NavigationItemProps) => {
  const params = useParams();
  const router = useRouter();

  const onClick = () => {
    router.push(`/servers/${id}`);
  };

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button
        onClick={onClick}
        className="group relative flex cursor-pointer items-center"
      >
        <div
          className={cn(
            "bg-primary absolute left-0 w-[4px] rounded-r-full transition-all",
            params?.serverId !== id && "group-hover:h-[20px]",
            params?.serverId === id ? "h-[46px]" : "h-[8px]"
          )}
        />
        <div
          className={cn(
            "group  relative mx-3 flex h-[72px] w-[72px] overflow-hidden rounded-[24px] transition-all",
            params?.serverId === id &&
              "bg-primary/10 text-primary rounded-[16px]"
          )}
        >
          {image_url ? (
            <Image
              fill
              priority={!!priorityImageUrl}
              sizes="72px"
              src={image_url}
              alt="Channel"
            />
          ) : null}
        </div>
      </button>
    </ActionTooltip>
  );
};
