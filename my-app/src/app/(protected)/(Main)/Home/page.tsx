"use client";
import { ChatMessages } from "@/components/chats";
import { Navigation } from "@/components/Navigation";
import { ServerSidebar } from "@/components/Sidebar";
import { useChannelByChannelId } from "@/hooks/use-channel-by-channelid";
import { useState } from "react";

const Home = () => {
  // Giả sử serverId là "1", sau này bạn nên lấy động từ user context
const serverId = "1";

const { channel, isLoading } = useChannelByChannelId(serverId);

const [showSidebar, setShowSidebar] = useState(false);

if (isLoading || !channel) return <div>Loading...</div>;

  return (
    <>
      <div className="flex">
        <div className="hidden h-screen md:flex border-r flex-shrink-0">
          <div className="hidden md:flex w-[100px]">
            <Navigation />
          </div>
          <div className="hidden md:flex w-[300px]">
            <ServerSidebar serverId="" />
          </div>
        </div>
        {/* Sidebar mobile (overlay) */}
        {showSidebar && (
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setShowSidebar(false)}
          >
            <div
              className="absolute left-0 top-0 w-[300px] h-full bg-white shadow z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <Navigation />
              <ServerSidebar serverId="1" />
            </div>
          </div>
        )}
        <div className="flex-1 relative ">
          {/* ☰ Hamburger button chỉ hiện khi < md */}
          <button
            onClick={() => setShowSidebar(true)}
            className="md:hidden absolute top-4 left-4 z-50"
          >
            ☰
          </button>
          <div>
            <ChatMessages
    type="channel"
    chatId={channel.id}
    name={channel.name}
    member={undefined} // nếu bạn có current member thì truyền vào
    apiUrl="/api/messages"
    paramKey="channels"
    paramValue={channel.id}
    socketUrl="/realtime"
    socketQuery={{ channelId: channel.id, serverId }}
    socketBody={{ channelId: channel.id, serverId }}
  />
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
