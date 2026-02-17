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

const TOKEN_KEY = "access_token";
const TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function getCookieToken(): string | null {
  if (typeof document === "undefined") return null;

  const prefix = `${TOKEN_KEY}=`;
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(prefix));

  if (!cookie) return null;
  const rawValue = cookie.slice(prefix.length);
  return rawValue ? decodeURIComponent(rawValue) : null;
}

function setTokenCookie(token: string): void {
  if (typeof document === "undefined" || typeof window === "undefined") return;

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = [
    `${TOKEN_KEY}=${encodeURIComponent(token)}`,
    "Path=/",
    `Max-Age=${TOKEN_MAX_AGE_SECONDS}`,
    "SameSite=Strict",
    secure,
  ].join("; ");
}

function removeTokenCookie(): void {
  if (typeof document === "undefined" || typeof window === "undefined") return;

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = [
    `${TOKEN_KEY}=`,
    "Path=/",
    "Max-Age=0",
    "SameSite=Strict",
    secure,
  ].join("; ");
}

// Token management
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;

  const localToken = localStorage.getItem(TOKEN_KEY);
  if (localToken) {
    setTokenCookie(localToken);
    return localToken;
  }

  const cookieToken = getCookieToken();
  if (cookieToken) {
    localStorage.setItem(TOKEN_KEY, cookieToken);
    return cookieToken;
  }

  return null;
};

export const setToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
    setTokenCookie(token);
  }
};

export const removeToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    removeTokenCookie();
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
