"use client";

import { useState, Suspense, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { ProductFilter, FilterState } from "@/components/product-filter";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, PackageSearch } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

function CatalogContent() {
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    
    const categoryParam = searchParams.get("category");
    const subcategoryParam = searchParams.get("subcategory");
    const searchQuery = searchParams.get("search") || "";
    const brandParam = searchParams.get("brand");

    const [sortBy, setSortBy] = useState("best");
    const [filters, setFilters] = useState<FilterState>({
        search: searchQuery,
        categories: [],
        subcategories: subcategoryParam ? [subcategoryParam] : [],
        brands: brandParam ? [brandParam] : [],
        priceRange: [0, 500000],
        isNew: false,
        hasDiscount: false,
    });
    
    const [selectedSlide, setSelectedSlide] = useState(0);
    
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, align: "start" },
        [Autoplay({ delay: 3500, stopOnInteraction: true })]
    );
    
    // Track selected slide
    useEffect(() => {
        if (!emblaApi) return;
        
        const onSelect = () => {
            setSelectedSlide(emblaApi.selectedScrollSnap());
        };
        
        emblaApi.on("select", onSelect);
        onSelect();
        
        return () => {
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi]);

    // Mock categories with subcategories
    const categories = [
        {
            id: 1,
            name: "Kabellar",
            nameRu: "Кабели",
            slug: "kabellar",
            subcategories: [
                { id: 1, name: "Quvvat kabellari", nameRu: "Силовые кабели", slug: "quvvat-kabellari" },
                { id: 2, name: "Ma'lumot kabellari", nameRu: "Информационные кабели", slug: "malumot-kabellari" },
                { id: 3, name: "Koaksial kabellar", nameRu: "Коаксиальные кабели", slug: "koaksial-kabellar" },
            ],
        },
        {
            id: 2,
            name: "Yoritish",
            nameRu: "Освещение",
            slug: "yoritish",
            subcategories: [
                { id: 4, name: "LED lampalar", nameRu: "LED лампы", slug: "led-lampalar" },
                { id: 5, name: "Lyustralar", nameRu: "Люстры", slug: "lyustralar" },
            ],
        },
    ];

    const availableBrands = useMemo(() => [
        { id: "philips", name: "Philips" },
        { id: "siemens", name: "Siemens" },
        { id: "legrand", name: "Legrand" },
        { id: "schneider", name: "Schneider" },
        { id: "abb", name: "ABB" },
    ], []);

    // Find current category and subcategories
    const currentCategory = categoryParam
        ? categories.find((c) => c.slug === categoryParam)
        : null;
    const subcategories = currentCategory?.subcategories || [];

    const allProducts = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `${
            [
                "RG6 Koaksial Kabel",
                "Optik Tolali Kabel",
                "Quvvat Kabeli",
                "HDMI Kabel",
                "USB-C Kabel",
            ][i % 5]
        } ${i + 1}`,
        price: `${(i + 1) * 10},000`,
        oldPrice: i % 3 === 0 ? `${(i + 1) * 12},000` : undefined,
        categoryName: [
            "Quvvat kabellari",
            "Ma'lumot kabellari",
            "LED lampalar",
            "Lyustralar",
        ][i % 4],
        categorySlug: ["kabellar", "kabellar", "yoritish", "yoritish"][i % 4],
        subcategorySlug: [
            "quvvat-kabellari",
            "malumot-kabellari",
            "led-lampalar",
            "lyustralar",
        ][i % 4],
        brand: ["Philips", "Siemens", "Legrand", "Schneider", "ABB"][i % 5],
        image: `https://images.unsplash.com/photo-${
            1558618666 + (i % 5)
        }fcd25c85cd64?w=400&h=400&fit=crop`,
        rating: 4 + (i % 10) / 10,
        isNew: i % 5 === 0,
        discount: i % 3 === 0 ? `${10 + (i % 3) * 5}%` : undefined,
    }));

    // Filter and sort products
    const filteredAndSortedProducts = useMemo(() => {
        let filtered = [...allProducts];

        // Category filter from URL
        if (categoryParam) {
            filtered = filtered.filter((p) => p.categorySlug === categoryParam);
        }

        // Subcategory filter
        if (filters.subcategories.length > 0) {
            filtered = filtered.filter((p) =>
                filters.subcategories.includes(p.subcategorySlug)
            );
        }

        // Search filter
        if (filters.search) {
            filtered = filtered.filter((p) =>
                p.name.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        // Brand filter
        if (filters.brands.length > 0) {
            filtered = filtered.filter((p) =>
                filters.brands.some((brandId) =>
                    availableBrands.find((b) => b.id === brandId)?.name === p.brand
                )
            );
        }

        // Price filter
        if (filters.priceRange) {
            filtered = filtered.filter(
                (p) => {
                    const price = parseInt(p.price.replace(/,/g, ""));
                    return price >= filters.priceRange[0] && price <= filters.priceRange[1];
                }
            );
        }

        // New products filter
        if (filters.isNew) {
            filtered = filtered.filter((p) => p.isNew);
        }

        // Discount filter
        if (filters.hasDiscount) {
            filtered = filtered.filter((p) => p.discount);
        }

        // Sort products
        const sorted = [...filtered];
        if (sortBy === "price-low") {
            sorted.sort(
                (a, b) =>
                    parseInt(a.price.replace(/,/g, "")) -
                    parseInt(b.price.replace(/,/g, ""))
            );
        } else if (sortBy === "price-high") {
            sorted.sort(
                (a, b) =>
                    parseInt(b.price.replace(/,/g, "")) -
                    parseInt(a.price.replace(/,/g, ""))
            );
        } else if (sortBy === "newest") {
            sorted.sort((a, b) => b.id - a.id);
        }

        return sorted;
    }, [allProducts, categoryParam, filters, sortBy, availableBrands]);

    // Update filters when URL params change
    useEffect(() => {
        setFilters((prev) => ({
            ...prev,
            search: searchQuery,
            subcategory: subcategoryParam || "",
        }));
    }, [searchQuery, subcategoryParam]);

    return (
        <div className="min-h-screen flex flex-col">
            <SEO
                title="Katalog - Barcha mahsulotlar"
                description="Sobirov Market katalogi - elektr kabel, ulagichlar, rozetkalar, avtomatlar va boshqa elektr aksessuarlar. Siemens, Schneider, ABB, Legrand brendlari. Eng yaxshi narxlar va sifat kafolati."
                keywords="elektr katalog, kabel katalog, elektr mahsulotlari, ulagichlar, rozetkalar, avtomatlar, elektr aksessuarlar katalog"
                canonical="/catalog"
            />
            <Header />
            
            {/* Catalog Slider - only show on main catalog page */}
            {!categoryParam && !searchQuery && (
                <div className="container mx-auto px-4 py-6">
                    <div className="relative">
                        <div className="overflow-hidden rounded-xl" ref={emblaRef}>
                            <div className="flex">
                                {categories.map((category) => (
                                    <div
                                        key={category.id}
                                        className="flex-[0_0_100%] min-w-0"
                                    >
                                        <Link href={`/catalog?category=${category.slug}`}>
                                            <div className="relative h-[200px] bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                                                <h2 className="text-3xl md:text-4xl font-black text-white">
                                                    {t(category.name, category.nameRu)}
                                                </h2>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Indicator dots */}
                        <div className="flex justify-center gap-2 mt-4">
                            {categories.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => emblaApi?.scrollTo(index)}
                                    className={`h-2 rounded-full transition-all ${
                                        index === selectedSlide
                                            ? "w-6 bg-primary"
                                            : "w-2 bg-gray-300"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Filters */}
                    <aside className="lg:col-span-1">
                        <ProductFilter
                            subcategories={subcategories}
                            brands={availableBrands}
                            onFilterChange={setFilters}
                        />
                    </aside>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Header with Sort */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
                            <div className="flex-1">
                                <h1 className="text-4xl font-black">
                                    {currentCategory
                                        ? t(currentCategory.name, currentCategory.nameRu)
                                        : searchQuery
                                        ? t("Qidiruv natijalari", "Результаты поиска")
                                        : t("Barcha mahsulotlar", "Все товары")}
                                </h1>
                                <p className="text-muted-foreground mt-1">
                                    {filteredAndSortedProducts.length}{" "}
                                    {t("ta mahsulot topildi", "товаров найдено")}
                                </p>
                            </div>

                            {/* Sort Select */}
                            <div className="w-full sm:w-auto sm:min-w-max shrink-0">
                                <Select
                                    value={sortBy}
                                    onValueChange={setSortBy}
                                >
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={t(
                                                "Saralash",
                                                "Сортировка"
                                            )}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="best">
                                            {t(
                                                "Eng ko'p sotilgan",
                                                "Самые продаваемые"
                                            )}
                                        </SelectItem>
                                        <SelectItem value="newest">
                                            {t("Yangi kelganlar", "Новинки")}
                                        </SelectItem>
                                        <SelectItem value="price-low">
                                            {t(
                                                "Narx: Pastdan yuqoriga",
                                                "Цена: По возрастанию"
                                            )}
                                        </SelectItem>
                                        <SelectItem value="price-high">
                                            {t(
                                                "Narx: Yuqoridan pastga",
                                                "Цена: По убыванию"
                                            )}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Products Grid or No Results */}
                        {filteredAndSortedProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                                {filteredAndSortedProducts.map((product) => (
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
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 px-4">
                                <PackageSearch className="h-24 w-24 text-muted-foreground mb-4" />
                                <h3 className="text-2xl font-bold mb-2">
                                    {t("Natija topilmadi", "Результаты не найдены")}
                                </h3>
                                <p className="text-muted-foreground text-center max-w-md">
                                    {t(
                                        "Filtrlarga mos mahsulot topilmadi. Iltimos, boshqa parametrlarni tanlang.",
                                        "Товары, соответствующие фильтрам, не найдены. Пожалуйста, выберите другие параметры."
                                    )}
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        {filteredAndSortedProducts.length > 0 && (
                            <div className="flex items-center justify-center gap-2 mt-12">
                                <Button variant="ghost" size="icon">
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                                <Button className="bg-primary text-white hover:bg-primary/90">
                                    1
                                </Button>
                                <Button variant="ghost">2</Button>
                                <Button variant="ghost">3</Button>
                                <span className="text-muted-foreground">
                                    ...
                                </span>
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

export default function CatalogPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    Loading...
                </div>
            }
        >
            <CatalogContent />
        </Suspense>
    );
}
