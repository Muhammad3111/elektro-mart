"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";
import { Brand } from "@/types/brand";
import { brandsAPI } from "@/lib/api";
import { ImageOff } from "lucide-react";
import Image from "next/image";

export default function BrandDetailPage() {
  const { t } = useLanguage();
  const params = useParams();
  const brandId = params.id as string;
  
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (brandId) {
      loadBrand();
    }
  }, [brandId]);

  const loadBrand = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await brandsAPI.getById(brandId);
      setBrand(data);
    } catch (err) {
      console.error("Failed to load brand:", err);
      setError(err instanceof Error ? err.message : "Failed to load brand");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-muted animate-pulse rounded-lg" />
            <div className="space-y-2">
              <div className="h-8 w-48 bg-muted animate-pulse rounded" />
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !brand) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">
            {t("Brend topilmadi", "Бренд не найден")}
          </h1>
          <p className="text-muted-foreground">
            {error || t("Bunday brend mavjud emas", "Такой бренд не существует")}
          </p>
        </div>
      </div>
    );
  }

  const brandName = t(brand.nameUz, brand.nameRu);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Brand Header */}
      <div className="flex items-center gap-6 mb-8 p-6 bg-card rounded-lg border">
        <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
          {brand.image ? (
            <Image
              src={brand.image}
              alt={brandName}
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          ) : (
            <ImageOff className="w-12 h-12 text-muted-foreground" />
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{brandName}</h1>
          <p className="text-muted-foreground">
            {brand.productCount || 0} {t("mahsulot", "товар")}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">
          {t("Mahsulotlar", "Товары")}
        </h2>
        
        {/* TODO: Add products grid here when products API is ready */}
        <div className="text-center py-16 text-muted-foreground">
          <p>{t("Mahsulotlar tez orada qo'shiladi", "Товары скоро будут добавлены")}</p>
        </div>
      </div>
    </div>
  );
}
