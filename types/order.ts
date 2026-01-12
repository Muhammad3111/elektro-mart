export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    price: string;
    subtotal: string;
    product?: {
        id: string;
        nameEn: string;
        nameRu: string;
        shortDescriptionEn: string;
        shortDescriptionRu: string;
        descriptionEn: string;
        descriptionRu: string;
        price: string;
        oldPrice: string;
        sku: string;
        productCode: string;
        slug: string;
        coverImage: string;
        galleryImages: string[];
        stockQuantity: number;
        inStock: boolean;
        isNew: boolean;
        discount: string;
        rating: string;
        reviewsCount: number;
        viewsCount: number;
        salesCount: number;
        order: number;
        isActive: boolean;
        isFeatured: boolean;
        categoryId: string;
        brandId: string;
        subcategoryId: string | null;
        metaTitle: string;
        metaDescription: string;
        keywords: string[];
        createdAt: string;
        updatedAt: string;
        category?: {
            id: string;
            nameEn: string;
            nameRu: string;
            image: string;
            parentId: string | null;
            isActive: boolean;
            order: number;
            createdAt: string;
            updatedAt: string;
        };
        brand?: {
            id: string;
            nameEn: string;
            nameRu: string;
            image: string;
            isActive: boolean;
            order: number;
            createdAt: string;
            updatedAt: string;
        };
    };
}

export interface Order {
    id: string;
    orderNumber: string;
    userId: string | null;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    region: string;
    totalAmount: string;
    status:
        | "pending"
        | "confirmed"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled";
    paymentMethod: "cash" | "card" | "online";
    isPaid: boolean;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    items: OrderItem[];
}

export interface CreateOrderDto {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    region: string;
    paymentMethod: "cash" | "card" | "online";
    notes?: string;
    items: {
        productId: string;
        quantity: number;
    }[];
}

export interface UpdateOrderDto {
    status?:
        | "pending"
        | "confirmed"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled";
    isPaid?: boolean;
    notes?: string;
}
