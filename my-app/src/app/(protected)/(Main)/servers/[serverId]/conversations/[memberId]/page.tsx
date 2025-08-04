"use client";

import { ChatHeader, ChatInput, ChatMessages } from "@/components/chats";
import { MediaRoom } from "@/components/media-room";
import {
  useAuth,
  useMembersByServerIdIfMember,
} from "@/hooks";
import { useFetchConversation } from "@/hooks/use-fetch-conversation";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

const MemberIdPage = () => {
  const params = useParams<{
    memberId: string;
    serverId: string;
    member_one_id: string;
  }>();
  const searchParams = useSearchParams();
  const video = searchParams.get("video");
  const router = useRouter();
  const { profile, isLoading: profileLoading } = useAuth();
  const { members, isLoading: memberLoading } = useMembersByServerIdIfMember(
    params.serverId
  );
  const currentMember = members?.find((m) => m.profile_id === profile?.id);
  const { conversation, isLoading: conversationLoading } = useFetchConversation(
    params.memberId , currentMember?.id
  );
  console.log(currentMember, "curreneeee");
  console.log(conversation, 'conversation')
  const otherMember = useMemo(() => {
    if (!conversation || !currentMember) return null;
    return conversation.member_one_id === currentMember.id
      ? conversation.memberTwo
      : conversation.memberOne;
  }, [conversation, currentMember]);
  
  console.log(conversation?.member_one_id,'quỷ')
    console.log(conversation?.memberTwo,'quỷ cái 1')
    console.log(typeof(otherMember),'chịu')

  useEffect(() => {
    if (profileLoading || memberLoading || conversationLoading) return;
    if (!profile) return router.replace("/");
    if (!currentMember) return router.replace("/");
    if (!conversation) return router.replace(`/servers/${params.serverId}`);
  }, [
    profileLoading,
    memberLoading,
    conversationLoading,
    profile,
    router,
    currentMember,
    conversation,
    params.serverId,
  ]);

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      {otherMember && (
        <>
          <ChatHeader
            serverId={params.serverId}
            name={otherMember?.profile.name}
            type="conversation"
            image_url={otherMember?.profile.image_url}
          />
          {conversation && (
            <>
              {video && (
                <MediaRoom chatId={conversation.id} audio={true} video={true} />
              )}
              {!video && (
                <>
                  <ChatMessages
                    type="conversation"
                    chatId={conversation?.id}
                    name={otherMember.profile.name}
                    member={currentMember}
                    apiUrl="/rest/v1/direct_messages"
                    paramKey="conversation"
                    paramValue={conversation.id}
                    socketQuery={{
                      conversationId: conversation.id,
                    }}
                    socketBody={{
                      conversationId: conversation.id,
                    }}
                  />
                  <ChatInput
                    type="conversation"
                    name={otherMember.profile.name}
                    apiUrl="/rest/v1/messages"
                    body={{
                      conversationId: conversation.id,
                    }}
                    
                  />
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MemberIdPage;
