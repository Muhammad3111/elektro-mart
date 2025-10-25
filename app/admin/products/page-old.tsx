"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    Package,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function AdminProductsPage() {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState("");

    const products = [
        {
            id: 1,
            name: "HDMI Kabel 2m",
            category: "Kabellar",
            price: "45,000",
            stock: 156,
            status: "active",
            image: "https://via.placeholder.com/100",
        },
        {
            id: 2,
            name: "USB-C Kabel",
            category: "Kabellar",
            price: "32,000",
            stock: 89,
            status: "active",
            image: "https://via.placeholder.com/100",
        },
        {
            id: 3,
            name: "Optik Kabel 5m",
            category: "Kabellar",
            price: "89,000",
            stock: 45,
            status: "active",
            image: "https://via.placeholder.com/100",
        },
        {
            id: 4,
            name: "Quvvat Kabeli",
            category: "Elektr",
            price: "56,000",
            stock: 0,
            status: "out_of_stock",
            image: "https://via.placeholder.com/100",
        },
    ];

    const getStatusBadge = (status: string) => {
        if (status === "active") {
            return (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                    {t("Faol", "Активный")}
                </span>
            );
        }
        return (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500">
                {t("Tugagan", "Нет в наличии")}
            </span>
        );
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-black">
                            {t("Mahsulotlar", "Товары")}
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            {t(
                                "Barcha mahsulotlarni boshqarish",
                                "Управление всеми товарами"
                            )}
                        </p>
                    </div>
                    <Button className="gap-2 h-11">
                        <Plus className="h-5 w-5" />
                        {t("Yangi mahsulot", "Новый товар")}
                    </Button>
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder={t(
                                    "Mahsulot qidirish...",
                                    "Поиск товара..."
                                )}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-12"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Products Table */}
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b bg-accent/50">
                                    <tr>
                                        <th className="text-left p-4 font-semibold">
                                            {t("Mahsulot", "Товар")}
                                        </th>
                                        <th className="text-left p-4 font-semibold">
                                            {t("Kategoriya", "Категория")}
                                        </th>
                                        <th className="text-left p-4 font-semibold">
                                            {t("Narx", "Цена")}
                                        </th>
                                        <th className="text-left p-4 font-semibold">
                                            {t("Ombor", "Склад")}
                                        </th>
                                        <th className="text-left p-4 font-semibold">
                                            {t("Holat", "Статус")}
                                        </th>
                                        <th className="text-right p-4 font-semibold">
                                            {t("Amallar", "Действия")}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr
                                            key={product.id}
                                            className="border-b hover:bg-accent/50 transition-colors"
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
                                                        <Package className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">
                                                            {product.name}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            ID: {product.id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {product.category}
                                            </td>
                                            <td className="p-4 font-semibold">
                                                {product.price} UZS
                                            </td>
                                            <td className="p-4">
                                                <span
                                                    className={
                                                        product.stock > 0
                                                            ? "text-green-500 font-medium"
                                                            : "text-red-500 font-medium"
                                                    }
                                                >
                                                    {product.stock}{" "}
                                                    {t("ta", "шт")}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {getStatusBadge(product.status)}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
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
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
