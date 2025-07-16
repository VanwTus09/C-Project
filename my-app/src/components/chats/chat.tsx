import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";

export default function Chats() {
  return (
    <div className="flex flex-col h-screen">
      <div className="h-16 bg-gray-500 flex items-center justify-center border-b-2 m-2">
        <ChatHeader />
      </div>
      <div className="flex-1">Content</div>
      <div>
        <ChatInput />
      </div>
    </div>
  );
}
