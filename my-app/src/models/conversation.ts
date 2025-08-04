import { ApiResponse, MemberWithProfile } from "@/models";

export interface Conversation extends ApiResponse {
  member_one_id: string;
  member_two_id: string;
  memberOne: MemberWithProfile;
  memberTwo: MemberWithProfile;
}