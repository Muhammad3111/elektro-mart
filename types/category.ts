export interface Category {
  id: string;
  nameUz: string;
  nameRu: string;
  image: string | null;
  parentId: string | null;
  order: number;
  isActive: boolean;
  productsCount?: number;
  parent?: Category | null;
  subCategories?: Category[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryDto {
  nameUz: string;
  nameRu: string;
  image?: File | string;
  parentId?: string | null;
  order?: number;
}

export interface UpdateCategoryDto {
  nameUz?: string;
  nameRu?: string;
  image?: File | string;
  parentId?: string | null;
  order?: number;
  isActive?: boolean;
}
