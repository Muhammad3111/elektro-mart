"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function CatalogPage() {
  const { t } = useLanguage();
  const [sortBy, setSortBy] = useState("best");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const allProducts = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `${["RG6 Koaksial Kabel", "Optik Tolali Kabel", "Quvvat Kabeli", "HDMI Kabel", "USB-C Kabel"][i % 5]} ${i + 1}`,
    price: `${(i + 1) * 10},000`,
    oldPrice: i % 3 === 0 ? `${(i + 1) * 12},000` : undefined,
    categoryName: ["Ma'lumot kabellari", "Quvvat kabellari", "Ulagichlar", "Asboblar"][i % 4],
    category: ["data", "power", "connectors", "tools"][i % 4],
    brand: ["CableCo", "ConnectX", "PowerUp"][i % 3],
    image: `https://images.unsplash.com/photo-${1558618666 + (i % 5)}fcd25c85cd64?w=400&h=400&fit=crop`,
    rating: 4 + (i % 10) / 10,
    isNew: i % 5 === 0,
    discount: i % 3 === 0 ? `${10 + (i % 3) * 5}%` : undefined
  }));

  // Filter products
  let filteredProducts = [...allProducts];

  if (selectedCategories.length > 0) {
    filteredProducts = filteredProducts.filter(p => 
      selectedCategories.includes(p.categoryName)
    );
  }

  if (selectedBrands.length > 0) {
    filteredProducts = filteredProducts.filter(p => 
      selectedBrands.includes(p.brand)
    );
  }

  if (priceMin) {
    filteredProducts = filteredProducts.filter(p => 
      parseInt(p.price.replace(/,/g, '')) >= parseInt(priceMin)
    );
  }

  if (priceMax) {
    filteredProducts = filteredProducts.filter(p => 
      parseInt(p.price.replace(/,/g, '')) <= parseInt(priceMax)
    );
  }

  // Sort products
  if (sortBy === "price-low") {
    filteredProducts.sort((a, b) => 
      parseInt(a.price.replace(/,/g, '')) - parseInt(b.price.replace(/,/g, ''))
    );
  } else if (sortBy === "price-high") {
    filteredProducts.sort((a, b) => 
      parseInt(b.price.replace(/,/g, '')) - parseInt(a.price.replace(/,/g, ''))
    );
  } else if (sortBy === "newest") {
    filteredProducts.sort((a, b) => b.id - a.id);
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceMin("");
    setPriceMax("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Katalog - Barcha mahsulotlar"
        description="ElektroMart katalogi - elektr kabel, ulagichlar, rozetkalar, avtomatlar va boshqa elektr aksessuarlar. Siemens, Schneider, ABB, Legrand brendlari. Eng yaxshi narxlar va sifat kafolati."
        keywords="elektr katalog, kabel katalog, elektr mahsulotlari, ulagichlar, rozetkalar, avtomatlar, elektr aksessuarlar katalog"
        canonical="/catalog"
      />
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-1/4 space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4 space-y-6">
                <h3 className="text-xl font-bold">{t("Filtrlar", "Фильтры")}</h3>

                {/* Category */}
                <div>
                  <h4 className="text-base font-semibold mb-3">{t("Kategoriya", "Категория")}</h4>
                  <div className="space-y-2">
                    {[
                      { uz: "Quvvat kabellari", ru: "Силовые кабели" },
                      { uz: "Ma'lumot kabellari", ru: "Информационные кабели" },
                      { uz: "Ulagichlar", ru: "Разъемы" },
                      { uz: "Asboblar", ru: "Инструменты" }
                    ].map((cat) => (
                      <div key={cat.uz} className="flex items-center space-x-2">
                        <Checkbox 
                          id={cat.uz} 
                          checked={selectedCategories.includes(cat.uz)}
                          onCheckedChange={() => toggleCategory(cat.uz)}
                        />
                        <Label htmlFor={cat.uz} className="font-normal cursor-pointer">
                          {t(cat.uz, cat.ru)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="text-base font-semibold mb-3">{t("Narx oralig'i", "Диапазон цен")}</h4>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      placeholder={t("Min", "Мин")} 
                      className="w-full" 
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                    />
                    <span className="text-muted-foreground">-</span>
                    <Input 
                      type="number" 
                      placeholder={t("Max", "Макс")} 
                      className="w-full" 
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                    />
                  </div>
                </div>

                {/* Brand */}
                <div>
                  <h4 className="text-base font-semibold mb-3">{t("Brend", "Бренд")}</h4>
                  <div className="space-y-2">
                    {["CableCo", "ConnectX", "PowerUp"].map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox 
                          id={brand} 
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={() => toggleBrand(brand)}
                        />
                        <Label htmlFor={brand} className="font-normal cursor-pointer">
                          {brand}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={clearFilters}
                >
                  {t("Filtrlarni tozalash", "Очистить фильтры")}
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header with Sort */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
              <div>
                <h1 className="text-4xl font-black">{t("Barcha mahsulotlar", "Все товары")}</h1>
                <p className="text-muted-foreground mt-1">
                  {filteredProducts.length} {t("ta mahsulot topildi", "товаров найдено")}
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

            {/* Products Grid - 4 per row */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {filteredProducts.map((product) => (
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

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">{t("Hech qanday mahsulot topilmadi", "Товары не найдены")}</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={clearFilters}
                >
                  {t("Filtrlarni tozalash", "Очистить фильтры")}
                </Button>
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button className="bg-primary text-white hover:bg-primary/90">1</Button>
                <Button variant="ghost">2</Button>
                <Button variant="ghost">3</Button>
                <span className="text-muted-foreground">...</span>
                <Button variant="ghost">10</Button>
                <Button variant="ghost" size="icon">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
