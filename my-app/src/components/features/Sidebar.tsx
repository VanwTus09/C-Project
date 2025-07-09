"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Profile from "./Profile";
import CreateRoom from "./CreateRoom"; // Nếu đã có file CreateRoom.tsx

interface Room {
  id: string;
  name: string;
  avatar?: string;
}

export default function Sidebar() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchRooms = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return router.push("/");

      const { data: joinedRooms } = await supabase
        .from("Room_user")
        .select("room:room_id ( id, name, avatar )") // Lấy thông tin từ bảng Room
        .eq("user_id", user.id);

      // if (error) {
      //   console.error("Error loading rooms:");
      //   return;
      // }
      const formatted = joinedRooms?.map((r) => r.room).flat() || [];
      setRooms(formatted);
    };

    fetchRooms();
  }, [router]);

  return (
    <aside className="w-64 bg-white border-r p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold mb-2">💬 Phòng Chat</h2>
        <button
          onClick={() => setShowCreate(true)}
          title="Tạo phòng mới"
          className="text-blue-500 text-2xl"
        >
          ➕
        </button>
      </div>

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

      {showCreate && <CreateRoom onClose={() => setShowCreate(false)} />}

      <Profile />
    </aside>
  );
}
