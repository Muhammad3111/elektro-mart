"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Search,
    Upload,
    Image as ImageIcon,
    Loader2,
    X,
    Check,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { uploadFile } from "@/lib/s3/client-upload";
import { getToken } from "@/lib/api/auth";
import { toast } from "sonner";

type S3ObjectInfo = {
    key: string;
    size: number;
    lastModified: string;
    type: "image" | "video" | "other";
    url?: string;
};

type ImageWithUrl = S3ObjectInfo;

interface MediaGalleryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (urls: string[]) => void;
    mode?: "single" | "multiple"; // single for cover, multiple for gallery
    selectedUrls?: string[];
}

export function MediaGalleryModal({
    open,
    onOpenChange,
    onSelect,
    mode = "single",
    selectedUrls = [],
}: MediaGalleryModalProps) {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<"media" | "upload">("media");
    const [searchQuery, setSearchQuery] = useState("");
    const [images, setImages] = useState<ImageWithUrl[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedImages, setSelectedImages] =
        useState<string[]>(selectedUrls);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Upload tab state
    const [uploadFiles, setUploadFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);

    const loadImages = useCallback(async () => {
        try {
            setLoading(true);
            const token = getToken();
            if (!token) {
                toast.error(
                    t("Avtorizatsiya talab qilinadi", "Требуется авторизация")
                );
                return;
            }

            const response = await fetch("/api/s3/list?maxKeys=1000", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to load images");
            }

            const result = await response.json();
            const imageObjects = result.objects.filter(
                (obj: S3ObjectInfo) => obj.type === "image"
            );
            setImages(imageObjects);
        } catch (error) {
            console.error("Failed to load images:", error);
            toast.error(
                t(
                    "Rasmlarni yuklashda xatolik",
                    "Ошибка при загрузке изображений"
                )
            );
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        if (open) {
            loadImages();
            setSelectedImages(selectedUrls);
        }
    }, [open, selectedUrls, loadImages]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        // Validate files
        const validFiles = files.filter((file) => {
            if (!file.type.startsWith("image/")) {
                toast.error(
                    t(
                        `${file.name} - faqat rasm fayllarini yuklash mumkin`,
                        `${file.name} - можно загружать только изображения`
                    )
                );
                return false;
            }
            if (file.size > 10 * 1024 * 1024) {
                toast.error(
                    t(
                        `${file.name} - hajmi 10MB dan oshmasligi kerak`,
                        `${file.name} - размер не должен превышать 10MB`
                    )
                );
                return false;
            }
            return true;
        });

        setUploadFiles((prev) => [...prev, ...validFiles]);
    };

    const removeUploadFile = (index: number) => {
        setUploadFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (uploadFiles.length === 0) return;

        try {
            setUploading(true);
            const uploadedKeys: string[] = [];

            for (const file of uploadFiles) {
                const result = await uploadFile(file, "images");
                if (result.success && result.key) {
                    uploadedKeys.push(result.key);
                } else {
                    throw new Error(result.error || "Upload failed");
                }
            }

            toast.success(
                t(
                    `${uploadFiles.length} ta rasm yuklandi`,
                    `Загружено ${uploadFiles.length} изображений`
                )
            );

            setUploadFiles([]);
            await loadImages();

            // Auto-select uploaded images by their keys
            if (mode === "single" && uploadedKeys.length > 0) {
                setSelectedImages([uploadedKeys[0]]);
            } else {
                setSelectedImages((prev) => [...prev, ...uploadedKeys]);
            }

            setActiveTab("media");
        } catch (error) {
            console.error("Upload failed:", error);
            toast.error(t("Yuklashda xatolik", "Ошибка при загрузке"));
        } finally {
            setUploading(false);
        }
    };

    const toggleImageSelection = (key: string) => {
        if (mode === "single") {
            setSelectedImages([key]);
        } else {
            setSelectedImages((prev) =>
                prev.includes(key)
                    ? prev.filter((u) => u !== key)
                    : [...prev, key]
            );
        }
    };

    const handleConfirm = () => {
        // Return S3 keys instead of presigned URLs
        onSelect(selectedImages);
        onOpenChange(false);
    };

    const getImageUrl = (image: ImageWithUrl) => {
        return image.url || "";
    };

    const getImageKey = (image: ImageWithUrl) => {
        return image.key;
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (
            Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
        );
    };

    const filteredImages = images.filter((img) =>
        img.key.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination calculations
    const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedImages = filteredImages.slice(startIndex, endIndex);

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "single"
                            ? t("Cover rasm tanlash", "Выбрать обложку")
                            : t(
                                  "Gallery rasmlarni tanlash",
                                  "Выбрать изображения для галереи"
                              )}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "single"
                            ? t(
                                  "Bitta rasm tanlang",
                                  "Выберите одно изображение"
                              )
                            : t(
                                  "Bir nechta rasm tanlang (3-10 ta)",
                                  "Выберите несколько изображений (3-10)"
                              )}
                    </DialogDescription>
                </DialogHeader>

                <Tabs
                    value={activeTab}
                    onValueChange={(v) => setActiveTab(v as "media" | "upload")}
                    className="flex-1 flex flex-col overflow-hidden"
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="media">
                            <ImageIcon className="h-4 w-4 mr-2" />
                            {t("Media", "Медиа")}
                        </TabsTrigger>
                        <TabsTrigger value="upload">
                            <Upload className="h-4 w-4 mr-2" />
                            {t("Yuklash", "Загрузить")}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent
                        value="media"
                        className="flex-1 flex flex-col overflow-hidden mt-4"
                    >
                        {/* Search */}
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder={t(
                                    "Rasm qidirish...",
                                    "Поиск изображения..."
                                )}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Images Grid */}
                        <div className="flex-1 overflow-y-auto">
                            {loading ? (
                                <div className="grid grid-cols-5 gap-4">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="aspect-square bg-gray-200 animate-pulse rounded-lg"
                                        />
                                    ))}
                                </div>
                            ) : filteredImages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                    <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">
                                        {t(
                                            "Rasmlar topilmadi",
                                            "Изображения не найдены"
                                        )}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-5 gap-4 pb-4">
                                        {paginatedImages.map((image) => {
                                            const imageUrl = getImageUrl(image);
                                            const imageKey = getImageKey(image);
                                            const isSelected =
                                                selectedImages.includes(
                                                    imageKey
                                                );
                                            const fileName =
                                                image.key.split("/").pop() ||
                                                image.key;

                                            return (
                                                <Card
                                                    key={image.key}
                                                    className={`group overflow-hidden cursor-pointer transition-all ${
                                                        isSelected
                                                            ? "ring-2 ring-primary"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        toggleImageSelection(
                                                            imageKey
                                                        )
                                                    }
                                                >
                                                    <CardContent className="p-0 py-0">
                                                        <div className="relative aspect-square bg-gray-100">
                                                            <img
                                                                src={imageUrl}
                                                                alt={fileName}
                                                                className="w-full h-full object-cover"
                                                            />
                                                            {isSelected && (
                                                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                                    <div className="bg-primary text-primary-foreground rounded-full p-2">
                                                                        <Check className="h-6 w-6" />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="p-2">
                                                            <p
                                                                className="text-xs truncate"
                                                                title={fileName}
                                                            >
                                                                {fileName}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {formatFileSize(
                                                                    image.size
                                                                )}
                                                            </p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-between pt-4 border-t">
                                            <div className="text-sm text-muted-foreground">
                                                {t(
                                                    `${
                                                        startIndex + 1
                                                    }-${Math.min(
                                                        endIndex,
                                                        filteredImages.length
                                                    )} / ${
                                                        filteredImages.length
                                                    } ta rasm`,
                                                    `${
                                                        startIndex + 1
                                                    }-${Math.min(
                                                        endIndex,
                                                        filteredImages.length
                                                    )} из ${
                                                        filteredImages.length
                                                    } изображений`
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        setCurrentPage((prev) =>
                                                            Math.max(
                                                                1,
                                                                prev - 1
                                                            )
                                                        )
                                                    }
                                                    disabled={currentPage === 1}
                                                >
                                                    {t("Oldingi", "Предыдущая")}
                                                </Button>
                                                <div className="flex items-center gap-2">
                                                    {Array.from(
                                                        {
                                                            length: Math.min(
                                                                5,
                                                                totalPages
                                                            ),
                                                        },
                                                        (_, i) => {
                                                            let pageNum;
                                                            if (
                                                                totalPages <= 5
                                                            ) {
                                                                pageNum = i + 1;
                                                            } else if (
                                                                currentPage <= 3
                                                            ) {
                                                                pageNum = i + 1;
                                                            } else if (
                                                                currentPage >=
                                                                totalPages - 2
                                                            ) {
                                                                pageNum =
                                                                    totalPages -
                                                                    4 +
                                                                    i;
                                                            } else {
                                                                pageNum =
                                                                    currentPage -
                                                                    2 +
                                                                    i;
                                                            }
                                                            return (
                                                                <Button
                                                                    key={i}
                                                                    type="button"
                                                                    variant={
                                                                        currentPage ===
                                                                        pageNum
                                                                            ? "default"
                                                                            : "outline"
                                                                    }
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        setCurrentPage(
                                                                            pageNum
                                                                        )
                                                                    }
                                                                    className="w-8 h-8 p-0"
                                                                >
                                                                    {pageNum}
                                                                </Button>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        setCurrentPage((prev) =>
                                                            Math.min(
                                                                totalPages,
                                                                prev + 1
                                                            )
                                                        )
                                                    }
                                                    disabled={
                                                        currentPage ===
                                                        totalPages
                                                    }
                                                >
                                                    {t("Keyingi", "Следующая")}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent
                        value="upload"
                        className="flex-1 flex flex-col overflow-hidden mt-4"
                    >
                        <div className="space-y-4">
                            {/* File Input */}
                            <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                <input
                                    type="file"
                                    id="media-file-upload"
                                    multiple={mode === "multiple"}
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="media-file-upload"
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
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    <p className="text-sm font-medium">
                                        {t(
                                            "Tanlangan fayllar",
                                            "Выбранные файлы"
                                        )}{" "}
                                        ({uploadFiles.length})
                                    </p>
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
                                                        {formatFileSize(
                                                            file.size
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 shrink-0"
                                                onClick={() =>
                                                    removeUploadFile(index)
                                                }
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Upload Button */}
                            <Button
                                onClick={handleUpload}
                                disabled={uploadFiles.length === 0 || uploading}
                                className="w-full gap-2"
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
                    </TabsContent>
                </Tabs>

                <DialogFooter>
                    <div className="flex items-center justify-between w-full">
                        <p className="text-sm text-muted-foreground">
                            {t(
                                `${selectedImages.length} ta tanlangan`,
                                `Выбрано ${selectedImages.length}`
                            )}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                {t("Bekor qilish", "Отмена")}
                            </Button>
                            <Button
                                onClick={handleConfirm}
                                disabled={selectedImages.length === 0}
                            >
                                {t("Tanlash", "Выбрать")}
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
