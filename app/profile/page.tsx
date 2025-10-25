"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    User,
    ShoppingBag,
    MapPin,
    Phone,
    Mail,
    Edit,
    Package,
    Clock,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function ProfilePage() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState("profile");

    // Mock user data
    const userData = {
        name: "Sardor Sobirov",
        phone: "+998 33 470 47 00",
        email: "sobirovsardor138@gmail.com",
        address: "Toshkent sh., Chilonzor tumani, Bunyodkor ko'chasi 1-uy",
    };

    // Mock order history
    const orders = [
        {
            id: "ORD-001",
            date: "2024-10-20",
            status: "delivered",
            total: "450,000",
            items: 3,
        },
        {
            id: "ORD-002",
            date: "2024-10-18",
            status: "processing",
            total: "320,000",
            items: 2,
        },
        {
            id: "ORD-003",
            date: "2024-10-15",
            status: "cancelled",
            total: "180,000",
            items: 1,
        },
        {
            id: "ORD-004",
            date: "2024-10-10",
            status: "delivered",
            total: "890,000",
            items: 5,
        },
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "delivered":
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case "processing":
                return <Clock className="h-5 w-5 text-yellow-500" />;
            case "cancelled":
                return <XCircle className="h-5 w-5 text-red-500" />;
            default:
                return <Package className="h-5 w-5 text-gray-500" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "delivered":
                return t("Yetkazildi", "Доставлено");
            case "processing":
                return t("Jarayonda", "В обработке");
            case "cancelled":
                return t("Bekor qilindi", "Отменено");
            default:
                return status;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <SEO
                title={t("Profil", "Профиль")}
                description={t(
                    "Foydalanuvchi profili va buyurtmalar tarixi",
                    "Профиль пользователя и история заказов"
                )}
                canonical="/profile"
                noindex={true}
            />
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-1/4">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center text-center mb-6">
                                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                        <User className="h-12 w-12 text-primary" />
                                    </div>
                                    <h2 className="text-xl font-bold">
                                        {userData.name}
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        {userData.email}
                                    </p>
                                </div>

                                <Separator className="my-4" />

                                <nav className="space-y-2">
                                    <Button
                                        variant={
                                            activeTab === "profile"
                                                ? "default"
                                                : "ghost"
                                        }
                                        className="w-full justify-start gap-2"
                                        onClick={() => setActiveTab("profile")}
                                    >
                                        <User className="h-5 w-5" />
                                        {t("Profil", "Профиль")}
                                    </Button>
                                    <Button
                                        variant={
                                            activeTab === "orders"
                                                ? "default"
                                                : "ghost"
                                        }
                                        className="w-full justify-start gap-2"
                                        onClick={() => setActiveTab("orders")}
                                    >
                                        <ShoppingBag className="h-5 w-5" />
                                        {t("Buyurtmalar", "Заказы")}
                                    </Button>
                                </nav>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {activeTab === "profile" && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl">
                                        {t(
                                            "Shaxsiy ma'lumotlar",
                                            "Личная информация"
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            {t("Ism va Familiya", "Имя и Фамилия")}
                                        </Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                id="name"
                                                defaultValue={userData.name}
                                                className="pl-10 h-12"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">
                                            {t("Telefon", "Телефон")}
                                        </Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                id="phone"
                                                defaultValue={userData.phone}
                                                className="pl-10 h-12"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">
                                            {t("Email", "Email")}
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
                                                defaultValue={userData.email}
                                                className="pl-10 h-12"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">
                                            {t("Manzil", "Адрес")}
                                        </Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                id="address"
                                                defaultValue={userData.address}
                                                className="pl-10 h-12"
                                            />
                                        </div>
                                    </div>

                                    <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white gap-2">
                                        <Edit className="h-5 w-5" />
                                        {t(
                                            "O'zgarishlarni saqlash",
                                            "Сохранить изменения"
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === "orders" && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl">
                                        {t("Buyurtmalar tarixi", "История заказов")}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {orders.length === 0 ? (
                                        <div className="text-center py-12">
                                            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                            <p className="text-xl text-muted-foreground">
                                                {t(
                                                    "Buyurtmalar topilmadi",
                                                    "Заказы не найдены"
                                                )}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {orders.map((order) => (
                                                <Card
                                                    key={order.id}
                                                    className="border-2"
                                                >
                                                    <CardContent className="p-6">
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <Package className="h-5 w-5 text-primary" />
                                                                    <span className="font-bold text-lg">
                                                                        {order.id}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                    <Clock className="h-4 w-4" />
                                                                    {order.date}
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    {getStatusIcon(
                                                                        order.status
                                                                    )}
                                                                    <span className="font-medium">
                                                                        {getStatusText(
                                                                            order.status
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="text-right space-y-2">
                                                                <div className="text-2xl font-bold text-primary">
                                                                    {order.total} UZS
                                                                </div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {order.items}{" "}
                                                                    {t(
                                                                        "ta mahsulot",
                                                                        "товаров"
                                                                    )}
                                                                </div>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                >
                                                                    {t(
                                                                        "Batafsil",
                                                                        "Подробнее"
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
