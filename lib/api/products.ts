/**
 * Products API Module
 * Mahsulotlar bilan ishlash uchun barcha API funksiyalari
 */

import { apiRequest } from "./client";
import { uploadImage } from "./upload";

export interface Product {
  id: string;
  name: string;
  nameRu: string;
  description?: string;
  descriptionRu?: string;
  price: number;
  stock: number;
  categoryId: string;
  image?: string;
  images?: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductDto {
  name: string;
  nameRu: string;
  description?: string;
  descriptionRu?: string;
  price: number;
  stock: number;
  categoryId: string;
  image?: File | string;
  images?: (File | string)[];
}

export type UpdateProductDto = Partial<CreateProductDto>;

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

export const productsAPI = {
  /**
   * Barcha mahsulotlarni olish (pagination bilan)
   */
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    sortBy?: string;
  }) => apiRequest<ProductsResponse>("/products", { params }),

  /**
   * Bitta mahsulotni ID bo'yicha olish
   */
  getById: (id: string) => apiRequest<Product>(`/products/${id}`),

  /**
   * Yangi mahsulot yaratish
   */
  create: async (data: CreateProductDto) => {
    const payload = { ...data };

    // Agar image File bo'lsa, upload qilish
    if (data.image instanceof File) {
      const uploadResult = await uploadImage(data.image);
      payload.image = uploadResult.url;
    }

    return apiRequest<Product>("/products", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Mahsulotni yangilash
   */
  update: async (id: string, data: UpdateProductDto) => {
    const payload = { ...data };

    // Agar image File bo'lsa, upload qilish
    if (data.image instanceof File) {
      const uploadResult = await uploadImage(data.image);
      payload.image = uploadResult.url;
    }

    return apiRequest<Product>(`/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Mahsulotni o'chirish
   */
  delete: (id: string) =>
    apiRequest<{ message: string }>(`/products/${id}`, {
      method: "DELETE",
    }),
};
