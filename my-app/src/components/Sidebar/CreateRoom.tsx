"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
}

export default function CreateRoom({ onClose }: { onClose: () => void }) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase.from("users").select("id, email");
      if (data && user) {
        setUsers(data.filter((u) => u.id !== user.id)); // Bỏ mình ra
      }
    };
    fetchUsers();
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const createRoom = async () => {
    setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const memberIds = [user.id, ...selectedIds];

    if (selectedIds.length < 2) {
      setError("Cần chọn ít nhất 2 người để tạo nhóm.");
      return;
    }

    const name = groupName.trim() || generateGroupName();

    const { data: room, error: insertError } = await supabase
      .from("Room")
      .insert({ name })
      .select("*")
      .single();

    if (insertError || !room) {
      setError("Không thể tạo nhóm.");
      return;
    }

    await supabase
      .from("Room_user")
      .insert(memberIds.map((id) => ({ room_id: room.id, user_id: id })));

    onClose();
    router.push(`/chat/${room.id}`);
  };

  const generateGroupName = () => {
    const names = users
      .filter((u) => selectedIds.includes(u.id))
      .map((u) => u.email.split("@")[0]);
    return names.join(", ");
  };

  return (
    <div className="p-4 border-t space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Tạo nhóm chat</h2>
        <button onClick={onClose} className="text-gray-500">✕</button>
      </div>

      <input
        placeholder="Tên nhóm (tùy chọn)"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />

      <div>
        <label className="font-semibold">Chọn thành viên:</label>
        <div className="max-h-40 overflow-y-auto border rounded p-2 mt-1 space-y-1">
          {users.map((u) => (
            <label key={u.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedIds.includes(u.id)}
                onChange={() => toggleSelect(u.id)}
              />
              <span>{u.email}</span>
            </label>
          ))}
        </div>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
        onClick={createRoom}
      >
        Tạo nhóm
      </button>
    </div>
  );
}
