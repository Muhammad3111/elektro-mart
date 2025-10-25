"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/admin/image-upload";
import { Pagination } from "@/components/admin/pagination";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    Package,
    Filter,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { productsAPI, categoriesAPI } from "@/lib/api";
import { validateForm, productValidationRules, ValidationErrors } from "@/lib/validation";
import { toast } from "sonner";

interface Product {
    id: number;
    name: string;
    nameRu: string;
    category: string;
    price: string;
    stock: number;
    status: string;
    image: string;
    description?: string;
    descriptionRu?: string;
}

export default function AdminProductsPageFull() {
    const { t } = useLanguage();
    
    // State
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;
    
    // Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        nameRu: "",
        category: "",
        price: "",
        stock: 0,
        image: "",
        description: "",
        descriptionRu: "",
    });
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [submitting, setSubmitting] = useState(false);

    // Load data
    useEffect(() => {
        loadProducts();
        loadCategories();
    }, [currentPage, searchQuery, selectedCategory, sortBy]);

    const loadProducts = async () => {
        setLoading(true);
        try {
            // Mock data for demo - replace with real API call
            const mockProducts: Product[] = Array.from({ length: 45 }, (_, i) => ({
                id: i + 1,
                name: `HDMI Kabel ${i + 1}`,
                nameRu: `HDMI Кабель ${i + 1}`,
                category: ["Kabellar", "Yoritish", "Rozetkalar"][i % 3],
                price: `${(i + 1) * 10000}`,
                stock: Math.floor(Math.random() * 200),
                status: i % 5 === 0 ? "out_of_stock" : "active",
                image: `https://images.unsplash.com/photo-1558618666-fcd25c85cd${64 + (i % 5)}?w=100&h=100&fit=crop`,
            }));

            // Filter
            let filtered = mockProducts;
            if (searchQuery) {
                filtered = filtered.filter(p => 
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.nameRu.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }
            if (selectedCategory !== "all") {
                filtered = filtered.filter(p => p.category === selectedCategory);
            }

            // Sort
            filtered.sort((a, b) => {
                if (sortBy === "name") return a.name.localeCompare(b.name);
                if (sortBy === "price") return parseInt(a.price) - parseInt(b.price);
                if (sortBy === "stock") return a.stock - b.stock;
                return 0;
            });

            // Paginate
            const start = (currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const paginated = filtered.slice(start, end);

            setProducts(paginated);
            setTotalItems(filtered.length);
            setTotalPages(Math.ceil(filtered.length / itemsPerPage));

            // Real API call would be:
            // const result = await productsAPI.getAll({
            //     page: currentPage,
            //     limit: itemsPerPage,
            //     search: searchQuery,
            //     category: selectedCategory !== "all" ? selectedCategory : undefined,
            // });
            // setProducts(result.data);
            // setTotalPages(result.totalPages);
            // setTotalItems(result.total);
        } catch (error) {
            console.error("Error loading products:", error);
            toast.error(t("Mahsulotlarni yuklashda xatolik", "Ошибка при загрузке товаров"));
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            // Mock categories
            setCategories([
                { id: 1, name: "Kabellar", nameRu: "Кабели" },
                { id: 2, name: "Yoritish", nameRu: "Освещение" },
                { id: 3, name: "Rozetkalar", nameRu: "Розетки" },
            ]);

            // Real API call:
            // const result = await categoriesAPI.getAll();
            // setCategories(result);
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    };

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                nameRu: product.nameRu,
                category: product.category,
                price: product.price,
                stock: product.stock,
                image: product.image,
                description: product.description || "",
                descriptionRu: product.descriptionRu || "",
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: "",
                nameRu: "",
                category: "",
                price: "",
                stock: 0,
                image: "",
                description: "",
                descriptionRu: "",
            });
        }
        setErrors({});
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        setFormData({
            name: "",
            nameRu: "",
            category: "",
            price: "",
            stock: 0,
            image: "",
            description: "",
            descriptionRu: "",
        });
        setErrors({});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate
        const validationErrors = validateForm(formData, productValidationRules);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setSubmitting(true);

        try {
            if (editingProduct) {
                // Update
                // await productsAPI.update(editingProduct.id, formData);
                toast.success(t("Mahsulot yangilandi", "Товар обновлен"));
            } else {
                // Create
                // await productsAPI.create(formData);
                toast.success(t("Mahsulot qo'shildi", "Товар добавлен"));
            }

            handleCloseModal();
            loadProducts();
        } catch (error) {
            console.error("Error saving product:", error);
            toast.error(t("Xatolik yuz berdi", "Произошла ошибка"));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm(t("Rostdan ham o'chirmoqchimisiz?", "Вы уверены, что хотите удалить?"))) {
            return;
        }

        try {
            // await productsAPI.delete(id);
            toast.success(t("Mahsulot o'chirildi", "Товар удален"));
            loadProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error(t("O'chirishda xatolik", "Ошибка при удалении"));
        }
    };

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
                    <Button className="gap-2 h-11" onClick={() => handleOpenModal()}>
                        <Plus className="h-5 w-5" />
                        {t("Yangi mahsulot", "Новый товар")}
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Search */}
                            <div className="md:col-span-2 relative">
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
                                        <SelectItem key={cat.id} value={cat.name}>
                                            {cat.name}
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
                                    <SelectItem value="name">
                                        {t("Nom bo'yicha", "По названию")}
                                    </SelectItem>
                                    <SelectItem value="price">
                                        {t("Narx bo'yicha", "По цене")}
                                    </SelectItem>
                                    <SelectItem value="stock">
                                        {t("Ombor bo'yicha", "По складу")}
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
                                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-accent flex-shrink-0">
                                                                <img
                                                                    src={product.image}
                                                                    alt={product.name}
                                                                    className="w-full h-full object-cover"
                                                                />
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
                                                                onClick={() => handleOpenModal(product)}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-red-500 hover:text-red-600"
                                                                onClick={() => handleDelete(product.id)}
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
                                    />
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Add/Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingProduct
                                ? t("Mahsulotni tahrirlash", "Редактировать товар")
                                : t("Yangi mahsulot qo'shish", "Добавить новый товар")}
                        </DialogTitle>
                        <DialogDescription>
                            {t(
                                "Mahsulot ma'lumotlarini kiriting",
                                "Введите информацию о товаре"
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Image Upload */}
                        <div>
                            <Label>{t("Rasm", "Изображение")}</Label>
                            <ImageUpload
                                value={formData.image}
                                onChange={(url) =>
                                    setFormData({ ...formData, image: url })
                                }
                                disabled={submitting}
                            />
                            {errors.image && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.image}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Name UZ */}
                            <div>
                                <Label htmlFor="name">
                                    {t("Nomi (O'zbek)", "Название (Узбек)")}
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    disabled={submitting}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Name RU */}
                            <div>
                                <Label htmlFor="nameRu">
                                    {t("Nomi (Rus)", "Название (Русский)")}
                                </Label>
                                <Input
                                    id="nameRu"
                                    value={formData.nameRu}
                                    onChange={(e) =>
                                        setFormData({ ...formData, nameRu: e.target.value })
                                    }
                                    disabled={submitting}
                                />
                                {errors.nameRu && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.nameRu}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {/* Category */}
                            <div>
                                <Label htmlFor="category">
                                    {t("Kategoriya", "Категория")}
                                </Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, category: value })
                                    }
                                    disabled={submitting}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t("Tanlang", "Выберите")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.name}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.category}
                                    </p>
                                )}
                            </div>

                            {/* Price */}
                            <div>
                                <Label htmlFor="price">{t("Narx", "Цена")}</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) =>
                                        setFormData({ ...formData, price: e.target.value })
                                    }
                                    disabled={submitting}
                                />
                                {errors.price && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.price}
                                    </p>
                                )}
                            </div>

                            {/* Stock */}
                            <div>
                                <Label htmlFor="stock">{t("Ombor", "Склад")}</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            stock: parseInt(e.target.value) || 0,
                                        })
                                    }
                                    disabled={submitting}
                                />
                                {errors.stock && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.stock}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Description UZ */}
                        <div>
                            <Label htmlFor="description">
                                {t("Tavsif (O'zbek)", "Описание (Узбек)")}
                            </Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                                rows={3}
                                disabled={submitting}
                            />
                        </div>

                        {/* Description RU */}
                        <div>
                            <Label htmlFor="descriptionRu">
                                {t("Tavsif (Rus)", "Описание (Русский)")}
                            </Label>
                            <Textarea
                                id="descriptionRu"
                                value={formData.descriptionRu}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        descriptionRu: e.target.value,
                                    })
                                }
                                rows={3}
                                disabled={submitting}
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCloseModal}
                                disabled={submitting}
                            >
                                {t("Bekor qilish", "Отмена")}
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting
                                    ? t("Saqlanmoqda...", "Сохранение...")
                                    : editingProduct
                                    ? t("Yangilash", "Обновить")
                                    : t("Qo'shish", "Добавить")}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
