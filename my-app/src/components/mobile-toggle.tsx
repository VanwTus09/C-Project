import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ServerSidebar } from "./Sidebar";
export const MobileToggle = ({ serverId }: { serverId: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer md:hidden"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-row gap-0 p-0">
        <SheetTitle className="sr-only">Navigation Mobile</SheetTitle>
        <SheetDescription className="sr-only">
          Navigation mobile menu toggle
        </SheetDescription>
        <div className="w-[72px]">
          <Navigation />
        </div>
        <ServerSidebar  serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
};