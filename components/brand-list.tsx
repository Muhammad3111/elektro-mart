"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { Brand } from "@/types/brand";
import { brandsAPI } from "@/lib/api";
import { BrandCard } from "@/components/brand-card";
import { BrandSkeleton } from "@/components/brand-skeleton";
import { BrandEmptyState } from "@/components/brand-empty-state";

export function BrandList() {
  const { t } = useLanguage();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await brandsAPI.getAllActive();
      setBrands(data);
    } catch (err) {
      console.error("Failed to load brands:", err);
      setError(err instanceof Error ? err.message : "Failed to load brands");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <BrandSkeleton />;
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

  if (brands.length === 0) {
    return <BrandEmptyState />;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">
        {t("Brendlar", "Бренды")}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {brands.map((brand) => (
          <BrandCard key={brand.id} brand={brand} />
        ))}
      </div>
    </div>
  );
}
