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
  name: string;
  email: string;
  password: string;
  phone?: string;
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
   * Barcha foydalanuvchilarni olish
   */
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    apiRequest<{ data: User[]; total: number }>("/users", { params }),

  /**
   * Bitta foydalanuvchini ID bo'yicha olish
   */
  getById: (id: string) => apiRequest<User>(`/users/${id}`),

  /**
   * Yangi foydalanuvchi yaratish
   */
  create: (data: CreateUserDto) =>
    apiRequest<User>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),

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
