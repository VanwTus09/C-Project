"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChatHeader, ChatInput, ChatMessages } from "@/components/chats";
import { MediaRoom } from "@/components/media-room";
import {
  useAuth,
  useChannelByChannelId,
  useMembersByServerIdIfMember,
} from "@/hooks";
import { ChannelType, Member } from "@/models";

const ChannelIdPage = () => {
  const router = useRouter();
  const params = useParams<{ serverId: string ,channelId: string }>();

  const {profile,isLoading: profileLoading } = useAuth();
  const { channel, isLoading: channelLoading } = useChannelByChannelId(
    params.channelId,
    params.serverId
  );
  const { members , isLoading: memberLoading , membersByProfileId } = useMembersByServerIdIfMember(
   params.serverId
  );
  const isLoading = profileLoading || channelLoading || memberLoading;
// Lấy member hiện tại dựa theo profile.id
const currentMember: Member | undefined = useMemo(() => {
    if (!profile?.id || !membersByProfileId) return undefined;
    return membersByProfileId[profile.id];
  }, [profile?.id, membersByProfileId]);    
  // Điều hướng nếu không hợp lệ
  useEffect(() => {
    if (isLoading) return;
    if (!channel || !currentMember) {
      router.push(`/servers/${params.serverId}`);
    }
  }, [isLoading, channel, members, router, params.serverId, currentMember] );
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">
          Đang tải dữ liệu...
        </p>
      </div>
    );
  }
  if (!channel || !members ) { // đã test có channel và member
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-destructive">Không thể truy cập kênh này.</p>
      </div>
    );
  }
  const socketProps = {
    channelId: channel.id,
    memberId: currentMember?.id,
  };
  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        type="channel"
        serverId={params.serverId}
        name={channel?.name}
      />
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            type="channel"
            chatId={channel.id}
            name={channel.name}
            member={currentMember}
            apiUrl="rest/v1/messages"
            paramKey="channel"
            paramValue={channel.id}
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
      <>
        <MediaRoom chatId={channel.id} video={false} audio={true} />
        {console.log("Rendering AUDIO MediaRoom", channel)}
        </>
      )}

      {channel.type === ChannelType.VIDEO && (
        <MediaRoom chatId={channel.id} video={true} audio={true} />
      )}
    </div>
    
  );
};

export default ChannelIdPage;
