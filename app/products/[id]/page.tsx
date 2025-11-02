"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
import useEmblaCarousel from "embla-carousel-react";
import { useParams } from "next/navigation";
import { productsAPI } from "@/lib/api";
import { Product } from "@/types/product";
import { toast } from "sonner";
import { S3Image } from "@/components/s3-image";

export default function ProductDetailPage() {
    const params = useParams();
    const productId = params.id as string;
    const { t, language } = useLanguage();
    const { addToCart } = useCart();
    const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
    
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [emblaRef] = useEmblaCarousel({
        loop: false,
        align: "start",
    });
    const [galleryRef] = useEmblaCarousel({
        loop: true,
        align: "center",
        containScroll: "trimSnaps",
    });

    useEffect(() => {
        if (productId) {
            loadProduct();
        }
    }, [productId]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const data = await productsAPI.getById(productId);
            setProduct(data);
            
            // Load related products from same category
            if (data.categoryId) {
                const related = await productsAPI.getAll({
                    categoryId: data.categoryId,
                    limit: 8,
                    isActive: true,
                });
                setRelatedProducts(related.data.filter(p => p.id !== productId).slice(0, 4));
            }
        } catch (err) {
            console.error("Failed to load product:", err);
            toast.error(t("Mahsulot yuklanmadi", "Не удалось загрузить товар"));
        } finally {
            setLoading(false);
        }
    };

    // Get product images - only use coverImage since images array doesn't exist in Product type
    const productImages = product?.coverImage ? [product.coverImage] : [];

    const handleAddToCart = () => {
        if (product) {
            addToCart({
                id: product.id,
                name: product.nameUz,
                price: product.price.toString(),
                image: product.coverImage || "",
            });
            toast.success(t("Savatga qo'shildi", "Добавлено в корзину"));
        }
    };

    const handleToggleFavorite = () => {
        if (product) {
            if (isFavorite(product.id)) {
                removeFromFavorites(product.id);
                toast.success(t("Sevimlilardan o'chirildi", "Удалено из избранного"));
            } else {
                addToFavorites({
                    id: product.id,
                    name: product.nameUz,
                    price: product.price.toString(),
                    image: product.coverImage || "",
                });
                toast.success(t("Sevimlilarga qo'shildi", "Добавлено в избранное"));
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        {/* Image Skeleton */}
                        <div className="space-y-4">
                            <Skeleton className="aspect-square w-full rounded-lg" />
                            <div className="grid grid-cols-4 gap-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <Skeleton key={i} className="aspect-square rounded-lg" />
                                ))}
                            </div>
                        </div>
                        
                        {/* Details Skeleton */}
                        <div className="space-y-6">
                            <Skeleton className="h-12 w-3/4" />
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 container mx-auto px-4 py-8">
                    <div className="text-center py-16">
                        <h1 className="text-2xl font-bold mb-4">
                            {t("Mahsulot topilmadi", "Товар не найден")}
                        </h1>
                        <Link href="/catalog">
                            <Button>{t("Katalogga qaytish", "Вернуться в каталог")}</Button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const productName = language === 'uz' ? product.nameUz : product.nameRu;
    const shortDescription = language === 'uz' ? product.shortDescriptionUz : product.shortDescriptionRu;
    const productDescription = language === 'uz' ? product.descriptionUz : product.descriptionRu;
    const categoryName = product.category ? (language === 'uz' ? product.category.nameUz : product.category.nameRu) : '';
    const brandName = product.brand ? (language === 'uz' ? product.brand.nameUz : product.brand.nameRu) : '';

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
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
                </div>

                {/* Product Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Product Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-square bg-accent rounded-lg overflow-hidden">
                            {productImages.length > 0 ? (
                                <S3Image
                                    src={productImages[selectedImage]}
                                    alt={productName}
                                    fill
                                    className="object-contain"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Tag className="h-24 w-24 text-muted-foreground" />
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {productImages.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {productImages.map((image: string, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`relative aspect-square bg-accent rounded-lg overflow-hidden border-2 transition-colors ${
                                            selectedImage === index
                                                ? "border-primary"
                                                : "border-transparent hover:border-primary/50"
                                        }`}
                                    >
                                        <S3Image
                                            src={image}
                                            alt={`${productName} ${index + 1}`}
                                            fill
                                            className="object-contain"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {/* Title */}
                        <div>
                            <h1 className="text-3xl font-black mb-2">{productName}</h1>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                {product.sku && (
                                    <span>SKU: {product.sku}</span>
                                )}
                                {product.productCode && (
                                    <span>Kod: {product.productCode}</span>
                                )}
                            </div>
                        </div>

                        {/* Category & Brand */}
                        <div className="flex items-center gap-4">
                            {categoryName && (
                                <div className="text-sm">
                                    <span className="text-muted-foreground">{t("Kategoriya:", "Категория:")}</span>{" "}
                                    <span className="font-medium">{categoryName}</span>
                                </div>
                            )}
                            {brandName && (
                                <div className="text-sm">
                                    <span className="text-muted-foreground">{t("Brend:", "Бренд:")}</span>{" "}
                                    <span className="font-medium">{brandName}</span>
                                </div>
                            )}
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-black text-primary">
                                    {formatPrice(product.price)} {t("so'm", "сум")}
                                </span>
                                {product.oldPrice && product.oldPrice > product.price && (
                                    <span className="text-xl text-muted-foreground line-through">
                                        {formatPrice(product.oldPrice)} {t("so'm", "сум")}
                                    </span>
                                )}
                            </div>
                            {product.discount && product.discount > 0 && (
                                <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-sm font-medium">
                                    <Tag className="h-4 w-4" />
                                    -{product.discount}% {t("chegirma", "скидка")}
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
                                <p className="text-sm text-muted-foreground leading-relaxed">{shortDescription}</p>
                            </div>
                        )}

                        {/* Quantity & Add to Cart */}
                        {product.inStock && (
                            <Card>
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <span className="font-medium">{t("Miqdor:", "Количество:")}</span>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                disabled={quantity <= 1}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <Input
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                                className="w-20 text-center"
                                                min="1"
                                                max="999"
                                            />
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => setQuantity(quantity + 1)}
                                                disabled={false}
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
                                            {t("Savatga qo'shish", "Добавить в корзину")}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={handleToggleFavorite}
                                            className="h-12 w-12"
                                        >
                                            <Heart
                                                className={`h-5 w-5 ${
                                                    isFavorite(product.id)
                                                        ? "fill-red-500 text-red-500"
                                                        : ""
                                                }`}
                                            />
                                        </Button>
                                        <Button variant="outline" size="icon" className="h-12 w-12">
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
                                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{productDescription}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Specifications */}
                    {product.specifications && product.specifications.length > 0 && (
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-black mb-6">
                                    {t("Texnik xususiyatlar", "Технические характеристики")}
                                </h2>
                                <div className="space-y-3">
                                    {product.specifications.map((spec, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center p-4 bg-accent/50 rounded-lg"
                                        >
                                            <span className="font-medium">
                                                {language === 'uz' ? spec.labelUz : spec.labelRu}
                                            </span>
                                            <span className="text-muted-foreground">
                                                {language === 'uz' ? spec.valueUz : (spec.valueRu || spec.valueUz)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-black mb-6">
                            {t("O'xshash mahsulotlar", "Похожие товары")}
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <ProductCard
                                    key={relatedProduct.id}
                                    id={relatedProduct.id}
                                    name={language === 'uz' ? relatedProduct.nameUz : relatedProduct.nameRu}
                                    price={relatedProduct.price.toString()}
                                    oldPrice={relatedProduct.oldPrice?.toString()}
                                    image={relatedProduct.coverImage || ""}
                                    rating={relatedProduct.rating}
                                    isNew={relatedProduct.isNew}
                                    discount={relatedProduct.discount ? `${relatedProduct.discount}%` : undefined}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
