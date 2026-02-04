export interface Blog {
    id: string;
    titleEn: string;
    titleRu: string;
    descriptionEn: string;
    descriptionRu: string;
    image?: string;
    slug: string;
    isActive: boolean;
    isFeatured: boolean;
    order: number;
    viewsCount: number;
    metaTitle?: string;
    metaDescription?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBlogDto {
    titleEn: string;
    titleRu: string;
    descriptionEn: string;
    descriptionRu: string;
    image?: string;
    slug?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    order?: number;
    metaTitle?: string;
    metaDescription?: string;
}

export type UpdateBlogDto = Partial<CreateBlogDto>;

export interface BlogsResponse {
    data: Blog[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface QueryBlogDto {
    search?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
}
