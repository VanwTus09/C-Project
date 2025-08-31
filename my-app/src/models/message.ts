import { ApiResponse } from "./api-res";
import { MemberWithProfile } from "./member";

export interface Message extends ApiResponse {
  content: string;
  fileUrl: string;
  deleted: boolean;
}

export interface MessageWithMemberWithProfile extends Message {
  channel_id: string;
  conversation_id : string,
  member: MemberWithProfile;
}