"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChatHeader, ChatInput, ChatMessages } from "@/components/chats";
import { MediaRoom } from "@/components/media-room";
import {
  useAuth,
  useChannelByChannelId,
  useServerByServerIdIfMember,
} from "@/hooks";
import { ChannelType } from "@/models";

const ChannelIdPage = () => {
  const router = useRouter();
  const params = useParams<{ serverId: string; channelId: string }>();

  const { profile, isLoading: profileLoading } = useAuth();
  const { channel, isLoading: channelLoading } = useChannelByChannelId(
    params.channelId,
    params.serverId
  );
  const { member, isLoading: memberLoading } = useServerByServerIdIfMember(
    params.serverId
  );

  const isLoading = profileLoading || channelLoading || memberLoading;

  // Điều hướng nếu không hợp lệ
  useEffect(() => {
    if (isLoading) return;
    
  }, [isLoading, profile, channel, member, router]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">
          Đang tải dữ liệu...
        </p>
      </div>
    );
  }

  if (!channel || !member) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-destructive">Không thể truy cập kênh này.</p>
      </div>
    );
  }

  const socketProps = {
    channelId: channel?.id,
    serverId: channel?.serverId,
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        type="channel"
        serverId={channel?.serverId}
        name={channel?.name}
      />

      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            type="channel"
            chatId={channel.id}
            name={channel.name}
            member={member?.member}
            apiUrl="/rest/v1/messages"
            paramKey="channels"
            paramValue={channel.id}
            socketUrl="/realtime"
            socketQuery={socketProps}
            socketBody={socketProps}
          />
          <ChatInput
            type="channel"
            name={channel.name}
            apiUrl="/rest/v1/messages"
            body={socketProps}
          />
        </>
      )}

      {channel.type === ChannelType.AUDIO && (
        <MediaRoom chatId={channel.id} video={false} audio={true} />
      )}

      {channel.type === ChannelType.VIDEO && (
        <MediaRoom chatId={channel.id} video={true} audio={true} />
      )}
    </div>
  );
};

export default ChannelIdPage;
