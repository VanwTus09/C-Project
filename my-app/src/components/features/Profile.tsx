'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';

export default function Profile  ()  {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Lỗi khi lấy user:', error.message);
        return;
      }
      setUser(data.user);
    };

    fetchProfile();
  }, []);

  if (!user) return null;

  return (
    <div className="w-full p-4 mt-auto flex items-center gap-3 border-t border-gray-200">
      <Image
        src={'/default-avatar.jpg'}
        alt="Avatar"
        width={40}
        height={40}
        className="rounded-full"
      />
      <div className="text-sm font-medium truncate">{user.user_metadata.full_name}</div>
    </div>
  );
};
