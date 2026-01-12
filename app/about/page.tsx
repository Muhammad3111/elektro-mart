"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Users, Award, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function AboutPage() {
    const { t } = useLanguage();

    const features = [
        {
            icon: CheckCircle,
            title: t("High Quality", "Высокое качество"),
            description: t(
                "Only certified and verified products",
                "Только сертифицированные и проверенные товары"
            ),
        },
        {
            icon: Users,
            title: t("Professional Team", "Профессиональная команда"),
            description: t(
                "Experienced specialists will help you",
                "Опытные специалисты помогут вам"
            ),
        },
        {
            icon: Award,
            title: t("Trusted Brands", "Надежные бренды"),
            description: t(
                "World-renowned manufacturers",
                "Всемирно известные производители"
            ),
        },
        {
            icon: TrendingUp,
            title: t("Fast Delivery", "Быстрая доставка"),
            description: t(
                "Timely and safe delivery",
                "Своевременная и безопасная доставка"
            ),
        },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <SEO
                title="Biz haqimizda"
                description="Sobirov Market - O'zbekistonda professional elektr mahsulotlari yetkazib beruvchi. Siemens, Schneider, ABB, Legrand brendlari. Yuqori sifat, ishonchli xizmat va professional jamoa."
                keywords="sobirov market haqida, elektr mahsulotlari kompaniya, professional elektr, Toshkent elektr do'kon"
                canonical="/about"
            />
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-linear-to-r from-primary/10 to-primary/5 py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center space-y-6">
                            <h1 className="text-4xl md:text-5xl font-black">
                                {t("About Us", "О нас")}
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                {t(
                                    "WWTS - leading supplier of electrical products and accessories",
                                    "SobirovMarket - ведущий поставщик электрических товаров и аксессуаров"
                                )}
                            </p>
                        </div>
                    </div>
                </section>

                {/* About Content */}
                <section className="container mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">
                                {t("Our Mission", "Наша миссия")}
                            </h2>
                            <div className="space-y-4 text-muted-foreground">
                                <p>
                                    {t(
                                        "WWTS was founded in 2010 and holds a leading position in the Uzbekistan market in the field of electrical products and accessories.",
                                        "WWTS была основана в 2010 году и занимает ведущее положение на рынке Узбекистана в области электрических товаров и аксессуаров."
                                    )}
                                </p>
                                <p>
                                    {t(
                                        "We offer our customers high-quality products, professional service and competitive prices. Our goal is to help successfully implement each of your projects.",
                                        "Мы предлагаем нашим клиентам высококачественные товары, профессиональное обслуживание и конкурентные цены. Наша цель - помочь успешно реализовать каждый ваш проект."
                                    )}
                                </p>
                                <p>
                                    {t(
                                        "Our company supplies products that meet international standards and constantly expands its range.",
                                        "Наша компания поставляет продукцию, соответствующую международным стандартам, и постоянно расширяет ассортимент."
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="bg-primary/10 rounded-2xl h-96" />
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {features.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <Card
                                    key={feature.title}
                                    className="text-center border-none shadow-none bg-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                                >
                                    <CardContent className="p-6 space-y-3">
                                        <div className="flex justify-center">
                                            <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors duration-300">
                                                <Icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                                            {feature.title}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {feature.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Stats */}
                    <div className="bg-primary/5 rounded-2xl p-8 md:p-12">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-4xl font-black text-primary mb-2">
                                    10+
                                </div>
                                <div className="text-muted-foreground">
                                    {t("Years of Experience", "Лет опыта")}
                                </div>
                            </div>
                            <div>
                                <div className="text-4xl font-black text-primary mb-2">
                                    5000+
                                </div>
                                <div className="text-muted-foreground">
                                    {t("Products", "Товаров")}
                                </div>
                            </div>
                            <div>
                                <div className="text-4xl font-black text-primary mb-2">
                                    10000+
                                </div>
                                <div className="text-muted-foreground">
                                    {t("Customers", "Клиентов")}
                                </div>
                            </div>
                            <div>
                                <div className="text-4xl font-black text-primary mb-2">
                                    50+
                                </div>
                                <div className="text-muted-foreground">
                                    {t("Brands", "Брендов")}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
