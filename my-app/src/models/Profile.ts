import { ApiResponse } from "./api-res";

export interface Profile extends ApiResponse {
  id: string;   // Unique identifier for the profile
  name: string; // Username of the profile
  email: string; // Email associated with the profile
  avatar_url: string; // URL of the profile's avatar image
  servername: string; // Name of the server associated with the profile
  }          