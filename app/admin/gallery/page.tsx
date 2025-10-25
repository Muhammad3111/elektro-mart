"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
    Plus,
    Search,
    Trash2,
    Upload,
    Image as ImageIcon,
    Eye,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function AdminGalleryPage() {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState("");

    const images = [
        {
            id: 1,
            name: "product-image-1.jpg",
            url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
            size: "245 KB",
            uploadedAt: "2024-10-20",
            usedIn: 5,
        },
        {
            id: 2,
            name: "banner-main.jpg",
            url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd65?w=400&h=400&fit=crop",
            size: "512 KB",
            uploadedAt: "2024-10-19",
            usedIn: 1,
        },
        {
            id: 3,
            name: "category-cables.jpg",
            url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd66?w=400&h=400&fit=crop",
            size: "189 KB",
            uploadedAt: "2024-10-18",
            usedIn: 3,
        },
        {
            id: 4,
            name: "product-hdmi.jpg",
            url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd67?w=400&h=400&fit=crop",
            size: "321 KB",
            uploadedAt: "2024-10-17",
            usedIn: 2,
        },
        {
            id: 5,
            name: "slider-promo.jpg",
            url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd68?w=400&h=400&fit=crop",
            size: "678 KB",
            uploadedAt: "2024-10-16",
            usedIn: 1,
        },
        {
            id: 6,
            name: "product-usbc.jpg",
            url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd69?w=400&h=400&fit=crop",
            size: "234 KB",
            uploadedAt: "2024-10-15",
            usedIn: 4,
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-black">
                            {t("Galereya", "Галерея")}
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            {t(
                                "Barcha rasmlarni boshqarish",
                                "Управление всеми изображениями"
                            )}
                        </p>
                    </div>
                    <Button className="gap-2 h-11">
                        <Upload className="h-5 w-5" />
                        {t("Rasm yuklash", "Загрузить изображение")}
                    </Button>
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder={t(
                                    "Rasm qidirish...",
                                    "Поиск изображения..."
                                )}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-12"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Upload Area */}
                <Card className="border-2 border-dashed">
                    <CardContent className="p-12">
                        <div className="flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <Upload className="h-10 w-10 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                                {t(
                                    "Rasmlarni bu yerga tashlang",
                                    "Перетащите изображения сюда"
                                )}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                {t(
                                    "yoki fayllarni tanlash uchun bosing",
                                    "или нажмите для выбора файлов"
                                )}
                            </p>
                            <Button variant="outline" className="gap-2">
                                <ImageIcon className="h-5 w-5" />
                                {t("Fayllarni tanlash", "Выбрать файлы")}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Images Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {images.map((image) => (
                        <Card
                            key={image.id}
                            className="group overflow-hidden hover:shadow-lg transition-all"
                        >
                            <CardContent className="p-0">
                                <div className="relative aspect-square">
                                    <img
                                        src={image.url}
                                        alt={image.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            className="h-10 w-10"
                                        >
                                            <Eye className="h-5 w-5" />
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            className="h-10 w-10 text-red-500 hover:text-red-600"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <p className="font-semibold text-sm truncate mb-1">
                                        {image.name}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>{image.size}</span>
                                        <span>
                                            {image.usedIn}{" "}
                                            {t("joyda", "мест")}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
