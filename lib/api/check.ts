/**
 * Check API
 * Mavjudlikni tekshirish uchun API funksiyalari
 */

import { apiRequest } from "./client";

export interface CheckResponse {
    exists: boolean;
    field: string;
    value: string;
}

export const checkAPI = {
    // Product checks
    product: {
        sku: (value: string) =>
            apiRequest<CheckResponse>(
                `/check/product/sku?value=${encodeURIComponent(value)}`,
            ),
        slug: (value: string) =>
            apiRequest<CheckResponse>(
                `/check/product/slug?value=${encodeURIComponent(value)}`,
            ),
    },

    // Category checks
    category: {
        name: (value: string) =>
            apiRequest<CheckResponse>(
                `/check/category/name?value=${encodeURIComponent(value)}`,
            ),
    },

    // Brand checks
    brand: {
        name: (value: string) =>
            apiRequest<CheckResponse>(
                `/check/brand/name?value=${encodeURIComponent(value)}`,
            ),
    },

    // User checks
    user: {
        email: (value: string) =>
            apiRequest<CheckResponse>(
                `/check/user/email?value=${encodeURIComponent(value)}`,
            ),
        phone: (value: string) =>
            apiRequest<CheckResponse>(
                `/check/user/phone?value=${encodeURIComponent(value)}`,
            ),
    },

    // Slider checks
    slider: {
        title: (value: string) =>
            apiRequest<CheckResponse>(
                `/check/slider/title?value=${encodeURIComponent(value)}`,
            ),
    },

    // Banner checks
    banner: {
        title: (value: string) =>
            apiRequest<CheckResponse>(
                `/check/banner/title?value=${encodeURIComponent(value)}`,
            ),
    },
};
