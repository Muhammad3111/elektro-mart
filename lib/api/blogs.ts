/**
 * Blogs API Module
 * Bloglar bilan ishlash uchun barcha API funksiyalari
 */

import { apiRequest } from "./client";
import type {
    Blog,
    CreateBlogDto,
    UpdateBlogDto,
    BlogsResponse,
    QueryBlogDto,
} from "@/types/blog";

export const blogsAPI = {
    // Public endpoints
    getAll: (params?: QueryBlogDto) =>
        apiRequest<BlogsResponse>("/blogs", {
            params: params as unknown as Record<string, unknown>,
        }),

    getLatest: (limit?: number, featured?: boolean) =>
        apiRequest<Blog[]>("/blogs/latest", {
            params: {
                ...(limit && { limit }),
                ...(featured !== undefined && { featured: String(featured) }),
            },
        }),

    getById: (id: string) => apiRequest<Blog>(`/blogs/${id}`),

    getBySlug: (slug: string) => apiRequest<Blog>(`/blogs/slug/${slug}`),

    // Admin endpoints
    create: async (data: CreateBlogDto) => {
        return apiRequest<Blog>("/blogs", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    update: async (id: string, data: UpdateBlogDto) => {
        return apiRequest<Blog>(`/blogs/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    },

    toggleActive: (id: string, isActive: boolean) =>
        apiRequest<Blog>(`/blogs/${id}/toggle-active`, {
            method: "PATCH",
            body: JSON.stringify({ isActive }),
        }),

    delete: (id: string) =>
        apiRequest<{ message: string }>(`/blogs/${id}`, {
            method: "DELETE",
        }),
};
