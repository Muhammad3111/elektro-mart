"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useParams } from "next/navigation";

export default function SubcategoryPage() {
  const { t } = useLanguage();
  const params = useParams();
  const slug = params.slug as string;
  const [sortBy, setSortBy] = useState("best");

  // Mock data - replace with API call
  const subcategories = {
    "quvvat-kabellari": {
      name: "Quvvat kabellari",
      nameRu: "Силовые кабели",
      parentCategory: "Kabellar",
      parentCategoryRu: "Кабели",
      parentSlug: "kabellar",
      products: [
        {
          id: 1,
          name: "NYM 3x2.5 Kabel",
          price: "45,000",
          oldPrice: "55,000",
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
          rating: 4.8,
          isNew: true,
          discount: "18%",
        },
        {
          id: 2,
          name: "VVG 3x1.5 Kabel",
          price: "35,000",
          image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=400&fit=crop",
          rating: 4.5,
        },
        {
          id: 3,
          name: "PVS 3x2.5 Kabel",
          price: "42,000",
          oldPrice: "50,000",
          image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=400&fit=crop",
          rating: 4.7,
          discount: "16%",
        },
        {
          id: 4,
          name: "SHVVP 2x0.75 Kabel",
          price: "28,000",
          image: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=400&h=400&fit=crop",
          rating: 4.6,
        },
        {
          id: 5,
          name: "KG 3x2.5 Kabel",
          price: "52,000",
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
          rating: 4.9,
          isNew: true,
        },
        {
          id: 6,
          name: "NYM 3x1.5 Kabel",
          price: "38,000",
          image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=400&fit=crop",
          rating: 4.4,
        },
      ]
    },
    "malumot-kabellari": {
      name: "Ma'lumot kabellari",
      nameRu: "Информационные кабели",
      parentCategory: "Kabellar",
      parentCategoryRu: "Кабели",
      parentSlug: "kabellar",
      products: [
        {
          id: 7,
          name: "UTP Cat5e Kabel",
          price: "25,000",
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
          rating: 4.7,
        },
        {
          id: 8,
          name: "UTP Cat6 Kabel",
          price: "35,000",
          oldPrice: "42,000",
          image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=400&fit=crop",
          rating: 4.8,
          discount: "17%",
        },
      ]
    }
  };

  const currentSubcategory = subcategories[slug as keyof typeof subcategories];

  if (!currentSubcategory) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <p className="text-center text-xl">{t("Subkategoriya topilmadi", "Подкатегория не найдена")}</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Sort products
  const sortedProducts = [...currentSubcategory.products];
  if (sortBy === "price-low") {
    sortedProducts.sort((a, b) => 
      parseInt(a.price.replace(/,/g, '')) - parseInt(b.price.replace(/,/g, ''))
    );
  } else if (sortBy === "price-high") {
    sortedProducts.sort((a, b) => 
      parseInt(b.price.replace(/,/g, '')) - parseInt(a.price.replace(/,/g, ''))
    );
  } else if (sortBy === "newest") {
    sortedProducts.sort((a, b) => b.id - a.id);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="text-primary hover:underline">{t("Bosh sahifa", "Главная")}</Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link href="/catalog" className="text-primary hover:underline">{t("Katalog", "Каталог")}</Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link href={`/categories/${currentSubcategory.parentSlug}`} className="text-primary hover:underline">
            {t(currentSubcategory.parentCategory, currentSubcategory.parentCategoryRu)}
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{t(currentSubcategory.name, currentSubcategory.nameRu)}</span>
        </div>

        {/* Header with Sort */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black">{t(currentSubcategory.name, currentSubcategory.nameRu)}</h1>
            <p className="text-muted-foreground mt-1">
              {sortedProducts.length} {t("ta mahsulot topildi", "товаров найдено")}
            </p>
          </div>
          
          {/* Sort Select */}
          <div className="w-full sm:w-64">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder={t("Saralash", "Сортировка")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="best">{t("Eng ko'p sotilgan", "Самые продаваемые")}</SelectItem>
                <SelectItem value="newest">{t("Yangi kelganlar", "Новинки")}</SelectItem>
                <SelectItem value="price-low">{t("Narx: Pastdan yuqoriga", "Цена: По возрастанию")}</SelectItem>
                <SelectItem value="price-high">{t("Narx: Yuqoridan pastga", "Цена: По убыванию")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              oldPrice={product.oldPrice}
              image={product.image}
              rating={product.rating}
              isNew={product.isNew}
              discount={product.discount}
            />
          ))}
        </div>

        {/* Pagination */}
        {sortedProducts.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button className="bg-primary text-white hover:bg-primary/90">1</Button>
            <Button variant="ghost">2</Button>
            <Button variant="ghost">3</Button>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
