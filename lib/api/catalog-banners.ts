import { apiRequest } from "./client";
import type { CatalogBanner, CreateCatalogBannerDto, UpdateCatalogBannerDto } from "@/types/slider";

export const catalogBannersAPI = {
  /**
   * Barcha catalog bannerlarni olish
   */
  getAll: () => apiRequest<CatalogBanner[]>("/catalog-banners"),

  /**
   * Faqat active catalog bannerlarni olish
   */
  getActive: () => apiRequest<CatalogBanner[]>("/catalog-banners/active"),

  /**
   * Bitta catalog bannerni ID bo'yicha olish
   */
  getById: (id: string) => apiRequest<CatalogBanner>(`/catalog-banners/${id}`),

  /**
   * Yangi catalog banner yaratish
   */
  create: (data: CreateCatalogBannerDto) =>
    apiRequest<CatalogBanner>("/catalog-banners", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /**
   * Catalog bannerni yangilash
   */
  update: (id: string, data: UpdateCatalogBannerDto) =>
    apiRequest<CatalogBanner>(`/catalog-banners/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  /**
   * Catalog bannerni o'chirish
   */
  delete: (id: string) =>
    apiRequest<{ message: string }>(`/catalog-banners/${id}`, {
      method: "DELETE",
    }),

  /**
   * Catalog bannerlar tartibini o'zgartirish
   */
  reorder: (ids: string[]) =>
    apiRequest<CatalogBanner[]>("/catalog-banners/reorder", {
      method: "PUT",
      body: JSON.stringify({ ids }),
    }),
};
