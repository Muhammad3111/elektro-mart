"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { uploadAPI } from "@/lib/api";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/language-context";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    onRemove?: () => void;
    disabled?: boolean;
}

export function ImageUpload({
    value,
    onChange,
    onRemove,
    disabled,
}: ImageUploadProps) {
    const { t } = useLanguage();
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error(t("Faqat rasm fayllarini yuklash mumkin", "Можно загружать только изображения"));
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error(t("Rasm hajmi 5MB dan oshmasligi kerak", "Размер изображения не должен превышать 5MB"));
            return;
        }

        setUploading(true);

        try {
            // In real app, this would upload to your server/cloud storage
            // For now, we'll create a local URL
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange(reader.result as string);
                toast.success(t("Rasm muvaffaqiyatli yuklandi", "Изображение успешно загружено"));
            };
            reader.readAsDataURL(file);

            // Uncomment this for real API upload:
            // const result = await uploadAPI.uploadImage(file);
            // onChange(result.url);
            // toast.success(t("Rasm muvaffaqiyatli yuklandi", "Изображение успешно загружено"));
        } catch (error) {
            console.error("Upload error:", error);
            toast.error(t("Rasm yuklashda xatolik", "Ошибка при загрузке изображения"));
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        if (onRemove) {
            onRemove();
        } else {
            onChange("");
        }
    };

    return (
        <div className="space-y-4">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={disabled || uploading}
            />

            {value ? (
                <div className="relative group">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed">
                        <img
                            src={value}
                            alt="Upload preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={disabled || uploading}
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                {t("O'zgartirish", "Изменить")}
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={handleRemove}
                                disabled={disabled || uploading}
                            >
                                <X className="h-4 w-4 mr-2" />
                                {t("O'chirish", "Удалить")}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed hover:border-primary transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <ImageIcon className="h-12 w-12" />
                        <p className="text-sm font-medium">
                            {uploading
                                ? t("Yuklanmoqda...", "Загрузка...")
                                : t("Rasm yuklash uchun bosing", "Нажмите для загрузки изображения")}
                        </p>
                        <p className="text-xs">PNG, JPG, GIF (max 5MB)</p>
                    </div>
                </div>
            )}
        </div>
    );
}
