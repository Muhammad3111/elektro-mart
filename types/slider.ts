// Home Slider types
export interface HomeSlider {
  id: string;
  titleUz: string;
  titleRu: string;
  subtitleUz: string;
  subtitleRu: string;
  coverImage: string;
  link: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHomeSliderDto {
  titleUz: string;
  titleRu: string;
  subtitleUz: string;
  subtitleRu: string;
  coverImage: string;
  link: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateHomeSliderDto {
  titleUz?: string;
  titleRu?: string;
  subtitleUz?: string;
  subtitleRu?: string;
  coverImage?: string;
  link?: string;
  order?: number;
  isActive?: boolean;
}

// Catalog Banner types
export interface CatalogBanner {
  id: string;
  titleUz: string;
  titleRu: string;
  coverImage: string;
  link: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCatalogBannerDto {
  titleUz: string;
  titleRu: string;
  coverImage: string;
  link: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateCatalogBannerDto {
  titleUz?: string;
  titleRu?: string;
  coverImage?: string;
  link?: string;
  order?: number;
  isActive?: boolean;
}
