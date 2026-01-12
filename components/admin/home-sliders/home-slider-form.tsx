"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Image as ImageIcon, X } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import type {
    HomeSlider,
    CreateHomeSliderDto,
    UpdateHomeSliderDto,
} from "@/types/slider";
import { toast } from "sonner";
import { MediaGalleryModal } from "@/components/admin/media-gallery-modal";
import { getImageUrl } from "@/lib/s3/get-image-url";
import { S3Image } from "@/components/s3-image";

interface HomeSliderFormProps {
    slider?: HomeSlider;
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

export function HomeSliderForm({
    slider,
    onSubmit,
    onCancel,
    loading,
}: HomeSliderFormProps) {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        titleEn: slider?.titleEn || "",
        titleRu: slider?.titleRu || "",
        subtitleEn: slider?.subtitleEn || "",
        subtitleRu: slider?.subtitleRu || "",
        coverImage: slider?.coverImage || "",
        link: slider?.link || "",
        order: slider?.order || 0,
        isActive: slider?.isActive ?? true,
    });
    const [imagePreview, setImagePreview] = useState<string>(
        slider?.coverImage || ""
    );
    const [imageModalOpen, setImageModalOpen] = useState(false);

    useEffect(() => {
        if (slider?.coverImage) {
            getImageUrl(slider.coverImage).then(setImagePreview);
        }
    }, [slider]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !formData.titleEn ||
            !formData.titleRu ||
            !formData.subtitleEn ||
            !formData.subtitleRu ||
            !formData.coverImage ||
            !formData.link
        ) {
            toast.error(
                t(
                    "Barcha majburiy maydonlarni to'ldiring",
                    "Заполните все обязательные поля"
                )
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
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                titleRu: e.target.value,
                            }))
                        }
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="subtitleEn">
                        {t("Subtitle (English)", "Подзаголовок (Английский)")}{" "}
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="subtitleEn"
                        value={formData.subtitleEn}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                subtitleEn: e.target.value,
                            }))
                        }
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="subtitleRu">
                        {t("Subtitle (Russian)", "Подзаголовок (Русский)")}{" "}
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="subtitleRu"
                        value={formData.subtitleRu}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                subtitleRu: e.target.value,
                            }))
                        }
                        required
                    />
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
                                alt="Slider preview"
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
                        : slider
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
