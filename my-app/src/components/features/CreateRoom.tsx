'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
}

export default function CreateRoom() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isGroup, setIsGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const loadUsers = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase.from('profiles').select('id, email');
      if (data && user) {
        setUsers(data.filter((u) => u.id !== user.id)); // Không hiển thị chính mình
      }
    };
    loadUsers();
  }, []);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((uid) => uid !== id));
    } else {
      const updated = [...selectedIds, id];
      setSelectedIds(updated);

      // Tự chuyển sang nhóm nếu chọn >1
      if (updated.length > 1) {
        setIsGroup(true);
      }
    }
  };

  const createRoom = async () => {
    setError('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (selectedIds.includes(user.id)) {
      setError('Không thể chọn chính bạn để tạo phòng.');
      return;
    }

    const memberIds = [user.id, ...selectedIds];

    if (!isGroup) {
      if (selectedIds.length !== 1) {
        setError('Phải chọn đúng 1 người để tạo chat 1-1.');
        return;
      }

      const { data } = await supabase.rpc('find_or_create_private_room', {
        user1: user.id,
        user2: selectedIds[0],
      });

      if (data) router.push(`/chat/${data}`);
    } else {
      if (selectedIds.length < 1 || !groupName.trim()) {
        setError('Nhóm phải có ít nhất 2 người và tên nhóm.');
        return;
      }

      const { data: room } = await supabase
        .from('rooms')
        .insert({ name: groupName.trim(), is_group: true })
        .select()
        .single();

      if (room) {
        await supabase.from('room_members').insert(
          memberIds.map((id) => ({ room_id: room.id, user_id: id }))
        );
        router.push(`/chat/${room.id}`);
      }
    }
  };

  return (
    <div className="p-4 border-t space-y-3">
      <div>
        <label className="font-semibold">Chế độ:</label>
        <div className="flex gap-2 mt-1">
          <button
            className={`px-3 py-1 rounded ${!isGroup ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => {
              setIsGroup(false);
              setGroupName('');
            }}
          >
            Chat 1-1
          </button>
          <button
            className={`px-3 py-1 rounded ${isGroup ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setIsGroup(true)}
          >
            Nhóm
          </button>
        </div>
      </div>

      {isGroup && (
        <input
          placeholder="Tên nhóm"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      )}

      <div>
        <label className="font-semibold">Chọn người:</label>
        <div className="max-h-40 overflow-y-auto border rounded p-2 mt-1 space-y-1">
          {users.map((u) => (
            <label key={u.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type={isGroup ? 'checkbox' : 'radio'}
                checked={selectedIds.includes(u.id)}
                onChange={() => toggleSelect(u.id)}
              />
              <span>{u.email}</span>
            </label>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}

      <button
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full"
        onClick={createRoom}
      >
        Tạo phòng
      </button>
    </div>
  );
}
