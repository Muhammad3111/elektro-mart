"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { Card, CardContent } from "@/components/ui/card";
import {
    Shield,
    Globe,
    FileText,
    Warehouse,
    MapPin,
    Package,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function DeliveryPage() {
    const { t } = useLanguage();

    const advantages = [
        {
            icon: Globe,
            title: t("International Logistics", "Международная логистика"),
            description: t(
                "Established supply chains from Europe, USA, China, Japan and other countries",
                "Налаженные цепочки поставок из Европы, США, Китая, Японии и других стран",
            ),
        },
        {
            icon: FileText,
            title: t("Customs Clearance", "Таможенное оформление"),
            description: t(
                "Full support for customs procedures and documentation",
                "Полное сопровождение таможенных процедур и документации",
            ),
        },
        {
            icon: Shield,
            title: t("Cargo Insurance", "Страхование грузов"),
            description: t(
                "All shipments are insured against damage and loss",
                "Все грузы застрахованы от повреждений и утери",
            ),
        },
        {
            icon: Warehouse,
            title: t("Warehousing", "Складское хранение"),
            description: t(
                "Secure storage facilities in Tashkent with climate control",
                "Безопасные складские помещения в Ташкенте с климат-контролем",
            ),
        },
    ];

    const deliverySteps = [
        {
            step: 1,
            title: t("Order Confirmation", "Подтверждение заказа"),
            description: t(
                "We confirm your order and prepare all necessary documentation",
                "Подтверждаем ваш заказ и готовим всю необходимую документацию",
            ),
        },
        {
            step: 2,
            title: t("Procurement", "Закупка"),
            description: t(
                "Equipment is ordered from the manufacturer or authorized distributor",
                "Оборудование заказывается у производителя или авторизованного дистрибьютора",
            ),
        },
        {
            step: 3,
            title: t("Quality Control", "Контроль качества"),
            description: t(
                "Inspection and verification of equipment before shipment",
                "Проверка и верификация оборудования перед отправкой",
            ),
        },
        {
            step: 4,
            title: t("International Shipping", "Международная доставка"),
            description: t(
                "Transportation via optimal route with real-time tracking",
                "Транспортировка по оптимальному маршруту с отслеживанием в реальном времени",
            ),
        },
        {
            step: 5,
            title: t("Customs Clearance", "Таможенное оформление"),
            description: t(
                "Professional handling of all import procedures",
                "Профессиональное оформление всех импортных процедур",
            ),
        },
        {
            step: 6,
            title: t("Final Delivery", "Финальная доставка"),
            description: t(
                "Delivery to your location with installation support if needed",
                "Доставка до вашего объекта с поддержкой установки при необходимости",
            ),
        },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <SEO
                title={t("Delivery", "Доставка")}
                description="WWTS - международная доставка лабораторного и промышленного оборудования. Авиа, морские, железнодорожные и автомобильные перевозки. Таможенное оформление и страхование."
                keywords="доставка оборудования, международная логистика, таможенное оформление, авиаперевозки, морские перевозки, WWTS"
                canonical="/delivery"
            />
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-linear-to-r from-primary/10 to-primary/5 py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center space-y-6">
                            <h1 className="text-4xl md:text-5xl font-black">
                                {t(
                                    "Delivery & Logistics",
                                    "Доставка и логистика",
                                )}
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                {t(
                                    "International delivery of laboratory and industrial equipment from leading world manufacturers",
                                    "Международная доставка лабораторного и промышленного оборудования от ведущих мировых производителей",
                                )}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="container mx-auto px-4 py-16">
                    {/* Delivery Process */}
                    <div className="bg-[#ECF7F7] rounded-2xl p-8 md:p-12 mb-16">
                        <h2 className="text-3xl font-bold mb-8 text-center">
                            {t("Delivery Process", "Процесс доставки")}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {deliverySteps.map((step) => (
                                <div
                                    key={step.step}
                                    className="flex gap-4 items-start"
                                >
                                    <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                                        {step.step}
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">
                                            {step.title}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Advantages */}
                    <h2 className="text-3xl font-bold mb-8 text-center">
                        {t("Our Advantages", "Наши преимущества")}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {advantages.map((advantage) => {
                            const Icon = advantage.icon;
                            return (
                                <Card
                                    key={advantage.title}
                                    className="text-center border-none shadow-none bg-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                                >
                                    <CardContent className="p-6 space-y-3">
                                        <div className="flex justify-center">
                                            <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors duration-300">
                                                <Icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                                            {advantage.title}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {advantage.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Geography */}
                    <div className="bg-primary/5 rounded-2xl p-8 md:p-12 mb-16">
                        <div className="max-w-3xl mx-auto text-center">
                            <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-4">
                                {t("Delivery Geography", "География доставки")}
                            </h3>
                            <p className="text-lg text-muted-foreground mb-6">
                                {t(
                                    "We deliver equipment from manufacturers in Europe, USA, China, Japan, South Korea, and other countries. Our logistics network covers the entire territory of Uzbekistan.",
                                    "Мы доставляем оборудование от производителей из Европы, США, Китая, Японии, Южной Кореи и других стран. Наша логистическая сеть охватывает всю территорию Узбекистана.",
                                )}
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                {[
                                    "🇩🇪 Germany",
                                    "🇺🇸 USA",
                                    "🇨🇳 China",
                                    "🇯🇵 Japan",
                                    "🇰🇷 South Korea",
                                    "🇮🇹 Italy",
                                ].map((country) => (
                                    <span
                                        key={country}
                                        className="px-4 py-2 bg-white rounded-full text-sm font-medium shadow-sm"
                                    >
                                        {country}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                        <h3 className="text-2xl font-bold mb-4">
                            {t("Need a Quote?", "Нужен расчёт стоимости?")}
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            {t(
                                "Contact us for a personalized delivery quote for your equipment",
                                "Свяжитесь с нами для расчёта стоимости доставки вашего оборудования",
                            )}
                        </p>
                        <a
                            href="/contact"
                            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                        >
                            <Package className="h-5 w-5" />
                            {t("Get Quote", "Получить расчёт")}
                        </a>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
