"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Switch } from "@/components/ui/switch";
import { MediaGalleryModal } from "@/components/admin/media-gallery-modal";
import { ArrowLeft, Save, Image as ImageIcon, X } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { blogsAPI } from "@/lib/api";
import { toast } from "sonner";
import type { CreateBlogDto } from "@/types/blog";
import { getImageUrl } from "@/lib/s3/get-image-url";

// Generate slug from title
const generateSlug = (title: string): string => {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single
        .trim();
};

interface BlogFormProps {
    blogId?: string;
}

export function BlogForm({ blogId }: BlogFormProps) {
    const { t } = useLanguage();
    const router = useRouter();
    const isEditMode = !!blogId;

    const [formData, setFormData] = useState<CreateBlogDto>({
        titleEn: "",
        titleRu: "",
        descriptionEn: "",
        descriptionRu: "",
        image: "",
        slug: "",
        isActive: true,
        isFeatured: false,
        order: 0,
        metaTitle: "",
        metaDescription: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const loadBlog = useCallback(
        async (id: string) => {
            try {
                setLoading(true);
                const blog = await blogsAPI.getById(id);

                setFormData({
                    titleEn: blog.titleEn,
                    titleRu: blog.titleRu,
                    descriptionEn: blog.descriptionEn,
                    descriptionRu: blog.descriptionRu,
                    image: blog.image || "",
                    slug: blog.slug,
                    isActive: blog.isActive,
                    isFeatured: blog.isFeatured,
                    order: blog.order,
                    metaTitle: blog.metaTitle || "",
                    metaDescription: blog.metaDescription || "",
                });

                if (blog.image) {
                    getImageUrl(blog.image).then(setImageUrl);
                }
            } catch (error) {
                console.error("Error loading blog:", error);
                toast.error(
                    t("Blogni yuklashda xatolik", "Ошибка при загрузке блога"),
                );
                router.push("/admin/blogs");
            } finally {
                setLoading(false);
            }
        },
        [t, router],
    );

    useEffect(() => {
        if (isEditMode && blogId) {
            loadBlog(blogId);
        }
    }, [isEditMode, blogId, loadBlog]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.titleEn || !formData.titleRu) {
            toast.error(t("Sarlavhani kiriting", "Введите заголовок"));
            return;
        }

        if (!formData.descriptionEn || !formData.descriptionRu) {
            toast.error(t("Tavsifni kiriting", "Введите описание"));
            return;
        }

        setSubmitting(true);

        try {
            const payload: CreateBlogDto = {
                ...formData,
                order: Number(formData.order),
                image: formData.image || undefined,
                slug: formData.slug || undefined,
                metaTitle: formData.metaTitle || undefined,
                metaDescription: formData.metaDescription || undefined,
            };

            if (isEditMode && blogId) {
                await blogsAPI.update(blogId, payload);
                toast.success(t("Blog yangilandi", "Блог обновлен"));
            } else {
                await blogsAPI.create(payload);
                toast.success(t("Blog qo'shildi", "Блог добавлен"));
            }
            router.push("/admin/blogs");
        } catch (error) {
            console.error("Error saving blog:", error);
            toast.error(t("Xatolik yuz berdi", "Произошла ошибка"));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <p className="text-muted-foreground">
                            {t("Yuklanmoqda...", "Загрузка...")}
                        </p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push("/admin/blogs")}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-4xl font-black">
                                {isEditMode
                                    ? t(
                                          "Blogni tahrirlash",
                                          "Редактировать блог",
                                      )
                                    : t(
                                          "Yangi blog qo'shish",
                                          "Добавить новый блог",
                                      )}
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                {isEditMode
                                    ? t(
                                          "Blog ma'lumotlarini yangilang",
                                          "Обновите информацию о блоге",
                                      )
                                    : t(
                                          "Asosiy ma'lumotlarni to'ldiring",
                                          "Заполните основную информацию",
                                      )}
                            </p>
                        </div>
                    </div>
                    <Button
                        type="submit"
                        disabled={submitting}
                        className="gap-2"
                    >
                        <Save className="h-5 w-5" />
                        {submitting
                            ? t("Saqlanmoqda...", "Сохранение...")
                            : t("Saqlash", "Сохранить")}
                    </Button>
                </div>

                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {t("Asosiy ma'lumotlar", "Основная информация")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Titles */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="titleRu">
                                    {t(
                                        "Sarlavha (Ruscha)",
                                        "Заголовок (Русский)",
                                    )}{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="titleRu"
                                    value={formData.titleRu}
                                    onChange={(e) => {
                                        const newTitle = e.target.value;
                                        setFormData({
                                            ...formData,
                                            titleRu: newTitle,
                                            // Auto-generate slug from Russian title if slug is empty or was auto-generated
                                            slug:
                                                !formData.slug ||
                                                formData.slug ===
                                                    generateSlug(
                                                        formData.titleRu,
                                                    )
                                                    ? generateSlug(newTitle)
                                                    : formData.slug,
                                        });
                                    }}
                                    placeholder={t(
                                        "Blog sarlavhasi",
                                        "Заголовок блога",
                                    )}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="titleEn">
                                    {t(
                                        "Sarlavha (Inglizcha)",
                                        "Заголовок (Английский)",
                                    )}{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="titleEn"
                                    value={formData.titleEn}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            titleEn: e.target.value,
                                        })
                                    }
                                    placeholder={t("Blog title", "Blog title")}
                                    required
                                />
                            </div>
                        </div>

                        {/* Descriptions - Rich Text - Side by Side */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>
                                    {t("Tavsif (Ruscha)", "Описание (Русский)")}{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <RichTextEditor
                                    value={formData.descriptionRu}
                                    onChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            descriptionRu: value,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>
                                    {t(
                                        "Tavsif (Inglizcha)",
                                        "Описание (Английский)",
                                    )}{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <RichTextEditor
                                    value={formData.descriptionEn}
                                    onChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            descriptionEn: value,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        {/* Slug */}
                        <div className="space-y-2">
                            <Label htmlFor="slug">
                                {t("Slug (URL)", "Slug (URL)")}
                            </Label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        slug: e.target.value,
                                    })
                                }
                                placeholder={t(
                                    "avtomatik yaratiladi",
                                    "создается автоматически",
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Image */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t("Rasm", "Изображение")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {formData.image ? (
                                <div className="relative group w-full max-w-md">
                                    <div className="relative aspect-video overflow-hidden rounded-lg border">
                                        <img
                                            src={imageUrl || formData.image}
                                            alt="Blog"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                onClick={() =>
                                                    setImageModalOpen(true)
                                                }
                                            >
                                                {t("O'zgartirish", "Изменить")}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => {
                                                    setFormData({
                                                        ...formData,
                                                        image: "",
                                                    });
                                                    setImageUrl("");
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border-2 border-dashed hover:border-primary transition-colors cursor-pointer"
                                    onClick={() => setImageModalOpen(true)}
                                >
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                        <ImageIcon className="h-12 w-12" />
                                        <p className="text-sm font-medium">
                                            {t(
                                                "Rasm tanlash",
                                                "Выбрать изображение",
                                            )}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* SEO */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t("SEO", "SEO")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="metaTitle">
                                {t("Meta Title", "Meta Title")}
                            </Label>
                            <Input
                                id="metaTitle"
                                value={formData.metaTitle}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        metaTitle: e.target.value,
                                    })
                                }
                                placeholder={t(
                                    "SEO uchun sarlavha",
                                    "Заголовок для SEO",
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="metaDescription">
                                {t("Meta Description", "Meta Description")}
                            </Label>
                            <Textarea
                                id="metaDescription"
                                value={formData.metaDescription}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        metaDescription: e.target.value,
                                    })
                                }
                                placeholder={t(
                                    "SEO uchun tavsif",
                                    "Описание для SEO",
                                )}
                                rows={3}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Status */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t("Holat", "Статус")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="isActive">
                                {t("Faol", "Активный")}
                            </Label>
                            <Switch
                                id="isActive"
                                checked={formData.isActive}
                                onCheckedChange={(checked) =>
                                    setFormData({
                                        ...formData,
                                        isActive: checked,
                                    })
                                }
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="isFeatured">
                                {t(
                                    "Tanlangan (Bosh sahifada)",
                                    "Избранный (На главной)",
                                )}
                            </Label>
                            <Switch
                                id="isFeatured"
                                checked={formData.isFeatured}
                                onCheckedChange={(checked) =>
                                    setFormData({
                                        ...formData,
                                        isFeatured: checked,
                                    })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="order">
                                {t("Tartib raqami", "Порядковый номер")}
                            </Label>
                            <Input
                                id="order"
                                type="number"
                                value={formData.order}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        order: Number(e.target.value),
                                    })
                                }
                                min="0"
                                placeholder="0"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/admin/blogs")}
                    >
                        {t("Bekor qilish", "Отмена")}
                    </Button>
                    <Button type="submit" disabled={submitting}>
                        {submitting
                            ? t("Saqlanmoqda...", "Сохранение...")
                            : t("Saqlash", "Сохранить")}
                    </Button>
                </div>
            </form>

            {/* Media Modal */}
            <MediaGalleryModal
                open={imageModalOpen}
                onOpenChange={setImageModalOpen}
                onSelect={(keys) => {
                    if (keys.length > 0) {
                        setFormData({ ...formData, image: keys[0] });
                        getImageUrl(keys[0]).then(setImageUrl);
                    }
                }}
                mode="single"
                selectedUrls={formData.image ? [formData.image] : []}
            />
        </AdminLayout>
    );
}
