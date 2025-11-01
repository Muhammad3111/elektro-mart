import { apiRequest } from "./client";
import { Brand, CreateBrandDto, UpdateBrandDto } from "@/types/brand";

export const brandsAPI = {
  // Public endpoints
  getAll: async (): Promise<Brand[]> => {
    return apiRequest<Brand[]>("/brands", {
      method: "GET",
    });
  },

  getAllActive: async (): Promise<Brand[]> => {
    return apiRequest<Brand[]>("/brands/active", {
      method: "GET",
    });
  },

  getById: async (id: string): Promise<Brand> => {
    return apiRequest<Brand>(`/brands/${id}`, {
      method: "GET",
    });
  },

  getProductCount: async (id: string): Promise<{ count: number }> => {
    return apiRequest<{ count: number }>(`/brands/${id}/product-count`, {
      method: "GET",
    });
  },

  // Admin endpoints
  create: async (data: CreateBrandDto): Promise<Brand> => {
    return apiRequest<Brand>("/brands", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: UpdateBrandDto): Promise<Brand> => {
    return apiRequest<Brand>(`/brands/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  toggleActive: async (id: string): Promise<Brand> => {
    return apiRequest<Brand>(`/brands/${id}/toggle-active`, {
      method: "PATCH",
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/brands/${id}`, {
      method: "DELETE",
    });
  },
};
