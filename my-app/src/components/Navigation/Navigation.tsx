"use client";
import { useSupabase } from "@/hooks";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CreateButton from "../Create-button";
export default function Navigation() {
  const { getCurrentUser } = useSupabase();
  const router = useRouter();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const Popupref = useRef<HTMLDivElement>(null);
  const handleClickAvatar = () => {
    setShow(!show);
  };
  const handleLogout = () => {
    setShow(false);
    router.push("/");
  };
  const handlecreate = () =>{
     console.log('chỗ ni cho 1 cái dialog')
  }
  useEffect(() => {
    const userLoad = async () => {
      const data = await getCurrentUser();
      setAvatar(data?.avatar_url);
    };
    userLoad();
  }, [getCurrentUser]);
  if (!avatar) return <div>Đang tải avatar...</div>;
  return (
    <div className="h-screen w-[100px] flex flex-col border-r-2 ">
      <div>
        <CreateButton onClick={handlecreate}/>
      </div>
      <div className="image-server items-center justify-center flex-1">
        <Image
          src={"/Logoapp.webp"}
          alt="Logo"
          width={70}
          height={70}
          className="rounded-full "
        />
      </div>
      <div className="flex justify-center">
        <button
          className="image-account items-center justify-center pl-2"
          onClick={handleClickAvatar}
        >
          <Image
            src={avatar}
            alt="Logo-account"
            width={70}
            height={70}
            className="rounded-full"
          />
        </button>
        {show && (
          <div
            ref={Popupref}
            className="absolute left-16 bg-gray-500 border z-50 p-2 rounded text-lg"
          >
            <button onClick={handleLogout} className="hover:opacity-80">
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
