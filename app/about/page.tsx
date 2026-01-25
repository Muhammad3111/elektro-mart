"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { Card, CardContent } from "@/components/ui/card";
import {
    CheckCircle,
    Users,
    Award,
    TrendingUp,
    Globe,
    Microscope,
    Factory,
    Handshake,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function AboutPage() {
    const { t } = useLanguage();

    const features = [
        {
            icon: Microscope,
            title: t("Laboratory Equipment", "Лабораторное оборудование"),
            description: t(
                "Certified equipment for scientific institutions",
                "Сертифицированное оборудование для научных учреждений",
            ),
        },
        {
            icon: Factory,
            title: t("Industrial Equipment", "Промышленное оборудование"),
            description: t(
                "Modern solutions for manufacturing enterprises",
                "Современные решения для производственных предприятий",
            ),
        },
        {
            icon: Globe,
            title: t("International Logistics", "Международная логистика"),
            description: t(
                "Direct supplies from world manufacturers",
                "Прямые поставки от мировых производителей",
            ),
        },
        {
            icon: Handshake,
            title: t("Long-term Partnership", "Долгосрочное партнёрство"),
            description: t(
                "Professional approach and technical expertise",
                "Профессиональный подход и техническая экспертиза",
            ),
        },
    ];

    const values = [
        {
            icon: CheckCircle,
            title: t("Quality", "Качество"),
            description: t(
                "Only certified products meeting international standards",
                "Только сертифицированная продукция, соответствующая международным стандартам",
            ),
        },
        {
            icon: Users,
            title: t("Expertise", "Экспертиза"),
            description: t(
                "Technical support at all project stages",
                "Техническая поддержка на всех этапах проекта",
            ),
        },
        {
            icon: Award,
            title: t("Reliability", "Надёжность"),
            description: t(
                "Transparency and responsibility in every decision",
                "Прозрачность и ответственность в каждом решении",
            ),
        },
        {
            icon: TrendingUp,
            title: t("Efficiency", "Эффективность"),
            description: t(
                "Optimal terms, cost and delivery times",
                "Оптимальные условия по срокам, стоимости и доставке",
            ),
        },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <SEO
                title={t("About Us", "О нас")}
                description="WWTS - надёжный поставщик лабораторного и промышленного оборудования мировых брендов на рынке Узбекистана. Прямые поставки, техническая экспертиза, долгосрочное партнёрство."
                keywords="WWTS, wwts.uz, лабораторное оборудование, промышленное оборудование, поставщик оборудования Узбекистан, научное оборудование"
                canonical="/about"
            />
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-linear-to-r from-primary/10 to-primary/5 py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center space-y-6">
                            <h1 className="text-4xl md:text-5xl font-black">
                                {t("About Us", "О нас")}
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                {t(
                                    "WORLDWIDE TECHNOLOGY SOLUTIONS (WWTS) — reliable supplier of laboratory and industrial equipment from world brands in the Uzbekistan market",
                                    "WORLDWIDE TECHNOLOGY SOLUTIONS (WWTS) — надёжный поставщик лабораторного и промышленного оборудования мировых брендов на рынке Узбекистана",
                                )}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="container mx-auto px-4 py-16">
                    <div className="max-w-4xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-8 text-center">
                            {t("Our Mission", "Наша миссия")}
                        </h2>
                        <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                            <p>
                                {t(
                                    "Our mission is to provide companies, scientific institutions and manufacturing enterprises with modern, proven and certified technological solutions that meet international quality standards.",
                                    "Наша миссия — обеспечивать компании, научные учреждения и производственные предприятия современными, проверенными и сертифицированными технологическими решениями, соответствующими международным стандартам качества.",
                                )}
                            </p>
                            <p>
                                {t(
                                    "We specialize in direct supplies of laboratory and industrial equipment, consumables and components from leading manufacturers around the world. Thanks to established international logistics and experience with contracts and exchange supplies, we offer clients optimal conditions in terms of timing, cost and reliability.",
                                    "Мы специализируемся на прямых поставках лабораторного и промышленного оборудования, расходных материалов и комплектующих от ведущих производителей со всего мира. Благодаря выстроенной международной логистике и опыту работы с контрактами и биржевыми поставками, мы предлагаем клиентам оптимальные условия по срокам, стоимости и надёжности.",
                                )}
                            </p>
                            <p>
                                {t(
                                    "WWTS emphasizes professional approach, technical expertise and long-term partnership. We support projects at all stages — from equipment selection to delivery, ensuring transparency, accuracy and responsibility in every decision.",
                                    "WWTS делает акцент на профессиональный подход, техническую экспертизу и долгосрочное партнёрство. Мы сопровождаем проекты на всех этапах — от подбора оборудования до поставки, обеспечивая прозрачность, точность и ответственность в каждом решении.",
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Goal */}
                    <div className="bg-primary/5 rounded-2xl p-8 md:p-12 mb-16">
                        <div className="max-w-3xl mx-auto text-center">
                            <h3 className="text-2xl font-bold mb-4">
                                {t("Our Goal", "Наша цель")}
                            </h3>
                            <p className="text-lg text-muted-foreground">
                                {t(
                                    "To be your technological partner in the development of laboratories and industrial infrastructure.",
                                    "Быть вашим технологическим партнёром в развитии лабораторий и промышленной инфраструктуры.",
                                )}
                            </p>
                        </div>
                    </div>

                    {/* What We Do */}
                    <h2 className="text-3xl font-bold mb-8 text-center">
                        {t("What We Do", "Что мы делаем")}
                    </h2>
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

                    {/* Our Values */}
                    <h2 className="text-3xl font-bold mb-8 text-center">
                        {t("Our Values", "Наши ценности")}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {values.map((value) => {
                            const Icon = value.icon;
                            return (
                                <Card
                                    key={value.title}
                                    className="text-center border-none shadow-none bg-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                                >
                                    <CardContent className="p-6 space-y-3">
                                        <div className="flex justify-center">
                                            <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors duration-300">
                                                <Icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                                            {value.title}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {value.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Stats */}
                    <div className="bg-[#ECF7F7] rounded-2xl p-8 md:p-12">
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
