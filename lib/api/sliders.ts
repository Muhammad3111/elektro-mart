/**
 * Sliders API Module
 * Sliderlar bilan ishlash uchun barcha API funksiyalari
 */

import { apiRequest } from "./client";
import { uploadImage } from "./upload";

export interface Slider {
  id: string;
  title: string;
  titleRu: string;
  description?: string;
  descriptionRu?: string;
  image: string;
  link?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSliderDto {
  title: string;
  titleRu: string;
  description?: string;
  descriptionRu?: string;
  image: File | string;
  link?: string;
  order?: number;
}

export interface UpdateSliderDto {
  title?: string;
  titleRu?: string;
  description?: string;
  descriptionRu?: string;
  image?: File | string;
  link?: string;
  order?: number;
  isActive?: boolean;
}

export const slidersAPI = {
  /**
   * Barcha sliderlarni olish
   */
  getAll: () => apiRequest<Slider[]>("/sliders"),

  /**
   * Bitta sliderni ID bo'yicha olish
   */
  getById: (id: string) => apiRequest<Slider>(`/sliders/${id}`),

  /**
   * Yangi slider yaratish
   */
  create: async (data: CreateSliderDto) => {
    const payload = { ...data };

    // Agar image File bo'lsa, upload qilish
    if (data.image instanceof File) {
      const uploadResult = await uploadImage(data.image);
      payload.image = uploadResult.url;
    }

    return apiRequest<Slider>("/sliders", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Sliderni yangilash
   */
  update: async (id: string, data: UpdateSliderDto) => {
    const payload = { ...data };

    // Agar image File bo'lsa, upload qilish
    if (data.image instanceof File) {
      const uploadResult = await uploadImage(data.image);
      payload.image = uploadResult.url;
    }

    return apiRequest<Slider>(`/sliders/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Sliderni o'chirish
   */
  delete: (id: string) =>
    apiRequest<{ message: string }>(`/sliders/${id}`, {
      method: "DELETE",
    }),
};
