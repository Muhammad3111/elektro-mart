"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, ImageIcon, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useCart } from "@/contexts/cart-context";
import { useFavorites } from "@/contexts/favorites-context";
import { S3Image } from "@/components/s3-image";
import { formatPrice } from "@/lib/utils/format-price";

interface ProductCardProps {
    id: number | string;
    name: string;
    price: string;
    oldPrice?: string;
    image: string;
    description?: string;
    rating?: number;
    isNew?: boolean;
    discount?: string;
    productCode?: string;
    inStock?: boolean;
}

export function ProductCard({
    id,
    name,
    price,
    oldPrice,
    image,
    description,
    rating,
    isNew = false,
    discount,
    productCode,
    inStock = true,
}: ProductCardProps) {
    const { t } = useLanguage();
    const { addToCart } = useCart();
    const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

    const isInFavorites = isFavorite(id);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addToCart({
            id,
            name,
            price,
            image,
        });
    };

    return (
        <Link href={`/products/${id}`} className="cursor-pointer block">
            <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:shadow-primary/50 py-0 flex flex-col h-full border-0 gap-0">
                <div className="relative aspect-square overflow-hidden shrink-0">
                    {/* Badges - Always Visible */}
                    <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
                        {isNew && (
                            <Badge className="bg-primary text-white">
                                {t("Yangi", "Новый")}
                            </Badge>
                        )}
                        {discount && (
                            <Badge className="bg-red-500 text-white">
                                -{discount}
                            </Badge>
                        )}
                    </div>

                    {/* Favorite Icon - Always visible on mobile, visible on hover on desktop */}
                    <div className="absolute top-2 right-2 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                            size="icon"
                            variant="secondary"
                            className="h-9 w-9 rounded-full bg-white/90 hover:bg-primary hover:text-white shadow-md"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (isInFavorites) {
                                    removeFromFavorites(id);
                                } else {
                                    addToFavorites({
                                        id,
                                        name,
                                        price,
                                        image,
                                        description,
                                    });
                                }
                            }}
                        >
                            <Heart
                                className={`h-4 w-4 ${
                                    isInFavorites
                                        ? "fill-current text-red-500"
                                        : ""
                                }`}
                            />
                        </Button>
                    </div>

                    {/* Quick View Text - Center on hover (desktop only) */}
                    <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="bg-white/95 px-6 py-3 rounded-lg shadow-lg">
                            <span className="text-sm font-semibold text-gray-800">
                                {t("Tez ko'rish", "Быстрый просмотр")}
                            </span>
                        </div>
                    </div>

                    {/* Product Image */}
                    {!image ? (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                            <ImageIcon className="w-16 h-16 text-muted-foreground/50" />
                        </div>
                    ) : (
                        <S3Image
                            src={image}
                            alt={name}
                            fill
                            className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                            fallback="/placeholder.png"
                        />
                    )}
                </div>

                <CardContent className="p-3 flex flex-col flex-1">
                    {/* Top section - grows to fill space */}
                    <div className="space-y-2 flex-1">
                        {/* Product Code and Stock Status */}
                        <div className="flex items-center justify-between gap-2 text-[10px] md:text-xs">
                            {productCode && (
                                <span className="text-muted-foreground font-medium">
                                    {t("Kod", "Код")}: {productCode}
                                </span>
                            )}
                            {inStock ? (
                                <div className="flex items-center gap-1 text-green-600">
                                    <CheckCircle className="h-3 w-3" />
                                    <span className="font-medium">
                                        {t("Bor", "В наличии")}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-red-500 font-medium">
                                    {t("Yo'q", "Нет")}
                                </span>
                            )}
                        </div>

                        {/* Product Name - 1 line */}
                        <h3 className="font-bold text-xs md:text-sm line-clamp-1 group-hover:text-primary transition-colors">
                            {name}
                        </h3>

                        {/* Description - 2 lines with ellipsis */}
                        <p className="text-[10px] md:text-xs text-muted-foreground line-clamp-2 min-h-10 md:min-h-12">
                            {description ||
                                t(
                                    "Mahsulot tavsifi mavjud emas",
                                    "Описание товара недоступно"
                                )}
                        </p>
                    </div>

                    {/* Bottom section - always at bottom */}
                    <div className="flex items-end justify-between gap-2 pt-2 mt-auto">
                        {/* Left side: Prices */}
                        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                            {oldPrice && (
                                <span className="text-[10px] md:text-xs text-muted-foreground line-through whitespace-nowrap">
                                    {formatPrice(oldPrice)} UZS
                                </span>
                            )}
                            <div className="flex items-baseline gap-1 flex-wrap">
                                <span className="text-base md:text-lg font-bold text-primary">
                                    {formatPrice(price)}
                                </span>
                                <span className="text-xs md:text-sm font-bold text-primary whitespace-nowrap">
                                    UZS
                                </span>
                            </div>
                        </div>

                        {/* Right side: Cart Icon Button */}
                        <Button
                            size="icon"
                            className="bg-primary hover:bg-primary/90 text-white shadow-md group-hover:shadow-lg transition-shadow h-9 w-9 md:h-10 md:w-10 shrink-0"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleAddToCart(e);
                            }}
                        >
                            <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
