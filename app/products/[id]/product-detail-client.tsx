"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
    ShoppingCart,
    CheckCircle,
    Minus,
    Plus,
    Share2,
    Tag,
    Heart,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useCart } from "@/contexts/cart-context";
import { useFavorites } from "@/contexts/favorites-context";
import { formatPrice } from "@/lib/utils/format-price";
import { ProductCard } from "@/components/product-card";
import { toast } from "sonner";
import { S3Image } from "@/components/s3-image";

interface Product {
    id: string;
    nameUz: string;
    nameRu: string;
    descriptionUz?: string;
    descriptionRu?: string;
    shortDescriptionUz?: string;
    shortDescriptionRu?: string;
    price: number;
    oldPrice?: number;
    coverImage?: string;
    galleryImages?: string[];
    sku?: string;
    productCode?: string;
    inStock: boolean;
    isNew?: boolean;
    discount?: number;
    rating?: number;
    category?: {
        id: string;
        nameUz: string;
        nameRu: string;
    };
    brand?: {
        id: string;
        nameUz: string;
        nameRu: string;
    };
    specifications?: Array<{
        labelUz: string;
        labelRu: string;
        valueUz: string;
        valueRu?: string;
    }>;
}

interface ProductDetailClientProps {
    product: Product;
    relatedProducts: Product[];
}

export function ProductDetailClient({
    product,
    relatedProducts,
}: ProductDetailClientProps) {
    const { t, language } = useLanguage();
    const { addToCart } = useCart();
    const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    // Get product images - combine coverImage and galleryImages
    const productImages = [
        ...(product.coverImage ? [product.coverImage] : []),
        ...(product.galleryImages || []),
    ];

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.nameUz,
            price: product.price.toString(),
            image: product.coverImage || "",
        });
        toast.success(t("Savatga qo'shildi", "Добавлено в корзину"));
    };

    const handleToggleFavorite = () => {
        if (isFavorite(product.id)) {
            removeFromFavorites(product.id);
            toast.success(
                t("Sevimlilardan o'chirildi", "Удалено из избранного")
            );
        } else {
            addToFavorites({
                id: product.id,
                name: product.nameUz,
                price: product.price.toString(),
                image: product.coverImage || "",
            });
            toast.success(t("Sevimlilarga qo'shildi", "Добавлено в избранное"));
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: productName,
                    url: window.location.href,
                });
            } catch {
                // User cancelled
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success(t("Havola nusxalandi", "Ссылка скопирована"));
        }
    };

    const productName = language === "en" ? product.nameUz : product.nameRu;
    const shortDescription =
        language === "en"
            ? product.shortDescriptionUz
            : product.shortDescriptionRu;
    const productDescription =
        language === "en" ? product.descriptionUz : product.descriptionRu;
    const categoryName = product.category
        ? language === "en"
            ? product.category.nameUz
            : product.category.nameRu
        : "";
    const brandName = product.brand
        ? language === "en"
            ? product.brand.nameUz
            : product.brand.nameRu
        : "";

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav
                    aria-label="Breadcrumb"
                    className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
                >
                    <Link href="/" className="hover:text-primary">
                        {t("Bosh sahifa", "Главная")}
                    </Link>
                    <span>/</span>
                    <Link href="/catalog" className="hover:text-primary">
                        {t("Katalog", "Каталог")}
                    </Link>
                    {categoryName && (
                        <>
                            <span>/</span>
                            <span>{categoryName}</span>
                        </>
                    )}
                </nav>

                {/* Product Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Product Images */}
                    <div className="space-y-4">
                        {/* Main Image with Navigation */}
                        <div className="relative aspect-square bg-accent rounded-lg overflow-hidden group">
                            {productImages.length > 0 ? (
                                <>
                                    <S3Image
                                        key={`main-${selectedImage}-${productImages[selectedImage]}`}
                                        src={productImages[selectedImage]}
                                        alt={productName}
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                    {/* Indicator Dots */}
                                    {productImages.length > 1 && (
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                            {productImages.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() =>
                                                        setSelectedImage(index)
                                                    }
                                                    className={`h-2 rounded-full transition-all ${
                                                        index === selectedImage
                                                            ? "w-8 bg-primary"
                                                            : "w-2 bg-white/60 hover:bg-white/80"
                                                    }`}
                                                    aria-label={`${
                                                        index + 1
                                                    }-rasm`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Tag className="h-24 w-24 text-muted-foreground" />
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {productImages.length > 1 && (
                            <div className="grid grid-cols-5 gap-2">
                                {productImages.map(
                                    (image: string, index: number) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setSelectedImage(index)
                                            }
                                            className={`relative aspect-square bg-accent rounded-lg overflow-hidden border-2 transition-all ${
                                                selectedImage === index
                                                    ? "border-primary ring-2 ring-primary/20"
                                                    : "border-transparent hover:border-primary/50"
                                            }`}
                                        >
                                            <S3Image
                                                src={image}
                                                alt={`${productName} ${
                                                    index + 1
                                                }`}
                                                fill
                                                className="object-contain"
                                            />
                                        </button>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {/* Title */}
                        <div>
                            <h1 className="text-3xl font-black mb-2">
                                {productName}
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                {product.sku && <span>SKU: {product.sku}</span>}
                                {product.productCode && (
                                    <span>Kod: {product.productCode}</span>
                                )}
                            </div>
                        </div>

                        {/* Category & Brand */}
                        <div className="flex items-center gap-4">
                            {categoryName && (
                                <div className="text-sm">
                                    <span className="text-muted-foreground">
                                        {t("Kategoriya:", "Категория:")}
                                    </span>{" "}
                                    <span className="font-medium">
                                        {categoryName}
                                    </span>
                                </div>
                            )}
                            {brandName && (
                                <div className="text-sm">
                                    <span className="text-muted-foreground">
                                        {t("Brend:", "Бренд:")}
                                    </span>{" "}
                                    <span className="font-medium">
                                        {brandName}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-black text-primary">
                                    {formatPrice(product.price)}{" "}
                                    {t("so'm", "сум")}
                                </span>
                                {product.oldPrice &&
                                    product.oldPrice > product.price && (
                                        <span className="text-xl text-muted-foreground line-through">
                                            {formatPrice(product.oldPrice)}{" "}
                                            {t("so'm", "сум")}
                                        </span>
                                    )}
                            </div>
                            {product.discount && product.discount > 0 && (
                                <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-sm font-medium">
                                    <Tag className="h-4 w-4" />-
                                    {product.discount}%{" "}
                                    {t("chegirma", "скидка")}
                                </div>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div className="flex items-center gap-2">
                            {product.inStock ? (
                                <>
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span className="text-green-500 font-medium">
                                        {t("Omborda bor", "В наличии")}
                                    </span>
                                </>
                            ) : (
                                <span className="text-red-500 font-medium">
                                    {t("Omborda yo'q", "Нет в наличии")}
                                </span>
                            )}
                        </div>

                        {/* Short Description */}
                        {shortDescription && (
                            <div className="bg-accent/50 rounded-lg p-4">
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {shortDescription}
                                </p>
                            </div>
                        )}

                        {/* Quantity & Add to Cart */}
                        {product.inStock && (
                            <Card>
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <span className="font-medium">
                                            {t("Miqdor:", "Количество:")}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                    setQuantity(
                                                        Math.max(
                                                            1,
                                                            quantity - 1
                                                        )
                                                    )
                                                }
                                                disabled={quantity <= 1}
                                                aria-label="Kamaytirish"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <Input
                                                type="number"
                                                value={quantity}
                                                onChange={(e) =>
                                                    setQuantity(
                                                        Math.max(
                                                            1,
                                                            parseInt(
                                                                e.target.value
                                                            ) || 1
                                                        )
                                                    )
                                                }
                                                className="w-20 text-center"
                                                min="1"
                                                max="999"
                                                aria-label="Miqdor"
                                            />
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                    setQuantity(quantity + 1)
                                                }
                                                aria-label="Ko'paytirish"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button
                                            onClick={handleAddToCart}
                                            className="flex-1 bg-primary hover:bg-primary/90 text-white h-12"
                                        >
                                            <ShoppingCart className="h-5 w-5 mr-2" />
                                            {t(
                                                "Savatga qo'shish",
                                                "Добавить в корзину"
                                            )}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={handleToggleFavorite}
                                            className="h-12 w-12"
                                            aria-label={
                                                isFavorite(product.id)
                                                    ? "Sevimlilardan o'chirish"
                                                    : "Sevimlilarga qo'shish"
                                            }
                                        >
                                            <Heart
                                                className={`h-5 w-5 ${
                                                    isFavorite(product.id)
                                                        ? "fill-red-500 text-red-500"
                                                        : ""
                                                }`}
                                            />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-12 w-12"
                                            onClick={handleShare}
                                            aria-label="Ulashish"
                                        >
                                            <Share2 className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Description and Specifications Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Description */}
                    {productDescription && (
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-black mb-6">
                                    {t("Tavsif", "Описание")}
                                </h2>
                                <div className="prose prose-sm max-w-none">
                                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                        {productDescription}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Specifications */}
                    {product.specifications &&
                        product.specifications.length > 0 && (
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="text-2xl font-black mb-6">
                                        {t(
                                            "Texnik xususiyatlar",
                                            "Технические характеристики"
                                        )}
                                    </h2>
                                    <div className="space-y-3">
                                        {product.specifications.map(
                                            (spec, index) => (
                                                <div
                                                    key={index}
                                                    className="flex justify-between items-center p-4 bg-accent/50 rounded-lg"
                                                >
                                                    <span className="font-medium">
                                                        {language === "en"
                                                            ? spec.labelUz
                                                            : spec.labelRu}
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                        {language === "en"
                                                            ? spec.valueUz
                                                            : spec.valueRu ||
                                                              spec.valueUz}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section aria-labelledby="related-products">
                        <h2
                            id="related-products"
                            className="text-2xl font-black mb-6"
                        >
                            {t("O'xshash mahsulotlar", "Похожие товары")}
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <ProductCard
                                    key={relatedProduct.id}
                                    id={relatedProduct.id}
                                    name={
                                        language === "en"
                                            ? relatedProduct.nameUz
                                            : relatedProduct.nameRu
                                    }
                                    price={relatedProduct.price.toString()}
                                    oldPrice={relatedProduct.oldPrice?.toString()}
                                    image={relatedProduct.coverImage || ""}
                                    rating={relatedProduct.rating}
                                    isNew={relatedProduct.isNew}
                                    discount={
                                        relatedProduct.discount
                                            ? `${relatedProduct.discount}%`
                                            : undefined
                                    }
                                    productCode={relatedProduct.productCode}
                                    inStock={relatedProduct.inStock}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
}
