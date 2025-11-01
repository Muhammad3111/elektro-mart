/**
 * Banners API Module
 * Bannerlar bilan ishlash uchun barcha API funksiyalari
 */

import { apiRequest } from "./client";
import { uploadImage } from "./upload";

export interface Banner {
  id: string;
  title: string;
  titleRu: string;
  position: "top" | "sidebar" | "bottom";
  image: string;
  link?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBannerDto {
  title: string;
  titleRu: string;
  position: "top" | "sidebar" | "bottom";
  image: File | string;
  link?: string;
}

export interface UpdateBannerDto {
  title?: string;
  titleRu?: string;
  position?: "top" | "sidebar" | "bottom";
  image?: File | string;
  link?: string;
  isActive?: boolean;
}

export const bannersAPI = {
  /**
   * Barcha bannerlarni olish
   */
  getAll: () => apiRequest<Banner[]>("/banners"),

  /**
   * Bitta bannerni ID bo'yicha olish
   */
  getById: (id: string) => apiRequest<Banner>(`/banners/${id}`),

  /**
   * Yangi banner yaratish
   */
  create: async (data: CreateBannerDto) => {
    const payload = { ...data };

    // Agar image File bo'lsa, upload qilish
    if (data.image instanceof File) {
      const uploadResult = await uploadImage(data.image);
      payload.image = uploadResult.url;
    }

    return apiRequest<Banner>("/banners", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Bannerni yangilash
   */
  update: async (id: string, data: UpdateBannerDto) => {
    const payload = { ...data };

    // Agar image File bo'lsa, upload qilish
    if (data.image instanceof File) {
      const uploadResult = await uploadImage(data.image);
      payload.image = uploadResult.url;
    }

    return apiRequest<Banner>(`/banners/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Bannerni o'chirish
   */
  delete: (id: string) =>
    apiRequest<{ message: string }>(`/banners/${id}`, {
      method: "DELETE",
    }),
};
