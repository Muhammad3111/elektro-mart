"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";
import { Category } from "@/types/category";
import { categoriesAPI } from "@/lib/api";
import { CategoryCard } from "@/components/category-card";
import { CategorySkeleton } from "@/components/category-skeleton";
import { CategoryEmptyState } from "@/components/category-empty-state";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CategoryPage() {
  const params = useParams();
  const { language, t } = useLanguage();
  const categoryId = parseInt(params.slug as string);
  
  const [category, setCategory] = useState<Category | null>(null);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  const loadCategoryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [categoryData, subCategoriesData] = await Promise.all([
        categoriesAPI.getById(categoryId.toString()),
        categoriesAPI.getSubCategories(categoryId.toString()),
      ]);
      
      setCategory(categoryData);
      setSubCategories(subCategoriesData);
    } catch (err) {
      console.error("Failed to load category:", err);
      setError(err instanceof Error ? err.message : "Failed to load category");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <CategorySkeleton />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <p className="text-destructive">
            {t("Kategoriya topilmadi", "Категория не найдена")}
          </p>
          <Link href="/categories" className="text-primary hover:underline mt-4 inline-block">
            {t("Kategoriyalarga qaytish", "Вернуться к категориям")}
          </Link>
        </div>
      </div>
    );
  }

  const categoryName = language === "uz" ? category.nameUz : category.nameRu;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Breadcrumb */}
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("Barcha kategoriyalar", "Все категории")}
        </Link>

        {/* Category Header */}
        <div className="flex items-center gap-6">
          {category.image && (
            <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted">
              <Image
                src={category.image}
                alt={categoryName}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{categoryName}</h1>
            {subCategories.length > 0 && (
              <p className="text-muted-foreground mt-2">
                {subCategories.length} {language === "uz" ? "bo'lim" : "раздел"}
              </p>
            )}
          </div>
        </div>

        {/* Sub Categories */}
        {subCategories.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              {t("Bo'limlar", "Разделы")}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {subCategories.map((subCategory) => (
                <CategoryCard key={subCategory.id} category={subCategory} />
              ))}
            </div>
          </div>
        ) : (
          <CategoryEmptyState />
        )}
      </div>
    </div>
  );
}
