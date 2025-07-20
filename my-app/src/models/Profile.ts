import { ApiResponse } from "./api-res";

export interface Profile extends ApiResponse {
  userId: string;
  name: string;
  email: string;
  image_url: string;
}