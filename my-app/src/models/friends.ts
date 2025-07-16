import { ApiResponse } from "./api-res";

export interface Friends extends ApiResponse {
    requester_id : string; // Unique identifier for the friend relationship
    addressee_email: string; // Email address of the requester
    status: string; // Status of the friend request (e.g., pending, accepted, rejected)
}