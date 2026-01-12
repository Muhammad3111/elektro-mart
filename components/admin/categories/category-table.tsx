"use client";

import { useState, useEffect } from "react";
import { Category } from "@/types/category";
import { categoriesAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { CrudModal } from "../shared";
import { CategoryForm } from "./category-form";
import { CategoryListSkeleton } from "@/components/category-skeleton";
import { CategoryEmptyState } from "@/components/category-empty-state";
import { toast } from "sonner";
import { Edit, Trash2, Plus, Eye as EyeIcon, ImageOff } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { S3Image } from "@/components/s3-image";
import { CategoryDetailModal } from "./category-detail-modal";
import { DeleteCategoryModal } from "./delete-category-modal";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function CategoryTable() {
    const { t } = useLanguage();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | undefined>();
    const [detailCategory, setDetailCategory] = useState<Category | null>(null);
    const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => {
        console.log("CategoryTable mounted, dialogOpen:", dialogOpen);
        loadCategories();
    }, []);

    useEffect(() => {
        console.log("dialogOpen changed to:", dialogOpen);
    }, [dialogOpen]);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await categoriesAPI.getAll();
            setCategories(data);
        } catch (err: any) {
            console.error("Failed to load categories:", err);
            const errorMessage = err?.message || t(
                "Kategoriyalarni yuklashda xatolik",
                "Ошибка при загрузке категорий"
            );
            
            if (err?.message?.includes("401")) {
                toast.error(t("Ruxsat yo'q. Qayta login qiling", "Нет доступа. Войдите снова"));
            } else if (err?.message?.includes("500")) {
                toast.error(t("Server xatosi", "Ошибка сервера"));
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        console.log("handleCreate called");
        setEditingCategory(undefined);
        setDialogOpen(true);
        console.log("dialogOpen set to true");
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setDialogOpen(true);
    };

    const handleDelete = (category: Category) => {
        setDeleteCategory(category);
        setDeleteModalOpen(true);
    };

    const handleViewDetail = (category: Category) => {
        setDetailCategory(category);
        setDetailModalOpen(true);
    };

    const handleToggleActive = async (category: Category) => {
        try {
            await categoriesAPI.update(category.id, {
                isActive: !category.isActive,
            });
            toast.success(t("Status o'zgartirildi", "Статус изменен"));
            loadCategories();
        } catch (err: any) {
            console.error("Failed to toggle active:", err);
            const errorMessage = err?.message || t("Xatolik yuz berdi", "Произошла ошибка");
            
            if (err?.message?.includes("401")) {
                toast.error(t("Ruxsat yo'q", "Нет доступа"));
            } else if (err?.message?.includes("404")) {
                toast.error(t("Kategoriya topilmadi", "Категория не найдена"));
            } else if (err?.message?.includes("500")) {
                toast.error(t("Server xatosi", "Ошибка сервера"));
            } else {
                toast.error(errorMessage);
            }
        }
    };

    const handleSuccess = () => {
        setDialogOpen(false);
        setEditingCategory(undefined);
        loadCategories();
    };

    if (loading) {
        return <CategoryListSkeleton />;
    }

    if (dialogOpen) {
        return (
            <CrudModal
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                titleEn={
                    editingCategory
                        ? "Kategoriyani tahrirlash"
                        : "Yangi kategoriya"
                }
                titleRu={
                    editingCategory
                        ? "Редактировать категорию"
                        : "Новая категория"
                }
                descriptionEn="Kategoriya ma'lumotlarini kiriting"
                descriptionRu="Введите данные категории"
            >
                <CategoryForm
                    category={editingCategory}
                    onSuccess={handleSuccess}
                    onCancel={() => setDialogOpen(false)}
                />
            </CrudModal>
        );
    }

    if (categories.length === 0) {
        return (
            <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-4xl font-black">
                            {t("Kategoriyalar", "Категории")}
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            {t("Barcha kategoriyalarni boshqarish", "Управление всеми категориями")}
                        </p>
                    </div>
                    <Button onClick={() => handleCreate()} className="gap-2 h-11">
                        <Plus className="h-5 w-5" />
                        {t("Yangi kategoriya", "Новая категория")}
                    </Button>
                </div>
                <CategoryEmptyState />
            </div>
        );
    }

    // Parent kategoriyalarni ajratish
    const parentCategories = categories.filter((c) => !c.parentId);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black">
                        {t("Kategoriyalar", "Категории")}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {t("Barcha kategoriyalarni boshqarish", "Управление всеми категориями")}
                    </p>
                </div>
                <Button onClick={() => handleCreate()} className="gap-2 h-11">
                    <Plus className="h-5 w-5" />
                    {t("Yangi kategoriya", "Новая категория")}
                </Button>
            </div>
            <div className="space-y-4">
                {parentCategories.map((parent) => {
                    const subCategories = categories.filter(
                        (c) => c.parentId === parent.id
                    );

                    return (
                        <div
                            key={parent.id}
                            className={`border rounded-lg overflow-hidden transition-opacity ${
                                !parent.isActive ? "opacity-60" : ""
                            }`}
                        >
                            {/* Parent Category */}
                            <div className="flex items-center gap-4 p-4 bg-muted/50">
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-background">
                                    {parent.image ? (
                                        <S3Image
                                            src={parent.image}
                                            alt={parent.nameEn}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
                                            <ImageOff className="w-6 h-6" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-semibold">
                                        {parent.nameEn}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {parent.nameRu}
                                    </p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <p className="text-xs text-muted-foreground">
                                            {subCategories.length} {t("sub-kategoriya", "подкатегории")}
                                        </p>
                                        {parent.productsCount !== undefined && (
                                            <>
                                                <span className="text-xs text-muted-foreground">•</span>
                                                <p className="text-xs text-muted-foreground">
                                                    {parent.productsCount} {t("mahsulot", "товаров")}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={parent.isActive}
                                            onCheckedChange={() => handleToggleActive(parent)}
                                            id={`switch-${parent.id}`}
                                            className="cursor-pointer"
                                        />
                                        <Label
                                            htmlFor={`switch-${parent.id}`}
                                            className="text-sm cursor-pointer"
                                        >
                                            {parent.isActive
                                                ? t("Faol", "Активный")
                                                : t("Nofaol", "Неактивный")}
                                        </Label>
                                    </div>
                                    <div className="h-6 w-px bg-border" />
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleViewDetail(parent)}
                                        disabled={!parent.isActive}
                                        title={t("Ko'rish", "Просмотр")}
                                        className="cursor-pointer"
                                    >
                                        <EyeIcon className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEdit(parent)}
                                        disabled={!parent.isActive}
                                        title={t("Tahrirlash", "Редактировать")}
                                        className="cursor-pointer"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleDelete(parent)}
                                        disabled={!parent.isActive}
                                        title={t("O'chirish", "Удалить")}
                                        className="cursor-pointer"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Sub Categories Accordion */}
                            {subCategories.length > 0 && (
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="sub-categories" className="border-0">
                                        <AccordionTrigger className="px-4 py-3 bg-muted/30 hover:bg-muted/50 hover:no-underline cursor-pointer">
                                            <span className="text-sm font-medium">
                                                {t(
                                                    `Sub-kategoriyalar (${subCategories.length})`,
                                                    `Подкатегории (${subCategories.length})`
                                                )}
                                            </span>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-0">
                                            <div className="divide-y">
                                                {subCategories.map((sub) => (
                                        <div
                                            key={sub.id}
                                            className="flex items-center gap-4 p-4 pl-8 bg-background"
                                        >
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted">
                                                {sub.image ? (
                                                    <S3Image
                                                        src={sub.image}
                                                        alt={sub.nameEn}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
                                                        <ImageOff className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <h4 className="font-medium text-sm">
                                                    {sub.nameEn}
                                                </h4>
                                                <p className="text-xs text-muted-foreground">
                                                    {sub.nameRu}
                                                </p>
                                                {sub.productsCount !== undefined && (
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {sub.productsCount} {t("mahsulot", "товаров")}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2">
                                                    <Switch
                                                        checked={sub.isActive}
                                                        onCheckedChange={() => handleToggleActive(sub)}
                                                        id={`switch-${sub.id}`}
                                                        className="cursor-pointer"
                                                    />
                                                    <Label
                                                        htmlFor={`switch-${sub.id}`}
                                                        className="text-xs cursor-pointer"
                                                    >
                                                        {sub.isActive
                                                            ? t("Faol", "Активный")
                                                            : t("Nofaol", "Неактивный")}
                                                    </Label>
                                                </div>
                                                <div className="h-6 w-px bg-border" />
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleViewDetail(sub)}
                                                    disabled={!sub.isActive}
                                                    title={t("Ko'rish", "Просмотр")}
                                                    className="cursor-pointer"
                                                >
                                                    <EyeIcon className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleEdit(sub)
                                                    }
                                                    disabled={!sub.isActive}
                                                    title={t("Tahrirlash", "Редактировать")}
                                                    className="cursor-pointer"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() =>
                                                        handleDelete(sub)
                                                    }
                                                    disabled={!sub.isActive}
                                                    title={t("O'chirish", "Удалить")}
                                                    className="cursor-pointer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Detail Modal */}
            <CategoryDetailModal
                category={detailCategory}
                open={detailModalOpen}
                onOpenChange={setDetailModalOpen}
            />

            {/* Delete Modal */}
            <DeleteCategoryModal
                category={deleteCategory}
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                onSuccess={loadCategories}
            />
        </div>
    );
}
