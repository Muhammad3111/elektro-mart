"use client";

import { useState, Suspense, useMemo, useEffect, useCallback } from "react";
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
import { categoriesAPI, brandsAPI, productsAPI, catalogBannersAPI } from "@/lib/api";
import { Category } from "@/types/category";
import { Brand } from "@/types/brand";
import { Product } from "@/types/product";
import { CatalogBanner } from "@/types/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { S3Image } from "@/components/s3-image";

function CatalogContent() {
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    
    const categoryParam = searchParams.get("category");
    const subcategoryParam = searchParams.get("subcategory");
    const searchQuery = searchParams.get("search") || "";
    const brandParam = searchParams.get("brand");

    const [sortBy, setSortBy] = useState("newest");
    const [filters, setFilters] = useState<FilterState>({
        search: searchQuery,
        categories: categoryParam ? [categoryParam] : [],
        subcategories: subcategoryParam ? [subcategoryParam] : [],
        brands: brandParam ? [brandParam] : [],
        priceRange: [],
        isNew: false,
        hasDiscount: false,
    });
    
    const [selectedSlide, setSelectedSlide] = useState(0);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [banners, setBanners] = useState<CatalogBanner[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingBrands, setLoadingBrands] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingBanners, setLoadingBanners] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(500000);
    const itemsPerPage = 16;
    
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

    useEffect(() => {
        loadCategories();
        loadBrands();
        loadBanners();
    }, []);

    const loadBanners = async () => {
        try {
            setLoadingBanners(true);
            const data = await catalogBannersAPI.getActive();
            setBanners(data.sort((a, b) => a.order - b.order));
        } catch (err) {
            console.error("Failed to load banners:", err);
        } finally {
            setLoadingBanners(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, [currentPage, sortBy, filters, categoryParam, searchQuery]);

    const loadCategories = async () => {
        try {
            setLoadingCategories(true);
            const data = await categoriesAPI.getAll();
            const parentCategories = data.filter((c) => !c.parentId && c.isActive);
            setCategories(parentCategories);
        } catch (err) {
            console.error("Failed to load categories:", err);
        } finally {
            setLoadingCategories(false);
        }
    };

    const loadBrands = async () => {
        try {
            setLoadingBrands(true);
            const data = await brandsAPI.getAll();
            setBrands(data.filter((b) => b.isActive));
        } catch (err) {
            console.error("Failed to load brands:", err);
        } finally {
            setLoadingBrands(false);
        }
    };

    const loadProducts = useCallback(async () => {
        try {
            setLoadingProducts(true);
            
            // Map sortBy values to API parameters
            let apiSortBy = "createdAt";
            let apiSortOrder = "DESC";
            
            switch (sortBy) {
                case "newest":
                    apiSortBy = "createdAt";
                    apiSortOrder = "DESC";
                    break;
                case "best":
                    apiSortBy = "salesCount";
                    apiSortOrder = "DESC";
                    break;
                case "price-low":
                    apiSortBy = "price";
                    apiSortOrder = "ASC";
                    break;
                case "price-high":
                    apiSortBy = "price";
                    apiSortOrder = "DESC";
                    break;
            }
            
            const params: any = {
                page: currentPage,
                limit: itemsPerPage,
                sortBy: apiSortBy,
                sortOrder: apiSortOrder,
                isActive: true,
            };

            // Search parameter
            if (filters.search) params.search = filters.search;
            if (searchQuery) params.search = searchQuery;
            // Categories from URL and filter - birlashtirib yuborish
            const allCategories = [...new Set([
                ...(categoryParam ? [categoryParam] : []),
                ...filters.categories
            ])];
            if (allCategories.length > 0) {
                params.categories = allCategories;
            }
            if (filters.subcategories.length > 0) params.subcategories = filters.subcategories;
            if (filters.brands.length > 0) params.brandId = filters.brands[0];
            // Only send price range if user has set it
            if (filters.priceRange && filters.priceRange.length === 2) {
                params.minPrice = filters.priceRange[0];
                params.maxPrice = filters.priceRange[1];
            }
            if (filters.isNew) params.isNew = true;
            if (filters.hasDiscount) params.hasDiscount = true;

            const result = await productsAPI.getAll(params);
            setProducts(result.data);
            setTotalItems(result.total);
            const pages = Math.ceil(result.total / result.limit);
            setTotalPages(pages > 0 ? pages : 1);
            
            // Calculate min and max price from products
            if (result.data.length > 0) {
                const prices = result.data.map(p => {
                    const price = typeof p.price === 'string' ? parseFloat(p.price) : p.price;
                    return price;
                });
                const calculatedMin = Math.floor(Math.min(...prices));
                const calculatedMax = Math.ceil(Math.max(...prices));
                setMinPrice(calculatedMin);
                setMaxPrice(calculatedMax);
            }
        } catch (err) {
            console.error("Failed to load products:", err);
        } finally {
            setLoadingProducts(false);
        }
    }, [currentPage, itemsPerPage, sortBy, filters, categoryParam, searchQuery, minPrice, maxPrice]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    // Find current category and subcategories  
    const currentCategory = categoryParam
        ? categories.find((c) => c.id === categoryParam)
        : null;
    
    const subcategories = useMemo(() => {
        if (!currentCategory) return [];
        return categories.filter((c) => c.parentId === currentCategory.id && c.isActive);
    }, [currentCategory, categories]);

    const availableBrands = useMemo(() => brands.map(b => ({ 
        id: b.id, 
        name: b.nameUz,
        image: b.image 
    })), [brands]);

    // Update filters when URL params change
    useEffect(() => {
        setFilters((prev) => ({
            ...prev,
            search: searchQuery,
            categories: categoryParam ? [categoryParam] : prev.categories,
            subcategories: subcategoryParam ? [subcategoryParam] : prev.subcategories,
            brands: brandParam ? [brandParam] : prev.brands,
        }));
        setCurrentPage(1); // Reset to first page when filters change
    }, [searchQuery, subcategoryParam, categoryParam, brandParam]);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters.categories, filters.subcategories, filters.brands, filters.isNew, filters.hasDiscount]);

    // Pagination handlers
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push("...");
            
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            
            if (currentPage < totalPages - 2) pages.push("...");
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="min-h-screen flex flex-col">
            <SEO
                title="Katalog - Barcha mahsulotlar"
                description="Sobirov Market katalogi - elektr kabel, ulagichlar, rozetkalar, avtomatlar va boshqa elektr aksessuarlar. Siemens, Schneider, ABB, Legrand brendlari. Eng yaxshi narxlar va sifat kafolati."
                keywords="elektr katalog, kabel katalog, elektr mahsulotlari, ulagichlar, rozetkalar, avtomatlar, elektr aksessuarlar katalog"
                canonical="/catalog"
            />
            <Header />
            
            {/* Catalog Banners Slider */}
            {!searchQuery && (
                <div className="container mx-auto px-4 py-6">
                    {loadingBanners ? (
                        <div className="relative">
                            <div className="relative h-[200px] md:h-[250px] bg-gradient-to-r from-gray-200 to-gray-100 rounded-xl animate-pulse">
                                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent flex items-center">
                                    <div className="container mx-auto px-6">
                                        <Skeleton className="h-10 w-2/3" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center gap-2 mt-4">
                                <div className="w-6 h-2 rounded-full bg-gray-300"></div>
                                <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                                <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                            </div>
                        </div>
                    ) : banners.length > 0 ? (
                        <div className="relative">
                            <div className="overflow-hidden rounded-xl" ref={emblaRef}>
                                <div className="flex">
                                    {banners.map((banner) => (
                                        <div
                                            key={banner.id}
                                            className="flex-[0_0_100%] min-w-0"
                                        >
                                            <Link href={banner.link}>
                                                <div className="relative h-[200px] md:h-[250px] bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl overflow-hidden group">
                                                    <S3Image
                                                        src={banner.coverImage}
                                                        alt={t(banner.titleUz, banner.titleRu)}
                                                        fill
                                                        className="object-contain md:object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    
                                                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
                                                        <div className="container mx-auto px-6">
                                                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                                                                {t(banner.titleUz, banner.titleRu)}
                                                            </h2>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Indicator dots */}
                            {banners.length > 1 && (
                                <div className="flex justify-center gap-2 mt-4">
                                    {banners.map((_, index) => (
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
                            )}
                        </div>
                    ) : null}
                </div>
            )}

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Filters */}
                    <aside className="lg:col-span-1">
                        <ProductFilter
                            subcategories={subcategories as any}
                            brands={availableBrands}
                            onFilterChange={setFilters}
                            initialCategory={categoryParam || undefined}
                            initialBrand={brandParam || undefined}
                            minPrice={minPrice}
                            maxPrice={maxPrice}
                        />
                    </aside>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Header with Sort */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
                            <div className="flex-1">
                                <h1 className="text-4xl font-black">
                                    {searchQuery
                                        ? t("Qidiruv natijalari", "Результаты поиска")
                                        : t("Barcha mahsulotlar", "Все товары")}
                                </h1>
                                <p className="text-muted-foreground mt-1">
                                    {totalItems}{" "}
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
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">
                                            {t("Yangi kelganlar", "Новинки")}
                                        </SelectItem>
                                        <SelectItem value="best">
                                            {t(
                                                "Eng ko'p sotilgan",
                                                "Самые продаваемые"
                                            )}
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
                        {loadingProducts ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                                {Array.from({ length: 16 }).map((_, i) => (
                                    <div key={i} className="space-y-3">
                                        <Skeleton className="aspect-square w-full rounded-lg" />
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                                {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    id={product.id}
                                    name={product.nameUz}
                                    price={product.price.toString()}
                                    oldPrice={product.oldPrice?.toString()}
                                    image={product.coverImage || ""}
                                    rating={product.rating}
                                    isNew={product.isNew}
                                    discount={product.discount ? `${product.discount}%` : undefined}
                                    productCode={product.productCode}
                                    inStock={product.inStock}
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
                        {!loadingProducts && products.length > 0 && totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-12">
                                <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                                {getPageNumbers().map((page, index) => (
                                    page === "..." ? (
                                        <span key={`ellipsis-${index}`} className="text-muted-foreground px-2">
                                            ...
                                        </span>
                                    ) : (
                                        <Button 
                                            key={page}
                                            variant={currentPage === page ? "default" : "ghost"}
                                            className={currentPage === page ? "bg-primary text-white hover:bg-primary/90" : ""}
                                            onClick={() => handlePageChange(page as number)}
                                        >
                                            {page}
                                        </Button>
                                    )
                                ))}
                                <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
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
