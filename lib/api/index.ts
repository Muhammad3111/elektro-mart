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
export type {
    Product,
    CreateProductDto,
    UpdateProductDto,
    ProductsResponse,
    QueryProductDto,
} from "@/types/product";

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

// Home Sliders
export { homeSlidersAPI } from "./home-sliders";
export { catalogBannersAPI } from "./catalog-banners";
export { statisticsAPI } from "./statistics";

// Orders
export { ordersAPI } from "./orders";
export type {
    Order,
    CreateOrderDto,
    UpdateOrderDto,
    OrderItem,
} from "@/types/order";

// Check API
export { checkAPI } from "./check";
export type { CheckResponse } from "./check";

// Reviews
export { reviewsAPI } from "./reviews";
export type { Review, CreateReviewDto } from "./reviews";

// Favorites
export { favoritesAPI } from "./favorites";
export type { Favorite } from "./favorites";

// Blogs
export { blogsAPI } from "./blogs";
export type {
    Blog,
    CreateBlogDto,
    UpdateBlogDto,
    BlogsResponse,
    QueryBlogDto,
} from "@/types/blog";
