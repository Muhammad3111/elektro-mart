"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Search,
    Trash2,
    Upload,
    Image as ImageIcon,
    Loader2,
    X,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { listObjectsFromS3, type S3ObjectInfo } from "@/lib/s3/list";
import { uploadToObjectStorage } from "@/lib/s3/upload";
import { deleteFromObjectStorage } from "@/lib/s3/delete";
import { getPresignedUrl } from "@/lib/s3/get-url";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const BUCKET_NAME = process.env.NEXT_PUBLIC_S3_BUCKET || "elektromart";
const S3_BASE_URL = process.env.NEXT_PUBLIC_S3_URL || "";

console.log("S3 Config:", {
    BUCKET_NAME,
    S3_BASE_URL,
    S3_REGION: process.env.NEXT_PUBLIC_S3_REGION,
    HAS_ACCESS_KEY: !!process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
    HAS_SECRET_KEY: !!process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
});

type ImageWithUrl = S3ObjectInfo & { url?: string };

export default function AdminGalleryPage() {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState("");
    const [images, setImages] = useState<ImageWithUrl[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [uploadFiles, setUploadFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);

    const loadImages = useCallback(async () => {
        try {
            setLoading(true);
            console.log("Loading images from bucket:", BUCKET_NAME);
            const result = await listObjectsFromS3(BUCKET_NAME, "", undefined, 100);
            console.log("List result:", result);
            console.log("All objects:", result.objects);
            const imageObjects = result.objects.filter(obj => obj.type === "image");
            console.log("Filtered images:", imageObjects);
            
            // Generate presigned URLs for each image
            const imagesWithUrls = await Promise.all(
                imageObjects.map(async (img) => {
                    try {
                        const url = await getPresignedUrl(BUCKET_NAME, img.key, 3600);
                        return { ...img, url };
                    } catch (error) {
                        console.error("Failed to generate URL for:", img.key, error);
                        return img;
                    }
                })
            );
            
            setImages(imagesWithUrls);
        } catch (error) {
            console.error("Failed to load images:", error);
            console.error("Error details:", JSON.stringify(error, null, 2));
            toast.error(t("Rasmlarni yuklashda xatolik", "Ошибка при загрузке изображений"));
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        loadImages();
    }, [loadImages]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setUploadFiles(prev => [...prev, ...files]);
    };

    const removeUploadFile = (index: number) => {
        setUploadFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (uploadFiles.length === 0) return;

        try {
            setUploading(true);
            
            for (const file of uploadFiles) {
                const arrayBuffer = await file.arrayBuffer();
                const uint8Array = new Uint8Array(arrayBuffer);
                const key = `images/${Date.now()}-${file.name}`;
                
                await uploadToObjectStorage(
                    BUCKET_NAME,
                    key,
                    uint8Array,
                    file.type
                );
            }

            toast.success(t(
                `${uploadFiles.length} ta rasm yuklandi`,
                `Загружено ${uploadFiles.length} изображений`
            ));
            setUploadFiles([]);
            setUploadModalOpen(false);
            loadImages();
        } catch (error) {
            console.error("Upload failed:", error);
            toast.error(t("Yuklashda xatolik", "Ошибка при загрузке"));
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (keys: string[]) => {
        if (keys.length === 0) return;

        const confirmed = confirm(
            t(
                `${keys.length} ta rasmni o'chirmoqchimisiz?`,
                `Удалить ${keys.length} изображений?`
            )
        );

        if (!confirmed) return;

        try {
            for (const key of keys) {
                await deleteFromObjectStorage(BUCKET_NAME, key);
            }

            toast.success(t(
                `${keys.length} ta rasm o'chirildi`,
                `Удалено ${keys.length} изображений`
            ));
            setSelectedImages([]);
            loadImages();
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error(t("O'chirishda xatolik", "Ошибка при удалении"));
        }
    };

    const toggleImageSelection = (key: string) => {
        setSelectedImages(prev =>
            prev.includes(key)
                ? prev.filter(k => k !== key)
                : [...prev, key]
        );
    };

    const toggleSelectAll = () => {
        if (selectedImages.length === filteredImages.length) {
            setSelectedImages([]);
        } else {
            setSelectedImages(filteredImages.map(img => img.key));
        }
    };

    const getImageUrl = (image: ImageWithUrl) => {
        // Use presigned URL if available, otherwise fallback to public URL
        if (image.url) {
            return image.url;
        }
        
        // Fallback to public URL format
        const baseUrl = S3_BASE_URL.replace(/\/$/, '');
        return `${baseUrl}/${BUCKET_NAME}/${image.key}`;
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
    };

    const filteredImages = images.filter(img =>
        img.key.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-black">
                            {t("Galereya", "Галерея")}
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            {t(
                                "Barcha rasmlarni boshqarish",
                                "Управление всеми изображениями"
                            )}
                            {" • "}
                            {filteredImages.length} {t("ta rasm", "изображений")}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {selectedImages.length > 0 && (
                            <Button
                                variant="destructive"
                                className="gap-2 h-11"
                                onClick={() => handleDelete(selectedImages)}
                            >
                                <Trash2 className="h-5 w-5" />
                                {t(
                                    `${selectedImages.length} ta o'chirish`,
                                    `Удалить ${selectedImages.length}`
                                )}
                            </Button>
                        )}
                        <Button
                            className="gap-2 h-11"
                            onClick={() => setUploadModalOpen(true)}
                        >
                            <Upload className="h-5 w-5" />
                            {t("Rasm yuklash", "Загрузить изображение")}
                        </Button>
                    </div>
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    checked={selectedImages.length === filteredImages.length && filteredImages.length > 0}
                                    onCheckedChange={toggleSelectAll}
                                />
                                <span className="text-sm text-muted-foreground">
                                    {t("Barchasini tanlash", "Выбрать все")}
                                </span>
                            </div>
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    placeholder={t(
                                        "Rasm qidirish...",
                                        "Поиск изображения..."
                                    )}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 h-12"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}

                {/* Images Grid */}
                {!loading && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredImages.map((image) => {
                            const isSelected = selectedImages.includes(image.key);
                            const fileName = image.key.split("/").pop() || image.key;
                            
                            return (
                                <Card
                                    key={image.key}
                                    className={`group overflow-hidden hover:shadow-lg transition-all cursor-pointer ${
                                        isSelected ? "ring-2 ring-primary" : ""
                                    }`}
                                    onClick={() => toggleImageSelection(image.key)}
                                >
                                    <CardContent className="p-0">
                                        <div className="relative aspect-square bg-gray-100">
                                            <img
                                                src={getImageUrl(image)}
                                                alt={fileName}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    console.error("Image load error for:", image.key);
                                                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999'%3EError%3C/text%3E%3C/svg%3E";
                                                }}
                                                onLoad={() => {
                                                    console.log("Image loaded successfully:", image.key);
                                                }}
                                            />
                                            <div className="absolute top-2 left-2">
                                                <Checkbox
                                                    checked={isSelected}
                                                    onCheckedChange={() => toggleImageSelection(image.key)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="bg-white"
                                                />
                                            </div>
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    className="h-10 w-10"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete([image.key]);
                                                    }}
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <p className="font-medium text-xs truncate mb-1" title={fileName}>
                                                {fileName}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatFileSize(image.size)}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredImages.length === 0 && (
                    <Card className="border-2 border-dashed">
                        <CardContent className="p-12">
                            <div className="flex flex-col items-center justify-center text-center">
                                <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
                                <h3 className="text-xl font-bold mb-2">
                                    {t("Rasmlar topilmadi", "Изображения не найдены")}
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    {t(
                                        "Rasmlarni yuklash uchun yuqoridagi tugmani bosing",
                                        "Нажмите кнопку выше для загрузки изображений"
                                    )}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Upload Modal */}
                <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>
                                {t("Rasmlarni yuklash", "Загрузить изображения")}
                            </DialogTitle>
                            <DialogDescription>
                                {t(
                                    "Bir yoki bir nechta rasmlarni tanlang",
                                    "Выберите одно или несколько изображений"
                                )}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            {/* File Input */}
                            <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                <input
                                    type="file"
                                    id="file-upload"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer flex flex-col items-center"
                                >
                                    <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                                    <p className="text-sm font-medium mb-1">
                                        {t(
                                            "Fayllarni tanlash uchun bosing",
                                            "Нажмите для выбора файлов"
                                        )}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {t(
                                            "PNG, JPG, GIF, WEBP (max 10MB)",
                                            "PNG, JPG, GIF, WEBP (макс 10МБ)"
                                        )}
                                    </p>
                                </label>
                            </div>

                            {/* Selected Files */}
                            {uploadFiles.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">
                                        {t("Tanlangan fayllar", "Выбранные файлы")} ({uploadFiles.length})
                                    </p>
                                    <div className="max-h-60 overflow-y-auto space-y-2">
                                        {uploadFiles.map((file, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 bg-muted rounded-lg"
                                            >
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <ImageIcon className="h-5 w-5 text-muted-foreground shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate">
                                                            {file.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {formatFileSize(file.size)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 shrink-0"
                                                    onClick={() => removeUploadFile(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setUploadModalOpen(false);
                                        setUploadFiles([]);
                                    }}
                                    disabled={uploading}
                                >
                                    {t("Bekor qilish", "Отмена")}
                                </Button>
                                <Button
                                    onClick={handleUpload}
                                    disabled={uploadFiles.length === 0 || uploading}
                                    className="gap-2"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            {t("Yuklanmoqda...", "Загрузка...")}
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-4 w-4" />
                                            {t("Yuklash", "Загрузить")}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
