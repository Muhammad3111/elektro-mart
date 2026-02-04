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
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MediaGalleryModal } from "@/components/admin/media-gallery-modal";
import { SpecificationsManager } from "@/components/admin/specifications-manager";
import { ArrowLeft, Save, Image as ImageIcon, X } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { productsAPI, categoriesAPI, brandsAPI, checkAPI } from "@/lib/api";
import { toast } from "sonner";
import type { Category } from "@/types/category";
import type { Brand } from "@/types/brand";
import type { CreateProductDto } from "@/types/product";
import { getImageUrl } from "@/lib/s3/get-image-url";

interface ProductFormProps {
    productId?: string;
}

export function ProductForm({ productId }: ProductFormProps) {
    const { t } = useLanguage();
    const router = useRouter();
    const isEditMode = !!productId;

    const [formData, setFormData] = useState<CreateProductDto>({
        sku: "",
        productCode: "",
        nameEn: "",
        nameRu: "",
        shortDescriptionEn: "",
        shortDescriptionRu: "",
        descriptionEn: "",
        descriptionRu: "",
        price: 0,
        oldPrice: undefined,
        discount: undefined,
        coverImage: "",
        galleryImages: [],
        categoryId: "",
        subcategoryId: "",
        brandId: "",
        isActive: true,
        isFeatured: false,
        isNew: false,
        stockQuantity: 0,
        order: 0,
        metaTitle: "",
        metaDescription: "",
        keywords: [],
        specifications: [],
    });

    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [coverImageModalOpen, setCoverImageModalOpen] = useState(false);
    const [galleryModalOpen, setGalleryModalOpen] = useState(false);
    const [keywordInput, setKeywordInput] = useState("");
    const [usdPrice, setUsdPrice] = useState("");
    const [coverImageUrl, setCoverImageUrl] = useState("");
    const [galleryImageUrls, setGalleryImageUrls] = useState<string[]>([]);
    const [exchangeRate, setExchangeRate] = useState(12500);

    // Check exists states
    const [skuChecking, setSkuChecking] = useState(false);
    const [skuExists, setSkuExists] = useState<boolean | null>(null);
    const [skuCheckTimeout, setSkuCheckTimeout] =
        useState<NodeJS.Timeout | null>(null);
    const [originalSku, setOriginalSku] = useState<string>("");

    const loadProduct = useCallback(
        async (id: string) => {
            try {
                setLoading(true);
                const product = await productsAPI.getById(id);

                setFormData({
                    sku: product.sku,
                    productCode: product.productCode,
                    nameEn: product.nameEn,
                    nameRu: product.nameRu,
                    shortDescriptionEn: product.shortDescriptionEn || "",
                    shortDescriptionRu: product.shortDescriptionRu || "",
                    descriptionEn: product.descriptionEn,
                    descriptionRu: product.descriptionRu,
                    price: product.price,
                    oldPrice: product.oldPrice,
                    discount: product.discount,
                    coverImage: product.coverImage || "",
                    galleryImages: product.galleryImages || [],
                    categoryId: product.categoryId,
                    subcategoryId: product.subcategoryId || "",
                    brandId: product.brandId || "",
                    isActive: product.isActive,
                    isFeatured: product.isFeatured,
                    isNew: product.isNew,
                    stockQuantity: product.stockQuantity,
                    order: product.order,
                    metaTitle: product.metaTitle || "",
                    metaDescription: product.metaDescription || "",
                    keywords: product.keywords || [],
                    specifications:
                        product.specifications?.map((spec) => ({
                            labelEn: spec.labelEn,
                            labelRu: spec.labelRu,
                            valueEn: spec.valueEn,
                            valueRu: spec.valueRu,
                            order: spec.order,
                        })) || [],
                });

                // Save original SKU for edit mode
                setOriginalSku(product.sku);

                // Load image URLs for display
                if (product.coverImage) {
                    getImageUrl(product.coverImage).then(setCoverImageUrl);
                }
                if (product.galleryImages && product.galleryImages.length > 0) {
                    Promise.all(
                        product.galleryImages.map((key) => getImageUrl(key)),
                    ).then(setGalleryImageUrls);
                }
            } catch (error) {
                console.error("Error loading product:", error);
                toast.error(
                    t(
                        "Mahsulotni yuklashda xatolik",
                        "Ошибка при загрузке товара",
                    ),
                );
                router.push("/admin/products");
            } finally {
                setLoading(false);
            }
        },
        [t, router],
    );

    useEffect(() => {
        loadCategories();
        loadBrands();
        if (isEditMode && productId) {
            loadProduct(productId);
        }
    }, [isEditMode, productId, loadProduct]);

    useEffect(() => {
        if (formData.categoryId) {
            loadSubcategories(formData.categoryId);
        } else {
            setSubcategories([]);
            setFormData((prev) => ({ ...prev, subcategoryId: "" }));
        }
    }, [formData.categoryId]);

    const loadCategories = async () => {
        try {
            const result = await categoriesAPI.getAll();
            setCategories(result.filter((cat: Category) => !cat.parentId));
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    };

    const loadSubcategories = async (parentId: string) => {
        try {
            const result = await categoriesAPI.getAll();
            setSubcategories(
                result.filter((cat: Category) => cat.parentId === parentId),
            );
        } catch (error) {
            console.error("Error loading subcategories:", error);
        }
    };

    const loadBrands = async () => {
        try {
            const result = await brandsAPI.getAll();
            setBrands(result);
        } catch (error) {
            console.error("Error loading brands:", error);
        }
    };

    // SKU mavjudligini tekshirish
    const checkSkuExists = useCallback(
        async (sku: string) => {
            // Edit modeda original SKU bilan bir xil bo'lsa tekshirmaymiz
            if (isEditMode && sku === originalSku) {
                setSkuExists(null);
                return;
            }

            if (!sku || sku.length < 2) {
                setSkuExists(null);
                return;
            }

            // Clear previous timeout
            if (skuCheckTimeout) {
                clearTimeout(skuCheckTimeout);
            }

            setSkuChecking(true);

            const timeout = setTimeout(async () => {
                try {
                    const result = await checkAPI.product.sku(sku);
                    setSkuExists(result.exists);
                } catch (error) {
                    console.error("SKU check error:", error);
                    setSkuExists(null);
                } finally {
                    setSkuChecking(false);
                }
            }, 500);

            setSkuCheckTimeout(timeout);
        },
        [isEditMode, originalSku, skuCheckTimeout],
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.sku) {
            toast.error(t("SKU ni kiriting", "Введите SKU"));
            return;
        }

        if (!formData.productCode) {
            toast.error(t("Mahsulot kodini kiriting", "Введите код товара"));
            return;
        }

        if (!formData.nameEn || !formData.nameRu) {
            toast.error(
                t("Mahsulot nomini kiriting", "Введите название товара"),
            );
            return;
        }

        if (!formData.descriptionEn || !formData.descriptionRu) {
            toast.error(
                t("Mahsulot tavsifini kiriting", "Введите описание товара"),
            );
            return;
        }

        if (!formData.categoryId) {
            toast.error(t("Kategoriyani tanlang", "Выберите категорию"));
            return;
        }

        setSubmitting(true);

        try {
            const payload: CreateProductDto = {
                ...formData,
                price: Number(formData.price),
                oldPrice: formData.oldPrice
                    ? Number(formData.oldPrice)
                    : undefined,
                discount: formData.discount
                    ? Number(formData.discount)
                    : undefined,
                stockQuantity: Number(formData.stockQuantity),
                order: Number(formData.order),
                subcategoryId: formData.subcategoryId || undefined,
                brandId: formData.brandId || undefined,
                shortDescriptionEn: formData.shortDescriptionEn || undefined,
                shortDescriptionRu: formData.shortDescriptionRu || undefined,
                metaTitle: formData.metaTitle || undefined,
                metaDescription: formData.metaDescription || undefined,
                keywords:
                    formData.keywords && formData.keywords.length > 0
                        ? formData.keywords
                        : undefined,
                coverImage: formData.coverImage || undefined,
                galleryImages:
                    formData.galleryImages && formData.galleryImages.length > 0
                        ? formData.galleryImages
                        : undefined,
                specifications:
                    formData.specifications &&
                    formData.specifications.length > 0
                        ? formData.specifications
                        : undefined,
            };

            if (isEditMode && productId) {
                await productsAPI.update(productId, payload);
                toast.success(t("Mahsulot yangilandi", "Товар обновлен"));
            } else {
                await productsAPI.create(payload);
                toast.success(t("Mahsulot qo'shildi", "Товар добавлен"));
            }
            router.push("/admin/products");
        } catch (error: unknown) {
            console.error("Error saving product:", error);
            const errorMessage =
                (error as any)?.response?.data?.message ||
                (error as any)?.message;
            toast.error(
                errorMessage || t("Xatolik yuz berdi", "Произошла ошибка"),
            );
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
                            onClick={() => router.push("/admin/products")}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-4xl font-black">
                                {isEditMode
                                    ? t(
                                          "Mahsulotni tahrirlash",
                                          "Редактировать товар",
                                      )
                                    : t(
                                          "Yangi mahsulot qo'shish",
                                          "Добавить новый товар",
                                      )}
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                {isEditMode
                                    ? t(
                                          "Mahsulot ma'lumotlarini yangilang",
                                          "Обновите информацию о товаре",
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
                        {/* SKU and Product Code */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="sku">
                                    {t("SKU", "SKU")}{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="sku"
                                    value={formData.sku}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setFormData({
                                            ...formData,
                                            sku: value,
                                        });
                                        checkSkuExists(value);
                                    }}
                                    placeholder={t(
                                        "Masalan: PROD-001",
                                        "Например: PROD-001",
                                    )}
                                    className={
                                        skuExists ? "border-red-500" : ""
                                    }
                                    required
                                />
                                {skuChecking && (
                                    <p className="text-xs text-muted-foreground">
                                        {t("Tekshirilmoqda...", "Проверка...")}
                                    </p>
                                )}
                                {skuExists && (
                                    <p className="text-xs text-red-500">
                                        {t(
                                            "Bu SKU serverda mavjud",
                                            "Этот SKU уже существует на сервере",
                                        )}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="productCode">
                                    {t("Mahsulot kodi", "Код товара")}{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="productCode"
                                    value={formData.productCode}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            productCode: e.target.value,
                                        })
                                    }
                                    placeholder={t(
                                        "Masalan: PC-001",
                                        "Например: PC-001",
                                    )}
                                    required
                                />
                            </div>
                        </div>

                        {/* Names */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nameEn">
                                    {t(
                                        "Name (English)",
                                        "Название (Английский)",
                                    )}{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="nameEn"
                                    value={formData.nameEn}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            nameEn: e.target.value,
                                        })
                                    }
                                    placeholder={t(
                                        "Mahsulot nomi",
                                        "Название товара",
                                    )}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nameRu">
                                    {t("Name (Russian)", "Название (Русский)")}{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="nameRu"
                                    value={formData.nameRu}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            nameRu: e.target.value,
                                        })
                                    }
                                    placeholder={t(
                                        "Название товара",
                                        "Название товара",
                                    )}
                                    required
                                />
                            </div>
                        </div>

                        {/* Descriptions - Rich Text - Side by Side */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>
                                    {t(
                                        "Description (English)",
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
                            <div className="space-y-2">
                                <Label>
                                    {t(
                                        "Description (Russian)",
                                        "Описание (Русский)",
                                    )}{" "}
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
                        </div>

                        {/* Short Descriptions - Rich Text - Side by Side */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>
                                    {t(
                                        "Short Description (English)",
                                        "Краткое описание (Английский)",
                                    )}
                                </Label>
                                <RichTextEditor
                                    value={formData.shortDescriptionEn || ""}
                                    onChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            shortDescriptionEn: value,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>
                                    {t(
                                        "Short Description (Russian)",
                                        "Краткое описание (Русский)",
                                    )}
                                </Label>
                                <RichTextEditor
                                    value={formData.shortDescriptionRu || ""}
                                    onChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            shortDescriptionRu: value,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label>
                                {t("Kategoriya", "Категория")}{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.categoryId}
                                onValueChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        categoryId: value,
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={t(
                                            "Kategoriyani tanlang",
                                            "Выберите категорию",
                                        )}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.nameRu}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Subcategory */}
                        {subcategories.length > 0 && (
                            <div className="space-y-2">
                                <Label>
                                    {t("Sub-kategoriya", "Подкатегория")}
                                </Label>
                                <Select
                                    value={formData.subcategoryId}
                                    onValueChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            subcategoryId: value,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={t(
                                                "Tanlang",
                                                "Выберите",
                                            )}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subcategories.map((cat) => (
                                            <SelectItem
                                                key={cat.id}
                                                value={cat.id}
                                            >
                                                {cat.nameRu}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Brand */}
                        <div className="space-y-2">
                            <Label>{t("Brend", "Бренд")}</Label>
                            <Select
                                value={formData.brandId}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, brandId: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={t("Tanlang", "Выберите")}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {brands.map((brand) => (
                                        <SelectItem
                                            key={brand.id}
                                            value={brand.id}
                                        >
                                            {brand.nameRu}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Pricing Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {t("Narx va chegirma", "Цена и скидка")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* USD to UZS Converter */}
                        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                            <div className="space-y-2">
                                <Label htmlFor="usdPrice">
                                    {t("USD da narx", "Цена в USD")}
                                </Label>
                                <Input
                                    id="usdPrice"
                                    type="number"
                                    value={usdPrice}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setUsdPrice(value);
                                        if (value) {
                                            const uzsValue = Math.round(
                                                Number(value) * exchangeRate,
                                            );
                                            setFormData({
                                                ...formData,
                                                price: uzsValue,
                                            });
                                        }
                                    }}
                                    placeholder="100"
                                    min="0"
                                    step="0.01"
                                />
                                <p className="text-xs text-muted-foreground">
                                    {t(
                                        "USD da kiritish uchun",
                                        "Для ввода в USD",
                                    )}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="exchangeRate">
                                    {t(
                                        "Kurs (1 USD = ? UZS)",
                                        "Курс (1 USD = ? UZS)",
                                    )}
                                </Label>
                                <Input
                                    id="exchangeRate"
                                    type="number"
                                    value={exchangeRate}
                                    onChange={(e) => {
                                        const newRate = Number(e.target.value);
                                        setExchangeRate(newRate);
                                        if (usdPrice) {
                                            const uzsValue = Math.round(
                                                Number(usdPrice) * newRate,
                                            );
                                            setFormData({
                                                ...formData,
                                                price: uzsValue,
                                            });
                                        }
                                    }}
                                    placeholder="12500"
                                    min="0"
                                />
                                <p className="text-xs text-muted-foreground">
                                    {t("Joriy kurs", "Текущий курс")}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">
                                    {t("Narx (UZS)", "Цена (UZS)")}
                                </Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            price: Number(e.target.value),
                                        });
                                        setUsdPrice(""); // Clear USD when manually editing UZS
                                    }}
                                    placeholder="0"
                                    required
                                    min="0"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="oldPrice">
                                    {t("Eski narx", "Старая цена")}
                                </Label>
                                <Input
                                    id="oldPrice"
                                    type="number"
                                    value={formData.oldPrice || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            oldPrice: e.target.value
                                                ? Number(e.target.value)
                                                : undefined,
                                        })
                                    }
                                    placeholder="0"
                                    min="0"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="discount">
                                    {t("Chegirma (%)", "Скидка (%)")}
                                </Label>
                                <Input
                                    id="discount"
                                    type="number"
                                    value={formData.discount || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            discount: e.target.value
                                                ? Number(e.target.value)
                                                : undefined,
                                        })
                                    }
                                    placeholder="0"
                                    min="0"
                                    max="100"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stockQuantity">
                                    {t("Ombor", "Склад")}
                                </Label>
                                <Input
                                    id="stockQuantity"
                                    type="number"
                                    value={formData.stockQuantity || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            stockQuantity: e.target.value
                                                ? Number(e.target.value)
                                                : undefined,
                                        })
                                    }
                                    placeholder="0"
                                    min="0"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Media Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t("Rasmlar", "Изображения")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>{t("Cover rasm", "Обложка")}</Label>
                            {formData.coverImage ? (
                                <div className="relative group w-full max-w-md">
                                    <div className="relative aspect-video overflow-hidden rounded-lg border">
                                        <img
                                            src={
                                                coverImageUrl ||
                                                formData.coverImage
                                            }
                                            alt="Cover"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                onClick={() =>
                                                    setCoverImageModalOpen(true)
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
                                                        coverImage: "",
                                                    });
                                                    setCoverImageUrl("");
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
                                    onClick={() => setCoverImageModalOpen(true)}
                                >
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                        <ImageIcon className="h-12 w-12" />
                                        <p className="text-sm font-medium">
                                            {t(
                                                "Cover rasm tanlash",
                                                "Выбрать обложку",
                                            )}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <Label>
                                {t(
                                    "Gallery rasmlar (3-10 ta)",
                                    "Изображения галереи (3-10)",
                                )}
                            </Label>
                            <div className="grid grid-cols-5 gap-4">
                                {formData.galleryImages?.map((key, index) => (
                                    <div key={index} className="relative group">
                                        <div className="aspect-square rounded-lg overflow-hidden border">
                                            <img
                                                src={
                                                    galleryImageUrls[index] ||
                                                    key
                                                }
                                                alt={`Gallery ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() =>
                                                setFormData({
                                                    ...formData,
                                                    galleryImages:
                                                        formData.galleryImages?.filter(
                                                            (_, i) =>
                                                                i !== index,
                                                        ) || [],
                                                })
                                            }
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                                {(!formData.galleryImages ||
                                    formData.galleryImages.length < 10) && (
                                    <div
                                        className="aspect-square rounded-lg border-2 border-dashed hover:border-primary transition-colors cursor-pointer flex items-center justify-center"
                                        onClick={() =>
                                            setGalleryModalOpen(true)
                                        }
                                    >
                                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Specifications Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {t(
                                "Texnik xususiyatlar",
                                "Технические характеристики",
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SpecificationsManager
                            specifications={formData.specifications || []}
                            onChange={(specs) =>
                                setFormData({
                                    ...formData,
                                    specifications: specs,
                                })
                            }
                            disabled={submitting}
                        />
                    </CardContent>
                </Card>

                {/* SEO Card */}
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
                        <div className="space-y-2">
                            <Label>{t("Keywords", "Ключевые слова")}</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={keywordInput}
                                    onChange={(e) =>
                                        setKeywordInput(e.target.value)
                                    }
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            if (keywordInput.trim()) {
                                                setFormData({
                                                    ...formData,
                                                    keywords: [
                                                        ...(formData.keywords ||
                                                            []),
                                                        keywordInput.trim(),
                                                    ],
                                                });
                                                setKeywordInput("");
                                            }
                                        }
                                    }}
                                    placeholder={t(
                                        "Keyword kiriting",
                                        "Введите ключевое слово",
                                    )}
                                />
                                <Button
                                    type="button"
                                    onClick={() => {
                                        if (keywordInput.trim()) {
                                            setFormData({
                                                ...formData,
                                                keywords: [
                                                    ...(formData.keywords ||
                                                        []),
                                                    keywordInput.trim(),
                                                ],
                                            });
                                            setKeywordInput("");
                                        }
                                    }}
                                >
                                    {t("Qo'shish", "Добавить")}
                                </Button>
                            </div>
                            {formData.keywords &&
                                formData.keywords.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.keywords.map(
                                            (keyword, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="secondary"
                                                    className="gap-1"
                                                >
                                                    {keyword}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setFormData({
                                                                ...formData,
                                                                keywords:
                                                                    formData.keywords?.filter(
                                                                        (
                                                                            _,
                                                                            i,
                                                                        ) =>
                                                                            i !==
                                                                            index,
                                                                    ) || [],
                                                            })
                                                        }
                                                        className="ml-1 hover:text-destructive"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ),
                                        )}
                                    </div>
                                )}
                        </div>
                    </CardContent>
                </Card>

                {/* Status Card */}
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
                                    "Featured (Tavsiya etilgan)",
                                    "Featured (Рекомендуем)",
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
                        <div className="flex items-center justify-between">
                            <Label htmlFor="isNew">
                                {t("Yangi mahsulot", "Новинка")}
                            </Label>
                            <Switch
                                id="isNew"
                                checked={formData.isNew}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, isNew: checked })
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Additional Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {t("Qo'shimcha", "Дополнительно")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
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
                        onClick={() => router.push("/admin/products")}
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

            {/* Media Modals */}
            <MediaGalleryModal
                open={coverImageModalOpen}
                onOpenChange={setCoverImageModalOpen}
                onSelect={(keys) => {
                    if (keys.length > 0) {
                        setFormData({ ...formData, coverImage: keys[0] });
                        // Generate URL for display
                        getImageUrl(keys[0]).then(setCoverImageUrl);
                    }
                }}
                mode="single"
                selectedUrls={formData.coverImage ? [formData.coverImage] : []}
            />
            <MediaGalleryModal
                open={galleryModalOpen}
                onOpenChange={setGalleryModalOpen}
                onSelect={(keys) => {
                    setFormData({ ...formData, galleryImages: keys });
                    // Generate URLs for display
                    Promise.all(keys.map((key) => getImageUrl(key))).then(
                        setGalleryImageUrls,
                    );
                }}
                mode="multiple"
                selectedUrls={formData.galleryImages || []}
            />
        </AdminLayout>
    );
}
