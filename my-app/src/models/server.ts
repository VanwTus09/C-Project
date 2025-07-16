import { ApiResponse } from "./api-res";

export interface server extends ApiResponse {
  id: string;
  name: string; // Name of the server
  image_url: string; // URL of the server's image   
  owner_id: string; // ID of the user who owns the server
} // Unique identifier for the server