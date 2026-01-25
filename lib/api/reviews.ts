import { apiRequest } from "./client";

export interface Review {
    id: string;
    productId: string;
    userId: string;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateReviewDto {
    productId: string;
    rating: number;
    comment: string;
}

export const reviewsAPI = {
    /**
     * Mahsulot uchun barcha reviewlarni olish
     */
    getByProduct: (productId: string) =>
        apiRequest<Review[]>(`/reviews/product/${productId}`),

    /**
     * Yangi review yaratish
     */
    create: (data: CreateReviewDto) =>
        apiRequest<Review>("/reviews", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    /**
     * Reviewni o'chirish
     */
    delete: (id: string) =>
        apiRequest<{ message: string; deletedId: string }>(`/reviews/${id}`, {
            method: "DELETE",
        }),
};
