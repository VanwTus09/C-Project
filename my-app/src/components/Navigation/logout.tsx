'use client';
import Image from 'next/image';
export default function Logout ()  {

  return (
    <div className="w-full p-4 mt-auto flex items-center gap-3 border-t border-gray-200">
      <Image
        src={'/default-avatar.jpg'}
        alt="Avatar"
        width={40}
        height={40}
        className="rounded-full"
      />
     
    </div>
  );
};
