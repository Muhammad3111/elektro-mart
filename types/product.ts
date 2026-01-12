import type { Category } from "./category";
import type { Brand } from "./brand";

export interface Specification {
    id: string;
    productId: string;
    labelEn: string;
    labelRu: string;
    valueEn: string;
    valueRu: string;
    order: number;
}

export interface Review {
    id: string;
    productId: string;
    userId: string;
    rating: number;
    commentEn?: string;
    commentRu?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Product {
    // IDs
    id: string;
    sku: string;
    productCode: string;
    slug: string;

    // Main data
    nameEn: string;
    nameRu: string;
    shortDescriptionEn?: string; // 50-150 characters for cards
    shortDescriptionRu?: string;
    descriptionEn: string; // 200-2000 characters for details
    descriptionRu: string;

    // Pricing
    price: number;
    oldPrice?: number;
    discount?: number;

    // Media (URL strings)
    coverImage?: string; // Main cover image URL
    galleryImages?: string[]; // Gallery images URLs (3-10)

    // Relations IDs
    categoryId: string;
    subcategoryId?: string;
    brandId?: string;

    // Status
    isActive: boolean;
    isFeatured: boolean; // Featured/recommended products
    isNew: boolean;
    inStock: boolean;
    stockQuantity: number;

    // Stats
    rating: number;
    reviewsCount: number;
    viewsCount: number;
    salesCount: number;

    // Order & SEO
    order: number;
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];

    // Relations (optional depending on endpoint)
    category?: Category;
    subcategory?: Category;
    brand?: Brand;
    specifications?: Specification[];
    reviews?: Review[];

    // Timestamps
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateProductDto {
    // Identifiers
    sku: string;
    productCode: string;

    // Main data
    nameEn: string;
    nameRu: string;
    shortDescriptionEn?: string; // 50-150 characters
    shortDescriptionRu?: string;
    descriptionEn: string;
    descriptionRu: string;

    // Pricing
    price: number;
    oldPrice?: number;
    discount?: number;

    // Media (URL strings only)
    coverImage?: string;
    galleryImages?: string[];

    // Relations IDs
    categoryId: string;
    subcategoryId?: string;
    brandId?: string;

    // Status
    isActive?: boolean;
    isFeatured?: boolean;
    isNew?: boolean;
    stockQuantity: number;

    // Order & SEO
    order?: number;
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];

    // Specifications (create/update)
    specifications?: Array<{
        labelEn: string;
        labelRu: string;
        valueEn: string;
        valueRu: string;
        order?: number;
    }>;
}

export type UpdateProductDto = Partial<CreateProductDto> & {
    // Allow slug update if needed
    slug?: string;
};

export interface ProductsResponse {
    data: Product[];
    total: number;
    page: number;
    limit: number;
}

export type SortByOption =
    | "price"
    | "name"
    | "rating"
    | "createdAt"
    | "viewsCount"
    | "salesCount"
    | "order";

export type SortOrder = "ASC" | "DESC";

export interface QueryProductDto {
    q?: string; // Search query parameter
    search?: string;
    categoryId?: string;
    subcategoryId?: string;
    categories?: string[];
    subcategories?: string[];
    brandId?: string;
    brands?: string[];
    minPrice?: number;
    maxPrice?: number;
    isNew?: boolean;
    hasDiscount?: boolean;
    inStock?: boolean;
    isActive?: boolean;
    isFeatured?: boolean;
    sortBy?: SortByOption;
    sortOrder?: SortOrder;
    page?: number;
    limit?: number;
}
