// Home Slider types
export interface HomeSlider {
    id: string;
    titleEn: string;
    titleRu: string;
    subtitleEn: string;
    subtitleRu: string;
    coverImage: string;
    link: string;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateHomeSliderDto {
    titleEn: string;
    titleRu: string;
    subtitleEn: string;
    subtitleRu: string;
    coverImage: string;
    link: string;
    order?: number;
    isActive?: boolean;
}

export interface UpdateHomeSliderDto {
    titleEn?: string;
    titleRu?: string;
    subtitleEn?: string;
    subtitleRu?: string;
    coverImage?: string;
    link?: string;
    order?: number;
    isActive?: boolean;
}

// Catalog Banner types
export interface CatalogBanner {
    id: string;
    titleEn: string;
    titleRu: string;
    coverImage: string;
    link: string;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCatalogBannerDto {
    titleEn: string;
    titleRu: string;
    coverImage: string;
    link: string;
    order?: number;
    isActive?: boolean;
}

export interface UpdateCatalogBannerDto {
    titleEn?: string;
    titleRu?: string;
    coverImage?: string;
    link?: string;
    order?: number;
    isActive?: boolean;
}
