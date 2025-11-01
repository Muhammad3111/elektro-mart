"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { Category } from "@/types/category";
import { categoriesAPI } from "@/lib/api";
import { CategoryCard } from "./category-card";
import { CategorySkeleton } from "./category-skeleton";
import { CategoryEmptyState } from "./category-empty-state";

export function CategoryList() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoriesAPI.getHierarchy();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories:", err);
      setError(err instanceof Error ? err.message : "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CategorySkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">
          {t("Xatolik yuz berdi", "Произошла ошибка")}: {error}
        </p>
      </div>
    );
  }

  if (categories.length === 0) {
    return <CategoryEmptyState />;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">
        {t("Kategoriyalar", "Категории")}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
