/**
 * Products API Module
 * Mahsulotlar bilan ishlash uchun barcha API funksiyalari
 */

import { apiRequest } from "./client";
import { uploadImage, uploadImages } from "./upload";
import type {
  Product,
  CreateProductDto,
  UpdateProductDto,
  ProductsResponse,
  QueryProductDto,
} from "@/types/product";

export const productsAPI = {
  // Public endpoints
  getAll: (params?: QueryProductDto) =>
    apiRequest<ProductsResponse>("/products", { params: (params as unknown as Record<string, unknown>) }),

  getActive: (params?: QueryProductDto) =>
    apiRequest<ProductsResponse>("/products/active", { params: (params as unknown as Record<string, unknown>) }),

  getFeatured: (params?: QueryProductDto) =>
    apiRequest<ProductsResponse>("/products/featured", { params: (params as unknown as Record<string, unknown>) }),

  getNew: (params?: QueryProductDto) =>
    apiRequest<ProductsResponse>("/products/new", { params: (params as unknown as Record<string, unknown>) }),

  getPopular: (params?: QueryProductDto) =>
    apiRequest<ProductsResponse>("/products/popular", { params: (params as unknown as Record<string, unknown>) }),

  getWithDiscount: (params?: QueryProductDto) =>
    apiRequest<ProductsResponse>("/products/discount", { params: (params as unknown as Record<string, unknown>) }),

  search: (params?: QueryProductDto) =>
    apiRequest<ProductsResponse>("/products/search", { params: (params as unknown as Record<string, unknown>) }),

  getByCategory: (id: string, params?: QueryProductDto) =>
    apiRequest<ProductsResponse>(`/products/category/${id}`, { params: (params as unknown as Record<string, unknown>) }),

  getBySubcategory: (id: string, params?: QueryProductDto) =>
    apiRequest<ProductsResponse>(`/products/subcategory/${id}`, { params: (params as unknown as Record<string, unknown>) }),

  getByBrand: (id: string, params?: QueryProductDto) =>
    apiRequest<ProductsResponse>(`/products/brand/${id}`, { params: (params as unknown as Record<string, unknown>) }),

  getRelated: (id: string, params?: QueryProductDto) =>
    apiRequest<ProductsResponse>(`/products/related/${id}`, { params: (params as unknown as Record<string, unknown>) }),

  getById: (id: string) => apiRequest<Product>(`/products/${id}`),

  getBySlug: (slug: string) => apiRequest<Product>(`/products/slug/${slug}`),

  // Admin endpoints
  create: async (data: CreateProductDto) => {
    const payload: Record<string, unknown> = { ...data };

    // Upload main image if File
    if (data.mainImage instanceof File) {
      const uploaded = await uploadImage(data.mainImage);
      payload.mainImage = uploaded.url;
    }

    // Upload images if any Files present
    if (Array.isArray(data.images)) {
      const fileParts: File[] = data.images.filter(
        (i): i is File => i instanceof File
      );
      const stringParts: string[] = data.images.filter(
        (i): i is string => typeof i === "string"
      );
      if (fileParts.length > 0) {
        const uploaded = await uploadImages(fileParts);
        payload.images = [...stringParts, ...uploaded.map((u) => u.url)];
      }
    }

    return apiRequest<Product>("/products", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update: async (id: string, data: UpdateProductDto) => {
    const payload: Record<string, unknown> = { ...data };

    // Upload main image if File
    if (data.mainImage instanceof File) {
      const uploaded = await uploadImage(data.mainImage);
      payload.mainImage = uploaded.url;
    }

    // Upload images if any Files present
    if (Array.isArray(data.images)) {
      const fileParts: File[] = data.images.filter(
        (i): i is File => i instanceof File
      );
      const stringParts: string[] = data.images.filter(
        (i): i is string => typeof i === "string"
      );
      if (fileParts.length > 0) {
        const uploaded = await uploadImages(fileParts);
        payload.images = [...stringParts, ...uploaded.map((u) => u.url)];
      }
    }

    return apiRequest<Product>(`/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  toggleActive: (id: string) =>
    apiRequest<Product>(`/products/${id}/toggle-active`, {
      method: "PATCH",
    }),

  delete: (id: string) =>
    apiRequest<{ message: string }>(`/products/${id}`, {
      method: "DELETE",
    }),
};
