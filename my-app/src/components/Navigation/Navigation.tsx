"use client";
import { useSupabase } from "@/hooks";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CreateButton from "../Create-button";
import { CreateServer } from "../modals";
import { ModeToggle } from "./Mode-toggle";
export default function Navigation() {
  const { getCurrentUser } = useSupabase();
  const router = useRouter();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [createServer, setCreateServer] = useState(false);
  const Avatarref = useRef<HTMLDivElement>(null);
  const Popupref = useRef<HTMLDivElement>(null);
  const handleClickAvatar = () => {
    setShow(!show);
  };
  const handleLogout = () => {
    setShow(false);
    router.push("/");
  };
  const handlecreate = () => {
    setCreateServer(!createServer);
  };
  useEffect(() => {
    const userLoad = async () => {
      const data = await getCurrentUser();
      setAvatar(data?.avatar_url);
    };
    userLoad();
  }, [getCurrentUser]);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        (Popupref.current &&
          !Popupref.current.contains(event.target as Node)) ||
        (Avatarref.current && !Avatarref.current.contains(event.target as Node))
      ) {
        setShow(false);
        setCreateServer(false);
      }
    }

    if (show || createServer) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, createServer]);

  if (!avatar) return <div>Đang tải ...</div>;
  return (
    <div className="h-screen w-[100px] flex flex-col border-r-2 ">
      <div className="flex items-center justify-center p-4 border-b-2">
        <CreateButton onClick={handlecreate} className="rounded-full " />
      </div>
      <div className="image-server items-center justify-center flex-1">
        <Image
          src={"/Logoapp.webp"}
          alt="Logo"
          width={80}
          height={70}
          className="rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
        />
        <div className="p-2 "> </div>
      </div>
      <div className="flex flex-col justify-center items-center border-t-2 p-2">
        <button
          className="image-account items-center justify-center "
          onClick={handleClickAvatar}
        >
          <Image
            src={avatar}
            alt="Logo-account"
            width={60}
            height={50}
            className="rounded-full"
          />
        </button>
        <div className=" mt-2">
          <ModeToggle />
        </div>
        <div></div>
        {show && (
          <div
            ref={Avatarref}
            className={`absolute left-16 bg-gray-500 border z-50 p-2 rounded text-lg transition-all duration-200 transform ${
              show
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            <button onClick={handleLogout} className="hover:opacity-80">
              Sign out
            </button>
          </div>
        )}
      </div>
      {createServer && (
        <div
          ref={Popupref}
          className={`absolute left-16 bg-gray-500 border z-50 p-2 rounded text-lg transition-all duration-200 transform ${
            show
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <CreateServer />
        </div>
      )}
    </div>
  );
}
