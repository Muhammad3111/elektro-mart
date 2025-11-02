/**
 * Users API Module
 * Foydalanuvchilar bilan ishlash uchun barcha API funksiyalari
 */

import { apiRequest } from "./client";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: "admin" | "user";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email?: string;
  password: string;
  phone: string;
  role?: "admin" | "user";
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  phone?: string;
  role?: "admin" | "user";
  isActive?: boolean;
}

export const usersAPI = {
  /**
   * Barcha foydalanuvchilarni olish (GET /users)
   */
  getAll: async (): Promise<User[]> => {
    return apiRequest<User[]>("/users", {
      method: "GET",
    });
  },

  /**
   * Bitta foydalanuvchini ID bo'yicha olish
   */
  getById: (id: string) => apiRequest<User>(`/users/${id}`),

  /**
   * Yangi foydalanuvchi yaratish (POST /auth/register)
   */
  register: async (data: CreateUserDto): Promise<User> => {
    return apiRequest<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Foydalanuvchini yangilash (Admin only)
   */
  update: (id: string, data: UpdateUserDto) =>
    apiRequest<User>(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  /**
   * Foydalanuvchini o'chirish
   */
  delete: (id: string) =>
    apiRequest<{ message: string }>(`/users/${id}`, {
      method: "DELETE",
    }),
};
