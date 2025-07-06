"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CreateRoom from "./CreateRoom";

interface Room {
  id: string;
  name: string;
  is_group: boolean;
}

export default function Sidebar() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchRooms = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return router.push("/");

      const { data } = await supabase
        .from("room_members")
        .select("room_id, rooms(name, is_group, id)")
        .eq("user_id", user.id);

      if (data) {
        const formatted = data.map((r) => r.rooms).flat();
        setRooms(formatted);
      }
    };

    fetchRooms();
  }, [router]);

  return (
    <aside className="w-64 bg-white border-r p-4 space-y-4">
      <h2 className="text-xl font-bold mb-4">💬 Phòng Chat</h2>
      <div className="space-y-2">
        {rooms.map((room) => (
          <Link
            href={`/chat/${room.id}`}
            key={room.id}
            className="block bg-gray-100 hover:bg-blue-100 px-4 py-2 rounded text-gray-800"
          >
            {room.name}
          </Link>
        ))}
      </div>
      <CreateRoom/>
    </aside>
  );
}
