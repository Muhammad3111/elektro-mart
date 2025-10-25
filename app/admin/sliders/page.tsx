"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    MoveUp,
    MoveDown,
    Image as ImageIcon,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminSlidersPage() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState("sliders");

    const sliders = [
        {
            id: 1,
            title: "Yangi mahsulotlar",
            titleRu: "Новые товары",
            description: "50% gacha chegirma",
            descriptionRu: "Скидка до 50%",
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop",
            link: "/catalog",
            order: 1,
            active: true,
        },
        {
            id: 2,
            title: "Premium kabellar",
            titleRu: "Премиум кабели",
            description: "Yuqori sifat kafolati",
            descriptionRu: "Гарантия высокого качества",
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd65?w=800&h=400&fit=crop",
            link: "/catalog?category=premium",
            order: 2,
            active: true,
        },
        {
            id: 3,
            title: "Aksiya",
            titleRu: "Акция",
            description: "Chegirmalar haftasi",
            descriptionRu: "Неделя скидок",
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd66?w=800&h=400&fit=crop",
            link: "/catalog?sale=true",
            order: 3,
            active: false,
        },
    ];

    const banners = [
        {
            id: 1,
            title: "Sidebar Banner",
            titleRu: "Боковой баннер",
            position: "sidebar",
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd67?w=400&h=600&fit=crop",
            link: "/products/featured",
            active: true,
        },
        {
            id: 2,
            title: "Top Banner",
            titleRu: "Верхний баннер",
            position: "top",
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd68?w=1200&h=200&fit=crop",
            link: "/sale",
            active: true,
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-4xl font-black">
                        {t("Slider va Banner", "Слайдер и Баннер")}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {t(
                            "Slider va bannerlarni boshqarish",
                            "Управление слайдерами и баннерами"
                        )}
                    </p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="sliders">
                            {t("Sliderlar", "Слайдеры")}
                        </TabsTrigger>
                        <TabsTrigger value="banners">
                            {t("Bannerlar", "Баннеры")}
                        </TabsTrigger>
                    </TabsList>

                    {/* Sliders Tab */}
                    <TabsContent value="sliders" className="space-y-6">
                        <div className="flex justify-end">
                            <Button className="gap-2 h-11">
                                <Plus className="h-5 w-5" />
                                {t("Yangi slider", "Новый слайдер")}
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {sliders.map((slider) => (
                                <Card key={slider.id}>
                                    <CardContent className="p-6">
                                        <div className="flex flex-col lg:flex-row gap-6">
                                            {/* Image Preview */}
                                            <div className="w-full lg:w-64 h-32 rounded-lg overflow-hidden bg-accent flex-shrink-0">
                                                <img
                                                    src={slider.image}
                                                    alt={slider.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 space-y-3">
                                                <div>
                                                    <h3 className="text-xl font-bold">
                                                        {slider.title}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {slider.titleRu}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm">
                                                        {slider.description}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {slider.descriptionRu}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-muted-foreground">
                                                        {t("Havola:", "Ссылка:")}
                                                    </span>
                                                    <code className="px-2 py-1 bg-accent rounded text-xs">
                                                        {slider.link}
                                                    </code>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex lg:flex-col gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                >
                                                    <MoveUp className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                >
                                                    <MoveDown className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                >
                                                    {slider.active ? (
                                                        <Eye className="h-4 w-4" />
                                                    ) : (
                                                        <EyeOff className="h-4 w-4" />
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Banners Tab */}
                    <TabsContent value="banners" className="space-y-6">
                        <div className="flex justify-end">
                            <Button className="gap-2 h-11">
                                <Plus className="h-5 w-5" />
                                {t("Yangi banner", "Новый баннер")}
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {banners.map((banner) => (
                                <Card key={banner.id}>
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            {/* Image */}
                                            <div className="w-full h-48 rounded-lg overflow-hidden bg-accent">
                                                <img
                                                    src={banner.image}
                                                    alt={banner.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Info */}
                                            <div>
                                                <h3 className="text-lg font-bold">
                                                    {banner.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {banner.titleRu}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                                                        {banner.position}
                                                    </span>
                                                    {banner.active && (
                                                        <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded">
                                                            {t("Faol", "Активный")}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2 pt-4 border-t">
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 gap-2"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                    {t("Tahrirlash", "Редактировать")}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
}
