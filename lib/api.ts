// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Generic API request function
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

// Products API
export const productsAPI = {
    getAll: (params?: { page?: number; limit?: number; search?: string; category?: string }) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.search) queryParams.append("search", params.search);
        if (params?.category) queryParams.append("category", params.category);
        
        return apiRequest<{ data: any[]; total: number; page: number; totalPages: number }>(
            `/products?${queryParams.toString()}`
        );
    },
    
    getById: (id: number) => apiRequest<any>(`/products/${id}`),
    
    create: (data: any) => apiRequest<any>("/products", {
        method: "POST",
        body: JSON.stringify(data),
    }),
    
    update: (id: number, data: any) => apiRequest<any>(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    }),
    
    delete: (id: number) => apiRequest<any>(`/products/${id}`, {
        method: "DELETE",
    }),
};

// Users API
export const usersAPI = {
    getAll: (params?: { page?: number; limit?: number; search?: string }) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.search) queryParams.append("search", params.search);
        
        return apiRequest<{ data: any[]; total: number; page: number; totalPages: number }>(
            `/users?${queryParams.toString()}`
        );
    },
    
    getById: (id: number) => apiRequest<any>(`/users/${id}`),
    
    create: (data: any) => apiRequest<any>("/users", {
        method: "POST",
        body: JSON.stringify(data),
    }),
    
    update: (id: number, data: any) => apiRequest<any>(`/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    }),
    
    delete: (id: number) => apiRequest<any>(`/users/${id}`, {
        method: "DELETE",
    }),
};

// Categories API
export const categoriesAPI = {
    getAll: () => apiRequest<any[]>("/categories"),
    
    getById: (id: number) => apiRequest<any>(`/categories/${id}`),
    
    create: (data: any) => apiRequest<any>("/categories", {
        method: "POST",
        body: JSON.stringify(data),
    }),
    
    update: (id: number, data: any) => apiRequest<any>(`/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    }),
    
    delete: (id: number) => apiRequest<any>(`/categories/${id}`, {
        method: "DELETE",
    }),
};

// Upload API
export const uploadAPI = {
    uploadImage: async (file: File): Promise<{ url: string }> => {
        const formData = new FormData();
        formData.append("file", file);
        
        const response = await fetch(`${API_BASE_URL}/upload`, {
            method: "POST",
            body: formData,
        });
        
        if (!response.ok) {
            throw new Error("Upload failed");
        }
        
        return await response.json();
    },
    
    deleteImage: (url: string) => apiRequest<any>("/upload", {
        method: "DELETE",
        body: JSON.stringify({ url }),
    }),
};

// Sliders API
export const slidersAPI = {
    getAll: () => apiRequest<any[]>("/sliders"),
    
    create: (data: any) => apiRequest<any>("/sliders", {
        method: "POST",
        body: JSON.stringify(data),
    }),
    
    update: (id: number, data: any) => apiRequest<any>(`/sliders/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    }),
    
    delete: (id: number) => apiRequest<any>(`/sliders/${id}`, {
        method: "DELETE",
    }),
    
    reorder: (items: { id: number; order: number }[]) => apiRequest<any>("/sliders/reorder", {
        method: "POST",
        body: JSON.stringify({ items }),
    }),
};

// Banners API
export const bannersAPI = {
    getAll: () => apiRequest<any[]>("/banners"),
    
    create: (data: any) => apiRequest<any>("/banners", {
        method: "POST",
        body: JSON.stringify(data),
    }),
    
    update: (id: number, data: any) => apiRequest<any>(`/banners/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    }),
    
    delete: (id: number) => apiRequest<any>(`/banners/${id}`, {
        method: "DELETE",
    }),
};
