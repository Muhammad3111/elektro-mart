import { apiRequest } from "./client";

export interface Favorite {
    id: string;
    productId: string;
    userId: string;
    createdAt: string;
}

export const favoritesAPI = {
    /**
     * Foydalanuvchining barcha sevimlilarini olish
     */
    getAll: () => apiRequest<Favorite[]>("/favorites"),

    /**
     * Sevimliga qo'shish
     */
    add: (productId: string) =>
        apiRequest<Favorite>("/favorites", {
            method: "POST",
            body: JSON.stringify({ productId }),
        }),

    /**
     * Sevimlidan o'chirish
     */
    delete: (productId: string) =>
        apiRequest<{ message: string; deletedId: string }>(
            `/favorites/${productId}`,
            {
                method: "DELETE",
            },
        ),
};
