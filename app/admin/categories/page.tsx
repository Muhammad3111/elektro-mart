"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, Edit, Trash2, FolderTree } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function AdminCategoriesPage() {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState("");

    const categories = [
        {
            id: 1,
            name: "Kabellar",
            nameRu: "Кабели",
            slug: "kabellar",
            products: 156,
            status: "active",
        },
        {
            id: 2,
            name: "Yoritish",
            nameRu: "Освещение",
            slug: "yoritish",
            products: 89,
            status: "active",
        },
        {
            id: 3,
            name: "Rozetkalar",
            nameRu: "Розетки",
            slug: "rozetkalar",
            products: 67,
            status: "active",
        },
        {
            id: 4,
            name: "Avtomatlar",
            nameRu: "Автоматы",
            slug: "avtomatlar",
            products: 45,
            status: "active",
        },
        {
            id: 5,
            name: "Asboblar",
            nameRu: "Инструменты",
            slug: "asboblar",
            products: 34,
            status: "active",
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-black">
                            {t("Kategoriyalar", "Категории")}
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            {t(
                                "Mahsulot kategoriyalarini boshqarish",
                                "Управление категориями товаров"
                            )}
                        </p>
                    </div>
                    <Button className="gap-2 h-11">
                        <Plus className="h-5 w-5" />
                        {t("Yangi kategoriya", "Новая категория")}
                    </Button>
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder={t(
                                    "Kategoriya qidirish...",
                                    "Поиск категории..."
                                )}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-12"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <Card
                            key={category.id}
                            className="hover:shadow-lg transition-shadow"
                        >
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <FolderTree className="h-7 w-7 text-primary" />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-600"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-1">
                                    {category.name}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {category.nameRu}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t">
                                    <div>
                                        <p className="text-2xl font-bold text-primary">
                                            {category.products}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {t("Mahsulotlar", "Товары")}
                                        </p>
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                                        {t("Faol", "Активный")}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
