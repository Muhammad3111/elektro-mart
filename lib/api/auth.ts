/**
 * Auth API
 * Authentication endpoints
 */

import { apiRequest } from "./client";
import type {
  User,
  LoginDto,
  RegisterDto,
  AuthResponse,
  UpdateProfileDto,
  ChangePasswordDto,
} from "@/types/auth";

// Token management
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
};

export const setToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", token);
  }
};

export const removeToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
  }
};

// Get auth headers
const getAuthHeaders = (): Record<string, string> => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const authAPI = {
  /**
   * Register new user
   */
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    
    // Save token
    setToken(response.access_token);
    
    return response;
  },

  /**
   * Login user
   */
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    
    // Save token
    setToken(response.access_token);
    
    return response;
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<User> => {
    return apiRequest<User>("/auth/profile", {
      method: "GET",
      headers: getAuthHeaders(),
    });
  },

  /**
   * Update current user profile
   */
  updateProfile: async (data: UpdateProfileDto): Promise<User> => {
    return apiRequest<User>("/auth/profile", {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  /**
   * Change password
   */
  changePassword: async (data: ChangePasswordDto): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>("/auth/change-password", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  /**
   * Logout (client-side only)
   */
  logout: (): void => {
    removeToken();
  },
};
