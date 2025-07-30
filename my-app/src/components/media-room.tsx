"use client";
import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  RoomContext,
} from "@livekit/components-react";
import { Room, Track } from "livekit-client";
import "@livekit/components-styles";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
  const [token, setToken] = useState("");
  const roomRef = useRef<Room | null>(null);
  const { profile, isLoading } = useAuth();

  useEffect(() => {
    if (!profile || isLoading) return;

    const name = profile.name;
    const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    if (!LIVEKIT_URL) {
      console.error("Missing Livekit URL");
      return;
    }

    let isMounted = true;

    const connectRoom = async () => {
      try {
        const res = await fetch(
          `/api/livekit?room=${chatId}&username=${encodeURIComponent(name)}`
        );
        const data = await res.json();
        if (!isMounted) return;

        if (data.token) {
          const room = new Room({
            adaptiveStream: true,
            dynacast: true,
          });

          await room.connect(LIVEKIT_URL, data.token);
          await room.localParticipant.setCameraEnabled(video);
          await room.localParticipant.setMicrophoneEnabled(audio);

          roomRef.current = room;
          setToken(data.token);
        }
      } catch (e) {
        console.error("Failed to connect to Livekit room:", e);
      }
    };

    connectRoom();
    return () => {
      isMounted = false;
      roomRef.current?.disconnect();
      roomRef.current = null;
    };
  }, [audio, chatId, isLoading, profile, video]);

  if (token === "")
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Loader2 className="my-4 h-7 w-7 animate-spin text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );

  return (
    <RoomContext.Provider value={roomRef.current!}>
      <div
        data-lk-theme="default"
        className="flex flex-1 flex-col overflow-hidden"
      >
        <MyVideoConference />
        <RoomAudioRenderer />
        <ControlBar />
      </div>
    </RoomContext.Provider>
  );
};

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <GridLayout tracks={tracks} className="flex-1">
      <ParticipantTile />
    </GridLayout>
  );
}
