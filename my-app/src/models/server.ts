import { ApiResponse } from "./api-res";
import { Channel, MemberWithProfile } from "@/models";

export interface Server extends ApiResponse {
  name: string;
  imageUrl: string;
  invite_code: string;
  profile_id: string;
}

export interface ServerWithChannelWithMember extends Server {
  channels: Channel[];
  members: MemberWithProfile[];
}

export interface ServerWithChannel extends Server {
  channels: Channel[];
}