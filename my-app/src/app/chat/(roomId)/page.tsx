// app/chat/[roomId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import dayjs from '@/lib/dayjs';

interface Message {
  id: number;
  content: string;
  user_id: string;
  created_at: string;
}

export default function ChatRoomPage() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (data) setMessages(data);

      // Realtime
      const channel = supabase
        .channel(`room-${roomId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`,
        }, (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    init();
  }, [roomId]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    await supabase.from('messages').insert({
      content: input,
      room_id: roomId,
      user_id: userId,
    });

    setInput('');
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-xs p-3 rounded-lg shadow ${
              msg.user_id === userId ? 'ml-auto bg-blue-200' : 'mr-auto bg-gray-200'
            }`}
          >
            <div>{msg.content}</div>
            <div className="text-xs text-right text-gray-500">{dayjs(msg.created_at).fromNow()}</div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white flex gap-2 border-t">
        <input
          className="flex-1 px-4 py-2 border rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Nhập tin nhắn..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Gửi
        </button>
      </div>
    </div>
  );
}
