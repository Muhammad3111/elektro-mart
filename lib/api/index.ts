/**
 * API Index
 * Barcha API modullarni export qilish
 */

// Base client
export { apiRequest } from "./client";
export type { ApiRequestOptions } from "./client";

// Upload
export { uploadImage, uploadImages } from "./upload";
export type { UploadResponse } from "./upload";

// Categories
export { categoriesAPI } from "./categories";

// Products
export { productsAPI } from "./products";
export type { Product, CreateProductDto, UpdateProductDto, ProductsResponse, QueryProductDto } from "@/types/product";

// Users
export { usersAPI } from "./users";
export type { User, CreateUserDto, UpdateUserDto } from "./users";

// Sliders
export { slidersAPI } from "./sliders";
export type { Slider, CreateSliderDto, UpdateSliderDto } from "./sliders";

// Banners
export { bannersAPI } from "./banners";
export type { Banner, CreateBannerDto, UpdateBannerDto } from "./banners";

// Auth
export { authAPI, getToken, setToken, removeToken } from "./auth";

// Brands
export { brandsAPI } from "./brands";
