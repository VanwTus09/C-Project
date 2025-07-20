'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import { supabase } from "@/lib/supabase/supabase";
import { useEffect , useState} from "react";

export const AvatarOptions = () => {
  const onLogout = async () => {
  try {
    await supabase.auth.signOut();
    location.replace("/"); 
  } catch (error) {
    console.log(error);
  }
  }
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvatar = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) return;

      // Option 1: Lấy từ bảng profiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("image_url")
        .eq("id", user.id)
        .single();

      if (profile?.image_url) {
        setImageUrl(profile.image_url);
      } else {
        // Option 2: fallback từ Google metadata
        setImageUrl(user.user_metadata.avatar_url);
      }
    };

    fetchAvatar();
  }, []);

  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full">
          <UserAvatar src={imageUrl ?? "/default-avatar.jpg"} className="cursor-pointer" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end">
        <DropdownMenuItem className="cursor-pointer" onClick={onLogout}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};