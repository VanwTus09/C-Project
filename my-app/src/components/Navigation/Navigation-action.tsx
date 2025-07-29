"use client";

import { ActionTooltip } from "@/components/action-tooltip";
import { useModal } from "@/hooks";
import { Plus } from "lucide-react";
import { mutate } from "swr";

export const NavigationAction = () => {
  const { onOpen } = useModal();

  return (
    <div>
      <ActionTooltip side="right" align="center" label="Add a server">
        <button
          className="group flex cursor-pointer items-center"
          onClick={() =>
            onOpen("createServer", { mutateServerByServerId: mutate })
          }
        >
          <div className="bg-background mx-3 flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-[24px] transition-colors group-hover:rounded-[16px] group-hover:bg-emerald-500 dark:bg-neutral-700">
            <Plus
              className="text-emerald-500 transition group-hover:text-white"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};
