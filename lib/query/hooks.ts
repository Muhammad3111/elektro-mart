import { useQuery } from "@tanstack/react-query";
import { categoriesAPI, productsAPI, brandsAPI } from "@/lib/api";

// Categories
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesAPI.getAll(),
  });
}

export function useActiveCategories() {
  return useQuery({
    queryKey: ["categories", "active"],
    queryFn: async () => {
      const data = await categoriesAPI.getAll();
      return data.filter((c) => c.isActive);
    },
  });
}

export function useParentCategories() {
  return useQuery({
    queryKey: ["categories", "parent"],
    queryFn: async () => {
      const data = await categoriesAPI.getAll();
      const parentCategories = data.filter((c) => !c.parentId && c.isActive);
      return parentCategories.map((parent) => ({
        ...parent,
        subCategories: data.filter((sub) => sub.parentId === parent.id && sub.isActive),
      }));
    },
  });
}

// Products
export function useProducts(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productsAPI.getAll(params),
  });
}

export function useFeaturedProducts(categoryId?: string) {
  return useQuery({
    queryKey: ["products", "featured", categoryId],
    queryFn: () => {
      const params: Record<string, unknown> = {
        isFeatured: true,
        isActive: true,
        limit: 10,
      };
      if (categoryId && categoryId !== "all") {
        params.categories = [categoryId];
      }
      return productsAPI.getAll(params);
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productsAPI.getById(id),
    enabled: !!id,
  });
}

// Brands
export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: () => brandsAPI.getAll(),
  });
}

export function useActiveBrands() {
  return useQuery({
    queryKey: ["brands", "active"],
    queryFn: async () => {
      const data = await brandsAPI.getAll();
      return data.filter((b) => b.isActive);
    },
  });
}
