// Menu items.

import { SidebarHeader } from "./Sidebar-header";
import { SearchSidebar } from "./Sidebar-search";

export default function AppSidebar() {
  return (
    <div className="h-screen p-4 space-y-4 w-full  ">
      <div className="flex items-center justify-between mb-4 shadow-md p-5 rounded">
        <SidebarHeader />
      </div>
      <div className=" justify-between items-center">
        <div>
          <SearchSidebar />
        </div>

        <div className="space-y-2">Text Conversation </div>
        <div>Voice</div>
        <div>Call Video</div>
        <div>Participants</div>
      </div>
    </div>
  );
}
