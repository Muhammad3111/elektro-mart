"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Image as ImageIcon, X } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import type {
    CatalogBanner,
    CreateCatalogBannerDto,
    UpdateCatalogBannerDto,
} from "@/types/slider";
import { toast } from "sonner";
import { MediaGalleryModal } from "@/components/admin/media-gallery-modal";
import { getImageUrl } from "@/lib/s3/get-image-url";
import { S3Image } from "@/components/s3-image";
import { checkAPI } from "@/lib/api";

interface CatalogBannerFormProps {
    banner?: CatalogBanner;
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

export function CatalogBannerForm({
    banner,
    onSubmit,
    onCancel,
    loading,
}: CatalogBannerFormProps) {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        titleEn: banner?.titleEn || "",
        titleRu: banner?.titleRu || "",
        coverImage: banner?.coverImage || "",
        link: banner?.link || "",
        order: banner?.order || 0,
        isActive: banner?.isActive ?? true,
    });
    const [imagePreview, setImagePreview] = useState<string>(
        banner?.coverImage || "",
    );
    const [imageModalOpen, setImageModalOpen] = useState(false);

    // Check exists states
    const [titleChecking, setTitleChecking] = useState(false);
    const [titleExists, setTitleExists] = useState<boolean | null>(null);
    const [titleCheckTimeout, setTitleCheckTimeout] =
        useState<NodeJS.Timeout | null>(null);
    const originalTitleRu = banner?.titleRu || "";

    useEffect(() => {
        if (banner?.coverImage) {
            getImageUrl(banner.coverImage).then(setImagePreview);
        }
    }, [banner]);

    const handleRemoveImage = () => {
        setImagePreview("");
        setFormData((prev) => ({ ...prev, coverImage: "" }));
    };

    const handleImageSelect = (keys: string[]) => {
        if (keys.length > 0) {
            setFormData((prev) => ({ ...prev, coverImage: keys[0] }));
            getImageUrl(keys[0]).then(setImagePreview);
        }
    };

    // Banner title mavjudligini tekshirish
    const checkTitleExists = async (title: string) => {
        if (banner && title === originalTitleRu) {
            setTitleExists(null);
            return;
        }
        if (!title || title.length < 2) {
            setTitleExists(null);
            return;
        }
        if (titleCheckTimeout) clearTimeout(titleCheckTimeout);
        setTitleChecking(true);
        const timeout = setTimeout(async () => {
            try {
                const result = await checkAPI.banner.title(title);
                setTitleExists(result.exists);
            } catch (error) {
                console.error("Banner title check error:", error);
                setTitleExists(null);
            } finally {
                setTitleChecking(false);
            }
        }, 500);
        setTitleCheckTimeout(timeout);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !formData.titleEn ||
            !formData.titleRu ||
            !formData.coverImage ||
            !formData.link
        ) {
            toast.error(
                t(
                    "Barcha majburiy maydonlarni to'ldiring",
                    "Заполните все обязательные поля",
                ),
            );
            return;
        }

        try {
            await onSubmit(formData);
        } catch (error) {
            console.error("Form submission error:", error);
            toast.error(t("Xatolik yuz berdi", "Произошла ошибка"));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="titleEn">
                        {t("Title (English)", "Заголовок (Английский)")}{" "}
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="titleEn"
                        value={formData.titleEn}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                titleEn: e.target.value,
                            }))
                        }
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="titleRu">
                        {t("Title (Russian)", "Заголовок (Русский)")}{" "}
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="titleRu"
                        value={formData.titleRu}
                        onChange={(e) => {
                            const value = e.target.value;
                            setFormData((prev) => ({
                                ...prev,
                                titleRu: value,
                            }));
                            checkTitleExists(value);
                        }}
                        className={titleExists ? "border-red-500" : ""}
                        required
                    />
                    {titleChecking && (
                        <p className="text-xs text-muted-foreground">
                            {t("Tekshirilmoqda...", "Проверка...")}
                        </p>
                    )}
                    {titleExists && (
                        <p className="text-xs text-red-500">
                            {t(
                                "Bu sarlavha serverda mavjud",
                                "Этот заголовок уже существует на сервере",
                            )}
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label>
                    {t("Rasm", "Изображение")}{" "}
                    <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-4">
                    {imagePreview && imagePreview.startsWith("http") ? (
                        <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                            <S3Image
                                src={imagePreview}
                                alt="Banner preview"
                                fill
                                sizes="128px"
                                className="object-cover"
                            />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setImageModalOpen(true)}
                            className="w-32 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary"
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

            <div className="space-y-2">
                <Label htmlFor="link">
                    {t("Havola", "Ссылка")}{" "}
                    <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="link"
                    value={formData.link}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            link: e.target.value,
                        }))
                    }
                    required
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
                        setFormData((prev) => ({
                            ...prev,
                            order: parseInt(e.target.value) || 0,
                        }))
                    }
                />
            </div>

            <div className="flex items-center space-x-2">
                <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, isActive: checked }))
                    }
                />
                <Label htmlFor="isActive">{t("Faol", "Активный")}</Label>
            </div>

            <div className="flex gap-3">
                <Button type="submit" disabled={loading} className="flex-1">
                    {loading
                        ? t("Saqlanmoqda...", "Сохранение...")
                        : banner
                          ? t("Yangilash", "Обновить")
                          : t("Qo'shish", "Добавить")}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                >
                    {t("Bekor qilish", "Отмена")}
                </Button>
            </div>

            <MediaGalleryModal
                open={imageModalOpen}
                onOpenChange={setImageModalOpen}
                onSelect={handleImageSelect}
                mode="single"
                selectedUrls={formData.coverImage ? [formData.coverImage] : []}
            />
        </form>
    );
}
