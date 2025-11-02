"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/admin/pagination";
import { Plus, Search, Edit, Trash2, Package, Eye, ShoppingCart, Star } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { productsAPI, categoriesAPI } from "@/lib/api";
import { toast } from "sonner";
import type { Category } from "@/types/category";
import type { QueryProductDto, Product } from "@/types/product";
import { S3Image } from "@/components/s3-image";

export default function AdminProductsPage() {
    const { t } = useLanguage();
    const router = useRouter();
    
    // State
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("createdAt");
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const loadProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params: QueryProductDto = {
                page: currentPage,
                limit: itemsPerPage,
                search: searchQuery || undefined,
                categoryId: selectedCategory !== "all" ? selectedCategory : undefined,
                sortBy: sortBy as any,
                sortOrder: "DESC",
            };

            const result = await productsAPI.getAll(params);
            setProducts(result.data);
            setTotalItems(result.total);
            const pages = Math.ceil(result.total / result.limit);
            setTotalPages(pages > 0 ? pages : 1);
        } catch (error) {
            console.error("Error loading products:", error);
            toast.error(t("Mahsulotlarni yuklashda xatolik", "Ошибка при загрузке товаров"));
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage, searchQuery, selectedCategory, sortBy, t]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const result = await categoriesAPI.getAll();
            setCategories(result);
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t("Rostdan ham o'chirmoqchimisiz?", "Вы уверены, что хотите удалить?"))) {
            return;
        }

        try {
            await productsAPI.delete(id);
            toast.success(t("Mahsulot o'chirildi", "Товар удален"));
            loadProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error(t("O'chirishda xatolik", "Ошибка при удалении"));
        }
    };

    const toggleFeatured = async (id: string, currentValue: boolean) => {
        try {
            await productsAPI.update(id, { isFeatured: !currentValue });
            toast.success(t("Holat o'zgartirildi", "Статус изменен"));
            loadProducts();
        } catch (error) {
            console.error("Error toggling featured:", error);
            toast.error(t("Xatolik yuz berdi", "Произошла ошибка"));
        }
    };

    const toggleActive = async (id: string, currentValue: boolean) => {
        try {
            await productsAPI.update(id, { isActive: !currentValue });
            toast.success(t("Holat o'zgartirildi", "Статус изменен"));
            loadProducts();
        } catch (error) {
            console.error("Error toggling active:", error);
            toast.error(t("Xatolik yuz berdi", "Произошла ошибка"));
        }
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('uz-UZ').format(num);
    };

    const handleItemsPerPageChange = (items: number) => {
        setItemsPerPage(items);
        setCurrentPage(1); // Reset to first page when changing items per page
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
                    <Button 
                        className="gap-2 h-11" 
                        onClick={() => router.push("/admin/products/new")}
                    >
                        <Plus className="h-5 w-5" />
                        {t("Yangi mahsulot", "Новый товар")}
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    placeholder={t(
                                        "Mahsulot qidirish...",
                                        "Поиск товара..."
                                    )}
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="pl-10 h-12"
                                />
                            </div>

                            {/* Category Filter */}
                            <Select
                                value={selectedCategory}
                                onValueChange={(value) => {
                                    setSelectedCategory(value);
                                    setCurrentPage(1);
                                }}
                            >
                                <SelectTrigger className="h-12">
                                    <SelectValue placeholder={t("Kategoriya", "Категория")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        {t("Barchasi", "Все")}
                                    </SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.nameUz}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Sort */}
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="h-12">
                                    <SelectValue placeholder={t("Saralash", "Сортировка")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="createdAt">
                                        {t("Yangi qo'shilgan", "Недавно добавленные")}
                                    </SelectItem>
                                    <SelectItem value="name">
                                        {t("Nom bo'yicha", "По названию")}
                                    </SelectItem>
                                    <SelectItem value="price">
                                        {t("Narx bo'yicha", "По цене")}
                                    </SelectItem>
                                    <SelectItem value="viewsCount">
                                        {t("Ko'rishlar soni", "По просмотрам")}
                                    </SelectItem>
                                    <SelectItem value="salesCount">
                                        {t("Sotilgan miqdor", "По продажам")}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Products Table */}
                <Card>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-12 text-center">
                                <p className="text-muted-foreground">
                                    {t("Yuklanmoqda...", "Загрузка...")}
                                </p>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="p-12 text-center">
                                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                <p className="text-xl text-muted-foreground">
                                    {t("Mahsulotlar topilmadi", "Товары не найдены")}
                                </p>
                            </div>
                        ) : (
                            <>
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
                                                    {t("Ko'rishlar", "Просмотры")}
                                                </th>
                                                <th className="text-left p-4 font-semibold">
                                                    {t("Sotildi", "Продано")}
                                                </th>
                                                <th className="text-center p-4 font-semibold w-24">
                                                    {t("Tanlangan", "Избранное")}
                                                </th>
                                                <th className="text-center p-4 font-semibold w-24">
                                                    {t("Faol", "Активный")}
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
                                                    className={`border-b hover:bg-accent/50 transition-colors ${
                                                        !product.isActive ? 'opacity-50' : ''
                                                    }`}
                                                >
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-accent shrink-0">
                                                                {product.coverImage ? (
                                                                    <S3Image
                                                                        src={product.coverImage}
                                                                        alt={product.nameUz}
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center">
                                                                        <Package className="h-6 w-6 text-muted-foreground" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="font-semibold truncate">
                                                                    {product.nameUz}
                                                                </p>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    {product.isNew && (
                                                                        <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-500">
                                                                            {t("Yangi", "Новинка")}
                                                                        </Badge>
                                                                    )}
                                                                    {product.discount && product.discount > 0 && (
                                                                        <Badge variant="secondary" className="text-xs bg-red-500/10 text-red-500">
                                                                            -{product.discount}%
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        {product.category?.nameUz || "-"}
                                                    </td>
                                                    <td className="p-4">
                                                        <div>
                                                            <p className="font-semibold">
                                                                {formatNumber(product.price)} UZS
                                                            </p>
                                                            {product.oldPrice && (
                                                                <p className="text-xs text-muted-foreground line-through">
                                                                    {formatNumber(product.oldPrice)} UZS
                                                                </p>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span
                                                            className={
                                                                product.inStock
                                                                    ? "text-green-500 font-medium"
                                                                    : "text-red-500 font-medium"
                                                            }
                                                        >
                                                            {product.stockQuantity} {t("ta", "шт")}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                                            <span className="font-medium">
                                                                {formatNumber(product.viewsCount)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                                                            <span className="font-medium">
                                                                {formatNumber(product.salesCount)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex justify-center">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                                onClick={() => toggleFeatured(product.id, product.isFeatured)}
                                                            >
                                                                <Star 
                                                                    className={`h-5 w-5 ${
                                                                        product.isFeatured 
                                                                            ? 'fill-yellow-500 text-yellow-500' 
                                                                            : 'text-muted-foreground'
                                                                    }`}
                                                                />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex justify-center">
                                                            <Switch
                                                                checked={product.isActive}
                                                                onCheckedChange={() => toggleActive(product.id, product.isActive)}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                                                                disabled={!product.isActive}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-red-500 hover:text-red-600"
                                                                onClick={() => handleDelete(product.id)}
                                                                disabled={!product.isActive}
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

                                {/* Pagination */}
                                <div className="p-4 border-t">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        totalItems={totalItems}
                                        itemsPerPage={itemsPerPage}
                                        onPageChange={setCurrentPage}
                                        onItemsPerPageChange={handleItemsPerPageChange}
                                    />
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
