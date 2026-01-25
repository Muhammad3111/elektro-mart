import { apiRequest } from "./client";
import type {
    HomeSlider,
    CreateHomeSliderDto,
    UpdateHomeSliderDto,
} from "@/types/slider";

export const homeSlidersAPI = {
    /**
     * Barcha home sliderlarni olish
     */
    getAll: () => apiRequest<HomeSlider[]>("/home-sliders"),

    /**
     * Faqat active home sliderlarni olish
     */
    getActive: () => apiRequest<HomeSlider[]>("/home-sliders/active"),

    /**
     * Bitta home sliderni ID bo'yicha olish
     */
    getById: (id: string) => apiRequest<HomeSlider>(`/home-sliders/${id}`),

    /**
     * Yangi home slider yaratish
     */
    create: (data: CreateHomeSliderDto) =>
        apiRequest<HomeSlider>("/home-sliders", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    /**
     * Home sliderni yangilash
     */
    update: (id: string, data: UpdateHomeSliderDto) =>
        apiRequest<HomeSlider>(`/home-sliders/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),

    /**
     * Home sliderni o'chirish
     */
    delete: (id: string) =>
        apiRequest<{ message: string; deletedId: string; deletedName: string }>(
            `/home-sliders/${id}`,
            {
                method: "DELETE",
            },
        ),

    /**
     * Home sliderlar tartibini o'zgartirish
     */
    reorder: (ids: string[]) =>
        apiRequest<HomeSlider[]>("/home-sliders/reorder", {
            method: "PUT",
            body: JSON.stringify({ ids }),
        }),
};
