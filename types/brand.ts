export interface Brand {
  id: string;
  nameUz: string;
  nameRu: string;
  image?: string;
  isActive: boolean;
  order: number;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBrandDto {
  nameUz: string;
  nameRu: string;
  image?: string;
  isActive?: boolean;
  order?: number;
}

export interface UpdateBrandDto {
  nameUz?: string;
  nameRu?: string;
  image?: string;
  isActive?: boolean;
  order?: number;
}
