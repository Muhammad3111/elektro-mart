import type { Category } from "./category";
import type { Brand } from "./brand";

export interface Specification {
  id: string;
  productId: string;
  labelUz: string;
  labelRu: string;
  valueUz: string;
  valueRu: string;
  order: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  commentUz?: string;
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
  nameUz: string;
  nameRu: string;
  descriptionUz: string;
  descriptionRu: string;

  // Pricing
  price: number;
  oldPrice?: number;
  discount?: number;

  // Media
  images: string[];
  mainImage?: string;

  // Relations IDs
  categoryId: string;
  subcategoryId?: string;
  brandId?: string;

  // Status
  isActive: boolean;
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
  // Main data
  nameUz: string;
  nameRu: string;
  descriptionUz?: string;
  descriptionRu?: string;

  // Pricing
  price: number;
  oldPrice?: number;
  discount?: number;

  // Media
  mainImage?: File | string;
  images?: (File | string)[];

  // Relations IDs
  categoryId: string;
  subcategoryId?: string;
  brandId?: string;

  // Status
  isActive?: boolean;
  isNew?: boolean;
  inStock?: boolean;
  stockQuantity: number;

  // Order & SEO
  order?: number;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];

  // Specifications (create/update)
  specifications?: Array<{
    labelUz: string;
    labelRu: string;
    valueUz: string;
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
  search?: string;
  categoryId?: string;
  subcategoryId?: string;
  categories?: string[];
  brandId?: string;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  isNew?: boolean;
  hasDiscount?: boolean;
  inStock?: boolean;
  isActive?: boolean;
  sortBy?: SortByOption;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
}
