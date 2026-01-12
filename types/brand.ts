export interface Brand {
    id: string;
    nameEn: string;
    nameRu: string;
    image?: string;
    isActive: boolean;
    order: number;
    productCount?: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBrandDto {
    nameEn: string;
    nameRu: string;
    image?: string;
    isActive?: boolean;
    order?: number;
}

export interface UpdateBrandDto {
    nameEn?: string;
    nameRu?: string;
    image?: string;
    isActive?: boolean;
    order?: number;
}
