import { api } from "./apiService";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
}

export interface UserResponse {
  message: string;
  user: {
    id: string;
    username: string;
    [key: string]: any; // For any additional fields
  };
  token?: string;
}

export async function login(
  credentials: LoginCredentials
): Promise<UserResponse> {
  return api.post<UserResponse>("/users/login", credentials);
}

export async function register(
  credentials: RegisterCredentials
): Promise<UserResponse> {
  return api.post<UserResponse>("/users", credentials);
}
