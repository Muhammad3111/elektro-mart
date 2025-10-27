"use client";

import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, FolderTree } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useParams } from "next/navigation";

export default function CategoryPage() {
  const { t } = useLanguage();
  const params = useParams();
  const slug = params.slug as string;

  // Mock data - replace with API call
  const categories = {
    kabellar: {
      name: "Kabellar",
      nameRu: "Кабели",
      subcategories: [
        { id: 1, name: "Quvvat kabellari", nameRu: "Силовые кабели", slug: "quvvat-kabellari", productsCount: 45, image: "" },
        { id: 2, name: "Ma'lumot kabellari", nameRu: "Информационные кабели", slug: "malumot-kabellari", productsCount: 67, image: "" },
        { id: 3, name: "Koaksial kabellar", nameRu: "Коаксиальные кабели", slug: "koaksial-kabellar", productsCount: 34, image: "" },
        { id: 4, name: "Optik kabellar", nameRu: "Оптические кабели", slug: "optik-kabellar", productsCount: 23, image: "" },
      ]
    },
    yoritish: {
      name: "Yoritish",
      nameRu: "Освещение",
      subcategories: [
        { id: 5, name: "LED lampalar", nameRu: "LED лампы", slug: "led-lampalar", productsCount: 56, image: "" },
        { id: 6, name: "Lyustralar", nameRu: "Люстры", slug: "lyustralar", productsCount: 34, image: "" },
        { id: 7, name: "Proyektorlar", nameRu: "Прожекторы", slug: "proyektorlar", productsCount: 28, image: "" },
        { id: 8, name: "Chiroqlar", nameRu: "Светильники", slug: "chiroqlar", productsCount: 45, image: "" },
      ]
    },
    rozetkalar: {
      name: "Rozetkalar",
      nameRu: "Розетки",
      subcategories: [
        { id: 9, name: "Ichki rozetkalar", nameRu: "Внутренние розетки", slug: "ichki-rozetkalar", productsCount: 78, image: "" },
        { id: 10, name: "Tashqi rozetkalar", nameRu: "Наружные розетки", slug: "tashqi-rozetkalar", productsCount: 45, image: "" },
        { id: 11, name: "USB rozetkalar", nameRu: "USB розетки", slug: "usb-rozetkalar", productsCount: 23, image: "" },
        { id: 12, name: "Smart rozetkalar", nameRu: "Умные розетки", slug: "smart-rozetkalar", productsCount: 12, image: "" },
      ]
    }
  };

  const currentCategory = categories[slug as keyof typeof categories];

  if (!currentCategory) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <p className="text-center text-xl">{t("Kategoriya topilmadi", "Категория не найдена")}</p>
        </main>
        <Footer />
      </div>
    );
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
          <span className="text-muted-foreground">{t(currentCategory.name, currentCategory.nameRu)}</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">{t(currentCategory.name, currentCategory.nameRu)}</h1>
          <p className="text-muted-foreground">
            {t("Subkategoriyalarni tanlang", "Выберите подкатегорию")}
          </p>
        </div>

        {/* Subcategories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentCategory.subcategories.map((subcategory) => (
            <Link key={subcategory.id} href={`/subcategories/${subcategory.slug}`}>
              <Card className="hover:shadow-lg transition-all cursor-pointer hover:scale-105 group h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    {subcategory.image ? (
                      <div className="w-14 h-14 rounded-lg overflow-hidden">
                        <img src={subcategory.image} alt={subcategory.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <FolderTree className="h-7 w-7 text-primary" />
                      </div>
                    )}
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>

                  <h3 className="text-xl font-bold mb-1">
                    {t(subcategory.name, subcategory.nameRu)}
                  </h3>

                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      {subcategory.productsCount} {t("ta mahsulot", "товаров")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
