"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSlider } from "@/components/hero-slider";
import { ProductCard } from "@/components/product-card";
import { SectionTitle } from "@/components/section-title";
import { CategorySlider } from "@/components/category-slider";
import { BrandsSlider } from "@/components/brands-slider";
import { ContactInfo } from "@/components/contact-info";
import { YandexMap } from "@/components/yandex-map";
import { StructuredData } from "@/components/structured-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Truck, Shield, Headphones, Award } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { Brand } from "@/types/brand";
import { categoriesAPI, productsAPI, brandsAPI } from "@/lib/api";
import { CategorySkeleton } from "@/components/category-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
    const { t } = useLanguage();
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loadingBrands, setLoadingBrands] = useState(true);

    const loadCategories = async () => {
        try {
            setLoadingCategories(true);
            const data = await categoriesAPI.getAll();
            const parentCategories = data.filter(
                (c) => !c.parentId && c.isActive
            );
            const categoriesWithSubs = parentCategories.map((parent) => ({
                ...parent,
                subCategories: data.filter(
                    (sub) => sub.parentId === parent.id && sub.isActive
                ),
            }));
            // Limit to 12 categories for slider
            setCategories(categoriesWithSubs.slice(0, 12));
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
            const activeBrands = data.filter((b) => b.isActive);
            setBrands(activeBrands);
        } catch (err) {
            console.error("Failed to load brands:", err);
        } finally {
            setLoadingBrands(false);
        }
    };

    const loadFeaturedProducts = useCallback(async () => {
        try {
            setLoadingProducts(true);
            const params: Record<string, unknown> = {
                isFeatured: true,
                isActive: true,
                limit: 10,
            };
            if (selectedCategory !== "all") {
                params.categories = [selectedCategory];
            }
            const result = await productsAPI.getAll(params);
            setProducts(result.data);
        } catch (err) {
            console.error("Failed to load products:", err);
        } finally {
            setLoadingProducts(false);
        }
    }, [selectedCategory]);

    useEffect(() => {
        loadCategories();
        loadBrands();
    }, []);

    useEffect(() => {
        loadFeaturedProducts();
    }, [selectedCategory]);

    return (
        <div className="min-h-screen flex flex-col">
            <StructuredData type="WebSite" />
            <StructuredData type="Organization" />
            <Header />

            <main id="main-content" className="flex-1">
                {/* Hero Slider */}
                <HeroSlider />

                {/* Categories Slider */}
                <section
                    className="bg-background py-16"
                    aria-labelledby="categories-title"
                >
                    <div className="container mx-auto px-4">
                        <SectionTitle
                            id="categories-title"
                            highlight={t("categories", "категории")}
                        >
                            {t("Product Categories", "Категории товаров")}
                        </SectionTitle>
                        {loadingCategories ? (
                            <CategorySkeleton />
                        ) : (
                            <CategorySlider categories={categories} />
                        )}

                        <div className="mt-8 text-center">
                            <Link href="/categories">
                                <Button
                                    size="lg"
                                    className="bg-primary hover:bg-primary/90 text-white h-12 px-8"
                                >
                                    {t("View All", "Посмотреть все")}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Featured Products with Category Filter */}
                <section
                    className="bg-[#ECF7F7] py-16"
                    aria-labelledby="featured-title"
                >
                    <div className="container mx-auto px-4">
                        <SectionTitle
                            id="featured-title"
                            highlight={t("Featured", "Избранные")}
                        >
                            {t("Featured Products", "Избранные товары")}
                        </SectionTitle>

                        {/* Category Filter Tabs */}
                        <div
                            className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide"
                            role="tablist"
                            aria-label={t(
                                "Filter by category",
                                "Фильтр по категории"
                            )}
                        >
                            <Button
                                variant={
                                    selectedCategory === "all"
                                        ? "default"
                                        : "outline"
                                }
                                onClick={() => setSelectedCategory("all")}
                                className={
                                    selectedCategory === "all"
                                        ? "bg-primary hover:bg-primary/90 text-white"
                                        : ""
                                }
                                role="tab"
                                aria-selected={selectedCategory === "all"}
                            >
                                {t("All", "Все")}
                            </Button>
                            {categories.map((category) => (
                                <Button
                                    key={category.id}
                                    variant={
                                        selectedCategory === category.id
                                            ? "default"
                                            : "outline"
                                    }
                                    onClick={() =>
                                        setSelectedCategory(category.id)
                                    }
                                    className={
                                        selectedCategory === category.id
                                            ? "bg-primary hover:bg-primary/90 text-white"
                                            : ""
                                    }
                                    role="tab"
                                    aria-selected={
                                        selectedCategory === category.id
                                    }
                                >
                                    {t(category.nameEn, category.nameRu)}
                                </Button>
                            ))}
                        </div>

                        {/* Products Grid */}
                        {loadingProducts ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <div key={i} className="space-y-3">
                                        <Skeleton className="aspect-square w-full rounded-lg" />
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <div
                                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6"
                                role="tabpanel"
                            >
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        id={product.id}
                                        name={product.nameEn}
                                        price={product.price.toString()}
                                        oldPrice={product.oldPrice?.toString()}
                                        image={product.coverImage || ""}
                                        description={
                                            product.shortDescriptionEn ||
                                            product.descriptionEn
                                        }
                                        rating={product.rating}
                                        isNew={product.isNew}
                                        discount={
                                            product.discount
                                                ? `${product.discount}%`
                                                : undefined
                                        }
                                        productCode={product.productCode}
                                        inStock={product.inStock}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 px-4">
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold mb-2">
                                        {t(
                                            "No products found",
                                            "Товары не найдены"
                                        )}
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {t(
                                            "No products in this category yet",
                                            "В этой категории пока нет товаров"
                                        )}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 text-center">
                            <Link href="/catalog">
                                <Button
                                    size="lg"
                                    className="bg-primary hover:bg-primary/90 text-white h-12 px-8"
                                >
                                    {t("View All", "Посмотреть все")}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us Section */}
                <section
                    className="bg-background py-16"
                    aria-labelledby="why-us-title"
                >
                    <div className="container mx-auto px-4">
                        <SectionTitle
                            id="why-us-title"
                            highlight={t("us", "нас")}
                        >
                            {t("Why Choose Us", "Почему именно мы")}
                        </SectionTitle>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="text-center border-none shadow-none bg-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                                <CardContent className="p-6 space-y-3">
                                    <div className="flex justify-center">
                                        <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors duration-300">
                                            <Truck
                                                className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300"
                                                aria-hidden="true"
                                            />
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors duration-300">
                                        {t("Fast Delivery", "Быстрая доставка")}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {t(
                                            "Quick and reliable delivery service",
                                            "Быстрая и надежная служба доставки"
                                        )}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="text-center border-none shadow-none bg-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                                <CardContent className="p-6 space-y-3">
                                    <div className="flex justify-center">
                                        <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors duration-300">
                                            <Shield
                                                className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300"
                                                aria-hidden="true"
                                            />
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors duration-300">
                                        {t("Warranty", "Гарантия")}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {t(
                                            "Warranty on all products",
                                            "Гарантия на все товары"
                                        )}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="text-center border-none shadow-none bg-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                                <CardContent className="p-6 space-y-3">
                                    <div className="flex justify-center">
                                        <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors duration-300">
                                            <Headphones
                                                className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300"
                                                aria-hidden="true"
                                            />
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors duration-300">
                                        {t("24/7 Support", "Поддержка 24/7")}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {t(
                                            "Always at your service",
                                            "Всегда к вашим услугам"
                                        )}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="text-center border-none shadow-none bg-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                                <CardContent className="p-6 space-y-3">
                                    <div className="flex justify-center">
                                        <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors duration-300">
                                            <Award
                                                className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300"
                                                aria-hidden="true"
                                            />
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors duration-300">
                                        {t(
                                            "Quality Guarantee",
                                            "Гарантия качества"
                                        )}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {t(
                                            "Only certified products",
                                            "Только сертифицированные товары"
                                        )}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Brands Section */}
                <section
                    className="bg-[#ECF7F7] py-16"
                    aria-labelledby="brands-title"
                >
                    <div className="container mx-auto px-4">
                        <SectionTitle
                            id="brands-title"
                            highlight={t("Brands", "бренды")}
                        >
                            {t("Our Brands", "Наши бренды")}
                        </SectionTitle>
                        {loadingBrands ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="border-2 rounded-lg"
                                    >
                                        <div className="p-6 flex items-center justify-center h-24">
                                            <Skeleton className="w-16 h-8" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <BrandsSlider brands={brands} />
                        )}
                    </div>
                </section>

                {/* Contact Information Section */}
                <section
                    className="bg-background py-16"
                    aria-labelledby="contact-title"
                >
                    <div className="container mx-auto px-4">
                        <SectionTitle
                            id="contact-title"
                            highlight={t("information", "информация")}
                        >
                            {t(
                                "Our Contact Information",
                                "Наша контактная информация"
                            )}
                        </SectionTitle>
                        <ContactInfo />

                        <div className="mt-12">
                            <YandexMap />
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section
                    className="bg-background py-16"
                    aria-labelledby="cta-title"
                >
                    <div className="container mx-auto px-4 text-center space-y-6">
                        <SectionTitle
                            id="cta-title"
                            highlight={t("special", "Специальные")}
                        >
                            {t(
                                "Special Offers for Professional Projects",
                                "Специальные предложения для профессиональных проектов"
                            )}
                        </SectionTitle>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            {t(
                                "Special prices and personal manager for large orders",
                                "Специальные цены и персональный менеджер для крупных заказов"
                            )}
                        </p>
                        <Link href="/contact">
                            <Button
                                size="lg"
                                className="bg-primary hover:bg-primary/90 text-white h-14 px-8"
                            >
                                {t("Contact Us", "Свяжитесь с нами")}
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
