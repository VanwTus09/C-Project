import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import { supabase } from "@/lib/supabase/supabase";
import { Profile } from "@/models";

export const AvatarOptions = ({profile}:{profile:Profile}) => {
  const imageUrl = profile?.image_url;
  const onLogout = async () => {
  try {
    await supabase.auth.signOut();
    location.replace("/"); 
  } catch (error) {
    console.log(error);
  }
  }
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