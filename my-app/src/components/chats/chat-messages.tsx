"use client";

import { Fragment, useRef } from "react";
import { Loader2, ServerCrash } from "lucide-react";
import { format } from "date-fns";

import { ChatItem, ChatWelcome } from "@/components/chats";
import { useChatQuery, useChatScroll } from "@/hooks";
import { MemberWithProfile, MessageWithMemberWithProfile } from "@/models";
import { useChatRealtime } from "@/hooks/use-chat-realtime";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

interface ChatMessagesProps {
  type: "channel" | "conversation";
  chatId: string;
  name: string;
  member?: MemberWithProfile;
  apiUrl: string;
  paramKey: "channel" | "conversation";
  paramValue?: string;
  socketQuery: {
    channelId?: string;
    serverId?: string;
    conversationId?: string;
  };
  socketBody: {
    channelId?: string;
    serverId?: string;
    conversationId?: string;
  };
}

export const ChatMessages = ({
  type,
  chatId,
  name,
  member,
  paramKey,
  paramValue,
  socketQuery,
  socketBody,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;
  const chatRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  console.log("tú check lỗi ", paramKey, paramValue);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      paramKey,
      paramValue,
    });
  useChatRealtime({
    channelId: chatId,
    queryKey,
    paramKey,
    paramValue,
  });
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages[0]?.messages.length ?? 0,
  });

  if (status === "pending") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500 mb-2" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <ServerCrash className="h-6 w-6 text-zinc-500 mb-2" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div ref={chatRef} className="flex flex-1 flex-col overflow-y-auto py-4">
      {!hasNextPage && (
        <>
          <div className="flex-1" />
          <ChatWelcome type={type} name={name} />
        </>
      )}

      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="my-4 h-5 w-5 animate-spin text-zinc-500" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="my-4 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            >
              Load previous messages
            </button>
          )}
        </div>
      )}

      <div className="mt-auto flex flex-col-reverse">
        {data?.pages.map((group, i) => (
          <Fragment key={i}>
            {group.messages?.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                currentMember={member}
                member={message.member}
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timestamp={
                  message.createdAt
                    ? format(new Date(message.createdAt), DATE_FORMAT)
                    : ""
                }
                isUpdated={message.updatedAt !== message.createdAt}
                paramValue={message.id}
                socketQuery={socketQuery}
                socketBody={socketBody}
              />
            ))}
          </Fragment>
        ))}
      </div>

      <div ref={bottomRef} />
    </div>
  );
};
