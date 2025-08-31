"use client";

import { cn } from "@/lib/utils";
import { MemberWithProfile, Role } from "@/models";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { UserAvatar } from "@/components/user-avatar";
import { useAuth, useConversation, useMembersByServerIdIfMember } from "@/hooks";
import { toast } from "sonner";

interface ServerMemberProps {
  member: MemberWithProfile;
}

const roleIconMap = {
  [Role.GUEST]: null,
  [Role.MODERATOR]: <ShieldCheck className="ml-2 h-4 w-4 text-indigo-500" />,
  [Role.ADMIN]: <ShieldAlert className="ml-2 h-4 w-4 text-rose-500" />,
};
// currentmember tính theo profile_id
export const SidebarMember = ({ member }: ServerMemberProps) => {
  const params = useParams<{
    channelId: string;
    serverId: string;
    memberId:string;
  }>();
  const router = useRouter();
  const {profile} = useAuth()
  const icon = roleIconMap[member.role];
   const { getConversationByMembers, createConversation } = useConversation(params.serverId);
  const { members } = useMembersByServerIdIfMember(params.serverId);
  // console.log(params, "params");
  // console.log(server?.profile_id, 'id của current')
  const memberList = Object.values(members)
  const CurrentMember = memberList.find(
  (member) => member.profile_id  === profile?.id
);

  
  // console.log(profile, 'members có s ở sidebar')
  // console.log(member.id, "memberid"); //27c
  

  
  const handleClick = async () => {
    if(!CurrentMember) return
    if(CurrentMember.id === member.id) return
   try {
      const existingConversation  = await getConversationByMembers(
        CurrentMember.id,
        member.id 
      );
      if(existingConversation) {
        router.push(`/servers/${params.serverId}/conversations/${member.id}`);
      } else{
          const newConversation = await createConversation(
          CurrentMember.id,
          member.id
        );

        if (newConversation) {
          router.push(
            `/servers/${params.serverId}/conversations/${newConversation.id}`,
          );
      }}
    } 
    catch (error) {
        const message =
          error instanceof Error ? error.message : "Something went wrong";
        toast.error(message);
      }
    }
      {
      
  };

  // chỗ ni nó nhận biết đc là profile của admin
  return (
    <button
      onClick={handleClick}
      className={cn(
        "group mb-1 flex w-full cursor-pointer items-center gap-x-2 rounded-md px-2 py-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50",
        params.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <UserAvatar
        src={member.profile.image_url}
        className="h-8 w-8 md:h-8 md:w-8"
      />
      <p
        className={cn(
          "text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300",
          params.memberId === member.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {member.profile.name}
      </p>
      {icon}
    </button>
  );
};
