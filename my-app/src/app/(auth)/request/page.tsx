'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { InitialModal } from '@/components/modals';
import { useAuth } from '@/hooks';
import { useLoading } from '@/components/providers';

export default function AuthRequest() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { profile } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const {showLoading,hideLoading} = useLoading()

  useEffect(() => {
    const checkAndRedirect = async () => {
      showLoading("Chờ chút nhée")
      if (!profile) {
        setLoading(false);
        return;
      }
      const { data: servers } = await supabase
        .from('servers')
        .select('id, channels(id)')
        .eq('profile_id', profile.id)
        .order('created_at', { ascending: true });

      if (!servers || servers.length === 0 ) {
        setShowModal(true);
        setLoading(false);
        return;
      }

      const firstServer = servers[0];
      const firstChannel = firstServer.channels[0];
      hideLoading()
      router.replace(`/servers/${firstServer.id}/channels/${firstChannel.id}`);
    };

    checkAndRedirect();
  }, [profile, supabase, router,showLoading,hideLoading]);

  if (loading) {
  showLoading()}


  return (
    <>
      {showModal && (
        <InitialModal
          onServerCreated={async (serverId: string) => {
            // Lấy channel đầu tiên sau khi tạo server
            const { data: channel } = await supabase
              .from('channels')
              .select('id')
              .eq('server_id', serverId)
              .order('created_at', { ascending: true })
              .limit(1)
              .single();

            if (channel) {
              router.replace(`/servers/${serverId}/channels/${channel.id}`);
            }
          }}
        />
      )}
    </>
  );
}
