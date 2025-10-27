"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSlider } from "@/components/hero-slider";
import { ProductCard } from "@/components/product-card";
import { SEO } from "@/components/seo";
import { StructuredData } from "@/components/structured-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Zap,
    Cable,
    Plug,
    Wrench,
    Lightbulb,
    Package,
    Truck,
    Shield,
    Headphones,
    Award,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function Home() {
    const { t } = useLanguage();
    const [selectedCategory, setSelectedCategory] = useState("Barchasi");

    const categories = [
        { name: "Kabellar", nameRu: "Кабели", icon: Cable, id: "kabellar", slug: "kabellar", image: "" },
        { name: "Yoritish", nameRu: "Освещение", icon: Lightbulb, id: "yoritish", slug: "yoritish", image: "" },
        { name: "Rozetkalar", nameRu: "Розетки", icon: Plug, id: "rozetkalar", slug: "rozetkalar", image: "" },
        { name: "Avtomatlar", nameRu: "Автоматы", icon: Zap, id: "avtomatlar", slug: "avtomatlar", image: "" },
        { name: "Asboblar", nameRu: "Инструменты", icon: Wrench, id: "asboblar", slug: "asboblar", image: "" },
        { name: "Aksessuarlar", nameRu: "Аксессуары", icon: Package, id: "aksessuarlar", slug: "aksessuarlar", image: "" },
    ];

    const allProducts = [
        {
            id: 1,
            name: "RG6 Koaksial Kabel",
            category: "data",
            description: "Yuqori sifatli koaksial kabel, sun'iy yo'ldosh va kabel TV uchun ideal",
            price: "45,000",
            oldPrice: "55,000",
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
            rating: 4.8,
            isNew: true,
            discount: "18%",
        },
        {
            id: 2,
            name: "Optik Tolali Kabel Premium",
            category: "data",
            description: "Tezkor internet va ma'lumot uzatish uchun zamonaviy optik kabel",
            price: "85,000",
            image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=400&fit=crop",
            rating: 5.0,
        },
        {
            id: 3,
            name: "Quvvat Kabeli NEMA 5-15P",
            category: "power",
            description: "Kuchli quvvat uzatish uchun ishonchli elektr kabeli",
            price: "25,000",
            oldPrice: "30,000",
            image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=400&fit=crop",
            rating: 4.5,
            discount: "17%",
        },
        {
            id: 4,
            name: "HDMI Kabel 2.1 Ultra HD",
            category: "data",
            description: "4K va 8K video uchun yuqori sifatli HDMI kabel",
            price: "55,000",
            image: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=400&h=400&fit=crop",
            rating: 4.7,
            isNew: true,
        },
        {
            id: 5,
            name: "Professional Kabel Qirqgich",
            category: "tools",
            description: "Professional darajadagi kabel qirqish va tozalash asboblari",
            price: "35,000",
            image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400&h=400&fit=crop",
            rating: 4.6,
        },
        {
            id: 6,
            name: "USB-C to USB-A Kabel 3m",
            category: "data",
            description: "Tez zaryadlash va ma'lumot uzatish uchun 3 metrli USB kabel",
            price: "22,000",
            oldPrice: "28,000",
            image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=400&fit=crop",
            rating: 4.4,
            discount: "21%",
        },
        {
            id: 7,
            name: "BNC Ulagich Professional",
            category: "connectors",
            description: "Video kuzatuv tizimlari uchun professional BNC ulagichlar",
            price: "12,000",
            image: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=400&h=400&fit=crop",
            rating: 4.3,
        },
        {
            id: 8,
            name: "LED Yoritgich 50W",
            category: "lighting",
            description: "Energiya tejovchi 50W LED yoritgich, yorug' va uzoq umrli",
            price: "65,000",
            image: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=400&h=400&fit=crop",
            rating: 4.9,
            isNew: true,
        },
        {
            id: 9,
            name: "Kabel Boshqaruvchi Set",
            category: "accessories",
            description: "Kabellarni tartibli saqlash va boshqarish uchun to'plam",
            price: "15,000",
            image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=400&fit=crop",
            rating: 4.2,
        },
    ];

    const filteredProducts =
        selectedCategory === "Barchasi"
            ? allProducts.slice(0, 9)
            : allProducts
                  .filter(
                      (p) =>
                          p.category ===
                          categories.find((c) => c.name === selectedCategory)
                              ?.id
                  )
                  .slice(0, 9);

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

                {/* Categories - 6 in one row */}
                <section className="bg-background py-12">
                    <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.map((category) => {
                            const Icon = category.icon;
                            return (
                                <Link key={category.id} href={`/categories/${category.slug}`}>
                                    <Card className="hover:shadow-lg transition-all cursor-pointer hover:scale-105 group">
                                        <CardContent className="p-6 text-center space-y-3">
                                            <div className="flex justify-center">
                                                {category.image ? (
                                                    <div className="w-16 h-16 rounded-full overflow-hidden">
                                                        <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                                                        <Icon className="h-8 w-8 text-primary" />
                                                    </div>
                                                )}
                                            </div>
                                            <p className="font-medium text-sm">
                                                {t(category.name, category.nameRu)}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                    </div>
                </section>

                {/* Featured Products with Category Filter */}
                <section className="bg-primary/5 py-12">
                    <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-3xl font-bold">
                            {t("Tanlangan mahsulotlar", "Избранные товары")}
                        </h3>
                    </div>

                    {/* Category Filter Tabs */}
                    <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                        <Button
                            variant={
                                selectedCategory === "Barchasi"
                                    ? "default"
                                    : "outline"
                            }
                            onClick={() => setSelectedCategory("Barchasi")}
                            className={
                                selectedCategory === "Barchasi"
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
                                    selectedCategory === category.name
                                        ? "default"
                                        : "outline"
                                }
                                onClick={() =>
                                    setSelectedCategory(category.name)
                                }
                                className={
                                    selectedCategory === category.name
                                        ? "bg-primary hover:bg-primary/90 text-white"
                                        : ""
                                }
                            >
                                {category.name}
                            </Button>
                        ))}
                    </div>

                    {/* Products Grid - 5 per row on desktop */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                price={product.price}
                                oldPrice={product.oldPrice}
                                image={product.image}
                                description={product.description}
                                rating={product.rating}
                                isNew={product.isNew}
                                discount={product.discount}
                            />
                        ))}
                    </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="bg-background py-16">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="text-center border-none shadow-none bg-transparent">
                                <CardContent className="p-6 space-y-3">
                                    <div className="flex justify-center">
                                        <div className="p-4 bg-primary/10 rounded-full">
                                            <Truck className="h-8 w-8 text-primary" />
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg">
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

                            <Card className="text-center border-none shadow-none bg-transparent">
                                <CardContent className="p-6 space-y-3">
                                    <div className="flex justify-center">
                                        <div className="p-4 bg-primary/10 rounded-full">
                                            <Shield className="h-8 w-8 text-primary" />
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg">
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

                            <Card className="text-center border-none shadow-none bg-transparent">
                                <CardContent className="p-6 space-y-3">
                                    <div className="flex justify-center">
                                        <div className="p-4 bg-primary/10 rounded-full">
                                            <Headphones className="h-8 w-8 text-primary" />
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg">
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

                            <Card className="text-center border-none shadow-none bg-transparent">
                                <CardContent className="p-6 space-y-3">
                                    <div className="flex justify-center">
                                        <div className="p-4 bg-primary/10 rounded-full">
                                            <Award className="h-8 w-8 text-primary" />
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg">
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
                    <h3 className="text-3xl font-bold text-center mb-12">
                        {t("Brendlarimiz", "Наши бренды")}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {[
                            "Siemens",
                            "Schneider",
                            "ABB",
                            "Legrand",
                            "Philips",
                            "Osram",
                        ].map((brand) => (
                            <Link key={brand} href={`/catalog?brand=${brand}`}>
                                <Card className="hover:shadow-lg transition-all cursor-pointer hover:scale-105 border-2">
                                    <CardContent className="p-6 flex items-center justify-center">
                                        <p className="font-bold text-lg text-muted-foreground hover:text-primary transition-colors">
                                            {brand}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-background py-16">
                    <div className="container mx-auto px-4 text-center space-y-6">
                        <h2 className="text-3xl md:text-4xl font-black">
                            {t(
                                "Professional loyihalar uchun maxsus takliflar",
                                "Специальные предложения для профессиональных проектов"
                            )}
                        </h2>
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
