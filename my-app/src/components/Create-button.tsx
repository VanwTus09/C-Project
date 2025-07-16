"use client";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
export default function CreateButton({
  onClick,
  className,
}: {
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        onClick={onClick}
        className={cn(
          "group relative flex items-center justify-center w-18 h-17 rounded-2xl bg-[#292B2F] text-white transition duration-300 ease-in-out",
          "hover:scale-110 hover:bg-green-500",
          "shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_20px_rgba(0,255,100,0.4)]",
          className
        )}
      >
        <Plus
          className="w-6 h-6 transition-transform duration-300 cursor-pointer ease-in-out group-hover:rotate-180"
          strokeWidth={3}
        />
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-lg ">Create new server</p>
      </TooltipContent>
    </Tooltip>
  );
}
