/**
 * Categories API Module
 * Kategoriyalar bilan ishlash uchun barcha API funksiyalari
 */

import { apiRequest } from "./client";
import { uploadImage } from "./upload";
import type {
    Category,
    CreateCategoryDto,
    UpdateCategoryDto,
} from "@/types/category";

export const categoriesAPI = {
    /**
     * Barcha kategoriyalarni olish
     */
    getAll: () => apiRequest<Category[]>("/categories"),

    /**
     * Faqat parent kategoriyalarni olish (ierarxik)
     */
    getHierarchy: () => apiRequest<Category[]>("/categories/hierarchy"),

    /**
     * Bitta kategoriyani ID bo'yicha olish
     */
    getById: (id: string) => apiRequest<Category>(`/categories/${id}`),

    /**
     * Kategoriyaning sub-kategoriyalarini olish
     */
    getSubCategories: (id: string) =>
        apiRequest<Category[]>(`/categories/${id}/subcategories`),

    /**
     * Yangi kategoriya yaratish
     * Agar image File bo'lsa, avval upload qilinadi
     */
    create: async (data: CreateCategoryDto) => {
        const payload = { ...data };

        // Agar image File bo'lsa, upload qilish
        if (data.image instanceof File) {
            const uploadResult = await uploadImage(data.image);
            payload.image = uploadResult.url;
        }

        return apiRequest<Category>("/categories", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    /**
     * Kategoriyani yangilash
     * Agar image File bo'lsa, avval upload qilinadi
     */
    update: async (id: string, data: UpdateCategoryDto) => {
        const payload = { ...data };

        // Agar image File bo'lsa, upload qilish
        if (data.image instanceof File) {
            const uploadResult = await uploadImage(data.image);
            payload.image = uploadResult.url;
        }

        return apiRequest<Category>(`/categories/${id}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        });
    },

    /**
     * Kategoriyani o'chirish
     */
    delete: (id: string) =>
        apiRequest<{ message: string }>(`/categories/${id}`, {
            method: "DELETE",
        }),
};
