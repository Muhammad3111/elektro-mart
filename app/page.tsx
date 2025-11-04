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
import { SEO } from "@/components/seo";
import { StructuredData } from "@/components/structured-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Truck,
    Shield,
    Headphones,
    Award,
} from "lucide-react";
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
            // Get parent categories and attach their subcategories
            const parentCategories = data.filter((c) => !c.parentId && c.isActive);
            const categoriesWithSubs = parentCategories.map(parent => ({
                ...parent,
                subCategories: data.filter(sub => sub.parentId === parent.id && sub.isActive)
            }));
            setCategories(categoriesWithSubs);
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
            const params: any = {
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
        loadFeaturedProducts();
        loadBrands();
    }, [loadFeaturedProducts]);

    useEffect(() => {
        loadFeaturedProducts();
    }, [selectedCategory, loadFeaturedProducts]);

    return (
        <div className="min-h-screen flex flex-col">
            <SEO
                title="Bosh sahifa - Professional elektr mahsulotlari"
                description="O'zbekistonda eng yaxshi elektr kabel, ulagichlar, rozetkalar va aksessuarlar. Siemens, Schneider, ABB, Legrand brendlari. Tez yetkazib berish, 12 oy kafolat va professional xizmat."
                keywords="elektr kabel, kabel sotib olish, ulagichlar, rozetkalar, avtomatlar, elektr aksessuarlar, Siemens, Schneider, ABB, Legrand, Toshkent, O'zbekiston"
                canonical="/"
            />
            <StructuredData type="WebSite" />
            <StructuredData type="Organization" />
            <Header />

            <main className="flex-1">
                {/* Hero Slider */}
                <HeroSlider />

                {/* Categories Slider */}
                <section className="bg-background py-16">
                    <div className="container mx-auto px-4">
                        <SectionTitle highlight={t("kategoriyalari", "категории")}>
                            {t("Mahsulot kategoriyalari", "Категории товаров")}
                        </SectionTitle>
                        {loadingCategories ? (
                            <CategorySkeleton />
                        ) : (
                            <CategorySlider categories={categories} />
                        )}
                        
                        {/* View All Categories Button */}
                        <div className="mt-8 text-center">
                            <Link href="/categories">
                                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white h-12 px-8">
                                    {t("Barchasini ko'rish", "Посмотреть все")}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Featured Products with Category Filter */}
                <section className="bg-primary/5 py-16">
                    <div className="container mx-auto px-4">
                    <SectionTitle highlight={t("Tanlangan", "Избранные")}>
                        {t("Tanlangan mahsulotlar", "Избранные товары")}
                    </SectionTitle>

                    {/* Category Filter Tabs */}
                    <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
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
                        >
                            {t("Barchasi", "Все")}
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
                            >
                                {t(category.nameUz, category.nameRu)}
                            </Button>
                        ))}
                    </div>

                    {/* Products Grid - 5 per row on desktop */}
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
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    id={product.id}
                                    name={product.nameUz}
                                    price={product.price.toString()}
                                    oldPrice={product.oldPrice?.toString()}
                                    image={product.coverImage || ""}
                                    description={product.shortDescriptionUz || product.descriptionUz}
                                    rating={product.rating}
                                    isNew={product.isNew}
                                    discount={product.discount ? `${product.discount}%` : undefined}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <div className="text-center">
                                <h3 className="text-2xl font-bold mb-2">
                                    {t("Mahsulot topilmadi", "Товары не найдены")}
                                </h3>
                                <p className="text-muted-foreground">
                                    {t("Bu kategoriyada hozircha mahsulot yo'q", "В этой категории пока нет товаров")}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* View All Button */}
                    <div className="mt-8 text-center">
                        <Link href="/catalog">
                            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white h-12 px-8">
                                {t("Barchasini ko'rish", "Посмотреть все")}
                            </Button>
                        </Link>
                    </div>
                    </div>
                </section>

                {/* Why Choose Us Section */}
                <section className="bg-background py-16">
                    <div className="container mx-auto px-4">
                        <SectionTitle highlight={t("biz", "нас")}>
                            {t("Nega aynan biz", "Почему именно мы")}
                        </SectionTitle>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="text-center border-none shadow-none bg-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                                <CardContent className="p-6 space-y-3">
                                    <div className="flex justify-center">
                                        <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors duration-300">
                                            <Truck className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors duration-300">
                                        {t(
                                            "Tez yetkazib berish",
                                            "Быстрая доставка"
                                        )}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {t(
                                            "Tezkor yetkazib berish",
                                            "Быстрая доставка"
                                        )}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="text-center border-none shadow-none bg-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                                <CardContent className="p-6 space-y-3">
                                    <div className="flex justify-center">
                                        <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors duration-300">
                                            <Shield className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors duration-300">
                                        {t("Kafolat", "Гарантия")}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {t(
                                            "Mahsulotlarga kafolat beriladi",
                                            "Гарантия на товары"
                                        )}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="text-center border-none shadow-none bg-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                                <CardContent className="p-6 space-y-3">
                                    <div className="flex justify-center">
                                        <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors duration-300">
                                            <Headphones className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors duration-300">
                                        {t(
                                            "24/7 Qo'llab-quvvatlash",
                                            "Поддержка 24/7"
                                        )}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {t(
                                            "Doimo sizning xizmatingizda",
                                            "Всегда к вашим услугам"
                                        )}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="text-center border-none shadow-none bg-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                                <CardContent className="p-6 space-y-3">
                                    <div className="flex justify-center">
                                        <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors duration-300">
                                            <Award className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors duration-300">
                                        {t(
                                            "Sifat kafolati",
                                            "Гарантия качества"
                                        )}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {t(
                                            "Faqat sertifikatlangan mahsulotlar",
                                            "Только сертифицированные товары"
                                        )}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Brands Section */}
                <section className="bg-primary/5 py-16">
                    <div className="container mx-auto px-4">
                    <SectionTitle highlight={t("Brendlarimiz", "бренды")}>
                        {t("Brendlarimiz", "Наши бренды")}
                    </SectionTitle>
                    {loadingBrands ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="border-2 rounded-lg">
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
                <section className="bg-background py-16">
                    <div className="container mx-auto px-4">
                        <SectionTitle highlight={t("ma'lumotlarimiz", "информация")}>
                            {t("Bizning aloqa ma'lumotlarimiz", "Наша контактная информация")}
                        </SectionTitle>
                        <ContactInfo />
                        
                        {/* Yandex Map */}
                        <div className="mt-12">
                            <YandexMap />
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-background py-16">
                    <div className="container mx-auto px-4 text-center space-y-6">
                        <SectionTitle highlight={t("maxsus", "Специальные")}>
                            {t(
                                "Professional loyihalar uchun maxsus takliflar",
                                "Специальные предложения для профессиональных проектов"
                            )}
                        </SectionTitle>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            {t(
                                "Katta hajmdagi buyurtmalar uchun maxsus narxlar va shaxsiy menejer",
                                "Специальные цены и персональный менеджер для крупных заказов"
                            )}
                        </p>
                        <Link href="/contact">
                            <Button
                                size="lg"
                                className="bg-primary hover:bg-primary/90 text-white h-14 px-8"
                            >
                                {t("Biz bilan bog'laning", "Свяжитесь с нами")}
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
