"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import dayjs from "@/lib/dayjs";

interface Message {
  id: number;
  content: string;
  user_email: string;
  created_at: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();
  const [isClient, setIsClient] = useState(false); // tránh lỗi hydration
  const [userInfo, setUserInfo] = useState<{ id: string; email: string } | null>(null);
  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return router.push("/");
      setUserInfo({ id: user.id, email: user.email! });
      setUserEmail(user.email!);

      // Load tin nhắn ban đầu
      const { data } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (data) setMessages(data as Message[]);

      // Realtime lắng nghe tin nhắn mới
      const channel = supabase
        .channel("realtime-messages")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
          },
          (payload) => {
            setMessages((prev) => [...prev, payload.new as Message]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    init();
  }, [router,userInfo]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    await supabase.from("messages").insert({
      content: input,
      user_email: userEmail,
    });

    setInput("");
  };


  if (!isClient) return null;

  return (
  <div className="flex flex-col h-screen bg-[#f7f8fa]">
    {/* Header */}
    <div className="bg-white px-6 py-3 shadow flex justify-between items-center border-b">
      <div className="text-lg font-semibold text-gray-800">💬 Phòng chat</div>
      <div className="text-sm text-gray-600">
        {userInfo?.email && <>👤 {userInfo.email}</>}
      </div>
    </div>

    {/* Chat messages */}
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      {messages.map((msg) => {
        const isMe = msg.user_email === userInfo?.id;
        return (
          <div
            key={msg.id}
            className={`max-w-lg p-3 rounded-xl ${
              isMe ? 'ml-auto bg-blue-100' : 'mr-auto bg-white'
            } shadow`}
          >
            <div className="text-sm font-medium text-gray-700">
              {isMe ? 'Bạn' : msg.user_email}
            </div>
            <div className="text-gray-800">{msg.content}</div>
            <div className="text-xs text-gray-500 text-right mt-1">
              {dayjs(msg.created_at).fromNow()}
            </div>
          </div>
        );
      })}
    </div>

    {/* Input */}
    <div className="bg-white border-t px-4 py-3 flex items-center gap-2">
      <input
        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
        placeholder="Nhập tin nhắn..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button
        onClick={sendMessage}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Gửi
      </button>
    </div>
  </div>
);

}
