"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSupabase } from "@/hooks";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
export const SidebarHeader = () => {
  const { getCurrentUser } = useSupabase();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setUser(user?.server_name || "Loading_User_error");
    };
    fetchUser();
  }, [getCurrentUser]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full text-2xl  flex items-center justify-between px-4 py-2 bg-gray-500 text-white hover:bg-gray-700">
        {user}
        <span>{}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="w-full">
          {" "}
          Leave Server
          <LogOut className="mr-2 h-4 w-f bg-red-500 " />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
