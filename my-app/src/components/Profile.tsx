'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';

interface ProfileProps {
  googleAvatarUrl: string;
}

export default function Profile({ googleAvatarUrl }: ProfileProps) {
  const [cloudinaryUrl, setCloudinaryUrl] = useState('');

  useEffect(() => {
    const uploadAvatar = async () => {
      try {
        const res = await axios.post('/rest/v1/profiles', {
          imageUrl: googleAvatarUrl,
          folder: 'users',
        });

        if (res.data?.result?.secure_url) {
          setCloudinaryUrl(res.data.result.secure_url);
        }
      } catch (err) {
        console.error('Failed to upload avatar', err);
      }
    };

    uploadAvatar();
  }, [googleAvatarUrl]);

  return (
    <div className="p-4">
      {cloudinaryUrl ? (
        <Image
          src={cloudinaryUrl}
          alt="User Avatar"
          width={100}
          height={100}
          className="rounded-full"
        />
      ) : (
        <p>Loading avatar...</p>
      )}
    </div>
  );
}
