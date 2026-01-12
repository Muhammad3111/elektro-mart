"use client";

import { useState, useEffect } from "react";
import {
    Category,
    CreateCategoryDto,
    UpdateCategoryDto,
} from "@/types/category";
import { categoriesAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/contexts/language-context";
import { CategorySearchSelect } from "./category-search-select";
import { MediaGalleryModal } from "@/components/admin/media-gallery-modal";
import { getImageUrl } from "@/lib/s3/get-image-url";

interface CategoryFormProps {
    category?: Category;
    onSuccess: () => void;
    onCancel: () => void;
}

export function CategoryForm({
    category,
    onSuccess,
    onCancel,
}: CategoryFormProps) {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(
        category?.image || null
    );
    const [imageModalOpen, setImageModalOpen] = useState(false);

    const [formData, setFormData] = useState<
        CreateCategoryDto | UpdateCategoryDto
    >({
        nameEn: category?.nameEn || "",
        nameRu: category?.nameRu || "",
        parentId: category?.parentId || null,
        order: category?.order || 1,
        image: category?.image || undefined,
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await categoriesAPI.getAll();
            // Agar edit qilinayotgan bo'lsa, o'zini va sub-kategoriyalarini filter qilish
            if (category) {
                setCategories(
                    data.filter(
                        (c) =>
                            c.id !== category.id && c.parentId !== category.id
                    )
                );
            } else {
                setCategories(data);
            }
        } catch (err: any) {
            console.error("Failed to load categories:", err);
            const errorMessage =
                err?.message || t("Xatolik yuz berdi", "Произошла ошибка");

            if (err?.message?.includes("401")) {
                toast.error(
                    t(
                        "Ruxsat yo'q. Qayta login qiling",
                        "Нет доступа. Войдите снова"
                    )
                );
            } else if (err?.message?.includes("500")) {
                toast.error(t("Server xatosi", "Ошибка сервера"));
            } else {
                toast.error(errorMessage);
            }
        }
    };

    // Load image URL when category is loaded
    useEffect(() => {
        if (category?.image) {
            getImageUrl(category.image).then(setImagePreview);
        }
    }, [category]);

    const removeImage = () => {
        setFormData({ ...formData, image: undefined });
        setImagePreview(null);
    };

    const handleImageSelect = (keys: string[]) => {
        if (keys.length > 0) {
            setFormData({ ...formData, image: keys[0] });
            // Generate URL for preview
            getImageUrl(keys[0]).then(setImagePreview);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.nameEn || !formData.nameRu) {
            toast.error(
                t(
                    "Barcha majburiy maydonlarni to'ldiring",
                    "Заполните все обязательные поля"
                )
            );
            return;
        }

        try {
            setLoading(true);
            if (category) {
                await categoriesAPI.update(
                    category.id,
                    formData as UpdateCategoryDto
                );
                toast.success(
                    t("Kategoriya yangilandi", "Категория обновлена")
                );
            } else {
                await categoriesAPI.create(formData as CreateCategoryDto);
                toast.success(t("Kategoriya yaratildi", "Категория создана"));
            }
            onSuccess();
        } catch (err: any) {
            console.error("Failed to save category:", err);
            const errorMessage =
                err?.message || t("Xatolik yuz berdi", "Произошла ошибка");

            if (err?.message?.includes("400")) {
                toast.error(t("Noto'g'ri ma'lumotlar", "Неверные данные"));
            } else if (err?.message?.includes("401")) {
                toast.error(
                    t(
                        "Ruxsat yo'q. Qayta login qiling",
                        "Нет доступа. Войдите снова"
                    )
                );
            } else if (err?.message?.includes("404")) {
                toast.error(t("Kategoriya topilmadi", "Категория не найдена"));
            } else if (err?.message?.includes("500")) {
                toast.error(
                    t(
                        "Server xatosi. Keyinroq urinib ko'ring",
                        "Ошибка сервера. Попробуйте позже"
                    )
                );
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
                <Label>{t("Rasm", "Изображение")}</Label>
                <div className="flex items-center gap-4">
                    {imagePreview && imagePreview.startsWith("http") ? (
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                            <Image
                                src={imagePreview}
                                alt="Preview"
                                fill
                                sizes="128px"
                                className="object-cover"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setImageModalOpen(true)}
                            className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
                        >
                            <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
                            <span className="text-xs text-muted-foreground">
                                {t("Tanlash", "Выбрать")}
                            </span>
                        </button>
                    )}
                    {imagePreview && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setImageModalOpen(true)}
                        >
                            {t("O'zgartirish", "Изменить")}
                        </Button>
                    )}
                </div>
            </div>

            {/* Name Uzbek */}
            <div className="space-y-2">
                <Label htmlFor="nameEn">
                    {t("Name (English)", "Название (Английский)")}{" "}
                    <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="nameEn"
                    value={formData.nameEn}
                    onChange={(e) =>
                        setFormData({ ...formData, nameEn: e.target.value })
                    }
                    placeholder="Maishiy texnika"
                    required
                />
            </div>

            {/* Name Russian */}
            <div className="space-y-2">
                <Label htmlFor="nameRu">
                    {t("Name (Russian)", "Название (Русский)")}{" "}
                    <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="nameRu"
                    value={formData.nameRu}
                    onChange={(e) =>
                        setFormData({ ...formData, nameRu: e.target.value })
                    }
                    placeholder="Бытовая техника"
                    required
                />
            </div>

            {/* Parent Category */}
            <div className="space-y-2">
                <Label htmlFor="parentId">
                    {t("Parent Kategoriya", "Родительская категория")}
                </Label>
                <CategorySearchSelect
                    categories={categories}
                    value={formData.parentId || ""}
                    onValueChange={(value) =>
                        setFormData({
                            ...formData,
                            parentId: value,
                        })
                    }
                    placeholder={t("Kategoriya tanlang", "Выберите категорию")}
                    disabled={loading}
                />
            </div>

            {/* Order */}
            <div className="space-y-2">
                <Label htmlFor="order">{t("Tartib", "Порядок")}</Label>
                <Input
                    id="order"
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            order: parseInt(e.target.value) || 1,
                        })
                    }
                />
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" onClick={onCancel}>
                    {t("Bekor qilish", "Отмена")}
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {category
                        ? t("Yangilash", "Обновить")
                        : t("Yaratish", "Создать")}
                </Button>
            </div>

            {/* Media Gallery Modal */}
            <MediaGalleryModal
                open={imageModalOpen}
                onOpenChange={setImageModalOpen}
                onSelect={handleImageSelect}
                mode="single"
                selectedUrls={formData.image ? [formData.image as string] : []}
            />
        </form>
    );
}
